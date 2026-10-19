# GRAM-CIRCULAR: Hardware Wiring, Circuit Schematics & Electrical Specification

**Edge IoT Node**: ESP32 DevKit V1 Smart Weighing Scale & Ultrasonic Bin Fill Monitor  
**Target Deployment**: Rural Gram Panchayat Waste Segregation Sheds & Municipal Collection Points

---

## 1. System Wiring Schematic

```
                                  +---------------------+
                                  | 5V 2A DC Power Bank |
                                  |   or USB Supply     |
                                  +----------+----------+
                                             |
                         +-------------------+-------------------+
                         | 5V                                    | GND
                         v                                       v
               +-------------------+                   +-------------------+
               |  ESP32 DevKit V1  |                   |   Common Ground   |
               |                   |                   +---------+---------+
               |  5V (VIN)         |<----------------------------+
               |  GND              |<--------------------------------------+
               |                   |                                       |
               |  GPIO 21 (DOUT)   |<======== [HX711 DOUT]                 |
               |  GPIO 22 (SCK)    |========> [HX711 SCK]                  |
               |                   |                                       |
               |  GPIO 18 (TRIG)   |========> [HC-SR04 TRIG]               |
               |  GPIO 19 (ECHO)   |<--+                                   |
               +-------------------+   |                                   |
                                       | (3.3V safe)                       |
                                       |                                   |
                                    [1kΩ R1]                               |
                                       ^                                   |
                                       | (5V pulse)                        |
       [HC-SR04 ECHO Pin] -------------+                                   |
                                       |                                   |
                                    [2kΩ R2]                               |
                                       v                                   |
                                      GND ---------------------------------+
```

---

## 2. Voltage Divider for HC-SR04 Echo (3.3V Logic Protection)

> [!CAUTION]
> **ELECTRICAL HAZARD**: The HC-SR04 ultrasonic distance sensor requires $5\text{V}$ VCC to generate adequate acoustic energy for rural outdoor bins. Consequently, its **ECHO** pulse returns at a nominal **5.0V HIGH logic level**.
>
> The ESP32 microcontroller inputs are rated for a maximum absolute voltage of **3.6V**. Connecting the 5V Echo line directly to GPIO 19 will cause dielectric breakdown and permanent pin damage.

### Resistance Calculation

A passive resistive divider is inserted between the HC-SR04 Echo pin and ESP32 GPIO 19:

$$V_{\text{out}} = V_{\text{in}} \times \left(\frac{R_2}{R_1 + R_2}\right)$$

Selecting standard $1\%$-tolerance metal film resistors:
- $R_1 = 1.0\text{ k}\Omega$
- $R_2 = 2.0\text{ k}\Omega$ (or $2.2\text{ k}\Omega$)
- $V_{\text{in}} = 5.0\text{ V}$

$$V_{\text{GPIO 19}} = 5.0\text{ V} \times \left(\frac{2000}{1000 + 2000}\right) = 3.333\text{ V}$$

$3.33\text{ V}$ sits squarely within the ESP32 logic HIGH specification ($0.75 \times V_{\text{DD}} = 2.475\text{ V} \le V_{\text{IH}} \le 3.6\text{ V}$), ensuring crisp signal transitions without risk of latch-up.

---

## 3. HX711 24-bit ADC & Load Cell Wheatstone Bridge

### Strain Gauge 4-Wire Wiring

Standard aluminum alloy shear-beam or single-point load cells utilize a Wheatstone resistance bridge.

```
                  E+ (Excitation +, ~4.3V)
                         o
                        / \
          Gauge 1      /   \      Gauge 2
          (Tension)   /     \     (Compression)
                     /       \
         Signal -   o         o   Signal +
         (A-)       \         /   (A+)
                     \       /
          Gauge 4     \     /     Gauge 3
          (Compression)\   /      (Tension)
                        \ /
                         o
                  E- (Excitation -, 0V Ground)
```

