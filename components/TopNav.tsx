"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 1. Import cái này để biết đang ở trang nào
import { Lang } from "@/lib/data";

interface TopNavProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  currentLang: Lang;
  setCurrentLang: (lang: Lang) => void;
}

export default function TopNav({ t, currentLang, setCurrentLang }: TopNavProps) {
  const getNavText = (key: string) => t[key] || key;
  
  // 2. Lấy đường dẫn hiện tại (ví dụ: "/", "/blog", "/blog/123")
  const pathname = usePathname();

  const navItems = [
    'home', 'about', 'profile', 'certificates', 'career', 
    'hobby', 'skills', 'experience', 'projects', 
    'blog',
    'gallery', 'contact'
  ];

  return (
    <nav id="navbar" style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr', 
        alignItems: 'center',
        position: 'fixed',
        top: 0, left: 0, right: 0, 
        padding: '10px 40px',
        zIndex: 9999,
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

      {/* 2. GIỮA: Menu */}
      <ul className="nav-links" style={{ 
          display: 'flex', justifyContent: 'center', gap: '20px', 
          listStyle: 'none', margin: 0, padding: 0 
      }}>
        {navItems.map(item => {
            // --- LOGIC XỬ LÝ ĐƯỜNG DẪN ---
            let href = "";
            let label = "";

            if (item === 'blog') {
                href = "/blog";
                label = getNavText('nav_blog');
            } else if (item === 'home') {
                href = "/";
                label = getNavText('nav_home');
            } else {
                // Các mục còn lại (About, Contact...)
                label = getNavText(`nav_${
                    item === 'certificates' ? 'cert' : 
                    (item === 'projects' ? 'proj' : 
                    (item === 'experience' ? 'exp' : item))
                }`);

                // Nếu đang ở trang chủ (pathname === "/") -> dùng #id (scroll mượt)
                // Nếu đang ở trang khác (pathname !== "/") -> dùng /#id (nhảy về trang chủ rồi scroll)
                href = pathname === "/" ? `#${item}` : `/#${item}`;
            }

            return (
                <li key={item}>
                    <Link 
                        href={href} 
                        style={{ 
                            textDecoration: 'none', 
                            color: '#e0e0e0', 
                            textTransform: 'uppercase', 
                            fontSize: '0.9rem', 
                            padding: '5px',
                            fontWeight: (item === 'blog' && pathname.includes('/blog')) || (item === 'home' && pathname === '/') ? 'bold' : 'normal'
                        }}
                        className={item === 'home' && pathname === '/' ? 'active' : ''}
                    >
                        {label}
                    </Link>
                </li>
            );
        })}
      </ul>

      {/* 3. PHẢI: Nút ngôn ngữ */}
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