/* CivicBuzz Admin Portal - live synchronized grievance management and real dynamic metrics. */

const userId = "USR10245";
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

let toastTimer;

const translations = {
  // Global / Sidebar / Topbar
  "Admin Portal": "एडमिन पोर्टल",
  Dashboard: "डैशबोर्ड",
  "Issue Queue": "समस्या सूची",
  "Track Issues": "समस्याएं ट्रैक करें",
  "Map & Hotspots": "मानचित्र और हॉटस्पॉट",
  Departments: "विभाग",
  Budgeting: "बजट",
  Analytics: "विश्लेषण",
  Settings: "सेटिंग्स",
  "Super Admin": "सुपर एडमिन",
  "Aditya Kumar Shyam": "आदित्य कुमार श्याम",
  "ADMIN-001": "एडमिन-001",
  "Dark Mode": "डार्क मोड",
  "Light Mode": "लाइट मोड",
  Logout: "लॉगआउट",
  "My Profile": "मेरी प्रोफाइल",
  "My Reports": "मेरी रिपोर्ट",
  "Budgeting & Tenders": "बजट और निविदाएं",
  "Administrator Profile": "व्यवस्थापक प्रोफाइल",
  "Admin ID": "एडमिन आईडी",
  "Account Status": "खाता स्थिति",
  "Active & Verified ✓": "सक्रिय और सत्यापित ✓",
  Jurisdiction: "कार्यक्षेत्र",
  "Access Level": "पहुँच स्तर",
  "Tier-1 Super Admin (Full Read/Write)": "टियर-1 सुपर एडमिन (पूर्ण अधिकार)",
  Close: "बंद करें",

  // Dashboard Overview
  "TUESDAY, 18 AUGUST 2026": "मंगलवार, 18 अगस्त 2026",
  "Good morning, Admin": "सुप्रभात, एडमिन",
  "Here is what is happening across your city today.": "आज आपके शहर में क्या हो रहा है, यहाँ देखें।",
  "Create issue": "समस्या बनाएं",
  "Issues Reported": "रिपोर्ट की गई समस्याएं",
  "Issues Resolved": "हल की गई समस्याएं",
  "Open Issues": "खुली समस्याएं",
  Overdue: "विलंबित",
  "vs last month": "पिछले महीने की तुलना में",
  "Reported vs Resolved Trend": "रिपोर्ट और समाधान का रुझान",
  Reported: "रिपोर्ट की गई",
  Resolved: "हल की गई",
  "Last 7 days": "पिछले 7 दिन",
  "Last 30 days": "पिछले 30 दिन",
  "This quarter": "यह तिमाही",
  "Priority Alerts": "प्राथमिकता अलर्ट",
  "View all": "सभी देखें",
  "Pothole on MG Road": "एमजी रोड पर गड्ढा",
  "Near Metro Station, MG Road": "मेट्रो स्टेशन के पास, एमजी रोड",
  "2h ago": "2 घंटे पहले",
  "Garbage Overflow": "कचरा भरा हुआ",
  "Sector 15, Nehru Park": "सेक्टर 15, नेहरू पार्क",
  "4h ago": "4 घंटे पहले",
  "Water Leakage": "पानी का रिसाव",
  "Block A, Green View Apartments": "ब्लॉक A, ग्रीन व्यू अपार्टमेंट",
  High: "उच्च",
  "6h ago": "6 घंटे पहले",
  "View priority queue": "प्राथमिकता सूची देखें",
  "Live Issue Map": "लाइव समस्या मानचित्र",
  "View full map ↗": "पूरा मानचित्र देखें ↗",
  Indiranagar: "इंदिरानगर",
  Koramangala: "कोरमंगला",
  "HSR Layout": "एचएसआर लेआउट",
  Urgent: "तत्काल",
  Open: "खुली",
  "AI Routing Queue": "एआई रूटिंग सूची",
  "Reports awaiting department assignment": "विभाग आवंटन की प्रतीक्षा कर रही रिपोर्टें",
  Issue: "समस्या",
  "Duplicate match": "डुप्लिकेट मिलान",
  "Suggested department": "सुझाया गया विभाग",
  "Pothole on 5th Main St": "5वीं मेन स्ट्रीट पर गड्ढा",
  "Roads & Potholes": "सड़कें और गड्ढे",
  "Garbage not collected": "कचरा एकत्र नहीं किया गया",
  "Garbage & Sanitation": "कचरा और स्वच्छता",
  "Street light not working": "स्ट्रीट लाइट काम नहीं कर रही",
  "Street Lights": "स्ट्रीट लाइटें",
  "Resolution Rate": "समाधान दर",
  "8,240 resolved": "8,240 हल किए गए",
  "2,335 pending": "2,335 लंबित",
  "Recent Activity": "हाल की गतिविधि",
  "Latest updates from your departments": "आपके विभागों से नवीनतम अपडेट",
  "Issue #CB-12480 resolved": "समस्या #CB-12480 हल हो गई",
  "By Roads & Potholes Department": "सड़क और गड्ढे विभाग द्वारा",
  "New issue #CB-12481 reported": "नई समस्या #CB-12481 रिपोर्ट की गई",
  "Water leakage in Sector 9": "सेक्टर 9 में पानी का रिसाव",
  "Department assigned #CB-12482": "विभाग आवंटित #CB-12482",
  "Public comment on #CB-12479": "#CB-12479 पर सार्वजनिक टिप्पणी",
  "Additional details added": "अतिरिक्त विवरण जोड़ा गया",
  "10m ago": "10 मिनट पहले",
  "25m ago": "25 मिनट पहले",
  "35m ago": "35 मिनट पहले",
  "1h ago": "1 घंटे पहले",

  // Issue Queue & Triage Section
  "ADMIN • ISSUE QUEUE": "एडमिन • समस्या सूची",
  "Track & Triage Issues": "समस्याएं ट्रैक और प्रबंधित करें",
  "View, filter, triage, and manage citizen reported issues in real-time.": "नागरिकों द्वारा रिपोर्ट की गई समस्याओं को वास्तविक समय में देखें, फ़िल्टर करें और प्रबंधित करें।",
  "Total Issues": "कुल समस्याएं",
  "All reported issues": "सभी रिपोर्ट की गई समस्याएं",
  "Pending": "लंबित",
  "Awaiting action": "कार्रवाई की प्रतीक्षा में",
  "In Progress": "प्रगति पर",
  "Under work": "कार्य जारी",
  "Resolved": "हल की गई",
  "Awaiting verification": "सत्यापन की प्रतीक्षा में",
  "High Priority": "उच्च प्राथमिकता",
  "Requires attention": "ध्यान देने योग्य",
  "Status": "स्थिति",
  "All Status": "सभी स्थितियां",
  "All Statuses": "सभी स्थितियां",
  "Verified": "सत्यापित",
  "Rejected": "अस्वीकृत",
  "Priority": "प्राथमिकता",
  "All Priority": "सभी प्राथमिकताएं",
  "All Priorities": "सभी प्राथमिकताएं",
  "Critical": "गंभीर",
  "Medium": "मध्यम",
  "Low": "कम",
  "Category": "श्रेणी",
  "All Category": "सभी श्रेणियां",
  "All Categories": "सभी श्रेणियां",
  "Road": "सड़क",
  "Electricity": "बिजली",
  "Water": "पानी",
  "Garbage": "कचरा",
  "Drainage": "जल निकासी",
  "Date": "तिथि",
  "All Time": "सभी समय",
  "Today": "आज",
  "This Week": "इस सप्ताह",
  "This Month": "इस महीने",
  "Issue ID": "समस्या आईडी",
  "User ID": "यूज़र आईडी",
  "Action": "कार्रवाई",
  "Street Light Not Working": "स्ट्रीट लाइट काम नहीं कर रही",
  "Garbage Not Collected": "कचरा नहीं उठाया गया",
  "Water Pipeline Leakage": "पानी की पाइपलाइन लीकेज",
  "Dangerous Pothole on Flyover": "फ्लाईओवर पर खतरनाक गड्ढा",
  "18 Aug 2026": "18 अगस्त 2026",
  "17 Aug 2026": "17 अगस्त 2026",
  "16 Aug 2026": "16 अगस्त 2026",
  "15 Aug 2026": "15 अगस्त 2026",

  // Issue Details Slide-out Panel
  "Citizen Issue Details": "नागरिक समस्या विवरण",
  "Reported By": "रिपोर्टकर्ता",
  "Location": "स्थान",
  "Sector 4, Main Market": "सेक्टर 4, मुख्य बाजार",
  "Assigned Department": "आवंटित विभाग",
  "Street Lighting & Electricity": "स्ट्रीट लाइटिंग और बिजली",
  "Description": "विवरण",
  "Street light has been flickering and completely off for the last 3 days causing safety concerns near the junction.": "स्ट्रीट लाइट पिछले 3 दिनों से झिलमिला रही है और पूरी तरह बंद है जिससे चौराहे के पास सुरक्षा संबंधी चिंताएं बढ़ गई हैं।",
  "Citizen Verification Status": "नागरिक सत्यापन स्थिति",
  "Attached Image / Media Evidence": "संलग्न फोटो / मीडिया साक्ष्य",
  "Image not uploaded": "फोटो अपलोड नहीं की गई",
  "No visual media was attached by the citizen with this complaint.": "इस शिकायत के लिए नागरिक द्वारा कोई फोटो संलग्न नहीं की गई है।",
  "Original Reporter": "मूल रिपोर्टकर्ता",
  "Nearby Citizen 1": "निकटवर्ती नागरिक 1",
  "Nearby Citizen 2": "निकटवर्ती नागरिक 2",
  "Assign": "आवंटित करें",
  "Reject": "अस्वीकार करें",
  "Mark Resolved": "हल के रूप में चिह्नित करें",

  // Departments Section
  "ADMIN • DEPARTMENTS": "एडमिन • विभाग",
  "Department Directory": "विभाग निर्देशिका",
  "Government departments responsible for resolving reported civic grievances.": "रिपोर्ट की गई नागरिक समस्याओं के समाधान के लिए जिम्मेदार सरकारी विभाग।",
  "+ Add Department": "+ विभाग जोड़ें",
  "Total Departments": "कुल विभाग",
  "Registered in system": "सिस्टम में पंजीकृत",
  "Active Departments": "सक्रिय विभाग",
  "Taking assignments": "कार्यभार ले रहे हैं",
  "Municipal Field Staff": "नगरपालिका फील्ड स्टाफ",
  "Engineers & field crew": "इंजीनियर और फील्ड कर्मी",
  "Open Issues Assigned": "आवंटित खुली समस्याएं",
  "Across all wards": "सभी वार्डों में",
  "Avg. Resolution Time": "औसत समाधान समय",
  "Department Workload & Contacts": "विभाग कार्यभार और संपर्क",
  "Active": "सक्रिय",
  "Understaffed": "कर्मचारियों की कमी",
  "Standby": "रिजर्व / स्टैंडबाय",
  "Add Department": "विभाग जोड़ें",
  "Edit Department": "विभाग संपादित करें",
  "Department Name": "विभाग का नाम",
  "Category Code / Key": "श्रेणी कोड",
  "Icon / Emoji": "आइकन",
  "Operational Status": "परिचालन स्थिति",
  "Department Head": "विभाग प्रमुख",
  "Designation": "पद / पदनाम",
  "Official Email": "आधिकारिक ईमेल",
  "Contact Phone": "संपर्क फोन",
  "Field Staff Count": "फील्ड स्टाफ संख्या",
  "SLA Target (Hours)": "एसएलए लक्ष्य (घंटे)",
  "Allocated Budget": "आवंटित बजट",
  "Ward Coverage": "वार्ड कवरेज क्षेत्राधिकार",
  "Responsibility / Scope": "दायरा और जिम्मेदारियां",
  "Save Department": "विभाग सहेजें",
  "Cancel": "रद्द करें",
  "No matching departments found": "कोई मेल खाता विभाग नहीं मिला",
  "Try adjusting your search query or status filter.": "कृपया अपना खोज शब्द या स्थिति फ़िल्टर बदलें।",

  // Budgeting & Tenders Section
  "ADMIN • PARTICIPATORY BUDGETING": "एडमिन • सहभागी बजट",
  "Budget & Tenders": "बजट और निविदाएं",
  "Create and manage government tenders generated from verified civic grievance clusters.": "सत्यापित नागरिक शिकायत समूहों से उत्पन्न सरकारी निविदाएं बनाएं और प्रबंधित करें।",
  "+ Add Tender": "+ निविदा जोड़ें",
  "Open tenders": "सक्रिय निविदाएं",
  "Currently published": "वर्तमान में प्रकाशित",
  "Draft tenders": "ड्राफ्ट निविदाएं",
  "Awaiting publication": "प्रकाशन की प्रतीक्षा में",
  "Allocated budget": "आवंटित बजट",
  "Across active projects": "सक्रिय परियोजनाओं में",
  "In progress": "प्रगति में",
  "Work currently tracked": "वर्तमान में ट्रैक किया जा रहा कार्य",
  "TENDER MANAGEMENT": "निविदा प्रबंधन",
  "Government projects": "सरकारी परियोजनाएं",
  "Manage tenders created from verified issue clusters.": "सत्यापित समस्या समूहों से बनाई गई निविदाओं का प्रबंधन करें।",
  "All": "सभी",
  "Draft": "ड्राफ्ट",
  "Published": "प्रकाशित",
  "Completed": "पूर्ण",
  "Priority road patching — Ward 15": "प्राथमिकता सड़क मरम्मत — वार्ड 15",
  "Repair the most-reported pothole locations across Ward 15.": "वार्ड 15 में सबसे अधिक रिपोर्ट किए गए गड्ढों की मरम्मत।",
  "Ward 15": "वार्ड 15",
  "8 verified complaints": "8 सत्यापित शिकायतें",
  "Estimated budget": "अनुमानित बजट",
  "Deadline": "समय सीमा",
  "24 Aug 2026": "24 अगस्त 2026",
  "Tender progress · 58%": "निविदा प्रगति · 58%",
  "Manage Tender": "निविदा प्रबंधित करें",
  "Drainage improvement — School Road": "जल निकासी सुधार — स्कूल रोड",
  "Resolve recurring drainage complaints near the primary school.": "प्राथमिक विद्यालय के पास बार-बार होने वाली जल निकासी समस्याओं का समाधान।",
  "Ward 12": "वार्ड 12",
  "12 verified complaints": "12 सत्यापित शिकायतें",
  "Target duration": "लक्षित अवधि",
  "45 days": "45 दिन",
  "Draft completion · 20%": "ड्राफ्ट पूर्णता · 20%",
  "Continue Draft": "ड्राफ्ट जारी रखें",
  "LED streetlight installation": "एलईडी स्ट्रीटलाइट स्थापना",
  "Install 20 LED streetlights around market and school corridors.": "बाजार और स्कूल क्षेत्रों में 20 एलईडी स्ट्रीटलाइट स्थापित करें।",
  "Ward 8": "वार्ड 8",
  "5 verified complaints": "5 सत्यापित शिकायतें",
  "Contractor": "ठेकेदार",
  "Work progress · 72%": "कार्य प्रगति · 72%",
  "Track Work": "कार्य ट्रैक करें",
  "Market sanitation upgrade": "बाजार स्वच्छता उन्नयन",
  "Improve waste collection points and sanitation facilities.": "कचरा संग्रहण स्थल और स्वच्छता सुविधाओं में सुधार।",
  "Ward 9": "वार्ड 9",
  "7 verified complaints": "7 सत्यापित शिकायतें",
  "Final cost": "अंतिम लागत",
  "Project completed · QR ready": "परियोजना पूर्ण · क्यूआर कोड तैयार",
  "View Project Trail": "परियोजना ट्रेल देखें",
  "PROJECT LIFECYCLE": "परियोजना जीवनचक्र",
  "Tender workflow": "निविदा कार्यप्रवाह",
  "One seamless status flow from citizen cluster verification to public QR audit trail.": "नागरिक समूह सत्यापन से लेकर सार्वजनिक क्यूआर ऑडिट ट्रेल तक एक निर्बाध स्थिति प्रवाह।",
  "Selected: CB-T-0015": "चयनित: CB-T-0015",
  "Cluster confirmed": "समूह की पुष्टि",
  "Draft Created": "ड्राफ्ट तैयार किया गया",
  "Budget prepared": "बजट तैयार",
  "Open for bids": "बोलियों के लिए खुला",
  "Contractor Awarded": "ठेकेदार आवंटित",
  "Selection done": "चयन पूर्ण",
  "Work in Progress": "कार्य प्रगति पर है",
  "Field updates": "मैदानी अपडेट",
  "Verification": "सत्यापन",
  "QR Trail": "क्यूआर ट्रेल",
  "Public audit": "सार्वजनिक ऑडिट",

  // Modals & Forms
  "NEW DEPARTMENT": "नया विभाग",
  "Add Department": "विभाग जोड़ें",
  "Department Name": "विभाग का नाम",
  "Department Head": "विभागाध्यक्ष",
  "Official Email": "आधिकारिक ईमेल",
  "Responsibility / Scope": "जिम्मेदारी / दायरा",
  "Cancel": "रद्द करें",
  "Save Department": "विभाग सहेजें",
  "NEW PROJECT": "नई परियोजना",
  "Add Tender": "निविदा जोड़ें",
  "Project Title": "परियोजना शीर्षक",
  "Ward / Location": "वार्ड / स्थान",
  "Budget (₹)": "बजट (₹)",
  "Target Completion": "लक्षित समापन",
  "Publish Tender": "निविदा प्रकाशित करें",

  // Footer & Miscellaneous
  "Quick Links": "त्वरित लिंक",
  "Making every civic issue visible,": "हर नागरिक समस्या को दृश्यमान,",
  "actionable and accountable.": "कार्रवाई योग्य और जवाबदेह बनाना।",
  "Empowering citizens to report problems": "नागरिकों को समस्याएं रिपोर्ट करने",
  "and build better communities together.": "और मिलकर बेहतर समुदाय बनाने के लिए सशक्त बनाना।",
  Home: "होम",
  "Report an Issue": "समस्या रिपोर्ट करें",
  "Track Complaint": "शिकायत ट्रैक करें",
  Community: "समुदाय",
  "About CivicBuzz": "सिविकबज़ के बारे में",
  "Civic Services": "नागरिक सेवाएं",
  "Road & Potholes": "सड़क और गड्ढे",
  "Garbage & Sanitation": "कचरा और स्वच्छता",
  "Street Lights": "स्ट्रीट लाइटें",
  "Water & Drainage": "पानी और जल निकासी",
  "Public Infrastructure": "सार्वजनिक अवसंरचना",
  "Need Help?": "मदद चाहिए?",
  FAQs: "अक्सर पूछे जाने वाले प्रश्न",
  "How to Report": "रिपोर्ट कैसे करें",
  "How Tracking Works": "ट्रैकिंग कैसे काम करती है",
  "Contact Support": "सहायता से संपर्क करें",
  "Have a question?": "कोई प्रश्न है?",
  "Privacy Policy": "गोपनीयता नीति",
  "Terms & Conditions": "नियम और शर्तें",
  "All rights reserved.": "सर्वाधिकार सुरक्षित।",
  "Built with": "बेहतर समुदायों के लिए",
  "for better communities.": "के साथ बनाया गया।",
  "Active Citizens": "सक्रिय नागरिक",
  Communities: "समुदाय",

  "May 8": "8 मई",
  "May 9": "9 मई",
  "May 10": "10 मई",
  "May 11": "11 मई",
  "May 12": "12 मई",
  "May 13": "13 मई",
  "May 14": "14 मई",
  "Week 1": "सप्ताह 1",
  "Week 2": "सप्ताह 2",
  "Week 3": "सप्ताह 3",
  "Week 4": "सप्ताह 4",
  "Week 5": "सप्ताह 5",
  "Week 6": "सप्ताह 6",
  Today: "आज",
  Jun: "जून",
  Jul: "जुलाई",
  Aug: "अगस्त",
  Sep: "सितंबर",
  Oct: "अक्टूबर",
  Nov: "नवंबर",
  Dec: "दिसंबर",

  // Search & Suggestions
  "Track ID & Grievances": "ट्रैक आईडी और शिकायतें",
  "Track ID": "ट्रैक आईडी",
  "Grievances": "शिकायतें",
  "Locations & Wards": "स्थान और वार्ड",
  "High Activity Hotspot": "उच्च गतिविधि हॉटस्पॉट",
  "No matches found for": "के लिए कोई परिणाम नहीं मिला",
  "Use ↑ ↓ to navigate · ↵ Enter to select": "↑ ↓ नेविगेट करें · ↵ Enter चुनें",
  "ESC to close": "ESC बंद करें",
  "Ward 12": "वार्ड 12",
  "Ward 15": "वार्ड 15",
  "Ward 8": "वार्ड 8",
  "Ward 4": "वार्ड 4",
  "Ward 6": "वार्ड 6",
  "Ward 7": "वार्ड 7",
  "Ward 14": "वार्ड 14",
  "Ward 9": "वार्ड 9",
  "Ward 10": "वार्ड 10",
  "Janpath Corridor, Bhubaneswar": "जनपथ कॉरिडोर, भुवनेश्वर",
  "Near Metro Station, MG Road": "मेट्रो स्टेशन के पास, एमजी रोड",
  "Sector 15, Nehru Park": "सेक्टर 15, नेहरू पार्क",
  "Block A, Green View Apartments": "ब्लॉक A, ग्रीन व्यू अपार्टमेंट",
  "Sector 4, Main Market": "सेक्टर 4, मुख्य बाजार",
  "5th Main Street": "5वीं मेन स्ट्रीट",
  "School Road": "स्कूल रोड",
  "Shastri Nagar": "शास्त्री नगर",
  "Flyover Junction": "फ्लाईओवर जंक्शन",
  "Dangerous Pothole on Flyover": "फ्लाईओवर पर खतरनाक गड्ढा",
  "Drainage Overflow & Waterlogging": "जल निकासी ओवरफ्लो और जलभराव",
  "Roads & Potholes Department": "सड़क और गड्ढे विभाग",
  "Street Lighting & Electricity": "स्ट्रीट लाइटिंग और बिजली विभाग",
  "Sanitation & Solid Waste": "स्वच्छता और ठोस अपशिष्ट प्रबंधन",
  "Water Supply & Drainage": "जल आपूर्ति और जल निकासी विभाग",
  "Parks & Urban Greenery": "पार्क और शहरी हरियाली विभाग",
  "Critical": "गंभीर",
  "Urgent": "तत्काल",
  "High": "उच्च",
  "Medium": "मध्यम",
  "Low": "कम",
  "Submitted": "प्रस्तुत",
  "Pending": "लंबित",
  "In Progress": "प्रगति पर",
  "Resolved": "हल किया गया",
  "Citizen Verified": "नागरिक सत्यापित",
};

