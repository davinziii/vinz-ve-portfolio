# Showcase uploads

Each page reads only its matching folder under `public` during `npm run build`:

| Folder | Client link |
| --- | --- |
| Showcase Video Edit 1 | /showcase/video-edit-1 |
| Showcase Video Edit 2 | /showcase/video-edit-2 |
| Showcase Video Edit 3 | /showcase/video-edit-3 |
| Showcase Video Edit 4 | /showcase/video-edit-4 |
| Showcase Video Edit 5 | /showcase/video-edit-5 |
| Showcase 2d Animation | /showcase/2d-animation |
| Showcase Graphic Design | /showcase/graphic-design |

Drop MP4 (recommended H.264/AAC), WebM, or M4V files directly into the video/animation folders. Graphic Design supports JPG, PNG, WebP, AVIF and GIF. No code edits or manifest updates are needed. Nested folders are not scanned. Files keep their original quality; the website does not transcode them. Browser support depends on the codec inside the file.

File names become titles. Files are sorted alphabetically/numerically; use names like `01 - Product launch.mp4` to control order. To supply a video thumbnail, add `01 - Product launch.poster.jpg` (or .png/.webp). Poster files are excluded from the project list. Without a poster, the option shows a muted video-frame preview. Empty collections show “Examples coming soon” and never borrow media from other collections.

Commit and push the media to deploy through Vercel. Adding files on your PC alone cannot update the deployed site. GitHub's per-file limits still apply; large videos are better hosted separately. The seven links are public, shareable pages (not password-protected); noindex discourages search indexing but does not restrict access.

## Suggested future workflow without Git uploads

Connect a Cloudinary account once, upload in its Media Library, and tag each collection. A live asset-list integration can load the matching tagged images/videos when a client opens a page. This avoids rebuilding the site for every upload. This integration is not enabled yet; the current pages use the folders above. Keep API secrets server-side; do not put them in public folders or client-side code.

References: https://cloudinary.com/documentation/media_library_for_developers and https://cloudinary.com/documentation/list_assets
