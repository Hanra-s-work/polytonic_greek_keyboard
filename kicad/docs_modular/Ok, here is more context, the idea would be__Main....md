<!--
-- +==== BEGIN AsperHeader =================+
-- LOGO:
-- ...........+++....................
-- ..........+++++...................
-- ..........++..++..................
-- .........++...+++.................
-- ........+++....++.................
-- .......+++......++................
-- .......++........++++++++++.......
-- ......++......+++++++....+++++++..
-- .....+++....+++...+++.........+++.
-- ....+++...+++......++......+++....
-- ....++...+++........++++++........
-- ...++...+++.......+++++...........
-- ..++....++....++++...+++..........
-- .+++...+++++++........++..........
-- +++...++++.............++.........
-- +++++..+++.............+++........
-- ........++................++++++++
-- ........+++.....................++
-- .........++.....................++
-- ..........++....................++
-- ...........+++..................++
-- .............+++++..........+++++.
-- .................++++++++++++.....
-- /STOP
-- PROJECT: AsperHeader
-- FILE: Ok, here is more context, the idea would be__Main....md
-- CREATION DATE: 09-11-2026
-- LAST MODIFIED: 1:9:43 10-11-2026
-- DESCRIPTION:
-- 
-- /STOP
-- COPYRIGHT: (c) Asperguide
-- PURPOSE: 
-- // AR
-- +==== END AsperHeader =================+
-->
# Plan for modular keyboard

Yes, this modular pipeline is **completely doable**, but achieving dynamic shape discovery and precise LED spatial animations requires shifting from standard passive matrices to an **active serial bus chain**.

### **Core Hardware Architecture**

To let the main PCB identify the physical position of keys, blank bridges, and line terminators—without hardcoding positions—each module needs to pass two types of signals down the chain:

1. **LED Signal Line (DIN $\rightarrow$ DOUT):** High-speed serial data for the addressable LEDs (SK6812 / WS2812B).  
2. **Key / State Data Line (DATA\_IN $\rightarrow$ DATA\_OUT):** High-speed SPI / Shift Register data for reading key states, module types, and topology.

```plaintext
Main PCB (ESP32-S3)  
       │  
       ▼  
 ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐  
 │  T-PIPE  │ ───► │  CHERRY  │ ───► │  BRIDGE  │ ───► │   EOL    │  
 │ (Branch) │      │  (Key)   │      │ (Blank)  │      │ (End Pin)│  
 └──────────┘      └──────────┘      └──────────┘      └──────────┘
```

### **Per-Module Chip Breakdown**

#### **1\. Cherry Module (Key \+ RGB)**

* **Key Reader Chip:** **74HC165** (Parallel-In / Serial-Out Shift Register) or **ATtiny412** microcontroller.  
* **How it reports identity & switch state:**  
  * When using a **74HC165**, allocate 8 bits per module:  
    * **Bits \[0..5\]:** Module ID / Type (e.g., 0b000001 \= "Cherry Switch Module").  
    * **Bit 6:** Switch status (1 \= pressed, 0 \= released).  
    * **Bit 7:** Reserved / Modifier state.  
* **RGB LED:** **SK6812 MINI-E** (or WS2812B). The LED consumes 24 bits of color data (\$8\\times\\text{Red}, 8\\times\\text{Green}, 8\\times\\text{Blue}\$) and passes the rest down the chain.

#### **2\. Bridge Module (Blank / Spacer \+ RGB)**

* **Role:** Retains spatial layout for LED animations and forwards signal vectors.  
* **Chip Required:** **74HC165** (or pass-through wiring if fixed identity is handled via hardware jumper).  
* **Identity Reporting:** Returns a distinct byte payload over the shift line (e.g., 0b000010 \= "Bridge / Blank Module").  
* **LED:** Houses an active SK6812 LED so backlight animations sweep seamlessly across empty structural spaces.

#### **3\. T-Pipe Module (Branch / Intersection)**

