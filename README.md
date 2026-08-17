# NewDawn School website

A modern, responsive multi-page website for NewDawn School in Bondo, Kenya.

The site includes dedicated About, Academics, School Life, Admissions, Contact and Privacy pages, plus a custom 404 page, responsive WebP imagery, security-header guidance and a complete XML sitemap.

The global gold banner links teachers and parents to the Kurasa portal. Its URL is managed centrally in `site-config.js`. The included service worker provides a resilient offline fallback after the first successful visit when the site is served over HTTPS.

## Preview locally

Serve this folder with any static web server. For example:

```sh
npx serve .
```

Then open the local address shown in the terminal.

## Deploy

The project is suitable for GitHub Pages, Netlify, Cloudflare Pages or any standard static host. Upload the contents of this folder to the web root. The included `CNAME` preserves the existing custom domain configuration. Netlify and compatible hosts will also use the included `_headers` security and caching rules.

## Important contact check

The source project consistently used `info@newdawnschool.sh.ke`, while the public website domain is `newdawnschool.sc.ke`. Confirm the intended email address before publishing and update it in `index.html` if needed.

## Forms

The admissions form intentionally opens WhatsApp with a pre-filled message, so the site does not collect or store personal information and requires no backend. If a traditional email/database form is required later, connect a trusted form service and add a privacy notice and consent handling.
