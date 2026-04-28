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

# ── PRAYER API ENDPOINT ─────────────────────────────
@app.route("/api/prayer")
def get_prayer_times():
    """GET /api/prayer?lat=-6.2&lon=106.8&method=4"""
    try:
        import requests
        from datetime import datetime
        
        lat = request.args.get('lat', '-6.1754')
        lon = request.args.get('lon', '106.8272')
        method = request.args.get('method', '4')  # 4 = Kemenag RI
        
        date = datetime.now().strftime('%d-%m-%Y')
        url = f"http://api.aladhan.com/v1/timings/{date}"
        params = {'latitude': lat, 'longitude': lon, 'method': method, 'timeformat': '24'}
        
        res = requests.get(url, params=params, timeout=10)
        if res.status_code != 200:
            return jsonify({"error": "Failed to fetch"}), 502
        
        data = res.json()['data']['timings']
        return jsonify({
            "prayers": {
                "fajr": data['Fajr'], "dhuhr": data['Dhuhr'], "asr": data['Asr'],
                "maghrib": data['Maghrib'], "isha": data['Isha']
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
