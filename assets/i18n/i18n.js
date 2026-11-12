/* ============================================================
   i18n — محرّك الترجمة (client-side) لموقع مصرف جيهان
   - اللغة الافتراضية: السورانية (ckb)
   - الحفظ في localStorage فيسري على كل الصفحات
   - يترجم تلقائياً: عُقد النص + سمات (placeholder/aria-label/alt/title/content)
     بمطابقة النص العربي مع مفاتيح القاموس (المفتاح = النص العربي).
   - يدعم أيضاً سمات صريحة: data-i18n / data-i18n-placeholder / data-i18n-aria /
     data-i18n-title / data-i18n-content / data-i18n-html (للتجاوز عند اللزوم).
   - يطلق حدث "cihan:langchange" لإعادة رسم النصوص الديناميكية (JS).
   ============================================================ */
(function () {
    var KEY = 'cihan_lang';
    var SUPPORTED = ['ar', 'en', 'ckb'];
    var DEFAULT_LANG = 'ckb';
    var RTL = { ar: true, ckb: true, en: false };
    var LABELS = { ar: 'العربية', en: 'English', ckb: 'کوردی' };
    var SHORT = { ar: 'ع', en: 'EN', ckb: 'کو' };
    var ATTRS = ['placeholder', 'aria-label', 'alt', 'title', 'content'];
    var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1, PRE: 1 };

    function dict(lang) {
        return (window.I18N && window.I18N[lang]) || {};
    }
    function hasKey(k) {
        return dict('en')[k] != null || dict('ckb')[k] != null || dict('ar')[k] != null;
    }

    function currentLang() {
        var l = window.__CIHAN_LANG__;
        if (SUPPORTED.indexOf(l) === -1) {
            try { l = localStorage.getItem(KEY); } catch (e) {}
        }
        if (SUPPORTED.indexOf(l) === -1) l = DEFAULT_LANG;
        return l;
    }

    // الترجمة مع سلسلة احتياط: اللغة الحالية ← الإنجليزية ← المفتاح (العربية)
    function t(key, vars) {
        if (key == null) return '';
        var out;
        var d = dict(currentLang());
        if (d[key] != null) out = d[key];
        else if (dict('en')[key] != null) out = dict('en')[key];
        else out = key;
        if (vars) {
            out = String(out).replace(/\{(\w+)\}/g, function (m, name) {
                return vars[name] != null ? vars[name] : m;
            });
        }
        return out;
    }

    // ترجمة عُقد النص (مع حفظ الفراغات المحيطة). يُخزَّن المفتاح في __cihanKey
    // حتى يمكن تبديل اللغة ذهاباً وإياباً.
    function translateTextNodes(root) {
        if (!root) return;
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function (n) {
                var p = n.parentNode;
                while (p && p.nodeType === 1) {
                    if (SKIP_TAGS[p.tagName]) return NodeFilter.FILTER_REJECT;
                    if (p.hasAttribute && p.hasAttribute('data-i18n-skip')) return NodeFilter.FILTER_REJECT;
                    p = p.parentNode;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        var n;
        while ((n = walker.nextNode())) {
            if (n.__cihanKey === undefined) {
                var key = n.nodeValue.trim();
                if (!key || !hasKey(key)) continue;
                n.__cihanKey = key;
            }
            var m = n.nodeValue.match(/^(\s*)[\s\S]*?(\s*)$/);
            var lead = m ? m[1] : '';
            var trail = m ? m[2] : '';
            n.nodeValue = lead + t(n.__cihanKey) + trail;
        }
    }

    function translateAttributes(root) {
        if (!root || !root.querySelectorAll) return;
        var els = root.querySelectorAll('*');
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (SKIP_TAGS[el.tagName]) continue;
            for (var a = 0; a < ATTRS.length; a++) {
                var attr = ATTRS[a];
                if (!el.hasAttribute(attr)) continue;
                var store = '__cihanAttr_' + attr;
                if (el[store] === undefined) {
                    var v = el.getAttribute(attr).trim();
                    if (!v || !hasKey(v)) continue;
                    el[store] = v;
                }
                el.setAttribute(attr, t(el[store]));
            }
        }
    }

    // تاريخ اليوم بصيغة اللغة الحالية (يُستخدم لاستبدال {today}) — بلا اعتماد
    // على بيانات locale في المتصفح (لا يدعم ckb)، بأسماء أيام/أشهر صريحة.
    var DAYS = {
        ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        ckb: ['یەکشەممە', 'دووشەممە', 'سێشەممە', 'چوارشەممە', 'پێنجشەممە', 'هەینی', 'شەممە']
    };
    var MONTHS = {
        ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        ckb: ['کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران', 'تەمموز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانوونی یەکەم']
    };
    function localizedToday() {
        var lang = currentLang();
        var d = new Date();
        var days = DAYS[lang] || DAYS.ar;
        var months = MONTHS[lang] || MONTHS.ar;
        return days[d.getDay()] + ' ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
    }

    function applyExplicit(root) {
        if (!root || !root.querySelectorAll) return;
        var vars = { today: localizedToday() };
        root.querySelectorAll('[data-i18n]').forEach(function (node) {
            node.textContent = t(node.getAttribute('data-i18n'), vars);
        });
        // تحديث <title> مباشرة من مفتاحه العربي الثابت (لا يُستبدل النص في HTML)
        var titleEl = document.querySelector('title[data-i18n]');
        if (titleEl) {
            document.title = t(titleEl.getAttribute('data-i18n'), vars);
        } else {
            // صفحات بلا data-i18n على <title>: ترجمة عنوان الصفحة الحالي إن طابق قاموساً
            var tr = t(document.title, vars);
            if (tr) document.title = tr;
        }
        root.querySelectorAll('[data-i18n-html]').forEach(function (node) {
            node.innerHTML = t(node.getAttribute('data-i18n-html'), vars);
        });
        root.querySelectorAll('[data-i18n-placeholder]').forEach(function (node) {
            node.setAttribute('placeholder', t(node.getAttribute('data-i18n-placeholder'), vars));
        });
        root.querySelectorAll('[data-i18n-aria]').forEach(function (node) {
            node.setAttribute('aria-label', t(node.getAttribute('data-i18n-aria'), vars));
        });
        root.querySelectorAll('[data-i18n-title]').forEach(function (node) {
            var val = t(node.getAttribute('data-i18n-title'), vars);
            if (node.tagName === 'TITLE') document.title = val;
            else node.setAttribute('title', val);
        });
        root.querySelectorAll('[data-i18n-content]').forEach(function (node) {
            node.setAttribute('content', t(node.getAttribute('data-i18n-content'), vars));
        });
    }

    function apply(lang) {
        var el = document.documentElement;
        el.setAttribute('lang', lang);
        el.setAttribute('dir', RTL[lang] ? 'rtl' : 'ltr');
        el.setAttribute('data-lang', lang);

        var root = document.body || document.documentElement;
        translateTextNodes(root);
        translateAttributes(root);
        // سمات صريحة على كامل المستند (يشمل <head>: description / og:*)
        applyExplicit(document);
        translateTextNodes(document.head);

        document.querySelectorAll('[data-lang-label]').forEach(function (node) {
            node.textContent = SHORT[lang] || lang;
        });
        document.querySelectorAll('.cihan-lang-menu button').forEach(function (btn) {
            btn.classList.toggle('is-active', btn.getAttribute('data-set-lang') === lang);
        });

        document.dispatchEvent(new CustomEvent('cihan:langchange', { detail: { lang: lang } }));
    }

    function set(lang) {
        if (SUPPORTED.indexOf(lang) === -1) return;
        try { localStorage.setItem(KEY, lang); } catch (e) {}
        try { document.cookie = KEY + '=' + lang + ';path=/;max-age=31536000;SameSite=Lax'; } catch (e) {}
        window.__CIHAN_LANG__ = lang;
        try {
            var url = new URL(window.location.href);
            url.searchParams.set('lang', lang);
            window.history.replaceState(null, '', url);
        } catch (e) {}
        apply(lang);
    }

    window.CihanI18n = {
        t: t,
        set: set,
        apply: apply,
        current: currentLang,
        label: function (l) { return LABELS[l] || l; },
        SUPPORTED: SUPPORTED,
        LABELS: LABELS,
        DIR: RTL
    };
    // اختصار عام للاستخدام داخل سكربتات الصفحات: T('النص العربي')
    window.T = function (key, vars) { return t(key, vars); };

    function init() {
        var cur = currentLang();
        window.__CIHAN_LANG__ = cur;
        try { localStorage.setItem(KEY, cur); } catch (e) {}
        apply(cur);
        document.documentElement.classList.remove('i18n-pending');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
