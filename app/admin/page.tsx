"use client";

import { createPost, checkAdmin, getAllPosts, deletePost } from "@/lib/actions";
import { saveSiteContent, getAllSiteContent } from "@/lib/cms"; // Import từ file mới
import { useState, useEffect, ChangeEvent } from "react";
import MatrixRain from "@/components/MatrixRain";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [posts, setPosts] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [siteContent, setSiteContent] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState<'blog' | 'content'>('blog');
  const [editLang, setEditLang] = useState("vi"); 
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  // 1. KHAI BÁO HÀM NÀY LÊN TRƯỚC USE EFFECT
  const refreshData = async () => {
      getAllPosts().then(setPosts);
      getAllSiteContent().then(setSiteContent);
  }

  // 2. SAU ĐÓ MỚI GỌI
  useEffect(() => {
    if (isLoggedIn) {
        refreshData();
    }
  }, [isLoggedIn]);

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
    setSelectedFiles([]);
    refreshData();
  };

  const handleDelete = async (id: string) => {
    if(confirm("DELETE LOG?")) {
        setLoading(true);
        await deletePost(id);
        refreshData();
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const fileNames = Array.from(e.target.files).map(file => file.name);
        setSelectedFiles(fileNames);
    }
  };

  const handleSaveContent = async (formData: FormData) => {
      setLoading(true);
      await saveSiteContent(formData);
      setLoading(false);
      alert("SYSTEM: Content updated successfully!");
      refreshData();
  }

  const getValue = (key: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const item = siteContent.find((i: any) => i.key === key && i.language === editLang);
      return item ? item.value : "";
  }

  if (!isLoggedIn) {
    return (
      <main className="h-screen flex items-center justify-center relative overflow-hidden bg-black font-mono">
        <MatrixRain />
        <form action={handleLogin} className="z-10 bg-[rgba(10,10,10,0.95)] border border-[#00ff41] p-10 flex flex-col gap-6 w-100 shadow-[0_0_20px_#00ff41]">
            <h1 className="text-[#00ff41] text-3xl text-center font-bold tracking-widest">SYSTEM LOGIN</h1>
            <input name="username" type="text" placeholder="admin" required className="bg-black border border-[#333] text-white p-3 focus:border-[#00ff41] outline-none" />
            <input name="password" type="password" placeholder="••••••" required className="bg-black border border-[#333] text-white p-3 focus:border-[#00ff41] outline-none" />
            <button type="submit" className="bg-[#00ff41] text-black font-bold p-3 mt-2 hover:bg-white uppercase">Authorize</button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white py-10 px-4 font-mono relative flex flex-col items-center">
        <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-20"><MatrixRain /></div>
        
        <div className="w-full max-w-6xl">
            <div className="flex gap-4 mb-8 border-b border-[#333] pb-4">
                <button onClick={() => setActiveTab('blog')} className={`px-6 py-2 font-bold uppercase ${activeTab === 'blog' ? 'bg-[#00ff41] text-black' : 'bg-[#111] text-gray-500 hover:text-white'}`}>
                    1. Manage Logs
                </button>
                <button onClick={() => setActiveTab('content')} className={`px-6 py-2 font-bold uppercase ${activeTab === 'content' ? 'bg-[#00ff41] text-black' : 'bg-[#111] text-gray-500 hover:text-white'}`}>
                    2. Edit Page Content
                </button>
            </div>

            {activeTab === 'blog' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div>
                        <h1 className="text-2xl text-[#00ff41] mb-4 uppercase">Create New Log</h1>
                        <form id="createForm" action={handleCreate} className="flex flex-col gap-4 bg-[rgba(20,20,20,0.8)] p-6 border border-[#333]">
                            <div><label className="text-[#00ff41] text-xs mb-1 block">TITLE:</label><input type="text" name="title" required className="w-full p-2 bg-black border border-[#333] focus:border-[#00ff41] outline-none text-white" placeholder="Enter title..." /></div>
                            <div className="flex gap-4">
                                <div className="flex-1"><label className="text-[#00ff41] text-xs mb-1 block">CATEGORY:</label>
                                    <select name="tag" className="w-full p-2 bg-black border border-[#333] focus:border-[#00ff41] outline-none text-white text-sm">
                                        <option value="my_confessions">My Confessions</option>
                                        <option value="uni_projects">University Projects</option>
                                        <option value="personal_projects">Personal Projects</option>
                                        <option value="it_events">IT Events</option>
                                        <option value="lang_certs">Language Certificates</option>
                                        <option value="tech_certs">Technical Certificates</option>
                                    </select>
                                </div>
                                <div className="flex-1"><label className="text-[#00ff41] text-xs mb-1 block">LANGUAGE:</label>
                                     <div className="flex gap-4 items-center h-9.5">
                                        <label className="flex items-center gap-2 cursor-pointer hover:text-[#00ff41]"><input type="radio" name="language" value="vi" defaultChecked className="accent-[#00ff41]" /> VI</label>
                                        <label className="flex items-center gap-2 cursor-pointer hover:text-[#00ff41]"><input type="radio" name="language" value="en" className="accent-[#00ff41]" /> EN</label>
                                        <label className="flex items-center gap-2 cursor-pointer hover:text-[#00ff41]"><input type="radio" name="language" value="jp" className="accent-[#00ff41]" /> JP</label>
                                     </div>
                                </div>
                            </div>
                            <div><label className="text-[#00ff41] text-xs mb-1 block">CONTENT:</label><textarea name="content" rows={8} required className="w-full p-2 bg-black border border-[#333] focus:border-[#00ff41] outline-none text-white" placeholder="Markdown supported..."></textarea></div>
                            <div>
                                <label className="text-[#00ff41] text-xs mb-1 block">IMAGES:</label>
                                <div className="border border-[#333] p-4 bg-black">
                                    <input type="file" name="images" multiple accept="image/*" onChange={handleFileChange} className="w-full text-xs text-gray-400" />
                                    {selectedFiles.length > 0 && <div className="mt-2 text-xs text-[#00ff41]">{`// Selected: ${selectedFiles.length} files`}</div>}
                                </div>
                            </div>
                            <button disabled={loading} type="submit" className="bg-[#00ff41] text-black font-bold p-3 mt-2 hover:bg-white uppercase">{loading ? "PROCESSING..." : "PUBLISH LOG"}</button>
                        </form>
                    </div>
                    <div>
                        <h1 className="text-2xl text-red-500 mb-4 uppercase">Database</h1>
                        <div className="bg-[rgba(20,20,20,0.8)] border border-[#333] h-150 overflow-y-auto p-4 custom-scrollbar">
                            {posts.map((post) => (
                                <div key={post.id} className="mb-3 p-3 border border-[#333] hover:border-[#00ff41] bg-black transition-all">
                                    <div className="flex justify-between items-start mb-2"><h3 className="text-white font-bold text-sm w-[70%] truncate">{post.title}</h3><span className="text-[10px] bg-[#333] px-1 text-[#00ff41]">{post.language || "VI"}</span></div>
                                    <div className="flex gap-2"><a href={`/blog/${post.id}`} target="_blank" className="flex-1 text-center py-1 border border-[#333] text-gray-400 hover:text-[#00ff41] text-xs">VIEW</a><button onClick={() => handleDelete(post.id)} className="flex-1 text-center py-1 border border-red-900 text-red-500 hover:bg-red-600 hover:text-black text-xs font-bold">DELETE</button></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'content' && (
                <div>
                     <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl text-[#00ff41] uppercase">Edit Static Content</h1>
                        <div className="flex gap-2 bg-[#111] p-1 border border-[#333]">
                             {['vi', 'en', 'jp'].map(lang => (
                                 <button key={lang} onClick={() => setEditLang(lang)} className={`px-4 py-1 text-xs font-bold uppercase ${editLang === lang ? 'bg-[#00ff41] text-black' : 'text-gray-500'}`}>
                                     {lang}
                                 </button>
                             ))}
                        </div>
                     </div>

                     <form action={handleSaveContent} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <input type="hidden" name="language" value={editLang} />

                        <div className="bg-[rgba(20,20,20,0.8)] p-6 border border-[#333]">
                            <h3 className="text-[#00ff41] border-b border-[#333] pb-2 mb-4 uppercase">01. Hero & About</h3>
                            <div className="space-y-4">
                                <div><label className="text-gray-500 text-xs block mb-1">Greeting Text:</label><input name="hero_greeting" defaultValue={getValue("hero_greeting")} className="w-full bg-black border border-[#333] p-2 text-white focus:border-[#00ff41] outline-none" placeholder="HELLO, WORLD!" /></div>
                                <div><label className="text-gray-500 text-xs block mb-1">Role (Job Title):</label><input name="role" defaultValue={getValue("role")} className="w-full bg-black border border-[#333] p-2 text-white focus:border-[#00ff41] outline-none" placeholder="Software Engineer" /></div>
                                <div><label className="text-gray-500 text-xs block mb-1">Hero Description:</label><textarea name="hero_desc" rows={3} defaultValue={getValue("hero_desc")} className="w-full bg-black border border-[#333] p-2 text-white focus:border-[#00ff41] outline-none" /></div>
                                <div><label className="text-gray-500 text-xs block mb-1">About Line 1:</label><textarea name="about_line1" rows={3} defaultValue={getValue("about_line1")} className="w-full bg-black border border-[#333] p-2 text-white focus:border-[#00ff41] outline-none" /></div>
                                <div><label className="text-gray-500 text-xs block mb-1">About Line 2:</label><textarea name="about_line2" rows={3} defaultValue={getValue("about_line2")} className="w-full bg-black border border-[#333] p-2 text-white focus:border-[#00ff41] outline-none" /></div>
                            </div>
                        </div>

                        <div className="bg-[rgba(20,20,20,0.8)] p-6 border border-[#333]">
                            <h3 className="text-[#00ff41] border-b border-[#333] pb-2 mb-4 uppercase">02. Details & Descriptions</h3>
                            <div className="space-y-4">
                                <div><label className="text-gray-500 text-xs block mb-1">Career Goals Desc:</label><textarea name="career_desc" rows={2} defaultValue={getValue("career_desc")} className="w-full bg-black border border-[#333] p-2 text-white focus:border-[#00ff41] outline-none" /></div>
                                <div><label className="text-gray-500 text-xs block mb-1">Hobbies Desc:</label><textarea name="hobby_desc" rows={2} defaultValue={getValue("hobby_desc")} className="w-full bg-black border border-[#333] p-2 text-white focus:border-[#00ff41] outline-none" /></div>
                                
                                <h4 className="text-[#00ff41] text-xs uppercase mt-4 border-b border-[#333] pb-1">Experience (Item 1)</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <input name="exp_time_1" defaultValue={getValue("exp_time_1")} placeholder="Time" className="bg-black border border-[#333] p-2 text-white text-xs" />
                                    <input name="exp_role_1" defaultValue={getValue("exp_role_1")} placeholder="Role" className="bg-black border border-[#333] p-2 text-white text-xs" />
                                </div>
                                <textarea name="exp_desc_1" rows={2} defaultValue={getValue("exp_desc_1")} placeholder="Description..." className="w-full bg-black border border-[#333] p-2 text-white text-xs" />

                                <h4 className="text-[#00ff41] text-xs uppercase mt-4 border-b border-[#333] pb-1">Experience (Item 2)</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <input name="exp_time_2" defaultValue={getValue("exp_time_2")} placeholder="Time" className="bg-black border border-[#333] p-2 text-white text-xs" />
                                    <input name="exp_role_2" defaultValue={getValue("exp_role_2")} placeholder="Role" className="bg-black border border-[#333] p-2 text-white text-xs" />
                                </div>
                                <textarea name="exp_desc_2" rows={2} defaultValue={getValue("exp_desc_2")} placeholder="Description..." className="w-full bg-black border border-[#333] p-2 text-white text-xs" />
                            </div>
                        </div>

                         <div className="col-span-full">
                            <button disabled={loading} type="submit" className="w-full bg-[#00ff41] text-black font-bold p-4 hover:bg-white uppercase tracking-widest text-xl">
                                {loading ? "SAVING..." : "SAVE ALL CHANGES"}
                            </button>
                        </div>
                     </form>
                </div>
            )}
        </div>
    </main>
  );
}