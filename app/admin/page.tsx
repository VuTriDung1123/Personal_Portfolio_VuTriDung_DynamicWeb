"use client";

import { useState, useEffect } from "react";
import { checkAdmin, createPost, deletePost, getAllPosts, updatePost, getSectionContent, saveSectionContent } from "@/lib/actions";

// --- TYPES ---
interface Post { id: string; title: string; tag: string; language: string; content: string; images: string; }
interface BoxItem { label: string; value: string; }
interface SectionBox { id: string; title: string; items: BoxItem[]; }
interface SectionData { contentEn: string; contentVi: string; contentJp: string; }

// Types cho Hero & Config
interface HeroData { fullName: string; nickName1: string; nickName2: string; avatarUrl: string; greeting: string; description: string; typewriter: string; }
interface ConfigData { resumeUrl: string; isOpenForWork: boolean; }

// [MỚI] Types cho Experience nâng cao
interface ExpItem {
    id: string;
    time: string;       // VD: 1/2025 - 3/2025
    role: string;       // VD: Công ty A - Dev
    details: string[];  // Các gạch đầu dòng
}
interface ExpGroup {
    id: string;
    title: string;      // VD: IT Experience
    items: ExpItem[];
}

// --- CONSTANTS ---
const DEFAULT_HERO: HeroData = { fullName: "Vũ Trí Dũng", nickName1: "David Miller", nickName2: "Akina Aoi", avatarUrl: "", greeting: "Hi, I am", description: "", typewriter: '["Developer", "Student"]' };

// --- SUB-COMPONENT: BOX EDITOR (Cho Profile, Contact) ---
interface BoxEditorProps {
    lang: 'en' | 'vi' | 'jp';
    data: SectionBox[];
    onUpdate: (newData: SectionBox[]) => void;
}

const BoxEditor = ({ lang, data, onUpdate }: BoxEditorProps) => {
    const addBox = () => onUpdate([...data, { id: Date.now().toString(), title: "New Group", items: [] }]);
    const removeBox = (idx: number) => { const n = [...data]; n.splice(idx, 1); onUpdate(n); };
    const updateTitle = (idx: number, v: string) => { const n = [...data]; n[idx].title = v; onUpdate(n); };
    const addItem = (idx: number) => { const n = [...data]; n[idx].items.push({ label: "", value: "" }); onUpdate(n); };
    const removeItem = (bIdx: number, iIdx: number) => { const n = [...data]; n[bIdx].items.splice(iIdx, 1); onUpdate(n); };
    const updateItem = (bIdx: number, iIdx: number, field: 'label'|'value', v: string) => { const n = [...data]; n[bIdx].items[iIdx][field] = v; onUpdate(n); };

    return (
        <div className="bg-[#111] p-4 border border-[#333] mb-4">
            <h3 className="text-[#00ff41] font-bold mb-2 uppercase border-b border-[#333]">LANG: {lang}</h3>
            {data.map((box, bIdx) => (
                <div key={box.id} className="mb-4 pl-4 border-l-2 border-yellow-600 hover:border-[#00ff41]">
                    <div className="flex gap-2 mb-2"><input value={box.title} onChange={(e) => updateTitle(bIdx, e.target.value)} className="bg-black border border-[#555] text-white p-1 flex-1" placeholder="Group Title" /><button type="button" onClick={() => removeBox(bIdx)} className="text-red-500 text-xs">[DEL]</button></div>
                    <div className="pl-4 space-y-1">{box.items.map((item, iIdx) => (<div key={iIdx} className="flex gap-2"><input value={item.label} onChange={(e) => updateItem(bIdx, iIdx, 'label', e.target.value)} className="bg-[#222] border border-[#444] text-[#aaa] w-1/3 text-xs" placeholder="Label" /><input value={item.value} onChange={(e) => updateItem(bIdx, iIdx, 'value', e.target.value)} className="bg-[#222] border border-[#444] text-white flex-1 text-xs" placeholder="Value" /><button type="button" onClick={() => removeItem(bIdx, iIdx)} className="text-red-500 text-xs">x</button></div>))}<button type="button" onClick={() => addItem(bIdx)} className="text-[#00ff41] text-xs border border-[#00ff41] px-2 hover:bg-[#00ff41] hover:text-black">+ Item</button></div>
                </div>
            ))}<button type="button" onClick={addBox} className="w-full bg-[#222] text-white py-1 hover:bg-[#333] text-sm">+ GROUP</button>
        </div>
    );
};

