// script.js
// ╔══════════════════════════════════════════╗
// ║  ULTRA-LUXURY PORTFOLIO — SCRIPT CORE    ║
// ║  Aditya Kumar Singh | 2026               ║
// ╚══════════════════════════════════════════╝

document.addEventListener("DOMContentLoaded", () => {

    /* ─────────────────────────────────────
       GSAP + PLUGINS
    ───────────────────────────────────── */
    gsap.registerPlugin(ScrollTrigger);

    /* ─────────────────────────────────────
       SMOOTH SCROLL (LENIS)
    ───────────────────────────────────── */
    const lenis = new Lenis({
        duration: 1.4,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    /* ─────────────────────────────────────
       CUSTOM CURSOR
    ───────────────────────────────────── */
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-outline');

    if (dot && ring) {
        let mx = 0, my = 0, rx = 0, ry = 0;

        window.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            gsap.to(dot, { x: mx, y: my, duration: 0.06, ease: 'none' });
        });

        (function animateCursor() {
            rx += (mx - rx) * 0.085;
            ry += (my - ry) * 0.085;
            ring.style.left = rx + 'px';
            ring.style.top  = ry + 'px';
            requestAnimationFrame(animateCursor);
        })();

        document.querySelectorAll('a, button, .project-item, .flip-card, .cert-card, .contact-item')
            .forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
            });
    }

    /* ─────────────────────────────────────
       CURSOR TRAIL
    ───────────────────────────────────── */
    const trailContainer = document.querySelector('.cursor-trail-container');
    if (trailContainer) {
        const trailCount = 14;
        const trails = [];
        for (let i = 0; i < trailCount; i++) {
            const d = document.createElement('div');
            d.className = 'cursor-trail-dot';
            const size = Math.max(1, 5 - i * 0.3) + 'px';
            d.style.cssText = `width:${size};height:${size};opacity:${((1 - i / trailCount) * 0.5).toFixed(2)}`;
            trailContainer.appendChild(d);
            trails.push({ el: d, x: 0, y: 0 });
        }
        let tmx = 0, tmy = 0;
        window.addEventListener('mousemove', e => { tmx = e.clientX; tmy = e.clientY; });
        (function animateTrail() {
            let px = tmx, py = tmy;
            trails.forEach(t => {
                const ox = t.x, oy = t.y;
                t.x += (px - t.x) * 0.28;
                t.y += (py - t.y) * 0.28;
                t.el.style.left = t.x + 'px';
                t.el.style.top  = t.y + 'px';
                px = ox; py = oy;
            });
            requestAnimationFrame(animateTrail);
        })();
    }

    /* ─────────────────────────────────────
       CINEMATIC PRELOADER
    ───────────────────────────────────── */
    const preloader = document.querySelector('.preloader');
    const progressBar = document.querySelector('.progress-bar');
    const loaderText = document.querySelector('.loader-text');
    const loaderChars = document.querySelectorAll('.loader-brand .char');

    const tlLoader = gsap.timeline({
        onComplete: () => {
            gsap.to(preloader, {
                yPercent: -100,
                duration: 1.4,
                ease: 'power4.inOut',
                onComplete: () => {
                    preloader.style.display = 'none';
                    document.body.classList.remove('loading');
                    initPageAnimations();
                }
            });
        }
    });

    tlLoader
        .to(loaderChars, {
            y: 0, opacity: 1, stagger: 0.08,
            duration: .9, ease: 'power3.out'
        })
        .to(loaderText, { opacity: 1, y: 0, duration: .5 }, "-=.3")
        .to(progressBar, { width: '100%', duration: 2, ease: 'power2.inOut' }, "-=.4")
        .to(loaderChars, {
            y: '-110%', opacity: 0, stagger: 0.04,
            duration: .6, ease: 'power3.in'
        }, "+=.2")
        .to(loaderText, { opacity: 0, duration: .3 }, "<");

    /* ─────────────────────────────────────
       PAGE SCROLL HEADER
    ───────────────────────────────────── */
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        header?.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* ─────────────────────────────────────
       PARTICLE CANVAS
    ───────────────────────────────────── */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const count = window.innerWidth < 768 ? 40 : 90;
        const particles = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.2 + 0.3,
            sx: (Math.random() - 0.5) * 0.4,
            sy: (Math.random() - 0.5) * 0.4,
            o: Math.random() * 0.45 + 0.05
        }));
        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.sx; p.y += p.sy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,255,255,${p.o})`;
                ctx.fill();
            });
            requestAnimationFrame(drawParticles);
        }
        drawParticles();
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    /* ─────────────────────────────────────
       HERO ANIMATIONS (after preloader)
    ───────────────────────────────────── */
    function initPageAnimations() {
        // Floating actions in
        gsap.to('.floating-actions', {
            opacity: 1, y: 0, duration: .8, ease: 'power3.out', delay: .8
        });

        // Scroll prompt
        gsap.to('.scroll-prompt', {
            opacity: 1, delay: 1.8, duration: 1, ease: 'power3.out'
        });

        // Eyebrow
        gsap.to('.hero-eyebrow', {
            opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: .3
        });

        // Title words
        gsap.to('.title-line .word', {
            y: 0, opacity: 1, stagger: .1, duration: 1.1, ease: 'power4.out', delay: .5
        });

        // Role scroller
        gsap.to('.role-scroller', {
            opacity: 1, duration: .9, ease: 'power2.out', delay: 1.1
        });

        // CTA
        gsap.to('.hero-cta', {
            opacity: 1, y: 0, duration: .8, ease: 'power2.out', delay: 1.3
        });

        // Portrait
        gsap.to('.image-inner', {
            opacity: 1, scale: 1, duration: 1.6, ease: 'power4.out', delay: .4
        });

        // Corner frames animate in
        gsap.from('.image-corner', {
            scale: 0, opacity: 0, stagger: .1, duration: 1, ease: 'power3.out', delay: 1
        });

        /* ── SCROLL ANIMATIONS ── */
        setupScrollAnimations();
    }

    function setupScrollAnimations() {

        // Hero depth parallax on scroll
        gsap.to('.hero-title', {
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
            y: -100, opacity: 0
        });
        gsap.to('.hero-image-wrapper', {
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
            y: 70, scale: .94
        });

        // Magnetic parallax depth on about section
        gsap.to('.about-text-wrap', {
            scrollTrigger: { trigger: '.about-skills', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
            y: -45
        });
        gsap.to('.roles-grid', {
            scrollTrigger: { trigger: '.about-skills', start: 'top bottom', end: 'bottom top', scrub: 2 },
            y: 45
        });

        // Section title reveals
        document.querySelectorAll('.section-title, .subsection-title').forEach(el => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 88%' },
                y: 50, opacity: 0, duration: 1.2, ease: 'power4.out'
            });
        });

        // About description
        gsap.from('.about-desc', {
            scrollTrigger: { trigger: '.about-skills', start: 'top 75%' },
            y: 40, opacity: 0, duration: 1, ease: 'power3.out'
        });

        // Stats counter animation
        document.querySelectorAll('.stat-num').forEach(el => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 85%' },
                scale: .5, opacity: 0, duration: .9, ease: 'back.out(2)'
            });
        });

        // Flip cards
        gsap.from('.flip-card', {
            scrollTrigger: { trigger: '.roles-grid', start: 'top 80%' },
            y: 60, opacity: 0, stagger: .15, duration: .9, ease: 'power3.out'
        });

        // Skill bars
        document.querySelectorAll('.skill-bar-fill').forEach(bar => {
            gsap.to(bar, {
                scrollTrigger: { trigger: bar, start: 'top 88%' },
                width: bar.getAttribute('data-width'),
                duration: 1.6, ease: 'power3.out'
            });
        });

        // Skill bar rows
        gsap.from('.skill-bar-wrap', {
            scrollTrigger: { trigger: '.skill-bars-container', start: 'top 80%' },
            x: -40, opacity: 0, stagger: .12, duration: .8, ease: 'power3.out'
        });

        // Circular progress
        document.querySelectorAll('.circle-progress').forEach(c => {
            const pct = c.getAttribute('data-percent');
            gsap.fromTo(c,
                { strokeDasharray: '0, 100' },
                {
                    scrollTrigger: { trigger: '.circular-skills-container', start: 'top 80%' },
                    strokeDasharray: `${pct}, 100`,
                    duration: 2, ease: 'power4.out'
                }
            );
            // Add neon glow on reveal
            ScrollTrigger.create({
                trigger: '.circular-skills-container', start: 'top 78%',
                onEnter: () => gsap.to(c, { filter: 'drop-shadow(0 0 8px #00ffff)', duration: 1, delay: .5 })
            });
        });

        // Circle items stagger in
        gsap.from('.circle-item', {
            scrollTrigger: { trigger: '.circular-grid', start: 'top 82%' },
            y: 50, opacity: 0, scale: .85, stagger: .2, duration: 1, ease: 'back.out(1.5)'
        });

        // Projects
        document.querySelectorAll('.project-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: { trigger: item, start: 'top 87%' },
                x: i % 2 === 0 ? -60 : 60, opacity: 0, duration: .9, ease: 'power3.out'
            });
        });

        // Certificates
        gsap.from('.cert-card', {
            scrollTrigger: { trigger: '.cert-grid', start: 'top 80%' },
            y: 70, opacity: 0, stagger: .25, duration: 1.2, ease: 'power4.out', scale: .9
        });

        // Contact section
        gsap.from('.contact-info', {
            scrollTrigger: { trigger: '.contact', start: 'top 80%' },
            x: -60, opacity: 0, duration: 1, ease: 'power3.out'
        });
        gsap.from('.contact-form-wrapper', {
            scrollTrigger: { trigger: '.contact', start: 'top 80%' },
            x: 60, opacity: 0, duration: 1, ease: 'power3.out', delay: .2
        });
        gsap.from('.contact-item', {
            scrollTrigger: { trigger: '.contact-details', start: 'top 85%' },
            y: 30, opacity: 0, stagger: .1, duration: .7, ease: 'power3.out'
        });
    }

    /* ─────────────────────────────────────
       3D TILT ON PROJECT ITEMS
    ───────────────────────────────────── */
    document.querySelectorAll('.project-item').forEach(item => {
        item.addEventListener('mousemove', e => {
            const r = item.getBoundingClientRect();
            const rX = ((e.clientY - r.top)  / r.height - .5) * 7;
            const rY = -((e.clientX - r.left) / r.width  - .5) * 7;
            gsap.to(item, { rotateX: rX, rotateY: rY, transformPerspective: 1000, duration: .4, ease: 'power2.out' });
        });
        item.addEventListener('mouseleave', () => {
            gsap.to(item, { rotateX: 0, rotateY: 0, duration: .9, ease: 'power3.out' });
        });
    });

    /* ─────────────────────────────────────
       MAGNETIC BUTTONS
    ───────────────────────────────────── */
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width  / 2);
            const dy = e.clientY - (r.top  + r.height / 2);
            gsap.to(btn, { x: dx * 0.30, y: dy * 0.30, duration: .3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.4)' });
        });
    });

    /* ─────────────────────────────────────
       MAGNETIC FLIP CARDS (SUBTLE TILT)
    ───────────────────────────────────── */
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const rX = ((e.clientY - r.top)  / r.height - .5) * 12;
            const rY = -((e.clientX - r.left) / r.width  - .5) * 12;
            gsap.to(card.querySelector('.flip-card-inner'), {
                rotateX: rX, rotateY: rY, transformPerspective: 800, duration: .4, ease: 'power2.out'
            });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card.querySelector('.flip-card-inner'), {
                rotateX: 0, rotateY: 0, duration: .9, ease: 'power3.out'
            });
        });
    });

    /* ─────────────────────────────────────
       CERT CARD TILT
    ───────────────────────────────────── */
    document.querySelectorAll('.cert-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const rX = ((e.clientY - r.top)  / r.height - .5) * 10;
            const rY = -((e.clientX - r.left) / r.width  - .5) * 10;
            gsap.to(card, { rotateX: rX, rotateY: rY, transformPerspective: 900, duration: .4, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: .9, ease: 'power3.out' });
        });
    });

    /* ─────────────────────────────────────
       CONTACT FORM
    ───────────────────────────────────── */
    const form = document.getElementById('booking-form');
    const msg  = document.querySelector('.form-message');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = form.querySelector('.submit-btn');
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>&nbsp; Sending...';
            btn.style.pointerEvents = 'none';
            setTimeout(() => {
                btn.innerHTML = orig;
                btn.style.pointerEvents = 'auto';
                msg.textContent = "Message sent! I'll respond within 24 hours.";
                msg.className = 'form-message success';
                msg.style.opacity = '1';
                form.reset();
                setTimeout(() => { msg.style.opacity = '0'; }, 5000);
            }, 2000);
        });
    }

});
