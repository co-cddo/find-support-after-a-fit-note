const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "/";
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = async function (eleventyConfig) {


  // Watch for changes
  eleventyConfig.addWatchTarget(".src/assets/");
  eleventyConfig.addWatchTarget(".src/");


  // Make pathPrefix globally available in my templates
  eleventyConfig.addGlobalData("pathPrefix", pathPrefix);


  // Add IDs to headings
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


  // Copy CNAME
  eleventyConfig.addPassthroughCopy("src/CNAME");


  // Filters
  require("./config/filters/merge-filter.js")(eleventyConfig);
  require("./config/filters/merge-objects.js")(eleventyConfig);
  require("./config/filters/trim-slash.js")(eleventyConfig);
  require("./config/filters/absolute-url.js")(eleventyConfig);
  require("./config/filters/flatten-navigation.js")(eleventyConfig);
  require("./config/filters/markdown-path-prefix.js")(eleventyConfig);
  require("./config/filters/find-by-url.js")(eleventyConfig);
  require("./config/filters/includes.js")(eleventyConfig);


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
