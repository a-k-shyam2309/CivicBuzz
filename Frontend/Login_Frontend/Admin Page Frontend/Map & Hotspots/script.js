/**
 * CIVICBUZZ • GEOSPATIAL MAP & HOTSPOTS SCRIPT
 * Full Google Maps UI Integration & Color-Coded Ranked Hotspots
 */

// =========================================================
// 1. HINDI & ENGLISH DICTIONARY
// =========================================================
const TRANSLATIONS = {
  "Dashboard": "डैशबोर्ड",
  "Issue Queue": "समस्या सूची",
  "Map & Hotspots": "मानचित्र और हॉटस्पॉट",
  "Departments": "विभाग",
  "Budgeting": "बजट",
  "Analytics": "एनालिटिक्स",
  "GEOSPATIAL INTELLIGENCE": "भू-स्थानिक इंटेलिजेंस और ट्राइएज",
  "Geospatial Incident Map & Hotspots": "भू-स्थानिक घटना मानचित्र और हॉटस्पॉट",
  "Real-time spatial distribution, AI grievance clustering, and ward-level intensity tracking.": "वास्तविक समय स्थानिक वितरण, एआई शिकायत क्लस्टरिंग, और वार्ड-स्तरीय तीव्रता ट्रैकिंग।",
  "Recenter View": "दृष्टिकोण रीसेट करें",
  "Toggle Heatmap": "हीटमैप टॉगल करें",
  "Spatial Incidents": "स्थानिक घटनाएं",
  "Live mapped issues": "लाइव मैप की गई समस्याएं",
  "Active Hotspots": "सक्रिय हॉटस्पॉट",
  "High density clusters": "उच्च घनत्व वाले क्लस्टर",
  "24h Velocity": "24 घंटे की गति",
  "New reports today": "आज की नई रिपोर्टें",
  "Monitored Wards": "निगरानी किए गए वार्ड",
  "Citywide coverage": "शहरव्यापी कवरेज",
  "Verified Zones": "सत्यापित क्षेत्र",
  "Citizen audit accuracy": "नागरिक ऑडिट सटीकता",
  "Critical Hazards": "गंभीर खतरे",
  "Immediate SLA risk": "तत्काल एसएलए जोखिम",
  "Ward / Area": "वार्ड / क्षेत्र",
  "All Wards (Citywide)": "सभी वार्ड (शहरव्यापी)",
  "Category": "श्रेणी",
  "All Categories": "सभी श्रेणियां",
  "Roads & Potholes": "सड़कें और गड्ढे",
  "Water Supply": "जल आपूर्ति",
  "Garbage & Sanitation": "कचरा और स्वच्छता",
  "Street Lighting": "स्ट्रीट लाइट",
  "Drainage & Sewerage": "जल निकासी और सीवरेज",
  "Status": "स्थिति",
  "All Status": "सभी स्थितियां",
  "Pending": "लंबित",
  "In Progress": "प्रगति पर",
  "Resolved": "हल की गई",
  "Verified": "सत्यापित",
  "Rejected": "अस्वीकृत",
  "Map Style": "मानचित्र शैली",
  "Incident Severity & Category": "घटना गंभीरता और हॉटस्पॉट",
  "Critical Emergency": "गंभीर आपातकाल / रैंक 1",
  "High Priority": "उच्च प्राथमिकता / रैंक 2",
  "Medium Priority": "मध्यम प्राथमिकता / रैंक 3",
  "Resolved / Verified": "हल / रैंक 4",
  "Ranked Hotspot Zones": "रैंक किए गए हॉटस्पॉट क्षेत्र",
  "High-density citizen report clusters": "उच्च घनत्व नागरिक रिपोर्ट क्लस्टर",
  "Ward Load Distribution": "वार्ड भार वितरण",
  "Grievance density by administrative ward": "वार्ड अनुसार शिकायत घनत्व",
  "User ID": "यूजर आईडी",
  "Date": "दिनांक",
  "Location": "स्थान",
  "Priority": "प्राथमिकता",
  "Assigned Department": "आवंटित विभाग",
  "Grievance Description": "शिकायत विवरण",
  "Citizen Verification Status": "नागरिक सत्यापन स्थिति",
  "Assign": "विभाग सौंपें",
  "Reject": "अस्वीकार करें",
  "Resolve": "हल करें",
  "Notifications": "सूचनाएं",
  "myProfile": "मेरी प्रोफ़ाइल",
  "darkMode": "डार्क मोड",
  "logout": "लॉग आउट",
  "searchPlaceholder": "हॉटस्पॉट, वार्ड, ट्रैक आईडी खोजें..."
};

// =========================================================
// 2. STATE & GOOGLE MAPS CONFIGURATION
// =========================================================
const BHUBANESWAR_CENTER = [20.2961, 85.8245];

// Google Maps Tile URLs
const GOOGLE_TILE_URLS = {
  roadmap: "https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  satellite: "https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", // Hybrid satellite with streets/labels
  terrain: "https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
};

