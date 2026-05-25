
var url = "http://127.0.0.1:8000/api/facturas/"

let facturasexistentes = [];

function makeFetch() {
    fetch(url)
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

            facturasexistentes = data.map(f => Number(f.numFact)); // Guardamos los números de factura existentes

            var card = data.map(function (campo) {
                return `
                    <div class="cards">
                        <img src="../facturas/factura.jpg" alt="" class="custom-image">
                        <h2 class="badge">Factura ID: ${campo.id}</h2>
                        <p class="badge">Num de Factura: ${campo.numFact}</p>
                        <p class="badge">Proveedor: ${(campo.proveedor ? campo.proveedor : "").toUpperCase()}</p>
                        <p class="badge">Descripción: ${(campo.description ? campo.description : "").toUpperCase()}</p>
                        <p class="badge">Importe: ${campo.importe}</p>
                        <p class="badge">Departamento: ${(campo.departamento ? campo.departamento : "").toUpperCase()}</p>
                        <p class="${campo.aplicada !== '0' ? 'btn-edofactpag' : 'btn-edofactpte'}">Estado: ${campo.aplicada !== '0' ? "Pagada" : "Pendiente"}</p>

                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
            console.log(error);
        });

}

var facturaspendientes = [];

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

            if (data.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
                return;
            }

            facturaspendientes = data.filter(f => f.aplicada === '0'); // guardamos las facturas pendientes
            data = facturaspendientes;
            console.log(data);
            var campos = data;

            var card = campos.map(function (campo) {
                return `
                    <div class="cards">
                        <img src="../facturas/factura.jpg" alt="" class="custom-image">
                        <h2 class="badge">Factura ID: ${campo.id}</h2>
                        <p class="badge">Num de Factura: ${campo.numFact}</p>
                        <p class="badge">Proveedor: ${(campo.proveedor || "").toUpperCase()}</p>
                        <p class="badge">Descripción: ${(campo.description || "").toUpperCase()}</p>
                        <p class="badge">Importe: ${campo.importe}</p>
                        <p class="badge">Departamento: ${(campo.departamento || "").toUpperCase()}</p>
                        <p class="${campo.aplicada !== '0' ? 'btn-edofactpag' : 'btn-edofactpte'}">Estado: ${campo.aplicada !== '0' ? "Pagada" : "Pendiente"}</p>
                        <button class="btn-form1" onclick="borrarFactura(${campo.id})">
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

function soloFactsPendientes() {
    fetch(url).then(Response => {
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

            facturaspendientes = data.filter(f => f.aplicada === '0'); // guardamos las facturas pendientes
            data = facturaspendientes;
            console.log(data);
            var campos = data;

            var card = campos.map(function (campo) {
                return `
                    <div class="cards">
                        <img src="../facturas/factura.jpg" alt="" class="custom-image">
                        <h2 class="badge">Factura ID: ${campo.id}</h2>
                        <p class="badge">Num de Factura: ${campo.numFact}</p>
                        <p class="badge">Proveedor: ${(campo.proveedor || "").toUpperCase()}</p>
                        <p class="badge">Descripción: ${(campo.description || "").toUpperCase()}</p>
                        <p class="badge">Importe: ${campo.importe}</p>
                        <p class="badge">Departamento: ${(campo.departamento || "").toUpperCase()}</p>
                        <p class="${campo.aplicada !== '0' ? 'btn-edofactpag' : 'btn-edofactpte'}">Estado: ${campo.aplicada !== '0' ? "Pagada" : "Pendiente"}</p>
                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
            console.log(error);
        });

}

function crear_fact() {
    var numfact = document.getElementById("numFact").value;
    var proveedor = document.getElementById("proveedor").value;
    var descripcion = document.getElementById("description").value;
    var importe = document.getElementById("importe").value;
    var departamento = document.getElementById("departamento").value;

    if (facturasexistentes.includes(numfact)) {
        alert("El número de factura " + numfact + " ya existe en el sistema. Refrescando la lista...");
        return;
    }

    var data = {
        numFact: numfact,
        proveedor: proveedor,
        description: descripcion,
        importe: Number(importe),
        departamento: departamento
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en el servidor");
            }
            return response.json();
        })
        .then(factura => {
            console.log("facturas existentes")
            console.log('Factura creada exitosamente:', factura);
            alert(`Factura creada con ID: ${factura.id}`);

            document.getElementById("numFact").value = "";
            document.getElementById("proveedor").value = "";
            document.getElementById("description").value = "";
            document.getElementById("importe").value = "";
            document.getElementById("departamento").value = "";
            makeFetch();
        })
        .catch(error => {
            console.log('Hubo un problema:', error);
            alert("No se pudo crear la factura. Revisa la consola.");
        });
}

function borrarFactura(id) {

    if (!confirm("¿Seguro que quieres borrar esta factura?")) {
        return;
    }

    fetch(url + id + "/", {
        method: "DELETE"
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

function modifica_fact() {
    let id = document.getElementById("id").value;
    let valor = document.getElementById("value").value;

    if (document.getElementById("numFact").checked) {
        valor = document.getElementById("value").value;

        var numFact = valor;
        var data = {
            numFact: numFact
        };

        console.log(data)

    } else if (document.getElementById("proveedor").checked) {
        valor = document.getElementById("value").value;

        var proveedor = valor;
        var data = {
            proveedor: proveedor
        };

        console.log(data)

    } else if (document.getElementById("description").checked) {
        valor = document.getElementById("value").value;

        var description = valor;
        var data = {
            description: description
        };

        console.log(data)

    } else if (document.getElementById("importe").checked) {
        valor = document.getElementById("value").value;

        var importe = valor;
        var data = {
            importe: importe
        };

        console.log(data)

    } else {
        valor = document.getElementById("value").value;

        var departamento = valor;
        var data = {
            departamento: departamento
        };
        console.log(data)
    }

    if (data.length === 0) {
        document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
        return;
    }

    if (data.proveedor === "" || data.description === "" || data.importe === "" || data.departamento === "") {
        throw new Error("Faltan datos, favor de completar el formulario");
    }



    fetch(url + id + "/", {
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

function facturasppal() {
    fetch(url)
        .then(Response => {
            if (!Response.ok) {
                throw new Error("Error en la solicitud");
            }
            return Response.json();
        })

        .then(data => {
            console.log(data);

            if (data.length === 0) {
                document.getElementById("element").innerHTML = "<h1>No hay facturas disponibles.</h1>";
                return;
            }

            facturasexistentes = data.map(f => Number(f.numFact)); // Guardamos los números de factura existentes

            var card = data.map(function (campo) {
                return `
                    <div class="cards1">
                        <img src="../facturas/factura.jpg" alt="" class="custom-image">
                        <h2 class="badge">Factura ID: ${campo.id}</h2>
                        <p class="badge">Num de Factura: ${campo.numFact}</p>
                        <p class="badge">Proveedor: ${(campo.proveedor ? campo.proveedor : "").toUpperCase()}</p>
                        <p class="badge">Descripción: ${(campo.description ? campo.description : "").toUpperCase()}</p>
                        <p class="badge">Importe: ${campo.importe}</p>
                        <p class="badge">Departamento: ${(campo.departamento ? campo.departamento : "").toUpperCase()}</p>
                        <p class="${campo.aplicada !== '0' ? 'btn-edofactpag' : 'btn-edofactpte'}">Estado: ${campo.aplicada !== '0' ? "Pagada" : "Pendiente"}</p>

                    </div>
            `}).join("");

            document.getElementById("element").innerHTML = card;
        })
        .catch(error => {
            console.log(error);
        });

}
