"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-2 p-2 border border-pink-300 dark:border-[#333] bg-white/90 dark:bg-black/90 backdrop-blur-sm mt-2 rounded-md shadow-lg transition-all">
      <span className="text-[10px] uppercase font-bold text-pink-600 dark:text-[#00ff41] text-center">Theme</span>
      <div className="flex gap-1">
        <button
          onClick={() => setTheme("light")}
          className={`flex-1 p-2 text-xs font-bold border rounded transition-colors ${theme === 'light' ? 'bg-pink-100 border-pink-500 text-pink-700' : 'border-transparent text-gray-400 hover:text-black'}`}
          title="Chế độ Sáng (Sakura)"
        >
          🌸
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`flex-1 p-2 text-xs font-bold border rounded transition-colors ${theme === 'dark' ? 'bg-[#00ff41]/20 border-[#00ff41] text-[#00ff41]' : 'border-transparent text-gray-400 hover:text-white'}`}
          title="Chế độ Tối (Hacker)"
        >
          💀
        </button>
        <button
          onClick={() => setTheme("system")}
          className={`flex-1 p-2 text-xs font-bold border rounded transition-colors ${theme === 'system' ? 'bg-gray-200 border-gray-500 text-black' : 'border-transparent text-gray-400 hover:text-white'}`}
          title="Tự động theo máy"
        >
          💻
        </button>
      </div>
    </div>
  );
}