"use client";

import { useState, useRef, useEffect } from "react";
import { Lang } from "@/lib/data";
import AvatarViewer from "./AvatarViewer";

const GREETINGS = {
    vi: "HỆ THỐNG ONLINE. Sẵn sàng nhận lệnh.",
    en: "SYSTEM_ONLINE. Ready for queries.",
    jp: "システム・オンライン。コマンドを入力してください。"
};

const HACKER_MODEL_URL = "/models/robot_hacker_portfolio.glb";

export default function AiChatBox({ currentLang }: { currentLang: Lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: GREETINGS[currentLang] || GREETINGS.en }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(prev => [...prev, { role: 'ai', content: `[LOG]: LANG_SWITCH_TO_[${currentLang.toUpperCase()}]` }]);
  }, [currentLang]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMsg }], language: currentLang, theme: 'hacker' })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: "ERROR: Network Failure." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ================================================================================= */}
      {/* 1. KHUNG ROBOT (CHIBI) - GÓC DƯỚI BÊN TRÁI                                      */}
      {/* Dùng class Tailwind '!important' để ép vị trí                                     */}
      {/* ================================================================================= */}
      <div className="!fixed !bottom-0 !left-4 w-40 h-52 z-50 pointer-events-auto filter drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]">
          
          {/* Component 3D */}
          <AvatarViewer url={HACKER_MODEL_URL} isTalking={isLoading} theme="hacker" />
          
          {/* Bóng / Đế dưới chân */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#00ff41]/20 blur-md rounded-full -z-10 animate-pulse"></div>
      </div>


      {/* ================================================================================= */}
      {/* 2. KHUNG CHAT & NÚT BẬT - GÓC DƯỚI BÊN PHẢI                                       */}
      {/* ================================================================================= */}
      <div className="!fixed !bottom-8 !right-8 z-[9999] font-mono">
        
        {/* Nút bật/tắt */}
        {!isOpen && (
          <button 
            onClick={() => setIsOpen(true)} 
            className="group w-14 h-14 rounded-full bg-black border-2 border-[#00ff41] text-[#00ff41] text-lg font-bold shadow-[0_0_15px_#00ff41] flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          >
            <span className="group-hover:animate-pulse">AI</span>
          </button>
        )}

        {/* Cửa sổ Chat (Khi mở) */}
        {isOpen && (
          <div className="w-80 h-[450px] bg-black/95 border border-[#00ff41] flex flex-col shadow-[0_0_30px_rgba(0,255,65,0.2)] rounded-md overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
            
            {/* Header */}
            <div className="bg-[#00ff41] text-black px-3 py-2 font-bold flex justify-between items-center text-sm tracking-wider">
              <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-black rounded-full animate-ping"></span>
                  <span>TERMINAL_V2</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-black hover:text-[#00ff41] px-1 rounded">&times;</button>
            </div>

            {/* Nội dung chat */}
            <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto flex flex-col gap-3 scrollbar-thin scrollbar-thumb-[#00ff41] scrollbar-track-black">
              {messages.map((m, i) => (
                <div key={i} className={`max-w-[90%] p-2 text-sm border ${m.role === 'user' ? 'self-end border-[#00ff41] bg-[#003300]/50 text-white' : 'self-start border-[#333] bg-[#111] text-gray-300'}`}>
                  <div className={`text-[10px] mb-1 font-bold ${m.role==='user'?'text-[#00ff41]':'text-gray-500'}`}>
                      {m.role === 'user' ? '> USER' : '> AI_CORE'}
                  </div>
                  {m.content}
                </div>
              ))}
              {isLoading && <div className="self-start text-[#00ff41] text-xs animate-pulse">Processing..._</div>}
            </div>

            {/* Input */}
            <div className="p-2 border-t border-[#00ff41] flex bg-black">
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                placeholder="Execute command..." 
                className="flex-1 bg-transparent border-none text-[#00ff41] outline-none text-sm font-inherit placeholder-gray-600" 
              />
              <button onClick={handleSend} className="text-[#00ff41] font-bold px-2 hover:text-white transition-colors">&gt;&gt;</button>
            </div>

          </div>
        )}
      </div>
    </>
  );
}