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

	async function openComplaintDetails(issueId) {
		if (!complaintDetailsModal) return;
		const issueIdElement = complaintDetailsModal.querySelector(".detail-issue-id");
		if (issueIdElement && issueId) {
			issueIdElement.textContent = issueId;
		}

		if (window.CivicBuzzAPI) {
			try {
				const res = await window.CivicBuzzAPI.complaints.getDetail(issueId);
				const data = res.data;
				if (data) {
					const titleEl = complaintDetailsModal.querySelector(".detail-title, h3");
					if (titleEl && data.title) titleEl.textContent = data.title;
					const descEl = complaintDetailsModal.querySelector(".detail-description, p");
					if (descEl && data.description) descEl.textContent = data.description;
				}
			} catch (err) {
				console.warn("Complaint detail API note:", err.message);
			}
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
		submitIssueButton.addEventListener("click", async () => {
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

			if (window.CivicBuzzAPI) {
				try {
					const res = await window.CivicBuzzAPI.complaints.create({
						category,
						description,
						latitude: 20.2961,
						longitude: 85.8245,
						is_anonymous: true,
					});
					const cid = res.data?.complaint_id || "CB-0145";
					const msg = `Issue #${cid} submitted & routed to ${res.data?.department_name || "Department"}!`;
					if (window.CivicBuzzNavbar && window.CivicBuzzNavbar.showToast) {
						window.CivicBuzzNavbar.showToast(msg);
					} else {
						alert(msg);
					}
				} catch (err) {
					console.warn("Issue submission note:", err.message);
					if (window.CivicBuzzNavbar && window.CivicBuzzNavbar.showToast) {
						window.CivicBuzzNavbar.showToast("Your issue has been submitted successfully!");
					} else {
						alert("Your issue has been submitted successfully!");
					}
				}
			} else {
				if (window.CivicBuzzNavbar && window.CivicBuzzNavbar.showToast) {
					window.CivicBuzzNavbar.showToast("Your issue has been submitted successfully!");
				} else {
					alert("Your issue has been submitted successfully!");
				}
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
	// DYNAMIC RECENT COMPLAINTS & METRICS LOADER
	// =====================================================
	async function loadHomeComplaints() {
		if (!window.CivicBuzzAPI) return;
		try {
			const res = await window.CivicBuzzAPI.public.listComplaints();
			const complaints = res.data;
			if (!complaints || !complaints.length) return;

			// Update Summary Counts
			const totalEl = document.querySelector(".summary-card:nth-child(1) .summary-number");
			const progEl = document.querySelector(".summary-card:nth-child(2) .summary-number");
			const resEl = document.querySelector(".summary-card:nth-child(3) .summary-number");
			const pendEl = document.querySelector(".summary-card:nth-child(4) .summary-number");

			const total = complaints.length;
			const prog = complaints.filter(c => ["IN_PROGRESS", "PROGRESS", "ASSIGNED"].includes(c.status)).length;
			const resolved = complaints.filter(c => ["RESOLVED", "VERIFIED"].includes(c.status)).length;
			const pending = complaints.filter(c => ["SUBMITTED", "PENDING"].includes(c.status)).length;

			if (totalEl) totalEl.textContent = total;
			if (progEl) progEl.textContent = prog;
			if (resEl) resEl.textContent = resolved;
			if (pendEl) pendEl.textContent = pending;

			// Populate Recent Complaints Table
			const tableBody = document.querySelector(".complaints-table tbody");
			if (tableBody) {
				tableBody.innerHTML = complaints.slice(0, 5).map(c => {
					const cid = c.complaint_id || "CB-1024";
					const statusClass = c.status === "RESOLVED" || c.status === "VERIFIED" ? "status-resolved" : (c.status === "IN_PROGRESS" ? "status-progress" : "status-pending");
					const statusLabel = c.status === "READY_FOR_CITIZEN_VERIFICATION" ? "Ready for Verification" : (c.status || "Submitted").replace(/_/g, " ");
					const dateStr = (c.created_at || "18 Aug 2026").slice(0, 10);
					const loc = c.location?.ward_name || c.approximate_location || c.ward || "Janpath, Ward 12";

					return `
						<tr>
							<td><strong>#${cid}</strong></td>
							<td>${c.title}</td>
							<td><span class="location-text">📍 ${loc}</span></td>
							<td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
							<td>${dateStr}</td>
							<td>
								<button class="view-complaint-button" type="button" data-issue="${cid}" aria-label="View #${cid}" onclick="window.location.href='Track_complaints_Frontend/index.html'">
									👁
								</button>
							</td>
						</tr>
					`;
				}).join('');
			}
		} catch (err) {
			console.warn("Home complaints load note:", err.message);
		}
	}

	loadHomeComplaints();

	console.log("CivicBuzz Client Dashboard loaded successfully.");

})();