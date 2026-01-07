"use client";

import { useState, useEffect } from "react";
import { checkAdmin, createPost, deletePost, getAllPosts, updatePost, getSectionContent, saveSectionContent } from "@/lib/actions";

// --- TYPES ---
interface Post { id: string; title: string; tag: string; language: string; content: string; images: string; }
interface BoxItem { label: string; value: string; }
interface SectionBox { id: string; title: string; items: BoxItem[]; }
interface SectionData { contentEn: string; contentVi: string; contentJp: string; }

interface HeroData {
    fullName: string;
    nickName1: string;
    nickName2: string;
    avatarUrl: string;
    greeting: string;
    description: string;
    typewriter: string;
}

interface ConfigData {
    resumeUrl: string;
    isOpenForWork: boolean;
}

// --- CONSTANTS ---
const DEFAULT_HERO: HeroData = { 
    fullName: "Vũ Trí Dũng", 
    nickName1: "David Miller", 
    nickName2: "Akina Aoi", 
    avatarUrl: "", 
    greeting: "Hi, I am", 
    description: "", 
    typewriter: '["Developer", "Student"]' 
};

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

const BoxEditor = ({ lang, data, onAddBox, onRemoveBox, onUpdateTitle, onAddItem, onRemoveItem, onUpdateItem }: BoxEditorProps) => {
    return (
        <div className="bg-[#111] p-4 border border-[#333] mb-4 relative group">
            <h3 className="text-[#00ff41] font-bold mb-2 uppercase border-b border-[#333] pb-1">LANG: {lang}</h3>
            {data.map((box, bIdx) => (
                <div key={box.id} className="mb-4 pl-4 border-l-2 border-yellow-600 hover:border-[#00ff41]">
                    <div className="flex gap-2 mb-2"><input value={box.title} onChange={(e) => onUpdateTitle(bIdx, e.target.value)} className="bg-black border border-[#555] text-white p-1 flex-1" /><button type="button" onClick={() => onRemoveBox(bIdx)} className="text-red-500 text-xs">[DEL]</button></div>
                    <div className="pl-4 space-y-1">{box.items.map((item, iIdx) => (<div key={iIdx} className="flex gap-2"><input value={item.label} onChange={(e) => onUpdateItem(bIdx, iIdx, 'label', e.target.value)} className="bg-[#222] border border-[#444] text-[#aaa] w-1/3 text-xs" /><input value={item.value} onChange={(e) => onUpdateItem(bIdx, iIdx, 'value', e.target.value)} className="bg-[#222] border border-[#444] text-white flex-1 text-xs" /><button type="button" onClick={() => onRemoveItem(bIdx, iIdx)} className="text-red-500 text-xs">x</button></div>))}<button type="button" onClick={() => onAddItem(bIdx)} className="text-[#00ff41] text-xs border border-[#00ff41] px-2 hover:bg-[#00ff41] hover:text-black">+ Item</button></div>
                </div>
            ))}<button type="button" onClick={onAddBox} className="w-full bg-[#222] text-white py-1 hover:bg-[#333] text-sm">+ GROUP</button>
        </div>
    );
};

// --- SUB-COMPONENT: HERO EDITOR (Move outside) ---
interface HeroEditorProps {
    lang: 'en'|'vi'|'jp';
    data: HeroData;
    onUpdate: (field: keyof HeroData, val: string) => void;
}

