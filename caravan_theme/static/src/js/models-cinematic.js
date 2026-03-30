/** ============================================================
 *  MODELS CINEMATIC EXPERIENCE �?" Scroll Engine + Interactions
 *  ============================================================ */
(function () {
    'use strict';

    /* ============================
     * CONFIG
     * ============================ */
    var MODELS = [
        { id: 'ws1', name: 'WS1', price: '�,�1.250.000', power: '800W', battery: 'Lithium', water: '245L', cap: '4 Ki�Yi', img: 'static/src/img/caravan-1.png' },
        { id: 'ts1', name: 'TS1', price: '�,�980.000', power: '600W', battery: 'Lithium', water: '200L', cap: '4 Ki�Yi', img: 'static/src/img/caravan-2.png' },
        { id: 's1', name: 'S1', price: '�,�750.000', power: '400W', battery: 'Lithium', water: '160L', cap: '2 Ki�Yi', img: 'static/src/img/caravan-3.png' },
        { id: 'cr555', name: 'CR555', price: '�,�1.450.000', power: '1000W', battery: 'Lithium', water: '300L', cap: '4 Ki�Yi', img: 'static/src/img/caravan-4.png' },
        { id: 'cr650', name: 'CR650', price: '�,�1.680.000', power: '1200W', battery: 'Lithium', water: '350L', cap: '6 Ki�Yi', img: 'static/src/img/caravan-5.png' },
        { id: 'x1pro', name: 'X1 PRO', price: '�,�2.100.000', power: '1500W', battery: 'Lithium', water: '400L', cap: '4 Ki�Yi', img: 'static/src/img/caravan-6.png' }
    ];

    var currentScene = 0;
    var scenes = [];
    var isTransitioning = false;
    var wizardAnswers = {};
    var wizardStep = 0;

    /* ============================
     * INIT
     * ============================ */
    document.addEventListener('DOMContentLoaded', function () {
        scenes = document.querySelectorAll('.mx-scene');
        if (!scenes.length) return;

        initParticles('mxParticles');
        initParticles('mxParticles2');
        initSceneBackgrounds();
        initScrollEngine();
        initNavDots();
        initCompareMode();
        initWizard();
        initFleetObserver();
        goToScene(0, true);
    });

    /* ============================
     * PARTICLE SYSTEM
     * ============================ */
    function initParticles(canvasId) {
        var canvas = document.getElementById(canvasId);
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var particles = [];
        var count = 60;
        var w, h;

        function resize() {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        for (var i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.5 + 0.3,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.2 - 0.1,
                a: Math.random() * 0.4 + 0.1
            });
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(245, 166, 35, ' + p.a + ')';
                ctx.fill();
            }
            requestAnimationFrame(draw);
        }

        draw();
    }

    /* ============================
     * SCENE BACKGROUNDS
     * ============================ */
    function initSceneBackgrounds() {
        scenes.forEach(function (s) {
            var bg = s.getAttribute('data-bg');
            if (bg) {
                s.querySelector('.mx-scene-bg').style.backgroundImage = 'url(' + bg + ')';
            }
        });
    }

    /* ============================
     * SCROLL ENGINE �?" Wheel / Touch / Keyboard
     * ============================ */
    function initScrollEngine() {
        var scenesContainer = document.getElementById('mxScenes');
        var entrySection = document.getElementById('mxEntry');
        var lastWheelTime = 0;
        var touchStartY = 0;
        var touchStartX = 0;
        var DEBOUNCE = 500;
        var DELTA_THRESHOLD = 20;

        // Wheel-driven scene navigation
        window.addEventListener('wheel', function (e) {
            if (!isModelsPageActive()) return;

            var rect = scenesContainer.getBoundingClientRect();
            // Scenes container is in view when its top is near or above viewport top
            // and its bottom is near or below viewport bottom
            var inScenes = rect.top <= 50 && rect.bottom >= window.innerHeight * 0.5;

            // Allow natural scroll in entry section
            if (entrySection) {
                var entryRect = entrySection.getBoundingClientRect();
                if (entryRect.bottom > 100 && e.deltaY > 0) {
                    return; // let natural scroll handle entry �?' scenes transition
                }
            }

            if (!inScenes) return;

            // Debounce rapid wheel events
            var now = Date.now();
            if (now - lastWheelTime < DEBOUNCE) {
                e.preventDefault();
                return;
            }

            if (e.deltaY > DELTA_THRESHOLD) {
                // scroll down �?" next scene
                if (currentScene < scenes.length - 1) {
                    e.preventDefault();
                    lastWheelTime = now;
                    goToScene(currentScene + 1);
                }
                // If at last scene, let natural scroll go to fleet
            } else if (e.deltaY < -DELTA_THRESHOLD) {
                // scroll up �?" previous scene
                if (currentScene > 0) {
                    e.preventDefault();
                    lastWheelTime = now;
                    goToScene(currentScene - 1);
                }
                // If at first scene, let natural scroll go back to entry
            }
        }, { passive: false });

        // Touch support
        window.addEventListener('touchstart', function (e) {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        window.addEventListener('touchend', function (e) {
            if (!isModelsPageActive()) return;

            var rect = scenesContainer.getBoundingClientRect();
            var inScenes = rect.top <= 50 && rect.bottom >= window.innerHeight * 0.5;
            if (!inScenes) return;

            var dy = touchStartY - e.changedTouches[0].clientY;
            var dx = touchStartX - e.changedTouches[0].clientX;

            // Only vertical swipes
            if (Math.abs(dy) < 50 || Math.abs(dx) > Math.abs(dy)) return;

            if (dy > 0 && currentScene < scenes.length - 1) {
                goToScene(currentScene + 1);
            } else if (dy < 0 && currentScene > 0) {
                goToScene(currentScene - 1);
            }
        }, { passive: true });

        // Keyboard
        window.addEventListener('keydown', function (e) {
            if (!isModelsPageActive()) return;
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                if (currentScene < scenes.length - 1) goToScene(currentScene + 1);
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                if (currentScene > 0) goToScene(currentScene - 1);
            }
        });
    }

    /* ============================
     * SCENE TRANSITION
     * ============================ */
    function goToScene(idx, instant) {
        if (idx < 0 || idx >= scenes.length) return;
        if (isTransitioning && !instant) return;

        isTransitioning = true;
        currentScene = idx;

        scenes.forEach(function (s, i) {
            if (i === idx) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });

        // Update counter
        var counterCurrent = document.querySelector('.mx-counter-current');
        if (counterCurrent) {
            counterCurrent.textContent = String(idx + 1).padStart(2, '0');
        }

        // Update progress bar
        var progressBar = document.getElementById('mxProgressBar');
        if (progressBar) {
            var pct = ((idx + 1) / scenes.length) * 100;
            progressBar.style.width = pct + '%';
        }

        // Update nav dots
        var dots = document.querySelectorAll('.mx-dot');
        dots.forEach(function (d, i) {
            d.classList.toggle('active', i === idx);
        });

        setTimeout(function () {
            isTransitioning = false;
        }, instant ? 0 : 600);
    }

    /* ============================
     * NAV DOTS
     * ============================ */
    function initNavDots() {
        var dots = document.querySelectorAll('.mx-dot');
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var idx = parseInt(dot.getAttribute('data-idx'), 10);
                goToScene(idx);
            });
        });
    }

    /* ============================
     * FLEET SECTION OBSERVER
     * ============================ */
    function initFleetObserver() {
        var fleet = document.getElementById('mxFleet');
        if (!fleet) return;

        if ('IntersectionObserver' in window) {
            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) {
                    if (e.isIntersecting) {
                        fleet.classList.add('mx-visible');
                        obs.unobserve(fleet);
                    }
                });
            }, { threshold: 0.15 });
            obs.observe(fleet);
        } else {
            fleet.classList.add('mx-visible');
        }
    }

    /* ============================
     * COMPARE MODE
     * ============================ */
    function initCompareMode() {
        var fab = document.getElementById('mxCompareFab');
        var overlay = document.getElementById('mxCompare');
        var closeBtn = document.getElementById('mxCompareClose');
        var selLeft = document.getElementById('mxCompLeft');
        var selRight = document.getElementById('mxCompRight');

        if (!fab || !overlay) return;

        // Populate selects
        MODELS.forEach(function (m, i) {
            var opt1 = document.createElement('option');
            opt1.value = i;
            opt1.textContent = m.name;
            selLeft.appendChild(opt1);

            var opt2 = document.createElement('option');
            opt2.value = i;
            opt2.textContent = m.name;
            selRight.appendChild(opt2);
        });

        selLeft.value = '0';
        selRight.value = '1';

        fab.addEventListener('click', function () {
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            renderCompare();
        });

        closeBtn.addEventListener('click', function () {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        });

        selLeft.addEventListener('change', renderCompare);
        selRight.addEventListener('change', renderCompare);

        function renderCompare() {
            var l = MODELS[parseInt(selLeft.value, 10)];
            var r = MODELS[parseInt(selRight.value, 10)];
            var grid = document.getElementById('mxCompareGrid');

            var specs = [
                { label: 'Güne�Y Paneli', key: 'power' },
                { label: 'Batarya', key: 'battery' },
                { label: 'Su Kapasitesi', key: 'water' },
                { label: 'Kapasite', key: 'cap' },
                { label: 'Fiyat', key: 'price' }
            ];

            var html = '';

            // Headers
            html += '<div class="mx-comp-header"><img src="' + l.img + '" alt="' + l.name + '"/><h4>' + l.name + '</h4><div class="price">' + l.price + '</div></div>';
            html += '<div class="mx-comp-header" style="display:flex;align-items:center;justify-content:center;"><span class="mx-compare-vs" style="font-size:2rem;">VS</span></div>';
            html += '<div class="mx-comp-header"><img src="' + r.img + '" alt="' + r.name + '"/><h4>' + r.name + '</h4><div class="price">' + r.price + '</div></div>';

            // Spec rows
            specs.forEach(function (sp) {
                var lv = l[sp.key];
                var rv = r[sp.key];
                var lNum = parseFloat(lv);
                var rNum = parseFloat(rv);
                var lBetter = !isNaN(lNum) && !isNaN(rNum) && lNum > rNum;
                var rBetter = !isNaN(lNum) && !isNaN(rNum) && rNum > lNum;

                html += '<div class="mx-comp-cell left' + (lBetter ? ' better' : '') + '"><div><div class="val">' + lv + '</div></div></div>';
                html += '<div class="mx-comp-cell center">' + sp.label + '</div>';
                html += '<div class="mx-comp-cell right' + (rBetter ? ' better' : '') + '"><div><div class="val">' + rv + '</div></div></div>';
            });

            grid.innerHTML = html;
        }
    }

    /* ============================
     * AI WIZARD
     * ============================ */
    function initWizard() {
        var wizard = document.getElementById('mxWizard');
        if (!wizard) return;

        var steps = wizard.querySelectorAll('.mx-wiz-step');
        var pips = document.querySelectorAll('.mx-wiz-pip');
        var result = document.getElementById('mxWizResult');
        var resetBtn = document.getElementById('mxWizReset');

        wizard.addEventListener('click', function (e) {
            var btn = e.target.closest('.mx-wiz-opt');
            if (!btn) return;

            var key = btn.getAttribute('data-key');
            var val = btn.getAttribute('data-val');
            wizardAnswers[key] = val;

            // Mark selected
            btn.parentElement.querySelectorAll('.mx-wiz-opt').forEach(function (b) { b.classList.remove('selected'); });
            btn.classList.add('selected');

            // Auto-advance after 400ms
            setTimeout(function () {
                wizardStep++;
                if (wizardStep < steps.length) {
                    steps.forEach(function (s, i) {
                        s.classList.remove('active', 'done');
                        if (i < wizardStep) s.classList.add('done');
                        if (i === wizardStep) s.classList.add('active');
                    });
                    pips.forEach(function (p, i) {
                        p.classList.remove('active', 'done');
                        if (i < wizardStep) p.classList.add('done');
                        if (i === wizardStep) p.classList.add('active');
                    });
                } else {
                    // Show result
                    steps.forEach(function (s) { s.classList.remove('active'); s.classList.add('done'); });
                    showWizardResult();
                }
            }, 400);
        });

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                wizardStep = 0;
                wizardAnswers = {};
                result.classList.remove('active');
                steps.forEach(function (s, i) {
                    s.classList.remove('active', 'done');
                    if (i === 0) s.classList.add('active');
                    s.querySelectorAll('.mx-wiz-opt').forEach(function (b) { b.classList.remove('selected'); });
                });
                pips.forEach(function (p, i) {
                    p.classList.remove('active', 'done');
                    if (i === 0) p.classList.add('active');
                });
            });
        }
    }

    function showWizardResult() {
        var result = document.getElementById('mxWizResult');
        var nameEl = document.getElementById('mxResultName');
        var reasonEl = document.getElementById('mxResultReason');

        // Simple matching logic
        var people = wizardAnswers.people || '4';
        var terrain = wizardAnswers.terrain || 'mixed';
        var budget = wizardAnswers.budget || 'mid';

        var pick;

        if (budget === 'low') {
            pick = people <= 2 ? MODELS[2] : MODELS[1]; // S1 or TS1
        } else if (budget === 'high') {
            if (terrain === 'offroad') {
                pick = MODELS[3]; // CR555
            } else if (people >= 5) {
                pick = MODELS[4]; // CR650
            } else {
                pick = MODELS[5]; // X1 PRO
            }
        } else {
            // mid budget
            if (terrain === 'offroad') {
                pick = MODELS[3]; // CR555
            } else if (people >= 5) {
                pick = MODELS[4]; // CR650
            } else {
                pick = MODELS[0]; // WS1
            }
        }

        var reasons = {
            'WS1': 'Dengeli performans, off-grid yetenekler ve üstün mühendislik ile en popüler seçim.',
            'TS1': 'Kompakt yapısı ve uygun fiyatı ile �Yehir ve kısa mesafe seyahatler için ideal.',
            'S1': 'Bütçe dostu ba�Ylangıç modeli, çiftler ve solo gezginler için mükemmel.',
            'CR555': 'Arazi performansı odaklı, off-road maceraları için tasarlanmı�Y güçlü karavan.',
            'CR650': 'Geni�Y iç mekanı ile kalabalık aileler için maksimum konfor sunan model.',
            'X1 PRO': 'Premium donanım, en yüksek teknoloji ve lüks iç mekan deneyimi.'
        };

        nameEl.textContent = pick.name;
        reasonEl.textContent = reasons[pick.name] || '';

        result.classList.add('active');
    }

    /* ============================
     * HELPERS
     * ============================ */
    function isModelsPageActive() {
        var page = document.getElementById('page-models');
        return page && page.classList.contains('active');
    }

})();
