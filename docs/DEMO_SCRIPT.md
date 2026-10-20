# GRAM-CIRCULAR: 5-Minute Grand Finale Demo Script

**Platform**: GRAM-CIRCULAR (Rural Waste Traceability, Smart IoT Weighing & OR-Tools Logistics)  
**Presenter Roles**: Lead Presenter + Live Platform Navigator  
**Audience**: Evaluation Jury, Ministry of Environment & Panchayat Raj Evaluators  
**Total Time**: Exactly 5 Minutes (300 Seconds)

---

## ⏱️ Minute-by-Minute Presentation Timeline

| Timestamp | Stage | Role Screen | Key Talking Point / Action |
| :---: | :--- | :--- | :--- |
| **00:00 – 00:45** | **1. The Problem & Zero-Friction Role Selector** | Header Navigation | Rural MLP leakage, informal burning, and instant persona switching. |
| **00:45 – 01:30** | **2. Admin Macro Analytics & Cluster Health** | `ADMIN` Dashboard | Real-time mass balance ledger, bin fill levels, and village maps. |
| **01:30 – 02:15** | **3. Village Worker Weighing & Batch Creation** | `WORKER` Mobile PWA | IoT HX711 scale reading, moving-window stability filter, QR token tagging. |
| **02:15 – 03:00** | **4. MRF Inward Scan & Quality Grading** | `MRF_OPERATOR` Desk | Live camera QR scanning, moisture/contamination grading, Bay A allocation. |
| **03:00 – 03:45** | **5. Google OR-Tools Route & Pooling Optimizer** | `ADMIN` Logistics | Comparing greedy baseline vs CVRP (24% diesel savings) & multi-village pooling. |
| **03:45 – 04:30** | **6. Processor Handover & Weighbridge Verification**| `BUYER` Portal | Consignment acceptance, weighbridge receipt upload, discrepancy check. |
| **04:30 – 05:00** | **7. Mass Balance Audit Ledger & Closing** | `ADMIN` Audit View | Zero ghost invoicing, CPCB EPR compliance certificate, final Q&A. |

---

## 🎭 Step-by-Step Spoken Script & Screen Actions

### Act 1: The Rural Problem & Demo Role Selector (00:00 – 00:45)
*Presenters stand before the jury. The screen displays the GRAM-CIRCULAR portal.*

> **Speaker 1 (Lead)**:  
> *"Respected Judges, across 250,000 Gram Panchayats in India, over 70% of multi-layered plastics (MLP) and dry packaging waste never reach an authorized recycler. Why? Because individual villages generate small, fragmented batches that industrial cement kilns and recyclers refuse to accept, while rural collectors lack verifiable digital scales to prevent fraud.*
>
> *Today, we present **GRAM-CIRCULAR**: an end-to-end circular economy platform connecting rural IoT weighing nodes, Google OR-Tools fleet optimization, and an immutable mass-balance ledger.*
>
> *To show you every stakeholder's real journey in just 5 minutes without logging in and out, observe our top navigation bar: with a single click, we switch seamlessly between **Admin, Village Worker, MRF Operator, Industrial Buyer, and Citizen**."*

---

### Act 2: Admin Dashboard & Village Health (00:45 – 01:30)
*Action: Click `ADMIN` in Role Selector. The screen shows the Executive Dashboard.*

> **Speaker 2 (Navigator)**:  
> *(Pointing to metrics)*  
> *"Here in the District Command Center for Coimbatore South, the Admin has real-time visibility across 3 Gram Panchayats and 4 Collection Points.*
>
> *We see **14,250 kg** of segregated dry waste collected, with **3,410 kg** safely stored in the regional MRF. Notice our live IoT Bin Heatmap: bin `BIN-SN-002-MLP` in Shanti Nagar is currently at **95% capacity**, flagged in red from its ultrasonic sensor.*
>
> *Most importantly, notice our **Mass Balance Health gauge at 99.75%**: every kilogram brought into the system is accounted for down to the gram."*

---

### Act 3: Village Worker Smart Weighing & Batch Creation (01:30 – 02:15)
*Action: Switch Role Selector to `WORKER`. The UI adapts to a rugged, high-contrast mobile view.*

