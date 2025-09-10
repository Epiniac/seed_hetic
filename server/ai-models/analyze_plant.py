from ultralytics import YOLO
from PIL import Image
import json
import sys
import os
import warnings

# Supprimer les warnings et messages de débogage
warnings.filterwarnings('ignore')
import logging
logging.getLogger('ultralytics').setLevel(logging.ERROR)

def analyze_plant_yolo(image_path, model_path):
    """Analyser une plante avec un modèle YOLO"""
    try:
        # Charger le modèle YOLO
        model = YOLO(model_path)
        
        # Faire la prédiction avec verbose=False pour supprimer les messages
        results = model(image_path, verbose=False)
        
        # Analyser les résultats
        if results and len(results) > 0:
            result = results[0]
            
            if result.boxes is not None and len(result.boxes) > 0:
                confidences = result.boxes.conf.cpu().numpy()
                max_confidence = float(max(confidences))
                
                is_healthy = max_confidence > 0.5
                
                return {
                    'is_healthy': is_healthy,
                    'status': 'healthy' if is_healthy else 'unhealthy',
                    'confidence': max_confidence,
                    'confidence_percentage': round(max_confidence * 100, 1),
                    'detections': len(result.boxes)
                }
            else:
                return {
                    'is_healthy': False,
                    'status': 'unhealthy',
                    'confidence': 0.0,
                    'confidence_percentage': 0.0,
                    'detections': 0
                }
        else:
            return {
                'error': 'Aucun résultat de prédiction',
                'is_healthy': None,
                'status': 'error'
            }
            
    except Exception as e:
        return {
            'error': str(e),
            'is_healthy': None,
            'status': 'error'
        }

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print(json.dumps({'error': 'Usage: python analyze_plant.py <image_path> <model_path>'}))
        sys.exit(1)
    
    image_path = sys.argv[1]
    model_path = sys.argv[2]
    
    result = analyze_plant_yolo(image_path, model_path)
    print(json.dumps(result))