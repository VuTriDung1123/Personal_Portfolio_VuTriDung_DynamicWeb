"use client";


import { useState, useEffect } from "react";
import { checkAdmin, createPost, deletePost, getAllPosts, updatePost, getSectionContent, saveSectionContent } from "@/lib/actions";

// 1. Định nghĩa kiểu dữ liệu để tránh lỗi "Unexpected any"
interface Post {
  id: string;
  title: string;
  tag: string;
  language: string;
  content: string;
  images: string;
}

interface SectionData {
  contentEn: string;
  contentVi: string;
  contentJp: string;
}

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<'blog' | 'content'>('blog');

  // --- STATES CHO BLOG ---
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [tag, setTag] = useState("my_confessions");
  const [images, setImages] = useState<string[]>([]);

  // --- STATES CHO SECTION CONTENT ---
  const [sectionKey, setSectionKey] = useState("about");
  const [secEn, setSecEn] = useState("");
  const [secVi, setSecVi] = useState("");
  const [secJp, setSecJp] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    // Load Blog
    getAllPosts().then((data) => setPosts(data as unknown as Post[]));
  }, []);

  // 2. Sửa lỗi "setState synchronously within an effect"
  useEffect(() => {
    if (activeTab === 'content') {
        const fetchSection = async () => {
            setMsg("Loading...");
            try {
                const data = await getSectionContent(sectionKey);
                if (data) {
                    // Ép kiểu dữ liệu trả về
                    const typedData = data as unknown as SectionData;
                    setSecEn(typedData.contentEn || "");
                    setSecVi(typedData.contentVi || "");
                    setSecJp(typedData.contentJp || "");
                    setMsg("Loaded data from DB.");
                } else {
                    setSecEn(""); setSecVi(""); setSecJp("");
                    setMsg("No data in DB yet (Will create new).");
                }
            } catch (error) {
                console.error(error); // 3. Sửa lỗi 'error' defined but never used
                setMsg("Error loading data.");
            }
        };
        fetchSection();
    }
  }, [sectionKey, activeTab]);

  // --- LOGIC AUTH ---
  async function handleLogin(formData: FormData) {
    const res = await checkAdmin(formData);
    if (res.success) setIsAuth(true);
    else alert("Sai mật khẩu!");
  }

  // --- LOGIC BLOG ---
  const addLinkField = () => setImages([...images, ""]);
  const removeLinkField = (index: number) => { const newImg = [...images]; newImg.splice(index, 1); setImages(newImg); };
  const updateLinkField = (index: number, val: string) => { const newImg = [...images]; newImg[index] = val; setImages(newImg); };

  async function handleBlogSubmit(formData: FormData) {
    const jsonImages = JSON.stringify(images.filter(img => img.trim() !== ""));
    formData.set("images", jsonImages);

    if (editingPost) {
        await updatePost(formData);
        alert("Cập nhật bài viết thành công!");

        setEditingPost(null);
    } else {
        await createPost(formData);
        alert("POST CREATED!");
    }
    setImages([]);
    const updated = await getAllPosts();
    setPosts(updated as unknown as Post[]);
  }

  function startEdit(post: Post) {
    setEditingPost(post);
    setTag(post.tag);
    try { setImages(JSON.parse(post.images)); } catch { setImages([]); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: string) {
    if(!confirm("Xóa thật hả?")) return;
    await deletePost(id);
    const updated = await getAllPosts();
    setPosts(updated as unknown as Post[]);
  }

  // --- LOGIC SECTION CONTENT ---
  async function handleSectionSubmit(formData: FormData) {
    setMsg("Saving...");
    const res = await saveSectionContent(formData);
    if (res.success) setMsg("Saved successfully!");
    else setMsg("Error saving!");
  }

  if (!isAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-[#00ff41] font-mono">
        <form action={handleLogin} className="border border-[#00ff41] p-10 shadow-[0_0_20px_#00ff41]">
          <h1 className="text-2xl mb-5 text-center">ACCESS CONTROL</h1>
          <input name="username" placeholder="User" className="block w-full bg-black border border-[#00ff41] p-2 mb-3 text-white outline-none" />
          <input name="password" type="password" placeholder="Pass" className="block w-full bg-black border border-[#00ff41] p-2 mb-3 text-white outline-none" />
          <button className="w-full bg-[#00ff41] text-black font-bold p-2 hover:bg-white transition">LOGIN</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono p-10">
      <div className="flex justify-between items-center mb-8 border-b border-[#00ff41] pb-4">
        <h1 className="text-4xl text-[#00ff41]">ADMIN DASHBOARD</h1>
        <div className="flex gap-4">
            <button 
                onClick={() => setActiveTab('blog')}
                className={`px-4 py-2 border ${activeTab === 'blog' ? 'bg-[#00ff41] text-black font-bold' : 'text-[#00ff41] border-[#00ff41]'}`}
            >
                BLOG MANAGER
            </button>
            <button 
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2 border ${activeTab === 'content' ? 'bg-[#00ff41] text-black font-bold' : 'text-[#00ff41] border-[#00ff41]'}`}
            >
                EDIT SECTIONS
            </button>
        </div>
      </div>

      {/* --- TAB 1: BLOG MANAGER --- */}
      {activeTab === 'blog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* FORM */}
            <div className={`p-5 border-2 ${editingPost ? 'border-yellow-400 shadow-[0_0_15px_yellow]' : 'border-[#00ff41] shadow-[0_0_10px_#00ff41]'} bg-black/50 h-fit sticky top-10`}>
                <h2 className={`text-2xl mb-5 border-b pb-2 ${editingPost ? 'text-yellow-400' : 'text-[#00ff41]'}`}>
                    {editingPost ? `>> EDITING MODE: [${editingPost.id.substring(0,5)}...]` : ">> NEW ENTRY"}
                </h2>
                
                <form action={handleBlogSubmit} className="flex flex-col gap-4">
                    {editingPost && <input type="hidden" name="id" value={editingPost.id} />}
                    
                    <input name="title" placeholder="Title..." defaultValue={editingPost?.title} required className="bg-[#111] border border-[#333] p-2 text-white outline-none focus:border-[#00ff41]" />
                    
                    <select name="tag" value={tag} onChange={e => setTag(e.target.value)} className="bg-[#111] border border-[#333] p-2 text-white outline-none focus:border-[#00ff41]">
                        <option value="my_confessions">My Confessions</option>
                        <option value="uni_projects">University Projects</option>
                        <option value="personal_projects">Personal Projects</option>
                        <option value="achievements">Achievements (Thành tựu)</option>
                        <option value="it_events">IT Events</option>
                        <option value="lang_certs">Language Certificates</option>
                        <option value="tech_certs">Technical Certificates</option>
                    </select>

                    <select name="language" defaultValue={editingPost?.language || "vi"} className="bg-[#111] border border-[#333] p-2 text-white outline-none focus:border-[#00ff41]">
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                        <option value="jp">Japanese</option>
                    </select>

                    <textarea name="content" placeholder="Content (Markdown supported)..." defaultValue={editingPost?.content} rows={10} required className="bg-[#111] border border-[#333] p-2 text-white outline-none focus:border-[#00ff41] font-mono text-sm" />

                    {/* Image Links Manager */}
                    <div className="border border-[#333] p-3">
                        <label className="text-sm text-[#00ff41] block mb-2">IMAGE LINKS (Direct URL)</label>
                        {images.map((link, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <input 
                                    value={link} 
                                    onChange={(e) => updateLinkField(idx, e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="flex-1 bg-[#111] border border-[#333] p-1 text-xs text-white"
                                />
                                <button type="button" onClick={() => removeLinkField(idx)} className="text-red-500 font-bold px-2">X</button>
                            </div>
                        ))}
                        <button type="button" onClick={addLinkField} className="text-xs bg-[#222] text-[#aaa] px-2 py-1 hover:text-white">+ Add Image Slot</button>
                    </div>

                    <div className="flex gap-2 mt-2">
                        <button type="submit" className={`flex-1 font-bold py-2 ${editingPost ? 'bg-yellow-600 text-white' : 'bg-[#00ff41] text-black'} hover:opacity-90`}>
                            {editingPost ? "UPDATE DATA" : "UPLOAD TO SERVER"}
                        </button>
                        {editingPost && (
                            <button type="button" onClick={() => {setEditingPost(null); setImages([]); setTag("my_confessions");}} className="bg-gray-700 text-white px-4 py-2">
                                CANCEL
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* LIST */}
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl text-[#00ff41] border-b border-[#00ff41] pb-2">DATABASE LOGS</h2>
                {posts.map(post => (
                    <div key={post.id} className="bg-[#0a0a0a] border border-[#333] p-4 hover:border-[#00ff41] transition group">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-white group-hover:text-[#00ff41]">{post.title}</h3>
                                <div className="text-xs text-gray-500 mt-1">
                                    Tag: <span className="text-[#008f11]">{post.tag}</span> | 
                                    Lang: {post.language} | 
                                    ID: {post.id.substring(0, 8)}...
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => startEdit(post)} className="text-yellow-500 hover:underline text-sm">[EDIT]</button>
                                <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:underline text-sm">[DEL]</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* --- TAB 2: SECTION EDIT MANAGER --- */}
      {activeTab === 'content' && (
        <div className="max-w-4xl mx-auto border border-[#00ff41] p-6 bg-black/80 shadow-[0_0_20px_rgba(0,255,65,0.2)]">
            <h2 className="text-2xl text-[#00ff41] mb-6 flex justify-between">
                <span>EDIT STATIC SECTIONS</span>
                <span className="text-sm text-gray-400 normal-case">{msg}</span>
            </h2>

            <form action={handleSectionSubmit} className="flex flex-col gap-6">
                
                {/* 1. Chọn Section muốn sửa */}
                <div>
                    <label className="block text-[#00ff41] mb-2 font-bold">SELECT SECTION TO EDIT:</label>
                    <select 
                        name="sectionKey" 
                        value={sectionKey} 
                        onChange={(e) => setSectionKey(e.target.value)}
                        className="w-full bg-[#111] border border-[#00ff41] p-3 text-xl text-white outline-none"
                    >
                        <option value="about">01. ABOUT ME</option>
                        <option value="career">04. CAREER GOALS</option>
                        <option value="skills">06. SKILLS</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* ENGLISH */}
                    <div>
                        <label className="block text-gray-400 mb-1 text-sm">Content (English)</label>
                        <textarea 
                            name="contentEn" 
                            value={secEn}
                            onChange={e => setSecEn(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] p-3 text-white h-60 focus:border-[#00ff41]" 
                            placeholder="Write in English..."
                        />
                    </div>
                    {/* VIETNAMESE */}
                    <div>
                        <label className="block text-gray-400 mb-1 text-sm">Content (Vietnamese)</label>
                        <textarea 
                            name="contentVi" 
                            value={secVi}
                            onChange={e => setSecVi(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] p-3 text-white h-60 focus:border-[#00ff41]" 
                            placeholder="Viết tiếng Việt..."
                        />
                    </div>
                    {/* JAPANESE */}
                    <div>
                        <label className="block text-gray-400 mb-1 text-sm">Content (Japanese)</label>
                        <textarea 
                            name="contentJp" 
                            value={secJp}
                            onChange={e => setSecJp(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] p-3 text-white h-60 focus:border-[#00ff41]" 
                            placeholder="日本語..."
                        />
                    </div>
                </div>

                <button type="submit" className="w-full bg-[#00ff41] text-black font-bold py-3 text-xl hover:opacity-90 shadow-[4px_4px_0_#008f11] active:translate-y-1 active:shadow-none transition">
                    SAVE CHANGES TO DATABASE
                </button>
            </form>
        </div>
      )}

    </div>
  );
}