* **Role:** Splits the signal vertically (Column/Row branching) to allow matrix grids instead of a single long ribbon.  
* **Chip Required:** **1-to-2 SPI / LED Switch** (e.g., **74LVC1G3157** analog switch) or a tiny 8-pin MCU (e.g., **CH32V003**).  
* **Branch Logic:** When the ESP32 scans the chain, the T-Pipe routes data down Branch A until an EOL signal is hit, then toggles to Branch B.

#### **4\. EOL Module (End of Line)**

* **Role:** Signals to the ESP32 that the current branch or row has terminated.  
* **Implementation (No complex chip needed):** Connect the shift register Serial Data line to a fixed logic high (${V}_{CC}$) or a unique bit pattern (e.g., 0xFF / 0b11111111).  
* When the ESP32 shifts in 0xFF, it registers the end of that layout line and stops scanning.

### **How the ESP32-S3 Auto-Discovers Layout & Animation**

ESP32 Shift Data Stream Output Example:  

```txt
\[ Byte 1: 0x01 (Key) \] ──► \[ Byte 2: 0x02 (Bridge) \] ──► \[ Byte 3: 0x01 (Key) \] ──► \[ Byte 4: 0xFF (EOL) \]
```

1. **Topology Scan (On Startup / Hot-Plug):**  
   * The ESP32 pulses the Latch line and reads the serial shift chain.  
   * It reads \[Cherry Module\] \-\> \[Bridge Module\] \-\> \[Cherry Module\] \-\> \[EOL\].  
   * The ESP32 automatically maps **3 LED positions** in memory, but assigns keycodes **only to indices 0 and 2**, treating index 1 purely as an animation pixel.  
2. **Frame Animation Driver:**  
   * Because the Bridge module contains an RGB LED, standard 2D wave/ripple lighting algorithms evaluate the Bridge pixel without breaking the visual grid sequence.

### **Critical Hardware Challenges to Address**

| Challenge | Cause | Solution |
| :---- | :---- | :---- |
| **Data Degradation** | High clock rates over 20+ snap connector boundaries cause edge distortion. | Add a single-gate buffer chip (e.g., **74LVC1G125**) on the SPI Clock and Data lines on each module to clean the pulse shape. |
| **Hot-Plug Glitches** | Snapping a module while powered causes floating gate states on the shift register. | Put $10k\Omega$ pull-down resistors on data input lines and TVS ESD diodes on snap pad contacts. |
| **Peak Power Draw** | 100 LEDs on maximum brightness draw **\~5 Amps** at 5V. | Inject 5V power bus traces along T-Pipes directly from the main PCB rather than stringing supply power in series through tiny edge connectors. |

------------------------------

Based on the KiCad schematic files provided for your project (`modular_matrice`), here is the detailed schematic breakdown and component wiring for all your modules.

---

### **System Signal Bus Architecture**

Each interconnect edge between modules carries **6 main lines**:

1. **`VCC_5V`** – High current supply for addressable LEDs.
2. **`VCC_3V3`** – Logic power for chips/MCUs.
3. **`GND`** – Common ground.
4. **`LED_DATA`** – Serial NeoPixel line (**`DIN` $\rightarrow$ `DOUT**`).
5. **`SHIFT_DATA`** – Serial key-state shift line (**`DS` $\rightarrow$ `Q7**`).
6. **`SHIFT_CLK` & `~{PL}**` – Shared clock and Parallel Load pulse lines.

---

### **1. Cherry Module Schematic (Key Switch + RGB)**

#### **Components Required:**

* **`U1`**: `SN74HC165D` (SOIC-16 Shift Register)

* **`SW1`**: `SW_Cherry_MX` (Mechanical Switch)

* **`D1`**: `WS2812B` / `SK6812` (RGB LED)

* **`C1`**: `100nF` Decoupling Capacitor (VCC to GND near U1)
* **`C2`**: `100nF` Decoupling Capacitor (VCC to GND near D1)
* **`R1`**: `10kΩ` Pull-up resistor (for key switch)
* **`R2`**: `10kΩ` Pull-down resistor on `DS` pin ( hot-plug floating protection)
* **`R3`**: `33Ω` Resistor in series on `DOUT` line (terminates reflections)

