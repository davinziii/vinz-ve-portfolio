"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronUp,
  Film,
  Layers,
  Menu,
  Moon,
  Sun,
  Palette,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import profile from "../content/profile.json";
import { projects, chapterLinks, workSections, category, type Project } from "../lib/projects";
import { ProjectMedia, ProjectDialog } from "../components/project-media";
import {
  ProjectWorkbench,
  type WorkRequest,
} from "../components/project-workbench";

const disciplines = [
  {
    title: "Video editing",
    subtitle: "Finding the rhythm.",
    description: "Cuts, captions, and pacing that bring a sequence together.",
    category: "Video edits",
    project: "jrus2",
    icon: Film,
  },
  {
    title: "2D animation",
    subtitle: "Giving ideas a personality.",
    description:
      "Characters, expressions, and the little movements that make them feel alive.",
    category: "2D & motion",
    project: "marms3",
    icon: Layers,
  },
  {
    title: "Motion graphics",
    subtitle: "Making the message move.",
    description:
      "A different way to tell a story through timing and animated visuals.",
    category: "2D & motion",
    project: "marms4",
    icon: Sparkles,
  },
  {
    title: "Graphic design",
    subtitle: "Making a frame count.",
    description:
      "Composition, color, and type working together to communicate an idea.",
    category: "Graphic design",
    project: "redbull2",
    icon: Palette,
  },
];
const approach = [
  [
    "Start with the message.",
    "What needs to be said? I look for the idea before deciding how it should look.",
  ],
  [
    "Find its rhythm.",
    "A cut, a pause, a shift in pace. Timing gives the story room to land.",
  ],
  [
    "Give it personality.",
    "The movement of a character. A choice of color. Details that make the work feel like itself.",
  ],
  [
    "Bring it all together.",
    "Refine the sequence, check the details, and make sure the final frame belongs to the same story.",
  ],
];