// --- [MỚI] SUB-COMPONENT: EXPERIENCE EDITOR ---
interface ExpEditorProps {
    lang: 'en' | 'vi' | 'jp';
    data: ExpGroup[];
    onUpdate: (newData: ExpGroup[]) => void;
}

const ExpEditor = ({ lang, data, onUpdate }: ExpEditorProps) => {
    const addGroup = () => onUpdate([...data, { id: Date.now().toString(), title: "New Category (e.g IT)", items: [] }]);
    const removeGroup = (idx: number) => { const n = [...data]; n.splice(idx, 1); onUpdate(n); };
    const updateTitle = (idx: number, v: string) => { const n = [...data]; n[idx].title = v; onUpdate(n); };
    
    const addItem = (gIdx: number) => { const n = [...data]; n[gIdx].items.push({ id: Date.now().toString(), time: "", role: "", details: [] }); onUpdate(n); };
    const removeItem = (gIdx: number, iIdx: number) => { const n = [...data]; n[gIdx].items.splice(iIdx, 1); onUpdate(n); };
    
    const updateItem = (gIdx: number, iIdx: number, field: keyof ExpItem, v: string) => { 
        const n = [...data]; 
        // @ts-expect-error: Details handled separately
        n[gIdx].items[iIdx][field] = v; 
        onUpdate(n); 
    };

    const updateDetails = (gIdx: number, iIdx: number, text: string) => {
        const n = [...data];
        // Tách dòng thành mảng
        n[gIdx].items[iIdx].details = text.split('\n');
        onUpdate(n);
    };

    return (
        <div className="bg-[#111] p-4 border border-[#333] mb-4">
            <h3 className="text-[#00ff41] font-bold mb-2 uppercase border-b border-[#333] flex justify-between">
                <span>EXPERIENCE ({lang})</span>
                <span className="text-[10px] text-gray-500">One bullet point per line</span>
            </h3>
            {data.map((group, gIdx) => (
                <div key={group.id} className="mb-6 pl-2 border-l-4 border-blue-600 bg-blue-900/10 p-2">
                    {/* Category Header */}
                    <div className="flex gap-2 mb-3">
                        <input value={group.title} onChange={e => updateTitle(gIdx, e.target.value)} className="bg-black border border-blue-500 text-blue-300 font-bold p-2 flex-1" placeholder="Category Name (e.g. IT)" />
                        <button type="button" onClick={() => removeGroup(gIdx)} className="text-red-500 font-bold px-2 border border-red-500 hover:bg-red-500 hover:text-black">DEL CAT</button>
                    </div>

                    {/* Job Items */}
                    <div className="space-y-4">
                        {group.items.map((item, iIdx) => (
                            <div key={item.id} className="bg-[#000] border border-[#333] p-3 ml-4 relative group">
                                <button type="button" onClick={() => removeItem(gIdx, iIdx)} className="absolute top-2 right-2 text-red-500 text-xs border border-red-500 px-1 hover:bg-red-500 hover:text-white">X</button>
                                <div className="grid grid-cols-1 gap-2 mb-2">
                                    <input value={item.time} onChange={e => updateItem(gIdx, iIdx, 'time', e.target.value)} className="bg-[#222] text-[#00ff41] text-xs p-1 border border-[#444]" placeholder="Time (e.g. 1/2025 - 3/2025)" />
                                    <input value={item.role} onChange={e => updateItem(gIdx, iIdx, 'role', e.target.value)} className="bg-[#222] text-white font-bold text-sm p-1 border border-[#444]" placeholder="Company - Role" />
                                </div>
                                <textarea 
                                    value={item.details.join('\n')} 
                                    onChange={e => updateDetails(gIdx, iIdx, e.target.value)}
                                    className="w-full bg-[#111] text-gray-300 text-xs p-2 border border-[#444] h-24 focus:border-[#00ff41] outline-none"
                                    placeholder="- Work detail 1&#10;- Work detail 2&#10;(Enter for new line)"
                                />
                            </div>
                        ))}
                        <button type="button" onClick={() => addItem(gIdx)} className="ml-4 text-xs bg-[#222] text-blue-300 px-3 py-1 border border-blue-500 hover:bg-blue-500 hover:text-black transition">+ Add Job</button>
                    </div>
                </div>
            ))}
            <button type="button" onClick={addGroup} className="w-full mt-4 bg-[#222] text-white py-2 border border-dashed border-[#555] hover:border-[#00ff41] hover:text-[#00ff41] transition">+ ADD NEW CATEGORY</button>
        </div>
    );
};

