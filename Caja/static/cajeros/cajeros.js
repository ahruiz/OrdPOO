const STATIC_URL = window.STATIC_URL || '/static/';
const CAJEROS_IMAGES = STATIC_URL + 'cajeros/';
const CAJAS_IMAGES = STATIC_URL + 'cajas/';
const FACTURAS_IMAGES = STATIC_URL + 'facturas/';

// API de Caja Chica (proyecto raíz)
var url = "/api/cajeros/"
var urlcajas = "/api/cajas/"
var urlfacturas = "/api/facturas/"

function makeFetch() {
    fetch(url).then(Response => {
        if (!Response.ok) {
            throw new Error("Error en la solicitud");
        }
        return Response.json();
    })

        .then(data => {
            console.log(data);
            var campos = data;

            if (campos.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay cajeros registrados.</h1>";
                return;
            }

            var card = campos.map(function (campo) {
                return `
                    <div class="cards">
                        <img src="${CAJEROS_IMAGES}cajero.jpg" alt="" class="custom-image">
                        <h2 class="badge">Num de Cajero: ${campo.id}</h2>
                        <p class="badge">Nombre: ${campo.name.toUpperCase()} ${campo.last_name.toUpperCase()}</p>
                        <p class="badge">Correo: ${campo.email.toUpperCase()}</p>
                        <p class="badge">Telefono: ${campo.phone}</p>

                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
            console.log(error);
        });

}

var cajerosconsaldo = [];

function cajerossaldo() {
    Promise.all([
        fetch(urlcajas).then(r => r.json()),
        fetch(url).then(r => r.json())
    ])
        .then(([cajas, cajeros]) => {
            console.log("cajas", cajas);
            console.log("cajeros", cajeros);

            if (cajas.length === 0 || cajeros.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
                return;
            }

            //cajerosconsaldo = cajeros.filter(c => cajas.some(caja => caja.Cajero == c.id && caja.saldo > 0)); // Filtrar cajeros que tienen una caja con saldo
            //console.log("cajeros con saldo", cajerosconsaldo);
            // if (cajeros.length === 0) {
            //     document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
            //     return;
            // }

            var card = cajeros.map(function (cajero) {
                var caja = cajas.find(c => c.id == cajero.id); // Encontrar la caja asociada al cajero

                return `
                    <div class="cards">
                        <img src="${CAJAS_IMAGES}caja_ch.jpg" alt="" class="custom-image">
                        <h2 class="badge">Num de Caja: ${cajero.id}</h2>
                        <p class="badge">Cajero: ${caja ? caja.Cajero : "Baja por Arqueo"}</p>
                        <p class="badge">Nombre: ${cajero ? cajero.name.toUpperCase() + " " + cajero.last_name.toUpperCase() : "Desconocido"}</p>
                        <p class="badge">Correo: ${cajero ? cajero.email.toUpperCase() : "Desconocido"}</p>
                        <p class="badge">Telefono: ${cajero ? cajero.phone : "Desconocido"}</p>
                        <p class="badge">Saldo inicial: ${caja ? caja.saldo_inicial : Number(0)}</p>
                        <p class="btn-form1">Saldo actual: ${caja ? caja.saldo : Number(0)}</p>
                        <button class="btn-form1" onclick="borrarCajero(${cajero.id}, ${caja ? caja.saldo : Number(0)})">
                         Borrar
                        </button>
                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
            makeFetch
        })
        .catch(error => {
            console.log(error);
        });
}

var cajerossinsaldo = [];

function cajerosSinSaldo() {
    Promise.all([
        fetch(urlcajas).then(r => r.json()),
        fetch(url).then(r => r.json())
    ])
        .then(([cajas, cajeros]) => {
            console.log("cajas", cajas);
            console.log("cajeros", cajeros);


            //cajerossinsaldo = cajeros.filter(c => cajas.some(caja => caja.Cajero == c.id && caja.saldo <= 0)); // Filtrar cajeros que no tienen una caja con saldo
            //console.log("cajeros sin saldo", cajerossinsaldo);
            if (cajeros.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
                return;
            }

            var card = cajerossinsaldo.map(function (cajero) {
                var caja = cajas.find(c => c.id == cajero.id); // Encontrar la caja asociada al cajero


                return `
                    <div class="cards">
                        <img src="${CAJAS_IMAGES}caja_ch.jpg" alt="" class="custom-image">
                        <h2 class="badge">Num de Caja: ${cajero.id}</h2>
                        <p class="badge">Cajero: ${caja ? caja.Cajero : "Desconocido"}</p>
                        <p class="badge">Nombre: ${cajero ? cajero.name.toUpperCase() + " " + cajero.last_name.toUpperCase() : "Desconocido"}</p>
                        <p class="badge">Correo: ${cajero ? cajero.email.toUpperCase() : "Desconocido"}</p>
                        <p class="badge">Telefono: ${cajero ? cajero.phone : "Desconocido"}</p>
                        <p class="badge">Saldo inicial: ${caja ? caja.saldo_inicial : Number(0)}</p>
                        <p class="btn-form1">Saldo actual: ${caja ? caja.saldo : Number(0)}</p>
                        <button class="btn-form1" onclick="borrarCajero(${cajero.id}, ${caja ? caja.saldo : Number(0)})">
                         Borrar
                        </button>
                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
            makeFetch
        })
        .catch(error => {
            console.log(error);
        });
}


function crear_cajero() {
    var nombre = document.getElementById("nombre").value;
    var apellido = document.getElementById("apellido").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;

    var data = {
        name: nombre,
        last_name: apellido,
        email: email,
        phone: phone
    };

    if (data.name === "" || data.last_name === "" || data.email === "" || data.phone === "") {
        alert("Faltan datos, favor de completar el formulario");
        return;
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    let message = text || 'Faltan datos, favor de completar el formulario';
                    throw new Error(message);
                });
            }
            return response.json();
        })
        .then(response => {
            console.log('Respuesta de sv:', response)

            document.getElementById("nombre").value = "";
            document.getElementById("apellido").value = "";
            document.getElementById("email").value = "";
            document.getElementById("phone").value = "";

            makeFetch();

        })
        .catch(error => {
            console.log('Error en el servidor:' + error)

            document.getElementById("mensaje").innerHTML =
                error.message;

        });

}

function borrarCajero(id, saldo) {
    if (saldo > 0) {
        alert("No se puede borrar un cajero con saldo positivo. Favor de vaciar la caja antes de eliminar el cajero.");
        return;
    }

    if (!confirm("¿Seguro que quieres borrar este cajero?")) {
        return;
    }

    fetch(url + id + "/", {
        method: "DELETE"
    })
        .then(response => {

            if (!response.ok) {
                throw new Error("Error al borrar");
            }

            alert("Cajero eliminado");
            cajerossaldo(); // Recargar tarjetas
        })
        .catch(error => {
            console.log("Error:", error);
            alert("No se pudo borrar");
        });
}

function modifica_cajero() {
    let id = document.getElementById("id").value;
    let valor = document.getElementById("value").value.trim();

    if (!id || !valor) {
        document.getElementById("mensaje").innerHTML = "Favor de completar todos los campos del formulario";
        return;
    }

    if (document.getElementById("cam_nom").checked) {
        valor = document.getElementById("value").value.trim();

        var nombre = valor;
        var data = {
            name: nombre
        };

        console.log(data)

    } else if (document.getElementById("cam_ape").checked) {
        valor = document.getElementById("value").value.trim();

        var apellido = valor;
        var data = {
            last_name: apellido
        };

        console.log(data)

    } else if (document.getElementById("cam_email").checked) {
        valor = document.getElementById("value").value.trim();

        var email = valor;
        var data = {
            email: email
        };

        console.log(data)

    } else {
        valor = document.getElementById("value").value.trim();

        var phone = valor;
        var data = {
            phone: phone
        };
        console.log(data)
    }


    fetch(url + id + "/", {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo modificar el cajero en el servidor");
            }
            return response.json();
        })

        .then(response => {
            alert("Cajero modificado");
            makeFetch();

        })

        .catch(error => {
            console.log('Error en el servidor:' + error)

            document.getElementById("mensaje").innerHTML =
                error.message;

        });

}

function gastoTotPantsPpals() {

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
                        <p class= "btn-form1">Gasto total: ${facturasporCaja.reduce((acc, f) => acc + Number(f.importe), 0)}</p>

                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
            console.log(error);
        });

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
                        <p class= "btn-form1">Gasto total: ${facturasporCaja.reduce((acc, f) => acc + Number(f.importe), 0)}</p>

                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
            console.log(error);
        });

}

function saldosppal() {
    fetch(url).then(Response => {
        if (!Response.ok) {
            throw new Error("Error en la solicitud");
        }
        return Response.json();
    })

        .then(data => {
            console.log(data);
            var campos = data;

            if (campos.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay cajeros registrados.</h1>";
                return;
            }

            var card = campos.map(function (campo) {
                return `
                    <div class="cards1">
                        <img src="${CAJEROS_IMAGES}cajero.jpg" alt="" class="custom-image">
                        <h2 class="badge">Num de Cajero: ${campo.id}</h2>
                        <p class="badge">Nombre: ${campo.name.toUpperCase()} ${campo.last_name.toUpperCase()}</p>
                        <p class="badge">Correo: ${campo.email.toUpperCase()}</p>
                        <p class="badge">Telefono: ${campo.phone}</p>

                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
            console.log(error);
        });

}
