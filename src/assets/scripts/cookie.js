window.dataLayer = window.dataLayer || [];

// --- Helpers ---

// Get cookie value
const getCookieValue = (name) => (
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || ""
);

// Google Analytics setup
function gtag() {
  dataLayer.push(arguments);
}

// Send analytics + load GTM only after consent
function sendAnalytics() {
  gtag("js", new Date());
  gtag("config", "G-LCRPJR51P6");

  // Push a custom event to Tag Manager
  dataLayer.push({ event: "analytics_enabled" });

  // Dynamically inject GTM
  const gtmScript = document.createElement("script");
  gtmScript.src = "https://www.googletagmanager.com/gtm.js?id=GTM-MV2BWF89";
  gtmScript.async = true;
  document.head.appendChild(gtmScript);
}

// Attempt analytics setup based on cookie
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

// Delete specific cookie
function deleteCookie(name) {
  document.cookie = `${name}=; path=/; domain=.cabinet-office.gov.uk; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
}

// Delete all known analytics cookies
function deleteAnalyticsCookies() {
  ["_ga", "_gid", "_ga_ID", "analytics"].forEach(deleteCookie);
}

// --- Config ---

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
      cookies: ["analytics", "_ga", "_gid", "_ga_ID"]
    }
  ],
  additionalOptions: {
    defaultConsent: false,
    deleteUndefinedCookies: false,
    disableCookieBanner: false,
    disableCookiePreferencesForm: false
  }
};

// Set cookie with correct domain and attributes
const setCookie = (name, value, days, secure, sameSite) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secureFlag = secure ? "Secure;" : "";
  const domainFlag = "domain=.cabinet-office.gov.uk;";
  document.cookie = `${name}=${value}; expires=${expires}; path=/; ${domainFlag} ${secureFlag} SameSite=${sameSite}`;
};

// Store user preferences
const setUserPreferences = (preferences) => {
  setCookie(
    config.userPreferences.cookieName,
    JSON.stringify(preferences),
    config.userPreferences.cookieExpiry,
    config.userPreferences.cookieSecure,
    config.userPreferences.cookieSameSite
  );
};

// Show success banner
const reloadCallback = () => {
  const successBanner = document.querySelector(".cookie-banner-success");
  if (successBanner) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    successBanner.removeAttribute("hidden");
    successBanner.focus();
  }
};

// Handle analytics based on banner action
const triggerAnalyticsCallback = (eventData) => {
  if (eventData === "accept") {
    setUserPreferences({ analytics: "on" });
    sendAnalytics();
  } else if (eventData === "reject") {
    setUserPreferences({ analytics: "off" });
    deleteAnalyticsCookies();
  }
};

// Init on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  if (window.cookieManager) {
    window.cookieManager.on("PreferenceFormSubmitted", () => {
      reloadCallback();
      trySendAnalytics();
    });

    window.cookieManager.on("CookieBannerAction", (eventData) => {
      triggerAnalyticsCallback(eventData);
      trySendAnalytics();
    });

    window.cookieManager.init(config);
  }

  // Fallback check
  setTimeout(trySendAnalytics, 100);
});