const attributeTranslations = {
  "Search issues, locations, departments...": "समस्याएं, स्थान, विभाग खोजें...",
  "Search by Issue ID, Title, User ID, Location...": "समस्या आईडी, शीर्षक, यूज़र आईडी, स्थान से खोजें...",
  "Search departments, heads, emails...": "विभाग, प्रमुख, ईमेल खोजें...",
  "Choose language": "भाषा चुनें",
  "Select Language": "भाषा चुनें",
  Notifications: "सूचनाएं",
  "Open navigation": "नेविगेशन खोलें",
  "Open profile menu": "प्रोफाइल मेनू खोलें",
  "Account options": "खाता विकल्प",
  "Switch to light mode": "लाइट मोड पर स्विच करें",
  "Switch to dark mode": "डार्क मोड पर स्विच करें",
  "Close panel": "पैनल बंद करें",
  "Close": "बंद करें",
  "Search": "खोजें",
  "View Details": "विवरण देखें",
  "e.g. Traffic Management": "उदा. यातायात प्रबंधन",
  "e.g. R. K. Gupta": "उदा. आर. के. गुप्ता",
  "traffic@civicbuzz.gov": "traffic@civicbuzz.gov",
  "Describe the scope of this department...": "इस विभाग के कार्यक्षेत्र का विवरण दें...",
  "e.g. Ward 15 Road Resurfacing": "उदा. वार्ड 15 सड़क मरम्मत",
  "e.g. Ward 15": "उदा. वार्ड 15",
};

const toastTranslations = {
  "Opening all priority alerts": "सभी प्राथमिकता अलर्ट खोले जा रहे हैं",
  "Opening the priority issue queue": "प्राथमिकता समस्या सूची खोली जा रही है",
  "Full map opened": "पूरा मानचित्र खोला गया",
  "Opening all AI recommendations": "सभी एआई सिफारिशें खोली जा रही हैं",
  "Opening complete activity history": "पूरी गतिविधि हिस्ट्री खोली जा रही है",
  "My Reports will open here.": "मेरी रिपोर्ट यहां खुलेगी।",
  "Logout is a demo action in this dashboard.": "लॉगआउट इस डैशबोर्ड में डेमो एक्शन है।",
  "Dark mode enabled.": "डार्क मोड चालू हो गया।",
  "Light mode enabled.": "लाइट मोड चालू हो गया।",
  "You have 3 priority issue notifications.": "आपके पास 3 प्राथमिकता समस्या सूचनाएं हैं।",
  "New issue workflow opened in the routing queue.": "रूटिंग सूची में नई समस्या वर्कफ्लो खोला गया।",
  "Department assignment updated.": "विभाग आवंटन अपडेट किया गया।",
  "Assigned issue to recommended department.": "समस्या अनुशंसित विभाग को आवंटित कर दी गई।",
  "Issue marked as rejected.": "समस्या को अस्वीकृत चिह्नित किया गया।",
  "Issue marked as resolved. Waiting for citizen verification.": "समस्या को हल चिह्नित किया गया। नागरिक सत्यापन की प्रतीक्षा है।",
  "FAQs page will open here.": "FAQ पेज यहां खुलेगा।",
  "How-to-report guide will open here.": "रिपोर्ट गाइड यहां खुलेगी।",
  "Complaint tracking guide will open here.": "शिकायत ट्रैकिंग गाइड यहां खुलेगी।",
  "Support contact options will open here.": "सपोर्ट संपर्क विकल्प यहां खुलेंगे।",
  "About CivicBuzz page will open here.": "CivicBuzz के बारे में पेज यहां खुलेगा।",
  "Privacy policy will open here.": "गोपनीयता नीति यहां खुलेगी।",
  "Terms and conditions will open here.": "नियम और शर्तें यहां खुलेंगी।",
  "Accessibility settings will open here.": "सुगम्यता सेटिंग्स यहां खुलेंगी।",
  "CivicBuzz LinkedIn profile will open here.": "CivicBuzz लिंक्डइन प्रोफाइल यहां खुलेंगी।",
};

const originalText = new WeakMap();
const originalAttributes = new WeakMap();

function currentLanguage() {
  return document.documentElement.lang === "hi" ? "hi" : "en";
}

function t(value) {
  return currentLanguage() === "hi" ? translations[value] || value : value;
}

function localizeToast(message) {
  if (currentLanguage() !== "hi") {
    return message;
  }

  return toastTranslations[message] || translations[message] || message;
}

function translatePage(language) {
  const isHindi = language === "hi";

  document.documentElement.lang = language;
  document.documentElement.dir = "ltr";

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.parentElement && node.parentElement.closest("script, style")
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT,
  });

  const nodes = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    if (!originalText.has(node)) {
      originalText.set(node, node.nodeValue);
    }

    const original = originalText.get(node);
    const key = original.trim();

    if (!key || !translations[key]) {
      return;
    }

    const leading = original.match(/^\s*/)[0];
    const trailing = original.match(/\s*$/)[0];

    node.nodeValue = isHindi
      ? `${leading}${translations[key]}${trailing}`
      : original;
  });

  $$("select option").forEach((option) => {
    if (!originalText.has(option)) {
      originalText.set(option, option.textContent);
    }
    const orig = originalText.get(option);
    const key = orig.trim();
    if (translations[key]) {
      option.textContent = isHindi ? translations[key] : orig;
    }
  });

  $$("[placeholder], [aria-label]").forEach((element) => {
    if (!originalAttributes.has(element)) {
      originalAttributes.set(element, {
        placeholder: element.getAttribute("placeholder"),
        ariaLabel: element.getAttribute("aria-label"),
      });
    }

    const original = originalAttributes.get(element);

    if (original.placeholder) {
      element.setAttribute(
        "placeholder",
        isHindi
          ? attributeTranslations[original.placeholder] || translations[original.placeholder] || original.placeholder
          : original.placeholder,
      );
    }

    if (original.ariaLabel) {
      element.setAttribute(
        "aria-label",
        isHindi
          ? attributeTranslations[original.ariaLabel] || translations[original.ariaLabel] || original.ariaLabel
          : original.ariaLabel,
      );
    }
  });
}

function setupLanguage() {

  const languageSelector =
    document.querySelector(".language-selector");

  const languageButton =
    document.getElementById("languageButton");

  const languageDropdown =
    document.getElementById("languageDropdown");

  const languageCurrent =
    document.getElementById("languageCurrent");

  const languageOptions =
    document.querySelectorAll(".language-option");

  if (
    !languageSelector ||
    !languageButton ||
    !languageDropdown
  ) {
    return;
  }

  let language = "en";

  try {
    language =
      localStorage.getItem("civicbuzz-admin-language") || "en";
  } catch (_) {
    language = "en";
  }

  if (language !== "hi") {
    language = "en";
  }

  // Current language
  if (languageCurrent) {
    languageCurrent.textContent =
      language === "hi" ? "हिन्दी" : "English";
  }

  // Active option
  languageOptions.forEach((option) => {
    option.classList.toggle(
      "active",
      option.dataset.language === language
    );
  });

  // Translate saved language
  translatePage(language);

  // Open / close dropdown
  languageButton.addEventListener("click", (event) => {

    event.stopPropagation();

    const isOpen =
      languageSelector.classList.contains("open");

    languageSelector.classList.toggle(
      "open",
      !isOpen
    );

    languageButton.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );
  });

  // Language selection
  languageOptions.forEach((option) => {

    option.addEventListener("click", (event) => {

      event.preventDefault();
      event.stopPropagation();

      const selectedLanguage =
        option.dataset.language === "hi"
          ? "hi"
          : "en";

      // Update button text
      if (languageCurrent) {
        languageCurrent.textContent =
          selectedLanguage === "hi"
            ? "हिन्दी"
            : "English";
      }

      // Update active option
      languageOptions.forEach((item) => {
        item.classList.toggle(
          "active",
          item === option
        );
      });

      // Translate complete page
      translatePage(selectedLanguage);

      // Update chart
      updateTrendChart(
        $("#trendRange")?.value || "week"
      );

      // Close dropdown
      languageSelector.classList.remove("open");

      languageButton.setAttribute(
        "aria-expanded",
        "false"
      );

      // Save language
      try {
        localStorage.setItem(
          "civicbuzz-admin-language",
          selectedLanguage
        );
      } catch (_) { }
    });
  });

  // Close when clicking outside
  document.addEventListener("click", (event) => {

    if (!languageSelector.contains(event.target)) {

      languageSelector.classList.remove("open");

      languageButton.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  });

  // Close with Escape
  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

      languageSelector.classList.remove("open");

      languageButton.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  });
}

function showToast(message) {
  const toast = $("#toast");

  if (!toast) {
    return;
  }

  const localized = localizeToast(message);

  window.clearTimeout(toastTimer);

  toast.textContent = localized;
  toast.classList.add("show");

  toastTimer = window.setTimeout(
    () => toast.classList.remove("show"),
    2600
  );
}

function getTimeAgo(timestamp) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

function getTrendDataFromStore(range = "week") {
  if (window.CivicBuzzAPI?.store?.getTrendData) {
    return window.CivicBuzzAPI.store.getTrendData(range);
  }
  const complaints = window.CivicBuzzAPI?.store?.getAll ? window.CivicBuzzAPI.store.getAll() : [];
  const now = new Date();

  if (range === "week") {
    const labels = [];
    const reported = [];
    const resolved = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dayStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      labels.push(i === 0 ? "Today" : dayStr);

      const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0).getTime();
      const dEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59).getTime();

      const repCount = complaints.filter((c) => {
        const t = new Date(c.created_at || Date.now()).getTime();
        return t >= dStart && t <= dEnd;
      }).length;

      const resCount = complaints.filter((c) => {
        const isRes = (c.status || "").toUpperCase() === "RESOLVED" || (c.status || "").toUpperCase() === "VERIFIED";
        if (!isRes) return false;
        const t = new Date(c.resolved_at || c.created_at || Date.now()).getTime();
        return t >= dStart && t <= dEnd;
      }).length;

      reported.push(repCount);
      resolved.push(resCount);
    }
    return { labels, reported, resolved };
  }

  return { labels: ["Day 1", "Day 2", "Day 3", "Today"], reported: [0, 0, 0, 0], resolved: [0, 0, 0, 0] };
}

function updateTrendChart(range = "week") {
  const data = getTrendDataFromStore(range);
  if (!data || !data.labels || data.labels.length === 0) {
    return;
  }

  const N = data.labels.length;
  const maxVal = Math.max(...data.reported, ...data.resolved, 0);

  let gridMax = 4;
  if (maxVal > 16) gridMax = Math.ceil(maxVal / 5) * 5;
  else if (maxVal > 8) gridMax = 16;
  else if (maxVal > 4) gridMax = 8;
  else if (maxVal > 0) gridMax = Math.max(4, maxVal);

  const yTicks = [
    gridMax,
    Math.round(gridMax * 0.75),
    Math.round(gridMax * 0.5),
    Math.round(gridMax * 0.25),
    0
  ];

  const yAxisEl = $("#trendYAxis");
  if (yAxisEl) {
    yAxisEl.innerHTML = yTicks.map((val) => `<span>${val}</span>`).join("");
  }

  const getX = (i) => (N <= 1 ? 365 : 10 + (710 / (N - 1)) * i);
  const getY = (v) => 180 - (Math.min(v, gridMax) / gridMax) * 168;

  const repPointsStr = data.reported.map((v, i) => `${getX(i).toFixed(1)},${getY(v).toFixed(1)}`).join(" ");
  const resPointsStr = data.resolved.map((v, i) => `${getX(i).toFixed(1)},${getY(v).toFixed(1)}`).join(" ");

  const reportedLine = $("#reportedLine");
  const resolvedLine = $("#resolvedLine");

  if (reportedLine) {
    reportedLine.setAttribute("points", repPointsStr);
  }

  if (resolvedLine) {
    resolvedLine.setAttribute("points", resPointsStr);
  }

  const reportedGroup = $("#reportedPoints");
  const resolvedGroup = $("#resolvedPoints");
  const tooltip = $("#chartTooltip");
  const chartWrap = $(".chart-wrap");

  if (reportedGroup) {
    reportedGroup.innerHTML = data.reported.map((v, i) => {
      const cx = getX(i).toFixed(1);
      const cy = getY(v).toFixed(1);
      return `<circle class="reported-point" cx="${cx}" cy="${cy}" r="4.5" data-idx="${i}" data-val="${v}" data-date="${data.labels[i]}" data-type="Reported"></circle>`;
    }).join("");
  }

  if (resolvedGroup) {
    resolvedGroup.innerHTML = data.resolved.map((v, i) => {
      const cx = getX(i).toFixed(1);
      const cy = getY(v).toFixed(1);
      return `<circle class="resolved-point" cx="${cx}" cy="${cy}" r="4.5" data-idx="${i}" data-val="${v}" data-date="${data.labels[i]}" data-type="Resolved"></circle>`;
    }).join("");
  }

  // Bind interactive tooltips
  if (chartWrap && tooltip) {
    $$(".reported-point, .resolved-point", chartWrap).forEach((pt) => {
      pt.addEventListener("mouseenter", () => {
        const idx = parseInt(pt.getAttribute("data-idx") || "0", 10);
        const dateStr = data.labels[idx] || "";
        const repVal = data.reported[idx] || 0;
        const resVal = data.resolved[idx] || 0;

        tooltip.innerHTML = `
          <div class="tt-date">${dateStr}</div>
          <div class="tt-row"><span class="tt-dot blue"></span> Reported: <b>${repVal}</b></div>
          <div class="tt-row"><span class="tt-dot green"></span> Resolved: <b>${resVal}</b></div>
        `;

        const ptRect = pt.getBoundingClientRect();
        const wrapRect = chartWrap.getBoundingClientRect();

        tooltip.style.left = `${ptRect.left - wrapRect.left + ptRect.width / 2}px`;
        tooltip.style.top = `${ptRect.top - wrapRect.top - 8}px`;
        tooltip.style.display = "block";
      });

      pt.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
      });
    });
  }

  const labelRow = $("#chartLabels");
  if (labelRow) {
    labelRow.innerHTML = data.labels
      .map((label) => `<span>${t(label)}</span>`)
      .join("");
  }
}

