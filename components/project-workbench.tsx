"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Expand,
  Film,
  Image as ImageIcon,
  Play,
} from "lucide-react";
import {
  projects,
  categories,
  category,
  projectDescription,
  type Project,
} from "../lib/projects";
import { ProjectMedia, pauseOtherVideos } from "./project-media";

export type WorkRequest = { id?: string; category?: string; key: number };

export function ProjectWorkbench({
  request,
  onExpand,
}: {
  request: WorkRequest | null;
  onExpand: (project: Project) => void;
}) {
  const [filter, setFilter] = useState("All work");
  const [collection, setCollection] = useState("Both collections");
  const [selectedId, setSelectedId] = useState("jrus1");
  const list = useRef<HTMLUListElement>(null);
  const rows = useRef(new Map<string, HTMLButtonElement>());
  const reduced = useReducedMotion();

  const filtered = useMemo(
    () =>
      projects.filter(
        (project) =>
          (filter === "All work" || category(project) === filter) &&
          (filter !== "Video edits" ||
            collection === "Both collections" ||
            project.group === collection),
      ),
    [filter, collection],
  );
  const selected =
    filtered.find((project) => project.id === selectedId) ?? filtered[0];
  const selectedIndex = filtered.findIndex(
    (project) => project.id === selected.id,
  );

  useEffect(() => {
    if (!request) return;
    pauseOtherVideos();
    setCollection("Both collections");
    if (request.id) {
      setFilter("All work");
      setSelectedId(request.id);
    } else if (request.category) {
      setFilter(request.category);
      setSelectedId(
        projects.find(
          (p) =>
            request.category === "All work" || category(p) === request.category,
        )!.id,
      );
    }
    list.current?.scrollTo({ top: 0, left: 0 });
  }, [request]);

  useEffect(() => {
    const row = rows.current.get(selected.id),
      scroller = list.current;
    if (!row || !scroller) return;
    const box = row.getBoundingClientRect(),
      bounds = scroller.getBoundingClientRect();
    if (scroller.scrollWidth > scroller.clientWidth + 2) {
      if (box.left < bounds.left)
        scroller.scrollLeft -= bounds.left - box.left + 12;
      if (box.right > bounds.right)
        scroller.scrollLeft += box.right - bounds.right + 12;
    } else {
      if (box.top < bounds.top) scroller.scrollTop -= bounds.top - box.top + 10;
      if (box.bottom > bounds.bottom)
        scroller.scrollTop += box.bottom - bounds.bottom + 10;
    }
  }, [selected.id, filter, collection]);
  function choose(project: Project, focus = false) {
    if (project.id !== selected.id) pauseOtherVideos();
    setSelectedId(project.id);
    if (focus) {
      const row = rows.current.get(project.id);
      row?.focus({ preventScroll: true });
      const scroller = list.current;
      if (row && scroller) {
        const box = row.getBoundingClientRect(),
          bounds = scroller.getBoundingClientRect();
        const horizontal = scroller.scrollWidth > scroller.clientWidth + 2;
        if (horizontal) {
          if (box.left < bounds.left)
            scroller.scrollLeft -= bounds.left - box.left + 12;
          if (box.right > bounds.right)
            scroller.scrollLeft += box.right - bounds.right + 12;
        } else {
          if (box.top < bounds.top)
            scroller.scrollTop -= bounds.top - box.top + 10;
          if (box.bottom > bounds.bottom)
            scroller.scrollTop += box.bottom - bounds.bottom + 10;
        }
      }
    }
  }

  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight")
      next = Math.min(index + 1, filtered.length - 1);
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft")
      next = Math.max(index - 1, 0);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = filtered.length - 1;
    else return;
    event.preventDefault();
    choose(filtered[next], true);
  }

  function changeFilter(next: string) {
    pauseOtherVideos();
    setFilter(next);
    setCollection("Both collections");
    if (next !== "All work" && category(selected) !== next)
      setSelectedId(projects.find((p) => category(p) === next)!.id);
    list.current?.scrollTo({ top: 0, left: 0 });
  }

  function changeCollection(next: string) {
    pauseOtherVideos();
    setCollection(next);
    if (next !== "Both collections" && selected.group !== next)
      setSelectedId(projects.find((p) => p.group === next)!.id);
    list.current?.scrollTo({ top: 0, left: 0 });
  }

  return (
    <div className="workbench" data-workbench>
      <div className="workbench-bar">
        <span>
          <Film size={17} /> The collection
        </span>
        <span>{projects.length} projects · Video / Animation / Design</span>
      </div>
      <div className="workbench-panels">
        <div className="preview-panel" data-selected-project={selected.id}>
          <div className="preview-toolbar">
            <span>
              <i /> Project preview
            </span>
            <button
              className="icon-button"
              onClick={() => onExpand(selected)}
              aria-label={"Expand " + selected.title}
            >
              <Expand size={18} />
            </button>
          </div>
          <div className="preview-stage">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                className="preview-switch"
                key={selected.id}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.15 }}
              >
                <ProjectMedia project={selected} priority />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="preview-info" aria-live="polite" aria-atomic="true">
            <p className="project-category">
              {category(selected)}{" "}
              <span>
                {selected.duration
                  ? selected.duration.toFixed(1) + " sec"
                  : "Still image"}
              </span>
            </p>
            <h3>{selected.title}</h3>
            <p className="project-description">
              {projectDescription(selected)}
            </p>
          </div>
          <div className="preview-navigation">
            <span>
              {String(selectedIndex + 1).padStart(2, "0")}{" "}
              <span>/ {String(filtered.length).padStart(2, "0")}</span>
            </span>
            <div>
              <button
                className="icon-button"
                onClick={() => choose(filtered[selectedIndex - 1])}
                disabled={selectedIndex === 0}
                aria-label="Previous project"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                className="icon-button"
                onClick={() => choose(filtered[selectedIndex + 1])}
                disabled={selectedIndex === filtered.length - 1}
                aria-label="Next project"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
        <aside className="selector-panel" aria-label="Project selector">
          <div className="selector-heading">
            <h3>Find your frame.</h3>
            <span aria-live="polite">{filtered.length} projects</span>
          </div>
          <div
            className="project-filters"
            role="group"
            aria-label="Filter projects"
          >
            {categories.map((item) => (
              <button
                key={item}
                aria-pressed={filter === item}
                onClick={() => changeFilter(item)}
              >
                {item === "All work"
                  ? "All Work"
                  : item === "Video edits"
                    ? "Video Edits"
                    : item === "2D & motion"
                      ? "2D & Motion"
                      : "Graphic Design"}
              </button>
            ))}
          </div>
          {filter === "Video edits" && (
            <div
              className="reel-filters"
              role="group"
              aria-label="Video collection"
            >
              {["Both collections", "Reel 1", "Reel 2"].map((item) => (
                <button
                  key={item}
                  aria-pressed={collection === item}
                  onClick={() => changeCollection(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
          <ul className="selector-items" ref={list} aria-label="Projects">
            {filtered.map((project, index) => (
              <li key={project.id}>
                <button
                  ref={(node) => {
                    if (node) rows.current.set(project.id, node);
                    else rows.current.delete(project.id);
                  }}
                  className={
                    "project-option" +
                    (selected.id === project.id ? " is-selected" : "")
                  }
                  data-project-id={project.id}
                  aria-label={"Select " + project.title}
                  aria-pressed={selected.id === project.id}
                  tabIndex={selected.id === project.id ? 0 : -1}
                  onClick={() => choose(project)}
                  onKeyDown={(event) => keyboard(event, index)}
                >
                  <span className="option-thumbnail">
                    <img
                      src={project.poster}
                      alt=""
                      width="64"
                      height="64"
                      loading="lazy"
                    />
                    {project.type === "video" ? (
                      <Play size={12} fill="currentColor" />
                    ) : (
                      <ImageIcon size={13} />
                    )}
                  </span>
                  <span className="option-copy">
                    <strong>{project.title}</strong>
                    <span>{category(project)}</span>
                  </span>
                  {selected.id === project.id ? (
                    <Check className="selected-check" size={17} />
                  ) : (
                    <span className="option-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <p className="selector-hint">
            Choose a project. Use arrow keys to explore.
          </p>
        </aside>
      </div>
    </div>
  );
}
