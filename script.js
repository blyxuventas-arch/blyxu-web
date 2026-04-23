// URLs de destino
const urlAppSheetMayorista = "https://www.appsheet.com/start/89d7e4bb-f484-4a49-bb80-d24ff40f6b4b";
const urlAppSheetDetal = "https://www.appsheet.com/start/f65365e0-8f0b-4ad9-bb0e-956ee8798d6b";

document.addEventListener('DOMContentLoaded', () => {

    // ===== PARTICLES =====
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        window.addEventListener('resize', resize);
        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2 + .5,
                dx: (Math.random() - .5) * .4,
                dy: (Math.random() - .5) * .4,
                o: Math.random() * .4 + .1
            });
        }
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.dx; p.y += p.dy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(199,125,255,${p.o})`;
                ctx.fill();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        // Active link
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 200) current = s.getAttribute('id');
        });
        navLinks.forEach(l => {
            l.classList.remove('active');
            if (l.getAttribute('href') === '#' + current) l.classList.add('active');
        });
    });

    // ===== MOBILE MENU =====
    const toggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-links');
    if (toggle) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
        navMenu.querySelectorAll('.nav-link').forEach(l => {
            l.addEventListener('click', () => {
                toggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // ===== SCROLL REVEAL =====
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    // ===== COUNTER ANIMATION =====
    document.querySelectorAll('.stat-number[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const io = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                let current = 0;
                const step = Math.ceil(target / 60);
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) { current = target; clearInterval(timer); }
                    el.textContent = current >= 1000 ? '+' + (current / 1000).toFixed(0) + 'k' : current;
                }, 25);
                io.unobserve(el);
            }
        }, { threshold: 0.5 });
        io.observe(el);
    });

    // ===== LOGIN FORMS =====
    const formDetal = document.getElementById('form-detal');
    const formMayorista = document.getElementById('form-mayorista');

    function handleLogin(form, passId, errorId, password, url) {
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const pass = document.getElementById(passId).value;
            const err = document.getElementById(errorId);
            if (pass !== password) { err.style.display = 'block'; return; }
            err.style.display = 'none';

            // Para Safari: abrir la ventana sincrónicamente durante el evento del usuario
            const newWindow = window.open('about:blank', '_blank');

            const btn = form.querySelector('.btn-catalog');
            const original = btn.querySelector('span').textContent;
            btn.querySelector('span').textContent = 'Conectando...';
            btn.style.opacity = '.7';
            btn.style.cursor = 'wait';
            
            setTimeout(() => {
                if (newWindow) {
                    newWindow.location.href = url;
                } else {
                    // Fallback por si el navegador bloquea la ventana
                    window.location.href = url; 
                }
                
                // Restaurar el botón
                btn.querySelector('span').textContent = original;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                form.reset();
            }, 1000);
        });
    }

    handleLogin(formDetal, 'pass-detal', 'error-detal', '26', urlAppSheetDetal);
    handleLogin(formMayorista, 'pass-mayorista', 'error-mayorista', '53', urlAppSheetMayorista);

    // ===== LIVE CLOCK & STATUS =====
    function updateClock() {
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes();
        const s = now.getSeconds();
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        const timeStr = `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
        const clockEl = document.getElementById('live-clock');
        const statusEl = document.getElementById('clock-status');
        if (clockEl) clockEl.textContent = timeStr;

        // Check if open (Mon-Sat, 10AM-6PM)
        const day = now.getDay(); // 0=Sun
        const isWeekday = day >= 1 && day <= 6;
        const isOpen = isWeekday && h >= 10 && h < 18;

        if (statusEl) {
            const dot = statusEl.querySelector('.status-dot');
            const label = statusEl.querySelector('span:last-child');
            if (isOpen) {
                dot.classList.remove('closed-dot');
                label.textContent = 'Abierto Ahora';
                label.style.color = '#25D366';
            } else {
                dot.classList.add('closed-dot');
                label.textContent = 'Cerrado';
                label.style.color = '#ff6b6b';
            }
        }
    }
    updateClock();
    setInterval(updateClock, 1000);

    // ===== ANIMATED BARS =====
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.bar-fill');
                fills.forEach(fill => {
                    const w = fill.dataset.width || 0;
                    fill.style.setProperty('--target-width', w + '%');
                    fill.classList.add('animated');
                });
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.schedule-bar-item').forEach(el => barObserver.observe(el));
});
