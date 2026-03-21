#!/usr/bin/env python3
"""Tiny reverse proxy: /agent/* -> agent daemon, /* -> Ollama"""
import http.server, urllib.request, json, sys

AGENT_PORT = 8095
OLLAMA_PORT = 11434
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 11435

class Proxy(http.server.BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        sys.stderr.write(f'[proxy] {fmt % args}\n')

    def _proxy(self, target_port, path):
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length) if length else None
        url = f'http://127.0.0.1:{target_port}{path}'
        req = urllib.request.Request(url, data=body, method=self.command)
        for h in ['Content-Type', 'Accept']:
            if self.headers.get(h):
                req.add_header(h, self.headers[h])
        try:
            resp = urllib.request.urlopen(req, timeout=120)
            data = resp.read()
            self.send_response(resp.status)
            self.send_header('Content-Type', resp.headers.get('Content-Type', 'application/json'))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Length', len(data))
            self.end_headers()
            self.wfile.write(data)
        except Exception as e:
            body = json.dumps({'error': str(e)}).encode()
            self.send_response(502)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', len(body))
            self.end_headers()
            self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Length', '0')
        self.end_headers()

    def do_GET(self):
        if self.path.startswith('/agent/'):
            self._proxy(AGENT_PORT, self.path[6:])  # strip /agent
        else:
            self._proxy(OLLAMA_PORT, self.path)

    def do_POST(self):
        if self.path.startswith('/agent/'):
            self._proxy(AGENT_PORT, self.path[6:])
        else:
            self._proxy(OLLAMA_PORT, self.path)

if __name__ == '__main__':
    server = http.server.HTTPServer(('0.0.0.0', PORT), Proxy)
    print(f'[proxy] Ollama+Agent proxy on :{PORT}')
    server.serve_forever()
