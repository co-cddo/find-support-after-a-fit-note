const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "/";

module.exports = function (eleventyConfig) {
  
  eleventyConfig.addFilter("absoluteUrl", function (path = "") {

    // Skip modification for absolute URLs
    if (/^(?:[a-z]+:)?\/\//i.test(path)) return path;

    return (pathPrefix.replace(/\/$/, "") + "/" + path.replace(/^\/+/, "")).replace(/\/{2,}/g, "/");
  });

  return {
    pathPrefix
  };

};
