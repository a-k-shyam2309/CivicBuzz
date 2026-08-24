// ============================================================
// CivicBuzz — Track Complaints page
// Live Database connection, synchronized Leaflet GIS map,
// Clickable Complaints -> Detailed Transparency Page,
// Dynamic Priority KPIs & Real-time Community Upvoting
// ============================================================

let allComplaints = [];
let filteredComplaints = [];
let currentPriorityFilter = 'all';
let currentStatusFilter = 'ALL';
let searchQuery = '';
let trackMap = null;
let mapMarkersGroup = null;
let mapHotspotsGroup = null;
const cardMarkerMap = new Map();
let isLoadingComplaints = false;
let hasLoadError = false;

// Helper: relative time formatter
function formatRelativeTime(isoString) {
  if (!isoString) return 'Recently';
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays > 0) return `Reported ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `Reported ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Reported just now';
  } catch (_) {
    return 'Recently';
  }
}

// Helper: category and subcategory formatter
function formatCategoryLabel(cat, subCat) {
  const c = (cat || 'road').replace(/_/g, ' ');
  const s = (subCat || 'issue').replace(/_/g, ' ');
  return `${c.charAt(0).toUpperCase() + c.slice(1)} &middot; ${s}`;
}

// Toast notification helper
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.style.background = isError ? '#991B1B' : '#0F172A';
  toast.style.color = '#FFFFFF';
  toast.style.padding = '12px 20px';
  toast.style.borderRadius = '8px';
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.right = '24px';
  toast.style.zIndex = '99999';
  toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 4000);
}

// Navigation Helper: Open Dedicated Complaint Details Page
window.openComplaintDetails = function (complaintId) {
  if (!complaintId) return;
  const cleanId = String(complaintId).replace('#', '').trim();
  window.location.href = `details.html?id=${encodeURIComponent(cleanId)}`;
};

