"use client"; // Bắt buộc dòng này để chạy hiệu ứng động và sự kiện click

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [currentLang, setCurrentLang] = useState<"en" | "vi" | "jp">("en");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", desc: "", tech: "", images: [] as string[], link: "" });
  
  // Ref cho canvas và typewriter
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const typeWriterRef = useRef<HTMLSpanElement>(null);

  // --- DỮ LIỆU TỪ ĐIỂN ---
  const translations = {
    en: {
        role: "Software Engineer",
        nav_home: "Home", nav_about: "About", nav_profile: "Profile", nav_cert: "Certificates",
        nav_career: "Career", nav_hobby: "Hobby", nav_skills: "Skills", nav_exp: "Experience",
        nav_proj: "Projects", nav_gallery: "Gallery", nav_contact: "Contact",
        hero_greeting: "Hello, I am",
        lbl_en_name: "English Name:", lbl_jp_name: "Japanese Name:",
        hero_iam: "I am a",
        hero_desc: "> Welcome to my digital space. Where code meets creativity.",
        btn_view_project: "View Projects", btn_contact: "Contact Me",
        sec_about: "// About Me", about_line1: "> I am a tech enthusiast who loves to code and create amazing digital experiences.", about_line2: "> With logical thinking and problem-solving skills, I aim to build valuable applications.",
        sec_profile: "// User Profile", box_personal: "[ Personal Info ]", lbl_name: "Full Name:", lbl_dob: "Birthday:", lbl_age: "Age:", lbl_nation: "Nationality:", val_nation: "Vietnam", lbl_job: "Job:", val_job: "Student",
        box_status: "[ Status & Lang ]", lbl_address: "Address:", val_address: "Ho Chi Minh City, VN", lbl_lang: "Languages:", val_lang: "Vietnamese, English", lbl_status: "Status:", val_status: "Open to work",
        sec_cert: "// Certificates", cat_lang: "[ Foreign Languages ]", cat_tech: "[ Tech & Professional ]",
        sec_career: "// Career Info", career_desc: "> Aiming to become a Senior Fullstack Developer in the next 3 years, specializing in Cloud Computing.",
        sec_hobby: "// Hobby", hobby_desc: "> Coding, Gaming (League of Legends), Reading Tech Books, Jogging.",
        sec_skills: "// Skills", sec_exp: "// Experience", box_it_exp: "[ IT Experience ]", exp_time_1: "2023 - Present:", exp_role_1: "Backend Dev (ABC Corp)", exp_desc_1: "> Develop API, optimize database...", exp_role_2: "Intern Web (XYZ Corp)", exp_desc_2: "> Fix bugs, write documentation...",
        box_non_it_exp: "[ Non-IT Experience ]", exp_role_3: "Volunteer Club Manager", exp_desc_3: "> Leadership, event organizing.", exp_role_4: "Freelance Translator", exp_desc_4: "> En-Vi document translation.",
        sec_proj: "// Projects", cat_uni_proj: "[ University Projects ]", cat_personal_proj: "[ Personal Projects ]",
        sec_gallery: "// Gallery", cat_it_event: "[ IT Events / Hackathon ]", cat_life: "[ Life & Activities ]",
        sec_contact: "// Contact Info", box_contact_direct: "[ Direct Contact ]", box_social: "[ Social Network ]",
        lbl_loading: "Loading...", lbl_click_detail: "Click for details", lbl_view_album: "View Album",
        typewriter_texts: ["Software Engineer", "Web Developer", "Tech Enthusiast"]
    },
    vi: {
        role: "Kỹ sư phần mềm",
        nav_home: "Trang chủ", nav_about: "Giới thiệu", nav_profile: "Lý lịch", nav_cert: "Chứng chỉ",
        nav_career: "Sự nghiệp", nav_hobby: "Sở thích", nav_skills: "Kỹ năng", nav_exp: "Kinh nghiệm",
        nav_proj: "Dự án", nav_gallery: "Ảnh", nav_contact: "Liên hệ",
        hero_greeting: "Xin chào, mình là", lbl_en_name: "Tên tiếng Anh:", lbl_jp_name: "Tên tiếng Nhật:",
        hero_iam: "Mình là một", hero_desc: "> Chào mừng đến với không gian số của tôi. Nơi dòng code gặp gỡ sự sáng tạo.",
        btn_view_project: "Xem Dự Án", btn_contact: "Liên hệ ngay",
        sec_about: "// Giới thiệu", about_line1: "> Tôi là một lập trình viên đam mê công nghệ, luôn tìm tòi học hỏi kỹ thuật mới.", about_line2: "> Với tư duy logic và khả năng giải quyết vấn đề, tôi mong muốn tạo ra sản phẩm giá trị.",
        sec_profile: "// Sơ yếu lý lịch", box_personal: "[ Thông tin cá nhân ]", lbl_name: "Họ và tên:", lbl_dob: "Sinh ngày:", lbl_age: "Tuổi:", lbl_nation: "Quốc tịch:", val_nation: "Việt Nam", lbl_job: "Công việc:", val_job: "Sinh viên",
        box_status: "[ Trạng thái & Ngôn ngữ ]", lbl_address: "Địa chỉ:", val_address: "TP. Hồ Chí Minh, VN", lbl_lang: "Ngôn ngữ:", val_lang: "Tiếng Việt, Tiếng Anh", lbl_status: "Trạng thái:", val_status: "Đang tìm kiếm cơ hội",
        sec_cert: "// Chứng chỉ", cat_lang: "[ Ngoại ngữ ]", cat_tech: "[ Chuyên môn ]",
        sec_career: "// Định hướng", career_desc: "> Định hướng trở thành Senior Fullstack Developer trong 3 năm tới, chuyên sâu về Cloud Computing.",
        sec_hobby: "// Sở thích", hobby_desc: "> Lập trình, Chơi game (LMHT), Đọc sách công nghệ, Chạy bộ.",
        sec_skills: "// Kỹ năng", sec_exp: "// Kinh nghiệm", box_it_exp: "[ Kinh nghiệm IT ]", exp_time_1: "2023 - Nay:", exp_role_1: "Lập trình viên Backend (Cty ABC)", exp_desc_1: "> Phát triển API, tối ưu cơ sở dữ liệu...", exp_role_2: "Thực tập sinh Web (Cty XYZ)", exp_desc_2: "> Hỗ trợ sửa lỗi, viết tài liệu...",
        box_non_it_exp: "[ Kinh nghiệm khác ]", exp_role_3: "Quản lý CLB Tình nguyện", exp_desc_3: "> Kỹ năng lãnh đạo, tổ chức sự kiện.", exp_role_4: "Phiên dịch viên tự do", exp_desc_4: "> Dịch tài liệu Anh - Việt.",
        sec_proj: "// Dự án", cat_uni_proj: "[ Dự án trường ]", cat_personal_proj: "[ Dự án cá nhân ]",
        sec_gallery: "// Thư viện ảnh", cat_it_event: "[ Sự kiện IT ]", cat_life: "[ Hoạt động ]",
        sec_contact: "// Liên hệ", box_contact_direct: "[ Liên hệ ]", box_social: "[ Mạng xã hội ]",
        lbl_loading: "Đang tính...", lbl_click_detail: "Nhấn xem chi tiết", lbl_view_album: "Xem album ảnh",
        typewriter_texts: ["Kỹ sư phần mềm", "Lập trình viên Web", "Người yêu công nghệ"]
    },
    jp: {
        role: "ソフトウェアエンジニア",
        nav_home: "ホーム", nav_about: "自己紹介", nav_profile: "プロフィール", nav_cert: "資格",
        nav_career: "キャリア", nav_hobby: "趣味", nav_skills: "スキル", nav_exp: "経歴",
        nav_proj: "制作物", nav_gallery: "写真", nav_contact: "連絡先",
        hero_greeting: "こんにちは、私は", lbl_en_name: "英語名:", lbl_jp_name: "日本名:",
        hero_iam: "私は", hero_desc: "> 私のデジタルスペースへようこそ。",
        btn_view_project: "制作物を見る", btn_contact: "連絡する",
        sec_about: "// 自己紹介", about_line1: "> 技術に情熱を持ち、常に新しい技術を学びます。", about_line2: "> 論理的思考で価値あるアプリを作ります。",
        sec_profile: "// プロフィール", box_personal: "[ 個人情報 ]", lbl_name: "氏名:", lbl_dob: "生年月日:", lbl_age: "年齢:", lbl_nation: "国籍:", val_nation: "ベトナム", lbl_job: "職業:", val_job: "学生",
        box_status: "[ ステータス ]", lbl_address: "住所:", val_address: "ホーチミン", lbl_lang: "言語:", val_lang: "越、英", lbl_status: "状況:", val_status: "求職中",
        sec_cert: "// 資格", cat_lang: "[ 外国語 ]", cat_tech: "[ 専門技術 ]",
        sec_career: "// キャリア", career_desc: "> 3年以内にシニアフルスタック開発者を目指します。",
        sec_hobby: "// 趣味", hobby_desc: "> プログラミング、ゲーム、読書、ジョギング。",
        sec_skills: "// スキル", sec_exp: "// 経歴", box_it_exp: "[ IT経験 ]", exp_time_1: "2023 - 現在:", exp_role_1: "バックエンド開発", exp_desc_1: "> API開発...", exp_role_2: "Webインターン", exp_desc_2: "> バグ修正...",
        box_non_it_exp: "[ その他 ]", exp_role_3: "クラブ運営", exp_desc_3: "> リーダーシップ。", exp_role_4: "翻訳者", exp_desc_4: "> 英語・ベトナム語。",
        sec_proj: "// 制作物", cat_uni_proj: "[ 大学課題 ]", cat_personal_proj: "[ 個人開発 ]",
        sec_gallery: "// ギャラリー", cat_it_event: "[ ITイベント ]", cat_life: "[ 活動 ]",
        sec_contact: "// 連絡先", box_contact_direct: "[ 連絡先 ]", box_social: "[ SNS ]",
        lbl_loading: "計算中...", lbl_click_detail: "詳細", lbl_view_album: "アルバム",
        typewriter_texts: ["エンジニア", "Web開発者", "技術愛好家"]
    }
  };

  const t = translations[currentLang]; // Biến tắt để lấy text hiện tại

  // --- DỮ LIỆU CARD ---
  const projectsData: any = {
    'uni_1': {
        en: { title: "Library Management", desc: "Library borrowing/returning management software.", tech: "Tech: C# .NET, SQL Server." },
        vi: { title: "Quản lý thư viện", desc: "Phần mềm quản lý mượn trả sách thư viện.", tech: "Công nghệ: C# .NET, SQL Server." },
        jp: { title: "図書館管理", desc: "図書館の貸出・返却管理ソフトウェア。", tech: "技術: C# .NET, SQL Server." },
        link: "https://github.com/VuTriDung/LibraryApp"
    },
    'uni_2': {
        en: { title: "E-Commerce Web", desc: "Sales website with Cart and Admin Dashboard.", tech: "Tech: PHP, MySQL." },
        vi: { title: "Web Bán Hàng PHP", desc: "Web thương mại điện tử có giỏ hàng, quản trị.", tech: "Công nghệ: PHP thuần, MySQL." },
        jp: { title: "Eコマースサイト", desc: "カート機能と管理画面を備えた販売サイト。", tech: "技術: PHP, MySQL." },
        link: "#"
    },
    'per_1': {
        en: { title: "Portfolio Website", desc: "Personal site with Matrix/Pixel style.", tech: "Tech: HTML, CSS, JS." },
        vi: { title: "Portfolio Website", desc: "Trang cá nhân phong cách Matrix/Pixel.", tech: "Công nghệ: HTML, CSS, JS." },
        jp: { title: "ポートフォリオ", desc: "Matrix/Pixelスタイルの個人サイト。", tech: "技術: HTML, CSS, JS." },
        link: "#"
    },
    'per_2': {
        en: { title: "Discord Music Bot", desc: "Music bot for Discord Server.", tech: "Tech: Node.js, Discord.js." },
        vi: { title: "Discord Music Bot", desc: "Bot phát nhạc cho Server Discord.", tech: "Công nghệ: Node.js, Discord.js." },
        jp: { title: "Discord音楽ボット", desc: "Discordサーバー用音楽ボット。", tech: "技術: Node.js, Discord.js." },
        link: "#"
    }
  };

  const certData: any = {
    'lang_1': {
        en: { title: "English: IELTS 7.0", issuer: "Issuer: IDP", desc: "Reading 7.5, Listening 7.0." },
        vi: { title: "Tiếng Anh: IELTS 7.0", issuer: "Cấp bởi: IDP", desc: "Reading 7.5, Listening 7.0. Giao tiếp tốt." },
        jp: { title: "英語: IELTS 7.0", issuer: "発行: IDP", desc: "Reading 7.5, Listening 7.0." },
        date: "2024"
    },
    'lang_2': {
        en: { title: "Japanese: JLPT N3", issuer: "Issuer: Japan Foundation", desc: "Intermediate Japanese." },
        vi: { title: "Tiếng Nhật: JLPT N3", issuer: "Cấp bởi: Japan Foundation", desc: "Tiếng Nhật trung cấp." },
        jp: { title: "日本語: JLPT N3", issuer: "発行: Japan Foundation", desc: "日本語能力試験 N3." },
        date: "2023"
    },
    'lang_3': {
        en: { title: "Basic Chinese", issuer: "Self-study", desc: "Basic communication." },
        vi: { title: "Tiếng Trung Cơ Bản", issuer: "Tự học", desc: "Giao tiếp cơ bản." },
        jp: { title: "中国語 (基礎)", issuer: "独学", desc: "基本的なコミュニケーション." },
        date: "2023"
    },
    'tech_1': {
        en: { title: "University Degree", issuer: "HUST University", desc: "GPA: 3.2/4.0" },
        vi: { title: "Bằng Kỹ Sư CNTT", issuer: "Đại học Bách Khoa (HUST)", desc: "GPA: 3.2/4.0. Chuyên ngành phần mềm." },
        jp: { title: "情報工学士", issuer: "ハノイ工科大学 (HUST)", desc: "GPA: 3.2/4.0. ソフトウェア専攻。" },
        date: "2026 (Expected)"
    },
    'tech_2': {
        en: { title: "AWS Solutions Arch", issuer: "Amazon AWS", desc: "Cloud Architecture." },
        vi: { title: "AWS Solutions Arch", issuer: "Amazon AWS", desc: "Kiến trúc đám mây." },
        jp: { title: "AWSソリューション", issuer: "Amazon AWS", desc: "クラウドアーキテクチャ." },
        date: "2024"
    },
    'tech_3': {
        en: { title: "Fullstack Web Dev", issuer: "Udemy", desc: "React, Node, MongoDB." },
        vi: { title: "Fullstack Web Dev", issuer: "Udemy", desc: "React, Node, MongoDB." },
        jp: { title: "フルスタック開発", issuer: "Udemy", desc: "React, Node, MongoDB." },
        date: "2024"
    }
  };

  const galleryData: any = {
    'it_1': { en: { title: "Hackathon 2023" }, vi: { title: "Hackathon 2023" }, jp: { title: "ハッカソン 2023" }, images: ["https://placehold.co/400x300/000/fff?text=Hackathon+Team"] },
    'it_2': { en: { title: "FPT Tech Day" }, vi: { title: "FPT Tech Day" }, jp: { title: "FPTテックデー" }, images: ["https://placehold.co/400x300/000/fff?text=FPT+Tech+Day"] },
    'life_1': { en: { title: "Football K16" }, vi: { title: "Giải bóng đá K16" }, jp: { title: "サッカー大会 K16" }, images: ["https://placehold.co/400x300/000/fff?text=Football"] },
    'life_2': { en: { title: "Green Summer 2022" }, vi: { title: "Mùa hè xanh 2022" }, jp: { title: "ボランティア 2022" }, images: ["https://placehold.co/400x300/000/fff?text=Green+Summer"] }
  };

  // --- LOGIC TÍNH TUỔI ---
  const calculateAge = () => {
    const birthDate = new Date("2005-11-23");
    const now = new Date();
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    if (months < 0 || (months === 0 && now.getDate() < birthDate.getDate())) {
        years--; months += 12;
    }
    if (currentLang === 'vi') return `${years} Năm, ${months} Tháng`;
    if (currentLang === 'jp') return `${years} 歳, ${months} ヶ月`;
    return `${years} Years, ${months} Months`;
  };

  // --- USE EFFECTS (Chạy khi load trang) ---
  
  // 1. Matrix Rain Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = '01ABCDEF<>/{}[]+=*&^%$#@'.split('');
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const interval = setInterval(() => {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0f0';
        ctx.font = `${fontSize}px monospace`;
        
        drops.forEach((y, i) => {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, y * fontSize);
            if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
    }, 33);

    return () => { clearInterval(interval); window.removeEventListener('resize', resizeCanvas); };
  }, []);

  // 2. Typewriter Effect
  useEffect(() => {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
        const phrases = translations[currentLang].typewriter_texts;
        const currentPhrase = phrases[phraseIndex % phrases.length];
        const displayedText = currentPhrase.substring(0, charIndex + (isDeleting ? -1 : 1));
        
        if (typeWriterRef.current) typeWriterRef.current.textContent = displayedText;

        if (isDeleting) charIndex--; else charIndex++;

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true; typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex++;
            typeSpeed = 500;
        }
        timeoutId = setTimeout(type, typeSpeed);
    };
    
    type();
    return () => clearTimeout(timeoutId);
  }, [currentLang]); // Chạy lại khi đổi ngôn ngữ

  // --- HANDLERS ---
  const scrollCarousel = (id: string, direction: number) => {
    const container = document.getElementById(id);
    if (container) container.scrollBy({ left: direction * 300, behavior: 'smooth' });
  };

  const openModal = (type: 'project' | 'cert' | 'gallery', id: string) => {
    let data;
    if (type === 'project') data = projectsData[id];
    else if (type === 'cert') data = certData[id];
    else if (type === 'gallery') data = galleryData[id];

    if (data) {
        const content = data[currentLang] || data; // Lấy data theo ngôn ngữ
        setModalContent({
            title: content.title,
            desc: content.desc || "",
            tech: content.tech || content.issuer || "",
            images: data.images || [],
            link: data.link || ""
        });
        setModalOpen(true);
    }
  };

  return (
    <main>
        <canvas ref={canvasRef} id="code-bg"></canvas>

        {/* NAVBAR */}
        <nav id="navbar">
            <div className="nav-left">
                <div className="profile-thumb">
                    <Image src="/pictures/VuTriDung.jpg" alt="Vũ Trí Dũng" width={50} height={50} />
                </div>
                <div className="profile-info">
                    <span className="profile-name">Vũ Trí Dũng</span>
                    <span className="profile-role">{t.role}</span>
                </div>
            </div>

            <ul className="nav-links">
                {['home', 'about', 'profile', 'certificates', 'career', 'hobby', 'skills', 'experience', 'projects', 'gallery', 'contact'].map(item => (
                    <li key={item}>
                        <a href={`#${item}`} className={item === 'home' ? 'active' : ''}>
                             {/* @ts-ignore */}
                            {t[`nav_${item === 'certificates' ? 'cert' : (item === 'projects' ? 'proj' : (item === 'experience' ? 'exp' : item))}`]}
                        </a>
                    </li>
                ))}
            </ul>

            <div className="nav-right">
                <div className="lang-switch">
                    {(['en', 'vi', 'jp'] as const).map(lang => (
                        <div key={lang} style={{display:'inline'}}>
                            <button onClick={() => setCurrentLang(lang)} className={`lang-btn ${currentLang === lang ? 'active-lang' : ''}`}>
                                {lang.toUpperCase()}
                            </button>
                            {lang !== 'jp' && <span>|</span>}
                        </div>
                    ))}
                </div>
            </div>
        </nav>

        {/* HERO SECTION */}
        <section id="home" className="hero">
            <div className="hero-text">
                <h3>{t.hero_greeting}</h3>
                <h1><span className="highlight">Vũ Trí Dũng</span></h1>
                
                {/* Tên phụ */}
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

        {/* ABOUT SECTION */}
        <section id="about" className="content-section">
            <h2>{t.sec_about}</h2>
            <p>{t.about_line1}</p>
            <p>{t.about_line2}</p>
        </section>

        {/* PROFILE SECTION */}
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

        {/* CERTIFICATES SECTION */}
        <section id="certificates" className="content-section">
            <h2>{t.sec_cert}</h2>
            
            <h3 className="carousel-title">{t.cat_lang}</h3>
            <div className="carousel-wrapper">
                <button className="nav-btn prev-btn" onClick={() => scrollCarousel('lang-certs', -1)}>&#10094;</button>
                <div className="carousel-container" id="lang-certs">
                    {['lang_1', 'lang_2', 'lang_3'].map(id => (
                        <div key={id} className="card" onClick={() => openModal('cert', id)}>
                             {/* Placeholder ảnh, bạn thay bằng Image thật nếu có */}
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

        {/* CAREER, HOBBY, SKILLS (Giản lược cho gọn) */}
        <section id="career" className="content-section"><h2>{t.sec_career}</h2><p>{t.career_desc}</p></section>
        <section id="hobby" className="content-section"><h2>{t.sec_hobby}</h2><p>{t.hobby_desc}</p></section>
        <section id="skills" className="content-section"><h2>{t.sec_skills}</h2><p>HTML5, CSS3, JavaScript, ReactJS, NodeJS, MySQL, Git, Docker, Next.js, PostgreSQL.</p></section>

        {/* EXPERIENCE */}
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

        {/* PROJECTS */}
        <section id="projects" className="content-section">
            <h2>{t.sec_proj}</h2>
            <h3 className="carousel-title">{t.cat_uni_proj}</h3>
            <div className="carousel-wrapper">
                <div className="carousel-container" id="uni-projects">
                     {['uni_1', 'uni_2'].map(id => (
                        <div key={id} className="card" onClick={() => openModal('project', id)}>
                            <img src="https://placehold.co/300x200/000/00ff41?text=Uni+Project" alt="Project" />
                            <div className="card-info"><h4>{projectsData[id][currentLang].title}</h4><p>{t.lbl_click_detail}</p></div>
                        </div>
                    ))}
                </div>
            </div>
            
            <h3 className="carousel-title" style={{marginTop: 40}}>{t.cat_personal_proj}</h3>
            <div className="carousel-wrapper">
                <div className="carousel-container" id="personal-projects">
                     {['per_1', 'per_2'].map(id => (
                        <div key={id} className="card" onClick={() => openModal('project', id)}>
                            <img src="https://placehold.co/300x200/000/fff?text=Personal+Project" alt="Project" />
                            <div className="card-info"><h4>{projectsData[id][currentLang].title}</h4><p>{t.lbl_click_detail}</p></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" className="content-section">
             <h2>{t.sec_gallery}</h2>
             <h3 className="carousel-title">{t.cat_it_event}</h3>
             <div className="carousel-wrapper">
                <div className="carousel-container" id="it-gallery">
                     {['it_1', 'it_2'].map(id => (
                        <div key={id} className="card" onClick={() => openModal('gallery', id)}>
                            <img src="https://placehold.co/300x200/001100/00ff41?text=Event" alt="Event" />
                            <div className="card-info"><h4>{galleryData[id][currentLang].title}</h4><p>{t.lbl_view_album}</p></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        
        {/* CONTACT */}
        <section id="contact" className="content-section" style={{marginBottom: 50}}>
            <h2>{t.sec_contact}</h2>
            <div className="profile-container">
                <div className="profile-box">
                    <h3>{t.box_contact_direct}</h3>
                    <ul className="profile-list">
                        <li><span className="label">Email:</span> <span className="value">dungvutri25@gmail.com</span></li>
                        <li><span className="label">Phone:</span> <span className="value">0931 466 930</span></li>
                    </ul>
                </div>
                <div className="profile-box">
                    <h3>{t.box_social}</h3>
                    <ul className="profile-list">
                        <li><span className="label">Github:</span> <a href="https://github.com/VuTriDung1123" className="value link-hover">/VuTriDung1123</a></li>
                    </ul>
                </div>
            </div>
        </section>

        {/* MODAL */}
        {modalOpen && (
            <div className="modal-overlay" style={{display: 'flex'}} onClick={() => setModalOpen(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <span className="close-btn" onClick={() => setModalOpen(false)}>&times;</span>
                    <h2 className="modal-title">{modalContent.title}</h2>
                    {modalContent.tech && <p className="modal-tech">{modalContent.tech}</p>}
                    <p className="modal-desc">{modalContent.desc}</p>
                    
                    {/* Render Gallery Images */}
                    {modalContent.images.length > 0 && (
                        <div className="modal-gallery-grid">
                            {modalContent.images.map((img, idx) => <img key={idx} src={img} alt="Gallery" />)}
                        </div>
                    )}
                    
                    {/* Render Link Button */}
                    {modalContent.link && <a href={modalContent.link} target="_blank" className="btn btn-primary" style={{marginTop: 20}}>View Details</a>}
                </div>
            </div>
        )}
    </main>
  );
}