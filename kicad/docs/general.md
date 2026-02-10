# Keyboard Driver ↔ Matrix Board Interface

**Connector: 11-pin board-to-board interface**
**Orientation: Left → Right (Pin 1 → Pin 11)**

## Pinout Summary

| Pin | Signal Name   | Type      | Voltage    | Direction       | Description                                 |
| --: | ------------- | --------- | ---------- | --------------- | ------------------------------------------- |
|   1 | **GND**       | Power     | 0 V        | Bidirectional   | Common ground reference for logic and power |
|   2 | **5V**        | Power     | +5 V       | Driver → Matrix | Main power rail for LEDs |
|   3 | **3.3V**      | Power     | +3.3 V     | Driver → Matrix | Logic supply for MCP23017 expanders         |
|   4 | **RESET**     | Control   | 3.3 V      | Driver → Matrix | Reset line for MCP23017 devices             |
|   5 | **MCP1_INTA** | Interrupt | 3.3 V      | Matrix → Driver | Interrupt A from MCP #1 (rows)              |
|   6 | **MCP1_INTB** | Interrupt | 3.3 V      | Matrix → Driver | Interrupt B from MCP #1 (rows)              |
|   7 | **MCP2_INTA** | Interrupt | 3.3 V      | Matrix → Driver | Interrupt A from MCP #2 (columns)           |
|   8 | **MCP2_INTB** | Interrupt | 3.3 V      | Matrix → Driver | Interrupt B from MCP #2 (columns)           |
|   9 | **LED_DIN**   | Data      | 5 V logic  | Driver → Matrix | Serial data input for LED chain             |
|  10 | **SDA**       | I²C       | 3.3 V (OD) | Bidirectional   | I²C data (pulled up on driver board)        |
|  11 | **SCK**       | I²C       | 3.3 V (OD) | Bidirectional   | I²C clock (pulled up on driver board)       |

## Electrical Notes

* **Ground**

  * All grounds are common
  * No separation between “5V GND” and “3.3V GND”

* **Power**

  * 5V is intended primarily for LEDs
  * 3.3V supplies MCP23017 logic
  * No local regulation on matrix board assumed (unless explicitly added)

* **I²C Bus**

  * SDA / SCK are **open-drain**
  * Pull-up resistors are located on the **driver board**
  * Matrix board must NOT add additional pull-ups unless explicitly required

* **Interrupt Lines**

  * MCP interrupts are active-low (per MCP23017 behavior)
  * Lines are expected to be pulled up on the driver board
  * Used for efficient key state change detection

* **LED Data**

  * LED_DIN is a unidirectional data line
  * Logic level assumed compatible with LED chipset used
  * Series resistor near the source is recommended (if not already present)

* **RESET**

  * Reset line controls MCP23017 reset pins
  * Active-low
  * Driven by the driver board

## Design Intent

* Matrix board is **I²C slave only**
* Driver board owns:
  * MCU
  * I²C pull-ups
  * Power sequencing
  * LED timing
* Matrix board contains:
  * MCP23017 expanders
  * Key matrix
  * LEDs

This interface is designed to allow:

* Reuse of the same matrix with different drivers
* Cheap respins of the matrix PCB
* Clear electrical responsibility separation
