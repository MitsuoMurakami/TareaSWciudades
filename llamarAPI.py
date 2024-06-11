import json
import boto3
import urllib.parse
import urllib.request

def lambda_handler(event, context):
    city = event.get('city')
    country = event.get('country')
    
    if not city or not country:
        return {
            'statusCode': 400,
            'body': json.dumps('Error: Parámetros "city" y "country" son requeridos.')
        }

    city = city.lower()
    country = country.lower()
    
    query = urllib.parse.urlencode({'q': f'{city},{country}', 'format': 'json'})
    url = f"https://nominatim.openstreetmap.org/search?{query}"
    
    try:
        with urllib.request.urlopen(url) as response:
            if response.status == 200:
                data = json.loads(response.read())
                # print(data[0])
                return {
                    'statusCode': 200,
                    'body': json.dumps({
                        'lat': data[0]['lat'],
                        'lng': data[0]['lon']
                    })
                }
            else:
                return {
                    'statusCode': response.status,
                    'body': json.dumps({'error': 'Error'})
                }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error: {str(e)}')
        }

