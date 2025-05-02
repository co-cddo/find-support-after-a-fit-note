const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "/";

const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

// Clean URL function (defined early so it's available for use)
function cleanUrl(currentUrl) {
  if (currentUrl.includes("/preview/pr-")) {
    return currentUrl;
  } else if (process.env.ELEVENTY_PATH_PREFIX === "/find-support-after-a-fit-note/") {
    return currentUrl.replace(/^\/find-support-after-a-fit-note\//, "/");
  }
  return currentUrl;
}

module.exports = async function (eleventyConfig) {

  eleventyConfig.addGlobalData("pathPrefix", pathPrefix);

  // Fitnote collection
  eleventyConfig.addCollection("fitnote", function (collectionApi) {
    return collectionApi.getFilteredByTag("fitnote").sort((a, b) => {
      return a.data.eleventyNavigation.order - b.data.eleventyNavigation.order;
    });
  });

  // Filter for cleaning preview path prefix
  eleventyConfig.addNunjucksFilter("stripPreviewPrefix", function (url) {
    if (process.env.ELEVENTY_PATH_PREFIX !== "/") {
      return url.replace(/^\/preview\/pr-\d+\//, "/");
    }
    return url;
  });

  // Removes the trailing slash if it exists
  eleventyConfig.addNunjucksFilter("trimSlash", function (path) {
    return path.replace(/\/$/, "");
  });

  // Get previous item in a collection
  eleventyConfig.addNunjucksFilter("getPreviousCollectionItem", function (collection, currentUrl) {
    const targetUrl = cleanUrl(currentUrl);
    const index = collection.findIndex(item => cleanUrl(item.url) === targetUrl);
    return index > 0 ? collection[index - 1] : null;
  });

  // Get next item in a collection
  eleventyConfig.addNunjucksFilter("getNextCollectionItem", function (collection, currentUrl) {
    const targetUrl = cleanUrl(currentUrl);
    const index = collection.findIndex(item => cleanUrl(item.url) === targetUrl);
    return (index !== -1 && index < collection.length - 1) ? collection[index + 1] : null;
  });

  // Add heading IDs
  const { IdAttributePlugin } = await import("@11ty/eleventy");
  eleventyConfig.addPlugin(IdAttributePlugin, {
    selector: "h2, h3, h4, h5, h6",
    decodeEntities: true,
    checkDuplicates: true,
    slugify: eleventyConfig.getFilter("slugify")
  });

  // Navigation plugin
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Passthrough assets
  eleventyConfig.addPassthroughCopy({
    "node_modules/govuk-frontend/dist/govuk/assets/images/": "assets/images",
    "node_modules/govuk-frontend/dist/govuk/assets/fonts/": "assets/fonts",
    "src/assets/manifest.json": "assets/manifest.json",
    "src/assets/scripts/cookie-manager.js": "assets/scripts/cookie-manager.js"
  });

  // Shortcode for links with pathPrefix
  eleventyConfig.addShortcode("link", function (path, label) {
    return `<a href="${`${this.ctx.pathPrefix}${path}`.replace(/\/{2,}/g, "/")}">${label}</a>`;
  });

  // Filter to join paths with pathPrefix
  eleventyConfig.addFilter("absoluteUrl", function (path) {
    return `${pathPrefix}${path}`.replace(/\/{2,}/g, "/");
  });

  // Custom filter to add preview path prefix for relative URLs
  eleventyConfig.addFilter("addPreviewPathPrefix", function (url) {
    if (!/^https?:\/\//.test(url)) {
      return `${pathPrefix.replace(/\/$/, "")}/preview/pr-9${url}`;
    }
    return url;
  });

  // Apply the preview path prefix to all links in markdown content
  eleventyConfig.addFilter("applyPreviewPathPrefixToLinks", function (content) {
    return content.replace(/href="([^"]+)"/g, (match, url) => {
      return `href="${eleventyConfig.filters.addPreviewPathPrefix(url)}"`;
    });
  });

  // Custom filters
  require("./config/filters/merge-filter.js")(eleventyConfig);
  require("./config/filters/merge-objects.js")(eleventyConfig);

  // Plugins
  eleventyConfig.addPlugin(require("./config/plugins/scss-config.js"));
  eleventyConfig.addPlugin(require("./config/plugins/html-config.js"));
  eleventyConfig.addPlugin(require("./config/plugins/js-config.js"));

  return {
    dir: {
      input: "src",
      output: "public",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    pathPrefix,
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
