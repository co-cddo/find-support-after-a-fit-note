window.dataLayer = window.dataLayer || [];


const getCookieValue = (name) => (
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
);


function gtag() {}
function loadGTM() {}
function removeAnalytics() {}
function sendAnalytics() {}

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
  } else if (eventData === 'reject') {
    setUserPreferences({ analytics: 'off' });
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



























// window.dataLayer = window.dataLayer || [];

// // Get cookie value helper
// const getCookieValue = (name) => (
//   document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
// );

// // Google Analytics push wrapper
// function gtag() {
//   dataLayer.push(arguments);
// }

// // Inject Google Tag Manager script
// function loadGTM() {
//   if (!document.getElementById('gtm-script')) {
//     const gtmScript = document.createElement('script');
//     gtmScript.id = 'gtm-script';
//     gtmScript.async = true;
//     gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-MV2BWF89';
//     document.head.appendChild(gtmScript);

//     window.dataLayer.push({
//       'gtm.start': new Date().getTime(),
//       event: 'gtm.js'
//     });
//   }
// }

// // Inject Microsoft Clarity script
// function loadClarity() {
//   if (!document.getElementById('clarity-script')) {
//     window.clarity = window.clarity || function() {
//       (window.clarity.q = window.clarity.q || []).push(arguments);
//     };
//     clarity('set', 'cookieDomain', '.cabinet-office.gov.uk');

//     const clarityScript = document.createElement('script');
//     clarityScript.id = 'clarity-script';
//     clarityScript.type = 'text/javascript';
//     clarityScript.async = true;
//     clarityScript.src = 'https://www.clarity.ms/tag/rgthjyi5pn';
//     document.head.appendChild(clarityScript);
//   }
// }

// // Helper to delete cookies with domain and path (corrected)
// const deleteCookie = (name, domain, path = '/') => {
//   // Domain attribute must start with dot for root domain cookies
//   const domainPart = domain ? `; domain=${domain}` : '';
//   const pathPart = path ? `; path=${path}` : '';
//   // Set expiration in the past to delete cookie
//   document.cookie = `${name}=; Max-Age=0${domainPart}${pathPart}; Secure; SameSite=Lax`;
// };

// // Remove analytics and clarity cookies + scripts
// function removeAnalytics() {
//   const gtmScript = document.getElementById('gtm-script');
//   if (gtmScript) gtmScript.remove();

//   const clarityScript = document.getElementById('clarity-script');
//   if (clarityScript) clarityScript.remove();

//   if (window.dataLayer) {
//     window.dataLayer.length = 0;
//   }

//   // Remove cookies for analytics & clarity on main domain
//   [
//     'analytics', '_ga', '_gid',
//     '_clck', '_clsk', 'CLID', 'MUID'
//   ].forEach(name => deleteCookie(name, '.cabinet-office.gov.uk'));

//   // Also remove some cookies without domain, just in case
//   ['_clck', '_clsk', 'CLID', 'MUID'].forEach(name => deleteCookie(name));

//   // Remove cookie-preferences cookies on main domain and subdomain
//   deleteCookie('cookie-preferences', '.cabinet-office.gov.uk');
//   deleteCookie('cookie-preferences', '.find-support-after-a-fit-note.digital.cabinet-office.gov.uk'); // note leading dot
//   deleteCookie('cookie-preferences');
// }

// // Send analytics and load GTM + Clarity
// function sendAnalytics() {
//   gtag('js', new Date());
//   gtag('config', 'G-LCRPJR51P6', {
//     cookie_domain: '.cabinet-office.gov.uk'
//   });
//   loadGTM();
//   loadClarity();
// }

// // Configuration object
// var config = {
//   userPreferences: {
//     cookieName: 'cookie-preferences',
//     cookieExpiry: 365,
//     cookieSecure: location.protocol === 'https:',
//     cookieSameSite: 'Lax',
//   },
//   preferencesForm: {
//     class: 'cookie-preferences-form'
//   },
//   cookieBanner: {
//     class: 'cookie-banner',
//     showWithPreferencesForm: false,
//     actions: [
//       {
//         name: 'accept',
//         buttonClass: 'cookie-banner-accept-button',
//         consent: true
//       },
//       {
//         name: 'reject',
//         buttonClass: 'cookie-banner-reject-button',
//         consent: false
//       }
//     ]
//   },
//   cookieManifest: [
//     {
//       categoryName: 'analytics',
//       optional: true,
//       cookies: [
//         'analytics', '_ga', '_gid', '_clck', '_clsk', 'CLID', 'MUID'
//       ]
//     }
//   ],
//   additionalOptions: {
//     defaultConsent: false,
//     deleteUndefinedCookies: false,
//     disableCookieBanner: false,
//     disableCookiePreferencesForm: false
//   }
// };

// // Set cookie with domain, path, secure, samesite, expiry (corrected domain syntax)
// const setCookie = (name, value, days, secure, sameSite, domain) => {
//   const expires = new Date(Date.now() + days * 864e5).toUTCString();
//   const secureFlag = secure ? 'Secure; ' : '';
//   const domainPart = domain ? `domain=${domain}; ` : '';
//   document.cookie = `${name}=${value}; ${domainPart}Expires=${expires}; Path=/; ${secureFlag}SameSite=${sameSite}`;
// };

// // Set user preferences and delete subdomain cookie to avoid conflicts
// const setUserPreferences = (preferences) => {
//   setCookie(
//     config.userPreferences.cookieName,
//     JSON.stringify(preferences),
//     config.userPreferences.cookieExpiry,
//     config.userPreferences.cookieSecure,
//     config.userPreferences.cookieSameSite,
//     '.cabinet-office.gov.uk'
//   );

//   // Remove any subdomain cookie-preferences to avoid conflicts
//   deleteCookie(config.userPreferences.cookieName, '.find-support-after-a-fit-note.digital.cabinet-office.gov.uk');
//   deleteCookie(config.userPreferences.cookieName);
// };

// // Callback on form submitted (shows success banner)
// const reloadCallback = function(eventData) {
//   let successBanner = document.querySelector('.cookie-banner-success');
//   window.scrollTo({ top: 0, behavior: 'smooth' });
//   if (successBanner) {
//     successBanner.removeAttribute('hidden');
//     successBanner.focus();
//   }
// };

// // Callback on banner accept/reject action
// const triggerAnalyticsCallback = function(eventData) {
//   if (eventData === 'accept') {
//     sendAnalytics();
//     setUserPreferences({ analytics: 'on' });
//   } else if (eventData === 'reject') {
//     removeAnalytics();
//     setUserPreferences({ analytics: 'off' });
//   }
// };

// // Initialise cookie manager event handlers and config
// window.cookieManager.on('PreferenceFormSubmitted', reloadCallback);
// window.cookieManager.on('CookieBannerAction', triggerAnalyticsCallback);
// window.cookieManager.init(config);

// // Show banner if no preferences set
// if (!getCookieValue('cookie-preferences')) {
//   // No preferences set – banner will show automatically
// }

// // Apply saved preferences if exist
// try {
//   const cookieValue = getCookieValue('cookie-preferences');
//   if (cookieValue) {
//     const parsed = JSON.parse(cookieValue);
//     if (parsed.analytics === 'on') {
//       sendAnalytics();
//     }
//   }
// } catch (err) {
//   console.error('Error parsing cookie preferences:', err);
// }

