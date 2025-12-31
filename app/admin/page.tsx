"use client";

import { createPost, checkAdmin } from "@/lib/actions";
import { useState } from "react";
import MatrixRain from "@/components/MatrixRain";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- GIAO DIỆN ĐĂNG NHẬP (Login UI) ---
  if (!isLoggedIn) {
    return (
      <main className="h-screen flex items-center justify-center relative overflow-hidden bg-black">
        <MatrixRain />
        <div className="z-10 bg-[rgba(10,10,10,0.9)] border-2 border-[#00ff41] p-10 flex flex-col gap-6 shadow-[0_0_30px_#00ff41] w-[400px] backdrop-blur-sm relative">
            
            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white -mt-1 -ml-1"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white -mb-1 -mr-1"></div>

            <h1 className="text-[#00ff41] text-3xl font-mono text-center tracking-[5px] font-bold uppercase drop-shadow-[0_0_5px_#00ff41]">
                System Login
            </h1>
            
            <form action={async (formData) => {
                setLoading(true);
                const res = await checkAdmin(formData);
                setLoading(false);
                if (res.success) setIsLoggedIn(true);
                else alert("❌ ACCESS DENIED: Incorrect Password");
            }} className="flex flex-col gap-5">
                
                <div className="relative">
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="ENTER PASSWORD_ " 
                        className="w-full p-3 bg-black text-[#00ff41] border border-[#008f11] outline-none focus:border-[#00ff41] focus:shadow-[0_0_10px_#00ff41] font-mono placeholder:text-[#005500] text-xl text-center"
                        autoFocus
                    />
                </div>

                <button 
                    disabled={loading}
                    className="bg-[#008f11] hover:bg-[#00ff41] text-black p-3 font-bold text-lg transition-all uppercase tracking-widest border border-[#00ff41] hover:shadow-[0_0_20px_#00ff41] disabled:opacity-50"
                >
                    {loading ? "Authenticating..." : "Access Mainframe"}
                </button>
            </form>
            
            <p className="text-[#005500] text-xs text-center font-mono">
                {`RESTRICTED AREA // AUTHORIZED PERSONNEL ONLY`}
            </p>
        </div>
      </main>
    );
  }

  // --- GIAO DIỆN VIẾT BÀI (Dashboard UI) ---
  return (
    <main className="min-h-screen p-6 md:p-12 relative pt-24 bg-black">
      <MatrixRain />
      
      <div className="z-10 relative max-w-4xl mx-auto bg-[rgba(5,5,5,0.95)] border border-[#00ff41] shadow-[0_0_40px_rgba(0,255,65,0.15)] overflow-hidden">
        {/* Header trang Admin */}
        <div className="bg-[#001100] p-6 border-b border-[#00ff41] flex justify-between items-center">
             <h1 className="text-2xl md:text-3xl text-[#00ff41] font-mono tracking-widest uppercase">
                {`// Admin_Console`} <span className="animate-pulse">_</span>
             </h1>
             <button onClick={() => setIsLoggedIn(false)} className="text-[#008f11] hover:text-[#ff0000] font-mono text-sm border border-[#008f11] px-3 py-1 hover:border-[#ff0000]">
                [ LOGOUT ]
             </button>
        </div>

        <div className="p-8">
            <h2 className="text-white font-mono mb-6 text-xl border-l-4 border-[#00ff41] pl-3">
                {`// Create New Log Entry`}
            </h2>
            
            <form action={createPost} className="flex flex-col gap-6 font-mono text-[#e0e0e0]">
                
                {/* Tiêu đề */}
                <div className="flex flex-col gap-2">
                    <label className="text-[#00ff41] text-sm uppercase tracking-wider">Title:</label>
                    <input type="text" name="title" required className="w-full p-3 bg-[#111] text-white border border-[#333] focus:border-[#00ff41] outline-none transition-colors" placeholder="Ex: New Project Launch..." />
                </div>

                {/* Chọn Tag */}
                <div className="flex flex-col gap-2">
                    <label className="text-[#00ff41] text-sm uppercase tracking-wider">Target Section:</label>
                    <select name="tag" className="w-full p-3 bg-[#111] text-white border border-[#333] focus:border-[#00ff41] outline-none cursor-pointer">
                        <option value="">-- Select Category --</option>
                        <option value="uni_projects">[ University Projects ]</option>
                        <option value="personal_projects">[ Personal Projects ]</option>
                        <option value="it_events">[ IT Events / Gallery ]</option>
                    </select>
                </div>

                {/* Nội dung */}
                <div className="flex flex-col gap-2">
                    <label className="text-[#00ff41] text-sm uppercase tracking-wider">Content (Markdown supported):</label>
                    <textarea name="content" rows={12} required className="w-full p-3 bg-[#111] text-white border border-[#333] focus:border-[#00ff41] outline-none" placeholder="Write your content here..."></textarea>
                </div>

                {/* Ảnh */}
                <div className="flex flex-col gap-2">
                    <label className="text-[#00ff41] text-sm uppercase tracking-wider">Image URLs:</label>
                    <input type="text" name="images" placeholder="https://..., https://..." className="w-full p-3 bg-[#111] text-white border border-[#333] focus:border-[#00ff41] outline-none" />
                    <p className="text-[10px] text-gray-500 font-sans">* Paste image links separated by commas</p>
                </div>

                <div className="h-[1px] bg-[#333] my-4"></div>

                <button type="submit" className="group relative w-full overflow-hidden bg-[#00ff41] text-black p-4 font-bold text-xl uppercase tracking-[3px] hover:text-white transition-all">
                    <span className="relative z-10">Upload Data</span>
                    <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 z-0"></div>
                </button>
            </form>
        </div>
      </div>
    </main>
  );
}   