// Severity Color Mapping (Matches Legend & Requirements)
const SEVERITY_COLORS = {
  CRITICAL: {
    name: "Critical Emergency",
    color: "#ef4444",
    border: "#b91c1c",
    bgSoft: "rgba(239, 68, 68, 0.14)",
    glow: "rgba(239, 68, 68, 0.45)",
    text: "#dc2626",
    pinClass: "pin-critical"
  },
  HIGH: {
    name: "High Priority",
    color: "#f97316",
    border: "#c2410c",
    bgSoft: "rgba(249, 115, 22, 0.14)",
    glow: "rgba(249, 115, 22, 0.45)",
    text: "#ea580c",
    pinClass: "pin-high"
  },
  MEDIUM: {
    name: "Medium Priority",
    color: "#3b82f6",
    border: "#1d4ed8",
    bgSoft: "rgba(59, 130, 246, 0.14)",
    glow: "rgba(59, 130, 246, 0.45)",
    text: "#2563eb",
    pinClass: "pin-medium"
  },
  RESOLVED: {
    name: "Resolved / Verified",
    color: "#22c55e",
    border: "#15803d",
    bgSoft: "rgba(34, 197, 94, 0.14)",
    glow: "rgba(34, 197, 94, 0.45)",
    text: "#16a34a",
    pinClass: "pin-resolved"
  },
  REJECTED: {
    name: "Rejected / Low Risk",
    color: "#64748b",
    border: "#475569",
    bgSoft: "rgba(100, 116, 139, 0.14)",
    glow: "rgba(100, 116, 139, 0.35)",
    text: "#475569",
    pinClass: "pin-rejected"
  }
};

// Ranked Hotspots Data (with preferred severity colors & categories)
const HOTSPOTS_DATA = [
  {
    id: "hotspot-1",
    rank: 1,
    name: "Janpath Central Corridor",
    ward: "Ward 12",
    lat: 20.2961,
    lng: 85.8245,
    radius: 480,
    count: 18,
    severity: "CRITICAL",
    category: "Roads & Drainage",
    categoryKey: "roads_potholes",
    velocity: "+14 new today",
    desc: "Multiple deep potholes and water stagnation along metro construction corridor."
  },
  {
    id: "hotspot-2",
    rank: 2,
    name: "Sector 15 Community Park",
    ward: "Ward 15",
    lat: 20.2910,
    lng: 85.8310,
    radius: 380,
    count: 12,
    severity: "HIGH",
    category: "Garbage & Sanitation",
    categoryKey: "garbage_sanitation",
    velocity: "+8 new today",
    desc: "Persistent commercial waste accumulation and overflow near public park."
  },
  {
    id: "hotspot-3",
    rank: 3,
    name: "5th Cross BTM Layout",
    ward: "Ward 09",
    lat: 20.3120,
    lng: 85.8180,
    radius: 330,
    count: 9,
    severity: "MEDIUM",
    category: "Drainage Overflow",
    categoryKey: "drainage",
    velocity: "+5 new today",
    desc: "Blocked stormwater drain causing pedestrian walkway flooding."
  },
  {
    id: "hotspot-4",
    rank: 4,
    name: "Green View Residential Block",
    ward: "Ward 04",
    lat: 20.3010,
    lng: 85.8150,
    radius: 270,
    count: 6,
    severity: "RESOLVED",
    category: "Water Pipeline Leak",
    categoryKey: "water_supply",
    velocity: "Resolved 2h ago",
    desc: "Main supply pipeline burst under repair and street resurfacing."
  }
];

let map = null;
let tileLayer = null;
let currentMapType = "roadmap"; // 'roadmap' | 'satellite'
let currentStyleMode = "street"; // 'street' | 'satellite' | 'hotspots' | 'clusters'
let currentLanguage = "en";
let currentTheme = "light";

let hotspotsLayerGroup = null;
let markersLayerGroup = null;
let clustersLayerGroup = null;
let activeComplaints = [];
let currentActiveIssueId = null;

// =========================================================
// 3. INITIALIZATION
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLanguage();
  initGoogleMap();
  initEventListeners();
  loadLiveComplaints();
  renderHotspotsList();
});

// =========================================================
// 4. GOOGLE MAP SETUP & TILE RENDERING
// =========================================================
function initGoogleMap() {
  const container = document.getElementById("incidentMap");
  if (!container || typeof L === "undefined") return;

  map = L.map("incidentMap", {
    center: BHUBANESWAR_CENTER,
    zoom: 13,
    zoomControl: false, // Using Google Maps styled floating control pill
    attributionControl: false
  });

  // Layer groups
  hotspotsLayerGroup = L.layerGroup().addTo(map);
  markersLayerGroup = L.layerGroup().addTo(map);
  clustersLayerGroup = L.layerGroup().addTo(map);

  // Set Google Maps Tile Layer
  setGoogleTileLayer("roadmap");

  // Coordinate readout tracker
  map.on("moveend", () => {
    const center = map.getCenter();
    const zoom = map.getZoom();
    const badge = document.getElementById("mapCoordsBadge");
    if (badge) {
      badge.textContent = `Lat: ${center.lat.toFixed(4)} · Lng: ${center.lng.toFixed(4)} · Zoom: ${zoom}`;
    }
  });

  // Map Click Handler for popup dismiss
  map.on("click", (e) => {
    // If clicking outside, close any hover highlighters
  });
}

function setGoogleTileLayer(type = "roadmap") {
  if (!map) return;

  if (tileLayer) {
    map.removeLayer(tileLayer);
  }

  currentMapType = type;
  const url = GOOGLE_TILE_URLS[type] || GOOGLE_TILE_URLS.roadmap;

  tileLayer = L.tileLayer(url, {
    subdomains: ["0", "1", "2", "3"],
    maxZoom: 20,
    attribution: "Map data &copy; Google"
  }).addTo(map);
}

