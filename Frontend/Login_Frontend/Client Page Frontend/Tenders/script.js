/* =========================================================
   CivicBuzz Tenders
   Frontend controller with Global Shell & i18n Integration
   ========================================================= */

// ---------------------------------------------------------
// 1. Category filtering for government tender cards
// ---------------------------------------------------------

const filterButtons = document.querySelectorAll(".filter-button");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Update active filter button.
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const selectedCategory = button.dataset.filter;

    // Show only matching cards.
    document.querySelectorAll(".tender-card").forEach((card) => {
      const matches =
        selectedCategory === "all" ||
        card.dataset.category === selectedCategory;

      card.hidden = !matches;
    });
  });
});

// ---------------------------------------------------------
// 2. Simple horizontal drag-to-scroll for both dashboards
// ---------------------------------------------------------

function enableDragScroll(track) {
  let isDragging = false;
  let startX = 0;
  let startScroll = 0;

  track.addEventListener("mousedown", (event) => {
    isDragging = true;
    startX = event.pageX;
    startScroll = track.scrollLeft;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  track.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    event.preventDefault();

    const distance = event.pageX - startX;
    track.scrollLeft = startScroll - distance;
  });
}

// Reuse the same function for both horizontal dashboards.
document.querySelectorAll(".horizontal-track").forEach(enableDragScroll);

// ---------------------------------------------------------
// 3. Enhanced voting interaction with vote count tracking
// ---------------------------------------------------------

const voteButtons = document.querySelectorAll(".vote-button");
const toast = document.getElementById("toast");

function getLang() {
  return (window.CivicBuzzNavbar && window.CivicBuzzNavbar.getLanguage)
    ? window.CivicBuzzNavbar.getLanguage()
    : (localStorage.getItem("civicbuzz-language") || "en");
}

function showToast(message) {
  if (window.CivicBuzzNavbar && window.CivicBuzzNavbar.showToast) {
    window.CivicBuzzNavbar.showToast(message);
    return;
  }
  if (toast) {
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }
}

function updateVotePercentages() {
  // Calculate total votes across all proposals
  const allVoteCounts = Array.from(
    document.querySelectorAll(".vote-summary strong")
  ).map((el) => parseInt(el.textContent) || 0);

  const totalVotes = allVoteCounts.reduce((sum, count) => sum + count, 0);
  const lang = getLang();

  // Update each card's vote bar and percentage
  document.querySelectorAll(".priority-card").forEach((card) => {
    const voteSummary = card.querySelector(".vote-summary");
    const voteCount = parseInt(voteSummary.querySelector("strong").textContent);
    const percentage =
      totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

    // Update vote bar width
    const voteBar = card.querySelector(".vote-bar span");
    if (voteBar) {
      voteBar.style.width = percentage + "%";
    }

    // Update percentage text
    const spanEl = voteSummary.querySelector("span");
    if (spanEl) {
      spanEl.textContent = lang === "hi"
        ? `${percentage}% वोट`
        : `${percentage}% of votes`;
    }
  });
}

voteButtons.forEach((button, idx) => {
  button.addEventListener("click", () => {
    const lang = getLang();

    if (button.classList.contains("voted")) {
      showToast(lang === "hi" ? "आप इस प्रस्ताव के लिए पहले ही वोट कर चुके हैं।" : "You have already voted for this proposal.");
      return;
    }

    if (window.CivicBuzzAPI) {
      const projId = idx + 1;
      window.CivicBuzzAPI.projects.vote(projId).catch((err) => {
        console.warn("Vote API note:", err.message);
      });
    }

    // Find the vote summary element in the same card
    const card = button.closest(".priority-card");
    const voteSummary = card.querySelector(".vote-summary");
    const voteCountElement = voteSummary.querySelector("strong");

    // Increment the vote count
    const currentVotes = parseInt(voteCountElement.textContent) || 0;
    const newVotes = currentVotes + 1;
    voteCountElement.textContent = lang === "hi" ? `${newVotes} वोट` : `${newVotes} votes`;

    // Update all vote percentages
    updateVotePercentages();

    // Mark button as voted
    button.classList.add("voted");
    button.textContent = lang === "hi" ? "वोट दिया गया" : "Voted";
    const propTitle = button.dataset.proposal || "Proposal";
    showToast(lang === "hi" ? `"${propTitle}" के लिए वोट दर्ज किया गया।` : `Vote recorded for "${propTitle}".`);
  });
});

// ---------------------------------------------------------
// 4. Tender progress tracker (dynamic progress bar)
// ---------------------------------------------------------

let currentProgress = 2; // Start at stage 2 (Acknowledged)

function updateTenderProgress() {
  const stageCount = 5;
  const progressLine = document.getElementById("progressLine");

  // Calculate progress line width
  const progressPercentage = ((currentProgress - 1) / (stageCount - 1)) * 100;
  if (progressLine) {
    progressLine.style.width = progressPercentage + "%";
  }

  // Update stage styles
  for (let i = 1; i <= stageCount; i++) {
    const stageElement = document.getElementById(`stage-${i}`);
    if (stageElement) {
      stageElement.classList.remove("completed", "active", "pending");

      if (i < currentProgress) {
        stageElement.classList.add("completed");
      } else if (i === currentProgress) {
        stageElement.classList.add("active");
      } else {
        stageElement.classList.add("pending");
      }
    }
  }
}

