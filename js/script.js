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