function animateCounter(el, newVal) {
  if (!el) return;
  const currentVal = parseInt(el.textContent.replace(/,/g, "") || "0", 10);
  if (isNaN(currentVal) || currentVal === newVal) {
    el.textContent = newVal.toLocaleString();
    return;
  }

  el.classList.add("metric-bump");
  setTimeout(() => el.classList.remove("metric-bump"), 600);

  const duration = 400;
  const start = performance.now();
  const diff = newVal - currentVal;

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(currentVal + diff * eased);
    el.textContent = current.toLocaleString();
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = newVal.toLocaleString();
    }
  }
  requestAnimationFrame(step);
}

function renderRealMetricsAndStats() {
  const metrics = window.CivicBuzzAPI?.store?.getMetrics
    ? window.CivicBuzzAPI.store.getMetrics()
    : {
        total_reported: 0,
        total_resolved: 0,
        total_open: 0,
        total_overdue: 0,
        resolution_rate_percent: 0,
      };

  const repEl = $("#metricReported");
  const resEl = $("#metricResolved");
  const openEl = $("#metricOpen");
  const ovEl = $("#metricOverdue");

  animateCounter(repEl, metrics.total_reported);
  animateCounter(resEl, metrics.total_resolved);
  animateCounter(openEl, metrics.total_open);
  animateCounter(ovEl, metrics.total_overdue);

  const repSub = $("#metricReportedSub");
  const resSub = $("#metricResolvedSub");
  const openSub = $("#metricOpenSub");
  const ovSub = $("#metricOverdueSub");

  if (repSub) repSub.innerHTML = `● <em>${metrics.total_reported} total submitted</em>`;
  if (resSub) resSub.innerHTML = `● <em>${metrics.resolution_rate_percent}% resolution rate</em>`;
  if (openSub) openSub.innerHTML = `● <em>${metrics.total_open} active in queue</em>`;
  if (ovSub) ovSub.innerHTML = `● <em>${metrics.total_overdue} urgent attention</em>`;

  // Update Donut Resolution Rate
  const donutText = $("#donutRateText");
  const donutRes = $("#donutResolvedSummary");
  const donutPend = $("#donutPendingSummary");
  const donutVisual = $("#donutVisual");

  if (donutText) donutText.textContent = `${metrics.resolution_rate_percent}%`;
  if (donutRes) donutRes.innerHTML = `<i></i> ${metrics.total_resolved} resolved`;
  if (donutPend) donutPend.innerHTML = `<i></i> ${metrics.total_open} open`;
  if (donutVisual) {
    donutVisual.style.background = `conic-gradient(#10b981 0% ${metrics.resolution_rate_percent}%, #d9e1ec ${metrics.resolution_rate_percent}% 100%)`;
  }

  // Update Priority Alerts in Overview panel
  const alertList = $(".alert-list");
  if (alertList && window.CivicBuzzAPI?.store?.getAll) {
    const all = window.CivicBuzzAPI.store.getAll();
    const urgentItems = all.filter(
      (c) => (c.is_overdue || ["CRITICAL", "HIGH"].includes((c.priority_level || c.priority?.level || "").toUpperCase())) && c.status !== "RESOLVED"
    ).slice(0, 4);

    if (urgentItems.length > 0) {
      alertList.innerHTML = urgentItems.map((c) => {
        const catIcons = {
          roads_potholes: { icon: "⌁", cls: "road" },
          road: { icon: "⌁", cls: "road" },
          garbage_sanitation: { icon: "♜", cls: "garbage" },
          garbage: { icon: "♜", cls: "garbage" },
          water_supply: { icon: "◒", cls: "water" },
          water: { icon: "◒", cls: "water" },
          streetlights: { icon: "☼", cls: "street" },
          drainage: { icon: "🌊", cls: "water" },
        };
        const catInfo = catIcons[c.category] || { icon: "!", cls: "road" };
        const pr = (c.priority_level || "HIGH").toLowerCase();
        const timeAgo = getTimeAgo(c.created_at || Date.now());

        return `
          <article class="alert-item">
            <span class="alert-icon ${catInfo.cls}">${catInfo.icon}</span>
            <div>
              <h3>${c.title}</h3>
              <p>${c.location?.address || c.location?.ward_name || "Bhubaneswar"}</p>
            </div>
            <span class="status-pill ${c.is_overdue ? 'overdue' : 'attention'}">${c.is_overdue ? 'Overdue' : pr.toUpperCase()}</span>
            <time>${timeAgo}</time>
          </article>
        `;
      }).join("");
    }
  }

  // Update AI routing table in Overview panel
  const routingTable = $(".routing-table");
  if (routingTable && window.CivicBuzzAPI?.store?.getAll) {
    const all = window.CivicBuzzAPI.store.getAll();
    const pendingItems = all.filter((c) => ["SUBMITTED", "PENDING"].includes((c.status || "").toUpperCase())).slice(0, 4);

    if (pendingItems.length > 0) {
      const head = `
        <div class="table-head" role="row">
          <span>Issue</span>
          <span>Priority</span>
          <span>Suggested department</span>
        </div>
      `;
      const rows = pendingItems.map((c) => {
        const catIcons = {
          roads_potholes: { icon: "⌁", cls: "pothole-thumb" },
          garbage_sanitation: { icon: "♜", cls: "garbage-thumb" },
          water_supply: { icon: "◒", cls: "water-thumb" },
          streetlights: { icon: "☼", cls: "street-thumb" },
          drainage: { icon: "🌊", cls: "water-thumb" },
        };
        const catInfo = catIcons[c.category] || { icon: "●", cls: "pothole-thumb" };
        const pr = (c.priority_level || "HIGH").toLowerCase();

        return `
          <div class="table-row" role="row">
            <div class="issue-name">
              <span class="issue-thumb ${catInfo.cls}">${catInfo.icon}</span>
              <span>
                <b>${c.title}</b>
                <small>${c.location?.ward_name || 'Ward'} · #${c.complaint_id}</small>
              </span>
            </div>
            <strong class="match ${pr === 'critical' || pr === 'high' ? 'high' : 'medium'}">${(c.priority_level || 'HIGH').toUpperCase()}</strong>
            <button class="department-chip" data-toast="Department: ${c.department_name}">
              ${c.department_name || 'Municipal Dept'} <i>⌄</i>
            </button>
          </div>
        `;
      }).join("");
      routingTable.innerHTML = head + rows;
    }
  }
}

function setTheme(theme) {
  const isDark = theme === "dark";

  document.body.classList.toggle(
    "dark-theme",
    isDark
  );

  const toggle = $("#profileThemeToggle");
  const icon = $("#themeIcon");
  const label = $("#themeLabel");
  const switchControl = $("#themeSwitch");

  if (toggle) {
    toggle.setAttribute(
      "aria-pressed",
      String(isDark)
    );

    toggle.setAttribute(
      "aria-label",
      isDark
        ? t("Switch to light mode")
        : t("Switch to dark mode")
    );
  }

  if (icon) {
    icon.className = `fa-solid ${isDark ? "fa-sun" : "fa-moon"
      }`;
  }

  if (label) {
    label.textContent = isDark
      ? t("Light Mode")
      : t("Dark Mode");
  }

  if (switchControl) {
    switchControl.classList.toggle(
      "is-dark",
      isDark
    );
  }

  try {
    localStorage.setItem(
      "civicbuzz-admin-theme",
      theme
    );
  } catch (_) {
    // The dashboard still works when browser storage is unavailable.
  }
}

function activateNav(link) {
  const href = link.getAttribute("href");
  if (href && href.includes(".html")) {
    window.location.href = href;
    return;
  }

  $$(".nav-link").forEach((item) =>
    item.classList.remove("active")
  );

  link.classList.add("active");

  const section =
    link.dataset.section ||
    link.textContent.trim();

  const breadcrumb = $("#breadcrumbCurrent");
  if (breadcrumb) {
    breadcrumb.textContent = t(section);
  }

  showSection(section);
}

function showSection(sectionName) {
  const normalized = (sectionName || "dashboard").toLowerCase().replace(/[^a-z0-9]/g, "");

  const viewMap = {
    dashboard: "#section-dashboard",
    home: "#section-dashboard",
    issuequeue: "#section-issue-queue",
    trackissues: "#section-issue-queue",
    departments: "#section-departments",
    department: "#section-departments",
    budgeting: "#section-budgeting",
    tenders: "#section-budgeting",
    maphotspots: "#section-dashboard",
    map: "#section-dashboard",
    analytics: "#section-dashboard",
  };

  const targetSelector = viewMap[normalized] || "#section-dashboard";
  const isDashboardView = targetSelector === "#section-dashboard" && normalized !== "maphotspots" && normalized !== "map";

  $$(".admin-view").forEach((view) => {
    view.classList.add("hidden");
  });

  const targetView = $(targetSelector);
  if (targetView) {
    targetView.classList.remove("hidden");
  }

  // Footer is strictly visible only on Dashboard view
  const siteFooter = $("#footer") || $(".site-footer");
  if (siteFooter) {
    siteFooter.style.display = isDashboardView ? "" : "none";
  }

  translatePage(currentLanguage());

  if (normalized === "maphotspots" || normalized === "map") {
    $("#map")?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => { if (adminLiveMap) adminLiveMap.invalidateSize(); }, 250);
  } else if (normalized === "analytics") {
    $(".trend-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (normalized === "dashboard" || normalized === "home" || !normalized) {
      setTimeout(() => { if (adminLiveMap) adminLiveMap.invalidateSize(); }, 250);
    }
  }
}

function setupNavigation() {
  const sidebar = $(".sidebar");
  const mobileMenu = $("#mobileMenu");

  mobileMenu?.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");

    mobileMenu.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    mobileMenu.textContent = isOpen
      ? "×"
      : "☰";
  });

  $$(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href") || "";
      if (href.startsWith("#")) {
        e.preventDefault();
        history.pushState(null, "", href);
      }
      activateNav(link);

      if (
        window.matchMedia(
          "(max-width: 760px)"
        ).matches
      ) {
        sidebar.classList.remove("open");

        mobileMenu?.setAttribute(
          "aria-expanded",
          "false"
        );

        if (mobileMenu) {
          mobileMenu.textContent = "☰";
        }
      }
    });
  });

  // Handle in-page nav targets (e.g. View Priority Queue button)
  $$("[data-nav-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetHash = btn.dataset.navTarget;
      const matchedLink = $(`a[href='${targetHash}']`);
      if (matchedLink) {
        matchedLink.click();
      } else if (targetHash === "#issue-queue") {
        showSection("issuequeue");
        const b = $("#breadcrumbCurrent");
        if (b) b.textContent = t("Issue Queue");
      }
    });
  });

  // Handle initial hash routing
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const matchedLink = $(`a[href='#${hash}']`);
      if (matchedLink) {
        activateNav(matchedLink);
      } else {
        showSection(hash);
      }
    }
  });

  if (window.location.hash) {
    const hash = window.location.hash.replace("#", "");
    const matchedLink = $(`a[href='#${hash}']`);
    if (matchedLink) {
      activateNav(matchedLink);
    } else {
      showSection(hash);
    }
  }

  document.addEventListener("click", (event) => {
    if (
      !window.matchMedia(
        "(max-width: 760px)"
      ).matches ||
      !sidebar.classList.contains("open")
    ) {
      return;
    }

    if (
      !sidebar.contains(event.target) &&
      !mobileMenu?.contains(event.target)
    ) {
      sidebar.classList.remove("open");

      mobileMenu?.setAttribute(
        "aria-expanded",
        "false"
      );

      if (mobileMenu) {
        mobileMenu.textContent = "☰";
      }
    }
  });
}

// =========================================================
// SUBMODULE: ISSUE QUEUE & TRIAGE (DATABASE CONNECTED)
// =========================================================

let currentActiveIssueId = null;

