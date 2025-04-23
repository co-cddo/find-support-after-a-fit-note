module.exports = {

  content: [
    "public/**/*.html", 
    "public/assets/scripts/app.js"
  ],

  defaultExtractor: content => content.match(/[\w-/:%@]+(?<!:)/g) || [],

  safelist: {
    standard: [
      ".is-hidden", 
      ".is-visible"
    ],
    deep: [/class$/]
  },

  // process main app css file
  css: [
    "public/assets/styles/app.css"
  ],

  output: "public/assets/styles/"

}
