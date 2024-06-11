const lambdaUrl = 'https://9752hymjxk.execute-api.us-east-1.amazonaws.com/prueba/coordenadas/api';

const params = {
    city: 'asdfghj',
    country: 'peru'
};

fetch(lambdaUrl, {
    method: 'POST',
    body: JSON.stringify(params)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
