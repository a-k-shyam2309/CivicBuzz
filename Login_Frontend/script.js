// ============================================================
// CIVICBUZZ - MAIN SCRIPT
// ============================================================


// ============================================================
// LANGUAGE CATALOG
// ============================================================

const languageCatalog = {

  en: {
    label: "English",
    welcome: "Choose your language",
    continue: "Continue →"
  },

  hi: {
    label: "हिंदी",
    welcome: "अपनी भाषा चुनें",
    continue: "जारी रखें →"
  }

};


// ============================================================
// TRANSLATIONS
// ============================================================

const strings = {

  en: {

    better_city: "A BETTER CITY, TOGETHER",

    hero_title:
      "Turn civic issues into visible action.",

    hero_text:
      "A trusted space where citizens report, officials act, and every resolution is evidence-grounded.",

    civic_connection:
      "Connected civic action, from report to resolution.",

    welcome:
      "WELCOME BACK",

    sign_in:
      "Sign in to CivicBuzz",

    sign_in_text:
      "Choose how you want to enter the platform.",

    citizen:
      "Citizen",

    admin:
      "Administrator",

    email:
      "Email address",

    password:
      "Password",

    remember:
      "Remember me",

    forgot:
      "Forgot password?",

    new_here:
      "New to CivicBuzz?",

    create_account:
      "Create an account",

    secure:
      "Secure civic access · Your data stays protected",

    menu:
      "MENU",

    overview:
      "Overview",

    report_issue:
      "Report an issue",

    civic_map:
      "Civic map",

    my_complaints:
      "My complaints",

    budget:
      "Community budget",

    dark_mode:
      "Dark mode",

    logout:
      "Log out",

    your_city:
      "YOUR CITY AT A GLANCE",

    active_reports:
      "Active reports",

    active_context:
      "Across your area",

    resolved:
      "Resolved this month",

    vs_last:
      "vs. last month",

    community_impact:
      "Community impact",

    citizens_helped:
      "Citizens helped",

    notice:
      "Your report #CIV-1042 is now being reviewed by Road Maintenance.",

    latest_report:
      "Latest report",

    track_status:
      "Track its status in real time",

    view_all:
      "View all →",

    under_review:
      "Under review",

    issue_title:
      "Pothole near college gate",

    review_progress:
      "Review in progress",

    community_priority:
      "Community priorities",

    shaped_by:
      "Shaped by local reports",

    live_data:
      "Live data",

    drainage:
      "Drainage improvement",

    streetlights:
      "Streetlight repair",

    roads:
      "Road repair",

    reports:
      "reports",

    full_name:
      "Full name",

    continue:
      "Continue →",

    register_text:
      "Join your community's civic action network."

  },


  hi: {

    better_city:
      "एक बेहतर शहर, साथ मिलकर",

    hero_title:
      "नागरिक समस्याओं को दृश्यमान कार्रवाई में बदलें।",

    hero_text:
      "एक विश्वसनीय स्थान जहाँ नागरिक रिपोर्ट करते हैं, अधिकारी कार्रवाई करते हैं और हर समाधान साक्ष्य-आधारित है।",

    civic_connection:
      "रिपोर्ट से समाधान तक, जुड़ी हुई नागरिक कार्रवाई।",

    welcome:
      "वापसी पर स्वागत है",

    sign_in:
      "CivicBuzz में साइन इन करें",

    sign_in_text:
      "चुनें कि आप प्लेटफ़ॉर्म में कैसे प्रवेश करना चाहते हैं।",

    citizen:
      "नागरिक",

    admin:
      "प्रशासक",

    email:
      "ईमेल पता",

    password:
      "पासवर्ड",

    remember:
      "मुझे याद रखें",

    forgot:
      "पासवर्ड भूल गए?",

    new_here:
      "CivicBuzz पर नए हैं?",

    create_account:
      "खाता बनाएँ",

    secure:
      "सुरक्षित नागरिक पहुँच · आपका डेटा सुरक्षित है",

    menu:
      "मेनू",

    overview:
      "अवलोकन",

    report_issue:
      "समस्या दर्ज करें",

    civic_map:
      "नागरिक मानचित्र",

    my_complaints:
      "मेरी शिकायतें",

    budget:
      "सामुदायिक बजट",

    dark_mode:
      "डार्क मोड",

    logout:
      "लॉग आउट",

    your_city:
      "आपका शहर एक नज़र में",

    active_reports:
      "सक्रिय रिपोर्ट",

    active_context:
      "आपके क्षेत्र में",

    resolved:
      "इस माह हल की गई",

    vs_last:
      "पिछले माह से",

    community_impact:
      "सामुदायिक प्रभाव",

    citizens_helped:
      "नागरिकों की मदद",

    notice:
      "आपकी रिपोर्ट #CIV-1042 अब सड़क रखरखाव विभाग द्वारा देखी जा रही है।",

    latest_report:
      "नवीनतम रिपोर्ट",

    track_status:
      "वास्तविक समय में स्थिति देखें",

    view_all:
      "सभी देखें →",

    under_review:
      "समीक्षा में",

    issue_title:
      "कॉलेज गेट के पास गड्ढा",

    review_progress:
      "समीक्षा जारी है",

    community_priority:
      "सामुदायिक प्राथमिकताएँ",

    shaped_by:
      "स्थानीय रिपोर्टों से निर्मित",

    live_data:
      "लाइव डेटा",

    drainage:
      "जल निकासी सुधार",

    streetlights:
      "स्ट्रीटलाइट मरम्मत",

    roads:
      "सड़क मरम्मत",

    reports:
      "रिपोर्ट",

    full_name:
      "पूरा नाम",

    continue:
      "जारी रखें →",

    register_text:
      "अपने समुदाय के नागरिक कार्रवाई नेटवर्क से जुड़ें।"

  }

};


