module.exports = function(eleventyConfig) {
  
  eleventyConfig.addFilter("flattenNavigationAndAddNextPrev", (nav) => {
    const flat = [];
    const visit = (items) => {
      for (const item of items) {
        flat.push(item);
        visit(item.children);
      }
    };
    visit(nav);
    for (let i = 0; i < flat.length; i++) {
      const item = flat[i];
      item.prev = flat[i - 1];
      item.next = flat[i + 1];
    }
    return flat;
  });

};
