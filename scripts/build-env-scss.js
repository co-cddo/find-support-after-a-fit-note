const fs = require("fs");
const isProduction = process.env.ELEVENTY_ENV === "production";
const pathPrefix = isProduction ? "/find-support-after-a-fit-note" : "";

const scssContent = `$pathPrefix: "${pathPrefix}";
$govuk-images-path: "#{$pathPrefix}/assets/images/";
$govuk-fonts-path: "#{$pathPrefix}/assets/fonts/";
`;

fs.writeFileSync("src/assets/styles/_env.scss", scssContent);
console.log("✅ SCSS environment variables written to _env.scss");
