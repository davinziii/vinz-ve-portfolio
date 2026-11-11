import { notFound } from "next/navigation";
import { showcases, getShowcaseProjects } from "../../../lib/showcases";
import { ShowcasePage } from "../../../components/showcase-page";

export function generateStaticParams() { return showcases.map(({ slug }) => ({ slug })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const showcase = showcases.find(s => s.slug === slug);
  return { title: showcase ? `${showcase.title} — Vinz de Leon` : 'Showcase', description: 'Selected examples by Vinz de Leon.', robots: { index: false, follow: true } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const showcase = showcases.find(s => s.slug === slug);
  if (!showcase) notFound();
  return <ShowcasePage title={showcase.title} category={showcase.category} items={await getShowcaseProjects(slug)} />;
}
