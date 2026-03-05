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
                    <div class="card">
                        <img src="./cajero.jpg" alt="" class="custom-image">
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

