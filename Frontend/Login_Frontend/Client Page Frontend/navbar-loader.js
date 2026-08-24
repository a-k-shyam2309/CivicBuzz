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
			path.endsWith("/Contact%20Us%20Frontend") ||
			path.includes("/Map_Frontend/") ||
			path.includes("/Map_Frontend") ||
			path.includes("/Map/") ||
			path.endsWith("/Map")
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
		} else if (path.includes("Map_Frontend") || path.includes("/Map/") || path.endsWith("/Map")) {
			activeNav = "map";
		} else if (window.location.hash === "#map" || window.location.hash === "#nearbyMap") {
			activeNav = "map";
		} else if (window.location.hash === "#help" || window.location.hash === "#faq" || window.location.hash === "#support") {
			activeNav = "needHelp";
		} else {
			activeNav = "home";
		}

		return { basePath, activeNav };
	}

	const env = detectEnvironment();

	/* -----------------------------------------------------
	   2. TRANSLATIONS (I18N) & FULL PAGE DICTIONARY
	   ----------------------------------------------------- */

	const translations = {
		tagline: { en: "Your Voice. Our Responsibility.", hi: "आपकी आवाज़। हमारी ज़िम्मेदारी।" },
		home: { en: "Home", hi: "होम" },
		reportIssue: { en: "Report Issue", hi: "समस्या दर्ज करें" },
		trackIssue: { en: "Track Issue", hi: "समस्या ट्रैक करें" },
		map: { en: "Map", hi: "मानचित्र" },
		tender: { en: "Tender", hi: "टेंडर" },
		contact: { en: "Contact Us", hi: "संपर्क करें" },
		needHelp: { en: "Need Help", hi: "मदद चाहिए?" },
		accountName: { en: "Aditya Kumar Shyam", hi: "आदित्य कुमार श्याम" },
		accountStatus: { en: "Citizen Account", hi: "नागरिक खाता" },
		myProfile: { en: "My Profile", hi: "मेरी प्रोफ़ाइल" },
		myReports: { en: "My Reports", hi: "मेरी रिपोर्ट्स" },
		darkMode: { en: "Dark Mode", hi: "डार्क मोड" },
		lightMode: { en: "Light Mode", hi: "लाइट मोड" },
		logout: { en: "Logout", hi: "लॉगआउट" },
		noNotifications: { en: "No new notifications.", hi: "अभी कोई नई सूचना नहीं है।" },
		profileComingSoon: { en: "Profile will be available soon.", hi: "प्रोफ़ाइल जल्द उपलब्ध होगी।" },
		reportsComingSoon: { en: "Your reports will be available soon.", hi: "आपकी रिपोर्ट्स जल्द उपलब्ध होंगी।" },
		loggedOutMsg: { en: "Logged out successfully.", hi: "सफलतापूर्वक लॉगआउट किया गया।" },
		darkModeEnabled: { en: "Dark mode enabled.", hi: "डार्क मोड चालू किया गया।" },
		lightModeEnabled: { en: "Light mode enabled.", hi: "लाइट मोड चालू किया गया।" },
		langChangedEn: { en: "Language changed to English.", hi: "Language changed to English." },
		langChangedHi: { en: "भाषा हिन्दी में बदल दी गई है।", hi: "भाषा हिन्दी में बदल दी गई है।" }
	};

	const pageDictionary = {
		// --- HERO SLIDER (HOME) ---
		"Together, let's build\n\t\t\t\t\t\ta better and cleaner city!": "आइए मिलकर बनाएं\n\t\t\t\t\t\tएक बेहतर और स्वच्छ शहर!",
		"Together, let's build": "आइए मिलकर बनाएं",
		"a better and cleaner city!": "एक बेहतर और स्वच्छ शहर!",
		"Report issues. Track progress.": "समस्याओं की रिपोर्ट करें। प्रगति ट्रैक करें।",
		"Make your city better.": "अपने शहर को बेहतर बनाएं।",
		"Report a Problem": "समस्या की रिपोर्ट करें",
		"See a problem?": "कोई समस्या दिखाई दी?",
		"Let your voice be heard.": "अपनी आवाज़ उठाएं।",
		"Report civic issues in just": "नागरिक समस्याओं की रिपोर्ट करें",
		"a few simple steps.": "कुछ आसान चरणों में।",
		"Your complaint": "आपकी शिकायत",
		"can make a difference.": "बदलाव ला सकती है।",
		"Track every update and": "हर अपडेट को ट्रैक करें और",
		"stay informed.": "जानकारी से जुड़े रहें।",
		"Track Your Complaint": "अपनी शिकायत ट्रैक करें",
		"Better cities start": "बेहतर शहरों की शुरुआत",
		"with responsible citizens.": "जिम्मेदार नागरिकों से होती है।",
		"Together we can create": "आइए मिलकर बनाएं",
		"cleaner and safer communities.": "स्वच्छ और सुरक्षित समुदाय।",
		"Your city,": "आपका शहर,",
		"your responsibility.": "आपकी ज़िम्मेदारी।",
		"Spot an issue?": "कोई समस्या दिखाई दी?",
		"Report it before it gets worse.": "बढ़ने से पहले उसकी रिपोर्ट करें।",
		"Stay updated": "हर अपडेट से जुड़े रहें",
		"on every complaint.": "अपनी हर शिकायत पर।",
		"Know what's happening": "जानें क्या हो रहा है",
		"after you report an issue.": "समस्या की रिपोर्ट करने के बाद।",
		"Small reports": "छोटी-सी रिपोर्ट",
		"create big changes.": "बड़ा बदलाव ला सकती है।",
		"One responsible citizen": "एक जिम्मेदार नागरिक",
		"can inspire an entire community.": "पूरे समुदाय को प्रेरित कर सकता है।",
		"Cleaner streets.": "स्वच्छ सड़कें।",
		"Safer communities.": "सुरक्षित समुदाय।",
		"Your reports help authorities": "आपकी रिपोर्ट अधिकारियों को",
		"identify problems faster.": "समस्याओं की पहचान जल्दी करने में मदद करती है।",
		"Together,": "मिलकर,",
		"we can make a difference.": "हम बदलाव ला सकते हैं।",
		"Be the voice of your community": "अपने समुदाय की आवाज़ बनें",
		"and help build a better city.": "और एक बेहतर शहर बनाने में मदद करें।",

		// --- DASHBOARD SUMMARY (HOME) ---
		"My Complaint Summary": "मेरी शिकायतों का सारांश",
		"View All": "सभी देखें",
		"Total Complaints": "कुल शिकायतें",
		"In Progress": "प्रगति पर",
		"Resolved": "हल किया गया",
		"Rejected": "अस्वीकृत",

		// --- RECENT COMPLAINTS TABLE (HOME) ---
		"My Recent Complaints": "मेरी हाल की शिकायतें",
		"Issue ID": "समस्या आईडी",
		"Problem": "समस्या",
		"Location": "स्थान",
		"Status": "स्थिति",
		"Date": "दिनांक",
		"Action": "कार्रवाई",
		"Road Pothole": "सड़क पर गड्ढा",
		"Street Light Not Working": "स्ट्रीट लाइट काम नहीं कर रही",
		"Garbage Not Collected": "कचरा एकत्र नहीं किया गया",
		"Garbage Overflow": "कचरा जमा होना",
		"Patia, Bhubaneswar": "पाटिया, भुवनेश्वर",
		"📍 Patia, Bhubaneswar": "📍 पाटिया, भुवनेश्वर",
		"Kalinga Vihar": "कलिंगा विहार",
		"📍 Kalinga Vihar": "📍 कलिंगा विहार",
		"Nayapalli": "नयापल्ली",
		"📍 Nayapalli": "📍 नयापल्ली",
		"Open": "खुला",
		"18 Aug 2026": "18 अगस्त 2026",
		"14 Aug 2026": "14 अगस्त 2026",
		"10 Aug 2026": "10 अगस्त 2026",
		"19 Aug 2026": "19 अगस्त 2026",

		// --- TRACK SEARCH (HOME) ---
		"Track Your Complaint": "अपनी शिकायत ट्रैक करें",
		"Enter your Issue ID to check current status": "वर्तमान स्थिति देखने के लिए अपनी समस्या आईडी दर्ज करें",
		"Enter Issue ID (e.g. CB-1024)": "समस्या आईडी दर्ज करें (जैसे CB-1024)",
		"🔍 Track Now": "🔍 अभी ट्रैक करें",
		"Track Now": "अभी ट्रैक करें",

		// --- NEARBY ISSUES (HOME) ---
		"Issues Around You": "आपके आसपास की समस्याएँ",
		"View on Map": "मानचित्र पर देखें",
		"150m away • Patia Main Road": "150 मीटर दूर • पाटिया मेन रोड",
		"300m away • Kalinga Vihar": "300 मीटर दूर • कलिंगा विहार",
		"500m away • Jayadev Vihar": "500 मीटर दूर • जयदेव विहार",

		// --- MODALS (HOME) ---
		"Report a Problem": "समस्या की रिपोर्ट करें",
		"Tell us about the civic issue you found.": "नागरिक समस्या के बारे में विवरण दें।",
		"Issue Category": "समस्या की श्रेणी",
		"Select Category": "श्रेणी चुनें",
		"Road & Pothole": "सड़क और गड्ढा",
		"Garbage": "कचरा",
		"Street Light": "स्ट्रीट लाइट",
		"Water Supply": "जल आपूर्ति",
		"Drainage": "जल निकासी",
		"Electricity": "बिजली",
		"Public Property": "सार्वजनिक संपत्ति",
		"Other": "अन्य",
		"Description": "विवरण",
		"Describe the problem...": "समस्या का विवरण दें...",
		"Add Photo": "तस्वीर जोड़ें",
		"Cancel": "रद्द करें",
		"Submit Issue": "समस्या सबमिट करें",
		"Complaint Details": "शिकायत विवरण",
		"Submitted": "दर्ज की गई",
		"Department": "विभाग",
		"Road Maintenance": "सड़क रखरखाव",
		"Complaint Reported": "शिकायत दर्ज हुई",
		"Complaint Verified": "शिकायत सत्यापित",
		"Department Assigned": "विभाग सौंपा गया",
		"Work In Progress": "कार्य प्रगति पर",
		"Pending": "लंबित",

		// --- FOOTER & QUICK LINKS ---
		"Making every civic issue visible,\nactionable and accountable.": "हर नागरिक समस्या को दृश्यमान,\nकार्रवाई योग्य और जवाबदेह बनाना।",
		"Making every civic issue visible,": "हर नागरिक समस्या को दृश्यमान,",
		"actionable and accountable.": "कार्रवाई योग्य और जवाबदेह बनाना।",
		"Empowering citizens to report problems\nand build better communities together.": "नागरिकों को सशक्त बनाना और\nमिलकर बेहतर समुदायों का निर्माण करना।",
		"Empowering citizens to report problems": "नागरिकों को सशक्त बनाना और",
		"and build better communities together.": "मिलकर बेहतर समुदायों का निर्माण करना।",
		"QUICK LINKS": "त्वरित लिंक",
		"Quick Links": "त्वरित लिंक",
		"Quick links": "त्वरित लिंक",
		"quick links": "त्वरित लिंक",
		"Home": "होम",
		"Report an Issue": "समस्या दर्ज करें",
		"Report An Issue": "समस्या दर्ज करें",
		"Report an issue": "समस्या दर्ज करें",
		"Track Complaint": "शिकायत ट्रैक करें",
		"Track complaint": "शिकायत ट्रैक करें",
		"Track Complaints": "शिकायतें ट्रैक करें",
		"Track complaints": "शिकायतें ट्रैक करें",
		"Tenders": "टेंडर",
		"Tender": "टेंडर",
		"tenders": "टेंडर",
		"Contact Us": "संपर्क करें",
		"Contact us": "संपर्क करें",
		"About CivicBuzz": "सिविकबज़ के बारे में",
		"Community": "समुदाय",
		"CIVIC SERVICES": "नागरिक सेवाएँ",
		"Civic Services": "नागरिक सेवाएँ",
		"Civic services": "नागरिक सेवाएँ",
		"Road & Potholes": "सड़क और गड्ढे",
		"Garbage & Sanitation": "कचरा और स्वच्छता",
		"Street Lights": "स्ट्रीट लाइट",
		"Water & Drainage": "पानी और जल निकासी",
		"Public Infrastructure": "सार्वजनिक बुनियादी ढाँचा",
		"NEED HELP?": "मदद चाहिए?",
		"Need Help?": "मदद चाहिए?",
		"Need help?": "मदद चाहिए?",
		"FAQs": "अक्सर पूछे जाने वाले प्रश्न",
		"How to Report": "रिपोर्ट कैसे करें",
		"How Tracking Works": "ट्रैकिंग कैसे काम करती है",
		"Contact Support": "सहायता से संपर्क करें",
		"Have a question?": "कोई सवाल है?",
		"Issues Reported": "रिपोर्ट की गई समस्याएँ",
		"Issues Resolved": "हल की गई समस्याएँ",
		"Active Citizens": "सक्रिय नागरिक",
		"Communities": "समुदाय",
		"Privacy Policy": "गोपनीयता नीति",
		"Terms & Conditions": "नियम और शर्तें",
		"Accessibility": "सुगम्यता",
		"GitHub": "GitHub",
		"LinkedIn": "LinkedIn",
		"© 2026 CivicBuzz. All rights reserved.": "© 2026 CivicBuzz. सर्वाधिकार सुरक्षित।",
		"Built with": "के साथ निर्मित",
		"for better communities.": "बेहतर समुदायों के लिए।",

		// --- REPORT ISSUE PAGE & AI TRIAGE ASSISTANT ---
		"Report a civic issue": "नागरिक समस्या दर्ज करें",
		"Report a Civic Grievance": "नागरिक समस्या दर्ज करें",
		"Evidence-Grounded Triage · Report · 04": "प्रमाण-आधारित विश्लेषण · रिपोर्ट · 04",
		"Submit with photo evidence, GPS location, and voice note. Gemini AI categorizes, eliminates duplicates, and routes to responsible ward units.": "फोटो प्रमाण, जीपीएस स्थान और वॉयस नोट के साथ सबमिट करें। जेमिनी एआई वर्गीकृत करता है, डुप्लिकेट हटाता है और संबंधित वार्ड इकाइयों को भेजता है।",
		"Quick-Fill Sample Grievances (Multilingual & Real-time AI Triage Demo):": "त्वरित नमूना शिकायतें (बहुभाषी और रीयल-टाइम AI डेमो):",
		"Click any sample to auto-fill & test live triage": "लाइव AI विश्लेषण का परीक्षण करने के लिए किसी भी नमूने पर क्लिक करें",
		"🛣️ Deep Pothole (Roads)": "🛣️ गहरा गड्ढा (सड़क खराबी)",
		"🗑️ Garbage Overflow (Sanitation)": "🗑️ कचरा फैलाव (स्वच्छता)",
		"💡 Dark Streetlight (Electrical)": "💡 बंद स्ट्रीट लाइट (बिजली)",
		"🚰 Water Pipe Burst (Water Supply)": "🚰 पानी पाइप फटना (जल आपूर्ति)",
		"🌐 Regional Language (Hindi Demo)": "🌐 क्षेत्रीय भाषा (हिन्दी डेमो)",
		"Issue Details & Evidence": "समस्या विवरण और प्रमाण",
		"Multilingual text, photo evidence, map coordinates, and voice note": "बहुभाषी टेक्स्ट, फोटो प्रमाण, मानचित्र निर्देशांक और वॉयस नोट",
		"Describe the Issue": "समस्या का विवरण दें",
		"AI listening to input...": "AI इनपुट सुन रहा है...",
		"Geo-Pinpoint Location & Ward": "जीपीएस स्थान और वार्ड",
		"Current GPS": "वर्तमान जीपीएस",
		"Photo Evidence": "फोटो प्रमाण",
		"Drop image or click to browse": "तस्वीर छोड़ें या ब्राउज़ करें",
		"JPEG, PNG · AI Defect Audit": "JPEG, PNG · AI दोष ऑडिट",
		"Voice Grievance": "वॉयस शिकायत",
		"Tap to record voice note": "वॉयस नोट रिकॉर्ड करने के लिए टैप करें",
		"Multilingual Speech-to-Text": "बहुभाषी वाक-से-पाठ",
		"Protect My Identity (Anonymous Ledger)": "मेरी पहचान सुरक्षित रखें (गुमनाम खाता)",
		"Complainant contact info & name will be redacted from the public transparency feed.": "शिकायतकर्ता की संपर्क जानकारी और नाम सार्वजनिक फीड से छिपा दिया जाएगा।",
		"Run AI Triage & Submit Grievance": "AI विश्लेषण चलाएं और शिकायत दर्ज करें",
		"AI Grievance Triage Assistant": "AI शिकायत निवारण व सहायता",
		"Real-time Multilingual & Evidence Grounding": "रीयल-टाइम बहुभाषी और प्रमाण सत्यापन",
		"Gemini 2.5 Active": "जेमिनी 2.5 सक्रिय",
		"Language & Canonical Triage Summary": "भाषा और प्रामाणिक सारांश",
		"Proximity Radar · Duplicate Check": "समीपस्थ रडार · डुप्लिकेट जाँच",
		"Keep as Distinct Issue": "अलग समस्या के रूप में रखें",
		"Evidence Grounding & Authenticity Audit": "प्रमाण और प्रामाणिकता ऑडिट",
		"Visual Verification Confidence": "दृश्य सत्यापन विश्वास",
		"Department Routing & Municipal SLA": "विभाग आवंटन और नगरपालिका SLA",
		"Target Department": "लक्षित विभाग",
		"Calculated Urgency Score": "गणना किया गया तात्कालिकता स्कोर",
		"Dynamic risk & traffic weighted": "गतिशील जोखिम और यातायात भारित",
		"Guaranteed Municipal SLA:": "गारंटीकृत नगरपालिका SLA:",
		"Participatory Budgeting Hotspot": "भागीदारी बजट (PB) हॉटस्पॉट",
		"Cluster Pattern": "क्लस्टर पैटर्न",
		"View Ward 12 Public Works & Budget Proposals": "वार्ड 12 के सार्वजनिक कार्य और बजट प्रस्ताव देखें",
		"Citizen Identity Shield: Active": "नागरिक पहचान सुरक्षा: सक्रिय",
		"Grievance Triaged & Registered!": "शिकायत विश्लेषित और पंजीकृत!",
		"Track Complaint in Real-time": "वास्तविक समय में शिकायत ट्रैक करें",
		"Submit Another Issue": "अन्य समस्या दर्ज करें",
		"AI triage assistant": "AI सहायता",
		"Live read as you type": "टाइप करते ही लाइव विश्लेषण",

		// --- TRACK COMPLAINTS PAGE ---
		"Track your complaints": "अपनी शिकायतें ट्रैक करें",
		"Your submissions": "आपके सबमिशन",
		"See where each report stands, sorted from most to least urgent.": "देखें कि प्रत्येक रिपोर्ट किस स्थिति में है।",
		"Complaints": "शिकायतें",
		"Priority overview": "प्राथमिकता अवलोकन",
		"Map overview": "मानचित्र अवलोकन",
		"All": "सभी",
		"High": "उच्च",
		"Medium": "मध्यम",
		"Low": "निम्न",
		"High priority": "उच्च प्राथमिकता",
		"Medium priority": "मध्यम प्राथमिकता",
		"Low priority": "निम्न प्राथमिकता",
		"Road · pothole": "सड़क · गड्ढा",
		"Water · leak": "पानी · रिसाव",
		"Streetlight · dark": "स्ट्रीटलाइट · बंद",
		"Garbage · dump": "कचरा · डंप",
		"Drainage · blocked": "जल निकासी · अवरुद्ध",
		"Large pothole near college gate": "कॉलेज गेट के पास बड़ा गड्ढा",
		"Broken pipe flooding sidewalk": "टूटी पाइप से फुटपाथ पर पानी",
		"Reported": "दर्ज की गई",
		"Acknowledged": "स्वीकृत",
		"View timeline": "समयरेखा देखें",

		// --- TENDERS PAGE ---
		"CIVIC ACTION": "नागरिक कार्रवाई",
		"Government Tenders": "सरकारी टेंडर",
		"Turn verified civic issues into actionable projects for the community and private contractors.": "सत्यापित नागरिक समस्याओं को समुदाय और ठेकेदारों के लिए कार्ययोग्य परियोजनाओं में बदलें।",
		"Open tenders": "सक्रिय टेंडर",
		"Total value": "कुल मूल्य",
		"FOR COMPANIES": "कंपनियों के लिए",
		"Open government tenders": "सक्रिय सरकारी टेंडर",
		"Browse projects created from verified civic issues.": "सत्यापित नागरिक समस्याओं से बनी परियोजनाओं को देखें।",
		"Roads": "सड़कें",
		"Drainage": "जल निकासी",
		"Lighting": "स्ट्रीट लाइट",
		"Sanitation": "स्वच्छता",
		"Closing in 3 days": "3 दिनों में बंद होगा",
		"Closing in 7 days": "7 दिनों में बंद होगा",
		"Closing in 10 days": "10 दिनों में बंद होगा",
		"Closing in 12 days": "12 दिनों में बंद होगा",
		"Closing in 1 days": "1 दिन में बंद होगा",
		"Closing today": "आज बंद हो रहा है",
		"Priority road patching — Ward 15": "प्राथमिकता सड़क मरम्मत — वार्ड 15",
		"Repair the most-reported pothole locations across Ward 15.": "वार्ड 15 में सबसे अधिक रिपोर्ट किए गए गड्ढों की मरम्मत।",
		"📍 Ward 15": "📍 वार्ड 15",
		"📍 Ward 12": "📍 वार्ड 12",
		"📍 Ward 8": "📍 वार्ड 8",
		"📍 Ward 9": "📍 वार्ड 9",
		"📍 Ward 4": "📍 वार्ड 4",
		"Ward 15": "वार्ड 15",
		"Ward 12": "वार्ड 12",
		"Ward 8": "वार्ड 8",
		"Ward 9": "वार्ड 9",
		"Ward 4": "वार्ड 4",
		"✓ 3 verified locations": "✓ 3 सत्यापित स्थान",
		"✓ 4 verified locations": "✓ 4 सत्यापित स्थान",
		"✓ 2 verified locations": "✓ 2 सत्यापित स्थान",
		"✓ 5 verified locations": "✓ 5 सत्यापित स्थान",
		"✓ Newly added": "✓ हाल ही में जोड़ा गया",
		"3 verified locations": "3 सत्यापित स्थान",
		"4 verified locations": "4 सत्यापित स्थान",
		"2 verified locations": "2 सत्यापित स्थान",
		"5 verified locations": "5 सत्यापित स्थान",
		"Newly added": "हाल ही में जोड़ा गया",
		"Estimated value": "अनुमानित मूल्य",
		"Duration": "अवधि",
		"30 days": "30 दिन",
		"45 days": "45 दिन",
		"20 days": "20 दिन",
		"Community votes": "सामुदायिक वोट",
		"View Tender": "टेंडर देखें",
		"Drainage improvement — School Road": "जल निकासी सुधार — स्कूल रोड",
		"Clear blocked drains and improve two drainage segments near the primary school.": "स्कूल के पास बंद नालियों की सफाई और जल निकासी में सुधार।",
		"Install 20 LED streetlights": "20 एलईडी स्ट्रीट लाइट लगाएं",
		"Add or replace streetlights around the market and school corridors.": "बाजार और स्कूल के पास स्ट्रीट लाइट लगाएं या बदलें।",
		"Market sanitation upgrade": "बाजार स्वच्छता उन्नयन",
		"Improve waste collection points and sanitation facilities near the market.": "बाजार के पास कचरा संग्रहण और स्वच्छता सुविधाओं में सुधार।",
		"FOR CITIZENS": "नागरिकों के लिए",
		"Community priorities": "सामुदायिक प्राथमिकताएं",
		"Vote for the civic proposals that matter most to your neighbourhood.": "अपने क्षेत्र के लिए सबसे महत्वपूर्ण नागरिक प्रस्तावों पर वोट करें।",
		"One vote per proposal": "प्रति प्रस्ताव एक वोट",
		"#1 Priority": "#1 प्राथमिकता",
		"#2 Priority": "#2 प्राथमिकता",
		"#3 Priority": "#3 प्राथमिकता",
		"Drainage improvement on School Road": "स्कूल रोड पर जल निकासी सुधार",
		"Priority road patching": "प्राथमिकता सड़क मरम्मत",
		"Ward 12 · ₹4,00,000": "वार्ड 12 · ₹4,00,000",
		"Ward 8 · ₹3,00,000": "वार्ड 8 · ₹3,00,000",
		"Ward 15 · ₹2,50,000": "वार्ड 15 · ₹2,50,000",
		"Vote for this proposal": "इस प्रस्ताव के लिए वोट करें",
		"Voted": "वोट दिया गया",
		"49 votes": "49 वोट",
		"33 votes": "33 वोट",
		"21 votes": "21 वोट",
		"18 votes": "18 वोट",
		"0 votes": "0 वोट",
		"48% of votes": "48% वोट",
		"32% of votes": "32% वोट",
		"20% of votes": "20% वोट",
		"Community votes help highlight priorities. Final tender selection remains subject to the official procurement process.": "सामुदायिक वोट प्राथमिकताओं को उजागर करने में मदद करते हैं। अंतिम चयन आधिकारिक प्रक्रिया के अधीन है।",
		"TENDER DETAILS": "टेंडर विवरण",
		"Tender ID": "टेंडर आईडी",
		"Application deadline": "आवेदन की अंतिम तिथि",
		"24 Aug 2026": "24 अगस्त 2026",
		"Community priority": "सामुदायिक प्राथमिकता",
		"#3 · 21 votes": "#3 · 21 वोट",
		"CIVICBUZZ FLOW": "CIVICBUZZ प्रवाह",
		"Tender progress": "टेंडर प्रगति",
		"Reported": "दर्ज की गई",
		"Acknowledged": "स्वीकृत",
		"In Progress": "प्रगति पर",
		"Resolved": "हल किया गया",
		"Completed": "पूर्ण",
		"Continue to official procurement": "आधिकारिक खरीद प्रक्रिया जारी रखें",
		"Add tenders": "टेंडर जोड़ें",
		"Add a tender": "एक टेंडर जोड़ें",
		"NEW PROCUREMENT": "नई खरीद",
		"Create a new project for companies to review.": "कंपनियों की समीक्षा के लिए एक नया प्रोजेक्ट बनाएं।",
		"Tender title": "टेंडर शीर्षक",
		"Description": "विवरण",
		"Category": "श्रेणी",
		"e.g. Footpath repair — Ward 4": "उदा. फुटपाथ मरम्मत — वार्ड 4",
		"Briefly describe the scope of work": "कार्य के दायरे का संक्षेप में विवरण दें",
		"Location / ward": "स्थान / वार्ड",
		"e.g. Ward 4": "उदा. वार्ड 4",
		"Estimated value (₹)": "अनुमानित मूल्य (₹)",
		"Duration (days)": "अवधि (दिन)",
		"Cancel": "रद्द करें",
		"Add tender": "टेंडर जोड़ें",

		// --- CONTACT US PAGE ---
		"CIVICBUZZ": "CIVICBUZZ",
		"Contact Us": "संपर्क करें",
		"Have a question, suggestion, or need help with CivicBuzz? Send us a message and our team will get back to you.": "क्या आपका कोई प्रश्न, सुझाव है या मदद चाहिए? हमें संदेश भेजें, हमारी टीम आपसे संपर्क करेगी।",
		"Have a question, suggestion, or need help with CivicBuzz?": "क्या आपका कोई प्रश्न, सुझाव है या मदद चाहिए?",
		"Send us a message and our team will get back to you.": "हमें संदेश भेजें, हमारी टीम आपसे संपर्क करेगी।",
		"Email": "ईमेल",
		"Phone": "फ़ोन",
		"Location": "स्थान",
		"India": "भारत",
		"CivicBuzz Team": "CivicBuzz टीम",
		"Working together for better communities.": "बेहतर समुदायों के लिए मिलकर काम कर रहे हैं।",
		"Name": "नाम",
		"Your name": "आपका नाम",
		"Subject": "विषय",
		"Select a subject": "विषय चुनें",
		"General Query": "सामान्य प्रश्न",
		"Civic Issue": "नागरिक समस्या",
		"Feedback": "प्रतिक्रिया",
		"Technical Support": "तकनीकी सहायता",
		"Partnership": "साझेदारी",
		"Message": "संदेश",
		"Write your message...": "अपना संदेश लिखें...",
		"Send Message": "संदेश भेजें",
		"Our Office": "हमारा कार्यालय",
		"Phone Number": "फ़ोन नंबर",
		"Email Address": "ईमेल पता",
		"Working Hours": "काम के घंटे",

		// --- MAP DASHBOARD PAGE ---
		"CIVIC GEOLOCATION & HOTSPOTS": "नागरिक भू-स्थान और हॉटस्पॉट",
		"Bhubaneswar Live Civic Map": "भुवनेश्वर लाइव नागरिक मानचित्र",
		"Interactive geographic dashboard of reported civic issues, real-time hotspot clusters, and ward resolution progress across Bhubaneswar.": "भुवनेश्वर भर में दर्ज नागरिक समस्याओं, लाइव हॉटस्पॉट और वार्ड समाधान प्रगति का इंटरैक्टिव भौगोलिक डैशबोर्ड।",
		"Report Issue Here": "यहाँ समस्या दर्ज करें",
		"Locate Me": "मेरा स्थान",
		"Reset View": "व्यू रीसेट करें",
		"Active Hotspots": "सक्रिय हॉटस्पॉट",
		"Critical Attention": "अति गंभीर समस्याएं",
		"In Progress": "कार्य प्रगति पर",
		"Resolved (7 Days)": "हल की गई (7 दिन)",
		"Search issues, landmarks, wards...": "समस्याएं, स्थल, वार्ड खोजें...",
		"Category Filter": "श्रेणी फ़िल्टर",
		"All Categories": "सभी श्रेणियां",
		"Roads & Potholes": "सड़कें और गड्ढे",
		"Street Lighting": "स्ट्रीट लाइट",
		"Waste & Sanitation": "कचरा और स्वच्छता",
		"Water & Drainage": "पानी और जल निकासी",
		"Parks & Trees": "पार्क और वृक्ष",
		"Encroachment": "अतिक्रमण और ढांचा",
		"Ward Filter": "वार्ड फ़िल्टर",
		"All Bhubaneswar Wards": "भुवनेश्वर के सभी वार्ड",
		"Status Filter": "स्थिति फ़िल्टर",
		"All Statuses": "सभी स्थितियां",
		"Reported": "दर्ज किया गया",
		"Resolved": "समाधान हो गया",
		"Priority": "प्राथमिकता",
		"All Priorities": "सभी प्राथमिकताएं",
		"Critical": "अति गंभीर",
		"High": "उच्च",
		"Medium": "मध्यम",
		"Low": "सामान्य",
		"Live Grievance Feed": "लाइव शिकायत फ़ीड",
		"Click on any marker or card to inspect details": "विवरण देखने के लिए किसी भी पिन या कार्ड पर क्लिक करें",
		"Issue Details": "समस्या विवरण",
		"Responsible Department": "जिम्मेदार विभाग",
		"Community Support": "समुदायिक समर्थन",
		"Upvote Issue": "समर्थन दें (Upvote)",
		"Upvoted": "समर्थन दिया गया",
		"Get Directions": "दिशा-निर्देश प्राप्त करें",
		"Share Grievance": "शिकायत साझा करें",
		"Quick Report at this Spot": "इस स्थान पर त्वरित रिपोर्ट",
		"Satellite View": "सैटेलाइट व्यू",
		"Street View": "स्ट्रीट व्यू",
		"Dark Matter": "डार्क व्यू",
		"Ward Boundaries": "वार्ड सीमाएं",
		"Heatmap Density": "हॉटस्पॉट डेंसिटी"
	};

	const originalTextMap = new WeakMap();

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

		<a href="${basePath}Map_Frontend/index.html" class="nav-link ${activeNav === "map" ? "active" : ""}" data-nav="map">
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
				link.classList.remove("active");
				const navKey = link.dataset.nav;
				const href = link.getAttribute("href") || "";
				if (
					(navKey && navKey === env.activeNav) ||
					(env.activeNav === "reportIssue" && href.includes("Report_Issue_Frontend")) ||
					(env.activeNav === "trackIssue" && href.includes("Track_complaints_Frontend")) ||
					(env.activeNav === "tender" && href.includes("Tenders")) ||
					(env.activeNav === "contact" && href.includes("Contact")) ||
					(env.activeNav === "home" && (navKey === "home" || href === "#home" || href === "./index.html#home" || href === "../index.html#home" || href === "index.html#home"))
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

		/* --- Full DOM Translation Engine --- */
		function translateEntireDOM(lang) {
			// 1. Text nodes across the entire body
			const walker = document.createTreeWalker(
				document.body,
				NodeFilter.SHOW_TEXT,
				{
					acceptNode: function (node) {
						const parent = node.parentElement;
						if (!parent) return NodeFilter.FILTER_REJECT;
						if (parent.closest("script") || parent.closest("style")) return NodeFilter.FILTER_REJECT;
						if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
						return NodeFilter.FILTER_ACCEPT;
					}
				}
			);

			const textNodes = [];
			let node;
			while ((node = walker.nextNode())) {
				textNodes.push(node);
			}

			textNodes.forEach((textNode) => {
				if (!originalTextMap.has(textNode)) {
					originalTextMap.set(textNode, textNode.nodeValue);
				}

				const original = originalTextMap.get(textNode);
				const leading = original.match(/^\s*/)?.[0] || "";
				const trailing = original.match(/\s*$/)?.[0] || "";
				const clean = original.replace(/\s+/g, " ").trim();

				if (lang === "hi") {
					if (pageDictionary[clean]) {
						textNode.nodeValue = leading + pageDictionary[clean] + trailing;
					}
				} else {
					textNode.nodeValue = original;
				}
			});

			// 2. Input placeholders
			document.querySelectorAll("[placeholder]").forEach((input) => {
				if (!input.hasAttribute("data-orig-placeholder")) {
					input.setAttribute("data-orig-placeholder", input.getAttribute("placeholder"));
				}
				const orig = (input.getAttribute("data-orig-placeholder") || "").replace(/\s+/g, " ").trim();
				if (lang === "hi" && pageDictionary[orig]) {
					input.setAttribute("placeholder", pageDictionary[orig]);
				} else if (lang !== "hi") {
					input.setAttribute("placeholder", input.getAttribute("data-orig-placeholder"));
				}
			});

			// 3. Select options
			document.querySelectorAll("select option").forEach((opt) => {
				if (!opt.hasAttribute("data-orig-text")) {
					opt.setAttribute("data-orig-text", opt.textContent);
				}
				const orig = (opt.getAttribute("data-orig-text") || "").replace(/\s+/g, " ").trim();
				if (lang === "hi" && pageDictionary[orig]) {
					opt.textContent = pageDictionary[orig];
				} else if (lang !== "hi") {
					opt.textContent = opt.getAttribute("data-orig-text");
				}
			});

			// 4. Elements with data-i18n
			document.querySelectorAll("[data-i18n]").forEach((el) => {
				const key = el.dataset.i18n;
				if (translations[key] && translations[key][lang]) {
					el.textContent = translations[key][lang];
				}
			});
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

			// Run full DOM translation
			translateEntireDOM(lang);

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

		// Sync Logged In User Profile
		try {
			const savedUser = JSON.parse(localStorage.getItem("civicbuzz_user") || "null");
			if (savedUser && savedUser.full_name) {
				const initials = savedUser.full_name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
				if (profileBtn) profileBtn.textContent = initials;
				const avatarLarge = navbar.querySelector(".profile-avatar-large");
				if (avatarLarge) avatarLarge.textContent = initials;
				const nameEl = navbar.querySelector('[data-i18n="accountName"]');
				if (nameEl) nameEl.textContent = savedUser.full_name;
			}
		} catch (_) {}

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
						if (window.CivicBuzzAPI) {
							window.CivicBuzzAPI.auth.logout();
						}
						localStorage.removeItem("civicbuzz_token");
						localStorage.removeItem("civicbuzz_user");
						showToast(translations.loggedOutMsg[currentLang]);
						setTimeout(() => {
							window.location.href = `${env.basePath}../index.html`;
						}, 300);
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

		// Active link switching on click
		function setActiveNavLink(targetNavKey) {
			if (!targetNavKey) return;
			navbar.querySelectorAll(".nav-link").forEach((l) => {
				l.classList.toggle("active", l.dataset.nav === targetNavKey);
			});
		}

		navbar.querySelectorAll(".nav-link").forEach((link) => {
			link.addEventListener("click", () => {
				closeMobileMenu();
				const targetKey = link.dataset.nav;
				if (targetKey) {
					setActiveNavLink(targetKey);
				}
			});
		});

		// Listen for URL hash changes on in-page navigation (Home, Map, Need Help)
		window.addEventListener("hashchange", () => {
			const hash = window.location.hash;
			const isHomePage = !window.location.pathname.includes("Report_Issue_Frontend") &&
				!window.location.pathname.includes("Track_complaints_Frontend") &&
				!window.location.pathname.includes("Tenders") &&
				!window.location.pathname.includes("Contact");

			if (isHomePage) {
				if (hash === "#help" || hash === "#faq" || hash === "#support") {
					setActiveNavLink("needHelp");
				} else if (hash === "#nearbyMap" || hash === "#map") {
					setActiveNavLink("map");
				} else if (hash === "#home" || !hash) {
					setActiveNavLink("home");
				}
			}
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
