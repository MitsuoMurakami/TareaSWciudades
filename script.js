document.getElementById('distanceForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const city1 = document.getElementById('city1').value;
    const country1 = document.getElementById('country1').value;
    const city2 = document.getElementById('city2').value;
    const country2 = document.getElementById('country2').value;
    const source = document.getElementById('source').value;

    let coords1, coords2;

    try {
        if (source === 'api') {
            console.log("1")
            coords1 = await getCoordinatesFromAPI(city1, country1);
            console.log("2")
            coords2 = await getCoordinatesFromAPI(city2, country2);
            console.log("3")
        } else {
            coords1 = await getCoordinatesFromCSV(city1, country1);
            coords2 = await getCoordinatesFromCSV(city2, country2);
        }

        console.log("coords1:", coords1)
        console.log("coords2:", coords2)
        const distance = await calculateDistance(coords1, coords2);
        console.log("distance:", distance)
        displayResult(distance);
    } catch (error) {
        displayError(error.message);
    }
});

async function getCoordinatesFromAPI(city, country) {
    const response = await fetch(`https://9752hymjxk.execute-api.us-east-1.amazonaws.com/prueba/coordenadas/api`, {
        method: 'POST',
        body: JSON.stringify({ city, country }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error('Error al obtener coordenadas de la API');
    }

    const data = await response.json();
        // Parsear el JSON contenido en `body`
    let parsedBody = JSON.parse(data.body);

    // Extraer las propiedades `lat` y `lng`
    let lat = parsedBody.lat;
    let lng = parsedBody.lng;

    // Imprimir los valores para verificar
    console.log("Latitud:", lat);
    console.log("Longitud:", lng);

    // Retornar un objeto con `lat` y `lng`
    let coordinates = { lat, lng };
    return coordinates;
}

async function getCoordinatesFromCSV(city, country) {
    const response = await fetch(`https://9752hymjxk.execute-api.us-east-1.amazonaws.com/prueba/coordenadas/csv`, {
        method: 'POST',
        body: JSON.stringify({ city, country }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error('Error al obtener coordenadas del CSV');
    }

    const data = await response.json();
        // Parsear el JSON contenido en `body`
        let parsedBody = JSON.parse(data.body);

        // Extraer las propiedades `lat` y `lng`
        let lat = parsedBody.lat;
        let lng = parsedBody.lng;
    
        // Imprimir los valores para verificar
        console.log("Latitud:", lat);
        console.log("Longitud:", lng);
    
        // Retornar un objeto con `lat` y `lng`
        let coordinates = { lat, lng };
        return coordinates;
}

async function calculateDistance(coords1, coords2) {
    console.log("coord1.lat:", coords1.lat)
    console.log("coord1.lng:", coords1.lng)
    console.log("coord2.lat:", coords2.lat)
    console.log("coord2.lng:", coords2.lng)
    const response = await fetch(`https://9752hymjxk.execute-api.us-east-1.amazonaws.com/prueba/distancia`, {
        method: 'POST',
        body: JSON.stringify({
            lat1: coords1.lat,
            long1: coords1.lng,
            lat2: coords2.lat,
            long2: coords2.lng
        }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error('Error al calcular la distancia');
    }

    const data = await response.json();
        // Parsear el JSON contenido en `body`
        let parsedBody = JSON.parse(data.body);

        // Extraer las propiedades `lat` y `lng`
        let distance = parsedBody.distance_km
    
        // Imprimir los valores para verificar
        console.log("Distancia:", distance);

    return distance;
}

function displayResult(distance) {
    console.log("display result");
    const resultDiv = document.getElementById('result');
    console.log("a");
    resultDiv.innerHTML = `<h3>Distancia: ${distance} km</h3>`;
    console.log("b")
    resultDiv.style.color = 'green';
    console.log("c")
}

function displayError(errorMessage) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h3>Error: ${errorMessage}</h3>`;
    resultDiv.style.color = 'red';
}
