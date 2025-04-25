const fs = require("fs");
const path = require("path");

// Set the base URL for local testing
const baseUrl = "http://localhost:8080";  // Use this for local testing

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
  urls: process.env.NODE_ENV === 'development' ? getHtmlFiles(path.join(__dirname, "public")) : []  // Only run tests locally
};
