// const isProduction = process.env.ELEVENTY_ENV === "production";
// const pathPrefix = isProduction ? "/find-support-after-a-fit-note/" : "/";

const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "/";

const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = async function (eleventyConfig) {


  // Make pathPrefix globally available in my templates
  eleventyConfig.addGlobalData("pathPrefix", pathPrefix);


  // Fitnote collection
  eleventyConfig.addCollection("fitnote", function(collectionApi) {
    return collectionApi.getFilteredByTag("fitnote").sort((a, b) => {
      return a.data.eleventyNavigation.order - b.data.eleventyNavigation.order;
    });
  });


  // Get previous and next
  eleventyConfig.addNunjucksFilter("getPreviousCollectionItem", function (collection, currentUrl) {
    const index = collection.findIndex(item => item.url === currentUrl);
    if (index > 0) return collection[index - 1];
    return null;
  });
  
  eleventyConfig.addNunjucksFilter("getNextCollectionItem", function (collection, currentUrl) {
    const index = collection.findIndex(item => item.url === currentUrl);
    if (index !== -1 && index < collection.length - 1) return collection[index + 1];
    return null;
  });


  const { IdAttributePlugin } = await import("@11ty/eleventy");


  // Add IDs for headings
  eleventyConfig.addPlugin(IdAttributePlugin, {
		selector: "h2, h3, h4, h5, h6",
		decodeEntities: true,
		checkDuplicates: true,
		slugify: eleventyConfig.getFilter("slugify")
	});


  // Navigation
  eleventyConfig.addPlugin(eleventyNavigationPlugin);


  // Copy GOVUK assets, manifest and cookie assets
  eleventyConfig.addPassthroughCopy({ 
    "node_modules/govuk-frontend/dist/govuk/assets/images/": "assets/images",
    "node_modules/govuk-frontend/dist/govuk/assets/fonts/": "assets/fonts",
    "src/assets/manifest.json": "assets/manifest.json",
    "src/assets/scripts/cookie-manager.js": "assets/scripts/cookie-manager.js"
  });


  // Fix path if inside a sub folder
  // eleventyConfig.addGlobalData("pathPrefix", process.env.ELEVENTY_ENV === "production" ? "/find-support-after-a-fit-note" : "");


  // Link path in markdown
  eleventyConfig.addShortcode("link", function(path, label) {
    const pathPrefix = this.ctx.pathPrefix || "";
    const fullPath = `${pathPrefix}${path}`.replace(/\/{2,}/g, "/");
    return `<a href="${fullPath}">${label}</a>`;
  });


  // Add a filter to join paths with the pathPrefix
  eleventyConfig.addFilter("absoluteUrl", function(path) {
    return `${pathPrefix || ""}${path}`.replace(/\/\/+/g, "/");
  });


  // Filters
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
  }


};
