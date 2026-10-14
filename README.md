# HVAC CycleSim

Interactive HVAC troubleshooting scenarios, a virtual refrigeration lab, EPA 608 practice exams, and study guides.

## Local development

Use Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev
```

Run `npm run lint` to check TypeScript.

## Deployment

The Netlify configuration installs dependencies from `package-lock.json`, builds the application from the repository root with `npm run build`, and publishes `dist`. Push changes to the connected `main` branch to trigger deployment.

The application runs entirely in the browser and does not require API keys, a database, or server-side functions. Its installable PWA and offline support become available after the first successful online visit over HTTPS.
