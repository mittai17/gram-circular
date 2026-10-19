# GRAM-CIRCULAR IoT Edge Node: Smart Scale & Bin Telemetry Firmware

Production-ready ESP32 Arduino/C++ firmware interfacing an **HX711 24-bit ADC Load Cell Amplifier** for weight verification and an **HC-SR04 Ultrasonic Distance Sensor** for bin fill-level monitoring.

---

## 📋 System Overview

In the GRAM-CIRCULAR rural waste supply chain, weighing integrity at village collection points is critical to prevent fraud, eliminate ghost batches, and establish an auditable EPR (Extended Producer Responsibility) mass-balance ledger.

The IoT node performs:
1. **High-precision digital weighing** with moving-window stability detection (10-sample window, 50g tolerance).
2. **Ultrasonic bin volume sensing** measuring empty bin headspace to compute fill percentage (0% to 100%).
3. **Non-Volatile Calibration Storage**: Calibration factors and zero tare offsets are stored directly in ESP32 Flash memory (`Preferences` API) and survive power reboots.
4. **Real-Time Telemetry Dispatch**: Transmits HTTP POST payloads to the NestJS backend at `/api/v1/devices/reading`.

---

## 🔌 Hardware Pin Mapping & Circuit Schematic

### Pin Allocation Table

| Peripheral | Sensor Pin | ESP32 GPIO | Operating Voltage | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **HX711 ADC** | VCC | 5V / VIN | 5.0V DC | Power from 5V rail |
| **HX711 ADC** | GND | GND | 0V | Common ground |
| **HX711 ADC** | DT (DOUT) | **GPIO 21** | 3.3V Logic | Serial Data output |
| **HX711 ADC** | SCK | **GPIO 22** | 3.3V Logic | Serial Clock output |
| **HC-SR04** | VCC | 5V / VIN | 5.0V DC | Requires 5V for transducer acoustic range |
| **HC-SR04** | GND | GND | 0V | Common ground |
| **HC-SR04** | TRIG | **GPIO 18** | 3.3V Logic | 10µs trigger pulse (3.3V output triggers 5V HC-SR04 safely) |
| **HC-SR04** | ECHO | **GPIO 19** | **Voltage Divider** | **CRITICAL**: 5V Echo pulse stepped down to 3.3V via $1\text{k}\Omega / 2\text{k}\Omega$ resistors |
| **Status LED** | Anode | **GPIO 2** | 3.3V | Built-in Blue LED (WiFi & transmit heartbeat) |
| **Tare Button** | Signal | **GPIO 0** | 3.3V | Hardware BOOT button with internal pull-up (active low) |

---

### Voltage Divider Circuit for HC-SR04 Echo Pin

> [!CAUTION]
> The HC-SR04 ultrasonic echo pin outputs a **5.0V** pulse. Directly connecting this to an ESP32 GPIO pin (max rating 3.6V) can permanently damage the microcontroller input buffer. Always employ a resistive divider!

```
HC-SR04 ECHO (5V Out)
        |
      [1kΩ] Resistor (R1)
        |
        +-----> ESP32 GPIO 19 (Echo Input: ~3.33V Safe Logic)
        |
      [2kΩ] Resistor (R2)
        |
       GND (0V Common)
```

**Calculation:**
$$V_{\text{ESP32}} = V_{\text{ECHO}} \times \left(\frac{R_2}{R_1 + R_2}\right) = 5.0\text{V} \times \left(\frac{2000}{1000 + 2000}\right) = 3.33\text{V}$$

---

### Load Cell Wheatstone Bridge Connection to HX711

Standard 4-wire strain gauge load cells (50 kg / 100 kg bar type):

| Load Cell Wire | Color | HX711 Terminal | Description |
| :--- | :--- | :--- | :--- |
| **Excitation+** | Red | **E+** | Positive excitation voltage (~4.3V) |
| **Excitation-** | Black | **E-** | Ground / Negative excitation |
| **Signal+** | Green | **A+** | Positive differential analog output |
| **Signal-** | White | **A-** | Negative differential analog output |

---

## 🛠️ Calibration Instructions

The firmware provides an interactive serial command interface for in-field zeroing and two-point calibration.