// ============================================================
// GLOBAL STATE
// ============================================================

let language =
  localStorage.getItem("ns-language") || "en";

let role = "citizen";

let recoveryEmail = "";

let generatedOtp = "";


// ============================================================
// HELPERS
// ============================================================

const languageMenus = [];

const $ = selector =>
  document.querySelector(selector);

const $$ = selector =>
  document.querySelectorAll(selector);


function currentStrings() {

  return strings[language] || strings.en;

}


// ============================================================
// LANGUAGE MENU CREATION
// ============================================================

function makeLanguageMenu(host, compact = false) {

  if (!host) return null;

  const menu =
    document.createElement("div");

  menu.className =
    `language-menu${compact ? " compact" : ""}`;


  const button =
    document.createElement("button");

  button.type = "button";

  button.className =
    "language-menu-button";


  const list =
    document.createElement("div");

  list.className =
    "language-menu-list";

  list.setAttribute(
    "role",
    "menu"
  );


  Object.entries(languageCatalog).forEach(
    ([code, info]) => {

      const option =
        document.createElement("button");

      option.type = "button";

      option.setAttribute(
        "role",
        "menuitem"
      );

      option.dataset.language =
        code;

      option.textContent =
        info.label;


      option.addEventListener(
        "click",
        () => {

          setLanguage(code);

          menu.classList.remove(
            "open"
          );

        }
      );


      list.append(option);

    }
  );


  button.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      languageMenus.forEach(
        item => {

          if (item !== menu) {

            item.classList.remove(
              "open"
            );

          }

        }
      );


      menu.classList.toggle(
        "open"
      );

    }
  );


  menu.append(
    button,
    list
  );


  host.replaceWith(menu);

  languageMenus.push(menu);

  return menu;

}


// ============================================================
// POPULATE LANGUAGE MENUS
// ============================================================

function populateLanguageMenus() {

  const welcomeMenu =
    $("#welcome-language");


  if (welcomeMenu) {

    makeLanguageMenu(
      welcomeMenu
    );

  }


  $$(".language-trigger")
    .forEach(trigger => {

      makeLanguageMenu(
        trigger,
        true
      );

    });


  document.addEventListener(
    "click",
    event => {

      if (
        !event.target.closest(
          ".language-menu"
        )
      ) {

        languageMenus.forEach(
          menu => {

            menu.classList.remove(
              "open"
            );

          }
        );

      }

    }
  );

}


