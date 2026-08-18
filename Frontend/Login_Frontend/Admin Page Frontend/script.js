/* CivicBuzz Admin Portal - all dashboard interactions live in this file. */

const userId = "USR10245";
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const chartSets = {
  week: {
    labels: ["May 8", "May 9", "May 10", "May 11", "May 12", "May 13", "May 14"],
    reported: [111, 105, 80, 57, 94, 72, 53],
    resolved: [142, 135, 134, 112, 133, 115, 104],
  },
  month: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Today"],
    reported: [125, 97, 117, 71, 89, 46, 61],
    resolved: [158, 126, 145, 109, 116, 88, 99],
  },
  quarter: {
    labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    reported: [140, 116, 128, 91, 79, 62, 48],
    resolved: [172, 144, 149, 127, 111, 84, 72],
  },
};

let toastTimer;

const translations = {
  "Admin Portal": "एडमिन पोर्टल",
  Dashboard: "डैशबोर्ड",
  "Issue Queue": "समस्या सूची",
  "Map & Hotspots": "मानचित्र और हॉटस्पॉट",
  Departments: "विभाग",
  Budgeting: "बजट",
  Analytics: "विश्लेषण",
  Settings: "सेटिंग्स",
  "Super Admin": "सुपर एडमिन",
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
  "My Reports": "मेरी रिपोर्ट",
  "Dark Mode": "डार्क मोड",
  "Light Mode": "लाइट मोड",
  Logout: "लॉगआउट",

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
};

const attributeTranslations = {
  "Search issues, locations, departments...": "समस्याएं, स्थान, विभाग खोजें...",
  "Choose language": "भाषा चुनें",
  Notifications: "सूचनाएं",
  "Open navigation": "नेविगेशन खोलें",
  "Open profile menu": "प्रोफाइल मेनू खोलें",
  "Account options": "खाता विकल्प",
  "Switch to light mode": "लाइट मोड पर स्विच करें",
  "Switch to dark mode": "डार्क मोड पर स्विच करें",
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
          ? attributeTranslations[original.placeholder] || original.placeholder
          : original.placeholder,
      );
    }

    if (original.ariaLabel) {
      element.setAttribute(
        "aria-label",
        isHindi
          ? attributeTranslations[original.ariaLabel] || original.ariaLabel
          : original.ariaLabel,
      );
    }
  });
}

