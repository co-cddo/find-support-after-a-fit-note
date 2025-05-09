window.dataLayer = window.dataLayer || [];

// Get cookie value
const getCookieValue = (name) => (
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || ""
);

// Google Analytics
function gtag() {
  dataLayer.push(arguments);
}

function sendAnalytics() {
  gtag("js", new Date());
  gtag("config", "G-LCRPJR51P6");
}

// Try sending analytics if consent was granted
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

// Delete specific cookies by name and path
function deleteCookie(name) {
  document.cookie = `${name}=; path=/; domain=.digital.cabinet-office.gov.uk; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
}

// Delete all known analytics cookies
function deleteAnalyticsCookies() {
  ["_ga", "_gid", "analytics"].forEach(deleteCookie);
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
      cookies: ["analytics", "_ga", "_gid"]
    }
  ],
  additionalOptions: {
    defaultConsent: false,
    deleteUndefinedCookies: false,
    disableCookieBanner: false,
    disableCookiePreferencesForm: false
  }
};

// Set cookie with domain
const setCookie = (name, value, days, secure, sameSite) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secureFlag = secure ? "Secure;" : "";
  const domainFlag = "domain=.digital.cabinet-office.gov.uk;";
  document.cookie = `${name}=${value}; expires=${expires}; path=/; ${domainFlag} ${secureFlag} SameSite=${sameSite}`;
};

// Set user preference cookie
const setUserPreferences = (preferences) => {
  setCookie(
    config.userPreferences.cookieName,
    JSON.stringify(preferences),
    config.userPreferences.cookieExpiry,
    config.userPreferences.cookieSecure,
    config.userPreferences.cookieSameSite
  );
};

// Reload banner callback
const reloadCallback = () => {
  const successBanner = document.querySelector(".cookie-banner-success");
  if (successBanner) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    successBanner.removeAttribute("hidden");
    successBanner.focus();
  }
};

// Trigger analytics based on cookie banner choice
const triggerAnalyticsCallback = (eventData) => {
  if (eventData === "accept") {
    setUserPreferences({ analytics: "on" });
    sendAnalytics();
  } else if (eventData === "reject") {
    setUserPreferences({ analytics: "off" });
    deleteAnalyticsCookies();
  }
};

// Init when DOM is ready
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

  // Final fallback check
  setTimeout(trySendAnalytics, 100);
});
