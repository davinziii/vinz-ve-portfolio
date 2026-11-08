# vinz-ve-portfolio

Vinz de Leon’s Next.js App Router portfolio using 30 supplied works. No stock media, fabricated clients, or invented results. Original media remains untouched.

## Run locally

Requires Node.js 22+ and npm. In this folder:

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. For production: `npm run build`; the static site is exported to `out/`. Deploy that directory to any static host. Alternatively `npx serve out` to preview the export. This project uses static export, so `next start` is not the production serving method.

## Content

- `content/profile.json`: name, mark, introduction, biography, philosophy, email, confirmed tools, capabilities, and social links. Empty email displays a truthful contact notice; adding email enables the mailto CTA. Add social links as `{"label":"Instagram","url":"https://..."}`.
- `content/projects.json`: source-to-optimized mapping, dimensions, duration, category and file metadata. Project labels live in the `titles` map in `app/page.tsx`; an optional `title` field in each project overrides that map. Categories follow the source folders.
- `public/media/`: optimized images, posters and MP4s.
- `asset-inventory.json`: full local source paths, SHA-256 hashes and technical inventory. Excluded from hosted source; the browser never receives local paths.
- `app/page.tsx`: reusable project card, media preview, accessible dialog, navigation and page sections.
- `app/globals.css`: responsive layout and motion styling.

## Adding work

Place new files into the original collection folders. With FFmpeg and FFprobe on PATH, run:

```sh
node scripts/optimize-media.mjs "C:/Users/Vinz Pogi/Downloads/Port"
node scripts/verify-media.mjs
npm run build
```

The script scans supported media, hashes exact duplicates, probes dimensions/duration, skips unchanged optimized media, produces WebP posters and H.264 MP4s, and updates inventory/data. It does not modify source files. It preserves original proportions. Videos are 540px wide for web delivery, graphics up to 1200px, with fast-start MP4 metadata. If FFmpeg is missing, install it and put `ffmpeg` and `ffprobe` on PATH; existing bundled optimized assets still work without it. Keep unique project IDs. You can also manually add entries using the existing data structure.

## Layout and motion

Personal portrait hero → specialties marquee → selected editorial features → filterable creative playground → About → capabilities → contact. GSAP owns initial text choreography and scroll reveals; Motion owns gallery layout/entrances and project dialog entrance; CSS owns marquee, hover and scroll-indicator movement. Selected CTAs respond gently to the pointer. Hover/focus previews are muted, one preview at a time, pause offscreen and when the page is hidden. Expanded videos use native controls with sound available. Phone users tap to open projects. The native modal traps focus, Escape closes, and focus returns to the launching button. Reduced-motion preferences disable previews and continuous movement. No scroll hijacking.

## Missing personal content

Social links, approved biography, confirmed editing software, project context/roles, and spoken-content captions. No metrics or software claims were invented. The animation button opens an actual excerpt. Contact links use the supplied vinzdeleon.work@gmail.com address. Supplied graphics contain brand imagery; labels describe the artwork and do not imply those brands were clients.

## Validation and limits

Production build and TypeScript checks passed. All 30 media entries have matching optimized assets; no exact duplicate hashes were found. A browser preview from the in-app browser could not reach the Windows local server. See the handoff for any later hosted verification. Spoken-content captions were not provided. Vinz’s portrait is an AI-assisted wardrobe/background edit of his supplied photo. See DESIGN-NOTES.md for the prompt and reference sources.

