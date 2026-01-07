"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import { translations, Lang } from "@/lib/data";
import { getAllPosts } from "@/lib/actions";

export default function BlogListingPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentLang, setCurrentLang] = useState<Lang>("en");
    
    const [selectedTag, setSelectedTag] = useState("all");
    const [sortOrder, setSortOrder] = useState("newest");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = translations[currentLang] as any;
    
    useEffect(() => {
        getAllPosts().then((data) => {
            setPosts(data);
            setLoading(false);
        });
    }, []);

    const filteredPosts = useMemo(() => {
        let result = [...posts];
        if (selectedTag !== "all") {
            result = result.filter(post => post.tag === selectedTag);
        }
        result.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
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
        <main className="min-h-screen relative font-mono text-gray-800 dark:text-white">
            <TopNav t={t} currentLang={currentLang} setCurrentLang={setCurrentLang} />
            
            <div className="pt-32 px-6 md:px-10 max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-5xl text-pink-600 dark:text-[#00ff41] border-l-8 border-pink-600 dark:border-[#00ff41] pl-6 mb-8 uppercase tracking-widest drop-shadow-sm">
                    SYSTEM LOGS <span className="text-gray-500 dark:text-white text-lg block md:inline md:ml-4">{"// ARCHIVE_DATABASE"}</span>
                </h1>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 mb-10 bg-white/80 dark:bg-[rgba(10,10,10,0.8)] p-4 border border-pink-200 dark:border-[#333] shadow-lg backdrop-blur-sm">
                    <div className="flex-1">
                        <label className="text-gray-500 text-xs block mb-1 uppercase">{"// Filter by Category:"}</label>
                        <select 
                            value={selectedTag} 
                            onChange={(e) => setSelectedTag(e.target.value)}
                            className="w-full bg-white dark:bg-black text-pink-600 dark:text-[#00ff41] border border-gray-300 dark:border-[#333] p-2 focus:border-pink-500 dark:focus:border-[#00ff41] outline-none uppercase text-sm"
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

                    <div className="flex-1 md:max-w-xs">
                        <label className="text-gray-500 text-xs block mb-1 uppercase">{"// Sort by Date:"}</label>
                        <select 
                            value={sortOrder} 
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="w-full bg-white dark:bg-black text-pink-600 dark:text-[#00ff41] border border-gray-300 dark:border-[#333] p-2 focus:border-pink-500 dark:focus:border-[#00ff41] outline-none uppercase text-sm"
                        >
                            <option value="newest">Newest First (▼)</option>
                            <option value="oldest">Oldest First (▲)</option>
                        </select>
                    </div>

                    <div className="flex items-end pb-2">
                        <span className="text-gray-500 dark:text-gray-400 text-xs font-mono">
                            Found: <strong className="text-black dark:text-white">{filteredPosts.length}</strong> logs
                        </span>
                    </div>
                </div>

                {/* Post Grid */}
                {loading ? (
                    <div className="text-center py-20 animate-pulse text-pink-600 dark:text-[#00ff41]">LOADING DATA...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => (
                                <Link key={post.id} href={`/blog/${post.id}`} className="group block bg-white/90 dark:bg-[rgba(10,10,10,0.8)] border border-pink-200 dark:border-[#333] hover:border-pink-500 dark:hover:border-[#00ff41] transition-all overflow-hidden shadow-md hover:-translate-y-1">
                                    <div className="h-48 overflow-hidden border-b border-pink-100 dark:border-[#333] relative">
                                        <img 
                                            src={getCoverImage(post.images)} 
                                            alt={post.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                                        />
                                        <div className="absolute top-0 right-0 flex">
                                            <span className="bg-pink-500 dark:bg-[#00ff41] text-white dark:text-black text-xs font-bold px-2 py-1 uppercase">
                                                {post.tag || "LOG"}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6">
                                        <h3 className="text-xl text-gray-800 dark:text-white font-bold mb-3 group-hover:text-pink-600 dark:group-hover:text-[#00ff41] truncate font-mono">
                                            {post.title}
                                        </h3>
                                        <div className="flex justify-between text-gray-500 text-xs mb-4 font-sans border-b border-gray-200 dark:border-[#222] pb-3">
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                            <span className="font-mono">ID: {post.id.substring(0,6)}</span>
                                        </div>
                                        <div className="flex items-center justify-end">
                                            <span className="text-pink-600 dark:text-[#00ff41] text-xs font-bold tracking-widest border border-pink-500 dark:border-[#00ff41] px-2 py-1 group-hover:bg-pink-500 dark:group-hover:bg-[#00ff41] group-hover:text-white dark:group-hover:text-black transition-all">
                                                ACCESS_DATA &gt;&gt;
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-gray-500 col-span-3 text-center py-20 border-2 border-dashed border-gray-300 dark:border-[#333]">NO LOGS FOUND</div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}