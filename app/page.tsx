"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; 

import MatrixRain from "@/components/MatrixRain";
import TopNav from "@/components/TopNav";

import { translations, Lang } from "@/lib/data"; 
import { getPostsByTag, getAllPosts, getSectionContent } from "@/lib/actions"; 

// --- TYPES ---
type Post = {
  id: string;
  title: string;
  images: string;
  createdAt: Date | string;
  tag?: string;
  language?: string;
  content?: string;
};

type SectionData = {
  contentEn: string;
  contentVi: string;
  contentJp: string;
};

type BoxItem = { label: string; value: string; };
type SectionBox = { id: string; title: string; items: BoxItem[]; };

// Types cho JSON Data
type HeroData = { fullName: string; nickName1: string; nickName2: string; avatarUrl: string; greeting: string; description: string; typewriter: string; };
type ConfigData = { resumeUrl: string; isOpenForWork: boolean; };

// [FIX LỖI ANY] Định nghĩa kiểu dữ liệu cho bản dịch dựa trên tiếng Anh
type Translation = typeof translations.en;

export default function Home() {
  const [currentLang, setCurrentLang] = useState<Lang>("en");
  
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
  
  // [FIX] Chỉ giữ lại globalConfig, xóa heroInfo (vì không dùng đến)
  const [globalConfig, setGlobalConfig] = useState<ConfigData | null>(null);

  const typeWriterRef = useRef<HTMLSpanElement>(null);
  
  // [FIX LỖI ANY] Gán kiểu Translation cụ thể thay vì any
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

    // 2. Fetch All Sections
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
        
        // Parse Hero
        if (hero) sections.hero = hero as unknown as SectionData; 
        
        setDynamicSections(sections);

        // Parse Config
        if (config) {
            try { setGlobalConfig(JSON.parse((config as unknown as SectionData).contentEn)); } catch { console.log("Config parse error"); }
        }
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

  const getSectionText = (key: string, fallbackText: string) => {
    const data = dynamicSections[key]; if (!data) return fallbackText;
    const content = currentLang==='en'?data.contentEn : (currentLang==='vi'?data.contentVi : data.contentJp);
    return content || fallbackText;
  };

  const getSectionBoxes = (key: string): SectionBox[] | null => {
    const data = dynamicSections[key]; if (!data) return null;
    const jsonStr = currentLang==='en'?data.contentEn : (currentLang==='vi'?data.contentVi : data.contentJp);
    if (!jsonStr || jsonStr==="[]") return null;
    try { return JSON.parse(jsonStr); } catch { return null; }
  };

  // Helper lấy Hero Data
  const getCurrentHero = (): HeroData => {
      const data = dynamicSections['hero'];
      // Fallback data lấy từ biến t (đã được type an toàn)
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

  // Typewriter Effect
  useEffect(() => {
    let phraseIndex = 0; let charIndex = 0; let isDeleting = false; let timeoutId: NodeJS.Timeout;
    
    // Typewriter Texts
    let phrases = t.typewriter_texts; // Dùng t đã được type
    try {
        const dbPhrases = JSON.parse(hero.typewriter);
        if(dbPhrases.length > 0) phrases = dbPhrases;
    } catch { /* Ignore json error */ }

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
    type();
    return () => clearTimeout(timeoutId);
  }, [currentLang, hero.typewriter, t]);

  const scrollCarousel = (id: string, direction: number) => { const container = document.getElementById(id); if (container) container.scrollBy({ left: direction * 300, behavior: 'smooth' }); };
  const getCoverImage = (jsonString: string) => { try { const arr = JSON.parse(jsonString); return arr.length > 0 ? arr[0] : "https://placehold.co/300x200/000/00ff41?text=No+Image"; } catch { return "https://placehold.co/300x200/000/00ff41?text=Error"; } };

  const renderFallbackProfile = () => ( <><div className="profile-box"><h3>{t.box_personal}</h3><ul className="profile-list"><li><span className="label">{t.lbl_name}</span> <span className="value highlight">Vũ Trí Dũng</span></li><li><span className="label">{t.lbl_dob}</span> <span className="value">23/11/2005</span></li><li><span className="label">{t.lbl_age}</span> <span className="value">{calculateAge()}</span></li><li><span className="label">{t.lbl_nation}</span> <span className="value">{t.val_nation}</span></li><li><span className="label">{t.lbl_job}</span> <span className="value">{t.val_job}</span></li></ul></div><div className="profile-box"><h3>{t.box_status}</h3><ul className="profile-list"><li><span className="label">{t.lbl_address}</span> <span className="value">{t.val_address}</span></li><li><span className="label">{t.lbl_lang}</span> <span className="value">{t.val_lang}</span></li><li><span className="label">{t.lbl_status}</span> <span className="value highlight">{t.val_status}</span></li></ul></div></> );
  const renderFallbackExperience = () => ( <div className="profile-container"><div className="profile-box"><h3>{t.box_it_exp}</h3><ul className="profile-list"><li><span className="label">{t.exp_time_1}</span> <span className="value highlight">{t.exp_role_1}</span></li><li className="exp-desc">{t.exp_desc_1}</li><li><span className="label">2022-2023:</span> <span className="value">{t.exp_role_2}</span></li><li className="exp-desc">{t.exp_desc_2}</li></ul></div><div className="profile-box"><h3>{t.box_non_it_exp}</h3><ul className="profile-list"><li><span className="label">2021-2022:</span> <span className="value">{t.exp_role_3}</span></li><li className="exp-desc">{t.exp_desc_3}</li><li><span className="label">2020:</span> <span className="value">{t.exp_role_4}</span></li><li className="exp-desc">{t.exp_desc_4}</li></ul></div></div> );
  const renderFallbackContact = () => ( <div className="profile-container"><div className="profile-box"><h3>{t.box_contact_direct}</h3><ul className="profile-list"><li style={{ alignItems: 'flex-start' }}><span className="label">Email:</span><div className="value"><div>- dungvutri25@gmail.com (Main)</div><div>- dungvutri2k5@gmail.com</div></div></li><li style={{ alignItems: 'flex-start' }}><span className="label">Phone:</span><div className="value"><div>- (+84) 931 466 930 (Main)</div><div>- 0903 601 125</div></div></li></ul></div><div className="profile-box"><h3>{t.box_social}</h3><ul className="profile-list"><li><span className="label">LinkedIn:</span> <span className="value link-hover">/dungvutri23112005</span></li><li style={{ alignItems: 'flex-start' }}><span className="label">Github:</span><div className="value"><div>- /VuTriDung1123 (Main)</div><div>- /VuTriDung</div></div></li></ul></div></div> );

  const profileBoxes = getSectionBoxes("profile");
  const experienceBoxes = getSectionBoxes("experience");
  const contactBoxes = getSectionBoxes("contact");

  return (
    <main>
        <MatrixRain />
        <TopNav t={t} currentLang={currentLang} setCurrentLang={setCurrentLang} resumeUrl={globalConfig?.resumeUrl} />

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

        <section id="about" className="content-section"><h2>{t.sec_about}</h2><p style={{whiteSpace: 'pre-line'}}>{getSectionText("about", `${t.about_line1}\n${t.about_line2}`)}</p></section>
        
        <section id="profile" className="content-section"><h2>{t.sec_profile}</h2><div className="profile-container">{profileBoxes && profileBoxes.length > 0 ? profileBoxes.map((box) => (<div key={box.id} className="profile-box"><h3>{box.title}</h3><ul className="profile-list">{box.items.map((item, idx) => (<li key={idx}><span className="label">{item.label}</span><span className="value">{item.value}</span></li>))}</ul></div>)) : renderFallbackProfile()}</div></section>

        <section id="certificates" className="content-section"><h2>{t.sec_cert}</h2><h3 className="carousel-title">{t.cat_lang}</h3><div className="carousel-wrapper"><button className="nav-btn prev-btn" onClick={() => scrollCarousel('lang-certs', -1)}>&#10094;</button><div className="carousel-container" id="lang-certs">{dbLangCerts.length > 0 ? (dbLangCerts.map((post) => (<Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none"><img src={getCoverImage(post.images)} alt={post.title} style={{height: 160, width: '100%', objectFit: 'cover'}} /><div className="card-info"><h4>{post.title}</h4><p className="text-[#00ff41] text-xs mt-1">&gt;&gt; VIEW CERT</p></div></Link>))) : (<div className="text-gray-500 italic p-5 border border-dashed border-[#333] w-full text-center">NO CERTIFICATES</div>)}</div><button className="nav-btn next-btn" onClick={() => scrollCarousel('lang-certs', 1)}>&#10095;</button></div><h3 className="carousel-title" style={{marginTop: 40}}>{t.cat_tech}</h3><div className="carousel-wrapper"><button className="nav-btn prev-btn" onClick={() => scrollCarousel('tech-certs', -1)}>&#10094;</button><div className="carousel-container" id="tech-certs">{dbTechCerts.length > 0 ? (dbTechCerts.map((post) => (<Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none"><img src={getCoverImage(post.images)} alt={post.title} style={{height: 160, width: '100%', objectFit: 'cover'}} /><div className="card-info"><h4>{post.title}</h4><p className="text-[#00ff41] text-xs mt-1">&gt;&gt; VIEW CERT</p></div></Link>))) : (<div className="text-gray-500 italic p-5 border border-dashed border-[#333] w-full text-center">NO CERTIFICATES</div>)}</div><button className="nav-btn next-btn" onClick={() => scrollCarousel('tech-certs', 1)}>&#10095;</button></div></section>

        <section id="career" className="content-section"><h2>{t.sec_career}</h2><p style={{whiteSpace: 'pre-line'}}>{getSectionText("career", t.career_desc)}</p></section>
        
        <section id="achievements" className="content-section"><h2>{t.sec_achievements}</h2><p style={{marginBottom: '20px', color: '#bbb'}}>{t.achievements_desc}</p><div className="carousel-wrapper"><button className="nav-btn prev-btn" onClick={() => scrollCarousel('achievements-list', -1)}>&#10094;</button><div className="carousel-container" id="achievements-list">{dbAchievements.length > 0 ? (dbAchievements.map((post) => (<Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none"><img src={getCoverImage(post.images)} alt={post.title} style={{height: 160, width: '100%', objectFit: 'cover'}} /><div className="card-info"><h4>{post.title}</h4><p className="text-[#00ff41] text-xs mt-1">&gt;&gt; VIEW ITEM</p></div></Link>))) : (<div className="text-gray-500 italic p-5 border border-dashed border-[#333] w-full text-center">NO ACHIEVEMENTS</div>)}</div><button className="nav-btn next-btn" onClick={() => scrollCarousel('achievements-list', 1)}>&#10095;</button></div></section>

        <section id="skills" className="content-section"><h2>{t.sec_skills}</h2><p style={{whiteSpace: 'pre-line'}}>{getSectionText("skills", "HTML5, CSS3, JavaScript, ReactJS, NodeJS, MySQL, Git, Docker.")}</p></section>

        <section id="experience" className="content-section"><h2>{t.sec_exp}</h2>{experienceBoxes && experienceBoxes.length > 0 ? (<div className="profile-container">{experienceBoxes.map((box) => (<div key={box.id} className="profile-box"><h3>{box.title}</h3><ul className="profile-list">{box.items.map((item, idx) => (<li key={idx}><span className="label">{item.label}</span><span className="value">{item.value}</span></li>))}</ul></div>))}</div>) : renderFallbackExperience()}</section>

        <section id="projects" className="content-section"><h2>{t.sec_proj}</h2><h3 className="carousel-title">{t.cat_uni_proj}</h3><div className="carousel-wrapper"><button className="nav-btn prev-btn" onClick={() => scrollCarousel('uni-projects', -1)} >&#10094;</button><div className="carousel-container" id="uni-projects">{dbUniProjects.length > 0 ? (dbUniProjects.map((post) => (<Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none"><img src={getCoverImage(post.images)} alt={post.title} style={{height: 160, width: '100%', objectFit: 'cover'}} /><div className="card-info"><h4>{post.title}</h4><p className="text-[#00ff41] text-xs mt-1">&gt;&gt; READ LOG</p></div></Link>))) : (<div className="text-gray-500 italic p-5 border border-dashed border-[#333] w-full text-center">NO PROJECTS</div>)}</div><button className="nav-btn next-btn" onClick={() => scrollCarousel('uni-projects', 1)} >&#10095;</button></div><h3 className="carousel-title" style={{marginTop: 40}}>{t.cat_personal_proj}</h3><div className="carousel-wrapper"><button className="nav-btn prev-btn" onClick={() => scrollCarousel('personal-projects', -1)} >&#10094;</button><div className="carousel-container" id="personal-projects">{dbPersonalProjects.length > 0 ? (dbPersonalProjects.map((post) => (<Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none"><img src={getCoverImage(post.images)} alt={post.title} style={{height: 160, width: '100%', objectFit: 'cover'}} /><div className="card-info"><h4>{post.title}</h4><p className="text-[#00ff41] text-xs mt-1">&gt;&gt; READ LOG</p></div></Link>))) : (<div className="text-gray-500 italic p-5 border border-dashed border-[#333] w-full text-center">NO PROJECTS</div>)}</div><button className="nav-btn next-btn" onClick={() => scrollCarousel('personal-projects', 1)} >&#10095;</button></div></section>

        <section id="blog" className="content-section"><div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px'}}><h2>09. {t.nav_blog}</h2><Link href="/blog" className="value link-hover" style={{fontSize: '1.2rem'}}>{`View All >>>`}</Link></div><div className="carousel-wrapper"><div className="carousel-container" style={{display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px'}}>{latestPosts.length > 0 ? (latestPosts.map((post) => (<Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none" style={{minWidth: '300px'}}><img src={getCoverImage(post.images)} alt={post.title} style={{height: 160, width: '100%', objectFit: 'cover'}} /><div className="card-info"><h4>{post.title}</h4><p style={{fontSize: '0.9rem', color: '#aaa', margin: '5px 0'}}>{new Date(post.createdAt).toLocaleDateString()}</p><p className="text-[#00ff41] text-xs">&gt;&gt; ACCESS LOG</p></div></Link>))) : (<div style={{color: '#888', fontStyle: 'italic', padding: '20px'}}>[SYSTEM: NO LOGS FOUND]</div>)}</div></div></section>

        <section id="gallery" className="content-section"><h2>10. GALLERY</h2> <h3 className="carousel-title">{t.cat_it_event}</h3><div className="carousel-wrapper"><button className="nav-btn prev-btn" onClick={() => scrollCarousel('it-gallery', -1)} >&#10094;</button><div className="carousel-container" id="it-gallery">{dbItEvents.length > 0 ? (dbItEvents.map((post) => (<Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none"><img src={getCoverImage(post.images)} alt={post.title} style={{height: 160, width: '100%', objectFit: 'cover'}} /><div className="card-info"><h4>{post.title}</h4><p className="text-[#00ff41] text-xs mt-1">&gt;&gt; VIEW ALBUM</p></div></Link>))) : (<div className="text-gray-500 italic p-5 border border-dashed border-[#333] w-full text-center">NO EVENTS</div>)}</div><button className="nav-btn next-btn" onClick={() => scrollCarousel('it-gallery', 1)} >&#10095;</button></div></section>
        
        <section id="contact" className="content-section" style={{marginBottom: 50}}><h2>11. CONTACT</h2>{contactBoxes && contactBoxes.length > 0 ? (<div className="profile-container">{contactBoxes.map((box) => (<div key={box.id} className="profile-box"><h3>{box.title}</h3><ul className="profile-list">{box.items.map((item, idx) => (<li key={idx}><span className="label">{item.label}</span><span className="value">{item.value}</span></li>))}</ul></div>))}</div>) : renderFallbackContact()}</section>
    </main>
  );
}