from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Any

class Hit(BaseModel):
    category: str
    type: Optional[str] = None
    pattern: Optional[str] = None
    line: int
    match: Optional[str] = None
    excerpt: str

class ValidationIssue(BaseModel):
    severity: Literal["P0", "P1"]
    type: str
    message: str
    target_heading: Optional[str] = None
    link_text: Optional[str] = None
    hits: Optional[List[Hit]] = None

class ValidationMetrics(BaseModel):
    source_lines: int
    target_lines: int
    line_ratio: float
    source_words: int
    target_words: int
    source_chars: int
    target_chars: int
    source_code_blocks: int
    target_code_blocks: int
    source_headings: int
    target_headings: int
    source_lists: int
    target_lists: int
    source_tables: int
    target_tables: int
    source_callouts: int
    target_callouts: int
    source_frontmatter: bool
    target_frontmatter: bool
    toc_links: int
    broken_links: int
    english_residual_hits: int
    markdown_violations: int
    placeholder_leaks: int
    conversational_filler_hits: int
    semantic_drift_score: Optional[float] = None

class ValidationReport(BaseModel):
    source: str
    target: str
    status: Literal["passed", "needs_review", "failed", "error"]
    issues: List[ValidationIssue]
    metrics: ValidationMetrics
