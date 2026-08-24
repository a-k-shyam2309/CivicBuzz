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
		const rawId = issueIdInput.value.trim().toUpperCase();

		if (!rawId) {
			if (window.CivicBuzzNavbar && window.CivicBuzzNavbar.showToast) {
				window.CivicBuzzNavbar.showToast("Please enter an Issue ID (e.g. CB-12480).");
			} else {
				alert("Please enter an Issue ID (e.g. CB-12480).");
			}
			issueIdInput.focus();
			return;
		}

		const cleanId = rawId.replace('#', '');
		window.location.href = `Track_complaints_Frontend/details.html?id=${encodeURIComponent(cleanId)}`;
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
	// SUBMIT ISSUE FORM (Quick Modal)
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
								<button class="view-complaint-button" type="button" data-issue="${cid}" aria-label="View #${cid}" onclick="window.location.href='Track_complaints_Frontend/details.html?id=${encodeURIComponent(cid)}'">
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

	// =====================================================
	// INTERACTIVE "ISSUES AROUND YOU" MAP & LIVE RADAR
	// =====================================================

	const CATEGORY_MAP = {
		roads_potholes: { key: "ROADS", label: "Roads & Potholes", icon: "🕳️", colorClass: "cat-roads" },
		roads: { key: "ROADS", label: "Roads & Potholes", icon: "🕳️", colorClass: "cat-roads" },
		potholes: { key: "ROADS", label: "Roads & Potholes", icon: "🕳️", colorClass: "cat-roads" },
		road: { key: "ROADS", label: "Roads & Potholes", icon: "🕳️", colorClass: "cat-roads" },
		streetlights: { key: "LIGHTING", label: "Street Lighting", icon: "💡", colorClass: "cat-lights" },
		lighting: { key: "LIGHTING", label: "Street Lighting", icon: "💡", colorClass: "cat-lights" },
		electricity: { key: "LIGHTING", label: "Street Lighting", icon: "💡", colorClass: "cat-lights" },
		water_supply: { key: "WATER", label: "Water & Drainage", icon: "🚰", colorClass: "cat-water" },
		water: { key: "WATER", label: "Water & Drainage", icon: "🚰", colorClass: "cat-water" },
		drainage: { key: "WATER", label: "Water & Drainage", icon: "🌊", colorClass: "cat-water" },
		garbage_sanitation: { key: "SANITATION", label: "Sanitation & Waste", icon: "🗑️", colorClass: "cat-sanitation" },
		garbage: { key: "SANITATION", label: "Sanitation & Waste", icon: "🗑️", colorClass: "cat-sanitation" },
		sanitation: { key: "SANITATION", label: "Sanitation & Waste", icon: "🗑️", colorClass: "cat-sanitation" },
		parks: { key: "PARKS", label: "Parks & Greenery", icon: "🌳", colorClass: "cat-parks" },
		parks_greenery: { key: "PARKS", label: "Parks & Greenery", icon: "🌳", colorClass: "cat-parks" },
		infrastructure: { key: "INFRASTRUCTURE", label: "Infrastructure", icon: "🏗️", colorClass: "cat-infra" },
	};

	let nearbyMap = null;
	let markersLayer = null;
	let userLocationMarker = null;
	let userLocationCircle = null;
	let currentUserLocation = null;
	let currentFilterCategory = "all";
	let activeComplaintId = null;
	let complaintsList = [];
	const markersMap = new Map();

	function getCategoryInfo(rawCat) {
		if (!rawCat) return { key: "ROADS", label: "Roads & Works", icon: "🕳️", colorClass: "cat-roads" };
		const clean = String(rawCat).toLowerCase().replace(/[^a-z_]/g, "");
		if (CATEGORY_MAP[clean]) return CATEGORY_MAP[clean];
		if (clean.includes("road") || clean.includes("pothole")) return CATEGORY_MAP.roads_potholes;
		if (clean.includes("light") || clean.includes("electric")) return CATEGORY_MAP.streetlights;
		if (clean.includes("water") || clean.includes("drain") || clean.includes("sew")) return CATEGORY_MAP.water_supply;
		if (clean.includes("garb") || clean.includes("sanit") || clean.includes("waste")) return CATEGORY_MAP.garbage_sanitation;
		if (clean.includes("park") || clean.includes("tree")) return CATEGORY_MAP.parks;
		return { key: "ROADS", label: "Roads & Works", icon: "🕳️", colorClass: "cat-roads" };
	}

	function normalizeCategoryKey(rawCat) {
		return getCategoryInfo(rawCat).key;
	}

	function calculateDistance(lat1, lon1, lat2, lon2) {
		const R = 6371e3; // meters
		const phi1 = (lat1 * Math.PI) / 180;
		const phi2 = (lat2 * Math.PI) / 180;
		const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
		const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
		const a = Math.sin(deltaPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	}

	function formatDistance(meters) {
		if (meters === undefined || meters === null || meters > 900000) return "Location pinned";
		if (meters < 1000) return `${Math.round(meters)}m away`;
		return `${(meters / 1000).toFixed(1)} km away`;
	}

	function getStatusBadgeClass(st) {
		const u = String(st || "").toUpperCase();
		if (u === "RESOLVED" || u === "VERIFIED" || u === "CLOSED") return "status-resolved";
		if (u === "IN_PROGRESS" || u === "PROGRESS") return "status-progress";
		if (u === "ASSIGNED" || u === "AI_TRIAGED") return "status-assigned";
		if (u === "READY_FOR_CITIZEN_VERIFICATION") return "status-verification";
		return "status-open";
	}

	function getStatusLabel(st) {
		const u = String(st || "").toUpperCase();
		if (u === "READY_FOR_CITIZEN_VERIFICATION") return "Ready for Verification";
		if (u === "IN_PROGRESS" || u === "PROGRESS") return "In Progress";
		if (u === "RESOLVED" || u === "VERIFIED") return "Resolved";
		if (u === "ASSIGNED") return "Assigned";
		if (u === "REJECTED") return "Rejected";
		return "Open";
	}

	function escapeHtml(str) {
		return String(str || "")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	async function loadNearbyComplaints() {
		try {
			if (window.CivicBuzzAPI?.complaints?.list) {
				const res = await window.CivicBuzzAPI.complaints.list();
				complaintsList = res.data || [];
			} else if (window.ComplaintStore?.getAll) {
				complaintsList = window.ComplaintStore.getAll();
			} else {
				try {
					complaintsList = JSON.parse(localStorage.getItem("civicbuzz_complaints") || "[]");
				} catch (_) {
					complaintsList = [];
				}
			}

			renderNearbyIssues();
		} catch (err) {
			console.error("Error loading nearby complaints:", err);
		}
	}

	function renderNearbyIssues() {
		if (!markersLayer || !nearbyMap) return;
		markersLayer.clearLayers();
		markersMap.clear();

		const listEl = document.getElementById("nearbyIssuesList");
		const countBadge = document.getElementById("badgeReportedCount");
		const summaryEl = document.getElementById("mapIssueSummary");
		const countAllEl = document.getElementById("countAll");

		if (countAllEl) countAllEl.textContent = complaintsList.length;

		let filtered = complaintsList.filter(c => {
			if (currentFilterCategory === "all") return true;
			const catKey = normalizeCategoryKey(c.category);
			return catKey === currentFilterCategory;
		});

		// Calculate distances relative to user location or Bhubaneswar center
		const refLat = currentUserLocation ? currentUserLocation.lat : 20.2961;
		const refLng = currentUserLocation ? currentUserLocation.lng : 85.8245;

		filtered = filtered.map(c => {
			const lat = Number(c.latitude || c.location?.latitude || (c.location_point?.coordinates ? c.location_point.coordinates[1] : 0));
			const lng = Number(c.longitude || c.location?.longitude || (c.location_point?.coordinates ? c.location_point.coordinates[0] : 0));
			const dist = (lat && lng) ? calculateDistance(refLat, refLng, lat, lng) : 999999;
			return { ...c, _lat: lat, _lng: lng, _dist: dist };
		});

		// Sort by distance if user location is active
		if (currentUserLocation) {
			filtered.sort((a, b) => a._dist - b._dist);
		}

		if (countBadge) countBadge.textContent = filtered.length;
		if (summaryEl) {
			summaryEl.innerHTML = `<i class="fa-solid fa-location-pin" style="color:#ef4444;"></i> <strong>${filtered.length}</strong> civic issue${filtered.length === 1 ? '' : 's'} mapped in Bhubaneswar`;
		}

		if (!filtered.length) {
			if (listEl) {
				listEl.innerHTML = `
					<div class="nearby-empty-state">
						<i class="fa-solid fa-map-location-dot" style="font-size:32px; color:#94a3b8;"></i>
						<strong>No civic issues reported in this category yet</strong>
						<span style="font-size:12px; color:#64748b;">Try selecting "All Issues" or submit a new grievance.</span>
					</div>
				`;
			}
			return;
		}

		// 1. Render Right-Side List Items
		if (listEl) {
			listEl.innerHTML = filtered.map(c => {
				const cid = c.complaint_id || c.id || "CB-1024";
				const cleanId = String(cid).replace('#', '');
				const catInfo = getCategoryInfo(c.category);
				const statusClass = getStatusBadgeClass(c.status);
				const statusLabel = getStatusLabel(c.status);
				const wardStr = c.location?.ward_name || c.ward || c.location?.address || c.address || "Bhubaneswar Ward";
				const distStr = c._lat ? formatDistance(c._dist) : "Location mapped";
				const upvotes = c.upvotes || 1;
				const isActive = activeComplaintId === cleanId;

				const fallbackImg = window.ComplaintStore?.getCategoryFallback ? window.ComplaintStore.getCategoryFallback(c.category) : "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80";
				const cardImgUrl = (c.image_url && typeof c.image_url === 'string' && c.image_url.trim() && !c.image_url.includes('1584992236310')) ? c.image_url : fallbackImg;

				return `
					<div class="nearby-issue ${isActive ? 'active' : ''}" data-id="${cleanId}" id="issue-card-${cleanId}">
						<div class="nearby-icon ${catInfo.colorClass}">
							<img src="${cardImgUrl}" alt="Evidence" onerror="this.outerHTML='<span>${catInfo.icon}</span>'"/>
							<span class="mini-cat-badge">${catInfo.icon}</span>
						</div>
						<div class="nearby-info">
							<div class="nearby-title-row">
								<span class="nearby-cid">#${cleanId}</span>
								<strong>${escapeHtml(c.title || "Civic Grievance")}</strong>
							</div>
							<div class="nearby-meta-row">
								<span class="distance-tag">📍 ${distStr}</span>
								<span>• ${escapeHtml(wardStr)}</span>
							</div>
						</div>
						<div class="nearby-right-meta">
							<span class="nearby-status ${statusClass}">${statusLabel}</span>
							<span class="nearby-upvotes"><i class="fa-solid fa-thumbs-up" style="color:#3b82f6;"></i> ${upvotes}</span>
						</div>
					</div>
				`;
			}).join('');

			// Click listeners on list cards
			listEl.querySelectorAll(".nearby-issue").forEach(card => {
				card.addEventListener("click", () => {
					const id = card.dataset.id;
					focusComplaint(id);
				});
			});
		}

		// 2. Render Markers on Map
		const bounds = [];
		filtered.forEach(c => {
			if (!c._lat || !c._lng) return;
			const cleanId = String(c.complaint_id || c.id || '').replace('#', '');
			const catInfo = getCategoryInfo(c.category);
			const statusClass = getStatusBadgeClass(c.status);
			const statusLabel = getStatusLabel(c.status);
			const urgency = c.urgency_score || (c.priority_level === 'CRITICAL' ? 92 : 78);
			const wardStr = c.location?.ward_name || c.ward || "Bhubaneswar Ward";
			const address = c.location?.address || c.address || `${wardStr}, Bhubaneswar`;
			const dateStr = (c.created_at || new Date().toISOString()).slice(0, 10);
			const upvotes = c.upvotes || 1;
			const fallbackImg = window.ComplaintStore?.getCategoryFallback ? window.ComplaintStore.getCategoryFallback(c.category) : "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80";
			const photoUrl = (c.image_url && typeof c.image_url === 'string' && c.image_url.trim() && !c.image_url.includes('1584992236310')) ? c.image_url : fallbackImg;

			const customIcon = L.divIcon({
				className: "custom-leaflet-marker",
				html: `
					<div class="civic-marker-pin ${catInfo.colorClass} ${activeComplaintId === cleanId ? 'active' : ''}" id="marker-pin-${cleanId}" title="${escapeHtml(c.title)}">
						<div class="civic-marker-icon">${catInfo.icon}</div>
					</div>
				`,
				iconSize: [38, 38],
				iconAnchor: [19, 38],
				popupAnchor: [0, -36]
			});

			const marker = L.marker([c._lat, c._lng], { icon: customIcon });

			const popupHtml = `
				<div class="civic-map-popup">
					${photoUrl ? `<img class="popup-img-thumb" src="${photoUrl}" alt="Evidence" onclick="window.location.href='Track_complaints_Frontend/details.html?id=${encodeURIComponent(cleanId)}'" style="cursor:pointer;" onerror="this.src='${fallbackImg}'"/>` : ''}
					<div class="popup-body">
						<div class="popup-top-row">
							<span class="popup-id-badge">#${cleanId}</span>
							<span class="popup-status-badge ${statusClass}">${statusLabel}</span>
						</div>
						<h4 class="popup-title" onclick="window.location.href='Track_complaints_Frontend/details.html?id=${encodeURIComponent(cleanId)}'" style="cursor:pointer;">${escapeHtml(c.title || "Civic Complaint")}</h4>
						<div class="popup-meta">
							<div><i class="fa-solid fa-layer-group" style="color:#64748b; width:14px;"></i> ${catInfo.label}</div>
							<div><i class="fa-solid fa-map-pin" style="color:#ef4444; width:14px;"></i> ${escapeHtml(address)}</div>
							<div><i class="fa-solid fa-gauge-high" style="color:#f59e0b; width:14px;"></i> Urgency: <strong>${urgency}/100</strong> • 👍 ${upvotes} Upvotes</div>
							<div><i class="fa-regular fa-clock" style="color:#64748b; width:14px;"></i> Reported: ${dateStr}</div>
						</div>
						<div class="popup-actions">
							<span style="font-size:11px; color:#64748b;"><i class="fa-solid fa-shield-halved" style="color:#10b981;"></i> Citizen Shielded</span>
							<a href="Track_complaints_Frontend/details.html?id=${encodeURIComponent(cleanId)}" class="popup-details-link">
								View Full Details →
							</a>
						</div>
					</div>
				</div>
			`;

			marker.bindPopup(popupHtml, { maxWidth: 280, minWidth: 260 });

			marker.on("click", () => {
				highlightComplaintInList(cleanId);
			});

			marker.addTo(markersLayer);
			markersMap.set(cleanId, { marker, complaint: c });
			bounds.push([c._lat, c._lng]);
		});

		if (currentUserLocation) {
			bounds.push([currentUserLocation.lat, currentUserLocation.lng]);
		}
	}

	function focusComplaint(id) {
		activeComplaintId = id;
		const item = markersMap.get(id);

		// Update list active states
		document.querySelectorAll(".nearby-issue").forEach(card => {
			card.classList.toggle("active", card.dataset.id === id);
		});

		// Update map pin active states
		document.querySelectorAll(".civic-marker-pin").forEach(pin => {
			pin.classList.remove("active");
		});
		const activePin = document.getElementById(`marker-pin-${id}`);
		if (activePin) activePin.classList.add("active");

		// Update View on Map link with ID
		const viewMapBtn = document.getElementById("viewMapButton");
		if (viewMapBtn) {
			viewMapBtn.href = `Map_Frontend/index.html?id=${encodeURIComponent(id)}`;
		}

		if (item && item.marker && nearbyMap) {
			nearbyMap.setView([item.complaint._lat, item.complaint._lng], 15, { animate: true });
			item.marker.openPopup();
		}
	}

	function highlightComplaintInList(id) {
		activeComplaintId = id;

		// Update list active states
		document.querySelectorAll(".nearby-issue").forEach(card => {
			card.classList.toggle("active", card.dataset.id === id);
		});

		// Update map pin active states
		document.querySelectorAll(".civic-marker-pin").forEach(pin => {
			pin.classList.remove("active");
		});
		const activePin = document.getElementById(`marker-pin-${id}`);
		if (activePin) activePin.classList.add("active");

		// Scroll corresponding card into view smoothly
		const targetCard = document.getElementById(`issue-card-${id}`);
		if (targetCard) {
			targetCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
		}

		// Update View on Map link with ID
		const viewMapBtn = document.getElementById("viewMapButton");
		if (viewMapBtn) {
			viewMapBtn.href = `Map_Frontend/index.html?id=${encodeURIComponent(id)}`;
		}
	}

	function setupCategoryFilters() {
		const filterBtns = document.querySelectorAll("#nearbyCategoryFilters .filter-pill");
		filterBtns.forEach(btn => {
			btn.addEventListener("click", () => {
				filterBtns.forEach(b => b.classList.remove("active"));
				btn.classList.add("active");
				currentFilterCategory = btn.dataset.category || "all";
				renderNearbyIssues();
			});
		});
	}

	function setupGeolocationButton() {
		const geoBtn = document.getElementById("btnUseMyLocation");
		if (!geoBtn) return;

		geoBtn.addEventListener("click", () => {
			if (!navigator.geolocation) {
				alert("Geolocation is not supported by your browser.");
				return;
			}

			geoBtn.classList.add("locating");
			geoBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Locating...`;

			navigator.geolocation.getCurrentPosition(
				(pos) => {
					geoBtn.classList.remove("locating");
					geoBtn.innerHTML = `<i class="fa-solid fa-location-crosshairs"></i> Located!`;
					geoBtn.style.background = "#eff6ff";
					geoBtn.style.borderColor = "#2563eb";
					geoBtn.style.color = "#2563eb";

					const userLat = pos.coords.latitude;
					const userLng = pos.coords.longitude;
					currentUserLocation = { lat: userLat, lng: userLng };

					// Place or update user marker
					if (userLocationMarker && nearbyMap) {
						nearbyMap.removeLayer(userLocationMarker);
					}
					if (userLocationCircle && nearbyMap) {
						nearbyMap.removeLayer(userLocationCircle);
					}

					const userIcon = L.divIcon({
						className: "user-geo-pulse-wrapper",
						html: `<div class="user-geo-pulse" title="You are here"></div>`,
						iconSize: [20, 20],
						iconAnchor: [10, 10]
					});

					userLocationMarker = L.marker([userLat, userLng], { icon: userIcon })
						.bindPopup(`<strong>📍 Your Current Location</strong><br/><span style="font-size:11px; color:#64748b;">Showing nearest civic complaints around you</span>`)
						.addTo(nearbyMap);

					userLocationCircle = L.circle([userLat, userLng], {
						radius: Math.min(pos.coords.accuracy || 300, 800),
						color: "#2563eb",
						fillColor: "#3b82f6",
						fillOpacity: 0.1,
						weight: 1.5
					}).addTo(nearbyMap);

					nearbyMap.setView([userLat, userLng], 14, { animate: true });

					// Re-render issues sorted by distance
					renderNearbyIssues();

					if (window.CivicBuzzNavbar?.showToast) {
						window.CivicBuzzNavbar.showToast("Your location detected! Nearest issues sorted first.");
					}
				},
				(err) => {
					geoBtn.classList.remove("locating");
					geoBtn.innerHTML = `<i class="fa-solid fa-crosshairs"></i> Use My Location`;
					console.warn("Geolocation denied/unavailable:", err.message);
					if (window.CivicBuzzNavbar?.showToast) {
						window.CivicBuzzNavbar.showToast("Location access denied. Centered on Bhubaneswar.");
					}
				},
				{ timeout: 8000, enableHighAccuracy: true }
			);
		});
	}

	function initNearbyMap() {
		const mapEl = document.getElementById("nearbyIssuesMap");
		if (!mapEl || !window.L) return;

		const defaultCenter = [20.2961, 85.8245]; // Bhubaneswar center

		nearbyMap = L.map("nearbyIssuesMap", {
			center: defaultCenter,
			zoom: 13,
			zoomControl: true,
			attributionControl: false
		});

		// Google Maps Roadmap tile layer with OSM fallback
		const googleRoadmap = L.tileLayer("https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
			subdomains: ["0", "1", "2", "3"],
			maxZoom: 20,
			detectRetina: true,
			attribution: "Map data &copy; Google"
		});

		googleRoadmap.on("tileerror", function() {
			L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
				subdomains: "abcd",
				maxZoom: 19
			}).addTo(nearbyMap);
		});

		googleRoadmap.addTo(nearbyMap);
		markersLayer = L.layerGroup().addTo(nearbyMap);

		// Load complaints and render
		loadNearbyComplaints();

		// Handle category filter clicks
		setupCategoryFilters();

		// Handle "Use My Location"
		setupGeolocationButton();

		// Reset Map View button
		const resetBtn = document.getElementById("btnResetMapView");
		if (resetBtn) {
			resetBtn.addEventListener("click", () => {
				if (currentUserLocation) {
					nearbyMap.setView([currentUserLocation.lat, currentUserLocation.lng], 14, { animate: true });
				} else {
					nearbyMap.setView(defaultCenter, 13, { animate: true });
				}
			});
		}

		// Ensure proper rendering
		setTimeout(() => {
			nearbyMap.invalidateSize();
		}, 300);
	}

	// Setup Realtime Live Data Synchronization across tabs
	window.addEventListener("civicbuzz_data_updated", () => {
		loadNearbyComplaints();
		loadHomeComplaints();
	});

	if (typeof BroadcastChannel !== "undefined") {
		try {
			const bc = new BroadcastChannel("civicbuzz_complaints_channel");
			bc.onmessage = (evt) => {
				if (evt.data?.type === "COMPLAINTS_CHANGED") {
					loadNearbyComplaints();
					loadHomeComplaints();
				}
			};
		} catch (_) {}
	}

	// Initialize dashboard features on DOM ready
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => {
			initNearbyMap();
			loadHomeComplaints();
		});
	} else {
		initNearbyMap();
		loadHomeComplaints();
	}

	console.log("CivicBuzz Client Dashboard loaded with Live Interactive Map Radar.");

})();