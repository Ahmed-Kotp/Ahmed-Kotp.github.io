# Ahmed Kotp — Portfolio

A static, cinematic portfolio for a senior React Native developer. All visible copy and CV facts live in JSON. Components only render that data.

## Scripts

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
```

`pnpm build` writes a fully static site to `out/` (`output: "export"`). There is no server, database, or API route.

## Edit the content

| File | What it controls |
| --- | --- |
| `data/profile.json` | Name, title, summary, location, email, phone visibility, socials, stats, rotating roles |
| `data/skills.json` | Skill groups. `level` is optional, from 0 to 5, and only drives the meter |
| `data/experience.json` | Roles, newest first. `type` is `full-time`, `contract`, `part-time`, `freelance`, or `prior` |
| `data/projects.json` | One object per project. The work grid and `/projects/[id]` update from this file |
| `data/education.json` | Degrees |
| `data/certificates.json` | Courses and diplomas |
| `data/ui.json` | English UI labels, navigation, and SEO |
| `data/i18n/en.json` | English UI. Must match the copy inside `ui.json` |
| `data/i18n/ar.json` | Arabic UI. Same keys, right-to-left when selected |

`lib/schemas.ts` validates every file at build time. A missing field fails `pnpm build` instead of shipping a broken page.

`data/ui.json` and `data/i18n/en.json` must stay in sync. If you change a button label, change it in both files (keep `siteUrl` and `seo` only in `ui.json`).

The phone number is in `profile.json` and stays off the public site while `"showPhone": false`.

### Add a project

Append one object to `data/projects.json`:

```json
{
  "id": "new-app",
  "name": "New App",
  "tagline": "One line.",
  "description": "A short paragraph.",
  "role": "Senior React Native Developer",
  "platform": ["iOS", "Android"],
  "appStoreUrl": "",
  "playStoreUrl": "",
  "tech": ["Expo", "TypeScript"],
  "highlights": ["What you shipped."],
  "status": "live",
  "featured": false,
  "accent": "#8b5cf6",
  "visual": "generic",
  "company": "Company"
}
```

- `id` becomes the URL: `/projects/new-app/`.
- `featured: true` puts it in the large showcase.
- `status` is `live`, `unreleased`, or `delisted`.
- `visual` picks the placeholder screen: `market`, `story`, `fitness`, `chat`, `gold`, `broadcast`, or `generic`.
- Link it from a job by adding the id to that job's `projectIds`.

### Store links

App Store and Google Play buttons render only when the URL is non-empty.

<!-- TODO: paste the public store URLs into appStoreUrl / playStoreUrl in data/projects.json -->

Leave both strings empty until you have the listing:

```json
"appStoreUrl": "",
"playStoreUrl": ""
```

### Images

`image` is optional. When it is missing, the card draws a gradient phone. To use a screenshot, add a file under `public/` and set:

```json
"image": "/projects/doueh.png"
```

Paths are local. `next/image` is configured with `images.unoptimized` so the static export works on every host.

### CV

- Download button: `public/Ahmed_Kotp_CV.pdf`. That file is the current CV. Replace it when you have a newer PDF, then redeploy.
- Printable page: `/cv`, then use the browser’s Print → Save as PDF. Print styles hide the site chrome.

### Contact form

The mailto button is always visible. The form is hidden until you set an endpoint. Copy `.env.example` to `.env.local`:

```bash
# Formspree
NEXT_PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxxx

# or Web3Forms
NEXT_PUBLIC_FORM_ENDPOINT=https://api.web3forms.com/submit
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your-access-key
```

These are public build-time values. Rebuild after changing them.

Vercel Analytics loads only when `NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS=true`.

### Language and theme

The header switches English and Arabic (`dir="rtl"`) and light and dark. Both choices are stored in `localStorage`.

## Deploy for free

See [DEPLOY.md](./DEPLOY.md) for Vercel Hobby, Cloudflare Pages, and GitHub Pages.
