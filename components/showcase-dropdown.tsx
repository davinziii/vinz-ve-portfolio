"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import showcases from "../content/showcases.json";

export function ShowcaseDropdown({ onNavigate }: { onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);
  return <div className="showcase-dropdown" ref={root} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }} onKeyDown={event => {
    if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
  }}>
    <button ref={toggle} className="showcase-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>Showcase <ChevronDown size={16} /></button>
    {open && <div className="showcase-dropdown-links">
      {showcases.map(item => <a key={item.slug} href={'/showcase/' + item.slug} onClick={() => { setOpen(false); onNavigate?.(); }}>{item.title}</a>)}
    </div>}
  </div>;
}
