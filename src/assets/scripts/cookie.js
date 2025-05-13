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

// Delete cookies with specified names for the correct domain
function deleteCookies(cookieNames) {
  cookieNames.forEach((cookieName) => {
    const domains = [
      location.hostname,
      ".cabinet-office.gov.uk"
    ];

    domains.forEach((domain) => {
      document.cookie = `${cookieName}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    });

    // Try without a domain too (just in case)
    document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  });
}

// Set cookie with correct domain and attributes
const setCookie = (name, value, days, secure, sameSite, domain) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secureFlag = secure ? "Secure;" : "";
  const domainFlag = domain ? `domain=${domain};` : "";
  document.cookie = `${name}=${value}; ${domainFlag} expires=${expires}; path=/; ${secureFlag} SameSite=${sameSite}`;
};

// Store user preferences and ensure no duplicate cookies
const setUserPreferences = (preferences) => {
  // Set the cookie only when a user has accepted or rejected cookies
  setCookie(
    "cookie-preferences",
    JSON.stringify(preferences),
    365, // expiry
    cookieSecure,
    cookieSameSite,
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
const handleAnalyticsCallback = (eventData) => {
  if (eventData === "accept") {
    setUserPreferences({ analytics: "on" });
    sendAnalytics();
  } else if (eventData === "reject") {
    setUserPreferences({ analytics: "off" });
    deleteCookies(["_ga", "_gid", "_ga_ID", "analytics"]);
  }
};

// --- Force correct domain on cookie-preferences ---
(function() {
  const originalCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
                                    Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');

  if (originalCookieDescriptor && originalCookieDescriptor.set) {
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      enumerable: true,
      get: function() {
        return originalCookieDescriptor.get.call(document);
      },
      set: function(value) {
        // Only intercept cookie-preferences if domain is missing or incorrect
        if (value.startsWith("cookie-preferences=") && !/domain=/.test(value)) {
          value += "; domain=.cabinet-office.gov.uk";
        }
        originalCookieDescriptor.set.call(document, value);
      }
    });
  }
})();

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

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  // Check if cookie exists already, and if it's set to correct domain
  const cookieValue = getCookieValue("cookie-preferences");
  if (cookieValue) {
    try {
      const preferences = JSON.parse(cookieValue);
      if (preferences.analytics === "on") {
        sendAnalytics();
      }
    } catch (e) {
      console.error("Failed to parse cookie-preferences:", e);
    }
  }

  if (window.cookieManager) {
    window.cookieManager.on("PreferenceFormSubmitted", () => {
      reloadCallback();
      handleAnalyticsCallback("accept");
    });

    window.cookieManager.on("CookieBannerAction", (eventData) => {
      handleAnalyticsCallback(eventData);
      reloadCallback();
    });

    if (typeof window.cookieManager.setConfig === "function") {
      window.cookieManager.setConfig({
        cookieDomain: cookieDomain
      });
    }

    window.cookieManager.init(config);
  }

  // Fallback check for initial analytics send
  setTimeout(() => {
    const cookieValue = getCookieValue("cookie-preferences");
    if (cookieValue) {
      try {
        const preferences = JSON.parse(cookieValue);
        if (preferences.analytics === "on") {
          sendAnalytics();
        }
      } catch (e) {
        console.error("Error checking cookies:", e);
      }
    }
  }, 100);
});
