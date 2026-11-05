/* ==========================================================================
   TRASURE — Core Application Logic (B2B Industrial By-Product Marketplace)
   ========================================================================== */

window.TRASURE_LOADED = true;

// --- Firebase V10 Modular SDK Dynamic Load References ---
let initializeApp = null;
let getFirestore = null;
let collection = null;
let getDocs = null;
let addDoc = null;
let updateDoc = null;
let doc = null;
let query = null;
let where = null;
let onSnapshot = null;
let serverTimestamp = null;

// --- Firebase Configuration Placement (Demoware Placeholder) ---
document.documentElement.classList.add('js-active');

const firebaseConfig = {
    apiKey: "AIzaSyCB0slZdbdWpYQSWihr5cwmHUmbteL-1UM",
    authDomain: "orbital-braid-s07pf.firebaseapp.com",
    projectId: "orbital-braid-s07pf",
    storageBucket: "orbital-braid-s07pf.firebasestorage.app",
    messagingSenderId: "982187381741",
    appId: "1:982187381741:web:4329bda019dcb2c16b0de4"
};

// State togglers for Firebase Connection
let db = null;
let firebaseEnabled = false;

// --- Static By-Product Categories DB ---
const byproductCategories = {
    'Chemicals & Solvents': [
        'Spent Sulphuric Acid',
        'Spent Acetone',
        'Catalyst Sludge',
        'ETP Sludge',
        'Red Mud',
        'Spent Solvents',
        'Pickling Acid',
        'Spent Catalyst'
    ],
    'Metals & Mining': [
        'Blast Furnace Slag',
        'Mill Scale',
        'Aluminium Dross',
        'Copper Slag',
        'Iron Sludge'
    ],
    'Minerals & Construction': [
        'Fly Ash',
        'Phosphogypsum',
        'Silica Fume',
        'Bottom Ash'
    ],
    'Biomass & Organic': [
        'Bagasse',
        'Rice Husk Ash',
        'Oil Sludge',
        'Press Mud'
    ],
    'Paper & Cellulose': [
        'Lime Sludge',
        'Black Liquor Residue',
        'Cellulose Fiber Fines',
        'Pulp Mill Grit'
    ],
    'Glass & Ceramics': [
        'Cullet Residue',
        'Ceramic Slurry',
        'Refractory Slag',
        'Glass Powder'
    ],
    'Rubbers & Plastics': [
        'Polymer Fines',
        'Rubber Crumb',
        'Wax Distillates',
        'Carbon Black Residue'
    ]
};

// --- Dynamic Material Unit Mapping Database ---
const materialUnits = {
    // Chemicals & Solvents
    'Spent Sulphuric Acid': 'MT',
    'Spent Acetone': 'KL',
    'Catalyst Sludge': 'kg',
    'ETP Sludge': 'MT',
    'Red Mud': 'MT',
    'Spent Solvents': 'KL',
    'Pickling Acid': 'KL',
    'Spent Catalyst': 'kg',

    // Metals & Mining
    'Blast Furnace Slag': 'MT',
    'Mill Scale': 'MT',
    'Aluminium Dross': 'MT',
    'Copper Slag': 'MT',
    'Iron Sludge': 'MT',

    // Minerals & Construction
    'Fly Ash': 'MT',
    'Phosphogypsum': 'MT',
    'Silica Fume': 'MT',
    'Bottom Ash': 'MT',

    // Biomass & Organic
    'Bagasse': 'MT',
    'Rice Husk Ash': 'MT',
    'Oil Sludge': 'KL',
    'Press Mud': 'MT',

    // Paper & Cellulose
    'Lime Sludge': 'MT',
    'Black Liquor Residue': 'KL',
    'Cellulose Fiber Fines': 'MT',
    'Pulp Mill Grit': 'MT',

    // Glass & Ceramics
    'Cullet Residue': 'MT',
    'Ceramic Slurry': 'MT',
    'Refractory Slag': 'MT',
    'Glass Powder': 'MT',

    // Rubbers & Plastics
    'Polymer Fines': 'MT',
    'Rubber Crumb': 'MT',
    'Wax Distillates': 'KL',
    'Carbon Black Residue': 'MT'
};

function getMaterialUnit(material) {
    return materialUnits[material] || 'MT';
}

