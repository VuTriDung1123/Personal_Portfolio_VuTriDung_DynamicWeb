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

  // [CẬP NHẬT] Thêm 'faq' vào danh sách
  const navItems = [
    'home', 'about', 'profile', 'certificates', 'career', 
    'achievements', 'skills', 'experience', 'projects', 
    'blog', 'gallery', 'faq', 'contact'
  ];

  // Chia đôi menu (Cân đối lại số lượng)
  const row1 = navItems.slice(0, 7); // 7 mục trên
  const row2 = navItems.slice(7, 13); // 6 mục dưới

  // Component NavLink con
  const NavLink = ({ item }: { item: string }) => {
    let href = "";
    let label = "";
    
    // [LOGIC MỚI] Xử lý link cho FAQ
    if (item === 'blog') { href = "/blog"; label = getNavText('nav_blog'); } 
    else if (item === 'faq') { href = "/faq"; label = "FAQ / HELP"; } // Link sang trang FAQ
    else if (item === 'home') { href = "/"; label = getNavText('nav_home'); } 
    else {
        const keyMap: Record<string, string> = { certificates: 'cert', projects: 'proj', experience: 'exp' };
        label = getNavText(`nav_${keyMap[item] || item}`);
        href = pathname === "/" ? `#${item}` : `/#${item}`;
    }
    
    // Active khi ở trang chủ (và hash khớp) HOẶC ở trang con tương ứng
    const isActive = (item === 'home' && pathname === '/') || 
                     (item === 'blog' && pathname.includes('/blog')) ||
                     (item === 'faq' && pathname.includes('/faq'));

    return (
        <Link 
            href={href} 
            className={`
                text-[18px] lg:text-[20px] font-bold uppercase tracking-wide transition-all duration-300 
                hover:text-[#00ff41] hover:drop-shadow-[0_0_5px_#00ff41] px-2 py-0.5 rounded
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
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-6 h-[90px] bg-black/95 border-b border-[#00ff41]/50 shadow-[0_0_15px_rgba(0,255,65,0.2)] transition-all duration-300"
    >
      {/* 1. TRÁI: Profile */}
      <div className="flex items-center gap-3 shrink-0 w-[220px]">
        <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-[#00ff41] shadow-[0_0_10px_#00ff41] group cursor-pointer">
          <Image src="/pictures/VuTriDung.jpg" alt="Vũ Trí Dũng" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-white font-bold text-xl leading-none tracking-wide uppercase pb-1">Vũ Trí Dũng</span>
          <span className="text-[#00ff41] text-sm mt-0.5 opacity-90 animate-pulse tracking-widest">&lt;Dev_Portfolio /&gt;</span>
        </div>
      </div>

      {/* 2. GIỮA: Menu 2 Tầng */}
      <div className="flex-1 flex flex-col items-center justify-center gap-1 mx-2 hidden lg:flex">
          <div className="flex flex-wrap justify-center gap-2 lg:gap-4 w-full">
            {row1.map(item => <NavLink key={item} item={item} />)}
          </div>
          <div className="flex flex-wrap justify-center gap-2 lg:gap-4 w-full border-t border-[#333] pt-1.5 mt-0.5">
            {row2.map(item => <NavLink key={item} item={item} />)}
          </div>
      </div>
      
      {/* Mobile Placeholder */}
      <div className="lg:hidden flex-1 flex justify-center text-[#00ff41] text-lg animate-pulse tracking-widest">
          [ SYSTEM_MENU ]
      </div>

      {/* 3. PHẢI: Actions */}
      <div className="flex items-center gap-2 shrink-0 w-auto justify-end">
        
        {/* Nút Sakura */}
        <a 
            href="https://personal-portfolio-vu-tri-dung-saku.vercel.app" 
            target="_blank"
            className="flex items-center justify-center h-9 px-2 border border-[#ff69b4] text-[#ff69b4] font-bold text-sm rounded hover:bg-[#ff69b4] hover:text-white hover:shadow-[0_0_10px_#ff69b4] transition-all duration-300 tracking-wide"
        >
           🌸 SAKURA
        </a>

        {/* Nút Ngôn ngữ */}
        <div className="flex bg-black border border-[#333] rounded overflow-hidden h-9 shadow-lg">
          {(['en', 'vi', 'jp'] as const).map(lang => (
            <button 
                key={lang}
                onClick={() => setCurrentLang(lang)} 
                className={`w-10 h-full flex items-center justify-center text-sm font-bold transition-all duration-300 hover:bg-[#222]
                    ${currentLang === lang ? 'bg-[#00ff41] text-black' : 'text-gray-400 hover:text-white'}`}
            >
                {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Nút CV */}
        <a 
            href={finalResumeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 h-9 px-3 bg-[#00ff41]/10 border border-[#00ff41] text-[#00ff41] font-bold text-lg rounded hover:bg-[#00ff41] hover:text-black hover:shadow-[0_0_15px_#00ff41] transition-all duration-300 group tracking-wide"
        >
            <span className="leading-none pt-[3px]">{t.btn_resume || "CV"}</span>
        </a>

      </div>
    </nav>
  );
}