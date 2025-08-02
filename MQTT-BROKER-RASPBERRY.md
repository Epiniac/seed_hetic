# Configuration MQTT - Projet Plantes Connectées 🌱

## 🏗️ Architecture du projet

Notre setup IoT comprend :
- **Raspberry Pi** : Capteurs + Publication MQTT
- **Serveur MQTT** : Broker Mosquitto 
- **MQTT Explorer** : Monitoring des données
- **App React Native** : Interface utilisateur avec API Perenual

## � Configuration actuelle (via console)

### Sur le Raspberry Pi

#### Installation Mosquitto
```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Mosquitto broker + clients
sudo apt install mosquitto mosquitto-clients -y

# Démarrage automatique
sudo systemctl enable mosquitto
sudo systemctl start mosquitto

# Vérifier le statut
sudo systemctl status mosquitto
```

#### Configuration réseau
```bash
# Connexion SSH au Raspberry Pi
ssh wirepas@192.168.50.1
# Mot de passe : wirepass

# Trouver l'IP du Raspberry Pi (une fois connecté)
hostname -I
# IP actuelle : 192.168.50.1

# Ou plus détaillé
ip addr show

# Tester la connectivité
ping 192.168.50.1
```

#### Commandes de test MQTT
```bash
# S'abonner aux topics depuis le Raspberry Pi (serveur externe)
mosquitto_sub -h 176.186.143.117 -p 8830 -u gateway -P gateway -t "plants/+/sensors"
mosquitto_sub -h 176.186.143.117 -p 8830 -u gateway -P gateway -t "plants/strawberry/temperature"

# Test sur le broker local du Raspberry Pi (si configuré)
mosquitto_sub -h localhost -t "plants/+/sensors"

# Publier des données de test (serveur externe)
mosquitto_pub -h 176.186.143.117 -p 8830 -u gateway -P gateway -t "plants/strawberry/sensors" -m '{"temperature": 25.5, "humidity": 60}'
mosquitto_pub -h 176.186.143.117 -p 8830 -u gateway -P gateway -t "plants/rose/moisture" -m '{"soil_moisture": 45}'

# Test depuis une autre machine
mosquitto_pub -h 176.186.143.117 -p 8830 -u gateway -P gateway -t "plants/test" -m "hello from PC"
```

## ⚙️ Configuration Mosquitto (fichiers)

### Configuration de base : `/etc/mosquitto/mosquitto.conf`
```conf
# Configuration utilisée pour le projet
listener 1883
allow_anonymous true

# Pour accès externe (si le serveur est sur une autre machine)
bind_address 0.0.0.0

# Logs (optionnel)
log_dest file /var/log/mosquitto/mosquitto.log
log_type error
log_type warning
log_type notice

# Persistance des données
persistence true
persistence_location /var/lib/mosquitto/
```

## 📊 MQTT Explorer - Configuration

### Connexion au broker (vraie configuration du projet)
```
Host: 176.186.143.117
Port: 8830
Protocol: mqtt://
Client ID: MQTTExplorer_plants
Username: gateway
Password: gateway
```

### Configuration alternative (broker local Raspberry Pi)
```
Host: 192.168.50.1
Port: 1883
Protocol: mqtt://
Client ID: MQTTExplorer_local
Username: (vide si allow_anonymous true)
Password: (vide si allow_anonymous true)
```

### Topics surveillés dans MQTT Explorer
```
plants/+/sensors          # Toutes les données des capteurs
plants/+/alerts           # Alertes des plantes
plants/strawberry/+        # Tous les topics de la fraise
plants/rose/+              # Tous les topics de la rose
```

## 🌡️ Capteurs et données

### Types de capteurs utilisés
- **Température** : `plants/[plant_id]/temperature`
- **Humidité** : `plants/[plant_id]/humidity` 
- **Humidité du sol** : `plants/[plant_id]/soil_moisture`
- **Luminosité** : `plants/[plant_id]/light`

### Format des données JSON
```json
{
  "timestamp": "2025-07-24T10:30:00Z",
  "plant_id": "strawberry_01",
  "sensor": "temperature",
  "value": 25.5,
  "unit": "°C"
}
```

