var urlcajas = "/api/cajas/"
var urlcajeros = "/api/cajeros/"
var urlfacturas = "/api/facturas/"
var urlvales = "/api/vales/"

let cajasexistentes = [];
let cajerosexistentes = [];
let valesGlobal = [];

function makeFetch() {
    Promise.all([
        fetch(urlcajas).then(r => r.json()),
        fetch(urlcajeros).then(r => r.json())
    ])
        .then(([cajas, cajeros]) => {

            if (cajas.length === 0 || cajeros.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
                return;
            }
            cajasexistentes = cajas; // Guardamos las cajas con todos sus datos para futuras referencias
            cajerosexistentes = cajeros; // Guardamos los cajeros con todos sus datos para futuras referencias
            var card = cajas.map(function (caja) {
                var cajero = cajeros.find(c => c.id == caja.id);
                return ` 
                    <div class="cards">
                        <img src="/static/cajas/caja_ch.jpg" alt="" class="custom-image"> 
                        <div class="cards-info">
                            <p><strong>Num de Caja: ${cajero ? cajero.id : "Desconocido"}</strong></p>
                            <p><strong>Cajero: ${caja.id}</strong></p>
                            <p><strong>Nombre: ${cajero ? cajero.name.toUpperCase() + " " + cajero.last_name.toUpperCase() : "Desconocido"}</strong></p>
                            <p><strong>Correo: ${cajero ? cajero.email.toUpperCase() : "Desconocido"}</strong></p>
                        <p><strong>Telefono: ${cajero ? cajero.phone : "Desconocido"}</strong></p>
                        </div>
                        <p class="badge">Saldo inicial: ${caja.saldo_inicial}</p>
                        <p class="btn-form1">Saldo actual: ${caja.saldo}</p>
                        </div>
                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
        });

}
var cajasencero = [];

function cajasen0() {
    fetch(urlcajas).then(Response => {
        if (!Response.ok) {
            throw new Error("Error en la solicitud");
        }
        return Response.json();
    })

        .then(data => {
            var campos = data;

            if (campos.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
                return;
            }

            cajasencero = campos.filter(c => c.saldo === '0.00'); //
            data = cajasencero; // Sobrescribimos data con las cajas que tienen saldo 0 para mostrar solo esas
            var campos = data;

            var card = campos.map(function (campo) {
                return `
                    <div class="cards">
                        <img src="/static/cajas/caja_ch.jpg" alt="" class="custom-image">
                        <div class="cards-info">
                        <p><strong>Num de Caja: ${campo.id}</strong></p>
                        <p><strong>Num de cajero: ${campo.Cajero}</strong></p>
                        <p><strong>Saldo inicial: ${campo.saldo_inicial}</strong></p>
                        <p><strong>Saldo actual: ${campo.saldo}</strong></p>
                        </div>
                        <button class="btn-form1" onclick="borrarCaja(${campo.id})">
                         Borrar
                        </button>
                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;

        })
        .catch(error => {
        });

}
var cajasactivas = [];

function cajasactivs() {
    fetch(urlcajas).then(Response => {
        if (!Response.ok) {
            throw new Error("Error en la solicitud");
        }
        return Response.json();
    })

        .then(data => {
            var campos = data;

            cajasactivas = campos.filter(c => c.saldo !== '0.00'); //
            data = cajasactivas; // Sobrescribimos data con las cajas que tienen saldo diferente de 0 para mostrar solo esas
            var campos = data;

            if (campos.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay cajas activas disponibles.</h1>";
                return;
            }

            var card = campos.map(function (campo) {
                return `
                    <div class="cards">
                        <img src="/static/cajas/caja_ch.jpg" alt="" class="custom-image">
                        <div class"cards-info">
                            <p><strong>Num de Caja: ${campo.id}</strong></p>
                            <p><strong>Num de cajero: ${campo.Cajero}</strong></p>
                            <p><strong>Saldo inicial: ${campo.saldo_inicial}</strong></p>
                            <p><strong>Saldo actual: ${campo.saldo}</strong></p>
                        </div>
                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
        });

}


function crear_caja() {

    var cajero = document.getElementById("cajero").value;
    var saldo_inicial = document.getElementById("saldo_inicial").value;
    var saldo = document.getElementById("saldo").value;

    // VALIDAR CAMPOS VACÍOS
    if (cajero === "" || saldo_inicial === "" || saldo === "") {
        alert("Faltan datos, favor de completar el formulario");
        return;
    }

    // VALIDAR NUMÉRICOS
    if (isNaN(cajero) || isNaN(saldo_inicial) || isNaN(saldo)) {
        alert("Los campos de cajero, saldo inicial y saldo deben ser numéricos");
        return;
    }

    // BUSCAR CAJEROS Y CAJAS EN LA BD
    return Promise.all([
        fetch(urlcajeros).then(response => response.json()),
        fetch(urlcajas).then(response => response.json())
    ])
        .then(([cajeros, cajas]) => {

            // VALIDAR SI EXISTE EL CAJERO
            let cajeroExiste = cajeros.find(c => String(c.id) === String(cajero));
            if (!cajeroExiste) {
                alert("El cajero no existe en la base de datos");
                throw new Error("El cajero no existe en la base de datos");
            }

            // VALIDAR SI EL CAJERO YA TIENE CAJA
            let cajaDelCajero = cajas.find(c => String(c.Cajero) === String(cajero));
            if (cajaDelCajero) {
                alert("El cajero ya existe: ya tiene una caja registrada");
                throw new Error("El cajero ya existe y ya tiene caja registrada");
            }

            // DATOS PARA CREAR LA CAJA
            var data = {
                Cajero: Number(cajero),
                saldo_inicial: Number(saldo_inicial),
                saldo: Number(saldo)
            };

            // CREAR CAJA
            return fetch(urlcajas, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al crear la caja");
            }
            return response.json();
        })
        .then(data => {
            if (!data) return;
            alert("Caja creada correctamente");
            document.getElementById("cajero").value = "";
            document.getElementById("saldo_inicial").value = "";
            document.getElementById("saldo").value = "";
            makeFetch();
        })
        .catch(error => {
            //document.getElementById("mensaje").innerHTML = error.message;
        });

}

function borrarCaja(id) {
    // 1. Confirmación inicial de la acción
    if (!confirm("¿Seguro que quieres borrar esta caja?")) {
        return;
    }

    // 2. IMPORTANTE: Validar en Frontend si hay vales pendientes antes de borrar.
    // Aquí puedes hacer un fetch rápido a tu API de vales filtrando por el ID de la caja.
    fetch(urlvales + "?caja=" + id + "&estado=pendiente")
        .then(response => {
            if (!response.ok) throw new Error("No se pudo verificar el estado del vale");
            return response.json();
        })
        .then(vale => {
            // Condición: Si el vale está pendiente (ajusta 'pendiente' según manejes tu campo estado)
            if (vale.estado === "pendiente" || vale.pendiente === true) {
                alert("No se puede eliminar este vale porque se encuentra en estado PENDIENTE.");
                return;
            }

            // 3. Si no hay vales, procedemos con el DELETE seguro (sin body)
            return fetch(urlcajas + id + "/", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        })
        .then(response => {
            // Esto solo se ejecuta si el paso anterior (el DELETE) ocurrió
            if (response) {
                if (!response.ok) throw new Error("Error al borrar");

                alert("Caja eliminada correctamente");
                cajasen0(); // Recargar tarjetas
            }
        })
        .catch(error => {
            console.error(error);
            alert("No se pudo borrar la caja. Verifique la conexión o restricciones del servidor.");
        });
}

function borrarVale(id) {
    // 1. Confirmación inicial
    if (!confirm("¿Seguro que quieres borrar este VALE?")) {
        return;
    }

    // Nota: Como estás borrando un vale individual, la condición de "no existencia de vales pendientes"
    // usualmente significa que no puedes borrarlo si SU estado actual es 'pendiente' (o activo).

    // Primero consultamos el estado de ese vale específico
    fetch(urlvales + id + "/")
        .then(response => {
            if (!response.ok) throw new Error("No se pudo verificar el estado del vale");
            return response.json();
        })
        .then(vale => {
            // Condición: Si el vale está pendiente (ajusta 'pendiente' según manejes tu campo estado)
            if (vale.estado === "pendiente" || vale.pendiente === true) {
                alert("No se puede eliminar este vale porque se encuentra en estado PENDIENTE.");
                return;
            }

            // Si pasa la condición (ej. ya está pagado o cancelado), se borra
            return fetch(urlvales + id + "/", {
                method: "DELETE"
            });
        })
        .then(response => {
            if (response) {
                if (!response.ok) throw new Error("Error al borrar");

                alert("Vale eliminado correctamente");
                mostrarValesPend(); // Recargar tarjetas
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al procesar la baja del vale.");
        });
}

function modifica_caja() {
    alert("No modificamos CAJAS ni VALES, solo las mostramos y/o en su caso las borramos, lo siento :(");
    return;
}

function mostrar_fact() {

    Promise.all([
        fetch(urlfacturas).then(r => r.json()),
        fetch(urlcajas).then(r => r.json())
    ])
        .then(([facturas, cajas]) => {

            if (cajas.length === 0 || facturas.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
                return;
            }

            cajasexistentes = cajas; // Guardamos las cajas con todos sus datos para futuras referencias

            var card = facturas.map(function (factura) {
                var caja = cajas.find(c => c.id == factura.Caja);
                const estaAplicada = factura.aplicada && factura.aplicada !== 0 && factura.aplicada !== "0";
                return `

                <div class="cards">
                        <img src="/static/facturas/factura.jpg" alt="" class="custom-image">
                        <div class=cards-info">
                            <p><strong>ID Factura: </strong>${factura.id}</p>
                            <p><strong>Num de factura: </strong>${factura.numFact}</p>
                            <p><strong>Proveedor: </strong>${factura.proveedor.toUpperCase()}</p>
                            <p><strong>Descripción: </strong>${factura.descripcion.toUpperCase()}</p>
                            <p><strong>Importe: </strong>${factura.importe}</p>
                            <p><strong>Departamento: </strong>${factura.departamento.toUpperCase()}</p>
                            <p class="badge"><h2>${factura.aplicada ? `Aplicada en Caja: ${factura.aplicada}` : 0}</h2></p>
                        </div>
                        <select class="btn-form1" id="caja-${factura.id}" ${estaAplicada ? 'disabled' : ''}>
                            ${cajas.map(c => `<option value="${c.id}">Caja ${c.id}</option>`).join("")}
                        </select>

                        <button 
                            class="${estaAplicada ? 'btn-deshabilitado' : 'btn-form1'}" 
                            onclick="aplic_fact('${factura.id}', '${factura.numFact}', '${factura.aplicada}', '${factura.importe}')"
                            ${estaAplicada ? 'disabled' : ''} 
                        >
                            ${estaAplicada ? 'Aplicada' : 'Aplicar factura'}
                        </button>                        
                        <p class= "btn-form1">Saldo: ${cajas.map(c => `<option value="${c.saldo}">caja ${c.id}: ${c.saldo}</option>`).join("")}</p>

                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
        });

}

function aplic_fact(factura_id, num_factura, aplicada, importe) {

    let caja_id = document.getElementById(`caja-${factura_id}`).value;

    let cajaSeleccionada = cajasexistentes.find(c => c.id == caja_id);
    let saldo = cajaSeleccionada ? cajaSeleccionada.saldo : 0;


    if (aplicada !== '0') {
        alert("Esta factura ya ha sido aplicada");
        return;
    }

    if (Number(saldo) < Number(importe)) {
        alert("No hay suficiente saldo en la caja para aplicar esta factura....EFECTUE REPOSICION DE FONDOS");
        return;
    }

    if (!confirm("¿Seguro que quieres aplicar esta factura?")) {
        return; // Si el usuario cancela, salimos de la función
    }


    var data = {
        factura_id: Number(factura_id),
        numFact: Number(num_factura) // Este es el campo que te pedía el error 400
    };

    fetch(urlcajas + caja_id + "/aplic_fact/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then(response => {

            if (!response.ok) {
                throw new Error("Error al aplicar factura");
            }

            alert("Factura aplicada correctamente");
            mostrar_fact(); // Recargar tarjetas

        })
        .catch(error => {
            alert("No se pudo aplicar la factura");
        });
}

function mostrarValesPend() {
    fetch(urlvales).then(Response => {
        if (!Response.ok) {
            throw new Error("Error en la solicitud");
        }
        return Response.json();
    })

        .then(data => {
            var campos = data;

            if (campos.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
                return;
            }
            const valesPendientes = campos.filter(v =>
                v.estado === "PENDIENTE"
            ); console.log(valesPendientes)

            valesGlobal = campos;
            console.log(valesGlobal)

            var card = valesPendientes.map(function (campo) {
                return `
                    <div class="cards">
                        <img src="/static/cajas/caja_ch.jpg" alt="" class="custom-image">
                        <div class="cards-info>
                            <p><strong>Numero del Vale: ${campo.id}</strong></h2>
                            <p><strong>Numero de caja: ${campo.caja}</strong></p>
                            <p><strong>Cajero: ${campo.empleado_nombre + ' ' + campo.empleado_apellido}</strong></p>
                            <p><strong>Monto: ${campo.monto}</strong></p>
                            <p><strong>Motivo: ${campo.motivo}</strong></p>
                            <p><strong>Observaciones: ${campo.observaciones}</strong></p>
                            <p><strong>Fecha de creación: ${campo.fecha_creacion}</strong></p>
                        </div>
                        <p class="btn-form">Estado: ${campo.estado}</p>
                        <div class="contenedor-botones">
                            <button class="btn-form1" onclick="borrarVale(${campo.id})">
                                Borrar
                            </button>
                        </div>
                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;

        })
        .catch(error => {
            alert('Error al cargar vales: ' + error.message);
        });

}


function mostrarVales() {
    fetch(urlvales).then(Response => {
        if (!Response.ok) {
            throw new Error("Error en la solicitud");
        }
        return Response.json();
    })

        .then(data => {
            var campos = data;

            if (campos.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
                return;
            }
            valesGlobal = campos;
            console.log(valesGlobal)

            var card = campos.map(function (campo) {
                return `
                    <div class="cards">
                        <img src="/static/cajas/caja_ch.jpg" alt="" class="custom-image">
                        <div class="cards-info">
                            <p>strong>Numero del Vale: </strong>${campo.id}</p>
                            <p><strong>Numero de caja: </strong>${campo.caja}</p>
                            <p><strong>Cajero: </strong>${campo.empleado_nombre + ' ' + campo.empleado_apellido}</p>
                            <p><strong>Monto: </strong>${campo.monto}</p>
                            <p><strong>Motivo: </strong>${campo.motivo}</p>
                            <p><strong>Observaciones: </strong>${campo.observaciones}</p>
                            <p><strong>Fecha de creación: </strong>${campo.fecha_creacion}</p>
                        </div>
                        <p class="btn-form">Estado: ${campo.estado}</p>
                        <div class="contenedor-botones">
                            ${campo.estado === 'PENDIENTE' ? `
                            <button class="btn-form1" onclick="aplicar_descuento(${campo.id}, ${campo.monto}, ${campo.caja})">
                                Aplicar descuento en nómina
                            </button>
                            ` : `
                            <button class="btn-form1 btn-deshabilitado" disabled>
                                Vale ${campo.estado === 'APLICADO' ? 'Descontado' : 'No aplicable'}
                            </button>
                            `}
                            <button class="btn-form1" onclick="desplegarVentanaImpresionVale(${campo.id})">
                                Imprimir Vale
                            </button>
                        </div>
                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;

        })
        .catch(error => {
            alert('Error al cargar vales: ' + error.message);
        });

}

/**
 * Revisa el historial del cajero antes de registrar el nuevo vale
 */
function solicitarValesCaj() {
    // event.preventDefault(); // Descoméntalo si estás dentro de un <form> para evitar que recargue la página

    const cajaId = document.getElementById('caja').value;
    const usuarioId = document.getElementById('cajero').value; // Este es el empleado/cajero a verificar
    const monto = document.getElementById('monto').value;
    const motivo = document.getElementById('MotivoDelVale').value;
    const observaciones = document.getElementById('comentario').value;

    // Agregamos el usuario_id a la URL para que el backend filtre específicamente a ese empleado
    const urlVerificacion = `${urlvales}?caja_id=${cajaId}&usuario_id=${usuarioId}&estado=PENDIENTE`;

    fetch(urlVerificacion)

        .then(response => {
            if (!response.ok) {
                throw new Error(`Error del servidor (${response.status}): No tienes permisos para consultar estos vales.`);
            }
            return response.json();
        })

        .then(valesExistentes => {
            const deudasPrevias = valesExistentes.filter(v =>
                v.caja == cajaId &&
                v.estado === "PENDIENTE"
            ); console.log(valesExistentes)

            if (!valesExistentes || valesExistentes.length === 0) {
                alert("⚠️ Operación detenida: No existen registros de vales activos en el sistema para validar deudas.\nPor favor, asegúrese de seleccionar una Caja y un Cajero válidos antes de iniciar.");
                return; // <--- CERRAMOS EL PROCESO AQUÍ. No pasa a deudas ni a crearVale.
            }

            if (deudasPrevias.length > 0) {
                const confirmacion = confirm(`⚠️ ATENCIÓN: El empleado seleccionado ya cuenta con ${deudasPrevias.length} vale(s) PENDIENTE(S) de cobro en esta caja.\n\n¿Desea acumular este nuevo vale de $${monto} a su cuenta de responsabilidad bajo su propio riesgo?`);

                if (!confirmacion) {
                    console.log("Operación cancelada por el usuario.");
                    return;
                }
            }

            // Si no tiene deudas o el usuario presionó "Aceptar" en el confirm, se crea el vale
            crearVale({ cajaId, usuarioId, monto, motivo, observaciones });
        })
        .catch(err => {
            console.error(err);
            alert("No se pudo conectar con el servidor de auditoría o hubo un error en los datos.");
        });
}
/**
 * Registra el vale en la base de datos (POST)
 */
function crearVale(datosVale) {
    const idCaja = Number(datosVale.cajaId);
    const idUsuario = Number(datosVale.usuarioId);

    // Doble escudo por si se intentan colar datos en "0" o vacíos
    if (idCaja === 0 || idUsuario === 0 || !datosVale.motivo || datosVale.motivo.trim() === "") {
        alert("❌ Error de Validación de Formulario:\n\nNo se puede crear el vale porque la Caja o el Cajero seleccionados no son válidos (Clave '0' o vacía).\n\nPor favor, llena los campos correctamente.");
        return; // <--- Aborta el fetch por completo si los tipos de datos van a reventar el backend
    }

    // Tomamos el token CSRF obligatorio de Django de las cookies
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]')?.value || "";

    fetch('/api/vales/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            //'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            caja: Number(datosVale.cajaId),
            usuario_recibe: Number(datosVale.usuarioId),
            monto: Number(datosVale.monto),
            motivo: datosVale.motivo,
            observaciones: datosVale.observaciones
        })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    const errorMsg = Object.entries(errorData)
                        .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
                        .join('\n');
                    throw new Error(`Error del servidor:\n${errorMsg}`);
                });
            }
            return response.json();
        })
        .then(valeRegistrado => {
            alert(`🎉 Vale de Responsabilidad generado con éxito (Folio #${valeRegistrado.id}).`);
            document.getElementById('caja').value = '';
            document.getElementById('cajero').value = '';
            document.getElementById('monto').value = '';
            document.getElementById('MotivoDelVale').value = '';
            document.getElementById('comentario').value = '';

            // Agregar el vale recién creado a valesGlobal para que esté disponible
            if (!valesGlobal) valesGlobal = [];
            valesGlobal.push(valeRegistrado);

            desplegarVentanaImpresionVale(valeRegistrado);
            mostrarVales();
        })
        .catch(err => {
            alert(`Error: ${err.message}`);
        });
}

