"use client";

import Image from "next/image";
import Link from "next/link";
import { Lang } from "@/lib/data";

interface TopNavProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  currentLang: Lang;
  setCurrentLang: (lang: Lang) => void;
}

export default function TopNav({ t, currentLang, setCurrentLang }: TopNavProps) {
  const getNavText = (key: string) => t[key] || key;

  const navItems = [
    'home', 'about', 'profile', 'certificates', 'career', 
    'hobby', 'skills', 'experience', 'projects', 
    'blog',
    'gallery', 'contact'
  ];

  return (
    <nav id="navbar" style={{
        // SỬA LỖI: Dùng 1fr - auto - 1fr để cân bằng tự động
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr', 
        alignItems: 'center',
        
        // Dùng left/right: 0 thay vì width: 100% để tránh bị tràn màn hình khi có padding
        position: 'fixed',
        top: 0, 
        left: 0,
        right: 0, 
        
        padding: '10px 40px', // Khoảng cách an toàn từ lề
        zIndex: 9999, // Tăng z-index cao nhất để không bị che
        backgroundColor: 'rgba(0,0,0,0.95)', 
        borderBottom: '1px solid #00ff41',
        boxShadow: '0 2px 10px rgba(0,255,65,0.1)'
    }}>
      {/* 1. TRÁI: Logo & Info */}
      <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div className="profile-thumb" style={{ flexShrink: 0 }}>
          <Image 
            src="/pictures/VuTriDung.jpg" 
            alt="Vũ Trí Dũng" 
            width={45} 
            height={45} 
            className="rounded-full"
            style={{ borderRadius: '50%', border: '2px solid #00ff41', objectFit: 'cover' }}
          />
        </div>
        <div className="profile-info" style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="profile-name" style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem', whiteSpace: 'nowrap' }}>Vũ Trí Dũng</span>
          <span className="profile-role" style={{ 
              color: '#00ff41', fontSize: '0.8rem', 
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' 
          }}>
            {t.role}
          </span>
        </div>
      </div>

      {/* 2. GIỮA: Menu (Tự động canh giữa màn hình nhờ Grid) */}
      <ul className="nav-links" style={{ 
          display: 'flex', justifyContent: 'center', gap: '20px', 
          listStyle: 'none', margin: 0, padding: 0 
      }}>
        {navItems.map(item => (
          <li key={item}>
            {item === 'blog' ? (
               <Link href="/blog" style={{ textDecoration: 'none', color: '#e0e0e0', textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: 500, padding: '5px' }}>
                 {getNavText('nav_blog')}
               </Link>
            ) : (
               <a href={`#${item}`} className={item === 'home' ? 'active' : ''} style={{ textDecoration: 'none', color: '#e0e0e0', textTransform: 'uppercase', fontSize: '0.9rem', padding: '5px' }}>
                 {getNavText(`nav_${
                    item === 'certificates' ? 'cert' : 
                    (item === 'projects' ? 'proj' : 
                    (item === 'experience' ? 'exp' : item))
                 }`)}
               </a>
            )}
          </li>
        ))}
      </ul>

      {/* 3. PHẢI: Nút ngôn ngữ (Đảm bảo nằm gọn trong lề phải) */}
      <div className="nav-right" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div className="lang-switch" style={{ color: '#fff', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '5px' }}>
          {(['en', 'vi', 'jp'] as const).map(lang => (
            <div key={lang} style={{ display: 'inline-block' }}>
              <button 
                onClick={() => setCurrentLang(lang)} 
                style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: currentLang === lang ? '#00ff41' : '#fff',
                    fontWeight: currentLang === lang ? 'bold' : 'normal',
                    padding: '0 5px', fontSize: '0.9rem'
                }}
              >
                {lang.toUpperCase()}
              </button>
              {lang !== 'jp' && <span style={{ opacity: 0.5 }}>|</span>}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}