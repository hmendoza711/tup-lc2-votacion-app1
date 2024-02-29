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

let nuevoInforme;


const graficaAmarillo = getComputedStyle(document.documentElement).getPropertyValue('--grafica-amarillo');
const graficaAmarilloClaro = getComputedStyle(document.documentElement).getPropertyValue('--grafica-amarillo-claro');
const graficaCeleste = getComputedStyle(document.documentElement).getPropertyValue('--grafica-celeste');
const graficaCelesteClaro = getComputedStyle(document.documentElement).getPropertyValue('--grafica-celeste-claro');
const graficaBordo = getComputedStyle(document.documentElement).getPropertyValue('--grafica-bordo');
const graficaBordoClaro = getComputedStyle(document.documentElement).getPropertyValue('--grafica-bordo-claro');
const graficaLila = getComputedStyle(document.documentElement).getPropertyValue('--grafica-lila');
const graficaLilaClaro = getComputedStyle(document.documentElement).getPropertyValue('--grafica-lila-claro');
const graficaLila2 = getComputedStyle(document.documentElement).getPropertyValue('--grafica-lila2');
const graficaLila2Claro = getComputedStyle(document.documentElement).getPropertyValue('--grafica-lila2-claro');
const graficaGris = getComputedStyle(document.documentElement).getPropertyValue('--grafica-gris');
const graficaGrisClaro = getComputedStyle(document.documentElement).getPropertyValue('--grafica-gris-claro');
const graficaVerde = getComputedStyle(document.documentElement).getPropertyValue('--grafica-verde');
const graficaVerdeClaro = getComputedStyle(document.documentElement).getPropertyValue('--grafica-verde-claro');


// Ahora puedes usar estas variables en tu código JavaScript

const agrupacionesYColores = {
    0: { oscuro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-amarillo'), claro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-amarillo-claro') },
    1: { oscuro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-celeste'), claro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-celeste-claro') },
    2: { oscuro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-bordo'), claro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-bordo-claro') },
    3: { oscuro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-lila'), claro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-lila-claro') },
    4: { oscuro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-lila2'), claro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-lila2-claro') },
    5: { oscuro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-gris'), claro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-gris-claro') },
    6: { oscuro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-verde'), claro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-verde-claro') },
    7: { oscuro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-gris'), claro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-gris-claro') },
    8: { oscuro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-gris'), claro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-gris-claro') },
    9: { oscuro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-gris'), claro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-gris-claro') },
    10: { oscuro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-gris'), claro: getComputedStyle(document.documentElement).getPropertyValue('--grafica-gris-claro') },
};

//EVENTOS.
document.addEventListener('DOMContentLoaded', () => {
    mostrarMensaje(msjAmarillo, "“Debe seleccionar los valores a filtrar y hacer clic en el botón FILTRAR”");
});
document.addEventListener('DOMContentLoaded', consultarAños);
selectYear.addEventListener('change', consultarCargo);
selectCargo.addEventListener('change', cargarDistritos);
selectDistrito.addEventListener('change', cargarSeccion);
selectSeccion.addEventListener('change', () => {
    selectedSeccion = selectSeccion.options[selectSeccion.selectedIndex].textContent;
});
btnFiltrar.addEventListener('click', filtrarResultados);
btnAgrInforme.addEventListener('click', agregarInforme);

// FUNCIONES PARA OCULTAR Y MOSTRAR MENSAJES
function ocultarMensajes() {
    cartelCargando.style.visibility = 'hidden'
    msjRojo.style.visibility = 'hidden';
    msjAmarillo.style.visibility = 'hidden';
    msjVerde.style.visibility = 'hidden';
};

function mostrarMensaje(tipoMensaje, mensaje,) {
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
        mostrarMensaje(msjAmarillo, 'Complete campos de AÑO, CARGO, DISTRITO y SECCION');
    } else if (selectCargo.value == 'none') {
        mostrarMensaje(msjAmarillo, 'Complete campos de CARGO, DISTRITO y SECCION');
    } else if (selectDistrito.value == 'none') {
        mostrarMensaje(msjAmarillo, 'Complete campos de DISTRITO y SECCION');
    } else {
        mostrarMensaje(msjAmarillo, 'Complete campo de SECCION');
    }
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
            console.log(response.ok);

            if (response.ok) {
                cartelCargando.style.visibility = 'hidden';
                resultados = await response.json();
                console.log(resultados);
                mostrarTitulos();
                cuadroEscrutadas.textContent = `${resultados.estadoRecuento.mesasTotalizadas}`;
                cuadroElectores.textContent = `${resultados.estadoRecuento.cantidadElectores}`;
                cuadroParticipacion.textContent = `${resultados.estadoRecuento.participacionPorcentaje}%`;
                cambiarMapas();
                cuadroAgrupPoliticas();
                mostrarContenido();
            } else {
                mostrarMensaje(msjRojo, "Error, el servidor sssse encuentra fuera de servicio!");
            }
        }
        catch (errorObj) {
            mostrarMensaje(msjRojo, "Error, el servdddddidor se encuentra fuera de servicio!");
        };
    } else {
        camposVacios();
    };
    resumenVotos();
};

