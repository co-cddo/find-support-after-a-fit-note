window.dataLayer = window.dataLayer || [];


// get cookie value
const getCookieValue = (name) => (
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || ""
)


// google analytics
function gtag() {
  dataLayer.push(arguments);
}


// send analytics
function sendAnalytics() {
  gtag("js", new Date());
  gtag("config", "G-LCRPJR51P6");
}


var config = {
  
  userPreferences: {
    cookieName: "cookies_preferences",
    cookieExpiry: 365,
    cookieSecure: false
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


const reloadCallback = function(eventData) {

  let successBanner = document.querySelector(".cookie-banner-success");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  successBanner.removeAttribute("hidden");
  successBanner.focus();

};


// callback to trigger sending analytics if the analytics preference has been accepted in the cookie banner
const triggerAnalyticsCallback = function(eventData) {
  if (eventData == "accept") {
    sendAnalytics();
  }
};


// initialise the cookie manager
window.cookieManager.on("PreferenceFormSubmitted", reloadCallback);
window.cookieManager.on("CookieBannerAction", triggerAnalyticsCallback);
window.cookieManager.init(config);


// send analytics if the cookie is set
try {
  
  const result = (JSON.parse(getCookieValue("cookie-preferences")).analytics == "on");
  
  // cookie has been set
  if (result == true) {
    sendAnalytics()
  }

} catch (err) {

  // SyntaxError: Unexpected end of JSON input
  console.log("error", err);

}