function setupIssueQueue() {
  const searchInput = $("#issueSearch");
  const statusFilter = $("#statusFilter");
  const priorityFilter = $("#priorityFilter");
  const categoryFilter = $("#categoryFilter");
  const dateFilter = $("#dateFilter");
  const tableBody = $("#issuesTableBody");

  const sidePanel = $("#issueDetailsPanel");
  const panelOverlay = $("#issuePanelOverlay");
  const closePanelBtn = $("#closeIssuePanel");

  function filterIssues() {
    const q = searchInput?.value.trim().toLowerCase() || "";
    const st = statusFilter?.value || "all";
    const pr = priorityFilter?.value || "all";
    const cat = categoryFilter?.value || "all";

    const rows = $$("tr", tableBody);
    let visibleCount = 0;

    rows.forEach((row) => {
      const rowStatus = row.dataset.status || "";
      const rowPriority = row.dataset.priority || "";
      const rowCat = row.dataset.category || "";
      const rowText = row.textContent.toLowerCase();

      const matchQ = !q || rowText.includes(q);
      const matchSt = st === "all" || rowStatus.toLowerCase() === st.toLowerCase();
      const matchPr = pr === "all" || rowPriority.toLowerCase() === pr.toLowerCase();
      const matchCat = cat === "all" || rowCat.toLowerCase() === cat.toLowerCase();

      if (matchQ && matchSt && matchPr && matchCat) {
        row.hidden = false;
        visibleCount++;
      } else {
        row.hidden = true;
      }
    });

    const totalEl = $("#queueTotalCount");
    if (totalEl) totalEl.textContent = visibleCount;
  }

  searchInput?.addEventListener("input", filterIssues);
  statusFilter?.addEventListener("change", filterIssues);
  priorityFilter?.addEventListener("change", filterIssues);
  categoryFilter?.addEventListener("change", filterIssues);
  dateFilter?.addEventListener("change", filterIssues);

    // Helper to render Resolution QR Code
  function renderResolvedQrCode(issueId, status) {
    const qrSection = $("#panelResolvedQrSection");
    const qrImg = $("#panelQrImg");
    const isResolved = String(status || "").toLowerCase().includes("resolv") || String(status || "").toLowerCase().includes("verif");

    if (!qrSection || !qrImg) return;

    if (isResolved && issueId) {
      const cleanId = String(issueId).replace("#", "");
      const hostUrl = window.location.origin + window.location.pathname.replace("Admin Page Frontend/index.html", "");
      const verifyUrl = `${hostUrl}Client Page Frontend/Track_complaints_Frontend/details.html?id=${encodeURIComponent(cleanId)}`;
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(verifyUrl)}&color=059669&bgcolor=ffffff`;

      qrImg.src = qrApiUrl;
      qrSection.style.display = "block";

      const copyBtn = $("#copyQrLinkBtn");
      if (copyBtn) {
        copyBtn.onclick = (e) => {
          e.preventDefault();
          if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(verifyUrl).then(() => {
              showToast("✓ Verification link copied to clipboard!");
            });
          } else {
            showToast(`Verification Link: ${verifyUrl}`);
          }
        };
      }

      const downloadBtn = $("#downloadQrBtn");
      if (downloadBtn) {
        downloadBtn.onclick = (e) => {
          e.preventDefault();
          const a = document.createElement("a");
          a.href = qrApiUrl;
          a.download = `CivicBuzz-Resolution-QR-${cleanId}.png`;
          a.target = "_blank";
          a.click();
          showToast("📥 QR Code downloaded!");
        };
      }

      const customUpload = $("#customQrUpload");
      if (customUpload) {
        customUpload.onchange = (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              const customSrc = evt.target.result;
              qrImg.src = customSrc;
              if (window.ComplaintStore?.update) {
                window.ComplaintStore.update(cleanId, {
                  resolution_qr_url: customSrc,
                  resolution_image_url: customSrc
                });
              }
              showToast("✓ Custom Resolution QR / Proof photo uploaded!");
            };
            reader.readAsDataURL(file);
          }
        };
      }
    } else {
      qrSection.style.display = "none";
    }
  }

function openIssueDetails(issueData) {
    if (!sidePanel || !panelOverlay) return;

    currentActiveIssueId = issueData.rawId || (issueData.id ? issueData.id.replace("#", "") : "ISS-1024");

    const pId = $("#panelIssueId");
    const pTitle = $("#panelIssueTitle");
    const pUser = $("#panelUserId");
    const pDate = $("#panelDate");
    const pLoc = $("#panelLocation");
    const pCat = $("#panelCategory");
    const pPri = $("#panelPriority");
    const pSt = $("#panelStatus");
    const pAss = $("#panelAssigned");
    const pDesc = $("#panelDescription");

    if (pId) pId.textContent = issueData.id || "#ISS-1024";
    if (pTitle) pTitle.textContent = issueData.title || "Civic Issue";
    if (pUser) pUser.textContent = issueData.user || "USR-2045";
    if (pDate) pDate.textContent = issueData.date || "Today";
    if (pLoc) pLoc.textContent = issueData.location || "Janpath Road, Ward 12";
    if (pCat) pCat.textContent = issueData.category || "🛣️ Road";
    if (pPri) {
      pPri.className = `priority-badge ${(issueData.priority || "high").toLowerCase()}`;
      pPri.textContent = issueData.priority || "High";
    }
    if (pSt) {
      pSt.className = `status-badge ${(issueData.status || "pending").toLowerCase()}`;
      pSt.textContent = issueData.status || "Pending";
    }
    if (pAss) pAss.textContent = issueData.dept || "Roads & Potholes Department";
    if (pDesc) pDesc.textContent = issueData.desc || "Reported civic issue awaiting verification and triage.";

    // Populate AI Triage Audit Fields
    const pAiSummary = $("#panelAiSummary");
    const pAiUrgency = $("#panelAiUrgencyChip");
    const pAiSla = $("#panelAiSla");
    const pAiPbBadge = $("#panelAiPbBadge");

    let matchDoc = null;
    if (window.ComplaintStore?.getAll) {
      const allComps = window.ComplaintStore.getAll();
      matchDoc = allComps.find(c => (c.complaint_id || "").replace("#", "") === currentActiveIssueId);
    }

    if (pAiSummary) {
      pAiSummary.textContent = matchDoc?.ai_summary || issueData.desc || "AI-standardized canonical summary for municipal dispatch.";
    }
    if (pAiUrgency) {
      const score = matchDoc?.urgency_score || (issueData.priority === "Critical" ? 92 : 85);
      pAiUrgency.textContent = `Urgency: ${score}/100`;
    }
    if (pAiSla) {
      pAiSla.textContent = `⏱️ SLA: ${matchDoc?.sla_hours || 48}h Resolution Guarantee`;
    }
    if (pAiPbBadge) {
      pAiPbBadge.style.display = matchDoc?.is_pb_candidate ? "inline-block" : "none";
    }

    // Dynamic Image Evidence Rendering
    const imageContainer = $("#panelImageContainer");
    let imageUrl = issueData.image_url || issueData.image || (matchDoc ? matchDoc.image_url : null);

    if (imageContainer) {
      if (imageUrl) {
        imageContainer.innerHTML = `
          <div class="issue-image-card" onclick="window.openImageLightbox('${imageUrl}')">
            <img src="${imageUrl}" alt="${issueData.title || 'Attached Evidence'}" loading="lazy" />
            <div class="image-card-caption">
              <span>🔍 Click to enlarge</span>
              <small>Citizen Uploaded Evidence</small>
            </div>
          </div>
        `;
      } else {
        imageContainer.innerHTML = `
          <div class="image-not-uploaded-box">
            <div class="no-img-icon">📷</div>
            <div class="no-img-text">
              <strong data-i18n="Image not uploaded">Image not uploaded</strong>
              <p data-i18n="No visual media was attached by the citizen with this complaint.">No visual media was attached by the citizen with this complaint.</p>
            </div>
          </div>
        `;
      }
    }

    renderResolvedQrCode(currentActiveIssueId, issueData.status || matchDoc?.status);
    sidePanel.classList.add("open");
    panelOverlay.classList.add("active");
    translatePage(currentLanguage());
  }

  window.openImageLightbox = function(src) {
    let lightbox = document.getElementById("civicbuzzImageLightbox");
    if (!lightbox) {
      lightbox = document.createElement("div");
      lightbox.id = "civicbuzzImageLightbox";
      lightbox.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;cursor:zoom-out;backdrop-filter:blur(4px);";
      lightbox.onclick = function() { lightbox.style.display = "none"; };
      lightbox.innerHTML = `<img id="lightboxImg" style="max-width:92vw;max-height:92vh;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.8);border:2px solid rgba(255,255,255,0.2);object-fit:contain;" />`;
      document.body.appendChild(lightbox);
    }
    const img = lightbox.querySelector("#lightboxImg");
    if (img) img.src = src;
    lightbox.style.display = "flex";
  };

  window.openIssueDetails = openIssueDetails;

  function closeIssueDetails() {
    sidePanel?.classList.remove("open");
    panelOverlay?.classList.remove("active");
  }

  closePanelBtn?.addEventListener("click", closeIssueDetails);
  panelOverlay?.addEventListener("click", closeIssueDetails);

  tableBody?.addEventListener("click", (e) => {
    const btn = e.target.closest(".view-issue-btn") || e.target.closest("tr");
    if (btn) {
      const row = btn.closest("tr") || btn;
      const cells = row.querySelectorAll("td");
      if (cells.length >= 7) {
        const rawIdText = cells[0]?.textContent.trim();
        openIssueDetails({
          rawId: rawIdText.replace("#", ""),
          id: rawIdText,
          title: cells[1]?.textContent.trim(),
          user: cells[2]?.textContent.trim(),
          category: cells[3]?.textContent.trim(),
          priority: cells[4]?.textContent.trim(),
          date: cells[5]?.textContent.trim(),
          status: cells[6]?.textContent.trim(),
          location: "Janpath Road, Ward 12",
          dept: "Roads & Potholes Department",
          desc: `${cells[1]?.textContent.trim()} reported on ${cells[5]?.textContent.trim()}. Priority: ${cells[4]?.textContent.trim()}.`,
        });
      }
    }
  });

    $("#assignIssueBtn")?.addEventListener("click", async () => {
    if (!currentActiveIssueId) return;
    const cleanId = currentActiveIssueId.replace("#", "");
    const title = $("#panelTitle")?.textContent || "Reported Issue";
    const dept = $("#panelAssigned")?.textContent || "Roads & Works Department";

    // 1. Update Complaint Store
    if (window.ComplaintStore?.update) {
      window.ComplaintStore.update(cleanId, {
        status: "IN_PROGRESS",
        department_name: dept
      });
      window.ComplaintStore.addTimelineEvent(cleanId, {
        action: "Assigned to Department",
        notes: `Grievance assigned to ${dept} with 48h municipal resolution SLA.`,
        actor: "Admin (Aditya Kumar Shyam)",
        role: "Administrator",
        status: "IN_PROGRESS"
      });
    }

    // 2. Dispatch Real-time Notification to Citizen
    if (window.NotificationStore?.add) {
      window.NotificationStore.add({
        complaint_id: cleanId,
        title: `📌 Grievance #${cleanId} Assigned`,
        message: `Your grievance "${title}" has been assigned to ${dept}. A field maintenance unit has been dispatched.`,
        type: "ASSIGNED",
        status: "IN_PROGRESS"
      });
    }

    if (window.CivicBuzzAPI?.admin?.complaintAction) {
      try {
        await window.CivicBuzzAPI.admin.complaintAction(cleanId, "ASSIGN", "ROADS_AND_POTHOLES");
      } catch (_) {}
    }

    showToast(`✓ Issue #${cleanId} assigned to ${dept}! Immediate notification sent to citizen.`);
    renderResolvedQrCode(cleanId, "IN_PROGRESS");
    const pSt = $("#panelStatus");
    if (pSt) {
      pSt.className = "status-badge progress in-progress";
      pSt.textContent = "In Progress";
    }
    renderRealMetricsAndStats();
    updateTrendChart($("#trendRange")?.value || "week");
    loadLiveComplaints();
  });

  $("#rejectIssueBtn")?.addEventListener("click", async () => {
    if (!currentActiveIssueId) return;
    const cleanId = currentActiveIssueId.replace("#", "");
    const title = $("#panelTitle")?.textContent || "Reported Issue";

    if (window.ComplaintStore?.update) {
      window.ComplaintStore.update(cleanId, {
        status: "REJECTED"
      });
      window.ComplaintStore.addTimelineEvent(cleanId, {
        action: "Marked Rejected",
        notes: "Grievance rejected or merged as duplicate during municipal review.",
        actor: "Admin (Aditya Kumar Shyam)",
        role: "Administrator",
        status: "REJECTED"
      });
    }

    if (window.NotificationStore?.add) {
      window.NotificationStore.add({
        complaint_id: cleanId,
        title: `⚠️ Grievance #${cleanId} Update`,
        message: `Your grievance "${title}" was reviewed and marked as Rejected/Duplicate.`,
        type: "REJECTED",
        status: "REJECTED"
      });
    }

    if (window.CivicBuzzAPI?.admin?.complaintAction) {
      try {
        await window.CivicBuzzAPI.admin.complaintAction(cleanId, "REJECT");
      } catch (_) {}
    }

    showToast(`Issue #${cleanId} rejected. Notification dispatched.`);
    renderResolvedQrCode(cleanId, "REJECTED");
    const pSt = $("#panelStatus");
    if (pSt) {
      pSt.className = "status-badge rejected";
      pSt.textContent = "Rejected";
    }

    renderRealMetricsAndStats();
    updateTrendChart($("#trendRange")?.value || "week");
    loadLiveComplaints();
  });

  $("#resolveIssueBtn")?.addEventListener("click", async () => {
    if (!currentActiveIssueId) return;
    const cleanId = currentActiveIssueId.replace("#", "");
    const title = $("#panelTitle")?.textContent || "Reported Issue";

    // 1. Update Complaint Store
    if (window.ComplaintStore?.update) {
      window.ComplaintStore.update(cleanId, {
        status: "RESOLVED",
        resolved_at: new Date().toISOString(),
        progress_percentage: 100
      });
      window.ComplaintStore.addTimelineEvent(cleanId, {
        action: "Marked Resolved",
        notes: "Remediation completed by municipal department. Citizen verification QR code generated.",
        actor: "Admin (Aditya Kumar Shyam)",
        role: "Administrator",
        status: "RESOLVED"
      });
    }

    // 2. Dispatch Real-time Notification to Citizen
    if (window.NotificationStore?.add) {
      window.NotificationStore.add({
        complaint_id: cleanId,
        title: `🎉 Grievance #${cleanId} Resolved!`,
        message: `Municipal repairs for "${title}" are completed. Please scan the QR code to verify on-site.`,
        type: "RESOLVED",
        status: "RESOLVED"
      });
    }

    if (window.CivicBuzzAPI?.admin?.complaintAction) {
      try {
        await window.CivicBuzzAPI.admin.complaintAction(cleanId, "RESOLVE");
      } catch (_) {}
    }

    showToast(`✓ Issue #${cleanId} marked as Resolved! QR verification code generated & citizen notified.`);
    renderResolvedQrCode(cleanId, "RESOLVED");

    const pSt = $("#panelStatus");
    if (pSt) {
      pSt.className = "status-badge resolved";
      pSt.textContent = "Resolved";
    }
    const verRep = $("#verRep");
    if (verRep) {
      verRep.textContent = "Verified ✓";
      verRep.className = "ver-badge verified";
    }

    renderRealMetricsAndStats();
    updateTrendChart($("#trendRange")?.value || "week");
    loadLiveComplaints();
  });

  async function loadLiveComplaints() {
    if (!window.CivicBuzzAPI) return;
    try {
      const res = await window.CivicBuzzAPI.public.listComplaints();
      if (res && res.data) {
        const comps = Array.isArray(res.data) ? res.data : [];
        const totalCount = comps.length;
        const totalCountEl = $("#queueTotalCount");
        if (totalCountEl) totalCountEl.textContent = totalCount;
        const sideCount = $("#sidebarIssueCount");
        if (sideCount) sideCount.textContent = totalCount;

        let pendingCount = 0;
        let progressCount = 0;
        let resolvedCount = 0;
        let verifiedCount = 0;
        let rejectedCount = 0;
        let priorityCount = 0;

        let rowsHtml = "";
        comps.forEach((c) => {
          const catIcons = {
            roads_potholes: "🛣️ Road",
            road: "🛣️ Road",
            streetlights: "💡 Electricity",
            electricity: "💡 Electricity",
            water_supply: "🚰 Water",
            water: "🚰 Water",
            garbage_sanitation: "🗑️ Garbage",
            garbage: "🗑️ Garbage",
            drainage: "🌊 Drainage",
          };
          const catLabel = catIcons[c.category] || `📍 ${c.category || "General"}`;
          const pr = (c.priority_level || c.priority?.level || "MEDIUM").toLowerCase();
          const rawSt = (c.status || "PENDING").toLowerCase();
          let st = "pending";
          let badgeCls = "pending";

          if (rawSt.includes("subm") || rawSt.includes("pend")) {
            st = "pending";
            badgeCls = "pending";
            pendingCount++;
          } else if (rawSt.includes("prog") || rawSt.includes("assign") || rawSt.includes("work")) {
            st = "in progress";
            badgeCls = "progress in-progress";
            progressCount++;
          } else if (rawSt.includes("resolv")) {
            st = "resolved";
            badgeCls = "resolved";
            resolvedCount++;
          } else if (rawSt.includes("verif") || rawSt.includes("close")) {
            st = "verified";
            badgeCls = "verified";
            verifiedCount++;
          } else if (rawSt.includes("reject")) {
            st = "rejected";
            badgeCls = "rejected";
            rejectedCount++;
          } else {
            st = "pending";
            badgeCls = "pending";
            pendingCount++;
          }

          if (pr === "critical" || pr === "high") priorityCount++;

          rowsHtml += `
            <tr data-status="${st}" data-priority="${pr}" data-category="${c.category || 'road'}">
              <td><strong>#${c.complaint_id}</strong></td>
              <td>${c.title}</td>
              <td>${c.user_uid || 'CIT-1001'}</td>
              <td><span class="category-chip">${catLabel}</span></td>
              <td><span class="priority-badge ${pr}">${pr}</span></td>
              <td>${new Date(c.created_at || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
              <td><span class="status-badge ${badgeCls}">${st}</span></td>
              <td><button class="view-issue-btn" type="button" data-issue-id="${c.complaint_id}" title="View Details">👁</button></td>
            </tr>
          `;
        });

        if (tableBody) {
          tableBody.innerHTML = rowsHtml;
          translatePage(currentLanguage());
        }

        const qPending = $("#queuePendingCount");
        const qProg = $("#queueProgressCount");
        const qRes = $("#queueResolvedCount");
        const qVer = $("#queueVerifiedCount");
        const qRej = $("#queueRejectedCount");
        const qPriority = $("#queuePriorityCount");
        if (qPending) qPending.textContent = pendingCount;
        if (qProg) qProg.textContent = progressCount;
        if (qRes) qRes.textContent = resolvedCount;
        if (qVer) qVer.textContent = verifiedCount;
        if (qRej) qRej.textContent = rejectedCount;
        if (qPriority) qPriority.textContent = priorityCount;
      }
    } catch (_) {}
  }

  loadLiveComplaints();
}

// =========================================================
// SUBMODULE: DEPARTMENTS (DATABASE CONNECTED)
// =========================================================

