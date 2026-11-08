'use client';
import {useEffect,useRef,useState} from 'react';
import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {ArrowUpRight,ArrowDown,Play,Plus,X,Volume2,Menu,ArrowRight} from 'lucide-react';
import gsap from 'gsap';import {ScrollTrigger} from 'gsap/ScrollTrigger';
import raw from '../content/projects.json';import profile from '../content/profile.json';
type Project=typeof raw[number];
const titles:Record<string,string>={airpods:'AirPods product graphic',coffee2:'Coffee promotion',fuel1:'Fuel / Electric blue',fuel2:'Crush the limit',ps5:'Play without limits',realestate1:'Win more listings',redbull1:'Energy, amplified',redbull2:'Red Bull product study',serum1:'The Ordinary / Collection',serum2:'Skincare product graphic',spanish:'Spanish latte',marms3:'Marmot character animation',marms4:'An interview, animated',marms5:'The application',marms6:'A cast of characters',okd6:'Small character, big feeling',okd7:'A moment of expression',okd8:'Drawn to move',okd9:'A quiet afternoon',profile4:'Pixel personality'};
const projects=raw.map(p=>({...p,title:(p as Project & {title?:string}).title||titles[p.id]||(p.id.startsWith('jrus')?'JRUS / Edit ':'FOMO / Edit ')+p.id.slice(-1)}));type Item=typeof projects[number];
const categories=['All work','Video edits','2D & motion','Graphic design'];
const order=['redbull2','jrus1','marms4','serum2','fomo3','okd9','coffee2','ps5'];projects.sort((a,b)=>(order.includes(a.id)?order.indexOf(a.id):99)-(order.includes(b.id)?order.indexOf(b.id):99));
const category=(p:Project)=>p.group==='Graphic Designs'?'Graphic design':p.group==='2d Animations'?'2D & motion':'Video edits';
let activePreview:HTMLVideoElement|null=null;
function stopPreview(){activePreview?.pause();activePreview=null;}
function Preview({p,hero=false}:{p:Item;hero?:boolean}){const ref=useRef<HTMLVideoElement>(null);const [failed,setFailed]=useState(false);useEffect(()=>{const el=ref.current;if(!el)return;const observer=new IntersectionObserver(([e])=>{if(!e.isIntersecting)el.pause();});observer.observe(el);return()=>observer.disconnect()},[]);const play=()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!window.matchMedia('(hover:hover)').matches)return;stopPreview();if(ref.current){activePreview=ref.current;ref.current.play().catch(()=>{});}};return <div className={'media '+(hero?'hero-media':'')} onPointerEnter={play} onPointerLeave={()=>ref.current?.pause()} onFocus={play} onBlur={()=>ref.current?.pause()}>{p.type==='video'&&!failed?<video ref={ref} src={p.media} poster={p.poster} muted loop playsInline preload="none" onError={()=>setFailed(true)}/>:<img src={p.poster} alt={p.title} loading={hero?'eager':'lazy'} width={p.width} height={p.height}/>}<span className="media-type">{p.type==='video'?<Play size={12} fill="currentColor"/>:<Plus size={14}/>} {p.type==='video'?'Play project':'View design'}</span></div>}
function Card({p,index,onOpen}:{p:Item;index:number;onOpen:(p:Item)=>void}){const reduced=useReducedMotion();return <motion.button layout={!reduced} className={'project-card '+(p.height>p.width?'portrait':'square')} onClick={()=>onOpen(p)} initial={reduced?false:{opacity:0}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:.97}} transition={{duration:reduced?0:.3,delay:reduced?0:Math.min(index*.035,.2)}} aria-label={'Open '+p.title}><Preview p={p}/><div className="card-info"><span><small>{category(p)}</small><h3>{p.title}</h3></span><ArrowUpRight size={21}/></div></motion.button>}
function ProjectModal({p,onClose}:{p:Item;onClose:()=>void}){const dialog=useRef<HTMLDialogElement>(null);const reduced=useReducedMotion();useEffect(()=>{stopPreview();const previous=document.activeElement as HTMLElement;const el=dialog.current;el?.showModal();document.body.style.overflow='hidden';return()=>{document.body.style.overflow='';previous?.focus()}},[]);return <dialog ref={dialog} className="project-dialog" aria-labelledby="project-title" onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target===dialog.current)onClose()}}><motion.div className="dialog-body" initial={{opacity:0,y:reduced?0:30}} animate={{opacity:1,y:0}}><button className="close" onClick={onClose} aria-label="Close project"><X/></button><div className="dialog-media">{p.type==='video'?<video src={p.media} poster={p.poster} controls playsInline preload="metadata" aria-label={p.title}/>:<img src={p.media} alt={p.title}/>}</div><div className="dialog-info"><div><p className="project-category">{category(p)}</p><h2 id="project-title">{p.title}</h2></div><p>{p.width} × {p.height}{p.duration?' · '+p.duration.toFixed(1)+' sec':''}<br/>{p.group} collection</p></div>{p.type==='video'&&<p className="caption-note"><Volume2 size={14}/> Use the player controls to turn on sound.</p>}</motion.div></dialog>}
export default function Home() {
  const root = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState('All work');
  const [collection, setCollection] = useState('Both collections');
  const [selected, setSelected] = useState<Item | null>(null);
  const [menu, setMenu] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const reduced = useReducedMotion();
  const hero = projects.find(p => p.id === 'marms4')!;
  const featured = ['redbull2', 'jrus2', 'marms3'].map(id => projects.find(p => p.id === id)!);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.from('.hero-line > span', {yPercent: 110, duration: .9, stagger: .12, ease: 'power3.out'});
      gsap.from('.portrait-wrap', {opacity: 0, y: 25, duration: 1, delay: .15, ease: 'power3.out'});
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
        gsap.from(el, {opacity: 0, y: 24, duration: .65, ease: 'power2.out', scrollTrigger: {trigger: el, start: 'top 94%', once: true}});
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    const pause = () => { if (document.hidden) stopPreview(); };
    document.addEventListener('visibilitychange', pause);
    return () => document.removeEventListener('visibilitychange', pause);
  }, []);

  const visible = projects.filter(p => (filter === 'All work' || category(p) === filter) &&
    (filter !== 'Video edits' || collection === 'Both collections' || p.group === collection));
  const display = showAll ? visible : visible.slice(0, 8);

  function magnetic(e: React.PointerEvent<HTMLAnchorElement>) {
    if (reduced || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.1}px)`;
  }

  return <main ref={root}>
    <a className="skip" href="#work">Skip to work</a>
    <header className="nav">
      <a href="#top" className="wordmark" aria-label="Vinz de Leon, home">
        <img src="/media/vinz-avatar.webp" alt="" width="52" height="52"/>
        <span>Vinz<br/>de Leon</span>
      </a>
      <nav className={menu ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
        {[['Work', 'work'], ['About', 'about']].map(([label, id]) => <a key={id} href={'#'+id} onClick={() => setMenu(false)}>{label}</a>)}
        <a href={'mailto:'+profile.email} className="nav-contact" onClick={() => setMenu(false)}>Let’s talk <ArrowUpRight size={19}/></a>
      </nav>
      <button className="menu-toggle" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="mobile-menu" aria-label="Toggle navigation">{menu ? <X/> : <Menu/>}</button>
      {menu && <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">
        <a href="#work" onClick={() => setMenu(false)}>Work</a><a href="#about" onClick={() => setMenu(false)}>About</a><a href={'mailto:'+profile.email}>Let’s talk <ArrowUpRight/></a>
      </nav>}
    </header>

    <section id="top" className="hero page-width">
      <div className="hero-copy">
        <p className="hello">Hi, I’m Vinz.</p>
        <h1><span className="hero-line"><span>Video editor</span></span><span className="hero-line"><span>& designer<span className="lime-period">.</span></span></span></h1>
        <p className="hero-description">I edit videos, animate characters, and make graphics. Here’s some of what I’ve been working on.</p>
        <div className="hero-actions">
          <a className="primary-button magnetic" href="#work" onPointerMove={magnetic} onPointerLeave={e => e.currentTarget.style.transform=''}>See my work <ArrowDown size={20}/></a>
          <button className="watch-button" onClick={() => setSelected(hero)}><span><Play size={15} fill="currentColor"/></span>Watch an animation</button>
        </div>
      </div>
      <div className="portrait-wrap">
        <img className="hero-portrait" src="/media/vinz-portrait.webp" alt="Vinz de Leon in a casual black T-shirt" width="900" height="1125" fetchPriority="high"/>
        <div className="portrait-note"><span>Vinz de Leon</span><ArrowUpRight size={23}/></div>
      </div>
      <a href="#work" className="hero-scroll">Scroll for the good stuff <ArrowDown size={18}/></a>
    </section>

    <div className="marquee" aria-label="Video editing, 2D animation, graphic design"><div aria-hidden="true">{[0,1].map(n => <span key={n}>Video editing <b>+</b> 2D animation <b>+</b> Graphic design <b>+</b> Motion graphics <b>+</b> </span>)}</div></div>

    <section id="work" className="selected section-pad">
      <div className="section-inner">
        <div className="section-heading" data-reveal><div><h2>A few favorites.</h2><p>A little editing, a little animation, a little design.</p></div><a className="text-link" href="#playground">All projects <ArrowUpRight size={21}/></a></div>
        <div className="featured-grid">{featured.map((p,i) => <div className={'feature feature-'+i} key={p.id} data-reveal><Card p={p} index={i} onOpen={setSelected}/></div>)}</div>
      </div>
    </section>

    <section id="playground" className="playground section-pad">
      <div className="section-inner">
        <div className="section-heading" data-reveal><h2>The work.</h2><p>Pick a category. Find something you like.</p></div>
        <div className="filter-bar" role="group" aria-label="Filter work">{categories.map(c => <button key={c} className={filter === c ? 'active' : ''} aria-pressed={filter === c} onClick={() => {stopPreview(); setFilter(c); setShowAll(false);}}>{c}<span>{c === 'All work' ? projects.length : projects.filter(p => category(p) === c).length}</span></button>)}</div>
        {filter === 'Video edits' && <div className="collection-filter" role="group" aria-label="Video collection">{['Both collections', 'Reel 1', 'Reel 2'].map(c => <button key={c} aria-pressed={collection === c} onClick={() => {stopPreview(); setCollection(c);}}>{c}</button>)}</div>}
        <motion.div layout className="gallery"><AnimatePresence mode="popLayout">{display.map((p,i) => <Card p={p} index={i} onOpen={setSelected} key={p.id}/>)}</AnimatePresence></motion.div>
        <p className="gallery-status" aria-live="polite">{display.length} of {visible.length} projects</p>
        {visible.length > 8 && <button className="outline-button" onClick={() => setShowAll(!showAll)}>{showAll ? 'Show less' : 'More work'} <Plus size={20}/></button>}
      </div>
    </section>

    <section id="about" className="about section-pad">
      <div className="section-inner about-grid">
        <div className="about-visual" data-reveal><img src="/media/profile4.webp" alt="A pixel-art character animation by Vinz" loading="lazy" width="600" height="500"/><button onClick={() => setSelected(projects.find(p => p.id === 'profile4')!)}>One of my little experiments <Play size={16}/></button></div>
        <div className="about-copy" data-reveal><h2>A bit about me.</h2><p>{profile.about}</p><p>{profile.philosophy}</p><a href={'mailto:'+profile.email} className="text-link">Say hello <ArrowUpRight size={21}/></a></div>
      </div>
    </section>

    <section className="toolkit section-pad">
      <div className="section-inner toolkit-grid"><div data-reveal><h2>What I can<br/>help with.</h2><p>From the first cut to the final frame.</p></div><div className="skills">{profile.capabilities.slice(0,4).map(s => <div className="skill" key={s} data-reveal><h3>{s}</h3><ArrowUpRight size={24}/></div>)}</div></div>
    </section>

    <footer id="contact" className="contact section-pad">
      <div className="section-inner"><p className="contact-intro">Got something in mind?</p><a className="contact-headline" href={'mailto:'+profile.email}><h2>Let’s work<br/>on it together.</h2><ArrowUpRight/></a>
        <a className="email-link magnetic" href={'mailto:'+profile.email} onPointerMove={magnetic} onPointerLeave={e => e.currentTarget.style.transform=''}>{profile.email}<ArrowUpRight size={23}/></a>
        <div className="contact-bottom"><a href="#top" className="footer-name">Vinz de Leon</a><span>Video, animation & design</span><a href="#top">Back to top <ArrowUpRight size={17}/></a></div>
      </div>
    </footer>
    {selected && <ProjectModal key={selected.id} p={selected} onClose={() => setSelected(null)}/>}
  </main>;
}
