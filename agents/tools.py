#!/usr/bin/env python3
"""Dream OS Tools - Minimal & Quote-Safe"""
import subprocess,json,requests
from pathlib import Path

DREAM_ROOT=Path.home()/ "dream-live"
OLLAMA_URL="http://127.0.0.1:11434/api/generate"
ALLOWED={"ls","cat","grep","find","wc","git","curl","echo"}

def call_qwen(prompt:str,model:str="qwen2.5:0.5b")->str:
    try:
        for _ in range(3):
            try:
                r=requests.post(OLLAMA_URL,json={"model":model,"prompt":prompt,"stream":False},timeout=45)
                if r.status_code==200: return r.json().get("response","").strip()
                break
            except: continue
        return "Timeout"
    except Exception as e: return f"Error:{e}"

def run_cli(cmd:str,args:list=None)->dict:
    if cmd not in ALLOWED: return {"success":False,"error":f"{cmd} not allowed"}
    try:
        res=subprocess.run([cmd]+(args or[]),cwd=str(DREAM_ROOT),capture_output=True,text=True,timeout=10)
        return {"success":res.returncode==0,"output":res.stdout,"error":res.stderr}
    except Exception as e: return {"success":False,"error":str(e)}

def read_file(fp:str)->dict:
    try:
        p=(DREAM_ROOT/fp).resolve()
        if not str(p).startswith(str(DREAM_ROOT)): return {"success":False,"error":"Path traversal"}
        return {"success":True,"content":p.read_text(encoding="utf-8"),"error":""}
    except Exception as e: return {"success":False,"content":"","error":str(e)}

def parse_json_response(text:str)->dict:
    """Always return clean dict with string result"""
    default={"result":"No response"}
    if not text: return default
    try:
        s,e=text.find("{"),text.rfind("}")+1
        if s>=0 and e>s:
            p=json.loads(text[s:e])
            if isinstance(p,dict):
                r=p.get("result")
                return {"result":r if isinstance(r,str) else str(r)}
    except: pass
    return {"result":text.strip()}
