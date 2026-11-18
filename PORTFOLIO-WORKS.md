# Main portfolio category uploads

Add MP4, WebM or M4V files directly to the category folders in `public/Portfolio Works`:

- Motion & Visuals
- Talking Heads
- AI Ads
- Clipping
- 2D Animation

These folders sit beside the existing Showcase folders. Commit and push to publish; discovery happens during the build. Optional thumbnails: use the same filename stem plus `.poster.webp`, `.poster.jpg`, or `.poster.png`. Files sort by filename, numerically. The selector labels samples Example 1 onward within each category.

The existing main reels remain under Clipping and existing animations under 2D Animation until you add files to those folders. Once a category folder has videos, those uploads replace that category's fallback collection. Other categories are unaffected. To add categories later, edit `content/work-categories.json` and create its matching title folder.

The dropdown follows the category at the top of the selector as you scroll. Choosing a dropdown category scrolls the selector to it and plays its first video. Empty categories display Coming soon. Main Video Edits and 2D animation are now combined; client Showcase pages keep their current layouts.