#### **ASCII Pin Layout & Interconnections:**

```plaintext
                   +----------------------------------+
                   |          CHERRY MODULE           |
                   +----------------------------------+

  [IN EDGE]                                                        [OUT EDGE]
 ------------------+                                              +-------------------
  VCC_5V ----------+----------------------------------------------+-------- VCC_5V
                   |       +-------------------+                  |
  VCC_3V3 ---------+---+---| Pin 16 (VCC)      |                  +-------- VCC_3V3
                   |   |   |   SN74HC165D (U1) |                  |
                   |  [C1] |                   |                  |
                   |   |   |                   |                  |
  GND -------------+---+---| Pin 8 (GND)       |                  +-------- GND
                   |   |   |                   |                  |
                   |  ---  |                   |                  |
                   |       | Pin 1  (~PL)  <---+--- (Shared ~PL) -+-------- ~PL
                   |       | Pin 2  (CP)   <---+--- (Shared CLK) -+-------- CLK
                   |       | Pin 15 (~CE)  ----+--- GND           |
                   |       |                   |                  |
  SHIFT_DATA IN --->-------+ Pin 10 (DS)       |                  |
                   |   |   |                   |                  |
                  [R2] |   | Pin 9  (Q7)       +---->-- [R3 33R] -+-------- SHIFT_DATA OUT
                   |   |   +-------------------+                  |
                  ---  |     |   |   |   |                        |
                       |    D0  D1  D2  D3... (Fixed Type Bits)   |
                       |    1   0   0   0                         |
                       |                                          |
                       |   +-------------------+                  |
                       +---| Pin 1 (10k R1)    |                  |
                       |   |   Cherry Switch   |                  |
                       +---| Pin 2 (SW1 Pin 1) |                  |
                           |   Pin 4 (SW1 Pin 4)+--- GND          |
                           +-------------------+                  |
                             | (Connected to U1 Pin 11 / D0)      |
                                                                  |
  LED_DATA IN ----->-------+ Pin 4 (DIN)       +------------------+
                           |   WS2812B (D1)    |                  |
                           | Pin 2 (DOUT)      +------------------+-------- LED_DATA OUT
                           +-------------------+

```

* **Module ID Bit Allocation on `74HC165` (`U1`):**
* **`D0` (Pin 11):** Connected to Switch (`SW1`). Pulled High (`1`) when idle, Low (`0`) when pressed.

* **`D1..D6` (Pins 12–14, 3–5):** Hardwired to `VCC_3V3` or `GND` to form a unique binary identifier (e.g., `0b000001` = Cherry Module).

* **`D7` (Pin 6):** Tied to `GND`.

---

### **2. Bridge Module Schematic (Blank Spacer + RGB)**

#### **Components Required:**

* **`U4`**: `SN74HC165D` (Shift Register)

* **`D2`**: `WS2812B` (RGB LED)

* **`C1`, `C2**`: `100nF` Decoupling capacitors
* **`R1`**: `10kΩ` Pull-down on `DS`

#### **ASCII Pin Layout & Interconnections:**

