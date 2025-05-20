module.exports = eleventyConfig => {

  const isValidDate = date => !isNaN(new Date(date).getTime());

  eleventyConfig.addFilter("friendlyDate", function(date) {
    if (!isValidDate(date)) return date;
    return new Intl.DateTimeFormat("en-GB", { month: "short", day: "numeric" }).format(new Date(date));
  });

  eleventyConfig.addFilter("yearOnly", function(date) {
    if (!isValidDate(date)) return date;
    return new Intl.DateTimeFormat("en-GB", { year: "numeric" }).format(new Date(date));
  });

  eleventyConfig.addFilter("friendlyDateLong", function(date) {
    if (!isValidDate(date)) return date;
    return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date));
  });

  eleventyConfig.addFilter("isoDate", function(date) {
    if (!isValidDate(date)) return date;
    return new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(date));
  });

};
