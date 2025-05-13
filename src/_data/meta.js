const eleventyEnv = process.env.ELEVENTY_ENV || "development";
const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "/";

// Ensure trailing slash is removed from baseURL (for clean joins)
const baseURL =
  eleventyEnv === "production"
    ? "https://find-support-after-a-fit-note.netlify.app"
    : "http://localhost:8080";

// Useful for metadata like Open Graph
const fullSiteUrl = `${baseURL}${pathPrefix}`.replace(/\/+$/, "");

module.exports = {
  siteEnvironment: eleventyEnv,
  serviceName: "Find support after a fit note",
  siteName: "GOV.UK",
  siteDescription: "Get help for time off work due to illness or personal issues",
  siteEmail: "health-work-research@digital.cabinet-office.gov.uk",
  pathPrefix,
  fullSiteUrl,
  siteOgImage: `${fullSiteUrl}/assets/images/govuk-opengraph-image.png`
};
