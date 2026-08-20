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

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const title = formData.get("title") || "New Municipal Tender";
  const location = formData.get("location") || "Ward 12";
  const budgetStr = formData.get("budget") || "250000";
  const budget = parseFloat(budgetStr.replace(/[^\d.]/g, "")) || 250000.0;
  const description = formData.get("description") || "Infrastructure repair project";

  if (window.CivicBuzzAPI) {
    window.CivicBuzzAPI.request("/admin/tenders", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        ward_id: 12,
        category: "Roads",
        location,
        estimated_budget: budget,
        duration_days: 30,
        verified_locations_count: 5,
      }),
    }).then(() => {
      showToast(`Tender "${title}" created and published to public registry.`);
    }).catch((err) => {
      console.warn("Tender API note:", err.message);
      showToast("Tender saved as draft.");
    });
  } else {
    showToast("Tender saved as draft.");
  }

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
