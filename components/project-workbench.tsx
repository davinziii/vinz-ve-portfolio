"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Expand } from "lucide-react";
import { projects, category, type Project } from "../lib/projects";
import { ProjectMedia, pauseOtherVideos } from "./project-media";

export type WorkRequest = { id?: string; category?: string; key: number };

export function ProjectWorkbench({ request, sectionCategory, onExpand }: {
  request: WorkRequest | null;
  sectionCategory: string;
  onExpand: (project: Project) => void;
}) {
  const items = projects.filter(p => category(p) === sectionCategory);
  const [selectedId, setSelectedId] = useState(items[0].id);
  const [playRequest, setPlayRequest] = useState(0);
  const reduced = useReducedMotion();
  const strip = useRef<HTMLDivElement>(null);
  const selected = items.find(p => p.id === selectedId) ?? items[0];
  const index = items.indexOf(selected);

  function choose(project: Project) {
    pauseOtherVideos();
    setSelectedId(project.id);
    setPlayRequest(n => n + 1);
  }

  useEffect(() => {
    if (!request) return;
    const target = projects.find(p => p.id === request.id);
    if (target && category(target) === sectionCategory) {
      pauseOtherVideos();
      setSelectedId(target.id);
      setPlayRequest(n => n + 1);
    }
  }, [request, sectionCategory]);

  useEffect(() => {
    const row = strip.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    const parent = strip.current;
    if (!row || !parent) return;
    const box = row.getBoundingClientRect();
    const bounds = parent.getBoundingClientRect();
    if (box.top < bounds.top) parent.scrollTop -= bounds.top - box.top + 8;
    else if (box.bottom > bounds.bottom) parent.scrollTop += box.bottom - bounds.bottom + 8;
  }, [selected.id, reduced]);

  function step(direction: number) {
    choose(items[(index + direction + items.length) % items.length]);
  }

  return (
    <div className="screen-gallery" role="region" aria-label={sectionCategory + " player"}
      onKeyDown={event => {
        if ((event.target as HTMLElement).closest('video')) return;
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
          event.preventDefault();
          step(event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1);
        }
      }}>
      <div className="screen-layout">
        <button className="gallery-arrow" onClick={() => step(-1)} aria-label={"Previous " + sectionCategory}><ArrowLeft /></button>
        <div className="gallery-screen" data-selected-project={selected.id}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div className="gallery-video" key={selected.id}
              initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.16 }}>
              <ProjectMedia project={selected} playRequest={playRequest} />
            </motion.div>
          </AnimatePresence>
          <button className="gallery-expand" onClick={() => onExpand(selected)} aria-label={"Expand " + selected.title}><Expand size={19} /></button>
        </div>
        <button className="gallery-arrow" onClick={() => step(1)} aria-label={"Next " + sectionCategory}><ArrowRight /></button>
      </div>
      <div className="video-options-panel" ref={strip} role="group" aria-label={sectionCategory + " selection"}>
        {items.map(project => (
          <button key={project.id} aria-label={"Play " + project.title} aria-pressed={selected.id === project.id}
            className="video-option" onClick={() => choose(project)}>
            <img src={project.thumbnail} alt="" width="64" height="64" loading="lazy" />
            <span>{project.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
