import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const project = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const source = process.argv[2];
if (!source)
  throw Error(
    'Usage: node scripts/rebuild-media-quality.mjs "C:/path/to/Port"',
  );
const items = JSON.parse(
  fs.readFileSync(project + "/content/projects.json", "utf8"),
);
const results = [];
const manifestPath = project + "/content/media-quality.json";
const previous = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : null;
const force = process.argv.includes("--force");
const run = (args) =>
  execFileSync("ffmpeg", ["-y", "-v", "error", ...args], { maxBuffer: 20e6 });
const probe = (file) =>
  JSON.parse(
    execFileSync("ffprobe", [
      "-v",
      "quiet",
      "-show_streams",
      "-show_format",
      "-of",
      "json",
      file,
    ]),
  );
for (const item of items) {
  const original = item.group === "Clips"
    ? path.join(process.argv.find(arg => arg.startsWith("--clips="))?.slice(8) ?? path.join(source, "Clips"), item.file)
    : path.join(source, item.group, item.file),
    dest = project + "/public" + item.media,
    poster = project + "/public" + item.poster;
  if (!fs.existsSync(original)) throw Error("Missing original: " + item.file);
  const cached =
    previous?.revision === "native-v2" &&
    previous.projects.find(
      (p) => p.id === item.id && p.sourceHash === item.sha256,
    );
  if (
    !force &&
    cached &&
    [dest, poster, project + "/public/media/" + item.id + "-thumb.webp"].every(
      (p) => fs.existsSync(p),
    )
  ) {
    results.push(cached);
    console.log(item.id, "(native quality cached)");
    continue;
  }
  if (item.type === "image")
    run([
      "-i",
      original,
      "-frames:v",
      "1",
      "-c:v",
      "libwebp",
      "-lossless",
      "1",
      "-compression_level",
      "6",
      dest,
    ]);
  else {
    if (item.file.toLowerCase().endsWith(".mp4"))
      run([
        "-i",
        original,
        "-map",
        "0:v:0",
        "-map",
        "0:a?",
        "-c",
        "copy",
        "-movflags",
        "+faststart",
        dest,
      ]);
    else
      run([
        "-i",
        original,
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "16",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        "-an",
        dest,
      ]);
    run([
      "-ss",
      String(Math.min(1, (item.duration || 2) / 3)),
      "-i",
      original,
      "-frames:v",
      "1",
      "-c:v",
      "libwebp",
      "-lossless",
      "1",
      poster,
    ]);
  }
  run([
    "-i",
    poster,
    "-frames:v",
    "1",
    "-vf",
    "scale=480:480:force_original_aspect_ratio=decrease",
    "-c:v",
    "libwebp",
    "-quality",
    "90",
    project + "/public/media/" + item.id + "-thumb.webp",
  ]);
  const info = probe(dest),
    stream = info.streams.find((s) => s.width);
  if (stream.width !== item.width || stream.height !== item.height)
    throw Error("Resolution mismatch " + item.id);
  results.push({
    id: item.id,
    sourceHash: item.sha256,
    width: stream.width,
    height: stream.height,
    bytes: fs.statSync(dest).size,
    mode:
      item.type === "image"
        ? "native lossless WebP"
        : item.file.toLowerCase().endsWith(".mp4")
          ? "original video/audio bitstreams, fast-start remux"
          : "native resolution H.264 CRF 16",
  });
  console.log(item.id, stream.width + "x" + stream.height);
}
fs.writeFileSync(
  project + "/content/media-quality.json",
  JSON.stringify({ revision: "native-v2", projects: results }, null, 2),
);
console.log(
  "All " +
    results.length +
    " projects rebuilt from originals at native resolution.",
);
