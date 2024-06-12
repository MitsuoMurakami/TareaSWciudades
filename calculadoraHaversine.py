import json
import math

def haversine(lat1, lon1, lat2, lon2):
    # Radio de la Tierra en kilómetros
    R = 6371.0

    # Convertir coordenadas de grados a radianes
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    # Diferencias de coordenadas
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad

    # Fórmula de Haversine
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    # Distancia en kilómetros
    distance = R * c
    return distance

def lambda_handler(event, context):
    # Obtener coordenadas del evento
    lat1 = event.get('lat1')
    lon1 = event.get('long1')
    lat2 = event.get('lat2')
    lon2 = event.get('long2')

    # Verificar que todos los parámetros estén presentes
    if lat1 is None or lon1 is None or lat2 is None or lon2 is None:
        return {
            'statusCode': 400,
            'body': json.dumps('Error: Parámetros "lat1", "long1", "lat2" y "long2" son requeridos.')
        }

    # Calcular la distancia usando la fórmula de Haversine
    try:
        distance = haversine(float(lat1), float(lon1), float(lat2), float(lon2))
        return {
            'statusCode': 200,
            'body': json.dumps({'distance_km': distance})
        }
    except ValueError as e:
        return {
            'statusCode': 400,
            'body': json.dumps(f'Error: Parámetros deben ser números válidos. {str(e)}')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error: {str(e)}')
        }

# Ejemplo de cómo podrías probarlo localmente
if __name__ == "__main__":
    test_event = {
        'lat1': -12.046374,
        'long1': -77.042793,
        'lat2': 51.507351,
        'long2': -0.127758
    }
    print(lambda_handler(test_event, None))
