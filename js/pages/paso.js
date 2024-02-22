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
const titulo = document.getElementById('titulo');
const subtitulo = document.getElementById('subtitulo');

let selectedYear = "";
let selectedCargo = "";
let selectedDistrito = "";
let selectedSeccion = "";
let datosElecciones;

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
    mostrarMensajes(msjAmarillo, "“Debe seleccionar los valores a filtrar y hacer clic en el botón FILTRAR”");
});
document.addEventListener('DOMContentLoaded', consultarAños);
selectYear.addEventListener('change', consultarCargo);
selectCargo.addEventListener('change', cargarDistritos);
selectDistrito.addEventListener('change', cargarSeccion);
selectSeccion.addEventListener('change', () => {
    selectedSeccion = selectSeccion.options[selectSeccion.selectedIndex].textContent;
});
btnFiltrar.addEventListener('click', filtrarResultados);

// FUNCIONES PARA OCULTAR Y MOSTRAR MENSAJES
function ocultarMensajes() {
    cartelCargando.style.visibility = 'hidden'
    msjRojo.style.visibility = 'hidden';
    msjAmarillo.style.visibility = 'hidden';
    msjVerde.style.visibility = 'hidden';
};

function mostrarMensajes(tipoMensaje, mensaje,) {
    ocultarMensajes();
    tipoMensaje.textContent = mensaje
    tipoMensaje.style.visibility = 'visible';
    setTimeout(function () {
        ocultarMensajes();
    }, 5000);
};

//CARTELES PARA CAMPOS INCOMPLETOS.
function camposVacios() {
    if (selectYear.value == 'none') {
        mostrarMensaje(msjAmarillo, 'Por favor complete los campos de año, cargo, distrito y seccion antes de filtrar');
    } else if (selectCargo.value == 'none') {
        mostrarMensaje(msjAmarillo, 'Por favor complete los campos de cargo, distrito y seccion antes de filtrar');
    } else if (selectDistrito.value == 'none') {
        mostrarMensaje(msjAmarillo, 'Por favor complete los campos de distrito y seccion antes de filtrar');
    } else {
        mostrarMensaje(msjAmarillo, 'Por favor complete el campos de seccion antes de filtrar');
    };
};

// LIMPIAR SELECTS
function limpiarSelect(select) {
    while (select.options.length > 1) {
        select.remove(1);
    }
};

//FUNCION PARA CONSULTAR AÑOS.
async function consultarAños() {
    const url = `https://resultados.mininterior.gob.ar/api/menu/periodos`;
    try {
        const response = await fetch(url);
        console.log(response.ok);
        if (response.ok) {
            const años = await response.json();
            años.forEach((años) => {
                const option = document.createElement('option');
                option.value = años;
                option.text = años;
                selectYear.appendChild(option);
            });
        } else {
            mostrarMensaje(msjRojo, "Error, el servidor se encuentra fuera de servicio!");
        }
    }
    catch (errorObj) {
        ocultarMensajes();
        mostrarMensaje(msjRojo, "Error, el servidor se encuentra fuera de servicio!");
        setInterval(function () {
            msjRojo.style.visibility = 'visible'
        }, 5000);
    }
};

