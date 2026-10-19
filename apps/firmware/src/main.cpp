/**
 * GRAM-CIRCULAR Smart Weighing & Bin Telemetry Node
 * Firmware for ESP32 DevKit V1
 * Smart India Hackathon (SIH 2026)
 *
 * Hardware Peripherals:
 *  - HX711 24-bit ADC Load Cell Amplifier (Weight telemetry)
 *  - HC-SR04 Ultrasonic Distance Sensor (Bin fill level telemetry)
 *  - Flash EEPROM via ESP32 Preferences (Zero/Tare & Scale Factor persistence)
 *  - WiFi Station with HTTP REST POST Client
 */

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Preferences.h>
#include "HX711.h"

// -----------------------------------------------------------------------------
// Hardware Pin Mapping
// -----------------------------------------------------------------------------
#define HX711_DOUT_PIN       21   // Load cell amplifier serial data
#define HX711_SCK_PIN        22   // Load cell amplifier serial clock
#define ULTRASONIC_TRIG_PIN  18   // HC-SR04 Trigger pin (Output, 3.3V)
#define ULTRASONIC_ECHO_PIN  19   // HC-SR04 Echo pin (Input via voltage divider)
#define STATUS_LED_PIN       2    // Onboard Blue Status LED
#define TARE_BUTTON_PIN      0    // BOOT button active-low (GPIO 0)

// -----------------------------------------------------------------------------
// Telemetry & Device Configuration
// -----------------------------------------------------------------------------
const char* DEVICE_ID       = "ESP32-SCALE-001";
const char* WIFI_SSID       = "GRAM-CIRCULAR-NET";
const char* WIFI_PASSWORD   = "sih2026rural";
const char* API_SERVER_URL  = "http://192.168.1.100:4000/api/v1/devices/reading";

// Bin Geometry (Centimeters)
const float BIN_MAX_DEPTH_CM = 100.0; // Distance to bottom of empty bin
const float BIN_MIN_DEPTH_CM = 10.0;  // Minimum clearance when bin is 100% full

// Stability Filter Settings
const int   WINDOW_SIZE              = 10;    // 10-sample moving window
const float STABILITY_TOLERANCE_KG   = 0.050; // 50 grams max spread for stability flag
const unsigned long TELEMETRY_PERIOD = 3000;  // Transmit interval in milliseconds (3s)

// -----------------------------------------------------------------------------
// Global Peripherals & State
// -----------------------------------------------------------------------------
HX711 scale;
Preferences preferences;

float sampleBuffer[WINDOW_SIZE];
int   sampleIndex = 0;
bool  bufferFilled = false;

float calibrationFactor = -2280.0f; // Default factory estimate for 50kg load cell
long  tareOffset = 0;

unsigned long lastTelemetryMillis = 0;
unsigned long lastLedBlinkMillis = 0;
bool ledState = false;

// -----------------------------------------------------------------------------
// Non-Volatile Memory (Preferences) Helpers
// -----------------------------------------------------------------------------
void loadCalibrationFromNVS() {
    preferences.begin("gram_scale", true); // Read-only mode
    calibrationFactor = preferences.getFloat("cal_factor", -2280.0f);
    tareOffset = preferences.getLong("tare_offset", 0);
    preferences.end();

    scale.set_scale(calibrationFactor);
    scale.set_offset(tareOffset);

    Serial.printf("[NVS] Loaded Calibration: Factor=%.2f, Offset=%ld\n", calibrationFactor, tareOffset);
}

void saveCalibrationToNVS(float factor, long offset) {
    preferences.begin("gram_scale", false); // Read-write mode
    preferences.putFloat("cal_factor", factor);
    preferences.putLong("tare_offset", offset);
    preferences.end();

    Serial.printf("[NVS] Saved Calibration: Factor=%.2f, Offset=%ld\n", factor, offset);
}

// -----------------------------------------------------------------------------
// Scale Tare & Calibration Routines
// -----------------------------------------------------------------------------
void executeTare() {
    Serial.println("\n[SCALE] Taring... Please ensure platform is completely empty.");
    digitalWrite(STATUS_LED_PIN, HIGH);
    scale.tare(20); // 20-sample average tare
    tareOffset = scale.get_offset();
    saveCalibrationToNVS(calibrationFactor, tareOffset);
    digitalWrite(STATUS_LED_PIN, LOW);
    Serial.printf("[SCALE] Tare complete. Zero offset set to: %ld\n", tareOffset);
}

