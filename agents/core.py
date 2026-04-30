#!/usr/bin/env python3
"""
🧠 Dream OS Agent Core — The Brain
Main loop: Input → Context → Prompt → LLM → Action → Output
"""

import json
from pathlib import Path
from datetime import datetime

from .tools import call_ollama, run_cli, read_file, parse_json_response
from .memory import query_context, log_audit
from .guardrails import validate_input, sanitize_output, rate_limiter, check_human_approval

# ── CONFIG ────────────────────────────────────────
DREAM_ROOT = Path.home() / "dream-live"
AGENT_PROMPT = """
You are Mr. M, a Senior Staff Engineer AI agent for Dream OS.

RULES:
1. Think before coding — state assumptions clearly
2. Simplicity first — no speculative features
3. Surgical changes — touch only what's needed
4. Goal-driven — define verifiable success criteria
5. Always end with "Bi idznillah" if task completed

CONTEXT:
{context}

TASK:
{task}

OUTPUT FORMAT (JSON only):
{{
  "thought": "Your analysis and assumptions",
  "action": "read_file|run_cli|generate_code|answer",
  "args": {{...}},
  "result": "Expected outcome",
  "confidence": "high|medium|low"
}}
"""
# ──────────────────────────────────────────────────

def process_task(task: str) -> dict:
    """
    Main agent loop
    Return: {"success": bool, "output": str, "audit_id": int}
    """
    # 1. Rate limit check    if not rate_limiter.is_allowed():
        return {"success": False, "output": "⚠️ Rate limit exceeded. Please wait.", "audit_id": 0}
    
    # 2. Input validation
    is_valid, error_msg = validate_input(task)
    if not is_valid:
        return {"success": False, "output": f"❌ {error_msg}", "audit_id": 0}
    
    print(f"\n🧠 Processing task: {task}")
    
    # 3. Retrieve context
    context = query_context(task)
    
    # 4. Build prompt
    prompt = AGENT_PROMPT.format(context=context, task=task)
    
    # 5. Call LLM
    print("⏳ Thinking...")
    llm_response = call_ollama(prompt, model="tinyllama:latest")
    
    # 6. Parse JSON response
    action_plan = parse_json_response(llm_response)
    
    if "error" in action_plan:
        # Fallback: return raw response
        sanitized = sanitize_output(llm_response)
        log_audit(task, prompt, llm_response, "answer")
        return {"success": True, "output": sanitized, "audit_id": 0}
    
    # 7. Execute action
    action = action_plan.get("action", "answer")
    args = action_plan.get("args", {})
    
    print(f"🔧 Executing: {action}")
    
    try:
        if action == "read_file":
            filepath = args.get("path", "")
            result = read_file(filepath)
            output = result.get("content", result.get("error", ""))
        
        elif action == "run_cli":
            command = args.get("command", "")
            cmd_args = args.get("args", [])
            if check_human_approval(f"{command} {' '.join(cmd_args)}"):
                result = run_cli(command, cmd_args)
                output = result.get("output", result.get("error", ""))
            else:
                output = "❌ Action denied by user"
                elif action == "generate_code":
            # Return code suggestion
            output = action_plan.get("result", "Code generated (apply manually)")
        
        else:
            # Default: answer
            output = action_plan.get("result", llm_response)
    
    except Exception as e:
        output = f"❌ Execution error: {str(e)}"
    
    # 8. Sanitize & log
    sanitized = sanitize_output(str(output))
    log_audit(task, prompt, llm_response, action)
    
    # 9. Return result
    return {
        "success": True,
        "output": sanitized,
        "audit_id": 0,  # Bisa ambil dari DB nanti
        "thought": action_plan.get("thought", ""),
        "confidence": action_plan.get("confidence", "medium")
    }

# CLI interface
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        task = " ".join(sys.argv[1:])
    else:
        task = input("🤖 Mr. M Agent: What should I do? ")
    
    result = process_task(task)
    
    print("\n" + "="*60)
    if result.get("thought"):
        print(f"💭 Thought: {result['thought']}")
    print(f"📋 Result:\n{result['output']}")
    print(f"🎯 Confidence: {result.get('confidence', 'N/A')}")
    print("="*60)
