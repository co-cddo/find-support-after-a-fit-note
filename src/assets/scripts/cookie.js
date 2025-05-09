window.dataLayer = window.dataLayer || [];

// Get cookie value
const getCookieValue = (name) => (
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || ""
);

// Google Analytics
function gtag() {
  dataLayer.push(arguments);
}

// Send analytics
function sendAnalytics() {
  gtag("js", new Date());
  gtag("config", "G-LCRPJR51P6");
}

// Attempt to send analytics if preference is set to 'on'
function trySendAnalytics() {
  try {
    const value = getCookieValue("cookie-preferences");
    if (value) {
      const parsed = JSON.parse(value);
      if (parsed.analytics === "on") {
        sendAnalytics();
      }
    }
  } catch (err) {
    console.error("Error parsing cookie preferences:", err);
  }
}

const config = {
  userPreferences: {
    cookieName: "cookie-preferences",
    cookieExpiry: 365,
    cookieSecure: location.protocol === "https:",
    cookieSameSite: "Lax"
  },
  preferencesForm: {
    class: "cookie-preferences-form"
  },
  cookieBanner: {
    class: "cookie-banner",
    showWithPreferencesForm: false,
    actions: [
      {
        name: "accept",
        buttonClass: "cookie-banner-accept-button",
        confirmationClass: "cookie-banner-accept-message",
        consent: true
      },
      {
        name: "reject",
        buttonClass: "cookie-banner-reject-button",
        confirmationClass: "cookie-banner-reject-message",
        consent: false
      },
      {
        name: "hide",
        buttonClass: "cookie-banner-hide-button"
      }
    ]
  },
  cookieManifest: [
    {
      categoryName: "analytics",
      optional: true,
      cookies: [
        "analytics",
        "_ga",
        "_gid"
      ]
    }
  ],
  additionalOptions: {
    defaultConsent: false,
    deleteUndefinedCookies: false,
    disableCookieBanner: false,
    disableCookiePreferencesForm: false
  }
};

// Function to set cookies with the same site attribute
const setCookie = (name, value, days, secure, sameSite) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secureFlag = secure ? "Secure;" : "";
  document.cookie = `${name}=${value}; expires=${expires}; path=/; ${secureFlag} SameSite=${sameSite}`;
};

// Function to set user preferences
const setUserPreferences = (preferences) => {
  setCookie(
    config.userPreferences.cookieName,
    JSON.stringify(preferences),
    config.userPreferences.cookieExpiry,
    config.userPreferences.cookieSecure,
    config.userPreferences.cookieSameSite
  );
};

const reloadCallback = function (eventData) {
  let successBanner = document.querySelector(".cookie-banner-success");
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
  successBanner.removeAttribute("hidden");
  successBanner.focus();
};

// Callback to trigger sending analytics if the analytics preference has been accepted
const triggerAnalyticsCallback = function (eventData) {
  if (eventData === "accept") {
    sendAnalytics();
    setUserPreferences({ analytics: "on" });
  } else if (eventData === "reject") {
    setUserPreferences({ analytics: "off" });
  }
};

// Initialise cookie manager safely
if (window.cookieManager) {
  window.cookieManager.on("PreferenceFormSubmitted", () => {
    reloadCallback();
    trySendAnalytics(); // Re-check after form submission
  });

  window.cookieManager.on("CookieBannerAction", (eventData) => {
    triggerAnalyticsCallback(eventData);
    trySendAnalytics(); // Check after banner interaction
  });

  window.cookieManager.init(config);
}

// Check cookie state on initial load (after DOM is ready)
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(trySendAnalytics, 100); // Small delay ensures init has completed
});
