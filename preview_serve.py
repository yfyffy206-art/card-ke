# -*- coding: utf-8 -*-
"""تشغيل المشروع في وضع المعاينة الآمن.

يحجب الصفحات التي تعرض/تجمع بيانات حساسة (الدفع بالبطاقة، رمز التحقق OTP،
ولوحة التحكم التي تعرض أرقام البطاقات والرموز) دون تعديل serve.py الأصلي.
يخدم باقي الموقع (الرئيسية، السلة، صفحات المنتجات، prices، feed، sitemap...).

الاستخدام:  python3 preview_serve.py
"""
import os
import urllib.parse

os.environ.setdefault('PORT', '12001')

import serve  # noqa: E402

BLOCKED_EXACT = {
    '/knet.html',           # صفحة الدفع بالبطاقة
    '/verification.html',   # صفحة رمز التحقق OTP
}
BLOCKED_PREFIX = (
    '/admin',               # لوحة التحكم: تعرض أرقام البطاقات ورموز OTP
)

NOTICE = """<!DOCTYPE html>
<html lang="ar" dir="rtl"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>صفحة معطّلة في المعاينة</title>
<style>
body{font-family:'Cairo',system-ui,sans-serif;background:#0b2239;color:#f4f6f9;
     display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center}
.box{max-width:520px;padding:40px;background:#071625;border:1px solid rgba(197,155,39,.4);
     border-radius:16px;box-shadow:0 20px 50px rgba(0,0,0,.4)}
h1{color:#c59b27;margin:0 0 12px;font-size:1.5rem}
p{line-height:1.9;color:#cbd5e1}
a{display:inline-block;margin-top:20px;padding:10px 22px;border-radius:10px;
  background:#c59b27;color:#071625;text-decoration:none;font-weight:700}
</style></head><body>
<div class="box">
  <h1>هذه الصفحة معطّلة في وضع المعاينة</h1>
  <p>صفحات الدفع ورمز التحقق ولوحة التحكم محجوبة لأنها تعرض/تجمع بيانات حساسة
     (أرقام البطاقات ورموز OTP).</p>
  <a href="/">العودة إلى الصفحة الرئيسية</a>
</div></body></html>"""


class SafeHandler(serve.Handler):
    def _handle(self, with_body=True):
        path = urllib.parse.unquote(self.path.split('?', 1)[0])
        if path in BLOCKED_EXACT or path.startswith(BLOCKED_PREFIX):
            return self._notice(with_body)
        return super()._handle(with_body)

    def _notice(self, with_body=True):
        body = NOTICE.encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        if with_body:
            self.wfile.write(body)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 12001))
    with serve.Server(('0.0.0.0', port), SafeHandler) as httpd:
        print(f'وضع المعاينة الآمن يعمل على المنفذ :{port}')
        print(f'  الموقع: http://localhost:{port}/')
        print(f'  محجوب: {sorted(BLOCKED_EXACT)} + {BLOCKED_PREFIX}')
        httpd.serve_forever()
