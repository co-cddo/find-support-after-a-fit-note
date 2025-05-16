module.exports = function(eleventyConfig) {

  eleventyConfig.addFilter("includes", function(array, value) {
    return Array.isArray(array) && array.includes(value);
  });

};
