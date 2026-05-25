
var urlingresos = "http://127.0.0.1:8000/api/ingresos/"

let ingresosexistentes = [];

function makeFetch() {
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
                        <img src="../ingresos/ingreso.jpg" alt="" class="custom-image">
                        <h2 class="badge">Reposicion ID: ${campo.id}</h2>
                        <p class="badge">Num de caja: ${campo.caja}</p>
                        <p class="badge">monto: ${campo.monto}</p>
                        <p class="badge">Descripción: ${(campo.descripcion ? campo.descripcion : "").toUpperCase()}</p>
                        <p class="badge">Facturas asociadas: ${campo.facturs}</p>

                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
            console.log(error);
        });

}


function makeFetch1() {
    fetch(urlingresos).then(Response => {
        if (!Response.ok) {
            throw new Error("Error en la solicitud");
        }
        return Response.json();
    })

        .then(data => {
            console.log(data);
            var campos = data;

            if (data.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
                return;
            }

            var card = campos.map(function (campo) {
                return `
                    <div class="cards">
                        <img src="../ingresos/ingreso.jpg" alt="" class="custom-image">
                        <h2 class="badge">Reposicion ID: ${campo.id}</h2>
                        <p class="badge">Num de Caja: ${campo.caja}</p>
                        <p class="badge">Monto: ${campo.monto}</p>
                        <p class="badge">Descripción: ${(campo.descripcion || "").toUpperCase()}</p>
                        <p class="badge">Facturas asociadas: ${campo.facturs}</p>
                        <button class="btn-form1" onclick="borrarRepos(${campo.id},${campo.caja},${campo.monto})">
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

function tot_ingresos() {
    fetch(urlingresos).then(Response => {
        if (!Response.ok) {
            throw new Error("Error en la solicitud");
        }
        return Response.json();
    })

        .then(data => {
            console.log(data);
            var campos = data;

            if (data.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
                return;
            }

            var card = campos.map(function (campo) {
                return `
                    <div class="cards">
                        <img src="../facturas/factura.jpg" alt="" class="custom-image">
                        <h2 class="badge">Reposicion ID: ${campo.id}</h2>
                        <p class="badge">Num de caja: ${campo.caja}</p>
                        <p class="badge">Facturas asociadas: ${(campo.facturs || "").toUpperCase()}</p>
                        <p class="badge">Importe Reposicion: ${(campo.monto || "").toUpperCase()}</p>
                        <p class="badge">Descripción: ${(campo.descripcion || "").toUpperCase()}</p>
                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
            console.log(error);
        });

}

function crear_repos() {
    var caja = document.getElementById("caja").value;
    var facturs = document.getElementById("facturs").value;
    var monto = document.getElementById("monto").value;
    var descripcion = document.getElementById("descripcion").value;

    var data = {
        caja: caja,
        facturs: facturs,
        monto: monto,
        descripcion: descripcion
    };

    if (caja === "" || facturs === "" || monto === "" || descripcion === "") {
        alert("Los campos no pueden estar en blanco, favor de completar el formulario")
        return;
    }


    fetch(urlingresos + "reposicion/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en el servidor");
            }
            return response.json();
        })
        .then(ingresoCaja => {
            console.log('Reposicion creada exitosamente :', data);

            document.getElementById("caja").value = "";
            document.getElementById("facturs").value = "";
            document.getElementById("monto").value = "";
            document.getElementById("descripcion").value = "";
            makeFetch();
        })
        .catch(error => {
            console.log('Hubo un problema:', error);
            alert("No se pudo crear la factura. Revisa la consola.");
        });
}

function borrarRepos(id, caja, monto) {
    var id = id;
    var caja = caja;
    var monto = monto;

    var data = {
        id: id,
        caja: caja,
        monto: monto
    }

    console.log(data);
    if (!confirm("¿Seguro que quieres borrar esta factura?")) {
        return;
    }

    fetch(urlingresos + "borrarRepos/", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {

            if (!response.ok) {
                throw new Error("Error al borrar");
            }

            alert("Factura borrada exitosamente");
            makeFetch1(); // Recargar tarjetas
        })
        .catch(error => {
            console.log("Error:", error);
            alert("No se pudo borrar");
        });
}

function modif_repos() {
    let id = document.getElementById("id").value;
    let valor = document.getElementById("value").value;

    if (document.getElementById("caja").checked) {
        valor = document.getElementById("value").value;

        var caja = valor;
        var data = {
            caja: caja
        };

        console.log(data)

    } else if (document.getElementById("facturs").checked) {
        valor = document.getElementById("value").value;

        var facturs = valor;
        var data = {
            facturs: facturs
        };

        console.log(data)

    } else if (document.getElementById("monto").checked) {
        valor = document.getElementById("value").value;

        var monto = valor;
        var data = {
            monto: monto
        };

        console.log(data)

    } else {
        valor = document.getElementById("value").value;

        var descripcion = valor;
        var data = {
            descripcion: descripcion
        };

        console.log(data)

    }

    if (data.length === 0) {
        document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
        return;
    }

    if (data.caja === "" || data.facturs === "" || data.monto === "" || data.descripcion === "") {
        alert("Faltan datos, favor de completar el formulario");
        return;
    }




    fetch(urlingresos + id + "/", {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then(response => {

            if (data.name === "" || data.last_name === "" || data.email === "" || data.phone === "") {
                throw new Error("Faltan datos, favor de completar el formulario");
            }

            return response.json();
        })

        .then(response => {
            console.log('Respuesta de sv:' + response)
            makeFetch();

        })

        .catch(error => {
            console.log('Error en el servidor:' + error)

            document.getElementById("mensaje").innerHTML =
                error.message;

        });

}

function ingresosppal() {
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
                document.getElementById("element").innerHTML = "<p class='main-container1'><strong>No hay REPOSICIONES disponibles.</strong></p>";
                return;
            }

            ingresosexistentes = data.map(i => Number(i.id !== 0)); // Guardamos los números de ingresos existentes

            var card = data.map(function (campo) {
                return `
                    <div class="cards1">
                        <img src="../ingresos/ingreso.jpg" alt="" class="custom-image">
                        <h2 class="badge">Reposicion ID: ${campo.id}</h2>
                        <p class="badge">Num de caja: ${campo.caja}</p>
                        <p class="badge">monto: ${campo.monto}</p>
                        <p class="badge">Descripción: ${(campo.descripcion ? campo.descripcion : "").toUpperCase()}</p>
                        <p class="badge">Facturas asociadas: ${campo.facturs}</p>

                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
            console.log(error);
        });

}

function cardsindatos() {

    const id = 99;
    const caja_id = 1;
    const facturs = 'Sin Datos';
    const monto = '99';
    const descripcion = 'Sin registro de reposiciones';

    const data = {
        id: id,
        caja: caja_id,
        facturs: facturs,
        monto: monto,
        descripcion: descripcion
    }

    console.log(data);

    fetch(urlingresos + "reposicion/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en el servidor");
            }
            return response.json();
        })

        .then(ingresoCaja => {
            console.log('Reposicion creada exitosamente :', data);
        })

        .catch(error => {
            console.log('Hubo un problema:', error);
            alert("No se pudo crear la factura. Revisa la consola.");
        });
}
