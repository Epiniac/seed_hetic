from ultralytics import YOLO
import json
import sys
import warnings
import logging

# Supprimer les warnings et messages de débogage
warnings.filterwarnings('ignore')
logging.getLogger('ultralytics').setLevel(logging.ERROR)

def analyze_plant_yolo(image_path, model_path):
    """Analyser une plante avec un modèle YOLO"""
    try:
        # Charger le modèle YOLO
        model = YOLO(model_path)
        
        # Faire la prédiction et supprimer les messages
        results = model(image_path, verbose=False)
        
        # Analyser les résultats
        if results and len(results) > 0:
            result = results[0]
            
            if result.boxes is not None and len(result.boxes) > 0:
                classes = result.boxes.cls.cpu().numpy()
                confidences = result.boxes.conf.cpu().numpy()
                
                # Analyser les classes prédites avec un seuil de confiance
                confidence_threshold = 0.3
                healthy_detections = 0
                unhealthy_detections = 0
                max_confidence = 0.0
                
                for cls, conf in zip(classes, confidences):
                    conf_float = float(conf)
                    if conf_float > confidence_threshold:
                        if int(cls) == 0:  # Classe 'healthy'
                            healthy_detections += 1
                        elif int(cls) == 1:  # Classe 'unhealthy'
                            unhealthy_detections += 1
                        max_confidence = max(max_confidence, conf_float)
                
                # Déterminer l'état de santé basé sur les détections
                if healthy_detections > unhealthy_detections:
                    is_healthy = True
                    status = 'healthy'
                elif unhealthy_detections > healthy_detections:
                    is_healthy = False
                    status = 'unhealthy'
                else:
                    is_healthy = None
                    status = 'uncertain'
                
                return {
                    'is_healthy': is_healthy,
                    'status': status,
                    'confidence': max_confidence,
                    'confidence_percentage': round(max_confidence * 100, 1),
                    'detections': len(result.boxes),
                    'healthy_detections': healthy_detections,
                    'unhealthy_detections': unhealthy_detections
                }
            else:
                return {
                    'is_healthy': None,
                    'status': 'uncertain',
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