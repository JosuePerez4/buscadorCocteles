document.addEventListener('DOMContentLoaded', function () {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Usamos el proxy de CORS Anywhere
    const ingredienteSelect = document.getElementById('ingrediente');
    const categoriaSelect = document.getElementById('categoria');
    const nombreInput = document.getElementById('input-nombre');
    const btnBuscar = document.getElementById('btn-buscar');
    const resultadosDiv = document.getElementsByClassName('resultados-busqueda')[0];

    const ingredientesUrl = 'http://www.thecocktaildb.com/api/json/v1/1/list.php?i=list';
    const categoriasUrl = 'http://www.thecocktaildb.com/api/json/v1/1/list.php?a=list';

    // Obtener ingredientes
    fetch(proxyUrl + ingredientesUrl)  // Aquí añadimos el proxy
        .then(function (response) { return response.json(); })
        .then(function (data) {
            const ingredientes = data.drinks;
            for (let i = 0; i < ingredientes.length; i++) {
                const ingrediente = ingredientes[i];
                const option = document.createElement('option');
                option.value = ingrediente.strIngredient1;
                option.textContent = ingrediente.strIngredient1;
                ingredienteSelect.appendChild(option);
            }
        })
        .catch(function (error) {
            console.error('Error al obtener los ingredientes:', error);
        });

    // Obtener categorías
    fetch(proxyUrl + categoriasUrl)
        .then(function (response) {
            if (response.ok && response.headers.get('Content-Type').includes('application/json')) {
                return response.json();
            } else {
                throw new Error('La respuesta no es un JSON válido');
            }
        })
        .then(function (data) {
            const categorias = data.drinks;
            for (let i = 0; i < categorias.length; i++) {
                const categoria = categorias[i];
                const option = document.createElement('option');
                option.value = categoria.strAlcoholic;
                option.textContent = categoria.strAlcoholic;
                categoriaSelect.appendChild(option);
            }
        })
        .catch(function (error) {
            console.error('Error al obtener las categorías:', error);
        });

    // Manejar la búsqueda de cócteles
    btnBuscar.addEventListener('click', function () {
        const ingrediente = ingredienteSelect.value;
        const categoria = categoriaSelect.value;
        const nombre = nombreInput.value.trim();
        let url = '';

        if (nombre) {
            url = `http://www.thecocktaildb.com/api/json/v1/1/search.php?s=${nombre}`;
        } else if (ingrediente) {
            url = `http://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingrediente}`;
        } else if (categoria) {
            url = `http://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${categoria}`;
        }

        if (url) {
            fetch(proxyUrl + url)  // Aquí añadimos el proxy
                .then(function (response) { return response.json(); })
                .then(function (data) {
                    resultadosDiv.innerHTML = '';
                    const cocteles = data.drinks;
                    if (cocteles) {
                        for (let i = 0; i < cocteles.length; i++) {
                            const coctel = cocteles[i];
                            const coctelDiv = document.createElement('div');
                            coctelDiv.classList.add('coctel');
                            coctelDiv.innerHTML = `
                                <h3>${coctel.strDrink}</h3>
                                <img src="${coctel.strDrinkThumb}" alt="${coctel.strDrink}">
                            `;

                            // Crear el botón "Ver"
                            const button = document.createElement('button');
                            button.classList.add('btn-ver');
                            button.textContent = 'Ver';
                            button.onclick = function () {
                                const coctelId = coctel.idDrink;
                                localStorage.setItem('selectedCoctelId', coctelId);
                                window.location.href = `coctailsDetail.html?id=${coctelId}`;
                            };

                            coctelDiv.appendChild(button);
                            resultadosDiv.appendChild(coctelDiv);
                        }
                    } else {
                        resultadosDiv.innerHTML = '<p>No se encontraron cócteles con ese criterio.</p>';
                    }
                })
                .catch(function (error) {
                    console.error('Error al obtener los cócteles:', error);
                });
        } else {
            resultadosDiv.innerHTML = '<p>Por favor, selecciona un ingrediente, una categoría o ingresa un nombre.</p>';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var coctelId = localStorage.getItem('selectedCoctelId');
    if (coctelId) {
        mostrarDetallesCoctel(coctelId);
    } else {
        console.error('No se ha encontrado un cóctel seleccionado.');
    }
});

function mostrarDetallesCoctel(coctelId) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    fetch(proxyUrl + `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${coctelId}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.drinks && data.drinks.length > 0) {
                var detalles = data.drinks[0];

                document.getElementById('imagenCoctel').src = detalles.strDrinkThumb;
                document.getElementById('nombreCoctel').textContent = detalles.strDrink;
                document.getElementById('tipoCoctel').textContent = detalles.strAlcoholic;
                document.getElementById('categoriaCoctel').textContent = detalles.strCategory;
                document.getElementById('descripcionCoctel').textContent = detalles.strInstructions;

                var contenedorIngredientes = document.getElementById('contenedorIngredientes');
                contenedorIngredientes.innerHTML = '';

                // Mostrar los ingredientes del cóctel
                for (var i = 1; i <= 15; i++) {
                    var ingrediente = detalles['strIngredient' + i];
                    if (ingrediente) {
                        var card = document.createElement('div');
                        card.className = 'card mt-3';

                        var img = document.createElement('img');
                        img.className = 'img-ingrediente';
                        img.alt = ingrediente;
                        img.src = 'https://www.thecocktaildb.com/images/ingredients/' + ingrediente + '-Small.png';

                        var cardBody = document.createElement('div');
                        cardBody.className = 'card-body';

                        var title = document.createElement('h5');
                        title.className = 'card-title';
                        title.textContent = ingrediente;

                        const detallesBtn = document.createElement('a');
                        detallesBtn.className = 'btn btn-primary';
                        detallesBtn.href = `#`; // referencia a HTML de detalle de ingredientes
                        detallesBtn.textContent = 'Detalles';

                        cardBody.appendChild(title);
                        cardBody.appendChild(detallesBtn);
                        card.appendChild(img);
                        card.appendChild(cardBody);
                        contenedorIngredientes.appendChild(card);
                    }
                }
            } else {
                console.log('No se encontró información para el cóctel seleccionado.');
            }
        })
        .catch(function (error) {
            console.error('Error al obtener información del cóctel:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    // Recuperar los valores almacenados en localStorage
    const ingredienteSeleccionado = localStorage.getItem('ingredienteSeleccionado');
    const categoriaSeleccionada = localStorage.getItem('categoriaSeleccionada');
    const nombreSeleccionado = localStorage.getItem('nombreSeleccionado');

    // Si existen valores almacenados, restaurarlos en los campos correspondientes
    if (ingredienteSeleccionado) {
        ingredienteSelect.value = ingredienteSeleccionado;
    }
    if (categoriaSeleccionada) {
        categoriaSelect.value = categoriaSeleccionada;
    }
    if (nombreSeleccionado) {
        nombreInput.value = nombreSeleccionado;
    }
});

// Para devolverse y volver con todo lo seleccionado previamente
document.getElementById('btn-volver').addEventListener('click', function () {
    // Simplemente redirigir de vuelta a la página de búsqueda
    window.location.href = 'index.html';
});
