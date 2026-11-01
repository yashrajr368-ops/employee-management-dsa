import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend")

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

def get_server(port):
    for p in [port, 8081, 8082, 5000, 3000]:
        try:
            server = ReusableTCPServer(("127.0.0.1", p), Handler)
            return server, p
        except OSError:
            continue
    raise RuntimeError("Could not find an available port.")

def run():
    os.chdir(DIRECTORY)
    httpd, active_port = get_server(PORT)
    url = f"http://localhost:{active_port}"
    ip_url = f"http://127.0.0.1:{active_port}"
    print("=" * 65, flush=True)
    print(f"[*] NOVA EMS Web Server is LIVE!", flush=True)
    print(f"[*] Serving Directory: {DIRECTORY}", flush=True)
    print(f"[*] Local Link: {url}", flush=True)
    print(f"[*] Alternative Link: {ip_url}", flush=True)
    print("=" * 65, flush=True)

    try:
        webbrowser.open(url)
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server gracefully...", flush=True)
        httpd.server_close()

if __name__ == "__main__":
    run()
