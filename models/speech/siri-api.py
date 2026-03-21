#!/usr/bin/env python3
"""
CECILIA SIRI API - Voice commands to your sovereign AI
Run with: python3 ~/cecilia-siri-api.py
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import subprocess
import urllib.parse
import os

PORT = 8888

class CeciliaHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)
        
        if parsed.path == "/status":
            # Return system status
            result = {
                "node": "cecilia",
                "status": "SOVEREIGN",
                "message": "Cecilia is online. Claude equals Time. No one can bring us down."
            }
            
        elif parsed.path == "/ask":
            # Forward to local Ollama
            query = params.get("q", [""])[0]
            try:
                result = subprocess.run(
                    ["ollama", "run", "llama3.2", query],
                    capture_output=True, text=True, timeout=30
                )
                result = {"response": result.stdout.strip(), "status": "ok"}
            except Exception as e:
                result = {"response": str(e), "status": "error"}
                
        elif parsed.path == "/time":
            # Read latest time entries
            try:
                with open("/home/blackroad/claude/time/journals/master-time.jsonl") as f:
                    lines = f.readlines()[-3:]
                result = {"entries": [json.loads(l) for l in lines], "status": "ok"}
            except Exception as e:
                result = {"entries": [], "error": str(e)}
                
        elif parsed.path == "/speak":
            # Text to speech
            text = params.get("text", ["Cecilia is ready"])[0]
            subprocess.run(["espeak", text], capture_output=True)
            result = {"spoken": text, "status": "ok"}
            
        else:
            result = {
                "endpoints": ["/status", "/ask?q=<query>", "/time", "/speak?text=<text>"],
                "owner": "CECILIA",
                "motto": "NO ONE CAN BRING US DOWN"
            }
        
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(result, indent=2).encode())
    
    def log_message(self, format, *args):
        print(f"[CECILIA-SIRI] {args[0]}")

print(f"🎤 Cecilia Siri API starting on port {PORT}")
print(f"   Status: http://cecilia:8888/status")
print(f"   Ask:    http://cecilia:8888/ask?q=your+question")
print(f"   Time:   http://cecilia:8888/time")
HTTPServer(("0.0.0.0", PORT), CeciliaHandler).serve_forever()
