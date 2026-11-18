"use client";
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Expand } from 'lucide-react';
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
 const scroller=useRef<HTMLDivElement>(null);
 const sections=useRef(new Map<string,HTMLElement>());
 const reduced=useReducedMotion();
 function choose(p:Project){pauseOtherVideos();setSelected(p);setPlay(n=>n+1);}
 function jump(id:string,playFirst=true){
  const c=categories.find(c=>c.id===id);const el=sections.current.get(id);const root=scroller.current;
  setActive(id);
  if(el&&root) root.scrollTo({top:root.scrollTop+el.getBoundingClientRect().top-root.getBoundingClientRect().top-12,behavior:reduced?'instant':'smooth'});
  if(playFirst){if(c?.items[0])choose(c.items[0]);else{pauseOtherVideos();setSelected(null);}}
 }
 useEffect(()=>{
  if(!request)return;
  const c=categories.find(c=>c.items.some(p=>p.id===request.id)) ?? (request.category==='2D & motion'?categories.find(c=>c.id==='2d-animation'):undefined);
  if(c){jump(c.id,false);const p=c.items.find(p=>p.id===request.id)??c.items[0];if(p)choose(p);}
 },[request]);
 function syncCategory(){const root=scroller.current;if(!root)return;const top=root.getBoundingClientRect().top+18;let current=categories[0].id;for(const c of categories){const el=sections.current.get(c.id);if(el&&el.getBoundingClientRect().top<=top)current=c.id;}if(root.scrollTop+root.clientHeight>=root.scrollHeight-3)current=categories.at(-1)!.id;setActive(current);}
 const all=categories.flatMap(c=>c.items);
 function step(n:number){if(!all.length)return;const index=all.findIndex(p=>p.id===selected?.id);const p=all[(index+n+all.length)%all.length];const c=categories.find(c=>c.items.some(item=>item.id===p.id))!;jump(c.id,false);choose(p);}
 return <div className="categorized-work">
  <div className="category-preview">
   <div className="category-toolbar"><select aria-label="Video category" value={active} onChange={e=>jump(e.target.value)}>{categories.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
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
     {p.thumbnail?<img src={p.thumbnail} alt="" loading="lazy" width="90" height="90"/>:<video src={p.media+'#t=0.1'} preload="metadata" muted playsInline aria-hidden="true"/>}<span>Example {i+1}</span>
    </button>)}</div>:<p className="category-no-samples">Coming soon</p>}
   </section>)}
  </div>
 </div>;
}
