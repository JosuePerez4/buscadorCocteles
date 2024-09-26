document.addEventListener('DOMContentLoaded', () => {
    const ingredienteSelect = document.getElementById('ingrediente');
    const categoriaSelect = document.getElementById('categoria');
    const nombreInput = document.getElementById('input-nombre');
    const btnBuscar = document.getElementById('btn-buscar');
    const resultadosDiv = document.querySelector('.resultados-busqueda');

    // Obtener ingredientes
    fetch('http://www.thecocktaildb.com/api/json/v1/1/list.php?i=list')
        .then(response => response.json())
        .then(data => {
            const ingredientes = data.drinks;
            ingredientes.forEach(ingrediente => {
                const option = document.createElement('option');
                option.value = ingrediente.strIngredient1;
                option.textContent = ingrediente.strIngredient1;
                ingredienteSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al obtener los ingredientes:', error));

    // Obtener categorías
    fetch('http://www.thecocktaildb.com/api/json/v1/1/list.php?a=list')
        .then(response => response.json())
        .then(data => {
            const categorias = data.drinks;
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.strAlcoholic;
                option.textContent = categoria.strAlcoholic;
                categoriaSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al obtener las categorías:', error));

    // Manejar la búsqueda de cocteles
    btnBuscar.addEventListener('click', () => {
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
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    resultadosDiv.innerHTML = ''; // Limpiar resultados anteriores
                    const cocteles = data.drinks;
                    if (cocteles) {
                        cocteles.forEach(coctel => {
                            const coctelDiv = document.createElement('div');
                            coctelDiv.classList.add('coctel');
                            coctelDiv.innerHTML = `
                                <h3>${coctel.strDrink}</h3>
                                <img src="${coctel.strDrinkThumb}" alt="${coctel.strDrink}">
                            `;
                            resultadosDiv.appendChild(coctelDiv);
                        });
                    } else {
                        resultadosDiv.innerHTML = '<p>No se encontraron cocteles con ese criterio.</p>';
                    }
                })
                .catch(error => console.error('Error al obtener los cocteles:', error));
        } else {
            resultadosDiv.innerHTML = '<p>Por favor, selecciona un ingrediente, una categoría o ingresa un nombre.</p>';
        }
    });
});

// Manejar mostrar la imagen en los detalles del coctel
function mostrarDetallesCoctel(coctel) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${coctel}`)
        .then(response => response.json())
        .then(data => {
            const imagenCoctel = document.getElementById('imagenCoctel');
            const nombreCoctel = document.getElementById('nombreCoctel');
            const tipoCoctel = document.getElementById('tipoCoctel');
            const categoriaCoctel = document.getElementById('categoriaCoctel');
            const descripcionCoctel = document.getElementById('descripcionCoctel');

            // Crear las tarjetas de los ingredientes
            const contenedorIngredientes = document.getElementById('contenedorIngredientes');
            contenedorIngredientes.innerHTML = '';

            if (data.drinks && data.drinks.length > 0) {
                const detalles = data.drinks[0];
                imagenCoctel.src = detalles.strDrinkThumb;
                nombreCoctel.textContent = detalles.strDrink;
                tipoCoctel.textContent = detalles.strAlcoholic;
                categoriaCoctel.textContent = detalles.strCategory;
                descripcionCoctel.textContent = detalles.strInstructions;

                // Iterar sobre los ingredientes
                for (let i = 1; i <= 15; i++) { // Los ingredientes van de strIngredient1 a strIngredient15
                    const ingrediente = detalles[`strIngredient${i}`];
                    if (ingrediente) {
                        // Crear la tarjeta de ingrediente
                        const card = document.createElement('div');
                        card.className = 'card mt-3';

                        const img = document.createElement('img');
                        img.className = 'card-img-top img-ingrediente';
                        img.alt = ingrediente;
                        img.src = `https://www.thecocktaildb.com/images/ingredients/${ingrediente}-Small.png`;

                        const cardbody = document.createElement('div');
                        cardbody.className = 'card-body';

                        const title = document.createElement('h5');
                        title.className = 'card-title';
                        title.textContent = ingrediente;

                        const detallesBtn = document.createElement('a');
                        detallesBtn.className = 'btn btn-primary';
                        detallesBtn.href = `#`; // referencia a HTML de detalle de ingredientes
                        detallesBtn.textContent = 'Detalles';

                        // Añadir elementos a la tarjeta
                        cardbody.appendChild(title);
                        cardbody.appendChild(detallesBtn);
                        card.appendChild(img);
                        card.appendChild(cardbody);

                        // Añadir tarjeta al contenedor de ingredientes
                        contenedorIngredientes.appendChild(card);
                    }
                }
            } else {
                console.log('No se encontró información para el cóctel seleccionado.');
            }
        })
        .catch(error => console.error('Error al obtener información del coctel', error));
}