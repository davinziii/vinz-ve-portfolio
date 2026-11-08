# Story-driven redesign

## Audit

The existing application was a single client homepage containing project label mapping, a mixed-media gallery, category/reel filters, hover playback, a native media dialog, About and contact. Source data contains 30 items: 10 MP4 edits in Reel 1/Reel 2, nine GIF-derived animations represented by MP4s, and 11 graphics. Their WebP posters, media paths, dimensions, duration metadata and exact source hashes remain unchanged. Existing titles were extracted into lib/projects.ts without renaming any projects. Dependencies and local Manrope fonts are reused.

The live URL named in this request is the Vercel site, not the older private Sites preview. Canonical metadata now uses that Vercel origin. The older hosting manifest is retained and not used to redirect this redesign to another site.

## Experience

1. Introduction: “Every frame tells a story,” actual character-animation video, direct identity and scroll invitation.
2. Creative journey: a sticky visual and four discipline rows. Scrolling/clicking changes the visual; the active discipline can open its collection.
3. Project showcase: left preview/right independently scrolling selector on desktop; preview then horizontal selector on smaller screens. All 30 works are available. Filters preserve All Work, Video Edits, 2D & Motion and Graphic Design, with reel subfilters retained.
4. Behind the creativity: a connected sequence about message, rhythm, personality and refinement.
5. About: a centered image/text group using the existing pixel-art project and grounded personal copy.
6. Contact: a closing invitation and the unchanged vinzdeleon.work@gmail.com address.

The desktop workspace height responds to available screen height. Its overall height remains stable while projects change. Media crossfades do not reload the page. The selected row is kept visible by scrolling only the selector. Selection is also exposed with aria-pressed. Native buttons support keyboard use; arrow keys/Home/End browse the selector. Native dialog handles focus trapping, Escape and focus return. Playback never starts automatically and one video plays at a time.

## Verification

- Production build and TypeScript passed during implementation; final build is run before delivery.
- All 30 project buttons were clicked in browser and matched the correct selected ID and visible video/image.
- Filter counts: All Work 30, Video Edits 10, 2D & Motion 9, Graphic Design 11. Reel 2 returned five projects.
- Arrow/Home/End selection, previous/next controls, animation playback, full-artwork rendering, expanded dialog, Escape and mobile chapter menu were exercised.
- At 320px, 390px, 768px and 1280px widths there was no document horizontal overflow. At phone/tablet sizes the preview comes first and the selector scrolls horizontally; at desktop the preview is on the left and both panels align at the top.
- The 1280 × 720 workspace contracts to 540px panel height; at 1280 × 900 it has 680px panels.
- Runtime browser error/warning log was empty when inspected.
- Original project JSON and media are checked against the initial inventory; no supplied asset is edited or removed.

Reduced-motion behavior is implemented in CSS and both animation systems; OS preference emulation was not part of browser verification. No automated accessibility audit or real-device benchmark is claimed. Native player controls support sound; source captions remain a content gap.

## Follow-up: media quality, panel swap, personal cards and themes

The current desktop layout supersedes the original orientation above: selector LEFT, larger preview RIGHT. Full native-resolution assets replace the prior 540px video/1200px graphic exports. All 30 output dimensions and thumbnails were verified; ten MP4 video streams match their source packet hashes exactly. User-selected videos autoplay, with a muted fallback if sound playback is blocked. Phone selection scrolls the player into view. Vinz’s photo fans behind the pixel-art card. Dark/light mode is persisted and restored before paint. Both themes and 320/390/768/1440px layouts were browser-checked with no horizontal overflow. Native playback was observed at 1080×1920; a graphic loaded at 4000×4000; theme choice survived reload.
