// lib/data.ts

// --- 1. INTERFACES (Kiểu dữ liệu) ---
export type Lang = "en" | "vi" | "jp";

export interface ProjectItem {
  title: string;
  desc: string;
  tech: string;
  images?: string[];
  link?: string;
}

export interface CertItem {
  title: string;
  issuer: string;
  desc: string;
  images?: string[];
  link?: string;
  date?: string;
}

export interface GalleryItem {
  title: string;
  images?: string[];
  link?: string;
}

export interface DataObject<T> {
  [key: string]: {
    en: T;
    vi: T;
    jp: T;
    link?: string;
    images?: string[];
    date?: string;
  };
}

// --- 2. TỪ ĐIỂN DỊCH (TRANSLATIONS) ---
export const translations = {
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

// --- 3. DỮ LIỆU DỰ ÁN & CHỨNG CHỈ ---
export const projectsData: DataObject<ProjectItem> = {
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
    vi: { title: "Web Portfolio", desc: "Trang cá nhân phong cách Matrix/Pixel.", tech: "Công nghệ: HTML, CSS, JS." },
    jp: { title: "ポートフォリオ", desc: "Matrix/Pixelスタイルの個人サイト。", tech: "技術: HTML, CSS, JS." },
    link: "#"
  },
  'per_2': {
    en: { title: "Discord Music Bot", desc: "Music bot for Discord Server.", tech: "Tech: Node.js, Discord.js." },
    vi: { title: "Bot Nhạc Discord", desc: "Bot phát nhạc cho Server Discord.", tech: "Công nghệ: Node.js, Discord.js." },
    jp: { title: "Discord音楽ボット", desc: "Discordサーバー用音楽ボット。", tech: "技術: Node.js, Discord.js." },
    link: "#"
  }
};

export const certData: DataObject<CertItem> = {
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

export const galleryData: DataObject<GalleryItem> = {
  'it_1': { en: { title: "Hackathon 2023" }, vi: { title: "Hackathon 2023" }, jp: { title: "ハッカソン 2023" }, images: ["https://placehold.co/400x300/000/fff?text=Hackathon+Team"] },
  'it_2': { en: { title: "FPT Tech Day" }, vi: { title: "FPT Tech Day" }, jp: { title: "FPTテックデー" }, images: ["https://placehold.co/400x300/000/fff?text=FPT+Tech+Day"] },
  'life_1': { en: { title: "Football K16" }, vi: { title: "Giải bóng đá K16" }, jp: { title: "サッカー大会 K16" }, images: ["https://placehold.co/400x300/000/fff?text=Football"] },
  'life_2': { en: { title: "Green Summer 2022" }, vi: { title: "Mùa hè xanh 2022" }, jp: { title: "ボランティア 2022" }, images: ["https://placehold.co/400x300/000/fff?text=Green+Summer"] }
};