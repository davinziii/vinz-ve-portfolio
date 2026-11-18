# Project audit and cleanup

- Removed 40 unused legacy main-gallery files, approximately 518 MiB from the published public directory. Files remain recoverable from Git history.
- Retained legacy assets required by the hero, creative journey, filmstrip, About artwork, and graphic carousel.
- Reused the prepared JRUS MP4 rather than retaining an identical legacy copy.
- Retained the full graphics and their small thumbnail derivatives: they serve different display sizes.
- Separate client Showcase collections intentionally still include some identical examples. Removing those files directly would empty their collection entries. They are not downloaded together on the main page.
- Offscreen ProjectMedia players now defer their video source until within 300px of the viewport; explicit play and expanded players load immediately. Image posters remain available.
- No duplicate project IDs, missing manifest assets, or missing main-page project references were found after cleanup.
- Production build, Showcase discovery tests, shared volume tests and media checks passed.

Run `node scripts/audit-project.mjs` to check current manifest references, unique IDs, category population and essential home-page references.

This reduces deployment contents, not existing Git history. Further savings would come from hosting large media externally. Video quality and current Showcase layouts were preserved.
