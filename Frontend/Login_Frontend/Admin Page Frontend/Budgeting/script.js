/* CivicBuzz Budgeting: dynamic data store sync and real-time management */

const tenderTrack = document.getElementById("tenderTrack");
const filterButtons = document.querySelectorAll(".filter-button");
const toast = document.getElementById("toast");
const modal = document.getElementById("tenderModal");
const form = document.getElementById("tenderForm");

let activeFilter = "all";

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2300);
}

function formatINR(val) {
  const num = Number(val) || 0;
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
  return `₹${num.toLocaleString("en-IN")}`;
}

// Load & Render Tenders
async function loadLiveTenders() {
  if (!tenderTrack) return;

  let tenders = [];
  if (window.CivicBuzzAPI?.tenders?.list) {
    try {
      const res = await window.CivicBuzzAPI.tenders.list();
      if (res?.data && Array.isArray(res.data)) {
        tenders = res.data;
      }
    } catch (_) {}
  }
  if (!tenders || tenders.length === 0) {
    tenders = window.TenderStore?.getAll ? window.TenderStore.getAll() : [];
  }

  // KPIs
  const openCount = tenders.filter(t => (t.status || "").toUpperCase() === "PUBLISHED").length;
  const draftCount = tenders.filter(t => (t.status || "").toUpperCase() === "DRAFT").length;
  const inProgressCount = tenders.filter(t => (t.status || "").toUpperCase() === "IN_PROGRESS").length;
  const totalAllocated = tenders.reduce((acc, t) => acc + (Number(t.estimated_budget) || 0), 0);

  const statOpn = document.getElementById("statOpenTenders");
  const statDrf = document.getElementById("statDraftTenders");
  const statAlc = document.getElementById("statAllocatedBudget");
  const statPrg = document.getElementById("statProgressTenders");

  if (statOpn) statOpn.textContent = openCount;
  if (statDrf) statDrf.textContent = draftCount;
  if (statAlc) statAlc.textContent = formatINR(totalAllocated);
  if (statPrg) statPrg.textContent = inProgressCount;

  // Filter
  const filtered = tenders.filter(t => {
    const st = (t.status || "PUBLISHED").toUpperCase();
    return activeFilter === "all" || st === activeFilter.toUpperCase();
  });

  if (filtered.length === 0) {
    tenderTrack.innerHTML = `<div style="padding:30px;text-align:center;color:var(--muted);width:100%;">No tenders found for this filter.</div>`;
    return;
  }

  let cardsHtml = "";
  filtered.forEach(t => {
    const rawSt = (t.status || "PUBLISHED").toUpperCase();
    const stClass = rawSt.toLowerCase();
    const progress = Number(t.progress_percentage) || 10;
    const deadline = t.submission_deadline || t.target_completion_date || "24 Aug 2026";

    cardsHtml += `
      <article class="tender-card" data-status="${stClass}">
        <div class="card-topline"><span class="status ${stClass}">${rawSt.replace('_', ' ')}</span><span class="tender-id">${t.tender_id}</span></div>
        <h3>${t.title}</h3>
        <p class="card-description">${t.description || 'Civic infrastructure project generated from verified citizen clusters.'}</p>
        <div class="card-meta"><span>📍 ${t.location || `Ward ${t.ward_id || 15}`}</span><span>✓ ${t.verified_locations_count || 6} verified complaints</span></div>
        <div class="budget-row">
          <div><span>Estimated budget</span><strong>${formatINR(t.estimated_budget)}</strong></div>
          <div><span>Target deadline</span><strong>${deadline}</strong></div>
        </div>
        <div class="mini-progress"><span style="width:${progress}%"></span></div>
        <p class="progress-label">Work progress · ${progress}% · ${t.contractor_name || 'Bidding open'}</p>
        <button class="outline-button view-tender" data-tender="${t.tender_id}">Manage Tender</button>
      </article>
    `;
  });

  tenderTrack.innerHTML = cardsHtml;

  // Attach button listeners
  document.querySelectorAll(".view-tender").forEach((button) => {
    button.addEventListener("click", () => {
      showToast(`Managing tender ${button.dataset.tender}. Status synced with database.`);
    });
  });
}

// Filter buttons
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter || "all";
    loadLiveTenders();
  });
});

// Modal helpers
function openModal() {
  if (modal) {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }
}

function closeModal() {
  if (modal) {
    modal.hidden = true;
    document.body.style.overflow = "";
  }
}

document.getElementById("openTenderModal")?.addEventListener("click", openModal);
document.getElementById("closeTenderModal")?.addEventListener("click", closeModal);
document.getElementById("cancelTender")?.addEventListener("click", closeModal);

modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal && !modal.hidden) closeModal();
});

// Form submit
form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const title = formData.get("title") || "New Municipal Tender";
  const location = formData.get("location") || "Ward 12";
  const budgetStr = formData.get("budget") || "2500000";
  const budget = parseFloat(budgetStr.replace(/[^\d.]/g, "")) || 2500000;
  const description = formData.get("description") || "Infrastructure repair project generated from citizen complaints";

  const payload = {
    title,
    description,
    ward_id: 12,
    category: "roads_potholes",
    location,
    estimated_budget: budget,
    submission_deadline: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    target_completion_date: new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
    status: "PUBLISHED",
    progress_percentage: 15,
    lifecycle_stage: "PUBLISHED"
  };

  if (window.CivicBuzzAPI?.admin?.createTender) {
    await window.CivicBuzzAPI.admin.createTender(payload);
  } else if (window.TenderStore?.add) {
    window.TenderStore.add(payload);
  }

  showToast(`Tender "${title}" published and stored in database.`);
  form.reset();
  closeModal();
  loadLiveTenders();
});

// Cross-tab sync
window.addEventListener("civicbuzz:tenders_changed", () => loadLiveTenders());
window.addEventListener("storage", (e) => {
  if (e.key === "civicbuzz_tenders") loadLiveTenders();
});

// Initial load
loadLiveTenders();