function desplegarVentanaImpresionVale(valeData) {
    let vale = null;
    let valeId = null;

    if (valeData && typeof valeData === 'object') {
        vale = valeData; //viene del formulario
        valeId = vale.id;
    } else if (valeData) {
        valeId = Number(valeData); //viene de mostrarVale

        // Buscamos en valesGlobal con respaldo seguro
        let arregloVales = window.valesGlobal || (typeof valesGlobal !== 'undefined' ? valesGlobal : null);

        if (arregloVales) {
            vale = arregloVales.find(v => Number(v.id) === valeId);
        }
    }

    // Si por alguna razón el vale no existe en ninguna vía, frenamos de forma segura
    if (!vale) {
        let totalVales = window.valesGlobal ? window.valesGlobal.length : (typeof valesGlobal !== 'undefined' ? valesGlobal.length : 0);
        alert('No se encontró el vale en memoria para imprimir. Vales disponibles: ' + totalVales);
        return;
    }

    const ancho = 680;
    const alto = 620;
    const izquierda = (screen.width / 2) - (ancho / 2);
    const arriba = (screen.height / 2) - (alto / 2);

    const ventanaPrint = window.open('', '_blank',
        `width=${ancho},height=${alto},top=${arriba},left=${izquierda},scrollbars=yes`
    );

    if (!ventanaPrint) {
        alert('El navegador bloqueó la ventana de impresión. Permite ventanas emergentes e inténtalo otra vez.');
        return;
    }

    // Mapeamos los textos amigables del motivo
    const motivosDict = {
        'FALTANTE_ARQUEO': 'FALTANTE EN ARQUEO DE CAJA',
        'ANTICIPO': 'ANTICIPO / PRESTAMO CORTO',
        'OTRO': 'OTRO MOTIVO DESCRIPTIVO'
    };
    const motivoTexto = motivosDict[vale.motivo] || vale.motivo;
    const fechaLimpia = new Date(vale.fecha_creacion).toLocaleString('es-MX');

    ventanaPrint.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Vale de Caja Chica - Folio #${vale.id}</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    background-color: #ffffff;
                    color: #0f172a;
                    padding: 40px;
                    margin: 0;
                }
                .documento-box {
                    border: 2px solid #0f172a;
                    padding: 30px;
                    border-radius: 6px;
                    max-width: 580px;
                    margin: 0 auto;
                }
                .encabezado {
                    text-align: center;
                    border-bottom: 2px solid #0f172a;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }
                .encabezado h2 { margin: 0; font-size: 1.3rem; uppercase; letter-spacing: 0.5px; }
                .encabezado .folio { font-size: 1.1rem; color: #dc2626; font-weight: bold; margin-top: 5px; }
                .monto-grand {
                    text-align: right;
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-bottom: 20px;
                    padding: 8px;
                    background-color: #f1f5f9;
                    border-radius: 4px;
                }
                p { line-height: 1.6; font-size: 0.95rem; margin: 10px 0; }
                .nota-legal {
                    font-size: 0.88rem;
                    text-align: justify;
                    color: #334155;
                    background-color: #f8fafc;
                    padding: 12px;
                    border-left: 3px solid #0f172a;
                    margin-top: 25px;
                }
                .seccion-firmas {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 60px;
                    gap: 30px;
                }
                .bloque-firma { flex: 1; text-align: center; }
                .linea-firma {
                    border-top: 1px solid #475569;
                    padding-top: 6px;
                    font-size: 0.85rem;
                    font-weight: bold;
                }
                .cargo-firma { font-size: 0.75rem; color: #64748b; }
                
                .area-botones { text-align: center; margin-top: 35px; }
                .btn-print {
                    padding: 12px 24px;
                    font-weight: bold;
                    background-color: #0f172a;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.9rem;
                }
                @media print {
                    body { padding: 0; }
                    .documento-box { border: 2px solid #000; }
                    .area-botones { display: none !important; }
                }
            </style>
        </head>
        <body>
            <div class="documento-box">
                <div class="encabezado">
                    <h2>VALE DE RESPONSABILIDAD DE DINERO</h2>
                    <div class="folio">FOLIO: VAL-${vale.id}</div>
                </div>

                <div class="monto-grand">BUENO POR: $${parseFloat(vale.monto).toFixed(2)} MXN</div>
                
                <p><strong>Caja Afectada:</strong> Caja Chica N° ${vale.caja}</p>
                <p><strong>Fecha de Expedición:</strong> ${fechaLimpia}</p>
                <p><strong>Concepto o Motivo:</strong> ${motivoTexto}</p>
                <p><strong>Detalles/Observaciones:</strong> ${vale.observaciones || 'Sin observaciones adicionales.'}</p>
                
                <div class="nota-legal">
                    <strong>PAGARÉ:</strong> Por medio de este documento, reconozco formalmente haber recibido o quedar bajo mi cargo la responsabilidad de la cantidad descrita en la parte superior. Autorizo expresamente a la administración central de la institución a aplicar el descuento de este saldo en el próximo periodo de nómina si no se liquida de manera física previa.
                </div>

                <div class="seccion-firmas">
                    <div class="bloque-firma">
                        <div class="linea-firma">${vale.empleado_nombre} ${vale.empleado_apellido}</div>
                        <div class="cargo-firma">Cajero / Deudor Responsable</div>
                        <div class="cargo-firma">(Firma de Aceptación)</div>
                    </div>
                    <div class="bloque-firma">
                        <div class="linea-firma"><br></div>
                        <div class="cargo-firma">Supervisor / Jefe de Cajas</div>
                        <div class="cargo-firma">(Firma Autógrafa de Control)</div>
                    </div>
                </div>
            </div>

            <div class="area-botones">
                <button class="btn-print" onclick="window.print()">🖨️ Imprimir Vale Oficial</button>
            </div>
        </body>
        </html>
    `);
    ventanaPrint.document.close();
}

function aplicar_descuento(valeId, monto, cajaId) {
    if (!confirm(`¿Confirma que desea aplicar un descuento de $${monto} en nómina por el Vale #${valeId}?`)) {
        return;
    }
    fetch(`${urlvales}${valeId}/aplicar-descuento/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            monto: Number(monto),
            caja_id: Number(cajaId),
            observaciones: `Descuento aplicado desde caja ${cajaId}`,
            aplicado_por: 'sistema'
        })
    })
        .then(async response => {
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                data = { error: text };
            }

            if (response.ok) {
                alert(`Descuento aplicado correctamente al Vale #${valeId}`);
                mostrarVales();
            } else {
                const message = data.error || data.detail || JSON.stringify(data);
                alert(`Error ${response.status}: ${message}`);
            }
        })
        .catch(error => {
            alert('Error de red o servidor. Mira la consola para más detalles.');
        });
}

