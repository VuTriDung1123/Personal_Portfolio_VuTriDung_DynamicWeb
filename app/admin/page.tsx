"use client";

import { useState, useEffect } from "react";
import { checkAdmin, createPost, deletePost, getAllPosts, updatePost, getSectionContent, saveSectionContent } from "@/lib/actions";

// --- TYPES ---
interface Post {
  id: string;
  title: string;
  tag: string;
  language: string;
  content: string;
  images: string;
}

// Kiểu dữ liệu cho cấu trúc Box (Profile/Experience/Contact)
interface BoxItem {
  label: string;
  value: string;
}

interface SectionBox {
  id: string; // unique ID cho key React
  title: string;
  items: BoxItem[];
}

interface SectionData {
  contentEn: string;
  contentVi: string;
  contentJp: string;
}

// --- SUB-COMPONENT: BOX EDITOR (Định nghĩa bên ngoài để tránh lỗi Re-render) ---
interface BoxEditorProps {
    lang: 'en' | 'vi' | 'jp';
    data: SectionBox[];
    onAddBox: () => void;
    onRemoveBox: (index: number) => void;
    onUpdateTitle: (index: number, val: string) => void;
    onAddItem: (boxIndex: number) => void;
    onRemoveItem: (boxIndex: number, itemIndex: number) => void;
    onUpdateItem: (boxIndex: number, itemIndex: number, field: 'label' | 'value', val: string) => void;
}

