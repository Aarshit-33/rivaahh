# Nimantran — Next.js site

Digital invitations for Indian celebrations. This is the Next.js (App Router) version of the original Vite app in `../web`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://yourdomain.in`) in production so metadata, the sitemap and share images use the right address.

## Routes

| Route | What it is |
|---|---|
| `/` | Home: the "ink to instant" hero and the original sections (unchanged from the Vite app) |
| `/occasions` (old `/templates` redirects here) | The hand-delivered spread: every occasion as a piece of stationery, with sentence filters that carry into the collection |
| `/templates/category/[occasion]` | The 9:16 reel wall for one occasion: filters, taste finder, shortlist |
| `/templates/[id]` | Single-template showcase with the stage and the full-screen demo (desktop, tablet and phone layouts) |
| `/contact` | Contact form (WhatsApp first) and "what happens next" |
| `/about` | About, with the card that turns from paper to phone |
| `/privacy`, `/terms` | Draft legal pages, to be reviewed before launch |

## Where things live

- `src/app/`: routes, metadata, sitemap, robots, icon and share image.
- **Home page:** `src/home/` loads it in the browser, because the hero reads WebGL and screen size while rendering. Its code is in `src/hero`, `src/life`, `src/device` and `src/sections`, copied as-is from the Vite app.
- `src/components/props/`: **shared props.** The same phone, laptop, calendar, envelope, rotary telephone and wax seal are used on every page.
- `src/components/invite/`: the invitation itself (`InviteScreen`, 9:16) and the template card (`ReelCard`).
- `src/features/<page>/`: page-specific components and local data.
- `src/templates/data.js`: the template catalogue and occasion categories.
- `src/data/site.js`: business details. **Every value marked `SAMPLE` must be replaced before launch.** Contact channels are `null` until they exist, and the pages then show "Shared at launch".

## Fonts

Fonts load from Google Fonts by their real family names, because the hero and the 3D envelope draw text onto canvases using "Fraunces", "Parisienne" and "Manrope".