## 🔧 Commandes utiles pour le debug

### Vérifier le broker
```bash
# Statut du service
sudo systemctl status mosquitto

# Redémarrer si besoin
sudo systemctl restart mosquitto

# Voir les logs
tail -f /var/log/mosquitto/mosquitto.log

# Tester la connectivité
netstat -ln | grep 1883
```

### Tester depuis une autre machine
```bash
# Depuis un PC vers le serveur MQTT externe
mosquitto_pub -h 176.186.143.117 -p 8830 -u gateway -P gateway -t "test/connection" -m "hello from PC"
mosquitto_sub -h 176.186.143.117 -p 8830 -u gateway -P gateway -t "test/+"

# Tester vers le Raspberry Pi local (si broker local configuré)
mosquitto_pub -h 192.168.50.1 -t "test/connection" -m "hello local"
mosquitto_sub -h 192.168.50.1 -t "test/+"

# Vérifier que le port 8830 est accessible
telnet 176.186.143.117 8830
```

## 🌐 Architecture réseau réelle

**Setup actuel du projet :**
```
[Capteurs Raspberry Pi] → [Réseau local 192.168.50.x] → [Internet] → [Serveur MQTT Externe]
    192.168.50.1                                                      176.186.143.117:8830
                                                                            ↓
[MQTT Explorer] ← [Internet] ← [App React Native] ← [Réseau local]
```

**Variables d'environnement (.env sur Raspberry Pi) :**
```bash
WM_SERVICES_MQTT_HOSTNAME=176.186.143.117
WM_SERVICES_MQTT_PORT=8830
WM_SERVICES_MQTT_USERNAME=gateway
WM_SERVICES_MQTT_PASSWORD=gateway
WM_SERVICES_MQTT_FORCE_UNSECURE=true
```

## 📝 Checklist pour ton camarade

**Configuration actuelle :**
- [ ] Raspberry Pi avec Mosquitto installé
- [ ] **Broker MQTT externe** : `176.186.143.117:8830`
- [ ] **Authentification** : `gateway` / `gateway`
- [ ] IP du Raspberry : `192.168.50.1`
- [ ] Utilisateur SSH : `wirepas` / Mot de passe : `wirepass`
- [ ] Topics utilisés : `plants/[plant_id]/[sensor]`
- [ ] MQTT Explorer connecté sur : `176.186.143.117:8830`

**Commandes principales :**
```bash
# Sur le Raspberry Pi
sudo systemctl status mosquitto
mosquitto_sub -h localhost -t "plants/+/+"
mosquitto_pub -h localhost -t "plants/test/data" -m "test"

# Test réseau
ping 192.168.50.1
hostname -I
```

## 🔗 Connexion SSH au Raspberry Pi

```bash
# Commande de connexion
ssh wirepas@192.168.50.1
# Mot de passe : wirepass

# Une fois connecté, vérifier Mosquitto
sudo systemctl status mosquitto
```

### Avec authentification (si nécessaire)
```bash
# Créer un utilisateur (optionnel)
sudo mosquitto_passwd -c /etc/mosquitto/passwd plants_user

# Modifier la config pour activer l'auth
sudo nano /etc/mosquitto/mosquitto.conf
```

```conf
# Ajouter ces lignes pour l'authentification
allow_anonymous false
password_file /etc/mosquitto/passwd
```

---

## 💡 Infos complémentaires

**Ce document contient :**
- ✅ Configuration Mosquitto via console
- ✅ Commandes de test MQTT  
- ✅ Setup MQTT Explorer
- ✅ Architecture réseau
- ✅ Topics et formats de données (structure prévue)

**État actuel du projet :**
- ✅ Raspberry Pi configuré avec broker setup
- ✅ Serveur MQTT externe opérationnel
- ✅ Connexion réseau locale établie
- ⏳ Capteurs de plantes : **pas encore implémentés**
- ⏳ Code Python des capteurs : **à développer**
- ⏳ Scripts de monitoring : **à créer**

**Note :** Le Raspberry Pi est prêt côté infrastructure, les capteurs et le code de monitoring des plantes restent à implémenter !