// ============================================================
// TRANSLATION
// ============================================================

function translate() {

  const copy =
    currentStrings();


  document.documentElement.lang =
    language;


  document.body.classList.toggle(
    "hindi",
    language === "hi"
  );


  $$("[data-i18n]")
    .forEach(element => {

      const key =
        element.dataset.i18n;


      if (
        copy[key] !== undefined
      ) {

        element.textContent =
          copy[key];

      }

    });


  languageMenus.forEach(
    menu => {

      const button =
        menu.querySelector(
          ".language-menu-button"
        );


      if (button) {

        button.textContent =
          `${languageCatalog[language].label}⌄`;

      }


      menu
        .querySelectorAll(
          "[data-language]"
        )
        .forEach(option => {

          option.classList.toggle(
            "selected",
            option.dataset.language ===
            language
          );

        });

    }
  );


  const continueButton =
    $("#continue-language");


  if (continueButton) {

    continueButton.textContent =
      languageCatalog[language].continue;

  }


  const languageTitle =
    $("#language-title");


  if (languageTitle) {

    languageTitle.textContent =
      languageCatalog[language].welcome;

  }


  const placeholderElement =
    document.querySelector(
      "[data-placeholder]"
    );


  if (
    placeholderElement &&
    copy.full_name
  ) {

    placeholderElement.setAttribute(
      "placeholder",
      copy.full_name
    );

  }

}


// ============================================================
// SET LANGUAGE
// ============================================================

function setLanguage(nextLanguage) {

  if (
    !languageCatalog[nextLanguage]
  ) {

    return;

  }


  language =
    nextLanguage;


  localStorage.setItem(
    "ns-language",
    language
  );


  translate();

}


// ============================================================
// ENTER PLATFORM
// ============================================================

function enterPlatform() {

  const languageScreen =
    $("#language-screen");

  const authScreen =
    $("#auth-screen");


  if (languageScreen) {

    languageScreen.classList.add(
      "hidden"
    );

  }


  if (authScreen) {

    authScreen.classList.remove(
      "hidden"
    );

  }

}


// ============================================================
// THEME
// ============================================================

function applySavedTheme() {

  const savedTheme =
    localStorage.getItem(
      "ns-theme"
    );


  if (savedTheme === "dark") {

    document.body.classList.add(
      "dark"
    );

  } else {

    document.body.classList.remove(
      "dark"
    );

  }

}


function toggleTheme() {

  document.body.classList.toggle(
    "dark"
  );


  localStorage.setItem(
    "ns-theme",
    document.body.classList.contains(
      "dark"
    )
      ? "dark"
      : "light"
  );

}


// ============================================================
// PASSWORD VISIBILITY
// ============================================================

function setupPasswordVisibility() {

  $$(".password-visibility")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const target =
            button.dataset.target;


          const input =
            document.getElementById(
              target
            );


          if (!input) return;


          input.type =
            input.type === "password"
              ? "text"
              : "password";


          button.setAttribute(
            "aria-label",
            input.type === "password"
              ? "Show password"
              : "Hide password"
          );

        }
      );

    });

}


// ============================================================
// OLD LOGIN PASSWORD VISIBILITY
// ============================================================

function setupLoginPasswordVisibility() {

  const button =
    $("#show-password");


  if (!button) return;


  button.addEventListener(
    "click",
    () => {

      const input =
        $("#password");


      if (!input) return;


      input.type =
        input.type === "password"
          ? "text"
          : "password";


      button.setAttribute(
        "aria-label",
        input.type === "password"
          ? "Show password"
          : "Hide password"
      );

    }
  );

}


// ============================================================
// ROLE SWITCH
// ============================================================

function setupRoles() {

  $$(".role")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          $$(".role")
            .forEach(item =>
              item.classList.remove(
                "active"
              )
            );


          button.classList.add(
            "active"
          );


          role =
            button.dataset.role ||
            "citizen";

        }
      );

    });

}


