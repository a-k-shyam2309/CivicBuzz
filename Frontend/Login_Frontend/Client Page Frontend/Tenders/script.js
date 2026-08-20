/* =========================================================
   CivicBuzz Tenders
   Small, reusable frontend interactions only.
   Backend/API integration can be added later.
   ========================================================= */

// ---------------------------------------------------------
// 1. Category filtering for government tender cards
// ---------------------------------------------------------

const filterButtons = document.querySelectorAll(".filter-button");
const tenderCards = document.querySelectorAll(".tender-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Update active filter button.
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const selectedCategory = button.dataset.filter;

    // Show only matching cards.
    tenderCards.forEach((card) => {
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

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function updateVotePercentages() {
  // Calculate total votes across all proposals
  const allVoteCounts = Array.from(
    document.querySelectorAll(".vote-summary strong")
  ).map((el) => parseInt(el.textContent) || 0);

  const totalVotes = allVoteCounts.reduce((sum, count) => sum + count, 0);

  // Update each card's vote bar and percentage
  document.querySelectorAll(".priority-card").forEach((card) => {
    const voteSummary = card.querySelector(".vote-summary");
    const voteCount = parseInt(voteSummary.querySelector("strong").textContent);
    const percentage =
      totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

    // Update vote bar width
    const voteBar = card.querySelector(".vote-bar span");
    voteBar.style.width = percentage + "%";

    // Update percentage text
    voteSummary.querySelector("span").textContent = percentage + "% of votes";
  });
}

voteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // This is only frontend demo behaviour.
    // A real implementation can send the vote to the backend here.
    if (button.classList.contains("voted")) {
      showToast("You have already voted for this proposal.");
      return;
    }

    // Find the vote summary element in the same card
    const card = button.closest(".priority-card");
    const voteSummary = card.querySelector(".vote-summary");
    const voteCountElement = voteSummary.querySelector("strong");

    // Increment the vote count
    const currentVotes = parseInt(voteCountElement.textContent);
    const newVotes = currentVotes + 1;
    voteCountElement.textContent = newVotes + " votes";

    // Update all vote percentages
    updateVotePercentages();

    // Mark button as voted
    button.classList.add("voted");
    button.textContent = "Voted";
    showToast(`Vote recorded for "${button.dataset.proposal}".`);
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
  progressLine.style.width = progressPercentage + "%";

  // Update stage styles
  for (let i = 1; i <= stageCount; i++) {
    const stageElement = document.getElementById(`stage-${i}`);
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

// Make stages clickable to change progress
document.querySelectorAll(".progress-stage").forEach((stage) => {
  stage.addEventListener("click", () => {
    const stageNum = parseInt(stage.dataset.stage);
    currentProgress = stageNum;
    updateTenderProgress();
    
    const stageNames = [
      "Reported",
      "Acknowledged",
      "In Progress",
      "Resolved",
      "Completed",
    ];
    showToast(`Tender updated to: ${stageNames[stageNum - 1]}`);
  });
});

// Initialize progress display
updateTenderProgress();

// ---------------------------------------------------------
// 5. Official procurement button
// ---------------------------------------------------------

document.getElementById("officialButton").addEventListener("click", () => {
  // Replace this message with the official procurement URL
  // when the backend/API integration is ready.
  showToast("Official procurement link can be connected here.");
});
