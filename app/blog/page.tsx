"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllPosts } from "@/lib/actions";
import MatrixRain from "@/components/MatrixRain"; // [MỚI] Import Matrix Rain

// --- TYPES ---
type Post = { 
    id: string; 
    title: string; 
    images: string; 
    createdAt: Date | string; 
    tag?: string; 
    language?: string; 
    content?: string; 
};

// --- DATA: TAGS ---
const ALL_TAGS = [
    { value: "ALL", label: "ALL" },
    { value: "uni_projects", label: "UNI PROJECTS" },
    { value: "personal_projects", label: "PERSONAL PROJECTS" },
    { value: "it_events", label: "IT EVENTS" },
    { value: "lang_certs", label: "LANG CERTS" },
    { value: "tech_certs", label: "TECH CERTS" },
    { value: "achievements", label: "ACHIEVEMENTS" }
];

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Fetch Data
  useEffect(() => {
    getAllPosts().then((data) => {
        if (data) setPosts(data as unknown as Post[]);
        setTimeout(() => setIsLoading(false), 800); // Giả lập loading chút cho ngầu
    });
  }, []);

  // Filter Logic
  const filteredPosts = posts.filter(post => {
      const matchSearch = post.title.toLowerCase().includes(search.toLowerCase());
      const matchTag = selectedTag === "ALL" || post.tag === selectedTag;
      return matchSearch && matchTag;
  }).sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
  });

  const getCover = (json: string) => { 
      try { const arr = JSON.parse(json); return (arr.length > 0 && arr[0]) ? arr[0] : "https://placehold.co/600x400/000/00ff41?text=NO+IMAGE"; } catch { return "https://placehold.co/600x400/000/00ff41?text=ERROR"; } 
  };

  return (
    <main style={{
        minHeight: '100vh',
        fontFamily: "'VT323', monospace", // Font Pixel
        color: '#e0e0e0',
        position: 'relative'
    }}>
        {/* [MỚI] 1. NỀN MATRIX RAIN */}
        <div style={{position: 'fixed', inset: 0, zIndex: -1}}>
            <MatrixRain />
        </div>

        {/* Nút Back về Home */}
        <div style={{position: 'fixed', top: '20px', left: '20px', zIndex: 50}}>
            <Link href="/" style={{
                background: 'rgba(0,0,0,0.8)', border: '1px solid #00ff41', color: '#00ff41',
                padding: '8px 16px', fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'none',
                boxShadow: '0 0 10px rgba(0,255,65,0.3)', display: 'block'
            }}>
                &lt;&lt; HOME_SYSTEM
            </Link>
        </div>

        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '100px 20px 50px'}}>
            
            {/* Header */}
            <div style={{textAlign: 'center', marginBottom: '50px'}}>
                <h1 style={{
                    fontSize: '4rem', color: '#00ff41', textShadow: '2px 2px 0 #008f11', 
                    marginBottom: '10px', lineHeight: 1
                }}>
                    SYSTEM_LOGS // ARCHIVE
                </h1>
                <p style={{fontSize: '1.5rem', color: '#bbb'}}>
                    &lt; Accessing global database of projects & activities... /&gt;
                </p>
            </div>

            {/* --- BỘ LỌC (STYLE HACKER) --- */}
            <div style={{
                marginBottom: '50px', padding: '25px',
                background: 'rgba(5, 10, 5, 0.9)', border: '1px solid #00ff41',
                display: 'flex', flexDirection: 'column', gap: '20px',
                boxShadow: '0 0 20px rgba(0,255,65,0.1)'
            }}>
                {/* Dòng 1: Search & Sort */}
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'space-between', alignItems: 'center'}}>
                    {/* Search Input */}
                    <div style={{flex: 1, minWidth: '250px'}}>
                        <input 
                            type="text" 
                            placeholder="[SEARCH_QUERY]..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 20px', 
                                background: 'black', border: '1px solid #00ff41', color: '#00ff41',
                                fontSize: '1.2rem', fontFamily: 'inherit', outline: 'none'
                            }}
                        />
                    </div>

                    {/* Sort Toggle */}
                    <button 
                        onClick={() => setSortOrder(prev => prev === "newest" ? "oldest" : "newest")}
                        style={{
                            padding: '12px 25px', background: 'black', border: '1px solid #00ff41',
                            color: '#00ff41', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem',
                            display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit'
                        }}
                    >
                        {sortOrder === "newest" ? "▼ NEWEST_FIRST" : "▲ OLDEST_FIRST"}
                    </button>
                </div>

                {/* Dòng 2: Tags Filter */}
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center'}}>
                    {ALL_TAGS.map(tag => (
                        <button
                            key={tag.value}
                            onClick={() => setSelectedTag(tag.value)}
                            style={{
                                padding: '6px 14px', border: '1px solid #00ff41',
                                cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold',
                                transition: 'all 0.2s', fontFamily: 'inherit',
                                background: selectedTag === tag.value ? '#00ff41' : 'transparent',
                                color: selectedTag === tag.value ? 'black' : '#00ff41',
                                boxShadow: selectedTag === tag.value ? '0 0 10px #00ff41' : 'none'
                            }}
                        >
                            [{tag.label}]
                        </button>
                    ))}
                </div>
            </div>

            {/* --- DANH SÁCH BÀI VIẾT --- */}
            {isLoading ? (
                <div style={{textAlign: 'center', color: '#00ff41', fontSize: '2rem', padding: '50px'}}>
                    LOADING_DATA... <span className="cursor-blink">_</span>
                </div>
            ) : (
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px'}}>
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                            <Link key={post.id} href={`/blog/${post.id}`} style={{display: 'block', textDecoration: 'none'}}>
                                <div className="card" style={{
                                    height: '100%', display: 'flex', flexDirection: 'column', 
                                    background: 'rgba(10,10,10,0.95)', border: '1px solid #008f11',
                                    transition: '0.3s', position: 'relative'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.borderColor = '#00ff41';
                                    e.currentTarget.style.boxShadow = '0 0 15px rgba(0,255,65,0.3)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = '#008f11';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                                >
                                    
                                    {/* Ảnh Thumbnail */}
                                    <div style={{height: '200px', overflow: 'hidden', position: 'relative', borderBottom: '1px solid #008f11'}}>
                                        <img 
                                            src={getCover(post.images)} 
                                            alt={post.title} 
                                            style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', filter: 'contrast(1.1)'}} 
                                        />
                                        {post.language && (
                                            <div style={{
                                                position: 'absolute', top: 0, right: 0, 
                                                background: 'black', color: '#00ff41', 
                                                padding: '4px 8px', fontSize: '0.8rem', fontWeight: 'bold',
                                                borderLeft: '1px solid #00ff41', borderBottom: '1px solid #00ff41'
                                            }}>
                                                {post.language.toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    {/* Nội dung tóm tắt */}
                                    <div style={{padding: '20px', flex: 1, display: 'flex', flexDirection: 'column'}}>
                                        <span style={{fontSize: '0.9rem', color: '#008f11', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px'}}>
                                            //{ALL_TAGS.find(t => t.value === post.tag)?.label || post.tag}
                                        </span>
                                        <h3 style={{fontSize: '1.4rem', color: 'white', marginBottom: '10px', lineHeight: '1.2', fontWeight: 'bold'}}>
                                            {post.title}
                                        </h3>
                                        
                                        <div style={{marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: '#888', borderTop:'1px dashed #333', paddingTop:'15px'}}>
                                            <span>
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </span>
                                            <span style={{color: '#00ff41', fontWeight: 'bold'}}>
                                                &gt;&gt; ACCESS_LOG
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div style={{
                            textAlign: 'center', gridColumn: '1 / -1', padding: '60px', 
                            background: 'rgba(5,5,5,0.9)', border: '1px dashed #00ff41', color: '#00ff41'
                        }}>
                            <div style={{fontSize: '3rem', marginBottom: '10px'}}>🚫</div>
                            <p style={{fontSize: '1.5rem'}}>NO_DATA_FOUND_IN_ARCHIVE</p>
                            <button onClick={() => {setSearch(""); setSelectedTag("ALL");}} style={{marginTop: '15px', background: 'none', border: '1px solid #00ff41', padding: '5px 15px', color: '#00ff41', cursor: 'pointer', fontSize: '1.1rem', fontFamily: 'inherit'}}>
                                [RESET_FILTER]
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    </main>
  );
}