const HeroEditor = ({ lang, data, onUpdate }: HeroEditorProps) => (
    <div className="bg-[#111] p-4 border border-[#333]">
        <h3 className="text-[#00ff41] font-bold mb-4 uppercase border-b border-[#333]">HERO INFO ({lang})</h3>
        <div className="space-y-3">
            <div><label className="text-xs text-gray-500">Greeting (Ex: Hi, I am)</label><input value={data.greeting} onChange={e=>onUpdate('greeting', e.target.value)} className="w-full bg-[#222] text-white p-2 border border-[#444]" /></div>
            <div><label className="text-xs text-gray-500">Full Name</label><input value={data.fullName} onChange={e=>onUpdate('fullName', e.target.value)} className="w-full bg-[#222] text-white p-2 border border-[#444]" /></div>
            <div className="flex gap-2">
                <div className="flex-1"><label className="text-xs text-gray-500">Nickname 1</label><input value={data.nickName1} onChange={e=>onUpdate('nickName1', e.target.value)} className="w-full bg-[#222] text-white p-2 border border-[#444]" /></div>
                <div className="flex-1"><label className="text-xs text-gray-500">Nickname 2</label><input value={data.nickName2} onChange={e=>onUpdate('nickName2', e.target.value)} className="w-full bg-[#222] text-white p-2 border border-[#444]" /></div>
            </div>
            <div><label className="text-xs text-gray-500">Typewriter Texts (JSON Array)</label><input value={data.typewriter} onChange={e=>onUpdate('typewriter', e.target.value)} className="w-full bg-[#222] text-white p-2 border border-[#444]" placeholder='["Dev", "Student"]' /></div>
            <div><label className="text-xs text-gray-500">Description</label><textarea value={data.description} onChange={e=>onUpdate('description', e.target.value)} rows={3} className="w-full bg-[#222] text-white p-2 border border-[#444]" /></div>
            <div><label className="text-xs text-gray-500">Avatar URL (Chung)</label><input value={data.avatarUrl} onChange={e=>onUpdate('avatarUrl', e.target.value)} className="w-full bg-[#222] text-white p-2 border border-[#444]" /></div>
        </div>
    </div>
);

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
  const [isSaving, setIsSaving] = useState(false);
  
  // 1. Text Data
  const [secEn, setSecEn] = useState("");
  const [secVi, setSecVi] = useState("");
  const [secJp, setSecJp] = useState("");

  // 2. Box Data
  const [boxesEn, setBoxesEn] = useState<SectionBox[]>([]);
  const [boxesVi, setBoxesVi] = useState<SectionBox[]>([]);
  const [boxesJp, setBoxesJp] = useState<SectionBox[]>([]);

  // 3. Hero Data
  const [heroEn, setHeroEn] = useState<HeroData>(DEFAULT_HERO);
  const [heroVi, setHeroVi] = useState<HeroData>(DEFAULT_HERO);
  const [heroJp, setHeroJp] = useState<HeroData>(DEFAULT_HERO);

  // 4. Config Data
  const [config, setConfig] = useState<ConfigData>({ resumeUrl: "", isOpenForWork: true });

  const isBoxSection = ['profile', 'experience', 'contact'].includes(sectionKey);
  const isHeroSection = sectionKey === 'hero';
  const isConfigSection = sectionKey === 'global_config';

  useEffect(() => { getAllPosts().then((data) => setPosts(data as unknown as Post[])); }, []);

  // LOAD DATA LOGIC
  useEffect(() => {
    if (activeTab === 'content') {
        const fetchSection = async () => {
            setMsg(">> LOADING...");
            try {
                const data = await getSectionContent(sectionKey);
                if (data) {
                    const typedData = data as unknown as SectionData;
                    
                    if (isBoxSection) {
                        try { setBoxesEn(JSON.parse(typedData.contentEn)); } catch { setBoxesEn([]); }
                        try { setBoxesVi(JSON.parse(typedData.contentVi)); } catch { setBoxesVi([]); }
                        try { setBoxesJp(JSON.parse(typedData.contentJp)); } catch { setBoxesJp([]); }
                    } 
                    else if (isHeroSection) {
                        try { setHeroEn({ ...DEFAULT_HERO, ...JSON.parse(typedData.contentEn) }); } catch { setHeroEn(DEFAULT_HERO); }
                        try { setHeroVi({ ...DEFAULT_HERO, ...JSON.parse(typedData.contentVi) }); } catch { setHeroVi(DEFAULT_HERO); }
                        try { setHeroJp({ ...DEFAULT_HERO, ...JSON.parse(typedData.contentJp) }); } catch { setHeroJp(DEFAULT_HERO); }
                    }
                    else if (isConfigSection) {
                        try { setConfig(JSON.parse(typedData.contentEn)); } catch { setConfig({ resumeUrl: "", isOpenForWork: true }); }
                    }
                    else { 
                        setSecEn(typedData.contentEn || "");
                        setSecVi(typedData.contentVi || "");
                        setSecJp(typedData.contentJp || "");
                    }
                } else {
                    // Reset
                    setSecEn(""); setSecVi(""); setSecJp("");
                    setBoxesEn([]); setBoxesVi([]); setBoxesJp([]);
                    setHeroEn(DEFAULT_HERO); setHeroVi(DEFAULT_HERO); setHeroJp(DEFAULT_HERO);
                    setConfig({ resumeUrl: "", isOpenForWork: true });
                }
                setMsg("");
            } catch (error) { console.error(error); setMsg("!! ERROR LOAD"); }
        };
        fetchSection();
    }
  }, [sectionKey, activeTab, isBoxSection, isHeroSection, isConfigSection]);

  async function handleLogin(formData: FormData) { const res = await checkAdmin(formData); if (res.success) setIsAuth(true); else alert("Wrong Password!"); }
  const addLinkField = () => setImages([...images, ""]);
  const removeLinkField = (index: number) => { const newImg = [...images]; newImg.splice(index, 1); setImages(newImg); };
  const updateLinkField = (index: number, val: string) => { const newImg = [...images]; newImg[index] = val; setImages(newImg); };
  async function handleBlogSubmit(formData: FormData) { 
      const jsonImages = JSON.stringify(images.filter(img => img.trim() !== "")); formData.set("images", jsonImages);
      if (editingPost) await updatePost(formData); else await createPost(formData);
      setEditingPost(null); setImages([]); setPosts(await getAllPosts() as unknown as Post[]); alert("Saved!");
  }
  function startEdit(post: Post) { setEditingPost(post); setTag(post.tag); try { setImages(JSON.parse(post.images)); } catch { setImages([]); } window.scrollTo({ top: 0, behavior: 'smooth' }); }
  async function handleDelete(id: string) { if(!confirm("Delete?")) return; await deletePost(id); setPosts(await getAllPosts() as unknown as Post[]); }

  // BOX HELPERS
  const updateBoxState = (lang: 'en'|'vi'|'jp', newBoxes: SectionBox[]) => { if(lang==='en') setBoxesEn(newBoxes); else if(lang==='vi') setBoxesVi(newBoxes); else setBoxesJp(newBoxes); };
  const addBox = (l: 'en'|'vi'|'jp') => updateBoxState(l, [...(l==='en'?boxesEn:l==='vi'?boxesVi:boxesJp), { id: Date.now().toString(), title: "New Group", items: [] }]);
  const removeBox = (l: 'en'|'vi'|'jp', i: number) => { const c = [...(l==='en'?boxesEn:l==='vi'?boxesVi:boxesJp)]; c.splice(i, 1); updateBoxState(l, c); };
  const updateBoxTitle = (l: 'en'|'vi'|'jp', i: number, v: string) => { const c = [...(l==='en'?boxesEn:l==='vi'?boxesVi:boxesJp)]; c[i].title = v; updateBoxState(l, c); };
  const addItem = (l: 'en'|'vi'|'jp', bi: number) => { const c = [...(l==='en'?boxesEn:l==='vi'?boxesVi:boxesJp)]; c[bi].items.push({label:"", value:""}); updateBoxState(l, c); };
  const removeItem = (l: 'en'|'vi'|'jp', bi: number, ii: number) => { const c = [...(l==='en'?boxesEn:l==='vi'?boxesVi:boxesJp)]; c[bi].items.splice(ii, 1); updateBoxState(l, c); };
  const updateItem = (l: 'en'|'vi'|'jp', bi: number, ii: number, f: 'label'|'value', v: string) => { const c = [...(l==='en'?boxesEn:l==='vi'?boxesVi:boxesJp)]; c[bi].items[ii][f] = v; updateBoxState(l, c); };

  // HERO HELPERS
  const updateHero = (lang: 'en'|'vi'|'jp', field: keyof HeroData, val: string) => {
      const setter = lang === 'en' ? setHeroEn : (lang === 'vi' ? setHeroVi : setHeroJp);
      setter(prev => ({ ...prev, [field]: val }));
  };

  async function handleSectionSubmit(formData: FormData) {
    if (isSaving) return; setIsSaving(true); setMsg(">> SAVING...");

    if (isBoxSection) {
        formData.set("contentEn", JSON.stringify(boxesEn));
        formData.set("contentVi", JSON.stringify(boxesVi));
        formData.set("contentJp", JSON.stringify(boxesJp));
    } else if (isHeroSection) {
        formData.set("contentEn", JSON.stringify(heroEn));
        formData.set("contentVi", JSON.stringify(heroVi));
        formData.set("contentJp", JSON.stringify(heroJp));
    } else if (isConfigSection) {
        formData.set("contentEn", JSON.stringify(config)); 
        formData.set("contentVi", ""); formData.set("contentJp", "");
    } else {
        formData.set("contentEn", secEn); formData.set("contentVi", secVi); formData.set("contentJp", secJp);
    }

    const res = await saveSectionContent(formData);
    setIsSaving(false);
    if (res.success) { setMsg("✅ SAVED!"); setTimeout(() => setMsg(""), 3000); } else setMsg("❌ FAILED");
  }

  if (!isAuth) return ( <div className="flex h-screen items-center justify-center bg-black text-[#00ff41] font-mono"><form action={handleLogin} className="border border-[#00ff41] p-10"><h1 className="text-2xl mb-5">ADMIN LOGIN</h1><input name="username" placeholder="User" className="block w-full bg-black border p-2 mb-3 text-white" /><input name="password" type="password" placeholder="Pass" className="block w-full bg-black border p-2 mb-3 text-white" /><button className="w-full bg-[#00ff41] text-black font-bold p-2">LOGIN</button></form></div> );

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono p-10">
      <div className="flex justify-between items-center mb-8 border-b border-[#00ff41] pb-4 sticky top-0 bg-[#050505] z-50">
        <h1 className="text-4xl text-[#00ff41]">ADMIN DASHBOARD</h1>
        <div className="flex gap-4">
            <button onClick={() => setActiveTab('blog')} className={`px-4 py-2 border ${activeTab==='blog'?'bg-[#00ff41] text-black':'text-[#00ff41] border-[#00ff41]'}`}>BLOG</button>
            <button onClick={() => setActiveTab('content')} className={`px-4 py-2 border ${activeTab==='content'?'bg-[#00ff41] text-black':'text-[#00ff41] border-[#00ff41]'}`}>SECTIONS</button>
        </div>
      </div>

      {activeTab === 'blog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="p-5 border border-[#00ff41] bg-black/80 h-fit sticky top-24">
                <h2 className="text-2xl mb-5 border-b pb-2 text-[#00ff41]">{editingPost ? "EDIT POST" : "NEW POST"}</h2>
                <form action={handleBlogSubmit} className="flex flex-col gap-4">
                    {editingPost && <input type="hidden" name="id" value={editingPost.id} />}
                    <input name="title" placeholder="Title" defaultValue={editingPost?.title} required className="bg-[#111] border border-[#333] p-2 text-white" />
                    <select name="tag" value={tag} onChange={e=>setTag(e.target.value)} className="bg-[#111] border border-[#333] p-2 text-white"><option value="my_confessions">My Confessions</option><option value="uni_projects">University Projects</option><option value="personal_projects">Personal Projects</option><option value="achievements">Achievements</option><option value="it_events">IT Events</option><option value="lang_certs">Language Certs</option><option value="tech_certs">Tech Certs</option></select>
                    <select name="language" defaultValue={editingPost?.language||"vi"} className="bg-[#111] border border-[#333] p-2 text-white"><option value="vi">Vietnamese</option><option value="en">English</option><option value="jp">Japanese</option></select>
                    <textarea name="content" placeholder="Content..." defaultValue={editingPost?.content} rows={10} required className="bg-[#111] border border-[#333] p-2 text-white text-sm" />
                    <div className="border border-[#333] p-3"><label className="text-sm block mb-2">IMAGES</label>{images.map((l,i)=>(<div key={i} className="flex gap-2 mb-2"><input value={l} onChange={e=>updateLinkField(i,e.target.value)} className="flex-1 bg-[#111] border border-[#333] p-1 text-xs text-white"/><button type="button" onClick={()=>removeLinkField(i)} className="text-red-500 px-2">X</button></div>))}<button type="button" onClick={addLinkField} className="text-xs border px-2 py-1">+ Add Image</button></div>
                    <div className="flex gap-2"><button className="flex-1 bg-[#00ff41] text-black font-bold py-2">SUBMIT</button>{editingPost && <button type="button" onClick={()=>{setEditingPost(null);setImages([])}} className="bg-gray-700 px-4 text-white">CANCEL</button>}</div>
                </form>
            </div>
            <div className="flex flex-col gap-4">
                {posts.map(post => (<div key={post.id} className="bg-[#0a0a0a] border border-[#333] p-4 flex justify-between"><div><h3 className="font-bold text-white">{post.title}</h3><p className="text-xs text-gray-500">{post.tag}</p></div><div className="flex gap-2"><button onClick={()=>startEdit(post)} className="text-yellow-500 text-xs">[EDIT]</button><button onClick={()=>handleDelete(post.id)} className="text-red-500 text-xs">[DEL]</button></div></div>))}
            </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="max-w-7xl mx-auto border border-[#00ff41] p-6 bg-black/80">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl text-[#00ff41]">EDIT SECTIONS</h2>{msg && <span className="text-[#00ff41] border border-[#00ff41] px-4 py-1 bg-[#003300]">{msg}</span>}
            </div>
            <form action={handleSectionSubmit} className="flex flex-col gap-6">
                <div>
                    <label className="block text-[#00ff41] mb-2 font-bold">SELECT SECTION:</label>
                    <select name="sectionKey" value={sectionKey} onChange={(e) => setSectionKey(e.target.value)} className="w-full bg-[#111] border border-[#00ff41] p-3 text-xl text-white outline-none">
                        <option value="global_config">★ GLOBAL CONFIG (Resume, Status)</option>
                        <option value="hero">★ HERO SECTION (Main Info)</option>
                        <option value="about">01. ABOUT ME (Text)</option>
                        <option value="profile">02. PROFILE (Boxes)</option>
                        <option value="career">04. CAREER GOALS (Text)</option>
                        <option value="skills">06. SKILLS (Text)</option>
                        <option value="experience">07. EXPERIENCE (Boxes)</option>
                        <option value="contact">11. CONTACT (Boxes)</option>
                    </select>
                </div>

                {isHeroSection ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <HeroEditor lang="en" data={heroEn} onUpdate={(f,v) => updateHero('en', f, v)} />
                        <HeroEditor lang="vi" data={heroVi} onUpdate={(f,v) => updateHero('vi', f, v)} />
                        <HeroEditor lang="jp" data={heroJp} onUpdate={(f,v) => updateHero('jp', f, v)} />
                    </div>
                ) : isConfigSection ? (
                    <div className="border border-[#00ff41] p-6 bg-[#111]">
                        <h3 className="text-[#00ff41] font-bold mb-4 border-b border-[#333] pb-2">GLOBAL CONFIGURATION</h3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-gray-400 mb-1">Link Download CV (PDF URL)</label>
                                <input 
                                    value={config.resumeUrl} 
                                    onChange={e => setConfig({...config, resumeUrl: e.target.value})} 
                                    className="w-full bg-black border border-[#555] text-white p-3 focus:border-[#00ff41] outline-none" 
                                    placeholder="/files/my_cv.pdf or https://..."
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-gray-400">Status &quot;Open for Work&quot;:</label>
                                <input 
                                    type="checkbox" 
                                    checked={config.isOpenForWork} 
                                    onChange={e => setConfig({...config, isOpenForWork: e.target.checked})} 
                                    className="w-6 h-6 accent-[#00ff41]" 
                                />
                                <span className={config.isOpenForWork ? "text-[#00ff41]" : "text-red-500"}>
                                    {config.isOpenForWork ? "ENABLED (Showing Green Dot)" : "DISABLED (Busy)"}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : isBoxSection ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <BoxEditor lang="en" data={boxesEn} onAddBox={()=>addBox('en')} onRemoveBox={i=>removeBox('en',i)} onUpdateTitle={(i,v)=>updateBoxTitle('en',i,v)} onAddItem={i=>addItem('en',i)} onRemoveItem={(b,i)=>removeItem('en',b,i)} onUpdateItem={(b,i,f,v)=>updateItem('en',b,i,f,v)} />
                        <BoxEditor lang="vi" data={boxesVi} onAddBox={()=>addBox('vi')} onRemoveBox={i=>removeBox('vi',i)} onUpdateTitle={(i,v)=>updateBoxTitle('vi',i,v)} onAddItem={i=>addItem('vi',i)} onRemoveItem={(b,i)=>removeItem('vi',b,i)} onUpdateItem={(b,i,f,v)=>updateItem('vi',b,i,f,v)} />
                        <BoxEditor lang="jp" data={boxesJp} onAddBox={()=>addBox('jp')} onRemoveBox={i=>removeBox('jp',i)} onUpdateTitle={(i,v)=>updateBoxTitle('jp',i,v)} onAddItem={i=>addItem('jp',i)} onRemoveItem={(b,i)=>removeItem('jp',b,i)} onUpdateItem={(b,i,f,v)=>updateItem('jp',b,i,f,v)} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><label className="text-gray-400 mb-1 block">English</label><textarea name="contentEn" value={secEn} onChange={e=>setSecEn(e.target.value)} className="w-full bg-[#111] border border-[#333] p-3 text-white h-60 focus:border-[#00ff41] outline-none" /></div>
                        <div><label className="text-gray-400 mb-1 block">Vietnamese</label><textarea name="contentVi" value={secVi} onChange={e=>setSecVi(e.target.value)} className="w-full bg-[#111] border border-[#333] p-3 text-white h-60 focus:border-[#00ff41] outline-none" /></div>
                        <div><label className="text-gray-400 mb-1 block">Japanese</label><textarea name="contentJp" value={secJp} onChange={e=>setSecJp(e.target.value)} className="w-full bg-[#111] border border-[#333] p-3 text-white h-60 focus:border-[#00ff41] outline-none" /></div>
                    </div>
                )}

                <button type="submit" disabled={isSaving} className={`w-full font-bold py-3 text-xl transition-all ${isSaving?'bg-gray-700 text-gray-400':'bg-[#00ff41] text-black hover:opacity-90'}`}>{isSaving ? "PROCESSING..." : "SAVE CHANGES"}</button>
            </form>
        </div>
      )}
    </div>
  );
}