```plaintext
                   +----------------------------------+
                   |          BRIDGE MODULE           |
                   +----------------------------------+

  [IN EDGE]                                                        [OUT EDGE]
 ------------------+                                              +-------------------
  VCC_5V ----------+----------------------------------------------+-------- VCC_5V
  VCC_3V3 ---------+-------+--- Pin 16 (VCC)   SN74HC165D (U4)    +-------- VCC_3V3
  GND -------------+-------+--- Pin 8 (GND)                       +-------- GND
                   |       |
                   |       |-- Pin 1  (~PL)  <-- (Shared ~PL) ----+-------- ~PL
                   |       |-- Pin 2  (CP)   <-- (Shared CLK) ----+-------- CLK
                   |       |-- Pin 15 (~CE)  --- GND              |
                   |       |                                      |
  SHIFT_DATA IN --->-------+-- Pin 10 (DS)                        |
                   |   |   |   Pin 9  (Q7)   ---------------------+-------- SHIFT_DATA OUT
                  [R1] |   +-----------------------------------+  |
                   |   |     |   |   |   |                        |
                  --- ---   D0  D1  D2  D3... (Fixed Type Bits)   |
                            0   1   0   0  (Bridge Type = 0x02)   |
                                                                  |
  LED_DATA IN ----->-------+ Pin 4 (DIN)       +------------------+
                           |   WS2812B (D2)    |                  |
                           | Pin 2 (DOUT)      +------------------+-------- LED_DATA OUT
                           +-------------------+

```

* **Module ID Bit Allocation:**
* Pins **`D0..D7`** are statically wired to represent `0b000010` (`0x02`), identifying this module as a spatial blank/bridge.

---

### **3. End of Line (EOL) Module Schematic**

#### **Components Required:**

* **No Active ICs required**
* **`R1`**: `10kΩ` Pull-up resistor to `VCC_3V3` on the `SHIFT_DATA` return line.

#### **ASCII Schematic:**

```plaintext
                   +----------------------------------+
                   |            EOL MODULE            |
                   +----------------------------------+

  [IN EDGE]                                                         [TERMINATION]
 ------------------+                                               +-------------------
  VCC_3V3 ---------+-------+ 
                   |       |
                  [R1]     | (Unused / Open)
                   |       |
  SHIFT_DATA IN --->-------+---> Returns Logic HIGH (0xFF) to ESP32 on scan completion.
  
  LED_DATA IN ----->------------ (Unconnected / Terminated with 100-ohm resistor to GND)
  GND -------------+------------ GND

```

* When the `74HC165` chain shifts through this termination, the line pulls constantly High (`0xFF`), notifying the ESP32 firmware that the chain end is reached.

---

### **4. Main PCB & ESP32 Interface Connection**

#### **Components Required:**

* **`U3`**: `CH32V003FxUx` (or 1-to-2 multiplexer on T-Pipe branches if used)

* **Signal Buffers**: `74LVC1G125` single-gate buffers on `CLK`, `~PL`, and `LED_DATA` lines if total chain length exceeds 15+ snap modules.
* **Power Injection Line**: Connect 5V high-current bus directly from the main PCB terminal block across key branches to prevent voltage drops.

#### **ESP32-S3 Pin Out Routing:**

| ESP32-S3 Pin | Signal Name | Target Board Connector Pin |
| --- | --- | --- |
| **`GPIO 4`** | `LED_DATA` | Pin 1 of Snap Connector (`DIN` to 1st WS2812B)

 |
| **`GPIO 5`** | `SHIFT_DATA_IN` | Pin 2 of Snap Connector (`Q7` from 1st 74HC165)

 |
| **`GPIO 6`** | `SHIFT_CLK` | Pin 3 of Snap Connector (`CP` on all 74HC165s)

 |
| **`GPIO 7`** | `~{PL}` (Latch) | Pin 4 of Snap Connector (`~{PL}` on all 74HC165s)

 |
| **`5V`** | `VCC_5V` | Pin 5 of Snap Connector (LED power bus)

 |
| **`GND`** | `GND` | Pin 6 of Snap Connector (Ground)

 |

---
Here is the rendered CAD-style schematic diagram for the **T-Pipe Module** matching the exact black-and-white grid layout of your other modules:

### **T-Pipe (Branching) Module Schematic**

The T-Pipe uses an active multiplexer/analog switch (e.g., **74LVC1G3157** or a tiny MCU like the **CH32V003**) to route the incoming `LED_DATA` and `SHIFT_DATA` down **Branch A** (the main path) until it hits an EOL terminator, then flips selection to **Branch B** (the perpendicular row/column path).