// Setup filter button listeners
function setupFilterChips() {
  const priorityChips = document.querySelectorAll('#filterRow .filter-chip:not(.filter-status)');
  priorityChips.forEach(function (button) {
    button.addEventListener('click', function () {
      priorityChips.forEach(function (b) { b.classList.remove('active'); });
      button.classList.add('active');
      currentPriorityFilter = button.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  const statusChips = document.querySelectorAll('#filterRow .filter-status');
  statusChips.forEach(function (button) {
    button.addEventListener('click', function () {
      statusChips.forEach(function (b) { b.classList.remove('active'); });
      button.classList.add('active');
      currentStatusFilter = button.getAttribute('data-status') || 'ALL';
      applyFilters();
    });
  });

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      searchQuery = (e.target.value || '').trim().toLowerCase();
      applyFilters();
    });
  }
}

// Filter logic applying to both Cards List and Live Map
function applyFilters() {
  filteredComplaints = allComplaints.filter(c => {
    const p = (c.priority_level || c.severity || c.priority?.level || 'MEDIUM').toLowerCase();
    const s = (c.status || 'SUBMITTED').toUpperCase();

    // Priority filter
    if (currentPriorityFilter !== 'all' && p !== currentPriorityFilter.toLowerCase()) {
      return false;
    }

    // Status filter
    if (currentStatusFilter !== 'ALL') {
      if (currentStatusFilter === 'READY_FOR_CITIZEN_VERIFICATION' && s !== 'READY_FOR_CITIZEN_VERIFICATION') return false;
      if (currentStatusFilter === 'RESOLVED' && s !== 'RESOLVED' && s !== 'VERIFIED') return false;
      if (currentStatusFilter === 'SUBMITTED' && s !== 'SUBMITTED' && s !== 'PENDING') return false;
      if (currentStatusFilter === 'ASSIGNED' && s !== 'ASSIGNED') return false;
      if (currentStatusFilter === 'IN_PROGRESS' && !['IN_PROGRESS', 'PROGRESS'].includes(s)) return false;
    }

    // Search query filter
    if (searchQuery) {
      const matchId = (c.complaint_id || '').toLowerCase().includes(searchQuery);
      const matchTitle = (c.title || '').toLowerCase().includes(searchQuery);
      const matchDesc = (c.description || '').toLowerCase().includes(searchQuery);
      const matchWard = (c.ward_label || c.ward || c.location?.ward_name || '').toLowerCase().includes(searchQuery);
      const matchCat = (c.category || '').toLowerCase().includes(searchQuery);
      const matchAddr = (c.address || '').toLowerCase().includes(searchQuery);
      if (!matchId && !matchTitle && !matchDesc && !matchWard && !matchCat && !matchAddr) return false;
    }

    return true;
  });

  renderComplaintCards();
  renderMapMarkers();
}

// Render dynamic complaint cards
function renderComplaintCards() {
  const complaintList = document.getElementById('complaintList');
  const summarySub = document.getElementById('complaintSummarySub');
  const tabCountTotal = document.getElementById('tabCountTotal');

  if (tabCountTotal) tabCountTotal.textContent = allComplaints.length;

  if (isLoadingComplaints) {
    if (summarySub) summarySub.textContent = 'Connecting to database...';
    if (complaintList) {
      complaintList.innerHTML = `
        <div style="padding: 50px 20px; text-align: center; color: var(--muted); width: 100%;">
          <i class="fa fa-spinner fa-spin" style="font-size:28px; margin-bottom:12px; display:block; color:var(--blue);"></i>
          <div style="font-size:15px; font-weight:600; color:var(--text);">Loading complaints from database...</div>
        </div>
      `;
    }
    return;
  }

  if (hasLoadError) {
    if (summarySub) summarySub.textContent = 'Database connection issue';
    if (complaintList) {
      complaintList.innerHTML = `
        <div style="padding: 40px 20px; text-align: center; color: #dc2626; width: 100%;">
          <i class="fa fa-triangle-exclamation" style="font-size:32px; margin-bottom:12px; display:block;"></i>
          <div style="font-size:16px; font-weight:700; margin-bottom:6px;">Unable to load complaints. Please try again.</div>
          <p style="font-size:13px; color:var(--muted); margin-bottom:16px;">We could not synchronize with the municipal database.</p>
          <button onclick="loadLiveComplaints()" style="background:#2563eb; color:#fff; border:none; padding:8px 18px; border-radius:8px; font-weight:600; cursor:pointer;">
            <i class="fa fa-rotate"></i> Retry
          </button>
        </div>
      `;
    }
    return;
  }

  if (summarySub) {
    summarySub.textContent = `Sorted by AI priority · ${filteredComplaints.length} of ${allComplaints.length} grievances shown`;
  }

  if (!complaintList) return;

  if (filteredComplaints.length === 0) {
    complaintList.innerHTML = `
      <div style="padding: 50px 20px; text-align: center; color: var(--muted); width: 100%;">
        <i class="fa fa-folder-open" style="font-size:32px; margin-bottom:12px; display:block; opacity:0.5;"></i>
        <div style="font-size:16px; font-weight:600; margin-bottom:6px; color:var(--text);">No complaints match the selected filters.</div>
        <p style="font-size:13px;">Try clearing search or changing your filter criteria.</p>
        <button onclick="clearAllFilters()" style="margin-top:12px; background:var(--blue); color:#fff; border:none; padding:8px 16px; border-radius:8px; font-weight:600; cursor:pointer;">Show All Grievances</button>
      </div>
    `;
    return;
  }

  complaintList.innerHTML = filteredComplaints.map((c, idx) => {
    const rawPriority = (c.priority_level || c.severity || c.priority?.level || 'MEDIUM').toUpperCase();
    const priorityClass = rawPriority === 'CRITICAL' ? 'chip-priority-high' : rawPriority === 'HIGH' ? 'chip-priority-high' : rawPriority === 'LOW' ? 'chip-priority-low' : 'chip-priority-medium';
    const statusVal = c.status || 'SUBMITTED';
    const isResolved = statusVal === 'RESOLVED';
    const isReadyForVerify = statusVal === 'READY_FOR_CITIZEN_VERIFICATION';
    const isInProgress = ['IN_PROGRESS', 'READY_FOR_CITIZEN_VERIFICATION', 'RESOLVED'].includes(statusVal);
    const isAssigned = ['ASSIGNED', 'IN_PROGRESS', 'READY_FOR_CITIZEN_VERIFICATION', 'RESOLVED'].includes(statusVal);

    const statusBadgeClass = isResolved ? 'chip-status-resolved' : (isReadyForVerify ? 'chip-status-verification' : (statusVal === 'IN_PROGRESS' ? 'chip-status-progress' : 'chip-status-reported'));
    const statusDisplayText = isReadyForVerify ? 'Ready for Verification' : statusVal.replace(/_/g, ' ');

    const wardName = c.ward_label || c.ward || c.location?.ward_name || 'Ward 12 · Janpath';
    const dept = c.department_name || 'Roads & Works Department';
    const upvotes = c.upvotes || 1;
    const timeAgo = formatRelativeTime(c.created_at);
    const catLabel = formatCategoryLabel(c.category, c.sub_category);
    const urgency = c.urgency_score || (c.priority?.score || 85);

    const fallbackImg = window.ComplaintStore?.getCategoryFallback ? window.ComplaintStore.getCategoryFallback(c.category) : "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80";
    const cardImgUrl = (c.image_url && typeof c.image_url === 'string' && c.image_url.trim() && !c.image_url.includes('1584992236310')) ? c.image_url : fallbackImg;

    return `
      <article class="complaint-card" id="card_${c.complaint_id}" data-priority="${rawPriority.toLowerCase()}" onclick="openComplaintDetails('${c.complaint_id}')" style="cursor: pointer;">
        <header class="complaint-head">
          <div class="complaint-titles">
            <div class="complaint-meta-top">
              <span class="chip ${priorityClass}">${rawPriority} priority</span>
              <span class="chip chip-category">${catLabel}</span>
              <span class="chip" style="background:rgba(5, 150, 105, 0.1); color:#059669; font-weight:700; font-size:11px;">Urgency: ${urgency}/100</span>
            </div>
            <h3 class="complaint-title" style="margin-top: 4px;">
              <a href="details.html?id=${encodeURIComponent(c.complaint_id)}" onclick="event.stopPropagation()" style="color:inherit; text-decoration:none;">
                ${c.title}
              </a>
            </h3>
            <div class="complaint-meta mono">#${c.complaint_id} &middot; ${timeAgo} &middot; ${wardName}</div>
          </div>
          <div class="complaint-status">
            <span class="chip ${statusBadgeClass}">${statusDisplayText}</span>
          </div>
        </header>

        <div class="complaint-card-image-wrap" onclick="event.stopPropagation(); openComplaintDetails('${c.complaint_id}')" title="Click to view full complaint details & evidence">
          <img src="${cardImgUrl}" alt="${c.title}" class="complaint-card-image" onerror="this.onerror=null; this.src='${fallbackImg}';" />
          <div class="complaint-image-tag">
            <i class="fa-solid fa-camera"></i> ${c.image_url ? 'Verified Evidence' : 'Civic Record Photo'}
          </div>
        </div>

        ${c.ai_summary ? `
          <div style="font-size:12px; color:var(--secondary); line-height:1.4; margin: 4px 0 12px; background:rgba(0,0,0,0.02); padding:8px 12px; border-radius:8px; border-left:3px solid var(--blue);">
            <span style="font-weight:700; color:var(--blue);">AI Triage Analysis:</span> ${c.ai_summary}
          </div>
        ` : ''}

        <div class="tracker">
          <div class="track-step is-complete"><div class="track-dot"></div><div class="track-label">Reported</div></div>
          <div class="track-step ${isAssigned ? 'is-complete' : 'is-upcoming'}"><div class="track-dot"></div><div class="track-label">AI Triaged</div></div>
          <div class="track-step ${isInProgress ? 'is-complete' : 'is-upcoming'}"><div class="track-dot"></div><div class="track-label">In progress</div></div>
          <div class="track-step ${isResolved ? 'is-complete is-current' : 'is-upcoming'}"><div class="track-dot"></div><div class="track-label">Resolved</div></div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; padding-top:12px; border-top:1px solid var(--border); flex-wrap:wrap; gap:8px;">
          <div style="font-size:11.5px; color:var(--muted);">
            🏛️ ${dept} &middot; ⏱️ SLA: ${c.sla_hours || 48}h
          </div>
          <div style="display:flex; gap:8px; align-items:center;">
            ${isReadyForVerify ? `
              <a href="details.html?id=${encodeURIComponent(c.complaint_id)}" onclick="event.stopPropagation()" style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color:#ffffff; text-decoration:none; border-radius:6px; padding:5px 12px; font-size:11.5px; font-weight:700; display:inline-flex; align-items:center; gap:4px; box-shadow:0 2px 6px rgba(5,150,105,0.3);" title="Verify on-site resolution">
                ✓ Verify Fix
              </a>
            ` : ''}
            <button onclick="event.stopPropagation(); upvoteComplaint('${c.complaint_id}')" style="background:rgba(217, 119, 6, 0.1); color:#B45309; border:1px solid rgba(217, 119, 6, 0.3); border-radius:6px; padding:5px 10px; font-size:11.5px; font-weight:700; cursor:pointer;" title="Upvote issue urgency">
              👍 Upvote (<span id="upvote_cnt_${c.complaint_id}">${upvotes}</span>)
            </button>
            <button onclick="event.stopPropagation(); focusMapOnComplaint('${c.complaint_id}')" style="background:var(--blue-soft); color:var(--blue); border:1px solid rgba(37,99,235,0.2); border-radius:6px; padding:5px 10px; font-size:11.5px; font-weight:600; cursor:pointer;" title="Pinpoint on Map">
              📍 Map Pin
            </button>
            <a href="details.html?id=${encodeURIComponent(c.complaint_id)}" onclick="event.stopPropagation()" style="background:#2563eb; color:#ffffff; text-decoration:none; border-radius:6px; padding:5px 10px; font-size:11.5px; font-weight:600; display:inline-block;" title="View Complete Transparent Record">
              View Details →
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Update Priority overview metrics
function updatePriorityOverviewKPIs() {
  let critCount = 0;
  let highCount = 0;
  let medCount = 0;
  let lowCount = 0;
  let resolvedCount = 0;

  allComplaints.forEach(c => {
    const isResolved = c.status === 'RESOLVED';
    if (isResolved) {
      resolvedCount++;
    } else {
      const p = (c.priority_level || c.severity || c.priority?.level || 'MEDIUM').toUpperCase();
      if (p === 'CRITICAL') critCount++;
      else if (p === 'HIGH') highCount++;
      else if (p === 'LOW') lowCount++;
      else medCount++;
    }
  });

  const critEl = document.getElementById('critPriorityCount');
  const highEl = document.getElementById('highPriorityCount');
  const medEl = document.getElementById('medPriorityCount');
  const lowEl = document.getElementById('lowPriorityCount');
  const resolvedTextEl = document.getElementById('resolvedCountText');
  const resolvedFillEl = document.getElementById('resolvedProgressFill');

  if (critEl) critEl.textContent = `${critCount} open`;
  if (highEl) highEl.textContent = `${highCount} open`;
  if (medEl) medEl.textContent = `${medCount} open`;
  if (lowEl) lowEl.textContent = `${lowCount} open`;

  const total = allComplaints.length || 1;
  const pct = Math.round((resolvedCount / total) * 100);
  if (resolvedTextEl) resolvedTextEl.textContent = `${resolvedCount} / ${allComplaints.length} (${pct}%)`;
  if (resolvedFillEl) resolvedFillEl.style.width = `${pct}%`;
}

// Initialize Leaflet Live Mini-Map
function initTrackMap() {
  const mapContainer = document.getElementById('trackLiveMap');
  if (!mapContainer || trackMap) return;

  try {
    trackMap = L.map('trackLiveMap', {
      center: [20.2961, 85.8245],
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(trackMap);

    mapMarkersGroup = L.layerGroup().addTo(trackMap);
    mapHotspotsGroup = L.layerGroup().addTo(trackMap);

    setTimeout(() => {
      if (trackMap) trackMap.invalidateSize();
    }, 400);
  } catch (err) {
    console.warn('Leaflet initialization note:', err.message);
  }
}

// Render colored live pins on the mini map
function renderMapMarkers() {
  if (!trackMap || !mapMarkersGroup) return;

  mapMarkersGroup.clearLayers();
  mapHotspotsGroup.clearLayers();
  cardMarkerMap.clear();

  const bounds = [];

  filteredComplaints.forEach(c => {
    const lat = Number(c.latitude || c.location?.latitude);
    const lng = Number(c.longitude || c.location?.longitude);

    if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;

    bounds.push([lat, lng]);

    const p = (c.priority_level || c.severity || c.priority?.level || 'MEDIUM').toUpperCase();
    const isResolved = c.status === 'RESOLVED';
    const pinClass = isResolved ? 'pin-resolved' : p === 'CRITICAL' ? 'pin-critical' : p === 'HIGH' ? 'pin-high' : p === 'LOW' ? 'pin-low' : 'pin-medium';
    const symbol = isResolved ? '✓' : p === 'CRITICAL' ? '!' : '●';

    const customIcon = L.divIcon({
      className: 'track-map-marker-wrap',
      html: `<div class="track-map-pin ${pinClass}"><span>${symbol}</span></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -28],
    });

    const marker = L.marker([lat, lng], { icon: customIcon });

    const popupContent = `
      <div style="font-family:'Inter', sans-serif; font-size:12px; min-width:220px;">
        <div style="font-weight:700; color:var(--text); margin-bottom:4px; font-size:13px;">${c.title}</div>
        <div style="color:var(--muted); font-size:11px; margin-bottom:6px;">📍 ${c.ward_label || c.ward || 'Bhubaneswar'} &middot; <span class="mono">#${c.complaint_id}</span></div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-weight:700; font-size:11px; text-transform:uppercase; color:${isResolved ? '#15803d' : p === 'CRITICAL' ? '#dc2626' : '#2563eb'};">${(c.status || 'SUBMITTED').replace(/_/g, ' ')}</span>
          <span style="font-size:11px; font-weight:700; background:rgba(0,0,0,0.05); padding:2px 6px; border-radius:4px;">Urgency ${c.urgency_score || 80}/100</span>
        </div>
        <a href="details.html?id=${encodeURIComponent(c.complaint_id)}" style="display:block; text-align:center; text-decoration:none; background:#2563eb; color:#fff; padding:6px 8px; border-radius:6px; font-size:11.5px; font-weight:600;">
          Inspect Public Details →
        </a>
      </div>
    `;

    marker.bindPopup(popupContent);
    mapMarkersGroup.addLayer(marker);
    cardMarkerMap.set(c.complaint_id, marker);

    if (p === 'CRITICAL' || (c.upvotes && c.upvotes > 20)) {
      const circle = L.circle([lat, lng], {
        radius: 400,
        color: '#dc2626',
        weight: 1,
        fillColor: '#dc2626',
        fillOpacity: 0.12,
        dashArray: '3, 4',
      });
      mapHotspotsGroup.addLayer(circle);
    }
  });

  if (bounds.length > 0) {
    try {
      trackMap.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
    } catch (_) {}
  }
}

