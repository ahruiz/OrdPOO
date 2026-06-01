
var urlingresos = "http://127.0.0.1:8000/api/ingresos/"
var urlcajas = "http://127.0.0.1:8000/api/cajas/"
var urlfacturas = "http://127.0.0.1:8000/api/facturas/"

let cajasexistentes = []; // Variable global para almacenar las cajas con todos sus datos
let facturasExistentes = []; // Variable global para almacenar las facturas con todos sus datos
let ingresosExistentes = []; // Variable global para almacenar los ingresos con todos sus datos

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
            facturas = facturas.filter(f => f.aplicada && f.aplicada !== 0 && f.aplicada !== "0");

            var card = facturas.map(function (factura) {
                var caja = cajas.find(c => c.id == factura.aplicada);
                var ingresoEncontrado = ingresos.find(i => (i.facturs == factura.numFact)
                    //(i.numRepos && factura.numRepos && i.numRepos == factura.numRepos) ||
                );
                const estaAplicada = factura.aplicada && factura.aplicada !== 0 && factura.aplicada !== "0";

                const n_reposicion = factura.numRepos || (ingresoEncontrado ? ingresoEncontrado.numRepos : "Sin datos");
                return `                

                <div class="cards">
                        <img src="../facturas/factura.jpg" alt="" class="custom-image">
                        <h2 class="badge">ID Factura: ${factura.id}</h2>
                        <p class="badge">Num de factura: ${factura.numFact}</p>
                        <p class="badge">Proveedor: ${factura.proveedor.toUpperCase()}</p>
                        <p class="badge">Descripción: ${factura.descripcion.toUpperCase()}</p>
                        <p class="badge">Importe: ${factura.importe}</p>
                        <p class="badge">Departamento: ${factura.departamento.toUpperCase()}</p>
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
    const numRepos = button.getAttribute("data-repos");

    if (numRepos && numRepos !== '0' && numRepos !== 0 && numRepos !== "Sin datos") {
        alert("Esta factura ya tiene una reposición asignada.");
        return;
    }

    // 1. Obtenemos la fecha y hora actual del sistema
    const ahora = new Date();

    // 2. Formateamos los componentes (asegurando 2 dígitos para cada uno)
    const aa = ahora.getFullYear().toString().slice(-2); // Toma los últimos 2 dígitos del año
    const mm = String(ahora.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const dd = String(ahora.getDate()).padStart(2, '0');
    const hh = String(ahora.getHours()).padStart(2, '0');
    const min = String(ahora.getMinutes()).padStart(2, '0'); // Usamos 'min' para evitar confundir con 'mm' (mes)
    const ss = String(ahora.getSeconds()).padStart(2, '0'); // Si quieres incluir segundos también

    // 3. Unimos los componentes para tus variables
    const aammdd = `${aa}${mm}${dd}`;
    const hhmmss = `${hh}${min}${ss}`;

    const importeLimpio = importe.replace(".", ''); // Elimina cualquier carácter que no sea dígito o punto

    // 4. Declaras tu variable numReps (asumiendo que 'caja' y 'factura' ya existen)
    const reposId = `${aammdd}${hhmmss}${caja_id}${num_factura}${importeLimpio}`;

    let cajaId_numerico = parseInt(caja_id, 10);
    let monto_numerico = parseFloat(importe);

    let caja = cajaId_numerico;
    let monto = monto_numerico;
    let facturs = num_factura;
    let descripcionrepos = descripcion;


    // if (numderepos !== '0') {
    //     alert("Esta factura ya tiene reposicion");
    //     return;
    // }

    if (!confirm("¿Seguro que quieres aplicar esta Reposicion?")) {
        return; // Si el usuario cancela, salimos de la función
    }


    var data = {
        caja: caja,
        importe: monto,
        numFact: facturs,
        descripcion: descripcionrepos,
        numRepos: reposId
    };
    console.log("Datos a enviar:", data);

    fetch(urlingresos + "reposicion/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then(async Response => {
            if (!Response.ok) {
                // Si da error 500, esto nos ayudará a ver qué dice el backend en la consola
                const text = await Response.text();
                throw new Error(text);
            }
            return Response.json();
        })
        .then(ingresoCaja => {
            console.log('Reposicion aplicada exitosamente en el servidor:', ingresoCaja);
            alert("Factura aplicada correctamente");

            const numReposOficial = ingresoCaja.numRepos; // Asegúrate de que el backend esté devolviendo este campo correctamente

            // ACTUALIZACIÓN LOCAL DEL SALDO (Buscando en tu variable global)
            // Buscamos el objeto real de la caja dentro de 'cajasexistentes'
            let cajaObjeto = cajasexistentes.find(c => String(c.id) === String(caja_id));

            if (cajaObjeto) {
                cajaObjeto.saldo = parseFloat(cajaObjeto.saldo) + monto_numerico;
                console.log(`Nuevo saldo local de la caja ${caja_id}:`, cajaObjeto.saldo);
            }
            // 3. CORRECCIÓN AQUÍ: Buscar en la lista correcta de FACTURAS
            // REEMPLAZA 'facturasExistentes' por el nombre real de tu variable global de facturas
            // (Por ejemplo: facturas_lista, listadoFacturas, etc.)
            if (!facturasExistentes) {
                console.warn("No hay facturas cargadas");
                return;
            }
            // NOTA: Si tus facturas están guardadas en otra variable global, cambia 'facturasExistentes' por esa variable aquí abajo:
            let facturaObjeto = facturasExistentes.find(
                f => String(f.numFact) === String(num_factura)
            );

            if (!facturaObjeto) {
                console.warn("No se encontró la factura.");
                return;
            }

            // ACTUALIZAR EN DJANGO
            fetch(urlfacturas + facturaObjeto.id + "/", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    numRepos: numReposOficial
                })
            })
                .then(r => {
                    if (!r.ok) {
                        throw new Error("No se pudo actualizar la factura");
                    }
                    return r.json();
                })
                .then(facturaActualizada => {

                    // ACTUALIZAR LOCALMENTE
                    facturaObjeto.numRepos = facturaActualizada.numRepos;

                    console.log(
                        `Factura ${num_factura} actualizada con reposición:`,
                        facturaActualizada.numRepos
                    );

                    mostrar_factAplicds();
                })
                .catch(error => {
                    console.error("Error actualizando factura:", error);
                });
        }).catch(error => {
            console.log("Error:", error);
            alert("No se pudo aplicar la reposicion");
        });
}

function repos_inicial() {
    var caja = document.getElementById("caja").value;
    var numFact = 9999; // Valor fijo para indicar que no hay facturas asociadas
    var monto = document.getElementById("importe").value;
    var descripcion = document.getElementById("descripcion").value;
    var numReposIni = new Date().toISOString().slice(0, 4) + new Date().toISOString().slice(5, 7) + new Date().toISOString().slice(8, 10) + new Date().toISOString().slice(11, 13) + new Date().toISOString().slice(14, 16) + caja;


    var data = {
        caja: caja,
        numFact: numFact,
        importe: monto,
        descripcion: descripcion,
        numRepos: numReposIni
    };

    if (caja === "" || numFact === "" || monto === "" || descripcion === "") {
        alert("Los campos no pueden estar en blanco, favor de completar el formulario")
        return;
    }


    fetch(urlingresos + "repos_inicial/", {
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
            document.getElementById("importe").value = "";
            document.getElementById("descripcion").value = "";
            //makeFetch();
        })
        .catch(error => {
            console.log('Hubo un problema:', error);
            alert("No se pudo crear la Reposicion. Revisa la consola.");
        });
}

//marcar bloque **************************************************************************************

// let ingresosexistentes = [];

// function makeFetch() {
//     fetch(urlingresos)
//         .then(Response => {
//             if (!Response.ok) {
//                 throw new Error("Error en la solicitud");
//             }
//             return Response.json();
//         })

//         .then(data => {
//             console.log(data);

//             if (data.length === 0) {
//                 document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
//                 return;
//             }

//             ingresosexistentes = data.map(i => Number(i.id !== 0)); // Guardamos los números de ingresos existentes

//             var card = data.map(function (campo) {
//                 return `
//                     <div class="cards">
//                         <img src="../ingresos/ingreso.jpg" alt="" class="custom-image">
//                         <h2 class="badge">Reposicion ID: ${campo.id}</h2>
//                         <p class="badge">Num de caja: ${campo.caja}</p>
//                         <p class="badge">monto: ${campo.monto}</p>
//                         <p class="badge">Descripción: ${(campo.descripcion ? campo.descripcion : "").toUpperCase()}</p>
//                         <p class="badge">Facturas asociadas: ${campo.facturs}</p>

//                     </div>
//             `}).join("");

//             document.getElementById("element").innerHTML = card;
//         })
//         .catch(error => {
//             console.log(error);
//         });

// }


// function makeFetch1() {
//     fetch(urlingresos).then(Response => {
//         if (!Response.ok) {
//             throw new Error("Error en la solicitud");
//         }
//         return Response.json();
//     })

//         .then(data => {
//             console.log(data);
//             var campos = data;

//             if (data.length === 0) {
//                 document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
//                 return;
//             }

//             var card = campos.map(function (campo) {
//                 return `
//                     <div class="cards">
//                         <img src="../ingresos/ingreso.jpg" alt="" class="custom-image">
//                         <h2 class="badge">Reposicion ID: ${campo.id}</h2>
//                         <p class="badge">Num de Caja: ${campo.caja}</p>
//                         <p class="badge">Monto: ${campo.monto}</p>
//                         <p class="badge">Descripción: ${(campo.descripcion || "").toUpperCase()}</p>
//                         <p class="badge">Facturas asociadas: ${campo.facturs}</p>
//                         <button class="btn-form1" onclick="borrarRepos(${campo.id},${campo.caja},${campo.monto})">
//                          Borrar
//                         </button>
//                     </div>
//             `}).join("");

//             document.getElementById("element").innerHTML = card;
//         })
//         .catch(error => {
//             console.log(error);
//         });

// }

// function tot_ingresos() {
//     fetch(urlingresos).then(Response => {
//         if (!Response.ok) {
//             throw new Error("Error en la solicitud");
//         }
//         return Response.json();
//     })

//         .then(data => {
//             console.log(data);
//             var campos = data;

//             if (data.length === 0) {
//                 document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
//                 return;
//             }

//             var card = campos.map(function (campo) {
//                 return `
//                     <div class="cards">
//                         <img src="../facturas/factura.jpg" alt="" class="custom-image">
//                         <h2 class="badge">Reposicion ID: ${campo.id}</h2>
//                         <p class="badge">Num de caja: ${campo.caja}</p>
//                         <p class="badge">Facturas asociadas: ${(campo.facturs || "").toUpperCase()}</p>
//                         <p class="badge">Importe Reposicion: ${(campo.monto || "").toUpperCase()}</p>
//                         <p class="badge">Descripción: ${(campo.descripcion || "").toUpperCase()}</p>
//                     </div>
//             `}).join("");

//             document.getElementById("element").innerHTML = card;
//         })
//         .catch(error => {
//             console.log(error);
//         });

// }

// function crear_repos() {
//     var caja = document.getElementById("caja").value;
//     var facturs = document.getElementById("facturs").value;
//     var monto = document.getElementById("monto").value;
//     var descripcion = document.getElementById("descripcion").value;

//     var data = {
//         caja: caja,
//         facturs: facturs,
//         monto: monto,
//         descripcion: descripcion
//     };

//     if (caja === "" || facturs === "" || monto === "" || descripcion === "") {
//         alert("Los campos no pueden estar en blanco, favor de completar el formulario")
//         return;
//     }


//     fetch(urlingresos + "reposicion/", {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error("Error en el servidor");
//             }
//             return response.json();
//         })
//         .then(ingresoCaja => {
//             console.log('Reposicion creada exitosamente :', data);

//             document.getElementById("caja").value = "";
//             document.getElementById("facturs").value = "";
//             document.getElementById("monto").value = "";
//             document.getElementById("descripcion").value = "";
//             makeFetch();
//         })
//         .catch(error => {
//             console.log('Hubo un problema:', error);
//             alert("No se pudo crear la factura. Revisa la consola.");
//         });
// }

// function borrarRepos(id, caja, monto) {
//     var id = id;
//     var caja = caja;
//     var monto = monto;

//     var data = {
//         id: id,
//         caja: caja,
//         monto: monto
//     }

//     console.log(data);
//     if (!confirm("¿Seguro que quieres borrar esta factura?")) {
//         return;
//     }

//     fetch(urlingresos + "borrarRepos/", {
//         method: "DELETE",
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//         .then(response => {

//             if (!response.ok) {
//                 throw new Error("Error al borrar");
//             }

//             alert("Factura borrada exitosamente");
//             makeFetch1(); // Recargar tarjetas
//         })
//         .catch(error => {
//             console.log("Error:", error);
//             alert("No se pudo borrar");
//         });
// }

// function modif_repos() {
//     let id = document.getElementById("id").value;
//     let valor = document.getElementById("value").value;

//     if (document.getElementById("caja").checked) {
//         valor = document.getElementById("value").value;

//         var caja = valor;
//         var data = {
//             caja: caja
//         };

//         console.log(data)

//     } else if (document.getElementById("facturs").checked) {
//         valor = document.getElementById("value").value;

//         var facturs = valor;
//         var data = {
//             facturs: facturs
//         };

//         console.log(data)

//     } else if (document.getElementById("monto").checked) {
//         valor = document.getElementById("value").value;

//         var monto = valor;
//         var data = {
//             monto: monto
//         };

//         console.log(data)

//     } else {
//         valor = document.getElementById("value").value;

//         var descripcion = valor;
//         var data = {
//             descripcion: descripcion
//         };

//         console.log(data)

//     }

//     if (data.length === 0) {
//         document.getElementById("element").innerHTML = "<h1>No hay datos disponibles.</h1>";
//         return;
//     }

//     if (data.caja === "" || data.facturs === "" || data.monto === "" || data.descripcion === "") {
//         alert("Faltan datos, favor de completar el formulario");
//         return;
//     }




//     fetch(urlingresos + id + "/", {
//         method: 'PATCH',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data),
//     })
//         .then(response => {

//             if (data.name === "" || data.last_name === "" || data.email === "" || data.phone === "") {
//                 throw new Error("Faltan datos, favor de completar el formulario");
//             }

//             return response.json();
//         })

//         .then(response => {
//             console.log('Respuesta de sv:' + response)
//             makeFetch();

//         })

//         .catch(error => {
//             console.log('Error en el servidor:' + error)

//             document.getElementById("mensaje").innerHTML =
//                 error.message;

//         });

// }

// function ingresosppal() {
//     fetch(urlingresos)
//         .then(Response => {
//             if (!Response.ok) {
//                 throw new Error("Error en la solicitud");
//             }
//             return Response.json();
//         })

//         .then(data => {
//             console.log(data);

//             if (data.length === 0) {
//                 document.getElementById("element").innerHTML = "<p class='main-container1'><strong>No hay REPOSICIONES disponibles.</strong></p>";
//                 return;
//             }

//             ingresosexistentes = data.map(i => Number(i.id !== 0)); // Guardamos los números de ingresos existentes

//             var card = data.map(function (campo) {
//                 return `
//                     <div class="cards1">
//                         <img src="../ingresos/ingreso.jpg" alt="" class="custom-image">
//                         <h2 class="badge">Reposicion ID: ${campo.id}</h2>
//                         <p class="badge">Num de caja: ${campo.caja}</p>
//                         <p class="badge">monto: ${campo.monto}</p>
//                         <p class="badge">Descripción: ${(campo.descripcion ? campo.descripcion : "").toUpperCase()}</p>
//                         <p class="badge">Facturas asociadas: ${campo.facturs}</p>

//                     </div>
//             `}).join("");

//             document.getElementById("element").innerHTML = card;
//         })
//         .catch(error => {
//             console.log(error);
//         });

// }

// function cardsindatos() {

//     const id = 99;
//     const caja_id = 1;
//     const facturs = 'Sin Datos';
//     const monto = '99';
//     const descripcion = 'Sin registro de reposiciones';

//     const data = {
//         id: id,
//         caja: caja_id,
//         facturs: facturs,
//         monto: monto,
//         descripcion: descripcion
//     }

//     console.log(data);

//     fetch(urlingresos + "reposicion/", {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error("Error en el servidor");
//             }
//             return response.json();
//         })

//         .then(ingresoCaja => {
//             console.log('Reposicion creada exitosamente :', data);
//         })

//         .catch(error => {
//             console.log('Hubo un problema:', error);
//             alert("No se pudo crear la factura. Revisa la consola.");
//         });
// }
