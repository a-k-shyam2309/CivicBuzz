/* =========================================================
   CivicBuzz Tenders
   Frontend controller with Dynamic Database Integration,
   Image Upload, Category Fallback, and Transparent Tender Details
   ========================================================= */

// ---------------------------------------------------------
// 0. Store Initialization & Helper Functions
// ---------------------------------------------------------

if (typeof window.TenderStore !== "undefined") {
  window.TenderStore.init();
}

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
  const toast = document.getElementById("toast");
  if (toast) {
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
  }
}

function formatIndianCurrency(value) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(num);
}

function getCategoryBadge(category) {
  const cat = String(category || "roads").toLowerCase();
  if (cat.includes("road") || cat.includes("pothole")) return "🛣️ Roads";
  if (cat.includes("drain")) return "💧 Drainage";
  if (cat.includes("light") || cat.includes("street")) return "💡 Lighting";
  if (cat.includes("sanit") || cat.includes("garb")) return "🧹 Sanitation";
  if (cat.includes("water")) return "🚰 Water Supply";
  if (cat.includes("park")) return "🌳 Parks & Greenery";
  if (cat.includes("infra")) return "🏗️ Infrastructure";
  return "🏛️ Municipal";
}

// ---------------------------------------------------------
// 1. Dynamic Tender Card Rendering
// ---------------------------------------------------------

const tenderTrack = document.getElementById("tenderTrack");
let currentCategoryFilter = "all";

function renderTenders() {
  if (!tenderTrack) return;
  
  const allTenders = (window.TenderStore && window.TenderStore.getAll)
    ? window.TenderStore.getAll()
    : [];
    
  const countEl = document.getElementById("openTenderCount");
  if (countEl) {
    countEl.textContent = String(allTenders.length);
  }

  tenderTrack.innerHTML = allTenders.map((t) => {
    const tid = t.tender_id || t.id || "CB-T-0015";
    const title = t.title || "Civic Infrastructure Project";
    const desc = t.description || "Project generated from verified citizen issues.";
    const cat = String(t.category || "roads").toLowerCase();
    const ward = t.ward || t.location || `Ward ${t.ward_id || 15}`;
    const val = t.estimated_value || t.estimated_budget || 250000;
    const dur = t.duration || `${t.duration_days || 30} days`;
    const votes = t.community_votes || t.communityVotes || 0;
    const locs = t.verified_locations_count || t.verifiedLocations || 3;
    const daysClose = t.closing_in_days || 7;
    const catBadge = getCategoryBadge(cat);
    
    const fallbackImg = window.TenderStore?.getCategoryFallback ? window.TenderStore.getCategoryFallback(cat) : "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80";
    const imgUrl = (t.imageUrl || t.image_url || fallbackImg);

    return `
      <article class="tender-card" data-category="${cat}" onclick="window.location.href='tender-details.html?id=${encodeURIComponent(tid)}'">
        <div class="tender-card-image-wrap" onclick="event.stopPropagation(); window.location.href='tender-details.html?id=${encodeURIComponent(tid)}'">
          <img class="tender-card-image" src="${imgUrl}" alt="${title}" onerror="this.onerror=null; this.src='${fallbackImg}'" />
          <span class="tender-card-cat-badge">${catBadge}</span>
        </div>

        <div class="tender-card-body">
          <div class="card-topline">
            <span class="status status-open">Open</span>
            <span class="status status-warning">${daysClose === 0 ? "Closing today" : `Closing in ${daysClose} days`}</span>
          </div>

          <h3>${title}</h3>
          <p class="card-description">${desc}</p>

          <div class="card-tags">
            <span>📍 ${ward}</span>
            <span>✓ ${locs} verified locations</span>
          </div>

          <div class="tender-details">
            <div><span>Estimated value</span><strong>₹${formatIndianCurrency(val)}</strong></div>
            <div><span>Duration</span><strong>${dur}</strong></div>
            <div><span>Community votes</span><strong id="card_vote_${tid}">${votes}</strong></div>
          </div>

          <a class="primary-button" href="tender-details.html?id=${encodeURIComponent(tid)}" onclick="event.stopPropagation()">View Tender</a>
        </div>
      </article>
    `;
  }).join("");

  applyCategoryFilter();
}

function applyCategoryFilter() {
  document.querySelectorAll(".tender-card").forEach((card) => {
    const cat = card.dataset.category || "";
    let matches = false;
    if (currentCategoryFilter === "all") {
      matches = true;
    } else if (currentCategoryFilter === "roads") {
      matches = cat.includes("road") || cat.includes("pothole");
    } else if (currentCategoryFilter === "drainage") {
      matches = cat.includes("drain");
    } else if (currentCategoryFilter === "lighting") {
      matches = cat.includes("light") || cat.includes("street");
    } else if (currentCategoryFilter === "sanitation") {
      matches = cat.includes("sanit") || cat.includes("garb");
    } else {
      matches = cat.includes(currentCategoryFilter);
    }
    card.hidden = !matches;
  });
}

