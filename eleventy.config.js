const isProduction = process.env.ELEVENTY_ENV === "production";
const pathPrefix = isProduction ? "/find-support-after-a-fit-note/" : "/";

const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = async function (eleventyConfig) {

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

  // Copy GOVUK assets
  eleventyConfig.addPassthroughCopy({ 
    "node_modules/govuk-frontend/dist/govuk/assets/images/": "assets/images",
    "node_modules/govuk-frontend/dist/govuk/assets/fonts/": "assets/fonts"
  });

  eleventyConfig.addPassthroughCopy({ "src/assets/manifest.json": "assets/manifest.json" });


  eleventyConfig.addGlobalData("pathPrefix", process.env.ELEVENTY_ENV === "production" ? "/find-support-after-a-fit-note" : "");


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