```plaintext
                                      +------------------------------------+
                                      |    T-PIPE OUT (BRANCH B - VERT)    |
                                      +------------------------------------+
                                      | VCC_5V | VCC_3V3 | GND | DATA_OUT  |
                                      +---|--------|-------|-------^-------+
                                          |        |       |       |
                                          |        |       |       +---------------+
                                          |        |       |                       |
                                          |        |       +-------------------+   |
                                          |        |                           |   |
                                          |        +-----------------------+   |   |
                                          |                                |   |   |
  +----------------------+                |       VCC_3V3                  |   |   |
  | MODULE IN (MAIN BUS) |                |          |                     |   |   |
  +----------------------+                |         [C1]                   |   |   |
  | VCC_5V --------------+----------------+----------|---------------------+---|---+----------> VCC_5V
  | VCC_3V3 -------------+----------------+----------+----+                |   |   +----------> VCC_3V3
  | GND -----------------+----------------+---------------|-------+--------+---|------------> GND
  |                      |                                |       |        |   |
  | LED_DATA_IN ---------+----------------------+         |       |        |   |   +----------> LED_DATA_OUT (BRANCH A)
  | SHIFT_DATA_IN -------+-------+              |         |       |        |   |   |
  | SHIFT_CLK -----------+--+    |              v         v       v        |   |   |
  | PL ------------------+- | -+ |         ┌────────────────────────┐      |   |   |
  +----------------------+  |  | |         │   CH32V003 / 74LVC3157 │      |   |   |
                            |  | |         │   T-PIPE BRANCH ROUTER │      |   |   |
                            |  | |         ├────────────────────────┤      |   |   |
                            |  | |         │ 6 (VDD)       (OUT A) 7├------|---|---+
                            |  | |         │ 4 (VSS/GND)   (OUT B) 8├------|---+
                            |  | +-------->│ 10 (DATA_IN)           │      |
                            |  +---------->│ 2 (SHIFT_CLK)          │      |
                            +------------->│ 1 (PL_LATCH)           │      |
                                           └────────────────────────┘      |
                                                       |                   |
                                                       +-------------------+
                                                          (SELECT LOGIC)
                                                                           +----------------+
                                                                           | MODULE OUT     |
                                                                           | (BRANCH A)     |
                                                                           +----------------+

```

### **Component & Terminal Interconnect Breakdown**

| Component | Pin / Signal | Connection Target |
| --- | --- | --- |
| **Input Header** | `VCC_5V`, `VCC_3V3`, `GND` | Passes straight through to **Branch A Out** and **Branch B Out** (Power Rails). |
| **Input Header** | `LED_DATA_IN` | Connects to MUX Input Pin (`10`). |
| **Input Header** | `SHIFT_CLK` & `~PL` | Connected to Routing Logic Pins (`1` & `2`) to monitor topology sequence. |
| **74LVC1G3157 / MCU** | `OUT A` (Pin `7`) | Connects to `LED_DATA_OUT` of **Branch A** (Straight path). |
| **74LVC1G3157 / MCU** | `OUT B` (Pin `8`) | Connects to `LED_DATA_OUT` of **Branch B** (Branching 90° path). |
| **Bypasses** | `SHIFT_CLK` & `~PL` | Shared globally across both **Branch A** and **Branch B** output connectors. |
Option 2 (using a single tiny MCU to decode scans and route signals) is extremely stable if designed properly, as it is standard practice in modular hardware architectures.

### How Option 2 Works (Single MCU Architecture)

Instead of using an MCU to drive external analog switch ICs (like the `74LVC1G3157`), you let the **CH32V003** (or **ATtiny412**) directly handle the signal pass-through using its internal GPIO hardware and interrupts/timers.

