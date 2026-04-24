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

            const btn = form.querySelector('.btn-catalog');
            const original = btn.querySelector('span').textContent;
            btn.querySelector('span').textContent = 'Cargando...';
            btn.style.opacity = '.7';
            btn.style.cursor = 'wait';
            
            setTimeout(() => {
                const contenedor = document.getElementById('contenedor-catalogo');
                if (contenedor) {
                    contenedor.innerHTML = ''; // Limpiar contenedor
                    
                    // Ocultar la sección general de la landing page
                    const secciones = document.querySelectorAll('section, footer, .hero-scroll-indicator');
                    secciones.forEach(sec => sec.style.display = 'none');
                    
                    // Evitar el scroll y el rebote en iOS (Swipe Back)
                    document.body.style.overflow = 'hidden';
                    document.documentElement.style.overscrollBehavior = 'none';
                    document.body.style.overscrollBehavior = 'none';
                    
                    // Bloquear el gesto de deslizar desde el borde izquierdo (iOS)
                    window.blockEdgeSwipe = function(e) {
                        if (e.touches[0].pageX < 30) {
                            e.preventDefault();
                        }
                    };
                    document.addEventListener('touchstart', window.blockEdgeSwipe, { passive: false });
                    
                    // Ajustar el contenedor para que actúe como un fondo de marco
                    contenedor.style.position = 'relative';
                    contenedor.style.width = '100%';
                    contenedor.style.marginTop = '60px'; 
                    contenedor.style.padding = window.innerWidth < 768 ? '10px' : '20px';
                    contenedor.style.display = 'flex';
                    contenedor.style.flexDirection = 'column';
                    contenedor.style.alignItems = 'center';
                    contenedor.style.boxSizing = 'border-box';
                    contenedor.style.zIndex = '100';
                    
                    // Función para ajustar la altura perfecta sin que se corte en Android
                    const ajustarAltura = () => {
                        if(contenedor.style.display !== 'none') {
                            contenedor.style.height = (window.innerHeight - 60) + 'px';
                        }
                    };
                    ajustarAltura();
                    window.addEventListener('resize', ajustarAltura);
                    
                    // Contenedor para el botón de cerrar (Header del marco)
                    const headerMarco = document.createElement('div');
                    headerMarco.style.width = '100%';
                    headerMarco.style.maxWidth = '1200px';
                    headerMarco.style.display = 'flex';
                    headerMarco.style.justifyContent = 'flex-end';
                    headerMarco.style.marginBottom = '10px';
                    
                    const closeBtn = document.createElement('button');
                    closeBtn.id = 'btn-cerrar-catalogo';
                    closeBtn.innerHTML = '← Volver al Inicio';
                    closeBtn.style.padding = '8px 16px';
                    closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    closeBtn.style.color = 'white';
                    closeBtn.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                    closeBtn.style.borderRadius = '8px';
                    closeBtn.style.cursor = 'pointer';
                    closeBtn.style.fontWeight = 'bold';
                    closeBtn.style.fontFamily = '"Outfit", sans-serif';
                    closeBtn.style.transition = 'all 0.3s ease';
                    
                    closeBtn.onmouseover = () => { 
                        closeBtn.style.backgroundColor = '#ff6b6b'; 
                        closeBtn.style.borderColor = '#ff6b6b';
                    };
                    closeBtn.onmouseout = () => { 
                        closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; 
                        closeBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    };

                    closeBtn.onclick = function() {
                        window.catalogForceOpen = false;
                        window.history.back(); // Limpiar el historial para no dejar estados basura
                        
                        // Restaurar la vista general
                        contenedor.innerHTML = '';
                        contenedor.style.display = 'none';
                        
                        // Restaurar los comportamientos del scroll
                        document.body.style.overflow = ''; 
                        document.documentElement.style.overscrollBehavior = '';
                        document.body.style.overscrollBehavior = '';
                        document.removeEventListener('touchstart', window.blockEdgeSwipe);
                        window.removeEventListener('resize', ajustarAltura);
                        
                        secciones.forEach(sec => sec.style.display = '');
                        // Volver a la sección de catálogos
                        window.location.hash = '#catalogos';
                    };

                    headerMarco.appendChild(closeBtn);

                    const iframe = document.createElement('iframe');
                    iframe.src = url;
                    iframe.style.width = '100%';
                    iframe.style.maxWidth = '1200px';
                    iframe.style.flexGrow = '1'; 
                    iframe.style.border = '2px solid rgba(255, 255, 255, 0.1)';
                    iframe.style.borderRadius = '12px';
                    iframe.style.backgroundColor = '#fff';
                    iframe.style.boxShadow = '0 10px 40px rgba(0,0,0,0.4)';
                    
                    contenedor.appendChild(headerMarco);
                    contenedor.appendChild(iframe);
                    
                    // Bloquear el botón de retroceso (swipe back) del navegador
                    window.catalogForceOpen = true;
                    window.history.pushState({ catalog: true }, "");
                    
                    // Asegurarnos de estar en la parte superior
                    window.scrollTo(0, 0);
                }
                
                // Restaurar el botón
                btn.querySelector('span').textContent = original;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                form.reset();
            }, 800);
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

    // ===== PREVENT BACK GESTURE WHEN CATALOG IS OPEN =====
    window.addEventListener('popstate', (e) => {
        if (window.catalogForceOpen) {
            // Empujar el estado de nuevo para que el usuario no salga de la página
            window.history.pushState({ catalog: true }, "");
            
            const btn = document.getElementById('btn-cerrar-catalogo');
            if(btn) {
                // Hacer vibrar el botón para indicarle al usuario que debe presionarlo
                btn.style.transition = 'all 0.1s ease';
                btn.style.transform = 'scale(1.1) rotate(2deg)';
                btn.style.backgroundColor = '#ff6b6b';
                btn.style.borderColor = '#ff6b6b';
                
                setTimeout(() => {
                    btn.style.transform = 'scale(1) rotate(-2deg)';
                    setTimeout(() => {
                        btn.style.transform = 'scale(1) rotate(0deg)';
                        btn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }, 100);
                }, 100);
            }
        }
    });
});
