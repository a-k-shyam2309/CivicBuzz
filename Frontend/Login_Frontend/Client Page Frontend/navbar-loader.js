/* =========================================================
   CIVICBUZZ - GLOBAL NAVBAR & APP SHELL CONTROLLER
   ========================================================= */

(function () {
	"use strict";

	/* -----------------------------------------------------
	   1. PATH RESOLUTION & ACTIVE PAGE DETECTION
	   ----------------------------------------------------- */

	function detectEnvironment() {
		const path = window.location.pathname.replace(/\\/g, "/");
		const currentScript = document.currentScript;
		let explicitBase = currentScript ? currentScript.getAttribute("data-basepath") : null;

		let basePath = "./";
		let activeNav = "home";

		if (explicitBase) {
			basePath = explicitBase;
		} else if (
			path.includes("/Report_Issue_Frontend/") ||
			path.endsWith("/Report_Issue_Frontend") ||
			path.includes("/Track_complaints_Frontend/") ||
			path.endsWith("/Track_complaints_Frontend") ||
			path.includes("/Tenders/") ||
			path.endsWith("/Tenders") ||
			path.includes("/Contact Us Frontend/") ||
			path.includes("/Contact%20Us%20Frontend/") ||
			path.endsWith("/Contact Us Frontend") ||
			path.endsWith("/Contact%20Us%20Frontend")
		) {
			basePath = "../";
		}

		if (path.includes("Report_Issue_Frontend")) {
			activeNav = "reportIssue";
		} else if (path.includes("Track_complaints_Frontend")) {
			activeNav = "trackIssue";
		} else if (path.includes("Tenders")) {
			activeNav = "tender";
		} else if (path.includes("Contact Us Frontend") || path.includes("Contact%20Us%20Frontend")) {
			activeNav = "contact";
		} else if (window.location.hash === "#map") {
			activeNav = "map";
		} else if (window.location.hash === "#help") {
			activeNav = "needHelp";
		} else {
			activeNav = "home";
		}

		return { basePath, activeNav };
	}

	const env = detectEnvironment();

	/* -----------------------------------------------------
	   2. TRANSLATIONS (I18N)
	   ----------------------------------------------------- */

	const translations = {
		tagline: {
			en: "Your Voice. Our Responsibility.",
			hi: "आपकी आवाज़। हमारी ज़िम्मेदारी।"
		},
		home: {
			en: "Home",
			hi: "होम"
		},
		reportIssue: {
			en: "Report Issue",
			hi: "समस्या दर्ज करें"
		},
		trackIssue: {
			en: "Track Issue",
			hi: "समस्या ट्रैक करें"
		},
		map: {
			en: "Map",
			hi: "मानचित्र"
		},
		tender: {
			en: "Tender",
			hi: "टेंडर"
		},
		contact: {
			en: "Contact Us",
			hi: "संपर्क करें"
		},
		needHelp: {
			en: "Need Help",
			hi: "मदद चाहिए?"
		},
		accountName: {
			en: "Aditya Kumar Shyam",
			hi: "आदित्य कुमार श्याम"
		},
		accountStatus: {
			en: "Citizen Account",
			hi: "नागरिक खाता"
		},
		myProfile: {
			en: "My Profile",
			hi: "मेरी प्रोफ़ाइल"
		},
		myReports: {
			en: "My Reports",
			hi: "मेरी रिपोर्ट्स"
		},
		darkMode: {
			en: "Dark Mode",
			hi: "डार्क मोड"
		},
		lightMode: {
			en: "Light Mode",
			hi: "लाइट मोड"
		},
		logout: {
			en: "Logout",
			hi: "लॉगआउट"
		},
		noNotifications: {
			en: "No new notifications.",
			hi: "अभी कोई नई सूचना नहीं है।"
		},
		profileComingSoon: {
			en: "Profile will be available soon.",
			hi: "प्रोफ़ाइल जल्द उपलब्ध होगी।"
		},
		reportsComingSoon: {
			en: "Your reports will be available soon.",
			hi: "आपकी रिपोर्ट्स जल्द उपलब्ध होंगी।"
		},
		loggedOutMsg: {
			en: "Logged out successfully.",
			hi: "सफलतापूर्वक लॉगआउट किया गया।"
		},
		darkModeEnabled: {
			en: "Dark mode enabled.",
			hi: "डार्क मोड चालू किया गया।"
		},
		lightModeEnabled: {
			en: "Light mode enabled.",
			hi: "लाइट मोड चालू किया गया।"
		},
		langChangedEn: {
			en: "Language changed to English.",
			hi: "Language changed to English."
		},
		langChangedHi: {
			en: "भाषा हिन्दी में बदल दी गई है।",
			hi: "भाषा हिन्दी में बदल दी गई है।"
		}
	};

	/* -----------------------------------------------------
	   3. INITIAL THEME & STATE BOOTSTRAP (Prevents flash)
	   ----------------------------------------------------- */

	const initialTheme = localStorage.getItem("civicbuzz-theme") || "light";
	if (initialTheme === "dark") {
		document.documentElement.classList.add("dark-mode");
		if (document.body) {
			document.body.classList.add("dark-mode");
		}
	}

	const initialLang = localStorage.getItem("civicbuzz-language") || "en";
	document.documentElement.lang = initialLang;

	/* -----------------------------------------------------
	   4. NAVBAR HTML GENERATOR
	   ----------------------------------------------------- */

	function createNavbarHTML(basePath, activeNav) {
		return `
<header class="navbar" id="global-navbar">

	<a href="${basePath}index.html#home" class="brand" aria-label="CivicBuzz Home">
		<div class="brand-mark">
			<img src="${basePath}Assets/Logo.png" alt="CivicBuzz Logo" onerror="this.style.display='none'">
		</div>
		<div class="brand-text">
			<span class="brand-name">
				Civic<span>Buzz</span>
			</span>
			<small data-i18n="tagline">
				Your Voice. Our Responsibility.
			</small>
		</div>
	</a>

	<nav class="nav-links" id="navLinks" aria-label="Main Navigation">
		<a href="${basePath}index.html#home" class="nav-link ${activeNav === "home" ? "active" : ""}" data-nav="home">
			<i class="fa-solid fa-house"></i>
			<span data-i18n="home">Home</span>
		</a>

		<a href="${basePath}Report_Issue_Frontend/index.html" class="nav-link ${activeNav === "reportIssue" ? "active" : ""}" data-nav="reportIssue">
			<i class="fa-regular fa-pen-to-square"></i>
			<span data-i18n="reportIssue">Report Issue</span>
		</a>

		<a href="${basePath}Track_complaints_Frontend/index.html" class="nav-link ${activeNav === "trackIssue" ? "active" : ""}" data-nav="trackIssue">
			<i class="fa-regular fa-file-lines"></i>
			<span data-i18n="trackIssue">Track Issue</span>
		</a>

		<a href="${basePath}index.html#map" class="nav-link ${activeNav === "map" ? "active" : ""}" data-nav="map">
			<i class="fa-solid fa-location-dot"></i>
			<span data-i18n="map">Map</span>
		</a>

		<a href="${basePath}Tenders/index.html" class="nav-link ${activeNav === "tender" ? "active" : ""}" data-nav="tender">
			<i class="fa-solid fa-briefcase"></i>
			<span data-i18n="tender">Tender</span>
		</a>

		<a href="${basePath}Contact Us Frontend/index.html" class="nav-link ${activeNav === "contact" ? "active" : ""}" data-nav="contact">
			<i class="fa-regular fa-envelope"></i>
			<span data-i18n="contact">Contact Us</span>
		</a>

		<a href="${basePath}index.html#help" class="nav-link ${activeNav === "needHelp" ? "active" : ""}" data-nav="needHelp">
			<i class="fa-solid fa-circle-question"></i>
			<span data-i18n="needHelp">Need Help</span>
		</a>
	</nav>

	<div class="nav-actions">
		<!-- LANGUAGE DROPDOWN -->
		<div class="language-wrapper">
			<button class="language-btn" id="languageBtn" type="button" aria-label="Select language" aria-expanded="false">
				<i class="fa-solid fa-globe"></i>
				<span id="currentLanguage">English</span>
				<i class="fa-solid fa-chevron-down"></i>
			</button>
			<div class="language-dropdown" id="languageDropdown">
				<button type="button" class="language-option active" data-lang="en">
					<span>English</span>
				</button>
				<button type="button" class="language-option" data-lang="hi">
					<span>हिन्दी</span>
				</button>
			</div>
		</div>

		<!-- NOTIFICATION BUTTON -->
		<button class="icon-btn notification-btn" id="notificationBtn" type="button" aria-label="Notifications">
			<i class="fa-regular fa-bell"></i>
			<span class="notification-dot"></span>
		</button>

		<!-- PROFILE DROPDOWN -->
		<div class="profile-wrapper">
			<button class="profile-btn" id="profileBtn" type="button" aria-label="Profile" aria-expanded="false">
				AK
			</button>
			<div class="profile-dropdown" id="profileDropdown">
				<div class="profile-dropdown-header">
					<div class="profile-avatar-large">AK</div>
					<div>
						<strong data-i18n="accountName">Aditya Kumar Shyam</strong>
						<small data-i18n="accountStatus">Citizen Account</small>
					</div>
				</div>
				<button type="button" class="profile-menu-item" data-action="profile">
					<i class="fa-regular fa-user"></i>
					<span data-i18n="myProfile">My Profile</span>
				</button>
				<button type="button" class="profile-menu-item" data-action="reports">
					<i class="fa-regular fa-file-lines"></i>
					<span data-i18n="myReports">My Reports</span>
				</button>
				<button type="button" class="profile-menu-item" data-action="theme">
					<i class="fa-solid fa-moon" id="themeIcon"></i>
					<span data-i18n="darkMode">Dark Mode</span>
					<span class="theme-switch" id="themeSwitch">
						<span></span>
					</span>
				</button>
				<div class="profile-menu-divider"></div>
				<button type="button" class="profile-menu-item logout-item" data-action="logout">
					<i class="fa-solid fa-arrow-right-from-bracket"></i>
					<span data-i18n="logout">Logout</span>
				</button>
			</div>
		</div>
	</div>

	<button class="mobile-menu-btn" id="mobileMenuBtn" type="button" aria-label="Open menu" aria-expanded="false">
		<i class="fa-solid fa-bars"></i>
	</button>

</header>
`;
	}

	/* -----------------------------------------------------
	   5. TOAST NOTIFICATION UTILITY
	   ----------------------------------------------------- */

	let toastTimer = null;

	function showToast(message) {
		let toast = document.getElementById("toast");
		if (!toast) {
			toast = document.createElement("div");
			toast.id = "toast";
			toast.className = "toast";
			toast.setAttribute("role", "status");
			toast.setAttribute("aria-live", "polite");
			document.body.appendChild(toast);
		}

		toast.textContent = message;
		toast.classList.add("show");

		if (toastTimer) {
			clearTimeout(toastTimer);
		}

		toastTimer = setTimeout(() => {
			toast.classList.remove("show");
		}, 2500);
	}

	// Expose globally
	window.showToast = showToast;
	window.showCivicBuzzToast = showToast;

	/* -----------------------------------------------------
	   6. INITIALIZE NAVBAR COMPONENT & EVENT BINDINGS
	   ----------------------------------------------------- */

	function initNavbar() {
		const existingNavbar = document.querySelector("header.navbar");

		if (!existingNavbar) {
			// Insert navbar at the beginning of body
			const temp = document.createElement("div");
			temp.innerHTML = createNavbarHTML(env.basePath, env.activeNav);
			const newNavbar = temp.firstElementChild;
			if (document.body.firstChild) {
				document.body.insertBefore(newNavbar, document.body.firstChild);
			} else {
				document.body.appendChild(newNavbar);
			}
		} else {
			// If an existing navbar element is already in the HTML, ensure IDs and active classes are synced
			if (!existingNavbar.id) {
				existingNavbar.id = "global-navbar";
			}
			const navLinks = existingNavbar.querySelectorAll(".nav-link");
			navLinks.forEach((link) => {
				const href = link.getAttribute("href") || "";
				if (
					(env.activeNav === "reportIssue" && href.includes("Report_Issue_Frontend")) ||
					(env.activeNav === "trackIssue" && href.includes("Track_complaints_Frontend")) ||
					(env.activeNav === "tender" && href.includes("Tenders")) ||
					(env.activeNav === "contact" && href.includes("Contact")) ||
					(env.activeNav === "home" && (href.endsWith("index.html") || href.endsWith("#home") || href === "#home"))
				) {
					link.classList.add("active");
				}
			});
		}

		// Ensure toast element exists
		if (!document.getElementById("toast")) {
			const toast = document.createElement("div");
			toast.id = "toast";
			toast.className = "toast";
			toast.setAttribute("role", "status");
			toast.setAttribute("aria-live", "polite");
			document.body.appendChild(toast);
		}

		// Cache DOM elements
		const navbar = document.getElementById("global-navbar") || document.querySelector("header.navbar");
		const mobileMenuBtn = document.getElementById("mobileMenuBtn") || navbar.querySelector(".mobile-menu-btn");
		const navLinksContainer = document.getElementById("navLinks") || navbar.querySelector(".nav-links");
		const languageBtn = document.getElementById("languageBtn") || navbar.querySelector(".language-btn");
		const languageDropdown = document.getElementById("languageDropdown") || navbar.querySelector(".language-dropdown");
		const languageOptions = navbar.querySelectorAll(".language-option");
		const currentLanguageSpan = document.getElementById("currentLanguage") || navbar.querySelector("#currentLanguage");
		const notificationBtn = document.getElementById("notificationBtn") || navbar.querySelector(".notification-btn");
		const profileBtn = document.getElementById("profileBtn") || navbar.querySelector(".profile-btn");
		const profileDropdown = document.getElementById("profileDropdown") || navbar.querySelector(".profile-dropdown");
		const themeSwitch = document.getElementById("themeSwitch") || navbar.querySelector(".theme-switch");
		const themeIcon = document.getElementById("themeIcon") || navbar.querySelector("#themeIcon");
		const profileMenuItems = navbar.querySelectorAll(".profile-menu-item");

		let currentLang = localStorage.getItem("civicbuzz-language") || "en";
		let currentTheme = localStorage.getItem("civicbuzz-theme") || "light";

		/* --- Theme Handler --- */
		function applyTheme(theme, isUserToggle) {
			currentTheme = theme;
			const isDark = theme === "dark";

			document.body.classList.toggle("dark-mode", isDark);
			document.documentElement.classList.toggle("dark-mode", isDark);

			if (themeIcon) {
				themeIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
			}

			const darkModeLabel = navbar.querySelector('[data-i18n="darkMode"]');
			if (darkModeLabel) {
				darkModeLabel.textContent = isDark
					? (currentLang === "hi" ? "लाइट मोड" : "Light Mode")
					: (currentLang === "hi" ? "डार्क मोड" : "Dark Mode");
			}

			localStorage.setItem("civicbuzz-theme", theme);

			if (isUserToggle) {
				showToast(isDark ? translations.darkModeEnabled[currentLang] : translations.lightModeEnabled[currentLang]);
			}
		}

		// Initial theme setup
		applyTheme(currentTheme, false);

		function toggleTheme() {
			const nextTheme = currentTheme === "dark" ? "light" : "dark";
			applyTheme(nextTheme, true);
		}

		/* --- Translation Handler --- */
		function translatePage(lang, isUserChange) {
			currentLang = lang;
			document.documentElement.lang = lang;
			document.body.dataset.language = lang;
			localStorage.setItem("civicbuzz-language", lang);

			if (currentLanguageSpan) {
				currentLanguageSpan.textContent = lang === "hi" ? "हिन्दी" : "English";
			}

			if (languageOptions) {
				languageOptions.forEach((option) => {
					option.classList.toggle("active", option.dataset.lang === lang);
				});
			}

			// Translate all data-i18n elements
			document.querySelectorAll("[data-i18n]").forEach((el) => {
				const key = el.dataset.i18n;
				if (translations[key] && translations[key][lang]) {
					el.textContent = translations[key][lang];
				}
			});

			// Re-sync dark mode text
			const darkModeLabel = navbar.querySelector('[data-i18n="darkMode"]');
			if (darkModeLabel) {
				darkModeLabel.textContent = currentTheme === "dark"
					? (lang === "hi" ? "लाइट मोड" : "Light Mode")
					: (lang === "hi" ? "डार्क मोड" : "Dark Mode");
			}

			if (isUserChange) {
				showToast(lang === "hi" ? translations.langChangedHi.hi : translations.langChangedEn.en);
			}
		}

		// Initial translation
		translatePage(currentLang, false);

		/* --- Dropdown Controls --- */
		function closeDropdowns() {
			if (languageDropdown) {
				languageDropdown.classList.remove("open");
			}
			if (languageBtn) {
				languageBtn.setAttribute("aria-expanded", "false");
			}
			if (profileDropdown) {
				profileDropdown.classList.remove("open");
			}
			if (profileBtn) {
				profileBtn.setAttribute("aria-expanded", "false");
			}
		}

		if (languageBtn && languageDropdown) {
			languageBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				const isOpen = languageDropdown.classList.contains("open");
				closeDropdowns();
				if (!isOpen) {
					languageDropdown.classList.add("open");
					languageBtn.setAttribute("aria-expanded", "true");
				}
			});
		}

		if (languageOptions) {
			languageOptions.forEach((opt) => {
				opt.addEventListener("click", (e) => {
					e.stopPropagation();
					const lang = opt.dataset.lang;
					if (lang && lang !== currentLang) {
						translatePage(lang, true);
					}
					closeDropdowns();
				});
			});
		}

		if (profileBtn && profileDropdown) {
			profileBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				const isOpen = profileDropdown.classList.contains("open");
				closeDropdowns();
				if (!isOpen) {
					profileDropdown.classList.add("open");
					profileBtn.setAttribute("aria-expanded", "true");
				}
			});
		}

		if (profileMenuItems) {
			profileMenuItems.forEach((item) => {
				item.addEventListener("click", (e) => {
					e.stopPropagation();
					const action = item.dataset.action;
					closeDropdowns();

					if (action === "theme") {
						toggleTheme();
					} else if (action === "profile") {
						showToast(translations.profileComingSoon[currentLang]);
					} else if (action === "reports") {
						if (env.activeNav === "trackIssue") {
							showToast(currentLang === "hi" ? "आप पहले से ही रिपोर्ट्स पेज पर हैं।" : "You are currently viewing your reports.");
						} else {
							window.location.href = `${env.basePath}Track_complaints_Frontend/index.html`;
						}
					} else if (action === "logout") {
						showToast(translations.loggedOutMsg[currentLang]);
					}
				});
			});
		}

		/* --- Notification Bell --- */
		if (notificationBtn) {
			notificationBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				closeDropdowns();
				showToast(translations.noNotifications[currentLang]);
			});
		}

		/* --- Mobile Menu --- */
		function closeMobileMenu() {
			if (navbar) {
				navbar.classList.remove("menu-open");
			}
			if (mobileMenuBtn) {
				mobileMenuBtn.setAttribute("aria-expanded", "false");
			}
			if (navLinksContainer) {
				navLinksContainer.classList.remove("active");
			}
		}

		if (mobileMenuBtn) {
			mobileMenuBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				closeDropdowns();
				const isOpen = navbar.classList.toggle("menu-open");
				mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
				if (navLinksContainer) {
					navLinksContainer.classList.toggle("active", isOpen);
				}
			});
		}

		// Close mobile menu on clicking any nav link
		navbar.querySelectorAll(".nav-link").forEach((link) => {
			link.addEventListener("click", () => {
				closeMobileMenu();
			});
		});

		/* --- Global Dismiss Listeners --- */
		document.addEventListener("click", (e) => {
			if (!e.target.closest(".language-wrapper") && !e.target.closest(".profile-wrapper")) {
				closeDropdowns();
			}
			if (!e.target.closest(".navbar")) {
				closeMobileMenu();
			}
		});

		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				closeDropdowns();
				closeMobileMenu();
			}
		});

		window.addEventListener("resize", () => {
			if (window.innerWidth > 1080) {
				closeMobileMenu();
			}
		});

		// Expose API
		window.CivicBuzzNavbar = {
			applyTheme,
			toggleTheme,
			translatePage,
			showToast,
			getTheme: () => currentTheme,
			getLanguage: () => currentLang
		};
	}

	/* -----------------------------------------------------
	   7. RUNTIME BOOTSTRAP
	   ----------------------------------------------------- */

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initNavbar);
	} else {
		initNavbar();
	}
})();
