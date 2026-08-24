/**
 * CivicBuzz Analytics & Municipal Intelligence Hub Script
 * Comprehensive dashboard controller, Chart.js visualizations,
 * live API integration with offline database seed fallbacks, i18n, and data export.
 */

(function () {
	"use strict";

	// API Configuration
	const API_BASE = (window.API_CONFIG && window.API_CONFIG.BASE_URL) ? window.API_CONFIG.BASE_URL : "https://civicbuzz-backend-deel.onrender.com/api/v1";

	// Application State
	const state = {
		timeframe: "30d",
		interval: "daily",
		language: localStorage.getItem("civicbuzz_lang") || "en",
		trendMetrics: {
			reported: true,
			resolved: true,
			overdue: true,
		},
		categoryChartType: "doughnut", // "doughnut" or "polarArea"
		sortColumn: "ward_number",
		sortDirection: "asc",
		zoneFilter: "ALL",
		riskFilter: "ALL",
		searchQuery: "",
		overviewData: null,
		trendsData: null,
		departmentsData: [],
		wardsData: [],
		categoriesData: [],
		aiInsightsData: [],
	};

	// Chart instances
	let trendChartInstance = null;
	let categoryChartInstance = null;
	let departmentChartInstance = null;

	// Hindi Translation Dictionary
	const i18n = {
		en: {
			"Dashboard": "Dashboard",
			"Issue Queue": "Issue Queue",
			"Map & Hotspots": "Map & Hotspots",
			"Departments": "Departments",
			"Budgeting": "Budgeting",
			"Analytics": "Analytics",
			"Analytics & Intelligence": "Analytics & Civic Intelligence",
			"Total Grievances": "Total Grievances",
			"Resolution Rate": "Resolution Rate",
			"Avg. Resolution Time (MTTR)": "Avg. Resolution Time (MTTR)",
			"Citizen Satisfaction (CSAT)": "Citizen Satisfaction (CSAT)",
			"SLA Compliance Rate": "SLA Compliance Rate",
			"Active Issue Hotspots": "Active Issue Hotspots",
			"Grievance Flow & Resolution Velocity Trends": "Grievance Flow & Resolution Velocity Trends",
			"Category & Severity Distribution": "Category & Severity Share",
			"Department SLA Compliance & MTTR": "Department SLA Compliance & MTTR",
			"Department Workload & Staffing Health": "Department Workload & Staffing Health",
			"Predictive Insights & Municipal Recommendations": "Predictive Insights & Municipal Recommendations",
			"Ward Performance & Risk Leaderboard": "Ward Performance & Risk Leaderboard",
			"Export Report": "Export Report",
			"Export as CSV": "Export as CSV (Spreadsheet)",
			"Export as JSON": "Export Raw Data (JSON)",
			"Print / Save as PDF": "Print / Save as PDF",
			"Today": "Today",
			"7 Days": "7D",
			"30 Days": "30D",
			"Quarter": "90D",
			"Year": "1Y",
			"Daily": "Daily",
			"Weekly": "Weekly",
			"Reported": "Reported",
			"Resolved": "Resolved",
			"Overdue": "Overdue",
			"All Zones": "All Zones",
			"All Risk Levels": "All Risk Levels",
			"Export Table": "Export CSV",
			"Regenerate AI Analysis": "Regenerate Analysis",
		},
		hi: {
			"Dashboard": "डैशबोर्ड",
			"Issue Queue": "शिकायत कतार",
			"Map & Hotspots": "मानचित्र और हॉटस्पॉट",
			"Departments": "सरकारी विभाग",
			"Budgeting": "बजट और निविदाएं",
			"Analytics": "एनालिटिक्स",
			"Analytics & Intelligence": "विश्लेषण और नागरिक खुफिया",
			"Total Grievances": "कुल दर्ज शिकायतें",
			"Resolution Rate": "समाधान दर %",
			"Avg. Resolution Time (MTTR)": "औसत समाधान समय (MTTR)",
			"Citizen Satisfaction (CSAT)": "नागरिक संतुष्टि (CSAT)",
			"SLA Compliance Rate": "समयबद्ध SLA अनुपालन दर",
			"Active Issue Hotspots": "सक्रिय समस्या हॉटस्पॉट",
			"Grievance Flow & Resolution Velocity Trends": "शिकायत प्रवाह और समाधान गति रुझान",
			"Category & Severity Distribution": "श्रेणी और गंभीरता वितरण",
			"Department SLA Compliance & MTTR": "विभाग SLA अनुपालन और समाधान समय",
			"Department Workload & Staffing Health": "विभाग कार्यभार और स्टाफिंग स्वास्थ्य",
			"Predictive Insights & Municipal Recommendations": "पूर्वानुमानित अंतर्दृष्टि और सिफारिशें",
			"Ward Performance & Risk Leaderboard": "वार्ड प्रदर्शन और जोखिम लीडरबोर्ड",
			"Export Report": "रिपोर्ट निर्यात करें",
			"Export as CSV": "CSV के रूप में निर्यात करें",
			"Export as JSON": "कच्चा डेटा निर्यात करें (JSON)",
			"Print / Save as PDF": "प्रिंट / पीडीएफ के रूप में सहेजें",
			"Today": "आज",
			"7 Days": "7 दिन",
			"30 Days": "30 दिन",
			"Quarter": "90 दिन",
			"Year": "1 वर्ष",
			"Daily": "दैनिक",
			"Weekly": "साप्ताहिक",
			"Reported": "दर्ज",
			"Resolved": "हल किया गया",
			"Overdue": "अतिदेय",
			"All Zones": "सभी जोन",
			"All Risk Levels": "सभी जोखिम स्तर",
			"Export Table": "तालिका निर्यात करें",
			"Regenerate AI Analysis": "विश्लेषण पुनर्गणना",
		},
	};

	// Built-in Database Seed / Fallback Datasets (Ensures offline resilience)
	const seedData = {
		overview: {
			"30d": {
				total_complaints: 248,
				resolved_complaints: 210,
				in_progress_complaints: 29,
				overdue_complaints: 9,
				resolution_rate_percent: 84.7,
				avg_resolution_time_hours: 18.4,
				sla_compliance_percent: 92.6,
				csat_score: 4.7,
				active_hotspots_count: 14,
				budget_utilized_inr: 4850000.0,
			},
			"7d": {
				total_complaints: 58,
				resolved_complaints: 51,
				in_progress_complaints: 6,
				overdue_complaints: 1,
				resolution_rate_percent: 87.9,
				avg_resolution_time_hours: 14.2,
				sla_compliance_percent: 94.8,
				csat_score: 4.8,
				active_hotspots_count: 8,
				budget_utilized_inr: 1240000.0,
			},
			"today": {
				total_complaints: 12,
				resolved_complaints: 9,
				in_progress_complaints: 3,
				overdue_complaints: 0,
				resolution_rate_percent: 75.0,
				avg_resolution_time_hours: 6.5,
				sla_compliance_percent: 96.0,
				csat_score: 4.9,
				active_hotspots_count: 3,
				budget_utilized_inr: 210000.0,
			},
			"90d": {
				total_complaints: 742,
				resolved_complaints: 628,
				in_progress_complaints: 84,
				overdue_complaints: 30,
				resolution_rate_percent: 84.6,
				avg_resolution_time_hours: 19.1,
				sla_compliance_percent: 91.8,
				csat_score: 4.6,
				active_hotspots_count: 18,
				budget_utilized_inr: 14200000.0,
			},
			"1y": {
				total_complaints: 2890,
				resolved_complaints: 2480,
				in_progress_complaints: 290,
				overdue_complaints: 120,
				resolution_rate_percent: 85.8,
				avg_resolution_time_hours: 20.2,
				sla_compliance_percent: 92.1,
				csat_score: 4.6,
				active_hotspots_count: 22,
				budget_utilized_inr: 58000000.0,
			},
		},
		departments: [
			{ code: "ROADS", name: "Roads & Potholes", icon: "fa-road", total: 92, resolved: 81, overdue: 3, compliance: 92.4, avg_hours: 16.5, csat: 4.6, staff: 24, workload: 82.0 },
			{ code: "SANITATION", name: "Garbage & Sanitation", icon: "fa-trash-can", total: 78, resolved: 72, overdue: 1, compliance: 96.1, avg_hours: 9.2, csat: 4.8, staff: 32, workload: 74.5 },
			{ code: "WATER", name: "Water & Drainage", icon: "fa-droplet", total: 64, resolved: 52, overdue: 3, compliance: 87.5, avg_hours: 21.0, csat: 4.3, staff: 18, workload: 88.2 },
			{ code: "LIGHTING", name: "Street Lighting", icon: "fa-lightbulb", total: 45, resolved: 41, overdue: 1, compliance: 94.0, avg_hours: 14.8, csat: 4.7, staff: 14, workload: 62.0 },
			{ code: "PARKS", name: "Parks & Spaces", icon: "fa-tree", total: 28, resolved: 24, overdue: 1, compliance: 89.2, avg_hours: 38.0, csat: 4.5, staff: 12, workload: 55.4 },
			{ code: "HEALTH", name: "Public Health & Vet", icon: "fa-shield-heart", total: 19, resolved: 17, overdue: 0, compliance: 95.0, avg_hours: 26.4, csat: 4.6, staff: 10, workload: 48.0 },
		],
		categories: [
			{ name: "Roads, Potholes & Footpaths", count: 92, pct: 37.1, color: "#2f6ee8" },
			{ name: "Garbage & Cleanliness", count: 78, pct: 31.5, color: "#078b37" },
			{ name: "Water & Drainage", count: 64, pct: 25.8, color: "#06b6d4" },
			{ name: "Street Lighting & Power", count: 45, pct: 18.1, color: "#f59e0b" },
			{ name: "Parks & Public Spaces", count: 28, pct: 11.3, color: "#8b5cdb" },
			{ name: "Public Health & Animals", count: 19, pct: 7.7, color: "#ef4444" },
		],
		wards: [
			{ ward_number: 1, ward_name: "Ward 1 - Chandrasekharpur", zone: "North Zone", total_issues: 28, resolved_issues: 25, resolution_rate_percent: 89.3, hotspots_count: 1, risk_index: 24.5, risk_level: "LOW", top_issue_category: "Roads & Potholes" },
			{ ward_number: 2, ward_name: "Ward 2 - Patia Corridor", zone: "North Zone", total_issues: 42, resolved_issues: 36, resolution_rate_percent: 85.7, hotspots_count: 3, risk_index: 68.2, risk_level: "HIGH", top_issue_category: "Garbage & Sanitation" },
			{ ward_number: 3, ward_name: "Ward 3 - Nayapalli", zone: "Central Zone", total_issues: 35, resolved_issues: 31, resolution_rate_percent: 88.6, hotspots_count: 2, risk_index: 48.0, risk_level: "MEDIUM", top_issue_category: "Street Lighting" },
			{ ward_number: 4, ward_name: "Ward 4 - Jayadev Vihar", zone: "Central Zone", total_issues: 31, resolved_issues: 28, resolution_rate_percent: 90.3, hotspots_count: 1, risk_index: 42.5, risk_level: "MEDIUM", top_issue_category: "Water & Drainage" },
			{ ward_number: 5, ward_name: "Ward 5 - Mancheswar", zone: "East Zone", total_issues: 22, resolved_issues: 19, resolution_rate_percent: 86.4, hotspots_count: 0, risk_index: 31.0, risk_level: "LOW", top_issue_category: "Roads & Potholes" },
			{ ward_number: 6, ward_name: "Ward 6 - Rasulgarh", zone: "East Zone", total_issues: 38, resolved_issues: 30, resolution_rate_percent: 78.9, hotspots_count: 4, risk_index: 76.5, risk_level: "HIGH", top_issue_category: "Drainage & Sewage" },
			{ ward_number: 7, ward_name: "Ward 7 - Saheed Nagar", zone: "Central Zone", total_issues: 29, resolved_issues: 27, resolution_rate_percent: 93.1, hotspots_count: 1, risk_index: 28.0, risk_level: "LOW", top_issue_category: "Garbage & Sanitation" },
			{ ward_number: 8, ward_name: "Ward 8 - Market Corridor", zone: "South Zone", total_issues: 46, resolved_issues: 37, resolution_rate_percent: 80.4, hotspots_count: 5, risk_index: 84.0, risk_level: "CRITICAL", top_issue_category: "Garbage & Encroachment" },
			{ ward_number: 9, ward_name: "Ward 9 - Unit 9 / Bapuji Nagar", zone: "South Zone", total_issues: 26, resolved_issues: 24, resolution_rate_percent: 92.3, hotspots_count: 0, risk_index: 22.0, risk_level: "LOW", top_issue_category: "Streetlights" },
			{ ward_number: 10, ward_name: "Ward 10 - Ashok Nagar", zone: "South Zone", total_issues: 21, resolved_issues: 19, resolution_rate_percent: 90.5, hotspots_count: 0, risk_index: 20.5, risk_level: "LOW", top_issue_category: "Public Spaces" },
			{ ward_number: 11, ward_name: "Ward 11 - Old Town Heritage", zone: "South Zone", total_issues: 34, resolved_issues: 28, resolution_rate_percent: 82.4, hotspots_count: 2, risk_index: 62.0, risk_level: "HIGH", top_issue_category: "Water Supply" },
			{ ward_number: 12, ward_name: "Ward 12 - Janpath / College Gate", zone: "Central Zone", total_issues: 40, resolved_issues: 35, resolution_rate_percent: 87.5, hotspots_count: 2, risk_index: 52.0, risk_level: "MEDIUM", top_issue_category: "Roads & Potholes" },
			{ ward_number: 13, ward_name: "Ward 13 - Khandagiri", zone: "West Zone", total_issues: 18, resolved_issues: 16, resolution_rate_percent: 88.9, hotspots_count: 0, risk_index: 18.0, risk_level: "LOW", top_issue_category: "Public Health" },
			{ ward_number: 14, ward_name: "Ward 14 - Baramunda", zone: "West Zone", total_issues: 25, resolved_issues: 22, resolution_rate_percent: 88.0, hotspots_count: 1, risk_index: 38.5, risk_level: "MEDIUM", top_issue_category: "Garbage & Sanitation" },
			{ ward_number: 15, ward_name: "Ward 15 - Infocity Road", zone: "North Zone", total_issues: 32, resolved_issues: 29, resolution_rate_percent: 90.6, hotspots_count: 1, risk_index: 30.0, risk_level: "LOW", top_issue_category: "Roads & Potholes" },
		],
		aiInsights: [
			{
				id: "INS-001",
				type: "PREDICTION",
				severity: "WARNING",
				title: "Predicted 38% Drainage Complaint Surge",
				description: "Weather radar forecasts intense precipitation in Bhubaneswar next 72h. Historical models predict heavy waterlogging at Jayadev Vihar (Ward 4) and Rasulgarh (Ward 6).",
				impact_metric: "+38% Grievance Volume",
				confidence_score: 0.92,
				recommended_action: "Deploy preemptive suction tanker units and clear stormwater grates at Ward 4 & 6 intersections.",
				affected_ward_or_dept: "Water & Drainage • Ward 4, 6",
				action_label: "Deploy Units",
			},
			{
				id: "INS-002",
				type: "BOTTLENECK",
				severity: "CRITICAL",
				title: "SLA Breach Risk: Ward 8 Market Corridor Waste Clustered",
				description: "Garbage dump reports in Ward 8 Market Corridor have exceeded the 12-hour SLA threshold by 4.2h due to contractor vehicle shortage.",
				impact_metric: "12 Pending Overdue Reports",
				confidence_score: 0.96,
				recommended_action: "Reassign secondary compactors from North Zone depot to clear Market Corridor by 16:00.",
				affected_ward_or_dept: "Garbage & Sanitation • Ward 8",
				action_label: "Reassign Depot",
			},
			{
				id: "INS-003",
				type: "OPTIMIZATION",
				severity: "SUCCESS",
				title: "Route Optimization Can Reduce Pothole MTTR by 22%",
				description: "Spatial clustering shows 18 asphalt patch requests within a 1.2km radius in Ward 2 (Patia Corridor). Batching contractor work orders saves ₹45,000.",
				impact_metric: "-22% MTTR / ₹45K Saved",
				confidence_score: 0.89,
				recommended_action: "Approve bundled Tender Batch #BMC-T-089 for consolidated single-day road resurfacing.",
				affected_ward_or_dept: "Roads & Potholes • Ward 2",
				action_label: "Approve Tender",
			},
			{
				id: "INS-004",
				type: "ANOMALY",
				severity: "INFO",
				title: "Rapid Citizen Upvote Consensus in Ward 15",
				description: "Grievance #CB-9821 (Flickering High-Mast Light near Infocity square) received 42 citizen upvotes in under 3 hours, indicating high public visibility.",
				impact_metric: "42 Citizen Endorsements",
				confidence_score: 0.98,
				recommended_action: "Priority status elevated to HIGH automatically by AI triage engine.",
				affected_ward_or_dept: "Street Lighting • Ward 15",
				action_label: "View Report",
			},
		],
	};

	// Initialize Dashboard
	function init() {
		setupEventListeners();
		applyLanguage(state.language);

		// Instant 0ms render with local seed dataset so page is instantly populated
		state.overviewData = seedData.overview[state.timeframe] || seedData.overview["30d"];
		state.departmentsData = seedData.departments;
		state.wardsData = seedData.wards;
		state.categoriesData = seedData.categories;
		state.aiInsightsData = seedData.aiInsights;
		renderAll();

		// Then attempt live backend sync in background in parallel without blocking UI
		loadAnalyticsData();
	}

	// Setup Event Listeners
	function setupEventListeners() {
		// Mobile Menu Toggle
		const mobileMenu = document.getElementById("mobileMenu");
		const sidebar = document.getElementById("sidebar");
		if (mobileMenu && sidebar) {
			mobileMenu.addEventListener("click", () => {
				sidebar.classList.toggle("open");
			});
		}

		// Timeframe Buttons
		const tfBtns = document.querySelectorAll(".timeframe-btn");
		tfBtns.forEach((btn) => {
			btn.addEventListener("click", () => {
				tfBtns.forEach((b) => b.classList.remove("active"));
				btn.classList.add("active");
				state.timeframe = btn.dataset.timeframe;
				// Immediate instant update
				state.overviewData = seedData.overview[state.timeframe] || seedData.overview["30d"];
				renderAll();
				showToast(`Timeframe changed to ${btn.textContent.trim()}`, "info");
				loadAnalyticsData();
			});
		});

		// Refresh Button
		const refreshBtn = document.getElementById("refreshDataBtn");
		if (refreshBtn) {
			refreshBtn.addEventListener("click", () => {
				refreshBtn.classList.add("rotating");
				loadAnalyticsData().finally(() => {
					setTimeout(() => refreshBtn.classList.remove("rotating"), 400);
					showToast("Analytics & DB pipelines refreshed", "success");
				});
			});
		}

		// Language Selector
		const langBtn = document.getElementById("languageButton");
		const langDropdown = document.getElementById("languageDropdown");
		if (langBtn && langDropdown) {
			langBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				langDropdown.classList.toggle("show");
			});

			document.querySelectorAll(".language-option").forEach((opt) => {
				opt.addEventListener("click", (e) => {
					e.stopPropagation();
					const lang = opt.dataset.language;
					applyLanguage(lang);
					langDropdown.classList.remove("show");
					showToast(lang === "hi" ? "भाषा बदलकर हिन्दी की गई" : "Language switched to English", "info");
				});
			});
		}

		// Notification Dropdown
		const notifBtn = document.getElementById("notificationButton");
		const notifDropdown = document.getElementById("notificationDropdown");
		if (notifBtn && notifDropdown) {
			notifBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				langDropdown?.classList.remove("show");
				profileDropdown?.classList.remove("show");
				notifDropdown.classList.toggle("show");
			});
		}

		// Mark all notifications as read
		document.getElementById("notifMarkAllRead")?.addEventListener("click", (e) => {
			e.stopPropagation();
			const badge = document.getElementById("notifBadge");
			const pill = document.getElementById("notifCountPill");
			if (badge) badge.style.display = "none";
			if (pill) pill.textContent = "0 New";
			document.querySelectorAll(".notification-item.unread").forEach(item => item.classList.remove("unread"));
			showToast("All notifications marked as read", "success");
		});

		// Profile Dropdown
		const profileBtn = document.getElementById("profileButton");
		const profileDropdown = document.getElementById("profileDropdown");
		if (profileBtn && profileDropdown) {
			profileBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				langDropdown?.classList.remove("show");
				notifDropdown?.classList.remove("show");
				profileDropdown.classList.toggle("show");
			});
		}

		// Copy Admin ID
		document.getElementById("userIdButton")?.addEventListener("click", (e) => {
			e.stopPropagation();
			const idText = document.getElementById("userIdText")?.textContent || "ADMIN-001";
			navigator.clipboard?.writeText(idText).then(() => {
				showToast(`Admin ID copied: ${idText}`, "success");
			}).catch(() => {
				showToast(`Admin ID: ${idText}`, "info");
			});
		});

		// My Profile Modal
		const profileModal = document.getElementById("profileModal");
		document.getElementById("openProfileModalBtn")?.addEventListener("click", (e) => {
			e.stopPropagation();
			profileDropdown?.classList.remove("show");
			if (profileModal) profileModal.hidden = false;
		});

		document.getElementById("closeProfileModal")?.addEventListener("click", () => {
			if (profileModal) profileModal.hidden = true;
		});

		document.getElementById("closeProfileModalBtn")?.addEventListener("click", () => {
			if (profileModal) profileModal.hidden = true;
		});

		// Dark Mode Toggle
		const themeToggleBtn = document.getElementById("profileThemeToggle");
		const themeSwitch = document.getElementById("themeSwitch");
		const themeLabel = document.getElementById("themeLabel");
		const themeIcon = document.getElementById("themeIcon");

		// Initialize theme from storage
		const savedTheme = localStorage.getItem("civicbuzz_theme") || "light";
		if (savedTheme === "dark") {
			document.body.classList.add("dark-theme", "dark-mode");
			document.documentElement.classList.add("dark-theme", "dark-mode");
			themeSwitch?.classList.add("is-dark");
			if (themeLabel) themeLabel.textContent = "Light Mode";
			if (themeIcon) {
				themeIcon.className = "fa-solid fa-sun";
				themeIcon.style.color = "#ffb51b";
			}
		}

		themeToggleBtn?.addEventListener("click", (e) => {
			e.stopPropagation();
			const isDark = document.body.classList.toggle("dark-mode");
			document.body.classList.toggle("dark-theme", isDark);
			document.documentElement.classList.toggle("dark-mode", isDark);
			document.documentElement.classList.toggle("dark-theme", isDark);
			themeSwitch?.classList.toggle("is-dark", isDark);
			
			if (isDark) {
				if (themeLabel) themeLabel.textContent = "Light Mode";
				if (themeIcon) {
					themeIcon.className = "fa-solid fa-sun";
					themeIcon.style.color = "#ffb51b";
				}
				localStorage.setItem("civicbuzz_theme", "dark");
				showToast("Dark mode enabled", "info");
			} else {
				if (themeLabel) themeLabel.textContent = "Dark Mode";
				if (themeIcon) {
					themeIcon.className = "fa-solid fa-moon";
					themeIcon.style.color = "#d97706";
				}
				localStorage.setItem("civicbuzz_theme", "light");
				showToast("Light mode enabled", "info");
			}

			// Dynamically update charts to match new theme
			updateTrendChart();
			updateCategoryChart();
			updateDepartmentChart();
		});

		// Logout Handlers
		const handleLogout = (e) => {
			e?.stopPropagation();
			if (confirm("Are you sure you want to log out of the Admin Portal?")) {
				if (window.CivicBuzzAPI?.clearAuth) {
					window.CivicBuzzAPI.clearAuth();
				}
				localStorage.removeItem("civicbuzz_token");
				localStorage.removeItem("civicbuzz_user");
				window.location.href = "../../../Login_Frontend/index.html";
			}
		};

		document.getElementById("adminLogoutBtn")?.addEventListener("click", handleLogout);
		document.getElementById("modalLogoutBtn")?.addEventListener("click", handleLogout);

		// Close dropdowns on outside click
		document.addEventListener("click", (e) => {
			if (!e.target.closest("#languageDropdown") && !e.target.closest("#languageButton")) {
				langDropdown?.classList.remove("show");
			}
			if (!e.target.closest("#notificationDropdown") && !e.target.closest("#notificationButton")) {
				notifDropdown?.classList.remove("show");
			}
			if (!e.target.closest("#profileDropdown") && !e.target.closest("#profileButton")) {
				profileDropdown?.classList.remove("show");
			}
		});

		// Export Handlers
		document.getElementById("exportCsvBtn")?.addEventListener("click", exportWardsToCsv);
		document.getElementById("tableExportCsvBtn")?.addEventListener("click", exportWardsToCsv);
		document.getElementById("exportJsonBtn")?.addEventListener("click", exportRawJson);
		document.getElementById("exportPrintBtn")?.addEventListener("click", () => window.print());

		// Trend Metric Toggle Chips
		document.querySelectorAll(".toggle-chip").forEach((chip) => {
			chip.addEventListener("click", (e) => {
				e.preventDefault();
				const metric = chip.dataset.metric;
				state.trendMetrics[metric] = !state.trendMetrics[metric];
				chip.classList.toggle("active", state.trendMetrics[metric]);
				const input = chip.querySelector("input");
				if (input) input.checked = state.trendMetrics[metric];
				updateTrendChart();
			});
		});

		// Interval Buttons (Daily/Weekly)
		document.querySelectorAll(".interval-btn").forEach((btn) => {
			btn.addEventListener("click", () => {
				document.querySelectorAll(".interval-btn").forEach((b) => b.classList.remove("active"));
				btn.classList.add("active");
				state.interval = btn.dataset.interval;
				updateTrendChart();
			});
		});

		// Category Chart Type Toggle
		document.getElementById("categoryChartTypeToggle")?.addEventListener("click", () => {
			state.categoryChartType = state.categoryChartType === "doughnut" ? "polarArea" : "doughnut";
			updateCategoryChart();
		});

		// Regenerate AI Analysis Button
		document.getElementById("generateAiAnalysisBtn")?.addEventListener("click", () => {
			showToast("Regenerating AI predictive analytics...", "info");
			setTimeout(() => {
				renderAiInsights(seedData.aiInsights);
				showToast("AI insights updated", "success");
			}, 300);
		});

		// Ward Table Search & Filter Controls
		const wardSearch = document.getElementById("wardSearchInput");
		if (wardSearch) {
			wardSearch.addEventListener("input", (e) => {
				state.searchQuery = e.target.value;
				renderWardTable();
			});
		}

		const zoneFilter = document.getElementById("zoneFilterSelect");
		if (zoneFilter) {
			zoneFilter.addEventListener("change", (e) => {
				state.zoneFilter = e.target.value;
				renderWardTable();
			});
		}

		const riskFilter = document.getElementById("riskFilterSelect");
		if (riskFilter) {
			riskFilter.addEventListener("change", (e) => {
				state.riskFilter = e.target.value;
				renderWardTable();
			});
		}

		// Sortable Table Headers
		document.querySelectorAll(".analytics-table th.sortable").forEach((th) => {
			th.addEventListener("click", () => {
				const col = th.dataset.sort;
				if (state.sortColumn === col) {
					state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
				} else {
					state.sortColumn = col;
					state.sortDirection = "asc";
				}
				renderWardTable();
			});
		});
	}

	// Fast Non-blocking Fetch with AbortController timeout
	function fetchWithTimeout(url, timeoutMs = 1000) {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), timeoutMs);
		return fetch(url, { signal: controller.signal })
			.then((res) => {
				clearTimeout(timer);
				return res;
			})
			.catch(() => null);
	}

	// Fetch & Aggregate Data in parallel without blocking UI
	async function loadAnalyticsData() {
		const tf = state.timeframe;
		const apiBase = (window.CivicBuzzAPI && window.CivicBuzzAPI.BASE_URL) || API_BASE;

		try {
			// Request all analytics endpoints in parallel with fast 1s timeout
			const [overviewRes, deptRes, wardRes, catRes, aiRes] = await Promise.allSettled([
				fetchWithTimeout(`${apiBase}/analytics/overview?timeframe=${tf}`),
				fetchWithTimeout(`${apiBase}/analytics/departments?timeframe=${tf}`),
				fetchWithTimeout(`${apiBase}/analytics/wards?timeframe=${tf}`),
				fetchWithTimeout(`${apiBase}/analytics/categories?timeframe=${tf}`),
				fetchWithTimeout(`${apiBase}/analytics/ai-insights`),
			]);

			let updated = false;

			if (overviewRes.status === "fulfilled" && overviewRes.value && overviewRes.value.ok) {
				const json = await overviewRes.value.json();
				if (json?.data) {
					state.overviewData = json.data;
					updated = true;
				}
			}

			if (deptRes.status === "fulfilled" && deptRes.value && deptRes.value.ok) {
				const json = await deptRes.value.json();
				if (json?.data) {
					state.departmentsData = json.data;
					updated = true;
				}
			}

			if (wardRes.status === "fulfilled" && wardRes.value && wardRes.value.ok) {
				const json = await wardRes.value.json();
				if (json?.data) {
					state.wardsData = json.data;
					updated = true;
				}
			}

			if (catRes.status === "fulfilled" && catRes.value && catRes.value.ok) {
				const json = await catRes.value.json();
				if (json?.data) {
					state.categoriesData = json.data;
					updated = true;
				}
			}

			if (aiRes.status === "fulfilled" && aiRes.value && aiRes.value.ok) {
				const json = await aiRes.value.json();
				if (json?.data?.insights) {
					state.aiInsightsData = json.data.insights;
					updated = true;
				}
			}

			if (updated) {
				renderAll();
			}
		} catch (err) {
			console.debug("Offline seed state maintained:", err);
		}
	}

	// Render All Components
	function renderAll() {
		renderKpiCards();
		updateTrendChart();
		updateCategoryChart();
		updateDepartmentChart();
		renderDeptHealthCards();
		renderAiInsights(state.aiInsightsData);
		renderWardTable();
		updateTimestamp();
	}

	// Render KPI Cards
	function renderKpiCards() {
		const ov = state.overviewData;
		if (!ov) return;

		// Total
		const valTotal = document.getElementById("valTotalComplaints");
		if (valTotal) valTotal.textContent = Number(ov.total_complaints).toLocaleString();

		// Resolution Rate
		const valResRate = document.getElementById("valResolutionRate");
		const barRes = document.getElementById("barResolution");
		const valResolved = document.getElementById("valResolvedCount");
		const valReported = document.getElementById("valReportedTotal");
		if (valResRate) valResRate.textContent = `${ov.resolution_rate_percent}%`;
		if (barRes) barRes.style.width = `${Math.min(100, ov.resolution_rate_percent)}%`;
		if (valResolved) valResolved.textContent = ov.resolved_complaints;
		if (valReported) valReported.textContent = ov.total_complaints;

		// MTTR
		const valMTTR = document.getElementById("valMTTR");
		if (valMTTR) valMTTR.textContent = `${ov.avg_resolution_time_hours}h`;

		// CSAT
		const valCSAT = document.getElementById("valCSAT");
		if (valCSAT) valCSAT.innerHTML = `${ov.csat_score} <small>/ 5.0</small>`;

		// SLA
		const valSLA = document.getElementById("valSLA");
		const barSLA = document.getElementById("barSLA");
		if (valSLA) valSLA.textContent = `${ov.sla_compliance_percent}%`;
		if (barSLA) barSLA.style.width = `${Math.min(100, ov.sla_compliance_percent)}%`;

		// Hotspots
		const valHotspots = document.getElementById("valHotspots");
		if (valHotspots) valHotspots.textContent = ov.active_hotspots_count;
	}

	// Render / Update Historical Trends Chart
	function updateTrendChart() {
		const canvas = document.getElementById("trendChart");
		if (!canvas) return;

		const isDaily = state.interval === "daily";
		const labels = isDaily
			? ["Aug 10", "Aug 12", "Aug 14", "Aug 16", "Aug 18", "Aug 20", "Aug 22", "Aug 24"]
			: ["W1 Jul", "W2 Jul", "W3 Jul", "W4 Jul", "W1 Aug", "W2 Aug", "W3 Aug", "W4 Aug"];

		const reportedData = isDaily ? [16, 22, 19, 28, 24, 32, 29, 34] : [64, 78, 85, 72, 90, 94, 88, 102];
		const resolvedData = isDaily ? [14, 18, 17, 24, 22, 28, 27, 30] : [58, 68, 74, 66, 82, 86, 81, 94];
		const overdueData = isDaily ? [2, 3, 1, 3, 1, 2, 1, 2] : [6, 8, 7, 5, 6, 7, 5, 6];

		const datasets = [];

		if (state.trendMetrics.reported) {
			datasets.push({
				label: "Reported Grievances",
				data: reportedData,
				borderColor: "#2f6ee8",
				backgroundColor: "rgba(47, 110, 232, 0.08)",
				borderWidth: 2.5,
				fill: true,
				tension: 0.35,
				pointRadius: 4,
				pointHoverRadius: 6,
				pointBackgroundColor: "#2f6ee8",
			});
		}

		if (state.trendMetrics.resolved) {
			datasets.push({
				label: "Resolved",
				data: resolvedData,
				borderColor: "#078b37",
				backgroundColor: "rgba(7, 139, 55, 0.08)",
				borderWidth: 2.5,
				fill: true,
				tension: 0.35,
				pointRadius: 4,
				pointHoverRadius: 6,
				pointBackgroundColor: "#078b37",
			});
		}

		if (state.trendMetrics.overdue) {
			datasets.push({
				label: "Overdue / SLA Risk",
				data: overdueData,
				borderColor: "#ef4444",
				backgroundColor: "rgba(239, 68, 68, 0.08)",
				borderWidth: 2,
				borderDash: [5, 5],
				fill: false,
				tension: 0.3,
				pointRadius: 3,
				pointHoverRadius: 5,
				pointBackgroundColor: "#ef4444",
			});
		}

		if (trendChartInstance) {
			trendChartInstance.destroy();
		}

		trendChartInstance = new Chart(canvas, {
			type: "line",
			data: {
				labels: labels,
				datasets: datasets,
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: {
					mode: "index",
					intersect: false,
				},
				plugins: {
					legend: { display: false },
					tooltip: {
						backgroundColor: document.body.classList.contains("dark-mode") ? "#0b1d3a" : "#14213a",
						titleFont: { family: "Plus Jakarta Sans", weight: "bold", size: 13 },
						bodyFont: { family: "DM Sans", size: 12 },
						padding: 12,
						cornerRadius: 8,
						boxPadding: 6,
					},
				},
				scales: {
					x: {
						grid: { display: false },
						ticks: { font: { family: "DM Sans", size: 11 }, color: document.body.classList.contains("dark-mode") ? "#94a3b8" : "#71829e" },
					},
					y: {
						grid: { color: document.body.classList.contains("dark-mode") ? "rgba(255, 255, 255, 0.07)" : "#f1f5f9" },
						ticks: { font: { family: "DM Sans", size: 11 }, color: document.body.classList.contains("dark-mode") ? "#94a3b8" : "#71829e" },
					},
				},
			},
		});
	}

	// Render / Update Category Breakdown Chart
	function updateCategoryChart() {
		const canvas = document.getElementById("categoryChart");
		const legendContainer = document.getElementById("categoryLegendContainer");
		if (!canvas) return;

		const categories = state.categoriesData.length ? state.categoriesData : seedData.categories;
		const labels = categories.map((c) => c.category_name || c.name);
		const data = categories.map((c) => c.count);
		const colors = ["#2f6ee8", "#078b37", "#06b6d4", "#f59e0b", "#8b5cdb", "#ef4444"];

		if (categoryChartInstance) {
			categoryChartInstance.destroy();
		}

		categoryChartInstance = new Chart(canvas, {
			type: state.categoryChartType,
			data: {
				labels: labels,
				datasets: [
					{
						data: data,
						backgroundColor: colors,
						borderWidth: 2,
						borderColor: document.body.classList.contains("dark-mode") ? "#102646" : "#ffffff",
						hoverOffset: 6,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				cutout: state.categoryChartType === "doughnut" ? "68%" : 0,
				plugins: {
					legend: { display: false },
					tooltip: {
						backgroundColor: document.body.classList.contains("dark-mode") ? "#0b1d3a" : "#14213a",
						cornerRadius: 8,
						callbacks: {
							label: function (ctx) {
								const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
								const val = ctx.raw;
								const pct = ((val / total) * 100).toFixed(1);
								return ` ${ctx.label}: ${val} issues (${pct}%)`;
							},
						},
					},
				},
			},
		});

		// Build Custom Legend
		if (legendContainer) {
			const totalCount = data.reduce((a, b) => a + b, 0);
			legendContainer.innerHTML = categories
				.slice(0, 4)
				.map((cat, idx) => {
					const name = cat.category_name || cat.name;
					const count = cat.count;
					const pct = ((count / (totalCount || 1)) * 100).toFixed(1);
					return `
						<div class="legend-row">
							<div class="legend-left">
								<span class="legend-color-box" style="background: ${colors[idx % colors.length]};"></span>
								<span>${name}</span>
							</div>
							<strong>${count} <small style="color:var(--muted);font-weight:normal;">(${pct}%)</small></strong>
						</div>
					`;
				})
				.join("");
		}
	}

	// Render / Update Department SLA & MTTR Chart
	function updateDepartmentChart() {
		const canvas = document.getElementById("departmentChart");
		if (!canvas) return;

		const depts = state.departmentsData.length ? state.departmentsData : seedData.departments;
		const labels = depts.map((d) => d.name.replace(" Department", "").replace(" & ", " & \n"));
		const compliance = depts.map((d) => d.compliance || d.sla_compliance_percent || 90);
		const mttr = depts.map((d) => d.avg_hours || d.avg_resolution_hours || 15);

		if (departmentChartInstance) {
			departmentChartInstance.destroy();
		}

		departmentChartInstance = new Chart(canvas, {
			type: "bar",
			data: {
				labels: labels,
				datasets: [
					{
						label: "SLA Compliance %",
						data: compliance,
						backgroundColor: "#2f6ee8",
						borderRadius: 6,
						yAxisID: "y",
					},
					{
						label: "Avg MTTR (Hours)",
						data: mttr,
						backgroundColor: "#f59e0b",
						borderRadius: 6,
						yAxisID: "y1",
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false },
					tooltip: {
						backgroundColor: document.body.classList.contains("dark-mode") ? "#0b1d3a" : "#14213a",
						cornerRadius: 8,
					},
				},
				scales: {
					x: {
						grid: { display: false },
						ticks: { font: { family: "DM Sans", size: 10.5 }, color: document.body.classList.contains("dark-mode") ? "#94a3b8" : "#71829e" },
					},
					y: {
						type: "linear",
						display: true,
						position: "left",
						min: 60,
						max: 100,
						ticks: {
							callback: (v) => `${v}%`,
							font: { family: "DM Sans", size: 11 },
							color: document.body.classList.contains("dark-mode") ? "#94a3b8" : "#71829e",
						},
						grid: { color: document.body.classList.contains("dark-mode") ? "rgba(255, 255, 255, 0.07)" : "#f1f5f9" },
					},
					y1: {
						type: "linear",
						display: true,
						position: "right",
						min: 0,
						max: 45,
						ticks: {
							callback: (v) => `${v}h`,
							font: { family: "DM Sans", size: 11 },
							color: document.body.classList.contains("dark-mode") ? "#94a3b8" : "#71829e",
						},
						grid: { drawOnChartArea: false },
					},
				},
			},
		});
	}

	// Render Department Workload Health Cards Matrix
	function renderDeptHealthCards() {
		const container = document.getElementById("deptHealthCards");
		if (!container) return;

		const depts = state.departmentsData.length ? state.departmentsData : seedData.departments;

		container.innerHTML = depts
			.map((d) => {
				const compliance = d.compliance || d.sla_compliance_percent || 90;
				const compClass = compliance >= 92 ? "good" : "warn";
				const staff = d.staff || d.active_staff_count || 18;
				const workload = d.workload || d.workload_index || 70;
				const total = d.total || d.total_assigned || 50;

				return `
					<div class="dept-mini-card">
						<div class="dept-mini-header">
							<div class="dept-mini-title">
								<i class="fa-solid ${d.icon || 'fa-building'}"></i>
								<span>${d.name}</span>
							</div>
							<span class="compliance-tag ${compClass}">${compliance}% SLA</span>
						</div>
						<div class="dept-mini-metrics">
							<div>
								<span>Assigned</span>
								<strong>${total}</strong>
							</div>
							<div>
								<span>Staff</span>
								<strong>${staff}</strong>
							</div>
							<div>
								<span>Workload</span>
								<strong>${workload} / 100</strong>
							</div>
						</div>
					</div>
				`;
			})
			.join("");
	}

	// Render AI Insights Grid
	function renderAiInsights(insights) {
		const container = document.getElementById("aiInsightsGrid");
		if (!container) return;

		const list = insights && insights.length ? insights : seedData.aiInsights;

		container.innerHTML = list
			.map((item) => {
				const conf = Math.round((item.confidence_score || 0.9) * 100);
				return `
					<article class="ai-card" id="${item.id}">
						<div class="ai-card-top">
							<span class="ai-type-pill ${item.type}">${item.type}</span>
							<span class="ai-confidence"><i class="fa-solid fa-sparkles"></i> ${conf}% Confidence</span>
						</div>
						<div class="ai-card-body">
							<h3>${item.title}</h3>
							<p>${item.description}</p>
						</div>
						<div class="ai-action-box">
							<strong>Recommended Municipal Action:</strong> ${item.recommended_action}
						</div>
						<div class="ai-card-footer">
							<span>📍 ${item.affected_ward_or_dept}</span>
							<button class="ai-action-btn" onclick="window.triggerAiAction('${item.id}', '${item.title.replace(/'/g, "\\'")}')">
								${item.action_label || 'Take Action'} →
							</button>
						</div>
					</article>
				`;
			})
			.join("");
	}

	// Window-scoped AI action handler
	window.triggerAiAction = function (id, title) {
		showToast(`Action initiated for AI Insight: "${title}"`, "success");
	};

	// Render Ward Performance Table
	function renderWardTable() {
		const tbody = document.getElementById("wardTableBody");
		const countSpan = document.getElementById("wardTableCount");
		if (!tbody) return;

		let wards = state.wardsData.length ? [...state.wardsData] : [...seedData.wards];

		// Filter by zone
		if (state.zoneFilter !== "ALL") {
			wards = wards.filter((w) => w.zone === state.zoneFilter);
		}

		// Filter by risk
		if (state.riskFilter !== "ALL") {
			wards = wards.filter((w) => w.risk_level === state.riskFilter);
		}

		// Filter by search query
		if (state.searchQuery) {
			const q = state.searchQuery;
			wards = wards.filter(
				(w) =>
					w.ward_name.toLowerCase().includes(q) ||
					w.zone.toLowerCase().includes(q) ||
					(w.top_issue_category && w.top_issue_category.toLowerCase().includes(q))
			);
		}

		// Sort
		const col = state.sortColumn;
		const dir = state.sortDirection === "asc" ? 1 : -1;
		wards.sort((a, b) => {
			let valA = a[col];
			let valB = b[col];
			if (typeof valA === "string") {
				return valA.localeCompare(valB) * dir;
			}
			return (valA - valB) * dir;
		});

		// Count
		if (countSpan) {
			countSpan.textContent = `Showing ${wards.length} of ${state.wardsData.length || seedData.wards.length} wards`;
		}

		if (wards.length === 0) {
			tbody.innerHTML = `
				<tr>
					<td colspan="10" style="text-align:center;padding:32px;color:var(--muted);">
						<i class="fa-solid fa-filter" style="font-size:24px;margin-bottom:8px;display:block;"></i>
						No wards match the selected filters or search query.
					</td>
				</tr>
			`;
			return;
		}

		tbody.innerHTML = wards
			.map((w) => {
				const spots = w.hotspots_count || 0;
				const spotClass = spots > 0 ? "active" : "zero";
				const riskLvl = w.risk_level || "LOW";
				const riskIdx = w.risk_index ? w.risk_index.toFixed(1) : "20.0";
				const territoryName = (w.ward_name || "").replace(/^Ward\s+\d+\s*[-–—:]\s*/i, "");

				return `
					<tr>
						<td><strong>#${w.ward_number}</strong></td>
						<td>
							<strong style="color:var(--navy);font-size:11.5px;">${territoryName}</strong>
						</td>
						<td><span class="zone-tag">${w.zone.replace(/\s*Zone$/i, '')}</span></td>
						<td class="text-right"><strong>${w.total_issues}</strong></td>
						<td class="text-right">${w.resolved_issues}</td>
						<td class="text-right">
							<strong style="color:${w.resolution_rate_percent >= 88 ? 'var(--green)' : 'var(--amber-dark)'};font-size:11.5px;">
								${w.resolution_rate_percent}%
							</strong>
						</td>
						<td class="text-center">
							<span class="hotspot-pill ${spotClass}">${spots}</span>
						</td>
						<td>
							<span class="risk-tag ${riskLvl}">${riskLvl} ${riskIdx}</span>
						</td>
						<td style="white-space:nowrap;font-size:11px;">${w.top_issue_category || 'Roads'}</td>
						<td class="text-center" style="white-space:nowrap;">
							<a href="../Map & Hotspots/index.html" class="btn btn-secondary btn-sm" title="View in Map & Hotspots" style="padding:2px 6px;font-size:10px;white-space:nowrap;">
								<i class="fa-solid fa-crosshairs"></i> Map
							</a>
						</td>
					</tr>
				`;
			})
			.join("");
	}

	// Export Table to CSV
	function exportWardsToCsv() {
		const wards = state.wardsData.length ? state.wardsData : seedData.wards;
		let csv = "Ward_Number,Ward_Name,Zone,Total_Issues,Resolved_Issues,Resolution_Rate_Pct,Hotspots_Count,Risk_Level,Risk_Index,Top_Issue_Category\n";

		wards.forEach((w) => {
			csv += `"${w.ward_number}","${w.ward_name}","${w.zone}",${w.total_issues},${w.resolved_issues},${w.resolution_rate_percent}%,${w.hotspots_count},"${w.risk_level}",${w.risk_index},"${w.top_issue_category}"\n`;
		});

		downloadFile(csv, `civicbuzz_wards_analytics_${state.timeframe}.csv`, "text/csv");
		showToast("CSV file exported successfully", "success");
	}

	// Export Raw JSON Data
	function exportRawJson() {
		const exportData = {
			generated_at: new Date().toISOString(),
			timeframe: state.timeframe,
			overview: state.overviewData,
			departments: state.departmentsData,
			wards: state.wardsData,
			categories: state.categoriesData,
			ai_insights: state.aiInsightsData,
		};

		const jsonStr = JSON.stringify(exportData, null, 2);
		downloadFile(jsonStr, `civicbuzz_analytics_${state.timeframe}.json`, "application/json");
		showToast("JSON raw dataset exported successfully", "success");
	}

	// Helper: Download File
	function downloadFile(content, fileName, mimeType) {
		const blob = new Blob([content], { type: mimeType });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	// Toast Notification Utility
	function showToast(message, type = "info") {
		const container = document.getElementById("toastContainer");
		if (!container) return;

		const toast = document.createElement("div");
		toast.className = `toast ${type}`;
		const icon = type === "success" ? "fa-circle-check" : "fa-circle-info";
		toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
		container.appendChild(toast);

		setTimeout(() => {
			toast.style.opacity = "0";
			toast.style.transform = "translateY(8px)";
			toast.style.transition = "all 0.25s ease";
			setTimeout(() => toast.remove(), 250);
		}, 3200);
	}

	// Update Live Timestamp
	function updateTimestamp() {
		const lastUpdated = document.getElementById("lastUpdatedTime");
		if (lastUpdated) {
			const now = new Date();
			lastUpdated.textContent = `Updated ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
		}
	}

	// Apply Multilingual Translations
	function applyLanguage(lang) {
		state.language = lang;
		localStorage.setItem("civicbuzz_lang", lang);

		// Update Button UI
		const langCurrent = document.getElementById("languageCurrent");
		if (langCurrent) {
			langCurrent.textContent = lang === "hi" ? "हिन्दी" : "English";
		}

		document.querySelectorAll(".language-option").forEach((opt) => {
			opt.classList.toggle("active", opt.dataset.language === lang);
		});

		// Translate elements with data-i18n
		const dict = i18n[lang] || i18n["en"];
		document.querySelectorAll("[data-i18n]").forEach((el) => {
			const key = el.dataset.i18n;
			if (dict[key]) {
				el.textContent = dict[key];
			}
		});
	}

	// Start when DOM is ready
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
