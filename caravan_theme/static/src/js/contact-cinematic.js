/* ============================================================
   CONTACT �?" CINEMATIC CONTACT EXPERIENCE JS
   ============================================================ */
(function () {
    'use strict';

    /* ---- Particles (hero + final) ---- */
    function initParticles(canvas) {
        if (!canvas) return null;
        var ctx = canvas.getContext('2d');
        var pts = [];
        var N = 45;
        function resize() {
            var r = canvas.parentElement.getBoundingClientRect();
            canvas.width = r.width;
            canvas.height = r.height;
        }
        resize();
        window.addEventListener('resize', resize);
        for (var i = 0; i < N; i++) {
            pts.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.2 + 0.3,
                dx: (Math.random() - 0.5) * 0.25,
                dy: (Math.random() - 0.5) * 0.25,
                a: Math.random() * 0.4 + 0.15
            });
        }
        var run = true;
        (function draw() {
            if (!run) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var j = 0; j < pts.length; j++) {
                var p = pts[j];
                p.x += p.dx; p.y += p.dy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(245, 166, 35,' + p.a + ')';
                ctx.fill();
            }
            requestAnimationFrame(draw);
        })();
        return function () { run = false; };
    }

    /* ---- Form type switching ---- */
    function initFormSwitch() {
        var typeBtns = document.querySelectorAll('.ct-type-btn');
        var cardBtns = document.querySelectorAll('.ct-card-btn');
        var cards = document.querySelectorAll('.ct-card');
        var panels = {
            teklif: document.getElementById('ctFieldsTeklif'),
            kiralama: document.getElementById('ctFieldsKiralama'),
            destek: document.getElementById('ctFieldsDestek')
        };

        function setType(type) {
            // Type bar
            typeBtns.forEach(function (b) {
                b.classList.toggle('active', b.dataset.type === type);
            });
            // Cards highlight
            cards.forEach(function (c) {
                c.classList.toggle('ct-card-active', c.dataset.type === type);
            });
            // Dynamic fields
            Object.keys(panels).forEach(function (k) {
                if (panels[k]) {
                    panels[k].classList.toggle('ct-hidden', k !== type);
                }
            });
        }

        typeBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                setType(btn.dataset.type);
            });
        });

        cardBtns.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                setType(btn.dataset.type);
                var formSec = document.getElementById('ct-form-section');
                if (formSec) formSec.scrollIntoView({ behavior: 'smooth' });
            });
        });

        cards.forEach(function (card) {
            card.addEventListener('click', function () {
                setType(card.dataset.type);
                var formSec = document.getElementById('ct-form-section');
                if (formSec) formSec.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    /* ---- Lazy-load map ---- */
    function initMap() {
        var loadBtn = document.getElementById('ctMapLoadBtn');
        var frame = document.getElementById('ctMapFrame');
        var placeholder = document.getElementById('ctMapPlaceholder');
        if (!loadBtn || !frame) return;

        loadBtn.addEventListener('click', function () {
            var iframe = document.createElement('iframe');
            iframe.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.5416447699746!2d29.01839!3d41.10816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab5e3a2d2f04b%3A0x2c5b3e3e3b3b3b3b!2sMaslak%2C+Sar%C4%B1yer%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str';
            iframe.allowFullscreen = true;
            iframe.loading = 'lazy';
            iframe.referrerPolicy = 'no-referrer-when-downgrade';
            iframe.title = 'Konum Haritası';
            iframe.style.cssText = 'width:100%;height:100%;border:none;filter:brightness(0.7) contrast(1.2) saturate(0);display:block;';
            frame.appendChild(iframe);
            if (placeholder) placeholder.style.display = 'none';
        });
    }

    /* ---- Animated counters ---- */
    function initCounters() {
        var counters = document.querySelectorAll('.ct-counter');
        if (!counters.length) return;
        var animated = false;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    counters.forEach(function (el) {
                        var target = parseInt(el.dataset.target, 10);
                        var duration = 2000;
                        var start = 0;
                        var startTime = null;
                        function tick(ts) {
                            if (!startTime) startTime = ts;
                            var progress = Math.min((ts - startTime) / duration, 1);
                            // ease-out
                            var ease = 1 - Math.pow(1 - progress, 3);
                            el.textContent = Math.round(start + (target - start) * ease);
                            if (progress < 1) requestAnimationFrame(tick);
                        }
                        requestAnimationFrame(tick);
                    });
                }
            });
        }, { threshold: 0.3 });

        var trustSection = document.querySelector('.ct-trust');
        if (trustSection) observer.observe(trustSection);
    }

    /* ---- Section reveal observers ---- */
    function initReveals() {
        var sections = document.querySelectorAll('.ct-visit, .ct-final');
        if (!sections.length) return;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) entry.target.classList.add('ct-vis');
            });
        }, { threshold: 0.15 });
        sections.forEach(function (s) { observer.observe(s); });
    }

    /* ---- Mobile sticky CTA ---- */
    function initMobileSticky() {
        // inject the sticky element
        var page = document.getElementById('page-contact');
        if (!page || page.querySelector('.ct-mobile-sticky')) return;
        var sticky = document.createElement('div');
        sticky.className = 'ct-mobile-sticky';
        sticky.innerHTML = '<button class="cv-btn cv-btn-gold" onclick="document.getElementById(\'ct-form-section\').scrollIntoView({behavior:\'smooth\'})"><svg width=18 height=18 viewBox="0 0 24 24" fill=none stroke=currentColor stroke-width=2><line x1=22 y1=2 x2=11 y2=13/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>İleti�Yime Geç</button>';
        page.appendChild(sticky);

        function checkScroll() {
            var hero = page.querySelector('.ct-hero');
            if (!hero) return;
            var heroBottom = hero.getBoundingClientRect().bottom;
            sticky.classList.toggle('show', heroBottom < 0);
        }
        window.addEventListener('scroll', checkScroll, { passive: true });
    }

    /* ---- CONFIG SEND: auto-fill from configurator ---- */
    function initConfigSend() {
        // Check URL params or sessionStorage for config data
        var configData = null;
        try {
            var stored = sessionStorage.getItem('caravan_config');
            if (stored) configData = JSON.parse(stored);
        } catch (e) { /* ignore */ }

        // Also check URL params
        if (!configData) {
            var params = new URLSearchParams(window.location.search);
            if (params.get('config_model')) {
                configData = {
                    model: params.get('config_model'),
                    options: params.get('config_options') || '',
                    price: params.get('config_price') || ''
                };
            }
        }

        if (!configData) return;

        var preview = document.getElementById('ctConfigPreview');
        var summary = document.getElementById('ctConfigSummary');
        if (!preview || !summary) return;

        preview.classList.remove('ct-hidden');
        var html = '<strong>' + (configData.model || '') + '</strong>';
        if (configData.options) html += '<br/>Seçenekler: ' + configData.options;
        if (configData.price) html += '<br/>Tahmini fiyat: ' + configData.price;
        summary.innerHTML = html;

        // Pre-select teklif type and model
        var modelSelect = document.getElementById('ctModel');
        if (modelSelect && configData.model) {
            for (var i = 0; i < modelSelect.options.length; i++) {
                if (modelSelect.options[i].text === configData.model) {
                    modelSelect.selectedIndex = i;
                    break;
                }
            }
        }

        // Activate teklif type
        var teklifBtn = document.querySelector('.ct-type-btn[data-type="teklif"]');
        if (teklifBtn) teklifBtn.click();
    }

    /* ---- MASTER INIT ---- */
    function initContact() {
        initParticles(document.getElementById('ctParticlesHero'));
        initParticles(document.getElementById('ctParticlesFinal'));
        initFormSwitch();
        initMap();
        initCounters();
        initReveals();
        initMobileSticky();
        initConfigSend();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContact);
    } else {
        initContact();
    }

    // Re-init when contact page is shown via preview nav
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.preview-nav-btn');
        if (btn && btn.dataset.page === 'contact') {
            setTimeout(initContact, 100);
        }
    });
})();
