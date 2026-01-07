"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { Lang } from "@/lib/data";

interface TopNavProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  currentLang: Lang;
  setCurrentLang: (lang: Lang) => void;
  resumeUrl?: string; 
}

export default function TopNav({ t, currentLang, setCurrentLang, resumeUrl }: TopNavProps) {
  const getNavText = (key: string) => t[key] || key;
  const pathname = usePathname();
  const finalResumeUrl = resumeUrl || "/files/resume.pdf";

  const navItems = [
    'home', 'about', 'profile', 'certificates', 'career', 
    'achievements', 'skills', 'experience', 'projects', 
    'blog', 'gallery', 'contact'
  ];

  // Chia đôi menu
  const row1 = navItems.slice(0, 6);
  const row2 = navItems.slice(6, 12);

  // Component NavLink con (Đã tăng size chữ)
  const NavLink = ({ item }: { item: string }) => {
    let href = "";
    let label = "";
    
    if (item === 'blog') { href = "/blog"; label = getNavText('nav_blog'); } 
    else if (item === 'home') { href = "/"; label = getNavText('nav_home'); } 
    else {
        const keyMap: Record<string, string> = { certificates: 'cert', projects: 'proj', experience: 'exp' };
        label = getNavText(`nav_${keyMap[item] || item}`);
        href = pathname === "/" ? `#${item}` : `/#${item}`;
    }
    const isActive = (item === 'home' && pathname === '/') || (item === 'blog' && pathname.includes('/blog'));

    return (
        <Link 
            href={href} 
            className={`
                text-xs lg:text-sm font-bold font-mono uppercase tracking-wider transition-all duration-300 
                hover:text-[#00ff41] hover:drop-shadow-[0_0_8px_#00ff41] px-3 py-1 rounded
                ${isActive ? 'text-[#00ff41] bg-[#00ff41]/10 border border-[#00ff41]' : 'text-gray-400 border border-transparent'}
            `}
        >
            {isActive && <span className="mr-1">&gt;</span>}{label}
        </Link>
    );
  };

  return (
    <nav 
        id="navbar" 
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-8 py-2 bg-black/95 backdrop-blur-md border-b border-[#00ff41]/50 shadow-[0_0_20px_rgba(0,255,65,0.15)] transition-all duration-300 min-h-[90px]"
    >
      {/* 1. TRÁI: Profile (To hơn chút) */}
      <div className="flex items-center gap-4 shrink-0 w-[220px]">
        <div className="relative w-12 h-12 lg:w-16 lg:h-16 overflow-hidden rounded-full border-2 border-[#00ff41] shadow-[0_0_15px_#00ff41] group cursor-pointer">
          <Image src="/pictures/VuTriDung.jpg" alt="Vũ Trí Dũng" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-white font-bold text-lg lg:text-xl leading-none tracking-wide">Vũ Trí Dũng</span>
          <span className="text-[#00ff41] text-xs font-mono mt-1 opacity-90 animate-pulse">&lt;Dev_Portfolio /&gt;</span>
        </div>
      </div>

      {/* 2. GIỮA: Menu 2 Tầng (To & Rõ) */}
      <div className="flex-1 flex flex-col items-center justify-center gap-1.5 mx-4">
          {/* Hàng 1 */}
          <div className="flex flex-wrap justify-center gap-3 lg:gap-6 w-full">
            {row1.map(item => <NavLink key={item} item={item} />)}
          </div>
          {/* Hàng 2 (Căn giữa & có đường kẻ mờ ngăn cách) */}
          <div className="flex flex-wrap justify-center gap-3 lg:gap-6 w-full border-t border-[#333] pt-1.5 mt-0.5">
            {row2.map(item => <NavLink key={item} item={item} />)}
          </div>
      </div>

      {/* 3. PHẢI: Actions (To & Căn chỉnh lại) */}
      <div className="flex items-center gap-4 shrink-0 w-[220px] justify-end">
        
        {/* Nút Ngôn ngữ (To hơn) */}
        <div className="flex bg-black border-2 border-[#333] rounded overflow-hidden h-11 shadow-lg">
          {(['en', 'vi', 'jp'] as const).map(lang => (
            <button 
                key={lang}
                onClick={() => setCurrentLang(lang)} 
                className={`w-12 h-full flex items-center justify-center text-sm font-bold transition-all duration-300 hover:bg-[#222]
                    ${currentLang === lang ? 'bg-[#00ff41] text-black shadow-[inset_0_0_15px_rgba(0,0,0,0.3)]' : 'text-gray-400 hover:text-white'}`}
            >
                {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Nút CV (Fix lệch chữ, To & Nổi bật) */}
        <a 
            href={finalResumeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 h-11 px-5 bg-[#00ff41]/10 border-2 border-[#00ff41] text-[#00ff41] font-bold text-sm lg:text-base rounded hover:bg-[#00ff41] hover:text-black hover:shadow-[0_0_25px_#00ff41] transition-all duration-300 group"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-6 lg:w-6 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {/* Thêm leading-none để chữ không bị lệch dòng */}
            <span className="hidden lg:inline leading-none pt-[1px]">{t.btn_resume || "CV"}</span>
        </a>

      </div>
    </nav>
  );
}