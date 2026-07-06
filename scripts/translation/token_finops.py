import tiktoken

def count_tokens(text: str) -> int:
    try:
        # Use cl100k_base which is standard for GPT-4/GPT-3.5 models
        encoding = tiktoken.get_encoding("cl100k_base")
        return len(encoding.encode(text))
    except Exception:
        # Fallback if tiktoken fails
        return len(text.split()) * 2

def calculate_cost(tokens: int, cost_per_1k: float = 0.015) -> float:
    # A generic assumed cost for estimation (e.g. $0.015 per 1k input+output avg)
    return (tokens / 1000.0) * cost_per_1k

class TokenFinOps:
    def __init__(self):
        self.total_tokens_saved = 0
        self.total_tokens_spent = 0
        
    def estimate_file_tokens(self, source_text: str, target_text: str = "") -> int:
        return count_tokens(source_text) + count_tokens(target_text)

    def record_zero_token_repair(self, tokens: int):
        # We saved these tokens by NOT using LLM
        self.total_tokens_saved += tokens
        
    def record_llm_translation(self, tokens: int):
        self.total_tokens_spent += tokens
