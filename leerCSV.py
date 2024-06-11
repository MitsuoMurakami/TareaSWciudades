import json
import boto3
import csv

def lambda_handler(event, context):
    # Parámetros de entrada
    city = event.get('city')
    country = event.get('country')
    
    if not city or not country:
        return {
            'statusCode': 400,
            'body': json.dumps('Error: Parámetros "city" y "country" son requeridos.')
        }
    
    # Nombre del bucket y archivo
    bucket_name = 'tarea-ciudades'
    file_key = 'worldcities.csv'
    
    # Inicializar cliente de S3
    s3 = boto3.client('s3')
    
    try:
        # Descargar archivo CSV desde S3
        response = s3.get_object(Bucket=bucket_name, Key=file_key)
        content = response['Body'].read().decode('utf-8').splitlines()
        
        # Leer el contenido del CSV
        reader = csv.DictReader(content)
        
        # Buscar la fila que coincide con la ciudad y el país
        for row in reader:
            if row['city'].lower() == city.lower() and row['country'].lower() == country.lower():
                return {
                    'statusCode': 200,
                    'body': json.dumps({
                        'lat': row['lat'],
                        'lng': row['lng']
                    })
                }
        
        # Si no se encuentra la ciudad y el país
        return {
            'statusCode': 404,
            'body': json.dumps('Error: Ciudad o país no encontrados en el archivo CSV.')
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error: {str(e)}')
        }