void executeCalibrationRoutine() {
    Serial.println("\n=======================================================");
    Serial.println("  GRAM-CIRCULAR INTERACTIVE LOAD CELL CALIBRATION");
    Serial.println("=======================================================");
    Serial.println("1. Clear weighing platform. Sending tare command...");
    scale.set_scale();
    scale.tare(20);
    Serial.println("   Tare done. Baseline zero set.");

    Serial.println("2. Place a known reference weight on the scale.");
    Serial.println("   Type the weight in KILOGRAMS into Serial Monitor (e.g. '5.00') and press Enter:");

    while (!Serial.available()) {
        delay(100);
    }
    float knownWeightKg = Serial.parseFloat();
    while (Serial.available()) Serial.read(); // Flush buffer

    if (knownWeightKg <= 0.001) {
        Serial.println("[ERROR] Invalid weight entered. Calibration aborted.");
        return;
    }

    Serial.printf("3. Sampling scale with reference weight: %.3f kg...\n", knownWeightKg);
    long reading = scale.get_value(20);
    float newFactor = (float)reading / knownWeightKg;

    scale.set_scale(newFactor);
    calibrationFactor = newFactor;
    tareOffset = scale.get_offset();
    saveCalibrationToNVS(calibrationFactor, tareOffset);

    Serial.printf("[SUCCESS] Calibration complete! New Scale Factor: %.2f\n", newFactor);
    Serial.println("=======================================================\n");
}

// -----------------------------------------------------------------------------
// Stability Moving Window Filter
// -----------------------------------------------------------------------------
struct StabilityResult {
    float averageWeightKg;
    bool isStable;
    float spreadKg;
};

StabilityResult processWeightSample(float rawWeightKg) {
    sampleBuffer[sampleIndex] = rawWeightKg;
    sampleIndex = (sampleIndex + 1) % WINDOW_SIZE;
    if (sampleIndex == 0) {
        bufferFilled = true;
    }

    int count = bufferFilled ? WINDOW_SIZE : sampleIndex;
    if (count == 0) {
        return { rawWeightKg, false, 0.0f };
    }

    float sum = 0.0f;
    float minVal = sampleBuffer[0];
    float maxVal = sampleBuffer[0];

    for (int i = 0; i < count; i++) {
        float val = sampleBuffer[i];
        sum += val;
        if (val < minVal) minVal = val;
        if (val > maxVal) maxVal = val;
    }

    float avg = sum / (float)count;
    float spread = maxVal - minVal;
    bool stable = (count >= WINDOW_SIZE) && (spread <= STABILITY_TOLERANCE_KG);

    // Filter tiny negative drift near zero
    if (avg < 0.010f && avg > -0.050f) {
        avg = 0.0f;
    }

    return { avg, stable, spread };
}

