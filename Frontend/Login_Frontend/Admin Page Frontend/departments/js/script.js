/* =============================================================
   CivicBuzz Admin — Departments Standalone Page
   Fully synchronized with DepartmentStore & CivicBuzzAPI
   ============================================================= */

const searchInput = document.getElementById("departmentSearch");
const departmentTrack = document.getElementById("departmentTrack");
const emptyState = document.getElementById("departmentEmpty");
const statTotal = document.getElementById("statTotal");
const statActive = document.getElementById("statActive");

const modal = document.getElementById("addDepartmentModal");
const openModalBtn = document.getElementById("openAddDepartment");
const closeModalBtn = document.getElementById("closeAddDepartment");
const cancelModalBtn = document.getElementById("cancelAddDepartment");
const addDepartmentForm = document.getElementById("addDepartmentForm");

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value || "";
  return div.innerHTML;
}

function openModal() {
  if (modal) modal.hidden = false;
}

function closeModal() {
  if (modal) modal.hidden = true;
  if (addDepartmentForm) addDepartmentForm.reset();
}

openModalBtn?.addEventListener("click", openModal);
closeModalBtn?.addEventListener("click", closeModal);
cancelModalBtn?.addEventListener("click", closeModal);

modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
});

// Render dynamic departments from DepartmentStore / CivicBuzzAPI with instant 0ms pre-render
function renderDepartments() {
  if (!departmentTrack) return;

  const localDepts = window.DepartmentStore?.getAll ? window.DepartmentStore.getAll() : [];
  renderDeptTrack(localDepts);

  if (window.CivicBuzzAPI?.admin?.listDepartments) {
    window.CivicBuzzAPI.admin.listDepartments().then((res) => {
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        renderDeptTrack(res.data);
      }
    }).catch(() => {});
  }
}

function renderDeptTrack(depts) {
  if (!departmentTrack) return;
  const complaints = window.ComplaintStore?.getAll ? window.ComplaintStore.getAll() : [];

  if (statTotal) statTotal.textContent = depts.length;
  if (statActive) statActive.textContent = depts.filter(d => (d.status || "").toUpperCase() === "ACTIVE").length;

  const query = (searchInput?.value || "").trim().toLowerCase();
  const filtered = depts.filter(d => {
    if (!query) return true;
    return (d.name || "").toLowerCase().includes(query) ||
           (d.head_name || "").toLowerCase().includes(query) ||
           (d.email || "").toLowerCase().includes(query);
  });

  if (filtered.length === 0) {
    departmentTrack.innerHTML = "";
    if (emptyState) emptyState.hidden = false;
    return;
  }
  if (emptyState) emptyState.hidden = true;

  let html = "";
  filtered.forEach(d => {
    const deptCodeClean = (d.code || "").toUpperCase();
    const openCount = complaints.filter(c => (c.department_code || "").toUpperCase() === deptCodeClean && ["SUBMITTED", "PENDING", "ASSIGNED", "IN_PROGRESS"].includes((c.status || "").toUpperCase())).length;
    const isAct = (d.status || "ACTIVE").toUpperCase() === "ACTIVE";

    html += `
      <article class="department-card" data-name="${escapeHTML((d.name || '').toLowerCase())}">
        <div class="card-topline">
          <span class="dept-icon">${d.icon || '🏢'}</span>
          <span class="badge ${isAct ? 'badge-success' : 'badge-warning'}">${isAct ? 'Active' : (d.status || 'Understaffed')}</span>
        </div>
        <h3>${escapeHTML(d.name)}</h3>
        <p class="card-description">${escapeHTML(d.description || 'Municipal department handling civic affairs.')}</p>
        <dl class="dept-meta">
          <div><dt>Head</dt><dd>${escapeHTML(d.head_name || 'Officer')}</dd></div>
          <div><dt>Email</dt><dd>${escapeHTML(d.email || 'info@civicbuzz.gov.in')}</dd></div>
        </dl>
        <div class="dept-footline">
          <span><strong>${openCount}</strong> open issues</span>
          <span class="mono">${d.sla_hours || 24}h SLA</span>
        </div>
      </article>
    `;
  });

  departmentTrack.innerHTML = html;
}

// Suggestions advice logic
const suggestionsBox = document.getElementById("deptSearchSuggestions");

function renderSuggestions(query) {
  if (!suggestionsBox) return;
  const cleanQ = (query || "").trim().toLowerCase();

  if (!cleanQ) {
    suggestionsBox.hidden = true;
    suggestionsBox.innerHTML = "";
    return;
  }

  const depts = window.DepartmentStore?.getAll ? window.DepartmentStore.getAll() : [];
  const matches = depts.filter(d => {
    return (d.name || "").toLowerCase().includes(cleanQ) ||
           (d.head_name || "").toLowerCase().includes(cleanQ) ||
           (d.email || "").toLowerCase().includes(cleanQ);
  });

  if (matches.length === 0) {
    suggestionsBox.innerHTML = `<div style="padding:8px 10px;color:var(--text-muted);font-size:11px;text-align:center;">No matching departments</div>`;
    suggestionsBox.hidden = false;
    return;
  }

  let html = `<div class="suggest-header">Suggestions (${matches.length})</div>`;
  matches.slice(0, 4).forEach(d => {
    html += `
      <div class="dept-suggest-item" data-name="${escapeHTML(d.name)}">
        <div class="suggest-left">
          <span class="suggest-icon">${d.icon || '🏢'}</span>
          <div class="suggest-info">
            <strong>${escapeHTML(d.name)}</strong>
            <small>${escapeHTML(d.head_name || 'In-Charge')}</small>
          </div>
        </div>
      </div>
    `;
  });

  suggestionsBox.innerHTML = html;
  suggestionsBox.hidden = false;

  suggestionsBox.querySelectorAll(".dept-suggest-item").forEach(item => {
    item.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = item.getAttribute("data-name");
      }
      suggestionsBox.hidden = true;
      renderDepartments();
    });
  });
}

searchInput?.addEventListener("input", (e) => {
  renderSuggestions(e.target.value);
  renderDepartments();
});

document.addEventListener("click", (e) => {
  if (!searchInput?.contains(e.target) && !suggestionsBox?.contains(e.target)) {
    if (suggestionsBox) suggestionsBox.hidden = true;
  }
});

addDepartmentForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(addDepartmentForm);
  const name = formData.get("name").trim();
  const head = formData.get("head").trim();
  const email = formData.get("email").trim();
  const description = formData.get("description").trim();

  const payload = {
    name,
    head_name: head,
    email,
    description,
    status: "ACTIVE"
  };

  if (window.CivicBuzzAPI?.admin?.createDepartment) {
    await window.CivicBuzzAPI.admin.createDepartment(payload);
  } else if (window.DepartmentStore?.add) {
    window.DepartmentStore.add(payload);
  }

  closeModal();
  renderDepartments();
});

window.addEventListener("civicbuzz:departments_changed", renderDepartments);
document.addEventListener("DOMContentLoaded", renderDepartments);
renderDepartments();
