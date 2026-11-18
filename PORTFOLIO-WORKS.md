# Main portfolio works

Upload originals into the category folders under `public/Portfolio Works`. These originals stay on your computer and are ignored by Git. Run:

    node scripts/prepare-portfolio-media.mjs

Then commit `public/portfolio-media`, `content/portfolio-media.json`, and any category configuration changes. Push to publish. No old fallback collections are used.

The preparation script accepts MP4, WebM, M4V, MOV and GIF, creates poster thumbnails, and converts GIFs to controllable MP4. H.264 videos below 100 MB are remuxed without recompression; oversized or incompatible sources use H.264 CRF 18 at native dimensions. Originals remain untouched. The script rejects generated outputs above 100 MB. Existing prepared entries are cached by source size and modification time.

Categories are defined in `content/work-categories.json`. Add a matching source folder for future categories. Files sort numerically by filename and display as Example 1 onward within each category. Empty category folders produce empty categories. Removing a source and rerunning the script removes its gallery entry; unused generated media can then be removed separately.

Client Showcase pages and folders keep their separate upload workflow in SHOWCASE.md.
