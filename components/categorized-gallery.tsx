"use client";
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Expand, ChevronDown, Check, Play } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import type { Project } from '../lib/projects';
import type { WorkRequest } from './project-workbench';
import { ProjectMedia, pauseOtherVideos } from './project-media';
export type WorkCategory = { id: string; title: string; items: Project[] };
export function CategorizedGallery({ categories, request, onExpand }: {categories:WorkCategory[];request:WorkRequest|null;onExpand:(p:Project)=>void}) {
 const first=categories[0];
 const [active,setActive]=useState(categories[0].id);
 const [selected,setSelected]=useState<Project|null>(first.items[0]??null);
 const [play,setPlay]=useState(0);
 const [open,setOpen]=useState(false);
 const menu=useRef<HTMLDivElement>(null);
 const trigger=useRef<HTMLButtonElement>(null);
 const scrollingTo=useRef<string|null>(null);
 const settle=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>{const close=(e:PointerEvent)=>{if(!menu.current?.contains(e.target as Node))setOpen(false);};document.addEventListener('pointerdown',close);return()=>{document.removeEventListener('pointerdown',close);if(settle.current)clearTimeout(settle.current);};},[]);
 const scroller=useRef<HTMLDivElement>(null);
 const sections=useRef(new Map<string,HTMLElement>());
 const reduced=useReducedMotion();
 function choose(p:Project){pauseOtherVideos();setSelected(p);setPlay(n=>n+1);}
 function jump(id:string,playFirst=true){
  const c=categories.find(c=>c.id===id);const el=sections.current.get(id);const root=scroller.current;
  setActive(id);setOpen(false);scrollingTo.current=id;
  if(settle.current)clearTimeout(settle.current);settle.current=setTimeout(()=>{scrollingTo.current=null;},900);
  if(el&&root) root.scrollTo({top:root.scrollTop+el.getBoundingClientRect().top-root.getBoundingClientRect().top-12,behavior:reduced?'instant':'smooth'});
  if(playFirst){if(c?.items[0])choose(c.items[0]);else{pauseOtherVideos();setSelected(null);}}
 }
 useEffect(()=>{
  if(!request)return;
  const legacyCategory=request.category==='2D & motion'||/^(marms|okd|profile)/.test(request.id??'')?'2d-animation':/fomo|jrus/.test(request.id??'')?'motion-visuals':/iman/.test(request.id??'')?'talking-heads':request.category==='Video edits'?'clipping':undefined;
  const c=categories.find(c=>c.items.some(p=>p.id===request.id)) ?? categories.find(c=>c.id===legacyCategory);
  if(c){jump(c.id,false);const p=c.items.find(p=>p.id===request.id)??c.items[0];if(p)choose(p);}
 },[request]);
 function syncCategory(){if(scrollingTo.current){if(settle.current)clearTimeout(settle.current);settle.current=setTimeout(()=>{scrollingTo.current=null;},150);return;}const root=scroller.current;if(!root)return;const top=root.getBoundingClientRect().top+18;let current=categories[0].id;for(const c of categories){const el=sections.current.get(c.id);if(el&&el.getBoundingClientRect().top<=top)current=c.id;}if(root.scrollTop+root.clientHeight>=root.scrollHeight-3)current=categories.at(-1)!.id;setActive(current);}
 const all=categories.flatMap(c=>c.items);
 function step(n:number){if(!all.length)return;const index=all.findIndex(p=>p.id===selected?.id);const p=all[(index+n+all.length)%all.length];const c=categories.find(c=>c.items.some(item=>item.id===p.id))!;jump(c.id,false);choose(p);}
 return <div className="categorized-work">
  <div className="category-preview">
   <div className="category-toolbar">
    <div className="category-menu" ref={menu} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}} onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);trigger.current?.focus();}if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const buttons=[...e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')];if(!open){setOpen(true);requestAnimationFrame(()=>menu.current?.querySelector<HTMLButtonElement>('[role="menuitemradio"]')?.focus());}else{const i=buttons.indexOf(document.activeElement as HTMLButtonElement);buttons[(i+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length]?.focus();}}}}>
     <button ref={trigger} className="category-trigger" aria-label="Video category" aria-haspopup="menu" aria-expanded={open} onClick={()=>setOpen(!open)}>{categories.find(c=>c.id===active)?.title}<ChevronDown size={18} className={open?'is-open':''}/></button>
     {open&&<div className="category-menu-options" role="menu" aria-label="Choose a video category">{categories.map(c=><button key={c.id} role="menuitemradio" aria-checked={active===c.id} onClick={()=>{jump(c.id);trigger.current?.focus();}}><span>{c.title}</span>{active===c.id&&<Check size={17}/>}</button>)}</div>}
    </div>
   </div>
   <div className="screen-layout">
    <button className="gallery-arrow" aria-label="Previous video" onClick={()=>step(-1)} disabled={!all.length}><ArrowLeft/></button>
    <div className="gallery-screen" data-selected-project={selected?.id}>
     {selected?<div className="gallery-video" key={selected.id}><ProjectMedia project={selected} playRequest={play}/></div>:<div className="category-empty-preview">Examples coming soon.</div>}
     {selected&&<button className="gallery-expand" aria-label={'Expand '+selected.title} onClick={()=>onExpand(selected)}><Expand size={19}/></button>}
    </div>
    <button className="gallery-arrow" aria-label="Next video" onClick={()=>step(1)} disabled={!all.length}><ArrowRight/></button>
   </div>
  </div>
  <div className="category-selector" ref={scroller} onScroll={syncCategory} aria-label="Video categories and samples">
   {categories.map(c=><section key={c.id} ref={node=>{if(node)sections.current.set(c.id,node);else sections.current.delete(c.id);}} className="sample-category" aria-labelledby={'category-'+c.id}>
    <h4 id={'category-'+c.id}>{c.title}</h4>
    {c.items.length?<div className="sample-grid">{c.items.map((p,i)=><button key={p.id} aria-label={'Play '+c.title+' example '+(i+1)} aria-pressed={selected?.id===p.id} onClick={()=>choose(p)}>
     {p.thumbnail?<img src={p.thumbnail} alt="" loading="lazy" width="90" height="90"/>:<video src={p.media+'#t=0.1'} preload="metadata" muted playsInline aria-hidden="true"/>}<span>Example {i+1}</span><i className="sample-play" aria-hidden="true"><Play size={12} fill="currentColor"/></i>
    </button>)}</div>:<p className="category-no-samples">Coming soon</p>}
   </section>)}
  </div>
 </div>;
}
