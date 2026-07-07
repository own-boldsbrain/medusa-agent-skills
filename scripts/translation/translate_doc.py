import os
import re
import sys
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from rotator import TranslationEngine

def split_markdown_into_chunks(text):
    chunks = []
    current_chunk = []
    current_length = 0
    max_length = 500
    
    lines = text.splitlines(keepends=True)
    in_code_block = False
    
    for line in lines:
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            
        current_chunk.append(line)
        current_length += len(line)
        
        if not in_code_block and current_length >= max_length:
            chunks.append("".join(current_chunk))
            current_chunk = []
            current_length = 0
            
    if current_chunk:
        chunks.append("".join(current_chunk))
        
    return chunks

def protect_content(text):
    protected = {}
    
    # Protect code blocks
    code_blocks = re.findall(r'```.*?```', text, flags=re.DOTALL)
    for i, block in enumerate(code_blocks):
        key = f"<cb id=\"{i}\"/>"
        protected[key] = block
        text = text.replace(block, key)
        
    # Protect frontmatter
    frontmatter = re.search(r'^---\n.*?\n---', text, flags=re.DOTALL)
    if frontmatter:
        key = "<fm/>"
        protected[key] = frontmatter.group(0)
        text = text.replace(frontmatter.group(0), key)
        
    # Protect Markdown links explicitly [text](url)
    links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', text)
    for i, (link_text, url) in enumerate(links):
        if url.startswith('#'):
            continue
        url_key = f"<url id=\"{i}\"/>"
        protected[url_key] = url
        text = text.replace(f"]({url})", f"]({url_key})")
        
    # Protect GitHub Callouts
    callouts = re.findall(r'>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]', text)
    for i, callout in enumerate(callouts):
        key = f"<callout id=\"{i}\"/>"
        full_match = f"> [!{callout}]"
        protected[key] = full_match
        text = text.replace(full_match, key)
        
    return text, protected

def restore_content(text, protected):
    # Sort keys by length descending to prevent partial replacement
    for key in sorted(protected.keys(), key=len, reverse=True):
        text = text.replace(key, protected[key])
    return text

def _translate_chunk_task(engine, chunk, index):
    if not chunk.strip():
        return index, chunk
    
    chunk, protected = protect_content(chunk)
    
    try:
        translated = engine.translate(chunk)
        restored = restore_content(translated, protected)
        return index, restored
    except Exception as e:
        print(f"[ERROR] Worker failed on chunk {index}: {e}")
        raise e

def slugify(title):
    slug = title.lower().strip()
    accents = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','ã':'a','õ':'o','â':'a','ê':'e','î':'i','ô':'o','û':'u','ç':'c'}
    for k, v in accents.items():
        slug = slug.replace(k, v)
    slug = re.sub(r'[^\w\s\-]', '', slug)
    slug = slug.replace(' ', '-')
    slug = re.sub(r'-+', '-', slug)
    return slug

def fix_toc_anchors(text):
    h2_headings = re.findall(r'^##\s+(.+)$', text, flags=re.MULTILINE)
    h2_headings = [h for h in h2_headings if h.lower().strip() not in ['índice', 'indice', 'contents', 'conteúdo']]
    slugs = [slugify(h) for h in h2_headings]
    
    toc_pattern = re.compile(r'^(\s*-\s+\[([^\]]+)\]\()#([^\)]+)(\))', re.MULTILINE)
    
    def replace_anchor(match):
        prefix = match.group(1)
        link_text = match.group(2)
        old_anchor = match.group(3)
        suffix = match.group(4)
        
        link_words = set(slugify(link_text).split('-'))
        best_slug = None
        max_overlap = 0
        
        for h, slug in zip(h2_headings, slugs):
            h_words = set(slug.split('-'))
            overlap = len(link_words.intersection(h_words))
            if overlap > max_overlap:
                max_overlap = overlap
                best_slug = slug
                
        if best_slug and max_overlap > 0:
            return f'{prefix}#{best_slug}{suffix}'
        return match.group(0)
        
    return toc_pattern.sub(replace_anchor, text)

def translate_file(input_file, output_file, engine_name, max_workers=6, validate=False, stream_log=False):
    with open(input_file, 'r', encoding='utf-8') as f:
        text = f.read()
        
    engine = TranslationEngine(engine_name)
    chunks = split_markdown_into_chunks(text)
    
    results = [None] * len(chunks)
    
    if stream_log:
        print(f"[STREAM-LOG] Translating {input_file} in {len(chunks)} chunks with {max_workers} workers using {engine_name}...")
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(_translate_chunk_task, engine, chunk, i): i for i, chunk in enumerate(chunks)}
        
        for future in as_completed(futures):
            i = futures[future]
            try:
                index, translated_chunk = future.result()
                results[index] = translated_chunk
                if stream_log:
                    print(f"[STREAM-LOG] Progress: Chunk {index+1}/{len(chunks)} completed successfully.")
            except Exception as e:
                print(f"[CRITICAL] Translation failed at chunk {i}. Aborting file.")
                raise e
                
    final_text = "".join(results)
    
    # Cleanup possible trailing artifacts
    final_text = re.sub(r'```(\w+)\s*$', r'```\1\n', final_text)
    final_text = fix_toc_anchors(final_text)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(final_text)
        
    print(f"Translation saved to {output_file}")
    
    if validate:
        print(f"Running validation on {output_file}...")
        from ast_validator import validate_translation
        from semantic_diff import check_semantic_drift
        
        report = validate_translation(input_file, output_file)
        if report.status in ["failed", "error"]:
            issues_msg = [i.message for i in report.issues]
            print(f"[CRITICAL] Validation failed for {output_file}: {issues_msg}")
            raise Exception(f"Validation failed: {issues_msg}")
            
        with open(input_file, 'r', encoding='utf-8') as sf, open(output_file, 'r', encoding='utf-8') as tf:
            src_text = sf.read()
            tgt_text = tf.read()
            
        drift_report = check_semantic_drift(src_text, tgt_text)
        drift_issues = [i for i in drift_report["issues"] if i.severity == "P0"]
        if drift_issues:
            issues_msg = [i.message for i in drift_issues]
            print(f"[CRITICAL] Semantic drift check failed for {output_file}: {issues_msg}")
            raise Exception(f"Semantic drift failed: {issues_msg}")
            
        print(f"Validation passed: {report.status}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Translate a single Markdown file.")
    parser.add_argument("-f", "--file", required=True, help="Input markdown file")
    parser.add_argument("-o", "--output", required=True, help="Output markdown file")
    parser.add_argument("-e", "--engine", default="deeplx", help="Translation engine to use")
    parser.add_argument("-w", "--workers", type=int, default=6, help="Max parallel workers for chunking")
    parser.add_argument("--validate", action="store_true", help="Validate output translation file")
    parser.add_argument("--stream-log", action="store_true", help="Print stream logs to stdout")
    
    args = parser.add_argument('--fail-fast', action='store_true')
    args = parser.parse_args()
    
    translate_file(args.file, args.output, args.engine, args.workers, args.validate, args.stream_log)
