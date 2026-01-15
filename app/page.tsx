"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; 

import MatrixRain from "@/components/MatrixRain";
import TopNav from "@/components/TopNav";

import { translations, Lang } from "@/lib/data"; 
import { getAllPosts, getPostsByTag, getSectionContent } from "@/lib/actions"; 

// --- TYPES ---
type Post = { id: string; title: string; images: string; createdAt: Date | string; tag?: string; language?: string; content?: string; };
type SectionData = { contentEn: string; contentVi: string; contentJp: string; };
type BoxItem = { label: string; value: string; };
type SectionBox = { id: string; title: string; items: BoxItem[]; };
type HeroData = { fullName: string; nickName1: string; nickName2: string; avatarUrl: string; greeting: string; description: string; typewriter: string; };
type ConfigData = { resumeUrl: string; isOpenForWork: boolean; };
type Translation = typeof translations.en;

// --- HACKER LOGS DATA ---
const SYSTEM_LOGS = [
    "INITIALIZING_CONNECTION...",
    "BYPASSING_FIREWALL_LAYER_1...",
    "BYPASSING_FIREWALL_LAYER_2...",
    "INJECTING_PAYLOAD...",
    "DECRYPTING_USER_DATA...",
    "ACCESSING_MAINFRAME...",
    "FETCHING_PROJECT_REPOSITORIES...",
    "ESTABLISHING_SECURE_TUNNEL...",
    "SYSTEM_BREACH_DETECTED...",
    "IGNORING_WARNINGS...",
    "ROOT_ACCESS_GRANTED."
];

// --- NO DATA COMPONENT ---
const NoDataDisplay = ({ section }: { section: string }) => (
    <div className="w-full border border-dashed border-[#333] p-6 bg-[#111] text-center flex flex-col items-center justify-center gap-2">
        <span className="text-3xl">🚫</span>
        <h4 className="text-gray-500 font-bold uppercase tracking-widest text-sm">[SYSTEM_ERROR]: NO_DATA_FOUND</h4>
        <p className="text-gray-600 text-xs font-mono">Target: {section.toUpperCase()} table is empty.</p>
        <div className="mt-2 text-[10px] text-[#00ff41] border border-[#00ff41] px-2 py-1 bg-[#00ff41]/10 cursor-not-allowed">
            &lt;Please_Update_In_Admin /&gt;
        </div>
    </div>
);

