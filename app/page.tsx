"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

// Import các thành phần con và dữ liệu (CHÚ Ý: Dùng TopNav)
import MatrixRain from "@/components/MatrixRain";
import TopNav from "@/components/TopNav";
import Modal from "@/components/Modal";
import { translations, projectsData, certData, galleryData, Lang } from "@/lib/data";

export default function Home() {
  const [currentLang, setCurrentLang] = useState<Lang>("en");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", desc: "", tech: "", images: [] as string[], link: "" });
  
  const typeWriterRef = useRef<HTMLSpanElement>(null);
  const t = translations[currentLang]; // Lấy dữ liệu dịch hiện tại

  // Logic tính tuổi
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

  // Logic gõ chữ
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

  // Logic cuộn Carousel
  const scrollCarousel = (id: string, direction: number) => {
    const container = document.getElementById(id);
    if (container) container.scrollBy({ left: direction * 300, behavior: 'smooth' });
  };

  // Logic mở Modal
  const openModal = (type: 'project' | 'cert' | 'gallery', id: string) => {
    let data;
    if (type === 'project') data = projectsData[id];
    else if (type === 'cert') data = certData[id];
    else if (type === 'gallery') data = galleryData[id];

    if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const content = data[currentLang] as any;
        setModalContent({
            title: content.title, desc: content.desc || "", tech: content.tech || content.issuer || "",
            images: data[currentLang].images || [], link: data[currentLang].link || ""
        });
        setModalOpen(true);
    }
  };

  return (
    <main>
        <MatrixRain />
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
                <Image src="/pictures/VuTriDung.jpg" alt="Vũ Trí Dũng" width={350} height={350} />
            </div>
        </section>

        <section id="about" className="content-section">
            <h2>{t.sec_about}</h2>
            <p>{t.about_line1}</p><p>{t.about_line2}</p>
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
            <h3 className="carousel-title">{t.cat_lang}</h3>
            <div className="carousel-wrapper">
                <button className="nav-btn prev-btn" onClick={() => scrollCarousel('lang-certs', -1)}>&#10094;</button>
                <div className="carousel-container" id="lang-certs">
                    {['lang_1', 'lang_2', 'lang_3'].map(id => (
                        <div key={id} className="card" onClick={() => openModal('cert', id)}>
                            <img src={`https://placehold.co/300x200/003366/fff?text=${certData[id].en.title.split(':')[0]}`} alt="Cert" />
                            <div className="card-info">
                                <h4>{certData[id][currentLang].title}</h4>
                                <p>{t.lbl_click_detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="nav-btn next-btn" onClick={() => scrollCarousel('lang-certs', 1)}>&#10095;</button>
            </div>
            
            <h3 className="carousel-title" style={{marginTop: 40}}>{t.cat_tech}</h3>
             <div className="carousel-wrapper">
                <button className="nav-btn prev-btn" onClick={() => scrollCarousel('tech-certs', -1)}>&#10094;</button>
                <div className="carousel-container" id="tech-certs">
                    {['tech_1', 'tech_2', 'tech_3'].map(id => (
                        <div key={id} className="card" onClick={() => openModal('cert', id)}>
                            <img src={`https://placehold.co/300x200/003366/fff?text=Tech+Cert`} alt="Cert" />
                            <div className="card-info">
                                <h4>{certData[id][currentLang].title}</h4>
                                <p>{t.lbl_click_detail}</p>
                            </div>
                        </div>
                    ))}
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
                        <li className="exp-desc">{t.exp_desc_1}</li>
                        <li><span className="label">2022-2023:</span> <span className="value">{t.exp_role_2}</span></li>
                        <li className="exp-desc">{t.exp_desc_2}</li>
                    </ul>
                </div>
                <div className="profile-box">
                    <h3>{t.box_non_it_exp}</h3>
                    <ul className="profile-list">
                        <li><span className="label">2021-2022:</span> <span className="value">{t.exp_role_3}</span></li>
                        <li className="exp-desc">{t.exp_desc_3}</li>
                        <li><span className="label">2020:</span> <span className="value">{t.exp_role_4}</span></li>
                        <li className="exp-desc">{t.exp_desc_4}</li>
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
                     {['uni_1', 'uni_2'].map(id => (
                        <div key={id} className="card" onClick={() => openModal('project', id)}>
                            <img src="https://placehold.co/300x200/000/00ff41?text=Uni+Project" alt="Project" />
                            <div className="card-info"><h4>{projectsData[id][currentLang].title}</h4><p>{t.lbl_click_detail}</p></div>
                        </div>
                    ))}
                </div>
                <button className="nav-btn next-btn" onClick={() => scrollCarousel('uni-projects', 1)} >&#10095;</button>
            </div>
            
            <h3 className="carousel-title" style={{marginTop: 40}}>{t.cat_personal_proj}</h3>
            <div className="carousel-wrapper">
                <button className="nav-btn prev-btn" onClick={() => scrollCarousel('personal-projects', -1)} >&#10094;</button>
                <div className="carousel-container" id="personal-projects">
                     {['per_1', 'per_2'].map(id => (
                        <div key={id} className="card" onClick={() => openModal('project', id)}>
                            <img src="https://placehold.co/300x200/000/fff?text=Personal+Project" alt="Project" />
                            <div className="card-info"><h4>{projectsData[id][currentLang].title}</h4><p>{t.lbl_click_detail}</p></div>
                        </div>
                    ))}
                </div>
                <button className="nav-btn next-btn" onClick={() => scrollCarousel('personal-projects', 1)} >&#10095;</button>
            </div>
        </section>

        <section id="gallery" className="content-section">
             <h2>{t.sec_gallery}</h2>
             <h3 className="carousel-title">{t.cat_it_event}</h3>
             <div className="carousel-wrapper">
                <button className="nav-btn prev-btn" onClick={() => scrollCarousel('it-gallery', -1)} >&#10094;</button>
                <div className="carousel-container" id="it-gallery">
                     {['it_1', 'it_2'].map(id => (
                        <div key={id} className="card" onClick={() => openModal('gallery', id)}>
                            <img src="https://placehold.co/300x200/001100/00ff41?text=Event" alt="Event" />
                            <div className="card-info"><h4>{galleryData[id][currentLang].title}</h4><p>{t.lbl_view_album}</p></div>
                        </div>
                    ))}
                </div>
                <button className="nav-btn next-btn" onClick={() => scrollCarousel('it-gallery', 1)} >&#10095;</button>
            </div>
        </section>
        
        {/* --- Thay thế toàn bộ đoạn section id="contact" cũ bằng đoạn này --- */}
        <section id="contact" className="content-section" style={{marginBottom: 50}}>
            <h2>{t.sec_contact}</h2>
            <div className="profile-container">
                {/* Cột Trái: Direct Contact */}
                <div className="profile-box">
                    <h3>{t.box_contact_direct}</h3>
                    <ul className="profile-list">
                        {/* Email - Có 2 dòng */}
                        <li style={{ alignItems: 'flex-start' }}>
                            <span className="label">Email:</span>
                            <div className="value">
                                <div>- dungvutri25@gmail.com (Main)</div>
                                <div>- dungvutri2k5@gmail.com</div>
                            </div>
                        </li>
                        
                        {/* Phone - Có 2 dòng */}
                        <li style={{ alignItems: 'flex-start' }}>
                            <span className="label">Phone:</span>
                            <div className="value">
                                <div>- (+84) 931 466 930 (Main)</div>
                                <div>- 0903 601 125</div>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Cột Phải: Social Network */}
                <div className="profile-box">
                    <h3>{t.box_social}</h3>
                    <ul className="profile-list">
                        {/* LinkedIn */}
                        <li>
                            <span className="label">LinkedIn:</span> 
                            <a href="https://linkedin.com/in/dungvutri23112005" target="_blank" className="value link-hover">
                                /dungvutri23112005
                            </a>
                        </li>

                        {/* Github - Có 2 dòng */}
                        <li style={{ alignItems: 'flex-start' }}>
                            <span className="label">Github:</span>
                            <div className="value">
                                <div>
                                    <a href="https://github.com/VuTriDung1123" target="_blank" className="link-hover">
                                        - /VuTriDung1123 (Main)
                                    </a>
                                </div>
                                <div>
                                    <a href="https://github.com/VuTriDung" target="_blank" className="link-hover">
                                        - /VuTriDung
                                    </a>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} content={modalContent} />
    </main>
  );
}