/* ============================================================
   i18n-init — يُحمَّل في <head> (متزامناً) قبل رسم الصفحة.
   يحدّد اللغة الافتراضية (السورانية) والاتجاه فوراً لمنع الوميض،
   ويحفظ اختيار العميل في localStorage فيسري على كل الصفحات.
   ============================================================ */
(function () {
    var KEY = 'cihan_lang';
    var DEFAULT_LANG = 'ckb';
    var SUPPORTED = ['ar', 'en', 'ckb'];
    var RTL = { ar: true, ckb: true, en: false };

    function readQuery() {
        try {
            return new URLSearchParams(window.location.search).get('lang');
        } catch (e) {
            return null;
        }
    }

    function readStore() {
        try {
            return localStorage.getItem(KEY);
        } catch (e) {
            return null;
        }
    }

    var lang = readQuery() || readStore() || DEFAULT_LANG;
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;

    try {
        localStorage.setItem(KEY, lang);
    } catch (e) {}

    var el = document.documentElement;
    el.classList.add('i18n-pending');
    el.setAttribute('lang', lang);
    el.setAttribute('dir', RTL[lang] ? 'rtl' : 'ltr');
    el.setAttribute('data-lang', lang);

    // مؤقّت احتياطي: لا تُترك الصفحة مخفية أبداً حتى لو فشل المحرك.
    window.setTimeout(function () {
        document.documentElement.classList.remove('i18n-pending');
    }, 2000);

    window.__CIHAN_LANG__ = lang;

    // شيم مبكّر: يضمن وجود T() قبل تحميل المحرّك (يُستبدَل بالدالة الحقيقية
    // فور تحميل i18n.js)، حتى لا تفشل السكربتات المضمّنة التي تنفّذ فوراً.
    if (typeof window.T !== 'function') {
        window.T = function (key) { return key; };
    }
})();
