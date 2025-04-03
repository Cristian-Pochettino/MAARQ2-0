function IngresarUsuario() {
    let nombreUsuario;
    do {
        nombreUsuario = prompt("Ingrese su nombre por favor");
        if (nombreUsuario === "") {
            alert("Disculpe, ingrese su nombre de usuario nuevamente.");
        }
    } while (nombreUsuario === "");

    alert("Bienvenido a presupuesto de diseño MAARQ " + nombreUsuario);
}

const presupuesto = function(inmueble, presupuesto, metros) {
    this.inmueble = inmueble;
    this.presupuesto = presupuesto;
    this.metros = metros;
}

let inmueble1 = new presupuesto("casa", 1500000, 400);
let inmueble2 = new presupuesto("departamento", 700000, 200);
let inmueble3 = new presupuesto("monoambiente", 400000, 50);
let inmueble4 = new presupuesto("terreno", 3000000, 800);

const listado = [inmueble1, inmueble2, inmueble3, inmueble4];

function BusquedaInmueble() {
    let palabraClave = prompt("Ingrese el inmueble deseado").trim().toUpperCase();
    let resultado = listado.filter((x) => x.inmueble.toUpperCase().includes(palabraClave));

    if (resultado.length > 0) {
        console.table(resultado);
        solicitardatos(resultado);
    } else {
        alert("No se encontró el inmueble deseado.");
    }
}

function solicitardatos(resultado) {
    let eleccion;
    do {
        eleccion = prompt("¿Desea realizar revisiones? Ingrese sí/no").toLowerCase();

        if (eleccion === "si") {
            let nombredelInmueble = prompt("Ingrese el inmueble a reformar").trim();
            let inmuebleElegido = resultado.find(inmueble => inmueble.inmueble.toLowerCase() === nombredelInmueble.toLowerCase());

            if (inmuebleElegido) {
                let cuotas = 12;
                let planmensual = inmuebleElegido.presupuesto / cuotas;
                alert(`El costo de la reforma para ${inmuebleElegido.inmueble} es ${inmuebleElegido.presupuesto}. El plan de pago es ${planmensual} en un plazo de ${cuotas} cuotas.`);
            } else {
                alert("No se encontró el inmueble elegido.");
            }
        } else if (eleccion === "no") {
            alert("Muchas gracias por elegir nuestro servicio de arquitectura.");
        } else {
            alert("Disculpe, la respuesta no es válida. Vuelva a intentarlo.");
        }
    } while (eleccion !== "si" && eleccion !== "no");
}

function filtrarPorPresupuesto() {
    let seguirBuscando = true;

    while (seguirBuscando) {
        let presupuestoMaximo = parseFloat(prompt("Ingrese el presupuesto máximo que desea (en pesos)"));

        if (isNaN(presupuestoMaximo) || presupuestoMaximo <= 0) {
            alert("Por favor, ingrese un presupuesto válido.");
        } else {
            let inmueblesFiltrados = listado.filter(inmueble => inmueble.presupuesto <= presupuestoMaximo);

            if (inmueblesFiltrados.length > 0) {
                console.table(inmueblesFiltrados);
            } else {
                alert("No hay inmuebles disponibles dentro de ese presupuesto.");
            }
        }

        let continuar = prompt("¿Desea buscar más inmuebles? (si/no)").toLowerCase();
        if (continuar !== "si") {
            seguirBuscando = false;
            alert("Gracias por utilizar nuestro sistema.");
        }
    }
}

IngresarUsuario();
BusquedaInmueble();
filtrarPorPresupuesto();
