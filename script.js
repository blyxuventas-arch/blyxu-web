// Enlaces de destino proporcionados
const urlAppSheetMayorista = "https://www.appsheet.com/start/f65365e0-8f0b-4ad9-bb0e-956ee8798d6b";
const urlAppSheetDetal = "https://www.appsheet.com/start/f65365e0-8f0b-4ad9-bb0e-956ee8798d6b";

document.addEventListener('DOMContentLoaded', () => {

    // Lógica Vista de Introducción
    const btnConoce = document.getElementById('btn-conoce-catalogo');
    const introView = document.getElementById('intro-view');
    const mainContent = document.getElementById('main-content');

    if (btnConoce) {
        btnConoce.addEventListener('click', () => {
            introView.style.display = 'none';
            mainContent.style.display = 'block';

            // Forzar reflujo para que la transición CSS sea visible
            void mainContent.offsetWidth;
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        });
    }

    const formDetal = document.getElementById('form-detal');
    const formMayorista = document.getElementById('form-mayorista');

    // Manejar el inicio de sesión para Detal / Minorista
    if (formDetal) {
        formDetal.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validación de contraseña
            const password = document.getElementById('pass-detal').value;
            const errorElement = document.getElementById('error-detal');

            if (password !== '26') {
                errorElement.style.display = 'block';
                return;
            }
            errorElement.style.display = 'none';

            // Simular carga y validación
            const btn = formDetal.querySelector('.btn');
            const originalText = btn.innerText;
            btn.innerText = 'Conectando...';
            btn.style.opacity = '0.8';
            btn.style.cursor = 'wait';

            // Redirigir al enlance de appsheet tras un breve delay estético
            setTimeout(() => {
                window.location.href = urlAppSheetDetal;
                // Restaurar el botón en caso de volver atrás
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.opacity = '1';
                    btn.style.cursor = 'pointer';
                }, 500);
            }, 1000);
        });
    }

    // Manejar el inicio de sesión para Mayorista
    if (formMayorista) {
        formMayorista.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validación de contraseña
            const password = document.getElementById('pass-mayorista').value;
            const errorElement = document.getElementById('error-mayorista');

            if (password !== '53') {
                errorElement.style.display = 'block';
                return;
            }
            errorElement.style.display = 'none';

            const btn = formMayorista.querySelector('.btn');
            const originalText = btn.innerText;
            btn.innerText = 'Validando Credenciales...';
            btn.style.opacity = '0.8';
            btn.style.cursor = 'wait';

            // Redirigir al enlace de appsheet tras un breve delay estético
            setTimeout(() => {
                window.location.href = urlAppSheetMayorista;
                // Restaurar el botón en caso de volver atrás
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.opacity = '1';
                    btn.style.cursor = 'pointer';
                }, 500);
            }, 1000);
        });
    }
});
