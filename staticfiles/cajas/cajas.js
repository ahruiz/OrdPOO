
var urlcajas = "http://127.0.0.1:8000/api/cajas/"
var urlcajeros = "http://127.0.0.1:8000/api/cajeros/"
var urlfacturas = "http://127.0.0.1:8000/api/facturas/"

const STATIC_URL = window.STATIC_URL || '/static/';
const CAJAS_IMAGES = STATIC_URL + 'cajas/';
const FACTURAS_IMAGES = `${STATIC_URL}facturas/`;

let cajasexistentes = [];

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

            var card = cajas.map(function (caja) {
                var cajero = cajeros.find(c => c.id == caja.Cajero);
                return `
                    <div class="cards">
                        <img src="${CAJAS_IMAGES}caja_ch.jpg" alt="" class="custom-image">
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
                        <img src="${CAJAS_IMAGES}caja_ch.jpg" alt="" class="custom-image">
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
                        <img src="${CAJAS_IMAGES}caja_ch.jpg" alt="" class="custom-image">
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

    // BUSCAR CAJEROS EN LA BD
    fetch(urlcajeros)
        .then(response => response.json())
        .then(cajeros => {

            console.log("Cajeros existentes:", cajeros);

            // VALIDAR SI EXISTE EL CAJERO
            let cajeroExiste = cajeros.find(
                c => String(c.id) === String(cajero)
            );

            if (!cajeroExiste) {
                alert("El cajero no existe en la base de datos");
                return;
            }

            // DATOS PARA CREAR LA CAJA
            var data = {
                Cajero: cajero,
                saldo_inicial: saldo_inicial,
                saldo: saldo
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

            // SI EL RETURN SE CANCELÓ ARRIBA
            if (!response) return;

            if (!response.ok) {
                throw new Error("Error al crear la caja");
            }

            return response.json();

        })
        .then(data => {

            if (!data) return;

            console.log('Respuesta servidor:', data);

            alert("Caja creada correctamente");

            makeFetch();

        })
        .catch(error => {

            console.log('Error en el servidor:', error);

            document.getElementById("mensaje").innerHTML =
                error.message;

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
                        <img src="${FACTURAS_IMAGES}factura.jpg" alt="" class="custom-image">
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
                        <img src="${FACTURAS_IMAGES}factura.jpg" alt="" class="custom-image">
                        <p class= "btn-form1">Caja: ${caja.id}</p>
                        ${facturasporCaja.map(f => `
                                <p class="btn-form1">
                                    Factura: ${f.id} (${f.numFact}) : ${f.importe}
                                </p>
                            `).join("")}
                        <p class= "btn-form1">Saldo: ${caja.saldo}</p>
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
                        <img src="${CAJAS_IMAGES}caja_ch.jpg" alt="" class="custom-image">
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
