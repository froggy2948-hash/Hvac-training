# HVAC CycleSim

An interactive HVAC training app with troubleshooting scenarios, a virtual refrigeration lab, EPA Section 608 practice exams, study guides, and a pressure-temperature calculator.

## Netlify deployment

The application lives at the repository root, not in an `hvac` subfolder. The root `netlify.toml` supplies the deployment configuration:

- Base directory: repository root (`.`)
- Build command: `npm run build`
- Publish directory: `dist`
- Node.js: 22

Netlify installs dependencies using `package-lock.json`, builds the app, and publishes the generated static files. The configuration also supplies a single-page app fallback and prevents stale service worker and manifest responses. No API keys, database, authentication service, or server functions are required by the existing features.

The intended production address is `https://hvactraining.netlify.app`. A successful production deployment is required before this address serves the app. A deploy preview does not publish the production site.

## Local development

Install dependencies with `npm ci`, then start the Netlify development server:

```sh
netlify dev --port 8889
```

Open `http://localhost:8889`. Run `npm run lint` to check TypeScript.

## Installation and offline use

After a successful HTTPS deployment, open the app online to allow its service worker to cache the application. Use **Install to Device** for browser-specific installation instructions. The production service worker caches the application for subsequent offline visits; development-server checks do not verify production offline caching.

Training and exam progress is temporary and resets when leaving a section or reloading the app. The app provides educational simulations and practice exams, not an official EPA certification or a substitute for equipment service instructions.
