
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

This project aims to provide accessible resources and support for people taking time off work due to a health condition. It uses Eleventy to build a static site and follows best practices for web accessibility (WCAG 2.1 AAA).

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

Accessibility tests are run using Pa11y CI. These tests are only executed locally in the development environment.

### Running Pa11y tests locally

To run the accessibility tests locally, use the following command:

```bash
npm run test:pa11y
```

This will run Pa11y CI with the `pa11y.config.js` file, testing all HTML files in the `public/` directory. Pa11y will check against the WCAG 2.1 AAA standard and log the results.

## Scripts

Here are the available npm scripts:

- `start`: Start the development server with live reloading.
- `build`: Build the site for production.
- `build:scss-env`: Run the custom SCSS build script for the environment.
- `build:eleventy`: Build the site using Eleventy.
- `clean`: Clean the `public/` directory.
- `purgecss`: Run PurgeCSS to remove unused CSS.
- `pa11y`: Run accessibility tests with Pa11y CI and output results to CLI.
- `test:pa11y`: Run accessibility tests locally using Pa11y CI.

## License

This project is licensed under the [ISC License](LICENSE).