```plaintext
                   ┌──────────────────────────────────┐
                   │    CH32V003 (Single IC T-Pipe)   │
                   ├──────────────────────────────────┤
LED_DATA_IN  ─────►│ Pin 5 (PD0)    (PD2) Pin 16 ────►│ LED_DATA_OUT (Branch A)
                   │                (PD3) Pin 17 ────►│ LED_DATA_OUT (Branch B)
SHIFT_DATA_IN────►│ Pin 15 (PD1)    (PD4) Pin 18 ────►│ SHIFT_DATA_OUT (Branch A)
                   │                (PD5) Pin 19 ────►│ SHIFT_DATA_OUT (Branch B)
SHIFT_CLK    ─────►│ Pin 12 (PC5)                     │
~PL (Latch)  ─────►│ Pin 13 (PC6)                     │
                   └──────────────────────────────────┘

```

---

### Why It Is Stable

1. **Deterministic State Machine:** The MCU runs a lightweight bit-counting interrupt on `SHIFT_CLK` and `~PL`. When the ESP32 pulses the latch line, the MCU sets its active output branch to **A**. Once it detects an EOL byte payload (`0xFF`) shifting through from Branch A, it immediately flips its internal GPIO routing to **Branch B**.

2. **Signal Regeneration (Built-In Buffer):** Passing signals directly through MCU GPIOs eliminates signal degradation over long ribbon cable/snap-connector chains. The MCU acts as an active logic buffer, solving edge-distortion issues automatically.
3. **Fewer Failure Points:** Eliminating the discrete `74LVC1G3157` multiplexers removes extra trace routing, decreases component count, reduces solder joint failure risks on hot-pluggable edges, and cuts down PCB trace crowding.

---

### Key Signal Timing Considerations

* **Bit-Bang / GPIO Passthrough Latency:** The MCU needs to propagate the high-speed NeoPixel `LED_DATA` line (800 kHz) accurately. The 48 MHz system clock on the **CH32V003** easily handles GPIO bit-passthrough or internal SPI/USART peripheral mapping without distorting the WS2812B/SK6812 pulse widths.

* **Decoupling:** Keep a `100nF` MLCC capacitor close to the MCU's `VDD`/`GND` pins to prevent reset glitches when hot-swapping modular edges.

Option 2 (the single-MCU approach) is **far simpler and less overkill** than the multi-chip version shown in the schematic diagram.

---

### **Comparing the Two Architectures**

| Design Aspect | Current Design (Schematic)

 | Option 2 (Single-MCU Passthrough) |
| --- | --- | --- |
| **Active Chip Count** | **3 ICs** (1x MCU + 2x 74LVC switches)

 | **1 IC** (Just the CH32V003 or ATtiny) |
| **Component Count** | High (~10+ components including resistors/caps)

 | Low (~3 components total: MCU + 2 caps) |
| **Routing Complexity** | High (routing data, select signals, and bus lines to 3 separate chips)

 | Low (all signals go directly into and out of one chip) |
| **PCB Footprint** | Takes up significant board space | Extremely compact (fits easily on a small module) |

---

### **Why the Current Schematic Feels Overkill**

In your current schematic layout, the MCU acts as a "brain" that just flips the enable/select pins on external 74LVC multiplexer chips. You are essentially using the MCU as a smart light switch, while forcing the physical signal lines to travel through extra, dedicated switch ICs.

---

### **Why Option 2 Is the Cleaner Engineering Choice**

Modern microcontrollers like the CH32V003 run at 48 MHz and have GPIO ports fast enough to handle signal routing internally.

Instead of routing signals **to a switch chip that is controlled by an MCU**, the signal simply goes **directly through the MCU pins**:

1. **`LED_DATA_IN`** comes into Pin A.
2. The MCU reads its internal state machine (whether Branch A or Branch B is active).
3. It mirrors that input pin directly to Pin B (Branch A Output) or Pin C (Branch B Output).

By letting the MCU handle the routing inside its own silicon, you eliminate two extra integrated circuits, free up routing space on your board, and lower your overall bill of materials (BOM) cost—making it much less overkill while keeping the full dynamic scanning functionality intact.

---

Are you planning to write custom C firmware for the CH32V003 to handle the state machine, or would you prefer to stick with standard Arduino-compatible microcontrollers like the ATtiny412?
