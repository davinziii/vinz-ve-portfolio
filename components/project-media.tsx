"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, RotateCcw, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { Project } from "../lib/projects";
import { category } from "../lib/projects";
import { connectVideoAudio, muteForAutoplay } from "../lib/video-volume";

export function pauseOtherVideos(current?: HTMLVideoElement) {
  document.querySelectorAll("video").forEach((video) => {
    if (video !== current) video.pause();
  });
}

export function ProjectMedia({
  project,
  priority = false,
  playRequest = 0,
}: {
  project: Project;
  priority?: boolean;
  playRequest?: number;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!video.current) return;
    return connectVideoAudio(video.current);
  }, [project.id, attempt, failed]);
  useEffect(() => {
    const player = video.current;
    if (!player) return;
    let pendingStart = playRequest > 0;
    const start = () => {
      player.play().catch((error: DOMException) => {
        if (error.name === "NotAllowedError") {
          muteForAutoplay(player);
          player.play().catch(() => {});
        }
      });
    };
    const headerHeight =
      document.querySelector(".site-header")?.getBoundingClientRect().height ??
      0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) player.pause();
        else if (pendingStart) {
          pendingStart = false;
          start();
        }
      },
      { rootMargin: `-${headerHeight}px 0px 0px 0px`, threshold: 0.01 },
    );
    const visibility = () => {
      if (document.hidden) player.pause();
    };
    observer.observe(player);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      player.pause();
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [project.id, attempt, failed, playRequest]);

  if (imageFailed)
    return (
      <div className="media-unavailable" role="status">
        <AlertCircle />
        <p>Preview unavailable</p>
        <span>{project.title}</span>
      </div>
    );

  return (
    <div className="project-media">
      {project.type === "video" && !failed ? (
        <video
          key={attempt}
          ref={video}
          src={project.media}
          poster={project.poster || undefined}
          controls
          playsInline
          preload="metadata"
          aria-label={project.title}
          onPlay={() => pauseOtherVideos(video.current ?? undefined)}
          onError={() => setFailed(true)}
        />
      ) : (
        <img
          src={project.type === "image" ? project.media : project.poster}
          alt={project.title}
          width={project.width || undefined}
          height={project.height || undefined}
          loading={priority ? "eager" : "lazy"}
          onError={() => setImageFailed(true)}
        />
      )}
      {failed && (
        <div className="media-error" role="status">
          <span>The video couldn’t load.</span>
          <button
            onClick={() => {
              setFailed(false);
              setAttempt((n) => n + 1);
            }}
          >
            <RotateCcw size={15} /> Try again
          </button>
        </div>
      )}
    </div>
  );
}

export function ProjectDialog({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    pauseOtherVideos();
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = oldOverflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      className="project-dialog"
      aria-labelledby="expanded-project-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
    >
      <motion.div
        className="dialog-body"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.2 }}
      >
        <div className="dialog-heading">
          <div>
            <p>{category(project)}</p>
            <h2 id="expanded-project-title">{project.title}</h2>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close project"
          >
            <X />
          </button>
        </div>
        <ProjectMedia project={project} priority playRequest={1} />
        <p className="dialog-caption">
          {project.width > 0 && project.height > 0 ? `${project.width} × ${project.height}` : ""}
          {project.duration
            ? " · " + project.duration.toFixed(1) + " seconds"
            : ""}{" "}
          · {project.group}
        </p>
      </motion.div>
    </dialog>
  );
}