// ============================================================
// LOGIN
// ============================================================

function setupLogin() {

  const loginForm =
    $("#login-form");


  if (!loginForm) return;


  loginForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const authScreen =
        $("#auth-screen");

      const dashboard =
        $("#dashboard");

      const heading =
        $("#dashboard-heading");


      if (authScreen) {

        authScreen.classList.add(
          "hidden"
        );

      }


      if (dashboard) {

        dashboard.classList.remove(
          "hidden"
        );

      }


      if (heading) {

        if (role === "admin") {

          heading.textContent =
            language === "hi"
              ? "सुप्रभात, अधिकारी।"
              : "Good morning, Administrator.";

        } else {

          heading.textContent =
            language === "hi"
              ? "सुप्रभात, आन्या।"
              : "Good morning, Aanya.";

        }

      }

    }
  );

}


// ============================================================
// LOGOUT
// ============================================================

function setupLogout() {

  const logout =
    $("#logout");


  if (!logout) return;


  logout.addEventListener(
    "click",
    () => {

      const dashboard =
        $("#dashboard");

      const authScreen =
        $("#auth-screen");


      if (dashboard) {

        dashboard.classList.add(
          "hidden"
        );

      }


      if (authScreen) {

        authScreen.classList.remove(
          "hidden"
        );

      }

    }
  );

}


// ============================================================
// REGISTER MODAL
// ============================================================

function setupRegisterModal() {

  const registerButton =
    $("#register-button");

  const registerModal =
    $("#register-modal");


  if (
    !registerButton ||
    !registerModal
  ) {

    return;

  }


  registerButton.addEventListener(
    "click",
    () => {

      registerModal.classList.remove(
        "hidden"
      );

    }
  );


  $$("#register-modal .close-modal")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          registerModal.classList.add(
            "hidden"
          );

        }
      );

    });


  registerModal.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        registerModal
      ) {

        registerModal.classList.add(
          "hidden"
        );

      }

    }
  );

}


// ============================================================
// REGISTRATION PASSWORD RULES
// ============================================================

function setupRegistrationPasswordRules() {

  const password =
    $("#new-password");


  if (!password) return;


  password.addEventListener(
    "input",
    event => {

      const value =
        event.target.value;


      const checks = {

        length:
          value.length >= 8,

        upper:
          /[A-Z]/.test(value),

        lower:
          /[a-z]/.test(value),

        number:
          /\d/.test(value),

        symbol:
          /[!@#$%^&*]/.test(value)

      };


      Object.entries(checks)
        .forEach(
          ([rule, passed]) => {

            const element =
              document.querySelector(
                `[data-rule="${rule}"]`
              );


            if (element) {

              element.classList.toggle(
                "met",
                passed
              );

            }

          }
        );

    }
  );

}


// ============================================================
// REGISTER FORM
// ============================================================

function setupRegisterForm() {

  const form =
    $("#register-form");


  if (!form) return;


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const password =
        $("#new-password")?.value ||
        "";

      const confirmation =
        $("#confirm-password")?.value ||
        "";

      const message =
        $("#password-message");


      if (
        password !== confirmation
      ) {

        if (message) {

          message.textContent =
            language === "hi"
              ? "पासवर्ड मेल नहीं खाते।"
              : "Passwords do not match.";

        }

        return;

      }


      if (password.length < 8) {

        if (message) {

          message.textContent =
            language === "hi"
              ? "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।"
              : "Password must contain at least 8 characters.";

        }

        return;

      }


      if (message) {

        message.textContent = "";

      }


      const registerModal =
        $("#register-modal");

      const dashboard =
        $("#dashboard");

      const authScreen =
        $("#auth-screen");


      if (registerModal) {

        registerModal.classList.add(
          "hidden"
        );

      }


      if (dashboard) {

        dashboard.classList.remove(
          "hidden"
        );

      }


      if (authScreen) {

        authScreen.classList.add(
          "hidden"
        );

      }

    }
  );

}


// ============================================================
// FORGOT PASSWORD ELEMENTS
// ============================================================