function setupLanguage() {
  const languageDropdown = $("#languageDropdown");
  const languageSelected = $("#languageSelected");
  const selectedLanguage = $("#selectedLanguage");
  const languageOptions = $$(".lang-option");

  if (!languageDropdown || !languageSelected) {
    return;
  }

  let language = "en";

  try {
    language = localStorage.getItem("civicbuzz-admin-language") || "en";
  } catch (_) {
    // Storage is optional.
  }

  if (language !== "hi") {
    language = "en";
  }

  if (selectedLanguage) {
    selectedLanguage.textContent =
      language === "hi" ? "हिन्दी" : "English";
  }

  languageSelected.setAttribute("aria-expanded", "false");

  translatePage(language);
  updateTrendChart($("#trendRange")?.value || "week");

  languageSelected.addEventListener("click", (event) => {
    event.stopPropagation();

    const isOpen = languageDropdown.classList.toggle("open");

    languageSelected.setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });

  languageOptions.forEach((option) => {
    option.addEventListener("click", (event) => {
      event.stopPropagation();

      const selectedValue =
        option.dataset.value === "hi" ? "hi" : "en";

      if (selectedLanguage) {
        selectedLanguage.textContent =
          selectedValue === "hi" ? "हिन्दी" : "English";
      }

      languageDropdown.classList.remove("open");

      languageSelected.setAttribute(
        "aria-expanded",
        "false"
      );

      translatePage(selectedValue);

      updateTrendChart(
        $("#trendRange")?.value || "week"
      );

      try {
        localStorage.setItem(
          "civicbuzz-admin-language",
          selectedValue
        );
      } catch (_) {
        // Storage is optional.
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!languageDropdown.contains(event.target)) {
      languageDropdown.classList.remove("open");

      languageSelected.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      languageDropdown.classList.remove("open");

      languageSelected.setAttribute(
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

function updateTrendChart(range) {
  const data = chartSets[range];

  if (!data) {
    return;
  }

  const toPoints = (values) =>
    values
      .map((value, index) => {
        const x =
          index === 0
            ? 10
            : index === values.length - 1
              ? 720
              : 10 + (710 / (values.length - 1)) * index;

        return `${x.toFixed(1)},${value}`;
      })
      .join(" ");

  const addPoints = (groupId, values, className) => {
    const group = $(groupId);

    if (!group) {
      return;
    }

    group.innerHTML = values
      .map((value, index) => {
        const x =
          index === 0
            ? 10
            : index === values.length - 1
              ? 720
              : 10 + (710 / (values.length - 1)) * index;

        return `<circle class="${className}" cx="${x.toFixed(
          1
        )}" cy="${value}" r="4.3"></circle>`;
      })
      .join("");
  };

  const reportedLine = $("#reportedLine");
  const resolvedLine = $("#resolvedLine");

  if (reportedLine) {
    reportedLine.setAttribute(
      "points",
      toPoints(data.reported)
    );
  }

  if (resolvedLine) {
    resolvedLine.setAttribute(
      "points",
      toPoints(data.resolved)
    );
  }

  addPoints(
    "#reportedPoints",
    data.reported,
    "reported-point"
  );

  addPoints(
    "#resolvedPoints",
    data.resolved,
    "resolved-point"
  );

  const labelRow = $("#chartLabels");

  if (labelRow) {
    labelRow.innerHTML = data.labels
      .map((label) => `<span>${t(label)}</span>`)
      .join("");
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
  $$(".nav-link").forEach((item) =>
    item.classList.remove("active")
  );

  link.classList.add("active");

  const breadcrumb = $("#breadcrumbCurrent");

  if (breadcrumb) {
    const section =
      link.dataset.section ||
      link.textContent.trim();

    breadcrumb.textContent = t(section);
  }
}

function setupSearch() {
  const input = $("#dashboardSearch");

  if (!input) {
    return;
  }

  const searchableItems = [
    ...$$(".alert-item"),
    ...$$(".table-row"),
    ...$$(".activity"),
  ];

  input.addEventListener("input", () => {
    const term = input.value.trim().toLowerCase();
    let results = 0;

    searchableItems.forEach((item) => {
      const matches =
        !term ||
        item.textContent
          .toLowerCase()
          .includes(term);

      item.hidden = !matches;

      if (matches) {
        results += 1;
      }
    });

    if (term && results === 0) {
      if (currentLanguage() === "hi") {
        showToast(
          `"${input.value.trim()}" के लिए कोई मिलती-जुलती समस्या नहीं मिली।`
        );
      } else {
        showToast(
          `No matching issues found for "${input.value.trim()}".`
        );
      }
    }
  });

  window.addEventListener("keydown", (event) => {
    const isSearchShortcut =
      (event.metaKey || event.ctrlKey) &&
      event.key.toLowerCase() === "k";

    if (!isSearchShortcut) {
      return;
    }

    event.preventDefault();
    input.focus();
  });
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
    link.addEventListener("click", () => {
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

function setupActions() {
  const newIssue = $("#newIssue");

  newIssue?.addEventListener("click", () => {
    const queue = $("#queue");

    queue?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    showToast(
      "New issue workflow opened in the routing queue."
    );
  });

  $$("[data-toast]").forEach((button) => {
    button.addEventListener("click", () =>
      showToast(button.dataset.toast)
    );
  });

  $(".notification")?.addEventListener(
    "click",
    () => {
      showToast(
        "You have 3 priority issue notifications."
      );
    }
  );

  $$(".pin").forEach((pin) => {
    pin.addEventListener("click", () =>
      showToast(
        pin.getAttribute("aria-label")
      )
    );
  });

  $$(".department-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("assigned");

      showToast(
        chip.dataset.toast ||
        "Department assignment updated."
      );
    });
  });
}

function setupFooterActions() {
  const footer = $(".site-footer");

  if (!footer) {
    return;
  }

  const messageByLabel = {
    FAQs: "FAQs page will open here.",
    "How to Report":
      "How-to-report guide will open here.",
    "How Tracking Works":
      "Complaint tracking guide will open here.",
    "Contact Support":
      "Support contact options will open here.",
    "About CivicBuzz":
      "About CivicBuzz page will open here.",
    "Privacy Policy":
      "Privacy policy will open here.",
    "Terms & Conditions":
      "Terms and conditions will open here.",
    Accessibility:
      "Accessibility settings will open here.",
    LinkedIn:
      "CivicBuzz LinkedIn profile will open here.",
  };

  $$("a[href='#footer']", footer).forEach(
    (link) => {
      link.addEventListener(
        "click",
        (event) => {
          event.preventDefault();

          const label =
            link.textContent.trim();

          showToast(
            messageByLabel[label] ||
            `${label} is ready to configure.`
          );
        }
      );
    }
  );

  $$(".footer-stats div", footer).forEach(
    (stat) => {
      stat.tabIndex = 0;

      stat.setAttribute(
        "role",
        "button"
      );

      stat.setAttribute(
        "aria-label",
        `View details for ${stat.textContent.trim()}`
      );

      const showStatDetail = () =>
        showToast(
          `${stat.textContent.trim()} - detailed analytics will open here.`
        );

      stat.addEventListener(
        "click",
        showStatDetail
      );

      stat.addEventListener(
        "keydown",
        (event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            showStatDetail();
          }
        }
      );
    }
  );
}

function setupProfileMenu() {
  const wrapper = $("#profileWrapper");
  const button = $("#profileButton");
  const dropdown = $("#profileDropdown");

  if (
    !wrapper ||
    !button ||
    !dropdown
  ) {
    return;
  }

  const closeMenu = () => {
    wrapper.classList.remove(
      "is-open"
    );

    button.setAttribute(
      "aria-expanded",
      "false"
    );

    dropdown.setAttribute(
      "aria-hidden",
      "true"
    );
  };

  const openMenu = () => {
    wrapper.classList.add(
      "is-open"
    );

    button.setAttribute(
      "aria-expanded",
      "true"
    );

    dropdown.setAttribute(
      "aria-hidden",
      "false"
    );
  };

  button.addEventListener("click", () => {
    if (
      wrapper.classList.contains(
        "is-open"
      )
    ) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  dropdown.addEventListener(
    "click",
    (event) => {
      const item =
        event.target.closest(
          "[data-action]"
        );

      if (!item) {
        return;
      }

      const action =
        item.dataset.action;

      if (action === "theme") {
        setTheme(
          document.body.classList.contains(
            "dark-theme"
          )
            ? "light"
            : "dark"
        );

        showToast(
          document.body.classList.contains(
            "dark-theme"
          )
            ? "Dark mode enabled."
            : "Light mode enabled."
        );

        return;
      }

      const messages = {
        profile:
          "My Profile will open here.",
        reports:
          "My Reports will open here.",
        logout:
          "Logout is a demo action in this dashboard.",
      };

      showToast(
        messages[action] ||
        "Action selected."
      );

      closeMenu();
    }
  );

  document.addEventListener(
    "click",
    (event) => {
      if (
        !wrapper.contains(event.target)
      ) {
        closeMenu();
      }
    }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        closeMenu();
        button.focus();
      }
    }
  );
}

function initialiseDashboard() {
  let savedTheme = "light";

  try {
    savedTheme =
      localStorage.getItem(
        "civicbuzz-admin-theme"
      ) || "light";
  } catch (_) {
    savedTheme = "light";
  }

  setTheme(savedTheme);

  setupLanguage();

  updateTrendChart("week");

  setupNavigation();

  setupSearch();

  setupActions();

  setupFooterActions();

  setupProfileMenu();

  $("#trendRange")?.addEventListener(
    "change",
    (event) => {
      updateTrendChart(
        event.target.value
      );

      showToast(
        `Trend updated: ${event.target.options[
          event.target.selectedIndex
        ].text
        }.`
      );
    }
  );
}

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initialiseDashboard
  );
} else {
  initialiseDashboard();
}
document.getElementById("userIdText").textContent = userId;