var urlcajas = "http://127.0.0.1:8000/api/cajas/"
var urlcajeros = "http://127.0.0.1:8000/api/cajeros/"
var urlfacturas = "http://127.0.0.1:8000/api/facturas/"
var urlusrs = "http://127.0.0.1:8000/api/usuarios/"

function saldodecajas() {
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
                        <h2 class="badge">Num de Caja: ${caja.id}</h2>
                        <p class="badge">Cajero: ${caja.Cajero}</p>
                        <p class="badge">Nombre del Cajero: ${cajero ? cajero.name.toUpperCase() + " " + cajero.last_name.toUpperCase() : "Desconocido"}</p>
                        <p class="badge">Correo del Cajero: ${cajero ? cajero.email.toUpperCase() : "Desconocido"}</p>
                        <p class="badge">Telefono del Cajero: ${cajero ? cajero.phone : "Desconocido"}</p>
                        <p class="badge">Saldo inicial: ${caja.saldo_inicial}</p>
                        <p class="btn-form">Saldo actual: ${caja.saldo}</p>
                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
            console.log(error);
        });

}
function cargarFormAlta() {
    fetch("../cajeros/alta.html")
        .then(response => {
            if (!response.ok) throw new Error("Archivo no encontrado");
            return response.text();
        })
        .then(html => {
            document.getElementById("element").innerHTML = html;
        })
        .catch(err => {
            console.error("Error al cargar formulario", err);
            document.getElementById("element").innerHTML = "Error al cargar el archivo.";
        });
}
function logout() {
    localStorage.removeItem('usuario');
    window.location.href = 'acceso.html';
}

function fetchusrs() {
    fetch(urlusrs).then(Response => {
        if (!Response.ok) {
            throw new Error("Error en la solicitud");
        }
        return Response.json();
    })

        .then(data => {
            console.log(data);
            var campos = data;

            if (campos.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay usuarios registrados.</h1>";
                return;
            }
            num_id = campos[0].id;
            nom_usurio = campos[0].nombre;

            var card = campos.map(function (campo) {
                return `
                    <div class="cards">
                        <img src="../cajeros/cajero.jpg" alt="" class="custom-image">
                        <h2 class="badge">Num de Cajero: ${campo.id}</h2>
                        <p class="badge">Nombre: ${campo.nombre}</p>
                        <p class="badge">Correo: ${campo.email}</p>
                    </div>
            `}).join("");
            //cerramos sesion y nos dirijimos a la pagina de login
            usrlogout(num_id);


        })

        .catch(error => {
            console.log(error);
        });

}
function fetchlogeado() {
    fetch(urlusrs).then(response => {
        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }
        return response.json();
    })

        .then(data => {
            console.log(data);
            var campos = data;

            if (campos.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay usuarios registrados.</h1>";
                return;
            }

            var logeado = campos.map(function (campo) {
                return `
                    <div>
                        <p class="badge">Nombre: ${campo.nombre}</p>
                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = logeado;
        })

        .catch(error => {
            console.log(error);
        });

}

function usrlogout(id) {

    if (!confirm("¿Seguro que quieres cerrar sesión?")) {
        return; // Si el usuario cancela, salimos de la función

    }

    fetch(urlusrs + id + "/logout_usuario/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id }),
    })
        .then(response => {
            if (response.ok) {
                // Redireccionamos al login o inicio tras cerrar sesión
                window.location.href = '../acceso/index.html';
            }
        });

}
