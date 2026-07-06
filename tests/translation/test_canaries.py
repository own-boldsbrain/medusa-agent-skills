import pytest
import sys
from pathlib import Path
import tempfile

scripts_dir = Path(__file__).parent.parent.parent / "scripts" / "translation"
sys.path.append(str(scripts_dir))

from ast_validator import validate_translation
from token_finops import TokenFinOps

def write_temp_files(en_text, pt_text):
    en_file = tempfile.NamedTemporaryFile(delete=False, suffix=".md", mode="w", encoding="utf-8")
    en_file.write(en_text)
    en_file.close()
    
    pt_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pt-br.md", mode="w", encoding="utf-8")
    pt_file.write(pt_text)
    pt_file.close()
    
    return en_file.name, pt_file.name

def test_detects_truncated_target():
    en = "Line 1\n" * 100
    pt = "Apenas uma linha\n"
    en_f, pt_f = write_temp_files(en, pt)
    
    report = validate_translation(en_f, pt_f)
    issue_types = [i.type for i in report.issues]
    assert "truncated_target" in issue_types or "low_line_ratio" in issue_types

def test_detects_codeblock_mismatch():
    en = "```python\nprint(1)\n```\n"
    pt = ""
    en_f, pt_f = write_temp_files(en, pt)
    
    report = validate_translation(en_f, pt_f)
    issue_types = [i.type for i in report.issues]
    assert "code_block_mismatch" in issue_types

def test_detects_broken_toc():
    en = "- [Link](#section-1)\n\n## Section 1\n"
    pt = "- [Link](#section-1)\n\n## Seção 1\n"
    en_f, pt_f = write_temp_files(en, pt)
    
    report = validate_translation(en_f, pt_f)
    issue_types = [i.type for i in report.issues]
    assert "toc_anchor_mismatch" in issue_types

def test_detects_collapsed_md():
    en = "**Title:**\n\n- Item 1\n"
    pt = "**Title:**- Item 1\n"
    en_f, pt_f = write_temp_files(en, pt)
    
    report = validate_translation(en_f, pt_f)
    issue_types = [i.type for i in report.issues]
    assert "markdown_violations" in issue_types

def test_detects_placeholder_leak():
    en = "Content"
    pt = "__CODE_BLOCK_1__"
    en_f, pt_f = write_temp_files(en, pt)
    
    report = validate_translation(en_f, pt_f)
    issue_types = [i.type for i in report.issues]
    assert "placeholder_leak_detected" in issue_types

def test_blocks_output_same_as_source_md():
    en = "Hello world this is a test of same source"
    pt = "Hello world this is a test of same source"
    en_f, pt_f = write_temp_files(en, pt)
    
    report = validate_translation(en_f, pt_f)
    issue_types = [i.type for i in report.issues]
    assert "source_contaminated" in issue_types

def test_fails_on_conversational_filler():
    en = "Content"
    pt = "Desculpe, não posso traduzir\n\nContent"
    en_f, pt_f = write_temp_files(en, pt)
    
    report = validate_translation(en_f, pt_f)
    issue_types = [i.type for i in report.issues]
    assert "conversational_filler_detected" in issue_types

def test_token_finops_blocks_zero_token_llm():
    finops = TokenFinOps()
    tokens = finops.estimate_file_tokens("hello", "olá")
    finops.record_zero_token_repair(tokens)
    assert finops.total_tokens_saved == tokens
    assert finops.total_tokens_spent == 0
