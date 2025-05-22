window.dataLayer = window.dataLayer || [];


const getCookieValue = (name) => (
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
);


function gtag() {
  dataLayer.push(arguments);
}

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

function removeAnalytics() {

  const gtmScript = document.getElementById('gtm-script');
  
  if (gtmScript) gtmScript.remove();

  if (window.dataLayer) {
    window.dataLayer.length = 0; 
  }


  // Try removing specific cookies

  // document.cookie = '_ga=; Max-Age=0; path=/;';

  alert('Remove cookies')


}

function sendAnalytics() {
  gtag('js', new Date());
  gtag('config', 'G-LCRPJR51P6');
  loadGTM();
}

var config = {
  userPreferences: {
    cookieName: 'cookie-preferences',
    cookieExpiry: 365,
    cookieSecure: location.protocol === 'https:',
    cookieSameSite: 'Lax'
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


const setCookie = (name, value, days, secure, sameSite) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secureFlag = secure ? 'Secure;' : '';
  document.cookie = `${name}=${value}; expires=${expires}; path=/; ${secureFlag} SameSite=${sameSite}`;
};


const setUserPreferences = (preferences) => {

  setCookie(
    config.userPreferences.cookieName,
    JSON.stringify(preferences),
    config.userPreferences.cookieExpiry,
    config.userPreferences.cookieSecure,
    config.userPreferences.cookieSameSite
  );

};

const reloadCallback = function(eventData) {
  let successBanner = document.querySelector('.cookie-banner-success');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  successBanner.removeAttribute('hidden');
  successBanner.focus();
};


const triggerAnalyticsCallback = function(eventData) {
  
  if (eventData === 'accept') {
    setUserPreferences({ analytics: 'on' });
    sendAnalytics();
  } else if (eventData === 'reject') {
    setUserPreferences({ analytics: 'off' });
    removeAnalytics();
  }

};


window.cookieManager.on('PreferenceFormSubmitted', reloadCallback);
window.cookieManager.on('CookieBannerAction', triggerAnalyticsCallback);
window.cookieManager.init(config);

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
