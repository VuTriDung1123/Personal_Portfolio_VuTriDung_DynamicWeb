"use client";

import Image from "next/image";
import { Lang } from "@/lib/data";

interface TopNavProps {
  // Dòng dưới đây là 'thần chú' để tắt báo lỗi 'Unexpected any' cho riêng dòng t: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any; 
  currentLang: Lang;
  setCurrentLang: (lang: Lang) => void;
}

export default function TopNav({ t, currentLang, setCurrentLang }: TopNavProps) {
  // Vì t là any nên ta cần đảm bảo key tồn tại
  const getNavText = (key: string) => t[key] || key;

  return (
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
              {getNavText(`nav_${item === 'certificates' ? 'cert' : (item === 'projects' ? 'proj' : (item === 'experience' ? 'exp' : item))}`)}
            </a>
          </li>
        ))}
      </ul>

      <div className="nav-right">
        <div className="lang-switch">
          {(['en', 'vi', 'jp'] as const).map(lang => (
            <div key={lang} style={{ display: 'inline' }}>
              <button onClick={() => setCurrentLang(lang)} className={`lang-btn ${currentLang === lang ? 'active-lang' : ''}`}>
                {lang.toUpperCase()}
              </button>
              {lang !== 'jp' && <span>|</span>}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}