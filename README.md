# HL Group Website

Static bilingual website for HL Group (electrical design, installations, lighting and smart home), served at https://hlgroup-ks.com/ via GitHub Pages.

- `index.html` — Albanian, `en.html` — English
- `projects.js` / `projects-en.js` — portfolio data (keep both in sync; images live in `assets/projects/`)
- `polish.css` — latest typography, tap-target and footer refinements
- Contact form posts to FormSubmit (`hlgroupshpk@gmail.com`)

No build step: every push to `master` deploys through `.github/workflows/static.yml`.