// =========================================================
// 5. LOAD COMPLAINTS & RENDER GOOGLE MAP HOTSPOTS & PINS
// =========================================================
async function loadLiveComplaints() {
  try {
    let comps = [];
    if (window.CivicBuzzAPI?.public?.listComplaints) {
      const res = await window.CivicBuzzAPI.public.listComplaints();
      if (res && res.data && Array.isArray(res.data)) {
        comps = res.data;
      }
    } else if (window.ComplaintStore) {
      comps = window.ComplaintStore.getAll();
    }

    if (!comps || comps.length === 0) {
      // Fallback realistic incidents in Bhubaneswar with precise coordinates
      comps = [
        {
          complaint_id: "CB-12480",
          title: "Dangerous Deep Potholes near Metro Pillar 42",
          category: "roads_potholes",
          department_name: "Roads & Potholes Department",
          priority_level: "CRITICAL",
          status: "PENDING",
          user_uid: "CIT-2041",
          description: "Multiple severe potholes and deep road depression along metro construction corridor.",
          created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
          location: { ward_name: "Ward 12", address: "Janpath Road, Metro Pillar 42", latitude: 20.2961, longitude: 85.8245 }
        },
        {
          complaint_id: "CB-12481",
          title: "High-mast Streetlight outage near Market Circle",
          category: "streetlights",
          department_name: "Electrical & Street Lighting",
          priority_level: "HIGH",
          status: "IN_PROGRESS",
          user_uid: "CIT-1892",
          description: "Main junction high-mast light completely off for 2 consecutive nights.",
          created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
          location: { ward_name: "Ward 08", address: "16th Main Road, Sector 4", latitude: 20.2980, longitude: 85.8210 }
        },
        {
          complaint_id: "CB-12482",
          title: "Commercial garbage overflow near Community Park gate",
          category: "garbage_sanitation",
          department_name: "Sanitation & Solid Waste",
          priority_level: "HIGH",
          status: "REJECTED",
          user_uid: "CIT-3301",
          description: "Heavy solid waste overflow from community bins obstructing park entrance.",
          created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
          location: { ward_name: "Ward 15", address: "Sector 15, Nehru Park", latitude: 20.2910, longitude: 85.8310 }
        },
        {
          complaint_id: "CB-12483",
          title: "Main municipal pipeline burst flooding street",
          category: "water_supply",
          department_name: "Water Supply & Public Health",
          priority_level: "HIGH",
          status: "RESOLVED",
          user_uid: "CIT-4412",
          description: "High-pressure underground pipeline leak causing water logging across 100 meters.",
          created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
          location: { ward_name: "Ward 04", address: "Block A, Green View", latitude: 20.3010, longitude: 85.8150 }
        },
        {
          complaint_id: "CB-12484",
          title: "Blocked stormwater drain and sewage backflow",
          category: "drainage",
          department_name: "Drainage & Sewerage",
          priority_level: "MEDIUM",
          status: "PENDING",
          user_uid: "CIT-5520",
          description: "Stormwater drain clogged with plastic silt, spilling over pedestrian path.",
          created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
          location: { ward_name: "Ward 09", address: "5th Cross Road, BTM Sector 5", latitude: 20.3120, longitude: 85.8180 }
        },
        {
          complaint_id: "CB-12479",
          title: "Streetlight flickering continuously",
          category: "streetlights",
          department_name: "Electrical & Street Lighting",
          priority_level: "LOW",
          status: "VERIFIED",
          user_uid: "CIT-1090",
          description: "Sodium lamp flickering rapidly near residential lane entrance.",
          created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
          location: { ward_name: "Ward 12", address: "Janpath Square", latitude: 20.2940, longitude: 85.8260 }
        }
      ];
    }

    activeComplaints = comps;
    renderAllMapLayers();
    updateSpatialMetrics();
  } catch (err) {
    console.error("Error loading complaints for map:", err);
  }
}

// Master map rendering function
function renderAllMapLayers() {
  if (!map) return;

  hotspotsLayerGroup.clearLayers();
  markersLayerGroup.clearLayers();
  clustersLayerGroup.clearLayers();

  const selectedWard = document.getElementById("mapWardFilter")?.value || "all";
  const selectedCategory = document.getElementById("mapCategoryFilter")?.value || "all";
  const selectedStatus = document.getElementById("mapStatusFilter")?.value || "all";

  // 1. Render Ranked Hotspots Geofence Zones & Beacons
  renderRankedHotspots(selectedWard, selectedCategory, selectedStatus);

  // 2. Render Incident Pins
  if (currentStyleMode !== "clusters") {
    renderIncidentMarkers(selectedWard, selectedCategory, selectedStatus);
  } else {
    renderWardClusters(selectedWard, selectedCategory, selectedStatus);
  }
}

