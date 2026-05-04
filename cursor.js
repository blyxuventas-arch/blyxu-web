function initCustomCursor() {
    // Evitar duplicados
    if (document.querySelector('.custom-cursor')) return;

    const cursor = document.createElement('div');
    const dot = document.createElement('div');
    cursor.className = 'custom-cursor';
    dot.className = 'custom-cursor-dot';
    
    // Posición inicial fuera de pantalla
    cursor.style.left = '-100px';
    dot.style.left = '-100px';
    
    document.body.appendChild(cursor);
    document.body.appendChild(dot);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
    });

    const updateHover = () => {
        const interactive = document.querySelectorAll('a, button, .btn, .nav-link, .btn-add, .chip, .cart-float, .category-header, .prod-img, .catalog-card, .stat-card, [onclick]');
        interactive.forEach(el => {
            if (el.dataset.cursorBound) return;
            el.dataset.cursorBound = "true";

            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
                cursor.style.backgroundColor = 'rgba(199, 125, 255, 0.15)';
                cursor.style.borderColor = '#fff';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = 'transparent';
                cursor.style.borderColor = '#c77dff';
            });
        });
    };
    
    updateHover();
    const observer = new MutationObserver(updateHover);
    observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomCursor);
} else {
    initCustomCursor();
}
