const tipoEleccion = 1;
const tipoRecuento = 1;

let selectYear = document.getElementById('comboYear');
let selectCargo = document.getElementById('comboCargo');
let selectDistrito = document.getElementById('distrito');
let selectFiltrar = document.getElementById('filtrar');

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