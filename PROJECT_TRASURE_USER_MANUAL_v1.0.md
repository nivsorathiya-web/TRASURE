# USER MANUAL (v1.0)
## PROJECT TRASURE: B2B CIRCULAR ECONOMY AUCTION ENGINE & BY-PRODUCT TRADE PLATFORM
### Web Platform User Guide & Operational Reference

**Course:** Software Engineering Laboratory & Theory  
**Author:** Niv J. Sorathiya [Roll Number: 24BCB037 (Semester 5 | Division 1 | Group J2)]  
**Department:** Computer Science and Business Systems (CSBS)  
**Institution:** School of Technology, Pandit Deendayal Energy University (PDEU)  
**Academic Year:** 2025–2026  
**Document Release:** Version 1.0 (Final Academic Release)  

---

## 1. System Overview

### Purpose of Project TRASURE
**Project TRASURE** is an enterprise-grade, web-based B2B circular economy platform developed to streamline the sourcing, freight logistics estimation, dynamic reverse auctioning, and statutory environmental compliance of industrial bulk by-products. Heavy process industries—such as thermal power stations, chemical manufacturing plants, fertilizer complexes, and metallurgical refineries—generate massive volumes of secondary materials (including Fly Ash, Ground Granulated Blast-Furnace Slag [GGBS], Spent Sulfuric Acid, and Phosphogypsum).

TRASURE provides industrial procurement managers and plant sustainability heads with a centralized, transparent web console to:
1. **Discover True Delivered Landed Economics:** Avoid misleading ex-factory rates by dynamically calculating delivered landed prices that factor actual highway transit distance, heavy freight tariffs (₹/km/MT), and terminal handling fees.
2. **Visualize Real Road Transit Corridors:** Inspect turn-by-turn GIS highway routes plotted directly between source factories and destination hubs with real-time transit hour estimates.
3. **Execute Live B2B Reverse Auctions:** Procure bulk by-products at competitive market prices through a dynamic reverse auction engine protected by automated anti-sniping extensions.
4. **Automate SPCB Regulatory Compliance:** Seamlessly verify State Pollution Control Board (SPCB) consent credentials and automatically generate standardized Form 10 Hazardous Waste Movement Manifests.
5. **Generate Commercial B2B Tax Invoices:** Automatically compute statutory taxes (18% GST split into 9% CGST and 9% SGST) and produce verifiable commercial invoices.

### Client-Side Single Page Application Architecture
Project TRASURE is constructed entirely as a lightweight, zero-dependency **Single Page Application (SPA)** using standards-compliant HTML5, responsive CSS3, and modern Vanilla ES6+ JavaScript. It executes directly inside any modern web browser without requiring complex backend runtime servers, external database configurations, or heavy framework installations.

---

## 2. System Requirements & Getting Started

### Hardware & Software Prerequisites
- **Operating System:** Windows 10/11, macOS (10.15+), Linux (Ubuntu, Debian, Fedora), or ChromeOS.
- **Supported Web Browsers:**
  - Google Chrome (v90+) *[Recommended]*
  - Mozilla Firefox (v88+)
  - Apple Safari (v14+)
  - Microsoft Edge (v90+)
- **Display Resolution:** Optimized for desktop displays ($$1280 \times 720$$ minimum; $$1920 \times 1080$$ recommended).
- **Network Connectivity:** Minimal internet connection required for external map tile fetching (Esri) and OSRM highway routing. If disconnected, the platform automatically switches to its resilient offline geometric vector routing mode.

### How to Launch the Application
1. Extract or clone the project directory onto your workstation.
2. Locate the file named `TRASURE_website.html` in the project root directory.
3. Double-click the file to open it in your default web browser, or right-click and choose **Open With > Google Chrome**.
4. The application initializes immediately. On first launch, TRASURE automatically seeds default industrial by-product listings, verified supplier plants, and standard freight parameters into your browser's sandboxed `localStorage`.

---

## 3. System Navigation & Layout Structure

The TRASURE web interface is structured into three cohesive visual zones designed for high operational efficiency:

