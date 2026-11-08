# vinz-ve-portfolio

Vinz de Leon’s portfolio: six story chapters and an interactive editing-style project workspace. Built with the existing Next.js App Router, TypeScript, Tailwind CSS, GSAP, Motion and Lucide stack. No additional runtime dependencies.

## Run

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. Run `npm run build` for the production static export in `out/`. `npm start` serves that export. The active production origin is https://vinz-ve-portfolio.vercel.app/.

## Structure

- `app/page.tsx`: introduction, creative journey, project showcase, approach, about and contact chapters. Also owns chapter navigation, journey selection and GSAP scroll choreography.
- `components/project-workbench.tsx`: selected-project state, category/reel filters, independent project-list scrolling, keyboard browsing and stable preview layout. Preview is left on desktop and first on mobile.
- `components/project-media.tsx`: real video/image rendering, one-at-a-time playback, offscreen/tab-hidden pause, media-error recovery and accessible native expanded dialog.
- `lib/projects.ts`: existing project titles, ordering, category mapping and descriptions, all connected to the original JSON.
- `content/projects.json`: all 30 original entries and unchanged media/poster paths.
- `content/profile.json`: identity, email, biography, confirmed tools, capabilities and optional social links.
- `public/media/`: existing optimized WebP posters, graphics and MP4s. Source originals are untouched.
- `app/globals.css`: dark visual system, responsive workspace and chapter layouts, and reduced-motion CSS.

## Explore the work

Choose a category and then a project. The selected image or real video replaces the preview without reloading the page. Video Edits also exposes Reel 1 and Reel 2 filters. On desktop, the list scrolls independently on the right. On phones/tablets, it becomes a horizontal selector beneath the preview. Arrow keys, Home and End move selection once the project list has focus; previous/next buttons are available below the preview. Expanded views support Escape and return focus to the launching control.

Only the hero and selected-project video exist outside an expanded view. Videos load metadata rather than autoplaying, starting one pauses the others, and offscreen or hidden-page videos pause. Thumbnail rows use lazy images. Failed videos retain a poster and expose Retry. Missing images show an explicit unavailable state.

GSAP controls entrance/scroll reveals, the reading-progress line and subtle atmospheric motion. Motion handles media crossfades and expanded-view entrance. They do not animate the same properties on the same elements. Reduced-motion settings remove continuous/scroll motion and make media switches immediate. Scrolling remains native.

## Add or edit projects

Edit `content/projects.json` and labels in `lib/projects.ts`. Keep IDs unique and preserve real project context. Alternatively, place media into the source collections and run:

```sh
node scripts/optimize-media.mjs "C:/Users/Vinz Pogi/Downloads/Port"
npm run verify:media
npm run build
```

FFmpeg/FFprobe must be on PATH to regenerate optimized copies. Existing bundled assets work without them. The script never changes original files. Exact duplicates are identified by SHA-256. Project dimensions, durations and source-to-web mapping are retained.

## Content boundaries

No new clients, achievements, testimonials or project titles were invented. Existing descriptive titles were preserved exactly. Social links and software are omitted where not confirmed. Spoken-content captions have not been supplied. The small avatar remains an AI-assisted edit of Vinz’s photo; no large portrait is used in the hero.

See `STORY-REDESIGN.md` for the audit, design decisions and verification record. Historical design notes remain in `DESIGN-NOTES.md`.
