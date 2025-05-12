window.dataLayer = window.dataLayer || [];

// --- Helpers ---

// Get cookie value
const getCookieValue = (name) => {
  const match = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
  return match?.pop() || "";
};

// Google Analytics setup
function gtag() {
  dataLayer.push(arguments);
}

// Load Google Analytics if not already loaded
function loadGtagScript(callback) {
  if (window.gtag) {
    callback(); // gtag already loaded
    return;
  }

  const script = document.createElement("script");
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-LCRPJR51P6";
  script.async = true;
  script.onload = callback; // Call the callback once the script is loaded
  document.head.appendChild(script);
}

// Send analytics + load GTM only after consent
function sendAnalytics() {
  loadGtagScript(() => {
    // Ensure the correct domain is set for GA cookies
    gtag("js", new Date());
    gtag('config', 'G-LCRPJR51P6', {
      cookie_flags: 'secure;samesite=none',  // Set Secure and SameSite attributes
      cookie_domain: 'find-support-after-a-fit-note.digital.cabinet-office.gov.uk'  // Set domain for GA cookies
    });

    dataLayer.push({ event: "analytics_enabled" });

    const gtmScript = document.createElement("script");
    gtmScript.src = "https://www.googletagmanager.com/gtm.js?id=GTM-MV2BWF89";
    gtmScript.async = true;
    document.head.appendChild(gtmScript);
  });
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

// Delete cookie with both domain scopes (to remove duplicates)
function deleteCookie(name) {
  // Remove exact subdomain cookie
  document.cookie = `${name}=; path=/; domain=find-support-after-a-fit-note.digital.cabinet-office.gov.uk; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  // Remove fallback (no domain)
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
}

// Delete all known analytics cookies
function deleteAnalyticsCookies() {
  ["_ga", "_gid", "_ga_ID", "analytics", "cookie-preferences"].forEach(deleteCookie);
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
  const domainFlag = "domain=find-support-after-a-fit-note.digital.cabinet-office.gov.uk;";
  document.cookie = `${name}=${value}; expires=${expires}; path=/; ${domainFlag} ${secureFlag} SameSite=${sameSite}`;
};

// Store user preferences and ensure no duplicate cookies
const setUserPreferences = (preferences) => {
  deleteCookie(config.userPreferences.cookieName); // clear both domain + subdomain first
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

    // Try to configure domain-wide cookies in cookieManager (if supported)
    if (typeof window.cookieManager.setConfig === "function") {
      window.cookieManager.setConfig({
        cookieDomain: "find-support-after-a-fit-note.digital.cabinet-office.gov.uk"
      });
    }

    window.cookieManager.init(config);
  }

  // Fallback check
  setTimeout(trySendAnalytics, 100);
});
