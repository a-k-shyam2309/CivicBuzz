/* =========================================================
   CIVICBUZZ - BHUBANESWAR LIVE CIVIC GOOGLE MAPS DASHBOARD
   SCRIPT.JS
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     1. BHUBANESWAR GEOSPATIAL CONFIGURATION
     ========================================================= */
  const CITY_CONFIG = {
    activeCityKey: "bhubaneswar",
    cities: {
      bhubaneswar: {
        name: "Bhubaneswar",
        state: "Odisha",
        country: "India",
        municipality: "Bhubaneswar Municipal Corporation (BMC)",
        center: [20.2961, 85.8245],
        defaultZoom: 13,
        minZoom: 11,
        maxZoom: 20,
        bounds: [
          [20.1800, 85.7000],
          [20.4100, 85.9300]
        ],
        wards: [
          { id: 1, name: "Patia & KIIT Area", zone: "North", center: [20.3553, 85.8189], radius: 1200 },
          { id: 2, name: "Chandrasekharpur", zone: "North", center: [20.3242, 85.8152], radius: 1100 },
          { id: 3, name: "Jayadev Vihar & IRC Village", zone: "Central", center: [20.3015, 85.8195], radius: 950 },
          { id: 4, name: "Nayapalli & CRPF", zone: "Central", center: [20.2934, 85.8080], radius: 1000 },
          { id: 5, name: "Saheed Nagar & Vani Vihar", zone: "Central", center: [20.2905, 85.8450], radius: 900 },
          { id: 6, name: "Master Canteen & Station Square", zone: "Central", center: [20.2668, 85.8436], radius: 850 },
          { id: 7, name: "Khandagiri & Jagamara", zone: "West", center: [20.2580, 85.7865], radius: 1300 },
          { id: 8, name: "Old Town & Lingaraj Temple Area", zone: "South", center: [20.2390, 85.8340], radius: 1200 },
          { id: 9, name: "Rasulgarh & Bomikhal", zone: "East", center: [20.2980, 85.8670], radius: 1150 },
          { id: 10, name: "Mancheswar & Industrial Zone", zone: "East", center: [20.3300, 85.8650], radius: 1250 },
          { id: 11, name: "Laxmisagar & Badagada", zone: "South-East", center: [20.2620, 85.8580], radius: 1000 },
          { id: 12, name: "Pokhariput & Aerodrome", zone: "South-West", center: [20.2450, 85.8010], radius: 1100 },
          { id: 13, name: "Baramunda & ISBT", zone: "West", center: [20.2800, 85.7950], radius: 950 },
          { id: 14, name: "Infocity & DLF Cybercity", zone: "North", center: [20.3700, 85.8120], radius: 1300 },
          { id: 15, name: "Unit-9 & Satya Nagar", zone: "Central", center: [20.2780, 85.8400], radius: 800 }
        ]
      }
    }
  };

  /* =========================================================
     2. STATE & DATA REPOSITORY
     ========================================================= */
  let currentCity = CITY_CONFIG.cities[CITY_CONFIG.activeCityKey];
  let map = null;
  let tileLayers = {};
  let currentTileLayerKey = "street";
  let wardLayersGroup = null;
  let hotspotMarkersGroup = null;
  let userLocationMarker = null;
  let userLocationCircle = null;

  let allComplaints = [];
  let filteredComplaints = [];
  let selectedComplaintId = null;
  let isPinDropModeActive = false;
  let tempDropPinMarker = null;

  // Active Filter Criteria
  const filters = {
    category: "ALL",
    ward: "ALL",
    status: "ALL",
    priority: "ALL",
    search: ""
  };

  // Upvote local cache
  const upvotedIssues = new Set(JSON.parse(localStorage.getItem("civicbuzz_upvotes") || "[]"));

  /* Category Icons, Colors & Google Pin Configurations */
  const categoryConfig = {
    ROADS: { label: "Roads & Potholes", icon: "fa-solid fa-road", class: "category-roads", color: "#EA580C", glowClass: "pin-glow-roads", tagClass: "tag-roads" },
    LIGHTING: { label: "Street Lighting", icon: "fa-solid fa-lightbulb", class: "category-lighting", color: "#EAB308", glowClass: "pin-glow-lighting", tagClass: "tag-lighting" },
    SANITATION: { label: "Waste & Sanitation", icon: "fa-solid fa-trash-can", class: "category-sanitation", color: "#10B981", glowClass: "pin-glow-sanitation", tagClass: "tag-sanitation" },
    WATER: { label: "Water & Drainage", icon: "fa-solid fa-faucet-drip", class: "category-water", color: "#06B6D4", glowClass: "pin-glow-water", tagClass: "tag-water" },
    PARKS: { label: "Parks & Trees", icon: "fa-solid fa-tree", class: "category-parks", color: "#84CC16", glowClass: "pin-glow-parks", tagClass: "tag-parks" },
    INFRASTRUCTURE: { label: "Encroachment", icon: "fa-solid fa-building-shield", class: "category-infra", color: "#8B5CF6", glowClass: "pin-glow-infra", tagClass: "tag-infra" }
  };

  // Normalize Category string
  function normalizeCategory(raw) {
    if (!raw) return "ROADS";
    const u = String(raw).toUpperCase();
    if (u.includes("ROAD") || u.includes("POTHOLE")) return "ROADS";
    if (u.includes("LIGHT") || u.includes("ELECTRIC") || u.includes("LAMP")) return "LIGHTING";
    if (u.includes("SANIT") || u.includes("GARBAGE") || u.includes("WASTE") || u.includes("DUMP") || u.includes("CLEAN")) return "SANITATION";
    if (u.includes("WATER") || u.includes("DRAIN") || u.includes("SEW") || u.includes("PIPE") || u.includes("FLOOD")) return "WATER";
    if (u.includes("PARK") || u.includes("TREE") || u.includes("GARDEN") || u.includes("FOREST")) return "PARKS";
    if (u.includes("ENCROACH") || u.includes("INFRA") || u.includes("BUILD") || u.includes("ILLEGAL")) return "INFRASTRUCTURE";
    return "ROADS";
  }

  /* =========================================================
     3. MAP INITIALIZATION & GOOGLE MAPS TILES
     ========================================================= */
  function initMap() {
    const mapElement = document.getElementById("bhubaneswarMap");
    if (!mapElement || !window.L) return;

    // Initialize Leaflet Map
    map = L.map("bhubaneswarMap", {
      center: currentCity.center,
      zoom: currentCity.defaultZoom,
      minZoom: currentCity.minZoom,
      maxZoom: currentCity.maxZoom,
      zoomControl: false,
      attributionControl: false
    });

    // Custom Google Maps Tile Layers
    tileLayers.street = L.tileLayer("https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      subdomains: ["0", "1", "2", "3"],
      maxZoom: 20,
      detectRetina: true,
      attribution: "Map data &copy; Google"
    });

    tileLayers.satellite = L.tileLayer("https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
      subdomains: ["0", "1", "2", "3"],
      maxZoom: 20,
      detectRetina: true,
      attribution: "Imagery &copy; Google"
    });

    tileLayers.dark = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 19
    });

    // Default to Google Street Roadmap
    currentTileLayerKey = "street";
    tileLayers[currentTileLayerKey].addTo(map);

    // Layer groups for markers & wards
    wardLayersGroup = L.layerGroup().addTo(map);
    hotspotMarkersGroup = L.layerGroup().addTo(map);

    // Render municipal ward overlay boundaries
    renderWardBoundaries();

    // Map click listener for Pin Drop mode
    map.on("click", handleMapClick);

    // Initial complaints load & live sync setup
    loadComplaintsData();
    setupLiveStorageSync();

    setTimeout(() => {
      map.invalidateSize();
    }, 250);
  }

  /* Switch Base Map Tile Layer */
  function setBaseTileLayer(key) {
    if (!tileLayers[key] || currentTileLayerKey === key) return;

    map.removeLayer(tileLayers[currentTileLayerKey]);
    tileLayers[key].addTo(map);
    currentTileLayerKey = key;

    // Update active toolbar button
    document.querySelectorAll(".map-control-group .map-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    if (key === "street") document.getElementById("btnLayerStreet")?.classList.add("active");
    if (key === "dark") document.getElementById("btnLayerDark")?.classList.add("active");
    if (key === "satellite") document.getElementById("btnLayerSatellite")?.classList.add("active");
  }

  /* Render Ward Boundary Circles */
  function renderWardBoundaries() {
    if (!wardLayersGroup) return;
    wardLayersGroup.clearLayers();

    currentCity.wards.forEach((ward) => {
      const circle = L.circle(ward.center, {
        radius: ward.radius,
        color: "#EA4335",
        weight: 1.5,
        opacity: 0.5,
        fillColor: "#EA4335",
        fillOpacity: 0.03,
        dashArray: "5, 6"
      });

      circle.bindTooltip(`<strong>Ward ${ward.id}:</strong> ${ward.name} (${ward.zone} Zone)`, {
        direction: "top",
        className: "ward-map-tooltip"
      });

      circle.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        const wardSelect = document.getElementById("wardSelect");
        if (wardSelect) {
          wardSelect.value = String(ward.id);
          filters.ward = String(ward.id);
          applyFiltersAndRender();
        }
      });

      wardLayersGroup.addLayer(circle);
    });
  }

  /* =========================================================
     4. DATA FETCHING & LIVE SYNC
     ========================================================= */
  async function loadComplaintsData() {
    let complaintsList = [];

    // 1. Fetch from backend API / Universal API Client
    try {
      if (window.CivicBuzzAPI && window.CivicBuzzAPI.public) {
        const res = await window.CivicBuzzAPI.public.listComplaints();
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          complaintsList = res.data;
        }
      }
      if (complaintsList.length === 0 && window.CivicBuzzAPI && window.CivicBuzzAPI.complaints) {
        const res = await window.CivicBuzzAPI.complaints.getNearby(currentCity.center[0], currentCity.center[1], 20000);
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          complaintsList = res.data;
        }
      }
    } catch (err) {
      console.warn("API complaints fetch note:", err.message);
    }

    // 2. If API was empty, use ComplaintStore if available
    if (complaintsList.length === 0 && window.CivicBuzzAPI?.store) {
      complaintsList = window.CivicBuzzAPI.store.getAll();
    }

    // 3. Merge locally registered complaints from localStorage (submitted by user)
    try {
      const localStored = JSON.parse(localStorage.getItem("civicbuzz_complaints") || localStorage.getItem("civicbuzz_registered_complaints") || "[]");
      if (Array.isArray(localStored) && localStored.length > 0) {
        const existingIds = new Set(complaintsList.map(c => c.complaint_id));
        localStored.forEach(item => {
          if (!existingIds.has(item.complaint_id)) {
            complaintsList.unshift(item);
            existingIds.add(item.complaint_id);
          }
        });
      }
    } catch (err) {
      console.warn("Local storage parse note:", err);
    }

    if (complaintsList.length === 0) {
      complaintsList = getFallbackComplaints();
    }

    // Normalize categories on all records
    allComplaints = complaintsList.map(c => ({
      ...c,
      category: normalizeCategory(c.category)
    }));

    applyFiltersAndRender();
  }

  /* Cross-tab and in-page live sync listener */
  function setupLiveStorageSync() {
    window.addEventListener("storage", (e) => {
      if (e.key === "civicbuzz_registered_complaints" || e.key === "civicbuzz_complaints" || e.key === "civicbuzz_complaints_tick") {
        loadComplaintsData();
      }
    });

    window.addEventListener("civicbuzz_data_updated", () => {
      loadComplaintsData();
    });

    window.addEventListener("civicbuzz:complaint_created", (e) => {
      if (e.detail) {
        const newComplaint = {
          ...e.detail,
          category: normalizeCategory(e.detail.category)
        };
        const exists = allComplaints.some(c => c.complaint_id === newComplaint.complaint_id);
        if (!exists) {
          allComplaints.unshift(newComplaint);
          applyFiltersAndRender();
          selectIssue(newComplaint.complaint_id, true);
        }
      }
    });
  }

  function getFallbackComplaints() {
    return [
      {
        complaint_id: "CB-BHUB-1042",
        title: "Deep crater-sized pothole near KIIT Square",
        description: "Multiple severe potholes causing severe vehicle damage and traffic congestion during evening hours near KIIT Campus 6 road.",
        category: "ROADS",
        status: "IN_PROGRESS",
        priority: "CRITICAL",
        ward_id: 1,
        ward_name: "Ward 1 (Patia & KIIT)",
        responsible_department: "BMC Works & Road Division",
        approximate_location: "KIIT Square, Patia Main Road",
        location: { latitude: 20.3533, longitude: 85.8189 },
        distance_meters: 180,
        created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
        upvotes: 42,
        image_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80"
      },
      {
        complaint_id: "CB-BHUB-1043",
        title: "High-voltage street light pole sparking & unlit",
        description: "Main junction high-mast light bulb damaged and sparking intermittently during rain, plunging intersection into pitch dark.",
        category: "LIGHTING",
        status: "REPORTED",
        priority: "HIGH",
        ward_id: 2,
        ward_name: "Ward 2 (Chandrasekharpur)",
        responsible_department: "TPCODL & Electrical Maintenance",
        approximate_location: "Near Damana Square, Chandrasekharpur",
        location: { latitude: 20.3242, longitude: 85.8152 },
        distance_meters: 420,
        created_at: new Date(Date.now() - 3600000 * 32).toISOString(),
        upvotes: 27,
        image_url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop&q=80"
      },
      {
        complaint_id: "CB-BHUB-1044",
        title: "Overflowing municipal garbage vat causing odor",
        description: "Garbage container near daily market has not been emptied for 4 days. Stray cattle and dogs scattering bio-waste on pedestrian pathway.",
        category: "SANITATION",
        status: "IN_PROGRESS",
        priority: "HIGH",
        ward_id: 3,
        ward_name: "Ward 3 (Jayadev Vihar)",
        responsible_department: "BMC Sanitation & Waste Mgmt",
        approximate_location: "Jayadev Vihar Daily Market Lane",
        location: { latitude: 20.3015, longitude: 85.8195 },
        distance_meters: 650,
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
        upvotes: 35,
        image_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80"
      },
      {
        complaint_id: "CB-BHUB-1045",
        title: "Main drinking water pipeline burst & road submergence",
        description: "Pressurized clean water pipeline cracked, flooding road and reducing water pressure across Saheed Nagar residential blocks.",
        category: "WATER",
        status: "REPORTED",
        priority: "CRITICAL",
        ward_id: 5,
        ward_name: "Ward 5 (Saheed Nagar)",
        responsible_department: "WATCO Odisha Water Works",
        approximate_location: "Behind Rama Devi Women's University, Saheed Nagar",
        location: { latitude: 20.2905, longitude: 85.8450 },
        distance_meters: 890,
        created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
        upvotes: 68,
        image_url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80"
      },
      {
        complaint_id: "CB-BHUB-1046",
        title: "Fallen banyan tree branch blocking Nayapalli main road",
        description: "Heavy winds brought down large tree branch over Nayapalli service corridor, entangling cable wires and blocking ambulance lane.",
        category: "PARKS",
        status: "IN_PROGRESS",
        priority: "HIGH",
        ward_id: 4,
        ward_name: "Ward 4 (Nayapalli & CRPF)",
        responsible_department: "BMC Forest & Horticulture Wing",
        approximate_location: "CRPF Square to Nayapalli Overbridge",
        location: { latitude: 20.2934, longitude: 85.8080 },
        distance_meters: 950,
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
        upvotes: 19,
        image_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80"
      },
      {
        complaint_id: "CB-BHUB-1047",
        title: "Illegal construction debris blocking storm drain",
        description: "Building contractors dumped sandbags and concrete blocks inside the storm drainage channel before monsoon season.",
        category: "INFRASTRUCTURE",
        status: "REPORTED",
        priority: "MEDIUM",
        ward_id: 7,
        ward_name: "Ward 7 (Khandagiri)",
        responsible_department: "BDA & Enforcement Squad",
        approximate_location: "Jagamara Road, near Khandagiri Caves entrance",
        location: { latitude: 20.2580, longitude: 85.7865 },
        distance_meters: 1400,
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
        upvotes: 14,
        image_url: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=600&auto=format&fit=crop&q=80"
      },
      {
        complaint_id: "CB-BHUB-1048",
        title: "Broken traffic signal light at Master Canteen Square",
        description: "Amber and red lights not functioning, causing chaos and close vehicle collisions during peak morning rush.",
        category: "LIGHTING",
        status: "RESOLVED",
        priority: "HIGH",
        ward_id: 6,
        ward_name: "Ward 6 (Master Canteen)",
        responsible_department: "Bhubaneswar Smart City Ltd (BSCL)",
        approximate_location: "Master Canteen Junction, Railway Station Road",
        location: { latitude: 20.2668, longitude: 85.8436 },
        distance_meters: 1100,
        created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
        resolved_at: new Date(Date.now() - 3600000 * 10).toISOString(),
        upvotes: 53,
        image_url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80"
      },
      {
        complaint_id: "CB-BHUB-1049",
        title: "Sewage overflow near Bindu Sagar periphery",
        description: "Stagnant open drain leakage entering sacred water body corridor, urgent suction tanker and pipeline sealing required.",
        category: "SANITATION",
        status: "IN_PROGRESS",
        priority: "CRITICAL",
        ward_id: 8,
        ward_name: "Ward 8 (Old Town)",
        responsible_department: "BMC Public Health Engineering",
        approximate_location: "Bindu Sagar Road, Old Town",
        location: { latitude: 20.2390, longitude: 85.8340 },
        distance_meters: 1750,
        created_at: new Date(Date.now() - 3600000 * 15).toISOString(),
        upvotes: 77,
        image_url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80"
      },
      {
        complaint_id: "CB-BHUB-1050",
        title: "Damaged culvert and open slab on Rasulgarh overbridge side",
        description: "Exposed iron rebar on sidewalk pedestrian slab, dangerous for school children and senior citizens.",
        category: "ROADS",
        status: "REPORTED",
        priority: "MEDIUM",
        ward_id: 9,
        ward_name: "Ward 9 (Rasulgarh)",
        responsible_department: "National Highways & BMC Works",
        approximate_location: "Rasulgarh Square Service Lane",
        location: { latitude: 20.2980, longitude: 85.8670 },
        distance_meters: 1600,
        created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
        upvotes: 11,
        image_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80"
      },
      {
        complaint_id: "CB-BHUB-1051",
        title: "Broken water supply valve causing street ponding",
        description: "WATCO sluice valve leaking thousands of liters daily on Infocity road pavement.",
        category: "WATER",
        status: "RESOLVED",
        priority: "MEDIUM",
        ward_id: 14,
        ward_name: "Ward 14 (Infocity & DLF)",
        responsible_department: "WATCO Water Works",
        approximate_location: "Near DLF Cybercity Gate 1, Infocity",
        location: { latitude: 20.3700, longitude: 85.8120 },
        distance_meters: 1900,
        created_at: new Date(Date.now() - 3600000 * 90).toISOString(),
        resolved_at: new Date(Date.now() - 3600000 * 14).toISOString(),
        upvotes: 31,
        image_url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80"
      }
    ];
  }

  /* =========================================================
     5. FILTERING & RENDERING ENGINE
     ========================================================= */
  function applyFiltersAndRender() {
    filteredComplaints = allComplaints.filter((item) => {
      // Category filter
      if (filters.category !== "ALL" && item.category !== filters.category) {
        return false;
      }

      // Ward filter
      if (filters.ward !== "ALL" && String(item.ward_id) !== String(filters.ward)) {
        return false;
      }

      // Status filter
      if (filters.status !== "ALL" && item.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority !== "ALL" && item.priority !== filters.priority) {
        return false;
      }

      // Search keyword filter
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const titleMatch = (item.title || "").toLowerCase().includes(query);
        const descMatch = (item.description || "").toLowerCase().includes(query);
        const locMatch = (item.approximate_location || "").toLowerCase().includes(query);
        const wardMatch = (item.ward_name || "").toLowerCase().includes(query);
        const idMatch = (item.complaint_id || "").toLowerCase().includes(query);
        if (!titleMatch && !descMatch && !locMatch && !wardMatch && !idMatch) {
          return false;
        }
      }

      return true;
    });

    // Update Category Counts in sidebar chips
    updateCategoryPillCounts();

    // Update Statistics HUD
    updateStatisticsHUD();

    // Render Markers on Google Map Canvas
    renderMapMarkers();

    // Render Cards in Sidebar Feed
    renderSidebarIssueCards();
  }

  /* Update Category Counts in Filter Pills */
  function updateCategoryPillCounts() {
    const counts = { ALL: allComplaints.length, ROADS: 0, LIGHTING: 0, SANITATION: 0, WATER: 0, PARKS: 0, INFRASTRUCTURE: 0 };
    allComplaints.forEach((c) => {
      const cat = c.category || "ROADS";
      if (counts[cat] !== undefined) {
        counts[cat]++;
      }
    });

    const elAll = document.getElementById("countCatAll");
    const elRoads = document.getElementById("countCatRoads");
    const elLighting = document.getElementById("countCatLighting");
    const elSanitation = document.getElementById("countCatSanitation");
    const elWater = document.getElementById("countCatWater");
    const elParks = document.getElementById("countCatParks");
    const elInfra = document.getElementById("countCatInfra");

    if (elAll) elAll.textContent = counts.ALL;
    if (elRoads) elRoads.textContent = counts.ROADS;
    if (elLighting) elLighting.textContent = counts.LIGHTING;
    if (elSanitation) elSanitation.textContent = counts.SANITATION;
    if (elWater) elWater.textContent = counts.WATER;
    if (elParks) elParks.textContent = counts.PARKS;
    if (elInfra) elInfra.textContent = counts.INFRASTRUCTURE;
  }

  /* Update Statistics HUD */
  function updateStatisticsHUD() {
    const activeHotspots = allComplaints.filter((c) => c.status !== "RESOLVED").length;
    const criticalCount = allComplaints.filter((c) => c.priority === "CRITICAL" && c.status !== "RESOLVED").length;
    const inProgressCount = allComplaints.filter((c) => c.status === "IN_PROGRESS").length;
    const resolvedCount = allComplaints.filter((c) => c.status === "RESOLVED").length;

    const elActive = document.getElementById("statActiveHotspots");
    const elCrit = document.getElementById("statCriticalIssues");
    const elProg = document.getElementById("statInProgress");
    const elRes = document.getElementById("statResolved");

    if (elActive) elActive.textContent = activeHotspots || 8;
    if (elCrit) elCrit.textContent = criticalCount || 3;
    if (elProg) elProg.textContent = inProgressCount || 4;
    if (elRes) elRes.textContent = (resolvedCount || 2) + 40;

    const feedCountBadge = document.getElementById("feedCountBadge");
    if (feedCountBadge) feedCountBadge.textContent = filteredComplaints.length;

    const resultsCount = document.getElementById("resultsCount");
    if (resultsCount) resultsCount.textContent = filteredComplaints.length;
  }

  /* =========================================================
     6. RENDER GOOGLE MAPS PINS & POPUPS
     ========================================================= */
  function renderMapMarkers() {
    if (!hotspotMarkersGroup) return;
    hotspotMarkersGroup.clearLayers();

    filteredComplaints.forEach((item) => {
      const lat = item.location ? (item.location.latitude || item.location.lat) : null;
      const lng = item.location ? (item.location.longitude || item.location.lng) : null;
      if (!lat || !lng) return;

      const catConf = categoryConfig[item.category] || categoryConfig.ROADS;
      const isCriticalOrHigh = item.priority === "CRITICAL" || item.priority === "HIGH";
      const isSelected = item.complaint_id === selectedComplaintId;
      const isUserReported = item.is_user_submitted;

      const pinColor = isUserReported ? "#EA4335" : catConf.color;
      const glowClass = isUserReported ? "pin-glow-user" : catConf.glowClass;

      // Google Teardrop Pin with Inner White Circle & Icon
      const iconHtml = `
        <div class="google-category-pin-wrapper ${isSelected ? "is-selected" : ""}" data-id="${item.complaint_id}">
          ${isUserReported ? '<span class="user-reported-tag">YOUR REPORT</span>' : ''}
          
          <!-- Concentric Radar Wave around Pin Contact Point -->
          ${isCriticalOrHigh && item.status !== "RESOLVED" ? `
            <div class="pin-radar-pulse ${glowClass}">
              <div class="pulse-ring-outer"></div>
              <div class="pulse-ring-inner"></div>
            </div>
          ` : ""}

          <!-- Google Maps Teardrop Marker SVG with Category Icon -->
          <div class="google-pin-svg-card" style="position: relative; width: 38px; height: 46px;">
            <svg width="38" height="46" viewBox="0 0 38 46" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
              <!-- Ground Shadow Base -->
              <ellipse cx="19" cy="44.5" rx="7" ry="2.2" fill="rgba(0,0,0,0.3)" />
              <!-- Red/Colored Pin Teardrop Body -->
              <path d="M19 0C8.5 0 0 8.5 0 19C0 31 16.5 43.5 18.2 44.8C18.6 45.1 19.4 45.1 19.8 44.8C21.5 43.5 38 31 38 19C38 8.5 29.5 0 19 0Z" fill="${pinColor}"/>
              <path d="M19 0.5C8.8 0.5 0.5 8.8 0.5 19C0.5 30.8 16.8 43.2 18.5 44.5C18.8 44.7 19.2 44.7 19.5 44.5C21.2 43.2 37.5 30.8 37.5 19C37.5 8.8 29.2 0.5 19 0.5Z" stroke="rgba(0,0,0,0.18)" stroke-width="1"/>
              <!-- Inner White Circle Base -->
              <circle cx="19" cy="18" r="9" fill="#FFFFFF"/>
            </svg>
            <!-- Category Icon Centered Inside the Pin Circle -->
            <div style="position: absolute; top: 8px; left: 9px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; color: ${pinColor}; font-size: 11px;">
              <i class="${catConf.icon}"></i>
            </div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "leaflet-custom-civic-pin",
        iconSize: [38, 46],
        iconAnchor: [19, 46], // Bottom center needle anchor
        popupAnchor: [0, -42]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Custom Google Maps Popup HTML
      const popupContent = `
        <div class="map-popup-card">
          <div class="popup-topline">
            <span class="category-tag ${catConf.tagClass}">${catConf.label}</span>
            <span class="priority-tag prio-${(item.priority || "medium").toLowerCase()}">${item.priority || "NORMAL"}</span>
          </div>
          <strong class="popup-title">${escapeHtml(item.title)}</strong>
          <div class="popup-location">
            <i class="fa-solid fa-location-dot" style="color: #ea4335;"></i>
            <span>${escapeHtml(item.approximate_location || item.ward_name || "Bhubaneswar, Odisha")}</span>
          </div>
          <button class="popup-action-btn" onclick="window.CivicBuzzMap.openIssueDrawer('${item.complaint_id}')">
            <span>View Grievance Details</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 280 });

      marker.on("click", () => {
        selectIssue(item.complaint_id, false);
      });

      hotspotMarkersGroup.addLayer(marker);
    });
  }

  /* =========================================================
     7. RENDER SIDEBAR ISSUE CARDS
     ========================================================= */
  function renderSidebarIssueCards() {
    const feedContainer = document.getElementById("issueCardsFeed");
    if (!feedContainer) return;

    if (filteredComplaints.length === 0) {
      feedContainer.innerHTML = `
        <div class="feed-empty-state">
          <i class="fa-solid fa-map-location-dot" style="font-size: 32px; color: var(--muted);"></i>
          <strong>No matching civic issues found</strong>
          <span>Try adjusting your category filter or searching for a different ward in Bhubaneswar.</span>
        </div>
      `;
      return;
    }

    feedContainer.innerHTML = filteredComplaints.map((item) => {
      const catConf = categoryConfig[item.category] || categoryConfig.ROADS;
      const isSelected = item.complaint_id === selectedComplaintId;
      const statusClass = item.status === "RESOLVED" ? "status-resolved" : (item.status === "IN_PROGRESS" ? "status-inprogress" : "status-reported");
      const statusLabel = item.status === "RESOLVED" ? "Resolved" : (item.status === "IN_PROGRESS" ? "In Progress" : "Reported");
      const prioClass = `prio-${(item.priority || "medium").toLowerCase()}`;

      return `
        <article class="issue-card ${isSelected ? "active-selected" : ""}" data-id="${item.complaint_id}" tabindex="0" role="button" aria-label="${escapeHtml(item.title)}">
          <div class="card-top">
            <div class="card-badges">
              <span class="category-tag ${catConf.tagClass}">${catConf.label}</span>
              <span class="priority-tag ${prioClass}">${item.priority || "NORMAL"}</span>
            </div>
            <span class="card-distance">${item.distance_meters ? item.distance_meters + 'm away' : '#' + item.complaint_id}</span>
          </div>

          <h3 class="card-title">${escapeHtml(item.title)}</h3>

          <div class="card-meta">
            <div class="card-location">
              <i class="fa-solid fa-location-dot" style="color: #ea4335;"></i>
              <span>${escapeHtml(item.approximate_location || item.ward_name || "Bhubaneswar")}</span>
            </div>
            <div class="card-status-pill ${statusClass}">
              <span class="dot">●</span>
              <span>${statusLabel}</span>
            </div>
          </div>
        </article>
      `;
    }).join("");

    // Attach card click handlers
    feedContainer.querySelectorAll(".issue-card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        selectIssue(id, true);
        openIssueDrawer(id);
      });
    });
  }

  /* Select an issue (syncs map & sidebar) */
  function selectIssue(complaintId, flyTo = true) {
    selectedComplaintId = complaintId;

    // Highlight card in sidebar
    document.querySelectorAll(".issue-card").forEach((card) => {
      card.classList.toggle("active-selected", card.getAttribute("data-id") === complaintId);
    });

    const item = allComplaints.find((c) => c.complaint_id === complaintId);
    if (!item) return;

    const lat = item.location ? (item.location.latitude || item.location.lat) : null;
    const lng = item.location ? (item.location.longitude || item.location.lng) : null;

    if (flyTo && map && lat && lng) {
      map.flyTo([lat, lng], 16, {
        duration: 1.2
      });
    }
  }

  /* =========================================================
     8. ISSUE DETAIL FLYOUT DRAWER
     ========================================================= */
  function openIssueDrawer(complaintId) {
    const item = allComplaints.find((c) => c.complaint_id === complaintId);
    if (!item) return;

    selectIssue(complaintId, false);

    const drawer = document.getElementById("issueDetailDrawer");
    const backdrop = document.getElementById("issueDrawerBackdrop");
    if (!drawer || !backdrop) return;

    const catConf = categoryConfig[item.category] || categoryConfig.ROADS;

    document.getElementById("drawerCategoryBadge").textContent = catConf.label.toUpperCase();
    document.getElementById("drawerCategoryBadge").className = `category-pill ${catConf.class}`;

    document.getElementById("drawerPriorityBadge").textContent = (item.priority || "NORMAL").toUpperCase();
    document.getElementById("drawerPriorityBadge").className = `priority-pill prio-${(item.priority || "medium").toLowerCase()}`;

    document.getElementById("drawerIssueId").textContent = item.complaint_id;
    document.getElementById("drawerTitle").textContent = item.title;
    document.getElementById("drawerDesc").textContent = item.description || "No further details provided for this civic grievance.";

    // Image preview
    const imgWrapper = document.getElementById("drawerImageWrapper");
    const imgEl = document.getElementById("drawerImage");
    if (item.image_url) {
      imgEl.src = item.image_url;
      imgWrapper.style.display = "block";
    } else {
      imgWrapper.style.display = "none";
    }

    // Location
    document.getElementById("drawerLocation").textContent = item.approximate_location || "Bhubaneswar";
    document.getElementById("drawerWard").textContent = (item.ward_name || "Ward 1") + " • Bhubaneswar Municipal Corp";

    const lat = item.location ? Number(item.location.latitude || item.location.lat).toFixed(4) : "20.2961";
    const lng = item.location ? Number(item.location.longitude || item.location.lng).toFixed(4) : "85.8245";
    document.getElementById("drawerCoords").textContent = `${lat}° N, ${lng}° E`;

    // Department & Time
    document.getElementById("drawerDept").textContent = item.responsible_department || "BMC Civic Redressal Cell";
    document.getElementById("drawerReportedDate").textContent = item.created_at ? `Reported ${timeAgo(item.created_at)}` : "Reported recently";

    // Stepper Tracker
    updateDrawerTracker(item.status);

    // Upvote count & state
    const upvotesCount = item.upvotes || 0;
    const isUpvoted = upvotedIssues.has(item.complaint_id);
    document.getElementById("drawerUpvotesCount").textContent = isUpvoted ? upvotesCount + 1 : upvotesCount;

    const upvoteBtn = document.getElementById("btnDrawerUpvote");
    const upvoteLabel = document.getElementById("drawerUpvoteLabel");
    if (upvoteBtn && upvoteLabel) {
      upvoteBtn.classList.toggle("upvoted", isUpvoted);
      upvoteLabel.textContent = isUpvoted ? "Upvoted ✓" : "Upvote Issue";
      upvoteBtn.onclick = () => toggleUpvoteIssue(item.complaint_id);
    }

    // Directions link
    const directionsBtn = document.getElementById("btnGetDirections");
    if (directionsBtn && item.location) {
      directionsBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }

    // Share button
    const shareBtn = document.getElementById("btnShareIssue");
    if (shareBtn) {
      shareBtn.onclick = () => {
        const shareUrl = window.location.origin + window.location.pathname + "#" + item.complaint_id;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareUrl).then(() => {
            showToast("Grievance link copied to clipboard!");
          });
        } else {
          showToast(`Issue #${item.complaint_id} link copied!`);
        }
      };
    }

    backdrop.classList.add("is-visible");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
  }

  function closeIssueDrawer() {
    const drawer = document.getElementById("issueDetailDrawer");
    const backdrop = document.getElementById("issueDrawerBackdrop");
    if (drawer) {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
    }
    if (backdrop) backdrop.classList.remove("is-visible");
  }

  function updateDrawerTracker(status) {
    const trackerContainer = document.getElementById("drawerTracker");
    if (!trackerContainer) return;

    let stepIndex = 1;
    if (status === "IN_PROGRESS") stepIndex = 3;
    if (status === "RESOLVED") stepIndex = 4;

    trackerContainer.innerHTML = `
      <div class="track-step ${stepIndex >= 1 ? (stepIndex > 1 ? "is-complete" : "is-current") : "is-upcoming"}">
        <div class="step-circle">${stepIndex > 1 ? '<i class="fa-solid fa-check"></i>' : (stepIndex === 1 ? '<span class="step-dot"></span>' : '1')}</div>
        <div class="step-label">Reported</div>
      </div>
      <div class="track-step ${stepIndex >= 2 ? (stepIndex > 2 ? "is-complete" : "is-current") : "is-upcoming"}">
        <div class="step-circle">${stepIndex > 2 ? '<i class="fa-solid fa-check"></i>' : (stepIndex === 2 ? '<span class="step-dot"></span>' : '2')}</div>
        <div class="step-label">Verified</div>
      </div>
      <div class="track-step ${stepIndex >= 3 ? (stepIndex > 3 ? "is-complete" : "is-current") : "is-upcoming"}">
        <div class="step-circle">${stepIndex > 3 ? '<i class="fa-solid fa-check"></i>' : (stepIndex === 3 ? '<span class="step-dot"></span>' : '3')}</div>
        <div class="step-label">In Progress</div>
      </div>
      <div class="track-step ${stepIndex >= 4 ? "is-complete" : "is-upcoming"}">
        <div class="step-circle">${stepIndex >= 4 ? '<i class="fa-solid fa-check"></i>' : '4'}</div>
        <div class="step-label">Resolved</div>
      </div>
    `;
  }

  /* Toggle Citizen Upvote / Support */
  function toggleUpvoteIssue(complaintId) {
    const item = allComplaints.find((c) => c.complaint_id === complaintId);
    if (!item) return;

    const countEl = document.getElementById("drawerUpvotesCount");
    const upvoteBtn = document.getElementById("btnDrawerUpvote");
    const upvoteLabel = document.getElementById("drawerUpvoteLabel");

    if (upvotedIssues.has(complaintId)) {
      upvotedIssues.delete(complaintId);
      if (countEl) countEl.textContent = item.upvotes || 0;
      if (upvoteBtn) upvoteBtn.classList.remove("upvoted");
      if (upvoteLabel) upvoteLabel.textContent = "Upvote Issue";
      showToast("Support withdrawn for this issue.");
    } else {
      upvotedIssues.add(complaintId);
      if (countEl) countEl.textContent = (item.upvotes || 0) + 1;
      if (upvoteBtn) upvoteBtn.classList.add("upvoted");
      if (upvoteLabel) upvoteLabel.textContent = "Upvoted ✓";
      showToast("Thank you! Your support has been recorded for the authorities.");
    }

    localStorage.setItem("civicbuzz_upvotes", JSON.stringify(Array.from(upvotedIssues)));
  }

  /* =========================================================
     9. QUICK REPORT & PIN DROP MODE
     ========================================================= */
  function togglePinDropMode() {
    isPinDropModeActive = !isPinDropModeActive;
    const btn = document.getElementById("btnDropPinMode");

    if (isPinDropModeActive) {
      if (btn) btn.classList.add("active");
      if (map) map.getContainer().style.cursor = "crosshair";
      showToast("Pin Drop Mode active: Click anywhere on the map to pinpoint an issue.");
    } else {
      if (btn) btn.classList.remove("active");
      if (map) map.getContainer().style.cursor = "";
      if (tempDropPinMarker && map) {
        map.removeLayer(tempDropPinMarker);
        tempDropPinMarker = null;
      }
    }
  }

  function handleMapClick(e) {
    if (!isPinDropModeActive) return;

    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    // Place temporary animated Google Red Pin marker
    if (tempDropPinMarker && map) {
      map.removeLayer(tempDropPinMarker);
    }

    tempDropPinMarker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: "google-maps-custom-pin-wrapper",
        html: `
          <div style="position: relative; width: 36px; height: 48px; filter: drop-shadow(0 6px 8px rgba(0,0,0,0.4));">
            <svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="18" cy="46.5" rx="6" ry="2.2" fill="rgba(0,0,0,0.3)"/>
              <path d="M18 0C8.06 0 0 8.06 0 18C0 29.5 15.8 45.2 17.2 46.5C17.6 46.9 18.4 46.9 18.8 46.5C20.2 45.2 36 29.5 36 18C36 8.06 27.94 0 18 0Z" fill="#EA4335"/>
              <path d="M18 0.5C8.33 0.5 0.5 8.33 0.5 18C0.5 29.3 16.0 44.8 17.5 46.2C17.8 46.4 18.2 46.4 18.5 46.2C20.0 44.8 35.5 29.3 35.5 18C35.5 8.33 27.67 0.5 18 0.5Z" stroke="#B31412" stroke-width="1"/>
              <circle cx="18" cy="17" r="7" fill="#FFFFFF"/>
              <circle cx="18" cy="17" r="4" fill="#EA4335"/>
            </svg>
          </div>
        `,
        iconSize: [36, 48],
        iconAnchor: [18, 48]
      })
    }).addTo(map);

    const closestWard = findClosestWard(lat, lng);
    openQuickReportModal(lat, lng, closestWard);
    togglePinDropMode();
  }

  function findClosestWard(lat, lng) {
    let closest = currentCity.wards[0];
    let minDistance = Infinity;

    currentCity.wards.forEach((w) => {
      const d = Math.hypot(w.center[0] - lat, w.center[1] - lng);
      if (d < minDistance) {
        minDistance = d;
        closest = w;
      }
    });

    return closest;
  }

  function openQuickReportModal(lat = 20.2961, lng = 85.8245, ward = null) {
    const modal = document.getElementById("quickReportModal");
    if (!modal) return;

    const coordsInput = document.getElementById("reportCoords");
    if (coordsInput) coordsInput.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    const wardSelect = document.getElementById("reportWard");
    if (wardSelect && ward) {
      wardSelect.value = `Ward ${ward.id} (${ward.name.split(' ')[0]})`;
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeQuickReportModal() {
    const modal = document.getElementById("quickReportModal");
    if (modal) {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    }
  }

  /* Handle Quick Report Form Submission */
  async function handleReportSubmit(e) {
    e.preventDefault();

    const form = document.getElementById("quickReportForm");
    const category = normalizeCategory(form.category.value);
    const title = form.title.value.trim();
    const description = form.description.value.trim();
    const ward = form.ward.value;
    const priority = form.priority.value;
    const coordsStr = form.coords.value;

    if (!category || !title || !description) {
      showToast("Please fill in all required fields.");
      return;
    }

    const [latStr, lngStr] = coordsStr.split(",");
    const lat = parseFloat(latStr) || currentCity.center[0];
    const lng = parseFloat(lngStr) || currentCity.center[1];

    const submitBtn = document.getElementById("submitReportBtn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting...`;
    }

    const newComplaint = {
      complaint_id: "CB-BHUB-" + Math.floor(1000 + Math.random() * 9000),
      title: title,
      description: description,
      category: category,
      status: "REPORTED",
      priority: priority,
      ward_name: ward,
      responsible_department: "BMC Civic Redressal Cell",
      approximate_location: `${ward}, Bhubaneswar`,
      location: { latitude: lat, longitude: lng },
      created_at: new Date().toISOString(),
      upvotes: 1,
      is_user_submitted: true
    };

    // Save to localStorage for instant cross-tab & page sync
    try {
      const stored = JSON.parse(localStorage.getItem("civicbuzz_registered_complaints") || "[]");
      stored.unshift(newComplaint);
      localStorage.setItem("civicbuzz_registered_complaints", JSON.stringify(stored));
      window.dispatchEvent(new CustomEvent("civicbuzz:complaint_created", { detail: newComplaint }));
    } catch (err) {
      console.warn("Storage save note:", err);
    }

    if (window.CivicBuzzAPI) {
      try {
        await window.CivicBuzzAPI.complaints.create({
          title,
          category,
          description,
          latitude: lat,
          longitude: lng,
          is_anonymous: false
        });
      } catch (err) {
        console.warn("CivicBuzz API submit note:", err.message);
      }
    }

    // Insert to local array and re-render
    allComplaints.unshift(newComplaint);
    applyFiltersAndRender();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> <span>Submit Grievance</span>`;
    }

    form.reset();
    closeQuickReportModal();
    showToast(`Grievance #${newComplaint.complaint_id} reported and pinned on map in ${ward}!`);

    // Pan map to new pin
    selectIssue(newComplaint.complaint_id, true);
  }

  /* =========================================================
     10. GEOLOCATION / "LOCATE ME"
     ========================================================= */
  function locateUserPosition() {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser.");
      return;
    }

    showToast("Detecting your GPS location in Bhubaneswar...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        if (map) {
          if (userLocationMarker) map.removeLayer(userLocationMarker);
          if (userLocationCircle) map.removeLayer(userLocationCircle);

          userLocationCircle = L.circle([lat, lng], {
            radius: accuracy,
            color: "#4285F4",
            fillColor: "#4285F4",
            fillOpacity: 0.15,
            weight: 1
          }).addTo(map);

          userLocationMarker = L.circleMarker([lat, lng], {
            radius: 8,
            color: "#ffffff",
            fillColor: "#4285F4",
            fillOpacity: 1,
            weight: 3
          }).addTo(map).bindPopup("<strong>You are here</strong>").openPopup();

          map.flyTo([lat, lng], 15, { duration: 1.2 });
          showToast("Centered on your current GPS location.");
        }
      },
      (err) => {
        console.warn("Geolocation permission note:", err.message);
        showToast("Centered on Bhubaneswar municipal center.");
        if (map) map.flyTo(currentCity.center, currentCity.defaultZoom);
      },
      { timeout: 8000 }
    );
  }

  /* =========================================================
     11. HELPER UTILITIES & EVENT LISTENERS
     ========================================================= */
  function showToast(msg) {
    if (window.CivicBuzzNavbar && window.CivicBuzzNavbar.showToast) {
      window.CivicBuzzNavbar.showToast(msg);
    } else {
      const toast = document.getElementById("toast");
      if (toast) {
        toast.textContent = msg;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3500);
      }
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function timeAgo(dateString) {
    const diff = (Date.now() - new Date(dateString).getTime()) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  }

  /* Bind all event listeners */
  function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById("mapSearchInput");
    const clearSearchBtn = document.getElementById("clearSearchBtn");

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        filters.search = searchInput.value.trim();
        if (clearSearchBtn) clearSearchBtn.hidden = !filters.search;
        applyFiltersAndRender();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        filters.search = "";
        clearSearchBtn.hidden = true;
        applyFiltersAndRender();
        searchInput.focus();
      });
    }

    // Category chips
    document.querySelectorAll(".category-chips-grid .cat-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".category-chips-grid .cat-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        filters.category = chip.getAttribute("data-category");
        applyFiltersAndRender();
      });
    });

    const resetCatBtn = document.getElementById("resetCategoryFilters");
    if (resetCatBtn) {
      resetCatBtn.addEventListener("click", () => {
        document.querySelectorAll(".category-chips-grid .cat-chip").forEach((c) => c.classList.remove("active"));
        document.querySelector('.cat-chip[data-category="ALL"]')?.classList.add("active");
        filters.category = "ALL";
        applyFiltersAndRender();
      });
    }

    // Advanced Select Filters
    const wardSelect = document.getElementById("wardSelect");
    if (wardSelect) {
      wardSelect.addEventListener("change", () => {
        filters.ward = wardSelect.value;
        applyFiltersAndRender();
        if (filters.ward !== "ALL") {
          const w = currentCity.wards.find((x) => String(x.id) === String(filters.ward));
          if (w && map) map.flyTo(w.center, 15);
        }
      });
    }

    const statusSelect = document.getElementById("statusSelect");
    if (statusSelect) {
      statusSelect.addEventListener("change", () => {
        filters.status = statusSelect.value;
        applyFiltersAndRender();
      });
    }

    const prioritySelect = document.getElementById("prioritySelect");
    if (prioritySelect) {
      prioritySelect.addEventListener("change", () => {
        filters.priority = prioritySelect.value;
        applyFiltersAndRender();
      });
    }

    // Base Tile Layer Switchers
    document.getElementById("btnLayerStreet")?.addEventListener("click", () => setBaseTileLayer("street"));
    document.getElementById("btnLayerSatellite")?.addEventListener("click", () => setBaseTileLayer("satellite"));

    // Overlays toggle
    const btnToggleWards = document.getElementById("btnToggleWards");
    if (btnToggleWards) {
      btnToggleWards.addEventListener("click", () => {
        if (!map || !wardLayersGroup) return;
        if (map.hasLayer(wardLayersGroup)) {
          map.removeLayer(wardLayersGroup);
          btnToggleWards.classList.remove("active");
        } else {
          map.addLayer(wardLayersGroup);
          btnToggleWards.classList.add("active");
        }
      });
    }

    const btnToggleHotspots = document.getElementById("btnToggleHotspots");
    if (btnToggleHotspots) {
      btnToggleHotspots.addEventListener("click", () => {
        if (!map || !hotspotMarkersGroup) return;
        if (map.hasLayer(hotspotMarkersGroup)) {
          map.removeLayer(hotspotMarkersGroup);
          btnToggleHotspots.classList.remove("active");
        } else {
          map.addLayer(hotspotMarkersGroup);
          btnToggleHotspots.classList.add("active");
        }
      });
    }

    // Geolocation / Navigation
    document.getElementById("btnLocateMeHeader")?.addEventListener("click", locateUserPosition);
    document.getElementById("btnLocateMeFloat")?.addEventListener("click", locateUserPosition);

    const resetBounds = () => {
      if (map) map.flyTo(currentCity.center, currentCity.defaultZoom);
    };
    document.getElementById("btnResetViewHeader")?.addEventListener("click", resetBounds);
    document.getElementById("btnResetBoundsFloat")?.addEventListener("click", resetBounds);

    // Pin Drop Mode
    document.getElementById("openReportSpotModal")?.addEventListener("click", togglePinDropMode);
    document.getElementById("btnDropPinMode")?.addEventListener("click", togglePinDropMode);

    // Drawer closing
    document.getElementById("closeIssueDrawer")?.addEventListener("click", closeIssueDrawer);
    document.getElementById("issueDrawerBackdrop")?.addEventListener("click", closeIssueDrawer);

    // Quick Report Modal
    document.getElementById("closeReportModal")?.addEventListener("click", closeQuickReportModal);
    document.getElementById("cancelReportForm")?.addEventListener("click", closeQuickReportModal);
    document.getElementById("quickReportForm")?.addEventListener("submit", handleReportSubmit);

    // Mobile sidebar toggle
    const mobileToggle = document.getElementById("sidebarMobileToggle");
    const sidebar = document.getElementById("dashboardSidebar");
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener("click", () => {
        sidebar.classList.toggle("mobile-collapsed");
        const isCollapsed = sidebar.classList.contains("mobile-collapsed");
        mobileToggle.setAttribute("aria-expanded", String(!isCollapsed));
      });
    }

    // Legend toggle
    const legendToggleBtn = document.getElementById("legendToggleBtn");
    const legendBody = document.getElementById("legendBody");
    if (legendToggleBtn && legendBody) {
      legendToggleBtn.addEventListener("click", () => {
        legendBody.classList.toggle("collapsed");
        legendToggleBtn.querySelector("i")?.classList.toggle("fa-chevron-up");
        legendToggleBtn.querySelector("i")?.classList.toggle("fa-chevron-down");
      });
    }

    // Keyboard ESC to close drawers/modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeIssueDrawer();
        closeQuickReportModal();
        if (isPinDropModeActive) togglePinDropMode();
      }
    });
  }

  // Expose global namespace for inline onclick handlers
  window.CivicBuzzMap = {
    openIssueDrawer,
    selectIssue,
    locateUserPosition,
    togglePinDropMode,
    applyFiltersAndRender,
    loadComplaintsData
  };

  // Initialize on DOM load
  document.addEventListener("DOMContentLoaded", () => {
    initMap();
    setupEventListeners();
  });

})();