function ChapterLabel({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <p className="chapter-label">
      <span>{number}</span>
      {children}
    </p>
  );
}

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const [activeChapter, setActiveChapter] = useState("top");
  const [discipline, setDiscipline] = useState(0);
  const [menu, setMenu] = useState(false);
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    setTheme(
      document.documentElement.dataset.theme === "light" ? "light" : "dark",
    );
  }, []);
  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("vinz-theme", next);
    } catch {}
  }
  const [request, setRequest] = useState<WorkRequest | null>(null);
  const [expanded, setExpanded] = useState<Project | null>(null);
  const reduced = useReducedMotion();
  const heroProject = projects.find((project) => project.id === "marms3")!;
  const disciplineProject = projects.find(
    (project) => project.id === disciplines[discipline].project,
  )!;
  const pixelProject = projects.find((project) => project.id === "profile4")!;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      if (reduced) return;
      gsap.from(".intro-title > span > span", {
        yPercent: 110,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });
      gsap.from(".intro-film", {
        opacity: 0,
        y: 28,
        duration: 1,
        delay: 0.25,
        ease: "power3.out",
      });
      gsap.to(".story-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 28,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 92%", once: true },
        });
      });
      gsap.fromTo(
        ".journey-light",
        { y: -25 },
        {
          y: 35,
          ease: "none",
          scrollTrigger: {
            trigger: "#journey",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
      gsap.fromTo(
        ".approach-line-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".approach-steps",
            start: "top 65%",
            end: "bottom 65%",
            scrub: 0.5,
          },
        },
      );
    }, root);
    return () => context.revert();
  }, [reduced]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveChapter(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
    );
    document
      .querySelectorAll("[data-chapter]")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setDiscipline(
              Number((entry.target as HTMLElement).dataset.discipline),
            );
        });
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: 0 },
    );
    document
      .querySelectorAll("[data-discipline]")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  function explore(options: Omit<WorkRequest, "key">) {
    setRequest({ ...options, key: Date.now() });
    setActiveChapter("work");
    const target = options.id ? projects.find(p => p.id === options.id) : null;
    const section = workSections.find(s => s.category === (target ? category(target) : options.category));
    if (section) requestAnimationFrame(() => document.getElementById(section.id)?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" }));
  }

  return (
    <main ref={root}>
      <a className="skip-link" href="#work">
        Skip to projects
      </a>
      <div className="story-progress" aria-hidden="true" />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Vinz de Leon, home">
          <img
            src="/media/vinz-avatar.webp?v=native-v2"
            alt=""
            width="42"
            height="42"
          />
          <span>
            Vinz
            <br />
            de Leon
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#journey">The journey</a>
          <a href="#work">My work</a>
          <a href="#about">About me</a>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button theme-toggle"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <a className="header-contact" href={"mailto:" + profile.email}>
            Let’s talk <ArrowUpRight size={17} />
          </a>
          <button
            className="menu-toggle icon-button"
            onClick={() => setMenu(!menu)}
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            aria-controls="mobile-menu"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        {menu && (
          <nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Mobile navigation"
          >
            {chapterLinks.map(([id, label]) => (
              <a key={id} href={"#" + id} onClick={() => setMenu(false)}>
                {label}
                <ArrowUpRight size={18} />
              </a>
            ))}
          </nav>
        )}
      </header>

      <nav className="chapter-rail" aria-label="Story chapters">
        {chapterLinks.map(([id, label], index) => (
          <a
            href={"#" + id}
            key={id}
            aria-current={activeChapter === id ? "location" : undefined}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <section id="top" className="chapter introduction" data-chapter>
        <div className="section-width introduction-grid">
          <div className="intro-copy">
            <ChapterLabel number="01">The introduction</ChapterLabel>
            <h1 className="intro-title">
              <span>
                <span>Every frame</span>
              </span>
              <span>
                <span>
                  tells a <em>story.</em>
                </span>
              </span>
            </h1>
            <p className="intro-description">
              I’m Vinz. Video editor, animator,
              <br className="desktop-break" /> and graphic designer.
            </p>
            <p className="intro-detail">
              I turn ideas into visuals. This is a collection of the edits,
              characters, and designs I’ve made along the way.
            </p>
            <div className="intro-actions">
              <a className="button button-lime" href="#work">
                Explore my work <ArrowDown size={18} />
              </a>
              <a className="quiet-link" href="#journey">
                Meet the creative <ArrowRight size={17} />
              </a>
            </div>
          </div>
          <div className="intro-film">
            <div className="film-topline">
              <span>
                <Play size={14} fill="currentColor" /> A frame from my world
              </span>
              <span>2D & motion</span>
            </div>
            <div className="intro-screen">
              <ProjectMedia project={heroProject} priority />
            </div>
            <div className="film-caption">
              <span>{heroProject.title}</span>
              <a
                href="#work"
                onClick={() => explore({ id: heroProject.id })}
                aria-label={"Explore " + heroProject.title}
              >
                <ArrowUpRight size={22} />
              </a>
            </div>
            <div className="filmstrip" aria-hidden="true">
              {["jrus2", "redbull2", "okd9", "serum2", "fuel2", "marms4"].map(
                (id) => (
                  <img
                    key={id}
                    src={projects.find((p) => p.id === id)!.thumbnail}
                    alt=""
                    width="80"
                    height="50"
                    loading="lazy"
                  />
                ),
              )}
            </div>
          </div>
          <div className="intro-bottom">
            <a href="#journey">
              Scroll to begin <ArrowDown size={16} />
            </a>
            <span>Video. Animation. Design. All part of the story.</span>
          </div>
        </div>
      </section>

      <section id="journey" className="chapter journey-section" data-chapter>
        <div className="journey-light" aria-hidden="true" />
        <div className="section-width">
          <ChapterLabel number="02">The creative journey</ChapterLabel>
          <div className="section-heading" data-reveal>
            <h2>
              Different tools.
              <br />
              The same curiosity.
            </h2>
            <p>
              Some ideas need a sharp cut.
              <br />
              Others need a little movement.
            </p>
          </div>
          <div className="journey-grid">
            <div className="discipline-preview">
              <div className="discipline-art">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={disciplineProject.id}
                    src={disciplineProject.poster}
                    alt={disciplineProject.title}
                    width="600"
                    height="600"
                    loading="lazy"
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.2 }}
                  />
                </AnimatePresence>
                <span className="discipline-art-label">
                  {disciplines[discipline].title}
                </span>
              </div>
              <a
                className="quiet-link"
                href="#work"
                onClick={() =>
                  explore({ category: disciplines[discipline].category })
                }
              >
                Explore this discipline <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="disciplines">
              {disciplines.map((item, index) => (
                <button
                  className={
                    "discipline" + (discipline === index ? " active" : "")
                  }
                  data-discipline={index}
                  key={item.title}
                  aria-pressed={discipline === index}
                  onClick={() => setDiscipline(index)}
                >
                  <span className="discipline-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="discipline-body">
                    <item.icon size={21} />
                    <strong>{item.title}</strong>
                    <span>{item.subtitle}</span>
                    <p>{item.description}</p>
                  </span>
                  <ArrowUpRight className="discipline-arrow" size={22} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="chapter work-section" data-chapter>
        <div id="playground" className="section-width">
          <ChapterLabel number="03">The project showcase</ChapterLabel>
          <div className="section-heading" data-reveal>
            <h2>Take a closer look.</h2>
            <p>
              Pick a project. Press play.
              <br />
              Stay for the details.
            </p>
          </div>
          <nav className="work-section-links" aria-label="Portfolio disciplines">
            {workSections.map(section => <a key={section.id} href={"#" + section.id}>{section.title}<ArrowDown size={16} /></a>)}
          </nav>
          {workSections.map(section => (
            <section key={section.id} id={section.id} className="discipline-collection" aria-labelledby={section.id + "-title"}>
              <h3 id={section.id + "-title"} className="collection-title">{section.title}</h3>
              <ProjectWorkbench sectionCategory={section.category} request={request} onExpand={setExpanded} />
            </section>
          ))}
        </div>
      </section>

      <section id="approach" className="chapter approach-section" data-chapter>
        <div className="section-width">
          <ChapterLabel number="04">Behind the creativity</ChapterLabel>
          <div className="approach-layout">
            <div className="approach-heading" data-reveal>
              <h2>
                Before the cut,
                <br />
                there’s an <em>idea.</em>
              </h2>
              <p>
                The software is only part of it. The real work is finding a
                visual direction that makes the message feel right.
              </p>
              <div className="approach-film" aria-hidden="true">
                {["jrus2", "marms3", "redbull2"].map((id) => (
                  <img
                    key={id}
                    src={projects.find((p) => p.id === id)!.poster}
                    alt=""
                    loading="lazy"
                    width="110"
                    height="140"
                  />
                ))}
              </div>
            </div>
            <div className="approach-steps">
              <div className="approach-line" aria-hidden="true">
                <div className="approach-line-fill" />
              </div>
              {approach.map(([title, description], index) => (
                <article className="approach-step" key={title} data-reveal>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="chapter about-section" data-chapter>
        <div className="section-width">
          <ChapterLabel number="05">About me</ChapterLabel>
          <div className="about-grid">
            <div className="about-card-stack" data-reveal>
              <div className="portrait-card">
                <img
                  src="/media/vinz-portrait.webp?v=native-v2"
                  alt="Vinz de Leon"
                  width="1122"
                  height="1402"
                  loading="lazy"
                />
                <span>Vinz de Leon</span>
              </div>
              <div className="about-art pixel-card">
                <img
                  src={pixelProject.poster}
                  alt="Vinz’s pixel-art character"
                  width="600"
                  height="500"
                  loading="lazy"
                />
                <button onClick={() => setExpanded(pixelProject)}>
                  A little experiment <Play size={16} />
                </button>
              </div>
            </div>
            <div className="about-copy" data-reveal>
              <h2>
                A person behind
                <br />
                the pixels.
              </h2>
              <p>
                I’m Vinz, a video editor and graphic designer. My work includes
                short-form video editing, character animation, motion graphics,
                and graphic design.
              </p>
              <p>
                I enjoy creating work with personality, whether that’s a
                well-timed cut, an expressive animated character, or a graphic
                that communicates an idea.
              </p>
              <a className="quiet-link" href={"mailto:" + profile.email}>
                Say hello <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="chapter contact-section" data-chapter>
        <div className="section-width">
          <ChapterLabel number="06">Let’s create something</ChapterLabel>
          <div className="closing-content" data-reveal>
            <p>You’ve seen a little of my world.</p>
            <a className="closing-title" href={"mailto:" + profile.email}>
              <h2>
                Let’s make
                <br />
                something <em>move.</em>
              </h2>
              <ArrowUpRight />
            </a>
            <p>
              Have an idea, a rough cut, or a project in mind?
              <br />
              I’d love to hear about it.
            </p>
            <a className="email-button" href={"mailto:" + profile.email}>
              {profile.email}
              <ArrowUpRight size={21} />
            </a>
          </div>
          <div className="footer-bottom">
            <a className="footer-signature" href="#top">
              Vinz de Leon
            </a>
            <span>Video editing · Animation · Design</span>
            <a href="#top">
              Back to the beginning <ChevronUp size={17} />
            </a>
          </div>
        </div>
      </footer>
      {expanded && (
        <ProjectDialog
          key={expanded.id}
          project={expanded}
          onClose={() => setExpanded(null)}
        />
      )}
    </main>
  );
}