// FUNCION PARA VALIDAR LOS SELECTS.
function validarSelects() {
    return selectYear.value !== 'none' && selectCargo.value !== 'none' && selectDistrito.value !== 'none' && selectSeccion.value !== 'none'
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
        const tituloProvincia = document.createElement('h3');
        tituloProvincia.textContent = provincia.provincia;
        tituloProvincia.classList.add('titulo-cuadros', 'titulo-provincias');

        const divSvg = document.createElement('div');
        divSvg.innerHTML = provincia.svg;
        divSvg.classList.add('cuadro-provincias');

        svgContainer.appendChild(tituloProvincia);
        svgContainer.appendChild(divSvg);
    } else {
        svgContainer.innerHTML = "<h3>Provincia</h3>";
    }
};

//LIMPIAR ELEMENTOS.
function limpiarElemento(element) {
    element.innerHTML = "";
};

// +AGREGAR INFORMES
function agregarInforme() {
    let vAnio = selectYear.value;
    let vTipoRecuento = tipoRecuento;
    let vTipoEleccion = tipoEleccion;
    let vCategoriaId = selectCargo.value;
    let vDistrito = selectDistrito.value;
    let vSeccionProvincial = 0;
    let seccionId = selectSeccion.value;
    let circuitoId = "";
    let mesaId = "";

    nuevoInforme = `${vAnio}|${vTipoRecuento}|${vTipoEleccion}|${vCategoriaId}|${vDistrito}|${vSeccionProvincial}|${seccionId}|${circuitoId}|${mesaId}|${selectedYear}|${selectedCargo}|${selectedDistrito}|${selectedSeccion}`;

    let informes = [];

    if (localStorage.getItem('INFORMES')) {
        informes = JSON.parse(localStorage.getItem('INFORMES'));
    };

    if (informes.includes(nuevoInforme)) {
        mostrarMensaje(msjAmarillo, "El informe ya se encuentra añadido.");
    } else {
        informes.push(nuevoInforme);
        localStorage.setItem('INFORMES', JSON.stringify(informes));
        mostrarMensaje(msjVerde, "Informe agregado con éxito");
    };
};

