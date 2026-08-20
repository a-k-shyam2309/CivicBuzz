/* =============================================================
   CivicBuzz Admin — Departments page
   Two small, independent behaviors. No framework, no build
   step — matches every other Admin page in the project.
   The sidebar's mobile-menu toggle used to live here — that's
   gone now that the page uses the global navbar instead.
   ============================================================= */

// ---- Department directory search filter ------------------------
// Filters the existing cards in place rather than re-rendering —
// there's no data layer here yet, just DOM the backend can later
// swap for server-rendered or fetched cards without touching this
// function's logic.
const searchInput = document.getElementById("departmentSearch");
const departmentCards = document.querySelectorAll(".department-card");
const emptyState = document.getElementById("departmentEmpty");

searchInput?.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  departmentCards.forEach((card) => {
    const matches = card.dataset.name.includes(query);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  if (emptyState) {
    emptyState.hidden = visibleCount !== 0;
  }
});

// ---- Add Department modal --------------------------------------
const modal = document.getElementById("addDepartmentModal");
const openModalBtn = document.getElementById("openAddDepartment");
const closeModalBtn = document.getElementById("closeAddDepartment");
const cancelModalBtn = document.getElementById("cancelAddDepartment");
const addDepartmentForm = document.getElementById("addDepartmentForm");
const departmentTrack = document.getElementById("departmentTrack");
const statTotal = document.getElementById("statTotal");
const statActive = document.getElementById("statActive");

function openModal() {
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
  addDepartmentForm.reset();
}

openModalBtn?.addEventListener("click", openModal);
closeModalBtn?.addEventListener("click", closeModal);
cancelModalBtn?.addEventListener("click", closeModal);

// Close when clicking the dimmed overlay itself, not the modal card
modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
});

// Escapes user-entered text before it's inserted as HTML, so a
// department name or description containing `<`/`&` can't break
// the markup or inject a stray tag.
function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

// Adds a new department card to the directory track. In production
// this would POST to the backend first and re-render from its
// response — this local version keeps the same DOM shape so that
// swap is a one-function change, not a rewrite of the page.
addDepartmentForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(addDepartmentForm);
  const name = escapeHTML(formData.get("name").trim());
  const head = escapeHTML(formData.get("head").trim());
  const email = escapeHTML(formData.get("email").trim());
  const description = escapeHTML(formData.get("description").trim());

  const card = document.createElement("article");
  card.className = "department-card";
  card.dataset.name = name.toLowerCase();
  card.innerHTML = `
    <div class="card-topline">
      <span class="dept-icon">🏢</span>
      <span class="badge badge-success">Active</span>
    </div>
    <h3>${name}</h3>
    <p class="card-description">${description}</p>
    <dl class="dept-meta">
      <div><dt>Head</dt><dd>${head}</dd></div>
      <div><dt>Email</dt><dd>${email}</dd></div>
    </dl>
    <div class="dept-footline">
      <span><strong>0</strong> open issues</span>
      <span class="mono">&mdash;</span>
    </div>
  `;

  departmentTrack.appendChild(card);
  card.scrollIntoView({ behavior: "smooth", inline: "end", block: "nearest" });

  // Keep the overview stat cards in sync with the directory below
  if (statTotal) statTotal.textContent = String(Number(statTotal.textContent) + 1);
  if (statActive) statActive.textContent = String(Number(statActive.textContent) + 1);

  closeModal();
});
