/** ============================================================
 *  CARAVAN PREMIUM DARK THEME — Main JavaScript
 *  ============================================================ */
(function () {
    'use strict';

    /* ---------- WAIT FOR DOM ---------- */
    document.addEventListener('DOMContentLoaded', function () {
        initNavbar();
        initMobileMenu();
        initScrollAnimations();
        initFaqAccordion();
        initSmoothScroll();
    });

    /* ==========================================================
     *  NAVBAR — scroll-based solid background
     * ========================================================== */
    function initNavbar() {
        var header = document.querySelector('.cv-header');
        if (!header) return;

        function onScroll() {
            if (window.scrollY > 60) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ==========================================================
     *  MOBILE MENU — hamburger toggle
     * ========================================================== */
    function initMobileMenu() {
        var hamburger = document.querySelector('.cv-hamburger');
        var mobileMenu = document.querySelector('.cv-mobile-menu');
        var closeBtn = document.getElementById('cvMobileClose');
        if (!hamburger || !mobileMenu) return;

        function openMenu() {
            hamburger.classList.add('active');
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
        function closeMenu() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        }

        hamburger.addEventListener('click', function () {
            mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
        });

        if (closeBtn) closeBtn.addEventListener('click', closeMenu);

        // Close on link click
        var links = mobileMenu.querySelectorAll('a');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', closeMenu);
        }
    }

    /* ==========================================================
     *  SCROLL ANIMATIONS — IntersectionObserver fade-up
     * ========================================================== */
    function initScrollAnimations() {
        var elements = document.querySelectorAll('.cv-animate');
        if (!elements.length) return;

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('cv-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px'
            });

            elements.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            // Fallback: just show everything
            elements.forEach(function (el) {
                el.classList.add('cv-visible');
            });
        }
    }

    /* ==========================================================
     *  FAQ ACCORDION
     * ========================================================== */
    function initFaqAccordion() {
        var questions = document.querySelectorAll('.cv-faq-question');
        if (!questions.length) return;

        questions.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var item = btn.closest('.cv-faq-item');
                var isActive = item.classList.contains('active');

                // Close all
                document.querySelectorAll('.cv-faq-item').forEach(function (el) {
                    el.classList.remove('active');
                });

                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    /* ==========================================================
     *  SMOOTH SCROLL for anchor links
     * ========================================================== */
    function initSmoothScroll() {
        var anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;
                var target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

})();

