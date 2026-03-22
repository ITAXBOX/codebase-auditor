from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import uuid
import json
from datetime import datetime

from audit_context import audit_system_prompt, audit_ingest_prompt


class FilePayload(BaseModel):
    path: str
    content: str

class AuditStartRequest(BaseModel):
    repo: str
    total_files: int
    file_tree: List[str]
    sampled_files: List[FilePayload]

class AuditStartResponse(BaseModel):
    session_id: str
    report: dict

class AuditChatRequest(BaseModel):
    message: str
    session_id: str

class AuditChatResponse(BaseModel):
    response: str
    session_id: str


def _build_ingest_user_message(req: AuditStartRequest) -> str:
    file_tree_str = "\n".join(req.file_tree)
    sampled_str = "\n".join(
        f"\n--- FILE: {f.path} ---\n{f.content}"
        for f in req.sampled_files
    )
    return audit_ingest_prompt(req.repo, file_tree_str, sampled_str, req.total_files)


def _call_bedrock_audit(bedrock_client, model_id, conversation: List[Dict],
                        user_message: str, is_first_turn: bool = False) -> str:
    messages = []
    messages.append({
        "role": "user",
        "content": [{"text": f"System: {audit_system_prompt()}"}]
    })
    for msg in conversation[-20:]:
        messages.append({
            "role": msg["role"],
            "content": [{"text": msg["content"]}]
        })
    messages.append({
        "role": "user",
        "content": [{"text": user_message}]
    })

    from botocore.exceptions import ClientError
    try:
        response = bedrock_client.converse(
            modelId=model_id,
            messages=messages,
            inferenceConfig={
                "maxTokens": 4000 if is_first_turn else 2000,
                "temperature": 0.3 if is_first_turn else 0.7,
                "topP": 0.9,
            },
        )
        return response["output"]["message"]["content"][0]["text"]

    except ClientError as e:
        code = e.response["Error"]["Code"]
        if code == "ValidationException":
            raise HTTPException(status_code=400, detail="Invalid message format for Bedrock")
        elif code == "AccessDeniedException":
            raise HTTPException(status_code=403, detail="Access denied to Bedrock model")
        else:
            raise HTTPException(status_code=500, detail=f"Bedrock error: {str(e)}")


def create_audit_router(bedrock_client, model_id: str, load_conv, save_conv):
    router = APIRouter(prefix="/audit", tags=["audit"])

    @router.post("/start", response_model=AuditStartResponse)
    async def audit_start(req: AuditStartRequest):
        session_id = str(uuid.uuid4())
        user_message = _build_ingest_user_message(req)

        raw_response = _call_bedrock_audit(
            bedrock_client, model_id,
            conversation=[],
            user_message=user_message,
            is_first_turn=True,
        )

        try:
            clean = raw_response.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
            report = json.loads(clean)
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=500,
                detail=f"LLM returned malformed JSON: {str(e)}. Raw: {raw_response[:300]}"
            )

        conversation = [
            {"role": "user", "content": user_message, "timestamp": datetime.now().isoformat()},
            {"role": "assistant", "content": raw_response, "timestamp": datetime.now().isoformat()},
        ]
        save_conv(session_id, conversation)
        print("REPORT KEYS:", list(report.keys()))
        print("ARCH SAMPLE:", report.get("architecture", [{}])[0] if report.get("architecture") else "MISSING")
        return AuditStartResponse(session_id=session_id, report=report)

    @router.post("/chat", response_model=AuditChatResponse)
    async def audit_chat(req: AuditChatRequest):
        conversation = load_conv(req.session_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Session not found. Run /audit/start first.")

        response_text = _call_bedrock_audit(
            bedrock_client, model_id,
            conversation=conversation,
            user_message=req.message,
            is_first_turn=False,
        )

        conversation.append({"role": "user", "content": req.message, "timestamp": datetime.now().isoformat()})
        conversation.append({"role": "assistant", "content": response_text, "timestamp": datetime.now().isoformat()})
        save_conv(req.session_id, conversation)

        return AuditChatResponse(response=response_text, session_id=req.session_id)

    @router.get("/session/{session_id}")
    async def get_audit_session(session_id: str):
        try:
            conversation = load_conv(session_id)
            return {"session_id": session_id, "messages": conversation}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    return router