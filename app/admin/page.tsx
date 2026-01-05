"use client";

import { createPost, updatePost, checkAdmin, getAllPosts, deletePost } from "@/lib/actions";
import { useState, useEffect, useRef } from "react";
// ĐÃ XÓA MatrixRain

type Post = {
    id: string;
    title: string;
    images: string; 
    createdAt: Date;
    tag?: string;
    language?: string;
    content?: string;
};

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  
  const [editingPost, setEditingPost] = useState<Post | null>(null); 
  const formRef = useRef<HTMLFormElement>(null); 

  const [imageLinks, setImageLinks] = useState<string[]>([""]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("my_confessions");
  const [language, setLanguage] = useState("vi");

  const refreshData = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getAllPosts().then((data: any) => setPosts(data));
  };

  useEffect(() => { if (isLoggedIn) refreshData(); }, [isLoggedIn]);

  const handleLogin = async (formData: FormData) => {
    setLoading(true);
    const res = await checkAdmin(formData);
    setLoading(false);
    if (res.success) setIsLoggedIn(true);
    else alert("WRONG PASSWORD!");
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const validImages = imageLinks.filter(link => link.trim() !== "");
    formData.set("images", JSON.stringify(validImages));

    if (editingPost) {
        formData.append("id", editingPost.id);
        await updatePost(formData);
        alert("UPDATED SUCCESSFULLY!");
        setEditingPost(null);
    } else {
        await createPost(formData);
        alert("POST CREATED!");
    }
    
    if (formRef.current) formRef.current.reset();
    setTitle(""); setContent(""); setImageLinks([""]);
    setLoading(false);
    refreshData();
  };

  const handleDelete = async (id: string) => {
      if (confirm("DELETE THIS POST?")) {
          await deletePost(id);
          refreshData();
      }
  };

  const handleStartEdit = (post: Post) => {
      setEditingPost(post);
      setTitle(post.title);
      setContent(post.content || "");
      setTag(post.tag || "my_confessions");
      setLanguage(post.language || "vi");
      try { setImageLinks(JSON.parse(post.images)); } catch { setImageLinks([""]); }
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddImageLink = () => setImageLinks([...imageLinks, ""]);
  const handleImageLinkChange = (index: number, value: string) => {
      const newLinks = [...imageLinks];
      newLinks[index] = value;
      setImageLinks(newLinks);
  };
  const handleRemoveImageLink = (index: number) => {
      const newLinks = imageLinks.filter((_, i) => i !== index);
      setImageLinks(newLinks);
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center font-mono">
        <form action={handleLogin} className="border border-pink-500 dark:border-[#00ff41] p-10 bg-white/90 dark:bg-black/90 shadow-2xl rounded-lg">
          <h1 className="text-2xl mb-6 text-center text-pink-600 dark:text-[#00ff41] tracking-widest font-bold">ADMIN ACCESS</h1>
          <input name="username" placeholder="Username" className="block w-full mb-4 p-3 bg-gray-100 dark:bg-[#111] text-black dark:text-[#00ff41] border border-gray-300 dark:border-[#333] outline-none focus:border-pink-500 dark:focus:border-[#00ff41]" required />
          <input type="password" name="password" placeholder="Password" className="block w-full mb-6 p-3 bg-gray-100 dark:bg-[#111] text-black dark:text-[#00ff41] border border-gray-300 dark:border-[#333] outline-none focus:border-pink-500 dark:focus:border-[#00ff41]" required />
          <button disabled={loading} className="w-full bg-pink-600 dark:bg-[#00ff41] text-white dark:text-black font-bold py-3 hover:opacity-80 transition-opacity">
            {loading ? "VERIFYING..." : "LOGIN"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-10 font-mono text-gray-800 dark:text-white">
        <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl mb-8 border-b-2 border-pink-500 dark:border-[#00ff41] pb-4 text-pink-600 dark:text-[#00ff41]">
                ADMIN DASHBOARD {editingPost && <span className="text-yellow-500 text-lg ml-4">(EDITING MODE)</span>}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* FORM */}
                <div className="bg-white/90 dark:bg-[#0a0a0a] p-6 border border-pink-300 dark:border-[#333] shadow-lg h-fit">
                    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">TITLE</label>
                            <input name="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Post Title" className="w-full p-3 bg-gray-50 dark:bg-[#111] border border-gray-300 dark:border-[#333] focus:border-pink-500 dark:focus:border-[#00ff41] outline-none" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">TAG</label>
                                <select name="tag" value={tag} onChange={e => setTag(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-[#111] border border-gray-300 dark:border-[#333] focus:border-pink-500 dark:focus:border-[#00ff41] outline-none">
                                    <option value="my_confessions">My Confessions</option>
                                    <option value="uni_projects">University Projects</option>
                                    <option value="personal_projects">Personal Projects</option>
                                    <option value="it_events">IT Events</option>
                                    <option value="lang_certs">Language Certificates</option>
                                    <option value="tech_certs">Technical Certificates</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">LANGUAGE</label>
                                <select name="language" value={language} onChange={e => setLanguage(e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-[#111] border border-gray-300 dark:border-[#333] focus:border-pink-500 dark:focus:border-[#00ff41] outline-none">
                                    <option value="vi">Vietnamese</option>
                                    <option value="en">English</option>
                                    <option value="jp">Japanese</option>
                                </select>
                            </div>
                        </div>

                        {/* IMAGE LINKS INPUT */}
                        <div className="border border-dashed border-gray-300 dark:border-[#333] p-4">
                            <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-bold">IMAGE LINKS (URL)</label>
                            {imageLinks.map((link, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input 
                                        type="text" 
                                        value={link}
                                        onChange={(e) => handleImageLinkChange(index, e.target.value)}
                                        placeholder="https://example.com/image.jpg" 
                                        className="w-full p-2 bg-gray-50 dark:bg-[#111] border border-gray-300 dark:border-[#333] text-sm focus:border-pink-500 dark:focus:border-[#00ff41] outline-none" 
                                    />
                                    <button type="button" onClick={() => handleRemoveImageLink(index)} className="text-red-500 px-2 border border-red-500 hover:bg-red-500 hover:text-white">X</button>
                                </div>
                            ))}
                            <button type="button" onClick={handleAddImageLink} className="text-xs bg-gray-200 dark:bg-[#222] px-3 py-1 hover:bg-gray-300 dark:hover:bg-[#333] transition">+ ADD LINK</button>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">CONTENT (MARKDOWN)</label>
                            <textarea name="content" value={content} onChange={e => setContent(e.target.value)} placeholder="# Hello World..." rows={10} className="w-full p-3 bg-gray-50 dark:bg-[#111] border border-gray-300 dark:border-[#333] focus:border-pink-500 dark:focus:border-[#00ff41] outline-none font-mono text-sm" required />
                        </div>

                        <button disabled={loading} className={`w-full font-bold py-3 mt-2 ${editingPost ? 'bg-yellow-600 hover:bg-yellow-500 text-white' : 'bg-pink-600 dark:bg-[#00ff41] text-white dark:text-black hover:opacity-90'}`}>
                            {loading ? "PROCESSING..." : (editingPost ? "UPDATE POST" : "CREATE POST")}
                        </button>
                        {editingPost && <button type="button" onClick={() => { setEditingPost(null); setTitle(""); setContent(""); setImageLinks([""]); }} className="w-full bg-gray-500 text-white py-2 mt-2">CANCEL EDIT</button>}
                    </form>
                </div>

                {/* LIST */}
                <div className="bg-white/90 dark:bg-[#0a0a0a] p-6 border border-pink-300 dark:border-[#333] shadow-lg max-h-[800px] overflow-y-auto">
                    <h2 className="text-xl mb-4 text-gray-700 dark:text-white font-bold border-b border-gray-200 dark:border-[#333] pb-2">POSTS ({posts.length})</h2>
                    <div className="space-y-4">
                        {posts.map(post => (
                            <div key={post.id} className="border border-gray-200 dark:border-[#333] p-3 hover:border-pink-400 dark:hover:border-[#00ff41] transition-colors bg-white dark:bg-black">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-800 dark:text-white truncate max-w-[200px]">{post.title}</h3>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex gap-3">
                                            <div className="uppercase mb-1 bg-gray-100 dark:bg-[#222] px-1">{post.tag}</div>
                                            <div>{new Date(post.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <a href={`/blog/${post.id}`} target="_blank" className="text-[10px] text-blue-500 border border-blue-500 px-2 py-1 hover:bg-blue-500 hover:text-white transition">VIEW</a>
                                        <button onClick={() => handleStartEdit(post)} className="text-[10px] text-yellow-600 border border-yellow-600 px-2 py-1 hover:bg-yellow-600 hover:text-white transition">EDIT</button>
                                        <button onClick={() => handleDelete(post.id)} className="text-[10px] text-red-500 border border-red-500 px-2 py-1 hover:bg-red-500 hover:text-white transition">DEL</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
}