#!/usr/bin/env python3
import os, sys, requests

# Load env var
API_KEY = os.getenv("NVIDIA_API_KEY")
if not API_KEY:
    print("❌ NVIDIA_API_KEY not set! Run: source ~/.bashrc")
    sys.exit(1)

url = "https://integrate.api.nvidia.com/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}
payload = {
    "model": "qwen/qwen3.5-397b-a17b",
    "messages": [{"role": "user", "content": "Halo Dream OS"}],
    "max_tokens": 512,
    "temperature": 0.6,
    "stream": False
}

print("🤲 Testing NVIDIA API...")
try:
    resp = requests.post(url, headers=headers, json=payload, timeout=30)
    if resp.status_code == 200:
        data = resp.json()
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        print("💬 AI Response:")
        print(content)
        print("\n✅✅✅ NVIDIA API WORKING! ✅✅✅")
    else:
        print(f"❌ Error {resp.status_code}: {resp.text[:200]}")
except Exception as e:
    print(f"❌ Exception: {e}")
