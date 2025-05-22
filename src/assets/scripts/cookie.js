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

  console.log('Add Google Analytics');

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

  console.log('Add Microsoft Clarity');

  if (!document.getElementById('clarity-script')) {
    (function(c,l,a,r,i,t,y){
      c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) };
      t = l.createElement(r); t.async = 1; t.id = 'clarity-script';
      t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t,y);
    })(window, document, 'clarity', 'script', 'rgthjyi5pn');
  }

}


// Remove Analytics and Clarity
function removeAnalytics() {

  const gtmScript = document.getElementById('gtm-script');
  if (gtmScript) gtmScript.remove();

  const clarityScript = document.getElementById('clarity-script');
  if (clarityScript) clarityScript.remove();

  if (window.dataLayer) {
    window.dataLayer.length = 0;
  }

}


// Send analytics and load tracking
function sendAnalytics() {

  // Debugging
  console.log('Add Tracking Code');

  gtag('js', new Date());
  gtag('config', 'G-LCRPJR51P6');
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
const reloadCallback = function(eventData) {
  let successBanner = document.querySelector('.cookie-banner-success');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  successBanner.removeAttribute('hidden');
  successBanner.focus();  
};


// Handle banner accept/reject
const triggerAnalyticsCallback = function(eventData) {
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
