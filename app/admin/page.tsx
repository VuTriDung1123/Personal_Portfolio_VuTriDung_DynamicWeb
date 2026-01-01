"use client";

import { createPost, checkAdmin, getAllPosts, deletePost } from "@/lib/actions";
import { useState, useEffect } from "react";
import MatrixRain from "@/components/MatrixRain";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
        getAllPosts().then(setPosts);
    }
  }, [isLoggedIn, loading]);

  const handleLogin = async (formData: FormData) => {
    const res = await checkAdmin(formData);
    if (res.success) setIsLoggedIn(true);
    else alert("ACCESS DENIED!");
  };

  const handleCreate = async (formData: FormData) => {
    setLoading(true);
    await createPost(formData);
    setLoading(false);
    alert("SYSTEM: Post created successfully.");
    const form = document.getElementById("createForm") as HTMLFormElement;
    if(form) form.reset();
  };

  const handleDelete = async (id: string) => {
    if(confirm("DELETE LOG?")) {
        setLoading(true);
        await deletePost(id);
        setLoading(false);
    }
  }

  // --- LOGIN UI ---
  if (!isLoggedIn) {
    return (
      <main className="h-screen flex items-center justify-center relative overflow-hidden bg-black font-mono">
        <MatrixRain />
        {/* SỬA LỖI 1: w-[400px] -> w-100 */}
        <form action={handleLogin} className="z-10 bg-[rgba(10,10,10,0.95)] border border-[#00ff41] p-10 flex flex-col gap-6 w-100 shadow-[0_0_20px_#00ff41]">
            <h1 className="text-[#00ff41] text-3xl text-center font-bold tracking-widest">SYSTEM LOGIN</h1>
            <input name="username" type="text" placeholder="admin" required className="bg-black border border-[#333] text-white p-3 focus:border-[#00ff41] outline-none" />
            <input name="password" type="password" placeholder="••••••" required className="bg-black border border-[#333] text-white p-3 focus:border-[#00ff41] outline-none" />
            <button type="submit" className="bg-[#00ff41] text-black font-bold p-3 mt-2 hover:bg-white uppercase">Authorize</button>
        </form>
      </main>
    );
  }

  // --- DASHBOARD UI ---
  return (
    <main className="min-h-screen bg-black text-white py-10 px-4 font-mono relative flex flex-col items-center">
        <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-20"><MatrixRain /></div>
        
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* CỘT TRÁI: FORM */}
            <div>
                <h1 className="text-2xl text-[#00ff41] mb-4 border-b border-[#333] pb-2 uppercase">Create New Log</h1>
                <form id="createForm" action={handleCreate} className="flex flex-col gap-4 bg-[rgba(20,20,20,0.8)] p-6 border border-[#333]">
                    
                    {/* Title */}
                    <div>
                        <label className="text-[#00ff41] text-xs mb-1 block">TITLE:</label>
                        <input type="text" name="title" required className="w-full p-2 bg-black border border-[#333] focus:border-[#00ff41] outline-none text-white" placeholder="Enter title..." />
                    </div>

                    {/* Tag & Language */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-[#00ff41] text-xs mb-1 block">CATEGORY:</label>
                            <select name="tag" className="w-full p-2 bg-black border border-[#333] focus:border-[#00ff41] outline-none text-white text-sm">
                                <option value="my_confessions">My Confessions</option>
                                <option value="uni_projects">University Projects</option>
                                <option value="personal_projects">Personal Projects</option>
                                <option value="it_events">IT Events</option>
                            </select>
                        </div>
                        
                        <div className="flex-1">
                             <label className="text-[#00ff41] text-xs mb-1 block">LANGUAGE:</label>
                             {/* SỬA LỖI 2: h-[38px] -> h-9.5 */}
                             <div className="flex gap-4 items-center h-9.5">
                                <label className="flex items-center gap-2 cursor-pointer hover:text-[#00ff41]">
                                    <input type="radio" name="language" value="vi" defaultChecked className="accent-[#00ff41]" /> VI
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer hover:text-[#00ff41]">
                                    <input type="radio" name="language" value="en" className="accent-[#00ff41]" /> EN
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer hover:text-[#00ff41]">
                                    <input type="radio" name="language" value="jp" className="accent-[#00ff41]" /> JP
                                </label>
                             </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="text-[#00ff41] text-xs mb-1 block">CONTENT:</label>
                        <textarea name="content" rows={8} required className="w-full p-2 bg-black border border-[#333] focus:border-[#00ff41] outline-none text-white" placeholder="Markdown supported..."></textarea>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="text-[#00ff41] text-xs mb-1 block">IMAGES (Local):</label>
                        <input type="file" name="images" multiple accept="image/*" className="w-full text-xs text-gray-400 file:bg-[#333] file:text-white file:border-0 file:py-1 file:px-2 file:mr-2 hover:file:bg-[#00ff41] hover:file:text-black cursor-pointer" />
                    </div>

                    <button disabled={loading} type="submit" className="bg-[#00ff41] text-black font-bold p-3 mt-2 hover:bg-white transition-all uppercase tracking-widest text-sm">
                        {loading ? "PROCESSING..." : "PUBLISH LOG"}
                    </button>
                </form>
            </div>

            {/* CỘT PHẢI: LIST */}
            <div>
                <h1 className="text-2xl text-red-500 mb-4 border-b border-[#333] pb-2 uppercase">Manage Database</h1>
                {/* SỬA LỖI 3: h-[600px] -> h-150 */}
                <div className="bg-[rgba(20,20,20,0.8)] border border-[#333] h-150 overflow-y-auto p-4 custom-scrollbar">
                    {posts.map((post) => (
                        <div key={post.id} className="mb-3 p-3 border border-[#333] hover:border-[#00ff41] bg-black transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-white font-bold text-sm truncate w-[70%]">{post.title}</h3>
                                <span className="text-[10px] bg-[#333] px-1 py-0.5 rounded text-[#00ff41] uppercase">{post.language || "VI"}</span>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-500 mb-2">
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                <span className="uppercase text-gray-400">{post.tag}</span>
                            </div>
                            <div className="flex gap-2">
                                <a href={`/blog/${post.id}`} target="_blank" className="flex-1 text-center py-1 border border-[#333] text-gray-400 hover:text-[#00ff41] text-xs">VIEW</a>
                                <button onClick={() => handleDelete(post.id)} className="flex-1 text-center py-1 border border-red-900 text-red-500 hover:bg-red-600 hover:text-black text-xs font-bold">DELETE</button>
                            </div>
                        </div>
                    ))}
                    {posts.length === 0 && <p className="text-center text-gray-500 mt-10 text-xs">NO DATA FOUND</p>}
                </div>
            </div>

        </div>
    </main>
  );
}