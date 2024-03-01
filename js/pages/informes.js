const msjAmarillo = document.getElementById('mensaje-amarillo');
const msjVerde = document.getElementById('mensaje-verde');
const msjRojo = document.getElementById('mensaje-rojo');
const cartelCargando = document.getElementById('cartel-cargando');
const tableInforme = document.getElementById('table-informe');
const mesasEscrutadas = document.getElementById("mesas-escrutadas");
const electores = document.getElementById("electores");
const participacion = document.getElementById("participacion");
const contendioCuadros = document.getElementById("contenido-cuadros");


let informes = [];
let resultados = "";


// FUNCIONES PARA OCULTAR Y MOSTRAR MENSAJES
function ocultarMensajes() {
    cartelCargando.style.visibility = 'hidden'
    msjRojo.style.visibility = 'hidden';
    msjAmarillo.style.visibility = 'hidden';
    msjVerde.style.visibility = 'hidden';
};

//EVENTOS.
document.addEventListener('DOMContentLoaded', () => {
    ocultarMensajes();
});

document.addEventListener('DOMContentLoaded', async () => {
    if (localStorage.getItem('INFORMES')) {
        informes = JSON.parse(localStorage.getItem('INFORMES'));
        informes.forEach(informe => {
            const url = armarUrl(informe);
            return consultarResultados(url, informe);
        });
    } else {
        mostrarMensaje(msjAmarillo, "Se debe Agregar un Informe!");
    }
});


function armarUrl(informe) {
    let datos = informe.split('|');

    let anioEleccion = datos[0];
    let tipoRecuento = datos[1];
    let tipoEleccion = datos[2];
    let categoriaId = datos[3];
    let distritoId = datos[4];
    let seccionProvincialId = datos[5];
    let seccionId = datos[6];
    let circuitoId = datos[7];
    let mesaId = datos[8];
    let selectedYear = datos[9];
    let selectedCargo = datos[10];
    let selectedDistrito = datos[11];
    let selectedSeccion = datos[12];

    let urlSinParametros = `https://resultados.mininterior.gob.ar/api/resultados/getResultados`;
    let parametros = `?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}&selectedYear=${selectedYear}&selectedCargo=${selectedCargo}&selectedDistrito=${selectedDistrito}&selectedSeccion=${selectedSeccion}`
    let url = urlSinParametros + parametros;
    console.log(urlSinParametros + parametros);
    return url;
};

function mostrarMensaje(tipoMensaje, mensaje) {
    tipoMensaje.textContent = mensaje;
    tipoMensaje.style.visibility = 'visible';
    setTimeout(function () {
        ocultarMensajes();
    }, 5000);
};

async function consultarResultados(url, informe) {
    try {
        cartelCargando.style.visibility = 'visible';
        let response = await fetch(url);
        console.log(response.ok);
        if (response.ok) {
            cartelCargando.style.visibility = 'hidden';
            const resultados = await response.json();
            console.log(resultados);
            crearInforme(resultados, informe);
        } else {
            mostrarMensaje(msjRojo, "Error, el servidor sssse encuentra fuera de servicio!");
        }
    }
    catch (errorObj) {
        mostrarMensaje(msjRojo, "Error, el servidor sssse encuentra fuera de servicio!");
    }
};

