const STATIC_URL = window.STATIC_URL || '/static/';
const FACTURAS_IMAGES = STATIC_URL + 'facturas/';
const INGRESOS_IMAGES = STATIC_URL + 'ingresos/';


var urlingresos = "/api/ingresos/"
var urlcajas = "/api/cajas/"
var urlfacturas = "/api/facturas/"
var urlcajeros = "/api/cajeros/"

let cajasexistentes = []; // Variable global para almacenar las cajas con todos sus datos
let facturasExistentes = []; // Variable global para almacenar las facturas con todos sus datos
let cajerosExistentes = []; // Variable global para almacenar los cajeros con todos sus datos   

let ingresosexistentes = [];

function mostrar_reposiciones() {
    fetch(urlingresos)
        .then(Response => {
            if (!Response.ok) {
                throw new Error("Error en la solicitud");
            }
            return Response.json();
        })

        .then(data => {
            console.log(data);

            if (data.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
                return;
            }

            ingresosexistentes = data.map(i => Number(i.id !== 0)); // Guardamos los números de ingresos existentes

            var card = data.map(function (campo) {
                return `
                    <div class="cards">
                        <img src="${INGRESOS_IMAGES}ingreso.jpg" alt="" class="custom-image">
                        <h2 class="badge">Reposicion ID: ${campo.id}</h2>
                        <p class="badge">Num de caja: ${campo.caja}</p>
                        <p class="badge">monto: ${campo.importe}</p>
                        <p class="badge">Descripción: ${(campo.descripcion ? campo.descripcion : "").toUpperCase()}</p>
                        <p class="badge">Factura asociada: ${campo.numFact}</p>
                        <p class= "btn-form1">Numero de reposicion: ${campo.numRepos || "Sin datos"}</p>
                        <button 
                            class="btn-form1"
                            data-caja="${campo.id ? campo.caja : 0}"
                            data-factura="${campo.numFact}"
                            data-importe="${campo.importe}"
                            data-descripcion="${campo.descripcion}"
                            data-repos="${campo.numRepos || "Sin datos"}"
                            onclick="imprimirTarjetaReposicion(this)"
                        >
                            Imprimir reposicion
                        </button>      
                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
            console.log(error);
        });

}

function imprimirTarjetaReposicion(button) {
    // 1. Rescatamos los datos de la tarjeta seleccionada desde sus atributos data-
    const numRepos = button.getAttribute("data-repos") || "Sin Folio";
    const cajaId = button.getAttribute("data-caja") || "-";
    const factura = button.getAttribute("data-factura") || "-";
    const importe = button.getAttribute("data-importe") || "0.00";
    const descripcion = button.getAttribute("data-descripcion") || "Sin descripción";

    // Formateamos el importe a dos decimales por presentación ejecutiva
    const importeFormateado = Number(importe.replace(/[^0-9.-]+/g, "")).toFixed(2);

    // 2. Abrimos una nueva ventana/pestaña en el navegador
    // Configurada con un tamaño estándar de recibo si se abre como pop-up
    const ventanaImpresion = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');

    // 3. Escribimos la estructura HTML y el CSS Ejecutivo dentro de la nueva ventana
    ventanaImpresion.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Comprobante de Reposición - ${numRepos}</title>
            <style>
                /* Estilos Ejecutivos para la Pantalla */
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    background-color: #f8fafc;
                    margin: 0;
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .recibo-container {
                    background-color: #ffffff;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    padding: 30px;
                    width: 100%;
                    max-width: 550px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    box-sizing: border-box;
                }
                .encabezado {
                    text-align: center;
                    border-bottom: 2px solid #0f172a;
                    padding-bottom: 15px;
                    margin-bottom: 25px;
                }
                .encabezado h2 {
                    color: #1e293b;
                    margin: 0;
                    font-size: 1.4rem;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                }
                .encabezado p {
                    color: #64748b;
                    margin: 5px 0 0 0;
                    font-size: 0.85rem;
                }
                .detalle-fila {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px 0;
                    border-bottom: 1px dashed #e2e8f0;
                    font-size: 0.95rem;
                    color: #334155;
                }
                .detalle-fila strong {
                    color: #1e293b;
                }
                .total-fila {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 25px;
                    padding-top: 15px;
                    border-top: 2px solid #0f172a;
                    font-size: 1.25rem;
                    font-weight: bold;
                    color: #0f172a;
                }
                .monto-total {
                    color: #10b981; /* Verde ejecutivo para el dinero */
                }
                .area-botones {
                    margin-top: 30px;
                    display: flex;
                    gap: 15px;
                }
                .btn {
                    padding: 10px 24px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    border-radius: 6px;
                    cursor: pointer;
                    border: none;
                    transition: all 0.15s ease;
                }
                .btn-imprimir {
                    background-color: #1e293b;
                    color: #ffffff;
                }
                .btn-imprimir:hover { background-color: #0f172a; }
                .btn-cerrar {
                    background-color: #e2e8f0;
                    color: #475569;
                }
                .btn-cerrar:hover { background-color: #cbd5e1; }

                /* ==========================================
                   REGLAS ESTRICTAS DE IMPRESIÓN (MEDIOS)
                   ========================================== */
                @media print {
                    body {
                        background-color: #ffffff;
                        padding: 0;
                    }
                    .recibo-container {
                        border: none;
                        box-shadow: none;
                        padding: 0;
                        max-width: 100%;
                    }
                    .area-botones {
                        display: none !important; /* Desaparecen los botones en el papel */
                    }
                }
            </style>
        </head>
        <body>

            <div class="recibo-container">
                <div class="encabezado">
                    <h2>Comprobante de Caja Chica</h2>
                    <p>Fondo de Reposición Operativa</p>
                </div>

                <div class="detalle-fila">
                    <span><strong>Folio Operación:</strong></span>
                    <span>${numRepos}</span>
                </div>
                <div class="detalle-fila">
                    <span><strong>Caja Afectada:</strong></span>
                    <span>Caja #${cajaId}</span>
                </div>
                <div class="detalle-fila">
                    <span><strong>Factura Relacionada:</strong></span>
                    <span>N° ${factura}</span>
                </div>
                <div class="detalle-fila">
                    <span><strong>Concepto:</strong></span>
                    <span>${descripcion}</span>
                </div>

                <div class="total-fila">
                    <span>Total Repuesto:</span>
                    <span class="monto-total">$${importeFormateado}</span>
                </div>
            </div>

            <div class="area-botones">
                <button class="btn btn-imprimir" onclick="window.print()">Imprimir Recibo</button>
                <button class="btn btn-cerrar" onclick="window.close()">Cerrar Ventana</button>
            </div>

        </body>
        </html>
    `);

    // 4. Cerramos el flujo de escritura para que el navegador renderice correctamente
    ventanaImpresion.document.close();
}


function mostrar_factAplicds() {

    Promise.all([
        fetch(urlfacturas).then(r => r.json()),
        fetch(urlcajas).then(r => r.json()),
        fetch(urlingresos).then(r => r.json())
    ])
        .then(([facturas, cajas, ingresos]) => {
            console.log("facturas", facturas);
            console.log("cajas", cajas);
            console.log("ingresos", ingresos)

            if (cajas.length === 0 || facturas.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
                return;
            }

            cajasexistentes = cajas; // Guardamos las cajas con todos sus datos para futuras referencias
            facturasExistentes = facturas; // <--- AGREGA ESTA LÍNEA para guardar las facturas en memoria global
            ingresosExistentes = ingresos; // <--- AGREGA ESTA LÍNEA para guardar los ingresos en memoria global

            //filtro para mostrar solo facturas aplicadas a cajas 
            facturas = facturas.filter(f => f.aplicada != 0 && (f.numRepos == 0 || f.numRepos == null));
            if (facturas.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay facturas disponibles para aplicar reposición.</h1>";
                return;
            }

            var card = facturas.map(function (factura) {
                var caja = cajas.find(c => c.id == factura.aplicada);
                var ingresoEncontrado = ingresos.find(i => (i.facturs == factura.numFact)
                    //(i.numRepos && factura.numRepos && i.numRepos == factura.numRepos) ||
                );
                const estaAplicada = factura.aplicada && factura.aplicada !== 0 && factura.aplicada !== "0";

                const n_reposicion = factura.numRepos || (ingresoEncontrado ? ingresoEncontrado.numRepos : "Sin datos");
                return `                

                <div class="cards">
                        <img src="${FACTURAS_IMAGES}factura.jpg" alt="" class="custom-image">
                        <h2 class="badge">ID Factura: ${factura.id}</h2>
                        <p class="badge">Num de factura: ${factura.numFact}</p>
                        <p class="badge">Proveedor: ${factura.proveedor.toUpperCase()}</p>
                        <p class="badge">Descripción: ${factura.descripcion.toUpperCase()}</p>
                        <p class="badge">Importe: ${factura.importe}</p>
                        <p class="badge">Departamento: ${factura.departamento.toUpperCase()}</p>
                        <h2 class="badge">Aplicada en Caja: ${factura.aplicada}</h2>
                        <p class="badge">Num de reposicion: ${n_reposicion}</p>

                        <select class="btn-form1" id="caja-${caja ? caja.id : 'N/A'}" ${estaAplicada ? 'disabled' : ''}>
                            ${cajas.map(c => `<option value="${c.id}">Caja ${c.id}</option>`).join("")}
                        </select> 

                        <button 
                            class="btn-form1"
                            data-caja="${factura.aplicada ? factura.aplicada : 0}"
                            data-factura="${factura.numFact}"
                            data-importe="${factura.importe}"
                            data-descripcion="${factura.descripcion}"
                            data-repos="${n_reposicion}"
                            onclick="aplic_reposicn(this)"
                        >
                            Aplicar reposicion
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

function aplic_reposicn(button) {
    const caja_id = button.getAttribute("data-caja");
    const num_factura = button.getAttribute("data-factura");
    const importe = button.getAttribute("data-importe");
    const descripcion = button.getAttribute("data-descripcion");
    const numRepos = button.getAttribute("data-repos"); // ID que viene de la interfaz


    // 1. Control de seguridad por si el usuario cancela de última hora
    //    if (!confirm("¿Seguro que quieres aplicar esta Reposición?")) {
    //    return;
    //    }

    let cajaId_numerico = parseInt(caja_id, 10);
    let monto_numerico = parseFloat(importe);

    // 2. CONDICIÓN: Evaluamos si ya viene un numRepos válido o si debemos calcular uno nuevo
    let reposIdFinal;

    // Si NO tiene un numRepos (es nulo, "0", 0, vacío o "Sin datos"), calculamos uno nuevo
    if (!numRepos || numRepos === '0' || numRepos === 0 || numRepos === "Sin datos") {

        console.log("No se detectó un numRepos previo. Generando nuevo ID temporal por tiempo...");

        const ahora = new Date();
        const aa = ahora.getFullYear().toString().slice(-2);
        const mm = String(ahora.getMonth() + 1).padStart(2, '0');
        const dd = String(ahora.getDate()).padStart(2, '0');
        const hh = String(ahora.getHours()).padStart(2, '0');
        const min = String(ahora.getMinutes()).padStart(2, '0');
        const ss = String(ahora.getSeconds()).padStart(2, '0');

        const aammdd = `${aa}${mm}${dd}`;
        const hhmmss = `${hh}${min}${ss}`;
        const importeLimpio = importe.replace(".", '');

        // Asignamos el ID nuevo que acabamos de construir
        reposIdFinal = `R${aammdd}${caja_id}${num_factura}${importeLimpio}`;

    } else {
        // SI YA EXISTÍA UN ID DIFERENTE DE CERO: No calculamos nada y usamos el que viene de las facturas
        console.log("Se detectó un numRepos existente. Reutilizando:", numRepos);
        reposIdFinal = numRepos;
        alert("Esta factura ya tiene una reposición aplicada con ID: " + reposIdFinal + ". No se generará una nueva reposición, se reutilizará la existente.");
        return; // Salimos de la función para evitar hacer el POST y PATCH si ya hay un numRepos válido
    }

    // 3. Estructura de datos para el POST de Ingresos (Lleva el reposIdFinal correspondiente)
    var data = {
        caja: cajaId_numerico,
        importe: monto_numerico,
        numFact: num_factura,
        descripcion: descripcion,
        numRepos: reposIdFinal
    };

    console.log("Datos listos para enviar al servidor:", data);

    // 4. Petición POST para crear el Ingreso/Reposición
    fetch(urlingresos, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) throw new Error(`Error del servidor (status: ${response.status})`);
            return response.json();
        })
        .then(ingresoCaja => {
            alert("Reposición procesada correctamente");

            // El backend responde con el campo oficial definitivo
            const numReposOficial = ingresoCaja.numRepos;

            //5. Actualización local del saldo de la caja
            let cajaObjeto = cajasexistentes.find(c => String(c.id) === String(caja_id));
            if (ingresoCaja.nuevo_saldo_caja) {
                cajaObjeto.saldo = ingresoCaja.nuevo_saldo_caja;
            } else {
                // Si no lo devuelve, hacemos la suma matemática aquí de nuevo
                cajaObjeto.saldo = Number(cajaObjeto.saldo) + Number(monto_numerico);
            }

            // 6. Búsqueda de la factura en el listado global para actualizarla
            if (!facturasExistentes) {
                console.warn("No hay facturas cargadas en memoria global.");
                return;
            }
            let facturaObjeto = facturasExistentes.find(f => String(f.numFact) === String(num_factura));

            // 7. Invocamos la función externa para hacer el PATCH en Django
            if (facturaObjeto) {
                actualizarSaldoCaja(cajaId_numerico, cajaObjeto.saldo); // Actualizamos el saldo de la caja en Django
                actualizarNumReposFactura(facturaObjeto, numReposOficial);
            } else {
                console.warn("No se encontró el objeto de la factura para aplicar el PATCH");
            }
        })
        .catch(error => {
            console.error("Error general en el proceso:", error);
            alert("No se pudo aplicar la reposición");
        });
}

function actualizarNumReposFactura(facturaObjeto, numReposOficial) {
    if (!facturaObjeto || !facturaObjeto.id) {
        console.error("Factura inválida para actualizar");
        return;
    }

    fetch(`${urlfacturas}${facturaObjeto.id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            numRepos: numReposOficial
        })
    })
        .then(r => {
            if (!r.ok) throw new Error("No se pudo actualizar la factura en Django");
            return r.json();
        })
        .then(facturaActualizada => {
            // Actualizamos el objeto en la memoria local (array global)
            facturaObjeto.numRepos = facturaActualizada.numRepos;
            console.log(`Factura ${facturaObjeto.numFact} actualizada con éxito:`, facturaActualizada.numRepos);

            // Refrescamos la vista
            mostrar_factAplicds();
        })
        .catch(error => console.error("Error en PATCH factura:", error));
}

function actualizarSaldoCaja(cajaId, nuevoSaldo) {
    if (!cajaId || !nuevoSaldo) {
        console.error("Caja inválida o saldo inválido para actualizar");
        return;
    }

    fetch(`${urlcajas}${cajaId}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            saldo: Number(nuevoSaldo).toFixed(2) // Aseguramos que el saldo se envíe con dos decimales
        })
    })
        .then(r => {
            if (!r.ok) throw new Error("No se pudo actualizar la caja en Django");
            return r.json();
        })
        .then(cajaActualizada => {
            console.log(`Caja ${cajaId} actualizada con éxito:`);
        })
        .catch(error => console.error("Error en PATCH caja:", error));
}

function solicitarDatosArq() {

    Promise.all([
        fetch(urlcajas).then(r => r.json()),
        fetch(urlfacturas).then(r => r.json()),
        fetch(urlcajeros).then(r => r.json())
    ])
        .then(([cajas, facturas, cajeros]) => {
            console.log("cajas", cajas);
            console.log("facturas", facturas);
            console.log("cajeros", cajeros);

            if (cajas.length === 0 || facturas.length === 0 || cajeros.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
                return;
            }

            var card = cajas.map(function (caja) {
                var cajero = cajeros.find(c => c.id == caja.id);
                var facturasSinRepos = facturas.filter(f => Number(f.aplicada) == Number(caja.id));
                var facturasConRepos = facturas.filter(f => f.numRepos && f.numRepos !== "0" && f.numRepos !== 0 && f.aplicada == caja.id);
                var totalGastos = facturasSinRepos.reduce((acc, f) => acc + Number(f.importe), 0);
                var totalIngresos = facturasConRepos.reduce((acc, f) => acc + Number(f.importe), 0);
                var nomCajero = cajero ? `${cajero.name} ${cajero.last_name}` : "Operador";
                console.log("Cajero:", nomCajero);
                return `

                <div class="cards">
                        <img src="${FACTURAS_IMAGES}factura.jpg" alt="" class="custom-image">
                        <p class= "btn-form1">Caja: ${caja.id}</p>
                        ${facturasSinRepos.map(f => `
                                <p class="btn-form1">
                                    Gasto: FACT ID:${f.id} NUM FACT:(${f.numFact}) : ${f.importe}
                                </p>
                            `).join("")}
                        <p class= "btn-form">Gasto total: ${totalGastos.toFixed(2)}</p>
                        ${facturasConRepos.map(f => `
                                <p class="btn-form1">
                                    Ingreso: REPOSICION:(${f.numRepos}) : ${f.importe}
                                </p>
                            `).join("")}
                        <p class= "btn-form">Ingreso total: ${totalIngresos.toFixed(2)}</p>
                        <p class= "btn-form1">Saldo: ${caja.saldo}</p>
                        <button 
                            class="btn-form1"
                            data-caja="${caja.id ? caja.id : 0}"
                            data-cajero="${nomCajero}"
                            data-inicial="${caja.saldo_inicial}"
                            data-totalGastos="${totalGastos.toFixed(2)}"
                            data-totalIngresos="${totalIngresos.toFixed(2)}"
                            data-efectivo="${caja.saldo}"
                            data-saldoDeArqueo="${(Number(caja.saldo) + Number(totalGastos) - Number(totalIngresos)).toFixed(2)}"
                            data-fecha="${new Date().toLocaleDateString()}"
                            onclick="imprimirArqueo(this)"
                        >
                            Imprimir Arqueo de Caja
                        </button>     
                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
            console.log(error);
        });

}

imprimirArqueo: function imprimirArqueo(button) {
    // 1. Rescatamos los datos dinámicos inyectados en la tarjeta
    const cajaId = button.getAttribute("data-caja") || "-";
    const nombreCajero = button.getAttribute("data-cajero") || "Operador";
    const usuarioId = button.getAttribute("data-usuario-id") || ""; // Necesitamos el ID del usuario/cajero para buscar su vale
    const saldoInicial = Number(button.getAttribute("data-inicial") || 0).toFixed(2);
    const totalGastos = Number(button.getAttribute("data-totalgastos") || 0).toFixed(2);
    const totalIngresos = Number(button.getAttribute("data-totalingresos") || 0).toFixed(2);
    const saldoDisponible = Number(button.getAttribute("data-efectivo") || 0).toFixed(2);
    const fechaArqueo = button.getAttribute("data-fecha") || "-";

    // 2. Coordenadas del monitor para centrar la ventana emergente
    const ancho = 700;
    const alto = 850;
    const izquierda = (screen.width / 2) - (ancho / 2);
    const arriba = (screen.height / 2) - (alto / 2);

    // 3. Abrimos el Pop-Up centrado
    const ventanaArqueo = window.open('', '_blank',
        `width=${ancho},height=${alto},top=${arriba},left=${izquierda},scrollbars=yes`
    );

    // 4. Inyectamos la estructura HTML, CSS y la lógica de validación interna
    ventanaArqueo.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Arqueo y Cierre de Caja N° ${cajaId}</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    background-color: #f8fafc;
                    margin: 0;
                    padding: 30px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    box-sizing: border-box;
                }
                .arqueo-container {
                    background-color: #ffffff;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    padding: 35px;
                    width: 100%;
                    max-width: 600px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    box-sizing: border-box;
                }
                .encabezado {
                    text-align: center;
                    border-bottom: 2px solid #0f172a;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }
                .encabezado h2 {
                    color: #1e293b;
                    margin: 0;
                    font-size: 1.45rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .encabezado p {
                    color: #64748b;
                    margin: 5px 0 0 0;
                    font-size: 0.88rem;
                }
                .seccion-titulo {
                    font-size: 0.85rem;
                    font-weight: bold;
                    color: #475569;
                    text-transform: uppercase;
                    background-color: #f1f5f9;
                    padding: 6px 10px;
                    margin-top: 22px;
                    border-radius: 4px;
                    letter-spacing: 0.3px;
                }
                .detalle-fila {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px dashed #e2e8f0;
                    font-size: 0.95rem;
                    color: #334155;
                }
                .detalle-fila.resaltado {
                    font-weight: bold;
                    color: #0f172a;
                    border-bottom: 1px solid #cbd5e1;
                    background-color: #f8fafc;
                    padding: 10px;
                    border-radius: 4px;
                }
                .input-conteo {
                    width: 130px;
                    padding: 6px 10px;
                    border: 1px solid #cbd5e1;
                    border-radius: 4px;
                    font-size: 0.95rem;
                    text-align: right;
                    font-weight: bold;
                    color: #0f172a;
                }
                .monto-positivo { color: #10b981; font-weight: 600; }
                .monto-negativo { color: #ef4444; font-weight: 600; }
                .monto-neutro { color: #64748b; font-weight: 600; }
                
                .alerta-vale {
                    background-color: #fef2f2;
                    border: 1px solid #fee2e2;
                    color: #dc2626;
                    padding: 12px;
                    border-radius: 6px;
                    margin-top: 15px;
                    font-size: 0.9rem;
                    text-align: center;
                    font-weight: 500;
                    line-height: 1.4;
                }
                .alerta-bloqueo {
                    background-color: #fffbeb;
                    border: 1px solid #fef3c7;
                    color: #d97706;
                    padding: 10px;
                    border-radius: 6px;
                    margin-top: 10px;
                    font-size: 0.85rem;
                    text-align: center;
                    font-weight: 600;
                }

                .seccion-firmas {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 45px;
                    gap: 40px;
                }
                .bloque-firma {
                    flex: 1;
                    text-align: center;
                }
                .linea-firma {
                    border-top: 1px solid #475569;
                    margin-top: 40px;
                    padding-top: 8px;
                    font-size: 0.85rem;
                    color: #1e293b;
                    font-weight: 600;
                }
                .cargo-firma {
                    font-size: 0.75rem;
                    color: #64748b;
                    margin-top: 2px;
                }

                .area-botones {
                    margin-top: 30px;
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    width: 100%;
                    max-width: 600px;
                }
                .btn {
                    padding: 11px 18px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    border-radius: 6px;
                    cursor: pointer;
                    border: none;
                    transition: all 0.15s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }
                .btn-imprimir { background-color: #1e293b; color: #ffffff; }
                .btn-imprimir:hover { background-color: #0f172a; }
                .btn-imprimir:disabled { background-color: #cbd5e1; color: #94a3b8; cursor: not-allowed; }
                
                .btn-cierre { background-color: #dc2626; color: #ffffff; }
                .btn-cierre:hover { background-color: #b91c1c; }
                .btn-cierre:disabled { background-color: #fca5a5; color: #ffffff; cursor: not-allowed; opacity: 0.6; }
                
                .btn-cerrar { background-color: #e2e8f0; color: #475569; }

                @media print {
                    body { background-color: #ffffff; padding: 0; justify-content: start; }
                    .arqueo-container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
                    .area-botones, .alerta-bloqueo { display: none !important; }
                    .input-conteo { border: none; background: transparent; padding: 0; font-size: 1rem; }
                }
            </style>
        </head>
        <body>

            <div class="arqueo-container">
                <div class="encabezado">
                    <h2>Arqueo de Auditoría</h2>
                    <p>Cierre Fiscal y Liquidación de Caja Chica</p>
                </div>

                <div class="seccion-titulo">Datos del Fondo Controlado</div>
                <div class="detalle-fila">
                    <span><strong>Identificador:</strong></span>
                    <span>Caja N° ${cajaId}</span>
                </div>
                <div class="detalle-fila">
                    <span><strong>Cajero Responsable:</strong></span>
                    <span>${nombreCajero}</span>
                </div>
                <div class="detalle-fila">
                    <span><strong>Fecha y Hora de Arqueo:</strong></span>
                    <span>${fechaArqueo}</span>
                </div>
                <div class="detalle-fila">
                    <span><strong>Asignación Apertura:</strong></span>
                    <span>$${saldoInicial}</span>
                </div>

                <div class="seccion-titulo">Resultados de Flujo Operativo</div>
                <div class="detalle-fila">
                    <span>(+) Reposiciones / Ingresos Totales:</span>
                    <span class="monto-positivo">+$${totalIngresos}</span>
                </div>
                <div class="detalle-fila">
                    <span>(-) Comprobantes / Gastos Totales:</span>
                    <span class="monto-negativo">-$${totalGastos}</span>
                </div>
                
                <div class="seccion-titulo">Auditoría Física de Efectivo</div>
                <div class="detalle-fila resaltado">
                    <span><strong>Saldo Teórico Disponible:</strong></span>
                    <span><strong>$${saldoDisponible}</strong></span>
                </div>
                
                <div class="detalle-fila">
                    <span><strong>(=) Conteo de efectivo Físico en Caja:</strong></span>
                    <input type="number" id="txtConteoFisico" class="input-conteo" step="0.01" min="0" placeholder="0.00" oninput="analizarArqueo()">
                </div>

                <div class="detalle-fila" id="filaDiferencia" style="display: none;">
                    <span id="lblDiferencia">Diferencia:</span>
                    <span id="valDiferencia">$0.00</span>
                </div>

                <div class="alerta-vale" id="contenedorAlertaVale" style="display: none;">
                    ⚠️ <strong>ANEXAR VALE DE DINERO POR FALTANTE</strong> a cargo de la cuenta de nómina del cajero: <strong>${nombreCajero}</strong>.
                </div>
                
                <div class="alerta-bloqueo" id="msgBloqueo" style="display: none;">
                    🔒 Botones bloqueados temporalmente hasta verificar el registro del vale en el menú principal.
                </div>

                <div class="seccion-firmas">
                    <div class="bloque-firma">
                        <div class="linea-firma">Firma de Conformidad</div>
                        <div class="cargo-firma">${nombreCajero}</div>
                        <div class="cargo-firma">Cajero Operador</div>
                    </div>
                    <div class="bloque-firma">
                        <div class="linea-firma">Firma de Autorización</div>
                        <div class="cargo-firma">Supervisión / Jefe de Caja</div>
                        <div class="cargo-firma">Aceptación Cierre a Cero</div>
                    </div>
                </div>
            </div>

            <div class="area-botones">
                <button class="btn btn-imprimir" id="btnImprimir" onclick="window.print()">🖨️ Imprimir Arqueo</button>
                <button class="btn btn-cierre" id="btnCierre" onclick="window.opener.procesarBajaCero('${cajaId}'); window.close();">🛑 Cierre de Caja (Saldo Cero)</button>
                <button class="btn btn-cerrar" onclick="window.close()">❌ Cerrar Ventana</button>
            </div>

            <script>
                const saldoTeorico = ${saldoDisponible};
                const cajaId = '${cajaId}';
                const usuarioId = '${usuarioId}';

                function analizarArqueo() {
                    const inputConteo = document.getElementById('txtConteoFisico');
                    const filaDif = document.getElementById('filaDiferencia');
                    const lblDif = document.getElementById('lblDiferencia');
                    const valDif = document.getElementById('valDiferencia');
                    const alertaVale = document.getElementById('contenedorAlertaVale');
                    
                    const btnImprimir = document.getElementById('btnImprimir');
                    const btnCierre = document.getElementById('btnCierre');
                    const msgBloqueo = document.getElementById('msgBloqueo');

                    if (inputConteo.value === '') {
                        filaDif.style.display = 'none';
                        alertaVale.style.display = 'none';
                        msgBloqueo.style.display = 'none';
                        btnImprimir.disabled = false;
                        btnCierre.disabled = false;
                        return;
                    }

                    const conteoFisico = parseFloat(inputConteo.value) || 0;
                    const diferencia = conteoFisico - saldoTeorico;

                    filaDif.style.display = 'flex';
                    filaDif.className = 'detalle-fila resaltado'; 

                    if (diferencia < 0) {
                        lblDif.innerHTML = '<strong>Diferencia de Arqueo (Faltante):</strong>';
                        valDif.innerHTML = '<strong>-$' + Math.abs(diferencia).toFixed(2) + '</strong>';
                        valDif.className = 'monto-negativo';
                        alertaVale.style.display = 'block';
                        
                        // FALTANTE DETECTADO: Deshabilitamos operaciones e iniciamos verificación
                        btnImprimir.disabled = true;
                        btnCierre.disabled = true;
                        msgBloqueo.innerHTML = "🔍 Verificando emisión del vale por <strong>$" + Math.abs(diferencia).toFixed(2) + "</strong> en el sistema...";
                        msgBloqueo.style.display = 'block';
                        
                        verificarValeEnBackend(Math.abs(diferencia));

                    } else {
                        // Si está cuadrada o hay sobrante, no se exige vale. Todo habilitado.
                        lblDif.innerHTML = diferencia > 0 ? '<strong>Diferencia de Arqueo (Sobrante):</strong>' : '<strong>Resultado del Arqueo:</strong>';
                        valDif.innerHTML = diferencia > 0 ? '<strong>+$' + diferencia.toFixed(2) + '</strong>' : '<strong>Caja Cuadrada ($0.00)</strong>';
                        valDif.className = diferencia > 0 ? 'monto-positivo' : 'monto-neutro';
                        
                        alertaVale.style.display = 'none';
                        msgBloqueo.style.display = 'none';
                        btnImprimir.disabled = false;
                        btnCierre.disabled = false;
                    }
                }

                function verificarValeEnBackend(montoFaltante) {
                    // Hacemos una petición asíncrona a la API de vales usando el get_queryset
                    // Buscamos vales PENDIENTES asociados a esta caja y al usuario de este arqueo
                    const url = '/api/vales/?caja_id=' + cajaId + '&estado=PENDIENTE';
                    
                    fetch(url)
                        .then(response => response.json())
                        .then(vales => {
                            const btnImprimir = document.getElementById('btnImprimir');
                            const btnCierre = document.getElementById('btnCierre');
                            const msgBloqueo = document.getElementById('msgBloqueo');
                            
                            // Buscamos si existe al menos un vale que coincida con el monto exacto del faltante
                            const valeEncontrado = vales.find(v => parseFloat(v.monto) === parseFloat(montoFaltante));
                            
                            if (valeEncontrado) {
                                // ¡El vale ya existe! Habilitamos los botones para proceder
                                btnImprimir.disabled = false;
                                btnCierre.disabled = false;
                                msgBloqueo.className = "alerta-bloqueo";
                                msgBloqueo.style.backgroundColor = "#f0fdf4";
                                msgBloqueo.style.borderColor = "#bbf7d0";
                                msgBloqueo.style.color = "#16a34a";
                                msgBloqueo.innerHTML = "✅ Vale localizado con éxito (Folio #" + valeEncontrado.id + "). Botones de impresión y cierre liberados.";
                            } else {
                                // Sigue sin existir el vale
                                btnImprimir.disabled = true;
                                btnCierre.disabled = true;
                                msgBloqueo.style.backgroundColor = "#fffbeb";
                                msgBloqueo.style.borderColor = "#fef3c7";
                                msgBloqueo.style.color = "#d97706";
                                msgBloqueo.innerHTML = "❌ No se encontró ningún vale registrado por <strong>$" + montoFaltante.toFixed(2) + "</strong>. Genérelo desde el menú de Cajas para desbloquear.";
                            }
                        })
                        .catch(err => {
                            console.error("Error al validar vale:", err);
                        });
                }
            </script>

        </body>
        </html>
    `);

    ventanaArqueo.document.close();
}

function procesarBajaCero(cajaId) {
    if (!confirm(`¿Estás completamente seguro de dar de baja la Caja N° ${cajaId}?\nEsta acción mandará su saldo permanentemente a $0.00 en Django.`)) {
        return;
    }

    const urlCajaPatch = `${urlcajas}${cajaId}/`; // Ajusta la concatenación según tus variables URL

    fetch(urlCajaPatch, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            saldo: "0.00"
        })
    })
        .then(res => {
            if (!res.ok) throw new Error("Error en la actualización del servidor.");
            return res.json();
        })
        .then(data => {
            alert(`La Caja N° ${cajaId} se ha cerrado y mandado a cero con éxito.`);

            // Ejecutamos tu función de refresco de datos para volver a pintar todo limpio
            solicitarDatosArq();
        })
        .catch(error => {
            console.error("Error al liquidar caja:", error);
            alert("No se pudo completar el cierre a cero de la caja.");
        });
}
