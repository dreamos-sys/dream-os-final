#!/usr/bin/env python3
"""Dream OS Core - Quote-Safe Minimal"""
from .tools import call_qwen, parse_json_response
from .memory import query_context, log_audit
from .guardrails import validate_input, sanitize_output, rate_limiter

# ✅ SAFE PROMPT: Single quotes outer, double quotes inner → no conflict!
PROMPT = (
    'You are Mr. M. Answer in Indonesian santai. '
    'Output JSON: {"result":"your answer"}. '
    'End with "Bi idznillah". '
    'Context:{context} Task:{task}'
)

def process_task(task:str)->dict:
    if not rate_limiter.is_allowed():
        return {"success":False,"output":"Rate limit","audit_id":0}
    ok,err=validate_input(task)
    if not ok:
        return {"success":False,"output":f"Error:{err}","audit_id":0}
    print(f"Processing:{task}")
    ctx=query_context(task)
    llm=call_qwen(PROMPT.format(context=ctx,task=task),model="qwen2.5:0.5b")
    plan=parse_json_response(llm)
    # Safe get: ensure result is string
    result=plan.get("result")
    if not isinstance(result,str):
        result=str(result) if result else llm
    log_audit(task,PROMPT,llm,"answer")
    return {"success":True,"output":sanitize_output(result),"audit_id":0}

if __name__=="__main__":
    import sys
    t=" ".join(sys.argv[1:]) if len(sys.argv)>1 else input("Task:")
    print(f"Result:{process_task(t)['output']}")
