// Método para rellenar los dropdown
function rellenarDropdown(datos, dropdownID) {
    const dropdownMenu = document.getElementById(dropdownID);

    // Iteramos sobre los datos
    datos.forEach(dato => {
        const opcion = document.createElement('li');
        opcion.innerHTML = `<a class="dropdown-item" href="#">${dato}</a>`;
        opcion.addEventListener('click', () => {
            document.getElementById(dropdownID).previousElementSibling.textContent = dato;
        });
        dropdownMenu.appendChild(opcion);
    });
}

// Hacemos petición a la API para rellenar el dropdown de ingredientes
fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list')
    .then(response => response.json())
    .then(data => {
        // Extraemos el nombre del ingrediente y llenamos el dropdown
        const ingredientes = data.drinks.map(drink => drink.strIngredient1);
        rellenarDropdown(ingredientes, 'ingredientes-dropdown');
    })
    .catch(error => {
        console.error("Error al obtener los ingredientes", error);
    });

// Hacemos petición a la API para rellenar el dropdown de tipos
fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?a=list')
    .then(response => response.json())
    .then(data => {
        // Extraemos el nombre del ingrediente y llenamos el dropdown
        const tipos = data.drinks.map(tipo => tipo.strAlcoholic);
        rellenarDropdown(tipos, 'tipo-dropdown');
    })
    .catch(error => {
        console.error("Error al obtener los tipos de bebidas", error);
    });