const forgotPasswordButton =
  $("#forgot-password-button");

const forgotPasswordModal =
  $("#forgot-password-modal");

const closeForgotPassword =
  $("#close-forgot-password");

const forgotStepId =
  $("#forgot-step-id");

const forgotStepOtp =
  $("#forgot-step-otp");

const forgotStepReset =
  $("#forgot-step-reset");

const forgotStepSuccess =
  $("#forgot-step-success");

const forgotIdForm =
  $("#forgot-id-form");

const otpForm =
  $("#otp-form");

const resetPasswordForm =
  $("#reset-password-form");

const forgotEmail =
  $("#forgot-email");

const otpInput =
  $("#otp-input");

const forgotIdMessage =
  $("#forgot-id-message");

const otpMessage =
  $("#otp-message");

const resetPasswordMessage =
  $("#reset-password-message");

const resendOtpButton =
  $("#resend-otp");

const backToLoginButton =
  $("#back-to-login");


// ============================================================
// FORGOT PASSWORD STEP SWITCHER
// ============================================================

function showForgotStep(step) {

  if (forgotStepId) {

    forgotStepId.classList.add(
      "hidden"
    );

  }


  if (forgotStepOtp) {

    forgotStepOtp.classList.add(
      "hidden"
    );

  }


  if (forgotStepReset) {

    forgotStepReset.classList.add(
      "hidden"
    );

  }


  if (forgotStepSuccess) {

    forgotStepSuccess.classList.add(
      "hidden"
    );

  }


  if (step === "id") {

    forgotStepId?.classList.remove(
      "hidden"
    );

  }


  if (step === "otp") {

    forgotStepOtp?.classList.remove(
      "hidden"
    );

  }


  if (step === "reset") {

    forgotStepReset?.classList.remove(
      "hidden"
    );

  }


  if (step === "success") {

    forgotStepSuccess?.classList.remove(
      "hidden"
    );

  }

}


// ============================================================
// RESET FORGOT PASSWORD FORM
// ============================================================

function resetForgotPasswordFlow() {

  recoveryEmail = "";

  generatedOtp = "";


  if (forgotEmail) {

    forgotEmail.value = "";

  }


  if (otpInput) {

    otpInput.value = "";

  }


  const newPassword =
    $("#reset-new-password");


  const confirmPassword =
    $("#reset-confirm-password");


  if (newPassword) {

    newPassword.value = "";

  }


  if (confirmPassword) {

    confirmPassword.value = "";

  }


  if (forgotIdMessage) {

    forgotIdMessage.textContent =
      "";

    forgotIdMessage.classList.remove(
      "success"
    );

  }


  if (otpMessage) {

    otpMessage.textContent =
      "";

    otpMessage.classList.remove(
      "success"
    );

  }


  if (resetPasswordMessage) {

    resetPasswordMessage.textContent =
      "";

    resetPasswordMessage.classList.remove(
      "success"
    );

  }


  showForgotStep("id");

}


// ============================================================
// OPEN FORGOT PASSWORD
// ============================================================

function setupForgotPasswordOpen() {

  if (!forgotPasswordButton) return;


  forgotPasswordButton.addEventListener(
    "click",
    () => {

      if (!forgotPasswordModal) return;


      forgotPasswordModal.classList.remove(
        "hidden"
      );


      resetForgotPasswordFlow();


      setTimeout(
        () => {

          forgotEmail?.focus();

        },
        100
      );

    }
  );

}


// ============================================================
// CLOSE FORGOT PASSWORD
// ============================================================

function setupForgotPasswordClose() {

  if (!forgotPasswordModal) return;


  closeForgotPassword?.addEventListener(
    "click",
    () => {

      forgotPasswordModal.classList.add(
        "hidden"
      );

    }
  );


  forgotPasswordModal.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        forgotPasswordModal
      ) {

        forgotPasswordModal.classList.add(
          "hidden"
        );

      }

    }
  );

}


// ============================================================
// GENERATE DEMO OTP
// ============================================================

function generateOtp() {

  return Math.floor(
    100000 +
    Math.random() * 900000
  ).toString();

}


