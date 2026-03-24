/* Not Rocket Science™ — Console Easter Egg */
(function () {
    console.log(
        '\n' +
        '%c Not Rocket Science™ %c\n\n' +
        '%c Hey there, fellow developer! 👋\n\n' +
        ' We\'re always looking for "friends" to build cool things with.\n' +
        ' If you like clean code, good coffee, and solving problems\n' +
        ' that aren\'t exactly rocket science — let\'s talk.\n\n' +
        ' 📧  its@notrocketscience.dk\n' +
        ' 🌐  notrocketscience.dk/@mathiasjakobsen\n',
        'background:#1f2d12;color:#e2d6c0;font-size:18px;padding:10px 16px;border-radius:4px;font-weight:700;font-family:Georgia,serif;',
        '',
        'color:#e2d6c0;background:#1f2d12;font-size:13px;padding:12px 16px;border-radius:4px;line-height:1.8;font-family:system-ui,sans-serif;'
    );
})();

/* Konami Code: ↑↑↓↓←→←→BA */
(function () {
    var seq = [38,38,40,40,37,39,37,39,66,65];
    var pos = 0;
    document.addEventListener('keydown', function (e) {
        if (e.keyCode === seq[pos]) {
            pos++;
            if (pos === seq.length) {
                pos = 0;
                activateKonami();
            }
        } else {
            pos = 0;
        }
    });

    function activateKonami() {
        var el = document.createElement('div');
        el.setAttribute('role', 'status');
        el.setAttribute('aria-live', 'polite');
        el.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(31,45,18,0.95);color:#e2d6c0;font-family:Georgia,serif;font-size:clamp(1.5rem,5vw,3rem);text-align:center;padding:2rem;opacity:0;transition:opacity 0.4s ease;';
        el.innerHTML = '🚀 OK, maybe it <em>is</em> rocket science.';
        document.body.appendChild(el);
        requestAnimationFrame(function () { el.style.opacity = '1'; });
        document.body.style.transition = 'transform 0.6s ease';
        document.body.style.transform = 'rotate(180deg)';
        setTimeout(function () {
            document.body.style.transform = '';
            el.style.opacity = '0';
            setTimeout(function () { el.remove(); }, 400);
        }, 2500);
    }
})();

/* Shift + Mouse cursor trail */
(function () {
    var rockets = [];
    var pool = [];
    var raf = null;
    var LIFETIME = 800;

    function getEl() {
        if (pool.length) return pool.pop();
        var el = document.createElement('span');
        el.textContent = '🚀';
        el.setAttribute('aria-hidden', 'true');
        el.style.cssText = 'position:fixed;pointer-events:none;z-index:9998;font-size:16px;transition:none;will-change:transform,opacity;';
        document.body.appendChild(el);
        return el;
    }

    document.addEventListener('mousemove', function (e) {
        if (!e.shiftKey) return;
        var el = getEl();
        el.style.left = e.clientX + 'px';
        el.style.top = e.clientY + 'px';
        el.style.opacity = '1';
        el.style.transform = 'translate(-50%,-50%) scale(1)';
        rockets.push({ el: el, born: Date.now() });
        if (!raf) tick();
    });

    function tick() {
        var now = Date.now();
        for (var i = rockets.length - 1; i >= 0; i--) {
            var r = rockets[i];
            var age = now - r.born;
            if (age > LIFETIME) {
                r.el.style.opacity = '0';
                pool.push(r.el);
                rockets.splice(i, 1);
            } else {
                var progress = age / LIFETIME;
                r.el.style.opacity = String(1 - progress);
                r.el.style.transform = 'translate(-50%,-50%) scale(' + (1 - progress * 0.5) + ')';
            }
        }
        raf = rockets.length ? requestAnimationFrame(tick) : null;
    }
})();

