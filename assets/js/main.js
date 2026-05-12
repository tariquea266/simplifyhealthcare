// ========================================
// Simplify Healthcare - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initHeroCounters();
    initScrollAnimations();
    initPasSection();
    initCertSlider();
    initScrollTopButton();
    initLazyLoader();
});


// ========================================
// Header — Scroll Shadow Effect
// ========================================

function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.pageYOffset > 50);
    }, { passive: true });
}


// ========================================
// Mobile Menu — Hamburger Toggle
// ========================================

function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('navMenu');
    if (!hamburger || !navMenu) return;

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open navigation menu');
    }

    hamburger.addEventListener('click', function () {
        const isOpen = navMenu.classList.contains('active');

        if (isOpen) {
            closeMenu();
        } else {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            document.body.classList.add('menu-open');
            hamburger.setAttribute('aria-expanded', 'true');
            hamburger.setAttribute('aria-label', 'Close navigation menu');
        }
    });

    // Close on nav link click
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMenu();
        }
    });
}


// ========================================
// Smooth Scroll — Anchor Links
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerOffset  = 80;
            const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        });
    });
}


// ========================================
// Hero Stats — Counter Animation
// Targets: .stat-number[data-target]
// ========================================

function initHeroCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            const el     = entry.target;
            const target = parseInt(el.getAttribute('data-target'), 10);
            const steps  = 200;
            const inc    = target / steps;
            let current  = 0;

            function tick() {
                current += inc;
                if (current < target) {
                    el.textContent = Math.ceil(current);
                    setTimeout(tick, 20);
                } else {
                    el.textContent = target;
                }
            }

            tick();
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
        observer.observe(el);
    });
}


// ========================================
// Scroll Animations — Fade-in on Enter
// ========================================

function initScrollAnimations() {
    const elements = document.querySelectorAll(
        '.hero-text, .hero-video, .stat-card, .feature-card, .section-header, .cta-content'
    );
    if (!elements.length) return;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(function (el, index) {
        el.style.opacity    = '0';
        el.style.transform  = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease ' + (index * 0.1) + 's, transform 0.6s ease ' + (index * 0.1) + 's';
        observer.observe(el);
    });
}


// ========================================
// Proven At Scale — Stats + Badges Animation
// Targets: #pasSection, .pas-stat, .pas-badge,
//          .pas-stat__counter[data-target]
// ========================================

function initPasSection() {
    const section = document.getElementById('pasSection');
    if (!section) return;

    function animateCounter(el) {
        const target   = parseInt(el.dataset.target, 10);
        const suffix   = el.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();

        function update(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target + suffix;
            }
        }

        requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            // Animate stat cards
            document.querySelectorAll('.pas-stat').forEach(function (card) {
                const delay = parseInt(card.dataset.delay, 10) || 0;
                setTimeout(function () {
                    card.classList.add('pas-stat--visible');
                    const counter = card.querySelector('.pas-stat__counter');
                    if (counter) animateCounter(counter);
                }, delay);
            });

            // Animate badges (with offset delay)
            document.querySelectorAll('.pas-badge').forEach(function (badge) {
                const delay = parseInt(badge.dataset.delay, 10) || 0;
                setTimeout(function () {
                    badge.classList.add('pas-badge--visible');
                }, 600 + delay);
            });

            observer.unobserve(entry.target);
        });
    }, { threshold: 0.2 });

    observer.observe(section);
}


// ========================================
// Certification Slider — Auto-scroll Carousel
// Targets: #slider, #sliderContainer
// ========================================

var certifications = [
    {
        id: 1,
        iconType: 'chart',
        title: 'IDC MarketScape',
        subtitle: 'LEADER',
        subtitleColor: '#22c55e',
        description: 'Benefits Administration'
    },
    {
        id: 2,
        iconType: 'building',
        title: 'IDC MarketScape',
        subtitle: 'LEADER',
        subtitleColor: '#22c55e',
        description: 'Provider Data Management'
    },
    {
        id: 3,
        iconType: 'hitrust',
        title: 'HITRUST',
        badge: 'CSF CERTIFIED',
        badgeColor: '#fef3c7',
        badgeTextColor: '#d97706'
    },
    {
        id: 4,
        iconType: 'shield',
        title: 'SOC 2 SOC 1',
        subtitle: 'Type II',
        subtitleColor: '#64748b',
        bottomText: 'CERTIFIED',
        bottomTextColor: '#94a3b8'
    },
    {
        id: 5,
        iconType: 'iso',
        title: '27001',
        subtitle: 'CERTIFIED',
        subtitleColor: '#22c55e'
    },
    {
        id: 6,
        iconType: 'inc',
        title: 'INC. 5000',
        titleColor: '#ea580c',
        subtitle: 'Fastest growing companies',
        subtitleColor: '#64748b'
    },
    {
        id: 7,
        iconType: 'deloitte',
        title: 'FAST 500',
        titleColor: '#1e40af',
        bottomText: '2023 WINNER',
        bottomTextColor: '#22c55e'
    }
];