// --- SUB-COMPONENT: HERO EDITOR ---
interface HeroEditorProps { lang: 'en'|'vi'|'jp'; data: HeroData; onUpdate: (field: keyof HeroData, val: string) => void; }
const HeroEditor = ({ lang, data, onUpdate }: HeroEditorProps) => (
    <div className="bg-[#111] p-4 border border-[#333]">
        <h3 className="text-[#00ff41] font-bold mb-4 uppercase border-b border-[#333]">HERO INFO ({lang})</h3>
        <div className="space-y-3">
            <div><label className="text-xs text-gray-500">Greeting</label><input value={data.greeting} onChange={e=>onUpdate('greeting', e.target.value)} className="w-full bg-[#222] text-white p-2 border border-[#444]" /></div>
            <div><label className="text-xs text-gray-500">Full Name</label><input value={data.fullName} onChange={e=>onUpdate('fullName', e.target.value)} className="w-full bg-[#222] text-white p-2 border border-[#444]" /></div>
            <div className="flex gap-2"><div className="flex-1"><label className="text-xs text-gray-500">Nick 1</label><input value={data.nickName1} onChange={e=>onUpdate('nickName1', e.target.value)} className="w-full bg-[#222] text-white p-2 border border-[#444]" /></div><div className="flex-1"><label className="text-xs text-gray-500">Nick 2</label><input value={data.nickName2} onChange={e=>onUpdate('nickName2', e.target.value)} className="w-full bg-[#222] text-white p-2 border border-[#444]" /></div></div>
            <div><label className="text-xs text-gray-500">Typewriter (JSON)</label><input value={data.typewriter} onChange={e=>onUpdate('typewriter', e.target.value)} className="w-full bg-[#222] text-white p-2 border border-[#444]" /></div>
            <div><label className="text-xs text-gray-500">Description</label><textarea value={data.description} onChange={e=>onUpdate('description', e.target.value)} rows={3} className="w-full bg-[#222] text-white p-2 border border-[#444]" /></div>
            <div><label className="text-xs text-gray-500">Avatar URL</label><input value={data.avatarUrl} onChange={e=>onUpdate('avatarUrl', e.target.value)} className="w-full bg-[#222] text-white p-2 border border-[#444]" /></div>
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

  // 2. Box Data (Profile, Contact)
  const [boxesEn, setBoxesEn] = useState<SectionBox[]>([]);
  const [boxesVi, setBoxesVi] = useState<SectionBox[]>([]);
  const [boxesJp, setBoxesJp] = useState<SectionBox[]>([]);

  // 3. Hero Data
  const [heroEn, setHeroEn] = useState<HeroData>(DEFAULT_HERO);
  const [heroVi, setHeroVi] = useState<HeroData>(DEFAULT_HERO);
  const [heroJp, setHeroJp] = useState<HeroData>(DEFAULT_HERO);

  // 4. Config Data
  const [config, setConfig] = useState<ConfigData>({ resumeUrl: "", isOpenForWork: true });

  // [MỚI] 5. Experience Data
  const [expEn, setExpEn] = useState<ExpGroup[]>([]);
  const [expVi, setExpVi] = useState<ExpGroup[]>([]);
  const [expJp, setExpJp] = useState<ExpGroup[]>([]);

  const isBoxSection = ['profile', 'contact'].includes(sectionKey);
  const isExpSection = sectionKey === 'experience'; // Tách riêng Experience
  const isHeroSection = sectionKey === 'hero';
  const isConfigSection = sectionKey === 'global_config';

  useEffect(() => { getAllPosts().then((data) => setPosts(data as unknown as Post[])); }, []);

  // LOAD DATA
  useEffect(() => {
    if (activeTab === 'content') {
        const fetchSection = async () => {
            setMsg(">> LOADING...");
            try {
                const data = await getSectionContent(sectionKey);
                if (data) {
                    const typedData = data as unknown as SectionData;
                    
                    if (isExpSection) {
                        try { setExpEn(JSON.parse(typedData.contentEn)); } catch { setExpEn([]); }
                        try { setExpVi(JSON.parse(typedData.contentVi)); } catch { setExpVi([]); }
                        try { setExpJp(JSON.parse(typedData.contentJp)); } catch { setExpJp([]); }
                    }
                    else if (isBoxSection) {
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
                        try { 
                            const parsed = JSON.parse(typedData.contentEn);
                            setConfig({ resumeUrl: parsed.resumeUrl || "", isOpenForWork: parsed.isOpenForWork ?? true });
                        } catch { setConfig({ resumeUrl: "", isOpenForWork: true }); }
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
                    setExpEn([]); setExpVi([]); setExpJp([]);
                    setHeroEn(DEFAULT_HERO); setHeroVi(DEFAULT_HERO); setHeroJp(DEFAULT_HERO);
                    setConfig({ resumeUrl: "", isOpenForWork: true });
                }
                setMsg("");
            } catch (error) { console.error(error); setMsg("!! ERROR LOAD"); }
        };
        fetchSection();
    }
  }, [sectionKey, activeTab, isBoxSection, isHeroSection, isConfigSection, isExpSection]);

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

  // HERO HELPERS
  const updateHero = (lang: 'en'|'vi'|'jp', field: keyof HeroData, val: string) => {
      const setter = lang === 'en' ? setHeroEn : (lang === 'vi' ? setHeroVi : setHeroJp);
      setter(prev => ({ ...prev, [field]: val }));
  };

  async function handleSectionSubmit(formData: FormData) {
    if (isSaving) return; setIsSaving(true); setMsg(">> SAVING...");

    if (isExpSection) {
        formData.set("contentEn", JSON.stringify(expEn));
        formData.set("contentVi", JSON.stringify(expVi));
        formData.set("contentJp", JSON.stringify(expJp));
    } else if (isBoxSection) {
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
                        <option value="experience">07. EXPERIENCE (CV Style)</option>
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
                                <input value={config.resumeUrl || ""} onChange={e => setConfig({...config, resumeUrl: e.target.value})} className="w-full bg-black border border-[#555] text-white p-3 focus:border-[#00ff41] outline-none" />
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-gray-400">Status &quot;Open for Work&quot;:</label>
                                <input type="checkbox" checked={!!config.isOpenForWork} onChange={e => setConfig({...config, isOpenForWork: e.target.checked})} className="w-6 h-6 accent-[#00ff41]" />
                                <span className={config.isOpenForWork ? "text-[#00ff41]" : "text-red-500"}>{config.isOpenForWork ? "ENABLED" : "DISABLED"}</span>
                            </div>
                        </div>
                    </div>
                ) : isExpSection ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ExpEditor lang="en" data={expEn} onUpdate={setExpEn} />
                        <ExpEditor lang="vi" data={expVi} onUpdate={setExpVi} />
                        <ExpEditor lang="jp" data={expJp} onUpdate={setExpJp} />
                    </div>
                ) : isBoxSection ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <BoxEditor lang="en" data={boxesEn} onUpdate={setBoxesEn} />
                        <BoxEditor lang="vi" data={boxesVi} onUpdate={setBoxesVi} />
                        <BoxEditor lang="jp" data={boxesJp} onUpdate={setBoxesJp} />
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