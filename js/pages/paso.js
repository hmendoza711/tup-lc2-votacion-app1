const tipoEleccion = 1;
const tipoRecuento = 1;

const selectYear = document.getElementById('comboYear');
const selectCargo = document.getElementById('comboCargo');
const selectDistrito = document.getElementById('comboDistrito');
const inputSProvincial = document.getElementById("hdSeccionProvincial");
const selectSeccion = document.getElementById('comboSeccion');
const btnFiltrar = document.getElementById('filtrar');
const cartelCargando = document.getElementById('cartel-cargando');
const msjVerde = document.getElementById('mensaje-verde');
const msjRojo = document.getElementById('mensaje-rojo');
const msjAmarillo = document.getElementById('mensaje-amarillo');
const secContenido = document.getElementById('sec-contenido');
const btnAgrInforme = document.getElementById('agregar-informe');
const cuadroEscrutadas = document.getElementById('cuadro-escrutadas');
const cuadroElectores = document.getElementById('cuadro-electores');
const cuadroParticipacion = document.getElementById('cuadro-participacion');
const cuadroAgrupaciones = document.getElementById('cuadro-agrupaciones');
const svgContainer = document.getElementById('svg-container');
const cuadroResVotos = document.getElementById('cuadro-resumen');

let selectedYear = "";
let selectedCargo = "";
let selectedDistrito = "";
let selectedSeccion = "";

let agrupacionesYColores = {};

let coloresGraficaPlenos = [
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-amarillo'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-celeste'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-bordo'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-lila'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-lila2'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-verde'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-gris')
]

let coloresGraficaLivianos = [
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-amarillo-claro'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-celeste-claro'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-bordo-claro'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-lila-claro'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-lila2-claro'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-verde-claro'),
    getComputedStyle(document.documentElement).getPropertyValue('--grafica-gris-claro')
]

document.addEventListener('DOMContentLoaded', () => {
    mostrarMensajes(msjAmarillo, "Seleccionar valores de Año, Cargo, Distrito y Sección para FILTRAR");
});
document.addEventListener('DOMContentLoaded', consultarAños);
selectYear.addEventListener('change', consultarDatos);

// FUNCIONES PARA OCULTAR Y MOSTRAR MENSAJES
function ocultarMensajes() {
    cartelCargando.style.visibility = 'hidden'
    msjRojo.style.visibility = 'hidden';
    msjAmarillo.style.visibility = 'hidden';
    msjVerde.style.visibility = 'hidden';
};

function mostrarMensajes(tipoMensaje, mensaje,) {
    tipoMensaje.textContent = mensaje
    tipoMensaje.style.visibility = 'visible';
    setTimeout(function () {
        ocultarMensajes();
    }, 5000);
};

//FUNCION PARA CONSULTAR AÑOS
async function consultarAños() {
    const url = `https://resultados.mininterior.gob.ar/api/menu/periodos`;
    try {
        const response = await fetch(url);
        console.log(response.ok);
        if (response.ok) {
            const años = await response.json();
            años.forEach((item) => {
                const option = document.createElement('option');
                option.value = item;
                option.text = item;
                selectYear.appendChild(option);
            });
        } else {
            mostrarMensaje(msjRojo, "Error, el servidor se encuentra fuera de servicio!");
        }
    }
    catch (errorObj) {
        ocultarMensajes();
        mostrarMensaje(msjRojo, "Error!!");
        setInterval(function () {
            msjRojo.style.visibility = 'visible'
        }, 5000); 
    }
};

// FUNCION PARA CONSULTAR CARGOS
async function consultarDatos() {
    selectedYear = selectYear.options[selectedYear.selectedIndex].textContent;
    const url = "https://resultados.mininterior.gob.ar/api/menu?año=";
    try {
        const response = await fetch(url + selectedYear.value);
        console.log(response.ok);
        if (response.ok) {
            limpiarSelect(selectCargo);
            limpiarSelect(selectDistrito);
            limpiarSelect(selectSeccion);

            datosElecciones = await response.json();
            datosElecciones.forEach((eleccion) => {
                if (eleccion.IdEleccion == tipoEleccion) {
                    eleccion.Cargos.forEach((cargo) => {
                        const option = document.createElement('option');
                        option.value = cargo.IdCargo;
                        option.text = cargo.Cargo;
                        selectCargo.appendChild(option);
                    });
                }

            });
        } else {
            mostrarMensaje(msjRojo, "Error, el servidor se encuentra fuera de servicio!");
        }
    }
    catch (err) {
        mostrarMensaje(msjRojo, "Error!!");
    }
};