/* Command Palette — Cmd/Ctrl + K */
(function () {
    var items = [
        { label: 'Home', keys: 'page', href: '/' },
        { label: '@notrocketscience', keys: 'page social nrs company', href: '/@notrocketscience' },
        { label: '@mathiasjakobsen', keys: 'page personal mathias', href: '/@mathiasjakobsen' },
        { label: 'LinkedIn (company)', keys: 'social linkedin nrs', href: 'https://linkedin.com/company/notrocketscience', ext: true },
        { label: 'LinkedIn (personal)', keys: 'social linkedin mathias', href: 'https://linkedin.com/in/mathiasjakobsen', ext: true },
        { label: 'GitHub (company)', keys: 'social github nrs', href: 'https://github.com/notrocketscience', ext: true },
        { label: 'GitHub (personal)', keys: 'social github mathias', href: 'https://github.com/mathiasjakobsen', ext: true },
        { label: 'Email', keys: 'contact mail', href: 'mailto:its@notrocketscience.dk' },
        { label: 'Copy email', keys: 'action copy clipboard', action: function () { navigator.clipboard.writeText('its@notrocketscience.dk'); } },
        { label: 'Call', keys: 'contact phone', href: 'tel:+4593967688' },
        { label: 'Download vCard (company)', keys: 'action download vcf contact', href: '/contact.vcf', download: true },
        { label: 'Download vCard (personal)', keys: 'action download vcf contact mathias', href: '/mathias-jakobsen.vcf', download: true },
        { label: 'View source', keys: 'action code dev', href: 'https://github.com/notrocketscience/notrocketscience.github.io', ext: true },
    ];

    var overlay, dialog, input, list;
    var filtered = items.slice();
    var active = 0;
    var isOpen = false;

    function build() {
        overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.4);display:none;align-items:flex-start;justify-content:center;padding-top:min(20vh,160px);';
        overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

        dialog = document.createElement('div');
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-label', 'Command palette');
        dialog.style.cssText = 'width:90%;max-width:480px;background:#e2d6c0;color:#2A1E06;border-radius:12px;box-shadow:0 24px 48px rgba(0,0,0,0.3);overflow:hidden;font-family:"Instrument Sans",system-ui,sans-serif;';

        input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Type a command…';
        input.setAttribute('aria-label', 'Search commands');
        input.setAttribute('autocomplete', 'off');
        input.style.cssText = 'width:100%;padding:16px 20px;border:none;background:transparent;font-size:16px;color:#2A1E06;outline:none;font-family:inherit;box-sizing:border-box;';
        input.addEventListener('input', onInput);
        input.addEventListener('keydown', onKeydown);

        list = document.createElement('ul');
        list.setAttribute('role', 'listbox');
        list.style.cssText = 'list-style:none;margin:0;padding:0 0 8px;max-height:320px;overflow-y:auto;';

        dialog.appendChild(input);
        var hr = document.createElement('div');
        hr.style.cssText = 'height:1px;background:rgba(42,30,6,0.1);';
        dialog.appendChild(hr);
        dialog.appendChild(list);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Dark mode
        if (window.matchMedia('(prefers-color-scheme:dark)').matches) {
            dialog.style.background = '#1f2d12';
            dialog.style.color = '#e2d6c0';
            input.style.color = '#e2d6c0';
            hr.style.background = 'rgba(226,214,192,0.1)';
        }

        render();
    }

    function render() {
        list.innerHTML = '';
        filtered.forEach(function (item, i) {
            var li = document.createElement('li');
            li.setAttribute('role', 'option');
            li.setAttribute('aria-selected', i === active ? 'true' : 'false');
            li.textContent = item.label;
            if (item.ext) li.textContent += ' ↗';
            if (item.download) li.textContent += ' ↓';
            li.style.cssText = 'padding:10px 20px;cursor:pointer;font-size:14px;border-radius:6px;margin:2px 8px;transition:background 0.1s;';
            if (i === active) {
                li.style.background = window.matchMedia('(prefers-color-scheme:dark)').matches ? 'rgba(226,214,192,0.1)' : 'rgba(31,45,18,0.08)';
                requestAnimationFrame(function () {
                    var lt = list.scrollTop;
                    var lb = lt + list.clientHeight;
                    var et = li.offsetTop - list.offsetTop;
                    var eb = et + li.offsetHeight;
                    if (et < lt) list.scrollTop = et;
                    else if (eb > lb) list.scrollTop = eb - list.clientHeight;
                });
            }
            li.addEventListener('click', function () { execute(item); });
            li.addEventListener('mouseenter', function () {
                active = i;
                render();
            });
            list.appendChild(li);
        });
    }

    function onInput() {
        var q = input.value.toLowerCase().trim();
        if (!q) {
            filtered = items.slice();
        } else {
            filtered = items.filter(function (item) {
                return item.label.toLowerCase().indexOf(q) !== -1 || item.keys.indexOf(q) !== -1;
            });
        }
        active = 0;
        render();
    }

    function onKeydown(e) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            active = Math.min(active + 1, filtered.length - 1);
            render();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            active = Math.max(active - 1, 0);
            render();
        } else if (e.key === 'Enter' && filtered[active]) {
            e.preventDefault();
            execute(filtered[active]);
        } else if (e.key === 'Escape') {
            close();
        }
    }

    function execute(item) {
        close();
        if (item.action) {
            item.action();
            return;
        }
        if (item.download) {
            var a = document.createElement('a');
            a.href = item.href;
            a.download = '';
            a.click();
            return;
        }
        if (item.ext) {
            window.open(item.href, '_blank', 'noopener');
        } else {
            window.location.href = item.href;
        }
    }

    function open() {
        if (!overlay) build();
        overlay.style.display = 'flex';
        input.value = '';
        filtered = items.slice();
        active = 0;
        render();
        requestAnimationFrame(function () { input.focus(); });
        isOpen = true;
    }

    function close() {
        if (overlay) overlay.style.display = 'none';
        isOpen = false;
    }

    document.addEventListener('keydown', function (e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            isOpen ? close() : open();
        }
    });
})();