// --- Static Indian Industrial Cities Database (46 Cities with GST Codes) ---
const citiesDb = {
    'Mumbai':         { lat: 19.0760, lng: 72.8777, state: 'Maharashtra',    gstCode: '27' },
    'Surat':          { lat: 21.1702, lng: 72.8311, state: 'Gujarat',        gstCode: '24' },
    'Pune':           { lat: 18.5204, lng: 73.8567, state: 'Maharashtra',    gstCode: '27' },
    'Delhi':          { lat: 28.7041, lng: 77.1025, state: 'Delhi NCR',      gstCode: '07' },
    'Chennai':        { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu',     gstCode: '33' },
    'Hyderabad':      { lat: 17.3850, lng: 78.4867, state: 'Telangana',      gstCode: '36' },
    'Kolkata':        { lat: 22.5726, lng: 88.3639, state: 'West Bengal',    gstCode: '19' },
    'Visakhapatnam':  { lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh', gstCode: '37' },
    'Jodhpur':        { lat: 26.2389, lng: 73.0243, state: 'Rajasthan',      gstCode: '08' },
    'Bengaluru':      { lat: 12.9716, lng: 77.5946, state: 'Karnataka',      gstCode: '29' },
    'Ahmedabad':      { lat: 23.0225, lng: 72.5714, state: 'Gujarat',        gstCode: '24' },
    'Vadodara':       { lat: 22.3072, lng: 73.1812, state: 'Gujarat',        gstCode: '24' },
    'Ankleshwar':     { lat: 21.6266, lng: 73.0140, state: 'Gujarat',        gstCode: '24' },
    'Dahej':          { lat: 21.7170, lng: 72.5680, state: 'Gujarat',        gstCode: '24' },
    'Nagpur':         { lat: 21.1458, lng: 79.0882, state: 'Maharashtra',    gstCode: '27' },
    'Jamshedpur':     { lat: 22.8046, lng: 86.2029, state: 'Jharkhand',      gstCode: '20' },
    'Bhopal':         { lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh', gstCode: '23' },
    'Raipur':         { lat: 21.2514, lng: 81.6296, state: 'Chhattisgarh',   gstCode: '22' },
    'Lucknow':        { lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh',  gstCode: '09' },
    'Kochi':          { lat: 9.9312,  lng: 76.2673, state: 'Kerala',         gstCode: '32' },
    'Jamnagar':       { lat: 22.4707, lng: 70.0577, state: 'Gujarat',        gstCode: '24' },
    'Bharuch':        { lat: 21.7051, lng: 72.9959, state: 'Gujarat',        gstCode: '24' },
    'Bellary':        { lat: 15.1394, lng: 76.9214, state: 'Karnataka',      gstCode: '29' },
    'Bhilai':         { lat: 21.1938, lng: 81.3509, state: 'Chhattisgarh',   gstCode: '22' },
    'Angul':          { lat: 20.8413, lng: 85.0985, state: 'Odisha',         gstCode: '21' },
    'Vapi':           { lat: 20.3755, lng: 72.9126, state: 'Gujarat',        gstCode: '24' },
    'Salem':          { lat: 11.6643, lng: 78.1460, state: 'Tamil Nadu',     gstCode: '33' },
    'Paradeep':       { lat: 20.2706, lng: 86.6664, state: 'Odisha',         gstCode: '21' },
    'Korba':          { lat: 22.3597, lng: 82.7501, state: 'Chhattisgarh',   gstCode: '22' },
    'Jharsuguda':     { lat: 21.8511, lng: 84.0044, state: 'Odisha',         gstCode: '21' },
    'Rourkela':       { lat: 22.2604, lng: 84.8536, state: 'Odisha',         gstCode: '21' },
    'Mundhra':        { lat: 22.8378, lng: 69.7247, state: 'Gujarat',        gstCode: '24' },
    'Mithapur':       { lat: 22.4116, lng: 68.9912, state: 'Gujarat',        gstCode: '24' },
    'Renukoot':       { lat: 24.2389, lng: 83.0315, state: 'Uttar Pradesh',  gstCode: '09' },
    'Tuticorin':      { lat: 8.7642,  lng: 78.1348, state: 'Tamil Nadu',     gstCode: '33' },
    'Haldia':         { lat: 22.0252, lng: 88.0583, state: 'West Bengal',    gstCode: '19' },
    'Mangalore':      { lat: 12.9141, lng: 74.8560, state: 'Karnataka',      gstCode: '29' },
    'Panipat':        { lat: 29.3909, lng: 76.9635, state: 'Haryana',        gstCode: '06' },
    'Bokaro':         { lat: 23.6693, lng: 86.1511, state: 'Jharkhand',      gstCode: '20' },
    'Rayagada':       { lat: 19.1678, lng: 83.4184, state: 'Odisha',         gstCode: '21' },
    'Nellikuppam':    { lat: 11.7699, lng: 79.6738, state: 'Tamil Nadu',     gstCode: '33' },
    'Khatauli':       { lat: 29.2818, lng: 77.7247, state: 'Uttar Pradesh',  gstCode: '09' },
    'Sameerwadi':     { lat: 16.3262, lng: 75.1437, state: 'Karnataka',      gstCode: '29' },
    'Vilayat':        { lat: 21.7580, lng: 73.0450, state: 'Gujarat',        gstCode: '24' },
    'Kota':           { lat: 25.2138, lng: 75.8648, state: 'Rajasthan',      gstCode: '08' },
    'Ramagundam':     { lat: 18.7618, lng: 79.4795, state: 'Telangana',      gstCode: '36' }
};

// --- In-Memory Offline Fallback Seed Databases ---
let companiesDb = [
    { id: 'c1', name: 'Chemfix Industries Ltd', sector: 'Chemical Manufacturing', city: 'Surat', gstin: '24ETGTM9156A1Z1', email: 'dispatch@chemfixindustries.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 11, 26) },
    { id: 'c2', name: 'Tamil Chem & Acid Ltd', sector: 'Chemical Manufacturing', city: 'Chennai', gstin: '33OAVHV6438A1Z0', email: 'dispatch@tamilchemacid.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 5, 16) },
    { id: 'c3', name: 'Deepak Nitrite Ltd', sector: 'Chemical Manufacturing', city: 'Vadodara', gstin: '24EKIDX0963A1Z0', email: 'dispatch@deepaknitrite.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 11, 11) },
    { id: 'c4', name: 'Aarti Industries Ltd', sector: 'Chemical Manufacturing', city: 'Ankleshwar', gstin: '24KLGOX5343A1Z9', email: 'dispatch@aartiindustries.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 4, 23) },
    { id: 'c5', name: 'Atul Ltd (Vapi Plant)', sector: 'Chemical Manufacturing', city: 'Vapi', gstin: '24JLJRT3041A1Z2', email: 'dispatch@atul.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 1, 13) },
    { id: 'c6', name: 'Bodal Chemicals Ltd', sector: 'Chemical Manufacturing', city: 'Ahmedabad', gstin: '24WADGZ2360A1Z0', email: 'dispatch@bodalchemicals.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 9, 25) },
    { id: 'c7', name: 'GNFC Ltd', sector: 'Chemical Manufacturing', city: 'Bharuch', gstin: '24FAEHU4976A1Z7', email: 'dispatch@gnfc.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 5, 12) },
    { id: 'c8', name: 'GSFC Ltd', sector: 'Chemical Manufacturing', city: 'Vadodara', gstin: '24UJBDP2497A1Z0', email: 'dispatch@gsfc.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 6, 14) },
    { id: 'c9', name: 'United Phosphorous Ltd (UPL)', sector: 'Chemical Manufacturing', city: 'Vapi', gstin: '24PFRGM0608A1Z9', email: 'dispatch@unitedphosphorous.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 2, 11) },
    { id: 'c10', name: 'Tata Chemicals Ltd', sector: 'Chemical Manufacturing', city: 'Mithapur', gstin: '24PBCDA4592A1Z7', email: 'dispatch@tatachemicals.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 4, 22) },
    { id: 'c11', name: 'Paradeep Phosphates Ltd', sector: 'Chemical Manufacturing', city: 'Paradeep', gstin: '21OHNQA2443A1Z6', email: 'dispatch@paradeepphosphates.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 10, 28) },
    { id: 'c12', name: 'Grasim Industries Ltd', sector: 'Chemical Manufacturing', city: 'Vilayat', gstin: '24SPZCT1569A1Z8', email: 'dispatch@grasimindustries.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 7, 3) },
    { id: 'c13', name: 'DCM Shriram Ltd', sector: 'Chemical Manufacturing', city: 'Kota', gstin: '08PXOKG2325A1Z9', email: 'dispatch@dcmshriram.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 1, 10) },
    { id: 'c14', name: 'Nirma Ltd (Chemical Division)', sector: 'Chemical Manufacturing', city: 'Vadodara', gstin: '24CYPHM2435A1Z5', email: 'dispatch@nirma.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 11, 2) },
    { id: 'c15', name: 'Balaji Amines Ltd', sector: 'Chemical Manufacturing', city: 'Pune', gstin: '27VWVJB5828A1Z3', email: 'dispatch@balajiamines.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 8, 25) },
    { id: 'c16', name: 'Balaji Amines Ltd', sector: 'Chemical Manufacturing', city: 'Pune', gstin: '27HTZGP0085A1Z3', email: 'dispatch@balajiamines.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 10, 14) },
    { id: 'c17', name: 'Alkyl Amines Chemicals Ltd', sector: 'Chemical Manufacturing', city: 'Dahej', gstin: '24JVHOX9474A1Z4', email: 'dispatch@alkylamineschemicals.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 11, 12) },
    { id: 'c18', name: 'Gujarat Fluorochemicals Ltd', sector: 'Chemical Manufacturing', city: 'Dahej', gstin: '24AGIJY5640A1Z1', email: 'dispatch@gujaratfluorochemicals.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 11, 24) },
    { id: 'c19', name: 'Coromandel International Ltd', sector: 'Chemical Manufacturing', city: 'Visakhapatnam', gstin: '37NEEZQ9571A1Z5', email: 'procurement@romandelinternational.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 10, 13) },
    { id: 'c20', name: 'Kakinada Fertilizers (Coromandel)', sector: 'Chemical Manufacturing', city: 'Visakhapatnam', gstin: '37WJAMD0253A1Z2', email: 'procurement@kakinadafertilizers.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 9, 9) },
    { id: 'c21', name: 'Rajpur Petrochemicals', sector: 'Refining & Petrochemicals', city: 'Jodhpur', gstin: '08HEBKN3525A1Z3', email: 'dispatch@rajpurpetrochemicals.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 1, 25) },
    { id: 'c22', name: 'Dahej Special Economic Zone', sector: 'Refining & Petrochemicals', city: 'Dahej', gstin: '24XJCFH3432A1Z9', email: 'dispatch@dahejspecialenomiczone.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 8, 24) },
    { id: 'c23', name: 'Reliance Industries Ltd', sector: 'Refining & Petrochemicals', city: 'Jamnagar', gstin: '24SCZOT0577A1Z0', email: 'dispatch@relianceindustries.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 11, 20) },
    { id: 'c24', name: 'Mangalore Refinery & Petrochemicals', sector: 'Refining & Petrochemicals', city: 'Mangalore', gstin: '29ZMJZR4137A1Z7', email: 'dispatch@mangalorerefinerypetrochemicals.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 5, 18) },
    { id: 'c25', name: 'IOCL Refinery (Panipat)', sector: 'Refining & Petrochemicals', city: 'Panipat', gstin: '06GRLNF8039A1Z3', email: 'dispatch@ioclrefinery.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 7, 20) },
    { id: 'c26', name: 'Haldia Petrochemicals Ltd', sector: 'Refining & Petrochemicals', city: 'Haldia', gstin: '19BWCKV2206A1Z8', email: 'dispatch@haldiapetrochemicals.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 7, 16) },
    { id: 'c27', name: 'Bharat Petroleum Corp Ltd', sector: 'Refining & Petrochemicals', city: 'Mumbai', gstin: '27LBCTW8290A1Z3', email: 'dispatch@bharatpetroleumrp.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 4, 3) },
    { id: 'c28', name: 'Hindustan Petroleum Corp Ltd', sector: 'Refining & Petrochemicals', city: 'Visakhapatnam', gstin: '37WJIOE3645A1Z6', email: 'dispatch@hindustanpetroleumrp.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 6, 11) },
    { id: 'c29', name: 'Vizag Iron & Steel Co', sector: 'Steel & Metallurgical Smelter', city: 'Visakhapatnam', gstin: '37POYNR8924A1Z9', email: 'dispatch@vizagironsteel.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 3, 19) },
    { id: 'c30', name: 'Jamshedpur Steel Rolling', sector: 'Steel & Metallurgical Smelter', city: 'Jamshedpur', gstin: '20HGRED6712A1Z4', email: 'dispatch@jamshedpursteelrolling.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 8, 28) },
    { id: 'c31', name: 'JSW Steel Ltd (Ballari)', sector: 'Steel & Metallurgical Smelter', city: 'Bellary', gstin: '29ZKRZT0151A1Z9', email: 'dispatch@jswsteel.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 7, 14) },
    { id: 'c32', name: 'Tata Steel Ltd', sector: 'Steel & Metallurgical Smelter', city: 'Jamshedpur', gstin: '20QRTLX9764A1Z7', email: 'dispatch@tatasteel.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 3, 1) },
    { id: 'c33', name: 'Hindalco Industries Ltd', sector: 'Steel & Metallurgical Smelter', city: 'Dahej', gstin: '24PVDJH9560A1Z1', email: 'dispatch@hindalindustries.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 3, 16) },
    { id: 'c34', name: 'Vedanta Ltd (Jharsuguda)', sector: 'Steel & Metallurgical Smelter', city: 'Jharsuguda', gstin: '21RYATX9009A1Z6', email: 'dispatch@vedanta.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 6, 18) },
    { id: 'c35', name: 'SAIL (Rourkela Steel Plant)', sector: 'Steel & Metallurgical Smelter', city: 'Rourkela', gstin: '21BZGSH8821A1Z9', email: 'dispatch@sail.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 9, 15) },
    { id: 'c36', name: 'SAIL (Bhilai Steel Plant)', sector: 'Steel & Metallurgical Smelter', city: 'Bhilai', gstin: '22RBYUB7053A1Z5', email: 'dispatch@sail.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 4, 23) },
    { id: 'c37', name: 'SAIL (Bokaro Steel Plant)', sector: 'Steel & Metallurgical Smelter', city: 'Bokaro', gstin: '20POEBM1690A1Z6', email: 'dispatch@sail.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 3, 20) },
    { id: 'c38', name: 'Jindal Steel & Power Ltd', sector: 'Steel & Metallurgical Smelter', city: 'Angul', gstin: '21BRWUL7656A1Z8', email: 'dispatch@jindalsteelpower.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 10, 1) },
    { id: 'c39', name: 'NALCO Smelter Plant', sector: 'Steel & Metallurgical Smelter', city: 'Angul', gstin: '21ZLXSC0708A1Z8', email: 'dispatch@nalsmelterplant.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 6, 10) },
    { id: 'c40', name: 'Hindalco Renukoot Plant', sector: 'Steel & Metallurgical Smelter', city: 'Renukoot', gstin: '09QGEQT5044A1Z9', email: 'dispatch@hindalrenukootplant.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 5, 14) },
    { id: 'c41', name: 'Maharashtra Thermal Power', sector: 'Thermal Power & Utilities', city: 'Mumbai', gstin: '27BCLEV2195A1Z9', email: 'dispatch@maharashtrathermalpower.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 1, 23) },
    { id: 'c42', name: 'NTPC Ltd (Vindhyachal)', sector: 'Thermal Power & Utilities', city: 'Korba', gstin: '22YJMET2687A1Z4', email: 'dispatch@ntpc.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 9, 20) },
    { id: 'c43', name: 'Adani Power Ltd (Mundra)', sector: 'Thermal Power & Utilities', city: 'Mundhra', gstin: '24WIDOR4330A1Z9', email: 'dispatch@adanipower.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 7, 3) },
    { id: 'c44', name: 'NTPC Ltd (Ramagundam)', sector: 'Thermal Power & Utilities', city: 'Ramagundam', gstin: '36CWLOV8256A1Z4', email: 'dispatch@ntpc.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 9, 28) },
    { id: 'c45', name: 'CESC Budge Budge Plant', sector: 'Thermal Power & Utilities', city: 'Kolkata', gstin: '19AJEZI0687A1Z8', email: 'dispatch@cescbudgebudgeplant.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 6, 14) },
    { id: 'c46', name: 'APGenco Thermal Plant', sector: 'Thermal Power & Utilities', city: 'Visakhapatnam', gstin: '37JAPXX3617A1Z2', email: 'dispatch@apgenthermalplant.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 11, 1) },
    { id: 'c47', name: 'Bengaluru Construction Cement', sector: 'Cement & Construction Materials', city: 'Bengaluru', gstin: '29WKVBA0052A1Z4', email: 'procurement@bengalurunstructioncement.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 4, 9) },
    { id: 'c48', name: 'Ahmedabad Textiles & Dyes', sector: 'Chemical Manufacturing', city: 'Ahmedabad', gstin: '24XBIAO1994A1Z3', email: 'procurement@ahmedabadtextilesdyes.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 3, 8) },
    { id: 'c49', name: 'UltraTech Cement Ltd (Raipur)', sector: 'Cement & Construction Materials', city: 'Raipur', gstin: '22FAOZD4529A1Z6', email: 'procurement@ultratechcement.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 8, 11) },
    { id: 'c50', name: 'Ambuja Cements Ltd', sector: 'Cement & Construction Materials', city: 'Ahmedabad', gstin: '24NQEQL3201A1Z8', email: 'procurement@ambujacements.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 9, 11) },
    { id: 'c51', name: 'Dalmia Cement Ltd', sector: 'Cement & Construction Materials', city: 'Rourkela', gstin: '21NJFFQ5153A1Z4', email: 'procurement@dalmiacement.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 6, 2) },
    { id: 'c52', name: 'Shree Cement Ltd', sector: 'Cement & Construction Materials', city: 'Raipur', gstin: '22DXVJR0323A1Z5', email: 'procurement@shreecement.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 1, 7) },
    { id: 'c53', name: 'ACC Cement Wadi Plant', sector: 'Cement & Construction Materials', city: 'Bellary', gstin: '29RHMNC2684A1Z5', email: 'procurement@acccementwadiplant.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 5, 12) },
    { id: 'c54', name: 'JK Cement Nimbahera Plant', sector: 'Cement & Construction Materials', city: 'Jodhpur', gstin: '08SRZJD7535A1Z0', email: 'procurement@jkcementnimbaheraplant.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 3, 15) },
    { id: 'c55', name: 'Ramco Cements Salem Plant', sector: 'Cement & Construction Materials', city: 'Salem', gstin: '33DCZET7663A1Z4', email: 'procurement@ramcementssalemplant.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 5, 13) },
    { id: 'c56', name: 'Parry Sugars Refinery', sector: 'Biomass & Organic', city: 'Kochi', gstin: '32SKXNK7500A1Z2', email: 'dispatch@parrysugarsrefinery.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 1, 23) },
    { id: 'c57', name: 'E.I.D. Parry Ltd', sector: 'Biomass & Recycling', city: 'Nellikuppam', gstin: '33OMXRI6868A1Z0', email: 'dispatch@e.i.d.parry.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 3, 3) },
    { id: 'c58', name: 'Triveni Sugars Plant', sector: 'Biomass & Recycling', city: 'Khatauli', gstin: '09MEEQQ5181A1Z9', email: 'dispatch@trivenisugarsplant.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 5, 19) },
    { id: 'c59', name: 'Godavari Biorefineries Ltd', sector: 'Biomass & Recycling', city: 'Sameerwadi', gstin: '29XFYHM6310A1Z4', email: 'dispatch@godavaribiorefineries.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 3, 21) },
    { id: 'c60', name: 'Balrampur Chini Mills', sector: 'Biomass & Recycling', city: 'Lucknow', gstin: '09HPBMB1409A1Z7', email: 'dispatch@balrampurchinimills.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 5, 25) },
    { id: 'c61', name: 'Dhampur Sugar Mills', sector: 'Biomass & Recycling', city: 'Khatauli', gstin: '09AHWNN1908A1Z4', email: 'dispatch@dhampursugarmills.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 9, 1) },
    { id: 'c62', name: 'JK Paper Ltd (Rayagada)', sector: 'Other Industrial Plant', city: 'Rayagada', gstin: '21GUAZZ1917A1Z0', email: 'dispatch@jkpaper.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 10, 26) },
    { id: 'c63', name: 'Century Pulp & Paper', sector: 'Other Industrial Plant', city: 'Lucknow', gstin: '09YCKAA1070A1Z7', email: 'dispatch@centurypulppaper.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 4, 7) },
    { id: 'c64', name: 'West Coast Paper Mills', sector: 'Other Industrial Plant', city: 'Bellary', gstin: '29ETDWS8516A1Z1', email: 'dispatch@westastpapermills.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 7, 2) },
    { id: 'c65', name: 'ITC Paperboards Kovai', sector: 'Other Industrial Plant', city: 'Salem', gstin: '33DVMXM8278A1Z7', email: 'dispatch@itcpaperboardskovai.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 1, 3) },
    { id: 'c66', name: 'Saint-Gobain India Ltd', sector: 'Other Industrial Plant', city: 'Chennai', gstin: '33OMYVH5603A1Z0', email: 'dispatch@saint-gobainindia.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 9, 11) },
    { id: 'c67', name: 'Asahi India Glass (AIS)', sector: 'Other Industrial Plant', city: 'Delhi', gstin: '07QHJQP6880A1Z1', email: 'dispatch@asahiindiaglass.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 3, 28) },
    { id: 'c68', name: 'Somany Ceramics Ltd', sector: 'Other Industrial Plant', city: 'Ahmedabad', gstin: '24EYWQT8689A1Z8', email: 'dispatch@somanyceramics.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 4, 28) },
    { id: 'c69', name: 'Kajaria Ceramics Ltd', sector: 'Other Industrial Plant', city: 'Delhi', gstin: '07PEYHF0612A1Z5', email: 'dispatch@kajariaceramics.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 7, 12) },
    { id: 'c70', name: 'Borosil Glass Works', sector: 'Other Industrial Plant', city: 'Bharuch', gstin: '24SRWOF6390A1Z6', email: 'dispatch@borosilglassworks.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 8, 14) },
    { id: 'c71', name: 'Apollo Tyres Chennai Plant', sector: 'Other Industrial Plant', city: 'Chennai', gstin: '33MOQMK3559A1Z3', email: 'dispatch@apollotyreschennaiplant.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 6, 14) },
    { id: 'c72', name: 'MRF Tyres Trichy Plant', sector: 'Other Industrial Plant', city: 'Chennai', gstin: '33BPLWY4490A1Z6', email: 'dispatch@mrftyrestrichyplant.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 7, 21) },
    { id: 'c73', name: 'Ceat Tyres Bhandup Plant', sector: 'Other Industrial Plant', city: 'Mumbai', gstin: '27JWNTC7085A1Z7', email: 'dispatch@ceattyresbhandupplant.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 10, 3) },
    { id: 'c74', name: 'Supreme Industries Ltd', sector: 'Other Industrial Plant', city: 'Pune', gstin: '27MZNHB9788A1Z5', email: 'dispatch@supremeindustries.in', role: 'both', pin: '1234', verified: true, registeredAt: new Date(2025, 10, 1) }
];

let listingsDb = [
    { id: 'l1', companyName: 'Apollo Tyres Chennai Plant', companyId: 'c71', city: 'Chennai', category: 'Chemicals & Solvents', material: 'Spent Sulphuric Acid', purity: 81, quantity: 340, price: 1650, transportRate: 2.1, active: true, createdAt: new Date() },
    { id: 'l2', companyName: 'Paradeep Phosphates Ltd', companyId: 'c11', city: 'Paradeep', category: 'Chemicals & Solvents', material: 'Spent Sulphuric Acid', purity: 84, quantity: 190, price: 1500, transportRate: 2.47, active: true, createdAt: new Date() },
    { id: 'l3', companyName: 'Grasim Industries Ltd', companyId: 'c12', city: 'Vilayat', category: 'Chemicals & Solvents', material: 'Spent Sulphuric Acid', purity: 77, quantity: 170, price: 1900, transportRate: 1.94, active: true, createdAt: new Date() },
    { id: 'l4', companyName: 'Asahi India Glass (AIS)', companyId: 'c67', city: 'Delhi', category: 'Chemicals & Solvents', material: 'Spent Sulphuric Acid', purity: 82, quantity: 410, price: 1250, transportRate: 2.48, active: true, createdAt: new Date() },
    { id: 'l5', companyName: 'SAIL (Rourkela Steel Plant)', companyId: 'c35', city: 'Rourkela', category: 'Chemicals & Solvents', material: 'Spent Sulphuric Acid', purity: 79, quantity: 650, price: 1050, transportRate: 2.01, active: true, createdAt: new Date() },
    { id: 'l6', companyName: 'Haldia Petrochemicals Ltd', companyId: 'c26', city: 'Haldia', category: 'Chemicals & Solvents', material: 'Spent Sulphuric Acid', purity: 79, quantity: 150, price: 1250, transportRate: 1.97, active: true, createdAt: new Date() },
    { id: 'l7', companyName: 'Deepak Nitrite Ltd', companyId: 'c3', city: 'Vadodara', category: 'Chemicals & Solvents', material: 'Spent Sulphuric Acid', purity: 81, quantity: 720, price: 1350, transportRate: 1.81, active: true, createdAt: new Date() },
    { id: 'l8', companyName: 'IOCL Refinery (Panipat)', companyId: 'c25', city: 'Panipat', category: 'Chemicals & Solvents', material: 'Spent Sulphuric Acid', purity: 82, quantity: 490, price: 1600, transportRate: 2.17, active: true, createdAt: new Date() },
    { id: 'l9', companyName: 'NTPC Ltd (Ramagundam)', companyId: 'c44', city: 'Ramagundam', category: 'Chemicals & Solvents', material: 'Spent Sulphuric Acid', purity: 83, quantity: 730, price: 1500, transportRate: 2.27, active: true, createdAt: new Date() },
    { id: 'l10', companyName: 'Vedanta Ltd (Jharsuguda)', companyId: 'c34', city: 'Jharsuguda', category: 'Chemicals & Solvents', material: 'Spent Sulphuric Acid', purity: 82, quantity: 400, price: 1600, transportRate: 2.01, active: true, createdAt: new Date() },
    { id: 'l11', companyName: 'Dalmia Cement Ltd', companyId: 'c51', city: 'Rourkela', category: 'Chemicals & Solvents', material: 'Spent Acetone', purity: 88, quantity: 110, price: 15500, transportRate: 2.55, active: true, createdAt: new Date() },
    { id: 'l12', companyName: 'Triveni Sugars Plant', companyId: 'c58', city: 'Khatauli', category: 'Chemicals & Solvents', material: 'Spent Acetone', purity: 96, quantity: 70, price: 13050, transportRate: 2.59, active: true, createdAt: new Date() },
    { id: 'l13', companyName: 'NTPC Ltd (Vindhyachal)', companyId: 'c42', city: 'Korba', category: 'Chemicals & Solvents', material: 'Spent Acetone', purity: 93, quantity: 190, price: 13750, transportRate: 2.74, active: true, createdAt: new Date() },
    { id: 'l14', companyName: 'Godavari Biorefineries Ltd', companyId: 'c59', city: 'Sameerwadi', category: 'Chemicals & Solvents', material: 'Spent Acetone', purity: 95, quantity: 120, price: 13700, transportRate: 3.15, active: true, createdAt: new Date() },
    { id: 'l15', companyName: 'Alkyl Amines Chemicals Ltd', companyId: 'c17', city: 'Dahej', category: 'Chemicals & Solvents', material: 'Spent Acetone', purity: 93, quantity: 140, price: 17800, transportRate: 3.03, active: true, createdAt: new Date() },
    { id: 'l16', companyName: 'JK Paper Ltd (Rayagada)', companyId: 'c62', city: 'Rayagada', category: 'Chemicals & Solvents', material: 'Spent Acetone', purity: 89, quantity: 110, price: 17150, transportRate: 3.18, active: true, createdAt: new Date() },
    { id: 'l17', companyName: 'ACC Cement Wadi Plant', companyId: 'c53', city: 'Bellary', category: 'Chemicals & Solvents', material: 'Spent Acetone', purity: 88, quantity: 130, price: 14050, transportRate: 2.73, active: true, createdAt: new Date() },
    { id: 'l18', companyName: 'Bodal Chemicals Ltd', companyId: 'c6', city: 'Ahmedabad', category: 'Chemicals & Solvents', material: 'Spent Acetone', purity: 92, quantity: 100, price: 13900, transportRate: 2.74, active: true, createdAt: new Date() },
    { id: 'l19', companyName: 'Tamil Chem & Acid Ltd', companyId: 'c2', city: 'Chennai', category: 'Chemicals & Solvents', material: 'Spent Acetone', purity: 96, quantity: 110, price: 16400, transportRate: 3.0, active: true, createdAt: new Date() },
    { id: 'l20', companyName: 'Hindustan Petroleum Corp Ltd', companyId: 'c28', city: 'Visakhapatnam', category: 'Chemicals & Solvents', material: 'Spent Acetone', purity: 92, quantity: 70, price: 13050, transportRate: 2.9, active: true, createdAt: new Date() },
    { id: 'l21', companyName: 'Ceat Tyres Bhandup Plant', companyId: 'c73', city: 'Mumbai', category: 'Chemicals & Solvents', material: 'Catalyst Sludge', purity: 63, quantity: 100, price: 70, transportRate: 1.82, active: true, createdAt: new Date() },
    { id: 'l22', companyName: 'Reliance Industries Ltd', companyId: 'c23', city: 'Jamnagar', category: 'Chemicals & Solvents', material: 'Catalyst Sludge', purity: 70, quantity: 60, price: 60, transportRate: 2.13, active: true, createdAt: new Date() },
    { id: 'l23', companyName: 'Bharat Petroleum Corp Ltd', companyId: 'c27', city: 'Mumbai', category: 'Chemicals & Solvents', material: 'Catalyst Sludge', purity: 69, quantity: 80, price: 35, transportRate: 1.84, active: true, createdAt: new Date() },
    { id: 'l24', companyName: 'West Coast Paper Mills', companyId: 'c64', city: 'Bellary', category: 'Chemicals & Solvents', material: 'Catalyst Sludge', purity: 61, quantity: 70, price: 70, transportRate: 1.62, active: true, createdAt: new Date() },
    { id: 'l25', companyName: 'NTPC Ltd (Ramagundam)', companyId: 'c44', city: 'Ramagundam', category: 'Chemicals & Solvents', material: 'Catalyst Sludge', purity: 56, quantity: 110, price: 45, transportRate: 1.9, active: true, createdAt: new Date() },
    { id: 'l26', companyName: 'Bengaluru Construction Cement', companyId: 'c47', city: 'Bengaluru', category: 'Chemicals & Solvents', material: 'Catalyst Sludge', purity: 71, quantity: 80, price: 45, transportRate: 1.79, active: true, createdAt: new Date() },
    { id: 'l27', companyName: 'CESC Budge Budge Plant', companyId: 'c45', city: 'Kolkata', category: 'Chemicals & Solvents', material: 'Catalyst Sludge', purity: 60, quantity: 80, price: 65, transportRate: 2.1, active: true, createdAt: new Date() },
    { id: 'l28', companyName: 'Ramco Cements Salem Plant', companyId: 'c55', city: 'Salem', category: 'Chemicals & Solvents', material: 'Catalyst Sludge', purity: 67, quantity: 100, price: 55, transportRate: 1.99, active: true, createdAt: new Date() },
    { id: 'l29', companyName: 'Adani Power Ltd (Mundra)', companyId: 'c43', city: 'Mundhra', category: 'Chemicals & Solvents', material: 'Catalyst Sludge', purity: 68, quantity: 60, price: 50, transportRate: 2.09, active: true, createdAt: new Date() },
    { id: 'l30', companyName: 'Hindustan Petroleum Corp Ltd', companyId: 'c28', city: 'Visakhapatnam', category: 'Chemicals & Solvents', material: 'Catalyst Sludge', purity: 67, quantity: 50, price: 55, transportRate: 1.7, active: true, createdAt: new Date() },
    { id: 'l31', companyName: 'Shree Cement Ltd', companyId: 'c52', city: 'Raipur', category: 'Chemicals & Solvents', material: 'ETP Sludge', purity: 61, quantity: 740, price: 390, transportRate: 2.72, active: true, createdAt: new Date() },
    { id: 'l32', companyName: 'MRF Tyres Trichy Plant', companyId: 'c72', city: 'Chennai', category: 'Chemicals & Solvents', material: 'ETP Sludge', purity: 68, quantity: 340, price: 185, transportRate: 2.79, active: true, createdAt: new Date() },
    { id: 'l33', companyName: 'SAIL (Rourkela Steel Plant)', companyId: 'c35', city: 'Rourkela', category: 'Chemicals & Solvents', material: 'ETP Sludge', purity: 75, quantity: 760, price: 205, transportRate: 2.62, active: true, createdAt: new Date() },
    { id: 'l34', companyName: 'JSW Steel Ltd (Ballari)', companyId: 'c31', city: 'Bellary', category: 'Chemicals & Solvents', material: 'ETP Sludge', purity: 61, quantity: 420, price: 345, transportRate: 2.21, active: true, createdAt: new Date() },
    { id: 'l35', companyName: 'Paradeep Phosphates Ltd', companyId: 'c11', city: 'Paradeep', category: 'Chemicals & Solvents', material: 'ETP Sludge', purity: 78, quantity: 620, price: 310, transportRate: 2.73, active: true, createdAt: new Date() },
    { id: 'l36', companyName: 'Somany Ceramics Ltd', companyId: 'c68', city: 'Ahmedabad', category: 'Chemicals & Solvents', material: 'ETP Sludge', purity: 67, quantity: 660, price: 100, transportRate: 2.05, active: true, createdAt: new Date() },
    { id: 'l37', companyName: 'Rajpur Petrochemicals', companyId: 'c21', city: 'Jodhpur', category: 'Chemicals & Solvents', material: 'ETP Sludge', purity: 73, quantity: 600, price: 350, transportRate: 2.72, active: true, createdAt: new Date() },
    { id: 'l38', companyName: 'Borosil Glass Works', companyId: 'c70', city: 'Bharuch', category: 'Chemicals & Solvents', material: 'ETP Sludge', purity: 76, quantity: 260, price: 375, transportRate: 2.2, active: true, createdAt: new Date() },
    { id: 'l39', companyName: 'CESC Budge Budge Plant', companyId: 'c45', city: 'Kolkata', category: 'Chemicals & Solvents', material: 'ETP Sludge', purity: 72, quantity: 900, price: 205, transportRate: 2.61, active: true, createdAt: new Date() },
    { id: 'l40', companyName: 'Supreme Industries Ltd', companyId: 'c74', city: 'Pune', category: 'Chemicals & Solvents', material: 'ETP Sludge', purity: 70, quantity: 600, price: 200, transportRate: 2.61, active: true, createdAt: new Date() },
    { id: 'l41', companyName: 'UltraTech Cement Ltd (Raipur)', companyId: 'c49', city: 'Raipur', category: 'Chemicals & Solvents', material: 'Red Mud', purity: 69, quantity: 2270, price: 2700, transportRate: 1.85, active: true, createdAt: new Date() },
    { id: 'l42', companyName: 'Reliance Industries Ltd', companyId: 'c23', city: 'Jamnagar', category: 'Chemicals & Solvents', material: 'Red Mud', purity: 72, quantity: 2490, price: 3350, transportRate: 1.79, active: true, createdAt: new Date() },
    { id: 'l43', companyName: 'Dahej Special Economic Zone', companyId: 'c22', city: 'Dahej', category: 'Chemicals & Solvents', material: 'Red Mud', purity: 75, quantity: 1520, price: 2450, transportRate: 1.64, active: true, createdAt: new Date() },
    { id: 'l44', companyName: 'JSW Steel Ltd (Ballari)', companyId: 'c31', city: 'Bellary', category: 'Chemicals & Solvents', material: 'Red Mud', purity: 67, quantity: 500, price: 3000, transportRate: 1.42, active: true, createdAt: new Date() },
    { id: 'l45', companyName: 'MRF Tyres Trichy Plant', companyId: 'c72', city: 'Chennai', category: 'Chemicals & Solvents', material: 'Red Mud', purity: 64, quantity: 1810, price: 3150, transportRate: 1.46, active: true, createdAt: new Date() },
    { id: 'l46', companyName: 'Parry Sugars Refinery', companyId: 'c56', city: 'Kochi', category: 'Chemicals & Solvents', material: 'Red Mud', purity: 75, quantity: 2410, price: 3250, transportRate: 1.76, active: true, createdAt: new Date() },
    { id: 'l47', companyName: 'Ramco Cements Salem Plant', companyId: 'c55', city: 'Salem', category: 'Chemicals & Solvents', material: 'Red Mud', purity: 62, quantity: 760, price: 2550, transportRate: 1.98, active: true, createdAt: new Date() },
    { id: 'l48', companyName: 'Godavari Biorefineries Ltd', companyId: 'c59', city: 'Sameerwadi', category: 'Chemicals & Solvents', material: 'Red Mud', purity: 70, quantity: 1790, price: 2100, transportRate: 1.4, active: true, createdAt: new Date() },
    { id: 'l49', companyName: 'Haldia Petrochemicals Ltd', companyId: 'c26', city: 'Haldia', category: 'Chemicals & Solvents', material: 'Red Mud', purity: 70, quantity: 2060, price: 3450, transportRate: 1.46, active: true, createdAt: new Date() },
    { id: 'l50', companyName: 'APGenco Thermal Plant', companyId: 'c46', city: 'Visakhapatnam', category: 'Chemicals & Solvents', material: 'Red Mud', purity: 62, quantity: 1480, price: 2800, transportRate: 1.75, active: true, createdAt: new Date() },
    { id: 'l51', companyName: 'Rajpur Petrochemicals', companyId: 'c21', city: 'Jodhpur', category: 'Chemicals & Solvents', material: 'Spent Solvents', purity: 88, quantity: 510, price: 15550, transportRate: 2.46, active: true, createdAt: new Date() },
    { id: 'l52', companyName: 'Kakinada Fertilizers (Coromandel)', companyId: 'c20', city: 'Visakhapatnam', category: 'Chemicals & Solvents', material: 'Spent Solvents', purity: 88, quantity: 210, price: 13000, transportRate: 2.26, active: true, createdAt: new Date() },
    { id: 'l53', companyName: 'Bengaluru Construction Cement', companyId: 'c47', city: 'Bengaluru', category: 'Chemicals & Solvents', material: 'Spent Solvents', purity: 94, quantity: 250, price: 13000, transportRate: 2.22, active: true, createdAt: new Date() },
    { id: 'l54', companyName: 'Tamil Chem & Acid Ltd', companyId: 'c2', city: 'Chennai', category: 'Chemicals & Solvents', material: 'Spent Solvents', purity: 90, quantity: 370, price: 14050, transportRate: 2.33, active: true, createdAt: new Date() },
    { id: 'l55', companyName: 'Adani Power Ltd (Mundra)', companyId: 'c43', city: 'Mundhra', category: 'Chemicals & Solvents', material: 'Spent Solvents', purity: 92, quantity: 540, price: 12300, transportRate: 2.52, active: true, createdAt: new Date() },
    { id: 'l56', companyName: 'UltraTech Cement Ltd (Raipur)', companyId: 'c49', city: 'Raipur', category: 'Chemicals & Solvents', material: 'Spent Solvents', purity: 90, quantity: 420, price: 15750, transportRate: 2.75, active: true, createdAt: new Date() },
    { id: 'l57', companyName: 'Haldia Petrochemicals Ltd', companyId: 'c26', city: 'Haldia', category: 'Chemicals & Solvents', material: 'Spent Solvents', purity: 91, quantity: 200, price: 13400, transportRate: 2.33, active: true, createdAt: new Date() },
    { id: 'l58', companyName: 'IOCL Refinery (Panipat)', companyId: 'c25', city: 'Panipat', category: 'Chemicals & Solvents', material: 'Spent Solvents', purity: 85, quantity: 120, price: 14000, transportRate: 2.72, active: true, createdAt: new Date() },
    { id: 'l59', companyName: 'Jamshedpur Steel Rolling', companyId: 'c30', city: 'Jamshedpur', category: 'Chemicals & Solvents', material: 'Spent Solvents', purity: 89, quantity: 130, price: 14750, transportRate: 2.5, active: true, createdAt: new Date() },
    { id: 'l60', companyName: 'Jindal Steel & Power Ltd', companyId: 'c38', city: 'Angul', category: 'Chemicals & Solvents', material: 'Spent Solvents', purity: 90, quantity: 390, price: 13700, transportRate: 2.44, active: true, createdAt: new Date() },
    { id: 'l61', companyName: 'Tata Chemicals Ltd', companyId: 'c10', city: 'Mithapur', category: 'Chemicals & Solvents', material: 'Pickling Acid', purity: 78, quantity: 470, price: 1250, transportRate: 2.1, active: true, createdAt: new Date() },
    { id: 'l62', companyName: 'Supreme Industries Ltd', companyId: 'c74', city: 'Pune', category: 'Chemicals & Solvents', material: 'Pickling Acid', purity: 85, quantity: 200, price: 960, transportRate: 1.91, active: true, createdAt: new Date() },
    { id: 'l63', companyName: 'SAIL (Bhilai Steel Plant)', companyId: 'c36', city: 'Bhilai', category: 'Chemicals & Solvents', material: 'Pickling Acid', purity: 75, quantity: 430, price: 1500, transportRate: 1.85, active: true, createdAt: new Date() },
    { id: 'l64', companyName: 'Dahej Special Economic Zone', companyId: 'c22', city: 'Dahej', category: 'Chemicals & Solvents', material: 'Pickling Acid', purity: 77, quantity: 320, price: 1100, transportRate: 1.92, active: true, createdAt: new Date() },
    { id: 'l65', companyName: 'Bodal Chemicals Ltd', companyId: 'c6', city: 'Ahmedabad', category: 'Chemicals & Solvents', material: 'Pickling Acid', purity: 76, quantity: 370, price: 845, transportRate: 1.74, active: true, createdAt: new Date() },
    { id: 'l66', companyName: 'West Coast Paper Mills', companyId: 'c64', city: 'Bellary', category: 'Chemicals & Solvents', material: 'Pickling Acid', purity: 82, quantity: 490, price: 900, transportRate: 1.97, active: true, createdAt: new Date() },
    { id: 'l67', companyName: 'E.I.D. Parry Ltd', companyId: 'c57', city: 'Nellikuppam', category: 'Chemicals & Solvents', material: 'Pickling Acid', purity: 77, quantity: 400, price: 1450, transportRate: 1.94, active: true, createdAt: new Date() },
    { id: 'l68', companyName: 'Atul Ltd (Vapi Plant)', companyId: 'c5', city: 'Vapi', category: 'Chemicals & Solvents', material: 'Pickling Acid', purity: 83, quantity: 430, price: 880, transportRate: 2.11, active: true, createdAt: new Date() },
    { id: 'l69', companyName: 'SAIL (Bokaro Steel Plant)', companyId: 'c37', city: 'Bokaro', category: 'Chemicals & Solvents', material: 'Pickling Acid', purity: 79, quantity: 300, price: 990, transportRate: 2.27, active: true, createdAt: new Date() },
    { id: 'l70', companyName: 'Kajaria Ceramics Ltd', companyId: 'c69', city: 'Delhi', category: 'Chemicals & Solvents', material: 'Pickling Acid', purity: 83, quantity: 390, price: 985, transportRate: 2.15, active: true, createdAt: new Date() },
    { id: 'l71', companyName: 'Kakinada Fertilizers (Coromandel)', companyId: 'c20', city: 'Visakhapatnam', category: 'Chemicals & Solvents', material: 'Spent Catalyst', purity: 85, quantity: 200, price: 135, transportRate: 2.6, active: true, createdAt: new Date() },
    { id: 'l72', companyName: 'IOCL Refinery (Panipat)', companyId: 'c25', city: 'Panipat', category: 'Chemicals & Solvents', material: 'Spent Catalyst', purity: 83, quantity: 150, price: 200, transportRate: 3.27, active: true, createdAt: new Date() },
    { id: 'l73', companyName: 'CESC Budge Budge Plant', companyId: 'c45', city: 'Kolkata', category: 'Chemicals & Solvents', material: 'Spent Catalyst', purity: 89, quantity: 180, price: 230, transportRate: 2.62, active: true, createdAt: new Date() },
    { id: 'l74', companyName: 'Balaji Amines Ltd', companyId: 'c16', city: 'Pune', category: 'Chemicals & Solvents', material: 'Spent Catalyst', purity: 87, quantity: 220, price: 255, transportRate: 2.7, active: true, createdAt: new Date() },
    { id: 'l75', companyName: 'Shree Cement Ltd', companyId: 'c52', city: 'Raipur', category: 'Chemicals & Solvents', material: 'Spent Catalyst', purity: 75, quantity: 170, price: 165, transportRate: 3.28, active: true, createdAt: new Date() },
    { id: 'l76', companyName: 'Triveni Sugars Plant', companyId: 'c58', city: 'Khatauli', category: 'Chemicals & Solvents', material: 'Spent Catalyst', purity: 78, quantity: 210, price: 215, transportRate: 3.08, active: true, createdAt: new Date() },
    { id: 'l77', companyName: 'Jindal Steel & Power Ltd', companyId: 'c38', city: 'Angul', category: 'Chemicals & Solvents', material: 'Spent Catalyst', purity: 75, quantity: 230, price: 190, transportRate: 2.82, active: true, createdAt: new Date() },
    { id: 'l78', companyName: 'GNFC Ltd', companyId: 'c7', city: 'Bharuch', category: 'Chemicals & Solvents', material: 'Spent Catalyst', purity: 72, quantity: 100, price: 150, transportRate: 3.07, active: true, createdAt: new Date() },
    { id: 'l79', companyName: 'NTPC Ltd (Vindhyachal)', companyId: 'c42', city: 'Korba', category: 'Chemicals & Solvents', material: 'Spent Catalyst', purity: 79, quantity: 180, price: 270, transportRate: 3.44, active: true, createdAt: new Date() },
    { id: 'l80', companyName: 'Tamil Chem & Acid Ltd', companyId: 'c2', city: 'Chennai', category: 'Chemicals & Solvents', material: 'Spent Catalyst', purity: 84, quantity: 130, price: 165, transportRate: 2.84, active: true, createdAt: new Date() },
    { id: 'l81', companyName: 'Hindustan Petroleum Corp Ltd', companyId: 'c28', city: 'Visakhapatnam', category: 'Metals & Mining', material: 'Blast Furnace Slag', purity: 88, quantity: 4800, price: 640, transportRate: 2.36, active: true, createdAt: new Date() },
    { id: 'l82', companyName: 'Grasim Industries Ltd', companyId: 'c12', city: 'Vilayat', category: 'Metals & Mining', material: 'Blast Furnace Slag', purity: 86, quantity: 2700, price: 890, transportRate: 1.85, active: true, createdAt: new Date() },
    { id: 'l83', companyName: 'Jamshedpur Steel Rolling', companyId: 'c30', city: 'Jamshedpur', category: 'Metals & Mining', material: 'Blast Furnace Slag', purity: 92, quantity: 4900, price: 520, transportRate: 1.98, active: true, createdAt: new Date() },
    { id: 'l84', companyName: 'Paradeep Phosphates Ltd', companyId: 'c11', city: 'Paradeep', category: 'Metals & Mining', material: 'Blast Furnace Slag', purity: 87, quantity: 4460, price: 735, transportRate: 2.17, active: true, createdAt: new Date() },
    { id: 'l85', companyName: 'Ambuja Cements Ltd', companyId: 'c50', city: 'Ahmedabad', category: 'Metals & Mining', material: 'Blast Furnace Slag', purity: 87, quantity: 1830, price: 825, transportRate: 2.36, active: true, createdAt: new Date() },
    { id: 'l86', companyName: 'ACC Cement Wadi Plant', companyId: 'c53', city: 'Bellary', category: 'Metals & Mining', material: 'Blast Furnace Slag', purity: 84, quantity: 2060, price: 705, transportRate: 1.64, active: true, createdAt: new Date() },
    { id: 'l87', companyName: 'E.I.D. Parry Ltd', companyId: 'c57', city: 'Nellikuppam', category: 'Metals & Mining', material: 'Blast Furnace Slag', purity: 91, quantity: 2670, price: 810, transportRate: 2.17, active: true, createdAt: new Date() },
    { id: 'l88', companyName: 'Dahej Special Economic Zone', companyId: 'c22', city: 'Dahej', category: 'Metals & Mining', material: 'Blast Furnace Slag', purity: 80, quantity: 2660, price: 795, transportRate: 1.69, active: true, createdAt: new Date() },
    { id: 'l89', companyName: 'Vedanta Ltd (Jharsuguda)', companyId: 'c34', city: 'Jharsuguda', category: 'Metals & Mining', material: 'Blast Furnace Slag', purity: 81, quantity: 4030, price: 505, transportRate: 1.6, active: true, createdAt: new Date() },
    { id: 'l90', companyName: 'Ceat Tyres Bhandup Plant', companyId: 'c73', city: 'Mumbai', category: 'Metals & Mining', material: 'Blast Furnace Slag', purity: 88, quantity: 1480, price: 705, transportRate: 1.52, active: true, createdAt: new Date() },
    { id: 'l91', companyName: 'Grasim Industries Ltd', companyId: 'c12', city: 'Vilayat', category: 'Metals & Mining', material: 'Mill Scale', purity: 95, quantity: 980, price: 5700, transportRate: 2.7, active: true, createdAt: new Date() },
    { id: 'l92', companyName: 'Tamil Chem & Acid Ltd', companyId: 'c2', city: 'Chennai', category: 'Metals & Mining', material: 'Mill Scale', purity: 97, quantity: 1250, price: 6400, transportRate: 2.69, active: true, createdAt: new Date() },
    { id: 'l93', companyName: 'Hindalco Industries Ltd', companyId: 'c33', city: 'Dahej', category: 'Metals & Mining', material: 'Mill Scale', purity: 95, quantity: 560, price: 5050, transportRate: 2.29, active: true, createdAt: new Date() },
    { id: 'l94', companyName: 'Saint-Gobain India Ltd', companyId: 'c66', city: 'Chennai', category: 'Metals & Mining', material: 'Mill Scale', purity: 91, quantity: 580, price: 5800, transportRate: 2.41, active: true, createdAt: new Date() },
    { id: 'l95', companyName: 'JSW Steel Ltd (Ballari)', companyId: 'c31', city: 'Bellary', category: 'Metals & Mining', material: 'Mill Scale', purity: 91, quantity: 880, price: 5750, transportRate: 2.74, active: true, createdAt: new Date() },
    { id: 'l96', companyName: 'Tata Steel Ltd', companyId: 'c32', city: 'Jamshedpur', category: 'Metals & Mining', material: 'Mill Scale', purity: 97, quantity: 1240, price: 5700, transportRate: 2.39, active: true, createdAt: new Date() },
    { id: 'l97', companyName: 'Paradeep Phosphates Ltd', companyId: 'c11', city: 'Paradeep', category: 'Metals & Mining', material: 'Mill Scale', purity: 91, quantity: 1030, price: 5450, transportRate: 2.62, active: true, createdAt: new Date() },
    { id: 'l98', companyName: 'Somany Ceramics Ltd', companyId: 'c68', city: 'Ahmedabad', category: 'Metals & Mining', material: 'Mill Scale', purity: 96, quantity: 670, price: 6400, transportRate: 2.64, active: true, createdAt: new Date() },
    { id: 'l99', companyName: 'Triveni Sugars Plant', companyId: 'c58', city: 'Khatauli', category: 'Metals & Mining', material: 'Mill Scale', purity: 91, quantity: 1200, price: 6400, transportRate: 2.11, active: true, createdAt: new Date() },
    { id: 'l100', companyName: 'Kakinada Fertilizers (Coromandel)', companyId: 'c20', city: 'Visakhapatnam', category: 'Metals & Mining', material: 'Mill Scale', purity: 97, quantity: 1370, price: 6300, transportRate: 2.66, active: true, createdAt: new Date() },
    { id: 'l101', companyName: 'Vedanta Ltd (Jharsuguda)', companyId: 'c34', city: 'Jharsuguda', category: 'Metals & Mining', material: 'Aluminium Dross', purity: 90, quantity: 780, price: 19600, transportRate: 2.61, active: true, createdAt: new Date() },
    { id: 'l102', companyName: 'APGenco Thermal Plant', companyId: 'c46', city: 'Visakhapatnam', category: 'Metals & Mining', material: 'Aluminium Dross', purity: 82, quantity: 680, price: 16900, transportRate: 2.97, active: true, createdAt: new Date() },
    { id: 'l103', companyName: 'JK Cement Nimbahera Plant', companyId: 'c54', city: 'Jodhpur', category: 'Metals & Mining', material: 'Aluminium Dross', purity: 89, quantity: 390, price: 16100, transportRate: 2.92, active: true, createdAt: new Date() },
    { id: 'l104', companyName: 'Balaji Amines Ltd', companyId: 'c16', city: 'Pune', category: 'Metals & Mining', material: 'Aluminium Dross', purity: 85, quantity: 340, price: 20250, transportRate: 2.66, active: true, createdAt: new Date() },
    { id: 'l105', companyName: 'United Phosphorous Ltd (UPL)', companyId: 'c9', city: 'Vapi', category: 'Metals & Mining', material: 'Aluminium Dross', purity: 88, quantity: 640, price: 21800, transportRate: 2.61, active: true, createdAt: new Date() },
    { id: 'l106', companyName: 'Aarti Industries Ltd', companyId: 'c4', city: 'Ankleshwar', category: 'Metals & Mining', material: 'Aluminium Dross', purity: 89, quantity: 640, price: 18850, transportRate: 2.53, active: true, createdAt: new Date() },
    { id: 'l107', companyName: 'Saint-Gobain India Ltd', companyId: 'c66', city: 'Chennai', category: 'Metals & Mining', material: 'Aluminium Dross', purity: 86, quantity: 640, price: 17650, transportRate: 2.79, active: true, createdAt: new Date() },
    { id: 'l108', companyName: 'Ramco Cements Salem Plant', companyId: 'c55', city: 'Salem', category: 'Metals & Mining', material: 'Aluminium Dross', purity: 87, quantity: 860, price: 19250, transportRate: 2.93, active: true, createdAt: new Date() },
    { id: 'l109', companyName: 'CESC Budge Budge Plant', companyId: 'c45', city: 'Kolkata', category: 'Metals & Mining', material: 'Aluminium Dross', purity: 80, quantity: 690, price: 18150, transportRate: 2.85, active: true, createdAt: new Date() },
    { id: 'l110', companyName: 'Somany Ceramics Ltd', companyId: 'c68', city: 'Ahmedabad', category: 'Metals & Mining', material: 'Aluminium Dross', purity: 83, quantity: 280, price: 21850, transportRate: 2.55, active: true, createdAt: new Date() },
    { id: 'l111', companyName: 'Jamshedpur Steel Rolling', companyId: 'c30', city: 'Jamshedpur', category: 'Metals & Mining', material: 'Copper Slag', purity: 93, quantity: 1700, price: 1100, transportRate: 1.95, active: true, createdAt: new Date() },
    { id: 'l112', companyName: 'Kakinada Fertilizers (Coromandel)', companyId: 'c20', city: 'Visakhapatnam', category: 'Metals & Mining', material: 'Copper Slag', purity: 92, quantity: 880, price: 780, transportRate: 1.72, active: true, createdAt: new Date() },
    { id: 'l113', companyName: 'Triveni Sugars Plant', companyId: 'c58', city: 'Khatauli', category: 'Metals & Mining', material: 'Copper Slag', purity: 86, quantity: 870, price: 1000, transportRate: 2.34, active: true, createdAt: new Date() },
    { id: 'l114', companyName: 'Haldia Petrochemicals Ltd', companyId: 'c26', city: 'Haldia', category: 'Metals & Mining', material: 'Copper Slag', purity: 85, quantity: 2300, price: 1000, transportRate: 1.66, active: true, createdAt: new Date() },
    { id: 'l115', companyName: 'Tata Chemicals Ltd', companyId: 'c10', city: 'Mithapur', category: 'Metals & Mining', material: 'Copper Slag', purity: 92, quantity: 2700, price: 920, transportRate: 1.66, active: true, createdAt: new Date() },
    { id: 'l116', companyName: 'JK Cement Nimbahera Plant', companyId: 'c54', city: 'Jodhpur', category: 'Metals & Mining', material: 'Copper Slag', purity: 90, quantity: 1650, price: 820, transportRate: 2.4, active: true, createdAt: new Date() },
    { id: 'l117', companyName: 'Borosil Glass Works', companyId: 'c70', city: 'Bharuch', category: 'Metals & Mining', material: 'Copper Slag', purity: 91, quantity: 2690, price: 765, transportRate: 1.83, active: true, createdAt: new Date() },
    { id: 'l118', companyName: 'Maharashtra Thermal Power', companyId: 'c41', city: 'Mumbai', category: 'Metals & Mining', material: 'Copper Slag', purity: 85, quantity: 970, price: 1100, transportRate: 1.65, active: true, createdAt: new Date() },
    { id: 'l119', companyName: 'IOCL Refinery (Panipat)', companyId: 'c25', city: 'Panipat', category: 'Metals & Mining', material: 'Copper Slag', purity: 92, quantity: 1500, price: 1150, transportRate: 2.12, active: true, createdAt: new Date() },
    { id: 'l120', companyName: 'MRF Tyres Trichy Plant', companyId: 'c72', city: 'Chennai', category: 'Metals & Mining', material: 'Copper Slag', purity: 92, quantity: 2520, price: 1150, transportRate: 1.68, active: true, createdAt: new Date() },
    { id: 'l121', companyName: 'Gujarat Fluorochemicals Ltd', companyId: 'c18', city: 'Dahej', category: 'Metals & Mining', material: 'Iron Sludge', purity: 88, quantity: 570, price: 1100, transportRate: 2.4, active: true, createdAt: new Date() },
    { id: 'l122', companyName: 'Saint-Gobain India Ltd', companyId: 'c66', city: 'Chennai', category: 'Metals & Mining', material: 'Iron Sludge', purity: 81, quantity: 580, price: 1000, transportRate: 1.91, active: true, createdAt: new Date() },
    { id: 'l123', companyName: 'Hindalco Renukoot Plant', companyId: 'c40', city: 'Renukoot', category: 'Metals & Mining', material: 'Iron Sludge', purity: 80, quantity: 470, price: 1000, transportRate: 2.2, active: true, createdAt: new Date() },
    { id: 'l124', companyName: 'Ceat Tyres Bhandup Plant', companyId: 'c73', city: 'Mumbai', category: 'Metals & Mining', material: 'Iron Sludge', purity: 85, quantity: 850, price: 995, transportRate: 2.04, active: true, createdAt: new Date() },
    { id: 'l125', companyName: 'Apollo Tyres Chennai Plant', companyId: 'c71', city: 'Chennai', category: 'Metals & Mining', material: 'Iron Sludge', purity: 84, quantity: 440, price: 1100, transportRate: 2.29, active: true, createdAt: new Date() },
    { id: 'l126', companyName: 'Maharashtra Thermal Power', companyId: 'c41', city: 'Mumbai', category: 'Metals & Mining', material: 'Iron Sludge', purity: 85, quantity: 1030, price: 1200, transportRate: 2.14, active: true, createdAt: new Date() },
    { id: 'l127', companyName: 'Vedanta Ltd (Jharsuguda)', companyId: 'c34', city: 'Jharsuguda', category: 'Metals & Mining', material: 'Iron Sludge', purity: 88, quantity: 940, price: 945, transportRate: 2.46, active: true, createdAt: new Date() },
    { id: 'l128', companyName: 'Dhampur Sugar Mills', companyId: 'c61', city: 'Khatauli', category: 'Metals & Mining', material: 'Iron Sludge', purity: 83, quantity: 1450, price: 1000, transportRate: 2.36, active: true, createdAt: new Date() },
    { id: 'l129', companyName: 'UltraTech Cement Ltd (Raipur)', companyId: 'c49', city: 'Raipur', category: 'Metals & Mining', material: 'Iron Sludge', purity: 88, quantity: 1420, price: 1000, transportRate: 2.36, active: true, createdAt: new Date() },
    { id: 'l130', companyName: 'JK Paper Ltd (Rayagada)', companyId: 'c62', city: 'Rayagada', category: 'Metals & Mining', material: 'Iron Sludge', purity: 86, quantity: 1460, price: 1150, transportRate: 2.02, active: true, createdAt: new Date() },
    { id: 'l131', companyName: 'CESC Budge Budge Plant', companyId: 'c45', city: 'Kolkata', category: 'Minerals & Construction', material: 'Fly Ash', purity: 83, quantity: 5820, price: 330, transportRate: 1.49, active: true, createdAt: new Date() },
    { id: 'l132', companyName: 'Chemfix Industries Ltd', companyId: 'c1', city: 'Surat', category: 'Minerals & Construction', material: 'Fly Ash', purity: 82, quantity: 3390, price: 360, transportRate: 1.37, active: true, createdAt: new Date() },
    { id: 'l133', companyName: 'Tata Steel Ltd', companyId: 'c32', city: 'Jamshedpur', category: 'Minerals & Construction', material: 'Fly Ash', purity: 89, quantity: 7470, price: 435, transportRate: 1.53, active: true, createdAt: new Date() },
    { id: 'l134', companyName: 'JK Paper Ltd (Rayagada)', companyId: 'c62', city: 'Rayagada', category: 'Minerals & Construction', material: 'Fly Ash', purity: 83, quantity: 5880, price: 395, transportRate: 1.63, active: true, createdAt: new Date() },
    { id: 'l135', companyName: 'Nirma Ltd (Chemical Division)', companyId: 'c14', city: 'Vadodara', category: 'Minerals & Construction', material: 'Fly Ash', purity: 86, quantity: 3260, price: 400, transportRate: 1.74, active: true, createdAt: new Date() },
    { id: 'l136', companyName: 'Alkyl Amines Chemicals Ltd', companyId: 'c17', city: 'Dahej', category: 'Minerals & Construction', material: 'Fly Ash', purity: 84, quantity: 4510, price: 375, transportRate: 1.5, active: true, createdAt: new Date() },
    { id: 'l137', companyName: 'Dalmia Cement Ltd', companyId: 'c51', city: 'Rourkela', category: 'Minerals & Construction', material: 'Fly Ash', purity: 82, quantity: 4740, price: 280, transportRate: 1.68, active: true, createdAt: new Date() },
    { id: 'l138', companyName: 'Maharashtra Thermal Power', companyId: 'c41', city: 'Mumbai', category: 'Minerals & Construction', material: 'Fly Ash', purity: 90, quantity: 4350, price: 310, transportRate: 1.55, active: true, createdAt: new Date() },
    { id: 'l139', companyName: 'Hindalco Renukoot Plant', companyId: 'c40', city: 'Renukoot', category: 'Minerals & Construction', material: 'Fly Ash', purity: 87, quantity: 7360, price: 420, transportRate: 1.22, active: true, createdAt: new Date() },
    { id: 'l140', companyName: 'Parry Sugars Refinery', companyId: 'c56', city: 'Kochi', category: 'Minerals & Construction', material: 'Fly Ash', purity: 90, quantity: 3170, price: 385, transportRate: 1.22, active: true, createdAt: new Date() },
    { id: 'l141', companyName: 'Tata Steel Ltd', companyId: 'c32', city: 'Jamshedpur', category: 'Minerals & Construction', material: 'Phosphogypsum', purity: 90, quantity: 1960, price: 600, transportRate: 2.02, active: true, createdAt: new Date() },
    { id: 'l142', companyName: 'Bengaluru Construction Cement', companyId: 'c47', city: 'Bengaluru', category: 'Minerals & Construction', material: 'Phosphogypsum', purity: 94, quantity: 1860, price: 645, transportRate: 1.9, active: true, createdAt: new Date() },
    { id: 'l143', companyName: 'NALCO Smelter Plant', companyId: 'c39', city: 'Angul', category: 'Minerals & Construction', material: 'Phosphogypsum', purity: 93, quantity: 3390, price: 580, transportRate: 1.95, active: true, createdAt: new Date() },
    { id: 'l144', companyName: 'Jamshedpur Steel Rolling', companyId: 'c30', city: 'Jamshedpur', category: 'Minerals & Construction', material: 'Phosphogypsum', purity: 94, quantity: 3990, price: 555, transportRate: 1.48, active: true, createdAt: new Date() },
    { id: 'l145', companyName: 'Parry Sugars Refinery', companyId: 'c56', city: 'Kochi', category: 'Minerals & Construction', material: 'Phosphogypsum', purity: 90, quantity: 1590, price: 725, transportRate: 1.64, active: true, createdAt: new Date() },
    { id: 'l146', companyName: 'Bharat Petroleum Corp Ltd', companyId: 'c27', city: 'Mumbai', category: 'Minerals & Construction', material: 'Phosphogypsum', purity: 95, quantity: 2960, price: 470, transportRate: 1.91, active: true, createdAt: new Date() },
    { id: 'l147', companyName: 'Mangalore Refinery & Petrochemicals', companyId: 'c24', city: 'Mangalore', category: 'Minerals & Construction', material: 'Phosphogypsum', purity: 92, quantity: 2880, price: 625, transportRate: 1.53, active: true, createdAt: new Date() },
    { id: 'l148', companyName: 'Balaji Amines Ltd', companyId: 'c15', city: 'Pune', category: 'Minerals & Construction', material: 'Phosphogypsum', purity: 96, quantity: 2800, price: 480, transportRate: 2.1, active: true, createdAt: new Date() },
    { id: 'l149', companyName: 'Ambuja Cements Ltd', companyId: 'c50', city: 'Ahmedabad', category: 'Minerals & Construction', material: 'Phosphogypsum', purity: 96, quantity: 3160, price: 650, transportRate: 2.09, active: true, createdAt: new Date() },
    { id: 'l150', companyName: 'DCM Shriram Ltd', companyId: 'c13', city: 'Kota', category: 'Minerals & Construction', material: 'Phosphogypsum', purity: 94, quantity: 1170, price: 495, transportRate: 1.68, active: true, createdAt: new Date() },
    { id: 'l151', companyName: 'Godavari Biorefineries Ltd', companyId: 'c59', city: 'Sameerwadi', category: 'Minerals & Construction', material: 'Silica Fume', purity: 91, quantity: 240, price: 16200, transportRate: 2.31, active: true, createdAt: new Date() },
    { id: 'l152', companyName: 'Adani Power Ltd (Mundra)', companyId: 'c43', city: 'Mundhra', category: 'Minerals & Construction', material: 'Silica Fume', purity: 89, quantity: 220, price: 17050, transportRate: 2.03, active: true, createdAt: new Date() },
    { id: 'l153', companyName: 'MRF Tyres Trichy Plant', companyId: 'c72', city: 'Chennai', category: 'Minerals & Construction', material: 'Silica Fume', purity: 93, quantity: 430, price: 16550, transportRate: 1.91, active: true, createdAt: new Date() },
    { id: 'l154', companyName: 'NTPC Ltd (Ramagundam)', companyId: 'c44', city: 'Ramagundam', category: 'Minerals & Construction', material: 'Silica Fume', purity: 91, quantity: 550, price: 14200, transportRate: 2.51, active: true, createdAt: new Date() },
    { id: 'l155', companyName: 'Dahej Special Economic Zone', companyId: 'c22', city: 'Dahej', category: 'Minerals & Construction', material: 'Silica Fume', purity: 93, quantity: 370, price: 14050, transportRate: 2.09, active: true, createdAt: new Date() },
    { id: 'l156', companyName: 'Gujarat Fluorochemicals Ltd', companyId: 'c18', city: 'Dahej', category: 'Minerals & Construction', material: 'Silica Fume', purity: 94, quantity: 480, price: 14200, transportRate: 1.96, active: true, createdAt: new Date() },
    { id: 'l157', companyName: 'Ambuja Cements Ltd', companyId: 'c50', city: 'Ahmedabad', category: 'Minerals & Construction', material: 'Silica Fume', purity: 94, quantity: 140, price: 16950, transportRate: 2.54, active: true, createdAt: new Date() },
    { id: 'l158', companyName: 'ACC Cement Wadi Plant', companyId: 'c53', city: 'Bellary', category: 'Minerals & Construction', material: 'Silica Fume', purity: 89, quantity: 480, price: 17000, transportRate: 2.03, active: true, createdAt: new Date() },
    { id: 'l159', companyName: 'Mangalore Refinery & Petrochemicals', companyId: 'c24', city: 'Mangalore', category: 'Minerals & Construction', material: 'Silica Fume', purity: 91, quantity: 100, price: 15250, transportRate: 2.38, active: true, createdAt: new Date() },
    { id: 'l160', companyName: 'Rajpur Petrochemicals', companyId: 'c21', city: 'Jodhpur', category: 'Minerals & Construction', material: 'Silica Fume', purity: 93, quantity: 170, price: 16750, transportRate: 2.4, active: true, createdAt: new Date() },
    { id: 'l161', companyName: 'Nirma Ltd (Chemical Division)', companyId: 'c14', city: 'Vadodara', category: 'Minerals & Construction', material: 'Bottom Ash', purity: 90, quantity: 1070, price: 215, transportRate: 1.11, active: true, createdAt: new Date() },
    { id: 'l162', companyName: 'GSFC Ltd', companyId: 'c8', city: 'Vadodara', category: 'Minerals & Construction', material: 'Bottom Ash', purity: 92, quantity: 1920, price: 290, transportRate: 1.26, active: true, createdAt: new Date() },
    { id: 'l163', companyName: 'Gujarat Fluorochemicals Ltd', companyId: 'c18', city: 'Dahej', category: 'Minerals & Construction', material: 'Bottom Ash', purity: 91, quantity: 3130, price: 220, transportRate: 1.4, active: true, createdAt: new Date() },
    { id: 'l164', companyName: 'Hindalco Industries Ltd', companyId: 'c33', city: 'Dahej', category: 'Minerals & Construction', material: 'Bottom Ash', purity: 92, quantity: 1990, price: 240, transportRate: 1.34, active: true, createdAt: new Date() },
    { id: 'l165', companyName: 'NTPC Ltd (Vindhyachal)', companyId: 'c42', city: 'Korba', category: 'Minerals & Construction', material: 'Bottom Ash', purity: 90, quantity: 3280, price: 210, transportRate: 1.58, active: true, createdAt: new Date() },
    { id: 'l166', companyName: 'Bodal Chemicals Ltd', companyId: 'c6', city: 'Ahmedabad', category: 'Minerals & Construction', material: 'Bottom Ash', purity: 94, quantity: 1940, price: 245, transportRate: 1.48, active: true, createdAt: new Date() },
    { id: 'l167', companyName: 'Godavari Biorefineries Ltd', companyId: 'c59', city: 'Sameerwadi', category: 'Minerals & Construction', material: 'Bottom Ash', purity: 93, quantity: 3740, price: 285, transportRate: 1.49, active: true, createdAt: new Date() },
    { id: 'l168', companyName: 'Atul Ltd (Vapi Plant)', companyId: 'c5', city: 'Vapi', category: 'Minerals & Construction', material: 'Bottom Ash', purity: 89, quantity: 1150, price: 170, transportRate: 1.55, active: true, createdAt: new Date() },
    { id: 'l169', companyName: 'SAIL (Bokaro Steel Plant)', companyId: 'c37', city: 'Bokaro', category: 'Minerals & Construction', material: 'Bottom Ash', purity: 88, quantity: 3830, price: 265, transportRate: 1.33, active: true, createdAt: new Date() },
    { id: 'l170', companyName: 'ITC Paperboards Kovai', companyId: 'c65', city: 'Salem', category: 'Minerals & Construction', material: 'Bottom Ash', purity: 89, quantity: 2350, price: 285, transportRate: 1.21, active: true, createdAt: new Date() },
    { id: 'l171', companyName: 'Jindal Steel & Power Ltd', companyId: 'c38', city: 'Angul', category: 'Biomass & Organic', material: 'Bagasse', purity: 81, quantity: 1060, price: 2600, transportRate: 2.72, active: true, createdAt: new Date() },
    { id: 'l172', companyName: 'Coromandel International Ltd', companyId: 'c19', city: 'Visakhapatnam', category: 'Biomass & Organic', material: 'Bagasse', purity: 82, quantity: 2130, price: 3000, transportRate: 2.33, active: true, createdAt: new Date() },
    { id: 'l173', companyName: 'Apollo Tyres Chennai Plant', companyId: 'c71', city: 'Chennai', category: 'Biomass & Organic', material: 'Bagasse', purity: 84, quantity: 3950, price: 3400, transportRate: 2.58, active: true, createdAt: new Date() },
    { id: 'l174', companyName: 'United Phosphorous Ltd (UPL)', companyId: 'c9', city: 'Vapi', category: 'Biomass & Organic', material: 'Bagasse', purity: 85, quantity: 1750, price: 3550, transportRate: 2.09, active: true, createdAt: new Date() },
    { id: 'l175', companyName: 'Reliance Industries Ltd', companyId: 'c23', city: 'Jamnagar', category: 'Biomass & Organic', material: 'Bagasse', purity: 83, quantity: 3410, price: 3100, transportRate: 2.73, active: true, createdAt: new Date() },
    { id: 'l176', companyName: 'APGenco Thermal Plant', companyId: 'c46', city: 'Visakhapatnam', category: 'Biomass & Organic', material: 'Bagasse', purity: 81, quantity: 1840, price: 3700, transportRate: 2.48, active: true, createdAt: new Date() },
    { id: 'l177', companyName: 'Tata Steel Ltd', companyId: 'c32', city: 'Jamshedpur', category: 'Biomass & Organic', material: 'Bagasse', purity: 83, quantity: 2000, price: 3300, transportRate: 2.31, active: true, createdAt: new Date() },
    { id: 'l178', companyName: 'NALCO Smelter Plant', companyId: 'c39', city: 'Angul', category: 'Biomass & Organic', material: 'Bagasse', purity: 76, quantity: 3720, price: 3250, transportRate: 2.33, active: true, createdAt: new Date() },
    { id: 'l179', companyName: 'Gujarat Fluorochemicals Ltd', companyId: 'c18', city: 'Dahej', category: 'Biomass & Organic', material: 'Bagasse', purity: 81, quantity: 1420, price: 3100, transportRate: 2.51, active: true, createdAt: new Date() },
    { id: 'l180', companyName: 'SAIL (Bokaro Steel Plant)', companyId: 'c37', city: 'Bokaro', category: 'Biomass & Organic', material: 'Bagasse', purity: 79, quantity: 3150, price: 2900, transportRate: 2.79, active: true, createdAt: new Date() },
    { id: 'l181', companyName: 'Asahi India Glass (AIS)', companyId: 'c67', city: 'Delhi', category: 'Biomass & Organic', material: 'Rice Husk Ash', purity: 82, quantity: 1780, price: 1950, transportRate: 2.37, active: true, createdAt: new Date() },
    { id: 'l182', companyName: 'Kakinada Fertilizers (Coromandel)', companyId: 'c20', city: 'Visakhapatnam', category: 'Biomass & Organic', material: 'Rice Husk Ash', purity: 83, quantity: 1380, price: 2200, transportRate: 2.09, active: true, createdAt: new Date() },
    { id: 'l183', companyName: 'APGenco Thermal Plant', companyId: 'c46', city: 'Visakhapatnam', category: 'Biomass & Organic', material: 'Rice Husk Ash', purity: 88, quantity: 1440, price: 1850, transportRate: 2.46, active: true, createdAt: new Date() },
    { id: 'l184', companyName: 'Hindalco Renukoot Plant', companyId: 'c40', city: 'Renukoot', category: 'Biomass & Organic', material: 'Rice Husk Ash', purity: 80, quantity: 1630, price: 2600, transportRate: 2.3, active: true, createdAt: new Date() },
    { id: 'l185', companyName: 'Somany Ceramics Ltd', companyId: 'c68', city: 'Ahmedabad', category: 'Biomass & Organic', material: 'Rice Husk Ash', purity: 83, quantity: 1440, price: 1950, transportRate: 1.85, active: true, createdAt: new Date() },
    { id: 'l186', companyName: 'Hindustan Petroleum Corp Ltd', companyId: 'c28', city: 'Visakhapatnam', category: 'Biomass & Organic', material: 'Rice Husk Ash', purity: 83, quantity: 1490, price: 2100, transportRate: 2.42, active: true, createdAt: new Date() },
    { id: 'l187', companyName: 'GSFC Ltd', companyId: 'c8', city: 'Vadodara', category: 'Biomass & Organic', material: 'Rice Husk Ash', purity: 80, quantity: 1190, price: 2150, transportRate: 2.26, active: true, createdAt: new Date() },
    { id: 'l188', companyName: 'Bodal Chemicals Ltd', companyId: 'c6', city: 'Ahmedabad', category: 'Biomass & Organic', material: 'Rice Husk Ash', purity: 82, quantity: 1340, price: 1950, transportRate: 2.24, active: true, createdAt: new Date() },
    { id: 'l189', companyName: 'JSW Steel Ltd (Ballari)', companyId: 'c31', city: 'Bellary', category: 'Biomass & Organic', material: 'Rice Husk Ash', purity: 84, quantity: 730, price: 1950, transportRate: 2.28, active: true, createdAt: new Date() },
    { id: 'l190', companyName: 'Vizag Iron & Steel Co', companyId: 'c29', city: 'Visakhapatnam', category: 'Biomass & Organic', material: 'Rice Husk Ash', purity: 83, quantity: 1680, price: 2300, transportRate: 2.34, active: true, createdAt: new Date() },
    { id: 'l191', companyName: 'Hindalco Renukoot Plant', companyId: 'c40', city: 'Renukoot', category: 'Biomass & Organic', material: 'Oil Sludge', purity: 79, quantity: 750, price: 3950, transportRate: 2.47, active: true, createdAt: new Date() },
    { id: 'l192', companyName: 'E.I.D. Parry Ltd', companyId: 'c57', city: 'Nellikuppam', category: 'Biomass & Organic', material: 'Oil Sludge', purity: 73, quantity: 880, price: 5400, transportRate: 2.67, active: true, createdAt: new Date() },
    { id: 'l193', companyName: 'Ambuja Cements Ltd', companyId: 'c50', city: 'Ahmedabad', category: 'Biomass & Organic', material: 'Oil Sludge', purity: 70, quantity: 1060, price: 5000, transportRate: 2.84, active: true, createdAt: new Date() },
    { id: 'l194', companyName: 'NTPC Ltd (Vindhyachal)', companyId: 'c42', city: 'Korba', category: 'Biomass & Organic', material: 'Oil Sludge', purity: 75, quantity: 620, price: 4650, transportRate: 2.4, active: true, createdAt: new Date() },
    { id: 'l195', companyName: 'SAIL (Bokaro Steel Plant)', companyId: 'c37', city: 'Bokaro', category: 'Biomass & Organic', material: 'Oil Sludge', purity: 80, quantity: 1100, price: 5150, transportRate: 2.57, active: true, createdAt: new Date() },
    { id: 'l196', companyName: 'Supreme Industries Ltd', companyId: 'c74', city: 'Pune', category: 'Biomass & Organic', material: 'Oil Sludge', purity: 67, quantity: 710, price: 3600, transportRate: 2.51, active: true, createdAt: new Date() },
    { id: 'l197', companyName: 'Atul Ltd (Vapi Plant)', companyId: 'c5', city: 'Vapi', category: 'Biomass & Organic', material: 'Oil Sludge', purity: 69, quantity: 580, price: 4700, transportRate: 2.74, active: true, createdAt: new Date() },
    { id: 'l198', companyName: 'APGenco Thermal Plant', companyId: 'c46', city: 'Visakhapatnam', category: 'Biomass & Organic', material: 'Oil Sludge', purity: 71, quantity: 1020, price: 5400, transportRate: 2.3, active: true, createdAt: new Date() },
    { id: 'l199', companyName: 'Alkyl Amines Chemicals Ltd', companyId: 'c17', city: 'Dahej', category: 'Biomass & Organic', material: 'Oil Sludge', purity: 74, quantity: 1170, price: 4000, transportRate: 2.59, active: true, createdAt: new Date() },
    { id: 'l200', companyName: 'DCM Shriram Ltd', companyId: 'c13', city: 'Kota', category: 'Biomass & Organic', material: 'Oil Sludge', purity: 69, quantity: 690, price: 5000, transportRate: 2.64, active: true, createdAt: new Date() },
    { id: 'l201', companyName: 'Bengaluru Construction Cement', companyId: 'c47', city: 'Bengaluru', category: 'Biomass & Organic', material: 'Press Mud', purity: 83, quantity: 1680, price: 865, transportRate: 1.72, active: true, createdAt: new Date() },
    { id: 'l202', companyName: 'Paradeep Phosphates Ltd', companyId: 'c11', city: 'Paradeep', category: 'Biomass & Organic', material: 'Press Mud', purity: 87, quantity: 2360, price: 1050, transportRate: 2.05, active: true, createdAt: new Date() },
    { id: 'l203', companyName: 'Atul Ltd (Vapi Plant)', companyId: 'c5', city: 'Vapi', category: 'Biomass & Organic', material: 'Press Mud', purity: 87, quantity: 2210, price: 870, transportRate: 1.83, active: true, createdAt: new Date() },
    { id: 'l204', companyName: 'ITC Paperboards Kovai', companyId: 'c65', city: 'Salem', category: 'Biomass & Organic', material: 'Press Mud', purity: 89, quantity: 1620, price: 850, transportRate: 1.99, active: true, createdAt: new Date() },
    { id: 'l205', companyName: 'Tata Chemicals Ltd', companyId: 'c10', city: 'Mithapur', category: 'Biomass & Organic', material: 'Press Mud', purity: 86, quantity: 1330, price: 975, transportRate: 2.07, active: true, createdAt: new Date() },
    { id: 'l206', companyName: 'West Coast Paper Mills', companyId: 'c64', city: 'Bellary', category: 'Biomass & Organic', material: 'Press Mud', purity: 80, quantity: 1290, price: 960, transportRate: 2.07, active: true, createdAt: new Date() },
    { id: 'l207', companyName: 'Somany Ceramics Ltd', companyId: 'c68', city: 'Ahmedabad', category: 'Biomass & Organic', material: 'Press Mud', purity: 83, quantity: 1690, price: 920, transportRate: 2.08, active: true, createdAt: new Date() },
    { id: 'l208', companyName: 'Grasim Industries Ltd', companyId: 'c12', city: 'Vilayat', category: 'Biomass & Organic', material: 'Press Mud', purity: 84, quantity: 2390, price: 895, transportRate: 1.63, active: true, createdAt: new Date() },
    { id: 'l209', companyName: 'Bharat Petroleum Corp Ltd', companyId: 'c27', city: 'Mumbai', category: 'Biomass & Organic', material: 'Press Mud', purity: 80, quantity: 2240, price: 805, transportRate: 2.18, active: true, createdAt: new Date() },
    { id: 'l210', companyName: 'SAIL (Bokaro Steel Plant)', companyId: 'c37', city: 'Bokaro', category: 'Biomass & Organic', material: 'Press Mud', purity: 88, quantity: 2150, price: 930, transportRate: 1.92, active: true, createdAt: new Date() },
    { id: 'l211', companyName: 'APGenco Thermal Plant', companyId: 'c46', city: 'Visakhapatnam', category: 'Paper & Cellulose', material: 'Lime Sludge', purity: 89, quantity: 1910, price: 560, transportRate: 1.64, active: true, createdAt: new Date() },
    { id: 'l212', companyName: 'Jamshedpur Steel Rolling', companyId: 'c30', city: 'Jamshedpur', category: 'Paper & Cellulose', material: 'Lime Sludge', purity: 84, quantity: 2420, price: 575, transportRate: 1.84, active: true, createdAt: new Date() },
    { id: 'l213', companyName: 'JK Cement Nimbahera Plant', companyId: 'c54', city: 'Jodhpur', category: 'Paper & Cellulose', material: 'Lime Sludge', purity: 87, quantity: 1200, price: 415, transportRate: 1.96, active: true, createdAt: new Date() },
    { id: 'l214', companyName: 'Balrampur Chini Mills', companyId: 'c60', city: 'Lucknow', category: 'Paper & Cellulose', material: 'Lime Sludge', purity: 85, quantity: 2160, price: 610, transportRate: 1.43, active: true, createdAt: new Date() },
    { id: 'l215', companyName: 'Gujarat Fluorochemicals Ltd', companyId: 'c18', city: 'Dahej', category: 'Paper & Cellulose', material: 'Lime Sludge', purity: 90, quantity: 1560, price: 570, transportRate: 1.86, active: true, createdAt: new Date() },
    { id: 'l216', companyName: 'Ceat Tyres Bhandup Plant', companyId: 'c73', city: 'Mumbai', category: 'Paper & Cellulose', material: 'Lime Sludge', purity: 80, quantity: 800, price: 520, transportRate: 1.49, active: true, createdAt: new Date() },
    { id: 'l217', companyName: 'Haldia Petrochemicals Ltd', companyId: 'c26', city: 'Haldia', category: 'Paper & Cellulose', material: 'Lime Sludge', purity: 85, quantity: 1100, price: 595, transportRate: 1.47, active: true, createdAt: new Date() },
    { id: 'l218', companyName: 'SAIL (Rourkela Steel Plant)', companyId: 'c35', city: 'Rourkela', category: 'Paper & Cellulose', material: 'Lime Sludge', purity: 89, quantity: 1840, price: 480, transportRate: 1.84, active: true, createdAt: new Date() },
    { id: 'l219', companyName: 'NALCO Smelter Plant', companyId: 'c39', city: 'Angul', category: 'Paper & Cellulose', material: 'Lime Sludge', purity: 87, quantity: 1400, price: 635, transportRate: 1.62, active: true, createdAt: new Date() },
    { id: 'l220', companyName: 'United Phosphorous Ltd (UPL)', companyId: 'c9', city: 'Vapi', category: 'Paper & Cellulose', material: 'Lime Sludge', purity: 83, quantity: 2060, price: 505, transportRate: 1.64, active: true, createdAt: new Date() },
    { id: 'l221', companyName: 'Balaji Amines Ltd', companyId: 'c15', city: 'Pune', category: 'Paper & Cellulose', material: 'Black Liquor Residue', purity: 80, quantity: 340, price: 3150, transportRate: 2.11, active: true, createdAt: new Date() },
    { id: 'l222', companyName: 'NTPC Ltd (Vindhyachal)', companyId: 'c42', city: 'Korba', category: 'Paper & Cellulose', material: 'Black Liquor Residue', purity: 79, quantity: 590, price: 2800, transportRate: 2.11, active: true, createdAt: new Date() },
    { id: 'l223', companyName: 'Aarti Industries Ltd', companyId: 'c4', city: 'Ankleshwar', category: 'Paper & Cellulose', material: 'Black Liquor Residue', purity: 79, quantity: 600, price: 2750, transportRate: 2.12, active: true, createdAt: new Date() },
    { id: 'l224', companyName: 'Vedanta Ltd (Jharsuguda)', companyId: 'c34', city: 'Jharsuguda', category: 'Paper & Cellulose', material: 'Black Liquor Residue', purity: 75, quantity: 680, price: 2700, transportRate: 2.29, active: true, createdAt: new Date() },
    { id: 'l225', companyName: 'Tata Steel Ltd', companyId: 'c32', city: 'Jamshedpur', category: 'Paper & Cellulose', material: 'Black Liquor Residue', purity: 77, quantity: 300, price: 3000, transportRate: 1.93, active: true, createdAt: new Date() },
    { id: 'l226', companyName: 'Somany Ceramics Ltd', companyId: 'c68', city: 'Ahmedabad', category: 'Paper & Cellulose', material: 'Black Liquor Residue', purity: 77, quantity: 870, price: 2950, transportRate: 2.35, active: true, createdAt: new Date() },
    { id: 'l227', companyName: 'Alkyl Amines Chemicals Ltd', companyId: 'c17', city: 'Dahej', category: 'Paper & Cellulose', material: 'Black Liquor Residue', purity: 75, quantity: 390, price: 2950, transportRate: 1.94, active: true, createdAt: new Date() },
    { id: 'l228', companyName: 'DCM Shriram Ltd', companyId: 'c13', city: 'Kota', category: 'Paper & Cellulose', material: 'Black Liquor Residue', purity: 78, quantity: 360, price: 2650, transportRate: 2.41, active: true, createdAt: new Date() },
    { id: 'l229', companyName: 'Asahi India Glass (AIS)', companyId: 'c67', city: 'Delhi', category: 'Paper & Cellulose', material: 'Black Liquor Residue', purity: 78, quantity: 450, price: 3150, transportRate: 2.56, active: true, createdAt: new Date() },
    { id: 'l230', companyName: 'JSW Steel Ltd (Ballari)', companyId: 'c31', city: 'Bellary', category: 'Paper & Cellulose', material: 'Black Liquor Residue', purity: 78, quantity: 330, price: 2950, transportRate: 2.31, active: true, createdAt: new Date() },
    { id: 'l231', companyName: 'Tata Chemicals Ltd', companyId: 'c10', city: 'Mithapur', category: 'Paper & Cellulose', material: 'Cellulose Fiber Fines', purity: 90, quantity: 270, price: 2150, transportRate: 1.86, active: true, createdAt: new Date() },
    { id: 'l232', companyName: 'Maharashtra Thermal Power', companyId: 'c41', city: 'Mumbai', category: 'Paper & Cellulose', material: 'Cellulose Fiber Fines', purity: 93, quantity: 510, price: 2050, transportRate: 2.11, active: true, createdAt: new Date() },
    { id: 'l233', companyName: 'Parry Sugars Refinery', companyId: 'c56', city: 'Kochi', category: 'Paper & Cellulose', material: 'Cellulose Fiber Fines', purity: 88, quantity: 560, price: 2050, transportRate: 1.98, active: true, createdAt: new Date() },
    { id: 'l234', companyName: 'NTPC Ltd (Vindhyachal)', companyId: 'c42', city: 'Korba', category: 'Paper & Cellulose', material: 'Cellulose Fiber Fines', purity: 90, quantity: 380, price: 2100, transportRate: 1.9, active: true, createdAt: new Date() },
    { id: 'l235', companyName: 'UltraTech Cement Ltd (Raipur)', companyId: 'c49', city: 'Raipur', category: 'Paper & Cellulose', material: 'Cellulose Fiber Fines', purity: 92, quantity: 500, price: 2300, transportRate: 2.24, active: true, createdAt: new Date() },
    { id: 'l236', companyName: 'Vedanta Ltd (Jharsuguda)', companyId: 'c34', city: 'Jharsuguda', category: 'Paper & Cellulose', material: 'Cellulose Fiber Fines', purity: 95, quantity: 490, price: 1650, transportRate: 2.21, active: true, createdAt: new Date() },
    { id: 'l237', companyName: 'Apollo Tyres Chennai Plant', companyId: 'c71', city: 'Chennai', category: 'Paper & Cellulose', material: 'Cellulose Fiber Fines', purity: 95, quantity: 560, price: 1550, transportRate: 1.9, active: true, createdAt: new Date() },
    { id: 'l238', companyName: 'Hindalco Renukoot Plant', companyId: 'c40', city: 'Renukoot', category: 'Paper & Cellulose', material: 'Cellulose Fiber Fines', purity: 95, quantity: 660, price: 2300, transportRate: 1.82, active: true, createdAt: new Date() },
    { id: 'l239', companyName: 'SAIL (Rourkela Steel Plant)', companyId: 'c35', city: 'Rourkela', category: 'Paper & Cellulose', material: 'Cellulose Fiber Fines', purity: 91, quantity: 420, price: 1800, transportRate: 1.98, active: true, createdAt: new Date() },
    { id: 'l240', companyName: 'West Coast Paper Mills', companyId: 'c64', city: 'Bellary', category: 'Paper & Cellulose', material: 'Cellulose Fiber Fines', purity: 94, quantity: 710, price: 2000, transportRate: 1.88, active: true, createdAt: new Date() },
    { id: 'l241', companyName: 'Coromandel International Ltd', companyId: 'c19', city: 'Visakhapatnam', category: 'Paper & Cellulose', material: 'Pulp Mill Grit', purity: 79, quantity: 1070, price: 375, transportRate: 1.86, active: true, createdAt: new Date() },
    { id: 'l242', companyName: 'Deepak Nitrite Ltd', companyId: 'c3', city: 'Vadodara', category: 'Paper & Cellulose', material: 'Pulp Mill Grit', purity: 85, quantity: 990, price: 395, transportRate: 2.14, active: true, createdAt: new Date() },
    { id: 'l243', companyName: 'ITC Paperboards Kovai', companyId: 'c65', city: 'Salem', category: 'Paper & Cellulose', material: 'Pulp Mill Grit', purity: 85, quantity: 530, price: 245, transportRate: 1.73, active: true, createdAt: new Date() },
    { id: 'l244', companyName: 'Dhampur Sugar Mills', companyId: 'c61', city: 'Khatauli', category: 'Paper & Cellulose', material: 'Pulp Mill Grit', purity: 82, quantity: 740, price: 415, transportRate: 2.2, active: true, createdAt: new Date() },
    { id: 'l245', companyName: 'Reliance Industries Ltd', companyId: 'c23', city: 'Jamnagar', category: 'Paper & Cellulose', material: 'Pulp Mill Grit', purity: 80, quantity: 560, price: 325, transportRate: 2.01, active: true, createdAt: new Date() },
    { id: 'l246', companyName: 'E.I.D. Parry Ltd', companyId: 'c57', city: 'Nellikuppam', category: 'Paper & Cellulose', material: 'Pulp Mill Grit', purity: 85, quantity: 810, price: 360, transportRate: 1.92, active: true, createdAt: new Date() },
    { id: 'l247', companyName: 'Jindal Steel & Power Ltd', companyId: 'c38', city: 'Angul', category: 'Paper & Cellulose', material: 'Pulp Mill Grit', purity: 78, quantity: 590, price: 265, transportRate: 2.12, active: true, createdAt: new Date() },
    { id: 'l248', companyName: 'United Phosphorous Ltd (UPL)', companyId: 'c9', city: 'Vapi', category: 'Paper & Cellulose', material: 'Pulp Mill Grit', purity: 83, quantity: 610, price: 395, transportRate: 1.71, active: true, createdAt: new Date() },
    { id: 'l249', companyName: 'NALCO Smelter Plant', companyId: 'c39', city: 'Angul', category: 'Paper & Cellulose', material: 'Pulp Mill Grit', purity: 87, quantity: 530, price: 420, transportRate: 1.61, active: true, createdAt: new Date() },
    { id: 'l250', companyName: 'SAIL (Bokaro Steel Plant)', companyId: 'c37', city: 'Bokaro', category: 'Paper & Cellulose', material: 'Pulp Mill Grit', purity: 83, quantity: 890, price: 315, transportRate: 2.15, active: true, createdAt: new Date() },
    { id: 'l251', companyName: 'CESC Budge Budge Plant', companyId: 'c45', city: 'Kolkata', category: 'Glass & Ceramics', material: 'Cullet Residue', purity: 98, quantity: 450, price: 5300, transportRate: 2.28, active: true, createdAt: new Date() },
    { id: 'l252', companyName: 'Vizag Iron & Steel Co', companyId: 'c29', city: 'Visakhapatnam', category: 'Glass & Ceramics', material: 'Cullet Residue', purity: 96, quantity: 540, price: 5750, transportRate: 1.92, active: true, createdAt: new Date() },
    { id: 'l253', companyName: 'NTPC Ltd (Ramagundam)', companyId: 'c44', city: 'Ramagundam', category: 'Glass & Ceramics', material: 'Cullet Residue', purity: 94, quantity: 1360, price: 5750, transportRate: 2.37, active: true, createdAt: new Date() },
    { id: 'l254', companyName: 'Borosil Glass Works', companyId: 'c70', city: 'Bharuch', category: 'Glass & Ceramics', material: 'Cullet Residue', purity: 96, quantity: 910, price: 6250, transportRate: 1.72, active: true, createdAt: new Date() },
    { id: 'l255', companyName: 'Dahej Special Economic Zone', companyId: 'c22', city: 'Dahej', category: 'Glass & Ceramics', material: 'Cullet Residue', purity: 96, quantity: 620, price: 5850, transportRate: 1.86, active: true, createdAt: new Date() },
    { id: 'l256', companyName: 'Grasim Industries Ltd', companyId: 'c12', city: 'Vilayat', category: 'Glass & Ceramics', material: 'Cullet Residue', purity: 93, quantity: 440, price: 4750, transportRate: 2.2, active: true, createdAt: new Date() },
    { id: 'l257', companyName: 'Aarti Industries Ltd', companyId: 'c4', city: 'Ankleshwar', category: 'Glass & Ceramics', material: 'Cullet Residue', purity: 93, quantity: 660, price: 5650, transportRate: 1.97, active: true, createdAt: new Date() },
    { id: 'l258', companyName: 'Shree Cement Ltd', companyId: 'c52', city: 'Raipur', category: 'Glass & Ceramics', material: 'Cullet Residue', purity: 96, quantity: 1330, price: 5200, transportRate: 1.98, active: true, createdAt: new Date() },
    { id: 'l259', companyName: 'Tata Steel Ltd', companyId: 'c32', city: 'Jamshedpur', category: 'Glass & Ceramics', material: 'Cullet Residue', purity: 93, quantity: 1450, price: 5850, transportRate: 1.8, active: true, createdAt: new Date() },
    { id: 'l260', companyName: 'Hindalco Industries Ltd', companyId: 'c33', city: 'Dahej', category: 'Glass & Ceramics', material: 'Cullet Residue', purity: 92, quantity: 1340, price: 5850, transportRate: 1.73, active: true, createdAt: new Date() },
    { id: 'l261', companyName: 'Asahi India Glass (AIS)', companyId: 'c67', city: 'Delhi', category: 'Glass & Ceramics', material: 'Ceramic Slurry', purity: 86, quantity: 470, price: 965, transportRate: 1.7, active: true, createdAt: new Date() },
    { id: 'l262', companyName: 'MRF Tyres Trichy Plant', companyId: 'c72', city: 'Chennai', category: 'Glass & Ceramics', material: 'Ceramic Slurry', purity: 84, quantity: 440, price: 1050, transportRate: 1.96, active: true, createdAt: new Date() },
    { id: 'l263', companyName: 'Balaji Amines Ltd', companyId: 'c16', city: 'Pune', category: 'Glass & Ceramics', material: 'Ceramic Slurry', purity: 92, quantity: 430, price: 1100, transportRate: 2.18, active: true, createdAt: new Date() },
    { id: 'l264', companyName: 'Ramco Cements Salem Plant', companyId: 'c55', city: 'Salem', category: 'Glass & Ceramics', material: 'Ceramic Slurry', purity: 85, quantity: 610, price: 840, transportRate: 1.63, active: true, createdAt: new Date() },
    { id: 'l265', companyName: 'Reliance Industries Ltd', companyId: 'c23', city: 'Jamnagar', category: 'Glass & Ceramics', material: 'Ceramic Slurry', purity: 91, quantity: 760, price: 1000, transportRate: 1.81, active: true, createdAt: new Date() },
    { id: 'l266', companyName: 'Paradeep Phosphates Ltd', companyId: 'c11', city: 'Paradeep', category: 'Glass & Ceramics', material: 'Ceramic Slurry', purity: 92, quantity: 700, price: 1700, transportRate: 2.08, active: true, createdAt: new Date() },
    { id: 'l267', companyName: 'Shree Cement Ltd', companyId: 'c52', city: 'Raipur', category: 'Glass & Ceramics', material: 'Ceramic Slurry', purity: 85, quantity: 590, price: 1500, transportRate: 2.12, active: true, createdAt: new Date() },
    { id: 'l268', companyName: 'Balaji Amines Ltd', companyId: 'c15', city: 'Pune', category: 'Glass & Ceramics', material: 'Ceramic Slurry', purity: 83, quantity: 480, price: 1050, transportRate: 2.18, active: true, createdAt: new Date() },
    { id: 'l269', companyName: 'DCM Shriram Ltd', companyId: 'c13', city: 'Kota', category: 'Glass & Ceramics', material: 'Ceramic Slurry', purity: 89, quantity: 970, price: 1450, transportRate: 1.99, active: true, createdAt: new Date() },
    { id: 'l270', companyName: 'Deepak Nitrite Ltd', companyId: 'c3', city: 'Vadodara', category: 'Glass & Ceramics', material: 'Ceramic Slurry', purity: 83, quantity: 350, price: 860, transportRate: 1.98, active: true, createdAt: new Date() },
    { id: 'l271', companyName: 'Tata Chemicals Ltd', companyId: 'c10', city: 'Mithapur', category: 'Glass & Ceramics', material: 'Refractory Slag', purity: 82, quantity: 850, price: 2050, transportRate: 2.11, active: true, createdAt: new Date() },
    { id: 'l272', companyName: 'Adani Power Ltd (Mundra)', companyId: 'c43', city: 'Mundhra', category: 'Glass & Ceramics', material: 'Refractory Slag', purity: 89, quantity: 610, price: 2400, transportRate: 2.31, active: true, createdAt: new Date() },
    { id: 'l273', companyName: 'ITC Paperboards Kovai', companyId: 'c65', city: 'Salem', category: 'Glass & Ceramics', material: 'Refractory Slag', purity: 83, quantity: 1030, price: 2300, transportRate: 1.88, active: true, createdAt: new Date() },
    { id: 'l274', companyName: 'Nirma Ltd (Chemical Division)', companyId: 'c14', city: 'Vadodara', category: 'Glass & Ceramics', material: 'Refractory Slag', purity: 83, quantity: 1040, price: 2300, transportRate: 2.41, active: true, createdAt: new Date() },
    { id: 'l275', companyName: 'Shree Cement Ltd', companyId: 'c52', city: 'Raipur', category: 'Glass & Ceramics', material: 'Refractory Slag', purity: 85, quantity: 850, price: 2300, transportRate: 2.0, active: true, createdAt: new Date() },
    { id: 'l276', companyName: 'Asahi India Glass (AIS)', companyId: 'c67', city: 'Delhi', category: 'Glass & Ceramics', material: 'Refractory Slag', purity: 88, quantity: 720, price: 2000, transportRate: 2.3, active: true, createdAt: new Date() },
    { id: 'l277', companyName: 'Atul Ltd (Vapi Plant)', companyId: 'c5', city: 'Vapi', category: 'Glass & Ceramics', material: 'Refractory Slag', purity: 89, quantity: 960, price: 2200, transportRate: 2.3, active: true, createdAt: new Date() },
    { id: 'l278', companyName: 'GSFC Ltd', companyId: 'c8', city: 'Vadodara', category: 'Glass & Ceramics', material: 'Refractory Slag', purity: 82, quantity: 1250, price: 1650, transportRate: 2.08, active: true, createdAt: new Date() },
    { id: 'l279', companyName: 'Godavari Biorefineries Ltd', companyId: 'c59', city: 'Sameerwadi', category: 'Glass & Ceramics', material: 'Refractory Slag', purity: 89, quantity: 770, price: 2150, transportRate: 2.46, active: true, createdAt: new Date() },
    { id: 'l280', companyName: 'Coromandel International Ltd', companyId: 'c19', city: 'Visakhapatnam', category: 'Glass & Ceramics', material: 'Refractory Slag', purity: 83, quantity: 680, price: 1500, transportRate: 2.15, active: true, createdAt: new Date() },
    { id: 'l281', companyName: 'Tata Steel Ltd', companyId: 'c32', city: 'Jamshedpur', category: 'Glass & Ceramics', material: 'Glass Powder', purity: 94, quantity: 860, price: 4000, transportRate: 2.48, active: true, createdAt: new Date() },
    { id: 'l282', companyName: 'Borosil Glass Works', companyId: 'c70', city: 'Bharuch', category: 'Glass & Ceramics', material: 'Glass Powder', purity: 93, quantity: 550, price: 4700, transportRate: 2.08, active: true, createdAt: new Date() },
    { id: 'l283', companyName: 'Vizag Iron & Steel Co', companyId: 'c29', city: 'Visakhapatnam', category: 'Glass & Ceramics', material: 'Glass Powder', purity: 92, quantity: 990, price: 4750, transportRate: 2.29, active: true, createdAt: new Date() },
    { id: 'l284', companyName: 'Maharashtra Thermal Power', companyId: 'c41', city: 'Mumbai', category: 'Glass & Ceramics', material: 'Glass Powder', purity: 93, quantity: 920, price: 3450, transportRate: 1.87, active: true, createdAt: new Date() },
    { id: 'l285', companyName: 'Century Pulp & Paper', companyId: 'c63', city: 'Lucknow', category: 'Glass & Ceramics', material: 'Glass Powder', purity: 92, quantity: 810, price: 4100, transportRate: 2.42, active: true, createdAt: new Date() },
    { id: 'l286', companyName: 'Ramco Cements Salem Plant', companyId: 'c55', city: 'Salem', category: 'Glass & Ceramics', material: 'Glass Powder', purity: 93, quantity: 860, price: 3950, transportRate: 1.94, active: true, createdAt: new Date() },
    { id: 'l287', companyName: 'Nirma Ltd (Chemical Division)', companyId: 'c14', city: 'Vadodara', category: 'Glass & Ceramics', material: 'Glass Powder', purity: 95, quantity: 480, price: 4500, transportRate: 2.31, active: true, createdAt: new Date() },
    { id: 'l288', companyName: 'Reliance Industries Ltd', companyId: 'c23', city: 'Jamnagar', category: 'Glass & Ceramics', material: 'Glass Powder', purity: 90, quantity: 410, price: 3700, transportRate: 2.15, active: true, createdAt: new Date() },
    { id: 'l289', companyName: 'Godavari Biorefineries Ltd', companyId: 'c59', city: 'Sameerwadi', category: 'Glass & Ceramics', material: 'Glass Powder', purity: 96, quantity: 470, price: 3900, transportRate: 2.12, active: true, createdAt: new Date() },
    { id: 'l290', companyName: 'Grasim Industries Ltd', companyId: 'c12', city: 'Vilayat', category: 'Glass & Ceramics', material: 'Glass Powder', purity: 94, quantity: 850, price: 3550, transportRate: 2.21, active: true, createdAt: new Date() },
    { id: 'l291', companyName: 'MRF Tyres Trichy Plant', companyId: 'c72', city: 'Chennai', category: 'Rubbers & Plastics', material: 'Polymer Fines', purity: 92, quantity: 470, price: 27850, transportRate: 3.0, active: true, createdAt: new Date() },
    { id: 'l292', companyName: 'UltraTech Cement Ltd (Raipur)', companyId: 'c49', city: 'Raipur', category: 'Rubbers & Plastics', material: 'Polymer Fines', purity: 92, quantity: 160, price: 27650, transportRate: 3.15, active: true, createdAt: new Date() },
    { id: 'l293', companyName: 'Tata Steel Ltd', companyId: 'c32', city: 'Jamshedpur', category: 'Rubbers & Plastics', material: 'Polymer Fines', purity: 91, quantity: 110, price: 26450, transportRate: 2.56, active: true, createdAt: new Date() },
    { id: 'l294', companyName: 'IOCL Refinery (Panipat)', companyId: 'c25', city: 'Panipat', category: 'Rubbers & Plastics', material: 'Polymer Fines', purity: 90, quantity: 140, price: 32400, transportRate: 3.2, active: true, createdAt: new Date() },
    { id: 'l295', companyName: 'Tamil Chem & Acid Ltd', companyId: 'c2', city: 'Chennai', category: 'Rubbers & Plastics', material: 'Polymer Fines', purity: 94, quantity: 160, price: 28500, transportRate: 2.56, active: true, createdAt: new Date() },
    { id: 'l296', companyName: 'Triveni Sugars Plant', companyId: 'c58', city: 'Khatauli', category: 'Rubbers & Plastics', material: 'Polymer Fines', purity: 95, quantity: 430, price: 35350, transportRate: 2.87, active: true, createdAt: new Date() },
    { id: 'l297', companyName: 'Gujarat Fluorochemicals Ltd', companyId: 'c18', city: 'Dahej', category: 'Rubbers & Plastics', material: 'Polymer Fines', purity: 92, quantity: 190, price: 33700, transportRate: 3.13, active: true, createdAt: new Date() },
    { id: 'l298', companyName: 'JSW Steel Ltd (Ballari)', companyId: 'c31', city: 'Bellary', category: 'Rubbers & Plastics', material: 'Polymer Fines', purity: 92, quantity: 340, price: 27150, transportRate: 2.94, active: true, createdAt: new Date() },
    { id: 'l299', companyName: 'Alkyl Amines Chemicals Ltd', companyId: 'c17', city: 'Dahej', category: 'Rubbers & Plastics', material: 'Polymer Fines', purity: 95, quantity: 320, price: 34150, transportRate: 2.98, active: true, createdAt: new Date() },
    { id: 'l300', companyName: 'Atul Ltd (Vapi Plant)', companyId: 'c5', city: 'Vapi', category: 'Rubbers & Plastics', material: 'Polymer Fines', purity: 90, quantity: 240, price: 28000, transportRate: 2.91, active: true, createdAt: new Date() },
    { id: 'l301', companyName: 'NTPC Ltd (Vindhyachal)', companyId: 'c42', city: 'Korba', category: 'Rubbers & Plastics', material: 'Rubber Crumb', purity: 84, quantity: 540, price: 17450, transportRate: 2.37, active: true, createdAt: new Date() },
    { id: 'l302', companyName: 'Grasim Industries Ltd', companyId: 'c12', city: 'Vilayat', category: 'Rubbers & Plastics', material: 'Rubber Crumb', purity: 92, quantity: 590, price: 12900, transportRate: 2.7, active: true, createdAt: new Date() },
    { id: 'l303', companyName: 'ACC Cement Wadi Plant', companyId: 'c53', city: 'Bellary', category: 'Rubbers & Plastics', material: 'Rubber Crumb', purity: 83, quantity: 440, price: 13450, transportRate: 2.88, active: true, createdAt: new Date() },
    { id: 'l304', companyName: 'Hindustan Petroleum Corp Ltd', companyId: 'c28', city: 'Visakhapatnam', category: 'Rubbers & Plastics', material: 'Rubber Crumb', purity: 88, quantity: 280, price: 15600, transportRate: 2.28, active: true, createdAt: new Date() },
    { id: 'l305', companyName: 'Maharashtra Thermal Power', companyId: 'c41', city: 'Mumbai', category: 'Rubbers & Plastics', material: 'Rubber Crumb', purity: 83, quantity: 590, price: 15750, transportRate: 2.41, active: true, createdAt: new Date() },
    { id: 'l306', companyName: 'Atul Ltd (Vapi Plant)', companyId: 'c5', city: 'Vapi', category: 'Rubbers & Plastics', material: 'Rubber Crumb', purity: 89, quantity: 710, price: 12900, transportRate: 2.29, active: true, createdAt: new Date() },
    { id: 'l307', companyName: 'Asahi India Glass (AIS)', companyId: 'c67', city: 'Delhi', category: 'Rubbers & Plastics', material: 'Rubber Crumb', purity: 88, quantity: 460, price: 13950, transportRate: 2.53, active: true, createdAt: new Date() },
    { id: 'l308', companyName: 'MRF Tyres Trichy Plant', companyId: 'c72', city: 'Chennai', category: 'Rubbers & Plastics', material: 'Rubber Crumb', purity: 91, quantity: 620, price: 15400, transportRate: 2.28, active: true, createdAt: new Date() },
    { id: 'l309', companyName: 'Balrampur Chini Mills', companyId: 'c60', city: 'Lucknow', category: 'Rubbers & Plastics', material: 'Rubber Crumb', purity: 89, quantity: 500, price: 15050, transportRate: 2.54, active: true, createdAt: new Date() },
    { id: 'l310', companyName: 'Tata Steel Ltd', companyId: 'c32', city: 'Jamshedpur', category: 'Rubbers & Plastics', material: 'Rubber Crumb', purity: 86, quantity: 630, price: 17750, transportRate: 2.86, active: true, createdAt: new Date() },
    { id: 'l311', companyName: 'Bharat Petroleum Corp Ltd', companyId: 'c27', city: 'Mumbai', category: 'Rubbers & Plastics', material: 'Wax Distillates', purity: 85, quantity: 200, price: 22850, transportRate: 2.93, active: true, createdAt: new Date() },
    { id: 'l312', companyName: 'JSW Steel Ltd (Ballari)', companyId: 'c31', city: 'Bellary', category: 'Rubbers & Plastics', material: 'Wax Distillates', purity: 87, quantity: 290, price: 20000, transportRate: 2.59, active: true, createdAt: new Date() },
    { id: 'l313', companyName: 'NTPC Ltd (Vindhyachal)', companyId: 'c42', city: 'Korba', category: 'Rubbers & Plastics', material: 'Wax Distillates', purity: 88, quantity: 350, price: 24600, transportRate: 2.64, active: true, createdAt: new Date() },
    { id: 'l314', companyName: 'United Phosphorous Ltd (UPL)', companyId: 'c9', city: 'Vapi', category: 'Rubbers & Plastics', material: 'Wax Distillates', purity: 89, quantity: 350, price: 23450, transportRate: 2.9, active: true, createdAt: new Date() },
    { id: 'l315', companyName: 'Reliance Industries Ltd', companyId: 'c23', city: 'Jamnagar', category: 'Rubbers & Plastics', material: 'Wax Distillates', purity: 81, quantity: 240, price: 18050, transportRate: 2.42, active: true, createdAt: new Date() },
    { id: 'l316', companyName: 'Shree Cement Ltd', companyId: 'c52', city: 'Raipur', category: 'Rubbers & Plastics', material: 'Wax Distillates', purity: 80, quantity: 320, price: 20650, transportRate: 2.68, active: true, createdAt: new Date() },
    { id: 'l317', companyName: 'Jamshedpur Steel Rolling', companyId: 'c30', city: 'Jamshedpur', category: 'Rubbers & Plastics', material: 'Wax Distillates', purity: 80, quantity: 160, price: 18550, transportRate: 2.71, active: true, createdAt: new Date() },
    { id: 'l318', companyName: 'JK Cement Nimbahera Plant', companyId: 'c54', city: 'Jodhpur', category: 'Rubbers & Plastics', material: 'Wax Distillates', purity: 88, quantity: 200, price: 24600, transportRate: 2.55, active: true, createdAt: new Date() },
    { id: 'l319', companyName: 'Rajpur Petrochemicals', companyId: 'c21', city: 'Jodhpur', category: 'Rubbers & Plastics', material: 'Wax Distillates', purity: 86, quantity: 150, price: 20750, transportRate: 2.8, active: true, createdAt: new Date() },
    { id: 'l320', companyName: 'Balaji Amines Ltd', companyId: 'c15', city: 'Pune', category: 'Rubbers & Plastics', material: 'Wax Distillates', purity: 90, quantity: 310, price: 19100, transportRate: 2.99, active: true, createdAt: new Date() },
    { id: 'l321', companyName: 'Tamil Chem & Acid Ltd', companyId: 'c2', city: 'Chennai', category: 'Rubbers & Plastics', material: 'Carbon Black Residue', purity: 91, quantity: 750, price: 9450, transportRate: 2.16, active: true, createdAt: new Date() },
    { id: 'l322', companyName: 'ITC Paperboards Kovai', companyId: 'c65', city: 'Salem', category: 'Rubbers & Plastics', material: 'Carbon Black Residue', purity: 88, quantity: 870, price: 11550, transportRate: 2.1, active: true, createdAt: new Date() },
    { id: 'l323', companyName: 'GNFC Ltd', companyId: 'c7', city: 'Bharuch', category: 'Rubbers & Plastics', material: 'Carbon Black Residue', purity: 87, quantity: 410, price: 8000, transportRate: 2.58, active: true, createdAt: new Date() },
    { id: 'l324', companyName: 'Bodal Chemicals Ltd', companyId: 'c6', city: 'Ahmedabad', category: 'Rubbers & Plastics', material: 'Carbon Black Residue', purity: 86, quantity: 590, price: 8700, transportRate: 2.15, active: true, createdAt: new Date() },
    { id: 'l325', companyName: 'Vizag Iron & Steel Co', companyId: 'c29', city: 'Visakhapatnam', category: 'Rubbers & Plastics', material: 'Carbon Black Residue', purity: 85, quantity: 520, price: 8000, transportRate: 2.2, active: true, createdAt: new Date() },
    { id: 'l326', companyName: 'Reliance Industries Ltd', companyId: 'c23', city: 'Jamnagar', category: 'Rubbers & Plastics', material: 'Carbon Black Residue', purity: 89, quantity: 710, price: 8500, transportRate: 2.14, active: true, createdAt: new Date() },
    { id: 'l327', companyName: 'NTPC Ltd (Vindhyachal)', companyId: 'c42', city: 'Korba', category: 'Rubbers & Plastics', material: 'Carbon Black Residue', purity: 88, quantity: 830, price: 9600, transportRate: 2.31, active: true, createdAt: new Date() },
    { id: 'l328', companyName: 'Maharashtra Thermal Power', companyId: 'c41', city: 'Mumbai', category: 'Rubbers & Plastics', material: 'Carbon Black Residue', purity: 91, quantity: 870, price: 11900, transportRate: 2.57, active: true, createdAt: new Date() },
    { id: 'l329', companyName: 'Adani Power Ltd (Mundra)', companyId: 'c43', city: 'Mundhra', category: 'Rubbers & Plastics', material: 'Carbon Black Residue', purity: 88, quantity: 500, price: 10650, transportRate: 2.29, active: true, createdAt: new Date() },
    { id: 'l330', companyName: 'JK Paper Ltd (Rayagada)', companyId: 'c62', city: 'Rayagada', category: 'Rubbers & Plastics', material: 'Carbon Black Residue', purity: 92, quantity: 730, price: 8500, transportRate: 2.12, active: true, createdAt: new Date() }
];

let enquiriesDb = [
    {
        id: 'e1',
        sellerCompany: 'Chemfix Industries Ltd',
        sellerCity: 'Surat',
        buyerCompany: 'Bengaluru Construction Cement',
        buyerCity: 'Bengaluru',
        material: 'Phosphogypsum',
        purity: 95,
        quantity: 150,
        materialCost: 82500,
        transportCost: 45000,
        totalLandedCost: 127500,
        distanceKm: 420,
        paymentTerms: 'net30',
        sampleRequested: true,
        deliveryAddress: 'Plant Site A, Bengaluru Tech Park, Karnataka',
        status: 'pending',
        createdAt: new Date(2026, 4, 28)
    },
    {
        id: 'e2',
        sellerCompany: 'Reliance Industries Ltd',
        sellerCity: 'Jamnagar',
        buyerCompany: 'Dahej Special Economic Zone',
        buyerCity: 'Dahej',
        material: 'Spent Solvents',
        purity: 89,
        quantity: 200,
        materialCost: 3040000,
        transportCost: 180000,
        totalLandedCost: 3220000,
        distanceKm: 310,
        paymentTerms: 'lc',
        sampleRequested: false,
        deliveryAddress: 'Sourcing Terminal 2, Dahej SEZ, Gujarat',
        status: 'confirmed',
        createdAt: new Date(2026, 4, 29)
    },
    {
        id: 'e3',
        sellerCompany: 'Tata Steel Ltd',
        sellerCity: 'Jamshedpur',
        buyerCompany: 'UltraTech Cement Ltd',
        buyerCity: 'Raipur',
        material: 'Mill Scale',
        purity: 95,
        quantity: 350,
        materialCost: 2135000,
        transportCost: 245000,
        totalLandedCost: 2380000,
        distanceKm: 450,
        paymentTerms: 'advance',
        sampleRequested: true,
        deliveryAddress: 'Clinker Unit B, Raipur, Chhattisgarh',
        status: 'rejected',
        createdAt: new Date(2026, 4, 25)
    }
];

// --- Live Auction System State & Seeding ---
let auctionsDb = [];
let closedAuctionsLog = [
    { id: 'ca1', material: 'Spent Sulphuric Acid', purity: 81, price: 1850, originalPrice: 1500, originCity: 'Vadodara', biddersCount: 5, closedAt: new Date(2026, 4, 25), premium: 23.3 },
    { id: 'ca2', material: 'Fly Ash', purity: 92, price: 450, originalPrice: 400, originCity: 'Nagpur', biddersCount: 3, closedAt: new Date(2026, 4, 27), premium: 12.5 },
    { id: 'ca3', material: 'Spent Acetone', purity: 94, price: 16800, originalPrice: 15000, originCity: 'Ankleshwar', biddersCount: 6, closedAt: new Date(2026, 4, 28), premium: 12.0 },
    { id: 'ca4', material: 'Blast Furnace Slag', purity: 85, price: 920, originalPrice: 800, originCity: 'Jamshedpur', biddersCount: 4, closedAt: new Date(2026, 4, 29), premium: 15.0 },
    { id: 'ca5', material: 'Spent Catalyst', purity: 70, price: 85, originalPrice: 75, originCity: 'Jamnagar', biddersCount: 4, closedAt: new Date(2026, 4, 30), premium: 13.3 }
];
window.auctionsDb = auctionsDb;
window.closedAuctionsLog = closedAuctionsLog;

// --- B2B State variables ---
let currentRole = 'buyer';
let loginRole = 'buyer';
let isLoggedIn = false;
let loggedInCompany = null;
let activeResults = [];
let selectedListing = null;
let currentLandedCost = 0;
let currentDistance = 0;

// Leaflet markers tracking
let mapInstance = null;
let mapLayers = [];
let lightTileLayer = null;
let darkTileLayer = null;
let streetTileLayer = null;
let satelliteTileLayer = null;
let currentMapMode = 'street';
let lastMapBounds = null;

// ==========================================================================
   // --- 1. TOAST NOTIFICATION SYSTEM ---
// ==========================================================================
let activeToasts = [];

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Build Toast Element
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    
    // Choose icons safely
    let icon = 'ℹ';
    if (type === 'success') icon = '✓';
    else if (type === 'error') icon = '✕';
    else if (type === 'warning') icon = '⚠';

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-msg">${message}</span>
        <span class="toast-progress"></span>
    `;

    // Click to dismiss
    toast.addEventListener('click', () => {
        dismissToast(toast);
    });

    // Handle Max Toast limitation (Max 3 visible)
    if (activeToasts.length >= 3) {
        dismissToast(activeToasts[0]);
    }

    container.appendChild(toast);
    activeToasts.push(toast);

    // Auto dismiss after 4s
    setTimeout(() => {
        dismissToast(toast);
    }, 4000);
}

function dismissToast(toast) {
    if (!toast || toast.classList.contains('toast-fade-out')) return;
    
    toast.classList.add('toast-fade-out');
    toast.addEventListener('animationend', () => {
        toast.remove();
        activeToasts = activeToasts.filter(t => t !== toast);
    });
}

// ==========================================================================
   // --- 2. FIREBASE OR LOCAL STORE PERSISTENCE GATE ---
// ==========================================================================
async function initDatabase() {
    try {
        if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
            const firebaseAppModule = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
            const firestoreModule = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
            
            initializeApp = firebaseAppModule.initializeApp;
            getFirestore = firestoreModule.getFirestore;
            collection = firestoreModule.collection;
            getDocs = firestoreModule.getDocs;
            addDoc = firestoreModule.addDoc;
            updateDoc = firestoreModule.updateDoc;
            doc = firestoreModule.doc;
            query = firestoreModule.query;
            where = firestoreModule.where;
            onSnapshot = firestoreModule.onSnapshot;
            serverTimestamp = firestoreModule.serverTimestamp;

            const app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            firebaseEnabled = true;
            console.log("Firebase initialized successfully. Operating live cloud database.");
            showToast("Connected to live Firebase cloud store ✓", "info");
        } else {
            console.log("Using local database mode (Firebase configuration has default placeholders).");
            showToast("Secure Local Session active (Using offline mock store) ✓", "info");
        }
    } catch (err) {
        console.error("Firebase startup crashed. Falling back to local offline stores.", err);
        showToast("Firebase connection failed. Fallback to local store active.", "warning");
        firebaseEnabled = false;
    }

    // Load initial listings and companies
    await loadInitialData();
}

function showSimulatorSkeletons() {
    const tbody = document.getElementById('simulator-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><div class="skeleton" style="height:20px; width:40px; border-radius:4px;"></div></td>
            <td><div class="skeleton" style="height:20px; width:150px; border-radius:4px;"></div></td>
            <td><div class="skeleton" style="height:20px; width:100px; border-radius:4px;"></div></td>
            <td><div class="skeleton" style="height:20px; width:60px; border-radius:4px;"></div></td>
            <td><div class="skeleton" style="height:20px; width:60px; border-radius:4px;"></div></td>
            <td><div class="skeleton" style="height:20px; width:80px; border-radius:4px;"></div></td>
            <td><div class="skeleton" style="height:20px; width:80px; border-radius:4px;"></div></td>
            <td><div class="skeleton" style="height:20px; width:70px; border-radius:4px;"></div></td>
            <td><div class="skeleton" style="height:20px; width:90px; border-radius:4px;"></div></td>
            <td><div class="skeleton" style="height:28px; width:70px; border-radius:6px;"></div></td>
        `;
        tbody.appendChild(tr);
    }
}

function showDirectorySkeletons() {
    const tbody = document.getElementById('directory-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    for (let i = 0; i < 2; i++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><div class="skeleton" style="height:20px; width:180px; border-radius:4px;"></div></td>
            <td><div class="skeleton" style="height:20px; width:120px; border-radius:4px;"></div></td>
            <td><div class="skeleton" style="height:20px; width:140px; border-radius:4px;"></div></td>
            <td><div class="skeleton" style="height:20px; width:130px; border-radius:4px;"></div></td>
            <td><div class="skeleton" style="height:20px; width:180px; border-radius:4px;"></div></td>
            <td><div class="skeleton" style="height:20px; width:90px; border-radius:4px;"></div></td>
        `;
        tbody.appendChild(tr);
    }
}

async function loadInitialData() {
    showSimulatorSkeletons();
    showDirectorySkeletons();

    // Dynamically seed SPCB licenses for pre-seeded offline database records
    companiesDb.forEach((comp, idx) => {
        if (!comp.spcb) {
            const year = 2025 - (idx % 3);
            const numCode = String(100 + idx).padStart(4, '0');
            const cityPrefix = comp.city.substring(0, 3).toUpperCase();
            comp.spcb = `SPCB/HW/${cityPrefix}/${year}/${numCode}`;
        }
    });

    if (firebaseEnabled) {
        try {
            // Check & load companies
            const companiesSnap = await getDocs(collection(db, "companies"));
            if (companiesSnap.empty) {
                console.log("Firestore empty. Seeding defaults...");
                await seedDatabase();
            } else {
                let list = [];
                companiesSnap.forEach(doc => {
                    const data = doc.data();
                    list.push({
                        id: doc.id,
                        ...data,
                        registeredAt: data.registeredAt ? data.registeredAt.toDate() : new Date()
                    });
                });
                companiesDb = list;
            }

            // Real-time snapshot listener on listings (avoids query delays & updates immediately)
            onSnapshot(collection(db, "listings"), (snapshot) => {
                let activeOffers = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    if (data.active !== false) {
                        activeOffers.push({
                            id: doc.id,
                            ...data,
                            createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
                        });
                    }
                });
                listingsDb = activeOffers;
                
                // If dashboard is loaded, sync lists
                if (isLoggedIn) {
                    if (currentRole === 'buyer') {
                        runCostEngine();
                    } else {
                        renderSellerDatabase();
                    }
                    updateLandingStats();
                }
            });

        } catch (err) {
            console.error("Error connecting to Firebase services.", err);
            showToast("Failed to fetch listings from Cloud Store.", "error");
            firebaseEnabled = false; // Force fallback
        }
    }

    // Refresh dynamic widgets
    updateLoginCompanyDropdown();
    updateLandingStats();
}

// Seed helper (only executes when collections are completely blank)
async function seedDatabase() {
    try {
        for (const company of companiesDb) {
            const docRef = await addDoc(collection(db, "companies"), {
                name: company.name,
                sector: company.sector,
                city: company.city,
                gstin: company.gstin,
                email: company.email,
                role: company.role,
                pin: company.pin,
                verified: company.verified,
                registeredAt: serverTimestamp()
            });
            // Map listings to this new docRef id
            const linkedListings = listingsDb.filter(l => l.companyName === company.name);
            for (const list of linkedListings) {
                await addDoc(collection(db, "listings"), {
                    companyName: list.companyName,
                    companyId: docRef.id,
                    city: list.city,
                    category: list.category,
                    material: list.material,
                    purity: list.purity,
                    quantity: list.quantity,
                    price: list.price,
                    transportRate: list.transportRate,
                    active: true,
                    createdAt: serverTimestamp()
                });
            }
        }
        showToast("Database seeded successfully ✓", "success");
    } catch (err) {
        console.error("Database seed failed.", err);
    }
}

// ==========================================================================
   // --- 3. DYNAMIC METRICS COUNT-UP ANIMATION ---
// ==========================================================================
function animateCounter(element, start, end, duration, prefix = '', suffix = '') {
    if (!element) return;
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        // ease-out cubic curve
        const easing = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(easing * (end - start) + start);

        if (prefix === '₹') {
            // Indian style currency formatting
            const crValue = (value / 10000000).toFixed(1);
            element.innerText = `₹${crValue}${suffix}`;
        } else {
            element.innerText = `${value.toLocaleString('en-IN')}${suffix}`;
        }

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            if (prefix === '₹') {
                element.innerText = `₹${(end / 10000000).toFixed(1)}${suffix}`;
            } else {
                element.innerText = `${end.toLocaleString('en-IN')}${suffix}`;
            }
        }
    }
    window.requestAnimationFrame(step);
}

function updateLandingStats() {
    const plantsEl = document.getElementById('landing-stat-plants');
    const listingsEl = document.getElementById('landing-stat-listings');
    const valueEl = document.getElementById('landing-stat-value');

    // Trigger counters stagger
    if (plantsEl) {
        const val = companiesDb.length;
        animateCounter(plantsEl, 0, val, 1500, '', '+');
    }
    if (listingsEl) {
        const val = listingsDb.length;
        animateCounter(listingsEl, 0, val, 1500, '', '+');
    }
    if (valueEl) {
        // Mock constant trade value metrics matching standard
        animateCounter(valueEl, 0, 24000000, 1500, '₹', 'Cr+');
    }

    // Refresh app metrics if logged in
    const dbComp = document.getElementById('db-stat-companies');
    const dbList = document.getElementById('db-stat-listings');
    const dbQty = document.getElementById('db-stat-qty');
    if (dbComp) dbComp.innerText = companiesDb.length;
    if (dbList) dbList.innerText = listingsDb.length;
    if (dbQty) {
        const totalQty = listingsDb.reduce((sum, item) => sum + item.quantity, 0);
        dbQty.innerText = `${totalQty.toLocaleString('en-IN')}t`;
    }
}

function renderMarketPriceIndex() {
    const tbody = document.getElementById('market-index-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    // Sort closed auctions by date descending
    const sorted = [...closedAuctionsLog].sort((a, b) => new Date(b.closedAt) - new Date(a.closedAt));

    sorted.forEach(item => {
        const tr = document.createElement('tr');
        const unit = getMaterialUnit(item.material);
        const dateStr = item.closedAt instanceof Date ? item.closedAt.toLocaleDateString('en-IN') : new Date(item.closedAt).toLocaleDateString('en-IN');
        const premiumStr = item.premium > 0 ? `+${item.premium}%` : `${item.premium}%`;
        
        tr.innerHTML = `
            <td><strong>${item.material}</strong></td>
            <td><span class="purity-badge">${item.purity}% Grade</span></td>
            <td><strong>₹${item.price.toLocaleString('en-IN')}/${unit}</strong></td>
            <td>${item.originCity} <span style="font-size: 0.7rem; color: var(--text-muted);">(${citiesDb[item.originCity]?.state || ''})</span></td>
            <td><span class="badge" style="background: var(--bg-secondary); border: 1px solid var(--border-color); color: var(--text-secondary);">${item.biddersCount} Bidders</span></td>
            <td>${dateStr}</td>
            <td style="text-align: right;">
                <span class="badge" style="background: rgba(34, 197, 94, 0.1); color: #15803d; border: 1px solid rgba(34, 197, 94, 0.2); font-weight: 700;">${premiumStr}</span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
window.renderMarketPriceIndex = renderMarketPriceIndex;

function triggerStatsAnimation() {
    const recEl = document.getElementById('landing-stat-recovered');
    const valEl = document.getElementById('landing-stat-value');
    const partEl = document.getElementById('landing-stat-partners');
    const citEl = document.getElementById('landing-stat-cities');

    if (recEl) animateCounter(recEl, 0, 12500, 2000, '', '+');
    if (valEl) animateCounter(valEl, 0, 82000000, 2000, '₹', ' Cr+');
    if (partEl) animateCounter(partEl, 0, 150, 2000, '', '+');
    if (citEl) animateCounter(citEl, 0, 23, 2000, '', '+');
}

// ==========================================================================
   // --- 4. B2B INPUTS VALIDATIONS (GSTIN LOGIC) ---
// ==========================================================================
function validateGSTIN(gstin) {
    // 15-character B2B validation logic
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return regex.test(gstin);
}

// Attach listeners to input fields
document.addEventListener('DOMContentLoaded', () => {
    const gstinInput = document.getElementById('land-reg-gstin');
    const indicator = document.getElementById('gst-indicator');

    if (gstinInput && indicator) {
        gstinInput.addEventListener('input', () => {
            const val = gstinInput.value.trim().toUpperCase();
            gstinInput.value = val; // Force uppercase format

            if (val === '') {
                indicator.innerText = '';
                indicator.className = 'gstin-badge-indicator';
                return;
            }

            if (validateGSTIN(val)) {
                indicator.innerText = '✓ Verified';
                indicator.style.color = 'var(--color-success)';
                indicator.className = 'gstin-badge-indicator';
            } else {
                indicator.innerText = '✕ Invalid';
                indicator.style.color = 'var(--color-error)';
                indicator.className = 'gstin-badge-indicator';
            }
        });
    }

    const spcbInput = document.getElementById('land-reg-spcb');
    const spcbIndicator = document.getElementById('spcb-indicator');

    if (spcbInput && spcbIndicator) {
        spcbInput.addEventListener('input', () => {
            const val = spcbInput.value.trim().toUpperCase();
            spcbInput.value = val; // Force uppercase format

            if (val === '') {
                spcbIndicator.innerText = '';
                spcbIndicator.style.color = '';
                spcbIndicator.className = 'gstin-badge-indicator';
                return;
            }

            const spcbRegex = /^SPCB\/HW\/[A-Z]{3}\/[0-9]{4}\/[0-9]{4}$/;
            if (spcbRegex.test(val)) {
                spcbIndicator.innerText = '✓ Verified';
                spcbIndicator.style.color = 'var(--color-success)';
                spcbIndicator.className = 'gstin-badge-indicator';
            } else {
                spcbIndicator.innerText = '✕ Invalid';
                spcbIndicator.style.color = 'var(--color-error)';
                spcbIndicator.className = 'gstin-badge-indicator';
            }
        });
    }

    // Setup input elements value togglers to support CSS floating labels pattern
    document.querySelectorAll('.form-control').forEach(input => {
        const checkValue = () => {
            if (input.value && input.value.trim() !== "") {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        };
        input.addEventListener('blur', checkValue);
        input.addEventListener('change', checkValue);
        
        // Execute immediately to format pre-seeded or dynamic select dropdowns
        setTimeout(checkValue, 100);
    });
});

// ==========================================================================
   // --- 5. LOGISTICS ROUTING METRICS (HAVERSINE LOGIC) ---
// ==========================================================================
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // Multiply by winding factor of 1.25 for realistic road distance estimation
    return Math.round(R * c * 1.25);
}

// ==========================================================================
   // --- 6. CORE LANDED COST CALCULATOR ENGINE ---
// ==========================================================================
// ==========================================================================
//   LOGISTICS CURRENCY FORMATTER HELPERS
// ==========================================================================
function formatIndianCurrency(val) {
    if (val >= 10000000) {
        return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
        return `₹${(val / 100000).toFixed(2)} L`;
    } else {
        return `₹${Math.round(val).toLocaleString('en-IN')}`;
    }
}

let costEngineSessionId = 0;
let lastFilteredMaterial = null;
const osrmRouteCache = {};

// --- Indian National Highway Freight Network Graph (46 Industrial Hubs) ---
const HIGHWAY_CORRIDOR_EDGES = [
    // Golden Quadrilateral West-North Corridor (NH-48)
    ['Panipat', 'Delhi'], ['Khatauli', 'Delhi'], ['Delhi', 'Jaipur'], ['Jaipur', 'Ajmer'],
    ['Ajmer', 'Udaipur'], ['Udaipur', 'Ahmedabad'], ['Ahmedabad', 'Vadodara'],
    ['Vadodara', 'Bharuch'], ['Bharuch', 'Ankleshwar'], ['Ankleshwar', 'Surat'],
    ['Surat', 'Vapi'], ['Vapi', 'Mumbai'], ['Mumbai', 'Pune'],
    ['Dahej', 'Bharuch'], ['Vilayat', 'Bharuch'], ['Jamnagar', 'Ahmedabad'],
    ['Mundhra', 'Ahmedabad'], ['Mithapur', 'Jamnagar'], ['Kota', 'Jaipur'], ['Jodhpur', 'Ajmer'],

    // East-West Freight Corridor (NH-53)
    ['Paradeep', 'Cuttack'], ['Cuttack', 'Bhubaneswar'], ['Cuttack', 'Sambalpur'],
    ['Sambalpur', 'Jharsuguda'], ['Jharsuguda', 'Rourkela'], ['Angul', 'Sambalpur'],
    ['Sambalpur', 'Raipur'], ['Raipur', 'Bhilai'], ['Korba', 'Raipur'],
    ['Bhilai', 'Nagpur'], ['Nagpur', 'Dhule'], ['Dhule', 'Surat'], ['Dhule', 'Nashik'],
    ['Nashik', 'Mumbai'], ['Nashik', 'Pune'],

    // North-South Central Transit Corridor (NH-44 / NH-47)
    ['Delhi', 'Bhopal'], ['Bhopal', 'Indore'], ['Indore', 'Dhule'], ['Bhopal', 'Nagpur'],
    ['Nagpur', 'Ramagundam'], ['Ramagundam', 'Hyderabad'], ['Hyderabad', 'Bengaluru'],
    ['Bengaluru', 'Salem'], ['Salem', 'Chennai'], ['Salem', 'Tuticorin'],
    ['Bengaluru', 'Bellary'], ['Bellary', 'Sameerwadi'], ['Sameerwadi', 'Pune'],
    ['Bengaluru', 'Mangalore'], ['Salem', 'Kochi'],

    // Eastern Coast & Central Mining Corridors (NH-16 / NH-19)
    ['Kolkata', 'Haldia'], ['Kolkata', 'Kharagpur'], ['Kharagpur', 'Jamshedpur'],
    ['Jamshedpur', 'Bokaro'], ['Bokaro', 'Rourkela'], ['Kharagpur', 'Cuttack'],
    ['Cuttack', 'Visakhapatnam'], ['Visakhapatnam', 'Rayagada'], ['Rayagada', 'Raipur'],
    ['Visakhapatnam', 'Vijayawada'], ['Vijayawada', 'Chennai'],
    ['Vijayawada', 'Hyderabad'], ['Chennai', 'Nellikuppam'],
    ['Delhi', 'Lucknow'], ['Lucknow', 'Renukoot'], ['Renukoot', 'Rourkela'], ['Renukoot', 'Nagpur']
];

const highwayAdj = {};
HIGHWAY_CORRIDOR_EDGES.forEach(([u, v]) => {
    if (!highwayAdj[u]) highwayAdj[u] = [];
    if (!highwayAdj[v]) highwayAdj[v] = [];
    highwayAdj[u].push(v);
    highwayAdj[v].push(u);
});

function findHighwayCorridorPath(start, goal) {
    if (start === goal) return [start];
    const queue = [[start, [start]]];
    const visited = new Set([start]);
    while (queue.length > 0) {
        const [node, path] = queue.shift();
        if (node === goal) return path;
        for (const next of (highwayAdj[node] || [])) {
            if (!visited.has(next)) {
                visited.add(next);
                queue.push([next, [...path, next]]);
            }
        }
    }
    return [start, goal];
}

function getHighwayCorridorLatLngs(originCity, destCity, originCoords, destCoords) {
    const cityPath = findHighwayCorridorPath(originCity, destCity);
    if (!cityPath || cityPath.length < 2) {
        return [[originCoords.lat, originCoords.lng], [destCoords.lat, destCoords.lng]];
    }

    const latLngs = [];
    cityPath.forEach((cityName, idx) => {
        const c = citiesDb[cityName];
        if (c) {
            latLngs.push([c.lat, c.lng]);
        }
    });

    if (latLngs.length < 2) {
        return [[originCoords.lat, originCoords.lng], [destCoords.lat, destCoords.lng]];
    }
    return latLngs;
}

function calculateCorridorDistance(latLngs, originCoords, destCoords) {
    if (!latLngs || latLngs.length < 2) {
        return Math.round(calculateDistance(originCoords.lat, originCoords.lng, destCoords.lat, destCoords.lng) * 1.25);
    }
    let total = 0;
    for (let i = 0; i < latLngs.length - 1; i++) {
        total += calculateDistance(latLngs[i][0], latLngs[i][1], latLngs[i+1][0], latLngs[i+1][1]);
    }
    return Math.max(25, Math.round(total * 1.08));
}

async function fetchRoadRoute(originCity, destCity, originCoords, destCoords) {
    const cacheKey = `${originCity}-${destCity}`;
    if (osrmRouteCache[cacheKey]) {
        return osrmRouteCache[cacheKey];
    }

    // Try OSRM OpenStreetMap live routing server (verified high-speed turn-by-turn API)
    const primaryUrl = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${originCoords.lng},${originCoords.lat};${destCoords.lng},${destCoords.lat}?overview=full&geometries=geojson`;
    const fallbackUrl = `https://router.project-osrm.org/route/v1/driving/${originCoords.lng},${originCoords.lat};${destCoords.lng},${destCoords.lat}?overview=full&geometries=geojson`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
        let res = null;
        try {
            res = await fetch(primaryUrl, { signal: controller.signal });
        } catch (e) {
            // Secondary fallback attempt
            res = await fetch(fallbackUrl, { signal: controller.signal });
        }

        if (res && res.ok) {
            const data = await res.json();
            if (data.routes && data.routes.length > 0) {
                clearTimeout(timeoutId);
                const route = data.routes[0];
                const result = {
                    distance: Math.round(route.distance / 1000),
                    roadCoordinates: route.geometry.coordinates,
                    duration: Math.round(route.duration / 3600),
                    isTurnByTurn: true
                };
                osrmRouteCache[cacheKey] = result;
                return result;
            }
        }
    } catch (err) {
        // Fallback to corridor routing
    } finally {
        clearTimeout(timeoutId);
    }

    // High-precision National Highway Corridor Fallback
    const corridorLatLngs = getHighwayCorridorLatLngs(originCity, destCity, originCoords, destCoords);
    const estDistance = calculateCorridorDistance(corridorLatLngs, originCoords, destCoords);
    const result = {
        distance: estDistance,
        roadCoordinates: corridorLatLngs.map(pt => [pt[1], pt[0]]),
        duration: Math.max(1, Math.round(estDistance / 55)),
        isTurnByTurn: false
    };
    osrmRouteCache[cacheKey] = result;
    return result;
}

async function runCostEngine() {
    const buyerCityName = loggedInCompany ? loggedInCompany.city : 'Surat';
    const category = document.getElementById('sim-category').value;
    const materialSelected = document.getElementById('sim-material').value;

    if (materialSelected !== lastFilteredMaterial) {
        lastFilteredMaterial = materialSelected;
        if (typeof clearBlendSlots === 'function') {
            clearBlendSlots();
            addBlendSlot();
            addBlendSlot();
        }
    }
    const minPurity = parseFloat(document.getElementById('sim-purity-min').value) || 0;
    const maxPurity = parseFloat(document.getElementById('sim-purity-max').value) || 100;
    const reqQty = parseFloat(document.getElementById('sim-quantity').value) || 1;

    const unit = getMaterialUnit(materialSelected);
    const qtyLabel = document.querySelector('label[for="sim-quantity"]');
    if (qtyLabel) qtyLabel.innerText = `📦 Quantity Required (${unit})`;

    // Display Header loc status
    document.getElementById('header-user-loc').innerText = `📍 Location: ${buyerCityName}`;

    const buyerCoords = citiesDb[buyerCityName];
    if (!buyerCoords) return;

    // Filter matching listings initially
    let matchingListings = [];
    listingsDb.forEach(item => {
        if (item.category === category && 
            item.material === materialSelected && 
            item.purity >= minPurity && 
            item.purity <= maxPurity && 
            item.quantity >= reqQty &&
            item.city !== buyerCityName) {
            matchingListings.push(item);
        }
    });

    // If no matching listings, handle immediately
    if (matchingListings.length === 0) {
        activeResults = [];
        renderResultsTable([], reqQty);
        return;
    }

    // Show loading state/skeleton in table
    showSimulatorSkeletons();

    const sessionId = ++costEngineSessionId;

    // Fetch road routes for ALL matching listings in parallel
    const routePromises = matchingListings.map(async (item) => {
        const sellerCoords = citiesDb[item.city];
        if (!sellerCoords) return null;

        const routeData = await fetchRoadRoute(item.city, buyerCityName, sellerCoords, buyerCoords);
        const distance = routeData ? routeData.distance : calculateDistance(buyerCoords.lat, buyerCoords.lng, sellerCoords.lat, sellerCoords.lng);
        const roadCoordinates = routeData ? routeData.roadCoordinates : null;
        const isTurnByTurn = routeData ? routeData.isTurnByTurn : false;

        // Calculate exact landed cost based on resolved distance (actual road or straight-line)
        const freightCost = Math.round(item.transportRate * distance * 100) / 100;
        const landedCostPerTonne = Math.round(item.price + freightCost);

        return {
            ...item,
            distance: distance,
            freightCost: freightCost,
            landedCostPerTonne: landedCostPerTonne,
            roadCoordinates: roadCoordinates,
            isTurnByTurn: isTurnByTurn
        };
    });

    const results = (await Promise.all(routePromises)).filter(r => r !== null);

    // Discard outdated engine call results
    if (sessionId !== costEngineSessionId) return;

    // Sort ascending by landed cost (blended cost)
    results.sort((a, b) => a.landedCostPerTonne - b.landedCostPerTonne);
    activeResults = results;

    // Render results in table
    renderResultsTable(results, reqQty);

    // Populate Blending Calculator lot dropdowns
    if (typeof populateBlendDropdowns === 'function') {
        populateBlendDropdowns();
        calculateBlend();
    }
}

function renderResultsTable(results, reqQty) {
    const tbody = document.getElementById('simulator-tbody');
    const emptyState = document.getElementById('no-results');
    
    tbody.innerHTML = '';
    
    if (results.length === 0) {
        emptyState.style.display = 'flex';
        document.getElementById('stat-total-sellers').innerText = '0';
        document.getElementById('stat-best-price').innerText = '—';
        resetMapRoute();
        document.getElementById('selection-card').style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    document.getElementById('stat-total-sellers').innerText = results.length;
    const materialSelected = document.getElementById('sim-material').value;
    const unit = getMaterialUnit(materialSelected);
    document.getElementById('stat-best-price').innerText = `₹${results[0].landedCostPerTonne.toLocaleString('en-IN')}/${unit}`;

    results.forEach((item, index) => {
        const rank = index + 1;
        const tr = document.createElement('tr');
        
        // Stagger row entry animation delay
        tr.style.animationDelay = `${index * 50}ms`;

        // Highlight active auctions
        const isAuction = item.status === 'auction_live';
        if (isAuction) {
            tr.style.border = '1px solid rgba(239, 68, 68, 0.2)';
            tr.style.background = 'rgba(239, 68, 68, 0.02)';
        }

        // Style ranking badge class
        let rankBadge = `<span class="rank-badge-pill">${rank}</span>`;
        if (rank === 1) {
            tr.classList.add('rank-1');
            rankBadge = `<span class="rank-badge-pill rank-gold">🥇 BEST DEAL</span>`;
        } else if (rank === 2) {
            rankBadge = `<span class="rank-badge-pill rank-silver">🥈</span>`;
        } else if (rank === 3) {
            rankBadge = `<span class="rank-badge-pill rank-bronze">🥉</span>`;
        }

        // Purity styling classes
        let purityClass = 'purity-poor';
        if (item.purity >= 90) purityClass = 'purity-high';
        else if (item.purity >= 75) purityClass = 'purity-mid';
        else if (item.purity >= 60) purityClass = 'purity-low';

        const auctionBadge = isAuction ? '<span class="pulse-live-badge" style="padding: 2px 6px; font-size: 0.6rem; vertical-align: middle; margin-left: 5px;">🔴 LIVE</span>' : '';
        const selectBtnText = isAuction ? 'Bid &rarr;' : 'Select &rarr;';
        const selectBtnClass = isAuction ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';

        tr.innerHTML = `
            <td>${rankBadge}</td>
            <td>
                <strong>${item.companyName}</strong> ${auctionBadge}
                <span class="gst-verified-chip">✓ Verified</span>
                <span style="font-size:0.75rem; color:var(--text-muted); display:block;">
                    State: ${citiesDb[item.city].state} 
                    <span class="mobile-dist-inline" style="color:var(--accent); font-weight:600; margin-left:6px;">(~${item.distance} km)</span>
                </span>
            </td>
            <td>${item.material}</td>
            <td><span class="purity-badge ${purityClass}">${item.purity}%</span></td>
            <td>${item.quantity} ${unit}</td>
            <td>₹${item.price.toLocaleString('en-IN')}/${unit}</td>
            <td>₹${item.transportRate.toFixed(2)}/km/${unit}</td>
            <td style="color:var(--accent); font-weight:600;">~${item.distance} km est.</td>
            <td><strong style="color:var(--text-primary);">₹${item.landedCostPerTonne.toLocaleString('en-IN')}/${unit}</strong></td>
            <td style="text-align: right;">
                <button class="${selectBtnClass}" style="width:auto;">${selectBtnText}</button>
            </td>
        `;

        // Click row action: Map polyline plotting & open popup
        tr.addEventListener('click', () => {
            // Highlight selected row styling
            document.querySelectorAll('.simulator-table tbody tr').forEach(r => r.style.backgroundColor = '');
            if (!isAuction) {
                tr.style.backgroundColor = 'var(--accent-light)';
            } else {
                tr.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
            }
            
            selectSellerDeal(item, reqQty);
        });

        tbody.appendChild(tr);
    });

    // Auto-select rank-1 choice
    if (results.length > 0) {
        const firstRow = tbody.querySelector('tr');
        if (firstRow) firstRow.click();
    }
}

function selectSellerDeal(item, reqQty) {
    selectedListing = item;
    currentLandedCost = item.landedCostPerTonne;
    currentDistance = item.distance;

    const buyerCity = loggedInCompany ? loggedInCompany.city : 'Surat';
    const buyerCoords = citiesDb[buyerCity];
    const sellerCoords = citiesDb[item.city];

    // If this item doesn't have verified turn-by-turn road coordinates yet, fetch immediately in background
    if (!item.isTurnByTurn && sellerCoords && buyerCoords) {
        fetchRoadRoute(item.city, buyerCity, sellerCoords, buyerCoords).then(route => {
            if (route && selectedListing && selectedListing.id === item.id) {
                item.roadCoordinates = route.roadCoordinates;
                item.distance = route.distance;
                item.isTurnByTurn = route.isTurnByTurn;
                item.freightCost = Math.round(item.transportRate * route.distance * 100) / 100;
                item.landedCostPerTonne = Math.round(item.price + item.freightCost);
                currentLandedCost = item.landedCostPerTonne;
                currentDistance = item.distance;
                
                const unit = getMaterialUnit(item.material);
                const landedEl = document.getElementById('sel-landed-val');
                const distEl = document.getElementById('sel-distance-val');
                if (landedEl) landedEl.innerText = `₹${item.landedCostPerTonne.toLocaleString('en-IN')} / ${unit}`;
                if (distEl) distEl.innerText = `${item.distance.toLocaleString('en-IN')} km (Road)`;

                renderMapConnectionInfo(item, buyerCity);
                drawAllLeafletRoutes(buyerCity, activeResults, item.id);
            }
        });
    }

    // Display Selection Summary Panel
    document.getElementById('sel-company-title').innerText = item.companyName;
    document.getElementById('sel-material-info').innerText = `${item.material} (${item.purity}% Grade Purity)`;
    document.getElementById('sel-distance-val').innerText = `${item.distance.toLocaleString('en-IN')} km (Road)`;
    const unit = getMaterialUnit(item.material);
    document.getElementById('sel-landed-val').innerText = `₹${item.landedCostPerTonne.toLocaleString('en-IN')} / ${unit}`;
    
    // Update Sourcing Button Text if Active Auction
    const isAuction = item.status === 'auction_live';
    const sourcingBtnText = document.querySelector('#selection-card button .btn-text');
    if (sourcingBtnText) {
        sourcingBtnText.innerHTML = isAuction ? '🔴 Open Live Auction Room &rarr;' : 'Proceed to Trade Enquiry &rarr;';
    }

    document.getElementById('selection-card').style.display = 'block';

    // Show road highway route connection info in dedicated status panel
    renderMapConnectionInfo(item, buyerCity);

    // Redraw the map to highlight this selection
    drawAllLeafletRoutes(buyerCity, activeResults, item.id);
}

function selectItemById(id) {
    const item = activeResults.find(r => r.id === id);
    if (!item) return;
    const reqQty = parseFloat(document.getElementById('sim-quantity').value) || 1;
    
    const rows = document.querySelectorAll('.simulator-table tbody tr');
    const index = activeResults.findIndex(r => r.id === id);
    if (rows && rows[index]) {
        rows.forEach(r => r.style.backgroundColor = '');
        rows[index].style.backgroundColor = 'var(--accent-light)';
        rows[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    selectSellerDeal(item, reqQty);
}

function renderMapConnectionInfo(item, buyerCity) {
    const infoDiv = document.getElementById('map-connection-info');
    if (!infoDiv) return;
    if (!item) {
        renderDefaultMapConnectionInfo();
        return;
    }
    const hasRoadCoords = item.roadCoordinates && item.roadCoordinates.length > 0;
    const sellerState = citiesDb[item.city]?.state || '';
    const buyerState = citiesDb[buyerCity]?.state || '';
    const durationHours = Math.max(1, Math.round(item.distance / 55));
    const freightRate = Number(item.transportRate || 4.5).toFixed(2);
    const unit = getMaterialUnit(item.material);

    infoDiv.innerHTML = `
        <div class="route-details-card">
            <div class="route-header-strip">
                <span class="route-badge-active">
                    <span class="live-dot" style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#16a34a;box-shadow:0 0 6px #16a34a;margin-right:5px;"></span>
                    <strong style="color:var(--text-primary);">${item.companyName}</strong>
                </span>
                <span class="route-km-pill">🛣️ ${item.distance.toLocaleString('en-IN')} km Road</span>
            </div>
            <div class="route-nodes-flex">
                <div class="route-node">
                    <span class="node-dot origin-dot"></span>
                    <div class="node-content">
                        <span class="node-label">Origin Plant</span>
                        <strong class="node-city">${item.city}</strong>
                        <small class="node-state">${sellerState}</small>
                    </div>
                </div>
                <div class="route-transit-line">
                    <span class="transit-arrow">➔</span>
                    <span class="transit-sub">${hasRoadCoords ? 'National Highway' : 'Transit Corridor'}</span>
                </div>
                <div class="route-node">
                    <span class="node-dot dest-dot"></span>
                    <div class="node-content">
                        <span class="node-label">Delivery Hub</span>
                        <strong class="node-city">${buyerCity}</strong>
                        <small class="node-state">${buyerState}</small>
                    </div>
                </div>
            </div>
            <div class="route-meta-pills">
                <span class="route-pill-tag tag-verified">
                    ${hasRoadCoords ? '✓ Verified Highway Route' : '✓ Direct Freight Corridor'}
                </span>
                <span class="route-pill-tag tag-time">⏱️ ~${durationHours} hrs Transit</span>
                <span class="route-pill-tag tag-rate">🚚 ₹${freightRate}/km/${unit}</span>
            </div>
        </div>
    `;
}

function renderDefaultMapConnectionInfo() {
    const infoDiv = document.getElementById('map-connection-info');
    if (!infoDiv) return;
    infoDiv.innerHTML = `
        <div class="route-empty-state">
            <span class="route-empty-icon">📍</span>
            <div class="route-empty-text">
                <strong>No Route Selected</strong>
                <p>Select any circular material listing from the table below to calculate highway freight corridor & logistics costs.</p>
            </div>
        </div>
    `;
}

function fitActiveMapRoute() {
    if (!mapInstance) return;
    if (lastMapBounds) {
        mapInstance.flyToBounds(lastMapBounds, { padding: [35, 35], duration: 0.8 });
    } else {
        mapInstance.flyTo([21.0000, 78.0000], 5, { duration: 0.8 });
    }
}

function centerBuyerPlant() {
    if (!mapInstance) return;
    const buyerCity = loggedInCompany ? loggedInCompany.city : 'Surat';
    const coords = citiesDb[buyerCity];
    if (coords) {
        mapInstance.flyTo([coords.lat, coords.lng], 9, { duration: 0.8 });
    }
}

function toggleSatelliteView() {
    if (!mapInstance || !satelliteTileLayer || !streetTileLayer) return;
    const btn = document.getElementById('btn-map-satellite-toggle');
    const isDark = document.body.classList.contains('dark-theme');

    if (currentMapMode === 'street') {
        currentMapMode = 'satellite';
        if (mapInstance.hasLayer(streetTileLayer)) mapInstance.removeLayer(streetTileLayer);
        if (mapInstance.hasLayer(darkTileLayer)) mapInstance.removeLayer(darkTileLayer);
        satelliteTileLayer.addTo(mapInstance);
        if (btn) btn.innerHTML = '<span>🗺️ Street Map</span>';
    } else {
        currentMapMode = 'street';
        if (mapInstance.hasLayer(satelliteTileLayer)) mapInstance.removeLayer(satelliteTileLayer);
        if (isDark) {
            darkTileLayer.addTo(mapInstance);
        } else {
            streetTileLayer.addTo(mapInstance);
        }
        if (btn) btn.innerHTML = '<span>🛰️ Satellite</span>';
    }
}

// ==========================================================================
   // --- 7. LEAFLET ROUTE MAP CONTROLLER ---
// ==========================================================================
function initLeafletMap() {
    const mapDiv = document.getElementById('leaflet-map');
    if (!mapDiv) return;

    if (typeof L === 'undefined') {
        mapDiv.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.8rem; height: 100%; display: flex; align-items: center; justify-content: center;">
            ⚠️ Map Visualization Offline<br>(Leaflet library failed to load)
        </div>`;
        return;
    }

    if (mapInstance) {
        setTimeout(() => { mapInstance.invalidateSize(); }, 150);
        return;
    }

    // Centered on central India with top-right zoom controls
    mapInstance = L.map('leaflet-map', {
        zoomControl: false,
        scrollWheelZoom: true
    }).setView([21.0000, 78.0000], 4);

    L.control.zoom({ position: 'topright' }).addTo(mapInstance);

    // 1. Official Esri World Street Map (Crisp, High-DPI, Zero Watermark, No API Key Required)
    streetTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.esri.com/" target="_blank">Esri</a> &copy; OpenStreetMap contributors',
        maxZoom: 19
    });

    // 2. Official Esri Dark Canvas for Night/Dark Mode (Zero Watermark, No API Key Required)
    darkTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.esri.com/" target="_blank">Esri</a> &copy; OpenStreetMap contributors',
        maxZoom: 16
    });

    // 3. Official Esri World Imagery for Real Satellite Aerial Photography (Zero Watermark)
    satelliteTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.esri.com/" target="_blank">Esri</a> Earthstar Geographics',
        maxZoom: 19
    });

    lightTileLayer = streetTileLayer;

    // Check which theme is active and add correct layer
    const isDark = document.body.classList.contains('dark-theme');
    if (isDark) {
        darkTileLayer.addTo(mapInstance);
    } else {
        streetTileLayer.addTo(mapInstance);
    }

    setTimeout(() => { mapInstance.invalidateSize(); }, 200);
}

function drawAllLeafletRoutes(buyerCity, results, selectedListingId) {
    if (typeof L === 'undefined' || !mapInstance) return;

    // Clear prior markers and lines
    resetMapRoute();

    const buyerCoords = citiesDb[buyerCity];
    if (!buyerCoords) return;

    const reqQty = parseFloat(document.getElementById('sim-quantity').value) || 1;
    const materialSelected = document.getElementById('sim-material').value;
    const unit = getMaterialUnit(materialSelected);

    // Identify selected item vs other items
    const selectedItem = results.find(r => r.id === selectedListingId) || results[0];
    const otherItems = results.filter(r => r.id !== (selectedItem ? selectedItem.id : null));

    const selectedBounds = [L.latLng(buyerCoords.lat, buyerCoords.lng)];
    const allBounds = [L.latLng(buyerCoords.lat, buyerCoords.lng)];

    // 1. Plot Unselected Routes FIRST (subtle background corridors, NO overlapping permanent tooltips)
    otherItems.forEach((item) => {
        const sellerCoords = citiesDb[item.city];
        if (!sellerCoords) return;

        const sellerLatLng = L.latLng(sellerCoords.lat, sellerCoords.lng);
        allBounds.push(sellerLatLng);

        // Inactive marker (clean slate dot with hover info)
        const inactiveIcon = L.divIcon({
            className: 'map-seller-dot-wrap',
            html: `<div class="map-seller-dot-inactive" title="${item.companyName} (${item.city})"></div>`,
            iconSize: [10, 10],
            iconAnchor: [5, 5]
        });

        const inactiveMarker = L.marker([sellerCoords.lat, sellerCoords.lng], { icon: inactiveIcon })
            .addTo(mapInstance);

        inactiveMarker.bindTooltip(`<strong>${item.companyName}</strong><br><span style="font-size:0.7rem;color:#94a3b8;">${item.city} • ₹${item.landedCostPerTonne.toLocaleString('en-IN')}/${unit}</span>`, {
            permanent: false,
            direction: 'top',
            className: 'map-route-tooltip-hover'
        });

        inactiveMarker.on('click', () => {
            selectItemById(item.id);
        });

        mapLayers.push(inactiveMarker);

        // Path coordinates (road or corridor)
        const latLngs = (item.roadCoordinates && item.roadCoordinates.length > 0)
            ? item.roadCoordinates.map(coord => [coord[1], coord[0]])
            : getHighwayCorridorLatLngs(item.city, buyerCity, sellerCoords, buyerCoords);

        const inactivePolyline = L.polyline(latLngs, {
            color: '#64748b',
            weight: 2.0,
            opacity: 0.35,
            dashArray: '5, 8',
            className: 'leaflet-interactive-polyline-inactive'
        }).addTo(mapInstance);

        // Tooltip shown on hover only — NOT permanent, keeping map clean
        inactivePolyline.bindTooltip(`<strong>${item.companyName}</strong> (${item.city})<br><span style="font-size:0.68rem;color:#cbd5e1;">Landed: ₹${item.landedCostPerTonne.toLocaleString('en-IN')}/${unit} • ${item.distance} km</span>`, {
            permanent: false,
            sticky: true,
            className: 'map-route-tooltip-hover'
        });

        inactivePolyline.on('click', () => {
            selectItemById(item.id);
        });

        mapLayers.push(inactivePolyline);
    });

    // 2. Plot the SELECTED Route ON TOP with GPS glow & distinct badges
    if (selectedItem) {
        const sellerCoords = citiesDb[selectedItem.city];
        if (sellerCoords) {
            const sellerLatLng = L.latLng(sellerCoords.lat, sellerCoords.lng);
            selectedBounds.push(sellerLatLng);
            allBounds.push(sellerLatLng);

            const latLngs = (selectedItem.roadCoordinates && selectedItem.roadCoordinates.length > 0)
                ? selectedItem.roadCoordinates.map(coord => [coord[1], coord[0]])
                : getHighwayCorridorLatLngs(selectedItem.city, buyerCity, sellerCoords, buyerCoords);

            // Glowing underlay line for GPS Navigation aesthetic
            const glowLine = L.polyline(latLngs, {
                color: '#22c55e',
                weight: 9.0,
                opacity: 0.28,
                lineCap: 'round',
                lineJoin: 'round'
            }).addTo(mapInstance);
            mapLayers.push(glowLine);

            // Core active emerald route polyline
            const activeLine = L.polyline(latLngs, {
                color: '#16a34a',
                weight: 4.8,
                opacity: 1.0,
                lineCap: 'round',
                lineJoin: 'round',
                className: 'leaflet-interactive-polyline'
            }).addTo(mapInstance);

            // Single clean floating pill badge along the active route
            const routeBadgeHtml = `
                <div style="display:flex;align-items:center;gap:6px;">
                    <span>🛣️ <strong>${selectedItem.city}</strong> ➔ <strong>${buyerCity}</strong></span>
                    <span style="opacity:0.6;">•</span>
                    <span style="color:#4ade80;">${selectedItem.distance.toLocaleString('en-IN')} km Road</span>
                </div>
            `;
            activeLine.bindTooltip(routeBadgeHtml, {
                permanent: true,
                direction: 'top',
                className: 'map-selected-route-pill',
                offset: [0, -8]
            });

            mapLayers.push(activeLine);

            // Selected Seller Marker (Pulsing emerald pin)
            const activeSellerIcon = L.divIcon({
                className: 'map-selected-seller-pin-wrap',
                html: `
                    <div class="map-selected-seller-pin">
                        <div class="pin-pulse-ring"></div>
                        <div class="pin-core"></div>
                    </div>
                `,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });

            const activeSellerMarker = L.marker([sellerCoords.lat, sellerCoords.lng], { 
                icon: activeSellerIcon, 
                zIndexOffset: 1000 
            }).addTo(mapInstance);

            activeSellerMarker.bindPopup(`
                <div class="map-seller-popup-card">
                    <strong style="font-size:0.85rem;color:var(--text-primary);display:block;">${selectedItem.companyName}</strong>
                    <div style="font-size:0.7rem;color:var(--text-muted);margin:2px 0 4px 0;">Plant: ${selectedItem.city}, ${citiesDb[selectedItem.city]?.state || ''}</div>
                    <div style="font-size:0.75rem;font-weight:700;color:var(--accent);">Delivered: ₹${selectedItem.landedCostPerTonne.toLocaleString('en-IN')}/${unit}</div>
                    <div style="font-size:0.68rem;color:var(--text-secondary);margin-top:2px;">Road Distance: <b>${selectedItem.distance.toLocaleString('en-IN')} km</b></div>
                </div>
            `, { offset: [0, -10], closeButton: true });

            mapLayers.push(activeSellerMarker);
        }
    }

    // 3. Plot Buyer Marker (Delivery Hub with pulsing ring)
    const buyerIcon = L.divIcon({
        className: 'buyer-map-marker-ring',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    const buyerMarker = L.marker([buyerCoords.lat, buyerCoords.lng], { icon: buyerIcon, zIndexOffset: 1100 })
        .addTo(mapInstance)
        .bindPopup(`
            <div style="font-family:'Outfit',sans-serif;padding:2px 4px;">
                <strong style="color:#2563eb;font-size:0.85rem;">🏭 Your Plant (Delivery Hub)</strong><br>
                <span style="font-size:0.75rem;color:var(--text-primary);font-weight:600;">${buyerCity}, ${buyerCoords.state}</span>
            </div>
        `);
    
    mapLayers.push(buyerMarker);

    // Fit view focused on the active selected route
    if (selectedBounds.length > 1) {
        lastMapBounds = L.latLngBounds(selectedBounds);
        mapInstance.fitBounds(lastMapBounds, { padding: [45, 45], maxZoom: 8 });
    } else if (allBounds.length > 1) {
        lastMapBounds = L.latLngBounds(allBounds);
        mapInstance.fitBounds(lastMapBounds, { padding: [35, 35] });
    }
}

function resetMapRoute() {
    if (typeof L === 'undefined' || !mapInstance) return;
    mapLayers.forEach(layer => mapInstance.removeLayer(layer));
    mapLayers = [];
}

// ==========================================================================
   // --- 8. CHECKOUT drawer PROCEDURES ---
// ==========================================================================
function initiateProcurementDrawer() {
    if (!selectedListing) return;

    // Auto-login fallback if not logged in
    if (!loggedInCompany) {
        const company = companiesDb.find(c => c.id === 'c3') || companiesDb.find(c => c.id === 'c1');
        if (company) {
            loggedInCompany = company;
            isLoggedIn = true;
            currentRole = 'buyer';
            setRole('buyer');

            // Update welcome banner
            document.getElementById('welcome-company-title').innerText = `Welcome, ${company.name}`;
            const sector = company.sector;
            const city = company.city;
            const state = (citiesDb[city] && citiesDb[city].state) ? citiesDb[city].state : 'Gujarat';
            document.getElementById('welcome-company-meta').innerText = `${sector} — ${state} Portal`;

            const welcomeSpcb = document.getElementById('welcome-spcb-badge');
            if (welcomeSpcb) {
                welcomeSpcb.innerText = `SPCB Authorized ✓ (${company.spcb})`;
                welcomeSpcb.style.display = 'inline-block';
            }

            const welcomeBtnBuyer = document.getElementById('welcome-btn-buyer');
            const welcomeBtnSeller = document.getElementById('welcome-btn-seller');
            if (welcomeBtnBuyer) welcomeBtnBuyer.style.display = 'block';
            if (welcomeBtnSeller) welcomeBtnSeller.style.display = 'none';

            renderBuyerEnquiries();
            renderSellerEnquiries();
            
            showToast(`Auto-authenticated as ${company.name} for Secure Trade Enquiry access`, "info");
        }
    }

    // Transition from landing page to app container if landing page is visible
    const landing = document.getElementById('landing-container');
    const app = document.getElementById('app-container');
    if (landing && landing.style.display !== 'none' && app) {
        landing.style.display = 'none';
        app.style.display = 'flex';
        app.classList.add('active');
        switchTab('simulator');
    }

    // Check if live auction is active for this listing
    const auction = auctionsDb.find(a => a.listingId === selectedListing.id && a.status === 'active');
    if (auction || selectedListing.status === 'auction_live') {
        openAuctionRoom(selectedListing.id);
        return;
    }

    // Load buyer plants dropdown options
    const select = document.getElementById('chk-buyer-company');
    select.innerHTML = '';
    companiesDb.forEach(comp => {
        if (comp.role === 'buyer' || comp.role === 'both') {
            const opt = document.createElement('option');
            opt.value = comp.name;
            opt.innerText = `${comp.name} (${comp.city}, ${citiesDb[comp.city].state})`;
            // Default select logged in user's profile
            if (loggedInCompany && loggedInCompany.name === comp.name) {
                opt.selected = true;
            }
            select.appendChild(opt);
        }
    });

    const simQty = parseFloat(document.getElementById('sim-quantity').value) || 10;
    document.getElementById('chk-order-qty').value = simQty;
    document.getElementById('chk-delivery-addr').value = '';

    // Assign text fields
    const unit = getMaterialUnit(selectedListing.material);
    const chkQtyLabel = document.querySelector('label[for="chk-order-qty"]');
    if (chkQtyLabel) chkQtyLabel.innerText = `Order Volume Needed (${unit})`;
    
    document.getElementById('chk-material-title').innerText = `${selectedListing.material} (${selectedListing.purity}% Grade)`;
    document.getElementById('chk-seller-name').innerText = `Seller: ${selectedListing.companyName} — ${selectedListing.city}, ${citiesDb[selectedListing.city].state}`;
    document.getElementById('chk-base-price').innerText = `₹${selectedListing.price.toLocaleString('en-IN')}/${unit}`;
    document.getElementById('chk-transport-rate').innerText = `₹${selectedListing.transportRate.toFixed(2)}/km/${unit}`;
    document.getElementById('chk-distance').innerText = `~${currentDistance} km est.`;
    document.getElementById('chk-landed-price').innerText = `₹${currentLandedCost.toLocaleString('en-IN')}/${unit}`;

    // Enable panels
    document.getElementById('checkout-form').style.display = 'block';
    document.getElementById('receipt-container').style.display = 'none';

    updateCheckoutTotal();

    document.getElementById('checkout-overlay').classList.add('active');
    document.getElementById('checkout-drawer').classList.add('active');

    // Trigger SPCB compliance verification check
    if (typeof triggerCheckoutSPCBPrecheck === 'function') {
        triggerCheckoutSPCBPrecheck();
    }

    // Bind buyer select change listener
    const buyerSelect = document.getElementById('chk-buyer-company');
    if (buyerSelect && !buyerSelect.dataset.listenerBound) {
        buyerSelect.dataset.listenerBound = 'true';
        buyerSelect.addEventListener('change', () => {
            if (typeof triggerCheckoutSPCBPrecheck === 'function') {
                triggerCheckoutSPCBPrecheck();
            }
        });
    }
}

function closeCheckoutDrawer() {
    document.getElementById('checkout-overlay').classList.remove('active');
    document.getElementById('checkout-drawer').classList.remove('active');
}

function updateCheckoutTotal() {
    if (!selectedListing) return;

    const qty = parseFloat(document.getElementById('chk-order-qty').value) || 0;
    const materialSubtotal = Math.round(qty * selectedListing.price * 100) / 100;
    const transportTotal = Math.round(qty * selectedListing.transportRate * currentDistance * 100) / 100;
    const totalDelivered = Math.round((materialSubtotal + transportTotal) * 100) / 100;

    document.getElementById('chk-sum-material').innerText = `₹${Math.round(materialSubtotal).toLocaleString('en-IN')}`;
    document.getElementById('chk-sum-transport').innerText = `₹${Math.round(transportTotal).toLocaleString('en-IN')}`;
    document.getElementById('chk-sum-total').innerText = `₹${Math.round(totalDelivered).toLocaleString('en-IN')}`;
}

async function submitFinalProcedure(event) {
    event.preventDefault();
    if (!selectedListing) return;

    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.classList.add('btn-loading');

    const buyerName = document.getElementById('chk-buyer-company').value;
    const qty = parseFloat(document.getElementById('chk-order-qty').value) || 0;
    const address = document.getElementById('chk-delivery-addr').value.trim();
    const payment = document.getElementById('chk-payment-terms').value;
    const sample = document.getElementById('chk-req-sample').checked;

    const materialSubtotal = Math.round(qty * selectedListing.price * 100) / 100;
    const transportTotal = Math.round(qty * selectedListing.transportRate * currentDistance * 100) / 100;
    const totalDelivered = Math.round((materialSubtotal + transportTotal) * 100) / 100;

    const newEnquiry = {
        id: 'e_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        sellerCompany: selectedListing.companyName,
        sellerCity: selectedListing.city,
        buyerCompany: buyerName,
        buyerCity: loggedInCompany ? loggedInCompany.city : 'Surat',
        material: selectedListing.material,
        purity: selectedListing.purity,
        quantity: qty,
        materialCost: Math.round(materialSubtotal),
        transportCost: Math.round(transportTotal),
        totalLandedCost: Math.round(totalDelivered),
        distanceKm: currentDistance,
        paymentTerms: payment,
        sampleRequested: sample,
        deliveryAddress: address,
        status: 'pending',
        createdAt: new Date()
    };

    // Check if seller allows live auction and there is already a pending enquiry for this listing from another buyer
    const isAuctionAllowed = selectedListing.allowAuction !== false;
    const existingPending = enquiriesDb.find(e => 
        e.sellerCompany === selectedListing.companyName && 
        e.material === selectedListing.material && 
        e.purity === selectedListing.purity &&
        e.status === 'pending' && 
        e.buyerCompany !== buyerName
    );

    let isAuctionTriggered = false;

    if (isAuctionAllowed && existingPending) {
        isAuctionTriggered = true;
        selectedListing.status = 'auction_live';
        
        // Create live auction
        const auctionId = 'auc_' + selectedListing.id;
        const reservePrice = selectedListing.price;
        const deadline = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        const bids = [
            {
                id: 'bid_' + existingPending.id,
                bidderName: existingPending.buyerCompany,
                bidderCity: existingPending.buyerCity,
                price: selectedListing.price,
                qty: existingPending.quantity,
                timestamp: new Date(existingPending.createdAt)
            },
            {
                id: 'bid_' + newEnquiry.id,
                bidderName: newEnquiry.buyerCompany,
                bidderCity: newEnquiry.buyerCity,
                price: selectedListing.price,
                qty: newEnquiry.quantity,
                timestamp: new Date()
            }
        ];

        const newAuction = {
            id: auctionId,
            listingId: selectedListing.id,
            sellerCompany: selectedListing.companyName,
            material: selectedListing.material,
            purity: selectedListing.purity,
            quantity: selectedListing.quantity,
            reservePrice: reservePrice,
            deadline: deadline,
            bids: bids,
            status: 'active',
            proxies: {}
        };
        
        auctionsDb.push(newAuction);

        // Mark enquiries status
        existingPending.status = 'auction_active';
        newEnquiry.status = 'auction_active';
    }

    // Firebase addition
    if (firebaseEnabled) {
        try {
            await addDoc(collection(db, "enquiries"), {
                ...newEnquiry,
                createdAt: serverTimestamp()
            });
        } catch (err) {
            console.error("Enquiry save crashed.", err);
            showToast("Failed to sync enquiry to Cloud Store.", "error");
        }
    } else {
        enquiriesDb.push(newEnquiry);
    }

    // Refresh buyer dashboard table
    renderBuyerEnquiries();

    if (isAuctionTriggered) {
        closeCheckoutDrawer();
        openAuctionRoom(selectedListing.id);
        showToast("⚠️ SPCB Alert: Multiple buyer interests detected! Shifted listing to Live Auction Room.", "info");
        if (submitBtn) submitBtn.classList.remove('btn-loading');
        return;
    }

    // Populate B2B Quote Receipt
    const now = new Date();
    const validityDate = new Date();
    validityDate.setDate(validityDate.getDate() + 15);

    const quoteId = 'TR-Q-2026-' + Math.floor(100000 + Math.random() * 900000);
    const unit = getMaterialUnit(selectedListing.material);

    // Look up companies
    const buyerCompany = companiesDb.find(c => c.name === buyerName);
    const sellerCompany = companiesDb.find(c => c.name === selectedListing.companyName);

    const buyerCityState = buyerCompany ? `${buyerCompany.city}, ${citiesDb[buyerCompany.city]?.state || ''}` : 'Surat, Gujarat';
    const sellerCityState = sellerCompany ? `${sellerCompany.city}, ${citiesDb[sellerCompany.city]?.state || ''}` : `${selectedListing.city}, ${citiesDb[selectedListing.city]?.state || ''}`;

    // Populate Quote Header & Reference
    document.getElementById('rcpt-quote-id').innerText = quoteId;
    document.getElementById('rcpt-date-formatted').innerText = now.toLocaleDateString('en-IN') + ' ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('rcpt-validity-formatted').innerText = validityDate.toLocaleDateString('en-IN') + ' (15 days validity)';

    // Populate Addresses & Details
    document.getElementById('rcpt-seller-name').innerText = selectedListing.companyName;
    document.getElementById('rcpt-seller-sector').innerText = sellerCompany ? sellerCompany.sector : 'Industrial Plant Operations';
    document.getElementById('rcpt-seller-address').innerText = `${sellerCityState}, India`;
    document.getElementById('rcpt-seller-email').innerText = sellerCompany ? sellerCompany.email : 'dispatch@' + selectedListing.companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.in';
    document.getElementById('rcpt-seller-gstin').innerText = sellerCompany ? sellerCompany.gstin : '24' + Math.random().toString(36).substring(2, 11).toUpperCase() + '1Z0';

    document.getElementById('rcpt-buyer-name').innerText = buyerName;
    document.getElementById('rcpt-buyer-sector').innerText = buyerCompany ? buyerCompany.sector : 'Procuring Manufacturer';
    document.getElementById('rcpt-buyer-address').innerText = `${buyerCityState}, India`;
    document.getElementById('rcpt-buyer-email').innerText = buyerCompany ? buyerCompany.email : 'procurement@' + buyerName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.in';
    document.getElementById('rcpt-buyer-gstin').innerText = buyerCompany ? buyerCompany.gstin : '24' + Math.random().toString(36).substring(2, 11).toUpperCase() + '1Z1';

    // Populate Table Details
    document.getElementById('rcpt-material').innerText = `${selectedListing.material} (${selectedListing.purity}% Purity)`;
    document.getElementById('rcpt-base-price').innerText = `₹${selectedListing.price.toLocaleString('en-IN')} / ${unit}`;
    document.getElementById('rcpt-qty').innerText = `${qty} ${unit}`;
    document.getElementById('rcpt-mat-cost').innerText = `₹${Math.round(materialSubtotal).toLocaleString('en-IN')}`;

    // Freight Details
    document.getElementById('rcpt-dist').innerText = currentDistance;
    document.getElementById('rcpt-freight-rate').innerText = `Rate: ₹${selectedListing.transportRate.toFixed(2)} per km per ${unit}`;
    document.getElementById('rcpt-trans-cost').innerText = `₹${Math.round(transportTotal).toLocaleString('en-IN')}`;

    // Total Landed Cost
    document.getElementById('rcpt-total-cost').innerText = `₹${Math.round(totalDelivered).toLocaleString('en-IN')}`;

    // Terms
    document.getElementById('rcpt-terms').innerText = payment;
    document.getElementById('rcpt-sample').innerText = sample ? 'Requested (1kg container assay)' : 'Not Requested';

    // Keep legacy inputs satisfied (just in case)
    const legacyDate = document.getElementById('receipt-date');
    if (legacyDate) legacyDate.innerText = `Date: ${now.toLocaleDateString('en-IN')} | Time: ${now.toLocaleTimeString('en-IN')}`;

    // Populate Form 10 Consignment Manifest fields
    const manifestId = 'TR-M-2026-' + Math.floor(100000 + Math.random() * 900000);
    const mRcptId = document.getElementById('m-rcpt-id');
    if (mRcptId) mRcptId.innerText = manifestId;
    const mRcptDate = document.getElementById('m-rcpt-date');
    if (mRcptDate) mRcptDate.innerText = now.toLocaleDateString('en-IN');
    
    const mSenderName = document.getElementById('m-sender-name');
    if (mSenderName) mSenderName.innerText = selectedListing.companyName;
    const mSenderSector = document.getElementById('m-sender-sector');
    if (mSenderSector) mSenderSector.innerText = sellerCompany ? sellerCompany.sector : 'Industrial Plant Operations';
    const mSenderAddress = document.getElementById('m-sender-address');
    if (mSenderAddress) mSenderAddress.innerText = `${sellerCityState}, India`;
    const mSenderEmail = document.getElementById('m-sender-email');
    if (mSenderEmail) mSenderEmail.innerText = sellerCompany ? sellerCompany.email : 'dispatch@' + selectedListing.companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.in';
    const mSenderSpcb = document.getElementById('m-sender-spcb');
    if (mSenderSpcb) mSenderSpcb.innerText = sellerCompany ? sellerCompany.spcb : 'SPCB/HW/GEN/2026/0122';

    const mReceiverName = document.getElementById('m-receiver-name');
    if (mReceiverName) mReceiverName.innerText = buyerName;
    const mReceiverSector = document.getElementById('m-receiver-sector');
    if (mReceiverSector) mReceiverSector.innerText = buyerCompany ? buyerCompany.sector : 'Procuring Manufacturer';
    const mReceiverAddress = document.getElementById('m-receiver-address');
    if (mReceiverAddress) mReceiverAddress.innerText = `${buyerCityState}, India`;
    const mReceiverEmail = document.getElementById('m-receiver-email');
    if (mReceiverEmail) mReceiverEmail.innerText = buyerCompany ? buyerCompany.email : 'procurement@' + buyerName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.in';
    const mReceiverSpcb = document.getElementById('m-receiver-spcb');
    if (mReceiverSpcb) mReceiverSpcb.innerText = buyerCompany ? buyerCompany.spcb : 'SPCB/HW/PROC/2026/0311';

    const mockVehicles = ['GJ-05-BX-4912', 'GJ-05-EX-8314', 'GJ-05-BY-2911', 'MH-04-GP-8273'];
    const mVehicleNo = document.getElementById('m-vehicle-no');
    if (mVehicleNo) mVehicleNo.innerText = mockVehicles[Math.floor(Math.random() * mockVehicles.length)];
    
    const mMaterialName = document.getElementById('m-material-name');
    if (mMaterialName) mMaterialName.innerText = selectedListing.material;
    const mPurityAssay = document.getElementById('m-purity-assay');
    if (mPurityAssay) mPurityAssay.innerText = `${selectedListing.purity}% Grade`;
    const mQtyVal = document.getElementById('m-qty-val');
    if (mQtyVal) mQtyVal.innerText = `${qty} MT`;

    // Ensure tab is set to quote display by default
    if (typeof toggleReceiptView === 'function') {
        toggleReceiptView('quote');
    }

    if (submitBtn) submitBtn.classList.remove('btn-loading');
    showToast("By-product trade enquiry sent successfully ✓", "success");

    // Toggle panels
    document.getElementById('checkout-form').style.display = 'none';
    document.getElementById('receipt-container').style.display = 'block';
}

function renderBuyerEnquiries() {
    const tbody = document.getElementById('buyer-enquiries-tbody');
    const box = document.getElementById('buyer-enquiries-box');
    if (!tbody || !box) return;

    // Filter enquiries where this company is the buyer
    const companyName = loggedInCompany ? loggedInCompany.name : '';
    const list = enquiriesDb.filter(e => e.buyerCompany === companyName);

    // Sort by newest first
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    tbody.innerHTML = '';
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">No sourcing proposals submitted yet.</td></tr>`;
        return;
    }

    list.forEach(e => {
        const tr = document.createElement('tr');
        
        let statusBadge = '';
        if (e.status === 'pending') {
            statusBadge = `<span class="badge purity-badge purity-low">🟡 Pending Supplier Approval</span>`;
        } else if (e.status === 'confirmed') {
            statusBadge = `<span class="badge purity-badge purity-high">🟢 Deal Confirmed</span>`;
        } else {
            statusBadge = `<span class="badge purity-badge purity-poor">🔴 Declined</span>`;
        }

        const dateStr = new Date(e.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const unit = getMaterialUnit(e.material);

        tr.innerHTML = `
            <td><strong>${dateStr}</strong></td>
            <td><strong>${e.material}</strong><br><span style="font-size: 0.72rem; color: var(--text-muted);">${e.purity}% Grade</span></td>
            <td>${e.sellerCompany}<br><span style="font-size: 0.72rem; color: var(--text-muted);">${e.sellerCity} (${e.distanceKm} km)</span></td>
            <td>${e.quantity} ${unit}</td>
            <td><strong>₹${e.totalLandedCost.toLocaleString('en-IN')}</strong></td>
            <td>${statusBadge}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderSellerEnquiries() {
    const tbody = document.getElementById('seller-enquiries-tbody');
    if (!tbody) return;

    // Filter enquiries where this company is the seller
    const companyName = loggedInCompany ? loggedInCompany.name : '';
    const list = enquiriesDb.filter(e => e.sellerCompany === companyName);

    // Sort by newest first
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    tbody.innerHTML = '';
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">No incoming trade offers received yet.</td></tr>`;
        return;
    }

    list.forEach(e => {
        const tr = document.createElement('tr');
        
        let statusBadge = '';
        let actionContent = '';

        if (e.status === 'pending') {
            statusBadge = `<span class="badge purity-badge purity-low">🟡 Pending Action</span>`;
            actionContent = `
                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    <button class="btn btn-primary btn-sm btn-deal-confirm" onclick="handleDealAction('${e.id}', 'confirm')" style="padding: 4px 8px; font-size: 0.72rem; width: auto; height: auto; font-weight: 700;">Yes</button>
                    <button class="btn btn-secondary btn-sm btn-deal-decline" onclick="handleDealAction('${e.id}', 'decline')" style="padding: 4px 8px; font-size: 0.72rem; width: auto; height: auto; background: #fee2e2; color: #ef4444; border: 1px solid #fca5a5; font-weight: 700;">No</button>
                </div>
            `;
        } else if (e.status === 'confirmed') {
            statusBadge = `<span class="badge purity-badge purity-high">🟢 Deal Confirmed</span>`;
            actionContent = `<span style="font-size: 0.78rem; color: #15803d; font-weight: 700; display: block; text-align: right;">Accepted ✓</span>`;
        } else {
            statusBadge = `<span class="badge purity-badge purity-poor">🔴 Declined</span>`;
            actionContent = `<span style="font-size: 0.78rem; color: #b91c1c; font-weight: 700; display: block; text-align: right;">Declined</span>`;
        }

        const unit = getMaterialUnit(e.material);

        tr.innerHTML = `
            <td><strong>${e.buyerCompany}</strong><br><span style="font-size: 0.72rem; color: var(--text-muted);">${e.buyerCity}</span></td>
            <td><strong>${e.material}</strong><br><span style="font-size: 0.72rem; color: var(--text-muted);">${e.purity}% Grade</span></td>
            <td>${e.quantity} ${unit}</td>
            <td><strong>₹${e.totalLandedCost.toLocaleString('en-IN')}</strong></td>
            <td>${statusBadge}</td>
            <td>${actionContent}</td>
        `;
        tbody.appendChild(tr);
    });
}

function handleDealAction(enquiryId, action) {
    const enquiry = enquiriesDb.find(e => e.id === enquiryId);
    if (!enquiry) {
        showToast("Trade deal proposal not found.", "error");
        return;
    }

    if (action === 'confirm') {
        enquiry.status = 'confirmed';
        
        // Subtract lot inventory if listing matches
        const listing = listingsDb.find(l => l.companyName === enquiry.sellerCompany && l.material === enquiry.material);
        if (listing) {
            listing.quantity = Math.max(0, listing.quantity - enquiry.quantity);
        }

        showToast("Trade deal confirmed successfully! ✓", "success");
    } else if (action === 'decline') {
        enquiry.status = 'rejected';
        showToast("Trade proposal declined.", "warning");
    }

    // Refresh active components
    renderSellerEnquiries();
    renderBuyerEnquiries();
    renderSellerDatabase();
    updateLandingStats(); // Refresh general counters
}

// ==========================================================================
   // --- 9. SELLER PUBLISH LOTS CONTROLLERS ---
// ==========================================================================
async function addSellerListing(event) {
    event.preventDefault();

    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.classList.add('btn-loading');

    const companyName = document.getElementById('sell-company-select').value;
    const category = document.getElementById('sell-category-select').value;
    const material = document.getElementById('sell-material-select').value;
    const purity = parseFloat(document.getElementById('sell-purity').value);
    const quantity = parseFloat(document.getElementById('sell-quantity').value);
    const price = parseFloat(document.getElementById('sell-price').value);
    const transportRate = parseFloat(document.getElementById('sell-transport').value);
    const allowAuction = document.getElementById('sell-allow-auction').checked;

    // Find city from companies database
    const matchCompany = companiesDb.find(c => c.name === companyName);
    if (!matchCompany) {
        showToast("Company verification profile not found.", "error");
        if (submitBtn) submitBtn.classList.remove('btn-loading');
        return;
    }

    if (isNaN(purity) || isNaN(quantity) || isNaN(price) || isNaN(transportRate) || 
        purity <= 0 || quantity <= 0 || price <= 0 || transportRate <= 0) {
        showToast("Inputs must be positive numeric values.", "warning");
        if (submitBtn) submitBtn.classList.remove('btn-loading');
        return;
    }

    const newListing = {
        companyName: companyName,
        companyId: matchCompany.id,
        city: matchCompany.city,
        category: category,
        material: material,
        purity: purity,
        quantity: quantity,
        price: price,
        transportRate: transportRate,
        allowAuction: allowAuction,
        active: true,
        createdAt: new Date()
    };

    if (firebaseEnabled) {
        try {
            await addDoc(collection(db, "listings"), {
                ...newListing,
                createdAt: serverTimestamp()
            });
        } catch (err) {
            console.error("Listing save failed.", err);
            showToast("Failed to write listing to Cloud Store.", "error");
        }
    } else {
        newListing.id = `l${listingsDb.length + 1}`;
        listingsDb.push(newListing);
        
        // Force offline refresh
        renderSellerDatabase();
        updateLandingStats();
        showToast("By-product listing published successfully ✓", "success");
    }

    // Reset Form
    document.getElementById('seller-listing-form').reset();
    updateFormMaterialDropdown();
    if (submitBtn) submitBtn.classList.remove('btn-loading');
}

function renderSellerAuctions() {
    const box = document.getElementById('seller-auctions-box');
    const container = document.getElementById('seller-auctions-container');
    if (!box || !container || !loggedInCompany) return;

    // Find active auctions for this seller
    const activeAuctions = auctionsDb.filter(a => a.sellerCompany === loggedInCompany.name && a.status === 'active');

    if (activeAuctions.length === 0) {
        box.style.display = 'none';
        container.innerHTML = '';
        return;
    }

    box.style.display = 'block';
    container.innerHTML = '';

    activeAuctions.forEach(auc => {
        const unit = getMaterialUnit(auc.material);
        const topBid = auc.bids.length > 0 ? [...auc.bids].sort((a, b) => b.price - a.price)[0] : null;
        const topBidPrice = topBid ? topBid.price : auc.reservePrice;
        const reserveMet = topBidPrice >= auc.reservePrice;
        
        // SPCB geography metrics
        const stateCounts = {};
        const uniqueBidders = new Set();
        auc.bids.forEach(bid => {
            uniqueBidders.add(bid.bidderName);
            const cityInfo = citiesDb[bid.bidderCity];
            const state = cityInfo ? cityInfo.state : 'Unknown';
            if (!stateCounts[state]) stateCounts[state] = new Set();
            stateCounts[state].add(bid.bidderName);
        });

        const geoMetrics = Object.keys(stateCounts).map(state => {
            return `${state}: ${stateCounts[state].size} plant${stateCounts[state].size > 1 ? 's' : ''}`;
        }).join(', ');

        const card = document.createElement('div');
        card.className = 'auction-seller-card';
        card.style = 'border: 1px solid var(--border-color); border-radius: 8px; padding: 15px; background: rgba(15, 23, 42, 0.02); display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px;';
        
        // Add timer countdown for seller view
        const remainingMs = new Date(auc.deadline) - new Date();
        let countdownStr = "Expired";
        if (remainingMs > 0) {
            const hrs = Math.floor(remainingMs / 3600000);
            const mins = Math.floor((remainingMs % 3600000) / 60000);
            const secs = Math.floor((remainingMs % 60000) / 1000);
            countdownStr = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <h4 style="margin: 0; font-size: 1rem; color: #0f172a;">${auc.material} (${auc.purity}% Purity)</h4>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">Lot Qty: ${auc.quantity} ${unit} | Reserve: ₹${auc.reservePrice.toLocaleString('en-IN')}/${unit}</span>
                </div>
                <span class="badge" style="background: var(--accent-light); color: var(--accent); font-weight: 700;">⏱️ ${countdownStr}</span>
            </div>
            
            <div class="grid-3-cols" style="gap: 10px; margin: 5px 0;">
                <div style="background: var(--bg-secondary); padding: 8px; border-radius: 6px; text-align: center; border: 1px solid var(--border-color);">
                    <small style="font-size: 0.65rem; color: var(--text-muted); display: block;">UNIQUE BIDDERS</small>
                    <strong>${uniqueBidders.size} Bidders</strong>
                </div>
                <div style="background: var(--bg-secondary); padding: 8px; border-radius: 6px; text-align: center; border: 1px solid var(--border-color);">
                    <small style="font-size: 0.65rem; color: var(--text-muted); display: block;">TOTAL BIDS</small>
                    <strong>${auc.bids.length} placed</strong>
                </div>
                <div style="background: var(--bg-secondary); padding: 8px; border-radius: 6px; text-align: center; border: 1px solid var(--border-color);">
                    <small style="font-size: 0.65rem; color: var(--text-muted); display: block;">HIGHEST BID</small>
                    <strong style="color: var(--accent);">₹${topBidPrice.toLocaleString('en-IN')}/${unit}</strong>
                </div>
            </div>

            <div style="font-size: 0.75rem; line-height: 1.4;">
                <div><strong>Reserve Status:</strong> ${reserveMet ? '<span style="color:#16a34a; font-weight:700;">MET ✓</span>' : '<span style="color:#ef4444; font-weight:700;">PENDING ⏳</span>'}</div>
                <div><strong>SPCB Interstate Flow:</strong> <span style="color: var(--text-secondary);">${geoMetrics || 'None yet'}</span></div>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 5px;">
                <button class="btn btn-primary btn-sm accept-winner-btn" style="flex:1; justify-content:center; padding:8px; font-size:0.72rem; height:auto; width: auto;">Accept Winner</button>
                <button class="btn btn-secondary btn-sm monitor-btn" style="flex:1; justify-content:center; padding:8px; font-size:0.72rem; height:auto; width: auto; border-color: var(--accent); color: var(--accent);">Monitor Room</button>
                <button class="btn btn-secondary btn-sm extend-timer-btn" style="flex:1; justify-content:center; padding:8px; font-size:0.72rem; height:auto; width: auto;">Extend</button>
            </div>
        `;

        // Action bindings
        card.querySelector('.monitor-btn').addEventListener('click', () => {
            openAuctionRoom(auc.listingId);
        });

        card.querySelector('.accept-winner-btn').addEventListener('click', () => {
            if (confirm(`Are you sure you want to close this auction immediately and accept the current top bid?`)) {
                closeAuction(auc.id);
            }
        });

        card.querySelector('.extend-timer-btn').addEventListener('click', () => {
            auc.deadline = new Date(new Date(auc.deadline).getTime() + 24 * 60 * 60 * 1000);
            showToast("Auction duration extended by +24 hours ✓", "success");
            renderSellerAuctions();
        });

        container.appendChild(card);
    });
}
window.renderSellerAuctions = renderSellerAuctions;

function renderSellerDatabase() {
    const tbody = document.getElementById('seller-db-tbody');
    if (!tbody || !loggedInCompany) return;

    // Render active auctions
    renderSellerAuctions();

    tbody.innerHTML = '';

    // Filter only listings corresponding to this company
    const myOffers = listingsDb.filter(l => l.companyName === loggedInCompany.name && l.active !== false);

    if (myOffers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted);">No active by-product listings published.</td></tr>`;
        return;
    }

    [...myOffers].reverse().forEach(item => {
        const unit = getMaterialUnit(item.material);
        const tr = document.createElement('tr');
        
        const isLiveAuction = item.status === 'auction_live';
        const auctionControl = isLiveAuction
            ? `<button class="btn btn-secondary btn-sm monitor-listing-btn animate-btn" style="width:auto; border-color:var(--accent); color:var(--accent); margin-right:8px; padding:4px 8px; font-size:0.72rem; height:auto; display:inline-block; vertical-align:middle;" onclick="openAuctionRoom('${item.id}')">👁️ Monitor Room</button>`
            : `<button class="btn btn-primary btn-sm start-auction-btn animate-btn" style="width:auto; background:var(--accent); color:#fff; border:none; margin-right:8px; padding:4px 8px; font-size:0.72rem; height:auto; display:inline-block; vertical-align:middle;">🔥 Start Auction</button>`;

        tr.innerHTML = `
            <td><strong>${item.material}</strong></td>
            <td>${item.purity}%</td>
            <td>${item.quantity} ${unit}</td>
            <td>₹${item.price.toLocaleString('en-IN')}/${unit}</td>
            <td>₹${item.transportRate.toFixed(2)}/km/${unit}</td>
            <td>${citiesDb[item.city].state} (${item.city})</td>
            <td style="text-align: right; white-space: nowrap;">
                ${auctionControl}
                <button class="btn btn-secondary btn-sm delete-listing-btn" style="width:auto; color:var(--color-error); border-color:var(--color-error-border); display:inline-block; vertical-align:middle;">Remove</button>
            </td>
        `;

        // Bind start auction action
        const startBtn = tr.querySelector('.start-auction-btn');
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                startLiveAuctionManually(item.id);
            });
        }

        // Bind delete action
        tr.querySelector('.delete-listing-btn').addEventListener('click', async (e) => {
            e.stopPropagation();
            if (confirm(`Remove listing of "${item.material}"?`)) {
                await removeSellerListing(item.id);
            }
        });

        tbody.appendChild(tr);
    });
}

async function removeSellerListing(listingId) {
    if (firebaseEnabled) {
        try {
            // Soft delete in Firestore
            await updateDoc(doc(db, "listings", listingId), {
                active: false
            });
            showToast("Listing removed successfully ✓", "success");
        } catch (err) {
            console.error("Listing remove failed.", err);
            showToast("Failed to delete listing from Cloud Store.", "error");
        }
    } else {
        const item = listingsDb.find(l => l.id === listingId);
        if (item) {
            item.active = false;
            renderSellerDatabase();
            updateLandingStats();
            showToast("Listing removed successfully ✓", "success");
        }
    }
}

// ==========================================================================
   // --- 10. COMPANY ONBOARDING AND REGISTRATION ---
// ==========================================================================
async function handleLandingRegister(event) {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.classList.add('btn-loading');

    const role = document.getElementById('land-reg-role').value;
    const name = document.getElementById('land-reg-name').value.trim();
    const sector = document.getElementById('land-reg-sector').value;
    const city = document.getElementById('land-reg-location').value;
    const gstin = document.getElementById('land-reg-gstin').value.trim().toUpperCase();
    const email = document.getElementById('land-reg-email').value.trim().toLowerCase();
    const spcb = document.getElementById('land-reg-spcb').value.trim().toUpperCase();
    const pin = document.getElementById('land-reg-pin').value;

    // GSTIN validity check
    if (!validateGSTIN(gstin)) {
        showToast("Invalid GSTIN formatting. Please verify.", "error");
        const gstinInput = document.getElementById('land-reg-gstin');
        if (gstinInput) {
            gstinInput.classList.add('shake-error');
            gstinInput.addEventListener('animationend', () => gstinInput.classList.remove('shake-error'), { once: true });
        }
        if (submitBtn) submitBtn.classList.remove('btn-loading');
        return;
    }

    // SPCB validity check
    const spcbRegex = /^SPCB\/HW\/[A-Z]{3}\/[0-9]{4}\/[0-9]{4}$/;
    if (!spcbRegex.test(spcb)) {
        showToast("Invalid SPCB Authorization format. Please verify.", "error");
        const spcbInput = document.getElementById('land-reg-spcb');
        if (spcbInput) {
            spcbInput.classList.add('shake-error');
            spcbInput.addEventListener('animationend', () => spcbInput.classList.remove('shake-error'), { once: true });
        }
        if (submitBtn) submitBtn.classList.remove('btn-loading');
        return;
    }

    // PIN check
    if (pin.length !== 4 || isNaN(pin)) {
        showToast("Security PIN must be exactly 4 digits.", "warning");
        if (submitBtn) submitBtn.classList.remove('btn-loading');
        return;
    }

    // Name conflict validation
    const exists = companiesDb.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
        showToast("Plant name already onboarded in system.", "error");
        if (submitBtn) submitBtn.classList.remove('btn-loading');
        return;
    }

    const newCompany = {
        name,
        sector,
        city,
        gstin,
        email,
        spcb,
        role,
        pin,
        verified: true,
        registeredAt: new Date()
    };

    let companyId = '';

    if (firebaseEnabled) {
        try {
            const docRef = await addDoc(collection(db, "companies"), {
                ...newCompany,
                registeredAt: serverTimestamp()
            });
            companyId = docRef.id;
            
            // Reload companies local list
            const snap = await getDocs(collection(db, "companies"));
            let list = [];
            snap.forEach(doc => {
                const data = doc.data();
                list.push({
                    id: doc.id,
                    ...data,
                    registeredAt: data.registeredAt ? data.registeredAt.toDate() : new Date()
                });
            });
            companiesDb = list;
        } catch (err) {
            console.error("Onboarding failed.", err);
            showToast("Failed to synchronize onboarding records.", "error");
            if (submitBtn) submitBtn.classList.remove('btn-loading');
            return;
        }
    } else {
        companyId = `c${companiesDb.length + 1}`;
        companiesDb.push({ id: companyId, ...newCompany });
        updateLoginCompanyDropdown();
        updateLandingStats();
    }

    showToast(`Plant "${name}" registered successfully ✓`, "success");
    document.getElementById('landing-registration-form').reset();
    const indicator = document.getElementById('gst-indicator');
    if (indicator) indicator.innerText = '';
    
    if (submitBtn) submitBtn.classList.remove('btn-loading');

    // Sync dropdowns and statistics metrics across the UI
    updateLoginCompanyDropdown();
    updateLandingStats();

    // Resolve B2B profile matching reference
    const registeredCompany = companiesDb.find(c => c.name === name);
    if (registeredCompany) {
        loggedInCompany = registeredCompany;
    } else {
        // Fallback placeholder profile
        loggedInCompany = {
            id: companyId,
            name: name,
            sector: sector,
            city: city,
            gstin: gstin,
            email: email,
            role: role,
            pin: pin,
            verified: true,
            registeredAt: new Date()
        };
    }

    // Auto Login!
    loginPortal(role === 'both' ? 'buyer' : role, name);
}

// ==========================================================================
   // --- 11. B2B VERIFIED DIRECTORY CONTROLLER ---
// ==========================================================================
function renderDirectory() {
    const tbody = document.getElementById('directory-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    [...companiesDb].reverse().forEach((comp, index) => {
        const tr = document.createElement('tr');
        tr.style.animationDelay = `${index * 50}ms`;

        const dateStr = comp.registeredAt ? comp.registeredAt.toLocaleDateString('en-IN') : '28/05/2026';

        tr.innerHTML = `
            <td><strong>${comp.name}</strong> <span class="gst-verified-chip">✓ Verified GST</span></td>
            <td><span class="badge badge-green">${comp.sector.split(' ')[0]}</span></td>
            <td>📍 ${comp.city} (${citiesDb[comp.city].state})</td>
            <td><code>${comp.gstin}</code></td>
            <td>📧 <a href="mailto:${comp.email}">${comp.email}</a></td>
            <td>${dateStr}</td>
        `;
        tbody.appendChild(tr);
    });
}

function filterDirectoryTable() {
    const queryStr = document.getElementById('directory-search').value.toLowerCase();
    const rows = document.querySelectorAll('#directory-tbody tr');

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        if (text.includes(queryStr)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// ==========================================================================
   // --- 12. TAB SWITCH MECHANICS ---
// ==========================================================================
function switchTab(tabId) {
    // Remove active styles
    document.querySelectorAll('#header-nav-tabs .nav-item').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

    const activeTabBtn = document.querySelector(`#header-nav-tabs .nav-item[data-tab="${tabId}"]`);
    const activePane = document.getElementById(`tab-${tabId}`);

    if (activeTabBtn) activeTabBtn.classList.add('active');
    if (activePane) activePane.classList.add('active');

    // Tab-specific routines
    if (tabId === 'home') {
        renderBuyerEnquiries();
    } else if (tabId === 'simulator') {
        updateMaterialDropdown();
        selectedListing = null;
        document.getElementById('selection-card').style.display = 'none';
        renderDefaultMapConnectionInfo();
        initLeafletMap();
    } else if (tabId === 'seller-portal') {
        updateFormSellerDropdown();
        updateFormMaterialDropdown();
        renderSellerDatabase();
        renderSellerEnquiries();
    } else if (tabId === 'directory') {
        renderDirectory();
    }

    // Access lock restrictions
    updateTabAccess();
}

function updateTabAccess() {
    const navMarket = document.querySelector('#header-nav-tabs .nav-item[data-tab="simulator"]');
    const navSeller = document.querySelector('#header-nav-tabs .nav-item[data-tab="seller-portal"]');

    const activeTabBtn = document.querySelector('#header-nav-tabs .nav-item.active');
    const activeTabId = activeTabBtn ? activeTabBtn.getAttribute('data-tab') : 'home';

    if (navMarket && navSeller) {
        if (currentRole === 'buyer') {
            // Enforce Buyer workspace: Hide Seller, show Marketplace
            navMarket.style.display = 'block';
            navMarket.style.opacity = '1';
            navMarket.title = '';
            
            navSeller.style.display = 'none';

            if (activeTabId === 'seller-portal') {
                switchTab('simulator');
            }
            applyRestrictedOverlay('tab-simulator', false);
            applyRestrictedOverlay('tab-seller-portal', false);
        } else {
            // Enforce Seller workspace: Hide Marketplace, show Seller Portal
            navSeller.style.display = 'block';
            navSeller.style.opacity = '1';
            navSeller.title = '';
            
            navMarket.style.display = 'none';

            if (activeTabId === 'simulator') {
                switchTab('seller-portal');
            }
            applyRestrictedOverlay('tab-simulator', false);
            applyRestrictedOverlay('tab-seller-portal', false);
        }
    }
}



function applyRestrictedOverlay(tabPaneId, isRestricted, requiredRoleName, paneName) {
    const pane = document.getElementById(tabPaneId);
    if (!pane) return;

    const oldOverlay = pane.querySelector('.tab-restricted-overlay');
    if (oldOverlay) oldOverlay.remove();

    if (isRestricted) {
        const overlay = document.createElement('div');
        overlay.className = 'tab-restricted-overlay';
        overlay.innerHTML = `
            <div class="card restricted-warning-card" style="max-width: 440px; text-align: center; padding: 32px;">
                <span style="font-size: 3rem; display: block; margin-bottom: 16px;">🔒</span>
                <h3 style="font-size: 1.25rem; margin-bottom: 8px;">Workspace Restricted</h3>
                <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 20px;">
                    The <strong>${paneName}</strong> requires active access to the <strong>${requiredRoleName}</strong>.
                </p>
                <button class="btn btn-primary" onclick="setRole('${requiredRoleName.toLowerCase().split(' ')[0]}')">
                    Switch to ${requiredRoleName}
                </button>
            </div>
        `;
        pane.appendChild(overlay);
    }
}

function setRole(role) {
    currentRole = role;

    // Switch Header switcher
    const btnBuyer = document.getElementById('role-btn-buyer');
    const btnSeller = document.getElementById('role-btn-seller');
    if (btnBuyer && btnSeller) {
        if (role === 'buyer') {
            btnBuyer.classList.add('active');
            btnSeller.classList.remove('active');
        } else {
            btnBuyer.classList.remove('active');
            btnSeller.classList.add('active');
        }
    }

    updateTabAccess();
}

// ==========================================================================
   // --- 13. DYNAMIC DROPDOWN HELPERS ---
// ==========================================================================
function updateMaterialDropdown() {
    const category = document.getElementById('sim-category').value;
    const select = document.getElementById('sim-material');
    if (!select) return;

    select.innerHTML = '';
    const list = byproductCategories[category] || [];
    list.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.innerText = item;
        select.appendChild(opt);
    });

    runCostEngine();
}

function updateFormMaterialDropdown() {
    const category = document.getElementById('sell-category-select').value;
    const select = document.getElementById('sell-material-select');
    if (!select) return;

    select.innerHTML = '';
    const list = byproductCategories[category] || [];
    list.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.innerText = item;
        select.appendChild(opt);
    });

    updateSellerFormUnits();
}

function updateSellerFormUnits() {
    const materialSelect = document.getElementById('sell-material-select');
    if (!materialSelect) return;
    const material = materialSelect.value;
    if (!material) return;
    const unit = getMaterialUnit(material);
    
    const qtyLabel = document.querySelector('label[for="sell-quantity"]');
    if (qtyLabel) qtyLabel.innerText = `Lot Quantity (${unit})`;
    
    const priceLabel = document.querySelector('label[for="sell-price"]');
    if (priceLabel) priceLabel.innerText = `Base Price (₹/${unit})`;
    
    const transportLabel = document.querySelector('label[for="sell-transport"]');
    if (transportLabel) transportLabel.innerText = `Transport Freight Rate (₹/km/${unit})`;
}

function updateFormSellerDropdown() {
    const select = document.getElementById('sell-company-select');
    if (!select || !loggedInCompany) return;

    select.innerHTML = '';
    
    // Fill option and select logged in company
    const opt = document.createElement('option');
    opt.value = loggedInCompany.name;
    opt.innerText = `${loggedInCompany.name} (${loggedInCompany.city}, ${citiesDb[loggedInCompany.city].state})`;
    select.appendChild(opt);
}

function setLoginRole(role) {
    loginRole = role;
    const tabBuyer = document.getElementById('login-tab-buyer');
    const tabSeller = document.getElementById('login-tab-seller');
    if (tabBuyer && tabSeller) {
        if (role === 'buyer') {
            tabBuyer.classList.add('active');
            tabSeller.classList.remove('active');
        } else {
            tabBuyer.classList.remove('active');
            tabSeller.classList.add('active');
        }
    }
    updateLoginCompanyDropdown();
}

function autoFillDemoPin() {
    const pinInput = document.getElementById('login-pin');
    if (pinInput) {
        pinInput.value = '1234';
        pinInput.classList.add('has-value');
        showToast("Demo Security PIN 1234 auto-filled ✓", "info");
    }
}

function updateLoginCompanyDropdown() {
    const select = document.getElementById('login-company-select');
    if (!select) return;

    const currentSelected = select.value;
    select.innerHTML = '<option value="" disabled' + (!currentSelected ? ' selected' : '') + '>-- Choose Registered Plant Profile --</option>';

    // Filter by active role and sort alphabetically
    const matching = (companiesDb || []).filter(comp => {
        if (loginRole === 'buyer' && comp.role !== 'buyer' && comp.role !== 'both') return false;
        if (loginRole === 'seller' && comp.role !== 'seller' && comp.role !== 'both') return false;
        return true;
    }).sort((a, b) => a.name.localeCompare(b.name));

    const groupLabel = loginRole === 'buyer' ? 'Verified Sourcing Buyers (Procurement)' : 'Verified Industrial Generators (Sellers)';
    const optgroup = document.createElement('optgroup');
    optgroup.label = `⭐ ${groupLabel}`;

    matching.forEach(comp => {
        const opt = document.createElement('option');
        opt.value = comp.name;
        const stateStr = (citiesDb[comp.city] && citiesDb[comp.city].state) ? citiesDb[comp.city].state : comp.city;
        opt.textContent = `${comp.name} — ${comp.city}, ${stateStr}`;
        if (comp.name === currentSelected) {
            opt.selected = true;
        }
        optgroup.appendChild(opt);
    });

    select.appendChild(optgroup);

    // Auto-fill demo PIN
    const pinInput = document.getElementById('login-pin');
    if (pinInput && !pinInput.value) {
        pinInput.value = '1234';
        pinInput.classList.add('has-value');
    }
}


// ==========================================================================
   // --- 14. LOGIN & LOGOUT PORTALS ---
// ==========================================================================
function handleLoginSubmit(event) {
    event.preventDefault();
    const companyName = document.getElementById('login-company-select').value;
    const enteredPin = document.getElementById('login-pin').value;

    const company = companiesDb.find(c => c.name === companyName);
    if (!company) {
        showToast("Company verification profile not found.", "error");
        return;
    }

    // Security PIN authentication verification
    if (company.pin !== enteredPin) {
        showToast("Incorrect Security Access PIN! Authentication failed.", "error");
        
        // Shake animation
        const loginCard = document.querySelector('.login-card');
        if (loginCard) {
            loginCard.classList.add('shake-error');
            loginCard.addEventListener('animationend', () => loginCard.classList.remove('shake-error'), { once: true });
        }
        return;
    }

    // Success Authentication login
    loggedInCompany = company;
    loginPortal(loginRole, companyName);
}

function loginPortal(role, companyName) {
    isLoggedIn = true;
    currentRole = role;

    // Synchronize workspace selectors
    setRole(role);

    // Sourcing locations are auto-bound to the company profile city

    // Welcome Banner details
    const sector = loggedInCompany ? loggedInCompany.sector : 'B2B Enterprise';
    const city = loggedInCompany ? loggedInCompany.city : 'Surat';
    const state = (citiesDb[city] && citiesDb[city].state) ? citiesDb[city].state : 'Gujarat';

    document.getElementById('welcome-company-title').innerText = `Welcome, ${companyName}`;
    document.getElementById('welcome-company-meta').innerText = `${sector} — ${state} Portal`;

    const welcomeSpcb = document.getElementById('welcome-spcb-badge');
    if (welcomeSpcb) {
        if (loggedInCompany && loggedInCompany.spcb) {
            welcomeSpcb.innerText = `SPCB Authorized ✓ (${loggedInCompany.spcb})`;
            welcomeSpcb.style.display = 'inline-block';
        } else {
            welcomeSpcb.style.display = 'none';
        }
    }

    // Toggle Home tab welcome actions buttons based on login role
    const welcomeBtnBuyer = document.getElementById('welcome-btn-buyer');
    const welcomeBtnSeller = document.getElementById('welcome-btn-seller');
    if (welcomeBtnBuyer) {
        welcomeBtnBuyer.style.display = (role === 'buyer') ? 'block' : 'none';
    }
    if (welcomeBtnSeller) {
        welcomeBtnSeller.style.display = (role === 'seller') ? 'block' : 'none';
    }

    // Toggle enquiries container card visibility based on plant profile role
    const buyerEnquiriesBox = document.getElementById('buyer-enquiries-box');
    const sellerEnquiriesBox = document.getElementById('seller-enquiries-box');
    if (buyerEnquiriesBox) {
        buyerEnquiriesBox.style.display = (loggedInCompany && (loggedInCompany.role === 'buyer' || loggedInCompany.role === 'both')) ? 'block' : 'none';
    }
    if (sellerEnquiriesBox) {
        sellerEnquiriesBox.style.display = (loggedInCompany && (loggedInCompany.role === 'seller' || loggedInCompany.role === 'both')) ? 'block' : 'none';
    }

    // Pre-render the tables
    renderBuyerEnquiries();
    renderSellerEnquiries();

    // Start transition
    const landing = document.getElementById('landing-container');
    const app = document.getElementById('app-container');

    if (landing && app) {
        landing.classList.add('slide-up');
        
        // Enable viewport displaying and trigger fade scale transitions
        app.style.display = 'flex';
        app.style.position = 'fixed';
        app.style.width = '100vw';
        app.style.height = '100vh';
        app.offsetHeight; // force reflow

        setTimeout(() => {
            app.classList.add('active');
            
            setTimeout(() => {
                landing.style.display = 'none';
                app.style.position = '';
                app.style.width = '';
                app.style.height = '';
                
                // Route to respective workspace
                if (role === 'buyer') {
                    switchTab('simulator');
                } else {
                    switchTab('seller-portal');
                }
            }, 600);
        }, 50);

        showToast(`Logged in successfully as "${companyName}" ✓`, "success");
        document.getElementById('login-pin').value = '';
    }
}

function logoutPortal() {
    isLoggedIn = false;
    loggedInCompany = null;

    const landing = document.getElementById('landing-container');
    const app = document.getElementById('app-container');

    if (landing && app) {
        // Prepare landing display
        landing.style.display = 'flex';
        landing.offsetHeight; // force reflow

        app.classList.remove('active');
        landing.classList.remove('slide-up');
        
        app.style.position = 'fixed';
        app.style.width = '100vw';
        app.style.height = '100vh';

        setTimeout(() => {
            app.style.display = 'none';
            app.style.position = '';
            app.style.width = '';
            app.style.height = '';
            
            updateLoginCompanyDropdown();
            updateLandingStats();
        }, 600);

        showToast("Logged out successfully.", "info");
    }
}

// ==========================================================================
   // --- 15. WINDOW CONTROLLERS & SCROLL TRIGGERS ---
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
    // Populate login portal dropdown immediately on DOM load
    updateLoginCompanyDropdown();
    const loginSelect = document.getElementById('login-company-select');
    if (loginSelect) {
        loginSelect.addEventListener('change', () => {
            const pinInput = document.getElementById('login-pin');
            if (pinInput) {
                pinInput.value = '1234';
                pinInput.classList.add('has-value');
            }
        });
    }
    // Initialize theme state immediately on page load
    initTheme();

    // Start DB Connection
    initDatabase();

    // Bind category changes to update material dropdowns
    const simCat = document.getElementById('sim-category');
    if (simCat) simCat.addEventListener('change', updateMaterialDropdown);

    const sellCat = document.getElementById('sell-category-select');
    if (sellCat) sellCat.addEventListener('change', updateFormMaterialDropdown);

    const sellMat = document.getElementById('sell-material-select');
    if (sellMat) sellMat.addEventListener('change', updateSellerFormUnits);

    // Initial load configurations
    updateMaterialDropdown();
    renderMarketPriceIndex();

    // Observer setup for scroll elements
    initScrollReveal();

    // Initialize hyper-futuristic visual background canvas engine
    try {
        new CanvasEngine();
    } catch (e) {
        console.error("CanvasEngine initialization failed:", e);
    }
    
    // Auto-run walkthrough demo steps if URL query param is active
    if (typeof initDemoStep === 'function') {
        initDemoStep();
    }
});

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('theme') || urlParams.get('demo_step') || urlParams.get('no_reveal')) {
        reveals.forEach(el => el.classList.add('reveal-active'));
        triggerStatsAnimation();
    }
    if (typeof IntersectionObserver === 'undefined') {
        reveals.forEach(el => el.classList.add('reveal-active'));
        triggerStatsAnimation();
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                if (entry.target.id === 'stats-section' && !entry.target.classList.contains('stats-animated')) {
                    entry.target.classList.add('stats-animated');
                    triggerStatsAnimation();
                }
            }
        });
    }, {
        threshold: 0.1
    });

    reveals.forEach(el => observer.observe(el));
    
    // Trigger active reveals initially on viewport
    setTimeout(() => {
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                el.classList.add('reveal-active');
                if (el.id === 'stats-section' && !el.classList.contains('stats-animated')) {
                    el.classList.add('stats-animated');
                    triggerStatsAnimation();
                }
            }
        });
    }, 100);
}

// Scroll selectors
function scrollToRegistration() {
    const onboard = document.getElementById('onboard-section');
    if (onboard) onboard.scrollIntoView({ behavior: 'smooth' });
}

function scrollToHeroLogin() {
    const heroLogin = document.getElementById('hero-login-card-container');
    if (heroLogin) heroLogin.scrollIntoView({ behavior: 'smooth' });
}

function scrollToHowItWorks() {
    const how = document.getElementById('how-it-works-section');
    if (how) how.scrollIntoView({ behavior: 'smooth' });
}

function scrollToListByProduct() {
    const onboard = document.getElementById('onboard-section');
    if (onboard) {
        onboard.scrollIntoView({ behavior: 'smooth' });
        const roleSelect = document.getElementById('land-reg-role');
        if (roleSelect) {
            roleSelect.value = 'seller';
            roleSelect.dispatchEvent(new Event('change'));
            const nameInput = document.getElementById('land-reg-name');
            if (nameInput) setTimeout(() => nameInput.focus(), 800);
        }
    }
}

function toggleMobileNav() {
    const nav = document.getElementById('header-nav-tabs');
    const toggle = document.getElementById('hamburger-toggle');
    if (nav && toggle) {
        nav.classList.toggle('mobile-open');
        toggle.classList.toggle('active');
    }
}

function closeMobileNav() {
    const nav = document.getElementById('header-nav-tabs');
    const toggle = document.getElementById('hamburger-toggle');
    if (nav && toggle) {
        nav.classList.remove('mobile-open');
        toggle.classList.remove('active');
    }
}

// Global scope export exposure for inline HTML trigger functions
window.switchTab = switchTab;
window.setRole = setRole;
window.setLoginRole = setLoginRole;
window.handleLoginSubmit = handleLoginSubmit;
window.logoutPortal = logoutPortal;
window.handleLandingRegister = handleLandingRegister;
window.addSellerListing = addSellerListing;
window.filterDirectoryTable = filterDirectoryTable;
window.initiateProcurementDrawer = initiateProcurementDrawer;
window.closeCheckoutDrawer = closeCheckoutDrawer;
window.updateCheckoutTotal = updateCheckoutTotal;
window.submitFinalProcedure = submitFinalProcedure;
window.runCostEngine = runCostEngine;
window.updateSellerFormUnits = updateSellerFormUnits;
window.scrollToRegistration = scrollToRegistration;
window.scrollToHeroLogin = scrollToHeroLogin;
window.scrollToHowItWorks = scrollToHowItWorks;
window.scrollToListByProduct = scrollToListByProduct;
window.toggleMobileNav = toggleMobileNav;
window.closeMobileNav = closeMobileNav;
window.handleDealAction = handleDealAction;
window.renderBuyerEnquiries = renderBuyerEnquiries;
window.renderSellerEnquiries = renderSellerEnquiries;

// Custom Added B2B Compliance & Blending & WhatsApp functions exports
window.triggerCheckoutSPCBPrecheck = triggerCheckoutSPCBPrecheck;
window.triggerAuctionSPCBPrecheck = triggerAuctionSPCBPrecheck;
window.toggleReceiptView = toggleReceiptView;
window.addBlendSlot = addBlendSlot;
window.removeBlendSlot = removeBlendSlot;
window.clearBlendSlots = clearBlendSlots;
window.calculateBlend = calculateBlend;
window.populateBlendDropdowns = populateBlendDropdowns;
window.triggerWhatsAppAlert = triggerWhatsAppAlert;
window.dismissWhatsAppAlert = dismissWhatsAppAlert;
window.focusAuctionBidInput = focusAuctionBidInput;
window.toggleManifesto = toggleManifesto;

function toggleManifesto(show) {
    const overlay = document.getElementById('manifesto-overlay');
    const drawer = document.getElementById('manifesto-drawer');
    if (overlay && drawer) {
        if (show) {
            overlay.classList.add('active');
            drawer.classList.add('active');
        } else {
            overlay.classList.remove('active');
            drawer.classList.remove('active');
        }
    }
}

// ==========================================================================
// --- SPCB COMPLIANCE & BLENDING & WHATSAPP ENGINE IMPLEMENTATIONS ---
// ==========================================================================

function triggerCheckoutSPCBPrecheck() {
    if (!selectedListing) return;
    const precheckOverlay = document.getElementById('checkout-spcb-precheck');
    const precheckText = document.getElementById('checkout-spcb-status-text');
    const chkFormSubmitBtn = document.querySelector('#checkout-form button[type="submit"]');
    const loader = precheckOverlay ? precheckOverlay.querySelector('.spcb-spinner-loader') : null;

    if (precheckOverlay && precheckText) {
        precheckOverlay.style.display = 'flex';
        if (loader) loader.style.display = 'block';
        precheckText.innerHTML = `<span style="color:var(--accent);">●</span> SPCB Authorization verification in progress...`;
        if (chkFormSubmitBtn) chkFormSubmitBtn.disabled = true;

        setTimeout(() => {
            const buyerCompName = document.getElementById('chk-buyer-company').value;
            const buyer = companiesDb.find(c => c.name === buyerCompName);
            const seller = companiesDb.find(c => c.name === selectedListing.companyName);

            // Auto-assign mock SPCB licenses if missing during demo runs
            if (buyer && !buyer.spcb) {
                buyer.spcb = "SPCB/HW/SUR/2026/0915";
            }
            if (seller && !seller.spcb) {
                seller.spcb = "SPCB/HW/MUM/2026/4910";
            }

            const spcbRegex = /^SPCB\/HW\/[A-Z]{3}\/[0-9]{4}\/[0-9]{4}$/;
            const buyerValid = buyer && buyer.spcb && spcbRegex.test(buyer.spcb);
            const sellerValid = seller && seller.spcb && spcbRegex.test(seller.spcb);

            if (buyerValid && sellerValid) {
                precheckText.innerHTML = `<span class="spcb-spinner-badge">✓ SPCB Compliance Verified</span><br><br>
                <span style="font-size:0.75rem; color:var(--text-secondary);">Sender (Seller): ${seller.spcb}<br>Receiver (Buyer): ${buyer.spcb}</span>`;
                if (loader) loader.style.display = 'none';

                setTimeout(() => {
                    precheckOverlay.style.display = 'none';
                    if (chkFormSubmitBtn) chkFormSubmitBtn.disabled = false;
                }, 1200);
            } else {
                precheckText.innerHTML = `<span style="color:var(--color-error); font-weight:bold;">✕ SPCB Verification Blocked</span><br><br>
                <span style="font-size:0.75rem; color:var(--text-secondary); line-height:1.4;">
                    Environmental flow requires active SPCB Hazardous Waste Authorizations.<br>
                    ${!buyerValid ? '• Buyer license missing or invalid format.<br>' : ''}
                    ${!sellerValid ? '• Seller license missing or invalid format.' : ''}
                </span>`;
                if (loader) loader.style.display = 'none';
            }
        }, 1500);
    }
}

function triggerAuctionSPCBPrecheck(listingId) {
    const listing = listingsDb.find(l => l.id === listingId);
    if (!listing) return;

    const precheckOverlay = document.getElementById('auction-spcb-precheck');
    const precheckText = document.getElementById('auction-spcb-status-text');
    const bidBtn = document.querySelector('#auction-drawer button[onclick^="submitAuctionBid"]');
    const proxyBtn = document.querySelector('#auction-drawer button[onclick^="saveProxyBid"]');
    const loader = precheckOverlay ? precheckOverlay.querySelector('.spcb-spinner-loader') : null;

    if (precheckOverlay && precheckText) {
        precheckOverlay.style.display = 'flex';
        if (loader) loader.style.display = 'block';
        precheckText.innerHTML = `<span style="color:var(--accent);">●</span> SPCB Bidder Authorization verification in progress...`;
        if (bidBtn) bidBtn.disabled = true;
        if (proxyBtn) proxyBtn.disabled = true;

        setTimeout(() => {
            const buyer = loggedInCompany;
            const seller = companiesDb.find(c => c.name === listing.companyName);

            // Auto-assign mock SPCB licenses if missing during demo runs
            if (buyer && !buyer.spcb) {
                buyer.spcb = "SPCB/HW/SUR/2026/0915";
            }
            if (seller && !seller.spcb) {
                seller.spcb = "SPCB/HW/MUM/2026/4910";
            }

            const spcbRegex = /^SPCB\/HW\/[A-Z]{3}\/[0-9]{4}\/[0-9]{4}$/;
            const buyerValid = buyer && buyer.spcb && spcbRegex.test(buyer.spcb);
            const sellerValid = seller && seller.spcb && spcbRegex.test(seller.spcb);

            if (buyerValid && sellerValid) {
                precheckText.innerHTML = `<span class="spcb-spinner-badge">✓ SPCB Bidder Approved</span><br><br>
                <span style="font-size:0.75rem; color:var(--text-secondary);">Bidder License: ${buyer.spcb}</span>`;
                if (loader) loader.style.display = 'none';

                setTimeout(() => {
                    precheckOverlay.style.display = 'none';
                    if (bidBtn) bidBtn.disabled = false;
                    if (proxyBtn) proxyBtn.disabled = false;
                }, 1200);
            } else {
                precheckText.innerHTML = `<span style="color:var(--color-error); font-weight:bold;">✕ SPCB Verification Blocked</span><br><br>
                <span style="font-size:0.75rem; color:var(--text-secondary); line-height:1.4;">
                    Bidding requires active SPCB Hazardous Waste Authorizations.<br>
                    ${!buyerValid ? '• Your corporate plant license is missing or invalid.<br>' : ''}
                    ${!sellerValid ? '• Listing seller license is missing or invalid.' : ''}
                </span>`;
                if (loader) loader.style.display = 'none';
            }
        }, 1500);
    }
}

function toggleReceiptView(viewType) {
    const quoteDoc = document.getElementById('quote-document');
    const manifestDoc = document.getElementById('manifest-document');
    const quoteTab = document.getElementById('receipt-tab-quote');
    const manifestTab = document.getElementById('receipt-tab-manifest');

    if (viewType === 'quote') {
        if (quoteDoc) quoteDoc.style.display = 'block';
        if (manifestDoc) manifestDoc.style.display = 'none';
        if (quoteTab) quoteTab.classList.add('active-tab');
        if (manifestTab) manifestTab.classList.remove('active-tab');
    } else {
        if (quoteDoc) quoteDoc.style.display = 'none';
        if (manifestDoc) manifestDoc.style.display = 'block';
        if (quoteTab) quoteTab.classList.remove('active-tab');
        if (manifestTab) manifestTab.classList.add('active-tab');
    }
}

function populateBlendDropdowns() {
    const selects = document.querySelectorAll('.blend-select');
    selects.forEach(select => {
        const savedVal = select.value;
        select.innerHTML = '<option value="" disabled selected hidden>Select circular lot...</option>';
        
        activeResults.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.id;
            const shortName = item.companyName.split(' ')[0];
            opt.innerText = `${shortName} Plant - Purity: ${item.purity}% (Landed: ₹${item.landedCostPerTonne.toLocaleString('en-IN')}/t)`;
            select.appendChild(opt);
        });

        if (savedVal && activeResults.some(r => r.id === savedVal)) {
            select.value = savedVal;
        }
    });
}

function addBlendSlot() {
    const container = document.getElementById('blend-slots-container');
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'blend-slot-row';
    row.innerHTML = `
        <select class="form-control select-input blend-select" onchange="calculateBlend()" required>
            <!-- Populated dynamically -->
        </select>
        <input type="number" class="form-control blend-volume" placeholder="Volume (t)" min="1" oninput="calculateBlend()" required>
        <button type="button" class="btn-remove-slot" onclick="removeBlendSlot(this)">×</button>
    `;
    container.appendChild(row);
    populateBlendDropdowns();
}

function removeBlendSlot(btn) {
    const row = btn.closest('.blend-slot-row');
    if (row) {
        row.remove();
        calculateBlend();
    }
}

function clearBlendSlots() {
    const container = document.getElementById('blend-slots-container');
    if (container) {
        container.innerHTML = '';
        const resultsBox = document.getElementById('blend-results');
        if (resultsBox) resultsBox.style.display = 'none';
    }
}

function calculateBlend() {
    const rows = document.querySelectorAll('.blend-slot-row');
    const resultsBox = document.getElementById('blend-results');
    if (!resultsBox) return;

    let totalVolume = 0;
    let weightedPuritySum = 0;
    let weightedLandedSum = 0;
    let validSlotsCount = 0;

    rows.forEach(row => {
        const select = row.querySelector('.blend-select');
        const volInput = row.querySelector('.blend-volume');
        const listingId = select ? select.value : '';
        const volume = parseFloat(volInput ? volInput.value : '') || 0;

        if (listingId && volume > 0) {
            const item = activeResults.find(r => r.id === listingId);
            if (item) {
                totalVolume += volume;
                weightedPuritySum += volume * item.purity;
                weightedLandedSum += volume * item.landedCostPerTonne;
                validSlotsCount++;
            }
        }
    });

    if (totalVolume === 0 || validSlotsCount === 0) {
        resultsBox.style.display = 'none';
        return;
    }

    const weightedPurity = Math.round((weightedPuritySum / totalVolume) * 100) / 100;
    const weightedLanded = Math.round((weightedLandedSum / totalVolume) * 100) / 100;

    document.getElementById('blend-out-volume').innerText = `${totalVolume.toLocaleString('en-IN')} MT`;
    document.getElementById('blend-out-purity').innerText = `${weightedPurity.toFixed(2)}%`;
    document.getElementById('blend-out-landed').innerText = `₹${Math.round(weightedLanded).toLocaleString('en-IN')}/t`;

    const statusBadge = document.getElementById('blend-out-status');
    if (statusBadge) {
        statusBadge.className = 'badge';
        if (weightedPurity >= 80) {
            statusBadge.innerText = '✓ Premium Purity Blend Approved';
            statusBadge.style.background = 'var(--color-success-bg)';
            statusBadge.style.color = 'var(--color-success)';
            statusBadge.style.border = '1px solid var(--color-success)';
        } else if (weightedPurity >= 65) {
            statusBadge.innerText = '✓ Standard SPCB Sourcing Approved';
            statusBadge.style.background = 'rgba(59, 130, 246, 0.15)';
            statusBadge.style.color = '#3b82f6';
            statusBadge.style.border = '1px solid #3b82f6';
        } else {
            statusBadge.innerText = '⚠️ Low Purity Mix (Verify Lab Assay Rules)';
            statusBadge.style.background = 'rgba(239, 68, 68, 0.15)';
            statusBadge.style.color = '#ef4444';
            statusBadge.style.border = '1px solid #ef4444';
        }
    }

    resultsBox.style.display = 'block';
}

function triggerWhatsAppAlert(materialName, bidderName, price) {
    const isLoginWhatsapp = document.getElementById('login-whatsapp')?.checked;
    const isRegWhatsapp = document.getElementById('land-reg-whatsapp')?.checked;
    const isWhatsappEnabled = (isLoginWhatsapp !== false) && (isRegWhatsapp !== false);
    if (!isWhatsappEnabled) return;

    const alertText = `TRASURE Alert: You have been outbid on ${materialName} Lot by ${bidderName}. Current price is ₹${price.toLocaleString('en-IN')}/t. Tap to counter-bid.`;
    const alertEl = document.getElementById('wa-alert-text');
    if (alertEl) alertEl.innerText = alertText;
    
    const toast = document.getElementById('whatsapp-mock-chime');
    if (toast) {
        toast.classList.add('active');
    }
}

function dismissWhatsAppAlert() {
    const toast = document.getElementById('whatsapp-mock-chime');
    if (toast) {
        toast.classList.remove('active');
    }
}

function focusAuctionBidInput() {
    dismissWhatsAppAlert();
    const bidInput = document.getElementById('auc-bid-price');
    if (bidInput) {
        bidInput.focus();
        bidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}



// ==========================================================================
//   HYPER-FUTURISTIC HTML5 BACKGROUND CANVAS PARTICLES ENGINE
// ==========================================================================

class CanvasEngine {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.phase = 0; // 0: Torus, 1: DNA, 2: Terrain Grid Wave
        this.maxParticles = 900;
        this.mouse = { x: null, y: null, vx: 0, vy: 0 };
        this.lastMouse = { x: null, y: null };
        this.phaseChangeDuration = 15000; // 15 seconds per phase
        this.transitionTime = 0;
        this.nextPhase = 1;
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        if (getComputedStyle(this.canvas).display === 'none') {
            console.log("CanvasEngine: background canvas is hidden. Deactivating animation loop.");
            return;
        }
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mousedown', () => this.triggerBurst());
        
        // Populate initial particle array
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle(i));
        }
        
        // Start 60fps locked rendering loop
        this.animate(0);
        
        // Automatic phase cycle
        setInterval(() => {
            this.startTransition();
        }, this.phaseChangeDuration);
    }
    
    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }
    
    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        if (this.lastMouse.x !== null) {
            this.mouse.vx = this.mouse.x - this.lastMouse.x;
            this.mouse.vy = this.mouse.y - this.lastMouse.y;
        }
        this.lastMouse.x = this.mouse.x;
        this.lastMouse.y = this.mouse.y;
    }
    
    triggerBurst() {
        if (this.mouse.x === null) return;
        this.particles.forEach(p => {
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 220) {
                const force = (220 - dist) / 8;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }
        });
    }
    
    createParticle(index) {
        return {
            index: index,
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            z: Math.random() * 200 - 100,
            vx: 0,
            vy: 0,
            color: Math.random() > 0.5 ? '#00ff66' : (Math.random() > 0.5 ? '#00f0ff' : '#a3e635'),
            size: Math.random() * 1.6 + 0.8,
            angle: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.02 + 0.005,
            radius: Math.random() * 140 + 60
        };
    }
    
    startTransition() {
        this.isTransitioning = true;
        this.transitionTime = 0;
        this.nextPhase = (this.phase + 1) % 3;
    }
    
    animate(timestamp) {
        requestAnimationFrame((t) => this.animate(t));
        
        // Deep clear page background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Overlap glowing composite operations
        this.ctx.globalCompositeOperation = 'lighter';
        
        // Fade parameters calculation
        if (this.isTransitioning) {
            this.transitionTime += 16;
            if (this.transitionTime >= 1000) {
                this.phase = this.nextPhase;
                this.isTransitioning = false;
            }
        }
        
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const time = timestamp * 0.001;
        
        this.particles.forEach(p => {
            // Apply mouse velocity ripples if mouse cursor is within close range
            if (this.mouse.x !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 120) {
                    p.x += this.mouse.vx * 0.08;
                    p.y += this.mouse.vy * 0.08;
                }
            }
            
            let tx, ty, tz;
            
            // Phase targets coords setup
            if (this.phase === 0) {
                // Phase 1: Swirling Torus Nebula
                const u = (p.index / this.maxParticles) * Math.PI * 2;
                const v = p.angle + time * p.speed;
                const R = 230 + Math.sin(time + u * 3.5) * 25;
                const r = 75 + Math.cos(time * 0.6 + u) * 15;
                
                const x3d = (R + r * Math.cos(v)) * Math.cos(u);
                const y3d = (R + r * Math.cos(v)) * Math.sin(u);
                const z3d = r * Math.sin(v);
                
                const scale = 320 / (320 + z3d);
                tx = centerX + x3d * scale;
                ty = centerY + y3d * scale * 0.78;
                tz = z3d;
            } 
            else if (this.phase === 1) {
                // Phase 2: Double Helix DNA Stream
                const strand = p.index % 2 === 0 ? 1 : -1;
                const progress = (p.index / this.maxParticles);
                const helixY = progress * this.height;
                const helixAngle = progress * Math.PI * 8.5 + time * 1.8 + (strand * Math.PI);
                const radius = 110 + Math.sin(time * 1.2 + progress * 6) * 15;
                
                const x3d = Math.cos(helixAngle) * radius;
                const z3d = Math.sin(helixAngle) * radius;
                
                const scale = 260 / (260 + z3d);
                tx = centerX + x3d * scale;
                ty = helixY;
                tz = z3d;
            } 
            else {
                // Phase 3: Undulating Terrain Grid Wave (Bottom screen wave)
                const cols = 30;
                const col = p.index % cols;
                const row = Math.floor(p.index / cols);
                const rows = this.maxParticles / cols;
                
                const xGrid = (col / (cols - 1)) * this.width;
                const yGrid = this.height * 0.52 + (row / (rows - 1)) * (this.height * 0.48);
                
                const dx = xGrid - centerX;
                const dy = yGrid - (this.height * 0.76);
                const distCenter = Math.sqrt(dx*dx + dy*dy);
                const waveHeight = Math.sin(time * 2.2 + distCenter * 0.016) * 36;
                
                tx = xGrid;
                ty = yGrid + waveHeight;
                tz = waveHeight;
            }
            
            // Interpolate coordinate transition if transitioning
            if (this.isTransitioning) {
                let ntx, nty, ntz;
                const progress = this.transitionTime / 1000;
                
                if (this.nextPhase === 0) {
                    const u = (p.index / this.maxParticles) * Math.PI * 2;
                    const v = p.angle + time * p.speed;
                    const R = 230;
                    const r = 75;
                    const x3d = (R + r * Math.cos(v)) * Math.cos(u);
                    const y3d = (R + r * Math.cos(v)) * Math.sin(u);
                    const z3d = r * Math.sin(v);
                    const scale = 320 / (320 + z3d);
                    ntx = centerX + x3d * scale;
                    nty = centerY + y3d * scale * 0.78;
                    ntz = z3d;
                } else if (this.nextPhase === 1) {
                    const strand = p.index % 2 === 0 ? 1 : -1;
                    const pr = (p.index / this.maxParticles);
                    const helixAngle = pr * Math.PI * 8.5 + time * 1.8 + (strand * Math.PI);
                    const x3d = Math.cos(helixAngle) * 110;
                    const scale = 260 / (260 + Math.sin(helixAngle) * 110);
                    ntx = centerX + x3d * scale;
                    nty = pr * this.height;
                    ntz = Math.sin(helixAngle) * 110;
                } else {
                    const cols = 30;
                    const col = p.index % cols;
                    const row = Math.floor(p.index / cols);
                    const rows = this.maxParticles / cols;
                    const xGrid = (col / (cols - 1)) * this.width;
                    const yGrid = this.height * 0.52 + (row / (rows - 1)) * (this.height * 0.48);
                    const dx = xGrid - centerX;
                    const dy = yGrid - (this.height * 0.76);
                    const distCenter = Math.sqrt(dx*dx + dy*dy);
                    const waveHeight = Math.sin(time * 2.2 + distCenter * 0.016) * 36;
                    ntx = xGrid;
                    nty = yGrid + waveHeight;
                    ntz = waveHeight;
                }
                
                tx = tx + (ntx - tx) * progress;
                ty = ty + (nty - ty) * progress;
                tz = tz + (ntz - tz) * progress;
            }
            
            // Apply coordinates delta forces
            p.vx = (tx - p.x) * 0.088;
            p.vy = (ty - p.y) * 0.088;
            
            p.x += p.vx;
            p.y += p.vy;
            
            // Jitter reduction
            p.x += (Math.random() - 0.5) * 0.2;
            p.y += (Math.random() - 0.5) * 0.2;
            
            // Draw particle circles
            const size = Math.max(0.4, p.size * (150 / (150 + (tz || 0))));
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            
            const alpha = Math.max(0.22, Math.min(1, 1 - (tz || 0) / 280));
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = alpha;
            this.ctx.fill();
        });
        
        // Decay speed
        this.mouse.vx *= 0.94;
        this.mouse.vy *= 0.94;
    }
}

// ==========================================================================
// --- 16. B2B LIVE AUCTION ENGINE CORE LOGIC ---
// ==========================================================================
let activeAuctionId = null;
let originalBiddingControlsHTML = null;
let competitorSimulationTimeout = null;
let auctionTimerInterval = null;

function openAuctionRoom(listingId) {
    // Auto-login fallback if not logged in
    if (!loggedInCompany) {
        const company = companiesDb.find(c => c.id === 'c3') || companiesDb.find(c => c.id === 'c1');
        if (company) {
            loggedInCompany = company;
            isLoggedIn = true;
            currentRole = 'buyer';
            setRole('buyer');

            // Update welcome banner
            document.getElementById('welcome-company-title').innerText = `Welcome, ${company.name}`;
            const sector = company.sector;
            const city = company.city;
            const state = (citiesDb[city] && citiesDb[city].state) ? citiesDb[city].state : 'Gujarat';
            document.getElementById('welcome-company-meta').innerText = `${sector} — ${state} Portal`;

            const welcomeSpcb = document.getElementById('welcome-spcb-badge');
            if (welcomeSpcb) {
                welcomeSpcb.innerText = `SPCB Authorized ✓ (${company.spcb})`;
                welcomeSpcb.style.display = 'inline-block';
            }

            const welcomeBtnBuyer = document.getElementById('welcome-btn-buyer');
            const welcomeBtnSeller = document.getElementById('welcome-btn-seller');
            if (welcomeBtnBuyer) welcomeBtnBuyer.style.display = 'block';
            if (welcomeBtnSeller) welcomeBtnSeller.style.display = 'none';

            renderBuyerEnquiries();
            renderSellerEnquiries();
            
            showToast(`Auto-authenticated as ${company.name} for Secure Live Auction access`, "info");
        }
    }

    // Transition from landing page to app container if landing page is visible
    const landing = document.getElementById('landing-container');
    const app = document.getElementById('app-container');
    if (landing && landing.style.display !== 'none' && app) {
        landing.style.display = 'none';
        app.style.display = 'flex';
        app.classList.add('active');
        switchTab('simulator');
    }

    // Backup and restore bidding controls
    const controlsContainer = document.getElementById('auc-bidding-controls-container');
    if (controlsContainer) {
        if (!originalBiddingControlsHTML) {
            originalBiddingControlsHTML = controlsContainer.innerHTML;
        } else {
            controlsContainer.innerHTML = originalBiddingControlsHTML;
        }
    }
    const listing = listingsDb.find(l => l.id === listingId);
    if (!listing) return;

    let auction = auctionsDb.find(a => a.listingId === listingId && a.status === 'active');
    if (!auction) {
        const auctionId = 'auc_' + listingId;
        const reservePrice = listing.price;
        const deadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
        auction = {
            id: auctionId,
            listingId: listingId,
            sellerCompany: listing.companyName,
            material: listing.material,
            purity: listing.purity,
            quantity: listing.quantity,
            reservePrice: reservePrice,
            deadline: deadline,
            bids: [],
            status: 'active',
            proxies: {}
        };
        auctionsDb.push(auction);
    }

    activeAuctionId = auction.id;
    auction.bidCount = 0;
    auction.targetBids = Math.floor(Math.random() * 2) + 5; // 5 or 6 bids
    auction.lastBidder = '';

    // Populate static fields
    const unit = getMaterialUnit(auction.material);
    document.getElementById('auc-material-title').innerText = `${auction.material} (${auction.purity}% Grade)`;
    document.getElementById('auc-seller-name').innerText = `Seller: ${auction.sellerCompany} — ${listing.city}, ${citiesDb[listing.city].state}`;
    document.getElementById('auc-lot-qty').innerText = `${auction.quantity} ${unit}`;
    document.getElementById('auc-reserve-price').innerText = `₹${auction.reservePrice.toLocaleString('en-IN')}/${unit}`;

    // Reset forms
    if (document.getElementById('auc-bid-price')) document.getElementById('auc-bid-price').value = '';
    if (document.getElementById('auc-bid-qty')) document.getElementById('auc-bid-qty').value = auction.quantity;
    if (document.getElementById('auc-proxy-price')) document.getElementById('auc-proxy-price').value = '';
    if (document.getElementById('auc-proxy-qty')) document.getElementById('auc-proxy-qty').value = auction.quantity;

    // Populate SPCB badge details
    const badgeName = document.getElementById('auc-badge-bidder-name');
    const badgeSpcb = document.getElementById('auc-badge-bidder-spcb');
    if (badgeName && loggedInCompany) badgeName.innerText = loggedInCompany.name;
    if (badgeSpcb && loggedInCompany) badgeSpcb.innerText = loggedInCompany.spcb;

    // Open Drawer
    document.getElementById('auction-overlay').classList.add('active');
    document.getElementById('auction-drawer').classList.add('active');

    // Update Display
    updateAuctionDisplay();

    // Trigger SPCB bidder authorization pre-check verification
    if (typeof triggerAuctionSPCBPrecheck === 'function') {
        triggerAuctionSPCBPrecheck(listingId);
    }

    // Show Bidding Controls
    document.getElementById('auc-bidding-controls-container').style.display = 'block';

    // Start Timer Interval (update immediately)
    if (auctionTimerInterval) clearInterval(auctionTimerInterval);

    function updateAuctionTimer() {
        const remainingMs = new Date(auction.deadline) - new Date();
        const clock = document.getElementById('auc-timer-clock');
        const sniperAlert = document.getElementById('auc-sniper-alert');
        const timerBar = document.getElementById('auc-timer-bar');

        if (remainingMs <= 0) {
            if (clock) clock.innerText = "00:00:00";
            clearInterval(auctionTimerInterval);
            closeAuction(auction.id);
            closeAuctionRoom();
            return;
        }

        const hrs = Math.floor(remainingMs / 3600000);
        const mins = Math.floor((remainingMs % 3600000) / 60000);
        const secs = Math.floor((remainingMs % 60000) / 1000);

        if (clock) {
            clock.innerText = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            if (remainingMs < 600000) { // < 10 mins
                clock.style.color = '#ef4444';
                if (sniperAlert) sniperAlert.style.display = 'block';
            } else {
                clock.style.color = 'var(--color-success)';
                if (sniperAlert) sniperAlert.style.display = 'none';
            }
        }

        if (timerBar) {
            const totalDuration = (auction.id === 'auc_test_123') ? 10 * 60 * 1000 : 24 * 60 * 60 * 1000;
            const pct = Math.max(0, Math.min(100, (remainingMs / totalDuration) * 100));
            timerBar.style.width = `${pct}%`;
            if (pct < 10) {
                timerBar.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
                timerBar.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.5)';
            } else if (pct < 30) {
                timerBar.style.background = 'linear-gradient(90deg, #f97316, #fb923c)';
                timerBar.style.boxShadow = '0 0 8px rgba(249, 115, 22, 0.5)';
            } else {
                timerBar.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
                timerBar.style.boxShadow = '0 0 8px rgba(16, 185, 129, 0.5)';
            }
        }
    }

    updateAuctionTimer();
    auctionTimerInterval = setInterval(updateAuctionTimer, 1000);

    // Start Competitor Simulation
    scheduleCompetitorSimulation();
}
window.openAuctionRoom = openAuctionRoom;

function closeAuctionRoom() {
    document.getElementById('auction-overlay').classList.remove('active');
    document.getElementById('auction-drawer').classList.remove('active');
    activeAuctionId = null;
    if (competitorSimulationTimeout) clearTimeout(competitorSimulationTimeout);
    if (auctionTimerInterval) clearInterval(auctionTimerInterval);
}
window.closeAuctionRoom = closeAuctionRoom;

function prefillQuickBid(increment) {
    if (!activeAuctionId) return;
    const auction = auctionsDb.find(a => a.id === activeAuctionId);
    if (!auction) return;

    const topBid = auction.bids.length > 0 ? [...auction.bids].sort((a, b) => b.price - a.price)[0] : null;
    const currentPrice = topBid ? topBid.price : auction.reservePrice;
    const newBidPrice = currentPrice + increment;

    const priceInput = document.getElementById('auc-bid-price');
    if (priceInput) {
        priceInput.value = newBidPrice;
        priceInput.focus();
        
        // Add subtle glow animation feedback on the input box
        priceInput.style.borderColor = '#4ade80';
        priceInput.style.boxShadow = '0 0 10px rgba(74, 222, 128, 0.4)';
        setTimeout(() => {
            priceInput.style.borderColor = '';
            priceInput.style.boxShadow = '';
        }, 800);
    }
}
window.prefillQuickBid = prefillQuickBid;

function placeQuickBid(increment) {
    if (!activeAuctionId) return;
    const auction = auctionsDb.find(a => a.id === activeAuctionId);
    if (!auction || auction.status !== 'active') return;

    const topBid = auction.bids.length > 0 ? [...auction.bids].sort((a, b) => b.price - a.price)[0] : null;
    const currentPrice = topBid ? topBid.price : auction.reservePrice;
    const newPrice = currentPrice + increment;
    const qty = parseFloat(document.getElementById('auc-bid-qty').value) || auction.quantity;

    const success = placeAuctionBid(activeAuctionId, loggedInCompany.name, newPrice, qty, false);
    if (success) {
        showToast(`Instant bid placed at ₹${newPrice.toLocaleString('en-IN')}/MT ✓`, "success");
    }
}
window.placeQuickBid = placeQuickBid;

function updateAuctionDisplay() {
    if (!activeAuctionId) return;
    const auction = auctionsDb.find(a => a.id === activeAuctionId);
    if (!auction) return;

    const unit = getMaterialUnit(auction.material);

    // Sort bids to find top bid
    const topBid = auction.bids.length > 0 ? [...auction.bids].sort((a, b) => b.price - a.price)[0] : null;
    const topBidPrice = topBid ? topBid.price : auction.reservePrice;
    
    document.getElementById('auc-top-bid-val').innerText = `₹${topBidPrice.toLocaleString('en-IN')}/${unit}`;

    // My last bid display
    const myBids = auction.bids.filter(b => b.bidderName === loggedInCompany?.name);
    const myLastBid = myBids.length > 0 ? [...myBids].sort((a, b) => b.price - a.price)[0] : null;
    document.getElementById('auc-my-bid-val').innerText = myLastBid ? `₹${myLastBid.price.toLocaleString('en-IN')}/${unit}` : `—`;
    
    // Update quick bid buttons text dynamically with real-time increment values
    const q50 = document.getElementById('quick-bid-btn-50');
    const q100 = document.getElementById('quick-bid-btn-100');
    const q250 = document.getElementById('quick-bid-btn-250');
    const q500 = document.getElementById('quick-bid-btn-500');

    if (q50) q50.innerText = `₹${(topBidPrice + 50).toLocaleString('en-IN')} (+₹50)`;
    if (q100) q100.innerText = `₹${(topBidPrice + 100).toLocaleString('en-IN')} (+₹100)`;
    if (q250) q250.innerText = `₹${(topBidPrice + 250).toLocaleString('en-IN')} (+₹250)`;
    if (q500) q500.innerText = `₹${(topBidPrice + 500).toLocaleString('en-IN')} (+₹500)`;


    // Render Bid Feed
    const feed = document.getElementById('auc-bid-feed');
    feed.innerHTML = '';

    // Sort by timestamp descending
    const feedBids = [...auction.bids].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 20);

    const biddersList = Array.from(new Set(auction.bids.map(b => b.bidderName)));
    const getBidderAlias = (name) => {
        if (loggedInCompany && name === loggedInCompany.name) return "You (" + name + ")";
        return name;
    };

    feedBids.forEach((bid, i) => {
        const dateObj = new Date(bid.timestamp);
        const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const row = document.createElement('div');
        
        const isMyBid = loggedInCompany && bid.bidderName === loggedInCompany.name;
        const isTop = topBid && bid.price === topBid.price;
        
        row.className = `feed-bid-item ${isMyBid ? 'my-bid' : 'competitor-bid'} ${isTop ? 'leading-feed-item' : ''}`;
        if (i === 0 && !isMyBid) {
            row.classList.add('flash-bid-row');
        }
        row.innerHTML = `
            <span>[${timeStr}] <strong class="feed-bid-tag">${getBidderAlias(bid.bidderName)}</strong></span>
            <span class="feed-bid-val">₹${bid.price.toLocaleString('en-IN')}/${unit} <span class="feed-bid-time">(${bid.qty} ${unit})</span></span>
        `;
        feed.appendChild(row);
    });

    const biddersCountTag = document.getElementById('auc-bidder-count-tag');
    const uniqueBidders = new Set(auction.bids.map(b => b.bidderName));
    if (biddersCountTag) biddersCountTag.innerText = `${uniqueBidders.size} Bidder${uniqueBidders.size !== 1 ? 's' : ''}`;

    // Allocation Status Panel
    const allocations = calculateAuctionAllocation(auction);
    const myAllocations = allocations.filter(al => al.bidderName === loggedInCompany?.name && al.allocatedQty > 0);
    const myTotalAllocated = myAllocations.reduce((sum, al) => sum + al.allocatedQty, 0);

    const statusPanel = document.getElementById('auc-status-panel');
    const statusIcon = document.getElementById('auc-status-icon');
    const statusText = document.getElementById('auc-status-text');

    if (myTotalAllocated > 0) {
        statusPanel.className = 'auc-status-ribbon winning';
        statusIcon.innerText = '🏆';
        statusText.innerText = `LEADING BIDDER: Allocated ${myTotalAllocated} ${unit} at ₹${myAllocations[0].price}/${unit}`;
    } else {
        const hasBid = auction.bids.some(b => b.bidderName === loggedInCompany?.name);
        if (hasBid) {
            statusPanel.className = 'auc-status-ribbon outbid';
            statusIcon.innerText = '⚠️';
            statusText.innerText = `OUTBID! Raise price increment to secure allocation`;
        } else {
            statusPanel.className = 'auc-status-ribbon';
            statusPanel.style.background = 'rgba(255, 255, 255, 0.05)';
            statusPanel.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            statusPanel.style.color = '#cbd5e1';
            statusIcon.innerText = '⏳';
            statusText.innerText = `NEUTRAL: No bids placed yet. Submit bid to join the auction`;
        }
    }

    // Update timer bar percentage
    const timerBar = document.getElementById('auc-timer-bar');
    if (timerBar) {
        const totalDuration = 24 * 60 * 60 * 1000; // 24 hours
        const diffMs = new Date(auction.deadline) - new Date();
        const pct = Math.max(0, Math.min(100, (diffMs / totalDuration) * 100));
        timerBar.style.width = `${pct}%`;
        
        if (pct < 10) {
            timerBar.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
            timerBar.style.boxShadow = '0 0 8px rgba(239, 68, 68, 0.5)';
        } else if (pct < 30) {
            timerBar.style.background = 'linear-gradient(90deg, #f97316, #fb923c)';
            timerBar.style.boxShadow = '0 0 8px rgba(249, 115, 22, 0.5)';
        } else {
            timerBar.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
            timerBar.style.boxShadow = '0 0 8px rgba(16, 185, 129, 0.5)';
        }
    }
}
window.updateAuctionDisplay = updateAuctionDisplay;

function placeAuctionBid(auctionId, bidderName, price, qty, isProxy) {
    const auction = auctionsDb.find(a => a.id === auctionId);
    if (!auction) return false;

    const topBid = auction.bids.length > 0 ? [...auction.bids].sort((a, b) => b.price - a.price)[0] : null;
    const currentPrice = topBid ? topBid.price : auction.reservePrice;

    if (price <= currentPrice) {
        if (!isProxy && bidderName === loggedInCompany?.name) {
            showToast(`Bid must exceed the current highest bid of ₹${currentPrice}.`, "warning");
        }
        return false;
    }

    if (qty > auction.quantity) {
        if (!isProxy && bidderName === loggedInCompany?.name) {
            showToast(`Quantity cannot exceed available lot size of ${auction.quantity}.`, "warning");
        }
        return false;
    }

    const userParticipating = loggedInCompany && auction.bids.some(b => b.bidderName === loggedInCompany.name);
    const isUserBid = loggedInCompany && bidderName === loggedInCompany.name;

    const newBid = {
        id: 'b_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        bidderName: bidderName,
        bidderCity: companiesDb.find(c => c.name === bidderName)?.city || 'Surat',
        price: price,
        qty: qty,
        timestamp: new Date()
    };
    auction.bids.push(newBid);

    auction.bidCount = (auction.bidCount || 0) + 1;
    auction.lastBidder = bidderName;

    // If user was in this auction and the outbid bid is NOT the user's, trigger WhatsApp outbid alert
    if (userParticipating && !isUserBid) {
        if (typeof triggerWhatsAppAlert === 'function') {
            triggerWhatsAppAlert(auction.material, bidderName, price);
        }
    }

    // Anti-snipe
    const remainingMs = new Date(auction.deadline) - new Date();
    if (remainingMs > 0 && remainingMs < 600000) {
        auction.deadline = new Date(new Date(auction.deadline).getTime() + 10 * 60 * 1000);
        showToast(`⏱️ Bid placed in final minutes! Auction extended by +10m.`, "info");
    }

    

    if (activeAuctionId === auctionId) {
        updateAuctionDisplay();
        checkWebsiteAuctionEnd(auctionId);
        // Reset simulation timer to fire exactly 4-5 seconds after this bid
        scheduleCompetitorSimulation();
    }

    renderSellerAuctions();
    return true;
}
window.placeAuctionBid = placeAuctionBid;



function calculateAuctionAllocation(auction) {
    const sortedBids = [...auction.bids].sort((a, b) => {
        if (b.price !== a.price) return b.price - a.price;
        return new Date(a.timestamp) - new Date(b.timestamp);
    });

    let remainingStock = auction.quantity;
    const allocations = [];

    for (let bid of sortedBids) {
        if (remainingStock <= 0) {
            allocations.push({ bidId: bid.id, bidderName: bid.bidderName, allocatedQty: 0, price: bid.price });
            continue;
        }

        const allocated = Math.min(bid.qty, remainingStock);
        remainingStock -= allocated;
        allocations.push({
            bidId: bid.id,
            bidderName: bid.bidderName,
            allocatedQty: allocated,
            price: bid.price
        });
    }

    return allocations;
}
window.calculateAuctionAllocation = calculateAuctionAllocation;

function handleManualBidSubmit(event) {
    event.preventDefault();
    if (!activeAuctionId) return;

    const price = parseFloat(document.getElementById('auc-bid-price').value);
    const qty = parseFloat(document.getElementById('auc-bid-qty').value);

    if (isNaN(price) || isNaN(qty) || price <= 0 || qty <= 0) {
        showToast("Please enter positive numbers for price and quantity.", "warning");
        return;
    }

    const success = placeAuctionBid(activeAuctionId, loggedInCompany.name, price, qty, false);
    if (success) {
        showToast("Your manual bid was placed successfully ✓", "success");
        document.getElementById('auc-bid-price').value = '';
    }
}
window.handleManualBidSubmit = handleManualBidSubmit;



function closeAuction(auctionId) {
    const auction = auctionsDb.find(a => a.id === auctionId);
    if (!auction || auction.status !== 'active') return;

    auction.status = 'closed';

    const allocations = calculateAuctionAllocation(auction);
    const winningAllocations = allocations.filter(al => al.allocatedQty > 0);
    const unit = getMaterialUnit(auction.material);

    // Disable listing
    const listing = listingsDb.find(l => l.id === auction.listingId);
    if (listing) {
        listing.active = false;
        listing.status = 'closed';
    }

    allocations.forEach(al => {
        const bid = auction.bids.find(b => b.id === al.bidId);
        if (!bid) return;

        if (al.allocatedQty > 0) {
            const winningEnquiry = {
                id: 'e_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                sellerCompany: auction.sellerCompany,
                sellerCity: companiesDb.find(c => c.name === auction.sellerCompany)?.city || 'Surat',
                buyerCompany: al.bidderName,
                buyerCity: bid.bidderCity,
                material: auction.material,
                purity: auction.purity,
                quantity: al.allocatedQty,
                materialCost: Math.round(al.allocatedQty * al.price),
                transportCost: 0,
                totalLandedCost: Math.round(al.allocatedQty * al.price),
                distanceKm: 150,
                paymentTerms: 'Advance Bank Transfer',
                sampleRequested: false,
                deliveryAddress: 'Plant Sourcing Site',
                status: 'confirmed',
                createdAt: new Date()
            };
            enquiriesDb.push(winningEnquiry);

            if (loggedInCompany && al.bidderName === loggedInCompany.name) {
                showToast(`🎉 CONGRATULATIONS! You won ${al.allocatedQty} ${unit} of ${auction.material} in the live auction!`, "success");
            }
        } else {
            if (loggedInCompany && al.bidderName === loggedInCompany.name) {
                showToast(`😔 Auction closed. Your bid for ${auction.material} was out-allocated. Search similar listings!`, "warning");
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.value = auction.material;
                    const event = new Event('keyup');
                    searchInput.dispatchEvent(event);
                }
            }
        }
    });

    const topBidPrice = winningAllocations.length > 0 ? winningAllocations[0].price : auction.reservePrice;
    const premiumPct = Math.round(((topBidPrice - auction.reservePrice) / auction.reservePrice) * 1000) / 10;
    
    closedAuctionsLog.push({
        id: 'ca_' + Date.now(),
        material: auction.material,
        purity: auction.purity,
        price: topBidPrice,
        originalPrice: auction.reservePrice,
        originCity: companiesDb.find(c => c.name === auction.sellerCompany)?.city || 'Surat',
        biddersCount: new Set(auction.bids.map(b => b.bidderName)).size,
        closedAt: new Date(),
        premium: premiumPct
    });

    renderMarketPriceIndex();
    renderBuyerEnquiries();
    renderSellerDatabase();
    
    showToast(`🔴 Auction closed. Clearance values published to market index.`, "info");
}
window.closeAuction = closeAuction;

function scheduleCompetitorSimulation() {
    if (competitorSimulationTimeout) clearTimeout(competitorSimulationTimeout);

    const delay = 4000 + Math.random() * 1000; // exactly 4.0 to 5.0 seconds in between bids
    competitorSimulationTimeout = setTimeout(() => {
        if (!activeAuctionId) return;

        const auction = auctionsDb.find(a => a.id === activeAuctionId);
        if (!auction || auction.status !== 'active') return;

        const candidates = companiesDb.filter(c =>
            (c.role === 'buyer' || c.role === 'both') &&
            c.name !== loggedInCompany?.name &&
            c.name !== auction.sellerCompany
        );

        if (candidates.length > 0) {
            const rival = candidates[Math.floor(Math.random() * candidates.length)];
            const topBid = auction.bids.length > 0 ? [...auction.bids].sort((a, b) => b.price - a.price)[0] : null;
            const currentPrice = topBid ? topBid.price : auction.reservePrice;

            const increment = [50, 100, 150][Math.floor(Math.random() * 3)];
            const newPrice = currentPrice + increment;
            const newQty = Math.max(50, Math.floor((Math.random() * 0.5 + 0.3) * auction.quantity));

            placeAuctionBid(auction.id, rival.name, newPrice, newQty, false);
            showToast(`📣 Rival bidder placed a counter-bid. Check the live feed!`, "info");
        }
    }, delay);
}

function checkWebsiteAuctionEnd(auctionId) {
    const auction = auctionsDb.find(a => a.id === auctionId);
    if (!auction) return;

    if (auction.bidCount >= auction.targetBids) {
        if (auctionTimerInterval) clearInterval(auctionTimerInterval);
        if (competitorSimulationTimeout) clearTimeout(competitorSimulationTimeout);

        auction.status = 'closed';
        const listing = listingsDb.find(l => l.id === auction.listingId);
        if (listing) {
            listing.active = false;
            listing.status = 'closed';
        }

        const allocations = calculateAuctionAllocation(auction);
        const unit = getMaterialUnit(auction.material);

        allocations.forEach(al => {
            const bid = auction.bids.find(b => b.id === al.bidId);
            if (!bid) return;

            if (al.allocatedQty > 0) {
                const winningEnquiry = {
                    id: 'e_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                    sellerCompany: auction.sellerCompany,
                    sellerCity: companiesDb.find(c => c.name === auction.sellerCompany)?.city || 'Surat',
                    buyerCompany: al.bidderName,
                    buyerCity: bid.bidderCity,
                    material: auction.material,
                    purity: auction.purity,
                    quantity: al.allocatedQty,
                    materialCost: Math.round(al.allocatedQty * al.price),
                    transportCost: 0,
                    totalLandedCost: Math.round(al.allocatedQty * al.price),
                    distanceKm: 150,
                    paymentTerms: 'Advance Bank Transfer',
                    sampleRequested: false,
                    deliveryAddress: 'Plant Sourcing Site',
                    status: 'confirmed',
                    createdAt: new Date()
                };
                enquiriesDb.push(winningEnquiry);
            }
        });

        const clock = document.getElementById('auc-timer-clock');
        if (clock) {
            clock.innerText = "CLOSED";
            clock.style.color = '#64748b';
        }

        const statusPanel = document.getElementById('auc-status-panel');
        const statusIcon = document.getElementById('auc-status-icon');
        const statusText = document.getElementById('auc-status-text');

        const myAllocations = allocations.filter(al => al.bidderName === loggedInCompany?.name && al.allocatedQty > 0);
        const myTotalAllocated = myAllocations.reduce((sum, al) => sum + al.allocatedQty, 0);

        const topBid = auction.bids.length > 0 ? [...auction.bids].sort((a, b) => b.price - a.price)[0] : null;
        const currentPrice = topBid ? topBid.price : auction.reservePrice;
        const winnerName = topBid ? topBid.bidderName : 'None';
        const winnerDisplay = (loggedInCompany && winnerName === loggedInCompany.name) ? `You (${winnerName})` : winnerName;

        if (myTotalAllocated > 0) {
            statusPanel.className = 'auc-status-ribbon winning';
            statusIcon.innerText = '🏆';
            statusText.innerText = `AUCTION WON: Allocated ${myTotalAllocated} ${unit} at ₹${myAllocations[0].price}/${unit}`;
            showToast(`🎉 CONGRATULATIONS! You won the auction for ${auction.material}!`, "success");
        } else {
            statusPanel.className = 'auc-status-ribbon outbid';
            statusIcon.innerText = '❌';
            statusText.innerText = `AUCTION CLOSED: Won by ${winnerName}`;
            showToast(`😔 Auction closed. Won by ${winnerName}.`, "warning");
        }

        // Render Award Certificate in place of bidding controls
        const controlsContainer = document.getElementById('auc-bidding-controls-container');
        if (controlsContainer) {
            controlsContainer.innerHTML = `
                <div class="award-certificate" style="border: 2px solid var(--accent); background: var(--accent-light); border-radius: 12px; padding: 18px; text-align: center; box-shadow: 0 4px 12px rgba(22,163,74,0.06);">
                    <span style="font-size: 2.2rem; display: block; margin-bottom: 8px;">🏆</span>
                    <h4 style="margin: 0; font-size: 1.1rem; font-weight: 800; color: var(--accent-dark);">LOT OFFICIALLY AWARDED</h4>
                    <p style="font-size: 0.8rem; color: var(--text-body); margin: 8px 0 14px;">
                        This B2B circular lot has been officially cleared on the platform ledger.
                    </p>
                    <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; font-size: 0.82rem; text-align: left; display: flex; flex-direction: column; gap: 8px;">
                        <div><strong style="color: var(--text-secondary);">Winner:</strong> <span style="color: var(--accent); font-weight: 800;">${winnerDisplay}</span></div>
                        <div><strong style="color: var(--text-secondary);">Clearing Price:</strong> <span style="font-weight: 700; color: var(--text-primary);">₹${currentPrice.toLocaleString('en-IN')}/${unit}</span></div>
                        <div><strong style="color: var(--text-secondary);">Allocated Qty:</strong> <span style="font-weight: 700; color: var(--text-primary);">${auction.quantity} ${unit}</span></div>
                        <div style="margin-top: 4px; display: flex; align-items: center; gap: 6px;">
                            <span class="badge" style="background: rgba(22, 163, 74, 0.1); color: #16a34a; border: 1px solid rgba(22, 163, 74, 0.2); font-size: 0.65rem; padding: 4px 8px; border-radius: 4px; font-weight: 700;">LEDGER SIGNED ✓</span>
                        </div>
                    </div>
                </div>
            `;
        }

        renderSellerAuctions();
    }
}

function startLiveAuctionManually(listingId) {
    const listing = listingsDb.find(l => l.id === listingId);
    if (!listing) return;

    listing.status = 'auction_live';

    // Create live auction in auctionsDb
    const auctionId = 'auc_' + listingId;
    let auction = auctionsDb.find(a => a.id === auctionId);
    if (!auction) {
        const reservePrice = listing.price;
        const deadline = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        // Add two mock bids to make it active and interesting right away
        const bids = [
            {
                id: 'bid_mock_1',
                bidderName: 'Bengaluru Construction Cement',
                bidderCity: 'Bengaluru',
                price: reservePrice,
                qty: Math.max(10, Math.floor(listing.quantity * 0.4)),
                timestamp: new Date(Date.now() - 30 * 60 * 1000)
            },
            {
                id: 'bid_mock_2',
                bidderName: 'Dalmia Cement Ltd',
                bidderCity: 'Rourkela',
                price: reservePrice + 50,
                qty: Math.max(10, Math.floor(listing.quantity * 0.5)),
                timestamp: new Date(Date.now() - 15 * 60 * 1000)
            }
        ];

        auction = {
            id: auctionId,
            listingId: listingId,
            sellerCompany: listing.companyName,
            material: listing.material,
            purity: listing.purity,
            quantity: listing.quantity,
            reservePrice: reservePrice,
            deadline: deadline,
            bids: bids,
            status: 'active',
            proxies: {}
        };
        auctionsDb.push(auction);
    }

    showToast(`🔴 Live Auction initialized for ${listing.material}!`, "success");
    
    // Refresh seller database view
    renderSellerDatabase();
    
    // If the user has search results open, refresh them
    if (typeof runCostEngine === 'function') {
        runCostEngine();
    }
}
window.startLiveAuctionManually = startLiveAuctionManually;

// Walkthrough Demo Automation Hook
function initDemoStep() {
    const urlParams = new URLSearchParams(window.location.search);
    const demoStep = urlParams.get('demo_step');
    if (!demoStep) return;

    console.log("TRASURE Demo: Initializing step", demoStep);

    // Disable transitions to make screenshot rendering instantaneous and clean
    const style = document.createElement('style');
    style.innerHTML = `
        * {
            transition: none !important;
            animation: none !important;
        }
        #bg-canvas {
            display: none !important; /* Hide background particle canvas to make screenshots crisp and clean */
        }
        #auction-spcb-precheck {
            display: none !important; /* Hide loading verification screen during screenshots */
        }
        .reveal {
            opacity: 1 !important;
            transform: none !important;
        }
    `;
    document.head.appendChild(style);

    // Step 1: Onboarding / Registration screen
    if (demoStep === '1') {
        const role = document.getElementById('land-reg-role');
        const name = document.getElementById('land-reg-name');
        const sector = document.getElementById('land-reg-sector');
        const loc = document.getElementById('land-reg-location');
        const gstin = document.getElementById('land-reg-gstin');
        const email = document.getElementById('land-reg-email');
        const pin = document.getElementById('land-reg-pin');

        if (role) { role.value = 'both'; role.classList.add('has-value'); }
        if (name) { name.value = 'Surat Power & Chemicals'; name.classList.add('has-value'); }
        if (sector) { sector.value = 'Thermal Power & Utilities'; sector.classList.add('has-value'); }
        if (loc) { loc.value = 'Surat'; loc.classList.add('has-value'); }
        if (gstin) { 
            gstin.value = '24ETGTM9156A1Z1'; 
            gstin.classList.add('has-value');
            const indicator = document.getElementById('gst-indicator');
            if (indicator) {
                indicator.innerText = '✓ Verified';
                indicator.style.color = '#22c55e';
            }
        }
        if (email) { email.value = 'procurement@suratpower.in'; email.classList.add('has-value'); }
        if (pin) { pin.value = '1234'; pin.classList.add('has-value'); }

        // Draw overlay cursor arrow pointing to registration submit button
        const cursorDiv = document.createElement('div');
        cursorDiv.id = 'demo-cursor';
        cursorDiv.style.cssText = `
            position: absolute;
            top: 505px;
            left: 1150px;
            width: 30px;
            height: 30px;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" stroke="black" stroke-width="2"><path d="M5.5 3.21V20.8l5.08-5.08 4.29 10.28 2.68-1.12-4.29-10.28 7.02-.37L5.5 3.21z"/></svg>') no-repeat;
            z-index: 99999;
            pointer-events: none;
        `;
        document.body.appendChild(cursorDiv);
    }

    // Step 2: Dashboard Home Tab View
    else if (demoStep === '2') {
        const company = companiesDb.find(c => c.id === 'c1');
        if (company) {
            loggedInCompany = company;
            isLoggedIn = true;
            currentRole = 'buyer';

            document.getElementById('welcome-company-title').innerText = `Welcome, ${company.name}`;
            document.getElementById('welcome-company-meta').innerText = `${company.sector} — Gujarat Portal`;

            const landing = document.getElementById('landing-container');
            const app = document.getElementById('app-container');
            if (landing && app) {
                landing.style.display = 'none';
                app.style.display = 'flex';
                app.classList.add('active');
            }
            switchTab('home');
        }
    }

    // Step 3: Sourcing Search results View
    else if (demoStep === '3') {
        const company = companiesDb.find(c => c.id === 'c1');
        if (company) {
            loggedInCompany = company;
            isLoggedIn = true;
            currentRole = 'buyer';

            document.getElementById('welcome-company-title').innerText = `Welcome, ${company.name}`;
            document.getElementById('welcome-company-meta').innerText = `${company.sector} — Gujarat Portal`;

            const landing = document.getElementById('landing-container');
            const app = document.getElementById('app-container');
            if (landing && app) {
                landing.style.display = 'none';
                app.style.display = 'flex';
                app.classList.add('active');
            }
            switchTab('simulator');

            const simCat = document.getElementById('sim-category');
            const simMat = document.getElementById('sim-material');
            const simQty = document.getElementById('sim-quantity');
            const simPurityMin = document.getElementById('sim-purity-min');
            const simPurityMax = document.getElementById('sim-purity-max');

            if (simCat) { simCat.value = 'Chemicals & Solvents'; simCat.classList.add('has-value'); }
            updateMaterialDropdown();
            if (simMat) { simMat.value = 'Spent Sulphuric Acid'; simMat.classList.add('has-value'); }
            if (simQty) { simQty.value = '100'; simQty.classList.add('has-value'); }
            if (simPurityMin) { simPurityMin.value = '70'; simPurityMin.classList.add('has-value'); }
            if (simPurityMax) { simPurityMax.value = '100'; simPurityMax.classList.add('has-value'); }

            runCostEngine();

            // Highlight rank 1 result card synchronously
            const firstRow = document.querySelector('#simulator-tbody tr');
            if (firstRow) {
                firstRow.style.boxShadow = '0 0 15px rgba(22, 163, 74, 0.6)';
                firstRow.style.borderColor = '#16a34a';
                firstRow.click();
            }

            const mapWrap = document.querySelector('.map-wrapper');
            if (mapWrap) mapWrap.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
    }

    // Step 4: Inside Live Bidding room slide-out Drawer
    else if (demoStep === '4') {
        const company = companiesDb.find(c => c.id === 'c1');
        if (company) {
            loggedInCompany = company;
            isLoggedIn = true;
            currentRole = 'buyer';

            document.getElementById('welcome-company-title').innerText = `Welcome, ${company.name}`;
            document.getElementById('welcome-company-meta').innerText = `${company.sector} — Gujarat Portal`;

            const landing = document.getElementById('landing-container');
            const app = document.getElementById('app-container');
            if (landing && app) {
                landing.style.display = 'none';
                app.style.display = 'flex';
                app.classList.add('active');
            }
            switchTab('simulator');

            const activeOffer = listingsDb.find(l => l.material === 'Spent Sulphuric Acid');
            if (activeOffer) {
                const testAuctionId = 'auc_test_123';
                const testAuction = {
                    id: testAuctionId,
                    listingId: activeOffer.id,
                    deadline: new Date(Date.now() + 10 * 60 * 1000),
                    reservePrice: activeOffer.price,
                    material: activeOffer.material,
                    purity: activeOffer.purity,
                    quantity: activeOffer.quantity,
                    sellerCompany: activeOffer.companyName,
                    bids: [
                        { bidderName: 'Tamil Chem & Acid Ltd', price: 4250, qty: 100, timestamp: new Date(Date.now() - 50000) },
                        { bidderName: 'Deepak Nitrite Ltd', price: 4300, qty: 100, timestamp: new Date(Date.now() - 30000) },
                        { bidderName: company.name, price: 4350, qty: 100, timestamp: new Date(Date.now() - 10000) }
                    ],
                    proxies: {},
                    status: 'active'
                };
                auctionsDb.push(testAuction);

                openAuctionRoom(activeOffer.id);
            }
        }
    }

    // Step 5: Sourcing Proposal Invoice View
    else if (demoStep === '5') {
        const company = companiesDb.find(c => c.id === 'c1');
        if (company) {
            loggedInCompany = company;
            isLoggedIn = true;
            currentRole = 'buyer';

            document.getElementById('welcome-company-title').innerText = `Welcome, ${company.name}`;
            document.getElementById('welcome-company-meta').innerText = `${company.sector} — Gujarat Portal`;

            const landing = document.getElementById('landing-container');
            const app = document.getElementById('app-container');
            if (landing && app) {
                landing.style.display = 'none';
                app.style.display = 'flex';
                app.classList.add('active');
            }
            switchTab('simulator');

            const activeOffer = listingsDb.find(l => l.material === 'Spent Sulphuric Acid');
            const sellerComp = companiesDb.find(c => c.name === activeOffer.companyName);

            document.getElementById('rcpt-quote-id').innerText = 'TR-Q-2026-081924';
            document.getElementById('rcpt-date-formatted').innerText = new Date().toLocaleDateString('en-IN');
            document.getElementById('rcpt-validity-formatted').innerText = new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString('en-IN');

            document.getElementById('rcpt-seller-name').innerText = activeOffer.companyName;
            document.getElementById('rcpt-seller-sector').innerText = sellerComp ? sellerComp.sector : 'Chemical Manufacturer';
            document.getElementById('rcpt-seller-address').innerText = `Plant Hub: ${activeOffer.city}, ${citiesDb[activeOffer.city]?.state || 'Gujarat'}`;
            document.getElementById('rcpt-seller-email').innerText = sellerComp ? sellerComp.email : 'dispatch@chemfix.in';
            document.getElementById('rcpt-seller-gstin').innerText = sellerComp ? sellerComp.gstin : '24ETGTM9156A1Z1';

            document.getElementById('rcpt-buyer-name').innerText = company.name;
            document.getElementById('rcpt-buyer-sector').innerText = company.sector;
            document.getElementById('rcpt-buyer-address').innerText = `Plant Hub: Vesu, Surat, Gujarat - 395007`;
            document.getElementById('rcpt-buyer-email').innerText = company.email;
            document.getElementById('rcpt-buyer-gstin').innerText = company.gstin;

            document.getElementById('rcpt-material').innerText = `${activeOffer.material} (${activeOffer.purity}% Grade)`;
            document.getElementById('rcpt-base-price').innerText = `₹${activeOffer.price.toLocaleString('en-IN')}/t`;
            document.getElementById('rcpt-qty').innerText = `100 tonnes`;

            const matCost = activeOffer.price * 100;
            document.getElementById('rcpt-mat-cost').innerText = `₹${matCost.toLocaleString('en-IN')}`;

            const dist = 54;
            document.getElementById('rcpt-dist').innerText = dist;
            document.getElementById('rcpt-freight-rate').innerText = `Freight Logistics Rate: ₹${activeOffer.transportRate.toFixed(2)}/km/tonne`;

            const transCost = activeOffer.transportRate * dist * 100;
            document.getElementById('rcpt-trans-cost').innerText = `₹${transCost.toLocaleString('en-IN')}`;

            const totalCost = matCost + transCost;
            document.getElementById('rcpt-total-cost').innerText = `₹${totalCost.toLocaleString('en-IN')}`;
            document.getElementById('rcpt-terms').innerText = 'Net 30 Days Credit';

            document.getElementById('checkout-form').style.display = 'none';
            document.getElementById('receipt-container').style.display = 'block';

            const drawer = document.getElementById('checkout-drawer');
            drawer.classList.add('active');
            document.getElementById('checkout-overlay').classList.add('active');
        }
    }
}
window.initDemoStep = initDemoStep;

// ==========================================================================
// --- SYSTEM-WIDE LIGHT/DARK THEME SWITCHER CONTROLLER ---
// ==========================================================================
function initTheme() {
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get('theme');
    
    let isDark = false;
    if (themeParam) {
        isDark = (themeParam === 'dark');
        localStorage.setItem('trasure-theme', themeParam);
    } else {
        const savedTheme = localStorage.getItem('trasure-theme') || 'light';
        isDark = (savedTheme === 'dark');
    }
    
    if (isDark) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    updateThemeButtons(isDark);
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('trasure-theme', isDark ? 'dark' : 'light');
    
    updateThemeButtons(isDark);
    
    // Dynamically swap Leaflet map layers to match the new visual mode (unless in satellite mode)
    if (mapInstance && streetTileLayer && darkTileLayer && currentMapMode === 'street') {
        if (isDark) {
            if (mapInstance.hasLayer(streetTileLayer)) {
                mapInstance.removeLayer(streetTileLayer);
            }
            if (!mapInstance.hasLayer(darkTileLayer)) {
                mapInstance.addLayer(darkTileLayer);
            }
        } else {
            if (mapInstance.hasLayer(darkTileLayer)) {
                mapInstance.removeLayer(darkTileLayer);
            }
            if (!mapInstance.hasLayer(streetTileLayer)) {
                mapInstance.addLayer(streetTileLayer);
            }
        }
    }
}

function updateThemeButtons(isDark) {
    const buttons = document.querySelectorAll('.theme-toggle-btn');
    buttons.forEach(btn => {
        const iconSpan = btn.querySelector('.theme-toggle-icon');
        const textSpan = btn.querySelector('.theme-toggle-text');
        if (isDark) {
            if (iconSpan) iconSpan.innerText = '☀️';
            if (textSpan) textSpan.innerText = 'Light Mode';
            btn.setAttribute('aria-label', 'Toggle light mode');
        } else {
            if (iconSpan) iconSpan.innerText = '🌙';
            if (textSpan) textSpan.innerText = 'Dark Mode';
            btn.setAttribute('aria-label', 'Toggle dark mode');
        }
    });
}

// Bind to window context so inline onclick handlers work
window.initTheme = initTheme;
window.toggleTheme = toggleTheme;
window.updateThemeButtons = updateThemeButtons;