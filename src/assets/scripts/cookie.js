window.dataLayer = window.dataLayer || [];


// Track internal/external users
(function () {

  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const isInternal = urlParams.get('internal')?.toLowerCase() === 'true';

  if (isInternal) {
    localStorage.setItem('userType', 'internal');
  }

  const storedUserType = localStorage.getItem('userType') || 'external';

  window.dataLayer.push({
    user_type: storedUserType
  });

})();


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


// Remove Google Tag Manager
function removeAnalytics() {

  const gtmScript = document.getElementById('gtm-script');

  if (gtmScript) gtmScript.remove();

  if (window.dataLayer) {
    window.dataLayer.length = 0;
  }

  // Optionally remove cookies that were set for GA, GTM or Clarity
  const cookieNames = ['_ga', '_gid', '_clck', '_clsk', 'analytics', 'MUID', 'CLID'];
  cookieNames.forEach(name => {
    document.cookie = `${name}=; Max-Age=0; path=/;`;
  });

}


// Send analytics and load tracking
function sendAnalytics() {

  gtag('js', new Date());

  // First, configure GA
  gtag('config', 'G-LCRPJR51P6');

  // Send the user_type to GA4 as a user property
  const storedUserType = localStorage.getItem('userType') || 'external';
  gtag('set', { user_properties: { user_type: storedUserType } });

  // Load GTM last
  loadGTM();

}


// Configuration
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
        '_gid',
        '_clck',
        '_clsk',
        'CLID',
        'MUID'
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


// Set cookies with SameSite
const setCookie = (name, value, days, secure, sameSite) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secureFlag = secure ? 'Secure;' : '';
  document.cookie = `${name}=${value}; expires=${expires}; path=/; ${secureFlag} SameSite=${sameSite}`;
};


// Save user preferences
const setUserPreferences = (preferences) => {
  setCookie(
    config.userPreferences.cookieName,
    JSON.stringify(preferences),
    config.userPreferences.cookieExpiry,
    config.userPreferences.cookieSecure,
    config.userPreferences.cookieSameSite
  );
};


// Handle form submitted
const reloadCallback = function () {
  let successBanner = document.querySelector('.cookie-banner-success');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  successBanner.removeAttribute('hidden');
  successBanner.focus();
};


// Handle banner action callback
const triggerAnalyticsCallback = function (eventData) {
  if (eventData === 'accept') {
    setUserPreferences({ analytics: 'on' });
    sendAnalytics();
  } else if (eventData === 'reject') {
    setUserPreferences({ analytics: 'off' });
    removeAnalytics();
  }
};

// Initialise cookie manager
window.cookieManager.on('PreferenceFormSubmitted', reloadCallback);
window.cookieManager.on('CookieBannerAction', triggerAnalyticsCallback);
window.cookieManager.init(config);

// Apply preferences, if already set
try {
  const cookieValue = getCookieValue('cookie-preferences');
  if (cookieValue) {
    const parsed = JSON.parse(cookieValue);
    if (parsed.analytics === 'on') {
      sendAnalytics();
    }
  }
} catch (err) {
  console.error('Error parsing cookie preferences:', err);
}
