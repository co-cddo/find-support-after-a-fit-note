const fs = require("fs");
const path = require("path");

const baseUrl = process.env.BASE_URL || `http://localhost:8080${process.env.ELEVENTY_ENV === "production" ? "/find-support-after-a-fit-note" : ""}`;

function getHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  let urls = [];

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      urls = urls.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith(".html")) {
      const relativePath = path.relative("public", fullPath);
      const urlPath = relativePath.replace(/\\/g, "/");
      urls.push(`${baseUrl}/${urlPath}`);
    }
  });

  return urls;
}

module.exports = {
  standard: "WCAG2AAA",
  level: "error",
  defaults: {
    timeout: 5000,
    threshold: 2
  },
  urls: getHtmlFiles(path.join(__dirname, "public"))
};