// Map pin interaction: focus map and highlight card
window.focusMapOnComplaint = function (cid) {
  const marker = cardMarkerMap.get(cid);
  const comp = allComplaints.find(c => c.complaint_id === cid);
  const mapElement = document.getElementById('map-overview');
  if (mapElement) {
    mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  if (marker && trackMap) {
    const lat = Number(comp?.latitude || comp?.location?.latitude);
    const lng = Number(comp?.longitude || comp?.location?.longitude);
    if (lat && lng) {
      trackMap.setView([lat, lng], 15, { animate: true });
      setTimeout(() => {
        marker.openPopup();
      }, 300);
    }
  }
  highlightCard(cid);
};

window.scrollToComplaintCard = function (cid) {
  const card = document.getElementById(`card_${cid}`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    highlightCard(cid);
  }
};

function highlightCard(cid) {
  document.querySelectorAll('.complaint-card').forEach(c => c.classList.remove('card-highlighted'));
  const target = document.getElementById(`card_${cid}`);
  if (target) {
    target.classList.add('card-highlighted');
    setTimeout(() => {
      target.classList.remove('card-highlighted');
    }, 3500);
  }
}

window.clearAllFilters = function () {
  currentPriorityFilter = 'all';
  currentStatusFilter = 'ALL';
  searchQuery = '';
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('#filterRow .filter-chip').forEach(b => b.classList.remove('active'));
  document.querySelector('#filterRow .filter-chip[data-filter="all"]')?.classList.add('active');
  document.querySelector('#filterRow .filter-chip[data-status="ALL"]')?.classList.add('active');
  applyFilters();
};

// Load live complaints from backend API / single source of truth
async function loadLiveComplaints() {
  isLoadingComplaints = true;
  hasLoadError = false;
  renderComplaintCards();

  try {
    let complaints = [];

    // 1. Try FastAPI backend API
    if (window.CivicBuzzAPI?.complaints?.list) {
      try {
        const res = await window.CivicBuzzAPI.complaints.list();
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          complaints = res.data;
        }
      } catch (_) {}
    }

    // 2. Fallback to ComplaintStore / localStorage
    if (complaints.length === 0 && window.CivicBuzzAPI?.store) {
      complaints = window.CivicBuzzAPI.store.getAll();
    } else if (complaints.length === 0 && window.ComplaintStore?.getAll) {
      complaints = window.ComplaintStore.getAll();
    } else if (complaints.length === 0) {
      try {
        const stored = JSON.parse(localStorage.getItem('civicbuzz_complaints') || localStorage.getItem('civicbuzz_registered_complaints') || '[]');
        if (Array.isArray(stored) && stored.length > 0) complaints = stored;
      } catch (_) {}
    }

    isLoadingComplaints = false;
    allComplaints = complaints;
    updatePriorityOverviewKPIs();
    applyFilters();
  } catch (err) {
    console.error('Complaints load error:', err);
    isLoadingComplaints = false;
    hasLoadError = true;
    renderComplaintCards();
  }
}

