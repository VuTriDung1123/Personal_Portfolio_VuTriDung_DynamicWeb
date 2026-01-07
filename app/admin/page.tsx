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

interface BoxItem {
  label: string;
  value: string;
}

interface SectionBox {
  id: string;
  title: string;
  items: BoxItem[];
}

interface SectionData {
  contentEn: string;
  contentVi: string;
  contentJp: string;
}

// --- SUB-COMPONENT: BOX EDITOR ---
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
        <div className="bg-[#111] p-4 border border-[#333] mb-4">
            <h3 className="text-[#00ff41] font-bold mb-2 uppercase border-b border-[#333] pb-1">LANGUAGE: {lang}</h3>
            {data.map((box, bIdx) => (
                <div key={box.id} className="mb-4 pl-4 border-l-2 border-yellow-600">
                    <div className="flex gap-2 mb-2 items-center">
                        <span className="text-yellow-500 text-sm">BOX TITLE:</span>
                        <input 
                            value={box.title} 
                            onChange={(e) => onUpdateTitle(bIdx, e.target.value)}
                            className="bg-black border border-[#555] text-white p-1 flex-1"
                        />
                        <button type="button" onClick={() => onRemoveBox(bIdx)} className="text-red-500 text-xs">[DEL BOX]</button>
                    </div>
                    
                    <div className="pl-4">
                        {box.items.map((item, iIdx) => (
                            <div key={iIdx} className="flex gap-2 mb-1">
                                <input 
                                    value={item.label} 
                                    onChange={(e) => onUpdateItem(bIdx, iIdx, 'label', e.target.value)}
                                    placeholder="Nhãn (Label)"
                                    className="bg-[#222] border border-[#444] text-[#aaa] p-1 w-1/3 text-xs"
                                />
                                <input 
                                    value={item.value} 
                                    onChange={(e) => onUpdateItem(bIdx, iIdx, 'value', e.target.value)}
                                    placeholder="Nội dung (Content)"
                                    className="bg-[#222] border border-[#444] text-white p-1 flex-1 text-xs"
                                />
                                <button type="button" onClick={() => onRemoveItem(bIdx, iIdx)} className="text-red-500 text-xs">x</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => onAddItem(bIdx)} className="text-[#00ff41] text-xs mt-1 border border-[#00ff41] px-2 hover:bg-[#00ff41] hover:text-black">+ Add Item</button>
                    </div>
                </div>
            ))}
            <button type="button" onClick={onAddBox} className="w-full bg-[#333] text-white py-1 hover:bg-[#555] text-sm">+ ADD NEW BOX</button>
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
  
  // Text content
  const [secEn, setSecEn] = useState("");
  const [secVi, setSecVi] = useState("");
  const [secJp, setSecJp] = useState("");

  // Box content (Profile, Experience, Contact)
  const [boxesEn, setBoxesEn] = useState<SectionBox[]>([]);
  const [boxesVi, setBoxesVi] = useState<SectionBox[]>([]);
  const [boxesJp, setBoxesJp] = useState<SectionBox[]>([]);

  // [CẬP NHẬT] Thêm 'contact' vào danh sách Box Section
  const isBoxSection = sectionKey === 'profile' || sectionKey === 'experience' || sectionKey === 'contact';

  useEffect(() => {
    getAllPosts().then((data) => setPosts(data as unknown as Post[]));
  }, []);

  useEffect(() => {
    if (activeTab === 'content') {
        const fetchSection = async () => {
            setMsg("Loading...");
            try {
                const data = await getSectionContent(sectionKey);
                
                if (isBoxSection) {
                    if (data) {
                        const typedData = data as unknown as SectionData;
                        try { setBoxesEn(JSON.parse(typedData.contentEn)); } catch { setBoxesEn([]); }
                        try { setBoxesVi(JSON.parse(typedData.contentVi)); } catch { setBoxesVi([]); }
                        try { setBoxesJp(JSON.parse(typedData.contentJp)); } catch { setBoxesJp([]); }
                    } else {
                        const defaultBox = [{ id: Date.now().toString(), title: "New Box", items: [{ label: "Label", value: "Value" }] }];
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
                setMsg("Loaded from DB.");
            } catch (error) {
                console.error(error);
                setMsg("Error loading.");
            }
        };
        fetchSection();
    }
  }, [sectionKey, activeTab, isBoxSection]);

  async function handleLogin(formData: FormData) {
    const res = await checkAdmin(formData);
    if (res.success) setIsAuth(true);
    else alert("Wrong Password!");
  }

  const addLinkField = () => setImages([...images, ""]);
  const removeLinkField = (index: number) => { const newImg = [...images]; newImg.splice(index, 1); setImages(newImg); };
  const updateLinkField = (index: number, val: string) => { const newImg = [...images]; newImg[index] = val; setImages(newImg); };

  async function handleBlogSubmit(formData: FormData) {
    const jsonImages = JSON.stringify(images.filter(img => img.trim() !== ""));
    formData.set("images", jsonImages);

    if (editingPost) {
        await updatePost(formData);
        alert("Updated Post!");
        setEditingPost(null);
    } else {
        await createPost(formData);
        alert("Created Post!");
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
    if(!confirm("Delete this post?")) return;
    await deletePost(id);
    const updated = await getAllPosts();
    setPosts(updated as unknown as Post[]);
  }

  // Box helper functions
  const updateBoxState = (lang: 'en' | 'vi' | 'jp', newBoxes: SectionBox[]) => {
    if (lang === 'en') setBoxesEn(newBoxes);
    if (lang === 'vi') setBoxesVi(newBoxes);
    if (lang === 'jp') setBoxesJp(newBoxes);
  };
  const addBox = (lang: 'en' | 'vi' | 'jp') => {
    const current = lang === 'en' ? boxesEn : (lang === 'vi' ? boxesVi : boxesJp);
    updateBoxState(lang, [...current, { id: Date.now().toString(), title: "New Box", items: [] }]);
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
    updated[boxIndex].items.push({ label: "Label", value: "Value" });
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

  async function handleSectionSubmit(formData: FormData) {
    setMsg("Saving...");
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
            <button onClick={() => setActiveTab('blog')} className={`px-4 py-2 border ${activeTab === 'blog' ? 'bg-[#00ff41] text-black font-bold' : 'text-[#00ff41] border-[#00ff41]'}`}>BLOG MANAGER</button>
            <button onClick={() => setActiveTab('content')} className={`px-4 py-2 border ${activeTab === 'content' ? 'bg-[#00ff41] text-black font-bold' : 'text-[#00ff41] border-[#00ff41]'}`}>EDIT SECTIONS</button>
        </div>
      </div>

      {activeTab === 'blog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className={`p-5 border-2 ${editingPost ? 'border-yellow-400' : 'border-[#00ff41]'} bg-black/50 h-fit sticky top-10`}>
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
                            <div key={idx} className="flex gap-2 mb-2"><input value={link} onChange={(e) => updateLinkField(idx, e.target.value)} className="flex-1 bg-[#111] border border-[#333] p-1 text-xs text-white" /><button type="button" onClick={() => removeLinkField(idx)} className="text-red-500 font-bold px-2">X</button></div>
                        ))}
                        <button type="button" onClick={addLinkField} className="text-xs bg-[#222] text-[#aaa] px-2 py-1 hover:text-white">+ Add Image Slot</button>
                    </div>
                    <div className="flex gap-2 mt-2"><button type="submit" className="flex-1 bg-[#00ff41] text-black font-bold py-2 hover:opacity-90">SUBMIT</button>{editingPost && <button type="button" onClick={() => {setEditingPost(null); setImages([]);}} className="bg-gray-700 text-white px-4">CANCEL</button>}</div>
                </form>
            </div>
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl text-[#00ff41] border-b border-[#00ff41] pb-2">LOGS</h2>
                {posts.map(post => (
                    <div key={post.id} className="bg-[#0a0a0a] border border-[#333] p-4 hover:border-[#00ff41] transition group">
                        <div className="flex justify-between">
                            <div><h3 className="font-bold text-lg text-white group-hover:text-[#00ff41]">{post.title}</h3><p className="text-xs text-gray-500">{post.tag} | {post.language}</p></div>
                            <div className="flex gap-2"><button onClick={() => startEdit(post)} className="text-yellow-500 text-sm">[EDIT]</button><button onClick={() => handleDelete(post.id)} className="text-red-500 text-sm">[DEL]</button></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="max-w-6xl mx-auto border border-[#00ff41] p-6 bg-black/80 shadow-[0_0_20px_rgba(0,255,65,0.2)]">
            <h2 className="text-2xl text-[#00ff41] mb-6 flex justify-between">
                <span>EDIT SECTIONS</span>
                <span className="text-sm text-gray-400 normal-case">{msg}</span>
            </h2>

            <form action={handleSectionSubmit} className="flex flex-col gap-6">
                <div>
                    <label className="block text-[#00ff41] mb-2 font-bold">SELECT SECTION:</label>
                    <select name="sectionKey" value={sectionKey} onChange={(e) => setSectionKey(e.target.value)} className="w-full bg-[#111] border border-[#00ff41] p-3 text-xl text-white outline-none">
                        <option value="about">01. ABOUT ME (Text)</option>
                        <option value="profile">02. PROFILE (Boxes)</option>
                        <option value="career">04. CAREER GOALS (Text)</option>
                        <option value="skills">06. SKILLS (Text)</option>
                        <option value="experience">07. EXPERIENCE (Boxes)</option>
                        {/* [CẬP NHẬT] Thêm Contact vào đây */}
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
                        <div><label className="block text-gray-400 mb-1 text-sm">English</label><textarea name="contentEn" value={secEn} onChange={e => setSecEn(e.target.value)} className="w-full bg-[#111] border border-[#333] p-3 text-white h-60 focus:border-[#00ff41]" /></div>
                        <div><label className="block text-gray-400 mb-1 text-sm">Vietnamese</label><textarea name="contentVi" value={secVi} onChange={e => setSecVi(e.target.value)} className="w-full bg-[#111] border border-[#333] p-3 text-white h-60 focus:border-[#00ff41]" /></div>
                        <div><label className="block text-gray-400 mb-1 text-sm">Japanese</label><textarea name="contentJp" value={secJp} onChange={e => setSecJp(e.target.value)} className="w-full bg-[#111] border border-[#333] p-3 text-white h-60 focus:border-[#00ff41]" /></div>
                    </div>
                )}

                <button type="submit" className="w-full bg-[#00ff41] text-black font-bold py-3 text-xl hover:opacity-90">SAVE CHANGES</button>
            </form>
        </div>
      )}
    </div>
  );
}