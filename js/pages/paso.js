const tipoEleccion = 1;
const tipoRecuento = 1;

let selectYear = document.getElementById('comboYear');
let selectCargo = document.getElementById('comboCargo');
let selectDistrito = document.getElementById('comboDistrito');
let selectSeccion = document.getElementById('comboSeccion');
let selectFiltrar = document.getElementById('filtrar');

// FILTRO AÑO
fetch("https://resultados.mininterior.gob.ar/api/menu/periodos")
    .then(response => response.json())
    .then(data => {
        data.forEach(year => {
            let option = document.createElement('option');
            option.value = year;
            option.text = year;
            selectYear.appendChild(option);
        });
    })
    .catch(error => console.error('Error al seleccionar el año: ', error));

// FILTRO CARGO
selectYear.addEventListener("change", () => {
    const selectedYear = selectYear.value;
    if (selectedYear) {
        fetch(`https://resultados.mininterior.gob.ar/api/menu?año=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                selectCargo.innerHTML = '<option>Cargo</option>';
                data.forEach(eleccion => {
                    if (eleccion.IdEleccion == tipoEleccion) {
                        eleccion.Cargos.forEach(cargo => {
                            const option = document.createElement("option");
                            option.value = cargo.IdCargo;
                            option.text = cargo.Cargo;
                            selectCargo.appendChild(option);
                        });
                    }
                });
            })
            .catch(error => console.error("Error al cargar los cargos:", error));
    }
});

// FILTRO DISTRITO
selectCargo.addEventListener("change", () => {
    const selectedYear = selectYear.value;
    const selectedCargo = selectCargo.value;
    if (selectedYear && selectedCargo) {
        selectDistrito.innerHTML = '';
        fetch(`https://resultados.mininterior.gob.ar/api/menu?año=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                selectDistrito.innerHTML = '<option value="">Distrito</option>';
                data.forEach(eleccion => {
                    if (eleccion.IdEleccion == tipoEleccion) {
                        eleccion.Cargos.forEach(cargo => {
                            if (cargo.IdCargo == selectedCargo) {
                                cargo.Distritos.forEach(distrito => {
                                    const option = document.createElement("option");
                                    option.value = distrito.IdDistrito;
                                    option.text = distrito.Distrito;
                                    selectDistrito.appendChild(option);
                                });
                            }
                        });
                    }
                });
            })
            .catch(error => console.error("Error al cargar los distritos:", error));
    }
});

// FILTRO SECCION
selectDistrito.addEventListener("change", () => {
    const selectedYear = selectYear.value;
    const selectedCargo = selectCargo.value;
    const selectedDistrito = selectDistrito.value;
    if (selectedYear && selectedCargo && selectedDistrito) {
        fetch(`https://resultados.mininterior.gob.ar/api/menu?año=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                selectSeccion.innerHTML = '<option value="">Sección</option>';
                data.forEach(eleccion => {
                    if (eleccion.IdEleccion == tipoEleccion) {
                        eleccion.Cargos.forEach(cargo => {
                            if (cargo.IdCargo == selectedCargo) {
                                cargo.Distritos.forEach(distrito => {
                                    if (distrito.IdDistrito == selectedDistrito) {
                                        let hdSeccionProvincial = document.getElementById("hdSeccionProvincial");
                                        hdSeccionProvincial.value = distrito.IdSecccionProvincial;
                                        distrito.SeccionesProvinciales.forEach(seccionProv => {
                                            seccionProv.Secciones.forEach(seccion => {
                                                const option = document.createElement("option");
                                                option.value = seccion.IdSeccion;
                                                option.text = seccion.Seccion;
                                                selectSeccion.appendChild(option);
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            })
            .catch(error => console.error("Error al cargar las secciones:", error));
    }
});