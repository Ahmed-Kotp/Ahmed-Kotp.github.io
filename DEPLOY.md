# Deploy for free

The site is a static export. `pnpm build` writes HTML, CSS, and JS to `out/`. No server, database, or paid add-on is required.

Set `data/ui.json` → `siteUrl` to the final public URL before the production build so canonical links, the sitemap, and Open Graph URLs match the domain.

## Vercel Hobby

1. Push the project to GitHub, GitLab, or Bitbucket.
2. In [Vercel](https://vercel.com), choose **Add New… → Project** and import the repository. The Hobby plan is enough.
3. Framework preset: **Next.js**.
4. Install command: `pnpm install`.
5. Build command: `pnpm build`.
6. Leave the output directory on the Next.js default. Vercel detects `output: "export"` and serves `out/`.
7. Environment variables, only if you want them:
   - `NEXT_PUBLIC_FORM_ENDPOINT`
   - `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`
   - `NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS` = `true` (optional; the package is already in the repo and stays off until this is `true`)
8. Deploy. Later edits to JSON redeploy the same way.

A custom domain on the Hobby plan is optional and still free at the DNS level if you already own the domain.

## Cloudflare Pages

1. Push the project to GitHub or GitLab.
2. In the Cloudflare dashboard, open **Workers & Pages → Create → Pages → Connect to Git**.
3. Build command: `pnpm install && pnpm build`
4. Build output directory: `out`
5. Set the environment variable `NODE_VERSION` to `20` or newer if the build image is old.
6. Add the same `NEXT_PUBLIC_*` variables as above if you use the form. Do not enable Vercel Analytics here.
7. Save and deploy. Production deploys stay on the free Pages plan.

## GitHub Pages

GitHub Pages serves the `out/` folder. Project sites (`https://<user>.github.io/<repo>/`) need a `basePath`. User sites (`https://<user>.github.io`) do not.

1. In `next.config.ts`, set `basePath` and `assetPrefix` only for a project site, for example `basePath: "/web-protofolio"`. Leave them unset for a user site or a custom domain.
2. Set `siteUrl` in `data/ui.json` to the Pages URL.
3. Add this workflow as `.github/workflows/pages.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

4. In the repository, open **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.

Vercel or Cloudflare is the simpler free host if you do not want to think about `basePath`.
