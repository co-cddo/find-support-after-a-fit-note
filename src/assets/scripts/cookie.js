window.dataLayer = window.dataLayer || [];

// The exact cookie domain to force on all cookies
const COOKIE_DOMAIN = 'find-support-after-a-fit-note.digital.cabinet-office.gov.uk';

// Get cookie value by name (matches cookies on the current domain/subdomain)
const getCookieValue = (name) => (
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
);

// Helper to delete a cookie properly with domain and path
function deleteCookie(name, domain = COOKIE_DOMAIN, path = '/') {
  const domainPart = domain ? `domain=${domain};` : '';
  // Secure and SameSite=Lax are good defaults for your context
  document.cookie = `${name}=; Max-Age=0; path=${path}; ${domainPart} Secure; SameSite=Lax`;
}

// Set cookies with SameSite attribute and explicit domain
const setCookie = (name, value, days, secure, sameSite, domain = COOKIE_DOMAIN) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secureFlag = secure ? 'Secure;' : '';
  const domainPart = domain ? `domain=${domain};` : '';
  document.cookie = `${name}=${value}; expires=${expires}; path=/; ${domainPart}${secureFlag} SameSite=${sameSite}`;
};

// Google Analytics gtag function pushing to dataLayer
function gtag() {
  dataLayer.push(arguments);
}

// Inject Google Tag Manager script once
function loadGTM() {
  if (!document.getElementById('gtm-script')) {
    const gtmScript = document.createElement('script');
    gtmScript.id = 'gtm-script';
    gtmScript.async = true;
    gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-MV2BWF89';
    document.head.appendChild(gtmScript);

    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });
  }
}

// Remove analytics scripts and clear related cookies
function removeAnalytics() {
  const gtmScript = document.getElementById('gtm-script');
  if (gtmScript) gtmScript.remove();

  if (window.dataLayer) {
    window.dataLayer.length = 0;
  }

  // Remove Google Analytics cookies scoped to the exact domain
  deleteCookie('_ga');
  deleteCookie('_gid');
  deleteCookie('_ga_LCRPJR51P6');

  // Remove the cookie preferences cookie scoped to exact domain
  deleteCookie('cookie-preferences');
}

// Send analytics and load GTM
function sendAnalytics() {
  gtag('js', new Date());
  gtag('config', 'G-LCRPJR51P6', {
    cookie_domain: COOKIE_DOMAIN
  });
  loadGTM();
}

// Set user preferences cookie explicitly scoped to the full subdomain only
const setUserPreferences = (preferences) => {
  // Remove any old cookie WITHOUT domain (scoped to current host)
  document.cookie = `${config.userPreferences.cookieName}=; Max-Age=0; path=/;`;

  // Remove old cookie scoped to domain, just in case
  deleteCookie(config.userPreferences.cookieName);

  // Set new cookie scoped explicitly to the full subdomain domain
  setCookie(
    config.userPreferences.cookieName,
    JSON.stringify(preferences),
    config.userPreferences.cookieExpiry,
    config.userPreferences.cookieSecure,
    config.userPreferences.cookieSameSite,
    COOKIE_DOMAIN
  );
};

var config = {
  userPreferences: {
    cookieName: 'cookie-preferences',
    cookieExpiry: 365,
    cookieSecure: location.protocol === 'https:',
    cookieSameSite: 'Lax',
  },
  preferencesForm: {
    class: 'cookie-preferences-form'
  },
  cookieBanner: {
    class: 'cookie-banner',
    showWithPreferencesForm: false,
    actions: [
      {
        name: 'accept',
        buttonClass: 'cookie-banner-accept-button',
        consent: true
      },
      {
        name: 'reject',
        buttonClass: 'cookie-banner-reject-button',
        consent: false
      }
    ]
  },
  cookieManifest: [
    {
      categoryName: 'analytics',
      optional: true,
      cookies: [
        'analytics',
        '_ga',
        '_gid'
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

// Handle form submission callback
const reloadCallback = function(eventData) {
  let successBanner = document.querySelector('.cookie-banner-success');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  successBanner.removeAttribute('hidden');
  successBanner.focus();
};

// Handle banner action callback
const triggerAnalyticsCallback = function(eventData) {
  if (eventData === 'accept') {
    // User accepts, load analytics and set cookie
    sendAnalytics();
    setUserPreferences({ analytics: 'on' }); // Set preferences to 'on' when accepted
  } else if (eventData === 'reject') {
    // User rejects, remove analytics and set cookie
    removeAnalytics();
    setUserPreferences({ analytics: 'off' }); // Set preferences to 'off' when rejected
  }
};

// Initialise cookie manager
window.cookieManager.on('PreferenceFormSubmitted', reloadCallback);
window.cookieManager.on('CookieBannerAction', triggerAnalyticsCallback);
window.cookieManager.init(config);

// If no cookie preferences are set, show the banner
if (!getCookieValue('cookie-preferences')) {
  // No preferences set, so the banner will show.
  // Don't set the cookie initially, only after user interaction.
}

// Apply analytics based on existing cookie
try {
  const cookieValue = getCookieValue('cookie-preferences');
  if (cookieValue) {
    const parsed = JSON.parse(cookieValue);
    if (parsed.analytics === 'on') {
      sendAnalytics(); // Send analytics if 'on' preference is set
    }
  }
} catch (err) {
  console.error('Error parsing cookie preferences:', err);
}
