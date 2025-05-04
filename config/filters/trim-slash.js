module.exports = function(eleventyConfig) {
  
  // Removes the trailing slash if it exists
  eleventyConfig.addNunjucksFilter("trimSlash", function (path) {
    return path.replace(/\/$/, "");
  });

};
