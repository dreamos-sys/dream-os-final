#!/usr/bin/env python3
from flask import Flask,jsonify,request
from flask_cors import CORS
import requests,sqlite3
from pathlib import Path
app=Flask(__name__);CORS(app)
DR=Path.home()/"dream-live"
DB=DR/"logs"/"agent_memory.db"
OLL="http://127.0.0.1:11434/api/generate"
def _db():
 DB.parent.mkdir(parents=True,exist_ok=True)
 c=sqlite3.connect(str(DB)).cursor()
 c.execute("CREATE TABLE IF NOT EXISTS context(id INTEGER PRIMARY KEY,path TEXT UNIQUE,content TEXT,keywords TEXT)")
 c.execute("CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY,task TEXT,prompt TEXT,response TEXT,action TEXT)")
 c.connection.commit();return c.connection
def qc(q):
 c=_db().cursor();r=[]
 for k in q.lower().split():
  if len(k)<3:continue
  c.execute("SELECT path,content FROM context WHERE keywords LIKE?LIMIT?",(f"%{k}%",3));r.extend(c.fetchall())
 c.connection.close()
 return "Context:\\n"+"".join([f"📄{p}:{t[:200]}...\\n"for p,t in r[:3]])if r else""
def la(t,p,r,a):
 c=_db().cursor()
 c.execute("INSERT INTO audit(task,prompt,response,action)VALUES(?,?,?,?)",(t,p[:300],r[:300],a))
 c.connection.commit();c.connection.close()
def cq(pr,m="qwen2.5:0.5b"):
 for _ in range(3):
  try:
   x=requests.post(OLL,json={"model":m,"prompt":pr,"stream":False},timeout=60)
   if x.status_code==200:return x.json().get("response","").strip()or"No content"
  except:continue
 return"Timeout"
@app.route("/")
def rt():return jsonify({"status":"Dream OS Backend v3.6","sovereign":True})
@app.route("/api/agent",methods=["POST"])
def ag():
 try:
  d=request.get_json()
  if not d or"task"not in d:return jsonify({"success":False,"error":"Missing task"}),400
  t=d["task"];print(f"Processing:{t}");ctx=qc(t)
  pr=f"You are Mr. M.Jawab singkat Indonesian.Akhiri Bi idznillah.Context:{ctx}Task:{t}"
  print("Thinking...");lr=cq(pr);o=lr.strip()if lr else"No response";la(t,pr,lr,"raw")
  return jsonify({"success":True,"output":o,"audit_id":0}),200
 except Exception as e:print(f"Error:{e}");return jsonify({"success":False,"error":str(e)}),500
if __name__=="__main__":app.run(host="0.0.0.0",port=8082,debug=False)
