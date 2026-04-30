from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def root():
    return jsonify({"status": "Dream OS Backend v3.6", "sovereign": True})

@app.route("/api/ai/diagnose")
def ai_diagnose():
    q = request.args.get("query", "")
    return jsonify({"query": q, "response": f"Analisa: {q}"})

@app.route("/api/prayer")
def get_prayer_times():
    return jsonify({"prayers": {"fajr": "04:32", "dhuhr": "11:58", "asr": "15:12", "maghrib": "18:05", "isha": "19:16"}})

@app.route("/api/agent", methods=["POST"])
def agent_endpoint():
    try:
        data = request.get_json()
        if not data or "task" not in data:
            return jsonify({"success": False, "error": "Missing 'task'"}), 400
        task = data["task"]
        return jsonify({"success": True, "output": f"Done: {task}", "audit_id": 0}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/agent/status", methods=["GET"])
def agent_status():
    return jsonify({"status": "online", "version": "1.0.0"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8082, debug=False)