const BoxEditor = ({ 
    lang, 
    data, 
    onAddBox, 
    onRemoveBox, 
    onUpdateTitle, 
    onAddItem, 
    onRemoveItem, 
    onUpdateItem 
}: BoxEditorProps) => {
    return (
        <div className="bg-[#111] p-4 border border-[#333] mb-4 relative group">
            <h3 className="text-[#00ff41] font-bold mb-2 uppercase border-b border-[#333] pb-1 flex justify-between">
                <span>LANGUAGE: {lang.toUpperCase()}</span>
                <span className="text-[10px] text-gray-600 group-hover:text-[#00ff41] transition-colors">Editable Area</span>
            </h3>
            {data.map((box, bIdx) => (
                <div key={box.id} className="mb-4 pl-4 border-l-2 border-yellow-600 transition-all hover:border-[#00ff41]">
                    <div className="flex gap-2 mb-2 items-center">
                        <span className="text-yellow-500 text-sm font-bold">BOX:</span>
                        <input 
                            value={box.title} 
                            onChange={(e) => onUpdateTitle(bIdx, e.target.value)}
                            className="bg-black border border-[#555] text-white p-1 flex-1 focus:border-[#00ff41] outline-none transition-colors"
                            placeholder="Box Title..."
                        />
                        <button type="button" onClick={() => onRemoveBox(bIdx)} className="text-red-500 text-xs px-2 hover:bg-red-900/30">[DEL]</button>
                    </div>
                    
                    <div className="pl-4 space-y-1">
                        {box.items.map((item, iIdx) => (
                            <div key={iIdx} className="flex gap-2">
                                <input 
                                    value={item.label} 
                                    onChange={(e) => onUpdateItem(bIdx, iIdx, 'label', e.target.value)}
                                    placeholder="Label (e.g. Name)"
                                    className="bg-[#222] border border-[#444] text-[#aaa] p-1 w-1/3 text-xs focus:border-[#00ff41] outline-none"
                                />
                                <input 
                                    value={item.value} 
                                    onChange={(e) => onUpdateItem(bIdx, iIdx, 'value', e.target.value)}
                                    placeholder="Value (e.g. Nguyen Van A)"
                                    className="bg-[#222] border border-[#444] text-white p-1 flex-1 text-xs focus:border-[#00ff41] outline-none"
                                />
                                <button type="button" onClick={() => onRemoveItem(bIdx, iIdx)} className="text-red-500 text-xs w-6 hover:bg-red-900/50">x</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => onAddItem(bIdx)} className="text-[#00ff41] text-xs mt-2 border border-[#00ff41] px-2 py-1 hover:bg-[#00ff41] hover:text-black transition-all">+ Add Field</button>
                    </div>
                </div>
            ))}
            <button type="button" onClick={onAddBox} className="w-full bg-[#222] text-gray-300 py-2 hover:bg-[#333] text-sm border border-dashed border-[#444] hover:border-[#00ff41] transition-all">+ NEW BOX GROUP</button>
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<'blog' | 'content'>('blog');

  // BLOG STATES
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [tag, setTag] = useState("my_confessions");
  const [images, setImages] = useState<string[]>([]);

  // SECTION STATES
  const [sectionKey, setSectionKey] = useState("about");
  const [msg, setMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false); // [MỚI] Trạng thái đang lưu
  
  // Text content
  const [secEn, setSecEn] = useState("");
  const [secVi, setSecVi] = useState("");
  const [secJp, setSecJp] = useState("");

  // Box content (Profile, Experience, Contact)
  const [boxesEn, setBoxesEn] = useState<SectionBox[]>([]);
  const [boxesVi, setBoxesVi] = useState<SectionBox[]>([]);
  const [boxesJp, setBoxesJp] = useState<SectionBox[]>([]);

  const isBoxSection = sectionKey === 'profile' || sectionKey === 'experience' || sectionKey === 'contact';

  useEffect(() => {
    getAllPosts().then((data) => setPosts(data as unknown as Post[]));
  }, []);

  // Load Data
  useEffect(() => {
    if (activeTab === 'content') {
        const fetchSection = async () => {
            setMsg(">> SYSTEM: LOADING DATA...");
            try {
                const data = await getSectionContent(sectionKey);
                
                if (isBoxSection) {
                    if (data) {
                        const typedData = data as unknown as SectionData;
                        try { setBoxesEn(JSON.parse(typedData.contentEn)); } catch { setBoxesEn([]); }
                        try { setBoxesVi(JSON.parse(typedData.contentVi)); } catch { setBoxesVi([]); }
                        try { setBoxesJp(JSON.parse(typedData.contentJp)); } catch { setBoxesJp([]); }
                    } else {
                        // Default Box Structure
                        const defaultBox = [{ id: Date.now().toString(), title: "New Section", items: [{ label: "Label", value: "Value" }] }];
                        setBoxesEn(defaultBox); setBoxesVi(defaultBox); setBoxesJp(defaultBox);
                    }
                } else {
                    if (data) {
                        const typedData = data as unknown as SectionData;
                        setSecEn(typedData.contentEn || "");
                        setSecVi(typedData.contentVi || "");
                        setSecJp(typedData.contentJp || "");
                    } else {
                        setSecEn(""); setSecVi(""); setSecJp("");
                    }
                }
                setMsg(""); // Clear loading msg
            } catch (error) {
                console.error(error);
                setMsg("!! ERROR: FAILED TO LOAD DATA");
            }
        };
        fetchSection();
    }
  }, [sectionKey, activeTab, isBoxSection]);

  async function handleLogin(formData: FormData) {
    const res = await checkAdmin(formData);
    if (res.success) setIsAuth(true);
    else alert("Access Denied!");
  }

  // Blog Logic
  const addLinkField = () => setImages([...images, ""]);
  const removeLinkField = (index: number) => { const newImg = [...images]; newImg.splice(index, 1); setImages(newImg); };
  const updateLinkField = (index: number, val: string) => { const newImg = [...images]; newImg[index] = val; setImages(newImg); };

  async function handleBlogSubmit(formData: FormData) {
    const jsonImages = JSON.stringify(images.filter(img => img.trim() !== ""));
    formData.set("images", jsonImages);

    if (editingPost) {
        await updatePost(formData);
        alert("Log Updated!");
        setEditingPost(null);
    } else {
        await createPost(formData);
        alert("Log Created!");
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
    if(!confirm("Purge this log?")) return;
    await deletePost(id);
    const updated = await getAllPosts();
    setPosts(updated as unknown as Post[]);
  }

  // Section Box Helpers
  const updateBoxState = (lang: 'en' | 'vi' | 'jp', newBoxes: SectionBox[]) => {
    if (lang === 'en') setBoxesEn(newBoxes);
    if (lang === 'vi') setBoxesVi(newBoxes);
    if (lang === 'jp') setBoxesJp(newBoxes);
  };
  const addBox = (lang: 'en' | 'vi' | 'jp') => {
    const current = lang === 'en' ? boxesEn : (lang === 'vi' ? boxesVi : boxesJp);
    updateBoxState(lang, [...current, { id: Date.now().toString(), title: "New Group", items: [] }]);
  };
  const removeBox = (lang: 'en' | 'vi' | 'jp', index: number) => {
    const current = lang === 'en' ? boxesEn : (lang === 'vi' ? boxesVi : boxesJp);
    const updated = [...current];
    updated.splice(index, 1);
    updateBoxState(lang, updated);
  };
  const updateBoxTitle = (lang: 'en' | 'vi' | 'jp', index: number, val: string) => {
    const current = lang === 'en' ? boxesEn : (lang === 'vi' ? boxesVi : boxesJp);
    const updated = [...current];
    updated[index].title = val;
    updateBoxState(lang, updated);
  };
  const addItem = (lang: 'en' | 'vi' | 'jp', boxIndex: number) => {
    const current = lang === 'en' ? boxesEn : (lang === 'vi' ? boxesVi : boxesJp);
    const updated = [...current];
    updated[boxIndex].items.push({ label: "", value: "" });
    updateBoxState(lang, updated);
  };
  const removeItem = (lang: 'en' | 'vi' | 'jp', boxIndex: number, itemIndex: number) => {
    const current = lang === 'en' ? boxesEn : (lang === 'vi' ? boxesVi : boxesJp);
    const updated = [...current];
    updated[boxIndex].items.splice(itemIndex, 1);
    updateBoxState(lang, updated);
  };
  const updateItem = (lang: 'en' | 'vi' | 'jp', boxIndex: number, itemIndex: number, field: 'label' | 'value', val: string) => {
    const current = lang === 'en' ? boxesEn : (lang === 'vi' ? boxesVi : boxesJp);
    const updated = [...current];
    updated[boxIndex].items[itemIndex][field] = val;
    updateBoxState(lang, updated);
  };

  // [CẢI TIẾN] Handle Save Section with Notification
  async function handleSectionSubmit(formData: FormData) {
    if (isSaving) return; // Chặn spam click
    setIsSaving(true);
    setMsg(">> SYSTEM: WRITING TO DATABASE...");

    if (isBoxSection) {
        formData.set("contentEn", JSON.stringify(boxesEn));
        formData.set("contentVi", JSON.stringify(boxesVi));
        formData.set("contentJp", JSON.stringify(boxesJp));
    } else {
        formData.set("contentEn", secEn);
        formData.set("contentVi", secVi);
        formData.set("contentJp", secJp);
    }

    const res = await saveSectionContent(formData);
    setIsSaving(false); // Mở lại nút

    if (res.success) {
        setMsg("✅ SUCCESS: DATA SAVED SUCCESSFULLY!");
        // Tự động tắt thông báo sau 3 giây
        setTimeout(() => setMsg(""), 3000);
    } else {
        setMsg("❌ ERROR: SAVE FAILED. CHECK CONSOLE.");
    }
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
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 border-b border-[#00ff41] pb-4 sticky top-0 bg-[#050505] z-50">
        <h1 className="text-4xl text-[#00ff41] drop-shadow-[0_0_5px_rgba(0,255,65,0.8)]">ADMIN DASHBOARD</h1>
        <div className="flex gap-4">
            <button onClick={() => setActiveTab('blog')} className={`px-4 py-2 border ${activeTab === 'blog' ? 'bg-[#00ff41] text-black font-bold' : 'text-[#00ff41] border-[#00ff41] hover:bg-[#00ff41] hover:text-black transition'}`}>BLOG MANAGER</button>
            <button onClick={() => setActiveTab('content')} className={`px-4 py-2 border ${activeTab === 'content' ? 'bg-[#00ff41] text-black font-bold' : 'text-[#00ff41] border-[#00ff41] hover:bg-[#00ff41] hover:text-black transition'}`}>EDIT SECTIONS</button>
        </div>
      </div>

      {activeTab === 'blog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             {/* BLOG FORM */}
             <div className={`p-5 border-2 ${editingPost ? 'border-yellow-400 shadow-[0_0_15px_yellow]' : 'border-[#00ff41] shadow-[0_0_10px_#00ff41]'} bg-black/80 h-fit sticky top-24 transition-all`}>
                <h2 className={`text-2xl mb-5 border-b pb-2 ${editingPost ? 'text-yellow-400' : 'text-[#00ff41]'}`}>{editingPost ? ">> EDIT MODE" : ">> NEW ENTRY"}</h2>
                <form action={handleBlogSubmit} className="flex flex-col gap-4">
                    {editingPost && <input type="hidden" name="id" value={editingPost.id} />}
                    <input name="title" placeholder="Title" defaultValue={editingPost?.title} required className="bg-[#111] border border-[#333] p-2 text-white outline-none focus:border-[#00ff41]" />
                    <select name="tag" value={tag} onChange={e => setTag(e.target.value)} className="bg-[#111] border border-[#333] p-2 text-white outline-none focus:border-[#00ff41]">
                        <option value="my_confessions">My Confessions</option>
                        <option value="uni_projects">University Projects</option>
                        <option value="personal_projects">Personal Projects</option>
                        <option value="achievements">Achievements</option>
                        <option value="it_events">IT Events</option>
                        <option value="lang_certs">Language Certificates</option>
                        <option value="tech_certs">Technical Certificates</option>
                    </select>
                    <select name="language" defaultValue={editingPost?.language || "vi"} className="bg-[#111] border border-[#333] p-2 text-white outline-none focus:border-[#00ff41]">
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                        <option value="jp">Japanese</option>
                    </select>
                    <textarea name="content" placeholder="Content (Markdown)" defaultValue={editingPost?.content} rows={10} required className="bg-[#111] border border-[#333] p-2 text-white outline-none focus:border-[#00ff41] font-mono text-sm" />
                    <div className="border border-[#333] p-3">
                        <label className="text-sm text-[#00ff41] block mb-2">IMAGE LINKS</label>
                        {images.map((link, idx) => (
                            <div key={idx} className="flex gap-2 mb-2"><input value={link} onChange={(e) => updateLinkField(idx, e.target.value)} className="flex-1 bg-[#111] border border-[#333] p-1 text-xs text-white focus:border-[#00ff41]" /><button type="button" onClick={() => removeLinkField(idx)} className="text-red-500 font-bold px-2">X</button></div>
                        ))}
                        <button type="button" onClick={addLinkField} className="text-xs bg-[#222] text-[#aaa] px-2 py-1 hover:text-white border border-[#333] hover:border-white">+ Add Image Slot</button>
                    </div>
                    <div className="flex gap-2 mt-2"><button type="submit" className="flex-1 bg-[#00ff41] text-black font-bold py-2 hover:opacity-90 hover:shadow-[0_0_10px_#00ff41] transition">SUBMIT</button>{editingPost && <button type="button" onClick={() => {setEditingPost(null); setImages([]);}} className="bg-gray-700 text-white px-4 hover:bg-gray-600">CANCEL</button>}</div>
                </form>
            </div>
            
            {/* BLOG LIST */}
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl text-[#00ff41] border-b border-[#00ff41] pb-2">DATABASE LOGS</h2>
                {posts.map(post => (
                    <div key={post.id} className="bg-[#0a0a0a] border border-[#333] p-4 hover:border-[#00ff41] transition group hover:shadow-[0_0_10px_rgba(0,255,65,0.2)]">
                        <div className="flex justify-between items-start">
                            <div><h3 className="font-bold text-lg text-white group-hover:text-[#00ff41] transition">{post.title}</h3><p className="text-xs text-gray-500 mt-1">{post.tag} | {post.language}</p></div>
                            <div className="flex gap-2"><button onClick={() => startEdit(post)} className="text-yellow-500 text-sm border border-transparent hover:border-yellow-500 px-2">[EDIT]</button><button onClick={() => handleDelete(post.id)} className="text-red-500 text-sm border border-transparent hover:border-red-500 px-2">[DEL]</button></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="max-w-7xl mx-auto border border-[#00ff41] p-6 bg-black/80 shadow-[0_0_20px_rgba(0,255,65,0.2)]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl text-[#00ff41]">EDIT SECTIONS</h2>
                {/* [MỚI] Phần hiển thị thông báo trạng thái */}
                {msg && (
                    <span className={`px-4 py-1 font-bold text-sm animate-pulse ${
                        msg.includes("SUCCESS") ? "text-[#00ff41] border border-[#00ff41] bg-[#003300]" 
                        : msg.includes("ERROR") ? "text-red-500 border border-red-500 bg-[#330000]"
                        : "text-yellow-400"
                    }`}>
                        {msg}
                    </span>
                )}
            </div>

            <form action={handleSectionSubmit} className="flex flex-col gap-6">
                <div>
                    <label className="block text-[#00ff41] mb-2 font-bold">SELECT SECTION:</label>
                    <select name="sectionKey" value={sectionKey} onChange={(e) => setSectionKey(e.target.value)} className="w-full bg-[#111] border border-[#00ff41] p-3 text-xl text-white outline-none focus:shadow-[0_0_10px_#00ff41] transition">
                        <option value="about">01. ABOUT ME (Text)</option>
                        <option value="profile">02. PROFILE (Boxes)</option>
                        <option value="career">04. CAREER GOALS (Text)</option>
                        <option value="skills">06. SKILLS (Text)</option>
                        <option value="experience">07. EXPERIENCE (Boxes)</option>
                        <option value="contact">11. CONTACT (Boxes)</option>
                    </select>
                </div>

                {isBoxSection ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <BoxEditor 
                            lang="en" data={boxesEn} 
                            onAddBox={() => addBox('en')} onRemoveBox={(idx) => removeBox('en', idx)}
                            onUpdateTitle={(idx, val) => updateBoxTitle('en', idx, val)} onAddItem={(idx) => addItem('en', idx)}
                            onRemoveItem={(bIdx, iIdx) => removeItem('en', bIdx, iIdx)} onUpdateItem={(bIdx, iIdx, field, val) => updateItem('en', bIdx, iIdx, field, val)}
                        />
                        <BoxEditor 
                            lang="vi" data={boxesVi} 
                            onAddBox={() => addBox('vi')} onRemoveBox={(idx) => removeBox('vi', idx)}
                            onUpdateTitle={(idx, val) => updateBoxTitle('vi', idx, val)} onAddItem={(idx) => addItem('vi', idx)}
                            onRemoveItem={(bIdx, iIdx) => removeItem('vi', bIdx, iIdx)} onUpdateItem={(bIdx, iIdx, field, val) => updateItem('vi', bIdx, iIdx, field, val)}
                        />
                        <BoxEditor 
                            lang="jp" data={boxesJp} 
                            onAddBox={() => addBox('jp')} onRemoveBox={(idx) => removeBox('jp', idx)}
                            onUpdateTitle={(idx, val) => updateBoxTitle('jp', idx, val)} onAddItem={(idx) => addItem('jp', idx)}
                            onRemoveItem={(bIdx, iIdx) => removeItem('jp', bIdx, iIdx)} onUpdateItem={(bIdx, iIdx, field, val) => updateItem('jp', bIdx, iIdx, field, val)}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><label className="block text-gray-400 mb-1 text-sm font-bold">English</label><textarea name="contentEn" value={secEn} onChange={e => setSecEn(e.target.value)} className="w-full bg-[#111] border border-[#333] p-3 text-white h-60 focus:border-[#00ff41] outline-none" /></div>
                        <div><label className="block text-gray-400 mb-1 text-sm font-bold">Vietnamese</label><textarea name="contentVi" value={secVi} onChange={e => setSecVi(e.target.value)} className="w-full bg-[#111] border border-[#333] p-3 text-white h-60 focus:border-[#00ff41] outline-none" /></div>
                        <div><label className="block text-gray-400 mb-1 text-sm font-bold">Japanese</label><textarea name="contentJp" value={secJp} onChange={e => setSecJp(e.target.value)} className="w-full bg-[#111] border border-[#333] p-3 text-white h-60 focus:border-[#00ff41] outline-none" /></div>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isSaving}
                    className={`w-full font-bold py-3 text-xl transition-all ${
                        isSaving 
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600' 
                          : 'bg-[#00ff41] text-black hover:opacity-90 hover:shadow-[0_0_15px_#00ff41] active:translate-y-1'
                    }`}
                >
                    {isSaving ? "PROCESSING DATA..." : "SAVE CHANGES TO DATABASE"}
                </button>
            </form>
        </div>
      )}
    </div>
  );
}