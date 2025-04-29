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

var config = {
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
  setCookie(config.userPreferences.cookieName, JSON.stringify(preferences), config.userPreferences.cookieExpiry, config.userPreferences.cookieSecure, config.userPreferences.cookieSameSite);
};

const reloadCallback = function(eventData) {
  let successBanner = document.querySelector(".cookie-banner-success");
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
  successBanner.removeAttribute("hidden");
  successBanner.focus();
};

// Callback to trigger sending analytics if the analytics preference has been accepted in the cookie banner
const triggerAnalyticsCallback = function(eventData) {
  if (eventData === "accept") {
    sendAnalytics();
    setUserPreferences({ analytics: "on" }); // Set user preferences for analytics
  } else if (eventData === "reject") {
    setUserPreferences({ analytics: "off" }); // Set user preferences to "off"
  }
};

// Initialise the cookie manager
window.cookieManager.on("PreferenceFormSubmitted", reloadCallback);
window.cookieManager.on("CookieBannerAction", triggerAnalyticsCallback);
window.cookieManager.init(config);

// Send analytics if the cookie is set
try {
  const result = (JSON.parse(getCookieValue("cookie-preferences")).analytics === "on");
  // Cookie has been set
  if (result === true) {
    sendAnalytics();
  }
} catch (err) {
  console.error("Error parsing cookie preferences:", err);
}
