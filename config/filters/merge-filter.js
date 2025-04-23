module.exports = function(eleventyConfig) {
  
  eleventyConfig.addFilter("merge", function(array1, array2) {
    return array1.concat(array2);
  });

};
