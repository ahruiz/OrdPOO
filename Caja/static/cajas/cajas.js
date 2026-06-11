var urlcajas = "/api/cajas/"
var urlcajeros = "/api/cajeros/"
var urlfacturas = "/api/facturas/"
var urlvales = "/api/vales/"

let cajasexistentes = [];
let cajerosexistentes = [];

function makeFetch() {
    Promise.all([
        fetch(urlcajas).then(r => r.json()),
        fetch(urlcajeros).then(r => r.json())
    ])
        .then(([cajas, cajeros]) => {
            console.log("cajas", cajas);
            console.log("cajeros", cajeros);

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
                        <h2 class="badge">Num de Caja: ${cajero ? cajero.id : "Desconocido"}</h2>
                        <p class="badge">Cajero: ${caja.id}</p>
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
            console.log(error);
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
            console.log(data);
            var campos = data;

            if (campos.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
                return;
            }

            cajasencero = campos.filter(c => c.saldo === '0.00'); //
            data = cajasencero; // Sobrescribimos data con las cajas que tienen saldo 0 para mostrar solo esas
            console.log(data);
            var campos = data;

            var card = campos.map(function (campo) {
                return `
                    <div class="cards">
                        <img src="/static/cajas/caja_ch.jpg" alt="" class="custom-image">
                        <h2 class="badge">Num de Caja: ${campo.id}</h2>
                        <p class="badge">Num de cajero: ${campo.Cajero}</p>
                        <p class="badge">Saldo inicial: ${campo.saldo_inicial}</p>
                        <p class="badge">Saldo actual: ${campo.saldo}</p>

                        <button class="btn-form1" onclick="borrarCajero(${campo.id})">
                         Borrar
                        </button>
                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;

        })
        .catch(error => {
            console.log(error);
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
            console.log(data);
            var campos = data;

            cajasactivas = campos.filter(c => c.saldo !== '0.00'); //
            data = cajasactivas; // Sobrescribimos data con las cajas que tienen saldo diferente de 0 para mostrar solo esas
            console.log(data);
            var campos = data;

            if (campos.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay cajas activas disponibles.</h1>";
                return;
            }

            var card = campos.map(function (campo) {
                return `
                    <div class="cards">
                        <img src="/static/cajas/caja_ch.jpg" alt="" class="custom-image">
                        <h2 class="badge">Num de Caja: ${campo.id}</h2>
                        <p class="badge">Num de cajero: ${campo.Cajero}</p>
                        <p class="badge">Saldo inicial: ${campo.saldo_inicial}</p>
                        <p class="badge">Saldo actual: ${campo.saldo}</p>

                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
            console.log(error);
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
            console.log("Cajeros existentes:", cajeros);
            console.log("Cajas existentes:", cajas);

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
            console.log("Datos a enviar:", data);

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
            console.log('Respuesta servidor:', data);
            alert("Caja creada correctamente");
            document.getElementById("cajero").value = "";
            document.getElementById("saldo_inicial").value = "";
            document.getElementById("saldo").value = "";
            makeFetch();
        })
        .catch(error => {
            console.log('Error en el servidor:', error);
            //document.getElementById("mensaje").innerHTML = error.message;
        });

}

function borrarCajero(id) {

    if (!confirm("¿Seguro que quieres borrar este cajero?")) {
        return;
    }

    fetch(urlcajas + id + "/", {
        method: "DELETE"
    })
        .then(response => {

            if (!response.ok) {
                throw new Error("Error al borrar");
            }

            alert("Caja eliminada correctamente");
            cajasen0(); // Recargar tarjetas
        })
        .catch(error => {
            console.log("Error:", error);
            alert("No se pudo borrar");
        });
}

function modifica_caja() {
    alert("No modificamos CAJAS, solo las mostramos y/o en su caso las borramos, lo siento :(");
    makeFetch();
}

function mostrar_fact() {

    Promise.all([
        fetch(urlfacturas).then(r => r.json()),
        fetch(urlcajas).then(r => r.json())
    ])
        .then(([facturas, cajas]) => {
            console.log("facturas", facturas);
            console.log("cajas", cajas);

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
                        <h2 class="badge">ID Factura: ${factura.id}</h2>
                        <p class="badge">Num de factura: ${factura.numFact}</p>
                        <p class="badge">Proveedor: ${factura.proveedor.toUpperCase()}</p>
                        <p class="badge">Descripción: ${factura.descripcion.toUpperCase()}</p>
                        <p class="badge">Importe: ${factura.importe}</p>
                        <p class="badge">Departamento: ${factura.departamento.toUpperCase()}</p>
                        <p class="badge"><h2>${factura.aplicada ? `Aplicada en Caja: ${factura.aplicada}` : 0}</h2></p>
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
            console.log(error);
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
    console.log("Caja seleccionada:", caja_id, cajaSeleccionada.saldo, importe);

    if (!confirm("¿Seguro que quieres aplicar esta factura?")) {
        return; // Si el usuario cancela, salimos de la función
    }


    var data = {
        factura_id: Number(factura_id),
        numFact: Number(num_factura) // Este es el campo que te pedía el error 400
    };
    console.log("Datos a enviar:", data);

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
            console.log("Error:", error);
            alert("No se pudo aplicar la factura");
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

            var campos = data;
            console.log(data);

            var card = campos.map(function (campo) {
                return `
                    <div class="cards">
                        <img src="/static/cajas/caja_ch.jpg" alt="" class="custom-image">
                        <h2 class="badge">Numero del Vale: ${campo.id}</h2>
                        <p class="badge">Numero de caja: ${campo.caja}</p>
                        <p class="badge">Cajero: ${campo.empleado_nombre + ' ' + campo.empleado_apellido}</p>
                        <p class="badge">Monto: ${campo.monto}</p>
                        <p class="badge">Motivo: ${campo.motivo}</p>
                        <p class="badge">Observaciones: ${campo.observaciones}</p>
                        <p class="badge">Fecha de creación: ${campo.fecha_creacion}</p>
                        <p class="badge">Estado: ${campo.estado}</p>
                        <div class="contenedor-botones">
                            <boton class="btn-form1" onclick="aplicar_descuento(${campo.id}, ${campo.monto}, ${campo.caja})">
                                Aplicar descuento en nómina
                            </boton>
                        
                            <boton class="btn-form1" onclick="desplegarVentanaImpresionVale(${JSON.stringify(campo)})">
                                Imprimir Vale
                            </boton>
                        </div>
                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;

        })
        .catch(error => {
            console.log(error);
        });

}

/**
 * PUNTAL 1: Revisa el historial del cajero antes de registrar el nuevo vale
 */
function solicitarValesCaj() {
    //event.preventDefault();

    const cajaId = document.getElementById('caja').value;
    const usuarioId = document.getElementById('cajero').value;
    const monto = document.getElementById('monto').value;
    const motivo = document.getElementById('MotivoDelVale').value;
    const observaciones = document.getElementById('comentario').value;
    console.log("Datos del vale a solicitar:", { cajaId, usuarioId, monto, motivo, observaciones });

    // Consultamos al backend por vales pendientes de este empleado en esta caja específica
    const urlVerificacion = `${urlvales}?caja_id=${cajaId}&estado=PENDIENTE/`; // Endpoint que filtra por caja, usuario y estado de vale

    fetch(urlVerificacion)
        .then(response => {
            // 🌟 BLINDAJE: Si el servidor responde 403, 404, 500, etc., detenemos el flujo con un error claro
            if (!response.ok) {
                throw new Error(`Error del servidor (${response.status}): No tienes permisos para consultar estos vales.`);
            }
            return response.json();
        })
        .then(valesExistentes => {
            // Filtramos si el empleado seleccionado ya tiene deudas activas en el JSON devuelto
            const deudasPrevias = valesExistentes.filter(v => v.caja_id == cajaId && v.estado === "PENDIENTE");

            if (deudasPrevias.length > 0) {
                // Alerta de advertencia operativa para el cajero
                const confirmacion = confirm(`⚠️ ATENCIÓN: El empleado seleccionado ya cuenta con ${deudasPrevias.length} vale(s) PENDIENTE(S) de cobro en esta caja.\n\n¿Desea acumular este nuevo vale de $${monto} a su cuenta de responsabilidad bajo su propio riesgo?`);
                if (!confirmacion) return; // Cancela la operación si el usuario decide no arriesgarse
            }

            // Si no tiene deudas o decide proceder, llamamos a la creación física
            crearVale({ cajaId, usuarioId, monto, motivo, observaciones });
        })
        .catch(err => {
            console.error("Error en pre-verificación de vales:", err);
            alert("No se pudo conectar con el servidor de auditoría.");
        });
}

/**
 * PUNTAL 2: Registra el vale en la base de datos (POST)
 */
function crearVale(datosVale) {
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
                    console.error("Error del servidor (400+):", errorData);
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

            desplegarVentanaImpresionVale(valeRegistrado);
            mostrarVales();
        })
        .catch(err => {
            console.error("Error al registrar vale:", err);
            alert(`Error: ${err.message}`);
        });
}

/**
 * PUNTAL 3: Ventana emergente ejecutiva con solicitud de firmas físicas
 */
function desplegarVentanaImpresionVale(vale) {
    // reseteamos windows open para evitar bloqueos por parte del navegador
    window.open = function () { };

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
    fetch(`/api/vales/${valeId}/aplicar_descuento/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            monto: monto,
            cajaId: cajaId
        })
    })
        .then(response => {
            if (response.ok) {
                alert(`Descuento aplicado correctamente al Vale #${valeId}`);
            } else {
                alert(`Error al aplicar descuento al Vale #${valeId}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
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
    console.log("pendientes", pendientes);
}

function facturaspagadas() {

    fetch(urlfacturas)
        .then(response => response.json())
        .then(facturas => {
            var pagadas = facturas.filter(f => f.aplicada !== 0);
        });
    console.log("pagadas", pagadas);
}


function gasto_total() {

    Promise.all([
        fetch(urlcajas).then(r => r.json()),
        fetch(urlfacturas).then(r => r.json())
    ])
        .then(([cajas, facturas]) => {
            console.log("cajas", cajas);
            console.log("facturas", facturas);

            if (cajas.length === 0 || facturas.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
                return;
            }

            var card = cajas.map(function (caja) {
                var facturasporCaja = facturas.filter(f => Number(f.aplicada) == Number(caja.id));
                return `

                <div class="cards">
                        <img src="/static/facturas/factura.jpg" alt="" class="custom-image">
                        <p class= "btn-form">Caja: ${caja.id}</p>
                        ${facturasporCaja.map(f => `
                                <p class="btn-form1">
                                    Factura: ${f.id} (${f.numFact}) : ${f.importe}
                                </p>
                            `).join("")}
                        <p class= "btn-form">Saldo: ${caja.saldo}</p>
                        <p class= "btn-form">Gasto total: ${facturasporCaja.reduce((acc, f) => acc + Number(f.importe), 0).toFixed(2)}</p>

                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
            console.log(error);
        });

}

function cajasppal() {
    Promise.all([
        fetch(urlcajas).then(r => r.json()),
        fetch(urlcajeros).then(r => r.json())
    ])
        .then(([cajas, cajeros]) => {
            console.log("cajas", cajas);
            console.log("cajeros", cajeros);

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
            console.log(error);
        });

}
