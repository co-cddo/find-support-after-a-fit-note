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

// Inject Microsoft Clarity
function loadClarity() {

  if (!document.getElementById('clarity-script')) {

    window.clarity = window.clarity || function() {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    clarity('set', 'cookieDomain', '.cabinet-office.gov.uk');

    const clarityScript = document.createElement('script');
    clarityScript.id = 'clarity-script';
    clarityScript.type = 'text/javascript';
    clarityScript.async = true;
    clarityScript.src = 'https://www.clarity.ms/tag/rgthjyi5pn';
    document.head.appendChild(clarityScript);
  }

}

// Remove analytics and Clarity
function removeAnalytics() {
  const gtmScript = document.getElementById('gtm-script');
  if (gtmScript) gtmScript.remove();

  const clarityScript = document.getElementById('clarity-script');
  if (clarityScript) clarityScript.remove();

  if (window.dataLayer) {
    window.dataLayer.length = 0;
  }

  // Remove GA and Clarity cookies
  document.cookie = 'analytics=; Max-Age=0; path=/; domain=.cabinet-office.gov.uk';
  document.cookie = '_ga=; Max-Age=0; path=/; path=/; domain=.cabinet-office.gov.uk';
  document.cookie = '_gid=; Max-Age=0; path=/; path=/; domain=.cabinet-office.gov.uk';
  document.cookie = '_clck=; Max-Age=0; path=/;';
  document.cookie = '_clsk=; Max-Age=0; path=/;';
  document.cookie = 'CLID=; Max-Age=0; path=/;';
  document.cookie = 'MUID=; Max-Age=0; path=/;';
}

// Send analytics and load tracking
function sendAnalytics() {
  gtag('js', new Date());
  gtag('config', 'G-LCRPJR51P6', {
    cookie_domain: '.cabinet-office.gov.uk'
  });
  loadGTM();
  loadClarity();
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
// const setCookie = (name, value, days, secure, sameSite) => {
//   const expires = new Date(Date.now() + days * 864e5).toUTCString();
//   const secureFlag = secure ? 'Secure;' : '';
//   document.cookie = `${name}=${value}; expires=${expires}; path=/; ${secureFlag} SameSite=${sameSite}`;
// };

const setCookie = (name, value, days, secure, sameSite, domain) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secureFlag = secure ? 'Secure;' : '';
  const domainPart = domain ? `domain=${domain}; ` : '';
  document.cookie = `${name}=${value}; ${domainPart}expires=${expires}; path=/; ${secureFlag}SameSite=${sameSite}`;
};



// Save user preferences
// const setUserPreferences = (preferences) => {

//   const domain = location.hostname.endsWith('.cabinet-office.gov.uk')
//     ? '.cabinet-office.gov.uk'
//     : undefined;

//   setCookie(
//     config.userPreferences.cookieName,
//     JSON.stringify(preferences),
//     config.userPreferences.cookieExpiry,
//     config.userPreferences.cookieSecure,
//     config.userPreferences.cookieSameSite,
//     domain
//   );
// };

const setUserPreferences = (preferences) => {

  const parentDomain = location.hostname.endsWith('.cabinet-office.gov.uk')
    ? '.cabinet-office.gov.uk'
    : undefined; // Don't try to set domain on localhost

  setCookie(
    config.userPreferences.cookieName,
    JSON.stringify(preferences),
    config.userPreferences.cookieExpiry,
    config.userPreferences.cookieSecure,
    config.userPreferences.cookieSameSite,
    parentDomain
  );

};


// Handle form submitted
const reloadCallback = function(eventData) {
  let successBanner = document.querySelector('.cookie-banner-success');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  successBanner.removeAttribute('hidden');
  successBanner.focus();
};

// Handle banner accept/reject
const triggerAnalyticsCallback = function(eventData) {
  if (eventData === 'accept') {
    sendAnalytics();
    setUserPreferences({ analytics: 'on' });
  } else if (eventData === 'reject') {
    removeAnalytics();
    setUserPreferences({ analytics: 'off' });
  }
};

// Initialise cookie manager
window.cookieManager.on('PreferenceFormSubmitted', reloadCallback);
window.cookieManager.on('CookieBannerAction', triggerAnalyticsCallback);
window.cookieManager.init(config);

// Show banner if no preference set
if (!getCookieValue('cookie-preferences')) {
  // No preferences set – banner will show
}

// Apply preferences if already set
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