// ---------------------------------------------------------
// 2. Category Filter Click Handlers
// ---------------------------------------------------------

const filterButtons = document.querySelectorAll(".filter-button");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    currentCategoryFilter = button.dataset.filter || "all";
    applyCategoryFilter();
  });
});

// ---------------------------------------------------------
// 3. Reusable horizontal drag-to-scroll
// ---------------------------------------------------------

function enableDragScroll(track) {
  if (!track) return;
  let isDragging = false;
  let startX = 0;
  let startScroll = 0;

  track.addEventListener("mousedown", (event) => {
    // Don't drag if clicking buttons or links
    if (event.target.closest("button, a, input")) return;
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

document.querySelectorAll(".horizontal-track").forEach(enableDragScroll);

// ---------------------------------------------------------
// 4. Community Priorities Voting System
// ---------------------------------------------------------

const voteButtons = document.querySelectorAll(".vote-button");

function updateVotePercentages() {
  const allVoteCounts = Array.from(
    document.querySelectorAll(".vote-summary strong")
  ).map((el) => parseInt(el.textContent) || 0);

  const totalVotes = allVoteCounts.reduce((sum, count) => sum + count, 0);
  const lang = getLang();

  document.querySelectorAll(".priority-card").forEach((card) => {
    const voteSummary = card.querySelector(".vote-summary");
    if (!voteSummary) return;
    const voteCount = parseInt(voteSummary.querySelector("strong").textContent) || 0;
    const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

    const voteBar = card.querySelector(".vote-bar span");
    if (voteBar) {
      voteBar.style.width = percentage + "%";
    }

    const spanEl = voteSummary.querySelector("span");
    if (spanEl) {
      spanEl.textContent = lang === "hi" ? `${percentage}% वोट` : `${percentage}% of votes`;
    }
  });
}

// Check existing voted proposals in localStorage
function restoreVotedState() {
  const votedProposals = JSON.parse(localStorage.getItem("civicbuzz_voted_proposals") || "[]");
  const lang = getLang();

  voteButtons.forEach((button) => {
    const propTitle = button.dataset.proposal || "";
    if (votedProposals.includes(propTitle)) {
      button.classList.add("voted");
      button.textContent = lang === "hi" ? "वोट दिया गया ✓" : "Voted ✓";
    }
  });
}

voteButtons.forEach((button, idx) => {
  button.addEventListener("click", () => {
    const lang = getLang();
    const propTitle = button.dataset.proposal || "Proposal";
    const votedProposals = JSON.parse(localStorage.getItem("civicbuzz_voted_proposals") || "[]");

    if (button.classList.contains("voted") || votedProposals.includes(propTitle)) {
      showToast(lang === "hi" ? "आप इस प्रस्ताव के लिए पहले ही वोट कर चुके हैं।" : "You have already voted for this proposal.");
      return;
    }

    if (window.CivicBuzzAPI) {
      const projId = idx + 1;
      window.CivicBuzzAPI.projects.vote(projId).catch((err) => {
        console.warn("Vote API note:", err.message);
      });
    }

    // Increment vote count in DOM
    const card = button.closest(".priority-card");
    const voteSummary = card.querySelector(".vote-summary");
    const voteCountElement = voteSummary.querySelector("strong");
    const currentVotes = parseInt(voteCountElement.textContent) || 0;
    const newVotes = currentVotes + 1;
    voteCountElement.textContent = lang === "hi" ? `${newVotes} वोट` : `${newVotes} votes`;

    // Persist vote
    votedProposals.push(propTitle);
    localStorage.setItem("civicbuzz_voted_proposals", JSON.stringify(votedProposals));

    // Update percentages
    updateVotePercentages();

    button.classList.add("voted");
    button.textContent = lang === "hi" ? "वोट दिया गया ✓" : "Voted ✓";
    showToast(lang === "hi" ? `"${propTitle}" के लिए वोट दर्ज किया गया।` : `Vote recorded for "${propTitle}".`);
  });
});

// ---------------------------------------------------------
// 5. Tender progress tracker
// ---------------------------------------------------------

let currentProgress = 2;

function updateTenderProgress() {
  const stageCount = 5;
  const progressLine = document.getElementById("progressLine");

  const progressPercentage = ((currentProgress - 1) / (stageCount - 1)) * 100;
  if (progressLine) {
    progressLine.style.width = progressPercentage + "%";
  }

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

document.querySelectorAll(".progress-stage").forEach((stage) => {
  stage.addEventListener("click", () => {
    const stageNum = parseInt(stage.dataset.stage);
    currentProgress = stageNum;
    updateTenderProgress();
    
    const stageNamesEn = ["Reported", "Acknowledged", "In Progress", "Resolved", "Completed"];
    const stageNamesHi = ["दर्ज की गई", "स्वीकृत", "प्रगति पर", "हल किया गया", "पूर्ण"];
    const lang = getLang();
    const stageName = lang === "hi" ? stageNamesHi[stageNum - 1] : stageNamesEn[stageNum - 1];
    showToast(lang === "hi" ? `टेंडर अपडेट किया गया: ${stageName}` : `Tender updated to: ${stageName}`);
  });
});

const officialBtn = document.getElementById("officialButton");
if (officialBtn) {
  officialBtn.addEventListener("click", () => {
    const lang = getLang();
    showToast(lang === "hi" ? "आधिकारिक खरीद पोर्टल से कनेक्ट किया जा रहा है..." : "Connecting to official municipal procurement portal...");
  });
}

// ---------------------------------------------------------
// 6. Add Tender Modal & Image Upload Flow
// ---------------------------------------------------------

const tenderModal = document.getElementById("tenderModal");
const addTenderForm = document.getElementById("addTenderForm");
const openTenderModal = document.getElementById("openTenderModal");
const closeTenderModal = document.getElementById("closeTenderModal");
const cancelTenderModal = document.getElementById("cancelTenderModal");

const tenderImageFileInput = document.getElementById("tenderImageFileInput");
const tenderImageUrlInput = document.getElementById("tenderImageUrlInput");
const tenderUploadPromptBox = document.getElementById("tenderUploadPromptBox");
const tenderUploadPreviewBox = document.getElementById("tenderUploadPreviewBox");
const tenderUploadPreviewImg = document.getElementById("tenderUploadPreviewImg");
const removeTenderUploadBtn = document.getElementById("removeTenderUploadBtn");

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
  } else {
    resetImageUpload();
    if (lastFocusedElement) lastFocusedElement.focus();
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

// Image Upload Interactions
if (tenderUploadPromptBox && tenderImageFileInput) {
  tenderUploadPromptBox.addEventListener("click", () => {
    tenderImageFileInput.click();
  });

  // Drag and drop support
  tenderUploadPromptBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    tenderUploadPromptBox.style.borderColor = "var(--blue)";
  });
  tenderUploadPromptBox.addEventListener("dragleave", () => {
    tenderUploadPromptBox.style.borderColor = "var(--border)";
  });
  tenderUploadPromptBox.addEventListener("drop", (e) => {
    e.preventDefault();
    tenderUploadPromptBox.style.borderColor = "var(--border)";
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  });

  tenderImageFileInput.addEventListener("change", () => {
    if (tenderImageFileInput.files && tenderImageFileInput.files[0]) {
      handleImageFile(tenderImageFileInput.files[0]);
    }
  });
}

function handleImageFile(file) {
  if (!file.type.startsWith("image/")) {
    showToast("Please select a valid image file (PNG, JPG, WEBP).");
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    if (tenderImageUrlInput) tenderImageUrlInput.value = dataUrl;
    if (tenderUploadPreviewImg) tenderUploadPreviewImg.src = dataUrl;
    if (tenderUploadPromptBox) tenderUploadPromptBox.style.display = "none";
    if (tenderUploadPreviewBox) tenderUploadPreviewBox.style.display = "block";
  };
  reader.readAsDataURL(file);
}

function resetImageUpload() {
  if (tenderImageFileInput) tenderImageFileInput.value = "";
  if (tenderImageUrlInput) tenderImageUrlInput.value = "";
  if (tenderUploadPreviewImg) tenderUploadPreviewImg.src = "";
  if (tenderUploadPromptBox) tenderUploadPromptBox.style.display = "flex";
  if (tenderUploadPreviewBox) tenderUploadPreviewBox.style.display = "none";
}

if (removeTenderUploadBtn) {
  removeTenderUploadBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    resetImageUpload();
  });
}

// Add Tender Form Submission
if (addTenderForm) {
  addTenderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(addTenderForm));
    
    // Store in TenderStore
    let newTender = null;
    if (window.TenderStore && window.TenderStore.add) {
      newTender = window.TenderStore.add(values);
    }

    renderTenders();
    addTenderForm.reset();
    setTenderModal(false);

    if (window.CivicBuzzNavbar && window.CivicBuzzNavbar.translatePage) {
      window.CivicBuzzNavbar.translatePage(window.CivicBuzzNavbar.getLanguage(), false);
    }

    const lang = getLang();
    showToast(lang === "hi" ? `टेंडर “${values.title}” सफलतापूर्वक जोड़ दिया गया है।` : `Tender “${values.title}” has been published.`);
  });
}

// Listen for cross-tab or remote store updates
window.addEventListener("civicbuzz:tenders_changed", () => {
  renderTenders();
});

// ---------------------------------------------------------
// 7. Initialize on DOMContentLoaded
// ---------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  renderTenders();
  updateTenderProgress();
  restoreVotedState();
  updateVotePercentages();
});