function crearInforme(resultados, informe) {
    let datos = informe.split('|');

    let anioEleccion = datos[0];
    let tipoEleccion = datos[2];
    let añoSeleccionado = datos[9];
    let cargoSeleccionado = datos[10];
    let distritoSeleccionado = datos[11];
    let seccionSeleccionada = datos[12];
    let eleccion = "";

    if (tipoEleccion == 1) {
        eleccion = "Paso"
    } else {
        eleccion = "Generales"
    };
    try {
        let agrupaciones = resultados.valoresTotalizadosPositivos;

        const trow = document.createElement('tr');

        const tdProvincia = document.createElement('td');
        cambiarImagenProvincia(tdProvincia, informe);

        const tdEleccion = document.createElement('td');

        const tituloEleccion = document.createElement('h5');
        tituloEleccion.textContent = `Elecciones ${anioEleccion} | ${eleccion}`;

        const filtrado = document.createElement('p');
        filtrado.classList.add('texto-path');
        filtrado.innerHTML = `${anioEleccion}>${eleccion}<br>${cargoSeleccionado}<br>${distritoSeleccionado}<br>${seccionSeleccionada}`;

        tdEleccion.appendChild(tituloEleccion);
        tdEleccion.appendChild(filtrado);

        const tdDatosGenerales = document.createElement('td');
        tdDatosGenerales.style.width = '100px';
        tdDatosGenerales.style.height = '50px';
        
        let nuevoDatosGenerales = document.getElementById("contenido-cuadros").cloneNode(true);

        tdDatosGenerales.appendChild(nuevoDatosGenerales);

        const spansDentroDeCuadritos = nuevoDatosGenerales.querySelectorAll('span');
        console.log(spansDentroDeCuadritos);

        const spanMesas = spansDentroDeCuadritos[0];
        spanMesas.textContent = `Mesas Escrutadas ${resultados.estadoRecuento.mesasTotalizadas}`;

        const spanElectores = spansDentroDeCuadritos[1];
        spanElectores.textContent = `Electores ${resultados.estadoRecuento.cantidadElectores}`;

        const spanParticipacion = spansDentroDeCuadritos[2];
        spanParticipacion.innerHTML = `Participacion sobre escrutado <br> ${resultados.estadoRecuento.participacionPorcentaje}%`;

        nuevoDatosGenerales.style.visibility = "visible";

        const tdDatos = document.createElement('td');

        agrupaciones.slice(0, 7).forEach(agrupacion => {
            const nombrePartido1 = document.createElement('p');
            nombrePartido1.textContent = agrupacion.nombreAgrupacion;
            nombrePartido1.style.fontSize = '10px';
            nombrePartido1.style.fontWeight = 'bold';

            const spanPartidoPorcentajes = document.createElement('span');
            spanPartidoPorcentajes.textContent = `${agrupacion.votosPorcentaje}% - `;
            spanPartidoPorcentajes.style.fontSize = '10px';
            spanPartidoPorcentajes.classList.add('porcentajes');
            
            const parrafoPartido = document.createElement('p');
            parrafoPartido.style.fontSize = '12px';

            const spanPartidoVotos = document.createElement('span');
            spanPartidoVotos.textContent = `${agrupacion.votos} votos`;
            spanPartidoVotos.style.fontSize = '10px';
            spanPartidoVotos.classList.add('votos');
            
            nombrePartido1.appendChild(document.createElement('br')); 
            parrafoPartido.appendChild(document.createElement('br')); 
            parrafoPartido.appendChild(spanPartidoPorcentajes);
            parrafoPartido.appendChild(spanPartidoVotos);
            tdDatos.appendChild(nombrePartido1);
            tdDatos.appendChild(parrafoPartido);

        });
        
        trow.appendChild(tdProvincia);
        trow.appendChild(tdEleccion);
        trow.appendChild(tdDatosGenerales);
        trow.appendChild(tdDatos);

        tableInforme.appendChild(trow);
    } catch (errorObj) {
        console.log("No se creo el informe porque el resultado esta vacio");
    }
}


function cambiarImagenProvincia(svgContainer, informe) {
    let datos = informe.split('|');
    let distrito = datos[11];

    const provincia = provinciasSVG.find((item) => item.provincia.toUpperCase() === distrito.toUpperCase());

    if (provincia) {
        const divSvg = document.createElement('div');
        divSvg.innerHTML = provincia.svg;
        divSvg.classList.add('contenedor-provincia');

        svgContainer.appendChild(divSvg);
    } else {
        svgContainer.innerHTML = "<p>La imagen no se pudo cargar</p>";
    };
};