// =========================================================
// 6. RANKED HOTSPOT ZONES RENDERING (Preferred Colors)
// =========================================================
function renderRankedHotspots(selectedWard, selectedCategory, selectedStatus) {
  HOTSPOTS_DATA.forEach((h) => {
    // Filter matching
    if (selectedWard !== "all" && !h.ward.toLowerCase().includes(selectedWard.toLowerCase())) return;
    if (selectedCategory !== "all" && h.categoryKey && !h.categoryKey.toLowerCase().includes(selectedCategory.toLowerCase())) return;

    const sevConfig = SEVERITY_COLORS[h.severity] || SEVERITY_COLORS.MEDIUM;

    // A. Outer Geofence Zone Circle with matching severity color
    const circleRadius = currentStyleMode === "hotspots" ? h.radius * 1.3 : h.radius;
    const fillOpacity = currentStyleMode === "hotspots" ? 0.32 : 0.16;

    const geofenceCircle = L.circle([h.lat, h.lng], {
      radius: circleRadius,
      color: sevConfig.color,
      fillColor: sevConfig.color,
      fillOpacity: fillOpacity,
      weight: 2,
      dashArray: h.severity === "CRITICAL" ? null : "6, 6"
    }).addTo(hotspotsLayerGroup);

    // B. Custom Google Maps Ranked Beacon Badge Icon
    const beaconHtml = `
      <div class="google-hotspot-beacon-wrapper" data-hotspot-id="${h.id}">
        <!-- Pulsing radar wave ring -->
        <div class="beacon-pulse-wave" style="background-color: ${sevConfig.glow};"></div>
        
        <!-- Ranked Hotspot Marker Pill -->
        <div class="google-hotspot-pill" style="border-color: ${sevConfig.color}; box-shadow: 0 4px 14px ${sevConfig.glow};">
          <span class="hotspot-rank-tag" style="background-color: ${sevConfig.color};">#${h.rank}</span>
          <div class="hotspot-pill-text">
            <strong>${h.name}</strong>
            <small>${h.count} Issues · <span style="color:${sevConfig.color}; font-weight:800;">${h.severity}</span></small>
          </div>
        </div>
      </div>
    `;

    const beaconIcon = L.divIcon({
      html: beaconHtml,
      className: "google-hotspot-div-icon",
      iconSize: [220, 48],
      iconAnchor: [110, 24],
      popupAnchor: [0, -28]
    });

    const beaconMarker = L.marker([h.lat, h.lng], { icon: beaconIcon }).addTo(hotspotsLayerGroup);

    // C. Rich Google Maps styled InfoWindow for Hotspot
    const hotspotPopupContent = `
      <div class="google-infowindow hotspot-infowindow">
        <div class="g-info-header" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
          <div class="g-info-rank-badge" style="background:${sevConfig.color};">Rank #${h.rank} Hotspot</div>
          <span class="g-info-severity-pill" style="background:${sevConfig.bgSoft}; color:${sevConfig.color}; border:1px solid ${sevConfig.color};">
            ${h.severity}
          </span>
        </div>
        <div class="g-info-body">
          <h3 class="g-info-title">${h.name}</h3>
          <p class="g-info-desc">${h.desc}</p>
          
          <div class="g-info-stats-grid">
            <div class="g-info-stat-item">
              <span>Total Volume</span>
              <strong style="color:${sevConfig.color};">${h.count} Incidents</strong>
            </div>
            <div class="g-info-stat-item">
              <span>Administrative Ward</span>
              <strong>${h.ward}</strong>
            </div>
            <div class="g-info-stat-item">
              <span>Primary Category</span>
              <strong>${h.category}</strong>
            </div>
            <div class="g-info-stat-item">
              <span>Velocity</span>
              <strong style="color:#10b981;">${h.velocity}</strong>
            </div>
          </div>
          
          <div class="g-info-actions">
            <button type="button" class="g-btn-primary" onclick="window.focusHotspot('${h.id}')" style="background:${sevConfig.color};">
              <i class="fa-solid fa-crosshairs"></i> Focus Zone
            </button>
            <button type="button" class="g-btn-secondary" onclick="window.filterByWard('${h.ward}')">
              <i class="fa-solid fa-filter"></i> Filter Ward
            </button>
          </div>
        </div>
      </div>
    `;

    beaconMarker.bindPopup(hotspotPopupContent, {
      maxWidth: 320,
      className: "google-custom-popup"
    });

    // Hover / Click interaction
    geofenceCircle.on("click", () => {
      beaconMarker.openPopup();
    });
  });
}

