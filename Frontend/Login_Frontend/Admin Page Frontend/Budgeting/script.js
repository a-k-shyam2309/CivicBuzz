/* CivicBuzz Budgeting: lightweight interactions only */

// Filter tender cards by their current workflow status.
const filterButtons = document.querySelectorAll(".filter-button");
const tenderCards = document.querySelectorAll(".tender-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const selected = button.dataset.filter;

    tenderCards.forEach((card) => {
      card.hidden = selected !== "all" && card.dataset.status !== selected;
    });
  });
});

// Reusable mouse-drag scrolling for horizontal dashboards.
function enableDragScroll(track) {
  let dragging = false;
  let startX = 0;
  let startScroll = 0;

  track.addEventListener("mousedown", (event) => {
    dragging = true;
    startX = event.pageX;
    startScroll = track.scrollLeft;
  });

  window.addEventListener("mouseup", () => {
    dragging = false;
  });

  track.addEventListener("mousemove", (event) => {
    if (!dragging) return;
    event.preventDefault();
    track.scrollLeft = startScroll - (event.pageX - startX);
  });
}

document.querySelectorAll(".horizontal-track").forEach(enableDragScroll);

// Simple toast helper for demo actions.
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2300);
}

// Add Tender modal.
const modal = document.getElementById("tenderModal");
const form = document.getElementById("tenderForm");

function openModal() {
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

document.getElementById("openTenderModal").addEventListener("click", openModal);
document.getElementById("closeTenderModal").addEventListener("click", closeModal);
document.getElementById("cancelTender").addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
});

// Save Draft is currently frontend-only.
// Replace this block with a POST request when the backend is ready.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("Tender saved as draft. Backend connection can be added here.");
  form.reset();
  closeModal();
});

// Tender action buttons.
document.querySelectorAll(".view-tender").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(`Opening management view for ${button.dataset.tender}.`);
  });
});

document.getElementById("viewAllActivity").addEventListener("click", () => {
  showToast("Full activity history can be connected to the admin API.");
});

document.getElementById("profileButton").addEventListener("click", () => {
  showToast("Admin profile menu can be connected here.");
});
