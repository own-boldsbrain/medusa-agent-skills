import os
import json
import time
from httpx import Client, Timeout
import subprocess

class TranslationEngine:
    def __init__(self, engine_name="deeplx"):
        self.engine_name = engine_name
        self.timeout = Timeout(15.0) # Fail fast
        self.max_retries = 3
        
        # Determine available keys
        self.has_azure = bool(os.environ.get("AZURE_OPENAI_API_KEY"))
        self.has_nvidia = bool(os.environ.get("NVIDIA_API_KEY"))
        self.has_mistral = bool(os.environ.get("MISTRAL_API_KEY"))
        
        if engine_name not in ["deeplx", "ollama", "azure", "nvidia", "mistral"]:
            print(f"[Engine] {engine_name} unknown, defaulting to deeplx")
            self.engine_name = "deeplx"

    def translate(self, text, source="EN", target="PT-BR"):
        if not text or not text.strip():
            return text
            
        retries = 0
        while retries < self.max_retries:
            try:
                if self.engine_name == "deeplx":
                    return self._translate_deeplx(text, source, target)
                elif self.engine_name == "ollama":
                    return self._translate_ollama(text, source, target)
                elif self.engine_name == "azure" and self.has_azure:
                    return self._translate_azure(text, source, target)
                elif self.engine_name == "nvidia" and self.has_nvidia:
                    return self._translate_nvidia(text, source, target)
                else:
                    # Fallback
                    return self._translate_deeplx(text, source, target)
            except Exception as e:
                retries += 1
                error_msg = str(e)
                print(f"[Rotator] Error translating chunk (Attempt {retries}/{self.max_retries}): {error_msg}")
                if "401" in error_msg or "403" in error_msg:
                    print("[Rotator] Critical Auth Error. Aborting.")
                    raise e
                time.sleep(2 ** retries)
                
        raise Exception(f"Translation failed after {self.max_retries} attempts.")
        
    def _translate_deeplx(self, text, source, target):
        url = "http://127.0.0.1:1188/translate"
        payload = {
            "text": text,
            "source_lang": source,
            "target_lang": target
        }
        with Client(timeout=self.timeout) as client:
            resp = client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()
            if data.get("code") == 200:
                return data.get("data")
            else:
                raise Exception(f"DeepLX returned code {data.get('code')}")

    def _translate_ollama(self, text, source, target):
        url = "http://127.0.0.1:11434/api/generate"
        system_prompt = f"Você é um tradutor técnico especializado em e-commerce e engenharia de software. Traduza de {source} para {target}. Responda APENAS com a tradução, sem notas adicionais."
        payload = {
            "model": "translategemma",
            "prompt": text,
            "system": system_prompt,
            "stream": False
        }
        with Client(timeout=self.timeout) as client:
            resp = client.post(url, json=payload)
            resp.raise_for_status()
            return resp.json().get("response", "")
            
    def _translate_azure(self, text, source, target):
        url = os.environ.get("AZURE_OPENAI_ENDPOINT", "")
        key = os.environ.get("AZURE_OPENAI_API_KEY", "")
        if not url or not key:
            raise Exception("Missing AZURE_OPENAI_ENDPOINT or AZURE_OPENAI_API_KEY")
            
        headers = {"api-key": key, "Content-Type": "application/json"}
        payload = {
            "messages": [
                {"role": "system", "content": f"Traduza o seguinte texto de {source} para {target} (português do Brasil). Responda APENAS com a tradução, sem adicionar aspas, explicações, ou filler words como 'Aqui está a tradução'."},
                {"role": "user", "content": text}
            ],
            "temperature": 0.1
        }
        with Client(timeout=self.timeout) as client:
            resp = client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"].strip()
            
    def _translate_nvidia(self, text, source, target):
        url = "https://integrate.api.nvidia.com/v1/chat/completions"
        key = os.environ.get("NVIDIA_API_KEY", "")
        if not key:
            raise Exception("Missing NVIDIA_API_KEY")
            
        headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
        payload = {
            "model": "meta/llama-3.1-70b-instruct",
            "messages": [
                {"role": "system", "content": f"Você é um tradutor técnico estrito. Traduza de {source} para {target}. Responda APENAS com o texto traduzido."},
                {"role": "user", "content": text}
            ],
            "temperature": 0.1
        }
        with Client(timeout=self.timeout) as client:
            resp = client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"].strip()
