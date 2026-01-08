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

// --- LOADER COMPONENTS ---
const SystemMessage = ({ text }: { text: string }) => (
    <div className="flex items-center gap-2 font-mono text-xs md:text-sm text-[#00ff41] mt-2 opacity-80">
        <span className="animate-pulse">&gt;&gt;</span>
        <span>{text}</span>
        <span className="animate-ping">_</span>
    </div>
);

const MatrixTextLoader = ({ message }: { message: string }) => (
    <div className="space-y-3 animate-pulse border-l-2 border-[#00ff41] pl-4 py-4 bg-[#00ff41]/5 rounded-r my-4">
        <div className="h-3 bg-[#00ff41]/20 rounded w-3/4"></div>
        <div className="h-3 bg-[#00ff41]/20 rounded w-full"></div>
        <div className="h-3 bg-[#00ff41]/20 rounded w-5/6"></div>
        <SystemMessage text={message} />
    </div>
);

const MatrixBoxLoader = ({ message }: { message: string }) => (
    <div className="w-full">
        <div className="profile-container mb-2">
            {[1, 2].map((i) => (
                <div key={i} className="profile-box animate-pulse border border-[#00ff41]/30 bg-[#00ff41]/5">
                    <div className="h-5 bg-[#00ff41]/30 w-1/3 mb-4 rounded"></div>
                    <ul className="space-y-4">
                        <li className="flex justify-between"><div className="h-3 bg-[#00ff41]/10 w-1/4 rounded"></div><div className="h-3 bg-[#00ff41]/10 w-1/2 rounded"></div></li>
                        <li className="flex justify-between"><div className="h-3 bg-[#00ff41]/10 w-1/4 rounded"></div><div className="h-3 bg-[#00ff41]/10 w-1/2 rounded"></div></li>
                    </ul>
                </div>
            ))}
        </div>
        <div className="flex justify-center"><SystemMessage text={message} /></div>
    </div>
);

const HeroLoader = () => (
    <div className="hero-text w-full animate-pulse">
        <div className="h-4 bg-[#00ff41]/20 w-32 mb-4 rounded"></div>
        <div className="h-10 md:h-14 bg-[#00ff41]/20 w-3/4 md:w-1/2 mb-4 rounded"></div>
        <div className="flex gap-4 mb-6"><div className="h-4 bg-[#00ff41]/10 w-24 rounded"></div><div className="h-4 bg-[#00ff41]/10 w-24 rounded"></div></div>
        <div className="h-4 bg-[#00ff41]/20 w-40 mb-6 rounded"></div>
        <div className="border-l-2 border-[#00ff41] pl-4 py-2 bg-[#00ff41]/5 mb-6"><div className="h-3 bg-[#00ff41]/10 w-full mb-2 rounded"></div><div className="h-3 bg-[#00ff41]/10 w-5/6 rounded"></div></div>
        <div className="flex gap-4"><div className="h-10 w-32 bg-[#00ff41]/20 rounded"></div><div className="h-10 w-32 bg-[#00ff41]/10 rounded border border-[#00ff41]/30"></div></div>
        <div className="mt-4"><SystemMessage text="INITIALIZING_IDENTITY_MATRIX... FETCHING_USER_DATA..." /></div>
    </div>
);

