/* =========================================================
   GLOBAL NAVBAR LOADER
   ========================================================= */

(function() {
	// Determine the path to navigate from subfolders
	const basePath = '../';
	
	// Fetch the navbar HTML
	fetch(basePath + 'navbar.html')
		.then(response => response.text())
		.then(html => {
			// Create a temporary container
			const temp = document.createElement('div');
			temp.innerHTML = html;
			
			// Insert the navbar at the beginning of the body
			const navbar = temp.querySelector('header');
			document.body.insertBefore(navbar, document.body.firstChild);
			
			// Initialize navbar functionality
			initializeNavbar();
		})
		.catch(error => {
			console.error('Failed to load navbar:', error);
		});

/* =========================================================
   NAVBAR INITIALIZATION (shared with main script.js)
   ========================================================= */

function initializeNavbar() {
	const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
	const navLinks = document.querySelector(".nav-links");
	const languageButton = document.querySelector(".language-btn");
	const languageDropdown = document.getElementById("languageDropdown");
	const languageOptions = document.querySelectorAll(".language-option");
	const currentLanguage = document.getElementById("currentLanguage");
	const profileButton = document.querySelector(".profile-btn");
	const profileDropdown = document.getElementById("profileDropdown");
	const notificationButton = document.querySelector(".notification-btn");
	const themeSwitch = document.getElementById("themeSwitch");
	const themeIcon = document.getElementById("themeIcon");
	const body = document.body;

	// Mobile menu toggle
	if (mobileMenuBtn) {
		mobileMenuBtn.addEventListener("click", () => {
			const isOpen = mobileMenuBtn.getAttribute("aria-expanded") === "true";
			mobileMenuBtn.setAttribute("aria-expanded", !isOpen);
			navLinks?.classList.toggle("active");
		});
	}

	// Language dropdown
	if (languageButton) {
		languageButton.addEventListener("click", () => {
			const isOpen = languageButton.getAttribute("aria-expanded") === "true";
			languageButton.setAttribute("aria-expanded", !isOpen);
			languageDropdown?.classList.toggle("active");
		});
	}

	if (languageOptions) {
		languageOptions.forEach(option => {
			option.addEventListener("click", () => {
				const lang = option.getAttribute("data-lang");
				document.documentElement.lang = lang;
				body.setAttribute("data-language", lang);
				currentLanguage.textContent = option.textContent;
				languageButton?.setAttribute("aria-expanded", "false");
				languageDropdown?.classList.remove("active");
				// Set as active
				languageOptions.forEach(opt => opt.classList.remove("active"));
				option.classList.add("active");
			});
		});
	}

	// Profile dropdown
	if (profileButton) {
		profileButton.addEventListener("click", () => {
			const isOpen = profileButton.getAttribute("aria-expanded") === "true";
			profileButton.setAttribute("aria-expanded", !isOpen);
			profileDropdown?.classList.toggle("active");
		});
	}

	// Profile menu items
	const profileMenuItems = document.querySelectorAll(".profile-menu-item");
	profileMenuItems.forEach(item => {
		item.addEventListener("click", () => {
			const action = item.getAttribute("data-action");
			handleProfileAction(action);
		});
	});

	// Theme toggle
	if (themeSwitch) {
		themeSwitch.addEventListener("click", () => {
			body.classList.toggle("dark-mode");
			const isDarkMode = body.classList.contains("dark-mode");
			localStorage.setItem("theme", isDarkMode ? "dark" : "light");
			updateThemeIcon();
		});
	}

	// Notification button
	if (notificationButton) {
		notificationButton.addEventListener("click", () => {
			console.log("Notifications clicked");
		});
	}

	// Close dropdowns when clicking outside
	document.addEventListener("click", (e) => {
		if (!e.target.closest(".language-wrapper")) {
			languageButton?.setAttribute("aria-expanded", "false");
			languageDropdown?.classList.remove("active");
		}
		if (!e.target.closest(".profile-wrapper")) {
			profileButton?.setAttribute("aria-expanded", "false");
			profileDropdown?.classList.remove("active");
		}
	});

	// Load saved theme
	const savedTheme = localStorage.getItem("theme");
	if (savedTheme === "dark") {
		body.classList.add("dark-mode");
		updateThemeIcon();
	}
}

function updateThemeIcon() {
	const themeIcon = document.getElementById("themeIcon");
	const isDarkMode = document.body.classList.contains("dark-mode");
	if (themeIcon) {
		themeIcon.className = isDarkMode ? "fa-solid fa-sun" : "fa-solid fa-moon";
	}
}

function handleProfileAction(action) {
	switch(action) {
		case "profile":
			console.log("Navigate to profile");
			break;
		case "reports":
			console.log("Navigate to reports");
			break;
		case "logout":
			console.log("Logout user");
			break;
		default:
			break;
	}
}

})();
