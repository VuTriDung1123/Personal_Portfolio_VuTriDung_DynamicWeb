"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; 
// ĐÃ XÓA IMPORT MatrixRain

import TopNav from "@/components/TopNav";
import { translations, Lang } from "@/lib/data"; 
import { getPostsByTag, getAllPosts } from "@/lib/actions"; 

type Post = {
  id: string;
  title: string;
  images: string;
  createdAt: Date;
  tag?: string;
  language?: string;
  content?: string;
};

export default function Home() {
  const [currentLang, setCurrentLang] = useState<Lang>("en");
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dbUniProjects, setDbUniProjects] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dbPersonalProjects, setDbPersonalProjects] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dbItEvents, setDbItEvents] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dbLangCerts, setDbLangCerts] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dbTechCerts, setDbTechCerts] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [latestPosts, setLatestPosts] = useState<any[]>([]);

  const typeWriterRef = useRef<HTMLSpanElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = translations[currentLang] as any; 

  useEffect(() => {
    getPostsByTag("uni_projects").then(setDbUniProjects);
    getPostsByTag("personal_projects").then(setDbPersonalProjects);
    getPostsByTag("it_events").then(setDbItEvents);
    getPostsByTag("lang_certs").then(setDbLangCerts);
    getPostsByTag("tech_certs").then(setDbTechCerts);
    getAllPosts().then((posts) => {
        if (posts && posts.length > 0) setLatestPosts(posts.slice(0, 3));
    });
  }, []);

  const calculateAge = () => {
    const birthDate = new Date("2005-11-23");
    const now = new Date();
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    const days = now.getDate() - birthDate.getDate();
    if (months < 0 || (months === 0 && days < 0)) { years--; months += 12; }
    
    if (currentLang === 'vi') return `${years} Năm, ${months} Tháng`;
    if (currentLang === 'jp') return `${years} 歳, ${months} ヶ月`;
    return `${years} Years, ${months} Months`;
  };

  useEffect(() => {
    let phraseIndex = 0; let charIndex = 0; let isDeleting = false; let timeoutId: NodeJS.Timeout;
    const type = () => {
        const phrases = translations[currentLang].typewriter_texts;
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
  }, [currentLang]);

  const scrollCarousel = (id: string, direction: number) => {
    const container = document.getElementById(id);
    if (container) container.scrollBy({ left: direction * 300, behavior: 'smooth' });
  };

  const getCoverImage = (jsonString: string) => {
    try {
        const arr = JSON.parse(jsonString);
        return arr.length > 0 ? arr[0] : "https://placehold.co/300x200/000/00ff41?text=No+Image";
    } catch {
        return "https://placehold.co/300x200/000/00ff41?text=Error";
    }
  };

  // Helper render card để code gọn hơn
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCard = (post: any, label: string) => (
    <Link key={post.id} href={`/blog/${post.id}`} className="card block text-decoration-none group">
        <img src={getCoverImage(post.images)} alt={post.title} className="h-40 w-full object-cover" />
        <div className="card-info">
            <h4>{post.title}</h4>
            <p className="text-xs mt-1 text-pink-600 dark:text-[#00ff41] font-bold group-hover:underline">
                &gt;&gt; {label}
            </p>
        </div>
    </Link>
  );

  return (
    // QUAN TRỌNG: Không set bg-black ở đây
    <main className="min-h-screen"> 
        <TopNav t={t} currentLang={currentLang} setCurrentLang={setCurrentLang} />

        <section id="home" className="hero">
            <div className="hero-text">
                <h3>{t.hero_greeting}</h3>
                <h1><span className="highlight">Vũ Trí Dũng</span></h1>
                <div className="alt-names">
                    <p><span className="sub-label">{t.lbl_en_name}</span> <span className="sub-value">David Miller</span></p>
                    <p><span className="sub-label">{t.lbl_jp_name}</span> <span className="sub-value">Akina Aoi - 明菜青い</span></p>
                </div>
                <p><span>{t.hero_iam}</span> <span ref={typeWriterRef} className="typewriter"></span></p>
                <p className="description">{t.hero_desc}</p>
                <div className="btn-group">
                    <a href="#projects" className="btn btn-primary">{t.btn_view_project}</a>
                    <a href="#contact" className="btn">{t.btn_contact}</a>
                </div>
            </div>
            <div className="hero-img-large">
                <Image src="/pictures/VuTriDung.jpg" alt="Vũ Trí Dũng" width={350} height={350} priority className="object-cover w-full h-full" />
            </div>
        </section>

        <section id="about" className="content-section">
            <h2>{t.sec_about}</h2>
            <p>{t.about_line1}</p>
            <p>{t.about_line2}</p>
        </section>

        <section id="profile" className="content-section">
            <h2>{t.sec_profile}</h2>
            <div className="profile-container">
                <div className="profile-box">
                    <h3>{t.box_personal}</h3>
                    <ul className="profile-list">
                        <li><span className="label">{t.lbl_name}</span> <span className="value highlight">Vũ Trí Dũng</span></li>
                        <li><span className="label">{t.lbl_dob}</span> <span className="value">23/11/2005</span></li>
                        <li><span className="label">{t.lbl_age}</span> <span className="value">{calculateAge()}</span></li>
                        <li><span className="label">{t.lbl_nation}</span> <span className="value">{t.val_nation}</span></li>
                        <li><span className="label">{t.lbl_job}</span> <span className="value">{t.val_job}</span></li>
                    </ul>
                </div>
                <div className="profile-box">
                    <h3>{t.box_status}</h3>
                    <ul className="profile-list">
                        <li><span className="label">{t.lbl_address}</span> <span className="value">{t.val_address}</span></li>
                        <li><span className="label">{t.lbl_lang}</span> <span className="value">{t.val_lang}</span></li>
                        <li><span className="label">{t.lbl_status}</span> <span className="value highlight">{t.val_status}</span></li>
                    </ul>
                </div>
            </div>
        </section>

        <section id="certificates" className="content-section">
            <h2>{t.sec_cert}</h2>
            
            {/* Language Certs */}
            <h3 className="carousel-title">{t.cat_lang}</h3>
            <div className="carousel-wrapper">
                <button className="nav-btn prev-btn" onClick={() => scrollCarousel('lang-certs', -1)}>&#10094;</button>
                <div className="carousel-container" id="lang-certs">
                    {dbLangCerts.length > 0 ? dbLangCerts.map(p => renderCard(p, "VIEW CERT")) : 
                        <div className="w-full text-center p-5 border border-dashed border-gray-400 dark:border-[#333] text-gray-500 italic">SYSTEM: NO DATA</div>}
                </div>
                <button className="nav-btn next-btn" onClick={() => scrollCarousel('lang-certs', 1)}>&#10095;</button>
            </div>
            
            {/* Tech Certs */}
            <h3 className="carousel-title mt-10">{t.cat_tech}</h3>
             <div className="carousel-wrapper">
                <button className="nav-btn prev-btn" onClick={() => scrollCarousel('tech-certs', -1)}>&#10094;</button>
                <div className="carousel-container" id="tech-certs">
                    {dbTechCerts.length > 0 ? dbTechCerts.map(p => renderCard(p, "VIEW CERT")) : 
                        <div className="w-full text-center p-5 border border-dashed border-gray-400 dark:border-[#333] text-gray-500 italic">SYSTEM: NO DATA</div>}
                </div>
                <button className="nav-btn next-btn" onClick={() => scrollCarousel('tech-certs', 1)}>&#10095;</button>
            </div>
        </section>

        <section id="career" className="content-section"><h2>{t.sec_career}</h2><p>{t.career_desc}</p></section>
        <section id="hobby" className="content-section"><h2>{t.sec_hobby}</h2><p>{t.hobby_desc}</p></section>
        <section id="skills" className="content-section"><h2>{t.sec_skills}</h2><p>HTML5, CSS3, JavaScript, ReactJS, NodeJS, MySQL, Git, Docker, Next.js, PostgreSQL.</p></section>

        <section id="experience" className="content-section">
            <h2>{t.sec_exp}</h2>
            <div className="profile-container">
                <div className="profile-box">
                    <h3>{t.box_it_exp}</h3>
                    <ul className="profile-list">
                        <li><span className="label">{t.exp_time_1}</span> <span className="value highlight">{t.exp_role_1}</span></li>
                        <li className="text-sm italic text-gray-600 dark:text-gray-400 mb-2 pl-4">{t.exp_desc_1}</li>
                        <li><span className="label">2022-2023:</span> <span className="value">{t.exp_role_2}</span></li>
                        <li className="text-sm italic text-gray-600 dark:text-gray-400 mb-2 pl-4">{t.exp_desc_2}</li>
                    </ul>
                </div>
                <div className="profile-box">
                    <h3>{t.box_non_it_exp}</h3>
                    <ul className="profile-list">
                        <li><span className="label">2021-2022:</span> <span className="value">{t.exp_role_3}</span></li>
                        <li className="text-sm italic text-gray-600 dark:text-gray-400 mb-2 pl-4">{t.exp_desc_3}</li>
                        <li><span className="label">2020:</span> <span className="value">{t.exp_role_4}</span></li>
                        <li className="text-sm italic text-gray-600 dark:text-gray-400 mb-2 pl-4">{t.exp_desc_4}</li>
                    </ul>
                </div>
            </div>
        </section>

        <section id="projects" className="content-section">
            <h2>{t.sec_proj}</h2>
            <h3 className="carousel-title">{t.cat_uni_proj}</h3>
            <div className="carousel-wrapper">
                <button className="nav-btn prev-btn" onClick={() => scrollCarousel('uni-projects', -1)} >&#10094;</button>
                <div className="carousel-container" id="uni-projects">
                    {dbUniProjects.length > 0 ? dbUniProjects.map(p => renderCard(p, "READ LOG")) : 
                        <div className="w-full text-center p-5 border border-dashed border-gray-400 dark:border-[#333] text-gray-500 italic">SYSTEM: NO DATA</div>}
                </div>
                <button className="nav-btn next-btn" onClick={() => scrollCarousel('uni-projects', 1)} >&#10095;</button>
            </div>
            
            <h3 className="carousel-title mt-10">{t.cat_personal_proj}</h3>
            <div className="carousel-wrapper">
                <button className="nav-btn prev-btn" onClick={() => scrollCarousel('personal-projects', -1)} >&#10094;</button>
                <div className="carousel-container" id="personal-projects">
                    {dbPersonalProjects.length > 0 ? dbPersonalProjects.map(p => renderCard(p, "READ LOG")) : 
                         <div className="w-full text-center p-5 border border-dashed border-gray-400 dark:border-[#333] text-gray-500 italic">SYSTEM: NO DATA</div>}
                </div>
                <button className="nav-btn next-btn" onClick={() => scrollCarousel('personal-projects', 1)} >&#10095;</button>
            </div>
        </section>

        <section id="blog" className="content-section">
            <div className="flex justify-between items-end mb-5">
                <h2>09. {t.nav_blog}</h2>
                <Link href="/blog" className="text-xl text-gray-500 dark:text-[#e0e0e0] hover:text-pink-600 dark:hover:text-[#00ff41] transition-colors">{`View All >>>`}</Link>
            </div>
            <div className="carousel-wrapper">
                 <div className="carousel-container flex gap-5 overflow-x-auto pb-5">
                    {latestPosts.length > 0 ? latestPosts.map(p => renderCard(p, "ACCESS LOG")) : 
                        <div className="w-full text-center text-gray-500 italic">[SYSTEM: NO LOGS FOUND]</div>}
                 </div>
            </div>
        </section>

        <section id="gallery" className="content-section">
             <h2>10. GALLERY</h2> 
             <h3 className="carousel-title">{t.cat_it_event}</h3>
             <div className="carousel-wrapper">
                <button className="nav-btn prev-btn" onClick={() => scrollCarousel('it-gallery', -1)} >&#10094;</button>
                <div className="carousel-container" id="it-gallery">
                    {dbItEvents.length > 0 ? dbItEvents.map(p => renderCard(p, "VIEW ALBUM")) : 
                        <div className="w-full text-center p-5 border border-dashed border-gray-400 dark:border-[#333] text-gray-500 italic">SYSTEM: NO DATA</div>}
                </div>
                <button className="nav-btn next-btn" onClick={() => scrollCarousel('it-gallery', 1)} >&#10095;</button>
            </div>
        </section>
        
        <section id="contact" className="content-section mb-12">
            <h2>{t.sec_contact}</h2>
            <div className="profile-container">
                <div className="profile-box">
                    <h3>{t.box_contact_direct}</h3>
                    <ul className="profile-list">
                        <li><span className="label">Email:</span><div className="value">dungvutri25@gmail.com</div></li>
                        <li><span className="label">Phone:</span><div className="value">(+84) 931 466 930</div></li>
                    </ul>
                </div>
                <div className="profile-box">
                    <h3>{t.box_social}</h3>
                    <ul className="profile-list">
                        <li><span className="label">LinkedIn:</span> <a href="https://linkedin.com/in/dungvutri23112005" target="_blank" className="value hover:underline">/dungvutri23112005</a></li>
                        <li><span className="label">Github:</span> <a href="https://github.com/VuTriDung1123" target="_blank" className="value hover:underline">/VuTriDung1123</a></li>
                    </ul>
                </div>
            </div>
        </section>
    </main>
  );
}