// =========================================================
// 7. INDIVIDUAL INCIDENT MARKERS (Google Pin Design)
// =========================================================
function renderIncidentMarkers(selectedWard, selectedCategory, selectedStatus) {
  const categoryIcons = {
    roads_potholes: "fa-road",
    streetlights: "fa-lightbulb",
    water_supply: "fa-faucet-drip",
    garbage_sanitation: "fa-trash-can",
    drainage: "fa-water-ladder"
  };

  activeComplaints.forEach((c) => {
    const ward = c.location?.ward_name || "";
    const cat = (c.category || "").toLowerCase();
    const rawSt = (c.status || "PENDING").toLowerCase();

    let normalizedStatus = "pending";
    if (rawSt.includes("subm") || rawSt.includes("pend")) normalizedStatus = "pending";
    else if (rawSt.includes("prog") || rawSt.includes("assign") || rawSt.includes("work")) normalizedStatus = "in progress";
    else if (rawSt.includes("resolv")) normalizedStatus = "resolved";
    else if (rawSt.includes("verif") || rawSt.includes("close")) normalizedStatus = "verified";
    else if (rawSt.includes("reject")) normalizedStatus = "rejected";

    if (selectedWard !== "all" && !ward.toLowerCase().includes(selectedWard.toLowerCase())) return;
    if (selectedCategory !== "all" && !cat.includes(selectedCategory.toLowerCase())) return;
    if (selectedStatus !== "all" && normalizedStatus !== selectedStatus.toLowerCase()) return;

    const lat = c.location?.latitude || (BHUBANESWAR_CENTER[0] + (Math.random() - 0.5) * 0.03);
    const lng = c.location?.longitude || (BHUBANESWAR_CENTER[1] + (Math.random() - 0.5) * 0.03);
    const priorityKey = (c.priority_level || c.priority?.level || "MEDIUM").toUpperCase();
    const sevConfig = SEVERITY_COLORS[priorityKey] || SEVERITY_COLORS.MEDIUM;
    const iconClass = categoryIcons[c.category] || "fa-location-dot";

    // Google Maps Pixel-Perfect Teardrop Pin HTML
    const pinHtml = `
      <div class="google-pin-container" data-issue-id="${c.complaint_id}">
        <!-- Radar Pulse on Tip -->
        <span class="pin-radar-wave" style="background-color: ${sevConfig.glow};"></span>
        
        <!-- Google Teardrop Pin Body -->
        <svg class="google-pin-svg" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Pin Drop Shadow -->
          <ellipse cx="18" cy="46.5" rx="7" ry="2.5" fill="rgba(0,0,0,0.35)" />
          <!-- Pin Body -->
          <path d="M18 0C8.06 0 0 8.06 0 18C0 30.5 15.6 44.8 17.2 46.2C17.7 46.6 18.3 46.6 18.8 46.2C20.4 44.8 36 30.5 36 18C36 8.06 27.94 0 18 0Z" fill="${sevConfig.color}"/>
          <path d="M18 0.75C8.47 0.75 0.75 8.47 0.75 18C0.75 29.8 15.9 43.6 17.6 45.1C17.8 45.3 18.2 45.3 18.4 45.1C20.1 43.6 35.25 29.8 35.25 18C35.25 8.47 27.53 0.75 18 0.75Z" stroke="${sevConfig.border}" stroke-width="1.2"/>
          <!-- Inner Core White Circle -->
          <circle cx="18" cy="17" r="7.5" fill="#FFFFFF"/>
        </svg>

        <!-- Category Icon inside Pin Core -->
        <i class="fa-solid ${iconClass} google-pin-icon" style="color: ${sevConfig.color};"></i>
      </div>
    `;

    const pinIcon = L.divIcon({
      html: pinHtml,
      className: "google-pin-div-icon",
      iconSize: [36, 48],
      iconAnchor: [18, 48],
      popupAnchor: [0, -48]
    });

    const marker = L.marker([lat, lng], { icon: pinIcon }).addTo(markersLayerGroup);

    // Google Maps Styled InfoWindow for Incident
    const popupContent = `
      <div class="google-infowindow incident-infowindow">
        <div class="g-info-header" style="border-bottom: 2px solid ${sevConfig.color};">
          <div class="g-info-id">${c.complaint_id}</div>
          <span class="g-info-severity-pill" style="background:${sevConfig.bgSoft}; color:${sevConfig.color};">
            ${priorityKey}
          </span>
        </div>
        <div class="g-info-body">
          <h4 class="g-info-title">${c.title}</h4>
          <div class="g-info-meta-line">
            <i class="fa-solid fa-location-dot" style="color:${sevConfig.color};"></i>
            <span>${c.location?.address || 'Janpath Corridor'}, ${ward}</span>
          </div>
          <div class="g-info-meta-line">
            <i class="fa-solid fa-clock"></i>
            <span>Status: <strong style="color:var(--ink);">${normalizedStatus.toUpperCase()}</strong></span>
          </div>
          <div class="g-info-actions">
            <button type="button" class="g-btn-primary" onclick="window.openIssueDetails('${c.complaint_id}')">
              <i class="fa-solid fa-eye"></i> View Full Incident
            </button>
          </div>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      maxWidth: 290,
      className: "google-custom-popup"
    });
  });
}

// =========================================================
// 8. WARD CLUSTERS RENDERING
// =========================================================
function renderWardClusters(selectedWard, selectedCategory, selectedStatus) {
  // Aggregate complaints by ward
  const wardMap = {
    "Ward 12": { name: "Ward 12 (Janpath Central)", center: [20.2961, 85.8245], count: 18, severity: "CRITICAL" },
    "Ward 15": { name: "Ward 15 (Nehru Park Zone)", center: [20.2910, 85.8310], count: 12, severity: "HIGH" },
    "Ward 09": { name: "Ward 09 (BTM 5th Cross)", center: [20.3120, 85.8180], count: 9, severity: "MEDIUM" },
    "Ward 04": { name: "Ward 04 (Green View Block)", center: [20.3010, 85.8150], count: 6, severity: "RESOLVED" }
  };

  Object.values(wardMap).forEach((w) => {
    if (selectedWard !== "all" && !w.name.toLowerCase().includes(selectedWard.toLowerCase())) return;

    const sevConfig = SEVERITY_COLORS[w.severity] || SEVERITY_COLORS.MEDIUM;

    const clusterHtml = `
      <div class="ward-cluster-bubble" style="background: ${sevConfig.color}; border-color: #ffffff; box-shadow: 0 6px 20px ${sevConfig.glow};">
        <span class="cluster-count">${w.count}</span>
        <span class="cluster-label">${w.name.split(" ")[0]}</span>
      </div>
    `;

    const clusterIcon = L.divIcon({
      html: clusterHtml,
      className: "ward-cluster-div-icon",
      iconSize: [60, 60],
      iconAnchor: [30, 30]
    });

    const marker = L.marker(w.center, { icon: clusterIcon }).addTo(clustersLayerGroup);
    marker.on("click", () => {
      map.flyTo(w.center, 15);
      showToast(`Zoomed into ${w.name}`);
    });
  });
}

// =========================================================
// 9. HOTSPOTS SIDEBAR LIST RENDERING
// =========================================================
function renderHotspotsList() {
  const container = document.getElementById("hotspotList");
  if (!container) return;

  let html = "";
  HOTSPOTS_DATA.forEach((h) => {
    const sevConfig = SEVERITY_COLORS[h.severity] || SEVERITY_COLORS.MEDIUM;

    html += `
      <div class="hotspot-card" id="card-${h.id}" onclick="window.focusHotspot('${h.id}')" style="border-left: 4px solid ${sevConfig.color};">
        <div class="hotspot-topline">
          <div class="hotspot-title-group">
            <span class="hotspot-rank-badge" style="background: ${sevConfig.color};">#${h.rank}</span>
            <strong class="hotspot-title">${h.name}</strong>
          </div>
          <span class="hotspot-count-pill" style="background: ${sevConfig.bgSoft}; color: ${sevConfig.color}; border: 1px solid ${sevConfig.color};">
            ${h.count} Issues
          </span>
        </div>
        <p class="hotspot-desc">${h.desc}</p>
        <div class="hotspot-meta-row">
          <span>🏛️ ${h.ward} · ${h.category}</span>
          <button type="button" class="btn-focus-hotspot" style="color:${sevConfig.color};" onclick="event.stopPropagation(); window.focusHotspot('${h.id}')">
            <i class="fa-solid fa-crosshairs"></i> Focus
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Focus Hotspot Handler
window.focusHotspot = function (hotspotId) {
  const hotspot = HOTSPOTS_DATA.find((h) => h.id === hotspotId);
  if (!hotspot || !map) return;

  map.flyTo([hotspot.lat, hotspot.lng], 16, {
    duration: 1.2,
    easeLinearity: 0.25
  });

  // Highlight active sidebar card
  document.querySelectorAll(".hotspot-card").forEach((c) => c.classList.remove("active-card"));
  document.getElementById(`card-${hotspotId}`)?.classList.add("active-card");

  showToast(`Focused on Rank #${hotspot.rank} Hotspot: ${hotspot.name} (${hotspot.severity})`);
};

// Filter by Ward Quick-Trigger
window.filterByWard = function (wardName) {
  const wardSelect = document.getElementById("mapWardFilter");
  if (wardSelect) {
    wardSelect.value = wardName;
    renderAllMapLayers();
    showToast(`Filter applied for ${wardName}`);
  }
};

function updateSpatialMetrics() {
  const statTotal = document.getElementById("statTotalPins");
  const statCritical = document.getElementById("statCriticalPins");
  const statHotspots = document.getElementById("statActiveHotspots");

  if (statTotal) statTotal.textContent = activeComplaints.length;

  const criticalCount = activeComplaints.filter((c) => {
    const p = (c.priority_level || c.priority?.level || "").toUpperCase();
    return p === "CRITICAL" || p === "HIGH";
  }).length;

  if (statCritical) statCritical.textContent = criticalCount;
  if (statHotspots) statHotspots.textContent = HOTSPOTS_DATA.length;
}

// =========================================================
// 10. ISSUE DETAILS SLIDE-OUT PANEL
// =========================================================
window.openIssueDetails = function (issueId) {
  currentActiveIssueId = issueId;
  const cleanId = (issueId || "").replace("#", "");
  const issue = activeComplaints.find((c) => (c.complaint_id || "").replace("#", "") === cleanId);

  const panel = document.getElementById("issueDetailsPanel");
  const overlay = document.getElementById("issuePanelOverlay");
  if (!panel || !overlay) return;

  if (issue) {
    document.getElementById("panelIssueId").textContent = `#${issue.complaint_id}`;
    document.getElementById("panelIssueTitle").textContent = issue.title || "Citizen Grievance";
    document.getElementById("panelUserId").textContent = issue.user_uid || "CIT-2041";
    document.getElementById("panelDate").textContent = new Date(issue.created_at || Date.now()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    document.getElementById("panelLocation").textContent = `${issue.location?.address || 'Janpath'}, ${issue.location?.ward_name || 'Ward 12'}`;
    document.getElementById("panelCategory").textContent = issue.department_name || issue.category || "General";

    const pr = (issue.priority_level || issue.priority?.level || "MEDIUM").toLowerCase();
    const prEl = document.getElementById("panelPriority");
    if (prEl) {
      prEl.textContent = pr.toUpperCase();
      prEl.className = `priority-badge ${pr}`;
    }

    const stEl = document.getElementById("panelStatus");
    const rawSt = (issue.status || "PENDING").toLowerCase();
    let stText = "PENDING";
    let badgeCls = "pending";
    if (rawSt.includes("subm") || rawSt.includes("pend")) { stText = "PENDING"; badgeCls = "pending"; }
    else if (rawSt.includes("prog") || rawSt.includes("assign") || rawSt.includes("work")) { stText = "IN PROGRESS"; badgeCls = "in-progress"; }
    else if (rawSt.includes("resolv")) { stText = "RESOLVED"; badgeCls = "resolved"; }
    else if (rawSt.includes("verif") || rawSt.includes("close")) { stText = "VERIFIED"; badgeCls = "verified"; }
    else if (rawSt.includes("reject")) { stText = "REJECTED"; badgeCls = "rejected"; }

    if (stEl) {
      stEl.textContent = stText;
      stEl.className = `status-badge ${badgeCls}`;
    }

    document.getElementById("panelDescription").textContent = issue.description || "Issue reported via citizen portal.";
    document.getElementById("panelAssigned").textContent = issue.department_name || "Roads & Potholes Department";
  }

  panel.classList.add("open");
  overlay.classList.add("active");
};

function closeIssueDetails() {
  const panel = document.getElementById("issueDetailsPanel");
  const overlay = document.getElementById("issuePanelOverlay");
  if (panel) panel.classList.remove("open");
  if (overlay) overlay.classList.remove("active");
}

// =========================================================
// 11. EVENT LISTENERS & GOOGLE CONTROLS
// =========================================================
function initEventListeners() {
  // Google Zoom In
  document.getElementById("btnGoogleZoomIn")?.addEventListener("click", () => {
    if (map) map.zoomIn();
  });

  // Google Zoom Out
  document.getElementById("btnGoogleZoomOut")?.addEventListener("click", () => {
    if (map) map.zoomOut();
  });

  // Google Recenter
  document.getElementById("btnGoogleRecenter")?.addEventListener("click", () => {
    if (map) map.flyTo(BHUBANESWAR_CENTER, 13);
    showToast("Map view recentered to Bhubaneswar City Center.");
  });

  document.getElementById("btnRecenterMap")?.addEventListener("click", () => {
    if (map) map.flyTo(BHUBANESWAR_CENTER, 13);
    showToast("Map view recentered.");
  });

  // Fullscreen Map Toggle
  document.getElementById("btnGoogleFullscreen")?.addEventListener("click", () => {
    const mapCard = document.getElementById("mapFrameCard");
    const icon = document.getElementById("fullscreenIcon");
    if (!mapCard) return;

    if (!document.fullscreenElement) {
      mapCard.requestFullscreen().then(() => {
        if (icon) icon.className = "fa-solid fa-compress";
        showToast("Fullscreen mode enabled.");
      }).catch(err => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        if (icon) icon.className = "fa-solid fa-expand";
      });
    }
  });

  // Heatmap Toggle in Header
  document.getElementById("btnToggleHeatmap")?.addEventListener("click", () => {
    currentStyleMode = currentStyleMode === "hotspots" ? "street" : "hotspots";
    const btnText = document.getElementById("heatmapToggleText");
    if (btnText) {
      btnText.textContent = currentStyleMode === "hotspots" ? (currentLanguage === "hi" ? "हीटमैप छुपाएं" : "Hide Heatmap") : (currentLanguage === "hi" ? "हीटमैप दिखाएं" : "Toggle Heatmap");
    }

    // Sync toolbar style buttons
    document.querySelectorAll(".layer-btn").forEach((b) => b.classList.remove("active"));
    if (currentStyleMode === "hotspots") {
      document.getElementById("btnLayerHotspots")?.classList.add("active");
    } else {
      document.getElementById("btnLayerStreet")?.classList.add("active");
    }

    renderAllMapLayers();
    showToast(currentStyleMode === "hotspots" ? "Heatmap density overlay enabled." : "Standard Google Roadmap view restored.");
  });

  // Filters change
  document.getElementById("mapWardFilter")?.addEventListener("change", renderAllMapLayers);
  document.getElementById("mapCategoryFilter")?.addEventListener("change", renderAllMapLayers);
  document.getElementById("mapStatusFilter")?.addEventListener("change", renderAllMapLayers);

  // Layer style buttons
  const styleBtns = document.querySelectorAll(".layer-btn");
  styleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      styleBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (btn.id === "btnLayerStreet") {
        currentStyleMode = "street";
        setGoogleTileLayer("roadmap");
      } else if (btn.id === "btnLayerSatellite") {
        currentStyleMode = "satellite";
        setGoogleTileLayer("satellite");
      } else if (btn.id === "btnLayerHotspots") {
        currentStyleMode = "hotspots";
      } else if (btn.id === "btnLayerClusters") {
        currentStyleMode = "clusters";
      }
      renderAllMapLayers();
    });
  });

  // Slide-out panel close
  document.getElementById("closeIssuePanel")?.addEventListener("click", closeIssueDetails);
  document.getElementById("issuePanelOverlay")?.addEventListener("click", closeIssueDetails);

  // Panel action buttons
  document.getElementById("assignIssueBtn")?.addEventListener("click", async () => {
    if (currentActiveIssueId && window.CivicBuzzAPI?.admin?.complaintAction) {
      await window.CivicBuzzAPI.admin.complaintAction(currentActiveIssueId, "ASSIGN", "ROADS_AND_POTHOLES");
    }
    showToast("Issue assigned to department.");
    closeIssueDetails();
    loadLiveComplaints();
  });

  document.getElementById("rejectIssueBtn")?.addEventListener("click", async () => {
    if (currentActiveIssueId && window.CivicBuzzAPI?.admin?.complaintAction) {
      await window.CivicBuzzAPI.admin.complaintAction(currentActiveIssueId, "REJECT", null, "Rejected from Map Triage");
    }
    showToast("Issue marked as rejected.");
    closeIssueDetails();
    loadLiveComplaints();
  });

  document.getElementById("resolveIssueBtn")?.addEventListener("click", async () => {
    if (currentActiveIssueId && window.CivicBuzzAPI?.admin?.complaintAction) {
      await window.CivicBuzzAPI.admin.complaintAction(currentActiveIssueId, "RESOLVE");
    }
    showToast("Issue marked as resolved. Pending citizen verification.");
    closeIssueDetails();
    loadLiveComplaints();
  });

  // Topbar Search Autocomplete
  initSearchAutocomplete();

  // Language Dropdown
  const langBtn = document.getElementById("languageButton");
  const langSelector = document.getElementById("languageSelector");
  if (langBtn && langSelector) {
    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      langSelector.classList.toggle("open");
    });
  }

  document.querySelectorAll(".language-option").forEach((opt) => {
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      const lang = opt.dataset.lang;
      setLanguage(lang);
      langSelector?.classList.remove("open");
    });
  });

  // Document Click to close dropdowns
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#languageSelector")) {
      document.getElementById("languageSelector")?.classList.remove("open");
    }
    if (!e.target.closest("#notificationWrapper")) {
      document.getElementById("notificationWrapper")?.classList.remove("is-open");
      document.getElementById("notificationDropdown")?.classList.remove("open");
    }
    if (!e.target.closest("#profileWrapper")) {
      document.getElementById("profileWrapper")?.classList.remove("is-open");
      document.getElementById("profileDropdown")?.classList.remove("open");
    }
  });

  // Keyboard shortcut (Cmd/Ctrl + K)
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      document.getElementById("mapSearchInput")?.focus();
    }
    if (e.key === "Escape") {
      closeIssueDetails();
      document.getElementById("searchSuggestions")?.setAttribute("hidden", "");
    }
  });
}

