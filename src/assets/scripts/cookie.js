window.dataLayer = window.dataLayer || [];

// --- Helpers ---

const isLocalhost = location.hostname === "localhost";
const cookieDomain = isLocalhost ? undefined : ".cabinet-office.gov.uk";
const cookieSecure = !isLocalhost;
const cookieSameSite = isLocalhost ? "Lax" : "None";

// Get cookie value
const getCookieValue = (name) => {
  const match = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
  return match?.pop() || "";
};

// Google Analytics setup
function gtag() {
  window.dataLayer.push(arguments);
}

// Send analytics + load GTM only after consent
function sendAnalytics() {
  if (typeof gtag !== "function") return;

  gtag("js", new Date());
  gtag("config", "G-LCRPJR51P6");

  window.dataLayer.push({ event: "analytics_enabled" });

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

// Delete cookie with both domain scopes
function deleteCookie(name) {
  const domains = [
    location.hostname,
    ".cabinet-office.gov.uk"
  ];

  domains.forEach((domain) => {
    document.cookie = `${name}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  });

  // Try without a domain too (just in case)
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
    cookieSecure,
    cookieSameSite
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
const setCookie = (name, value, days, secure, sameSite, domain) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secureFlag = secure ? "Secure;" : "";
  const domainFlag = domain ? `domain=${domain};` : "";
  document.cookie = `${name}=${value}; ${domainFlag} expires=${expires}; path=/; ${secureFlag} SameSite=${sameSite}`;
};

// Store user preferences and ensure no duplicate cookies
const setUserPreferences = (preferences) => {
  deleteCookie(config.userPreferences.cookieName); // clear both domain + subdomain
  setCookie(
    config.userPreferences.cookieName,
    JSON.stringify(preferences),
    config.userPreferences.cookieExpiry,
    config.userPreferences.cookieSecure,
    config.userPreferences.cookieSameSite,
    cookieDomain
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

// --- Force correct domain on cookie-preferences ---

(function() {
  const originalCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') || Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');

  if (originalCookieDescriptor && originalCookieDescriptor.set) {
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      enumerable: true,
      get: function() {
        return originalCookieDescriptor.get.call(document);
      },
      set: function(value) {

        // Only intercept cookie-preferences if domain is missing
        if (!isLocalhost && value.startsWith("cookie-preferences=") && !/domain=/.test(value)) {
          value += "; domain=.cabinet-office.gov.uk";
        }
        originalCookieDescriptor.set.call(document, value);
      }
    });
  }
})();

// --- Init ---

document.addEventListener("DOMContentLoaded", () => {

  // Clear any wrong-domain cookies just in case
  deleteCookie("cookie-preferences");

  if (window.cookieManager) {
    window.cookieManager.on("PreferenceFormSubmitted", () => {
      reloadCallback();
      trySendAnalytics();
    });

    window.cookieManager.on("CookieBannerAction", (eventData) => {
      triggerAnalyticsCallback(eventData);
      trySendAnalytics();
    });

    if (typeof window.cookieManager.setConfig === "function") {
      window.cookieManager.setConfig({
        cookieDomain: cookieDomain
      });
    }

    window.cookieManager.init(config);
  }

  // Fallback check
  setTimeout(trySendAnalytics, 100);
});