```
┌────────────────────────────────────────────────────────────────────────────┐
│ [LOGO] PROJECT TRASURE  |  B2B Circular Economy Engine       [Live Status] │
├────────────────────────────────────────────────────────────────────────────┤
│  [Tab: Sourcing Directory]  [Tab: Live Reverse Auction]  [Tab: Compliance] │
├──────────────────────────────────────┬─────────────────────────────────────┤
│  LEFT PANE: SOURCING & CONTROLS      │  RIGHT PANE: GIS LOGISTICS MAP      │
│  • Destination Plant Selector        │  • Interactive Leaflet Viewport     │
│  • Material Filter (Fly Ash, Slag)   │  • Turn-by-Turn Road Route Corridors│
│  • Ranked Supplier Directory Cards   │  • Plant Pin Markers & Tooltips     │
│  • Delivered Landed Cost Summaries   │  • Map Controls (Zoom, Fit Route)   │
├──────────────────────────────────────┴─────────────────────────────────────┤
│  BOTTOM BANNER: ACTIVE ROUTE LOGISTICS SUMMARY                             │
│  Origin Plant ➔ Delivery Hub | Total Road Distance | Estimated Transit Hrs │
└────────────────────────────────────────────────────────────────────────────┘
```

- **Top Navigation Bar:** Displays platform identity, current active receiving hub, and navigation pills to jump between the **Sourcing Directory**, **Live Reverse Auction Exchange**, and **SPCB Compliance Desk**.
- **Left Panel (Operational Desk):** Houses multi-parameter search filters, plant destination selectors, and the ranked by-product supplier catalog cards displaying ex-plant vs. delivered landed rates.
- **Right Panel (GIS Sourcing Map):** Features a dedicated Leaflet-powered GIS viewport displaying the high-contrast Esri World Gray Canvas basemap, supplier plant pins, and active turn-by-turn highway transit corridors.
- **Bottom Summary Ribbon:** Displays an at-a-glance logistics briefing: origin plant name, destination delivery hub, exact road distance in kilometers, estimated truck transit time, and freight cost per kilometer per metric tonne.

---

## 4. Core Features & Operational Procedures

### Module 1: Material Sourcing Catalog & Landed Cost Discovery

#### Purpose
Enables procurement managers to browse available industrial by-product lots and immediately evaluate them based on true delivered landed cost rather than deceptive ex-factory base prices.

#### Step-by-Step Procedure
1. Navigate to the **Sourcing Directory** tab.
2. In the **Destination Plant Selector** dropdown, select your receiving facility (e.g., *Vadodara Hub, Gujarat* or *Ramagundam Plant, Telangana*).
3. Use the **Category Filter** pills to isolate specific materials:
   - **All Materials**
   - **Fly Ash** (Class F / Class C thermal power by-product)
   - **GGBS Slag** (Blast furnace cementitious additive)
   - **Spent Acid** (Industrial regenerated sulfuric acid)
   - **Phosphogypsum** (Fertilizer chemical by-product)
4. Inspect the generated supplier cards:
   - **Base Ex-Plant Price:** The raw quotation at the seller's gate.
   - **Calculated Freight:** Transit fee calculated based on exact highway distance.
   - **Delivered Landed Cost:** Highlighted in bold green (e.g., `₹3,239/MT`).
   - The vendor with the lowest delivered cost is automatically badged as **"Optimal Landed Cost"**.
5. Click **"View Route on Map"** on any supplier card to highlight that specific vendor's transit corridor on the GIS map.

---

### Module 2: GIS Logistics Transit Routing & Map Exploration

#### Purpose
Provides real-world road network visualization of bulk freight transit, allowing logistics managers to evaluate highway corridors, travel times, and geographic feasibility.

#### Step-by-Step Procedure
1. In the GIS Map panel, review the rendered map:
   - **Green Marker:** Your configured destination receiving facility.
   - **Orange Markers:** Verified supplier production plants.
   - **Green Polyline:** The active turn-by-turn road transit corridor.
2. Click **"Fit Route"** to automatically zoom and center the map viewport so both origin and destination facilities are in full view.
3. Click **"My Plant"** to focus directly on your designated delivery terminal.
4. Hover your mouse over any production facility marker to view a high-contrast tooltip displaying plant name, available stock quantity (MT), and landed price.
5. In the bottom **Active Sourcing Route** card, review:
   - **Total Highway Distance:** Measured via real road geometry (e.g., `1395 km`).
   - **Estimated Transit Time:** Standard heavy-haulage truck speed estimation (e.g., `~25 hrs Transit`).
   - **Freight Tariff:** Standard rate per kilometer per metric tonne (e.g., `₹2.01/km/MT`).

