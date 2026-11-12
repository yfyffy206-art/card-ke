/* ============================================================
   lang-switcher — يبني زر تبديل اللغة وقائمته داخل أي عنصر
   يحمل السمة data-lang-switcher، ويحفظ الاختيار عبر CihanI18n.set()
   ============================================================ */
(function () {
    var OPTIONS = [
        { code: 'ckb', label: 'کوردیی سۆرانی', short: 'کو' },
        { code: 'ar', label: 'العربية', short: 'عر' },
        { code: 'en', label: 'English', short: 'EN' }
    ];

    function shortOf(code) {
        for (var i = 0; i < OPTIONS.length; i++) if (OPTIONS[i].code === code) return OPTIONS[i].short;
        return 'EN';
    }

    function build(container) {
        var theme = container.getAttribute('data-lang-theme') || 'dark';
        container.classList.add('cihan-lang');
        container.classList.toggle('cihan-lang--light', theme === 'light');

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cihan-lang-btn';
        btn.setAttribute('aria-haspopup', 'true');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Language');
        btn.innerHTML = '<i class="fa-solid fa-globe" aria-hidden="true"></i>' +
            '<span data-lang-label>' + shortOf(window.CihanI18n.current()) + '</span>' +
            '<i class="fa-solid fa-chevron-down" style="font-size:10px" aria-hidden="true"></i>';

        var menu = document.createElement('div');
        menu.className = 'cihan-lang-menu';
        menu.setAttribute('role', 'menu');
        menu.hidden = true;
        menu.innerHTML = OPTIONS.map(function (o) {
            return '<button type="button" role="menuitemradio" data-set-lang="' + o.code + '">' +
                '<span>' + o.label + '</span></button>';
        }).join('');

        container.innerHTML = '';
        container.appendChild(btn);
        container.appendChild(menu);

        function close() { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
        function open() { menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); }

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            menu.hidden ? open() : close();
        });
        menu.addEventListener('click', function (e) {
            var target = e.target.closest('[data-set-lang]');
            if (!target) return;
            e.stopPropagation();
            window.CihanI18n.set(target.getAttribute('data-set-lang'));
            close();
        });
        document.addEventListener('click', function () { close(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    }

    function refreshLabels() {
        document.querySelectorAll('[data-lang-label]').forEach(function (el) {
            el.textContent = shortOf(window.CihanI18n.current());
        });
    }

    function mount() {
        if (!window.CihanI18n) return;
        document.querySelectorAll('[data-lang-switcher]').forEach(function (el) {
            if (!el.dataset.langReady) {
                build(el);
                el.dataset.langReady = '1';
            }
        });
        window.CihanI18n.apply(window.CihanI18n.current());
        refreshLabels();
    }

    document.addEventListener('cihan:langchange', refreshLabels);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
})();
