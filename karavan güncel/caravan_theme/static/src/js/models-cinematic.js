/** ============================================================
 *  MODELS CINEMATIC EXPERIENCE �?" Scroll Engine + Interactions
 *  ============================================================ */
(function () {
    'use strict';

    /* ============================
     * CONFIG
     * ============================ */
    var MODELS = [
        { id: 'cr400j', name: 'CR400 Journey', price: '12.900 \u20AC', weight: '~450 kg', volume: '4 m\u00B3', cap: '2 Ki\u015Fi', length: '4.440 mm', img: '/caravan_theme/static/src/img/model-cr400j.png' },
        { id: 'cr400', name: 'CR400', price: '14.900 \u20AC', weight: '450 kg', volume: '4 m\u00B3', cap: '2 Ki\u015Fi', length: '750 kg', img: '/caravan_theme/static/src/img/model-cr400.png' },
        { id: 'cr455', name: 'CR455', price: '34.800 \u20AC', weight: '1.050 kg', volume: '15 m\u00B3', cap: '4 Ki\u015Fi', length: '6.060 mm', img: '/caravan_theme/static/src/img/model-cr455.webp' },
        { id: 'cr550', name: 'CR550', price: '33.980 \u20AC', weight: '1.000 kg', volume: '15 m\u00B3', cap: '4 Ki\u015Fi', length: '5.520 mm', img: '/caravan_theme/static/src/img/model-cr550.webp' },
        { id: 'cr550i', name: 'CR550i', price: '33.980 \u20AC', weight: '1.000 kg', volume: '15 m\u00B3', cap: '2 Ki\u015Fi', length: '5.520 mm', img: '/caravan_theme/static/src/img/model-cr550i.png' },
        { id: 'cr555', name: 'CR555', price: '38.900 \u20AC', weight: '1.100 kg', volume: '20 m\u00B3', cap: '4 Ki\u015Fi', length: '5.940 mm', img: '/caravan_theme/static/src/img/model-cr555.png' },
        { id: 'cr650', name: 'CR650', price: '41.900 \u20AC', weight: '1.150 kg', volume: '17.5 m\u00B3', cap: '4 Ki\u015Fi', length: '6.960 mm', img: '/caravan_theme/static/src/img/model-cr650.webp' }
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
                { label: 'Bo\u015F A\u011F\u0131rl\u0131k', key: 'weight' },
                { label: '\u0130\u00E7 Hacim', key: 'volume' },
                { label: 'Kapasite', key: 'cap' },
                { label: 'Uzunluk', key: 'length' },
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
        var linkEl = document.getElementById('mxResultLink');

        // Simple matching logic
        var people = wizardAnswers.people || '4';
        var terrain = wizardAnswers.terrain || 'mixed';
        var budget = wizardAnswers.budget || 'mid';

        var pick;

        if (budget === 'low') {
            pick = people <= 2 ? MODELS[0] : MODELS[1]; // CR400 Journey or CR400
        } else if (budget === 'high') {
            if (terrain === 'offroad') {
                pick = MODELS[2]; // CR455
            } else if (people >= 5) {
                pick = MODELS[6]; // CR650
            } else {
                pick = MODELS[5]; // CR555
            }
        } else {
            // mid budget
            if (terrain === 'offroad') {
                pick = MODELS[2]; // CR455
            } else if (people >= 5) {
                pick = MODELS[3]; // CR550
            } else {
                pick = MODELS[4]; // CR550i
            }
        }

        var reasons = {
            'CR400 Journey': 'Kompakt yap\u0131s\u0131 ve hafifli\u011Fi ile \u00F6zg\u00FCr ke\u015Fif i\u00E7in ideal ba\u015Flang\u0131\u00E7 modeli.',
            'CR400': '\u00D6zg\u00FCrl\u00FC\u011F\u00FCn anahtar\u0131 \u2013 macera burada ba\u015Fl\u0131yor. B\u00FCtçe dostu se\u00E7enek.',
            'CR455': 'Arazi performans\u0131 odakl\u0131, off-road maceralar\u0131 i\u00E7in tasarlanm\u0131\u015F g\u00FC\u00E7l\u00FC karavan.',
            'CR550': 'Macera, konfor ve g\u00FCvenilirlik bir arada. Aileler i\u00E7in m\u00FCkemmel.',
            'CR550i': 'Kompakt ve \u015F\u0131k tasar\u0131m\u0131 ile \u00E7iftler i\u00E7in ideal.',
            'CR555': 'Geni\u015F ya\u015Fam alan\u0131, g\u00FC\u00E7l\u00FC off-road performans\u0131 ve premium donan\u0131m.',
            'CR650': 'L\u00FCks ve konforun m\u00FCkemmel bulu\u015Fmas\u0131. En geni\u015F model.'
        };

        nameEl.textContent = pick.name;
        reasonEl.textContent = reasons[pick.name] || '';

        if (linkEl) {
            linkEl.href = '/model/' + pick.id;
        }

        result.classList.add('active');
    }

    /* ============================
     * HELPERS
     * ============================ */
    function isModelsPageActive() {
        return !!document.getElementById('mxScenes');
    }

})();