---

### Module 3: Live B2B Reverse Auction Exchange & Bidding Desk

#### Purpose
Allows bulk industrial buyers to conduct dynamic reverse auctions where pre-qualified industrial sellers compete to fulfill procurement tenders by progressively bidding downwards.

#### Step-by-Step Procedure
1. Click the prominent orange button: **"⚡ Launch & Enter Live B2B Auction Exchange"**.
2. The **Live Reverse Auction Floor Modal** opens:
   - **Tender Reference:** e.g., *Lot #FA-2026-900 (Fly Ash, Grade A - 500 MT)*.
   - **Ceiling Starting Price:** Maximum rate established by the buyer (e.g., `₹4,200/MT`).
   - **Current Leading (Lowest) Bid:** The best market offer submitted so far (e.g., `₹3,800/MT`).
   - **Countdown Clock:** Live ticker timer initialized to `03:00` (180 seconds).
3. **Placing a Competitive Bid:**
   - As an authorized participating supplier, enter your competitive price per metric tonne into the **"Enter Bid Price (₹/MT)"** field.
   - **Rule 1:** The bid must be strictly less than the current leading bid.
   - **Rule 2:** The bid must decrease the price by at least the minimum required decrement (₹50/MT).
   - Click **"Submit Counter-Bid"**.
4. **Anti-Sniping Protection in Action:**
   - If a counter-bid is submitted when the countdown clock has **less than 60 seconds** remaining, the auction engine automatically activates Anti-Sniping Protection.
   - The countdown timer immediately adds **60 seconds** of overtime.
   - A bright amber banner alerts all participants: *"Anti-Sniping Overtime Triggered! +60s Added"*.
5. **Auction Conclusion & Award:**
   - When the countdown timer reaches `00:00`, the auction floor locks automatically.
   - The lowest bidder is declared the winner, and the finalized contract price is locked.
   - Click **"Proceed to Settlement & Compliance"** to generate the commercial invoice and transit documents.

---

### Module 4: SPCB Environmental Compliance & Manifest Desk

#### Purpose
Ensures all secondary by-product transactions comply with statutory environmental guidelines established by the Central and State Pollution Control Boards (CPCB/SPCB) under the Hazardous and Other Wastes Rules.

#### Step-by-Step Procedure
1. From the main menu, click **"Environmental Compliance"** or click through from a completed auction.
2. Select the transaction lot to audit.
3. Review the compliance parameters verified by the engine:
   - **SPCB Consent to Operate (CTO) ID:** Verified authorization certificate number.
   - **Material Categorization:** Verified whether classified as Non-Hazardous By-Product or Schedule II/III Regulated Waste.
   - **HAZCHEM Schedule Code:** Automated assignment (e.g., *Class 8 Corrosive - UN 1830* for Spent Acid).
4. Enter the authorized logistics transit credentials:
   - **Transporter Agency Name**
   - **Vehicle Registration Number** (e.g., `GJ-06-AX-4821`)
   - **Driver Contact & Emergency Mobile**
5. Click **"Generate SPCB Form 10 Manifest"**.
6. The system compiles a formatted, 6-copy statutory transit manifest ready for printing and physical escort with the transport vehicle.

---

### Module 5: Automated Invoicing & Financial Settlement Desk

#### Purpose
Compiles an itemized commercial B2B tax invoice detailing raw material costs, freight charges, and dual GST statutory breakdowns.

#### Step-by-Step Procedure
1. Upon completing an auction or spot order, click **"View Commercial Tax Invoice"**.
2. Review the structured billing components:
   - **Invoice Metadata:** Unique Tax Invoice Number (e.g., `TRS-2026-904`), issue date, and timestamp.
   - **Consignor (Seller) & Consignee (Buyer):** Legal corporate names, addresses, and GSTIN numbers.
   - **Material Line Item:** Material description, HSN code, ordered quantity in MT, and agreed unit rate.
   - **Logistics Line Item:** Freight haulage charges calculated from highway distance.
   - **Statutory Taxation:**
     - Central GST (CGST @ 9%)
     - State GST (SGST @ 9%)
     - Total Statutory GST (18%)
   - **Grand Total Payable:** Displayed clearly in Indian Rupees (₹).
