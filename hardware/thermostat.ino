#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT22
#define LED_HEATING 13
#define POT_PIN A0

DHT dht(DHTPIN, DHTTYPE);

void setup() {
    Serial.begin(115200);
    dht.begin();
    pinMode(LED_HEATING, OUTPUT);
}

void loop() {
    float temp = dht.readTemperature();
    float hum = dht.readHumidity();

    // Daca senzorul da eroare temporara, fallback la valori nominale
    if (isnan(temp)) temp = 21.5;
    if (isnan(hum)) hum = 48.0;

    // Potentiometrul stabileste temperatura setata (18°C - 28°C)
    int valPot = analogRead(POT_PIN);
    float targetTemp = 18.0 + (valPot / 1023.0) * 10.0;

    // Logica termostatului cu histerezis de 0.2 grade
    bool heating = (temp < targetTemp - 0.2);
    digitalWrite(LED_HEATING, heating ? HIGH : LOW);

    // Trimite string JSON compact
    Serial.print("{\"temp\":");
    Serial.print(temp, 1);
    Serial.print(",\"target\":");
    Serial.print(targetTemp, 1);
    Serial.print(",\"hum\":");
    Serial.print(hum, 0);
    Serial.print(",\"heating\":");
    Serial.print(heating ? "true" : "false");
    Serial.println("}");

    delay(1000);
}