// =========================================================
// 12. THEME & LANGUAGE MANAGEMENT
// =========================================================
function initTheme() {
  const saved = localStorage.getItem("civicbuzz-admin-theme") || localStorage.getItem("civicbuzz-theme") || "light";
  currentTheme = saved;
  if (saved === "dark") {
    document.documentElement.classList.add("dark-theme");
    document.body.classList.add("dark-theme");
  } else {
    document.documentElement.classList.remove("dark-theme");
    document.body.classList.remove("dark-theme");
  }
  updateThemeControls();
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-theme");
  document.documentElement.classList.toggle("dark-theme", isDark);
  currentTheme = isDark ? "dark" : "light";
  localStorage.setItem("civicbuzz-admin-theme", currentTheme);
  localStorage.setItem("civicbuzz-theme", currentTheme);
  updateThemeControls();
  showToast(isDark ? "Dark mode activated." : "Light mode activated.");
}

function updateThemeControls() {
  const isDark = document.body.classList.contains("dark-theme");
  const icon = document.getElementById("themeIcon");
  const label = document.getElementById("themeLabel");
  if (icon) icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  if (label) label.textContent = isDark ? (currentLanguage === "hi" ? "लाइट मोड" : "Light Mode") : (currentLanguage === "hi" ? "डार्क मोड" : "Dark Mode");
}

