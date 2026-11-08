import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const project = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const source = process.argv[2];
if (!source)
  throw Error('Usage: node scripts/optimize-media.mjs "C:/path/to/Port"');
const root = path.resolve(source);
if (root === project || root.startsWith(project + path.sep))
  throw Error("Source must be outside the website project.");
const previous = JSON.parse(
  fs.readFileSync(project + "/content/projects.json", "utf8"),
);
const seen = new Map(),
  inventory = [],
  projects = [];
function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const source = path.join(dir, entry.name);
    if (
      source === project ||
      ["portfolio-website", "node_modules", ".git", "out"].includes(entry.name)
    )
      continue;
    if (entry.isDirectory()) {
      scan(source);
      continue;
    }
    if (!/\.(mp4|mov|webm|gif|png|jpe?g|webp)$/i.test(entry.name)) continue;
    const sha256 = crypto
      .createHash("sha256")
      .update(fs.readFileSync(source))
      .digest("hex");
    const probe = JSON.parse(
      execFileSync("ffprobe", [
        "-v",
        "quiet",
        "-show_streams",
        "-show_format",
        "-of",
        "json",
        source,
      ]),
    );
    const stream = probe.streams.find((s) => s.width),
      group = path.relative(root, source).split(path.sep)[0];
    const old = previous.find(
      (p) => p.file === entry.name && p.group === group,
    );
    let id =
      old?.id ||
      path
        .parse(entry.name)
        .name.toLowerCase()
        .replace(/[^a-z0-9-]/g, "-");
    if (projects.some((p) => p.id === id)) id += "-" + sha256.slice(0, 6);
    const type = /\.(mp4|mov|webm|gif)$/i.test(source) ? "video" : "image";
    const item = {
      ...old,
      id,
      file: entry.name,
      group,
      bytes: fs.statSync(source).size,
      width: stream.width,
      height: stream.height,
      duration: Number(probe.format.duration) || null,
      type,
      sha256,
      poster: "/media/" + id + ".webp",
      media: "/media/" + id + (type === "video" ? ".mp4" : ".webp"),
    };
    inventory.push({ ...item, source, duplicateOf: seen.get(sha256) || null });
    if (seen.has(sha256)) continue;
    seen.set(sha256, id);
    projects.push(item);
  }
}
scan(root);
fs.writeFileSync(
  project + "/asset-inventory.json",
  JSON.stringify(inventory, null, 2),
);
fs.writeFileSync(
  project + "/content/projects.json",
  JSON.stringify(projects, null, 2),
);
execFileSync(
  process.execPath,
  [project + "/scripts/rebuild-media-quality.mjs", root],
  { stdio: "inherit" },
);
console.log(
  `${projects.length} unique projects; ${inventory.length - projects.length} duplicates. Originals unchanged.`,
);
