/* =========================================================
   CIVICBUZZ - MAIN SCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

	/* =====================================================
	   ELEMENTS
	   ===================================================== */

	const body = document.body;

	const navbar =
		document.querySelector(".navbar");

	const mobileMenuBtn =
		document.querySelector(".mobile-menu-btn");

	const navLinks =
		document.querySelector(".nav-links");

	const languageWrapper =
		document.querySelector(".language-wrapper");

	const languageButton =
		document.querySelector(".language-btn");

	const languageDropdown =
		document.getElementById("languageDropdown");

	const languageOptions =
		document.querySelectorAll(".language-option");

	const currentLanguage =
		document.getElementById("currentLanguage");

	const profileWrapper =
		document.querySelector(".profile-wrapper");

	const profileButton =
		document.querySelector(".profile-btn");

	const profileDropdown =
		document.getElementById("profileDropdown");

	const notificationButton =
		document.querySelector(".notification-btn");

	const themeSwitch =
		document.getElementById("themeSwitch");

	const themeIcon =
		document.getElementById("themeIcon");

	const toast =
		document.getElementById("toast");


	/* =====================================================
	   CAROUSEL ELEMENTS
	   ===================================================== */

	const slides =
		document.querySelectorAll(".hero-slide");

	const dots =
		document.querySelectorAll(".dot");

	const prevButton =
		document.querySelector(".carousel-arrow.prev");

	const nextButton =
		document.querySelector(".carousel-arrow.next");

	let currentSlide = 0;

	let autoSlideTimer = null;

	const totalSlides =
		slides.length;


	/* =====================================================
	   TRANSLATIONS
	   ===================================================== */

	const translations = {

		/* ---------------------------------------------
		   NAVBAR
		   --------------------------------------------- */

		"Your Voice. Our Responsibility.": {
			en: "Your Voice. Our Responsibility.",
			hi: "आपकी आवाज़। हमारी ज़िम्मेदारी।"
		},

		"Home": {
			en: "Home",
			hi: "होम"
		},

		"Report Issue": {
			en: "Report Issue",
			hi: "समस्या दर्ज करें"
		},

		"Track Issue": {
			en: "Track Issue",
			hi: "समस्या ट्रैक करें"
		},

		"Map": {
			en: "Map",
			hi: "मानचित्र"
		},

		"Tender": {
			en: "Tender",
			hi: "टेंडर"
		},

		"Contact Us": {
			en: "Contact Us",
			hi: "संपर्क करें"
		},

		"Need Help": {
			en: "Need Help",
			hi: "मदद चाहिए?"
		},

		"Notifications": {
			en: "Notifications",
			hi: "सूचनाएँ"
		},


		/* ---------------------------------------------
		   PROFILE
		   --------------------------------------------- */

		"Aditya Kumar Shyam": {
			en: "Aditya Kumar Shyam",
			hi: "आदित्य कुमार श्याम"
		},

		"Citizen Account": {
			en: "Citizen Account",
			hi: "नागरिक खाता"
		},

		"My Profile": {
			en: "My Profile",
			hi: "मेरी प्रोफ़ाइल"
		},

		"My Reports": {
			en: "My Reports",
			hi: "मेरी रिपोर्ट्स"
		},

		"Dark Mode": {
			en: "Dark Mode",
			hi: "डार्क मोड"
		},

		"Light Mode": {
			en: "Light Mode",
			hi: "लाइट मोड"
		},

		"Logout": {
			en: "Logout",
			hi: "लॉगआउट"
		},


		/* ---------------------------------------------
		   HERO 1
		   --------------------------------------------- */

		"Stronger Communities, Better Tomorrow": {
			en: "Stronger Communities, Better Tomorrow",
			hi: "मज़बूत समुदाय, बेहतर कल"
		},

		"See It.": {
			en: "See It.",
			hi: "देखें।"
		},

		"Report It.": {
			en: "Report It.",
			hi: "रिपोर्ट करें।"
		},

		"We'll": {
			en: "We'll",
			hi: "हम"
		},

		"Fix It.": {
			en: "Fix It.",
			hi: "इसे ठीक करेंगे।"
		},

		"CivicBuzz helps you report civic issues in your area and track action by the responsible authorities.": {
			en: "CivicBuzz helps you report civic issues in your area and track action by the responsible authorities.",
			hi: "CivicBuzz आपको अपने क्षेत्र की नागरिक समस्याओं की रिपोर्ट करने और संबंधित अधिकारियों द्वारा की जा रही कार्रवाई को ट्रैक करने में मदद करता है।"
		},

		"Report an Issue": {
			en: "Report an Issue",
			hi: "समस्या की रिपोर्ट करें"
		},

		"View Map": {
			en: "View Map",
			hi: "मानचित्र देखें"
		},


		/* ---------------------------------------------
		   HERO 2
		   --------------------------------------------- */

		"Better Roads Start With Better Reporting": {
			en: "Better Roads Start With Better Reporting",
			hi: "बेहतर सड़कें बेहतर रिपोर्टिंग से शुरू होती हैं"
		},

		"Spot It.": {
			en: "Spot It.",
			hi: "समस्या पहचानें।"
		},

		"Track the": {
			en: "Track the",
			hi: "ट्रैक करें"
		},

		"Progress.": {
			en: "Progress.",
			hi: "प्रगति।"
		},

		"Turn everyday civic problems into structured reports that can reach the right responsible unit.": {
			en: "Turn everyday civic problems into structured reports that can reach the right responsible unit.",
			hi: "रोज़मर्रा की नागरिक समस्याओं को ऐसी व्यवस्थित रिपोर्ट में बदलें जो सही जिम्मेदार इकाई तक पहुँच सके।"
		},


		/* ---------------------------------------------
		   HERO 3
		   --------------------------------------------- */

		"Citizens At The Center": {
			en: "Citizens At The Center",
			hi: "नागरिक सबसे महत्वपूर्ण हैं"
		},

		"Your Voice.": {
			en: "Your Voice.",
			hi: "आपकी आवाज़।"
		},

		"Your Community.": {
			en: "Your Community.",
			hi: "आपका समुदाय।"
		},

		"Your Impact.": {
			en: "Your Impact.",
			hi: "आपका प्रभाव।"
		},

		"Make civic problems visible and help communities understand what needs attention.": {
			en: "Make civic problems visible and help communities understand what needs attention.",
			hi: "नागरिक समस्याओं को सामने लाएँ और समुदायों को समझने में मदद करें कि किस समस्या पर ध्यान देने की आवश्यकता है।"
		},


		/* ---------------------------------------------
		   HERO 4
		   --------------------------------------------- */

		"Know What Is Happening Around You": {
			en: "Know What Is Happening Around You",
			hi: "अपने आसपास हो रही समस्याओं को जानें"
		},

		"Find Issues.": {
			en: "Find Issues.",
			hi: "समस्याएँ खोजें।"
		},

		"See Patterns.": {
			en: "See Patterns.",
			hi: "पैटर्न देखें।"
		},

		"Take Action.": {
			en: "Take Action.",
			hi: "कार्रवाई करें।"
		},

		"Explore civic issues on the map and understand where problems are being reported.": {
			en: "Explore civic issues on the map and understand where problems are being reported.",
			hi: "मानचित्र पर नागरिक समस्याओं को देखें और समझें कि समस्याएँ कहाँ रिपोर्ट की जा रही हैं।"
		},


		/* ---------------------------------------------
		   HERO 5
		   --------------------------------------------- */

		"Designed For Diverse Communities": {
			en: "Designed For Diverse Communities",
			hi: "विविध समुदायों के लिए बनाया गया"
		},

		"Report In Your": {
			en: "Report In Your",
			hi: "अपनी"
		},

		"Own Language.": {
			en: "Own Language.",
			hi: "भाषा में रिपोर्ट करें।"
		},

		"CivicBuzz is designed to accept civic issues through text, voice, or images across languages.": {
			en: "CivicBuzz is designed to accept civic issues through text, voice, or images across languages.",
			hi: "CivicBuzz को विभिन्न भाषाओं में टेक्स्ट, आवाज़ या तस्वीरों के माध्यम से नागरिक समस्याएँ स्वीकार करने के लिए बनाया गया है।"
		},


		/* ---------------------------------------------
		   HERO 6
		   --------------------------------------------- */

		"From Report To Resolution": {
			en: "From Report To Resolution",
			hi: "रिपोर्ट से समाधान तक"
		},

		"Make Problems": {
			en: "Make Problems",
			hi: "समस्याओं को"
		},

		"Visible.": {
			en: "Visible.",
			hi: "दृश्य बनाएं।"
		},

		"Make Progress": {
			en: "Make Progress",
			hi: "प्रगति को"
		},

		"Trackable.": {
			en: "Trackable.",
			hi: "ट्रैक करने योग्य बनाएं।"
		},

		"Follow the journey of a civic issue from reporting and routing to action and resolution evidence.": {
			en: "Follow the journey of a civic issue from reporting and routing to action and resolution evidence.",
			hi: "नागरिक समस्या की रिपोर्टिंग और रूटिंग से लेकर कार्रवाई और समाधान के प्रमाण तक पूरी प्रक्रिया को ट्रैक करें।"
		},


		/* ---------------------------------------------
		   HERO 7
		   --------------------------------------------- */

		"Building Better Cities": {
			en: "Building Better Cities",
			hi: "बेहतर शहरों का निर्माण"
		},

		"Better Cities.": {
			en: "Better Cities.",
			hi: "बेहतर शहर।"
		},

		"Better Living.": {
			en: "Better Living.",
			hi: "बेहतर जीवन।"
		},

		"Help make your surroundings safer, cleaner and better through meaningful civic participation.": {
			en: "Help make your surroundings safer, cleaner and better through meaningful civic participation.",
			hi: "सार्थक नागरिक भागीदारी के माध्यम से अपने आसपास के क्षेत्र को सुरक्षित, स्वच्छ और बेहतर बनाने में मदद करें।"
		},


		/* ---------------------------------------------
		   HERO 8
		   --------------------------------------------- */

		"Community Powered": {
			en: "Community Powered",
			hi: "समुदाय की शक्ति"
		},

		"Every Report": {
			en: "Every Report",
			hi: "हर रिपोर्ट"
		},

		"Makes A Difference.": {
			en: "Makes A Difference.",
			hi: "बदलाव लाती है।"
		},

		"When citizens speak up and communities work together, real change becomes possible.": {
			en: "When citizens speak up and communities work together, real change becomes possible.",
			hi: "जब नागरिक अपनी आवाज़ उठाते हैं और समुदाय मिलकर काम करते हैं, तब वास्तविक बदलाव संभव होता है।"
		},


		/* ---------------------------------------------
		   HERO 9
		   --------------------------------------------- */

		"Together For A Better Tomorrow": {
			en: "Together For A Better Tomorrow",
			hi: "बेहतर कल के लिए साथ मिलकर"
		},

		"Real Action.": {
			en: "Real Action.",
			hi: "वास्तविक कार्रवाई।"
		},

		"CivicBuzz connects citizens, communities and responsible authorities to turn reports into visible action.": {
			en: "CivicBuzz connects citizens, communities and responsible authorities to turn reports into visible action.",
			hi: "CivicBuzz नागरिकों, समुदायों और जिम्मेदार अधिकारियों को जोड़कर रिपोर्ट को वास्तविक कार्रवाई में बदलता है।"
		},


		/* ---------------------------------------------
		   HELP SECTION
		   --------------------------------------------- */

		"How CivicBuzz Works": {
			en: "How CivicBuzz Works",
			hi: "CivicBuzz कैसे काम करता है"
		},

		"Understand how your civic report moves from submission to resolution.": {
			en: "Understand how your civic report moves from submission to resolution.",
			hi: "समझें कि आपकी नागरिक रिपोर्ट सबमिशन से समाधान तक कैसे पहुँचती है।"
		},


		/* ---------------------------------------------
		   WORKFLOW
		   --------------------------------------------- */

		"Report": {
			en: "Report",
			hi: "रिपोर्ट करें"
		},

		"Citizens can report issues via text, voice or images in multiple languages. Simply describe the problem and provide the necessary details.": {
			en: "Citizens can report issues via text, voice or images in multiple languages. Simply describe the problem and provide the necessary details.",
			hi: "नागरिक कई भाषाओं में टेक्स्ट, आवाज़ या तस्वीरों के माध्यम से समस्याओं की रिपोर्ट कर सकते हैं। बस समस्या का वर्णन करें और आवश्यक जानकारी दें।"
		},

		"AI Understands": {
			en: "AI Understands",
			hi: "AI समझता है"
		},

		"AI processes the submitted report and extracts the important issue information so the complaint can be properly understood and handled.": {
			en: "AI processes the submitted report and extracts the important issue information so the complaint can be properly understood and handled.",
			hi: "AI भेजी गई रिपोर्ट को प्रोसेस करता है और महत्वपूर्ण जानकारी निकालता है ताकि शिकायत को सही तरीके से समझा और संभाला जा सके।"
		},

		"Duplicate Detection": {
			en: "Duplicate Detection",
			hi: "डुप्लिकेट पहचान"
		},

		"Similar reports are identified to reduce duplicate complaints. This helps authorities focus on the actual issue instead of handling the same problem repeatedly.": {
			en: "Similar reports are identified to reduce duplicate complaints. This helps authorities focus on the actual issue instead of handling the same problem repeatedly.",
			hi: "समान रिपोर्ट की पहचान की जाती है ताकि डुप्लिकेट शिकायतों को कम किया जा सके। इससे अधिकारी एक ही समस्या को बार-बार संभालने के बजाय वास्तविक समस्या पर ध्यान दे सकते हैं।"
		},

		"Smart Routing": {
			en: "Smart Routing",
			hi: "स्मार्ट रूटिंग"
		},

		"The issue is routed to the responsible department or unit. This ensures that the complaint reaches the authority that can take appropriate action.": {
			en: "The issue is routed to the responsible department or unit. This ensures that the complaint reaches the authority that can take appropriate action.",
			hi: "समस्या को संबंधित विभाग या इकाई तक भेजा जाता है। इससे यह सुनिश्चित होता है कि शिकायत उस अधिकारी तक पहुँचे जो उचित कार्रवाई कर सकता है।"
		},

		"Action & Updates": {
			en: "Action & Updates",
			hi: "कार्रवाई और अपडेट"
		},

		"Authorities take action and update the status of the reported issue. Citizens can follow the progress of their complaint.": {
			en: "Authorities take action and update the status of the reported issue. Citizens can follow the progress of their complaint.",
			hi: "अधिकारी कार्रवाई करते हैं और रिपोर्ट की गई समस्या की स्थिति अपडेट करते हैं। नागरिक अपनी शिकायत की प्रगति देख सकते हैं।"
		},

		"Resolution & Evidence": {
			en: "Resolution & Evidence",
			hi: "समाधान और प्रमाण"
		},

		"Once the issue is resolved, resolution evidence can be uploaded and made public but it will be closed by the Complainant only. This creates a transparent record of the outcome.": {
			en: "Once the issue is resolved, resolution evidence can be uploaded and made public but it will be closed by the Complainant only. This creates a transparent record of the outcome.",
			hi: "समस्या के समाधान के बाद समाधान का प्रमाण अपलोड करके सार्वजनिक किया जा सकता है, लेकिन शिकायत को केवल शिकायतकर्ता द्वारा ही बंद किया जाएगा। इससे परिणाम का एक पारदर्शी रिकॉर्ड बनता है।"
		},


		/* ---------------------------------------------
		   FOOTER
		   --------------------------------------------- */

		"Making every civic issue visible,": {
			en: "Making every civic issue visible,",
			hi: "हर नागरिक समस्या को दृश्यमान बनाना,"
		},

		"actionable and accountable.": {
			en: "actionable and accountable.",
			hi: "कार्रवाई योग्य और जवाबदेह बनाना।"
		},

		"Empowering citizens to report problems": {
			en: "Empowering citizens to report problems",
			hi: "नागरिकों को समस्याओं की रिपोर्ट करने में सक्षम बनाना"
		},

		"and build better communities together.": {
			en: "and build better communities together.",
			hi: "और मिलकर बेहतर समुदायों का निर्माण करना।"
		},

		"QUICK LINKS": {
			en: "QUICK LINKS",
			hi: "त्वरित लिंक"
		},

		"Track Complaint": {
			en: "Track Complaint",
			hi: "शिकायत ट्रैक करें"
		},

		"Community": {
			en: "Community",
			hi: "समुदाय"
		},

		"About CivicBuzz": {
			en: "About CivicBuzz",
			hi: "CivicBuzz के बारे में"
		},

		"CIVIC SERVICES": {
			en: "CIVIC SERVICES",
			hi: "नागरिक सेवाएँ"
		},

		"Road & Potholes": {
			en: "Road & Potholes",
			hi: "सड़क और गड्ढे"
		},

		"Garbage & Sanitation": {
			en: "Garbage & Sanitation",
			hi: "कचरा और स्वच्छता"
		},

		"Street Lights": {
			en: "Street Lights",
			hi: "स्ट्रीट लाइट"
		},

		"Water & Drainage": {
			en: "Water & Drainage",
			hi: "पानी और जल निकासी"
		},

		"Public Infrastructure": {
			en: "Public Infrastructure",
			hi: "सार्वजनिक बुनियादी ढाँचा"
		},

		"NEED HELP?": {
			en: "NEED HELP?",
			hi: "मदद चाहिए?"
		},

		"FAQs": {
			en: "FAQs",
			hi: "अक्सर पूछे जाने वाले प्रश्न"
		},

		"How to Report": {
			en: "How to Report",
			hi: "रिपोर्ट कैसे करें"
		},

		"How Tracking Works": {
			en: "How Tracking Works",
			hi: "ट्रैकिंग कैसे काम करती है"
		},

		"Contact Support": {
			en: "Contact Support",
			hi: "सहायता से संपर्क करें"
		},

		"Have a question?": {
			en: "Have a question?",
			hi: "कोई सवाल है?"
		},

		"Issues Reported": {
			en: "Issues Reported",
			hi: "रिपोर्ट की गई समस्याएँ"
		},

		"Issues Resolved": {
			en: "Issues Resolved",
			hi: "हल की गई समस्याएँ"
		},

		"Active Citizens": {
			en: "Active Citizens",
			hi: "सक्रिय नागरिक"
		},

		"Communities": {
			en: "Communities",
			hi: "समुदाय"
		},

		"Privacy Policy": {
			en: "Privacy Policy",
			hi: "गोपनीयता नीति"
		},

		"Terms & Conditions": {
			en: "Terms & Conditions",
			hi: "नियम और शर्तें"
		},

		"Accessibility": {
			en: "Accessibility",
			hi: "सुगम्यता"
		},

		"© 2026 CivicBuzz. All rights reserved.": {
			en: "© 2026 CivicBuzz. All rights reserved.",
			hi: "© 2026 CivicBuzz. सर्वाधिकार सुरक्षित।"
		},

		"Built with": {
			en: "Built with",
			hi: "बेहतर समुदायों के लिए"
		},

		"for better communities.": {
			en: "for better communities.",
			hi: "बनाया गया।"
		},


		/* ---------------------------------------------
		   CHATBOT
		   --------------------------------------------- */

		"CivicBuzz Assistant": {
			en: "CivicBuzz Assistant",
			hi: "CivicBuzz सहायक"
		},

		"Online": {
			en: "Online",
			hi: "ऑनलाइन"
		},

		"Hi! 👋 I'm the CivicBuzz Assistant.": {
			en: "Hi! 👋 I'm the CivicBuzz Assistant.",
			hi: "नमस्ते! 👋 मैं CivicBuzz सहायक हूँ।"
		},

		"I can help you understand how CivicBuzz works, report an issue, track a complaint, or find the right information.": {
			en: "I can help you understand how CivicBuzz works, report an issue, track a complaint, or find the right information.",
			hi: "मैं आपको CivicBuzz के काम करने के तरीके को समझने, समस्या की रिपोर्ट करने, शिकायत ट्रैक करने या सही जानकारी खोजने में मदद कर सकता हूँ।"
		},

		"How do I report an issue?": {
			en: "How do I report an issue?",
			hi: "मैं समस्या की रिपोर्ट कैसे करूँ?"
		},

		"How can I track my issue?": {
			en: "How can I track my issue?",
			hi: "मैं अपनी समस्या को कैसे ट्रैक करूँ?"
		},

		"How does AI routing work?": {
			en: "How does AI routing work?",
			hi: "AI रूटिंग कैसे काम करती है?"
		},

		"Ask CivicBuzz anything...": {
			en: "Ask CivicBuzz anything...",
			hi: "CivicBuzz से कुछ भी पूछें..."
		}

	};

	let currentLang =
		localStorage.getItem("civicbuzz-language") || "en";


	/* =====================================================
	   ORIGINAL TEXT STORAGE
	   ===================================================== */

	const originalTexts =
		new WeakMap();

	const textWalker =
		document.createTreeWalker(
			document.body,
			NodeFilter.SHOW_TEXT
		);

	let textNode;

	while (
		textNode = textWalker.nextNode()
	) {

		const parent =
			textNode.parentElement;

		if (
			parent &&
			parent.tagName !== "SCRIPT" &&
			parent.tagName !== "STYLE"
		) {

			originalTexts.set(
				textNode,
				textNode.textContent
			);

		}

	}


	/* =====================================================
	   GET TRANSLATION
	   ===================================================== */

	function getTranslation(
		original,
		language
	) {

		if (
			translations[original] &&
			translations[original][language]
		) {

			return translations[
				original
			][language];

		}

		return original;

	}


	/* =====================================================
	   TRANSLATE PAGE
	   ===================================================== */

	function translatePage(
		language
	) {

		currentLang = language;

		document.documentElement.lang =
			language;

		body.dataset.language =
			language;


		/* ---------------------------------------------
		   TEXT NODES
		   --------------------------------------------- */

		const walker =
			document.createTreeWalker(
				document.body,
				NodeFilter.SHOW_TEXT
			);

		let node;

		while (
			node = walker.nextNode()
		) {

			const parent =
				node.parentElement;

			if (
				!parent ||
				parent.tagName === "SCRIPT" ||
				parent.tagName === "STYLE"
			) {

				continue;

			}

			const original =
				originalTexts.get(node);

			if (
				original === undefined
			) {

				continue;

			}

			const trimmed =
				original.trim();

			if (!trimmed) {

				continue;

			}

			const translated =
				getTranslation(
					trimmed,
					language
				);

			const leading =
				original.match(
					/^\s*/
				)?.[0] || "";

			const trailing =
				original.match(
					/\s*$/
				)?.[0] || "";

			node.textContent =
				leading +
				translated +
				trailing;

		}


		/* ---------------------------------------------
		   DATA-I18N ELEMENTS
		   --------------------------------------------- */

		document.querySelectorAll(
			"[data-i18n]"
		).forEach(
			element => {

				const key =
					element.dataset.i18n;

				if (
					translations[key] &&
					translations[key][language]
				) {

					element.textContent =
						translations[
						key
						][language];

				}

			}
		);


		/* ---------------------------------------------
		   CURRENT LANGUAGE BUTTON
		   --------------------------------------------- */

		if (currentLanguage) {

			currentLanguage.textContent =
				language === "hi"
					? "हिन्दी"
					: "English";

		}


		/* ---------------------------------------------
		   LANGUAGE OPTIONS
		   --------------------------------------------- */

		languageOptions.forEach(
			option => {

				const isSelected =
					option.dataset.lang === language;

				/* Remove active from every option first */
				option.classList.remove("active");

				/* Add active only to selected language */
				if (isSelected) {

					option.classList.add("active");

				}

			}
		);


		/* ---------------------------------------------
		   SAVE LANGUAGE
		   --------------------------------------------- */

		localStorage.setItem(
			"civicbuzz-language",
			language
		);

	}

	/* =====================================================
	   CLOSE LANGUAGE DROPDOWN
	   ===================================================== */

	function closeLanguageDropdown() {

		if (!languageDropdown) {
			return;
		}

		languageDropdown.classList.remove(
			"open"
		);

		if (languageButton) {

			languageButton.setAttribute(
				"aria-expanded",
				"false"
			);

		}

	}


	/* =====================================================
	   CLOSE PROFILE DROPDOWN
	   ===================================================== */

	function closeProfileDropdown() {

		if (!profileDropdown) {
			return;
		}

		profileDropdown.classList.remove(
			"open"
		);

		if (profileButton) {

			profileButton.setAttribute(
				"aria-expanded",
				"false"
			);

		}

	}


	/* =====================================================
	   CLOSE ALL DROPDOWNS
	   ===================================================== */

	function closeAllDropdowns() {

		closeLanguageDropdown();

		closeProfileDropdown();

	}


	/* =====================================================
	   LANGUAGE BUTTON
	   ===================================================== */

	if (
		languageButton &&
		languageDropdown
	) {

		languageButton.addEventListener(
			"click",
			event => {

				event.stopPropagation();

				closeProfileDropdown();

				const isOpen =
					languageDropdown.classList.toggle(
						"open"
					);

				languageButton.setAttribute(
					"aria-expanded",
					String(isOpen)
				);

			}
		);

	}


	/* =====================================================
	   LANGUAGE OPTIONS
	   ===================================================== */

	languageOptions.forEach(
		option => {

			option.addEventListener(
				"click",
				event => {

					event.stopPropagation();

					const selectedLanguage =
						option.dataset.lang;

					if (!selectedLanguage) {
						return;
					}

					translatePage(
						selectedLanguage
					);

					closeLanguageDropdown();

					showToast(
						selectedLanguage === "hi"
							? "भाषा हिन्दी में बदल दी गई है।"
							: "Language changed to English."
					);

				}
			);

		}
	);


	/* =====================================================
	   PROFILE BUTTON
	   ===================================================== */

	if (
		profileButton &&
		profileDropdown
	) {

		profileButton.addEventListener(
			"click",
			event => {

				event.stopPropagation();

				closeLanguageDropdown();

				const isOpen =
					profileDropdown.classList.toggle(
						"open"
					);

				profileButton.setAttribute(
					"aria-expanded",
					String(isOpen)
				);

			}
		);

	}


	/* =====================================================
	   PROFILE MENU ACTIONS
	   ===================================================== */

	const profileMenuItems =
		document.querySelectorAll(
			".profile-menu-item"
		);

	profileMenuItems.forEach(
		item => {

			item.addEventListener(
				"click",
				event => {

					event.stopPropagation();

					const action =
						item.dataset.action;


					/* PROFILE */

					if (
						action === "profile"
					) {

						showToast(
							currentLang === "hi"
								? "प्रोफ़ाइल जल्द उपलब्ध होगी।"
								: "Profile will be available soon."
						);

					}


					/* REPORTS */

					if (
						action === "reports"
					) {

						showToast(
							currentLang === "hi"
								? "आपकी रिपोर्ट्स जल्द उपलब्ध होंगी।"
								: "Your reports will be available soon."
						);

					}


					/* THEME */

					if (
						action === "theme"
					) {

						toggleTheme();

						return;

					}


					/* LOGOUT */

					if (
						action === "logout"
					) {

						showToast(
							currentLang === "hi"
								? "लॉगआउट सुविधा जल्द उपलब्ध होगी।"
								: "Logout functionality will be available soon."
						);

					}

				}
			);

		}
	);


	/* =====================================================
	   OUTSIDE CLICK
	   ===================================================== */

	document.addEventListener(
		"click",
		() => {

			closeAllDropdowns();

		}
	);


	/* =====================================================
	   MOBILE MENU
	   ===================================================== */

	function closeMobileMenu() {

		if (!navbar) {
			return;
		}

		navbar.classList.remove(
			"menu-open"
		);

		if (mobileMenuBtn) {

			mobileMenuBtn.setAttribute(
				"aria-expanded",
				"false"
			);

			const icon =
				mobileMenuBtn.querySelector("i");

			if (icon) {

				icon.className =
					"fa-solid fa-bars";

			}

		}

	}


	function toggleMobileMenu(event) {

		if (event) {

			event.preventDefault();
			event.stopPropagation();

		}

		if (!navbar || !mobileMenuBtn) {
			return;
		}

		closeAllDropdowns();

		const isOpen =
			navbar.classList.toggle(
				"menu-open"
			);

		mobileMenuBtn.setAttribute(
			"aria-expanded",
			String(isOpen)
		);

		const icon =
			mobileMenuBtn.querySelector("i");

		if (icon) {

			icon.className =
				isOpen
					? "fa-solid fa-xmark"
					: "fa-solid fa-bars";

		}

	}


	if (
		mobileMenuBtn &&
		navbar
	) {

		mobileMenuBtn.addEventListener(
			"click",
			toggleMobileMenu
		);

	}


	/* =====================================================
	   MOBILE NAV LINKS
	   ===================================================== */

	document.querySelectorAll(
		".nav-link"
	).forEach(
		link => {

			link.addEventListener(
				"click",
				() => {

					closeMobileMenu();

				}
			);

		}
	);


	/* =====================================================
	   CLOSE MOBILE MENU ON RESIZE
	   ===================================================== */

	window.addEventListener(
		"resize",
		() => {

			if (
				window.innerWidth > 900
			) {

				closeMobileMenu();

			}

		}
	);


	/* =====================================================
	   ACTIVE NAVIGATION
	   ===================================================== */

	document.querySelectorAll(
		".nav-link"
	).forEach(
		link => {

			link.addEventListener(
				"click",
				() => {

					document.querySelectorAll(
						".nav-link"
					).forEach(
						item =>
							item.classList.remove(
								"active"
							)
					);

					link.classList.add(
						"active"
					);

				}
			);

		}
	);


	/* =====================================================
	   CAROUSEL
	   ===================================================== */

	function showSlide(index) {

		if (!totalSlides) {
			return;
		}

		if (index < 0) {

			currentSlide =
				totalSlides - 1;

		}
		else if (
			index >= totalSlides
		) {

			currentSlide = 0;

		}
		else {

			currentSlide = index;

		}

		slides.forEach(
			(slide, index) => {

				slide.classList.toggle(
					"active",
					index === currentSlide
				);

			}
		);

		dots.forEach(
			(dot, index) => {

				dot.classList.toggle(
					"active",
					index === currentSlide
				);

			}
		);

	}


	function nextSlide() {

		showSlide(
			currentSlide + 1
		);

	}


	function previousSlide() {

		showSlide(
			currentSlide - 1
		);

	}


	if (nextButton) {

		nextButton.addEventListener(
			"click",
			() => {

				nextSlide();
				restartAutoSlide();

			}
		);

	}


	if (prevButton) {

		prevButton.addEventListener(
			"click",
			() => {

				previousSlide();
				restartAutoSlide();

			}
		);

	}


	dots.forEach(
		(dot, index) => {

			dot.addEventListener(
				"click",
				() => {

					showSlide(index);
					restartAutoSlide();

				}
			);

		}
	);


	/* =====================================================
	   AUTO SLIDE
	   ===================================================== */

	function startAutoSlide() {

		stopAutoSlide();

		autoSlideTimer =
			setInterval(
				() => {

					nextSlide();

				},
				6000
			);

	}


	function stopAutoSlide() {

		if (autoSlideTimer) {

			clearInterval(
				autoSlideTimer
			);

			autoSlideTimer = null;

		}

	}


	function restartAutoSlide() {

		startAutoSlide();

	}


	if (totalSlides > 1) {

		startAutoSlide();

	}


	/* =====================================================
	   PAUSE CAROUSEL ON HOVER
	   ===================================================== */

	const hero =
		document.querySelector(".hero");

	if (hero) {

		hero.addEventListener(
			"mouseenter",
			() => {

				stopAutoSlide();

			}
		);

		hero.addEventListener(
			"mouseleave",
			() => {

				startAutoSlide();

			}
		);

	}


	/* =====================================================
	   KEYBOARD CAROUSEL
	   ===================================================== */

	document.addEventListener(
		"keydown",
		event => {

			if (
				event.key === "ArrowRight"
			) {

				nextSlide();
				restartAutoSlide();

			}

			if (
				event.key === "ArrowLeft"
			) {

				previousSlide();
				restartAutoSlide();

			}

			/* ESC closes mobile menu */

			if (
				event.key === "Escape"
			) {

				closeMobileMenu();
				closeAllDropdowns();

			}

		}
	);


	/* =====================================================
	   TOUCH SWIPE
	   ===================================================== */

	let touchStartX = 0;
	let touchEndX = 0;

	if (hero) {

		hero.addEventListener(
			"touchstart",
			event => {

				touchStartX =
					event.changedTouches[0].screenX;

			},
			{ passive: true }
		);


		hero.addEventListener(
			"touchend",
			event => {

				touchEndX =
					event.changedTouches[0].screenX;

				const difference =
					touchStartX -
					touchEndX;

				if (
					Math.abs(difference) < 50
				) {

					return;

				}

				if (difference > 0) {

					nextSlide();

				}
				else {

					previousSlide();

				}

				restartAutoSlide();

			},
			{ passive: true }
		);

	}

	/* =====================================================
   DARK / LIGHT MODE
   ===================================================== */

	function applyTheme(theme) {

		const isDark =
			theme === "dark";

		body.classList.toggle(
			"dark-mode",
			isDark
		);

		if (themeIcon) {

			themeIcon.className =
				isDark
					? "fa-solid fa-sun"
					: "fa-solid fa-moon";

		}


		const themeText =
			document.querySelector(
				'[data-action="theme"] span:not(.theme-switch span)'
			);

		if (themeText) {

			themeText.textContent =
				isDark
					? (
						currentLang === "hi"
							? "लाइट मोड"
							: "Light Mode"
					)
					: (
						currentLang === "hi"
							? "डार्क मोड"
							: "Dark Mode"
					);

		}


		localStorage.setItem(
			"civicbuzz-theme",
			theme
		);

	}


	function toggleTheme() {

		const isDark =
			body.classList.contains(
				"dark-mode"
			);

		const newTheme =
			isDark
				? "light"
				: "dark";

		applyTheme(
			newTheme
		);

		showToast(
			newTheme === "dark"
				? (
					currentLang === "hi"
						? "डार्क मोड चालू किया गया।"
						: "Dark mode enabled."
				)
				: (
					currentLang === "hi"
						? "लाइट मोड चालू किया गया।"
						: "Light mode enabled."
				)
		);

	}


	const savedTheme =
		localStorage.getItem(
			"civicbuzz-theme"
		) || "light";


	applyTheme(
		savedTheme
	);


	/* =====================================================
	   NOTIFICATION
	   ===================================================== */

	if (notificationButton) {

		notificationButton.addEventListener(
			"click",
			() => {

				showToast(
					currentLang === "hi"
						? "अभी कोई नई सूचना नहीं है।"
						: "No new notifications."
				);

			}
		);

	}


	/* =====================================================
	   CHATBOT
	   ===================================================== */

	const chatbotInput =
		document.getElementById(
			"chatbotInput"
		);

	const chatbotSend =
		document.getElementById(
			"chatbotSend"
		);

	const chatbotMessages =
		document.getElementById(
			"chatbotMessages"
		);

	const quickQuestions =
		document.querySelectorAll(
			".quick-question"
		);


	/* ---------------------------------------------
	   ADD USER MESSAGE
	   --------------------------------------------- */

	function addUserMessage(
		message
	) {

		if (!chatbotMessages) {
			return;
		}

		const wrapper =
			document.createElement(
				"div"
			);

		wrapper.className =
			"chat-message user-message";

		wrapper.innerHTML = `
            <div class="message-content">
                <p>${escapeHTML(message)}</p>
            </div>
        `;

		chatbotMessages.appendChild(
			wrapper
		);

		scrollChatToBottom();

	}


	/* ---------------------------------------------
	   ADD BOT MESSAGE
	   --------------------------------------------- */

	function addBotMessage(
		message
	) {

		if (!chatbotMessages) {
			return;
		}

		const wrapper =
			document.createElement(
				"div"
			);

		wrapper.className =
			"chat-message bot-message";

		wrapper.innerHTML = `
            <div class="message-avatar">
                <i class="fa-solid fa-robot"></i>
            </div>

            <div class="message-content">
                <p>${escapeHTML(message)}</p>
            </div>
        `;

		chatbotMessages.appendChild(
			wrapper
		);

		scrollChatToBottom();

	}


	/* ---------------------------------------------
	   CHATBOT RESPONSE
	   --------------------------------------------- */

	function getBotResponse(
		message
	) {

		const lower =
			message.toLowerCase();


		/* HINDI */

		if (
			currentLang === "hi"
		) {

			if (
				lower.includes("रिपोर्ट") ||
				lower.includes("समस्या")
			) {

				return "आप Report an Issue विकल्प का उपयोग करके अपनी नागरिक समस्या दर्ज कर सकते हैं। आप टेक्स्ट, आवाज़ या तस्वीर के माध्यम से समस्या बता सकते हैं।";

			}


			if (
				lower.includes("ट्रैक") ||
				lower.includes("स्थिति")
			) {

				return "आप Track Issue विकल्प से अपनी दर्ज की गई समस्या की स्थिति और प्रगति देख सकते हैं।";

			}


			if (
				lower.includes("ai") ||
				lower.includes("रूटिंग")
			) {

				return "CivicBuzz AI आपकी समस्या को समझकर उसे सही विभाग या जिम्मेदार इकाई तक पहुँचाने में मदद करता है।";

			}


			if (
				lower.includes("कैसे") ||
				lower.includes("काम")
			) {

				return "CivicBuzz में आप समस्या रिपोर्ट करते हैं, AI उसे समझता है, डुप्लिकेट रिपोर्ट पहचानता है, सही विभाग तक पहुँचाता है और फिर आप समाधान की प्रगति ट्रैक कर सकते हैं।";

			}


			return "मैं CivicBuzz के बारे में आपकी मदद कर सकता हूँ। आप समस्या रिपोर्ट करने, समस्या ट्रैक करने या AI routing के बारे में पूछ सकते हैं।";

		}


		/* ENGLISH */

		if (
			lower.includes("report") ||
			lower.includes("issue") ||
			lower.includes("problem")
		) {

			return "You can use the Report an Issue option to submit a civic problem. CivicBuzz supports text, voice and image-based reporting.";

		}


		if (
			lower.includes("track") ||
			lower.includes("status")
		) {

			return "You can use Track Issue to follow the current status and progress of your submitted civic complaint.";

		}


		if (
			lower.includes("ai") ||
			lower.includes("routing")
		) {

			return "CivicBuzz AI understands the reported issue and helps route it to the appropriate department or responsible unit.";

		}


		if (
			lower.includes("how") ||
			lower.includes("work")
		) {

			return "CivicBuzz lets citizens report an issue, uses AI to understand it, detects duplicates, routes it to the responsible unit and allows citizens to track the resolution.";

		}


		return "I can help you with CivicBuzz. You can ask about reporting an issue, tracking a complaint, or how AI routing works.";

	}


	/* ---------------------------------------------
	   SEND CHAT
	   --------------------------------------------- */

	function sendChatMessage() {

		if (!chatbotInput) {
			return;
		}

		const message =
			chatbotInput.value.trim();

		if (!message) {
			return;
		}

		addUserMessage(
			message
		);

		chatbotInput.value =
			"";

		setTimeout(
			() => {

				const response =
					getBotResponse(
						message
					);

				addBotMessage(
					response
				);

			},
			450
		);

	}


	if (chatbotSend) {

		chatbotSend.addEventListener(
			"click",
			sendChatMessage
		);

	}


	if (chatbotInput) {

		chatbotInput.addEventListener(
			"keydown",
			event => {

				if (
					event.key === "Enter"
				) {

					event.preventDefault();

					sendChatMessage();

				}

			}
		);

	}


	/* ---------------------------------------------
	   QUICK QUESTIONS
	   --------------------------------------------- */

	quickQuestions.forEach(
		button => {

			button.addEventListener(
				"click",
				() => {

					const question =
						button.textContent.trim();

					if (chatbotInput) {

						chatbotInput.value =
							question;

					}

					sendChatMessage();

				}
			);

		}
	);


	/* ---------------------------------------------
	   CHAT SCROLL
	   --------------------------------------------- */

	function scrollChatToBottom() {

		if (!chatbotMessages) {
			return;
		}

		chatbotMessages.scrollTop =
			chatbotMessages.scrollHeight;

	}


	/* ---------------------------------------------
	   ESCAPE HTML
	   --------------------------------------------- */

	function escapeHTML(
		value
	) {

		const div =
			document.createElement(
				"div"
			);

		div.textContent =
			value;

		return div.innerHTML;

	}


	/* =====================================================
	   TOAST
	   ===================================================== */

	let toastTimer = null;


	function showToast(
		message
	) {

		if (!toast) {
			return;
		}

		toast.textContent =
			message;

		toast.classList.add(
			"show"
		);

		clearTimeout(
			toastTimer
		);

		toastTimer =
			setTimeout(
				() => {

					toast.classList.remove(
						"show"
					);

				},
				2500
			);

	}


	window.showToast =
		showToast;


	/* =====================================================
	   ACCESSIBILITY
	   ===================================================== */

	function setupAccessibility() {

		const buttons =
			document.querySelectorAll(
				"button"
			);

		buttons.forEach(
			button => {

				if (
					!button.hasAttribute(
						"type"
					)
				) {

					button.setAttribute(
						"type",
						"button"
					);

				}

			}
		);


		if (mobileMenuBtn) {

			mobileMenuBtn.setAttribute(
				"aria-expanded",
				"false"
			);

		}


		if (languageButton) {

			languageButton.setAttribute(
				"aria-expanded",
				"false"
			);

		}


		if (profileButton) {

			profileButton.setAttribute(
				"aria-expanded",
				"false"
			);

		}

	}


	/* =====================================================
	   NAVIGATION HELPERS
	   ===================================================== */

	function setupNavigationHelpers() {

		const links =
			document.querySelectorAll(
				".nav-link"
			);

		links.forEach(
			link => {

				link.addEventListener(
					"keydown",
					event => {

						if (
							event.key === "Enter" ||
							event.key === " "
						) {

							event.preventDefault();

							link.click();

						}

					}
				);

			}
		);

	}


	/* =====================================================
	   REPORT BUTTON HELPERS
	   ===================================================== */

	function setupReportButtons() {

		const reportButtons =
			document.querySelectorAll(
				'[data-action="report"], .report-btn'
			);

		reportButtons.forEach(
			button => {

				button.addEventListener(
					"click",
					event => {

						const href =
							button.getAttribute(
								"href"
							);

						if (
							!href ||
							href === "#"
						) {

							event.preventDefault();

							const message =
								currentLang === "hi"
									? "समस्या रिपोर्ट करने का विकल्प जल्द उपलब्ध होगा।"
									: "The issue reporting option will be available soon.";

							showToast(
								message
							);

						}

					}
				);

			}
		);

	}


	/* =====================================================
	   TRACK ISSUE HELPERS
	   ===================================================== */

	function setupTrackingButtons() {

		const trackingButtons =
			document.querySelectorAll(
				'[data-action="track"], .track-btn'
			);

		trackingButtons.forEach(
			button => {

				button.addEventListener(
					"click",
					event => {

						const href =
							button.getAttribute(
								"href"
							);

						if (
							!href ||
							href === "#"
						) {

							event.preventDefault();

							const message =
								currentLang === "hi"
									? "समस्या ट्रैकिंग सुविधा जल्द उपलब्ध होगी।"
									: "Issue tracking will be available soon.";

							showToast(
								message
							);

						}

					}
				);

			}
		);

	}


	/* =====================================================
	   FOOTER LINKS
	   ===================================================== */

	function setupFooterLinks() {

		const footerLinks =
			document.querySelectorAll(
				"footer a"
			);

		footerLinks.forEach(
			link => {

				link.addEventListener(
					"click",
					event => {

						const href =
							link.getAttribute(
								"href"
							);

						if (
							!href ||
							href === "#"
						) {

							event.preventDefault();

						}

					}
				);

			}
		);

	}

	/* =====================================================
	GLOBAL RESIZE HANDLER
	===================================================== */

	function setupGlobalResize() {

		let resizeTimer = null;


		window.addEventListener(
			"resize",
			() => {

				clearTimeout(
					resizeTimer
				);


				resizeTimer =
					setTimeout(
						() => {

							/*
							 * Keep mobile menu only on
							 * tablet/mobile widths.
							 */

							if (
								window.innerWidth > 1080
							) {

								closeMobileMenu();

							}

						},
						150
					);

			}
		);

	}


	/* =====================================================
	   SCROLL EFFECTS
	   ===================================================== */

	function setupScrollEffects() {

		const navbar =
			document.querySelector(
				".navbar"
			);

		if (!navbar) {

			return;

		}

		let lastScrollY =
			window.scrollY;


		window.addEventListener(
			"scroll",
			() => {

				const currentScrollY =
					window.scrollY;


				if (
					currentScrollY > 20
				) {

					navbar.classList.add(
						"scrolled"
					);

				}
				else {

					navbar.classList.remove(
						"scrolled"
					);

				}


				lastScrollY =
					currentScrollY;

			},
			{
				passive: true
			}
		);

	}


	/* =====================================================
	   INTERSECTION OBSERVER
	   ===================================================== */

	function setupRevealAnimations() {

		const elements =
			document.querySelectorAll(
				"[data-reveal]"
			);


		if (
			!elements.length
		) {

			return;

		}


		if (
			!("IntersectionObserver" in window)
		) {

			elements.forEach(
				element => {

					element.classList.add(
						"revealed"
					);

				}
			);

			return;

		}


		const observer =
			new IntersectionObserver(
				entries => {

					entries.forEach(
						entry => {

							if (
								entry.isIntersecting
							) {

								entry.target.classList.add(
									"revealed"
								);

								observer.unobserve(
									entry.target
								);

							}

						}
					);

				},
				{
					threshold: 0.15
				}
			);


		elements.forEach(
			element => {

				observer.observe(
					element
				);

			}
		);

	}


	/* =====================================================
	   IMAGE ERROR HANDLING
	   ===================================================== */

	function setupImageFallbacks() {

		const images =
			document.querySelectorAll(
				"img"
			);


		images.forEach(
			image => {

				image.addEventListener(
					"error",
					() => {

						image.classList.add(
							"image-error"
						);

					}
				);

			}
		);

	}


	/* =====================================================
	   FORM HANDLING
	   ===================================================== */

	function setupForms() {

		const forms =
			document.querySelectorAll(
				"form"
			);


		forms.forEach(
			form => {

				form.addEventListener(
					"submit",
					event => {

						/*
						 * Only prevent submission for forms
						 * explicitly marked as demo forms.
						 */

						if (
							form.dataset.demo === "true"
						) {

							event.preventDefault();


							const currentLang =
								localStorage.getItem(
									"civicbuzz-language"
								) || "en";


							const toast =
								document.getElementById(
									"toast"
								);


							if (toast) {

								toast.textContent =
									currentLang === "hi"
										? "आपकी जानकारी सफलतापूर्वक जमा कर दी गई है।"
										: "Your information has been submitted successfully.";


								toast.classList.add(
									"show"
								);


								setTimeout(
									() => {

										toast.classList.remove(
											"show"
										);

									},
									2500
								);

							}

						}

					}
				);

			}
		);

	}


	/* =====================================================
	   LOCAL STORAGE SAFETY
	   ===================================================== */

	function setupStorageSafety() {

		try {

			const language =
				localStorage.getItem(
					"civicbuzz-language"
				);


			if (
				language !== "en" &&
				language !== "hi"
			) {

				localStorage.setItem(
					"civicbuzz-language",
					"en"
				);

			}


			const theme =
				localStorage.getItem(
					"civicbuzz-theme"
				);


			if (
				theme !== "light" &&
				theme !== "dark"
			) {

				localStorage.setItem(
					"civicbuzz-theme",
					"light"
				);

			}

		}
		catch (error) {

			console.warn(
				"CivicBuzz localStorage is unavailable.",
				error
			);

		}

	}

	/* =====================================================
   INITIALIZE EXTRA FEATURES
   ===================================================== */

	initializeCivicBuzzExtras();

	setupAccessibility();

	setupNavigationHelpers();

	setupReportButtons();

	setupTrackingButtons();

	setupFooterLinks();

	setupGlobalResize();

	setupScrollEffects();

	setupRevealAnimations();

	setupImageFallbacks();

	setupForms();

	setupStorageSafety();


	/* =====================================================
	   GLOBAL CIVICBUZZ HELPERS
	   ===================================================== */

	window.CivicBuzz = {

		version: "1.0.0",


		getLanguage() {

			return (
				localStorage.getItem(
					"civicbuzz-language"
				) || "en"
			);

		},


		setLanguage(language) {

			if (
				language !== "en" &&
				language !== "hi"
			) {

				return;

			}


			localStorage.setItem(
				"civicbuzz-language",
				language
			);


			window.location.reload();

		},


		getTheme() {

			return (
				localStorage.getItem(
					"civicbuzz-theme"
				) || "light"
			);

		},


		setTheme(theme) {

			if (
				theme !== "light" &&
				theme !== "dark"
			) {

				return;

			}


			localStorage.setItem(
				"civicbuzz-theme",
				theme
			);


			document.body.classList.toggle(
				"dark-mode",
				theme === "dark"
			);

		}

	};


	/* =====================================================
	   FINAL READY MESSAGE
	   ===================================================== */

	console.log(
		"%cCivicBuzz loaded successfully.",
		"font-weight:bold;"
	);

});