function initLanguage() {
  const saved = localStorage.getItem("civicbuzz-lang") || "en";
  setLanguage(saved);
}

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("civicbuzz-lang", lang);

  const langText = document.getElementById("currentLanguageText");
  if (langText) langText.textContent = lang === "hi" ? "हिन्दी" : "English";

  document.querySelectorAll(".language-option").forEach((opt) => {
    opt.classList.toggle("active", opt.dataset.lang === lang);
  });

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (lang === "hi" && TRANSLATIONS[key]) {
      el.textContent = TRANSLATIONS[key];
    } else {
      el.textContent = key;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (lang === "hi" && TRANSLATIONS[key]) {
      el.setAttribute("placeholder", TRANSLATIONS[key]);
    } else {
      el.setAttribute("placeholder", "Search hotspots, wards, track IDs...");
    }
  });

  updateThemeControls();
}

// =========================================================
// 13. GLOBAL ACTIONS & WINDOW EXPORTS
// =========================================================
window.toggleNotificationMenu = function (e) {
  e?.stopPropagation();
  const wrapper = document.getElementById("notificationWrapper");
  const dropdown = document.getElementById("notificationDropdown");
  wrapper?.classList.toggle("is-open");
  dropdown?.classList.toggle("open");
  document.getElementById("profileWrapper")?.classList.remove("is-open");
};

