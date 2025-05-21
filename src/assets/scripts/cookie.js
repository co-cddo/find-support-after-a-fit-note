window.dataLayer = window.dataLayer || [];

// Get cookie value
const getCookieValue = (name) => (
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
);

// Google Analytics
function gtag() {
  dataLayer.push(arguments);
}

// Inject Google Tag Manager
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

// Remove GTM and clear dataLayer
function removeAnalytics() {
  const gtmScript = document.getElementById('gtm-script');
  if (gtmScript) gtmScript.remove();

  if (window.dataLayer) {
    window.dataLayer.length = 0; // Clear the dataLayer
  }

  // Optionally remove cookies that were set for GA or GTM
  document.cookie = '_ga=; Max-Age=0; path=/;';
  document.cookie = '_gid=; Max-Age=0; path=/;';
  document.cookie = 'analytics=; Max-Age=0; path=/;';

  // Cleanup legacy cookies from .cabinet-office.gov.uk
  document.cookie = '_ga=; Max-Age=0; domain=.cabinet-office.gov.uk; path=/;';
  document.cookie = '_ga_LCRPJR51P6=; Max-Age=0; domain=.cabinet-office.gov.uk; path=/;';

}

// Send analytics and load GTM
function sendAnalytics() {
  gtag('js', new Date());
  gtag('config', 'G-LCRPJR51P6', {
    cookie_domain: '.cabinet-office.gov.uk'
  });
  loadGTM();
}


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

// Set cookies with SameSite attribute
const setCookie = (name, value, days, secure, sameSite, domain) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secureFlag = secure ? 'Secure;' : '';
  const domainPart = domain ? `domain=${domain};` : '';
  document.cookie = `${name}=${value}; ${domainPart} expires=${expires}; path=/; ${secureFlag} SameSite=${sameSite}`;
};

// Set user preferences
const setUserPreferences = (preferences) => {
  setCookie(
    config.userPreferences.cookieName,
    JSON.stringify(preferences),
    config.userPreferences.cookieExpiry,
    config.userPreferences.cookieSecure,
    config.userPreferences.cookieSameSite,
    '.cabinet-office.gov.uk' // This makes it available to all subdomains
  );
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