3. Click the **"Print / Download Invoice (PDF)"** button to trigger your browser's native print-to-PDF dialogue.

---

### Module 6: System Administration & Master Data Calibration

#### Purpose
Allows administrators or evaluators to recalibrate simulation parameters, reset test transactions, and switch active receiving facilities.

#### Step-by-Step Procedure
1. Click the **"Settings / Master Data"** link in the platform footer.
2. To simulate different geographic logistics scenarios:
   - Choose a different default buyer terminal (e.g., *Vadodara, Chennai, Panipat, or Ramagundam*).
   - Adjust the **Base Freight Tariff Slider** (default: `₹2.00 / km / MT`).
3. To reset the platform to its clean initial state:
   - Click the **"Reset to Factory Seed Data"** button.
   - Confirm the prompt; TRASURE will clear browser `localStorage` and remount clean mock listings, reset auction clocks, and re-index supplier coordinates.

---

## 5. Troubleshooting & Frequently Asked Questions (FAQ)

### Frequently Asked Questions

**Q1: Can Project TRASURE run offline without an active internet connection?**  
*Answer:* **Yes.** TRASURE is architected as an offline-resilient Single Page Application. All core modules—including catalog filtering, landed cost calculations, reverse auction bidding, anti-sniping timers, SPCB manifest generation, and invoice billing—operate 100% locally. If the browser cannot reach external map tile servers, the GIS engine automatically plots a fallback vector path between origin and destination coordinates without interrupting workflow.

**Q2: Why does the Delivered Landed Cost differ significantly from the Ex-Plant price?**  
*Answer:* Secondary industrial materials are heavy bulk goods with low value-to-weight ratios. Sourcing Fly Ash from Jharsuguda (Odisha) to Vadodara (Gujarat) entails over 1,300 km of road transport, adding approximately `₹2,700/MT` in freight. TRASURE deliberately factors this in to protect buyers from unexpected landed expenses.

**Q3: How does the Anti-Sniping rule protect participating bidders?**  
*Answer:* In unmanaged auctions, predatory bots submit bids in the final millisecond, giving human bidders no time to counter. TRASURE enforces an automated 60-second overtime rule: any valid bid received with less than 60 seconds remaining resets the clock by adding 60 seconds, ensuring fair, transparent price discovery.

### Common Troubleshooting Scenarios

| Issue Observed | Probable Cause | Recommended Resolution |
| :--- | :--- | :--- |
| **Map shows gray grid or fails to render road path** | Browser blocked external tile fetch or network is throttled. | Click the **"Fit Route"** button. If offline, the platform automatically renders the geometric fallback corridor. |
| **Counter-bid rejected on submission** | Entered bid does not meet the minimum decrement of ₹50/MT below the current leader. | Ensure your bid is at least ₹50 lower than the current displayed lowest bid. |
| **Invoice displays NaN or missing totals** | LocalStorage state was interrupted or corrupted during a browser reload. | Click **"Reset to Factory Seed Data"** in the footer to restore pristine seed values. |
| **Map marker labels overlapping on small screens** | Zoom level too low for closely located industrial facilities. | Click the `+` zoom button on the top-left of the map or click **"Fit Route"** to space out markers. |

---

## 6. Technical Support & Feedback

For technical support, software verification questions, or academic inquiries regarding Project TRASURE:

- **Lead Architect & Developer:** Niv J. Sorathiya  
- **University Roll Number:** 24BCB037  
- **Department:** Computer Science and Business Systems (CSBS)  
- **Institution:** School of Technology, Pandit Deendayal Energy University (PDEU), Gandhinagar, Gujarat  
- **Email:** `24bcb037@sot.pdpu.ac.in` / `niv.sorathiya@gmail.com`  
- **Live Web Deployment:** https://trasure-phi.vercel.app
- **GitHub Repository:** https://github.com/nivsorathiya-web/TRASURE  
