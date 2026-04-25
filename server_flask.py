from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/")
def root():
    return jsonify({"status": "Dream OS Backend v3.5", "sovereign": True})

@app.route("/api/ai/diagnose")
def ai_diagnose():
    query = request.args.get("query", "")
    return jsonify({"query": query, "response": f"Analisa: {query}"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8082)