### Step 1: Zero / Tare Scale
1. Connect ESP32 to computer via USB and open Serial Monitor at **115200 baud**.
2. Ensure the weighing platform is completely empty.
3. Send the character `t` in the Serial Monitor (or press the hardware button on **GPIO 0**).
4. The console will confirm:
   ```text
   [SCALE] Taring... Please ensure platform is completely empty.
   [SCALE] Tare complete. Zero offset set to: -142850
   [NVS] Saved Calibration: Factor=-2280.00, Offset=-142850
   ```

### Step 2: Two-Point Reference Calibration
1. Send the character `c` in the Serial Monitor.
2. The firmware will prompt:
   ```text
   GRAM-CIRCULAR INTERACTIVE LOAD CELL CALIBRATION
   1. Clear weighing platform. Sending tare command...
   2. Place a known reference weight on the scale.
      Type the weight in KILOGRAMS into Serial Monitor (e.g. '5.00') and press Enter:
   ```
3. Place a certified reference calibration weight (e.g., 5.00 kg bag or dumbbell) on the platform.
4. Enter `5.00` in the serial input and hit enter.
5. The firmware measures 20 ADC samples, calculates `newFactor = ADC_reading / 5.00`, and commits it to non-volatile flash:
   ```text
   3. Sampling scale with reference weight: 5.000 kg...
   [SUCCESS] Calibration complete! New Scale Factor: -2148.60
   [NVS] Saved Calibration: Factor=-2148.60, Offset=-142850
   ```
6. The scale factor is now permanently saved and automatically restored upon reboot.

---

## 📦 Hardware Bill of Materials (BOM)

Budget-optimized for rural Gram Panchayat deployments:

| # | Component | Specifications | Qty | Unit Price (INR) | Unit Price (USD) |
| :- | :--- | :--- | :-: | :-: | :-: |
| 1 | **ESP32 DevKit V1** | Dual-core Tensilica Xtensa 240MHz, 4MB Flash, Wi-Fi & BLE | 1 | ₹380 | $4.50 |
| 2 | **HX711 ADC Module** | 24-bit high-precision analog-to-digital converter, on-chip PGA | 1 | ₹75 | $0.90 |
| 3 | **50 kg Strain Gauge Load Cell** | Single-point aluminum alloy bar, IP65, 0.05% F.S. accuracy | 1 | ₹420 | $5.00 |
| 4 | **HC-SR04 Ultrasonic Sensor** | 2cm – 400cm range, 40kHz acoustic transducer | 1 | ₹90 | $1.10 |
| 5 | **Resistors ($1\text{k}\Omega, 2\text{k}\Omega$)** | 1/4W metal film 1% precision | 2 | ₹4 | $0.05 |
| 6 | **Waterproof Enclosure Box** | IP65 ABS plastic junction box ($150 \times 100 \times 70\text{ mm}$) | 1 | ₹180 | $2.15 |
| 7 | **USB Power Adapter / Cable** | 5V 2A microUSB wall charger or 18650 battery shield | 1 | ₹150 | $1.80 |
| **Total** | **Complete Smart IoT Weighing & Fill Node** | | | **₹1,299** | **$15.50** |

---

## 🔄 Simulated Device Fallback Mode

During hackathon presentations, rural field demos with poor WiFi, or test runs without physical ESP32 hardware attached, the GRAM-CIRCULAR platform automatically falls back to **Simulated Device Mode**:

1. **Automatic Heartbeat Detection**:
   The backend API tracks device pings. If an ESP32 hardware device is inactive or disconnected, the frontend and worker apps offer an **IoT Simulation Toggle**.
2. **Realistic Sensor Emulation**:
   The backend mock generator simulates:
   - Dynamic weight jitter ($\pm 15\text{ g}$) modeling rural wind and uneven floor vibration.
   - Settle time: simulated readings become `isStable: true` after 1.5 seconds.
   - Real-time bin fill percentage calculation matching historical village accumulation rates.
3. **Data Tagging**:
   Every batch record retains the `weightSource` attribute (`"SENSOR"` when real ESP32 telemetry is received, or `"SIMULATED"` / `"MANUAL"` during fallback), guaranteeing transparency in regulatory mass-balance audits.
