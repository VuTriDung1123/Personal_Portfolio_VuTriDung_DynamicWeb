"use client";

import { createPost, updatePost, checkAdmin, getAllPosts, deletePost } from "@/lib/actions";
import { useState, useEffect, useRef } from "react";
import MatrixRain from "@/components/MatrixRain";

// Định nghĩa kiểu dữ liệu cho bài viết
type Post = {
    id: string;
    title: string;
    images: string; // Chuỗi JSON chứa danh sách link
    createdAt: Date;
    tag?: string;
    language?: string;
    content?: string;
};

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  
  // --- STATE ---
  const [editingPost, setEditingPost] = useState<Post | null>(null); // Bài đang sửa
  const formRef = useRef<HTMLFormElement>(null); // Để reset form

  // Form inputs
  const [imageLinks, setImageLinks] = useState<string[]>([""]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("my_confessions");
  const [language, setLanguage] = useState("vi");

  const refreshData = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getAllPosts().then((data: any) => setPosts(data));
  }

  useEffect(() => {
    if (isLoggedIn) refreshData();
  }, [isLoggedIn]);

  // --- HÀM RESET FORM ---
  const resetForm = () => {
    setTitle("");
    setContent("");
    setTag("my_confessions");
    setLanguage("vi");
    setImageLinks([""]);
    setEditingPost(null); // Thoát chế độ sửa
    if(formRef.current) formRef.current.reset();
  }

  // --- HÀM BẮT ĐẦU SỬA ---
  const handleStartEdit = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content || "");
    setTag(post.tag || "my_confessions");
    setLanguage(post.language || "vi");
    try {
      const links = JSON.parse(post.images || "[]");
      setImageLinks(links.length > 0 ? links : [""]);
    } catch { setImageLinks([""]); }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleLogin = async (formData: FormData) => {
    const res = await checkAdmin(formData);
    if (res.success) setIsLoggedIn(true);
    else alert("ACCESS DENIED / SAI MẬT KHẨU");
  };

  // --- XỬ LÝ LINK ẢNH ---
  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...imageLinks];
    newLinks[index] = value;
    setImageLinks(newLinks);
  };

  const addLinkField = () => { setImageLinks([...imageLinks, ""]); };
  const removeLinkField = (index: number) => {
    const newLinks = imageLinks.filter((_, i) => i !== index);
    setImageLinks(newLinks.length > 0 ? newLinks : [""]);
  };
  
  // --- XỬ LÝ SUBMIT FORM ---
  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    
    // Chuẩn bị dữ liệu
    const validLinks = imageLinks.filter(link => link.trim() !== "");
    formData.set("images", JSON.stringify(validLinks));
    formData.set("tag", tag);
    formData.set("language", language);

    if (editingPost) {
        // --- LOGIC CẬP NHẬT ---
        formData.set("id", editingPost.id);
        await updatePost(formData);
        alert("Cập nhật bài viết thành công!");
    } else {
        // --- LOGIC TẠO MỚI ---
        await createPost(formData);
        alert("Đăng bài thành công!");
    }

    resetForm(); // Reset form sau khi xong
    setLoading(false);
    refreshData();
  };

  const handleDelete = async (id: string) => {
    if(confirm("Bạn chắc chắn muốn xóa bài này?")) {
        setLoading(true);
        await deletePost(id);
        refreshData();
        setLoading(false);
        if(editingPost?.id === id) resetForm();
    }
  }

  // --- MÀN HÌNH ĐĂNG NHẬP ---
  if (!isLoggedIn) {
    return (
      <main className="h-screen flex items-center justify-center relative overflow-hidden bg-black font-mono">
        <MatrixRain />
        <form action={handleLogin} className="z-10 bg-[rgba(5,5,5,0.95)] border border-[#00ff41] p-10 flex flex-col gap-6 w-96 shadow-[0_0_30px_#00ff41]">
            <h1 className="text-[#00ff41] text-3xl text-center font-bold tracking-widest mb-2">SYSTEM LOGIN</h1>
            <input name="username" type="text" placeholder="Username" required className="bg-black border border-[#333] text-white p-3 focus:border-[#00ff41] outline-none transition-colors" />
            <input name="password" type="password" placeholder="Password" required className="bg-black border border-[#333] text-white p-3 focus:border-[#00ff41] outline-none transition-colors" />
            <button type="submit" className="bg-[#00ff41] text-black font-bold p-3 mt-2 hover:bg-white hover:tracking-widest transition-all uppercase">Authorize</button>
        </form>
      </main>
    );
  }

  // --- GIAO DIỆN ADMIN CHÍNH ---
  return (
    <main className="min-h-screen bg-black text-white font-mono relative pb-20">
        <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-20 pointer-events-none"><MatrixRain /></div>
        
        <header className="border-b border-[#333] bg-black/90 sticky top-0 z-50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-[#00ff41] font-bold text-xl tracking-widest">:: ADMIN DASHBOARD ::</div>
                <div className="text-gray-500 text-xs">LOGGED IN AS ADMIN</div>
            </div>
        </header>
        
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* CỘT TRÁI: FORM */}
                <div className="lg:col-span-2">
                    <form ref={formRef} action={handleSubmit} className={`flex flex-col gap-6 bg-[#0a0a0a] p-8 border shadow-lg relative group transition-colors ${editingPost ? 'border-yellow-600 hover:border-yellow-400' : 'border-[#333] hover:border-[#00ff41]'}`}>
                        
                        <div className={`absolute top-0 right-0 text-xs px-2 py-1 text-black font-bold ${editingPost ? 'bg-yellow-600' : 'bg-[#00ff41]'}`}>
                            {editingPost ? `EDITING MODE (ID: ${editingPost.id.slice(0,6)}...)` : 'NEW ENTRY MODE'}
                        </div>
                        
                        <div className="flex justify-between items-center border-b border-[#333] pb-4 mb-2">
                            <h1 className={`text-2xl uppercase ${editingPost ? 'text-yellow-500' : 'text-white'}`}>
                                {editingPost ? "Update Existing Log" : "Write New Log"}
                            </h1>
                            {editingPost && (
                                <button type="button" onClick={handleCancelEdit} className="text-xs text-gray-400 hover:text-white underline">
                                    Cancel Edit (Create New)
                                </button>
                            )}
                        </div>
                        
                        {/* Title */}
                        <div>
                            <label className="text-gray-500 text-[10px] uppercase mb-1 block tracking-wider">Title</label>
                            <input type="text" name="title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-3 bg-black border border-[#333] focus:border-[#00ff41] outline-none text-white transition-all" placeholder="Enter title..." />
                        </div>

                        {/* Category & Language */}
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <label className="text-gray-500 text-[10px] uppercase mb-1 block tracking-wider">Category</label>
                                <select name="tag" value={tag} onChange={e => setTag(e.target.value)} className="w-full p-3 bg-black border border-[#333] focus:border-[#00ff41] outline-none text-white text-sm">
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
                                    <label className="flex items-center gap-2 cursor-pointer hover:text-[#00ff41] text-sm"><input type="radio" name="language" value="vi" checked={language === 'vi'} onChange={() => setLanguage('vi')} className="accent-[#00ff41]" /> VI</label>
                                    <label className="flex items-center gap-2 cursor-pointer hover:text-[#00ff41] text-sm"><input type="radio" name="language" value="en" checked={language === 'en'} onChange={() => setLanguage('en')} className="accent-[#00ff41]" /> EN</label>
                                    <label className="flex items-center gap-2 cursor-pointer hover:text-[#00ff41] text-sm"><input type="radio" name="language" value="jp" checked={language === 'jp'} onChange={() => setLanguage('jp')} className="accent-[#00ff41]" /> JP</label>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            <label className="text-gray-500 text-[10px] uppercase mb-1 block tracking-wider">Content</label>
                            <textarea name="content" rows={12} value={content} onChange={e => setContent(e.target.value)} required className="w-full p-3 bg-black border border-[#333] focus:border-[#00ff41] outline-none text-white font-mono text-sm leading-relaxed" placeholder="Write your content here (Markdown supported)..."></textarea>
                        </div>

                        {/* Image Links */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="text-gray-500 text-[10px] uppercase tracking-wider">Image URLs (First link is Cover)</label>
                                <button type="button" onClick={addLinkField} className="text-[10px] bg-[#222] text-[#00ff41] px-2 py-1 border border-[#333] hover:bg-[#00ff41] hover:text-black transition-colors">+ ADD URL SLOT</button>
                            </div>
                            <div className="space-y-3">
                                {imageLinks.map((link, index) => (
                                    <div key={index} className="flex gap-2">
                                        <div className="relative w-full">
                                            <span className="absolute left-3 top-3 text-gray-600 text-xs font-bold">
                                                {index === 0 ? "COVER:" : `#${index + 1}:`}
                                            </span>
                                            <input type="text" value={link} onChange={(e) => handleLinkChange(index, e.target.value)} className={`w-full p-3 pl-16 bg-black border ${index === 0 ? 'border-[#00ff41]' : 'border-[#333]'} focus:border-[#00ff41] outline-none text-white text-sm transition-all`} placeholder="Paste URL here..." />
                                        </div>
                                        {imageLinks.length > 1 && (
                                            <button type="button" onClick={() => removeLinkField(index)} className="px-3 bg-red-900/30 text-red-500 border border-red-900 hover:bg-red-600 hover:text-white transition-colors">X</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button disabled={loading} type="submit" className={`font-bold p-4 mt-2 transition-all uppercase shadow-lg ${editingPost ? 'bg-yellow-600 text-black hover:bg-yellow-500 shadow-yellow-900/50' : 'bg-[#00ff41] text-black hover:bg-white shadow-[#00ff41]/30'}`}>
                            {loading ? "PROCESSING..." : (editingPost ? "UPDATE LOG ENTRY" : "PUBLISH NEW ENTRY")}
                        </button>
                    </form>
                </div>

                {/* CỘT PHẢI: LIST */}
                <div className="lg:col-span-1">
                    <div className="bg-[#0a0a0a] border border-[#333] h-[80vh] flex flex-col shadow-lg">
                        <div className="p-4 border-b border-[#333] bg-black">
                            <h2 className="text-[#00ff41] text-xl uppercase font-bold">Database Logs</h2>
                            <p className="text-gray-600 text-xs mt-1">Total entries: {posts.length}</p>
                        </div>
                        
                        <div className="overflow-y-auto p-4 flex-1 custom-scrollbar space-y-3">
                            {posts.map((post) => (
                                <div key={post.id} className={`p-3 border bg-black transition-all group ${editingPost?.id === post.id ? 'border-yellow-500 bg-yellow-900/20' : 'border-[#333] hover:border-[#00ff41]'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`font-bold text-sm line-clamp-1 w-[80%] ${editingPost?.id === post.id ? 'text-yellow-500' : 'text-white group-hover:text-[#00ff41]'}`}>{post.title}</h3>
                                        <span className="text-[9px] bg-[#222] px-1 text-gray-400 border border-[#333]">{post.language}</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="text-[10px] text-gray-500">
                                            <div className="uppercase mb-1">{post.tag}</div>
                                            <div>{new Date(post.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            {/* ĐÃ THÊM LẠI NÚT VIEW Ở ĐÂY */}
                                            <a href={`/blog/${post.id}`} target="_blank" className="text-[10px] text-gray-400 hover:text-white border border-[#333] px-2 py-1 flex items-center">
                                                VIEW
                                            </a>
                                            <button onClick={() => handleStartEdit(post)} className="text-[10px] text-yellow-500 hover:text-yellow-300 border border-yellow-900/50 px-2 py-1 bg-yellow-900/20">
                                                EDIT
                                            </button>
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