import json, subprocess
from http.server import BaseHTTPRequestHandler, HTTPServer

class GhostHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "Content-type")
        self.end_headers()

    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {"output": "Simulasi lokal"}
        try:
            if self.path == '/T1059':
                res = subprocess.check_output(['uname', '-a'], text=True)
                response["output"] = f"Kernel: {res.strip()}"
            elif self.path == '/T1003':
                res = subprocess.check_output(['whoami'], text=True)
                response["output"] = f"Termux User: {res.strip()}"
        except Exception as e:
            response["output"] = str(e)
            
        self.wfile.write(json.dumps(response).encode('utf-8'))
    def log_message(self, format, *args): pass

server = HTTPServer(('127.0.0.1', 8080), GhostHandler)
print("👻 Ghost Bridge Active on http://127.0.0.1:8080 ...")
server.serve_forever()
