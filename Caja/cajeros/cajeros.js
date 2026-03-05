
var url = "http://127.0.0.1:8000/api/cajeros/"

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

            var card = campos.map(function (campo) {
                return `
                    <div class="cards">
                        <img src="../cajeros/cajero.jpg" alt="" class="custom-image">
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

function makeFetch1() {
    fetch(url).then(Response => {
        if (!Response.ok) {
            throw new Error("Error en la solicitud");
        }
        return Response.json();
    })

        .then(data => {
            console.log(data);
            var campos = data;

            var card = campos.map(function (campo) {
                return `
                    <div class="cards">
                        <img src="../cajeros/cajero.jpg" alt="" class="custom-image">
                        <h2 class="badge">Num de Cajero: ${campo.id}</h2>
                        <p class="badge">Nombre: ${campo.name.toUpperCase()} ${campo.last_name.toUpperCase()}</p>
                        <p class="badge">Correo: ${campo.email.toUpperCase()}</p>
                        <p class="badge">Telefono: ${campo.phone}</p>

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

    console.log(data)

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then(response => {
        console.log('Respuesta de sv:' + response)
        makeFetch();

    }).catch(error => {
        console.log('Error en el servidor:' + error)


    });

}

function borrarCajero(id) {

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
            makeFetch1(); // Recargar tarjetas
        })
        .catch(error => {
            console.log("Error:", error);
            alert("No se pudo borrar");
        });
}

function modifica_cajero() {
    if (!confirm("¿Seguro que quieres modificar este cajero?")) {
        return;
    }
    let id = document.getElementById("id").value;
    let valor = document.getElementById("value").value;


    if (document.getElementById("cam_nom").checked) {
        valor = document.getElementById("value").value;

        var nombre = valor;
        var data = {
            name: nombre
        };

        console.log(data)

    } else if (document.getElementById("cam_ape").checked) {
        valor = document.getElementById("value").value;

        var apellido = valor;
        var data = {
            last_name: apellido
        };

        console.log(data)

    } else if (document.getElementById("cam_email").checked) {
        valor = document.getElementById("value").value;

        var email = valor;
        var data = {
            email: email
        };

        console.log(data)

    } else {
        valor = document.getElementById("value").value;

        var phone = valor;
        var data = {
            phone: phone
        };
    }

    console.log(data)



    fetch(url + id + "/", {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then(response => {
        console.log('Respuesta de sv:' + response)
        makeFetch();

    }).catch(error => {
        console.log('Error en el servidor:' + error)


    });

}