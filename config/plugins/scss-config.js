const esbuild = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");

const postcss = require("postcss");
const autoprefixer = require("autoprefixer");

const isProduction = process.env.ELEVENTY_ENV === "production";

module.exports = eleventyConfig => {

  eleventyConfig.on("afterBuild", () => {

    return esbuild.build({
      entryPoints: ["./src/assets/styles/app.scss"],
      outdir: "public/assets/styles",
      minify: isProduction ? true : false,
      sourcemap: false,
      plugins: [sassPlugin({
        quietDeps: true,
        async transform(source) {
          const { css } = await postcss([autoprefixer]).process(source, { from: undefined });
          return css;
        }
      })]
    });

  });

};