export default function Home() {
  const [currentLang, setCurrentLang] = useState<Lang>("en");
  
  // Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [showAccessGranted, setShowAccessGranted] = useState(false);

  // Data States
  const [dbUniProjects, setDbUniProjects] = useState<Post[]>([]);
  const [dbPersonalProjects, setDbPersonalProjects] = useState<Post[]>([]);
  const [dbItEvents, setDbItEvents] = useState<Post[]>([]);
  const [dbLangCerts, setDbLangCerts] = useState<Post[]>([]);
  const [dbTechCerts, setDbTechCerts] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [dbAchievements, setDbAchievements] = useState<Post[]>([]);

  // Dynamic Content State
  const [dynamicSections, setDynamicSections] = useState<Record<string, SectionData>>({});
  const [globalConfig, setGlobalConfig] = useState<ConfigData | null>(null);

  // --- FILTER STATES ---
  const [projLang, setProjLang] = useState<string>("ALL");
  const [projSort, setProjSort] = useState<"newest" | "oldest">("newest");

  const typeWriterRef = useRef<HTMLSpanElement>(null);
  const t: Translation = translations[currentLang]; 
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // --- EFFECTS ---
  useEffect(() => {
    // 1. Fetch Data
    const savedLang = localStorage.getItem("sakura_lang") as Lang;
    if (savedLang && ['en', 'vi', 'jp'].includes(savedLang)) setCurrentLang(savedLang);

    getPostsByTag("uni_projects").then(data => setDbUniProjects(data as unknown as Post[]));
    getPostsByTag("personal_projects").then(data => setDbPersonalProjects(data as unknown as Post[]));
    getPostsByTag("it_events").then(data => setDbItEvents(data as unknown as Post[]));
    getPostsByTag("lang_certs").then(data => setDbLangCerts(data as unknown as Post[]));
    getPostsByTag("tech_certs").then(data => setDbTechCerts(data as unknown as Post[]));
    getPostsByTag("achievements").then(data => setDbAchievements(data as unknown as Post[]));
    getAllPosts().then((posts) => { if (posts && posts.length > 0) setLatestPosts(posts.slice(0, 3) as unknown as Post[]); });

    Promise.all([
        getSectionContent("about"), getSectionContent("career"), getSectionContent("skills"),
        getSectionContent("profile"), getSectionContent("experience"), getSectionContent("contact"),
        getSectionContent("hero"), getSectionContent("global_config")
    ]).then(([about, career, skills, profile, experience, contact, hero, config]) => {
        const sections: Record<string, SectionData> = {};
        if (about) sections.about = about as unknown as SectionData;
        if (career) sections.career = career as unknown as SectionData;
        if (skills) sections.skills = skills as unknown as SectionData;
        if (profile) sections.profile = profile as unknown as SectionData;
        if (experience) sections.experience = experience as unknown as SectionData;
        if (contact) sections.contact = contact as unknown as SectionData;
        if (hero) sections.hero = hero as unknown as SectionData; 
        setDynamicSections(sections);
        if (config) { try { setGlobalConfig(JSON.parse((config as unknown as SectionData).contentEn)); } catch { console.log("Config error"); } }
    });

    // 2. Hacker Loading Logic
    let logIndex = 0;
    const interval = setInterval(() => {
        if (logIndex < SYSTEM_LOGS.length) {
            setLogs(prev => [...prev, SYSTEM_LOGS[logIndex]]);
            logIndex++;
            // Auto scroll to bottom
            if (logsContainerRef.current) {
                logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
            }
        } else {
            clearInterval(interval);
            setShowAccessGranted(true);
            setTimeout(() => setIsLoading(false), 1500); // Wait 1.5s after Access Granted
        }
    }, 250); // Speed of logs

    return () => clearInterval(interval);
  }, []);

  // Helpers
  const getSectionText = (key: string) => {
    const data = dynamicSections[key]; if (!data) return null;
    const content = currentLang==='en'?data.contentEn : (currentLang==='vi'?data.contentVi : data.contentJp);
    return content || null;
  };

  const getSectionBoxes = (key: string): SectionBox[] | null => {
    const data = dynamicSections[key]; if (!data) return null;
    const jsonStr = currentLang==='en'?data.contentEn : (currentLang==='vi'?data.contentVi : data.contentJp);
    if (!jsonStr || jsonStr==="[]") return null;
    try { return JSON.parse(jsonStr); } catch { return null; }
  };

  const getCurrentHero = (): HeroData => {
      const data = dynamicSections['hero'];
      const defaultData = { 
          fullName: "Vũ Trí Dũng", nickName1: "David Miller", nickName2: "Akina Aoi - 明菜青い", avatarUrl: "/pictures/VuTriDung.jpg",
          greeting: t.hero_greeting, description: t.hero_desc, typewriter: '[]' 
      };
      if (!data) return defaultData;
      const jsonStr = currentLang==='en'?data.contentEn : (currentLang==='vi'?data.contentVi : data.contentJp);
      if (!jsonStr) return defaultData;
      try { return { ...defaultData, ...JSON.parse(jsonStr) }; } catch { return defaultData; }
  };

  const hero = getCurrentHero();

  // Typewriter effect for Hero
  useEffect(() => {
    let phraseIndex = 0; let charIndex = 0; let isDeleting = false; let timeoutId: NodeJS.Timeout;
    let phrases = t.typewriter_texts; 
    try { const dbPhrases = JSON.parse(hero.typewriter); if(dbPhrases.length > 0) phrases = dbPhrases; } catch { /* */ }

    const type = () => {
        const currentPhrase = phrases[phraseIndex % phrases.length];
        const displayedText = currentPhrase.substring(0, charIndex + (isDeleting ? -1 : 1));
        if (typeWriterRef.current) typeWriterRef.current.textContent = displayedText;
        if (isDeleting) charIndex--; else charIndex++;
        let typeSpeed = isDeleting ? 50 : 100;
        if (!isDeleting && charIndex === currentPhrase.length) { isDeleting = true; typeSpeed = 2000; }
        else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex++; typeSpeed = 500; }
        timeoutId = setTimeout(type, typeSpeed);
    };
    if (!isLoading) type();
    return () => clearTimeout(timeoutId);
  }, [currentLang, hero.typewriter, t, isLoading]);

  const scrollCarousel = (id: string, direction: number) => { const container = document.getElementById(id); if (container) container.scrollBy({ left: direction * 300, behavior: 'smooth' }); };
  const getCoverImage = (jsonString: string) => { try { const arr = JSON.parse(jsonString); return arr.length > 0 ? arr[0] : "https://placehold.co/300x200/000/00ff41?text=No+Image"; } catch { return "https://placehold.co/300x200/000/00ff41?text=Error"; } };

  // Dữ liệu
  const profileBoxes = getSectionBoxes("profile");
  const experienceBoxes = getSectionBoxes("experience");
  const contactBoxes = getSectionBoxes("contact");
  
  const aboutText = getSectionText("about");
  const careerText = getSectionText("career");
  const skillsText = getSectionText("skills");

  // --- FILTER FUNCTION ---
  const filterProjects = (projects: Post[]) => {
      let res = [...projects];
      if (projLang !== "ALL") {
          res = res.filter(p => p.language?.toLowerCase() === projLang.toLowerCase());
      }
      res.sort((a, b) => {
          const tA = new Date(a.createdAt).getTime();
          const tB = new Date(b.createdAt).getTime();
          return projSort === "newest" ? tB - tA : tA - tB;
      });
      return res;
  };

  return (
    <main>
        <MatrixRain />
        <TopNav t={t} currentLang={currentLang} setCurrentLang={setCurrentLang} resumeUrl={globalConfig?.resumeUrl} />

        {/* --- HACKER LOADING SCREEN --- */}
        {isLoading ? (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: '#050505', zIndex: 9999,
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                fontFamily: "'VT323', monospace", padding: '20px'
            }}>
                <div className="scanline"></div>
                <div style={{width: '100%', maxWidth: '600px', border: '1px solid #00ff41', padding: '20px', backgroundColor: 'rgba(0, 20, 0, 0.9)', boxShadow: '0 0 20px rgba(0, 255, 65, 0.2)'}}>
                    
                    {/* Header Terminal */}
                    <div style={{borderBottom: '1px solid #00ff41', marginBottom: '10px', paddingBottom: '5px', display: 'flex', justifyContent: 'space-between', color: '#00ff41', fontSize: '18px'}}>
                        <span>root@system:~# ./init_portfolio.sh</span>
                        <span>v2.0.26</span>
                    </div>

                    {/* Logs Container */}
                    <div ref={logsContainerRef} style={{height: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px', color: '#00ff41', fontSize: '20px'}}>
                        {logs.map((log, index) => (
                            <div key={index} style={{opacity: 0.8}}>
                                <span style={{color: '#008f11', marginRight: '10px'}}>[{new Date().toLocaleTimeString()}]</span>
                                {`> ${log}`}
                            </div>
                        ))}
                        {!showAccessGranted && <div style={{color: '#00ff41'}}>&gt; <span className="cursor-blink"></span></div>}
                    </div>

                    {/* Access Granted Flash */}
                    {showAccessGranted && (
                        <div style={{
                            marginTop: '20px', borderTop: '1px dashed #00ff41', paddingTop: '15px', 
                            textAlign: 'center', fontSize: '40px', fontWeight: 'bold', 
                            color: '#00ff41', textShadow: '0 0 10px #00ff41'
                        }} className="glitch-text">
                            ACCESS GRANTED
                        </div>
                    )}
                </div>
            </div>
        ) : (
            <>
                <section id="home" className="hero">
                    <div className="hero-text">
                        <h3>{hero.greeting}</h3>
                        <h1><span className="highlight">{hero.fullName}</span></h1>
                        <div className="alt-names">
                            <p><span className="sub-label">{t.lbl_en_name}</span> <span className="sub-value">{hero.nickName1}</span></p>
                            <p><span className="sub-label">{t.lbl_jp_name}</span> <span className="sub-value">{hero.nickName2}</span></p>
                        </div>
                        {globalConfig?.isOpenForWork && (
                            <div className="mb-4 inline-flex items-center gap-2 border border-[#00ff41] px-3 py-1 rounded-full bg-[#00ff41]/10">
                                <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse"></span>
                                <span className="text-xs text-[#00ff41] font-bold uppercase tracking-wider">
                                    {currentLang === 'vi' ? 'ĐANG TÌM VIỆC' : (currentLang === 'jp' ? '求職中' : 'OPEN FOR WORK')}
                                </span>
                            </div>
                        )}
                        <p><span>{t.hero_iam}</span> <span ref={typeWriterRef} className="typewriter"></span></p>
                        <p className="description">{hero.description}</p>
                        <div className="btn-group">
                            <a href="#projects" className="btn btn-primary">{t.btn_view_project}</a>
                            <a href="#contact" className="btn">{t.btn_contact}</a>
                        </div>
                    </div>
                    <div className="hero-img-large">
                        <Image src={hero.avatarUrl || "/pictures/VuTriDung.jpg"} alt={hero.fullName} width={350} height={350} className="object-cover border-4 border-[#00ff41] shadow-[0_0_20px_#00ff41]" />
                    </div>
                </section>

                {/* 01. ABOUT */}
                <section id="about" className="content-section">
                    <h2>{t.sec_about}</h2>
                    {aboutText ? <p style={{whiteSpace: 'pre-line'}}>{aboutText}</p> : <NoDataDisplay section="ABOUT ME" />}
                </section>
                
                {/* 02. PROFILE */}
                <section id="profile" className="content-section">
                    <h2>{t.sec_profile}</h2>
                    {profileBoxes && profileBoxes.length > 0 ? (
                        <div className="profile-container">{profileBoxes.map((box) => (<div key={box.id} className="profile-box"><h3>{box.title}</h3><ul className="profile-list">{box.items.map((item, idx) => (<li key={idx}><span className="label">{item.label}</span><span className="value">{item.value}</span></li>))}</ul></div>))}</div>
                    ) : <NoDataDisplay section="PROFILE" />}
                </section>

                {/* 03. CERTIFICATES */}
                <section id="certificates" className="content-section"><h2>{t.sec_cert}</h2><h3 className="carousel-title">{t.cat_lang}</h3><div className="carousel-wrapper"><button className="nav-btn prev-btn" onClick={() => scrollCarousel('lang-certs', -1)}>&#10094;</button><div className="carousel-container" id="lang-certs">{dbLangCerts.length > 0 ? (dbLangCerts.map((post) => (<Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none"><img src={getCoverImage(post.images)} alt={post.title} style={{height: 160, width: '100%', objectFit: 'cover'}} /><div className="card-info"><h4>{post.title}</h4><p className="text-[#00ff41] text-xs mt-1">&gt;&gt; VIEW CERT</p></div></Link>))) : (<div className="text-gray-500 italic p-5 border border-dashed border-[#333] w-full text-center">NO CERTIFICATES</div>)}</div><button className="nav-btn next-btn" onClick={() => scrollCarousel('lang-certs', 1)}>&#10095;</button></div><h3 className="carousel-title" style={{marginTop: 40}}>{t.cat_tech}</h3><div className="carousel-wrapper"><button className="nav-btn prev-btn" onClick={() => scrollCarousel('tech-certs', -1)}>&#10094;</button><div className="carousel-container" id="tech-certs">{dbTechCerts.length > 0 ? (dbTechCerts.map((post) => (<Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none"><img src={getCoverImage(post.images)} alt={post.title} style={{height: 160, width: '100%', objectFit: 'cover'}} /><div className="card-info"><h4>{post.title}</h4><p className="text-[#00ff41] text-xs mt-1">&gt;&gt; VIEW CERT</p></div></Link>))) : (<div className="text-gray-500 italic p-5 border border-dashed border-[#333] w-full text-center">NO CERTIFICATES</div>)}</div><button className="nav-btn next-btn" onClick={() => scrollCarousel('tech-certs', 1)}>&#10095;</button></div></section>

                {/* 04. CAREER */}
                <section id="career" className="content-section">
                    <h2>{t.sec_career}</h2>
                    {careerText ? <p style={{whiteSpace: 'pre-line'}}>{careerText}</p> : <NoDataDisplay section="CAREER GOALS" />}
                </section>
                
                {/* 05. ACHIEVEMENTS */}
                <section id="achievements" className="content-section"><h2>{t.sec_achievements}</h2><p style={{marginBottom: '20px', color: '#bbb'}}>{t.achievements_desc}</p><div className="carousel-wrapper"><button className="nav-btn prev-btn" onClick={() => scrollCarousel('achievements-list', -1)}>&#10094;</button><div className="carousel-container" id="achievements-list">{dbAchievements.length > 0 ? (dbAchievements.map((post) => (<Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none"><img src={getCoverImage(post.images)} alt={post.title} style={{height: 160, width: '100%', objectFit: 'cover'}} /><div className="card-info"><h4>{post.title}</h4><p className="text-[#00ff41] text-xs mt-1">&gt;&gt; VIEW ITEM</p></div></Link>))) : (<div className="text-gray-500 italic p-5 border border-dashed border-[#333] w-full text-center">NO ACHIEVEMENTS</div>)}</div><button className="nav-btn next-btn" onClick={() => scrollCarousel('achievements-list', 1)}>&#10095;</button></div></section>

                {/* 06. SKILLS */}
                <section id="skills" className="content-section">
                    <h2>{t.sec_skills}</h2>
                    {skillsText ? <p style={{whiteSpace: 'pre-line'}}>{skillsText}</p> : <NoDataDisplay section="SKILLS" />}
                </section>

                {/* 07. EXPERIENCE */}
                <section id="experience" className="content-section">
                    <h2>{t.sec_exp}</h2>
                    {experienceBoxes && experienceBoxes.length > 0 ? (
                        <div className="profile-container">{experienceBoxes.map((box) => (<div key={box.id} className="profile-box"><h3>{box.title}</h3><ul className="profile-list">{box.items.map((item, idx) => (<li key={idx}><span className="label">{item.label}</span><span className="value">{item.value}</span></li>))}</ul></div>))}</div>
                    ) : <NoDataDisplay section="EXPERIENCE" />}
                </section>

                {/* 08. PROJECTS */}
                <section id="projects" className="content-section">
                    <h2>{t.sec_proj}</h2>

                    {/* FILTER PANEL */}
                    <div className="mb-8 border border-[#00ff41] p-4 bg-[#050505] flex flex-wrap gap-4 justify-between items-center shadow-[0_0_10px_rgba(0,255,65,0.2)]">
                        <div className="flex gap-4 items-center flex-wrap">
                            <span className="text-[#00ff41] font-bold text-sm tracking-widest">&gt; FILTER_LANG:</span>
                            {[{v: "ALL", l: "ALL"}, {v: "vi", l: "VI"}, {v: "en", l: "EN"}, {v: "jp", l: "JP"}].map(opt => (
                                <button key={opt.v} onClick={() => setProjLang(opt.v)} className={`px-3 py-1 font-mono text-sm border border-[#00ff41] transition-all hover:shadow-[0_0_5px_#00ff41] ${projLang === opt.v ? 'bg-[#00ff41] text-black font-bold' : 'bg-transparent text-[#00ff41]'}`}>[{opt.l}]</button>
                            ))}
                        </div>
                        <button onClick={() => setProjSort(prev => prev === "newest" ? "oldest" : "newest")} className="flex items-center gap-2 text-[#00ff41] hover:text-white transition-colors text-sm font-mono border-b border-transparent hover:border-[#00ff41]">
                            <span>{projSort === "newest" ? "▼" : "▲"}</span>
                            <span>SORT: {projSort === "newest" ? "LATEST" : "OLDEST"}</span>
                        </button>
                    </div>

                    {[ { title: t.cat_uni_proj, data: dbUniProjects, id: 'uni-projects' }, { title: t.cat_personal_proj, data: dbPersonalProjects, id: 'personal-projects' } ].map((cat, idx) => {
                        const filtered = filterProjects(cat.data);
                        return (
                            <div key={idx}>
                                <h3 className="carousel-title">{cat.title} <span className="text-sm opacity-60">({filtered.length})</span></h3>
                                <div className="carousel-wrapper">
                                    <button className="nav-btn prev-btn" onClick={() => scrollCarousel(cat.id, -1)} >&#10094;</button>
                                    <div className="carousel-container" id={cat.id}>
                                        {filtered.length > 0 ? (filtered.map((post) => (
                                            <Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none">
                                                <div className="relative h-[160px] w-full overflow-hidden border-b border-[#00ff41]">
                                                    <img src={getCoverImage(post.images)} alt={post.title} style={{height: '100%', width: '100%', objectFit: 'cover'}} />
                                                    {post.language && <div className="absolute top-0 right-0 bg-black border-l border-b border-[#00ff41] px-2 py-1 text-[10px] text-[#00ff41] font-mono font-bold">{post.language.toUpperCase()}</div>}
                                                </div>
                                                <div className="card-info">
                                                    <h4>{post.title}</h4>
                                                    <div className="flex justify-between items-center mt-1"><span className="text-gray-500 text-[10px] font-mono">{new Date(post.createdAt).toLocaleDateString()}</span><p className="text-[#00ff41] text-xs">&gt;&gt; READ LOG</p></div>
                                                </div>
                                            </Link>
                                        ))) : (<div className="text-gray-500 italic p-5 border border-dashed border-[#333] w-full text-center">NO DATA MATCHING FILTER [{projLang}]</div>)}
                                    </div>
                                    <button className="nav-btn next-btn" onClick={() => scrollCarousel(cat.id, 1)} >&#10095;</button>
                                </div>
                            </div>
                        );
                    })}
                </section>

                {/* 09. BLOG */}
                <section id="blog" className="content-section"><div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px'}}><h2>09. {t.nav_blog}</h2><Link href="/blog" className="value link-hover" style={{fontSize: '1.2rem'}}>{`View All >>>`}</Link></div><div className="carousel-wrapper"><div className="carousel-container" style={{display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px'}}>{latestPosts.length > 0 ? (latestPosts.map((post) => (<Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none" style={{minWidth: '300px'}}><img src={getCoverImage(post.images)} alt={post.title} style={{height: 160, width: '100%', objectFit: 'cover'}} /><div className="card-info"><h4>{post.title}</h4><p style={{fontSize: '0.9rem', color: '#aaa', margin: '5px 0'}}>{new Date(post.createdAt).toLocaleDateString()}</p><p className="text-[#00ff41] text-xs">&gt;&gt; ACCESS LOG</p></div></Link>))) : (<div style={{color: '#888', fontStyle: 'italic', padding: '20px'}}>[SYSTEM: NO LOGS FOUND]</div>)}</div></div></section>

                {/* 10. GALLERY */}
                <section id="gallery" className="content-section"><h2>10. GALLERY</h2> <h3 className="carousel-title">{t.cat_it_event}</h3><div className="carousel-wrapper"><button className="nav-btn prev-btn" onClick={() => scrollCarousel('it-gallery', -1)} >&#10094;</button><div className="carousel-container" id="it-gallery">{dbItEvents.length > 0 ? (dbItEvents.map((post) => (<Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none"><img src={getCoverImage(post.images)} alt={post.title} style={{height: 160, width: '100%', objectFit: 'cover'}} /><div className="card-info"><h4>{post.title}</h4><p className="text-[#00ff41] text-xs mt-1">&gt;&gt; VIEW ALBUM</p></div></Link>))) : (<div className="text-gray-500 italic p-5 border border-dashed border-[#333] w-full text-center">NO EVENTS</div>)}</div><button className="nav-btn next-btn" onClick={() => scrollCarousel('it-gallery', 1)} >&#10095;</button></div></section>
                
                {/* 11. CONTACT (HACKER STYLE - BIGGER BOX) */}
                <section id="contact" className="content-section" style={{marginBottom: 100}}>
                    <h2>11. CONTACT</h2>
                    
                    {/* Header Text */}
                    <div className="text-center mb-10">
                        <p className="font-mono text-[#00ff41] text-sm md:text-base animate-pulse">
                            {currentLang === 'vi' ? '>> THIẾT LẬP KẾT NỐI AN TOÀN...' : (currentLang === 'jp' ? '>> 安全な接続を確立中...' : '>> ESTABLISHING_SECURE_CONNECTION...')}
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                            {currentLang === 'vi' ? '[ Hãy cùng tạo ra những điều tuyệt vời! ]' : (currentLang === 'jp' ? '[ 一緒に素晴らしいものを作りましょう！ ]' : '[ Let\'s create something beautiful together! ]')}
                        </p>
                    </div>

                    {isLoading ? <MatrixBoxLoader message="DECRYPTING_CONTACT_PROTOCOLS..." /> : (
                        contactBoxes && contactBoxes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                                {contactBoxes.map((box) => (
                                    <div key={box.id} className="border border-[#00ff41] bg-[#050505] p-10 relative group hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] transition-all duration-300">
                                        {/* Trang trí góc */}
                                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ff41]"></div>
                                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ff41]"></div>

                                        {/* Tiêu đề Box - TO HƠN */}
                                        <h3 className="text-2xl font-bold text-[#00ff41] border-b border-[#00ff41] pb-4 mb-6 uppercase tracking-widest flex items-center gap-3">
                                            <span className="text-sm opacity-50">0x{box.id.substring(0,2)}</span> {box.title}
                                        </h3>

                                        {/* Danh sách Items - TO HƠN */}
                                        <div className="flex flex-col gap-6 font-mono text-lg">
                                            {box.items.map((item, idx) => {
                                                // XỬ LÝ LINK THÔNG MINH (HACKER STYLE)
                                                let content;
                                                const val = item.value;

                                                if (val.includes('@')) {
                                                    // 1. Email
                                                    content = (
                                                        <a href={`mailto:${val}`} className="text-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-colors px-2 py-1 inline-block break-all">
                                                            <span className="opacity-50 mr-2">[MAIL]:</span>{val}
                                                        </a>
                                                    );
                                                } else if (val.startsWith('http')) {
                                                    // 2. Link Web
                                                    content = (
                                                        <a href={val} target="_blank" rel="noopener noreferrer" className="text-[#00ff41] hover:underline decoration-dashed break-all px-2 py-1 inline-block">
                                                            <span className="opacity-50 mr-2">[LINK]:</span>{val} ↗
                                                        </a>
                                                    );
                                                } else if (val.match(/^[0-9+ ]+$/) && val.length > 8) {
                                                    // 3. Số điện thoại
                                                    content = (
                                                        <a href={`tel:${val.replace(/\s/g, '')}`} className="text-[#00ff41] font-bold hover:bg-[#00ff41] hover:text-black px-2 py-1 inline-block transition-colors">
                                                            <span className="opacity-50 mr-2">[CALL]:</span>{val}
                                                        </a>
                                                    );
                                                } else {
                                                    // 4. Text thường
                                                    content = <span className="text-gray-300 px-2 py-1"><span className="text-[#00ff41] opacity-50 mr-2">&gt;</span>{val}</span>;
                                                }

                                                return (
                                                    <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-[#00ff41]/20 pb-4 last:border-0">
                                                        <span className="text-gray-500 font-bold text-sm uppercase mb-2 sm:mb-0 min-w-[120px]">
                                                            {item.label}_
                                                        </span>
                                                        <div className="text-right">
                                                            {content}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <NoDataDisplay section="CONTACT" />
                    )}
                </section>
            </>
        )}
    </main>
  );
}