function setupDepartments() {
  const deptGrid = $("#departmentGrid");
  const searchInput = $("#departmentSearch");
  const statusFilter = $("#deptStatusFilter");
  const sortFilter = $("#deptSortFilter");
  const openAddBtn = $("#openAddDepartment");

  const modal = $("#departmentModal");
  const closeBtn = $("#closeDeptModal");
  const cancelBtn = $("#cancelDeptModal");
  const form = $("#departmentForm");

  // Open Add Modal
  function openAddModal() {
    if (!modal) return;
    const editIdEl = $("#deptEditId");
    if (editIdEl) editIdEl.value = "";
    const titleEl = $("#deptModalTitle");
    if (titleEl) titleEl.textContent = "Add Department";
    const eyeEl = $("#deptModalEyebrow");
    if (eyeEl) eyeEl.textContent = "NEW DEPARTMENT";
    form?.reset();
    if ($("#deptIcon")) $("#deptIcon").value = "🏛️";
    if ($("#deptStatus")) $("#deptStatus").value = "ACTIVE";
    if ($("#deptStaff")) $("#deptStaff").value = "25";
    if ($("#deptSlaHours")) $("#deptSlaHours").value = "24";
    if ($("#deptBudget")) $("#deptBudget").value = "₹30.0 L";
    if ($("#deptCoverage")) $("#deptCoverage").value = "All 67 Wards";
    modal.hidden = false;
  }

  // Open Edit Modal
  window.openEditDepartmentModal = async function(deptId) {
    if (!modal) return;
    let dept = null;
    if (window.CivicBuzzAPI?.deptStore?.getById) {
      dept = window.CivicBuzzAPI.deptStore.getById(deptId);
    }
    if (!dept && window.DepartmentStore?.getById) {
      dept = window.DepartmentStore.getById(deptId);
    }
    if (!dept) return;

    if ($("#deptEditId")) $("#deptEditId").value = dept.id || deptId;
    if ($("#deptModalTitle")) $("#deptModalTitle").textContent = "Edit Department";
    if ($("#deptModalEyebrow")) $("#deptModalEyebrow").textContent = "MANAGE DEPARTMENT";
    
    if ($("#deptName")) $("#deptName").value = dept.name || "";
    if ($("#deptCode")) $("#deptCode").value = dept.code || "";
    if ($("#deptIcon")) $("#deptIcon").value = dept.icon || "🏛️";
    if ($("#deptStatus")) $("#deptStatus").value = dept.status || "ACTIVE";
    if ($("#deptHead")) $("#deptHead").value = dept.head_name || dept.head || "";
    if ($("#deptHeadTitle")) $("#deptHeadTitle").value = dept.head_title || "";
    if ($("#deptEmail")) $("#deptEmail").value = dept.email || "";
    if ($("#deptPhone")) $("#deptPhone").value = dept.phone || "";
    if ($("#deptStaff")) $("#deptStaff").value = dept.staff_count || 20;
    if ($("#deptSlaHours")) $("#deptSlaHours").value = dept.sla_hours || 24;
    if ($("#deptBudget")) $("#deptBudget").value = dept.budget_allocated || "₹25.0 L";
    if ($("#deptCoverage")) $("#deptCoverage").value = dept.ward_coverage || "All Wards";
    if ($("#deptDesc")) $("#deptDesc").value = dept.description || dept.desc || "";

    modal.hidden = false;
  };

  // Delete Department
  window.handleDeleteDepartment = async function(deptId, deptName) {
    if (!confirm(`Are you sure you want to remove the department "${deptName}"? This will reassign any linked active complaints.`)) {
      return;
    }
    if (window.CivicBuzzAPI?.admin?.deleteDepartment) {
      await window.CivicBuzzAPI.admin.deleteDepartment(deptId);
    } else if (window.DepartmentStore?.delete) {
      window.DepartmentStore.delete(deptId);
    }
    showToast(`Department "${deptName}" removed.`);
    loadLiveDepartments();
  };

  // Jump to Issue Queue with this department filter
  window.filterGrievanceQueueByDept = function(deptCode) {
    if (typeof showSection === "function") {
      showSection("issuequeue");
    }
    const qInput = $("#issueSearch");
    if (qInput) {
      qInput.value = deptCode;
      qInput.dispatchEvent(new Event("input"));
    }
    showToast(`Filtered Issue Queue by ${deptCode}.`);
  };

  function closeModal() {
    if (modal) modal.hidden = true;
  }

  openAddBtn?.addEventListener("click", openAddModal);
  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);

  // Form Submit (Add or Update)
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const editId = $("#deptEditId")?.value.trim();
    const name = $("#deptName")?.value.trim();
    const code = $("#deptCode")?.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "_");
    const icon = $("#deptIcon")?.value || "🏛️";
    const status = $("#deptStatus")?.value || "ACTIVE";
    const headName = $("#deptHead")?.value.trim();
    const headTitle = $("#deptHeadTitle")?.value.trim() || "Department Head";
    const email = $("#deptEmail")?.value.trim();
    const phone = $("#deptPhone")?.value.trim();
    const staffCount = Number($("#deptStaff")?.value) || 20;
    const slaHours = Number($("#deptSlaHours")?.value) || 24;
    const budget = $("#deptBudget")?.value.trim() || "₹25.0 L";
    const coverage = $("#deptCoverage")?.value.trim() || "All Wards";
    const desc = $("#deptDesc")?.value.trim() || "Municipal department handling civic operations.";

    const payload = {
      name,
      code,
      icon,
      status,
      head_name: headName,
      head_title: headTitle,
      email,
      phone,
      staff_count: staffCount,
      sla_hours: slaHours,
      budget_allocated: budget,
      ward_coverage: coverage,
      description: desc
    };

    if (editId) {
      if (window.CivicBuzzAPI?.admin?.updateDepartment) {
        await window.CivicBuzzAPI.admin.updateDepartment(editId, payload);
      } else if (window.DepartmentStore?.update) {
        window.DepartmentStore.update(editId, payload);
      }
      showToast(`Department "${name}" updated successfully.`);
    } else {
      if (window.CivicBuzzAPI?.admin?.createDepartment) {
        await window.CivicBuzzAPI.admin.createDepartment(payload);
      } else if (window.DepartmentStore?.add) {
        window.DepartmentStore.add(payload);
      }
      showToast(`New department "${name}" registered in database.`);
    }

    closeModal();
    form.reset();
    loadLiveDepartments();
  });

  // Load & Render Departments from DB/Store with instant 0ms pre-render
  function renderDeptData(depts) {
    if (!deptGrid) return;
    const complaints = window.ComplaintStore?.getAll ? window.ComplaintStore.getAll() : [];

    // KPI Metrics calculation
    const totalDepts = depts.length;
    const activeDepts = depts.filter(d => (d.status || "").toUpperCase() === "ACTIVE").length;
    const totalStaff = depts.reduce((acc, d) => acc + (Number(d.staff_count) || 0), 0);
    
    const openAssigned = complaints.filter(c => {
      const st = (c.status || "").toUpperCase();
      return ["SUBMITTED", "PENDING", "ASSIGNED", "IN_PROGRESS", "PROGRESS"].includes(st);
    }).length;

    const statTot = $("#deptStatTotal");
    const statAct = $("#deptStatActive");
    const statStf = $("#deptStatStaff");
    const statOpn = $("#deptStatOpenIssues");

    if (statTot) statTot.textContent = totalDepts;
    if (statAct) statAct.textContent = activeDepts;
    if (statStf) statStf.textContent = totalStaff;
    if (statOpn) statOpn.textContent = openAssigned;

    // Filter & Sort
    const query = (searchInput?.value || "").toLowerCase().trim();
    const statusVal = statusFilter?.value || "ALL";
    const sortVal = sortFilter?.value || "name";

    let filtered = depts.filter(d => {
      const matchQuery = !query || 
        (d.name || "").toLowerCase().includes(query) ||
        (d.code || "").toLowerCase().includes(query) ||
        (d.head_name || "").toLowerCase().includes(query) ||
        (d.email || "").toLowerCase().includes(query) ||
        (d.description || "").toLowerCase().includes(query);

      const matchStatus = statusVal === "ALL" || (d.status || "").toUpperCase() === statusVal;
      return matchQuery && matchStatus;
    });

    if (sortVal === "name") {
      filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortVal === "open") {
      filtered.sort((a, b) => {
        const countA = complaints.filter(c => (c.department_code || "").toUpperCase() === (a.code || "").toUpperCase()).length;
        const countB = complaints.filter(c => (c.department_code || "").toUpperCase() === (b.code || "").toUpperCase()).length;
        return countB - countA;
      });
    } else if (sortVal === "staff") {
      filtered.sort((a, b) => (Number(b.staff_count) || 0) - (Number(a.staff_count) || 0));
    } else if (sortVal === "rating") {
      filtered.sort((a, b) => (Number(b.performance_rating) || 90) - (Number(a.performance_rating) || 90));
    }

    if (filtered.length === 0) {
      deptGrid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:40px 20px; background:var(--surface); border:1px dashed var(--border); border-radius:12px;">
          <span style="font-size:32px;">🔍</span>
          <h3 style="margin:10px 0 4px; color:var(--ink);" data-i18n="No matching departments found">No matching departments found</h3>
          <p style="color:var(--muted); font-size:13px;" data-i18n="Try adjusting your search query or status filter.">Try adjusting your search query or status filter.</p>
        </div>
      `;
      return;
    }

    let cardsHtml = "";
    filtered.forEach(d => {
      const deptCodeClean = (d.code || "").toUpperCase();
      const deptCategoryClean = (d.category_key || "").toLowerCase();

      const deptComps = complaints.filter(c => {
        const cDeptCode = (c.department_code || "").toUpperCase();
        const cCat = (c.category || "").toLowerCase();
        return cDeptCode === deptCodeClean || cCat === deptCategoryClean || (c.department_name && c.department_name.toLowerCase().includes(d.name.toLowerCase()));
      });

      const openCount = deptComps.filter(c => {
        const st = (c.status || "").toUpperCase();
        return ["SUBMITTED", "PENDING", "ASSIGNED", "IN_PROGRESS", "PROGRESS"].includes(st);
      }).length;

      const resolvedCount = deptComps.filter(c => {
        const st = (c.status || "").toUpperCase();
        return ["RESOLVED", "VERIFIED", "CLOSED"].includes(st);
      }).length;

      const totalCount = deptComps.length;
      const perfRating = d.performance_rating || (totalCount > 0 ? Math.min(100, Math.round((resolvedCount / Math.max(1, totalCount)) * 100 + 40)) : 95);

      const stUpper = (d.status || "ACTIVE").toUpperCase();
      let badgeHtml = '<span class="badge-active">Active</span>';
      if (stUpper === "UNDERSTAFFED") {
        badgeHtml = '<span class="badge-warning">Understaffed</span>';
      } else if (stUpper === "STANDBY") {
        badgeHtml = '<span class="badge-standby">Standby</span>';
      }

      cardsHtml += `
        <article class="dept-card" data-dept-id="${d.id || d.code}">
          <div class="card-topline">
            <div class="dept-icon-wrapper">
              <span class="dept-icon">${d.icon || '🏛️'}</span>
              <div>
                <span class="dept-code-tag">${d.code || 'DEPT'}</span>
              </div>
            </div>
            ${badgeHtml}
          </div>

          <h3>${d.name}</h3>
          <p class="dept-desc">${d.description || 'Municipal department managing civic operations and grievance resolutions.'}</p>

          <div class="dept-meta">
            <div>
              <strong>Head of Dept:</strong>
              <span>${d.head_name || 'Officer in Charge'} <small style="color:var(--muted);font-weight:normal;">(${d.head_title || 'Chief'})</small></span>
            </div>
            <div>
              <strong>Official Email:</strong>
              <span><a href="mailto:${d.email || 'info@civicbuzz.gov.in'}">${d.email || 'info@civicbuzz.gov.in'}</a></span>
            </div>
            <div>
              <strong>Contact Phone:</strong>
              <span><a href="tel:${d.phone || '+916742534400'}">${d.phone || '+91 674 253 4400'}</a></span>
            </div>
            <div>
              <strong>Staff & Coverage:</strong>
              <span>${d.staff_count || 20} Staff · ${d.ward_coverage || 'All Wards'}</span>
            </div>
          </div>

          <div class="dept-sla-box">
            <div class="sla-labels">
              <span>SLA Target: ${d.sla_hours || 24}h</span>
              <span style="color:var(--green);">${perfRating}% SLA Adherence</span>
            </div>
            <div class="sla-progress-track">
              <div class="sla-progress-fill" style="width:${perfRating}%;"></div>
            </div>
          </div>

          <div class="dept-footer">
            <span><strong>${openCount}</strong> open ${openCount === 1 ? 'grievance' : 'grievances'}</span>
            <div class="dept-actions">
              <button class="dept-btn primary" onclick="window.filterGrievanceQueueByDept('${d.code || d.name}')" title="View Assigned Issues">📋 Queue</button>
              <button class="dept-btn" onclick="window.openEditDepartmentModal('${d.id || d.code}')" title="Edit Department Details">✏️ Edit</button>
              <button class="dept-btn danger" onclick="window.handleDeleteDepartment('${d.id || d.code}', '${d.name.replace(/'/g, "\\'")}')" title="Delete Department">🗑️</button>
            </div>
          </div>
        </article>
      `;
    });

    deptGrid.innerHTML = cardsHtml;
    translatePage(currentLanguage());
  }

  // Load & Render Departments with 0ms instant render & background sync
  function loadLiveDepartments() {
    if (!deptGrid) return;

    // 1. Instant Synchronous Render (0ms) from local store
    const localDepts = window.DepartmentStore?.getAll ? window.DepartmentStore.getAll() : [];
    renderDeptData(localDepts);

    // 2. Non-blocking Background API Sync
    if (window.CivicBuzzAPI?.admin?.listDepartments) {
      window.CivicBuzzAPI.admin.listDepartments().then((res) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          renderDeptData(res.data);
        }
      }).catch(() => {});
    }
  }

  // ---- Search Advice & Autocomplete Suggestions Dropdown ----
  const suggestionsBox = $("#deptSearchSuggestions");

  function escapeLocalHTML(val) {
    const div = document.createElement("div");
    div.textContent = val || "";
    return div.innerHTML;
  }

  function renderSuggestions(query) {
    if (!suggestionsBox) return;
    const cleanQ = (query || "").trim().toLowerCase();

    if (!cleanQ || cleanQ.length === 0) {
      suggestionsBox.hidden = true;
      suggestionsBox.innerHTML = "";
      return;
    }

    const depts = window.DepartmentStore?.getAll ? window.DepartmentStore.getAll() : [];
    
    // Match departments on Name, Code, Head, Scope description, or Email
    const matches = depts.filter(d => {
      const name = (d.name || "").toLowerCase();
      const code = (d.code || "").toLowerCase();
      const head = (d.head_name || "").toLowerCase();
      const desc = (d.description || "").toLowerCase();
      const email = (d.email || "").toLowerCase();
      const coverage = (d.ward_coverage || "").toLowerCase();
      return name.includes(cleanQ) || code.includes(cleanQ) || head.includes(cleanQ) || desc.includes(cleanQ) || email.includes(cleanQ) || coverage.includes(cleanQ);
    });

    if (matches.length === 0) {
      suggestionsBox.innerHTML = `
        <div style="padding:10px 14px; color:var(--muted); font-size:12px; text-align:center;">
          No department found matching "<strong>${escapeLocalHTML(cleanQ)}</strong>"
        </div>
      `;
      suggestionsBox.hidden = false;
      return;
    }

    let suggestHtml = `<div class="suggest-header">Matching Departments (${matches.length})</div>`;
    matches.slice(0, 5).forEach((d) => {
      const isAct = (d.status || "ACTIVE").toUpperCase() === "ACTIVE";
      const badgeClass = isAct ? "badge-active" : (d.status === "UNDERSTAFFED" ? "badge-warning" : "badge-standby");
      
      const highlight = (text, term) => {
        if (!text) return "";
        const idx = text.toLowerCase().indexOf(term);
        if (idx === -1) return escapeLocalHTML(text);
        const before = text.substring(0, idx);
        const match = text.substring(idx, idx + term.length);
        const after = text.substring(idx + term.length);
        return `${escapeLocalHTML(before)}<mark style="background:rgba(47,110,232,0.25); color:inherit; font-weight:800; border-radius:2px; padding:0 2px;">${escapeLocalHTML(match)}</mark>${escapeLocalHTML(after)}`;
      };

      suggestHtml += `
        <div class="dept-suggest-item" data-dept-id="${d.id || d.code}" data-dept-name="${escapeLocalHTML(d.name || '')}">
          <div class="suggest-left">
            <span class="suggest-icon">${d.icon || '🏛️'}</span>
            <div class="suggest-info">
              <strong>${highlight(d.name || '', cleanQ)}</strong>
              <small>Head: ${highlight(d.head_name || 'In-Charge', cleanQ)} · ${d.staff_count || 20} Staff</small>
            </div>
          </div>
          <span class="suggest-badge ${badgeClass}" style="font-size:10px;">${d.status || 'Active'}</span>
        </div>
      `;
    });

    suggestionsBox.innerHTML = suggestHtml;
    suggestionsBox.hidden = false;

    // Click on advice suggestion
    $$(".dept-suggest-item", suggestionsBox).forEach((item) => {
      item.addEventListener("click", () => {
        const deptName = item.getAttribute("data-dept-name");
        const deptId = item.getAttribute("data-dept-id");
        if (searchInput) {
          searchInput.value = deptName;
        }
        suggestionsBox.hidden = true;
        loadLiveDepartments();

        // Smoothly focus & pulse highlight the matching department card
        setTimeout(() => {
          const targetCard = $(`article.dept-card[data-dept-id="${deptId}"]`);
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
            targetCard.classList.remove("highlight-pulse");
            void targetCard.offsetWidth;
            targetCard.classList.add("highlight-pulse");
          }
        }, 120);
      });
    });
  }

  // Event Listeners for Search Advice & Filters
  searchInput?.addEventListener("input", (e) => {
    renderSuggestions(e.target.value);
    loadLiveDepartments();
  });

  searchInput?.addEventListener("focus", (e) => {
    if (e.target.value.trim().length > 0) {
      renderSuggestions(e.target.value);
    }
  });

  statusFilter?.addEventListener("change", () => loadLiveDepartments());
  sortFilter?.addEventListener("change", () => loadLiveDepartments());

  // Close suggestions dropdown when clicking outside or pressing Escape
  document.addEventListener("click", (e) => {
    if (!searchInput?.contains(e.target) && !suggestionsBox?.contains(e.target)) {
      if (suggestionsBox) suggestionsBox.hidden = true;
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && suggestionsBox && !suggestionsBox.hidden) {
      suggestionsBox.hidden = true;
    }
  });

  // Listen for cross-tab or data updates
  window.addEventListener("civicbuzz:departments_changed", () => loadLiveDepartments());
  window.addEventListener("civicbuzz:complaints_changed", () => loadLiveDepartments());

  // Initial load
  loadLiveDepartments();
}

// =========================================================
// SUBMODULE: BUDGETING & TENDERS (DATABASE CONNECTED)
// =========================================================

function setupBudgeting() {
  const tenderTrack = $("#tenderTrack");
  const filterBtns = $$("#statusFilters .filter-button");
  const searchInput = $("#tenderSearch");
  const modal = $("#tenderModal");
  const openBtn = $("#openTenderModal");
  const closeBtn = $("#closeTenderModal");
  const cancelBtn = $("#cancelTenderModal");
  const form = $("#tenderForm");
  const lifecycleTrack = $("#tenderLifecycleTrack");
  const selectedBadge = $("#selectedTenderBadge");

  let activeTenderId = "CB-T-0015";
  let activeFilter = "all";

  // Helper format budget to INR
  function formatINR(val) {
    const num = Number(val) || 0;
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
    return `₹${num.toLocaleString("en-IN")}`;
  }

  // Open Add Modal
  function openAddModal() {
    if (!modal) return;
    const editIdEl = $("#tenderEditId");
    if (editIdEl) editIdEl.value = "";
    const titleEl = $("#tenderModalTitle");
    if (titleEl) titleEl.textContent = "Add Tender";
    const eyeEl = $("#tenderModalEyebrow");
    if (eyeEl) eyeEl.textContent = "NEW PROJECT";
    form?.reset();

    const d = new Date();
    d.setDate(d.getDate() + 30);
    if ($("#tenderDeadline")) $("#tenderDeadline").value = d.toISOString().slice(0, 10);
    if ($("#tenderBudget")) $("#tenderBudget").value = "2500000";
    if ($("#tenderWard")) $("#tenderWard").value = "15";
    if ($("#tenderProgress")) $("#tenderProgress").value = "20";
    if ($("#tenderStatus")) $("#tenderStatus").value = "PUBLISHED";
    modal.hidden = false;
  }

  // Open Edit Modal
  window.openEditTenderModal = function(tenderId) {
    if (!modal) return;
    let tender = null;
    if (window.CivicBuzzAPI?.tenderStore?.getById) {
      tender = window.CivicBuzzAPI.tenderStore.getById(tenderId);
    }
    if (!tender && window.TenderStore?.getById) {
      tender = window.TenderStore.getById(tenderId);
    }
    if (!tender) return;

    if ($("#tenderEditId")) $("#tenderEditId").value = tender.tender_id || tenderId;
    if ($("#tenderModalTitle")) $("#tenderModalTitle").textContent = "Edit Tender";
    if ($("#tenderModalEyebrow")) $("#tenderModalEyebrow").textContent = "MANAGE PROJECT";

    if ($("#tenderTitle")) $("#tenderTitle").value = tender.title || "";
    if ($("#tenderCategory")) $("#tenderCategory").value = tender.category || "roads_potholes";
    if ($("#tenderStatus")) $("#tenderStatus").value = (tender.status || "PUBLISHED").toUpperCase();
    if ($("#tenderWard")) $("#tenderWard").value = tender.ward_id || 15;
    if ($("#tenderLocation")) $("#tenderLocation").value = tender.location || "";
    if ($("#tenderBudget")) $("#tenderBudget").value = tender.estimated_budget || 250000;
    if ($("#tenderContractor")) $("#tenderContractor").value = tender.contractor_name || "";
    if ($("#tenderProgress")) $("#tenderProgress").value = tender.progress_percentage || 0;
    if ($("#tenderDeadline")) {
      const dl = tender.submission_deadline || tender.target_completion_date;
      $("#tenderDeadline").value = dl ? dl.slice(0, 10) : "";
    }
    if ($("#tenderDesc")) $("#tenderDesc").value = tender.description || "";

    modal.hidden = false;
  };

  // Delete Tender
  window.handleDeleteTender = async function(tenderId, title) {
    if (!confirm(`Are you sure you want to remove the tender "${title}" (${tenderId})?`)) {
      return;
    }
    if (window.CivicBuzzAPI?.admin?.deleteTender) {
      await window.CivicBuzzAPI.admin.deleteTender(tenderId);
    } else if (window.TenderStore?.delete) {
      window.TenderStore.delete(tenderId);
    }
    showToast(`Tender ${tenderId} removed.`);
    loadLiveTenders();
  };

  function closeModal() {
    if (modal) modal.hidden = true;
  }

  openBtn?.addEventListener("click", openAddModal);
  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);

  // Form Submit (Add or Update)
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const editId = $("#tenderEditId")?.value.trim();
    const title = $("#tenderTitle")?.value.trim();
    const category = $("#tenderCategory")?.value || "roads_potholes";
    const status = ($("#tenderStatus")?.value || "PUBLISHED").toUpperCase();
    const ward = Number($("#tenderWard")?.value) || 15;
    const location = $("#tenderLocation")?.value.trim() || `Ward ${ward}`;
    const budget = Number($("#tenderBudget")?.value) || 250000;
    const deadline = $("#tenderDeadline")?.value;
    const contractor = $("#tenderContractor")?.value.trim() || "TBD (Under Bidding)";
    const progress = Number($("#tenderProgress")?.value) || (status === "COMPLETED" ? 100 : 20);
    const desc = $("#tenderDesc")?.value.trim() || "Civic infrastructure project generated from verified citizen clusters.";

    const payload = {
      title,
      category,
      status,
      ward_id: ward,
      location,
      estimated_budget: budget,
      submission_deadline: deadline,
      target_completion_date: deadline,
      contractor_name: contractor,
      progress_percentage: progress,
      description: desc
    };

    if (editId) {
      if (window.CivicBuzzAPI?.admin?.updateTender) {
        await window.CivicBuzzAPI.admin.updateTender(editId, payload);
      } else if (window.TenderStore?.update) {
        window.TenderStore.update(editId, payload);
      }
      showToast(`Tender "${title}" updated successfully.`);
    } else {
      if (window.CivicBuzzAPI?.admin?.createTender) {
        await window.CivicBuzzAPI.admin.createTender(payload);
      } else if (window.TenderStore?.add) {
        window.TenderStore.add(payload);
      }
      showToast(`Tender "${title}" published in database.`);
    }

    closeModal();
    form.reset();
    loadLiveTenders();
  });

  // Load & Render Tenders from DB/Store
  async function loadLiveTenders() {
    if (!tenderTrack) return;

    let tenders = [];
    if (window.CivicBuzzAPI?.tenders?.list) {
      try {
        const res = await window.CivicBuzzAPI.tenders.list();
        if (res && res.data && Array.isArray(res.data)) {
          tenders = res.data;
        }
      } catch (_) {}
    }
    if (!tenders || tenders.length === 0) {
      tenders = window.TenderStore?.getAll ? window.TenderStore.getAll() : [];
    }

    // KPI Metrics calculation
    const openCount = tenders.filter(t => (t.status || "").toUpperCase() === "PUBLISHED").length;
    const draftCount = tenders.filter(t => (t.status || "").toUpperCase() === "DRAFT").length;
    const inProgressCount = tenders.filter(t => (t.status || "").toUpperCase() === "IN_PROGRESS").length;
    const totalAllocated = tenders.reduce((acc, t) => acc + (Number(t.estimated_budget) || 0), 0);

    const statOpn = $("#budgetStatOpen");
    const statDrf = $("#budgetStatDraft");
    const statAlc = $("#budgetStatAllocated");
    const statPrg = $("#budgetStatProgress");

    if (statOpn) statOpn.textContent = openCount;
    if (statDrf) statDrf.textContent = draftCount;
    if (statAlc) statAlc.textContent = formatINR(totalAllocated);
    if (statPrg) statPrg.textContent = inProgressCount;

    // Filter & Search
    const query = (searchInput?.value || "").toLowerCase().trim();
    const filtered = tenders.filter(t => {
      const matchQuery = !query ||
        (t.title || "").toLowerCase().includes(query) ||
        (t.tender_id || "").toLowerCase().includes(query) ||
        (t.location || "").toLowerCase().includes(query) ||
        (t.contractor_name || "").toLowerCase().includes(query) ||
        (t.description || "").toLowerCase().includes(query);

      const st = (t.status || "PUBLISHED").toUpperCase();
      const matchFilter = activeFilter === "all" || st === activeFilter.toUpperCase();
      return matchQuery && matchFilter;
    });

    if (filtered.length === 0) {
      tenderTrack.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:40px 20px; background:var(--surface); border:1px dashed var(--border); border-radius:12px;">
          <span style="font-size:32px;">📑</span>
          <h3 style="margin:10px 0 4px; color:var(--ink);" data-i18n="No matching tenders found">No matching tenders found</h3>
          <p style="color:var(--muted); font-size:13px;" data-i18n="Try adjusting your filter or search query.">Try adjusting your filter or search query.</p>
        </div>
      `;
      renderLifecyclePipeline(activeTenderId);
      return;
    }

    let cardsHtml = "";
    filtered.forEach(t => {
      const rawSt = (t.status || "PUBLISHED").toUpperCase();
      const stClass = rawSt.toLowerCase();
      const isSelected = t.tender_id === activeTenderId;
      const progress = Number(t.progress_percentage) || 10;
      const budgetFormatted = formatINR(t.estimated_budget);
      const deadline = t.submission_deadline || t.target_completion_date || "24 Aug 2026";

      cardsHtml += `
        <article class="tender-card" data-status="${stClass}" data-tender-id="${t.tender_id}">
          <div class="card-topline">
            <span class="status-badge-sm ${stClass}">${rawSt.replace('_', ' ')}</span>
            <span class="tender-id">${t.tender_id}</span>
          </div>
          <h3>${t.title}</h3>
          <p class="card-description">${t.description || 'Civic works project generated from verified citizen grievance clusters.'}</p>
          <div class="card-meta">
            <span>📍 ${t.location || `Ward ${t.ward_id || 15}`}</span>
            <span>✓ ${t.verified_locations_count || 6} verified complaints</span>
          </div>
          <div class="budget-row">
            <div>
              <span>Estimated budget</span>
              <strong>${budgetFormatted}</strong>
            </div>
            <div>
              <span>${rawSt === 'COMPLETED' ? 'Completed date' : 'Target deadline'}</span>
              <strong>${deadline}</strong>
            </div>
          </div>
          <div class="mini-progress"><span style="width:${progress}%"></span></div>
          <p class="progress-label">Work progress · ${progress}% · ${t.contractor_name || 'Bidding open'}</p>
          <div class="tender-actions">
            <button class="dept-btn primary" onclick="window.openEditTenderModal('${t.tender_id}')" title="Edit Tender Details">✏️ Edit</button>
            <button class="dept-btn danger" onclick="window.handleDeleteTender('${t.tender_id}', '${t.title.replace(/'/g, "\\'")}')" title="Delete Tender">🗑️ Delete</button>
          </div>
        </article>
      `;
    });

    tenderTrack.innerHTML = cardsHtml;
    translatePage(currentLanguage());
  }

  // Filter Buttons Handler
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter || "all";
      loadLiveTenders();
    });
  });

  // Search Input Handler
  searchInput?.addEventListener("input", () => loadLiveTenders());

  // Listen for Cross-Tab Updates
  window.addEventListener("civicbuzz:tenders_changed", () => loadLiveTenders());
  window.addEventListener("storage", (e) => {
    if (e.key === "civicbuzz_tenders") loadLiveTenders();
  });

  // Initial Load
  loadLiveTenders();
}

