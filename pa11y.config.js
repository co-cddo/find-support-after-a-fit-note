const fs = require("fs");
const path = require("path");
const pa11y = require("pa11y");

const baseUrl = "http://localhost:8080";
const htmlDir = path.join(__dirname, "public");

function getHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  let urls = [];

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      urls = urls.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith(".html")) {
      const relativePath = path.relative(htmlDir, fullPath);
      const urlPath = relativePath.replace(/\\/g, "/");
      urls.push(`${baseUrl}/${urlPath}`);
    }
  });

  return urls;
}

(async () => {
  const urls = getHtmlFiles(htmlDir);

  for (const url of urls) {
    console.log(`🔍 Testing: ${url}`);
    try {
      const result = await pa11y(url, {
        standard: 'WCAG2AA',
        timeout: 5000
      });

      if (result.issues.length > 0) {
        console.log(`❌ Issues at ${url}:`);
        result.issues.forEach(issue => {
          console.log(`  - [${issue.code}] ${issue.message} at ${issue.selector}`);
        });
      } else {
        console.log(`✅ No issues found at ${url}`);
      }
    } catch (err) {
      console.error(`🚨 Error testing ${url}:\n`, err.message);
    }
  }
})();
