import http.server
import socketserver
import os
import time

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/sleep'):
            time.sleep(2)
            self.send_response(200)
            self.send_header('Content-type', 'application/javascript')
            self.end_headers()
            self.wfile.write(b"console.log('Sleep delay complete');")
            return
        return super().do_GET()

# Subclass TCPServer with ThreadingMixIn to handle multiple connections concurrently
class ThreadedHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True

# Ensure we serve from the directory where the script is located
os.chdir(os.path.dirname(os.path.abspath(__file__)))

print(f"Starting Threaded TRASURE Concept Guide on http://localhost:{PORT}")
try:
    with ThreadedHTTPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopping server.")
except Exception as e:
    print(f"Error starting server: {e}")

