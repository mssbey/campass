/* ============================================================
   CORPORATE — CINEMATIC BRAND EXPERIENCE JS
   ============================================================ */
(function () {
    'use strict';

    /* ---------- PARTICLES (reusable for entry + manifesto) ---------- */
    function initParticles(canvasEl) {
        if (!canvasEl) return;
        const ctx = canvasEl.getContext('2d');
        let particles = [];
        const COUNT = 50;

        function resize() {
            const rect = canvasEl.parentElement.getBoundingClientRect();
            canvasEl.width = rect.width;
            canvasEl.height = rect.height;
        }
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < COUNT; i++) {
            particles.push({
                x: Math.random() * canvasEl.width,
                y: Math.random() * canvasEl.height,
                r: Math.random() * 1.2 + 0.3,
                dx: (Math.random() - 0.5) * 0.3,
                dy: (Math.random() - 0.5) * 0.3,
                a: Math.random() * 0.5 + 0.15
            });
        }

        let running = true;
        function draw() {
            if (!running) return;
            ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
            particles.forEach(function (p) {
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0) p.x = canvasEl.width;
                if (p.x > canvasEl.width) p.x = 0;
                if (p.y < 0) p.y = canvasEl.height;
                if (p.y > canvasEl.height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(245, 166, 35,' + p.a + ')';
                ctx.fill();
            });
            requestAnimationFrame(draw);
        }
        draw();
        return function () { running = false; };
    }

    /* ---------- DRAG-TO-SCROLL MEDIA ROW ---------- */
    function initDragScroll(el) {
        if (!el) return;
        let isDown = false, startX, scrollLeft;
        el.addEventListener('mousedown', function (e) {
            isDown = true;
            el.style.cursor = 'grabbing';
            startX = e.pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
        });
        el.addEventListener('mouseleave', function () { isDown = false; el.style.cursor = 'grab'; });
        el.addEventListener('mouseup', function () { isDown = false; el.style.cursor = 'grab'; });
        el.addEventListener('mousemove', function (e) {
            if (!isDown) return;
            e.preventDefault();
            var x = e.pageX - el.offsetLeft;
            el.scrollLeft = scrollLeft - (x - startX) * 1.5;
        });
        el.style.cursor = 'grab';
    }

    /* ---------- TIMELINE CAROUSEL ---------- */
    function initTimeline() {
        var track = document.querySelector('.cp-tl-track');
        var items = document.querySelectorAll('.cp-tl-item');
        var yearBtns = document.querySelectorAll('.cp-tl-ybtn');
        var prevBtn = document.querySelector('.cp-tl-prev');
        var nextBtn = document.querySelector('.cp-tl-next');
        if (!track || items.length === 0) return;

        var current = 0;

        function go(idx) {
            if (idx < 0 || idx >= items.length) return;
            current = idx;
            track.style.transform = 'translateX(-' + (current * 100) + 'vw)';
            items.forEach(function (it, i) {
                it.classList.toggle('active', i === current);
            });
            yearBtns.forEach(function (btn, i) {
                btn.classList.toggle('active', i === current);
            });
        }

        yearBtns.forEach(function (btn, i) {
            btn.addEventListener('click', function () { go(i); });
        });

        if (prevBtn) prevBtn.addEventListener('click', function () { go(current - 1); });
        if (nextBtn) nextBtn.addEventListener('click', function () { go(current + 1); });

        go(0);
    }

    /* ---------- INTERSECTION OBSERVER — SECTION REVEALS ---------- */
    function initSectionReveals() {
        var sections = document.querySelectorAll('.cp-dna, .cp-resources, .cp-team, .cp-production, .cp-global, .cp-manifesto');
        if (!sections.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('cp-vis');
                }
            });
        }, { threshold: 0.15 });

        sections.forEach(function (s) { observer.observe(s); });
    }

    /* ---------- INIT ---------- */
    function initCorporate() {
        // Particles
        var entryCanvas = document.querySelector('.cp-entry .cp-particles');
        initParticles(entryCanvas);

        var endCanvas = document.querySelector('.cp-manifesto .cp-particles-end');
        if (endCanvas) initParticles(endCanvas);

        // Drag scroll
        var mediaRow = document.querySelector('.cp-media-row');
        initDragScroll(mediaRow);

        // Timeline
        initTimeline();

        // Section reveals
        initSectionReveals();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCorporate);
    } else {
        initCorporate();
    }
})();
