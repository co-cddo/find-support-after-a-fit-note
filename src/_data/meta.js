const isProduction = process.env.ELEVENTY_ENV === "production";

module.exports = {
  siteEnvironment: process.env.ELEVENTY_ENV || "development",

  siteURL: isProduction
    ? "https://co-cddo.github.io/find-support-after-a-fit-note"
    : "http://localhost:8080",

  serviceName: "Find support after a fit note",
  siteName: "GOV.UK",
  siteDescription: "Get help if you’re taking time off work due to a health condition",
  siteEmail: "health-work-research@digital.cabinet-office.gov.uk",

  siteOgImage: isProduction
    ? "https://co-cddo.github.io/find-support-after-a-fit-note/assets/images/govuk-opengraph-image.png"
    : "http://localhost:8080/assets/images/govuk-opengraph-image.png"
}