// Make stages clickable to change progress
document.querySelectorAll(".progress-stage").forEach((stage) => {
  stage.addEventListener("click", () => {
    const stageNum = parseInt(stage.dataset.stage);
    currentProgress = stageNum;
    updateTenderProgress();
    
    const stageNamesEn = [
      "Reported",
      "Acknowledged",
      "In Progress",
      "Resolved",
      "Completed",
    ];
    const stageNamesHi = [
      "दर्ज की गई",
      "स्वीकृत",
      "प्रगति पर",
      "हल किया गया",
      "पूर्ण",
    ];
    const lang = getLang();
    const stageName = lang === "hi" ? stageNamesHi[stageNum - 1] : stageNamesEn[stageNum - 1];
    showToast(lang === "hi" ? `टेंडर अपडेट किया गया: ${stageName}` : `Tender updated to: ${stageName}`);
  });
});

// Initialize progress display
updateTenderProgress();

// ---------------------------------------------------------
// 5. Official procurement button
// ---------------------------------------------------------

const officialBtn = document.getElementById("officialButton");
if (officialBtn) {
  officialBtn.addEventListener("click", () => {
    const lang = getLang();
    showToast(lang === "hi" ? "आधिकारिक खरीद लिंक यहाँ जोड़ा जा सकता है।" : "Official procurement link can be connected here.");
  });
}

// ---------------------------------------------------------
// 6. Add tender modal and client-side card creation
// ---------------------------------------------------------

const tenderModal = document.getElementById("tenderModal");
const addTenderForm = document.getElementById("addTenderForm");
const openTenderModal = document.getElementById("openTenderModal");
const closeTenderModal = document.getElementById("closeTenderModal");
const cancelTenderModal = document.getElementById("cancelTenderModal");
let lastFocusedElement;

function setTenderModal(open) {
  if (!tenderModal) return;
  tenderModal.classList.toggle("open", open);
  tenderModal.setAttribute("aria-hidden", String(!open));
  document.body.style.overflow = open ? "hidden" : "";
  if (open) {
    lastFocusedElement = document.activeElement;
    const input = tenderModal.querySelector("input");
    if (input) input.focus();
  } else if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

if (openTenderModal) openTenderModal.addEventListener("click", () => setTenderModal(true));
if (closeTenderModal) closeTenderModal.addEventListener("click", () => setTenderModal(false));
if (cancelTenderModal) cancelTenderModal.addEventListener("click", () => setTenderModal(false));
if (tenderModal) {
  tenderModal.addEventListener("click", (event) => {
    if (event.target === tenderModal) setTenderModal(false);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && tenderModal && tenderModal.classList.contains("open")) {
    setTenderModal(false);
  }
});

function formatIndianCurrency(value) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
}

if (addTenderForm) {
  addTenderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(addTenderForm));
    const deadline = new Date(`${values.deadline}T00:00:00`);
    const daysUntilClose = Math.max(0, Math.ceil((deadline - new Date()) / 86400000));
    const track = document.querySelector("#tenderTrack");
    const card = document.createElement("article");
    card.className = "tender-card";
    card.dataset.category = values.category;
    card.innerHTML = `
      <div class="card-topline"><span class="status status-open">Open</span><span class="status status-warning">${daysUntilClose === 0 ? "Closing today" : `Closing in ${daysUntilClose} days`}</span></div>
      <h3></h3><p class="card-description"></p>
      <div class="card-tags"><span></span><span>✓ Newly added</span></div>
      <div class="tender-details"><div><span>Estimated value</span><strong></strong></div><div><span>Duration</span><strong></strong></div><div><span>Community votes</span><strong>0</strong></div></div>
      <a class="primary-button" href="#tender-detail">View Tender</a>`;
    card.querySelector("h3").textContent = values.title;
    card.querySelector(".card-description").textContent = values.description;
    card.querySelector(".card-tags span").textContent = `📍 ${values.location}`;
    card.querySelector(".tender-details strong").textContent = `₹${formatIndianCurrency(values.value)}`;
    card.querySelectorAll(".tender-details strong")[1].textContent = `${values.duration} days`;
    if (track) track.prepend(card);
    
    const countEl = document.getElementById("openTenderCount");
    if (countEl) {
      countEl.textContent = String(Number(countEl.textContent || 0) + 1);
    }
    
    addTenderForm.reset();
    setTenderModal(false);

    // Apply translations if language is Hindi
    if (window.CivicBuzzNavbar && window.CivicBuzzNavbar.translatePage) {
      window.CivicBuzzNavbar.translatePage(window.CivicBuzzNavbar.getLanguage(), false);
    }

    const lang = getLang();
    showToast(lang === "hi" ? `टेंडर “${values.title}” सफलतापूर्वक जोड़ दिया गया है।` : `Tender “${values.title}” has been added.`);
  });
}

