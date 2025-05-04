module.exports = function(eleventyConfig) {
  
  eleventyConfig.addFilter("findByUrl", (items, url) => {
    return items.find(item => item.url === url);
  });

};