// ============================================================
// STEP 1 - SEND OTP
// ============================================================

function setupForgotIdForm() {

  if (!forgotIdForm) return;


  forgotIdForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const email =
        forgotEmail?.value.trim() ||
        "";


      if (!email) {

        if (forgotIdMessage) {

          forgotIdMessage.textContent =
            language === "hi"
              ? "कृपया अपना पंजीकृत ईमेल दर्ज करें।"
              : "Please enter your registered email ID.";

        }

        return;

      }


      /*
        Basic email validation.
      */

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (!emailPattern.test(email)) {

        if (forgotIdMessage) {

          forgotIdMessage.textContent =
            language === "hi"
              ? "कृपया एक मान्य ईमेल पता दर्ज करें।"
              : "Please enter a valid email address.";

        }

        return;

      }


      recoveryEmail =
        email;


      /*
        DEMO OTP

        In the real application, this OTP
        must be generated by the backend
        and sent through an email service.
      */

      generatedOtp =
        generateOtp();


      /*
        For hackathon frontend testing,
        the OTP is printed in the browser console.

        Example:
        DEMO OTP: 483921
      */

      console.log(
        "================================="
      );

      console.log(
        "CivicBuzz DEMO OTP:"
      );

      console.log(
        generatedOtp
      );

      console.log(
        "Sent to:",
        recoveryEmail
      );

      console.log(
        "================================="
      );


      if (forgotIdMessage) {

        forgotIdMessage.textContent =
          "";

      }


      showForgotStep(
        "otp"
      );


      setTimeout(
        () => {

          otpInput?.focus();

        },
        100
      );

    }
  );

}


// ============================================================
// OTP INPUT - ONLY NUMBERS
// ============================================================

function setupOtpInput() {

  if (!otpInput) return;


  otpInput.addEventListener(
    "input",
    () => {

      otpInput.value =
        otpInput.value
          .replace(/\D/g, "")
          .slice(0, 6);

    }
  );

}


// ============================================================
// STEP 2 - VERIFY OTP
// ============================================================

function setupOtpVerification() {

  if (!otpForm) return;


  otpForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const enteredOtp =
        otpInput?.value.trim() ||
        "";


      if (!/^\d{6}$/.test(enteredOtp)) {

        if (otpMessage) {

          otpMessage.classList.remove(
            "success"
          );

          otpMessage.textContent =
            language === "hi"
              ? "कृपया 6 अंकों का OTP दर्ज करें।"
              : "Please enter a valid 6-digit OTP.";

        }

        return;

      }


      /*
        DEMO OTP verification.
      */

      if (
        enteredOtp !==
        generatedOtp
      ) {

        if (otpMessage) {

          otpMessage.classList.remove(
            "success"
          );

          otpMessage.textContent =
            language === "hi"
              ? "गलत OTP। कृपया दोबारा प्रयास करें।"
              : "Invalid OTP. Please try again.";

        }

        return;

      }


      if (otpMessage) {

        otpMessage.classList.add(
          "success"
        );

        otpMessage.textContent =
          language === "hi"
            ? "OTP सत्यापित हो गया।"
            : "OTP verified successfully.";

      }


      setTimeout(
        () => {

          showForgotStep(
            "reset"
          );


          const resetInput =
            $("#reset-new-password");


          resetInput?.focus();

        },
        300
      );

    }
  );

}


// ============================================================
// RESEND OTP
// ============================================================

function setupResendOtp() {

  if (!resendOtpButton) return;


  resendOtpButton.addEventListener(
    "click",
    () => {

      if (!recoveryEmail) {

        showForgotStep(
          "id"
        );

        return;

      }


      generatedOtp =
        generateOtp();


      console.log(
        "================================="
      );

      console.log(
        "CivicBuzz NEW DEMO OTP:"
      );

      console.log(
        generatedOtp
      );

      console.log(
        "Sent to:",
        recoveryEmail
      );

      console.log(
        "================================="
      );


      if (otpMessage) {

        otpMessage.classList.add(
          "success"
        );

        otpMessage.textContent =
          language === "hi"
            ? "नया OTP भेजा गया है।"
            : "A new OTP has been sent.";

      }

    }
  );

}


