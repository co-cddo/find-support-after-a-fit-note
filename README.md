
# Find support after a fit note

A project to provide support for individuals taking time off work due to a health condition, using accessibility best practices and adhering to GOV.UK design principles.

## Table of contents

- [Overview](#overview)
- [Installation](#installation)
- [Development](#development)
- [Building the project](#building-the-project)
- [Running accessibility tests](#running-accessibility-tests)
- [Scripts](#scripts)
- [License](#license)

## Overview

This project aims to provide accessible resources and support for people taking time off work due to a health condition. It uses Eleventy to build a static site and follows best practices for web accessibility (WCAG 2.2 AA).

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/find-support-after-a-fit-note.git
   ```

2. Navigate into the project directory:
   ```bash
   cd find-support-after-a-fit-note
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up your environment variables if necessary (e.g., `BASE_URL`, etc.).

## Development

### Starting the development server

To start the local development server and automatically watch for changes:

```bash
npm start
```

This will:
- Build the site in development mode.
- Start Eleventy with live-reloading (`--serve` flag).
- Watch your files for changes and re-build the site as needed.

### Build for production

To build the site for production (including SCSS and CSS purging):

```bash
npm run build
```

This will:
- Clean the `public/` directory.
- Build the SCSS and compile the Eleventy site.
- Run the CSS purge to remove unused styles.

## Running accessibility tests

Accessibility tests are run using Pa11y. These tests are only executed locally in the development environment.

### Running Pa11y tests locally

To run the accessibility tests locally, use the following command:

```bash
npm run test:pa11y
```

This will run a custom Pa11y test script (`pa11y.config.js`) that scans all `.html` files in the `public/` directory and tests each page against the WCAG 2.1 AA accessibility standard.

Make sure your local site is running at `http://localhost:8080` before running the tests.

Each result will be printed to the console, showing any accessibility issues found on each page.

> **Note:** Pa11y currently does not officially support WCAG 2.2, but uses WCAG 2.1 rules under the WCAG2AA setting. For full WCAG 2.2 coverage, consider supplementing these tests with axe-core or axe-playwright for automated browser-based checks.

## Scripts

Here are the available npm scripts:

- `start`: Start the development server with live reloading.
- `build`: Build the site for production.
- `build:scss-env`: Run the custom SCSS build script for the environment.
- `build:eleventy`: Build the site using Eleventy.
- `clean`: Clean the `public/` directory.
- `purgecss`: Run PurgeCSS to remove unused CSS.
- `test:pa11y`: Run accessibility tests locally using Pa11y.

## License

This project is licensed under the [ISC License](LICENSE).