| Wire Color | Terminal | HX711 Pin | Description |
| :--- | :--- | :--- | :--- |
| **RED** | Excitation Positive | `E+` | Regulated DC voltage output from HX711 |
| **BLACK** | Excitation Negative | `E-` | Analog ground reference |
| **WHITE** | Signal Negative | `A-` | Differential signal negative input |
| **GREEN** | Signal Positive | `A+` | Differential signal positive input |
| **BARE / YELLOW**| Shield | `GND` | Cable ground shield (prevents AC hum) |

### HX711 to ESP32 Signal Interface

| HX711 Board Pin | ESP32 DevKit Pin | Direction | Description |
| :--- | :--- | :--- | :--- |
| `VCC` | `5V` (or `3.3V`) | Power Input | Operating supply |
| `GND` | `GND` | Ground | Common system ground |
| `DT` (DOUT) | **GPIO 21** | ESP32 Input | Serial data output (24-bit two's complement) |
| `SCK` | **GPIO 22** | ESP32 Output | Serial clock input (25 to 27 pulses per sample) |

> [!TIP]
> Keep the unshielded load cell wire run between the strain gauge and the HX711 PCB under **30 cm**. The high-gain analog instrumentation amplifier (gain = 128) is susceptible to 50Hz mains hum and electromagnetic interference from nearby pumps or motors.

---

## 4. Power Supply, Decoupling & Grounding

Rural municipal collection points frequently suffer from brownouts, voltage spikes, and noisy line power.

1. **Power Ingress**:
   - Primary: 5V 2A regulated USB power adapter connected to a surge-protected spike buster.
   - Alternate In-Field: 10,000 mAh 5V USB battery bank providing up to 48 hours of continuous field operation.
2. **Decoupling Capacitors**:
   - Place a $100\mu\text{F}$ electrolytic capacitor in parallel with a $0.1\mu\text{F}$ ceramic capacitor across the 5V and GND rail near the ESP32 and HC-SR04 to absorb transient current pulses during WiFi transmission bursts (which can reach 240mA).
   - Place a $10\mu\text{F}$ tantalum capacitor across HX711 VCC and GND.
3. **Star Grounding**:
   - Connect all ground wires (ESP32 GND, HX711 GND, HC-SR04 GND, Voltage Divider R2 Ground) to a single central star ground terminal to eliminate ground loops that cause weight drift.

---

## 5. Environmental Enclosure & In-Field Packaging

Rural waste sorting sheds are exposed to dust, organic waste leachate, and high ambient humidity.

- **Enclosure**: IP65 rated ABS plastic junction box ($150 \times 100 \times 70\text{ mm}$) with silicone rubber gasket.
- **Cable Glands**: PG7 / PG9 waterproof nylon cable glands for sensor entry.
- **Ultrasonic Transducer Mounting**: The HC-SR04 is mounted downward on the underside of the bin lid through two 16mm drilled holes with silicone sealant.
- **Load Cell Mechanical Platform**: Single-point load cell bolted between two 12mm marine-grade plywood or stainless steel plates with M6 bolts and spacer washers, ensuring tare weight is evenly distributed without mechanical binding.

---

## 6. Diagnostic & Troubleshooting Checklist

| Symptom | Probable Root Cause | Resolution |
| :--- | :--- | :--- |
| `[WARN] HX711 not responding` | Loose connection on GPIO 21 or 22 | Verify DOUT is on pin 21, SCK on pin 22; check solder joints on header pins. |
| Scale reading drifts wildly | Ground loop or electromagnetic noise | Shield strain gauge wires; add star grounding; ensure stable 5V rail. |
| Scale returns negative weight | A+ and A- wires swapped | Reverse the Green (A+) and White (A-) wires on the HX711 terminal block. |
| Ultrasonic returns `-1` (timeout) | Echo pin voltage divider loose or Echo disconnected | Verify 1kΩ / 2kΩ divider; test with multimeter: voltage at GPIO 19 should measure ~3.3V during ping. |
| ESP32 reboots randomly | WiFi transmit current surge brownout | Ensure 5V supply can deliver at least 1.5A; install 100µF capacitor across power rails. |