// Community Upvoting Action
window.upvoteComplaint = async function (cid) {
  if (!cid) return;
  try {
    if (window.CivicBuzzAPI?.complaints?.upvote) {
      const res = await window.CivicBuzzAPI.complaints.upvote(cid);
      const newCount = res?.data?.upvotes || (allComplaints.find(c => c.complaint_id === cid)?.upvotes || 1) + 1;
      const countEl = document.getElementById(`upvote_cnt_${cid}`);
      if (countEl) countEl.textContent = newCount;
      showToast(`★ Upvoted #${cid}! Community urgency elevated.`);
      loadLiveComplaints();
    } else if (window.ComplaintStore?.upvote) {
      const doc = window.ComplaintStore.upvote(cid);
      const countEl = document.getElementById(`upvote_cnt_${cid}`);
      if (countEl) countEl.textContent = doc?.upvotes || 1;
      showToast(`★ Upvoted #${cid}!`);
      loadLiveComplaints();
    }
  } catch (_) {
    showToast(`Upvote recorded for #${cid}.`);
  }
};

// Live synchronization listeners across tabs & submissions
window.addEventListener('civicbuzz_data_updated', function () {
  loadLiveComplaints();
});

window.addEventListener('storage', function (e) {
  if (e.key === 'civicbuzz_complaints' || e.key === 'civicbuzz_registered_complaints' || e.key === 'civicbuzz_complaints_tick') {
    loadLiveComplaints();
  }
});

// Initialize on page ready
document.addEventListener('DOMContentLoaded', function () {
  setupFilterChips();
  initTrackMap();
  loadLiveComplaints();
});

setupFilterChips();
initTrackMap();
loadLiveComplaints();
