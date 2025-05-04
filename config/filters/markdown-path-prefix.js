const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "/";

module.exports = function(eleventyConfig) {
  
  // Apply the preview path prefix to all links in markdown content
  eleventyConfig.addFilter("markdownPathPrefix", function(content) {
    return content.replace(/href="(\/[^"]*)"/g, (match, url) => {
      const fixed = `${pathPrefix.replace(/\/$/, "")}${url}`;
      return `href="${fixed.replace(/\/{2,}/g, "/")}"`;
    });
  });

};
