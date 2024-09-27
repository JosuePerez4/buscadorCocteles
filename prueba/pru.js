// Definimos directamente el nombre del ingrediente que queremos mostrar
const ingredient = "vodka";  // Este valor podría cambiarse dinámicamente en el futuro

// Función para obtener los datos del ingrediente desde la API
async function fetchIngredientInfo() {
    try {
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${ingredient}`);
        const data = await response.json();

        if (data.ingredients && data.ingredients.length > 0) {
            const ingredientData = data.ingredients[0];

            // Mostrar los datos obtenidos en la página
            document.getElementById('ingredient-name').textContent = ingredientData.strIngredient;
            document.getElementById('ingredient-description').textContent = ingredientData.strDescription;
            document.getElementById('ingredient-type').textContent = ingredientData.strType || 'Unknown';
            document.getElementById('ingredient-alcohol').textContent = ingredientData.strAlcohol === 'Yes' ? 'Yes' : 'No';
            document.getElementById('ingredient-abv').textContent = ingredientData.strABV || 'Not available';
            
            // Mostrar imagen del ingrediente (si está disponible)
            document.getElementById('ingredient-image').src = `https://www.thecocktaildb.com/images/ingredients/${ingredient}-Medium.png`;

        } else {
            alert('Ingredient not found');
        }
    } catch (error) {
        console.error('Error fetching ingredient info:', error);
        alert('Error fetching ingredient info');
    }
}

// Llamamos a la función para que se ejecute al cargar la página
fetchIngredientInfo();
