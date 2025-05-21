window.dataLayer = window.dataLayer || [];

// Get cookie value
const getCookieValue = (name) => (
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
);

// Delete cookie helper — deletes with and without leading dot on domain
function deleteCookie(name, domain, path = '/') {
  if (!domain) {
    document.cookie = `${name}=; Max-Age=0; path=${path}; Secure; SameSite=Lax`;
    return;
  }
  // Remove leading dot from domain if present for setting cookies correctly
  if (domain.startsWith('.')) domain = domain.slice(1);

  // Delete cookie scoped to exact domain
  document.cookie = `${name}=; Max-Age=0; path=${path}; domain=${domain}; Secure; SameSite=Lax`;

  // Also delete cookie scoped to domain with leading dot (legacy cookies)
  document.cookie = `${name}=; Max-Age=0; path=${path}; domain=.${domain}; Secure; SameSite=Lax`;
}

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

// Remove analytics and legacy preference cookies
function removeAnalytics() {
  const gtmScript = document.getElementById('gtm-script');
  if (gtmScript) gtmScript.remove();

  if (window.dataLayer) {
    window.dataLayer.length = 0;
  }

  // Remove Google Analytics cookies for this exact subdomain and parent domain
  // Note: Deleting parent domain cookies might not fully work if you don't have control over that domain
  ['_ga', '_gid', '_ga_LCRPJR51P6'].forEach(name => {
    deleteCookie(name, 'find-support-after-a-fit-note.digital.cabinet-office.gov.uk');
    deleteCookie(name, 'cabinet-office.gov.uk');
  });

  // Remove user preference cookie for your subdomain (both dot and no-dot)
  deleteCookie('cookie-preferences', 'find-support-after-a-fit-note.digital.cabinet-office.gov.uk');
}

// Send analytics and load GTM
function sendAnalytics() {
  gtag('js', new Date());
  gtag('config', 'G-LCRPJR51P6', {
    cookie_domain: 'find-support-after-a-fit-note.digital.cabinet-office.gov.uk'
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

// Set cookies with SameSite attribute and exact domain (no leading dot)
const setCookie = (name, value, days, secure, sameSite, domain) => {
  if (domain && domain.startsWith('.')) domain = domain.slice(1);

  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secureFlag = secure ? 'Secure;' : '';
  const domainPart = domain ? `domain=${domain};` : '';
  document.cookie = `${name}=${value}; expires=${expires}; path=/; ${domainPart}${secureFlag} SameSite=${sameSite}`;
};

// Set user preferences
const setUserPreferences = (preferences) => {
  // Remove old cookie without domain (subdomain scoped)
  document.cookie = `${config.userPreferences.cookieName}=; Max-Age=0; path=/;`;

  // Set domain-wide cookie scoped exactly to your subdomain (no leading dot)
  setCookie(
    config.userPreferences.cookieName,
    JSON.stringify(preferences),
    config.userPreferences.cookieExpiry,
    config.userPreferences.cookieSecure,
    config.userPreferences.cookieSameSite,
    'find-support-after-a-fit-note.digital.cabinet-office.gov.uk'
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
