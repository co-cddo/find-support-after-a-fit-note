const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "/";

module.exports = function(eleventyConfig) {
  
  // Filter to join paths with pathPrefix
  eleventyConfig.addFilter("absoluteUrl", function (path) {
    return `${pathPrefix}${path}`.replace(/\/{2,}/g, "/");
  });

};
