// API de usuarios (proyecto usuarios/) — puerto 8000
const isLocalhost = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';

const API_BASE = isLocalhost
    ? 'http://127.0.0.1:8000/api'
    : 'https://caja-chica-humberto.onrender.com/api';


document.addEventListener('DOMContentLoaded', () => {
    const authPage = document.querySelector('.auth-page');
    const redirectUrl = authPage.dataset.redirect;
    const messageBox = document.getElementById('authMessage');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');


    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);

    function showMessage(text, type = 'error') {
        messageBox.textContent = text;
        messageBox.className = `auth-message ${type}`;
        messageBox.hidden = false;
    }

    function hideMessage() {
        messageBox.hidden = true;
        messageBox.textContent = '';
    }

    async function tryLogin(email, password) {
        const endpoints = [
            `${API_BASE}/usuarios/login_usuario/`,
            `${API_BASE}/admins/login_admin/`,
            //`${API_BASE}/cajeros/login_cajero/`,
        ];

        let lastError = 'Credenciales inválidas, Registrate';

        for (const url of endpoints) {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                return response.json();
            }

            const data = await response.json().catch(() => ({}));
            if (data.detail) {
                lastError = data.detail;
            }
        }

        throw new Error(lastError);
    }

    async function handleLogin(event) {
        event.preventDefault();
        hideMessage();

        const usuarioActivo = localStorage.getItem('usuario');
        if (usuarioActivo) {
            alert('Ya tienes una sesión activa en el sistema de Caja Chica.');
            window.location.href = redirectUrl;
            return; // Detiene la ejecución del resto del script de acceso
        }

        const email = loginForm.email.value.trim();
        const password = loginForm.password.value;

        try {
            const usuario = await tryLogin(email, password);
            localStorage.setItem('usuario', JSON.stringify(usuario));
            window.location.href = redirectUrl;
        } catch (error) {
            showMessage(error.message || 'Credenciales inválidas, Registrate', 'error');
        }
    }

    async function handleSignup(event) {
        event.preventDefault();
        hideMessage();

        const nombre = signupForm.nombre.value.trim();
        const email = signupForm.email.value.trim();
        const password = signupForm.password.value;
        const passwordConfirm = signupForm.passwordConfirm.value;

        if (password !== passwordConfirm) {
            showMessage('Las contraseñas no coinciden', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/usuarios/signup_usuario/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre,
                    email,
                    password,
                    is_active: true,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const errorText = typeof data === 'object'
                    ? Object.entries(data).map(([key, value]) => `${key}: ${value}`).join(' | ')
                    : 'No se pudo crear la cuenta';
                showMessage(errorText, 'error');
                return;
            }

            localStorage.setItem('usuario', JSON.stringify(data));
            showMessage('Cuenta creada correctamente. Redirigiendo...', 'success');
            signupForm.reset();
            setTimeout(() => {
                hideMessage();
            }, 1200);
        } catch (error) {
            showMessage('No se pudo conectar con el servidor. Verifica: cd usuarios && python manage.py runserver 8000', 'error');
        }
    }
});

function logout() {
    localStorage.removeItem('usuario');
    window.location.href = 'acceso.html';
}
