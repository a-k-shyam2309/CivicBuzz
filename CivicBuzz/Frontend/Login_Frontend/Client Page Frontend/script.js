// =========================================================
// CIVICBUZZ CLIENT DASHBOARD
// SCRIPT.JS
// =========================================================

(() => {
	"use strict";

	// =====================================================
	// HERO SLIDER
	// =====================================================

	const heroSlider = document.getElementById("heroSlider");
	const heroSlides = document.querySelectorAll(".hero-slide");
	const heroDots = document.querySelectorAll(".hero-dot");
	const heroPrev = document.getElementById("heroPrev");
	const heroNext = document.getElementById("heroNext");

	let currentSlide = 0;
	let heroTimer = null;
	const slideDuration = 5000;

	function showSlide(index) {
		if (!heroSlides.length) {
			return;
		}

		if (index >= heroSlides.length) {
			index = 0;
		}

		if (index < 0) {
			index = heroSlides.length - 1;
		}

		currentSlide = index;

		heroSlides.forEach((slide) => {
			slide.classList.remove("active");
		});

		heroDots.forEach((dot) => {
			dot.classList.remove("active");
		});

		if (heroSlides[currentSlide]) {
			heroSlides[currentSlide].classList.add("active");
		}

		if (heroDots[currentSlide]) {
			heroDots[currentSlide].classList.add("active");
		}
	}

	function nextSlide() {
		showSlide(currentSlide + 1);
	}

	function previousSlide() {
		showSlide(currentSlide - 1);
	}

	function stopHeroSlider() {
		if (heroTimer) {
			clearInterval(heroTimer);
			heroTimer = null;
		}
	}

	function startHeroSlider() {
		stopHeroSlider();
		heroTimer = setInterval(() => {
			nextSlide();
		}, slideDuration);
	}

	if (heroNext) {
		heroNext.addEventListener("click", () => {
			nextSlide();
			startHeroSlider();
		});
	}

	if (heroPrev) {
		heroPrev.addEventListener("click", () => {
			previousSlide();
			startHeroSlider();
		});
	}

	heroDots.forEach((dot) => {
		dot.addEventListener("click", () => {
			const slideIndex = Number(dot.dataset.slide);
			showSlide(slideIndex);
			startHeroSlider();
		});
	});

	if (heroSlider) {
		heroSlider.addEventListener("mouseenter", stopHeroSlider);
		heroSlider.addEventListener("mouseleave", startHeroSlider);
		heroSlider.addEventListener("touchstart", stopHeroSlider, { passive: true });
		heroSlider.addEventListener("touchend", startHeroSlider, { passive: true });
	}

	if (heroSlides.length > 1) {
		showSlide(0);
		startHeroSlider();
	}

	// =====================================================
	// MODAL ELEMENTS
	// =====================================================

	const reportIssueModal = document.getElementById("reportIssueModal");
	const complaintDetailsModal = document.getElementById("complaintDetailsModal");
	const closeReportModal = document.getElementById("closeReportModal");
	const cancelReportButton = document.getElementById("cancelReportButton");
	const closeComplaintModal = document.getElementById("closeComplaintModal");

	function openReportModal() {
		if (!reportIssueModal) return;
		reportIssueModal.classList.add("active");
		reportIssueModal.setAttribute("aria-hidden", "false");
		document.body.classList.add("modal-open");
		stopHeroSlider();
	}

	function closeReportModalFunction() {
		if (!reportIssueModal) return;
		reportIssueModal.classList.remove("active");
		reportIssueModal.setAttribute("aria-hidden", "true");
		document.body.classList.remove("modal-open");
		startHeroSlider();
	}

	function openComplaintDetails(issueId) {
		if (!complaintDetailsModal) return;
		const issueIdElement = complaintDetailsModal.querySelector(".detail-issue-id");
		if (issueIdElement && issueId) {
			issueIdElement.textContent = issueId;
		}

		complaintDetailsModal.classList.add("active");
		complaintDetailsModal.setAttribute("aria-hidden", "false");
		document.body.classList.add("modal-open");
		stopHeroSlider();
	}

	function closeComplaintDetails() {
		if (!complaintDetailsModal) return;
		complaintDetailsModal.classList.remove("active");
		complaintDetailsModal.setAttribute("aria-hidden", "true");
		document.body.classList.remove("modal-open");
		startHeroSlider();
	}

	const allHeroReportButtons = document.querySelectorAll(".hero-report-button");
	allHeroReportButtons.forEach((button) => {
		// Only attach modal if it doesn't already have an onclick redirect
		if (!button.getAttribute("onclick")) {
			button.addEventListener("click", openReportModal);
		}
	});

	if (closeReportModal) {
		closeReportModal.addEventListener("click", closeReportModalFunction);
	}

	if (cancelReportButton) {
		cancelReportButton.addEventListener("click", closeReportModalFunction);
	}

	const complaintViewButtons = document.querySelectorAll(".view-complaint-button");
	complaintViewButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const issueId = button.dataset.issue || "CB-1024";
			openComplaintDetails(issueId);
		});
	});

	if (closeComplaintModal) {
		closeComplaintModal.addEventListener("click", closeComplaintDetails);
	}

	// =====================================================
	// TRACK COMPLAINT
	// =====================================================

	const trackNowButton = document.getElementById("trackNowButton");
	const issueIdInput = document.getElementById("issueIdInput");

	function trackComplaint() {
		if (!issueIdInput) return;
		const issueId = issueIdInput.value.trim().toUpperCase();

		if (!issueId) {
			if (window.CivicBuzzNavbar && window.CivicBuzzNavbar.showToast) {
				window.CivicBuzzNavbar.showToast("Please enter an Issue ID.");
			} else {
				alert("Please enter an Issue ID.");
			}
			issueIdInput.focus();
			return;
		}

		const matchingButton = document.querySelector(`.view-complaint-button[data-issue="${issueId}"]`);
		if (matchingButton) {
			openComplaintDetails(issueId);
			return;
		}

		// If not in table, still open modal with the searched ID
		openComplaintDetails(issueId);
	}

	if (trackNowButton) {
		trackNowButton.addEventListener("click", trackComplaint);
	}

	if (issueIdInput) {
		issueIdInput.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				event.preventDefault();
				trackComplaint();
			}
		});
	}

	// =====================================================
	// SUBMIT ISSUE FORM
	// =====================================================

	const submitIssueButton = document.getElementById("submitIssueButton");
	const issueCategory = document.getElementById("issueCategory");
	const issueDescription = document.getElementById("issueDescription");
	const issuePhoto = document.getElementById("issuePhoto");

	if (submitIssueButton) {
		submitIssueButton.addEventListener("click", () => {
			const category = issueCategory ? issueCategory.value : "";
			const description = issueDescription ? issueDescription.value.trim() : "";

			if (!category) {
				alert("Please select an issue category.");
				if (issueCategory) issueCategory.focus();
				return;
			}

			if (!description) {
				alert("Please describe the problem.");
				if (issueDescription) issueDescription.focus();
				return;
			}

			if (window.CivicBuzzNavbar && window.CivicBuzzNavbar.showToast) {
				window.CivicBuzzNavbar.showToast("Your issue has been submitted successfully!");
			} else {
				alert("Your issue has been submitted successfully!");
			}

			if (issueCategory) issueCategory.value = "";
			if (issueDescription) issueDescription.value = "";
			if (issuePhoto) issuePhoto.value = "";

			closeReportModalFunction();
		});
	}

	// =====================================================
	// CLOSE MODAL OUTSIDE CLICK & ESC
	// =====================================================

	if (reportIssueModal) {
		reportIssueModal.addEventListener("click", (event) => {
			if (event.target === reportIssueModal) {
				closeReportModalFunction();
			}
		});
	}

	if (complaintDetailsModal) {
		complaintDetailsModal.addEventListener("click", (event) => {
			if (event.target === complaintDetailsModal) {
				closeComplaintDetails();
			}
		});
	}

	document.addEventListener("keydown", (event) => {
		if (event.key !== "Escape") return;
		if (reportIssueModal && reportIssueModal.classList.contains("active")) {
			closeReportModalFunction();
		}
		if (complaintDetailsModal && complaintDetailsModal.classList.contains("active")) {
			closeComplaintDetails();
		}
	});

	// =====================================================
	// IMAGE ERROR HANDLING
	// =====================================================

	const images = document.querySelectorAll("img");
	images.forEach((image) => {
		image.addEventListener("error", () => {
			image.classList.add("image-load-error");
		});
	});

	console.log("CivicBuzz Client Dashboard loaded successfully.");

})();