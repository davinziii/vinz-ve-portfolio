"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { projects, category, type Project } from "../lib/projects";
import type { WorkRequest } from "./project-workbench";

const defaultArtwork = projects.filter(p => category(p) === "Graphic design");

export function GraphicCarousel({ request, onExpand, collection }: {
  collection?: Project[];
  request: WorkRequest | null;
  onExpand: (project: Project) => void;
}) {
  const artwork = collection ?? defaultArtwork;
  const [current, setCurrent] = useState(0);
  const reduced = useReducedMotion();
  const touchX = useRef<number | null>(null);
  const step = (direction: number) => setCurrent(i => (i + direction + artwork.length) % artwork.length);

  useEffect(() => {
    if (!request?.id) return;
    const index = artwork.findIndex(p => p.id === request.id);
    if (index !== -1) setCurrent(index);
  }, [request]);

  return (
    <div className="art-carousel" role="region" aria-roledescription="carousel" aria-label="Graphic designs"
      onKeyDown={event => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          step(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}>
      <div className="art-deck"
        onTouchStart={event => { touchX.current = event.touches[0].clientX; }}
        onTouchEnd={event => {
          if (touchX.current === null) return;
          const distance = event.changedTouches[0].clientX - touchX.current;
          if (Math.abs(distance) > 45) step(distance > 0 ? -1 : 1);
          touchX.current = null;
        }}>
        {artwork.map((project, index) => {
          let offset = (index - current + artwork.length) % artwork.length;
          if (offset > artwork.length / 2) offset -= artwork.length;
          const distance = Math.abs(offset);
          const visible = distance <= 2;
          return (
            <motion.button key={project.id} className="art-card" data-offset={offset}
              aria-label={(offset === 0 ? "Expand " : "Show ") + project.title}
              aria-hidden={!visible} tabIndex={offset === 0 ? 0 : -1}
              style={{ zIndex: artwork.length - distance, pointerEvents: visible ? "auto" : "none" }}
              initial={false}
              animate={{ x: `${offset * 66}%`, scale: distance === 0 ? 1 : distance === 1 ? 0.78 : 0.58,
                rotateY: offset === 0 ? 0 : offset > 0 ? -18 : 18,
                opacity: visible ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => offset === 0 ? onExpand(project) : setCurrent(index)}>
              <img src={project.media} alt={project.title} width={project.width || undefined} height={project.height || undefined} loading="lazy" draggable={false} />
            </motion.button>
          );
        })}
      </div>
      <div className="art-controls">
        <button className="gallery-arrow" onClick={() => step(-1)} aria-label="Previous graphic design"><ArrowLeft /></button>
        <p aria-live="polite" aria-atomic="true">{artwork[current].title}</p>
        <button className="gallery-arrow" onClick={() => step(1)} aria-label="Next graphic design"><ArrowRight /></button>
      </div>
    </div>
  );
}
