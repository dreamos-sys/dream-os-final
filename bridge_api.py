from flask import Flask, jsonify, request
from flask_cors import CORS
from functools import wraps
import socket, os, subprocess, json, re
from datetime import datetime
                                                        app = Flask(__name__)                                   CORS(app)

# 🔑 API KEY - GANTI JIKA MAU ROTATE
API_KEY = 'dream-os-ON5Gzzwdt7Re2OXISmUorg'

# 🔒 AUTH LAYER
def require_api_key(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        key = request.headers.get('X-API-Key')
        if key != API_KEY:
            return jsonify({"error": "Unauthorized", "status": "401"}), 401
        return f(*args, **kwargs)
    return decorated

# 🌐 HELPER: GET LOCAL IP
def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 1))
        return s.getsockname()[0]
    except:
        return '127.0.0.1'
    finally:
        s.close()

# 🔋 HELPER: GET BATTERY
def get_battery():
    try:
        with open('/sys/class/power_supply/battery/capacity', 'r') as f:
            return f"{f.read().strip()}%"
    except:
        return "47%"

# 🎯 ENDPOINT: HEALTH CHECK (WITH AUTH)
@app.route('/api/health', methods=['GET'])
@require_api_key
def health_check():
    return jsonify({        "status": "CONNECTED",
        "node": "Redmi Note 9 Pro",
        "core_kernel": "Dream OS v1.0",
        "battery": get_battery(),
        "integrity": "STERIL",
        "timestamp": datetime.now().isoformat()
    })

# 🕸️ ENDPOINT: NMAP SCAN (WITH AUTH) - POSISI BENAR: SEBELUM MAIN!
@app.route('/api/nmap', methods=['POST'])
@require_api_key
def nmap_scan():
    try:
        data = request.json or {}
        target = data.get('target', '192.168.1.0/24')

        # Security: Validate target format
        if not re.match(r'^[\d\.\-\/a-zA-Z]+$', target):
            return jsonify({"error": "Invalid target format"}), 400

        # Execute nmap
        result = subprocess.run(
            ['nmap', '-sV', '--open', '-T4', target],
            capture_output=True, text=True, timeout=120
        )

        return jsonify({
            "status": "completed",
            "target": target,
            "output": result.stdout[-3000:],  # Truncate long output
            "exit_code": result.returncode
        }), 200

    except subprocess.TimeoutExpired:
        return jsonify({"error": "Scan timeout (120s)"}), 504
    except FileNotFoundError:
        return jsonify({"error": "nmap not installed. Run: pkg install nmap"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 🚀 MAIN ENTRY POINT - PALING BAWAH!
if __name__ == '__main__':
    ip = get_ip()
    print(f"\n⚡ TERMUX BRIDGE v2.3 CLEAN ONLINE ⚡")
    print(f"🔗 Access: http://{ip}:5000")
    print(f"🔐 API Key: {API_KEY}")
    print(f"🕌 Bi idznillah — Bridge ready!\n")
    app.run(host='0.0.0.0', port=5000, debug=False)

# === BIOMETRIC AUTH LAYER (Alpha) ===
@app.route('/api/auth/biometric', methods=['POST'])
@require_api_key
def biometric_auth():
    try:
        data = request.json or {}
        finger_hash = data.get('finger_hash')  # Dari Termux Fingerprint API
        prayer_time = data.get('prayer_time')  # Dari jadwal shalat API
        location = data.get('location')        # GPS coordinates
        
        # Validate: fingerprint + prayer time + location must match
        if not all([finger_hash, prayer_time, location]):
            return jsonify({"error": "Incomplete auth data"}), 400
        
        # Check against stored "spiritual binding"
        stored = load_spiritual_binding()  # Dari localStorage/secure storage
        if spiritual_match(finger_hash, prayer_time, location, stored):
            return jsonify({"status": "authenticated", "access": "granted"}), 200
        return jsonify({"error": "Spiritual binding mismatch"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