// FUNCION PARA CONSULTAR CARGOS.
async function consultarCargo() {
    selectedYear = selectYear.options[selectYear.selectedIndex].textContent;
    const url = "https://resultados.mininterior.gob.ar/api/menu?año=";
    try {
        const response = await fetch(url + selectYear.value);
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
    catch (errorObj) {
        mostrarMensaje(msjRojo, "Error, el servidor se encuentra fuera de servicio!");
    }
};

//FUNCION PARA CARGAR DISTRITOS.
function cargarDistritos() {
    selectedCargo = selectCargo.options[selectCargo.selectedIndex].textContent;
    limpiarSelect(selectDistrito);
    limpiarSelect(selectSeccion);

    datosElecciones.forEach((eleccion) => {
        if (eleccion.IdEleccion == tipoEleccion) {
            eleccion.Cargos.forEach((cargo) => {
                if (cargo.IdCargo == selectCargo.value) {
                    cargo.Distritos.forEach((distrito) => {
                        const option = document.createElement('option');
                        option.value = distrito.IdDistrito;
                        option.textContent = distrito.Distrito;
                        selectDistrito.appendChild(option);
                    });
                }
            });
        }
    });
};

//FUNCION PARA CARGAR SECCION.
function cargarSeccion() {
    selectedDistrito = selectDistrito.options[selectDistrito.selectedIndex].textContent;
    limpiarSelect(selectSeccion);
    datosElecciones.forEach((eleccion) => {
        if (eleccion.IdEleccion == tipoEleccion) {
            eleccion.Cargos.forEach((cargo) => {
                if (cargo.IdCargo == selectCargo.value) {
                    cargo.Distritos.forEach((distrito) => {
                        if (distrito.IdDistrito == selectDistrito.value) {
                            distrito.SeccionesProvinciales.forEach((seccionProvincia) => {
                                inputSProvincial.id = seccionProvincia.IDSeccionProvincial;
                                seccionProvincia.Secciones.forEach((seccion) => {
                                    const option = document.createElement('option');
                                    option.value = seccion.IdSeccion;
                                    option.textContent = seccion.Seccion;
                                    selectSeccion.appendChild(option);
                                })
                            })
                        }
                    });
                }
            });
        }
    });
};

//FUNCION PARA FILTRAR RESULTADOS.
async function filtrarResultados() {
    if (validarSelects()) {
        ocultarMensajes();
        const url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados`;
        let anioEleccion = selectYear.value;
        let categoriaId = selectCargo.value;
        let distritoId = selectDistrito.value;
        let seccionProvincialId = 0;
        let seccionId = selectSeccion.value;
        let circuitoId = "";
        let mesaId = "";
        let parametros = `?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;
        try {
            cartelCargando.style.visibility = 'visible';
            const response = await fetch(url + parametros);
            if (response.ok) {
                cartelCargando.style.visibility = 'hidden';
                resultados = await response.json();
                console.log(resultados)
                mostrarTitulos();
                cuadroEscrutadas.textContent = `${resultados.estadoRecuento.mesasTotalizadas}`;
                cuadroElectores.textContent = `${resultados.estadoRecuento.cantidadElectores}`;
                cuadroParticipacion.textContent = `${resultados.estadoRecuento.participacionPorcentaje}%`;

            } else {
                mostrarMensaje(msjRojo, "Error, el servidor se encuentra fuera de servicio!");
            }
        }
        catch (errorObj) {
            mostrarMensaje(msjRojo, "Error, el servidor se encuentra fuera de servicio!");
        }
    } else {
        camposVacios();
    }
};

// FUNCION PARA VALIDAR LOS SELECTS.
function validarSelects() {
    return (!(selectYear.value === 'none') && !(selectCargo.value === 'none') && !(selectDistrito.value === 'none') && !(selectSeccion.value === 'none'));
};

// FUNCION PARA MOSTRAR TITULO Y SUBTITULO.
function mostrarTitulos() {
    titulo.textContent = `Elecciones ${selectYear.value} | Paso`
    subtitulo.textContent = subtitulo.textContent = `${selectYear.options[selectYear.selectedIndex].textContent} > Paso > ${selectCargo.options[selectCargo.selectedIndex].textContent} > ${selectDistrito.options[selectDistrito.selectedIndex].textContent} > ${selectSeccion.options[selectSeccion.selectedIndex].textContent}`;

    titulo.style.visibility = 'visible';
    subtitulo.style.visibility = 'visible';
};

//FUNCION CAMBIAR MAPAS.
function cambiarMapas() {
    
    limpiarElemento(svgContainer);

    const provincia = provinciasSVG.find((item) => item.provincia.toUpperCase() === selectedDistrito.toUpperCase());

    if (provincia) {
        const h3Provincia = document.createElement('h3');
        h3Provincia.textContent = provincia.provincia; 
        h3Provincia.classList.add('titulo-cuadros', 'titulo-provincias');

        const divSvg = document.createElement('div');
        divSvg.innerHTML = provincia.svg;
        divSvg.classList.add('cuadro-provincias');

        svgContainer.appendChild(h3Provincia);
        svgContainer.appendChild(divSvg);
    } else {
        svgContainer.innerHTML = "<p>Nos se puede cargar la imagen.</p>";
    }
};


function limpiarElemento(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};