// =========================================================
// SUBMODULE: LIVE BHUBANESWAR GIS ISSUE MAP
// =========================================================

const BHUBANESWAR_CENTER = [20.2961, 85.8245];
let adminLiveMap = null;
let adminMapMarkersLayer = null;

const BHUBANESWAR_LOCATIONS_MAP = {
  patia: [20.3533, 85.8189],
  kiit: [20.3533, 85.8189],
  infocity: [20.3548, 85.8184],
  "saheed nagar": [20.2905, 85.8450],
  "jayadev vihar": [20.3015, 85.8235],
  "master canteen": [20.2650, 85.8390],
  rasulgarh: [20.2950, 85.8650],
  khandagiri: [20.2580, 85.7870],
  nayapalli: [20.2990, 85.8120],
  "old town": [20.2390, 85.8340],
  lingaraj: [20.2390, 85.8340],
  chandrasekharpur: [20.3250, 85.8150],
  kalpana: [20.2570, 85.8440],
  "unit 4": [20.2780, 85.8350],
  baramunda: [20.2790, 85.7920],
  mancheswar: [20.3200, 85.8500],
  "irc village": [20.3060, 85.8170],
  janpath: [20.2860, 85.8410],
  "ashok nagar": [20.2710, 85.8360],
  "bapuji nagar": [20.2630, 85.8320],
  laxmisagar: [20.2720, 85.8580],
  samantarapur: [20.2350, 85.8480],
  tamando: [20.2440, 85.7480],
  dumduma: [20.2490, 85.7830]
};

function getComplaintCoordinates(c) {
  let lat = Number(c.latitude || c.location?.latitude || (c.location_point?.coordinates ? c.location_point.coordinates[1] : 0));
  let lng = Number(c.longitude || c.location?.longitude || (c.location_point?.coordinates ? c.location_point.coordinates[0] : 0));

  if (lat && lng && !isNaN(lat) && !isNaN(lng) && lat >= 20.15 && lat <= 20.45 && lng >= 85.65 && lng <= 85.95) {
    return [lat, lng];
  }

  const text = `${c.location?.address || ""} ${c.location?.ward_name || ""} ${c.ward || ""} ${c.title || ""}`.toLowerCase();
  for (const [key, coords] of Object.entries(BHUBANESWAR_LOCATIONS_MAP)) {
    if (text.includes(key)) {
      const hash = String(c.complaint_id || "").split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      const jitterLat = ((hash % 10) - 5) * 0.0015;
      const jitterLng = (((hash >> 2) % 10) - 5) * 0.0015;
      return [coords[0] + jitterLat, coords[1] + jitterLng];
    }
  }

  const seed = String(c.complaint_id || c.title || "bhub").split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const offsetLat = (((seed % 20) - 10) / 10) * 0.035;
  const offsetLng = ((((seed >> 2) % 20) - 10) / 10) * 0.035;
  return [BHUBANESWAR_CENTER[0] + offsetLat, BHUBANESWAR_CENTER[1] + offsetLng];
}

function initAdminLiveMap() {
  const mapEl = document.getElementById("adminLiveIssueMap");
  if (!mapEl || typeof L === "undefined") return;

  if (adminLiveMap) {
    adminLiveMap.invalidateSize();
    renderAdminMapIssues();
    return;
  }

  try {
    adminLiveMap = L.map("adminLiveIssueMap", {
      center: BHUBANESWAR_CENTER,
      zoom: 12.5,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19
    }).addTo(adminLiveMap);

    adminMapMarkersLayer = L.layerGroup().addTo(adminLiveMap);

    // Recenter Button
    const recenterBtn = document.getElementById("adminMapRecenterBtn");
    if (recenterBtn) {
      recenterBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (adminLiveMap) {
          adminLiveMap.flyTo(BHUBANESWAR_CENTER, 13, { duration: 1 });
          showToast("Recentered to Bhubaneswar City Center.");
        }
      });
    }

    renderAdminMapIssues();

    // Map sizing fix on load
    setTimeout(() => {
      if (adminLiveMap) adminLiveMap.invalidateSize();
    }, 400);

    window.addEventListener("resize", () => {
      if (adminLiveMap) adminLiveMap.invalidateSize();
    });
  } catch (err) {
    console.warn("Live issue map init notice:", err);
  }
}

