import raw from "../content/projects.json";
type SourceProject = (typeof raw)[number];
const titles: Record<string, string> = {
  airpods: "AirPods product graphic",
  coffee2: "Coffee promotion",
  fuel1: "Fuel / Electric blue",
  fuel2: "Crush the limit",
  ps5: "Play without limits",
  realestate1: "Win more listings",
  redbull1: "Energy, amplified",
  redbull2: "Red Bull product study",
  serum1: "The Ordinary / Collection",
  serum2: "Skincare product graphic",
  spanish: "Spanish latte",
  marms3: "Marmot character animation",
  marms4: "An interview, animated",
  marms5: "The application",
  marms6: "A cast of characters",
  okd6: "Small character, big feeling",
  okd7: "A moment of expression",
  okd8: "Drawn to move",
  okd9: "A quiet afternoon",
  profile4: "Pixel personality",
};
export const projects = raw.map((p) => ({
  ...p,
  media: p.media + "?v=native-v2",
  poster: p.poster + "?v=native-v2",
  thumbnail: "/media/" + p.id + "-thumb.webp?v=native-v2",
  title:
    (p as SourceProject & { title?: string }).title ||
    titles[p.id] ||
    (p.id.startsWith("jrus") ? "JRUS / Edit " : "FOMO / Edit ") +
      p.id.slice(-1),
}));
export type Project = (typeof projects)[number];
export const categories = [
  "All work",
  "Video edits",
  "2D & motion",
  "Graphic design",
];
const order = [
  "reel-dvces-300",
  "reel-dvces-drillers",
  "reel-dvces-war",
  "reel-fomo",
  "reel-jrus",
  "redbull2",
  "marms4",
  "serum2",
  "okd9",
  "coffee2",
  "ps5",
];
projects.sort(
  (a, b) =>
    (order.includes(a.id) ? order.indexOf(a.id) : 99) -
    (order.includes(b.id) ? order.indexOf(b.id) : 99),
);
export const category = (p: { group: string }) =>
  p.group === "Graphic Designs"
    ? "Graphic design"
    : p.group === "2d Animations"
      ? "2D & motion"
      : "Video edits";

export function projectDescription(p: Project): string {
  if (p.group === "Graphic Designs")
    return "A graphic design from my collection. Open the full artwork to explore the composition and details.";
  if (p.group === "2d Animations")
    return "A short animation from my 2D & motion collection. Press play to watch the character and scene unfold.";
  if (p.group === "Clips")
    return "A video edit from my latest clips. Press play to watch the full sequence.";
  return (
    "A vertical video edit from the " +
    p.group +
    " collection. Press play to explore the pacing, captions and visual rhythm."
  );
}
export const chapterLinks = [
  ["top", "Introduction"],
  ["journey", "Creative journey"],
  ["work", "The collection"],
  ["approach", "The approach"],
  ["about", "About Vinz"],
  ["contact", "Let’s create"],
] as const;

export const workSections = [
  { id: "video-edits", title: "Video Edits", category: "Video edits" },
  { id: "motion", title: "2D & Motion", category: "2D & motion" },
  { id: "graphic-design", title: "Graphic Design", category: "Graphic design" },
] as const;
