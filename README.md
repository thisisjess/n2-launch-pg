# n2 Launch Page

Landing page for [n2ition](https://n2ition.com) — an enterprise-grade platform for engineering data intelligence.

- Original design: [Figma](https://www.figma.com/design/r7IDyPhGHT9FICdpY7sSgG/n2-launch-page)
- GitHub: https://github.com/thisisjess/n2-launch-pg
- Production: https://n2launch.fisforfuture.com (DNS pending) | https://n2-launch-pg.vercel.app

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173 to view the site.

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Stack

- Vite 6 + React 18 + TypeScript
- Tailwind CSS 4 + shadcn/ui (Radix + Tailwind)
- Framer Motion, Lucide React, Recharts, etc.

This project was exported from Figma Make and lightly customized (e.g. navbar CTA scroll target, password splash screen using the official N² logo from the MDMi brand assets).

## Password Gate (Preview Protection)

The site is protected by a lightweight client-side password splash screen (using the official red N² circle logo from `MDMi_Asset_Overview_V5.pdf`).

- Default password: `n2preview`
- Override by setting the `VITE_DEMO_PASSWORD` environment variable (recommended for production previews).
- Access is remembered per browser session via `sessionStorage` (close the tab/window to reset).

On Vercel: Project → Settings → Environment Variables → Add `VITE_DEMO_PASSWORD` (apply to Production + Preview) then redeploy.

## License / Credits

See ATTRIBUTIONS.md.
