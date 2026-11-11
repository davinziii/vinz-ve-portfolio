"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Moon, Sun } from "lucide-react";
import { ShowcaseDropdown } from "./showcase-dropdown";
import { ProjectWorkbench } from "./project-workbench";
import { GraphicCarousel } from "./graphic-carousel";
import { ProjectDialog } from "./project-media";
import type { Project } from "../lib/projects";
import profile from "../content/profile.json";

export function ShowcasePage({ title, category, items }: { title: string; category: string; items: Project[] }) {
  const [expanded, setExpanded] = useState<Project | null>(null);
  const [theme, setTheme] = useState('dark');
  useEffect(() => { setTheme(document.documentElement.dataset.theme ?? 'dark'); }, []);
  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next); document.documentElement.dataset.theme = next;
    try { localStorage.setItem('vinz-theme', next); } catch {}
  }
  return <main className="showcase-page">
    <a href="#examples" className="skip-link">Skip to examples</a>
    <header className="site-header showcase-header">
      <a className="wordmark" href="/" aria-label="Vinz de Leon, home"><img src="/media/vinz-avatar.webp" alt="" width="42" height="42" /><span>Vinz<br />de Leon</span></a>
      <nav aria-label="Main navigation"><ShowcaseDropdown /></nav>
      <button className="icon-button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</button>
    </header>
    <section id="examples" className="section-width showcase-content">
      <a className="quiet-link" href="/#work"><ArrowLeft size={17} /> Back to portfolio</a>
      <h1>{title}</h1>
      {items.length === 0 ? <div className="showcase-empty"><p>Examples coming soon.</p><a className="quiet-link" href={'mailto:' + profile.email}>Ask about a project <ArrowUpRight size={17} /></a></div> : category === 'Graphic design' ? <GraphicCarousel collection={items} request={null} onExpand={setExpanded} /> : <ProjectWorkbench collection={items} sectionCategory={category} request={null} onExpand={setExpanded} />}
      <a className="quiet-link showcase-contact" href={'mailto:' + profile.email}>Let’s work together <ArrowUpRight size={17} /></a>
    </section>
    {expanded && <ProjectDialog key={expanded.id} project={expanded} onClose={() => setExpanded(null)} />}
  </main>;
}
