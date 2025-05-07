const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "/";
const eleventyEnv = process.env.ELEVENTY_ENV || "development";

const baseURL =
  eleventyEnv === "production"
    ? "https://find-suppport-after-a-fit-note.digital.cabinet-office.gov.uk"
    : "http://localhost:8080";

const fullSiteUrl = `${baseURL}${pathPrefix}`.replace(/\/+$/, "");

module.exports = {
  siteEnvironment: eleventyEnv,
  serviceName: "Find support after a fit note",
  siteName: "GOV.UK",
  siteDescription: "Get help if you’re taking time off work due to a health condition",
  siteEmail: "health-work-research@digital.cabinet-office.gov.uk",
  fullSiteUrl,
  siteOgImage: `${fullSiteUrl}/assets/images/govuk-opengraph-image.png`
};
