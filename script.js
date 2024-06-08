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
            coords1 = await getCoordinatesFromAPI(city1, country1);
            coords2 = await getCoordinatesFromAPI(city2, country2);
        } else {
            coords1 = await getCoordinatesFromCSV(city1, country1);
            coords2 = await getCoordinatesFromCSV(city2, country2);
        }

        const distance = await calculateDistance(coords1, coords2);
        displayResult(distance);
    } catch (error) {
        displayError(error.message);
    }
});

document.getElementById('closestCitiesForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const citiesList = document.getElementById('citiesList').value.split('\n');
    const source = document.getElementById('sourceList').value;

    let citiesCoords = [];

    try {
        for (let cityCountry of citiesList) {
            const [city, country] = cityCountry.split(',');
            let coords;
            if (source === 'api') {
                coords = await getCoordinatesFromAPI(city.trim(), country.trim());
            } else {
                coords = await getCoordinatesFromCSV(city.trim(), country.trim());
            }
            citiesCoords.push({ city: city.trim(), country: country.trim(), coords });
        }

        const closestCities = await findClosestCities(citiesCoords);
        displayClosestResult(closestCities);
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
    let parsedBody = JSON.parse(data.body);
    let lat = parsedBody.lat;
    let lng = parsedBody.lng;

    return { lat, lng };
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
    let parsedBody = JSON.parse(data.body);
    let lat = parsedBody.lat;
    let lng = parsedBody.lng;

    return { lat, lng };
}

async function calculateDistance(coords1, coords2) {
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
    let parsedBody = JSON.parse(data.body);
    let distance = parsedBody.distance_km;

    return distance;
}

async function findClosestCities(citiesCoords) {
    let minDistance = Infinity;
    let closestPair = {};
    console.log("citiesCoords", citiesCoords);

    for (let i = 0; i < citiesCoords.length; i++) {
        for (let j = i + 1; j < citiesCoords.length; j++) {
            const distance = await calculateDistance(citiesCoords[i].coords, citiesCoords[j].coords);
            console.log("distance:", distance);
            if (distance < minDistance) {
                minDistance = distance;
                closestPair = {
                    city1: citiesCoords[i].city,
                    country1: citiesCoords[i].country,
                    city2: citiesCoords[j].city,
                    country2: citiesCoords[j].country,
                    distance: minDistance
                };
            }
        }
    }

    return closestPair;
}

function displayResult(distance) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h3>Distancia: ${distance} km</h3>`;
    resultDiv.style.color = 'green';
}

function displayClosestResult(closestPair) {
    const resultDiv = document.getElementById('closestResult');
    resultDiv.innerHTML = `<h3>Las ciudades más cercanas son ${closestPair.city1}, ${closestPair.country1} y ${closestPair.city2}, ${closestPair.country2} con una distancia de ${closestPair.distance.toFixed(2)} km</h3>`;
    resultDiv.style.color = 'green';
}

function displayError(errorMessage) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h3>Error: ${errorMessage}</h3>`;
    resultDiv.style.color = 'red';
}
