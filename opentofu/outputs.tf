output "api_url" {
  description = "API Gateway URL — set this as NEXT_PUBLIC_API_URL in Vercel"
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "memory_bucket" {
  description = "S3 bucket for conversation memory"
  value       = aws_s3_bucket.memory.bucket
}

output "lambda_function" {
  description = "Lambda function name"
  value       = aws_lambda_function.api.function_name
}