var pendientes = [];
var pagadas = [];

function facturaspendientes() {

    fetch(urlfacturas)
        .then(response => response.json())
        .then(facturas => {
            var pendientes = facturas.filter(f => f.aplicada === 0);
        });
}

function facturaspagadas() {

    fetch(urlfacturas)
        .then(response => response.json())
        .then(facturas => {
            var pagadas = facturas.filter(f => f.aplicada !== 0);
        });
}


function gasto_total() {

    Promise.all([
        fetch(urlcajas).then(r => r.json()),
        fetch(urlfacturas).then(r => r.json())
    ])
        .then(([cajas, facturas]) => {

            if (cajas.length === 0 || facturas.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
                return;
            }

            var card = cajas.map(function (caja) {
                var facturasporCaja = facturas.filter(f => Number(f.aplicada) == Number(caja.id));
                return `

                <div class="cards">
                        <img src="/static/facturas/factura.jpg" alt="" class="custom-image">
                        <p class= "btn-form1"> Caja: ${caja.id}</p>
                        ${facturasporCaja.map(f => `
                                <p class="btn-form1">
                                    Factura: ${f.id} (${f.numFact}) : ${f.importe}
                                </p>
                            `).join("")}
                        <p class= "btn-form1">Saldo: ${caja.saldo}</p>
                        <p class= "btn-form1">Gasto total: ${facturasporCaja.reduce((acc, f) => acc + Number(f.importe), 0).toFixed(2)}</p>

                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
        });

}

function cajasppal() {
    Promise.all([
        fetch(urlcajas).then(r => r.json()),
        fetch(urlcajeros).then(r => r.json())
    ])
        .then(([cajas, cajeros]) => {

            if (cajas.length === 0 || cajeros.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay cajas disponibles.</h1>";
                return;
            }

            var card = cajas.map(function (caja) {
                var cajero = cajeros.find(c => c.id == caja.Cajero);
                return `
                    <div class="cards1">
                        <img src="static/cajas/caja_ch.jpg" alt="" class="custom-image">
                        <h2 class="badge">Num de Caja: ${caja.id}</h2>
                        <p class="badge">Cajero: ${caja.Cajero}</p>
                        <p class="badge">Nombre: ${cajero ? cajero.name.toUpperCase() + " " + cajero.last_name.toUpperCase() : "Desconocido"}</p>
                        <p class="badge">Correo: ${cajero ? cajero.email.toUpperCase() : "Desconocido"}</p>
                        <p class="badge">Telefono: ${cajero ? cajero.phone : "Desconocido"}</p>
                        <p class="badge">Saldo inicial: ${caja.saldo_inicial}</p>
                        <p class="btn-form1">Saldo actual: ${caja.saldo}</p>
                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
        });

}
