const lambdaUrl = 'https://9752hymjxk.execute-api.us-east-1.amazonaws.com/prueba/distancia';

const params = { // Lima a Lima
    lat1: -12.046374,
    long1: -77.042793,
    lat2: -12.046374,
    long2: -77.042793,
};

fetch(lambdaUrl, {
    method: 'POST',
    body: JSON.stringify(params)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
