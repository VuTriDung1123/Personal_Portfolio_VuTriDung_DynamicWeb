"use client";

import { createPost, checkAdmin, getAllPosts, deletePost } from "@/lib/actions";
// ĐÃ XÓA DÒNG IMPORT TỪ LIB/CMS Ở ĐÂY
import { useState, useEffect } from "react";
import MatrixRain from "@/components/MatrixRain";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [posts, setPosts] = useState<any[]>([]);
  
  const refreshData = async () => {
      getAllPosts().then(setPosts);
  }

  useEffect(() => {
    if (isLoggedIn) refreshData();
  }, [isLoggedIn]);

  const handleLogin = async (formData: FormData) => {
    const res = await checkAdmin(formData);
    if (res.success) setIsLoggedIn(true);
    else alert("ACCESS DENIED / SAI MẬT KHẨU");
  };

  const handleCreate = async (formData: FormData) => {
    setLoading(true);
    await createPost(formData);
    setLoading(false);
    alert("Đăng bài thành công!");
    const form = document.getElementById("createForm") as HTMLFormElement;
    if(form) form.reset();
    refreshData();
  };

  const handleDelete = async (id: string) => {
    if(confirm("Bạn chắc chắn muốn xóa bài này?")) {
        setLoading(true);
        await deletePost(id);
        refreshData();
        setLoading(false);
    }
  }

  // --- LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <main className="h-screen flex items-center justify-center relative overflow-hidden bg-black font-mono">
        <MatrixRain />
        <form action={handleLogin} className="z-10 bg-[rgba(5,5,5,0.95)] border border-[#00ff41] p-10 flex flex-col gap-6 w-full max-w-sm shadow-[0_0_30px_#00ff41]">
            <h1 className="text-[#00ff41] text-3xl text-center font-bold tracking-widest mb-2">SYSTEM LOGIN</h1>
            <input name="username" type="text" placeholder="Username" required className="bg-black border border-[#333] text-white p-3 focus:border-[#00ff41] outline-none transition-colors" />
            <input name="password" type="password" placeholder="Password" required className="bg-black border border-[#333] text-white p-3 focus:border-[#00ff41] outline-none transition-colors" />
            <button type="submit" className="bg-[#00ff41] text-black font-bold p-3 mt-2 hover:bg-white hover:tracking-widest transition-all uppercase">Authorize</button>
        </form>
      </main>
    );
  }

  // --- DASHBOARD UI ---
  return (
    <main className="min-h-screen bg-black text-white font-mono relative pb-20">
        <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-20 pointer-events-none"><MatrixRain /></div>
        
        {/* HEADER */}
        <header className="border-b border-[#333] bg-black/90 sticky top-0 z-50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-[#00ff41] font-bold text-xl tracking-widest">:: ADMIN DASHBOARD ::</div>
                <div className="text-gray-500 text-xs">LOGGED IN AS ADMIN</div>
            </div>
        </header>
        
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* LEFT: CREATE POST FORM */}
                <div className="lg:col-span-2">
                    <form id="createForm" action={handleCreate} className="flex flex-col gap-6 bg-[#0a0a0a] p-8 border border-[#333] shadow-lg relative group hover:border-[#00ff41] transition-colors">
                        <div className="absolute top-0 right-0 bg-[#333] text-xs px-2 py-1 text-gray-400 group-hover:bg-[#00ff41] group-hover:text-black">NEW ENTRY</div>
                        
                        <h1 className="text-2xl text-white mb-2 uppercase border-b border-[#333] pb-4">Write New Log</h1>
                        
                        <div>
                            <label className="text-gray-500 text-[10px] uppercase mb-1 block tracking-wider">Title</label>
                            <input type="text" name="title" required className="w-full p-3 bg-black border border-[#333] focus:border-[#00ff41] outline-none text-white transition-all" placeholder="Enter title..." />
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <label className="text-gray-500 text-[10px] uppercase mb-1 block tracking-wider">Category</label>
                                <select name="tag" className="w-full p-3 bg-black border border-[#333] focus:border-[#00ff41] outline-none text-white text-sm">
                                    <option value="my_confessions">My Confessions</option>
                                    <option value="uni_projects">University Projects</option>
                                    <option value="personal_projects">Personal Projects</option>
                                    <option value="it_events">IT Events</option>
                                    <option value="lang_certs">Language Certificates</option>
                                    <option value="tech_certs">Technical Certificates</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="text-gray-500 text-[10px] uppercase mb-1 block tracking-wider">Language</label>
                                <div className="flex items-center gap-4 h-12 bg-black border border-[#333] px-4">
                                    <label className="flex items-center gap-2 cursor-pointer hover:text-[#00ff41] text-sm"><input type="radio" name="language" value="vi" defaultChecked className="accent-[#00ff41]" /> VI</label>
                                    <label className="flex items-center gap-2 cursor-pointer hover:text-[#00ff41] text-sm"><input type="radio" name="language" value="en" className="accent-[#00ff41]" /> EN</label>
                                    <label className="flex items-center gap-2 cursor-pointer hover:text-[#00ff41] text-sm"><input type="radio" name="language" value="jp" className="accent-[#00ff41]" /> JP</label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-gray-500 text-[10px] uppercase mb-1 block tracking-wider">Content</label>
                            <textarea name="content" rows={12} required className="w-full p-3 bg-black border border-[#333] focus:border-[#00ff41] outline-none text-white font-mono text-sm leading-relaxed" placeholder="Write your content here (Markdown supported)..."></textarea>
                        </div>

                        <div>
                            <label className="text-gray-500 text-[10px] uppercase mb-1 block tracking-wider">Attachments</label>
                            <div className="border border-[#333] border-dashed p-6 bg-black text-center hover:border-[#00ff41] transition-colors cursor-pointer relative">
                                <input type="file" name="images" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <span className="text-gray-500 text-sm">Drag & Drop or Click to Upload Images</span>
                            </div>
                        </div>

                        <button disabled={loading} type="submit" className="bg-[#00ff41] text-black font-bold p-4 mt-2 hover:bg-white hover:tracking-widest transition-all uppercase shadow-[0_0_15px_rgba(0,255,65,0.3)]">
                            {loading ? "PROCESSING DATA..." : "PUBLISH LOG ENTRY"}
                        </button>
                    </form>
                </div>

                {/* RIGHT: LIST POSTS */}
                <div className="lg:col-span-1">
                    <div className="bg-[#0a0a0a] border border-[#333] h-[80vh] flex flex-col shadow-lg">
                        <div className="p-4 border-b border-[#333] bg-black">
                            <h2 className="text-[#00ff41] text-xl uppercase font-bold">Database Logs</h2>
                            <p className="text-gray-600 text-xs mt-1">Total entries: {posts.length}</p>
                        </div>
                        
                        <div className="overflow-y-auto p-4 flex-1 custom-scrollbar space-y-3">
                            {posts.map((post) => (
                                <div key={post.id} className="p-3 border border-[#333] bg-black hover:border-[#00ff41] transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-white font-bold text-sm line-clamp-1 w-[80%] group-hover:text-[#00ff41]">{post.title}</h3>
                                        <span className="text-[9px] bg-[#222] px-1 text-gray-400 border border-[#333]">{post.language}</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="text-[10px] text-gray-500">
                                            <div className="uppercase mb-1">{post.tag}</div>
                                            <div>{new Date(post.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <a href={`/blog/${post.id}`} target="_blank" className="text-[10px] text-gray-400 hover:text-white border border-[#333] px-2 py-1">VIEW</a>
                                            <button onClick={() => handleDelete(post.id)} className="text-[10px] text-red-500 border border-red-900 px-2 py-1 hover:bg-red-900 hover:text-white transition-colors">DEL</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
}