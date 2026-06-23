// static/js/control_pestañas.js

const canalPestañas = new BroadcastChannel('caja_chica_channel');

canalPestañas.postMessage({ tipo: 'NUEVA_PESTAÑA_ABIERTA' });

canalPestañas.onmessage = (evento) => {
    if (evento.data.tipo === 'NUEVA_PESTAÑA_ABIERTA') {
        canalPestañas.postMessage({ tipo: 'PESTAÑA_PRINCIPAL_ACTIVA' });
    }

    if (evento.data.tipo === 'PESTAÑA_PRINCIPAL_ACTIVA') {
        document.body.innerHTML = `
            <div style="text-align:center; padding-top:100px; font-family:sans-serif; color: white; background:#1a202c; height: 100vh; position: fixed; top: 0; left: 0; width: 100vw; z-index: 99999;">
                <h2>⚠️ ACCESO RESTRINGIDO</h2>
                <p>Detectamos que ya tienes el sistema de Caja Chica abierto en otra pestaña.</p>
                <p>Por seguridad y para evitar errores de saldos, solo puedes operar desde una sola pestaña a la vez.</p>
                <br>
                <button onclick="window.close()" style="padding:10px 20px; background:#e53e3e; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">
                    Ctrl + w:Cerrar esta pestaña
                </button>
            </div>
        `;
    }
};