window.markAllNotificationsRead = function (e) {
  e?.stopPropagation();
  document.querySelectorAll(".notification-item.unread").forEach((item) => item.classList.remove("unread"));
  const pill = document.getElementById("notifCountPill");
  const badge = document.getElementById("notifBadge");
  if (pill) pill.textContent = "0 New";
  if (badge) badge.textContent = "0";
  showToast("All notifications marked as read.");
};

window.handleNotifClick = function (e, action, id) {
  e?.stopPropagation();
  window.toggleNotificationMenu();
  if (action === "issue" && id) {
    window.openIssueDetails(id);
  } else if (action === "budgeting") {
    window.location.href = "../index.html#budgeting";
  } else {
    window.location.href = "../index.html#issuequeue";
  }
};

window.toggleProfileMenu = function (e) {
  e?.stopPropagation();
  const wrapper = document.getElementById("profileWrapper");
  const dropdown = document.getElementById("profileDropdown");
  wrapper?.classList.toggle("is-open");
  dropdown?.classList.toggle("open");
  document.getElementById("notificationWrapper")?.classList.remove("is-open");
};

window.handleProfileAction = function (e, action) {
  e?.stopPropagation();
  if (action === "theme") {
    toggleTheme();
  } else if (action === "profile") {
    document.getElementById("profileModal")?.removeAttribute("hidden");
    window.toggleProfileMenu();
  } else if (action === "logout") {
    window.location.href = "../../index.html";
  }
};

window.copyAdminId = function (e) {
  e?.stopPropagation();
  navigator.clipboard.writeText("ADMIN-001");
  showToast("Admin ID copied to clipboard: ADMIN-001");
};

// =========================================================
// 14. SEARCH AUTOCOMPLETE
// =========================================================
function initSearchAutocomplete() {
  const input = document.getElementById("mapSearchInput");
  const container = document.getElementById("searchSuggestions");
  if (!input || !container) return;

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      container.setAttribute("hidden", "");
      container.innerHTML = "";
      return;
    }

    const matchedHotspots = HOTSPOTS_DATA.filter((h) => h.name.toLowerCase().includes(q) || h.ward.toLowerCase().includes(q));
    const matchedIssues = activeComplaints.filter((c) =>
      (c.complaint_id || "").toLowerCase().includes(q) ||
      (c.title || "").toLowerCase().includes(q) ||
      (c.location?.address || "").toLowerCase().includes(q)
    );

    let html = "";
    if (matchedHotspots.length > 0) {
      html += `<div class="search-group-header">Hotspots & Ranked Corridors</div>`;
      matchedHotspots.forEach((h) => {
        const sevConfig = SEVERITY_COLORS[h.severity] || SEVERITY_COLORS.MEDIUM;
        html += `
          <div class="search-item" onclick="window.focusHotspot('${h.id}'); document.getElementById('searchSuggestions').setAttribute('hidden','');">
            <span style="color:${sevConfig.color};">🔥</span>
            <div><strong>#${h.rank} ${h.name}</strong><br><small style="color:var(--muted);">${h.ward} · ${h.count} issues · ${h.severity}</small></div>
          </div>
        `;
      });
    }

    if (matchedIssues.length > 0) {
      html += `<div class="search-group-header">Incidents & Track IDs</div>`;
      matchedIssues.forEach((c) => {
        html += `
          <div class="search-item" onclick="window.openIssueDetails('${c.complaint_id}'); document.getElementById('searchSuggestions').setAttribute('hidden','');">
            <span>📍</span>
            <div><strong>#${c.complaint_id}</strong>: ${c.title}<br><small style="color:var(--muted);">${c.location?.ward_name || ''}</small></div>
          </div>
        `;
      });
    }

    if (!html) {
      html = `<div style="padding:10px; font-size:12px; color:var(--muted); text-align:center;">No matching hotspots or track IDs found.</div>`;
    }

    container.innerHTML = html;
    container.removeAttribute("hidden");
  });
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}