function renderAdminMapIssues() {
  if (!adminLiveMap || !adminMapMarkersLayer || typeof L === "undefined") return;

  adminMapMarkersLayer.clearLayers();

  let complaints = [];
  if (window.CivicBuzzAPI?.store?.getAll) {
    complaints = window.CivicBuzzAPI.store.getAll();
  }

  if (!complaints || complaints.length === 0) {
    complaints = [
      {
        complaint_id: "CB-BHUB-1042",
        title: "Deep crater-sized pothole near KIIT Square",
        category: "roads_potholes",
        priority_level: "CRITICAL",
        status: "IN_PROGRESS",
        location: { ward_name: "Ward 1 (Patia & KIIT)", address: "KIIT Square, Patia Main Road, Bhubaneswar" },
        latitude: 20.3533,
        longitude: 85.8189
      },
      {
        complaint_id: "CB-BHUB-1043",
        title: "Blocked stormwater drain causing waterlogging",
        category: "drainage",
        priority_level: "HIGH",
        status: "SUBMITTED",
        location: { ward_name: "Ward 2 (Patia Corridor)", address: "Near Infocity Square, Patia" },
        latitude: 20.3548,
        longitude: 85.8184
      },
      {
        complaint_id: "CB-BHUB-1044",
        title: "Broken high-mast streetlight pole",
        category: "streetlights",
        priority_level: "HIGH",
        status: "RESOLVED",
        location: { ward_name: "Ward 7 (Saheed Nagar)", address: "Saheed Nagar Main Market" },
        latitude: 20.2905,
        longitude: 85.8450
      },
      {
        complaint_id: "CB-BHUB-1045",
        title: "Garbage pile overflow near Jayadev Vihar flyover",
        category: "garbage_sanitation",
        priority_level: "CRITICAL",
        status: "IN_PROGRESS",
        location: { ward_name: "Ward 4 (Jayadev Vihar)", address: "Jayadev Vihar Overbridge Junction" },
        latitude: 20.3015,
        longitude: 85.8235
      },
      {
        complaint_id: "CB-BHUB-1046",
        title: "Drinking water pipeline burst near Master Canteen",
        category: "water_supply",
        priority_level: "CRITICAL",
        status: "SUBMITTED",
        location: { ward_name: "Ward 11 (Master Canteen)", address: "Master Canteen Chowk" },
        latitude: 20.2650,
        longitude: 85.8390
      },
      {
        complaint_id: "CB-BHUB-1047",
        title: "Industrial sewage overflow into open drain",
        category: "drainage",
        priority_level: "HIGH",
        status: "IN_PROGRESS",
        location: { ward_name: "Ward 6 (Rasulgarh)", address: "Rasulgarh Industrial Area" },
        latitude: 20.2950,
        longitude: 85.8650
      },
      {
        complaint_id: "CB-BHUB-1048",
        title: "Road erosion along Khandagiri tourist corridor",
        category: "roads_potholes",
        priority_level: "MEDIUM",
        status: "SUBMITTED",
        location: { ward_name: "Ward 15 (Khandagiri)", address: "Khandagiri Caves Entry Road" },
        latitude: 20.2580,
        longitude: 85.7870
      },
      {
        complaint_id: "CB-BHUB-1049",
        title: "Dead tree branch hazard on overhead powerline",
        category: "streetlights",
        priority_level: "HIGH",
        status: "RESOLVED",
        location: { ward_name: "Ward 5 (Nayapalli)", address: "Nayapalli Behera Sahi" },
        latitude: 20.2990,
        longitude: 85.8120
      },
      {
        complaint_id: "CB-BHUB-1050",
        title: "Sanitation waste accumulation near temple perimeter",
        category: "garbage_sanitation",
        priority_level: "MEDIUM",
        status: "RESOLVED",
        location: { ward_name: "Ward 18 (Old Town)", address: "Old Town Lingaraj Temple North Gate" },
        latitude: 20.2390,
        longitude: 85.8340
      }
    ];
  }

  let urgentCount = 0;
  let openCount = 0;
  let resolvedCount = 0;

  const catMap = {
    roads_potholes: { icon: "⌁", label: "Roads & Potholes" },
    road: { icon: "⌁", label: "Roads & Potholes" },
    potholes: { icon: "⌁", label: "Roads & Potholes" },
    garbage_sanitation: { icon: "♜", label: "Sanitation" },
    garbage: { icon: "♜", label: "Sanitation" },
    sanitation: { icon: "♜", label: "Sanitation" },
    water_supply: { icon: "◒", label: "Water Supply" },
    water: { icon: "◒", label: "Water Supply" },
    streetlights: { icon: "☼", label: "Street Lighting" },
    electricity: { icon: "☼", label: "Street Lighting" },
    drainage: { icon: "🌊", label: "Drainage & Sewerage" }
  };

  complaints.forEach((c) => {
    const coords = getComplaintCoordinates(c);
    const pr = String(c.priority_level || c.priority?.level || "MEDIUM").toUpperCase();
    const st = String(c.status || "PENDING").toUpperCase();
    const isOverdue = Boolean(c.is_overdue);

    let pinClass = "pin-open";
    let statusClass = "status-open";

    if (st === "RESOLVED") {
      resolvedCount++;
      pinClass = "pin-resolved";
      statusClass = "status-resolved";
    } else if (pr === "CRITICAL" || isOverdue || pr === "HIGH") {
      urgentCount++;
      pinClass = "pin-urgent";
      statusClass = "status-urgent";
    } else {
      openCount++;
      pinClass = "pin-open";
      statusClass = "status-open";
    }

    const catInfo = catMap[c.category] || { icon: "●", label: "Civic Issue" };
    const locName = c.location?.address || c.location?.ward_name || c.ward || "Bhubaneswar";
    const cid = String(c.complaint_id || "CB-1000");

    const markerIcon = L.divIcon({
      className: "admin-leaflet-marker-wrap",
      html: `<div class="admin-map-pin ${pinClass}" data-id="${cid}" title="${c.title || 'Civic Issue'}"><span class="pin-inner-icon">${catInfo.icon}</span></div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -24]
    });

    const popupHtml = `
      <div class="admin-popup-card">
        <div class="admin-popup-header">
          <span class="admin-popup-category">${catInfo.icon} ${catInfo.label}</span>
          <span class="admin-popup-status ${statusClass}">${st.replace(/_/g, " ")}</span>
        </div>
        <h4 class="admin-popup-title">${c.title || "Civic Grievance"}</h4>
        <p class="admin-popup-location"><i class="fa-solid fa-location-dot"></i> ${locName}</p>
        <div class="admin-popup-footer">
          <span class="admin-popup-id">#${cid}</span>
          <button type="button" class="admin-popup-btn" onclick="window.adminFocusMapComplaint('${cid}')">View in Queue →</button>
        </div>
      </div>
    `;

    const marker = L.marker(coords, { icon: markerIcon });
    marker.bindPopup(popupHtml, { closeButton: false, offset: [0, -6] });
    adminMapMarkersLayer.addLayer(marker);
  });

  // Update counters
  const urgentEl = document.getElementById("mapUrgentCount");
  const openEl = document.getElementById("mapOpenCount");
  const resolvedEl = document.getElementById("mapResolvedCount");
  const totalEl = document.getElementById("mapIssueTotalCount");

  if (urgentEl) urgentEl.textContent = urgentCount;
  if (openEl) openEl.textContent = openCount;
  if (resolvedEl) resolvedEl.textContent = resolvedCount;
  if (totalEl) totalEl.textContent = `${complaints.length} Live Issues`;
}

window.adminFocusMapComplaint = function(cid) {
  showSection("issuequeue");
  showToast(`Viewing complaint #${cid} in Priority Queue.`);

  setTimeout(() => {
    const rows = $$("#issuesTableBody tr");
    for (const r of rows) {
      if (r.textContent.includes(cid)) {
        r.scrollIntoView({ behavior: "smooth", block: "center" });
        r.style.transition = "background-color 0.4s ease";
        r.style.backgroundColor = "rgba(47, 110, 232, 0.25)";
        setTimeout(() => {
          r.style.backgroundColor = "";
        }, 2500);
        break;
      }
    }
  }, 200);
};

function setupActions() {
  const newIssue = $("#newIssue");

  newIssue?.addEventListener("click", () => {
    showSection("issuequeue");
    showToast("Navigated to Issue Queue.");
  });

  $$("[data-toast]").forEach((button) => {
    button.addEventListener("click", () =>
      showToast(button.dataset.toast)
    );
  });
}

// =========================================================
// SUBMODULE: GLOBAL ADMIN SEARCH & LIVE SUGGESTIONS
// =========================================================

function setupSearch() {
  const searchInput = $("#dashboardSearch");
  const suggestionsBox = $("#searchSuggestions");
  if (!searchInput || !suggestionsBox) return;

  let selectedSuggestionIndex = -1;

  // Gather all searchable data across the platform
  function getSearchDatabase() {
    const issues = [];
    const departments = [];
    const locations = [];
    const locationSet = new Set();

    // 1. Gather Issues from DOM table or live database store
    const rows = $$("#issuesTableBody tr");
    if (rows && rows.length > 0) {
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 7) {
          const id = cells[0]?.textContent.trim().replace("#", "");
          const title = cells[1]?.textContent.trim();
          const user = cells[2]?.textContent.trim();
          const cat = cells[3]?.textContent.trim();
          const priority = cells[4]?.textContent.trim();
          const date = cells[5]?.textContent.trim();
          const status = cells[6]?.textContent.trim();

          issues.push({
            type: "issue",
            id: id,
            displayId: `#${id}`,
            title: title || "Civic Complaint",
            category: cat || "Road",
            priority: priority || "High",
            status: status || "Pending",
            user: user || "Citizen",
            date: date || "Today",
            location: "Janpath Road, Ward 12",
            dept: "Roads & Potholes Department",
          });
        }
      });
    }

    // Also pull from CivicBuzzAPI store if available
    if (window.CivicBuzzAPI?.store?.getAll) {
      const dbComplaints = window.CivicBuzzAPI.store.getAll();
      dbComplaints.forEach((c) => {
        const cid = String(c.complaint_id);
        if (!issues.some((i) => i.id === cid)) {
          const locStr = c.location?.address || c.location?.ward_name || "Bhubaneswar";
          issues.push({
            type: "issue",
            id: cid,
            displayId: `#${cid}`,
            title: c.title || "Civic Grievance",
            category: c.category || "Roads & Potholes",
            priority: c.priority_level || c.priority?.level || "Medium",
            status: (c.status || "Pending").replace(/_/g, " "),
            user: c.user_uid || "Citizen",
            date: new Date(c.created_at || Date.now()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
            location: locStr,
            dept: c.department_name || "Municipal Department",
            desc: c.description || "",
          });

          if (locStr && !locationSet.has(locStr.toLowerCase())) {
            locationSet.add(locStr.toLowerCase());
            locations.push({
              type: "location",
              name: locStr,
              ward: c.location?.ward_name || "City Area",
              issueCount: 1,
            });
          }
        }
      });
    }

    // Default Seed Issues if none found
    if (issues.length === 0) {
      const seedIssues = [
        { id: "CB-12480", displayId: "#CB-12480", title: "Pothole on MG Road", category: "Roads & Potholes", priority: "High", status: "Resolved", location: "Near Metro Station, MG Road", dept: "Roads & Potholes Department" },
        { id: "CB-12481", displayId: "#CB-12481", title: "Garbage Overflow & Waste Pile", category: "Sanitation & Waste", priority: "Urgent", status: "In Progress", location: "Sector 15, Nehru Park", dept: "Sanitation & Solid Waste" },
        { id: "CB-12482", displayId: "#CB-12482", title: "Water Pipeline Leakage", category: "Water Supply", priority: "High", status: "Pending", location: "Block A, Green View Apartments", dept: "Water Supply & Drainage" },
        { id: "CB-12479", displayId: "#CB-12479", title: "Street Light Not Working", category: "Street Lighting", priority: "Medium", status: "Pending", location: "Sector 4, Main Market", dept: "Street Lighting & Electricity" },
        { id: "ISS-1024", displayId: "#ISS-1024", title: "Dangerous Pothole on Flyover", category: "Roads & Potholes", priority: "Critical", status: "Pending", location: "Janpath Corridor, Ward 12", dept: "Roads & Potholes Department" },
        { id: "ISS-1025", displayId: "#ISS-1025", title: "Drainage Overflow & Waterlogging", category: "Drainage", priority: "High", status: "In Progress", location: "Shastri Nagar, Ward 9", dept: "Water Supply & Drainage" },
      ];
      seedIssues.forEach((si) => issues.push({ ...si, type: "issue", user: "CIT-1001", date: "Today", desc: si.title }));
    }

    // 2. Gather Departments
    const deptCards = $$("#departmentGrid .dept-card");
    if (deptCards && deptCards.length > 0) {
      deptCards.forEach((card) => {
        const title = card.querySelector("h3")?.textContent.trim();
        const desc = card.querySelector(".dept-desc")?.textContent.trim();
        const meta = card.querySelector(".dept-meta")?.textContent.trim();
        const open = card.querySelector(".dept-footer")?.textContent.trim();
        if (title) {
          departments.push({
            type: "department",
            name: title,
            desc: desc || "Municipal department for civic grievance triage",
            meta: meta || "",
            openCount: open || "Active",
          });
        }
      });
    }

    if (departments.length === 0) {
      const seedDepts = [
        { name: "Roads & Potholes Department", desc: "Road surface repairs, potholes, asphalt resurfacing, and pavement maintenance.", openCount: "8 open issues", head: "Rajesh Kumar" },
        { name: "Street Lighting & Electricity", desc: "Broken light poles, LED replacements, timer failures, and dark spot coverage.", openCount: "5 open issues", head: "S. Pattnaik" },
        { name: "Sanitation & Solid Waste", desc: "Garbage collection route monitoring, bin clearing, and illegal dumping remediation.", openCount: "12 open issues", head: "Ananya Mishra" },
        { name: "Water Supply & Drainage", desc: "Pipe leaks, low water pressure, contaminated water, stormwater drainage, and sewage overflow.", openCount: "7 open issues", head: "P. K. Das" },
        { name: "Parks & Urban Greenery", desc: "Park upkeep, playground maintenance, fallen tree removal, and roadside tree trimming.", openCount: "3 open issues", head: "M. Mohanty" },
      ];
      seedDepts.forEach((sd) => departments.push({ ...sd, type: "department" }));
    }

    // 3. Gather Locations & Wards
    const defaultLocations = [
      { name: "Janpath Corridor, Bhubaneswar", ward: "Ward 12", hotspot: true },
      { name: "KIIT Square, Patia Main Road", ward: "Ward 1", hotspot: true },
      { name: "Jayadev Vihar Overbridge", ward: "Ward 4", hotspot: true },
      { name: "Saheed Nagar Main Market", ward: "Ward 7", hotspot: false },
      { name: "Master Canteen Chowk", ward: "Ward 11", hotspot: true },
      { name: "Rasulgarh Industrial Area", ward: "Ward 6", hotspot: true },
      { name: "Khandagiri Caves Entry", ward: "Ward 15", hotspot: false },
      { name: "Nayapalli Behera Sahi", ward: "Ward 5", hotspot: false },
      { name: "Old Town Lingaraj Gate", ward: "Ward 18", hotspot: true },
      { name: "Chandrasekharpur Housing Board", ward: "Ward 3", hotspot: false },
      { name: "Infocity IT Corridor, Patia", ward: "Ward 2", hotspot: true },
      { name: "Baramunda Bus Terminal", ward: "Ward 14", hotspot: true },
    ];

    defaultLocations.forEach((loc) => {
      if (!locationSet.has(loc.name.toLowerCase())) {
        locationSet.add(loc.name.toLowerCase());
        locations.push({
          type: "location",
          name: loc.name,
          ward: loc.ward,
          hotspot: loc.hotspot,
        });
      }
    });

    return { issues, departments, locations };
  }

  // Highlight matched substrings
  function highlightMatch(text, query) {
    if (!text || !query) return text || "";
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  }

  // Render suggestion items
  function renderSuggestions(query = "") {
    const q = query.trim().toLowerCase();
    const db = getSearchDatabase();
    const isHindi = currentLanguage() === "hi";

    // Filter data (supports both English and Hindi query keywords)
    let matchedIssues = [];
    let matchedDepts = [];
    let matchedLocations = [];

    if (!q) {
      // Empty query: Show recent/top quick suggestions
      matchedIssues = db.issues.slice(0, 3);
      matchedDepts = db.departments.slice(0, 2);
      matchedLocations = db.locations.slice(0, 3);
    } else {
      matchedIssues = db.issues.filter((i) => {
        const idMatch = i.id.toLowerCase().includes(q) || i.displayId.toLowerCase().includes(q);
        const titleMatch = i.title.toLowerCase().includes(q) || t(i.title).toLowerCase().includes(q);
        const catMatch = i.category.toLowerCase().includes(q) || t(i.category).toLowerCase().includes(q);
        const locMatch = (i.location || "").toLowerCase().includes(q) || t(i.location || "").toLowerCase().includes(q);
        return idMatch || titleMatch || catMatch || locMatch;
      }).slice(0, 5);

      matchedDepts = db.departments.filter((d) => {
        const nameMatch = d.name.toLowerCase().includes(q) || t(d.name).toLowerCase().includes(q);
        const descMatch = (d.desc || "").toLowerCase().includes(q) || t(d.desc || "").toLowerCase().includes(q);
        const metaMatch = (d.meta || "").toLowerCase().includes(q);
        return nameMatch || descMatch || metaMatch;
      }).slice(0, 4);

      matchedLocations = db.locations.filter((l) => {
        const nameMatch = l.name.toLowerCase().includes(q) || t(l.name).toLowerCase().includes(q);
        const wardMatch = l.ward.toLowerCase().includes(q) || t(l.ward).toLowerCase().includes(q);
        return nameMatch || wardMatch;
      }).slice(0, 4);
    }

    const totalMatches = matchedIssues.length + matchedDepts.length + matchedLocations.length;

    if (totalMatches === 0) {
      suggestionsBox.innerHTML = `
        <div class="search-empty">
          <span class="search-empty-icon">🔍</span>
          <p><strong>${isHindi ? `"${query}" के लिए कोई परिणाम नहीं मिला` : `No matches found for "${query}"`}</strong></p>
          <p class="search-item-sub">${isHindi ? `ट्रैक आईडी (उदा. <code>#CB-12480</code>), स्थान (उदा. <code>एमजी रोड</code>), या विभाग द्वारा खोजें।` : `Try searching by Track ID (e.g. <code>#CB-12480</code>), Location (e.g. <code>MG Road</code>), or Department.`}</p>
        </div>
      `;
      suggestionsBox.hidden = false;
      selectedSuggestionIndex = -1;
      return;
    }

    let html = "";

    // 1. Group: Track IDs & Issues
    if (matchedIssues.length > 0) {
      html += `
        <div class="search-group-header">
          <span>${isHindi ? '🔖 ट्रैक आईडी और शिकायतें' : '🔖 Track ID & Grievances'}</span>
          <span class="search-group-count">${matchedIssues.length}</span>
        </div>
      `;
      matchedIssues.forEach((issue) => {
        const titleText = isHindi ? t(issue.title) : issue.title;
        const locText = isHindi ? t(issue.location || '') : (issue.location || '');
        const catText = isHindi ? t(issue.category) : issue.category;
        const statusText = isHindi ? t(issue.status) : issue.status;
        const priorityText = isHindi ? t(issue.priority) : issue.priority;

        const idHl = highlightMatch(issue.displayId, q);
        const titleHl = highlightMatch(titleText, q);
        const locHl = highlightMatch(locText || "", q);
        const statusClass = (issue.status || "pending").toLowerCase().replace(/\s+/g, "-");

        html += `
          <div class="search-item" data-type="issue" data-id="${issue.id}" data-title="${issue.title}" data-location="${issue.location || ''}">
            <div class="search-item-icon icon-issue">🔖</div>
            <div class="search-item-content">
              <div class="search-item-title">
                <span class="search-item-badge">${idHl}</span>
                <span>${titleHl}</span>
              </div>
              <div class="search-item-sub">📍 ${locHl || (isHindi ? 'वार्ड क्षेत्र' : 'Ward Corridor')} · 📂 ${catText}</div>
            </div>
            <div class="search-item-meta">
              <span class="status-badge ${statusClass}">${statusText}</span>
              <span class="search-item-sub font-mono">${priorityText}</span>
            </div>
          </div>
        `;
      });
    }

    // 2. Group: Departments
    if (matchedDepts.length > 0) {
      html += `
        <div class="search-group-header">
          <span>${isHindi ? '🏛️ विभाग' : '🏛️ Departments'}</span>
          <span class="search-group-count">${matchedDepts.length}</span>
        </div>
      `;
      matchedDepts.forEach((dept) => {
        const nameText = isHindi ? t(dept.name) : dept.name;
        const descText = isHindi ? (t(dept.desc) || dept.desc) : (dept.desc || "Municipal triage department");

        const nameHl = highlightMatch(nameText, q);
        const descHl = highlightMatch(descText, q);

        html += `
          <div class="search-item" data-type="department" data-name="${dept.name}">
            <div class="search-item-icon icon-dept">🏛️</div>
            <div class="search-item-content">
              <div class="search-item-title">${nameHl}</div>
              <div class="search-item-sub">${descHl}</div>
            </div>
            <div class="search-item-meta">
              <span class="search-item-badge">${dept.openCount || (isHindi ? 'सक्रिय' : 'Active')}</span>
            </div>
          </div>
        `;
      });
    }

    // 3. Group: Locations & Wards
    if (matchedLocations.length > 0) {
      html += `
        <div class="search-group-header">
          <span>${isHindi ? '📍 स्थान और वार्ड' : '📍 Locations & Wards'}</span>
          <span class="search-group-count">${matchedLocations.length}</span>
        </div>
      `;
      matchedLocations.forEach((loc) => {
        const nameText = isHindi ? t(loc.name) : loc.name;
        const wardText = isHindi ? t(loc.ward) : loc.ward;

        const nameHl = highlightMatch(nameText, q);
        const wardHl = highlightMatch(wardText, q);
        const hotspotLabel = isHindi ? '· 🔥 उच्च गतिविधि हॉटस्पॉट' : '· 🔥 High Activity Hotspot';

        html += `
          <div class="search-item" data-type="location" data-name="${loc.name}" data-ward="${loc.ward}">
            <div class="search-item-icon icon-location">📍</div>
            <div class="search-item-content">
              <div class="search-item-title">${nameHl}</div>
              <div class="search-item-sub">🏛️ ${wardHl} ${loc.hotspot ? hotspotLabel : ''}</div>
            </div>
            <div class="search-item-meta">
              <span class="search-item-badge">${wardText}</span>
            </div>
          </div>
        `;
      });
    }

    html += `
      <div class="search-footer-hint">
        <span>${isHindi ? '<b>↑</b> <b>↓</b> नेविगेट करें · <b>↵ Enter</b> चुनें' : 'Use <b>↑</b> <b>↓</b> to navigate · <b>↵ Enter</b> to select'}</span>
        <span>${isHindi ? '<b>ESC</b> बंद करें' : '<b>ESC</b> to close'}</span>
      </div>
    `;

    suggestionsBox.innerHTML = html;
    suggestionsBox.hidden = false;
    selectedSuggestionIndex = -1;
  }

  // Handle selecting a suggestion
  function handleSelectSuggestion(itemEl) {
    if (!itemEl) return;
    const type = itemEl.dataset.type;
    const isHindi = currentLanguage() === "hi";

    if (type === "issue") {
      const issueId = itemEl.dataset.id;
      const title = itemEl.dataset.title;
      const loc = itemEl.dataset.location;

      // 1. Switch to Issue Queue section
      showSection("issuequeue");
      const breadcrumb = $("#breadcrumbCurrent");
      if (breadcrumb) breadcrumb.textContent = t("Issue Queue");

      // 2. Set search filter in issue queue
      const qInput = $("#issueSearch");
      if (qInput) {
        qInput.value = issueId;
        qInput.dispatchEvent(new Event("input"));
      }

      // 3. Open details modal for this issue
      const db = getSearchDatabase();
      const matchedIssue = db.issues.find((i) => i.id === issueId) || {
        rawId: issueId,
        id: `#${issueId}`,
        title: title || "Civic Complaint",
        location: loc || "Janpath Road, Ward 12",
        category: "🛣️ Road",
        priority: "High",
        status: "Pending",
        dept: "Roads & Potholes Department",
        desc: `${title || 'Complaint'} - Track ID #${issueId}.`,
      };

      if (typeof window.openIssueDetails === "function") {
        window.openIssueDetails(matchedIssue);
      } else {
        // Fallback row click
        const row = $(`#issuesTableBody tr[data-issue-id="${issueId}"]`) || $(`#issuesTableBody tr`);
        row?.click();
      }

      showToast(isHindi ? `ट्रैक आईडी #${issueId} खोली गई` : `Opened Track ID #${issueId}`);
    } else if (type === "department") {
      const deptName = itemEl.dataset.name;

      // 1. Switch to Departments section
      showSection("departments");
      const breadcrumb = $("#breadcrumbCurrent");
      if (breadcrumb) breadcrumb.textContent = t("Departments");

      // 2. Filter departments
      const dSearch = $("#departmentSearch");
      if (dSearch) {
        dSearch.value = deptName.split(" ")[0];
        dSearch.dispatchEvent(new Event("input"));
      }

      // 3. Scroll to department card and pulse
      setTimeout(() => {
        const cards = $$("#departmentGrid .dept-card");
        const target = cards.find((c) => c.textContent.toLowerCase().includes(deptName.toLowerCase())) || cards[0];
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          target.style.outline = "3px solid #6366f1";
          target.style.transition = "outline 0.3s ease";
          setTimeout(() => {
            target.style.outline = "none";
          }, 2400);
        }
      }, 150);

      showToast(isHindi ? `${t(deptName)} पर नेविगेट किया गया` : `Navigated to ${deptName}`);
    } else if (type === "location") {
      const locName = itemEl.dataset.name;
      const ward = itemEl.dataset.ward;

      // 1. Switch to Issue Queue
      showSection("issuequeue");
      const breadcrumb = $("#breadcrumbCurrent");
      if (breadcrumb) breadcrumb.textContent = t("Issue Queue");

      // 2. Filter Issue Queue by location keyword or ward
      const qInput = $("#issueSearch");
      if (qInput) {
        const keyword = locName.split(",")[0].trim();
        qInput.value = keyword;
        qInput.dispatchEvent(new Event("input"));
      }

      showToast(isHindi ? `${t(locName)} (${t(ward)}) में शिकायतें दिखाई जा रही हैं` : `Showing grievances in ${locName} (${ward})`);
    }

    closeSuggestions();
  }

  function closeSuggestions() {
    suggestionsBox.hidden = true;
    selectedSuggestionIndex = -1;
  }

  function updateSelectedSuggestion(items) {
    items.forEach((item, idx) => {
      item.classList.toggle("is-selected", idx === selectedSuggestionIndex);
      if (idx === selectedSuggestionIndex) {
        item.scrollIntoView({ block: "nearest" });
      }
    });
  }

  // Event Listeners
  searchInput.addEventListener("input", (e) => {
    renderSuggestions(e.target.value);
  });

  searchInput.addEventListener("focus", (e) => {
    renderSuggestions(e.target.value);
  });

  suggestionsBox.addEventListener("click", (e) => {
    const item = e.target.closest(".search-item");
    if (item) {
      handleSelectSuggestion(item);
    }
  });

  // Keyboard navigation inside search input
  searchInput.addEventListener("keydown", (e) => {
    const items = $$(".search-item", suggestionsBox);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestionsBox.hidden) {
        renderSuggestions(searchInput.value);
        return;
      }
      if (items.length > 0) {
        selectedSuggestionIndex = (selectedSuggestionIndex + 1) % items.length;
        updateSelectedSuggestion(items);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (items.length > 0) {
        selectedSuggestionIndex = (selectedSuggestionIndex - 1 + items.length) % items.length;
        updateSelectedSuggestion(items);
      }
    } else if (e.key === "Enter") {
      if (!suggestionsBox.hidden && selectedSuggestionIndex >= 0 && items[selectedSuggestionIndex]) {
        e.preventDefault();
        handleSelectSuggestion(items[selectedSuggestionIndex]);
      } else if (searchInput.value.trim()) {
        e.preventDefault();
        const firstItem = items[0];
        if (firstItem) {
          handleSelectSuggestion(firstItem);
        } else {
          showSection("issuequeue");
          const qInput = $("#issueSearch");
          if (qInput) {
            qInput.value = searchInput.value.trim();
            qInput.dispatchEvent(new Event("input"));
          }
          closeSuggestions();
        }
      }
    } else if (e.key === "Escape") {
      closeSuggestions();
    }
  });

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
      renderSuggestions(searchInput.value);
    } else if (e.key === "Escape") {
      closeSuggestions();
    }
  });

  // Click outside to close
  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
      closeSuggestions();
    }
  });
}

