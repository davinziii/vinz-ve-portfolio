import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import showcases from "../content/showcases.json";
import type { Project } from "./projects";

export { showcases };
export async function getShowcaseProjects(slug: string): Promise<Project[]> {
  const showcase = showcases.find(s => s.slug === slug);
  if (!showcase) return [];
  const directory = path.join(process.cwd(), "public", showcase.title);
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const graphics = showcase.category === "Graphic design";
  const extensions = graphics ? /\.(png|jpe?g|webp|avif|gif)$/i : /\.(mp4|webm|m4v)$/i;
  const files = entries.filter(e => e.isFile() && extensions.test(e.name) && !e.name.toLowerCase().includes('.poster.'))
    .map(e => e.name).sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  return Promise.all(files.map(async file => {
    const filePath = path.join(directory, file);
    const stat = await fs.stat(filePath);
    const stem = file.slice(0, -path.extname(file).length);
    const posterName = entries.find(e => e.isFile() && e.name.startsWith(stem + '.poster.') && /\.(png|jpe?g|webp)$/i.test(e.name))?.name;
    const url = (name: string) => '/' + encodeURIComponent(showcase.title) + '/' + encodeURIComponent(name);
    const version = `${stat.size}-${Math.trunc(stat.mtimeMs)}`;
    const media = url(file) + '?v=' + version;
    const poster = graphics ? media : posterName ? url(posterName) + '?v=' + version : '';
    return {
      id: 'showcase-' + slug + '-' + createHash('sha256').update(file).digest('hex').slice(0, 16),
      title: stem.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim(), file, group: graphics ? 'Graphic Designs' : showcase.category === '2D & motion' ? '2d Animations' : showcase.title,
      type: graphics ? 'image' : 'video', width: 0, height: 0, duration: null,
      bytes: stat.size, sha256: '', media, poster, thumbnail: poster,
    } as Project;
  }));
}
