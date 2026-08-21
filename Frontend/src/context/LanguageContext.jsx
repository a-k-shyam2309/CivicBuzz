import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const translations = {
  en: {
    // Navbar & Header
    brandTitle: 'CIVICBUZZ',
    brandSubtitle: 'Grievance & Budget Platform',
    home: 'Home',
    reportIssue: 'Report Issue',
    trackGrievances: 'Track Grievances',
    publicFeed: 'Public Feed',
    projectsBudget: 'Projects & Budget',
    tenders: 'Tenders',
    adminPortal: 'Admin Portal',
    deptPortal: 'Dept Portal',
    signIn: 'Sign In',
    register: 'Register',
    signOut: 'Sign Out',
    role: 'Role',
    switchRole: 'Demo Fast Role Switch',
    switchToCitizen: '👤 Switch to Citizen (Public View)',
    switchToOfficer: '👷 Switch to Officer (Dept Portal)',
    switchToAdmin: '🏛️ Switch to Municipal Admin',

    // Home Page
    heroBadge: 'AI-Grounded Municipal Governance Platform',
    heroTitle1: 'Turn Civic Grievances Into',
    heroTitle2: 'Verified Public Action.',
    heroDesc: 'Report civic problems with photo evidence and GPS location. AI triages and routes the issue to municipal departments. Work is only marked resolved once verified on the ground by you.',
    reportGrievanceBtn: 'Report a Civic Issue',
    trackStatusBtn: 'Track Complaint Status',
    kpiActiveIssues: 'Active Grievances',
    kpiResolved: 'Citizen Verified',
    kpiAvgResolution: 'Avg Resolution Time',
    kpiBudgetAllocated: 'Community Budget Voted',

    // Report Issue Page
    reportHeaderBadge: 'Evidence-Grounded Reporting',
    reportHeaderTitle: 'Report a Civic Grievance',
    reportHeaderDesc: 'Submit your complaint with photos and exact Bhubaneswar GPS coordinates. Gemini AI will categorize, estimate severity, and route it directly to the responsible department.',
    quickTemplatesTitle: 'Quick-Fill Sample Grievances (Instant Testing):',
    quickTemplatesSubtitle: 'Click any sample to auto-fill',
    section1Title: '1. Issue Description',
    primaryCategory: 'Primary Category',
    subcategory: 'Subcategory',
    detailedDesc: 'Detailed Description',
    descPlaceholder: 'Describe the exact civic defect (e.g. Large 2-foot wide pothole on Janpath road right in front of Ram Mandir square causing traffic slowdown and risk of accidents)...',
    anonymousCheckbox: 'File as Anonymous (Hides your name and contact details from the public feed)',
    section2Title: '2. Upload Evidence',
    photoEvidence: 'Photo Evidence',
    voiceEvidence: 'Multilingual Voice Grievance Note',
    section3Title: '3. Bhubaneswar Map & Ward Pinning',
    submitGrievanceBtn: 'Submit Grievance to Municipal Portal',
    submittingGrievanceBtn: 'AI Triaging & Submitting Grievance...',

    // Map & Location
    mapHeaderTitle: 'Bhubaneswar Interactive Ward Map',
    mapHeaderSubtitle: 'Click anywhere in Bhubaneswar to drop pin or use current GPS',
    useCurrentLocation: 'Use My Current Location',
    clickToDropPin: 'Click anywhere on Bhubaneswar map to drop pin',
    quickZonesTitle: 'Quick Pick Bhubaneswar Municipal Zone:',
    wardJurisdiction: 'Ward Jurisdiction',
    assignedDept: 'Assigned Department',

    // Track Page
    trackHeaderTitle: 'Track Grievance Resolution',
    trackHeaderDesc: 'Inspect real-time AI triage, field remediation progress, before/after evidence photos, and complete ground verification.',
    searchPlaceholder: 'ENTER COMPLAINT ID (E.G. CB-1001)...',
    searchBtn: 'Search',
    recentGrievancesTitle: 'Your Submitted & Recent Grievances:',
    selectGrievancePrompt: 'Select a grievance above or enter a Complaint ID to inspect details.',
    problemResolvedBtn: '✓ Confirm Problem Resolved',
    notResolvedBtn: '✕ Dispute / Not Resolved',
    resolutionProofTitle: 'Department Remediation Proof (Before & After):',
    beforeProof: 'Before (Reported by Citizen)',
    afterProof: 'After (Remediation by Department)',
    timelineTitle: 'Audit & Remediation Timeline',

    // Chatbot
    chatTitle: 'CivicBuzz AI Assistant',
    chatSubtitle: 'Ask anything in English, Hindi, or Odia (ଓଡ଼ିଆ)',
    chatPlaceholder: 'Ask a question or enter Complaint ID...',
    sendBtn: 'Send',
  },

  hi: {
    // Navbar & Header
    brandTitle: 'सिविकबज़',
    brandSubtitle: 'नागरिक शिकायत एवं बजट मंच',
    home: 'होम',
    reportIssue: 'शिकायत दर्ज करें',
    trackGrievances: 'शिकायत ट्रैक करें',
    publicFeed: 'सार्वजनिक फ़ीड',
    projectsBudget: 'परियोजनाएं एवं बजट',
    tenders: 'निविदाएं (Tenders)',
    adminPortal: 'एडमिन पोर्टल',
    deptPortal: 'विभाग पोर्टल',
    signIn: 'साइन इन',
    register: 'पंजीकरण',
    signOut: 'साइन आउट',
    role: 'भूमिका',
    switchRole: 'डेमो रोल स्विच',
    switchToCitizen: '👤 नागरिक (Citizen)',
    switchToOfficer: '👷 अधिकारी (Officer)',
    switchToAdmin: '🏛️ नगर निगम प्रशासक (Admin)',

    // Home Page
    heroBadge: 'AI-आधारित नगरपालिका शासन मंच',
    heroTitle1: 'नागरिक समस्याओं को बदलें',
    heroTitle2: 'सत्यापित सार्वजनिक कार्रवाई में।',
    heroDesc: 'फोटो साक्ष्य और जीपीएस स्थान के साथ नागरिक समस्याओं की रिपोर्ट करें। जेमिनी AI शिकायतों को वर्गीकृत करता है और संबंधित विभागों को सौंपता है। काम तभी पूर्ण माना जाता है जब आप स्वयं धरातल पर सत्यापन करते हैं।',
    reportGrievanceBtn: 'समस्या की रिपोर्ट करें',
    trackStatusBtn: 'शिकायत की स्थिति ट्रैक करें',
    kpiActiveIssues: 'सक्रिय शिकायतें',
    kpiResolved: 'नागरिक सत्यापित समाधान',
    kpiAvgResolution: 'औसत समाधान समय',
    kpiBudgetAllocated: 'नागरिक बजट स्वीकृत',

    // Report Issue Page
    reportHeaderBadge: 'साक्ष्य-आधारित रिपोर्टिंग',
    reportHeaderTitle: 'नागरिक शिकायत दर्ज करें',
    reportHeaderDesc: 'भुवनेश्वर के सटीक जीपीएस निर्देशांक और फोटो के साथ अपनी शिकायत दर्ज करें। जेमिनी AI इसका विश्लेषण करके इसे संबंधित विभाग को अग्रेषित करेगा।',
    quickTemplatesTitle: 'त्वरित नमूना शिकायतें (परीक्षण हेतु):',
    quickTemplatesSubtitle: 'स्वतः भरने के लिए किसी भी नमूने पर क्लिक करें',
    section1Title: '1. समस्या का विवरण',
    primaryCategory: 'मुख्य श्रेणी',
    subcategory: 'उप-श्रेणी',
    detailedDesc: 'विस्तृत विवरण',
    descPlaceholder: 'सटीक नागरिक समस्या का विवरण लिखें (उदा: जनपथ मार्ग पर राम मंदिर चौक के पास 2 फीट का गड्ढा जिससे वाहनों को नुकसान हो रहा है)...',
    anonymousCheckbox: 'गुमनाम के रूप में दर्ज करें (सार्वजनिक फ़ीड से आपका नाम और संपर्क विवरण छुपाया जाएगा)',
    section2Title: '2. साक्ष्य अपलोड करें',
    photoEvidence: 'फोटो साक्ष्य',
    voiceEvidence: 'बहुभाषी वॉइस नोट रिकॉर्डिंग',
    section3Title: '3. भुवनेश्वर मानचित्र एवं वार्ड चयन',
    submitGrievanceBtn: 'नगर निगम पोर्टल पर शिकायत दर्ज करें',
    submittingGrievanceBtn: 'AI विश्लेषण एवं शिकायत दर्ज हो रही है...',

    // Map & Location
    mapHeaderTitle: 'भुवनेश्वर इंटरैक्टिव वार्ड मानचित्र',
    mapHeaderSubtitle: 'पिन लगाने के लिए भुवनेश्वर मैप पर कहीं भी क्लिक करें या वर्तमान GPS का उपयोग करें',
    useCurrentLocation: 'मेरा वर्तमान स्थान उपयोग करें',
    clickToDropPin: 'पिन लगाने के लिए भुवनेश्वर मैप पर क्लिक करें',
    quickZonesTitle: 'भुवनेश्वर के प्रमुख क्षेत्र चुनें:',
    wardJurisdiction: 'वार्ड क्षेत्राधिकार',
    assignedDept: 'संबंधित विभाग',

    // Track Page
    trackHeaderTitle: 'शिकायत समाधान ट्रैकिंग',
    trackHeaderDesc: 'वास्तविक समय में AI वर्गीकरण, फील्ड कार्य की प्रगति, Before/After फोटो साक्ष्य और धरातल सत्यापन की जांच करें।',
    searchPlaceholder: 'शिकायत संख्या दर्ज करें (जैसे CB-1001)...',
    searchBtn: 'खोजें',
    recentGrievancesTitle: 'आपकी दर्ज की गई एवं हालिया शिकायतें:',
    selectGrievancePrompt: 'विवरण देखने के लिए ऊपर दी गई शिकायत चुनें या शिकायत आईडी दर्ज करें।',
    problemResolvedBtn: '✓ समस्या समाधान की पुष्टि करें',
    notResolvedBtn: '✕ असंतोष / समाधान नहीं हुआ',
    resolutionProofTitle: 'विभाग द्वारा कार्य समाप्ति का प्रमाण (Before & After):',
    beforeProof: 'पहले (नागरिक द्वारा दर्ज)',
    afterProof: 'बाद में (विभाग द्वारा मरम्मत कार्य)',
    timelineTitle: 'ऑडिट एवं प्रगति समयरेखा',

    // Chatbot
    chatTitle: 'सिविकबज़ AI सहायक',
    chatSubtitle: 'अंग्रेजी, हिन्दी या ओडिया (ଓଡ଼ିଆ) में पूछें',
    chatPlaceholder: 'प्रश्न पूछें या शिकायत आईडी दर्ज करें...',
    sendBtn: 'भेजें',
  },

  or: {
    // Navbar & Header
    brandTitle: 'ସିଭିକ୍‌ବଜ୍',
    brandSubtitle: 'ନାଗରିକ ଅଭିଯୋଗ ଓ ଅଂଶଗ୍ରହଣକାରୀ ବଜେଟ୍ ମଞ୍ଚ',
    home: 'ମୁଖ୍ୟପୃଷ୍ଠା',
    reportIssue: 'ଅଭିଯୋଗ କରନ୍ତୁ',
    trackGrievances: 'ଅଭିଯୋଗ ଟ୍ରାକ୍ କରନ୍ତୁ',
    publicFeed: 'ସାର୍ବଜନୀନ ଫିଡ୍',
    projectsBudget: 'ପ୍ରକଳ୍ପ ଓ ବଜେଟ୍',
    tenders: 'ଟେଣ୍ଡର (Tenders)',
    adminPortal: 'ଆଡମିନ୍ ପୋର୍ଟାଲ୍',
    deptPortal: 'ବିଭାଗୀୟ ପୋର୍ଟାଲ୍',
    signIn: 'ଲଗ୍ ଇନ୍',
    register: 'ପଞ୍ଜୀକରଣ',
    signOut: 'ଲଗ୍ ଆଉଟ୍',
    role: 'ଭୂମିକା',
    switchRole: 'ଡେମୋ ରୋଲ୍ ପରିବର୍ତ୍ତନ',
    switchToCitizen: '👤 ନାଗରିକ (Citizen)',
    switchToOfficer: '👷 ଅଧିକାରୀ (Officer)',
    switchToAdmin: '🏛️ ମ୍ୟୁନିସିପାଲିଟି ପ୍ରଶାସକ (Admin)',

    // Home Page
    heroBadge: 'AI-ଆଧାରିତ ପୌର ପ୍ରଶାସନ ପ୍ଲାଟଫର୍ମ',
    heroTitle1: 'ନାଗରିକ ଅଭିଯୋଗକୁ ରୂପାନ୍ତରିତ କରନ୍ତୁ',
    heroTitle2: 'ପ୍ରମାଣିତ ଜନସେବାରେ।',
    heroDesc: 'ଫଟୋ ପ୍ରମାଣ ଏବଂ GPS ଅବସ୍ଥାନ ସହିତ ପୌର ସମସ୍ୟା ରିପୋର୍ଟ କରନ୍ତୁ। ଜେମିନି AI ସମସ୍ୟାର ବିଶ୍ଳେଷଣ କରି ଉପଯୁକ୍ତ ବିଭାଗକୁ ପଠାଇବ। ଆପଣ ନିଜେ ସ୍ଥଳ ଯାଞ୍ଚ କରିବା ପରେ ହିଁ ସମସ୍ୟା ସମାଧାନ ହୋଇଥିବା ଘୋଷଣା ହେବ।',
    reportGrievanceBtn: 'ସମସ୍ୟା ରିପୋର୍ଟ କରନ୍ତୁ',
    trackStatusBtn: 'ଅଭିଯୋଗ ସ୍ଥିତି ଯାଞ୍ଚ କରନ୍ତୁ',
    kpiActiveIssues: 'ସକ୍ରିୟ ଅଭିଯୋଗ',
    kpiResolved: 'ନାଗରିକ ପ୍ରମାଣିତ ସମାଧାନ',
    kpiAvgResolution: 'ହାରାହାରି ସମାଧାନ ସମୟ',
    kpiBudgetAllocated: 'ସ୍ୱୀକୃତ ନାଗରିକ ବଜେଟ୍',

    // Report Issue Page
    reportHeaderBadge: 'ପ୍ରମାଣ-ଆଧାରିତ ରିପୋର୍ଟିଂ',
    reportHeaderTitle: 'ନାଗରିକ ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ',
    reportHeaderDesc: 'ଭୁବନେଶ୍ୱରର ସଠିକ୍ GPS ସ୍ଥାନ ଏବଂ ଫଟୋ ସହିତ ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ। Gemini AI ଏହାର ବିଶ୍ଳେଷଣ କରି ସମ୍ପୃକ୍ତ ୱାର୍ଡ ବିଭାଗକୁ ପ୍ରେରଣ କରିବ।',
    quickTemplatesTitle: 'କ୍ଷିପ୍ର ନମୁନା ଅଭିଯୋଗ (ତୁରନ୍ତ ପରୀକ୍ଷଣ):',
    quickTemplatesSubtitle: 'ସ୍ୱୟଂକ୍ରିୟ ଭାବରେ ପୂରଣ କରିବାକୁ କ୍ଲିକ୍ କରନ୍ତୁ',
    section1Title: '୧. ସମସ୍ୟାର ବିବରଣୀ',
    primaryCategory: 'ମୁଖ୍ୟ ବିଭାଗ',
    subcategory: 'ଉପ-ବିଭାଗ',
    detailedDesc: 'ବିସ୍ତୃତ ବିବରଣୀ',
    descPlaceholder: 'ନିର୍ଦ୍ଦିଷ୍ଟ ସମସ୍ୟା ବିଷୟରେ ଲେଖନ୍ତୁ (ଯଥା: ରାମ ମନ୍ଦିର ଛକ ଜନପଥ ରାସ୍ତାରେ ଖାଲ ଯୋଗୁଁ ଯାତାୟାତରେ ଅସୁବିଧା ହେଉଛି)...',
    anonymousCheckbox: 'ଅଜ୍ଞାତ ନାମରେ ଦାଖଲ କରନ୍ତୁ (ଆପଣଙ୍କ ନାମ ଓ ଫୋନ୍ ନମ୍ବର ଗୋପନୀୟ ରହିବ)',
    section2Title: '୨. ପ୍ରମାଣ ଫଟୋ ଓ ଭଏସ୍ ରେକର୍ଡିଂ',
    photoEvidence: 'ଫଟୋ ପ୍ରମାଣ',
    voiceEvidence: 'ଓଡ଼ିଆ / ହିନ୍ଦୀ ଭଏସ୍ ନୋଟ୍',
    section3Title: '୩. ଭୁବନେଶ୍ୱର ମ୍ୟାପ୍ ଓ ୱାର୍ଡ ଚୟନ',
    submitGrievanceBtn: 'ପୌର ନିଗମ ପୋର୍ଟାଲରେ ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ',
    submittingGrievanceBtn: 'AI ବିଶ୍ଳେଷଣ ଓ ଅଭିଯୋଗ ଦାଖଲ ହେଉଛି...',

    // Map & Location
    mapHeaderTitle: 'ଭୁବନେଶ୍ୱର ୱାର୍ଡ ମ୍ୟାପ୍',
    mapHeaderSubtitle: 'ପିନ୍ ଲଗାଇବା ପାଇଁ ଭୁବନେଶ୍ୱର ମ୍ୟାପ୍‌ରେ କ୍ଲିକ୍ କରନ୍ତୁ କିମ୍ବା GPS ବ୍ୟବହାର କରନ୍ତୁ',
    useCurrentLocation: 'ମୋର ବର୍ତ୍ତମାନର ସ୍ଥାନ ବ୍ୟବହାର କରନ୍ତୁ',
    clickToDropPin: 'ଭୁବନେଶ୍ୱର ମ୍ୟାପ୍‌ରେ ପିନ୍ ଲଗାନ୍ତୁ',
    quickZonesTitle: 'ଭୁବନେଶ୍ୱରର ପ୍ରମୁଖ ଅଞ୍ଚଳ ଚୟନ କରନ୍ତୁ:',
    wardJurisdiction: 'ୱାର୍ଡ କ୍ଷେତ୍ରାଧିକାର',
    assignedDept: 'ଦାୟିତ୍ୱପ୍ରାପ୍ତ ବିଭାଗ',

    // Track Page
    trackHeaderTitle: 'ଅଭିଯୋଗ ସମାଧାନ ଟ୍ରାକିଂ',
    trackHeaderDesc: 'ପ୍ରକୃତ ସମୟରେ AI ଶ୍ରେଣୀବିଭାଗ, ଫିଲ୍ଡ କାର୍ଯ୍ୟର ଅଗ୍ରଗତି, Before/After ଫଟୋ ପ୍ରମାଣ ଏବଂ ସ୍ଥଳ ଯାଞ୍ଚ ସତ୍ୟାପନ କରନ୍ତୁ।',
    searchPlaceholder: 'ଅଭିଯୋଗ ନମ୍ବର ଲେଖନ୍ତୁ (ଯଥା CB-1001)...',
    searchBtn: 'ସନ୍ଧାନ କରନ୍ତୁ',
    recentGrievancesTitle: 'ଆପଣଙ୍କ ଦାଖଲ ହୋଇଥିବା ସାମ୍ପ୍ରତିକ ଅଭିଯୋଗ:',
    selectGrievancePrompt: 'ସମ୍ପୂର୍ଣ୍ଣ ବିବରଣୀ ଦେଖିବା ପାଇଁ ଉପରୋକ୍ତ ଅଭିଯୋଗ ଉପରେ କ୍ଲିକ୍ କରନ୍ତୁ।',
    problemResolvedBtn: '✓ ସମସ୍ୟା ସମାଧାନ ପ୍ରମାଣିତ କରନ୍ତୁ',
    notResolvedBtn: '✕ ଅସନ୍ତୋଷ / ସମାଧାନ ହୋଇନାହିଁ',
    resolutionProofTitle: 'ବିଭାଗୀୟ ମରାମତି କାର୍ଯ୍ୟ ପ୍ରମାଣ (Before & After):',
    beforeProof: 'ପୂର୍ବରୁ (ନାଗରିକ ଦାଖଲ କରିଥିବା ଫଟୋ)',
    afterProof: 'ପରେ (ବିଭାଗ ଦ୍ୱାରା ମରାମତି କାର୍ଯ୍ୟ)',
    timelineTitle: 'ଅଡିଟ୍ ଏବଂ କାର୍ଯ୍ୟ ଅଗ୍ରଗତି ସମୟସୀମା',

    // Chatbot
    chatTitle: 'ସିଭିକ୍‌ବଜ୍ AI ସହାୟକ',
    chatSubtitle: 'ଓଡ଼ିଆ (Odia), ହିନ୍ଦୀ ବା ଇଂରାଜୀରେ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ',
    chatPlaceholder: 'ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ କିମ୍ବା ଅଭିଯୋଗ ID ଲେଖନ୍ତୁ...',
    sendBtn: 'ପଠାନ୍ତୁ',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('civicbuzz_lang') || 'en');

  const changeLanguage = (langCode) => {
    setLanguage(langCode);
    localStorage.setItem('civicbuzz_lang', langCode);
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
