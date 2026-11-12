# -*- coding: utf-8 -*-
"""خادم مستقل للوحة التحكم (dashboardkuwaitalthnyan).

اللوحة موقع ثابت (HTML/JS) بدون حزمة بناء. النسخة الأصلية تعتمد على Vite
لحقن `window.__FIREBASE_CONFIG__` في الصفحة؛ هذا الخادم يقوم بذلك عند الطلب
بدل Vite، فيعمل المشروع كخادم منفصل تماماً عن موقع العملاء.

الاستخدام:  python3 serve_dashboard.py
المنفذ الافتراضي: 12000 (تجاوز بـ PORT).
"""
import http.server
import json
import os
import socketserver
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))

# نقرأ إعدادات Firebase من نفس مصدر مشروع الموقع (.env / متغيّرات البيئة)
# حتى لا تتكرّر المفاتيح في مكانين.
sys.path.insert(0, os.path.dirname(ROOT))
try:
    import firebase_config  # noqa: E402
except Exception:  # pragma: no cover - احتياط إن لم يوجد المشروع الأصلي
    firebase_config = None


# حقول إعدادات Firebase العامة المطلوبة في الواجهة
CONFIG_FIELDS = {
    'apiKey': 'FIREBASE_API_KEY',
    'authDomain': 'FIREBASE_AUTH_DOMAIN',
    'databaseURL': 'FIREBASE_DATABASE_URL',
    'projectId': 'FIREBASE_PROJECT_ID',
    'storageBucket': 'FIREBASE_STORAGE_BUCKET',
    'messagingSenderId': 'FIREBASE_MESSAGING_SENDER_ID',
    'appId': 'FIREBASE_APP_ID',
    'measurementId': 'FIREBASE_MEASUREMENT_ID',
}


def _firebase_config():
    """إعدادات Firebase العامة (من firebase_config.py أو متغيّرات البيئة)."""
    if firebase_config is not None:
        return firebase_config.public_env()
    return {k: os.environ.get(v, '').strip() for k, v in CONFIG_FIELDS.items()}


CONFIG_SCRIPT = (
    '<script>window.__FIREBASE_CONFIG__='
    + json.dumps(_firebase_config(), ensure_ascii=False)
    + ';</script>'
).encode('utf-8')

MIME = {
    '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
    '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif',
    '.ico': 'image/x-icon', '.mp3': 'audio/mpeg',
    '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
    '.map': 'application/json',
}

# الصفحات التي تُحقن فيها الإعدادات (اللوحة صفحة واحدة)
HTML_FILES = {'/index.html'}


class Handler(http.server.SimpleHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def guess_type(self, path):
        return MIME.get(os.path.splitext(path)[1].lower(), 'application/octet-stream')

    def log_message(self, *a):
        pass  # تقليل الضجيج

    def do_GET(self):
        return self._handle(with_body=True)

    def do_HEAD(self):
        return self._handle(with_body=False)

    def _handle(self, with_body=True):
        path = self.path.split('?', 1)[0]
        fs_path = self.translate_path(path)

        # لا تخدم ملفات المصدر/الأسرار
        base = os.path.basename(path)
        if base.startswith('.') or base.endswith('.py') or base.endswith('.zip'):
            return self.send_error(404, 'Not found')

        # مسار غير موجود (SPA) → index.html
        if path == '/' or not os.path.exists(fs_path) or os.path.isdir(fs_path):
            return self._serve_html('/index.html', with_body)

        return self._serve(path, fs_path, with_body)

    def _serve(self, path, fs_path, with_body):
        ext = os.path.splitext(fs_path)[1].lower()
        if ext in {'.html', '.htm'}:
            return self._serve_html(path, with_body)
        try:
            with open(fs_path, 'rb') as f:
                body = f.read()
        except OSError:
            return self.send_error(403, 'Forbidden')
        self.send_response(200)
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.end_headers()
        if with_body:
            self.wfile.write(body)

    def _serve_html(self, path, with_body):
        fs_path = os.path.join(ROOT, path.lstrip('/'))
        if not os.path.exists(fs_path):
            return self.send_error(404, 'Not found')
        with open(fs_path, 'rb') as f:
            content = f.read()
        # حقن الإعدادات قبل </head> (بدل خطوة Vite)
        marker = b'</head>'
        if marker in content:
            content = content.replace(marker, CONFIG_SCRIPT + marker, 1)
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(content)))
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.end_headers()
        if with_body:
            self.wfile.write(content)


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 12000))
    with Server(('0.0.0.0', port), Handler) as httpd:
        print(f'لوحة التحكم تعمل على المنفذ :{port}')
        print(f'  اللوحة: http://localhost:{port}/')
        httpd.serve_forever()
