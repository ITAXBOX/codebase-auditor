// lib/audit-types.ts
// Shared TypeScript types for the audit report.
// Mirror the JSON structure returned by POST /audit/start.

export type Severity = 'critical' | 'warning' | 'info';
export type IssueCategory =
  | 'reproducibility'
  | 'config'
  | 'testing'
  | 'security'
  | 'structure'
  | 'deps';
export type ComponentStatus = 'found' | 'partial' | 'missing';
export type Impact = 'high' | 'medium' | 'low';
export type Effort = 'low' | 'medium' | 'high';

export interface ArchComponent {
  component: string;
  status: ComponentStatus;
  description: string;
  key_files: string[];
}

export interface AuditIssue {
  severity: Severity;
  category: IssueCategory;
  title: string;
  detail: string;
  location: string;
}

export interface Recommendation {
  priority: number;
  title: string;
  detail: string;
  impact: Impact;
  effort: Effort;
}

export interface AuditStats {
  total_files: number;
  critical: number;
  warnings: number;
  info: number;
  recommendations: number;
}

export interface AuditReport {
  repo: string;
  score: string;
  score_rationale: string;
  summary: string;
  stats: AuditStats;
  architecture: ArchComponent[];
  issues: AuditIssue[];
  recommendations: Recommendation[];
}

// ── Chat message ────────────────────────────────────

export interface AuditMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}