> **Speaker 1 (Lead)**:  
> *"Let us step into the boots of Murugan, a sanitation worker at Collection Point 01 in Shanti Nagar.*
>
> *Murugan places a 15 kg sack of multi-layered snack wrappers onto our IoT weighing platform. Notice the live weight display: powered by our **ESP32 microcontroller and 24-bit HX711 ADC**, our digital moving-window filter analyzes 10 consecutive samples. The moment the weight variance drops below 50 grams, the green **'STABLE'** badge locks.*
>
> *Murugan taps **'Create Batch'**. The system assigns a unique batch code `MLP-2026-0042` and generates a tamper-proof QR code token. Even if cellular connectivity drops in remote fields, our **offline-first Dexie.js IndexedDB engine** queues the record locally and syncs automatically when network restores."*

---

### Act 4: MRF Inward Scan & Quality Grading (02:15 – 03:00)
*Action: Switch Role Selector to `MRF_OPERATOR`. Open the Inspection Desk.*

> **Speaker 2 (Navigator)**:  
> *"The collection vehicle arrives at the Material Recovery Facility (MRF). The operator, Kavitha, picks up the tablet and scans the QR code on Murugan's bag using the device camera.*
>
> *Instant lookup! The entire provenance—village origin, collector name, timestamp, and net weight of **14.85 kg**—appears.*
>
> *Kavitha conducts the physical grading: Contamination: 'Slightly Dirty'; Moisture: 'Low (<5%)'; Grade: **Grade A**. She clicks **'Approve & Assign Bay'**. The system directs the batch into **Storage Zone A (Baled Clean MLP)**. The physical inventory automatically updates in real time."*

---

### Act 5: Google OR-Tools Route & Waste Pooling Optimizer (03:00 – 03:45)
*Action: Switch back to `ADMIN` -> navigate to 'Fleet Logistics & Optimizer'.*

> **Speaker 1 (Lead)**:  
> *"Now comes the core mathematical innovation of GRAM-CIRCULAR: solving the twin crises of high diesel cost and sub-threshold lot sizes.*
>
> *First, we click **'Solve Route Optimization'**. Our Python FastAPI microservice invokes **Google OR-Tools Capacitated Vehicle Routing Problem (CVRP)** with Guided Local Search.  
> Notice the comparison right on the screen:*
> - *The naive, greedy driver baseline required **5.48 km**.*
> - *Our OR-Tools engine generates the optimal collection loop in just **4.12 km**.*
> - *That is an instant **24.8% reduction in travel distance**, saving diesel, operational budget, and eliminating $0.38\text{ kg of }CO_2$ on a single small run!*
>
> *Second, look at **Multi-Village Pooling**: 3 villages independently hold only 280 kg, 180 kg, and 160 kg—individually rejected by GreenCycle Recyclers whose minimum threshold is 500 kg. Our pooling evaluator aggregates them to **620 kg**, unlocking an industrial rate of ₹8.50/kg. Instead of selling to informal scrap dealers for ₹1,550, the cluster earns **₹4,962 net profit**—a **+220% value uplift** directly into the Gram Panchayat treasury!"*

---

### Act 6: Industrial Processor Handover & Receipt (03:45 – 04:30)
*Action: Switch Role Selector to `BUYER`. Open Dispatches & Inward Receipts.*

> **Speaker 2 (Navigator)**:  
> *"We now view the portal from the perspective of Arjun Nair, procurement manager at GreenCycle Recyclers.*
>
> *The aggregated consignment `DSP-2026-0012` arrives at the factory gate. Arjun enters the certified weighbridge slip: **518.2 kg**.  
> The system instantly compares it against the dispatch manifest of 520.4 kg: a variance of just $-0.43\%$, well within permissible moisture loss limits.*
>
> *Arjun uploads the coprocessing manifest and confirms receipt. The batch status transitions to **`PROCESSING_CONFIRMED`**."*

---

### Act 7: The Mass Balance Ledger & Closing (04:30 – 05:00)
*Action: Switch to `ADMIN` -> 'Mass Balance Ledger & EPR Certificate'.*

> **Speaker 1 (Lead)**:  
> *"Respected Judges, look at the final audit ledger:*
> - *Origin Village: Shanti Nagar.*
> - *IoT Scale Reading: Verified.*
> - *MRF Quality Grade: Grade A.*
> - *OR-Tools Consolidated Dispatch: Verified.*
> - *Industrial Coprocessing Receipt: Reconciled.*
>
> *Every single gram is tracked through physical conservation of mass. There is zero opportunity for phantom invoicing, ghost recycling, or double counting.*
>
> *With GRAM-CIRCULAR, rural India moves from toxic open burning to a sustainable, economically self-reliant, circular economy. Thank you, and we welcome your questions!"*