function setupFooterActions() {
  $$(".footer a, .footer button").forEach((el) => {
    el.addEventListener("click", (e) => {
      const href = el.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const sec = href.replace("#", "");
        showSection(sec);
      }
    });
  });
}

function setupProfileMenu() {
  const wrapper = $("#profileWrapper");
  const button = $("#profileButton");
  const dropdown = $("#profileDropdown");
  const profileModal = $("#profileModal");
  const closeProfileModal = $("#closeProfileModal");
  const closeProfileModalBtn = $("#closeProfileModalBtn");
  const modalLogoutBtn = $("#modalLogoutBtn");
  const userIdButton = $("#userIdButton");

  if (!wrapper || !button || !dropdown) {
    return;
  }

  // Populate dynamic logged-in user profile from localStorage & Enforce Role Protection
  try {
    const savedUser = JSON.parse(localStorage.getItem("civicbuzz_user") || "null");
    if (!savedUser || !savedUser.email) {
      window.location.href = "../index.html";
      return;
    }

    const normRole = String(savedUser.role || "Citizen").toLowerCase();
    if (normRole === "citizen") {
      alert("Access denied. Administrator or Officer credentials required.");
      window.location.href = "../Client Page Frontend/index.html";
      return;
    }

    let name = savedUser.full_name || savedUser.fullName || "Aditya Kumar Shyam";
    let roleText = normRole.includes("admin") ? "Super Administrator" : "Department Officer";
    let email = savedUser.email || "admin@civicbuzz.in";
    let uid = savedUser.user_uid || "ADMIN-001";
    let jurisdiction = savedUser.jurisdiction || "Bhubaneswar Central Ward";

    let initials = "AK";
    if (name) {
      const parts = name.trim().split(/\s+/).filter(Boolean);
      if (parts.length === 1) {
        initials = parts[0].slice(0, 2).toUpperCase();
      } else {
        initials = (parts[0][0] + parts[1][0]).toUpperCase();
      }
    }
    
    button.textContent = initials;
    
    const largeAvatar = $(".profile-avatar-large", dropdown);
    if (largeAvatar) largeAvatar.textContent = initials;
    
    const nameEl = $("#headerProfileName");
    if (nameEl) nameEl.textContent = name;
    
    const roleEl = $("#headerProfileRole");
    if (roleEl) roleEl.textContent = roleText;
    
    const uidEl = $("#userIdText");
    if (uidEl) uidEl.textContent = uid;

    const jurEl = $("#headerJurisdiction");
    if (jurEl) jurEl.textContent = jurisdiction;

    // Sidebar bottom mini profile
    const sideStrong = $(".admin-mini strong");
    if (sideStrong) sideStrong.textContent = name;
    
    const sideSmall = $(".admin-mini small");
    if (sideSmall) sideSmall.textContent = roleText;
    
    const sideAvatar = $(".admin-mini .avatar-small");
    if (sideAvatar) sideAvatar.textContent = initials;

    // Dynamic Time-of-Day Greeting and Admin Name
    const hour = new Date().getHours();
    let timeGreeting = "Good morning";
    if (hour >= 12 && hour < 17) {
      timeGreeting = "Good afternoon";
    } else if (hour >= 17 || hour < 5) {
      timeGreeting = "Good evening";
    }

    const greetingPrefix = $("#greetingPrefix");
    if (greetingPrefix) greetingPrefix.textContent = timeGreeting;

    const adminGreetingName = $("#adminGreetingName");
    if (adminGreetingName) adminGreetingName.textContent = name;

    const greetingHeading = $("#dashboardGreeting") || $("#section-dashboard .dashboard-heading h1");
    if (greetingHeading && !greetingPrefix) {
      greetingHeading.innerHTML = `<span>${timeGreeting}</span>, <span>${name}</span> <span>✦</span>`;
    }

    // Dynamic current date in dashboard eyebrow
    const dateEyebrow = $("#dashboardDate") || $("#section-dashboard .dashboard-heading .eyebrow");
    if (dateEyebrow) {
      const now = new Date();
      const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
      dateEyebrow.textContent = now.toLocaleDateString("en-GB", options).toUpperCase();
    }
  } catch (_) {}

  const closeMenu = () => {
    wrapper.classList.remove("is-open", "open");
    dropdown.classList.remove("is-open", "open");
    button.setAttribute("aria-expanded", "false");
    dropdown.setAttribute("aria-hidden", "true");
  };

  const openMenu = () => {
    wrapper.classList.add("is-open", "open");
    dropdown.classList.add("is-open", "open");
    button.setAttribute("aria-expanded", "true");
    dropdown.setAttribute("aria-hidden", "false");
  };

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (wrapper.classList.contains("is-open") || wrapper.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Copy Admin ID
  userIdButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const uidText = $("#userIdText")?.textContent || "ADMIN-001";
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(uidText).then(() => {
        showToast(`Admin ID (${uidText}) copied!`);
      }).catch(() => {
        showToast(`Admin ID: ${uidText}`);
      });
    } else {
      showToast(`Admin ID: ${uidText}`);
    }
  });

  function openAdminProfileModal() {
    if (!profileModal) return;
    try {
      const savedUser = JSON.parse(localStorage.getItem("civicbuzz_user") || "null");
      let name = "Aditya Kumar Shyam";
      let roleText = "Super Administrator";
      let email = "admin@civicbuzz.in";
      let uid = "ADMIN-001";

      if (savedUser) {
        if (savedUser.full_name) {
          name = savedUser.full_name;
        } else if (savedUser.email && savedUser.email.includes("@")) {
          name = savedUser.email.split("@")[0].replace(/[._-]/g, " ").split(" ").filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
        }
        if (savedUser.role) roleText = savedUser.role;
        if (savedUser.email) email = savedUser.email;
        if (savedUser.user_uid) uid = savedUser.user_uid;
      }

      let initials = "AK";
      if (name) {
        const parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 1) {
          initials = parts[0].slice(0, 2).toUpperCase();
        } else {
          initials = (parts[0][0] + parts[1][0]).toUpperCase();
        }
      }

      const mAvatar = $("#modalAvatarLarge");
      if (mAvatar) mAvatar.textContent = initials;
      const mName = $("#modalProfileFullName");
      if (mName) mName.textContent = name;
      const mRole = $("#modalProfileRole");
      if (mRole) mRole.textContent = roleText;
      const mEmail = $("#modalProfileEmail");
      if (mEmail) mEmail.textContent = email;
      const mUid = $("#modalProfileUid");
      if (mUid) mUid.textContent = uid;
    } catch (_) {}

    profileModal.hidden = false;
  }

  function closeAdminProfileModal() {
    if (profileModal) profileModal.hidden = true;
  }

  closeProfileModal?.addEventListener("click", closeAdminProfileModal);
  closeProfileModalBtn?.addEventListener("click", closeAdminProfileModal);
  modalLogoutBtn?.addEventListener("click", () => {
    closeAdminProfileModal();
    performLogout();
  });

  function performLogout() {
    if (window.CivicBuzzAPI) {
      try {
        window.CivicBuzzAPI.auth.logout();
      } catch (_) {}
    }
    localStorage.removeItem("civicbuzz_token");
    localStorage.removeItem("civicbuzz_user");
    showToast("Logged out successfully.");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 300);
  }

  dropdown.addEventListener("click", (event) => {
    const item = event.target.closest("[data-action]");
    if (!item) return;

    event.preventDefault();
    event.stopPropagation();
    const action = item.dataset.action;

    if (action === "theme") {
      setTheme(document.body.classList.contains("dark-theme") ? "light" : "dark");
      showToast(document.body.classList.contains("dark-theme") ? "Dark mode enabled." : "Light mode enabled.");
      return;
    }

    if (action === "logout") {
      performLogout();
      return;
    }

    if (action === "profile") {
      openAdminProfileModal();
      closeMenu();
      return;
    }

    closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!wrapper.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeAdminProfileModal();
      button.focus();
    }
  });
}

function initialiseDashboard() {
  let savedTheme = "light";

  try {
    savedTheme = localStorage.getItem("civicbuzz-admin-theme") || "light";
  } catch (_) {
    savedTheme = "light";
  }

  setTheme(savedTheme);

  setupLanguage();

  renderRealMetricsAndStats();

  updateTrendChart("week");

  setupNavigation();

  setupIssueQueue();

  setupDepartments();

  setupBudgeting();

  setupSearch();

  setupActions();

  setupFooterActions();

  setupProfileMenu();

  initAdminLiveMap();

  // Synchronize authenticated admin profile from backend database
  if (window.CivicBuzzAPI?.auth?.getMe && window.CivicBuzzAPI?.getToken?.()) {
    window.CivicBuzzAPI.auth.getMe().then((res) => {
      if (res && res.data && res.data.full_name) {
        localStorage.setItem("civicbuzz_user", JSON.stringify(res.data));
        setupProfileMenu();
        if (typeof applyLoggedInAdminProfile === "function") {
          applyLoggedInAdminProfile();
        }
      }
    }).catch((_) => {});
  }

  // Real-time synchronization listeners for instant cross-tab and client complaint updates
  const refreshAllLiveViews = () => {
    renderRealMetricsAndStats();
    renderAdminMapIssues();
    updateTrendChart($("#trendRange")?.value || "week");
  };

  window.addEventListener("civicbuzz_data_updated", refreshAllLiveViews);
  window.addEventListener("storage", (e) => {
    if (e.key === "civicbuzz_complaints" || e.key === "civicbuzz_complaints_tick") {
      refreshAllLiveViews();
    }
  });

  // Background polling to ensure seamless live sync
  setInterval(() => {
    renderRealMetricsAndStats();
    renderAdminMapIssues();
  }, 3000);

  $("#trendRange")?.addEventListener("change", (event) => {
    updateTrendChart(event.target.value);
    showToast(`Trend updated: ${event.target.options[event.target.selectedIndex].text}.`);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialiseDashboard);
} else {
  initialiseDashboard();
}