function getSliderIcon(iconType) {
    var icons = {
        chart:    '<img src="assets/images/IDC_logo.svg" alt="IDC logo" width="120">',
        building: '<img src="assets/images/IDC_logo.svg" alt="IDC logo" width="120">',
        hitrust:  '<img src="assets/images/certification-HITRUST-CSF.webp" alt="HITRUST CSF Certified" width="120">',
        shield:   '<img src="assets/images/soc-2-soc-1-certified-tune.png" alt="SOC 2 SOC 1 Certified" width="140">',
        iso:      '<img src="assets/images/ISO_27001_Final-Logo.jpg" alt="ISO 27001 Certified" width="70">',
        inc:      '<img src="assets/images/Inc.-5000-Color-Medallion-Logo.png" alt="Inc logo" width="70">',
        deloitte: '<img src="assets/images/deloitte-fast500-2023-logo.png" alt="Deloitte Fast 500 2023" width="90">'
    };
    return icons[iconType] || '';
}

function createSliderCard(cert) {
    var html = '<div class="cert-card">';
    html += '<div class="cert-icon-wrapper">' + getSliderIcon(cert.iconType) + '</div>';
    html += '<h3 class="cert-title" style="color:' + (cert.titleColor || '#1e293b') + '">' + cert.title + '</h3>';

    if (cert.badge) {
        html += '<span class="cert-badge" style="background-color:' + cert.badgeColor + ';color:' + cert.badgeTextColor + '">' + cert.badge + '</span>';
    }
    if (cert.subtitle) {
        html += '<p class="cert-subtitle" style="color:' + cert.subtitleColor + '">' + cert.subtitle + '</p>';
    }
    if (cert.description) {
        html += '<p class="cert-description">' + cert.description + '</p>';
    }
    if (cert.bottomText) {
        html += '<p class="cert-bottom-text" style="color:' + cert.bottomTextColor + '">' + cert.bottomText + '</p>';
    }

    html += '</div>';
    return html;
}

function initCertSlider() {
    var slider          = document.getElementById('slider');
    var sliderContainer = document.getElementById('sliderContainer');
    if (!slider || !sliderContainer) return;

    // Build cards (duplicated for seamless infinite loop)
    var cardsHTML = certifications.map(createSliderCard).join('');
    slider.innerHTML = cardsHTML + cardsHTML;

    var position   = 0;
    var isPaused   = false;
    var cardWidth  = 220;
    var gap        = 24;
    var totalWidth = (cardWidth + gap) * certifications.length;
    var speed      = .6;

    function animate() {
        if (!isPaused) {
            position -= speed;
            if (Math.abs(position) >= totalWidth) {
                position = 0;
            }
            slider.style.transform = 'translateX(' + position + 'px)';
        }
        requestAnimationFrame(animate);
    }

    animate();

    // Pause on hover (pointer + focus)
    sliderContainer.addEventListener('mouseenter',  function () { isPaused = true; });
    sliderContainer.addEventListener('mouseleave',  function () { isPaused = false; });
    sliderContainer.addEventListener('focusin',     function () { isPaused = true; });
    sliderContainer.addEventListener('focusout',    function () { isPaused = false; });
}


// ========================================
// Scroll-to-Top Button
// Targets: #scrollTopBtn  (.visible class from SCSS)
// ========================================

function initScrollTopButton() {
    var btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', function () {
        var scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        btn.classList.toggle('visible', scrolled >= 0.10);
    }, { passive: true });

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


// ========================================
// Lazy Loader — data-src Images
// ========================================

function initLazyLoader() {
    var images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            });
        });
        images.forEach(function (img) { observer.observe(img); });
    } else {
        // Fallback for older browsers
        images.forEach(function (img) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

