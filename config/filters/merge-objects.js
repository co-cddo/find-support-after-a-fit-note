module.exports = function(eleventyConfig) {
  
  eleventyConfig.addFilter("mergeObjects", function(obj1, obj2) {
    return {
      ...obj1,
      ...obj2
    };
  });

};
