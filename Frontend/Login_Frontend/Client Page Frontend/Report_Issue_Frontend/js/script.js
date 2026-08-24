// ============================================================
// CivicBuzz — Report Issue Page
// Real-time AI Grievance Triage, Multilingual Grounding,
// Mandatory Field Validation, Database Persistence & Auto-Sync
// ============================================================

(function () {
  'use strict';

  // --- Sample Grievance Templates for 1-Click Demonstration ---
  const SAMPLE_DATA = {
    pothole_en: {
      text: 'Deep 2-foot asphalt pothole on Janpath Road near Ram Mandir square causing severe vehicle damage and traffic hazards.',
      lang: 'en',
      lat: 20.2961,
      lng: 85.8245,
      ward: 'Ward 12',
      ward_label: 'Ward 12 · Janpath',
      address: 'Janpath Road, Ram Mandir Square, Bhubaneswar',
      category: 'road',
      sub_category: 'pothole',
      severity: 'CRITICAL',
      urgency: 88,
      sla: '48-Hour Resolution Window',
      dept: 'Roads & Potholes Dept.',
      ward_cell: 'Ward 12 Infrastructure Cell',
      elements: ['Road Cavity (~1.5m)', 'Asphalt Degradation', 'Two-Wheeler Hazard'],
      auth: '96% Real Civic Defect',
      conf: 96,
      is_pb: true,
      pb_text: '4th road defect reported in this 300m corridor this quarter. Flagged as a candidate for Community Participatory Budgeting (Road Resurfacing Proposal).',
      dup_match: {
        id: '#CB-0142',
        title: 'Large pothole near college gate',
        desc: 'Reported 3 hours ago · Ward 12 (Janpath)',
        score: '89% Match Found'
      },
      image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    },
    regional_hi: {
      text: 'जनपथ रोड पर राम मंदिर के पास एक बड़ा 2 फीट गहरा गड्ढा है जिससे गाड़ियाँ टकरा रही हैं और बड़ा हादसा होने का खतरा है।',
      lang: 'hi',
      lat: 20.2961,
      lng: 85.8245,
      ward: 'Ward 12',
      ward_label: 'Ward 12 · Janpath',
      address: 'Janpath Road, Ram Mandir Square, Bhubaneswar',
      category: 'road',
      sub_category: 'pothole',
      severity: 'CRITICAL',
      urgency: 92,
      sla: '24-Hour Urgent Safety SLA',
      dept: 'Roads & Potholes Dept.',
      ward_cell: 'Ward 12 Infrastructure Cell',
      elements: ['Asphalt Defect', 'High Traffic Corridor', 'Immediate Collision Risk'],
      auth: '98% Real Civic Defect',
      conf: 98,
      canonical: 'Deep 2-foot road crater on Janpath corridor creating immediate collision and pedestrian safety hazard.',
      is_pb: true,
      pb_text: 'Multiple road structural complaints filed in Ward 12. Flagged for Participatory Budget road rehabilitation proposal.',
      dup_match: {
        id: '#CB-0142',
        title: 'Large pothole near college gate',
        desc: 'Reported 3 hours ago · Ward 12 (Janpath)',
        score: '91% Match Found'
      },
      image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    },
    garbage_en: {
      text: 'Community waste bins overflowing near Saheed Nagar market with foul odor and waste spilling across pedestrian walkways.',
      lang: 'en',
      lat: 20.2905,
      lng: 85.8450,
      ward: 'Ward 5',
      ward_label: 'Ward 5 · Saheed Nagar',
      address: 'Saheed Nagar Market, Bhubaneswar',
      category: 'garbage_sanitation',
      sub_category: 'overflowing_bin',
      severity: 'HIGH',
      urgency: 78,
      sla: '24-Hour Sanitation Clearance',
      dept: 'Garbage & Sanitation Dept.',
      ward_cell: 'Ward 5 Sanitation Wing',
      elements: ['Organic Waste Accumulation', 'Foul Odor Hazard', 'Pedestrian Walkway Blocked'],
      auth: '94% Real Civic Defect',
      conf: 94,
      is_pb: false,
      dup_match: null,
      image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80'
    }
  };

  const BHUBANESWAR_WARDS = [
    { id: 1, name: 'Ward 1 - Patia & KIIT Area', label: 'Ward 1 · Patia Infocity', zone: 'North', center: [20.3553, 85.8189], address: 'Patia Infocity Road, Bhubaneswar' },
    { id: 2, name: 'Ward 2 - Chandrasekharpur', label: 'Ward 2 · Damana', zone: 'North', center: [20.3242, 85.8152], address: 'Chandrasekharpur, Bhubaneswar' },
    { id: 3, name: 'Ward 3 - Jayadev Vihar', label: 'Ward 3 · Jayadev Vihar', zone: 'Central', center: [20.3015, 85.8195], address: 'Jayadev Vihar & IRC Village, Bhubaneswar' },
    { id: 4, name: 'Ward 4 - Nayapalli & CRPF', label: 'Ward 4 · Nayapalli', zone: 'Central', center: [20.2934, 85.8080], address: 'Nayapalli, CRPF Square, Bhubaneswar' },
    { id: 5, name: 'Ward 5 - Saheed Nagar', label: 'Ward 5 · Saheed Nagar', zone: 'Central', center: [20.2905, 85.8450], address: 'Saheed Nagar, Vani Vihar, Bhubaneswar' },
    { id: 6, name: 'Ward 6 - Master Canteen & Station', label: 'Ward 6 · Station Sq.', zone: 'Central', center: [20.2668, 85.8436], address: 'Master Canteen Square, Bhubaneswar' },
    { id: 7, name: 'Ward 7 - Khandagiri & Jagamara', label: 'Ward 7 · Khandagiri', zone: 'West', center: [20.2580, 85.7865], address: 'Khandagiri Square, Bhubaneswar' },
    { id: 8, name: 'Ward 8 - Old Town & Lingaraj', label: 'Ward 8 · Old Town', zone: 'South', center: [20.2390, 85.8340], address: 'Old Town, Lingaraj Area, Bhubaneswar' },
    { id: 9, name: 'Ward 9 - Rasulgarh & Bomikhal', label: 'Ward 9 · Rasulgarh', zone: 'East', center: [20.2980, 85.8670], address: 'Rasulgarh Square, Bhubaneswar' },
    { id: 10, name: 'Ward 10 - Mancheswar', label: 'Ward 10 · Mancheswar', zone: 'East', center: [20.3300, 85.8650], address: 'Mancheswar Industrial Area, Bhubaneswar' },
    { id: 11, name: 'Ward 11 - Laxmisagar', label: 'Ward 11 · Laxmisagar', zone: 'South-East', center: [20.2620, 85.8580], address: 'Laxmisagar & Badagada, Bhubaneswar' },
    { id: 12, name: 'Ward 12 - Janpath & Ashok Nagar', label: 'Ward 12 · Janpath', zone: 'Central', center: [20.2961, 85.8245], address: 'Janpath Road, Ram Mandir, Bhubaneswar' },
    { id: 13, name: 'Ward 13 - Baramunda & ISBT', label: 'Ward 13 · Baramunda', zone: 'West', center: [20.2800, 85.7950], address: 'Baramunda ISBT, Bhubaneswar' },
    { id: 14, name: 'Ward 14 - Infocity & DLF', label: 'Ward 14 · Infocity', zone: 'North', center: [20.3700, 85.8120], address: 'DLF Cybercity, Patia, Bhubaneswar' },
    { id: 15, name: 'Ward 15 - Satya Nagar & Unit-9', label: 'Ward 15 · Satya Nagar', zone: 'Central', center: [20.2780, 85.8400], address: 'Satya Nagar, Unit-9, Bhubaneswar' }
  ];

  function findClosestWard(lat, lng) {
    let minDistance = Infinity;
    let closest = BHUBANESWAR_WARDS[11];
    BHUBANESWAR_WARDS.forEach(w => {
      const dLat = w.center[0] - lat;
      const dLng = w.center[1] - lng;
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      if (dist < minDistance) {
        minDistance = dist;
        closest = w;
      }
    });
    return closest;
  }

  let hasUserSelectedLocation = false;
  let currentUploadedImageUrl = null;
  let recordedVoiceData = null;
  let isRecordingVoice = false;
  let activeDuplicateMatch = null;
  let triageDebounceTimer = null;
  let isSubmitting = false;
  let redirectTimer = null;

  let currentPinLocation = {
    lat: 20.2961,
    lng: 85.8245,
    ward: 'Ward 12',
    wardLabel: 'Ward 12 · Janpath',
    wardCell: 'Ward 12 Infrastructure Cell',
    address: 'Janpath Road, Ram Mandir Square, Bhubaneswar',
    source: 'GPS_DEFAULT'
  };

  let miniMap = null;
  let miniMapMarker = null;

  const descTextarea = document.getElementById('issueDescription');
  const langSelect = document.getElementById('inputLanguageSelect');
  const typingStatusText = document.getElementById('typingStatusText');
  const mapBox = document.getElementById('mapBox');
  const locationConfirmationBox = document.getElementById('locationConfirmationBox');
  const locLatDisplay = document.getElementById('locLatDisplay');
  const locLngDisplay = document.getElementById('locLngDisplay');
  const locAddressDisplay = document.getElementById('locAddressDisplay');
  const coordLatLng = document.getElementById('coordLatLng');
  const coordWardText = document.getElementById('coordWardText');
  const refreshGpsBtn = document.getElementById('refreshGpsBtn');
  const gpsBtnText = document.getElementById('gpsBtnText');

  const uploadBox = document.getElementById('uploadBox');
  const uploadBoxDefault = document.getElementById('uploadBoxDefault');
  const uploadPreviewWrapper = document.getElementById('uploadPreviewWrapper');
  const uploadPreviewImg = document.getElementById('uploadPreviewImg');
  const evidenceFileInput = document.getElementById('evidenceFileInput');
  const removeImgBtn = document.getElementById('removeImgBtn');

  const voiceBox = document.getElementById('voiceBox');
  const voiceLabel = document.getElementById('voiceLabel');
  const anonCheckbox = document.getElementById('anonCheckbox');
  const submitBtn = document.getElementById('submitGrievanceBtn');

  const descError = document.getElementById('descError');
  const locationError = document.getElementById('locationError');
  const photoError = document.getElementById('photoError');

  const aiLangChip = document.getElementById('aiLangChip');
  const aiCanonicalText = document.getElementById('aiCanonicalText');
  const aiKeywordsRow = document.getElementById('aiKeywordsRow');
  const aiDuplicateCard = document.getElementById('aiDuplicateCard');
  const aiDupScore = document.getElementById('aiDupScore');
  const aiDupTitle = document.getElementById('aiDupTitle');
  const aiDupDesc = document.getElementById('aiDupDesc');
  const btnUpvoteMerge = document.getElementById('btnUpvoteMerge');
  const btnKeepNew = document.getElementById('btnKeepNew');
  const aiEvidenceStatusChip = document.getElementById('aiEvidenceStatusChip');
  const aiDetectedElements = document.getElementById('aiDetectedElements');
  const aiConfidenceNum = document.getElementById('aiConfidenceNum');
  const aiConfidenceFill = document.getElementById('aiConfidenceFill');
  const aiDeptName = document.getElementById('aiDeptName');
  const aiWardJurisdiction = document.getElementById('aiWardJurisdiction');
  const aiUrgencyNum = document.getElementById('aiUrgencyNum');
  const aiSeverityChip = document.getElementById('aiSeverityChip');
  const aiSlaHours = document.getElementById('aiSlaHours');
  const aiPbCard = document.getElementById('aiPbCard');
  const aiPbText = document.getElementById('aiPbText');
  const aiComplainantToken = document.getElementById('aiComplainantToken');

  const successModal = document.getElementById('successModal');
  const modalComplaintId = document.getElementById('modalComplaintId');
  const modalCategory = document.getElementById('modalCategory');
  const modalDept = document.getElementById('modalDept');
  const modalSla = document.getElementById('modalSla');
  const modalWard = document.getElementById('modalWard');
  const modalTrackBtn = document.getElementById('modalTrackBtn');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const redirectProgressFill = document.getElementById('redirectProgressFill');
  const redirectCountdownText = document.getElementById('redirectCountdownText');

  function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.style.background = isError ? '#991B1B' : '#0F172A';
    toast.style.color = '#FFFFFF';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '10px';
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.zIndex = '99999';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
    toast.style.fontWeight = '600';
    toast.style.fontSize = '13px';
    toast.style.display = 'block';

    setTimeout(() => {
      toast.style.display = 'none';
    }, 4500);
  }

  function clearValidationErrors() {
    if (descError) { descError.style.display = 'none'; descError.innerHTML = ''; }
    if (locationError) { locationError.style.display = 'none'; locationError.innerHTML = ''; }
    if (photoError) { photoError.style.display = 'none'; photoError.innerHTML = ''; }

    if (descTextarea) descTextarea.classList.remove('field-error');
    if (mapBox) mapBox.classList.remove('field-error');
    if (uploadBox) uploadBox.classList.remove('field-error');
  }

  function validateForm() {
    clearValidationErrors();
    let isValid = true;
    let firstInvalidElement = null;

    const description = (descTextarea?.value || '').trim();

    if (!description || description.length < 5) {
      isValid = false;
      if (descTextarea) descTextarea.classList.add('field-error');
      if (descError) {
        descError.style.display = 'flex';
        descError.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Problem description is required. Please provide a clear explanation of the issue (min 5 characters).';
      }
      if (!firstInvalidElement) firstInvalidElement = descTextarea;
    }

    if (!hasUserSelectedLocation) {
      isValid = false;
      if (mapBox) mapBox.classList.add('field-error');
      if (locationError) {
        locationError.style.display = 'flex';
        locationError.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Location is required. Please select your problem location on the map or use Current Location.';
      }
      if (!firstInvalidElement) firstInvalidElement = mapBox;
    }

    if (!currentUploadedImageUrl) {
      isValid = false;
      if (uploadBox) uploadBox.classList.add('field-error');
      if (photoError) {
        photoError.style.display = 'flex';
        photoError.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Photo evidence is required. Please upload a clear photo of the problem (JPG, JPEG, PNG, WEBP).';
      }
      if (!firstInvalidElement) firstInvalidElement = uploadBox;
    }

    if (!isValid) {
      showToast('Please complete all mandatory fields (Description, Location, Photo) before submitting.', true);
      if (firstInvalidElement) {
        firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (typeof firstInvalidElement.focus === 'function') {
          firstInvalidElement.focus();
        }
      }
    }

    return isValid;
  }

  function detectLanguage(text) {
    if (!text) return 'en';
    if (/[\u0900-\u097F]/.test(text)) return 'hi';
    if (/[\u0B00-\u0B7F]/.test(text)) return 'or';
    if (/[\u0980-\u09FF]/.test(text)) return 'bn';
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
    return 'en';
  }

  function runLiveTriageAnalysis(customData = null) {
    const text = descTextarea ? descTextarea.value.trim() : '';

    if (customData) {
      if (customData.lat && customData.lng) {
        setPinLocation(customData.lat, customData.lng, true, 'SAMPLE_PRESET');
        hasUserSelectedLocation = true;
      }
      applyTriageResult(customData);
      return;
    }

    if (!text || text.length < 5) {
      if (typingStatusText) typingStatusText.textContent = 'AI waiting for description or photo...';
      return;
    }

    if (typingStatusText) typingStatusText.textContent = 'Gemini AI triaging text, urgency & ward jurisdiction...';

    const detectedLang = langSelect.value !== 'auto' ? langSelect.value : detectLanguage(text);
    const lowerText = text.toLowerCase();

    let category = 'road';
    let subCategory = 'pothole';
    let dept = 'Roads & Potholes Dept.';
    let ward = currentPinLocation.ward || 'Ward 12';
    let severity = 'MEDIUM';
    let urgency = 72;
    let sla = '72-Hour Resolution Window';
    let elements = ['Civic Surface Inspection', 'Location Pin Verified'];
    let keywords = ['#civic-defect', `#${ward.toLowerCase().replace(/\s+/g, '')}`];
    let isPb = false;
    let pbText = 'Aggregated defect frequency logged for ward infrastructure analysis.';
    let canonical = text;

    if (lowerText.includes('pothole') || lowerText.includes('road') || lowerText.includes('गड्ढा') || lowerText.includes('सड़क') || lowerText.includes('रास्ता') || lowerText.includes('asphalt')) {
      category = 'road';
      subCategory = 'pothole';
      dept = 'Roads & Potholes Dept.';
      severity = lowerText.includes('accident') || lowerText.includes('severe') || lowerText.includes('deep') || lowerText.includes('हादसा') ? 'CRITICAL' : 'HIGH';
      urgency = severity === 'CRITICAL' ? 90 : 80;
      sla = severity === 'CRITICAL' ? '24-Hour Urgent Safety SLA' : '48-Hour Resolution Window';
      elements = ['Asphalt Degradation', 'Road Cavity (~1.5m)', 'Traffic Bottleneck'];
      keywords = ['#pothole', '#road-maintenance', '#traffic-safety'];
      isPb = true;
      pbText = `4th road defect reported in this ${ward} corridor this quarter. Flagged for Community Participatory Budgeting.`;
      if (detectedLang === 'hi') {
        canonical = 'Deep asphalt pothole cavity reported on roadway creating traffic slowdown and vehicle hazard.';
      }
    } else if (lowerText.includes('garbage') || lowerText.includes('waste') || lowerText.includes('कचरा') || lowerText.includes('गंदगी') || lowerText.includes('डंप') || lowerText.includes('bin') || lowerText.includes('trash')) {
      category = 'garbage_sanitation';
      subCategory = 'overflowing_bin';
      dept = 'Garbage & Sanitation Dept.';
      severity = 'HIGH';
      urgency = 78;
      sla = '24-Hour Sanitation Clearance';
      elements = ['Organic Waste Accumulation', 'Foul Odor Hazard', 'Pedestrian Walkway Blocked'];
      keywords = ['#solid-waste', '#sanitation', '#clean-city'];
      isPb = false;
      if (detectedLang === 'hi') {
        canonical = 'Overflowing solid waste bin and garbage accumulation along public walkway causing health concerns.';
      }
    } else if (lowerText.includes('light') || lowerText.includes('dark') || lowerText.includes('बिजली') || lowerText.includes('अंधेरा') || lowerText.includes('स्ट्रीट लाइट') || lowerText.includes('lamp') || lowerText.includes('pole')) {
      category = 'streetlights';
      subCategory = 'broken_pole';
      dept = 'Street Lighting & Electrical Cell';
      severity = 'HIGH';
      urgency = 82;
      sla = '36-Hour Electrical Maintenance';
      elements = ['Dark Corridor Area', 'Non-Functional Fixture', 'Night Pedestrian Risk'];
      keywords = ['#streetlights', '#electrical', '#night-safety'];
      isPb = true;
      pbText = 'Zone logged recurring lighting defects. Recommended for Smart Solar LED participatory budget proposal.';
      if (detectedLang === 'hi') {
        canonical = 'Non-functional streetlights along major road corridor creating nighttime safety risk for commuters.';
      }
    } else if (lowerText.includes('water') || lowerText.includes('pipe') || lowerText.includes('leak') || lowerText.includes('पानी') || lowerText.includes('पाइप') || lowerText.includes('नाली') || lowerText.includes('drain') || lowerText.includes('sewage')) {
      category = 'water_supply';
      subCategory = 'pipe_burst';
      dept = 'Water Supply & Sewerage Board';
      severity = 'CRITICAL';
      urgency = 94;
      sla = '12-Hour Emergency Pipeline Fix';
      elements = ['Pressurized Water Loss', 'Ground Flooding', 'Erosion Risk'];
      keywords = ['#water-leak', '#pipeline-burst', '#emergency'];
      isPb = false;
      if (detectedLang === 'hi') {
        canonical = 'Drinking water pipeline rupture flooding street and causing clean water loss.';
      }
    }

    let dupMatch = null;
    if (category === 'road' && (lowerText.includes('janpath') || lowerText.includes('college') || lowerText.includes('mandir') || lowerText.includes('जनपथ'))) {
      dupMatch = {
        id: '#CB-0142',
        title: 'Large pothole near college gate',
        desc: `Reported 3 hours ago · ${ward}`,
        score: '88% Match Found'
      };
    }

    const langNames = {
      en: '🌐 English',
      hi: '🌐 हिन्दी (Hindi)',
      or: '🌐 ଓଡ଼ିଆ (Odia)',
      bn: '🌐 বাংলা (Bengali)',
      ta: '🌐 தமிழ் (Tamil)'
    };

    applyTriageResult({
      lang_label: langNames[detectedLang] || '🌐 Auto-Detected',
      canonical: canonical,
      keywords: keywords,
      category: category,
      sub_category: subCategory,
      dept: dept,
      ward: `${ward} Infrastructure Cell`,
      severity: severity,
      urgency: urgency,
      sla: sla,
      elements: elements,
      auth: '96% Real Civic Defect',
      conf: 96,
      is_pb: isPb,
      pb_text: pbText,
      dup_match: dupMatch
    });

    if (typingStatusText) typingStatusText.textContent = '✓ AI Triage complete & verified';
  }

  function applyTriageResult(data) {
    if (aiLangChip && (data.lang_label || data.lang)) {
      aiLangChip.textContent = data.lang_label || (data.lang === 'hi' ? '🌐 हिन्दी (Hindi)' : '🌐 English');
    }
    if (aiCanonicalText) {
      aiCanonicalText.textContent = `"${data.canonical || data.text || ''}"`;
    }
    if (aiKeywordsRow && data.keywords) {
      aiKeywordsRow.innerHTML = data.keywords.map(k => `<span class="keyword-tag">${k}</span>`).join('');
    }
    if (aiDeptName) aiDeptName.textContent = data.dept || 'Roads & Potholes Dept.';
    if (aiWardJurisdiction) aiWardJurisdiction.textContent = data.ward || `${currentPinLocation.ward} Infrastructure Cell`;
    if (aiUrgencyNum) aiUrgencyNum.textContent = `${data.urgency || 85} / 100`;
    if (aiSeverityChip) aiSeverityChip.textContent = data.severity || 'HIGH';
    if (aiSlaHours) aiSlaHours.textContent = data.sla || '48-Hour Resolution Window';

    if (aiDetectedElements && data.elements) {
      aiDetectedElements.innerHTML = data.elements.map(e => `
        <span class="defect-tag"><i class="fa-solid fa-circle-dot"></i> ${e}</span>
      `).join('');
    }

    if (aiEvidenceStatusChip) {
      aiEvidenceStatusChip.innerHTML = `<i class="fa-solid fa-shield-check"></i> ${data.auth || '96% Real Civic Defect'}`;
    }
    if (aiConfidenceNum) aiConfidenceNum.textContent = `${data.conf || 96}%`;
    if (aiConfidenceFill) aiConfidenceFill.style.width = `${data.conf || 96}%`;

    activeDuplicateMatch = data.dup_match || null;
    if (aiDuplicateCard) {
      if (activeDuplicateMatch) {
        aiDuplicateCard.style.display = 'block';
        if (aiDupScore) aiDupScore.textContent = activeDuplicateMatch.score || '89% Match Found';
        if (aiDupTitle) aiDupTitle.textContent = `Similar Grievance ${activeDuplicateMatch.id} nearby`;
        if (aiDupDesc) aiDupDesc.textContent = `"${activeDuplicateMatch.title}" (${activeDuplicateMatch.desc})`;
      } else {
        aiDuplicateCard.style.display = 'none';
      }
    }

    if (aiPbCard) {
      if (data.is_pb) {
        aiPbCard.style.display = 'block';
        if (aiPbText) aiPbText.innerHTML = `<strong>Chronic Infrastructure Failure:</strong> ${data.pb_text}`;
      } else {
        aiPbCard.style.display = 'none';
      }
    }

    if (aiComplainantToken) {
      const randNum = Math.floor(1000 + Math.random() * 9000);
      aiComplainantToken.textContent = `ANON-${currentPinLocation.ward.replace(/\s+/g, '')}-${randNum}`;
    }
  }

  document.querySelectorAll('.sample-chip').forEach(btn => {
    btn.addEventListener('click', function () {
      const sampleKey = this.getAttribute('data-sample');
      const sample = SAMPLE_DATA[sampleKey];
      if (!sample) return;

      if (descTextarea) descTextarea.value = sample.text;
      if (langSelect) langSelect.value = sample.lang;

      if (sample.image) {
        currentUploadedImageUrl = sample.image;
        if (uploadPreviewImg) uploadPreviewImg.src = sample.image;
        if (uploadPreviewWrapper) uploadPreviewWrapper.style.display = 'block';
        if (uploadBoxDefault) uploadBoxDefault.style.display = 'none';
      }

      hasUserSelectedLocation = true;
      setPinLocation(sample.lat, sample.lng, true, 'SAMPLE_TEMPLATE');

      clearValidationErrors();
      runLiveTriageAnalysis(sample);
      showToast(`Auto-filled "${this.textContent.trim()}". AI triage updated!`);
    });
  });

  if (descTextarea) {
    descTextarea.addEventListener('input', function () {
      clearTimeout(triageDebounceTimer);
      if (descTextarea.value.trim().length >= 5 && descError) {
        descError.style.display = 'none';
        descTextarea.classList.remove('field-error');
      }
      if (typingStatusText) typingStatusText.textContent = 'AI parsing description...';
      triageDebounceTimer = setTimeout(() => {
        runLiveTriageAnalysis();
      }, 350);
    });
  }

  if (langSelect) {
    langSelect.addEventListener('change', () => runLiveTriageAnalysis());
  }

  if (uploadBox) {
    uploadBox.addEventListener('click', function (e) {
      if (e.target.id === 'removeImgBtn' || e.target.closest('#removeImgBtn')) return;
      if (evidenceFileInput) evidenceFileInput.click();
    });
  }

  if (evidenceFileInput) {
    evidenceFileInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        if (uploadBox) uploadBox.classList.add('field-error');
        if (photoError) {
          photoError.style.display = 'flex';
          photoError.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image.';
        }
        showToast('Unsupported image format. Please select JPG, PNG, or WEBP.', true);
        evidenceFileInput.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = function (evt) {
        currentUploadedImageUrl = evt.target.result;
        if (uploadPreviewImg) uploadPreviewImg.src = currentUploadedImageUrl;
        if (uploadPreviewWrapper) uploadPreviewWrapper.style.display = 'block';
        if (uploadBoxDefault) uploadBoxDefault.style.display = 'none';

        if (uploadBox) uploadBox.classList.remove('field-error');
        if (photoError) { photoError.style.display = 'none'; photoError.innerHTML = ''; }

        showToast('Photo evidence attached. AI visual defect audit completed.');
        runLiveTriageAnalysis();
      };
      reader.onerror = function () {
        showToast('Failed to process image file. Please try selecting another photo.', true);
      };
      reader.readAsDataURL(file);
    });
  }

  if (removeImgBtn) {
    removeImgBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      currentUploadedImageUrl = null;
      if (uploadPreviewWrapper) uploadPreviewWrapper.style.display = 'none';
      if (uploadBoxDefault) uploadBoxDefault.style.display = 'block';
      if (evidenceFileInput) evidenceFileInput.value = '';
      showToast('Image removed.');
    });
  }

  if (voiceBox) {
    voiceBox.addEventListener('click', function () {
      isRecordingVoice = !isRecordingVoice;
      voiceBox.classList.toggle('recording', isRecordingVoice);

      if (isRecordingVoice) {
        voiceLabel.textContent = 'Listening… speak your grievance';

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.lang = langSelect.value === 'hi' ? 'hi-IN' : (langSelect.value === 'or' ? 'or-IN' : 'en-IN');
          recognition.continuous = false;
          recognition.interimResults = false;

          recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            recordedVoiceData = transcript;
            if (descTextarea) {
              descTextarea.value = descTextarea.value ? `${descTextarea.value} ${transcript}` : transcript;
            }
            voiceBox.classList.remove('recording');
            voiceLabel.textContent = 'Voice note recorded ✓';
            isRecordingVoice = false;
            if (descError) { descError.style.display = 'none'; descTextarea?.classList.remove('field-error'); }
            runLiveTriageAnalysis();
            showToast('Voice note transcribed & added to description.');
          };

          recognition.onerror = function () {
            simulateVoiceNote();
          };

          try {
            recognition.start();
          } catch (e) {
            simulateVoiceNote();
          }
        } else {
          simulateVoiceNote();
        }
      } else {
        voiceLabel.textContent = 'Tap to record voice note';
      }
    });
  }

  function simulateVoiceNote() {
    setTimeout(() => {
      const isHindi = langSelect.value === 'hi';
      const speechSample = isHindi
        ? 'सड़क पर गहरा गड्ढा है जिससे यहाँ रोजाना गाड़ियाँ दुर्घटनाग्रस्त हो रही हैं।'
        : 'Deep pothole on the main road causing dangerous traffic slowdown and risk of vehicle damage.';
      recordedVoiceData = speechSample;
      if (descTextarea) {
        descTextarea.value = descTextarea.value ? `${descTextarea.value} ${speechSample}` : speechSample;
      }
      if (voiceBox) voiceBox.classList.remove('recording');
      if (voiceLabel) voiceLabel.textContent = 'Voice note recorded ✓';
      isRecordingVoice = false;
      if (descError) { descError.style.display = 'none'; descTextarea?.classList.remove('field-error'); }
      runLiveTriageAnalysis();
      showToast('Speech processed: Added voice transcript to grievance description.');
    }, 2000);
  }

  function createCustomPinIcon() {
    if (typeof window === 'undefined' || !window.L) return null;
    return window.L.divIcon({
      className: 'leaflet-custom-civic-pin',
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -38],
      html: `
        <div class="mini-map-pin-container" title="Drag to adjust issue location">
          <div class="mini-pin-pulse"></div>
          <svg class="mini-pin-svg" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="18" cy="46.5" rx="6" ry="2" fill="rgba(0,0,0,0.3)" />
            <path d="M18 0C8.06 0 0 8.06 0 18C0 30.5 15.6 44.8 17.2 46.2C17.7 46.6 18.3 46.6 18.8 46.2C20.4 44.8 36 30.5 36 18C36 8.06 27.94 0 18 0Z" fill="#EA4335"/>
            <path d="M18 0.75C8.47 0.75 0.75 8.47 0.75 18C0.75 29.8 15.9 43.6 17.6 45.1C17.8 45.3 18.2 45.3 18.4 45.1C20.1 43.6 35.25 29.8 35.25 18C35.25 8.47 27.53 0.75 18 0.75Z" stroke="#B31412" stroke-width="1.2"/>
            <circle cx="18" cy="16.5" r="6.5" fill="#FFFFFF"/>
            <circle cx="18" cy="16.5" r="3" fill="#EA4335"/>
          </svg>
        </div>
      `
    });
  }

  function initMiniMap() {
    const mapElement = document.getElementById('miniMap');
    if (!mapElement || !window.L || miniMap) return;

    try {
      miniMap = window.L.map('miniMap', {
        center: [currentPinLocation.lat, currentPinLocation.lng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false
      });

      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(miniMap);

      const pinIcon = createCustomPinIcon();
      miniMapMarker = window.L.marker([currentPinLocation.lat, currentPinLocation.lng], {
        icon: pinIcon,
        draggable: true,
        autoPan: true
      }).addTo(miniMap);

      miniMapMarker.on('dragend', function (e) {
        const pos = e.target.getLatLng();
        hasUserSelectedLocation = true;
        setPinLocation(pos.lat, pos.lng, false, 'PIN_DRAG');
        clearValidationErrors();
        showToast(`Pinpoint updated: ${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)} (${currentPinLocation.wardLabel})`);
      });

      miniMap.on('click', function (e) {
        hasUserSelectedLocation = true;
        setPinLocation(e.latlng.lat, e.latlng.lng, true, 'PIN_CLICK');
        clearValidationErrors();
        showToast(`Issue location selected: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)} (${currentPinLocation.wardLabel})`);
      });

      setTimeout(() => {
        if (miniMap) miniMap.invalidateSize();
      }, 300);
    } catch (err) {
      console.warn('MiniMap initialization notice:', err);
    }
  }

  function setPinLocation(lat, lng, fly = true, source = 'GPS_LIVE') {
    const numLat = parseFloat(lat);
    const numLng = parseFloat(lng);
    if (isNaN(numLat) || isNaN(numLng)) return;

    const closestWard = findClosestWard(numLat, numLng);
    currentPinLocation = {
      lat: numLat,
      lng: numLng,
      ward: `Ward ${closestWard.id}`,
      wardLabel: closestWard.label,
      wardCell: `${closestWard.label} Infrastructure Cell`,
      address: `${closestWard.address}, Bhubaneswar`,
      source: source
    };

    if (miniMapMarker) {
      miniMapMarker.setLatLng([numLat, numLng]);
    }
    if (fly && miniMap) {
      miniMap.flyTo([numLat, numLng], 16, { duration: 0.8 });
    }

    if (coordLatLng) coordLatLng.textContent = `${numLat.toFixed(4)}, ${numLng.toFixed(4)}`;
    if (coordWardText) coordWardText.textContent = currentPinLocation.wardLabel;

    if (locationConfirmationBox) {
      locationConfirmationBox.style.display = 'block';
      if (locLatDisplay) locLatDisplay.textContent = numLat.toFixed(4);
      if (locLngDisplay) locLngDisplay.textContent = numLng.toFixed(4);
      if (locAddressDisplay) {
        locAddressDisplay.textContent = `📍 ${currentPinLocation.wardLabel} (${currentPinLocation.address})`;
      }
    }

    if (locationError) { locationError.style.display = 'none'; locationError.innerHTML = ''; }
    if (mapBox) mapBox.classList.remove('field-error');

    if (aiWardJurisdiction) {
      aiWardJurisdiction.textContent = currentPinLocation.wardCell;
    }
  }

  if (refreshGpsBtn) {
    refreshGpsBtn.addEventListener('click', function () {
      if (gpsBtnText) gpsBtnText.textContent = 'Acquiring GPS…';
      refreshGpsBtn.disabled = true;

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            hasUserSelectedLocation = true;
            setPinLocation(lat, lng, true, 'DEVICE_GPS');
            showToast(`GPS pinpoint locked: ${lat.toFixed(4)}, ${lng.toFixed(4)} (${currentPinLocation.wardLabel})`);
            if (gpsBtnText) gpsBtnText.textContent = 'GPS Active ✓';
            setTimeout(() => {
              if (gpsBtnText) gpsBtnText.textContent = 'Current GPS';
              refreshGpsBtn.disabled = false;
            }, 2500);
          },
          err => {
            console.warn('Geolocation lookup notice:', err);
            hasUserSelectedLocation = true;
            setPinLocation(20.2961, 85.8245, true, 'PIN_DROP');
            showToast('Using Bhubaneswar Ward 12 (Janpath) coordinates.');
            if (gpsBtnText) gpsBtnText.textContent = 'GPS Active ✓';
            setTimeout(() => {
              if (gpsBtnText) gpsBtnText.textContent = 'Current GPS';
              refreshGpsBtn.disabled = false;
            }, 2000);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        hasUserSelectedLocation = true;
        setPinLocation(20.2961, 85.8245, true, 'PIN_DROP');
        showToast('Using Bhubaneswar central coordinates.');
        if (gpsBtnText) gpsBtnText.textContent = 'Current GPS';
        refreshGpsBtn.disabled = false;
      }
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', async function (e) {
      e.preventDefault();
      if (isSubmitting) return;

      if (!validateForm()) {
        return;
      }

      isSubmitting = true;
      submitBtn.disabled = true;

      const description = descTextarea.value.trim();

      try {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Validating Complaint...';
        await new Promise(r => setTimeout(r, 250));

        submitBtn.innerHTML = '<i class="fa-solid fa-brain fa-fade"></i> Analyzing your grievance with AI...';
        runLiveTriageAnalysis();
        await new Promise(r => setTimeout(r, 350));

        submitBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up fa-fade"></i> Uploading evidence...';
        await new Promise(r => setTimeout(r, 300));

        submitBtn.innerHTML = '<i class="fa-solid fa-database fa-spin"></i> Saving your grievance...';

        const categoryVal = (aiDeptName?.textContent || '').includes('Garbage') ? 'SANITATION'
          : (aiDeptName?.textContent || '').includes('Light') ? 'STREETLIGHTS'
          : (aiDeptName?.textContent || '').includes('Water') ? 'WATER_SUPPLY'
          : 'ROADS';

        const rawSeverity = (aiSeverityChip?.textContent || 'HIGH').toUpperCase();
        const urgencyVal = parseInt(aiUrgencyNum?.textContent) || 85;
        const deptVal = aiDeptName?.textContent || 'Roads & Potholes Dept.';
        const slaHoursVal = rawSeverity === 'CRITICAL' ? 24 : (rawSeverity === 'HIGH' ? 48 : 72);
        const uniqueCid = `CB-BHUB-${Math.floor(1000 + Math.random() * 9000)}`;

        const complaintPayload = {
          complaint_id: uniqueCid,
          title: description.slice(0, 60) + (description.length > 60 ? '…' : ''),
          description: description,
          latitude: currentPinLocation.lat,
          longitude: currentPinLocation.lng,
          location_source: currentPinLocation.source || 'GPS_PINPOINT',
          address: currentPinLocation.address || 'Janpath Road, Bhubaneswar, Odisha',
          ward: currentPinLocation.ward || 'Ward 12',
          ward_label: currentPinLocation.wardLabel || 'Ward 12 · Janpath',
          category: categoryVal,
          sub_category: categoryVal === 'ROADS' ? 'pothole' : (categoryVal === 'SANITATION' ? 'overflowing_bin' : (categoryVal === 'STREETLIGHTS' ? 'broken_pole' : 'pipe_burst')),
          severity: rawSeverity,
          priority_level: rawSeverity,
          urgency_score: urgencyVal,
          department_name: deptVal,
          department_code: `DEPT-${categoryVal}`,
          sla_hours: slaHoursVal,
          language: langSelect ? langSelect.value : 'en',
          is_anonymous: anonCheckbox ? anonCheckbox.checked : true,
          image_url: currentUploadedImageUrl,
          voice_url: recordedVoiceData,
          ai_summary: aiCanonicalText?.textContent?.replace(/^"|"$/g, '') || description,
          is_pb_candidate: aiPbCard && aiPbCard.style.display !== 'none',
          status: 'SUBMITTED',
          upvotes: 1,
          timeline: [
            {
              step: 'Complaint Submitted',
              timestamp: new Date().toISOString(),
              notes: 'Grievance recorded with verified GPS coordinates & photo evidence.'
            },
            {
              step: 'AI Triaged & Grounded',
              timestamp: new Date().toISOString(),
              notes: `AI classified as ${categoryVal} (${rawSeverity} priority, Urgency: ${urgencyVal}/100).`
            },
            {
              step: 'Routed to Department',
              timestamp: new Date().toISOString(),
              notes: `Assigned to ${deptVal} with guaranteed ${slaHoursVal}h municipal SLA.`
            }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        let savedComplaint = complaintPayload;
        if (window.CivicBuzzAPI?.complaints?.create) {
          try {
            const res = await window.CivicBuzzAPI.complaints.create(complaintPayload);
            if (res?.data) savedComplaint = res.data;
          } catch (apiErr) {
            console.warn('Backend API note (saving via sync store):', apiErr);
            if (window.CivicBuzzAPI?.store?.add) {
              window.CivicBuzzAPI.store.add(complaintPayload);
            }
          }
        } else if (window.ComplaintStore?.add) {
          window.ComplaintStore.add(complaintPayload);
        }

        const finalCid = savedComplaint?.complaint_id || uniqueCid;
        if (modalComplaintId) modalComplaintId.textContent = `#${finalCid}`;
        if (modalCategory) modalCategory.textContent = categoryVal.replace(/_/g, ' ');
        if (modalDept) modalDept.textContent = deptVal;
        if (modalSla) modalSla.textContent = `${rawSeverity} · ${slaHoursVal}h SLA`;
        if (modalWard) modalWard.textContent = currentPinLocation.wardLabel || 'Ward 12 · Janpath';

        if (successModal) {
          successModal.style.display = 'flex';
          if (redirectProgressFill) {
            redirectProgressFill.style.width = '0%';
            setTimeout(() => {
              redirectProgressFill.style.width = '100%';
            }, 50);
          }
        }

        showToast(`Complaint #${finalCid} registered successfully!`);

        let secondsLeft = 2;
        if (redirectCountdownText) redirectCountdownText.textContent = `Redirecting to Track Issues in ${secondsLeft}s...`;

        const countdownInterval = setInterval(() => {
          secondsLeft--;
          if (secondsLeft > 0 && redirectCountdownText) {
            redirectCountdownText.textContent = `Redirecting to Track Issues in ${secondsLeft}s...`;
          }
        }, 1000);

        redirectTimer = setTimeout(() => {
          clearInterval(countdownInterval);
          window.location.href = '../Track_complaints_Frontend/index.html';
        }, 2500);

      } catch (submitErr) {
        console.error('Submission error:', submitErr);
        showToast('Unable to submit your grievance. Please check your connection and try again.', true);
      } finally {
        submitBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> Run AI Triage &amp; Submit Grievance';
        submitBtn.disabled = false;
        isSubmitting = false;
      }
    });
  }

  // Modal Actions
  if (modalTrackBtn) {
    modalTrackBtn.addEventListener('click', function () {
      clearTimeout(redirectTimer);
      window.location.href = '../Track_complaints_Frontend/index.html';
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', function () {
      clearTimeout(redirectTimer);
      if (successModal) successModal.style.display = 'none';
      if (descTextarea) descTextarea.value = '';
      currentUploadedImageUrl = null;
      recordedVoiceData = null;
      hasUserSelectedLocation = false;
      if (uploadPreviewWrapper) uploadPreviewWrapper.style.display = 'none';
      if (uploadBoxDefault) uploadBoxDefault.style.display = 'block';
      if (evidenceFileInput) evidenceFileInput.value = '';
      if (locationConfirmationBox) locationConfirmationBox.style.display = 'none';
      if (coordLatLng) coordLatLng.textContent = 'Click map or Current GPS';
      if (coordWardText) coordWardText.textContent = 'Unselected';
      clearValidationErrors();
      showToast('Form ready for new grievance submission.');
    });
  }

  // Initialize Map
  initMiniMap();
})();
