import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const project = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const items = JSON.parse(
  fs.readFileSync(project + "/content/projects.json", "utf8"),
);
let preserved = 0;
for (const item of items) {
  const media = project + "/public" + item.media;
  const data = JSON.parse(
    execFileSync("ffprobe", [
      "-v",
      "quiet",
      "-show_streams",
      "-of",
      "json",
      media,
    ]),
  );
  const video = data.streams.find((s) => s.width);
  if (video.width !== item.width || video.height !== item.height)
    throw Error("Resolution reduced: " + item.id);
  for (const file of [
    project + "/public" + item.poster,
    project + "/public/media/" + item.id + "-thumb.webp",
  ])
    if (!fs.existsSync(file)) throw Error("Missing image " + file);
  if (process.argv[2] && item.file.toLowerCase().endsWith(".mp4")) {
    const hash = (file) =>
      execFileSync(
        "ffmpeg",
        [
          "-v",
          "error",
          "-i",
          file,
          "-map",
          "0:v:0",
          "-c",
          "copy",
          "-f",
          "hash",
          "-hash",
          "sha256",
          "-",
        ],
        { encoding: "utf8" },
      ).trim();
    if (hash(path.join(process.argv[2], item.group, item.file)) !== hash(media))
      throw Error("Video stream changed: " + item.id);
    preserved++;
  }
}
console.log(
  "Verified " +
    items.length +
    " native-resolution assets, posters and thumbnails; " +
    preserved +
    " original MP4 video streams are bit-for-bit preserved.",
);
