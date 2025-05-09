window.dataLayer = window.dataLayer || [];

// Utility to get cookie value by name
const getCookieValue = (name) => (
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || ""
);

// Google Analytics setup
function gtag() {
  dataLayer.push(arguments);
}

function sendAnalytics() {
  gtag("js", new Date());
  gtag("config", "G-LCRPJR51P6");
}

// Remove analytics cookies
function removeAnalyticsCookies() {
  const cookies = ["_ga", "_gid", "analytics"];
  cookies.forEach(name => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
  });
}

// Attempt to send analytics if preference is 'on', otherwise clear analytics cookies
function trySendAnalytics() {
  try {
    const value = getCookieValue("cookie-preferences");
    if (value) {
      const parsed = JSON.parse(value);
      if (parsed.analytics === "on") {
        sendAnalytics();
      } else {
        removeAnalyticsCookies();
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

// Utility to set a cookie with SameSite and Secure options
const setCookie = (name, value, days, secure, sameSite) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secureFlag = secure ? "Secure;" : "";
  document.cookie = `${name}=${value}; expires=${expires}; path=/; ${secureFlag} SameSite=${sameSite}`;
};

// Store user preferences in cookie
const setUserPreferences = (preferences) => {
  setCookie(
    config.userPreferences.cookieName,
    JSON.stringify(preferences),
    config.userPreferences.cookieExpiry,
    config.userPreferences.cookieSecure,
    config.userPreferences.cookieSameSite
  );
};

// Callback to show confirmation message and scroll up
const reloadCallback = () => {
  const successBanner = document.querySelector(".cookie-banner-success");
  if (successBanner) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    successBanner.removeAttribute("hidden");
    successBanner.focus();
  }
};

// Callback triggered on banner action (accept/reject)
const triggerAnalyticsCallback = (eventData) => {
  if (eventData === "accept") {
    setUserPreferences({ analytics: "on" });
    sendAnalytics();
  } else if (eventData === "reject") {
    setUserPreferences({ analytics: "off" });
    removeAnalyticsCookies();
  }
};

// Initialise cookie manager once DOM is ready
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

  // Initial check after DOM load
  setTimeout(trySendAnalytics, 100);
});
