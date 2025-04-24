const esbuild = require("esbuild");
const isProduction = process.env.ELEVENTY_ENV === "production";

module.exports = eleventyConfig => {

  eleventyConfig.on("afterBuild", () => {

    return esbuild.build({
      target: "es2020",
      entryPoints: [
        "./src/assets/scripts/cookie.js",
      ],
      outdir: "public/assets/scripts",
      minify: isProduction ? true : false,
      bundle: true
    });

  });

};