// ============================================================
// STEP 3 - RESET PASSWORD
// ============================================================

function setupPasswordReset() {

  if (!resetPasswordForm) return;


  resetPasswordForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const newPassword =
        $("#reset-new-password")
          ?.value ||
        "";


      const confirmPassword =
        $("#reset-confirm-password")
          ?.value ||
        "";


      if (resetPasswordMessage) {

        resetPasswordMessage.classList.remove(
          "success"
        );

      }


      /*
        Password length.
      */

      if (
        newPassword.length < 8
      ) {

        if (resetPasswordMessage) {

          resetPasswordMessage.textContent =
            language === "hi"
              ? "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।"
              : "Password must contain at least 8 characters.";

        }

        return;

      }


      /*
        Password confirmation.
      */

      if (
        newPassword !==
        confirmPassword
      ) {

        if (resetPasswordMessage) {

          resetPasswordMessage.textContent =
            language === "hi"
              ? "पासवर्ड मेल नहीं खाते।"
              : "Passwords do not match.";

        }

        return;

      }


      /*
        FRONTEND DEMO COMPLETE.

        In production, send:

        email
        OTP verification token
        new password

        to your backend.
      */


      if (resetPasswordMessage) {

        resetPasswordMessage.textContent =
          "";

      }


      showForgotStep(
        "success"
      );

    }
  );

}


// ============================================================
// BACK TO LOGIN
// ============================================================

function setupBackToLogin() {

  if (!backToLoginButton) return;


  backToLoginButton.addEventListener(
    "click",
    () => {

      if (forgotPasswordModal) {

        forgotPasswordModal.classList.add(
          "hidden"
        );

      }


      resetForgotPasswordFlow();


      const authScreen =
        $("#auth-screen");


      if (authScreen) {

        authScreen.classList.remove(
          "hidden"
        );

      }

    }
  );

}


// ============================================================
// ESCAPE KEY FOR MODALS
// ============================================================

function setupEscapeKey() {

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key !==
        "Escape"
      ) {

        return;

      }


      const registerModal =
        $("#register-modal");


      if (
        registerModal &&
        !registerModal.classList.contains(
          "hidden"
        )
      ) {

        registerModal.classList.add(
          "hidden"
        );

      }


      if (
        forgotPasswordModal &&
        !forgotPasswordModal.classList.contains(
          "hidden"
        )
      ) {

        forgotPasswordModal.classList.add(
          "hidden"
        );

      }

    }
  );

}


// ============================================================
// INITIALIZATION
// ============================================================

function initializeApp() {

  /*
    Apply saved theme first.
  */

  applySavedTheme();


  /*
    Build language menus.
  */

  populateLanguageMenus();


  /*
    Apply saved language.
  */

  translate();


  /*
    Language continue button.
  */

  $("#continue-language")
    ?.addEventListener(
      "click",
      enterPlatform
    );


  /*
    Theme buttons.
  */

  $$(".theme-toggle")
    .forEach(button => {

      button.addEventListener(
        "click",
        toggleTheme
      );

    });


  /*
    Login.
  */

  setupLogin();


  setupLoginPasswordVisibility();


  /*
    Roles.
  */

  setupRoles();


  /*
    Registration.
  */

  setupRegisterModal();

  setupRegistrationPasswordRules();

  setupRegisterForm();


  /*
    Forgot password.
  */

  setupForgotPasswordOpen();

  setupForgotPasswordClose();

  setupForgotIdForm();

  setupOtpInput();

  setupOtpVerification();

  setupResendOtp();

  setupPasswordReset();

  setupBackToLogin();


  /*
    Password visibility buttons
    inside registration and reset forms.
  */

  setupPasswordVisibility();


  /*
    Logout.
  */

  setupLogout();


  /*
    Keyboard support.
  */

  setupEscapeKey();

}


// ============================================================
// START APPLICATION
// ============================================================

initializeApp();