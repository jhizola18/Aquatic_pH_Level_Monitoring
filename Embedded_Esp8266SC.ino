#include <ESP8266WiFi.h>
#include <PubSubClient.h>


const char* ssid = "0R@c13";
const char* password = "K33p0nkeep1ng0n";


const char* mqtt_server = "ed9b94fcc7ad47119453174c68d2ae31.s1.eu.hivemq.cloud";
const int mqtt_port = 8883; 
const char* mqtt_user = "Admin";
const char* mqtt_password = "Admin123";


WiFiClientSecure espClient; 
PubSubClient client(espClient);


#define PH_SENSOR_PIN A0    // Analog pin where the pH sensor is connected


const char* ph_topic = "sensors/ph";


unsigned long lastPublishTime = 0;


void setupWiFi() {
  delay(10);
  Serial.print("Connecting to Wi-Fi");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi");
}


void reconnect() {
  unsigned long startAttemptTime = millis();
  while (!client.connected() && millis() - startAttemptTime < 10000) {
    yield(); // Allows background tasks to run
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP8266Client", mqtt_user, mqtt_password)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}



float readPH() {
  int sensorValue = analogRead(PH_SENSOR_PIN);
  float voltage = sensorValue * (3.3 / 1023.0);
  float phValue = 7 + (voltage - 2.5);  
  return phValue;
}


void publishData(float phValue) {
  char phStr[8];
  dtostrf(phValue, 6, 2, phStr);
  client.publish(ph_topic, phStr);
  Serial.print("pH published: ");
  Serial.println(phStr);
}

void setup() {
  Serial.begin(115200);
  setupWiFi();
  espClient.setInsecure(); 
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  if (millis() - lastPublishTime >= 5000) {
    lastPublishTime = millis();
    float phValue = readPH();
    publishData(phValue);
  }
}