// -----------------------------------------------------------------------------
// HC-SR04 Ultrasonic Bin Fill Measurement
// -----------------------------------------------------------------------------
int readBinFillPercent() {
    digitalWrite(ULTRASONIC_TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(ULTRASONIC_TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(ULTRASONIC_TRIG_PIN, LOW);

    // Timeout after 30ms (approx 5.1 meters max range)
    long durationUs = pulseIn(ULTRASONIC_ECHO_PIN, HIGH, 30000);

    if (durationUs == 0) {
        // Echo timeout or sensor disconnected
        return -1;
    }

    // Speed of sound in air = ~343 m/s = 0.0343 cm/us (divided by 2 for round-trip)
    float distanceCm = (durationUs * 0.0343f) / 2.0f;

    // Constrain distance within bin limits
    if (distanceCm > BIN_MAX_DEPTH_CM) distanceCm = BIN_MAX_DEPTH_CM;
    if (distanceCm < BIN_MIN_DEPTH_CM) distanceCm = BIN_MIN_DEPTH_CM;

    // Calculate percentage fill
    float usableRange = BIN_MAX_DEPTH_CM - BIN_MIN_DEPTH_CM;
    float filledDepth = BIN_MAX_DEPTH_CM - distanceCm;
    int fillPercent = (int)round((filledDepth / usableRange) * 100.0f);

    return constrain(fillPercent, 0, 100);
}

// -----------------------------------------------------------------------------
// WiFi & HTTP Telemetry Transmission
// -----------------------------------------------------------------------------
void connectWiFi() {
    if (WiFi.status() == WL_CONNECTED) return;

    Serial.printf("[WIFI] Connecting to SSID: %s ", WIFI_SSID);
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 15) {
        delay(500);
        Serial.print(".");
        attempts++;
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.printf("\n[WIFI] Connected! IP: %s | RSSI: %d dBm\n",
                      WiFi.localIP().toString().c_str(), WiFi.RSSI());
        digitalWrite(STATUS_LED_PIN, HIGH);
    } else {
        Serial.println("\n[WIFI] Connection failed. Retrying in background...");
        digitalWrite(STATUS_LED_PIN, LOW);
    }
}

bool transmitTelemetry(float weightKg, bool isStable, int fillPercent) {
    if (WiFi.status() != WL_CONNECTED) {
        connectWiFi();
        if (WiFi.status() != WL_CONNECTED) return false;
    }

    HTTPClient http;
    http.begin(API_SERVER_URL);
    http.addHeader("Content-Type", "application/json");
    http.setTimeout(4000);

    StaticJsonDocument<256> doc;
    doc["deviceId"] = DEVICE_ID;
    doc["weightKg"] = round(weightKg * 1000.0f) / 1000.0f;
    doc["isStable"] = isStable;
    doc["source"] = "SENSOR";
    if (fillPercent >= 0) {
        doc["fillPercent"] = fillPercent;
    } else {
        doc["fillPercent"] = nullptr;
    }

    String requestBody;
    serializeJson(doc, requestBody);

    int httpCode = http.POST(requestBody);
    bool success = false;

    if (httpCode > 0) {
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_CREATED) {
            Serial.printf("[HTTP 200] Telemetry accepted: %.3f kg (Stable: %s, Fill: %d%%)\n",
                          weightKg, isStable ? "YES" : "NO", fillPercent);
            success = true;
        } else {
            Serial.printf("[HTTP %d] Server rejected reading: %s\n", httpCode, http.getString().c_str());
        }
    } else {
        Serial.printf("[HTTP ERR] Failed to connect: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
    return success;
}

// -----------------------------------------------------------------------------
// Arduino Setup & Main Loop
// -----------------------------------------------------------------------------
void setup() {
    Serial.begin(115200);
    delay(1000);

    Serial.println("\n=======================================================");
    Serial.println("  GRAM-CIRCULAR IoT Edge Node (ESP32)");
    Serial.println("  Smart Waste Management & Telemetry System (SIH 2026)");
    Serial.println("=======================================================");

    pinMode(STATUS_LED_PIN, OUTPUT);
    pinMode(TARE_BUTTON_PIN, INPUT_PULLUP);
    pinMode(ULTRASONIC_TRIG_PIN, OUTPUT);
    pinMode(ULTRASONIC_ECHO_PIN, INPUT);

    digitalWrite(ULTRASONIC_TRIG_PIN, LOW);
    digitalWrite(STATUS_LED_PIN, LOW);

    // Initialize HX711 Load Cell Interface
    scale.begin(HX711_DOUT_PIN, HX711_SCK_PIN);
    Serial.print("[INIT] Initializing HX711 Load Cell...");
    
    int checkAttempts = 0;
    while (!scale.is_ready() && checkAttempts < 10) {
        delay(200);
        Serial.print(".");
        checkAttempts++;
    }

    if (scale.is_ready()) {
        Serial.println(" Ready!");
        loadCalibrationFromNVS();
    } else {
        Serial.println("\n[WARN] HX711 not responding! Check DOUT(21) / SCK(22) wiring.");
    }

    connectWiFi();

    Serial.println("[READY] System initialized. Available serial commands:");
    Serial.println("   't' - Tare / Zero the scale");
    Serial.println("   'c' - Interactive known-weight calibration");
    Serial.println("   'r' - Instant diagnostic read");
    Serial.println("-------------------------------------------------------\n");
}

void loop() {
    // 1. Check Hardware Tare Button (Active Low on GPIO 0)
    if (digitalRead(TARE_BUTTON_PIN) == LOW) {
        delay(50); // Debounce
        if (digitalRead(TARE_BUTTON_PIN) == LOW) {
            executeTare();
            while (digitalRead(TARE_BUTTON_PIN) == LOW) delay(50); // Wait for release
        }
    }

    // 2. Check Serial Console Commands
    if (Serial.available()) {
        char cmd = (char)Serial.read();
        if (cmd == 't' || cmd == 'T') {
            executeTare();
        } else if (cmd == 'c' || cmd == 'C') {
            executeCalibrationRoutine();
        } else if (cmd == 'r' || cmd == 'R') {
            int fill = readBinFillPercent();
            float rawWeight = scale.is_ready() ? scale.get_units(5) : 0.0f;
            Serial.printf("[DIAG] Raw Weight: %.3f kg | Bin Fill: %d%%\n", rawWeight, fill);
        }
    }

    // 3. Periodic High-Precision Sensor Reading & Stability Filtering
    float currentRawWeight = 0.0f;
    if (scale.is_ready()) {
        currentRawWeight = scale.get_units(1); // Single-conversion fast sample
    }
    StabilityResult stability = processWeightSample(currentRawWeight);

    // 4. Telemetry Broadcast Loop
    unsigned long now = millis();
    if (now - lastTelemetryMillis >= TELEMETRY_PERIOD) {
        lastTelemetryMillis = now;

        int fillPercent = readBinFillPercent();
        transmitTelemetry(stability.averageWeightKg, stability.isStable, fillPercent);
    }

    // 5. Status LED Heartbeat
    if (now - lastLedBlinkMillis >= 1000) {
        lastLedBlinkMillis = now;
        if (WiFi.status() == WL_CONNECTED) {
            ledState = !ledState;
            digitalWrite(STATUS_LED_PIN, ledState);
        } else {
            digitalWrite(STATUS_LED_PIN, LOW);
        }
    }

    delay(50); // Yield to FreeRTOS scheduler
}
