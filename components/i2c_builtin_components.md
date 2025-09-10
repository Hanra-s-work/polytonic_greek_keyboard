# Overview of the I2c and brightness controllers for the LCD

## **Power & Decoupling**

| Ref | Qty | Value / Part               | Footprint               | Purpose / Notes                               |
| --- | --- | -------------------------- | ----------------------- | --------------------------------------------- |
| C1  | 1   | 0.1 µF ceramic, 25 V, ±10% | C\_0805                 | Decoupling for PCF8574                        |
| C2  | 1   | 10 µF, 25 V, ±10%          | C\_1210 / C\_0805\_TANT | Bulk decoupling near LCD power                |
| C3  | 1   | 1 µF ceramic (optional)    | C\_0805                 | Extra decoupling for backpack area (optional) |

---

## **Connectors**

| Ref                 | Qty | Part / Value                      | Footprint                   | Purpose / Notes                                               |
| ------------------- | --- | --------------------------------- | --------------------------- | ------------------------------------------------------------- |
| J1 (J\_I2C)         | 1   | 4-pin header (VCC, GND, SDA, SCL) | PinHeader\_1x04\_P2.54mm    | External I²C LCD connector                                    |
| J2 (J\_LCD\_PAR)    | 1   | 14–16 pin header                  | PinHeader\_1x14/16\_P2.54mm | Parallel LCD connector (RS,RW,E,D4–D7,VCC,GND,VO,LED+/-)      |
| J3 (J\_BRIGHT\_PWM) | 1   | 3-pin header (GND, PWM, +V)       | PinHeader\_1x3\_P2.54mm     | Optional PWM input for backlight                              |
| TP1 (TP\_BRIGHT)    | 1   | 2 test pads                       | TestPoint                   | Optional simple pad for brightness connection                 |
| J4 (J\_LED\_CTRL)   | 1   | 2-pin header                      | PinHeader\_1x2\_P2.54mm     | Connects commercial I²C module LED+ to PCB brightness control |

---

## **Onboard I²C Backpack (optional)**

| Ref                  | Qty | Part / Value                                 | Footprint            | Purpose / Notes                               |
| -------------------- | --- | -------------------------------------------- | -------------------- | --------------------------------------------- |
| U1                   | 1   | PCF8574 or PCF8574A                          | SOIC-8 / SOIC-14     | Optional I²C → parallel LCD expander          |
| VR1                  | 1   | 10 kΩ trimmer                                | Trimmer\_3386P       | VO contrast adjustment                        |
| R1 (R\_BL)           | 1   | 150–330 Ω (optional)                         | R\_0805              | Series resistor for backlight LED (if needed) |
| Q1                   | 1   | N-MOSFET or NPN transistor                   | SOT-23               | Switch or PWM control for backlight           |
| D1                   | 1   | Optional diode (reverse polarity protection) | SOD-123              | Optional                                      |
| R2 (R\_PULLUP\_SDA)  | 1   | 4.7 kΩ                                       | R\_0805              | Optional I²C pull-up                          |
| R3 (R\_PULLUP\_SCL)  | 1   | 4.7 kΩ                                       | R\_0805              | Optional I²C pull-up                          |
| R4–R6 (R\_PCF\_ADDR) | 3   | 0 Ω / jumper pads                            | R\_0805 / SJ\_2\_PAD | A0, A1, A2 address selection                  |
| C4 (C\_DECOUP)       | 1   | 0.1 µF                                       | C\_0805              | Additional decoupling for U1 (optional)       |
| SJ1 (SJ\_EXP\_VCC)   | 1   | 2-pad solder jumper                          | SJ\_2\_PAD           | Connect/disconnect U1 VCC to LCD\_5V          |
| SJ2 (SJ\_EXP\_SDA)   | 1   | 2-pad solder jumper                          | SJ\_2\_PAD           | Connect/disconnect U1 SDA to I²C bus          |
| SJ3 (SJ\_EXP\_SCL)   | 1   | 2-pad solder jumper                          | SJ\_2\_PAD           | Connect/disconnect U1 SCL to I²C bus          |

---

## **Series isolation between PCF8574 and LCD**

| Ref                                               | Qty | Value / Part | Footprint            | Purpose / Notes                                                  |
| ------------------------------------------------- | --- | ------------ | -------------------- | ---------------------------------------------------------------- |
| R7–R14 (R0\_RS, R0\_RW, R0\_E, R0\_D4–D7, R0\_BL) | 8   | 0 Ω          | R\_0805 / SJ\_2\_PAD | Series resistors / jumpers between PCF8574 and LCD parallel pins |

---

## **Optional Level Shifter (for 3.3 V MCU / 5 V LCD)**

| Ref                        | Qty | Value / Part                  | Footprint         | Purpose / Notes              |
| -------------------------- | --- | ----------------------------- | ----------------- | ---------------------------- |
| U2 (U\_LS)                 | 1   | PCA9306 or 2×BSS138 + pullups | SOT-23-6 / SOT-23 | I²C level shifter (optional) |
| R15–R18 (R\_LS\_PULL\_A/B) | 2–4 | 4.7 kΩ                        | R\_0805           | Level shifter pull-ups       |

---

## **Silkscreen / Labeling**

| Ref       | Qty | Part / Value        | Footprint | Purpose / Notes                                                          |
| --------- | --- | ------------------- | --------- | ------------------------------------------------------------------------ |
| LABEL\_SJ | —   | Silkscreen markings | —         | Indicate “ONBOARD” / “EXTERNAL”, LED jumper, PWM/brightness instructions |

---

✅ **Notes**

* Optional parts (C3, U1, R1, D1, level shifter, jumpers) are **only populated if needed**.
* `J_LED_CTRL` exposes a **2-pin pad** for commercial I²C modules to connect their LED+ pin to your board brightness control safely.
* All reference designators (`C1`, `R2`, `U1`, etc.) are now included for your records.

---

If you like, I can also provide a **ready-to-copy CSV version** of this BOM so you can drop it directly into your spreadsheet for easier tracking. That would avoid having to manually copy from the chat.

Do you want me to do that?
