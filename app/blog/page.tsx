"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import MatrixRain from "@/components/MatrixRain";
import TopNav from "@/components/TopNav";
import { translations, Lang } from "@/lib/data";
import { getAllPosts } from "@/lib/actions";

export default function BlogListingPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentLang, setCurrentLang] = useState<Lang>("en");
    
    // --- STATE CHO BỘ LỌC & SẮP XẾP ---
    const [selectedTag, setSelectedTag] = useState("all");
    const [sortOrder, setSortOrder] = useState("newest");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = translations[currentLang] as any;
    
    // 1. Lấy dữ liệu ban đầu
    useEffect(() => {
        getAllPosts().then((data) => {
            setPosts(data);
            setLoading(false);
        });
    }, []);

    // 2. SỬA LỖI: Dùng useMemo thay vì useEffect để lọc dữ liệu
    // Logic này sẽ chạy tự động khi posts, selectedTag hoặc sortOrder thay đổi
    const filteredPosts = useMemo(() => {
        let result = [...posts];

        // Lọc theo Tag
        if (selectedTag !== "all") {
            result = result.filter(post => post.tag === selectedTag);
        }

        // Sắp xếp theo ngày
        result.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            if (sortOrder === "newest") return dateB - dateA;
            return dateA - dateB;
        });

        return result;
    }, [posts, selectedTag, sortOrder]);

    const getCoverImage = (jsonString: string) => {
        try {
            const arr = JSON.parse(jsonString);
            return arr.length > 0 ? arr[0] : "https://placehold.co/300x200/000/00ff41?text=No+Image";
        } catch {
            return "https://placehold.co/300x200/000/00ff41?text=Error";
        }
    };

    return (
        <main className="min-h-screen relative font-mono bg-black text-white selection:bg-[#00ff41] selection:text-black">
            
            <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-50 pointer-events-none">
                <MatrixRain />
            </div>
            
            <TopNav t={t} currentLang={currentLang} setCurrentLang={setCurrentLang} />
            
            <div className="pt-32 px-6 md:px-10 max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-5xl text-[#00ff41] border-l-8 border-[#00ff41] pl-6 mb-8 uppercase tracking-widest drop-shadow-[0_0_10px_#00ff41]">
                    SYSTEM LOGS <span className="text-white text-lg block md:inline md:ml-4">{"// ARCHIVE_DATABASE"}</span>
                </h1>

                {/* --- THANH CÔNG CỤ LỌC & SẮP XẾP --- */}
                <div className="flex flex-col md:flex-row gap-4 mb-10 bg-[rgba(10,10,10,0.8)] p-4 border border-[#333]">
                    
                    {/* Bộ lọc TAG */}
                    <div className="flex-1">
                        {/* SỬA LỖI: Bọc chuỗi // trong ngoặc nhọn */}
                        <label className="text-gray-500 text-xs block mb-1 uppercase">{"// Filter by Category:"}</label>
                        <select 
                            value={selectedTag} 
                            onChange={(e) => setSelectedTag(e.target.value)}
                            className="w-full bg-black text-[#00ff41] border border-[#333] p-2 focus:border-[#00ff41] outline-none uppercase text-sm"
                        >
                            <option value="all">:: ALL CATEGORIES ::</option>
                            <option value="my_confessions">My Confessions</option>
                            <option value="uni_projects">University Projects</option>
                            <option value="personal_projects">Personal Projects</option>
                            <option value="it_events">IT Events</option>
                            <option value="lang_certs">Language Certificates</option>
                            <option value="tech_certs">Technical Certificates</option>
                        </select>
                    </div>

                    {/* Bộ lọc SẮP XẾP */}
                    <div className="flex-1 md:max-w-xs">
                        {/* SỬA LỖI: Bọc chuỗi // trong ngoặc nhọn */}
                        <label className="text-gray-500 text-xs block mb-1 uppercase">{"// Sort by Date:"}</label>
                        <select 
                            value={sortOrder} 
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="w-full bg-black text-[#00ff41] border border-[#333] p-2 focus:border-[#00ff41] outline-none uppercase text-sm"
                        >
                            <option value="newest">Newest First (▼)</option>
                            <option value="oldest">Oldest First (▲)</option>
                        </select>
                    </div>

                    {/* Hiển thị số lượng kết quả */}
                    <div className="flex items-end pb-2">
                        <span className="text-gray-400 text-xs font-mono">
                            Found: <strong className="text-white">{filteredPosts.length}</strong> logs
                        </span>
                    </div>
                </div>

                {/* --- DANH SÁCH BÀI VIẾT --- */}
                {loading ? (
                    <div className="text-center py-20 animate-pulse">
                        <div className="text-[#00ff41] text-2xl mb-2">&gt; ESTABLISHING CONNECTION...</div>
                        <div className="text-gray-500 text-sm">Decryption key accepted. Loading data packets.</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => (
                                <Link key={post.id} href={`/blog/${post.id}`} className="group block bg-[rgba(10,10,10,0.8)] border border-[#333] hover:border-[#00ff41] transition-all overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.8)] hover:shadow-[0_0_20px_rgba(0,255,65,0.2)] hover:-translate-y-1 duration-300">
                                    <div className="h-48 overflow-hidden border-b border-[#333] group-hover:border-[#00ff41] relative">
                                        <img 
                                            src={getCoverImage(post.images)} 
                                            alt={post.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100 grayscale group-hover:grayscale-0" 
                                        />
                                        <div className="absolute top-0 right-0 flex">
                                            <span className="bg-[#333] text-white text-xs font-bold px-2 py-1 uppercase border-r border-black">
                                                {post.language || "VI"}
                                            </span>
                                            <span className="bg-[#00ff41] text-black text-xs font-bold px-2 py-1 uppercase">
                                                {post.tag || "LOG"}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6">
                                        <h3 className="text-xl text-white font-bold mb-3 group-hover:text-[#00ff41] truncate font-mono tracking-wide">
                                            {post.title}
                                        </h3>
                                        <div className="flex justify-between text-gray-500 text-xs mb-4 font-sans border-b border-[#222] pb-3">
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                            <span className="font-mono">ID: {post.id.substring(0,6)}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm line-clamp-3 mb-5 h-15 font-sans leading-relaxed">
                                            {post.content}
                                        </p>
                                        <div className="flex items-center justify-end">
                                            <span className="text-[#00ff41] text-xs group-hover:underline font-bold tracking-widest bg-[rgba(0,255,65,0.1)] px-2 py-1 border border-[#00ff41] group-hover:bg-[#00ff41] group-hover:text-black transition-all">
                                                ACCESS_DATA &gt;&gt;
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-gray-500 col-span-3 text-center py-20 border-2 border-dashed border-[#333] bg-[rgba(0,0,0,0.5)]">
                                <p className="text-xl mb-2">[SYSTEM MESSAGE]: NO LOGS MATCHING FILTER</p>
                                <p className="text-sm opacity-60">Try changing the category or reset filters.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}