function cuadroAgrupPoliticas() {

    console.log(resultados.valoresTotalizadosPositivos);

    let agrupaciones = resultados.valoresTotalizadosPositivos.sort((a, b) => b.votos - a.votos);


    if (agrupaciones) {

        agrupaciones.forEach(agrupacion => {

            const divAgrupacion = document.createElement('div');
            divAgrupacion.classList.add('nombre-agrupaciones1');
            const lineaSeparadora = document.createElement('hr');
            lineaSeparadora.classList.add('linea-separadora');
            divAgrupacion.appendChild(lineaSeparadora);

            const tituloAgrupaciones = document.createElement('h4');
            tituloAgrupaciones.classList.add('titulo-agrupaciones');
            divAgrupacion.appendChild(tituloAgrupaciones);


            cuadroAgrupaciones.appendChild(divAgrupacion);
            let listaPartidos = agrupacion.listas;

            if (listaPartidos) {
                listaPartidos.forEach(partido => {

                    //Creo <divPartido> para el nombre del partido <p>
                    const divPartido = document.createElement('div');
                    divPartido.classList.add('partido1');

                    const nombrePartido1 = document.createElement('p');
                    nombrePartido1.textContent = partido.nombre;
                    nombrePartido1.classList.add('nombre-partido');
                    divPartido.appendChild(nombrePartido1);

                    //Creo <divPorcentajesPartido> para el porcentaje <span> del partido.
                    const divPorcentajesPartido = document.createElement('div');
                    divPorcentajesPartido.classList.add('porcentajes-partido');

                    const spanPartidoPorcentajes = document.createElement('span');
                    const porcentajeVotos = `${(partido.votos * 100 / agrupacion.votos).toFixed(2)}%`;
                    spanPartidoPorcentajes.textContent = porcentajeVotos;
                    spanPartidoPorcentajes.classList.add('porcentajes-partido');
                    divPorcentajesPartido.appendChild(spanPartidoPorcentajes);

                    //Creo <divVotosPartido> para la cantidad de votos del partido.
                    const divVotosPartido = document.createElement('div');
                    divVotosPartido.classList.add('votos-partidos');

                    const spanPartidoVotos = document.createElement('span');
                    spanPartidoVotos.textContent = `${partido.votos} - Votos`;
                    spanPartidoVotos.classList.add('votos-partidos');
                    divVotosPartido.appendChild(spanPartidoVotos);

                    //Creo <div> para la barra. 
                    const divBarra = document.createElement('div');
                    divBarra.classList.add('progress');

                    // Index agrupacion
                    const idAgrupacion = agrupaciones.findIndex(agrup => agrup.idAgrupacion === agrupacion.idAgrupacion);

                    // Colores.
                    const colorClaro = agrupacionesYColores[idAgrupacion].claro;
                    const colorOscuro = agrupacionesYColores[idAgrupacion].oscuro;

                    divBarra.style.backgroundColor = colorClaro;


                    const divProgresoBarra = document.createElement('div');
                    divProgresoBarra.classList.add('progress-bar');
                    divProgresoBarra.style.width = porcentajeVotos;
                    divProgresoBarra.style.background = colorOscuro;
                    divBarra.appendChild(divProgresoBarra);

                    //appendChild
                    divAgrupacion.appendChild(divPartido);
                    divAgrupacion.appendChild(divPorcentajesPartido);
                    divAgrupacion.appendChild(divVotosPartido);
                    divAgrupacion.appendChild(divBarra);

                });
            };
            tituloAgrupaciones.textContent = agrupacion.nombreAgrupacion;
        });
    };
};

function resumenVotos() {
    let agrupaciones = resultados.valoresTotalizadosPositivos.sort((a, b) => b.votos - a.votos);

    if (agrupaciones) {
        // Limitar a mostrar solo las primeras 7 agrupaciones
        agrupaciones.slice(0, 7).forEach(agrupacion => {
            const divAgrupacion = document.createElement('div');
            divAgrupacion.classList.add('nombre-agrupaciones2');

            // Crear div para el partido 
            const divPartido = document.createElement('div');
            divPartido.classList.add('partido2');
            divPartido.textContent = agrupacion.nombreAgrupacion;

            const contenedor = document.createElement('div');
            contenedor.classList.add('contenedor');

            // Crear span para porcentaje de votos
            const spanPorcentaje = document.createElement('div');
            const porcentajeVotos = `${(agrupacion.votosPorcentaje).toFixed(2)}%`;
            spanPorcentaje.textContent = porcentajeVotos;
            spanPorcentaje.classList.add('porcentaje-votos');
            divPartido.appendChild(spanPorcentaje);

            // Crear div para la barra horizontal
            const divBarraHorizontal = document.createElement('div');
            divBarraHorizontal.classList.add('progress-vertical1');

            // Crear div para la barra vertical
            const divBarraVertical = document.createElement('div');
            divBarraVertical.classList.add('progress-vertical2');
            divBarraVertical.style.height = porcentajeVotos;

            // Index agrupacion
            const idAgrupacion = agrupaciones.findIndex(agrup => agrup.idAgrupacion === agrupacion.idAgrupacion);

            // Colores
            const colorClaro = agrupacionesYColores[idAgrupacion].claro;
            const colorOscuro = agrupacionesYColores[idAgrupacion].oscuro;

            divBarraHorizontal.style.backgroundColor = colorClaro;
            divBarraVertical.style.backgroundColor = colorOscuro;

            // Agregar las barras al div del partido
            divPartido.appendChild(divBarraHorizontal);
            divPartido.appendChild(divBarraVertical);

            // Agregar div del partido al div de agrupaciones
            divAgrupacion.appendChild(divPartido);

            // Agregar div de agrupaciones al contenedor
            cuadroResVotos.appendChild(divAgrupacion);
        });
    }
}




function removerHijos(element) {
    element.innerHTML = "";
};

function mostrarContenido() {
    secContenido.style.visibility = 'visible';
};