// --- [MỚI] NO DATA COMPONENT ---
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
  const [isLoading, setIsLoading] = useState(true);

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

  const typeWriterRef = useRef<HTMLSpanElement>(null);
  const t: Translation = translations[currentLang]; 

  useEffect(() => {
    // 1. Fetch Blogs
    getPostsByTag("uni_projects").then(data => setDbUniProjects(data as unknown as Post[]));
    getPostsByTag("personal_projects").then(data => setDbPersonalProjects(data as unknown as Post[]));
    getPostsByTag("it_events").then(data => setDbItEvents(data as unknown as Post[]));
    getPostsByTag("lang_certs").then(data => setDbLangCerts(data as unknown as Post[]));
    getPostsByTag("tech_certs").then(data => setDbTechCerts(data as unknown as Post[]));
    getPostsByTag("achievements").then(data => setDbAchievements(data as unknown as Post[]));
    getAllPosts().then((posts) => { if (posts && posts.length > 0) setLatestPosts(posts.slice(0, 3) as unknown as Post[]); });

    // 2. Fetch Sections
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
    })
    .finally(() => {
        setTimeout(() => setIsLoading(false), 1500);
    });
  }, []);

  const calculateAge = () => {
    const birthDate = new Date("2005-11-23");
    const now = new Date();
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    const days = now.getDate() - birthDate.getDate();
    if (months < 0 || (months === 0 && days < 0)) { years--; months += 12; }
    return currentLang === 'vi' ? `${years} Năm` : (currentLang === 'jp' ? `${years} 歳` : `${years} Years`);
  };

  // [SỬA ĐỔI] Trả về null nếu không có data (không dùng fallbackText nữa)
  const getSectionText = (key: string) => {
    const data = dynamicSections[key]; if (!data) return null;
    const content = currentLang==='en'?data.contentEn : (currentLang==='vi'?data.contentVi : data.contentJp);
    return content || null; // Trả về null nếu string rỗng
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
  
  // Text content
  const aboutText = getSectionText("about");
  const careerText = getSectionText("career");
  const skillsText = getSectionText("skills");

  return (
    <main>
        <MatrixRain />
        <TopNav t={t} currentLang={currentLang} setCurrentLang={setCurrentLang} resumeUrl={globalConfig?.resumeUrl} />

        <section id="home" className="hero">
            {isLoading ? <HeroLoader /> : (
                <>
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
                </>
            )}
        </section>

        {/* 01. ABOUT */}
        <section id="about" className="content-section">
            <h2>{t.sec_about}</h2>
            {isLoading ? <MatrixTextLoader message="DECRYPTING_BIO_DATA..." /> : (
                aboutText ? <p style={{whiteSpace: 'pre-line'}}>{aboutText}</p> : <NoDataDisplay section="ABOUT ME" />
            )}
        </section>
        
        {/* 02. PROFILE */}
        <section id="profile" className="content-section">
            <h2>{t.sec_profile}</h2>
            {isLoading ? <MatrixBoxLoader message="FETCHING_PERSONAL_RECORDS..." /> : (
                profileBoxes && profileBoxes.length > 0 ? (
                    <div className="profile-container">{profileBoxes.map((box) => (<div key={box.id} className="profile-box"><h3>{box.title}</h3><ul className="profile-list">{box.items.map((item, idx) => (<li key={idx}><span className="label">{item.label}</span><span className="value">{item.value}</span></li>))}</ul></div>))}</div>
                ) : <NoDataDisplay section="PROFILE" />
            )}
        </section>

        <section id="certificates" className="content-section"><h2>{t.sec_cert}</h2><h3 className="carousel-title">{t.cat_lang}</h3><div className="carousel-wrapper"><button className="nav-btn prev-btn" onClick={() => scrollCarousel('lang-certs', -1)}>&#10094;</button><div className="carousel-container" id="lang-certs">{dbLangCerts.length > 0 ? (dbLangCerts.map((post) => (<Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none"><img src={getCoverImage(post.images)} alt={post.title} style={{height: 160, width: '100%', objectFit: 'cover'}} /><div className="card-info"><h4>{post.title}</h4><p className="text-[#00ff41] text-xs mt-1">&gt;&gt; VIEW CERT</p></div></Link>))) : (<div className="text-gray-500 italic p-5 border border-dashed border-[#333] w-full text-center">NO CERTIFICATES</div>)}</div><button className="nav-btn next-btn" onClick={() => scrollCarousel('lang-certs', 1)}>&#10095;</button></div><h3 className="carousel-title" style={{marginTop: 40}}>{t.cat_tech}</h3><div className="carousel-wrapper"><button className="nav-btn prev-btn" onClick={() => scrollCarousel('tech-certs', -1)}>&#10094;</button><div className="carousel-container" id="tech-certs">{dbTechCerts.length > 0 ? (dbTechCerts.map((post) => (<Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none"><img src={getCoverImage(post.images)} alt={post.title} style={{height: 160, width: '100%', objectFit: 'cover'}} /><div className="card-info"><h4>{post.title}</h4><p className="text-[#00ff41] text-xs mt-1">&gt;&gt; VIEW CERT</p></div></Link>))) : (<div className="text-gray-500 italic p-5 border border-dashed border-[#333] w-full text-center">NO CERTIFICATES</div>)}</div><button className="nav-btn next-btn" onClick={() => scrollCarousel('tech-certs', 1)}>&#10095;</button></div></section>

        {/* 04. CAREER */}
        <section id="career" className="content-section">
            <h2>{t.sec_career}</h2>
            {isLoading ? <MatrixTextLoader message="ANALYZING_CAREER_PATHWAY..." /> : (
                careerText ? <p style={{whiteSpace: 'pre-line'}}>{careerText}</p> : <NoDataDisplay section="CAREER GOALS" />
            )}
        </section>
        
        <section id="achievements" className="content-section"><h2>{t.sec_achievements}</h2><p style={{marginBottom: '20px', color: '#bbb'}}>{t.achievements_desc}</p><div className="carousel-wrapper"><button className="nav-btn prev-btn" onClick={() => scrollCarousel('achievements-list', -1)}>&#10094;</button><div className="carousel-container" id="achievements-list">{dbAchievements.length > 0 ? (dbAchievements.map((post) => (<Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none"><img src={getCoverImage(post.images)} alt={post.title} style={{height: 160, width: '100%', objectFit: 'cover'}} /><div className="card-info"><h4>{post.title}</h4><p className="text-[#00ff41] text-xs mt-1">&gt;&gt; VIEW ITEM</p></div></Link>))) : (<div className="text-gray-500 italic p-5 border border-dashed border-[#333] w-full text-center">NO ACHIEVEMENTS</div>)}</div><button className="nav-btn next-btn" onClick={() => scrollCarousel('achievements-list', 1)}>&#10095;</button></div></section>

        {/* 06. SKILLS */}
        <section id="skills" className="content-section">
            <h2>{t.sec_skills}</h2>
            {isLoading ? <MatrixTextLoader message="LOADING_SKILL_MATRIX..." /> : (
                skillsText ? <p style={{whiteSpace: 'pre-line'}}>{skillsText}</p> : <NoDataDisplay section="SKILLS" />
            )}
        </section>

        {/* 07. EXPERIENCE */}
        <section id="experience" className="content-section">
            <h2>{t.sec_exp}</h2>
            {isLoading ? <MatrixBoxLoader message="RETRIEVING_WORK_HISTORY..." /> : (
                experienceBoxes && experienceBoxes.length > 0 ? (
                    <div className="profile-container">{experienceBoxes.map((box) => (<div key={box.id} className="profile-box"><h3>{box.title}</h3><ul className="profile-list">{box.items.map((item, idx) => (<li key={idx}><span className="label">{item.label}</span><span className="value">{item.value}</span></li>))}</ul></div>))}</div>
                ) : <NoDataDisplay section="EXPERIENCE" />
            )}
        </section>

        <section id="projects" className="content-section"><h2>{t.sec_proj}</h2><h3 className="carousel-title">{t.cat_uni_proj}</h3><div className="carousel-wrapper"><button className="nav-btn prev-btn" onClick={() => scrollCarousel('uni-projects', -1)} >&#10094;</button><div className="carousel-container" id="uni-projects">{dbUniProjects.length > 0 ? (dbUniProjects.map((post) => (<Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none"><img src={getCoverImage(post.images)} alt={post.title} style={{height: 160, width: '100%', objectFit: 'cover'}} /><div className="card-info"><h4>{post.title}</h4><p className="text-[#00ff41] text-xs mt-1">&gt;&gt; READ LOG</p></div></Link>))) : (<div className="text-gray-500 italic p-5 border border-dashed border-[#333] w-full text-center">NO PROJECTS</div>)}</div><button className="nav-btn next-btn" onClick={() => scrollCarousel('uni-projects', 1)} >&#10095;</button></div><h3 className="carousel-title" style={{marginTop: 40}}>{t.cat_personal_proj}</h3><div className="carousel-wrapper"><button className="nav-btn prev-btn" onClick={() => scrollCarousel('personal-projects', -1)} >&#10094;</button><div className="carousel-container" id="personal-projects">{dbPersonalProjects.length > 0 ? (dbPersonalProjects.map((post) => (<Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none"><img src={getCoverImage(post.images)} alt={post.title} style={{height: 160, width: '100%', objectFit: 'cover'}} /><div className="card-info"><h4>{post.title}</h4><p className="text-[#00ff41] text-xs mt-1">&gt;&gt; READ LOG</p></div></Link>))) : (<div className="text-gray-500 italic p-5 border border-dashed border-[#333] w-full text-center">NO PROJECTS</div>)}</div><button className="nav-btn next-btn" onClick={() => scrollCarousel('personal-projects', 1)} >&#10095;</button></div></section>

        <section id="blog" className="content-section"><div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px'}}><h2>09. {t.nav_blog}</h2><Link href="/blog" className="value link-hover" style={{fontSize: '1.2rem'}}>{`View All >>>`}</Link></div><div className="carousel-wrapper"><div className="carousel-container" style={{display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px'}}>{latestPosts.length > 0 ? (latestPosts.map((post) => (<Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none" style={{minWidth: '300px'}}><img src={getCoverImage(post.images)} alt={post.title} style={{height: 160, width: '100%', objectFit: 'cover'}} /><div className="card-info"><h4>{post.title}</h4><p style={{fontSize: '0.9rem', color: '#aaa', margin: '5px 0'}}>{new Date(post.createdAt).toLocaleDateString()}</p><p className="text-[#00ff41] text-xs">&gt;&gt; ACCESS LOG</p></div></Link>))) : (<div style={{color: '#888', fontStyle: 'italic', padding: '20px'}}>[SYSTEM: NO LOGS FOUND]</div>)}</div></div></section>

        <section id="gallery" className="content-section"><h2>10. GALLERY</h2> <h3 className="carousel-title">{t.cat_it_event}</h3><div className="carousel-wrapper"><button className="nav-btn prev-btn" onClick={() => scrollCarousel('it-gallery', -1)} >&#10094;</button><div className="carousel-container" id="it-gallery">{dbItEvents.length > 0 ? (dbItEvents.map((post) => (<Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none"><img src={getCoverImage(post.images)} alt={post.title} style={{height: 160, width: '100%', objectFit: 'cover'}} /><div className="card-info"><h4>{post.title}</h4><p className="text-[#00ff41] text-xs mt-1">&gt;&gt; VIEW ALBUM</p></div></Link>))) : (<div className="text-gray-500 italic p-5 border border-dashed border-[#333] w-full text-center">NO EVENTS</div>)}</div><button className="nav-btn next-btn" onClick={() => scrollCarousel('it-gallery', 1)} >&#10095;</button></div></section>
        
        {/* 11. CONTACT */}
        <section id="contact" className="content-section" style={{marginBottom: 50}}>
            <h2>11. CONTACT</h2>
            {isLoading ? <MatrixBoxLoader message="ESTABLISHING_SECURE_CONNECTION..." /> : (
                contactBoxes && contactBoxes.length > 0 ? (
                    <div className="profile-container">{contactBoxes.map((box) => (<div key={box.id} className="profile-box"><h3>{box.title}</h3><ul className="profile-list">{box.items.map((item, idx) => (<li key={idx}><span className="label">{item.label}</span><span className="value">{item.value}</span></li>))}</ul></div>))}</div>
                ) : <NoDataDisplay section="CONTACT" />
            )}
        </section>
    </main>
  );
}