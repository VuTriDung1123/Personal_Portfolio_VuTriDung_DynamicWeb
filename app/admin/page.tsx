"use client";

import { useState, useEffect } from "react";
import { checkAdmin, createPost, deletePost, getAllPosts, updatePost, getSectionContent, saveSectionContent } from "@/lib/actions";
import MatrixRain from "@/components/MatrixRain"; // [MỚI] Import Matrix Rain cho Admin

// --- TYPES ---
interface Post { id: string; title: string; tag: string; language: string; content: string; images: string; }
interface BoxItem { label: string; value: string; }
interface SectionBox { id: string; title: string; items: BoxItem[]; }
interface SectionData { contentEn: string; contentVi: string; contentJp: string; }

// Types Data
interface HeroData { fullName: string; nickName1: string; nickName2: string; avatarUrl: string; greeting: string; description: string; typewriter: string; }
interface ConfigData { resumeUrl: string; isOpenForWork: boolean; }
interface ExpItem { id: string; time: string; role: string; details: string[]; }
interface ExpGroup { id: string; title: string; items: ExpItem[]; }
interface FaqItem { q: string; a: string; }

// --- CONSTANTS ---
const DEFAULT_HERO: HeroData = { fullName: "Vũ Trí Dũng", nickName1: "David Miller", nickName2: "Akina Aoi", avatarUrl: "", greeting: "Hi, I am", description: "", typewriter: '["Developer", "Student"]' };

// --- SUB-COMPONENTS EDITORS ---
interface BoxEditorProps { lang: 'en' | 'vi' | 'jp'; data: SectionBox[]; onUpdate: (newData: SectionBox[]) => void; }
const BoxEditor = ({ lang, data, onUpdate }: BoxEditorProps) => {
    const addBox = () => onUpdate([...data, { id: Date.now().toString(), title: "New Group", items: [] }]);
    const removeBox = (idx: number) => { const n = [...data]; n.splice(idx, 1); onUpdate(n); };
    const updateTitle = (idx: number, v: string) => { const n = [...data]; n[idx].title = v; onUpdate(n); };
    const addItem = (idx: number) => { const n = [...data]; n[idx].items.push({ label: "", value: "" }); onUpdate(n); };
    const removeItem = (bIdx: number, iIdx: number) => { const n = [...data]; n[bIdx].items.splice(iIdx, 1); onUpdate(n); };
    const updateItem = (bIdx: number, iIdx: number, field: 'label'|'value', v: string) => { const n = [...data]; n[bIdx].items[iIdx][field] = v; onUpdate(n); };

    return (
        <div className="bg-[#050505]/90 p-4 border border-[#333] mb-4 backdrop-blur-sm">
            <h3 className="text-[#00ff41] font-bold mb-2 uppercase border-b border-[#333]">LANG: {lang}</h3>
            {data.map((box, bIdx) => (
                <div key={box.id} className="mb-4 pl-4 border-l-2 border-[#00ff41]/50 hover:border-[#00ff41]">
                    <div className="flex gap-2 mb-2"><input value={box.title} onChange={(e) => updateTitle(bIdx, e.target.value)} className="bg-black border border-[#555] text-white p-1 flex-1 text-sm" placeholder="Group Title" /><button type="button" onClick={() => removeBox(bIdx)} className="text-red-500 text-xs">[DEL]</button></div>
                    <div className="pl-4 space-y-1">{box.items.map((item, iIdx) => (<div key={iIdx} className="flex gap-2"><input value={item.label} onChange={(e) => updateItem(bIdx, iIdx, 'label', e.target.value)} className="bg-[#222] border border-[#444] text-[#aaa] w-1/3 text-xs" placeholder="Label" /><input value={item.value} onChange={(e) => updateItem(bIdx, iIdx, 'value', e.target.value)} className="bg-[#222] border border-[#444] text-white flex-1 text-xs" placeholder="Value" /><button type="button" onClick={() => removeItem(bIdx, iIdx)} className="text-red-500 text-xs">x</button></div>))}<button type="button" onClick={() => addItem(bIdx)} className="text-[#00ff41] text-xs border border-[#00ff41] px-2 hover:bg-[#00ff41] hover:text-black mt-1">+ Item</button></div>
                </div>
            ))}<button type="button" onClick={addBox} className="w-full bg-[#222] text-white py-1 hover:bg-[#333] text-sm border border-dashed border-[#555]">+ GROUP</button>
        </div>
    );
};

interface ExpEditorProps { lang: 'en' | 'vi' | 'jp'; data: ExpGroup[]; onUpdate: (newData: ExpGroup[]) => void; }
const ExpEditor = ({ lang, data, onUpdate }: ExpEditorProps) => {
    const addGroup = () => onUpdate([...data, { id: Date.now().toString(), title: "New Category", items: [] }]);
    const removeGroup = (idx: number) => { const n = [...data]; n.splice(idx, 1); onUpdate(n); };
    const updateTitle = (idx: number, v: string) => { const n = [...data]; n[idx].title = v; onUpdate(n); };
    const addItem = (gIdx: number) => { const n = [...data]; n[gIdx].items.push({ id: Date.now().toString(), time: "", role: "", details: [] }); onUpdate(n); };
    const removeItem = (gIdx: number, iIdx: number) => { const n = [...data]; n[gIdx].items.splice(iIdx, 1); onUpdate(n); };
    const updateItem = (gIdx: number, iIdx: number, field: keyof ExpItem, v: string) => { const n = [...data]; /* @ts-expect-error: Details handled separately */ n[gIdx].items[iIdx][field] = v; onUpdate(n); };
    const updateDetails = (gIdx: number, iIdx: number, text: string) => { const n = [...data]; n[gIdx].items[iIdx].details = text.split('\n'); onUpdate(n); };

    return (
        <div className="bg-[#050505]/90 p-4 border border-[#333] mb-4 backdrop-blur-sm">
            <h3 className="text-[#00ff41] font-bold mb-2 uppercase border-b border-[#333] flex justify-between"><span>EXPERIENCE ({lang})</span></h3>
            {data.map((group, gIdx) => (
                <div key={group.id} className="mb-6 pl-2 border-l-4 border-blue-600 bg-blue-900/10 p-2">
                    <div className="flex gap-2 mb-3"><input value={group.title} onChange={e => updateTitle(gIdx, e.target.value)} className="bg-black border border-blue-500 text-blue-300 font-bold p-2 flex-1 text-sm" placeholder="Category" /><button type="button" onClick={() => removeGroup(gIdx)} className="text-red-500 font-bold px-2 border border-red-500 hover:bg-red-500 hover:text-black text-xs">DEL</button></div>
                    <div className="space-y-4">{group.items.map((item, iIdx) => (<div key={item.id} className="bg-[#000] border border-[#333] p-3 ml-4 relative group"><button type="button" onClick={() => removeItem(gIdx, iIdx)} className="absolute top-2 right-2 text-red-500 text-xs border border-red-500 px-1 hover:bg-red-500 hover:text-white">X</button><div className="grid grid-cols-1 gap-2 mb-2"><input value={item.time} onChange={e => updateItem(gIdx, iIdx, 'time', e.target.value)} className="bg-[#222] text-[#00ff41] text-xs p-1 border border-[#444]" placeholder="Time" /><input value={item.role} onChange={e => updateItem(gIdx, iIdx, 'role', e.target.value)} className="bg-[#222] text-white font-bold text-sm p-1 border border-[#444]" placeholder="Role" /></div><textarea value={item.details.join('\n')} onChange={e => updateDetails(gIdx, iIdx, e.target.value)} className="w-full bg-[#111] text-gray-300 text-xs p-2 border border-[#444] h-20 outline-none" placeholder="- Detail..." /></div>))}<button type="button" onClick={() => addItem(gIdx)} className="ml-4 text-xs bg-[#222] text-blue-300 px-3 py-1 border border-blue-500 hover:bg-blue-500 hover:text-black transition">+ Job</button></div>
                </div>
            ))}<button type="button" onClick={addGroup} className="w-full mt-4 bg-[#222] text-white py-2 border border-dashed border-[#555] hover:border-[#00ff41] hover:text-[#00ff41] transition">+ CATEGORY</button>
        </div>
    );
};

interface FaqEditorProps { lang: 'en'|'vi'|'jp'; data: FaqItem[]; onUpdate: (newData: FaqItem[]) => void; }
const FaqEditor = ({ lang, data, onUpdate }: FaqEditorProps) => {
    const addItem = () => onUpdate([...data, { q: "", a: "" }]);
    const removeItem = (idx: number) => { const n = [...data]; n.splice(idx, 1); onUpdate(n); };
    const updateItem = (idx: number, field: keyof FaqItem, val: string) => { const n = [...data]; n[idx][field] = val; onUpdate(n); };

    return (
        <div className="bg-[#050505]/90 p-4 border border-[#333] mb-4 backdrop-blur-sm">
            <h3 className="text-[#00ff41] font-bold mb-4 uppercase border-b border-[#333]">FAQ DATA ({lang})</h3>
            <div className="space-y-4">{data.map((item, idx) => (<div key={idx} className="bg-black border border-[#333] p-3 relative group"><button type="button" onClick={() => removeItem(idx)} className="absolute top-2 right-2 text-red-500 text-xs border border-red-500 px-1 hover:bg-red-500 hover:text-white">X</button><div className="mb-2"><label className="text-xs text-[#00ff41] block mb-1 font-bold">&gt; Q:</label><input value={item.q} onChange={(e) => updateItem(idx, 'q', e.target.value)} className="w-full bg-[#222] text-white p-2 border border-[#444] text-sm focus:border-[#00ff41] outline-none" /></div><div><label className="text-xs text-gray-400 block mb-1 font-bold">:: A:</label><textarea value={item.a} onChange={(e) => updateItem(idx, 'a', e.target.value)} rows={2} className="w-full bg-[#222] text-gray-300 p-2 border border-[#444] text-sm focus:border-[#00ff41] outline-none" /></div></div>))}</div>
            <button type="button" onClick={addItem} className="w-full mt-4 bg-[#222] text-[#00ff41] py-2 border border-dashed border-[#555] hover:border-[#00ff41] transition">+ QUERY</button>
        </div>
    );
};

interface HeroEditorProps { lang: 'en'|'vi'|'jp'; data: HeroData; onUpdate: (field: keyof HeroData, val: string) => void; }
const HeroEditor = ({ lang, data, onUpdate }: HeroEditorProps) => (
    <div className="bg-[#050505]/90 p-4 border border-[#333] backdrop-blur-sm">
        <h3 className="text-[#00ff41] font-bold mb-4 uppercase border-b border-[#333]">HERO ({lang})</h3>
        <div className="space-y-3">
            <div><label className="text-xs text-gray-500">Greeting</label><input value={data.greeting} onChange={e=>onUpdate('greeting', e.target.value)} className="w-full bg-[#222] text-white p-2 border border-[#444]" /></div>
            <div><label className="text-xs text-gray-500">Full Name</label><input value={data.fullName} onChange={e=>onUpdate('fullName', e.target.value)} className="w-full bg-[#222] text-white p-2 border border-[#444]" /></div>
            <div className="flex gap-2"><div className="flex-1"><label className="text-xs text-gray-500">Nick 1</label><input value={data.nickName1} onChange={e=>onUpdate('nickName1', e.target.value)} className="w-full bg-[#222] text-white p-2 border border-[#444]" /></div><div className="flex-1"><label className="text-xs text-gray-500">Nick 2</label><input value={data.nickName2} onChange={e=>onUpdate('nickName2', e.target.value)} className="w-full bg-[#222] text-white p-2 border border-[#444]" /></div></div>
            <div><label className="text-xs text-gray-500">Typewriter</label><input value={data.typewriter} onChange={e=>onUpdate('typewriter', e.target.value)} className="w-full bg-[#222] text-white p-2 border border-[#444]" /></div>
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
  
  // Data States
  const [secEn, setSecEn] = useState(""); const [secVi, setSecVi] = useState(""); const [secJp, setSecJp] = useState("");
  const [boxesEn, setBoxesEn] = useState<SectionBox[]>([]); const [boxesVi, setBoxesVi] = useState<SectionBox[]>([]); const [boxesJp, setBoxesJp] = useState<SectionBox[]>([]);
  const [heroEn, setHeroEn] = useState<HeroData>(DEFAULT_HERO); const [heroVi, setHeroVi] = useState<HeroData>(DEFAULT_HERO); const [heroJp, setHeroJp] = useState<HeroData>(DEFAULT_HERO);
  const [config, setConfig] = useState<ConfigData>({ resumeUrl: "", isOpenForWork: true });
  const [expEn, setExpEn] = useState<ExpGroup[]>([]); const [expVi, setExpVi] = useState<ExpGroup[]>([]); const [expJp, setExpJp] = useState<ExpGroup[]>([]);
  const [faqEn, setFaqEn] = useState<FaqItem[]>([]); const [faqVi, setFaqVi] = useState<FaqItem[]>([]); const [faqJp, setFaqJp] = useState<FaqItem[]>([]);

  const isBoxSection = ['profile', 'contact'].includes(sectionKey);
  const isExpSection = sectionKey === 'experience';
  const isHeroSection = sectionKey === 'hero';
  const isConfigSection = sectionKey === 'global_config';
  const isFaqSection = sectionKey === 'faq_data';

  useEffect(() => { getAllPosts().then((data) => setPosts(data as unknown as Post[])); }, []);

  // LOAD DATA
  useEffect(() => {
    if (activeTab === 'content') {
        const fetchSection = async () => {
            setMsg(">> SYSTEM_LOADING...");
            try {
                const data = await getSectionContent(sectionKey);
                if (data) {
                    const typedData = data as unknown as SectionData;
                    if (isExpSection) { try { setExpEn(JSON.parse(typedData.contentEn)); } catch { setExpEn([]); } try { setExpVi(JSON.parse(typedData.contentVi)); } catch { setExpVi([]); } try { setExpJp(JSON.parse(typedData.contentJp)); } catch { setExpJp([]); } }
                    else if (isBoxSection) { try { setBoxesEn(JSON.parse(typedData.contentEn)); } catch { setBoxesEn([]); } try { setBoxesVi(JSON.parse(typedData.contentVi)); } catch { setBoxesVi([]); } try { setBoxesJp(JSON.parse(typedData.contentJp)); } catch { setBoxesJp([]); } } 
                    else if (isHeroSection) { try { setHeroEn({ ...DEFAULT_HERO, ...JSON.parse(typedData.contentEn) }); } catch { setHeroEn(DEFAULT_HERO); } try { setHeroVi({ ...DEFAULT_HERO, ...JSON.parse(typedData.contentVi) }); } catch { setHeroVi(DEFAULT_HERO); } try { setHeroJp({ ...DEFAULT_HERO, ...JSON.parse(typedData.contentJp) }); } catch { setHeroJp(DEFAULT_HERO); } }
                    else if (isConfigSection) { try { const parsed = JSON.parse(typedData.contentEn); setConfig({ resumeUrl: parsed.resumeUrl || "", isOpenForWork: parsed.isOpenForWork ?? true }); } catch { setConfig({ resumeUrl: "", isOpenForWork: true }); } }
                    else if (isFaqSection) { try { setFaqEn(JSON.parse(typedData.contentEn)); } catch { setFaqEn([]); } try { setFaqVi(JSON.parse(typedData.contentVi)); } catch { setFaqVi([]); } try { setFaqJp(JSON.parse(typedData.contentJp)); } catch { setFaqJp([]); } }
                    else { setSecEn(typedData.contentEn || ""); setSecVi(typedData.contentVi || ""); setSecJp(typedData.contentJp || ""); }
                } else {
                    setSecEn(""); setSecVi(""); setSecJp(""); setBoxesEn([]); setBoxesVi([]); setBoxesJp([]); setExpEn([]); setExpVi([]); setExpJp([]); setFaqEn([]); setFaqVi([]); setFaqJp([]); setHeroEn(DEFAULT_HERO); setHeroVi(DEFAULT_HERO); setHeroJp(DEFAULT_HERO); setConfig({ resumeUrl: "", isOpenForWork: true });
                }
                setMsg("");
            } catch (error) { console.error(error); setMsg("!! SYSTEM_ERROR"); }
        };
        fetchSection();
    }
  }, [sectionKey, activeTab, isBoxSection, isHeroSection, isConfigSection, isExpSection, isFaqSection]);

  async function handleLogin(formData: FormData) { const res = await checkAdmin(formData); if (res.success) setIsAuth(true); else alert("ACCESS DENIED"); }
  const addLinkField = () => setImages([...images, ""]);
  const removeLinkField = (index: number) => { const newImg = [...images]; newImg.splice(index, 1); setImages(newImg); };
  const updateLinkField = (index: number, val: string) => { const newImg = [...images]; newImg[index] = val; setImages(newImg); };
  
  async function handleBlogSubmit(formData: FormData) { 
      const jsonImages = JSON.stringify(images.filter(img => img.trim() !== "")); formData.set("images", jsonImages);
      if (editingPost) await updatePost(formData); else await createPost(formData);
      setEditingPost(null); setImages([]); setPosts(await getAllPosts() as unknown as Post[]); alert("DATABASE_UPDATED");
  }
  function startEdit(post: Post) { setEditingPost(post); setTag(post.tag); try { setImages(JSON.parse(post.images)); } catch { setImages([]); } window.scrollTo({ top: 0, behavior: 'smooth' }); }
  async function handleDelete(id: string) { if(!confirm("CONFIRM_DELETE?")) return; await deletePost(id); setPosts(await getAllPosts() as unknown as Post[]); }

  const updateHero = (lang: 'en'|'vi'|'jp', field: keyof HeroData, val: string) => { const setter = lang === 'en' ? setHeroEn : (lang === 'vi' ? setHeroVi : setHeroJp); setter(prev => ({ ...prev, [field]: val })); };

  async function handleSectionSubmit(formData: FormData) {
    if (isSaving) return; setIsSaving(true); setMsg(">> UPLOADING...");
    if (isExpSection) { formData.set("contentEn", JSON.stringify(expEn)); formData.set("contentVi", JSON.stringify(expVi)); formData.set("contentJp", JSON.stringify(expJp)); } 
    else if (isBoxSection) { formData.set("contentEn", JSON.stringify(boxesEn)); formData.set("contentVi", JSON.stringify(boxesVi)); formData.set("contentJp", JSON.stringify(boxesJp)); } 
    else if (isHeroSection) { formData.set("contentEn", JSON.stringify(heroEn)); formData.set("contentVi", JSON.stringify(heroVi)); formData.set("contentJp", JSON.stringify(heroJp)); } 
    else if (isConfigSection) { formData.set("contentEn", JSON.stringify(config)); formData.set("contentVi", ""); formData.set("contentJp", ""); } 
    else if (isFaqSection) { formData.set("contentEn", JSON.stringify(faqEn)); formData.set("contentVi", JSON.stringify(faqVi)); formData.set("contentJp", JSON.stringify(faqJp)); } 
    else { formData.set("contentEn", secEn); formData.set("contentVi", secVi); formData.set("contentJp", secJp); }
    const res = await saveSectionContent(formData); setIsSaving(false); if (res.success) { setMsg("✅ UPLOAD_COMPLETE"); setTimeout(() => setMsg(""), 3000); } else setMsg("❌ UPLOAD_FAIL");
  }

  // LOGIN SCREEN VỚI MATRIX RAIN
  if (!isAuth) return ( 
    <div className="relative flex h-screen items-center justify-center overflow-hidden font-mono">
        <div style={{position:'absolute', inset:0, zIndex:-1}}><MatrixRain /></div>
        <form action={handleLogin} className="relative z-10 border border-[#00ff41] p-10 bg-black/80 shadow-[0_0_20px_#00ff41]">
            <h1 className="text-3xl mb-5 text-[#00ff41] font-bold text-center border-b border-[#00ff41] pb-2">SYSTEM_LOGIN</h1>
            <div className="space-y-4">
                <input name="username" placeholder="IDENTIFIER" className="block w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#00ff41] outline-none" />
                <input name="password" type="password" placeholder="PASSPHRASE" className="block w-full bg-[#111] border border-[#333] p-3 text-white focus:border-[#00ff41] outline-none" />
                <button className="w-full bg-[#00ff41] text-black font-bold p-3 hover:bg-white transition">AUTHENTICATE</button>
            </div>
        </form>
    </div> 
  );

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono p-10 relative">
      <div style={{position:'fixed', inset:0, zIndex:0, opacity: 0.3}}><MatrixRain /></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8 border-b border-[#00ff41] pb-4 sticky top-0 bg-[#050505]/90 backdrop-blur z-50">
            <h1 className="text-4xl text-[#00ff41] font-bold">ADMIN_CONSOLE</h1>
            <div className="flex gap-4">
                <button onClick={() => setActiveTab('blog')} className={`px-4 py-2 border font-bold ${activeTab==='blog'?'bg-[#00ff41] text-black':'text-[#00ff41] border-[#00ff41] bg-black'}`}>[ BLOG_DB ]</button>
                <button onClick={() => setActiveTab('content')} className={`px-4 py-2 border font-bold ${activeTab==='content'?'bg-[#00ff41] text-black':'text-[#00ff41] border-[#00ff41] bg-black'}`}>[ SECTION_DB ]</button>
            </div>
        </div>

        {activeTab === 'blog' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-5 border border-[#00ff41] bg-black/90 h-fit sticky top-24 shadow-[0_0_15px_rgba(0,255,65,0.2)]">
                    <h2 className="text-2xl mb-5 border-b border-[#00ff41] pb-2 text-[#00ff41]">{editingPost ? ">> MODIFY_ENTRY" : ">> NEW_ENTRY"}</h2>
                    <form action={handleBlogSubmit} className="flex flex-col gap-4">
                        {editingPost && <input type="hidden" name="id" value={editingPost.id} />}
                        <input name="title" placeholder="Title" defaultValue={editingPost?.title} required className="bg-[#111] border border-[#333] p-3 text-white focus:border-[#00ff41] outline-none" />
                        <div className="flex gap-2">
                            <select name="tag" value={tag} onChange={e=>setTag(e.target.value)} className="bg-[#111] border border-[#333] p-2 text-white flex-1 focus:border-[#00ff41]"><option value="my_confessions">My Confessions</option><option value="uni_projects">University Projects</option><option value="personal_projects">Personal Projects</option><option value="achievements">Achievements</option><option value="it_events">IT Events</option><option value="lang_certs">Language Certs</option><option value="tech_certs">Tech Certs</option></select>
                            <select name="language" defaultValue={editingPost?.language||"vi"} className="bg-[#111] border border-[#333] p-2 text-white w-32 focus:border-[#00ff41]"><option value="vi">VI</option><option value="en">EN</option><option value="jp">JP</option></select>
                        </div>
                        <textarea name="content" placeholder="Markdown Content..." defaultValue={editingPost?.content} rows={10} required className="bg-[#111] border border-[#333] p-3 text-white text-sm focus:border-[#00ff41] outline-none font-mono" />
                        <div className="border border-[#333] p-3 bg-black/50"><label className="text-sm block mb-2 text-[#00ff41]">IMAGE_LINKS</label>{images.map((l,i)=>(<div key={i} className="flex gap-2 mb-2"><input value={l} onChange={e=>updateLinkField(i,e.target.value)} className="flex-1 bg-[#111] border border-[#333] p-1 text-xs text-white"/><button type="button" onClick={()=>removeLinkField(i)} className="text-red-500 px-2 font-bold">X</button></div>))}<button type="button" onClick={addLinkField} className="text-xs border border-[#00ff41] text-[#00ff41] px-2 py-1 hover:bg-[#00ff41] hover:text-black transition">+ ADD LINK</button></div>
                        <div className="flex gap-2"><button className="flex-1 bg-[#00ff41] text-black font-bold py-3 hover:bg-white transition">EXECUTE</button>{editingPost && <button type="button" onClick={()=>{setEditingPost(null);setImages([])}} className="bg-gray-800 px-4 text-white hover:bg-gray-700">ABORT</button>}</div>
                    </form>
                </div>
                <div className="flex flex-col gap-4">
                    {posts.map(post => (<div key={post.id} className="bg-[#0a0a0a]/90 border border-[#333] p-4 flex justify-between items-center hover:border-[#00ff41] transition group"><div><h3 className="font-bold text-white group-hover:text-[#00ff41]">{post.title}</h3><p className="text-xs text-gray-500">[{post.tag}] - {post.language}</p></div><div className="flex gap-2"><button onClick={()=>startEdit(post)} className="text-yellow-500 text-xs border border-yellow-500 px-2 py-1 hover:bg-yellow-500 hover:text-black">EDIT</button><button onClick={()=>handleDelete(post.id)} className="text-red-500 text-xs border border-red-500 px-2 py-1 hover:bg-red-500 hover:text-black">DEL</button></div></div>))}
                </div>
            </div>
        )}

        {activeTab === 'content' && (
            <div className="max-w-7xl mx-auto border border-[#00ff41] p-6 bg-black/90 shadow-[0_0_20px_rgba(0,255,65,0.1)]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl text-[#00ff41]">SECTION_EDITOR</h2>{msg && <span className="text-[#00ff41] border border-[#00ff41] px-4 py-1 bg-[#003300] animate-pulse">{msg}</span>}
                </div>
                <form action={handleSectionSubmit} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-[#00ff41] mb-2 font-bold">TARGET_SECTION:</label>
                        <select name="sectionKey" value={sectionKey} onChange={(e) => setSectionKey(e.target.value)} className="w-full bg-[#111] border border-[#00ff41] p-3 text-xl text-white outline-none cursor-pointer hover:bg-[#222]">
                            <option value="global_config">★ GLOBAL CONFIG</option>
                            <option value="hero">★ HERO SECTION</option>
                            <option value="about">01. ABOUT ME</option>
                            <option value="profile">02. PROFILE</option>
                            <option value="career">04. CAREER GOALS</option>
                            <option value="skills">06. SKILLS</option>
                            <option value="experience">07. EXPERIENCE</option>
                            <option value="contact">11. CONTACT</option>
                            <option value="faq_data">12. FAQ (Terminal)</option>
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
                                <div><label className="block text-gray-400 mb-1">Link Download CV (PDF URL)</label><input value={config.resumeUrl || ""} onChange={e => setConfig({...config, resumeUrl: e.target.value})} className="w-full bg-black border border-[#555] text-white p-3 focus:border-[#00ff41] outline-none" /></div>
                                <div className="flex items-center gap-3"><label className="text-gray-400">Status &quot;Open for Work&quot;:</label><input type="checkbox" checked={!!config.isOpenForWork} onChange={e => setConfig({...config, isOpenForWork: e.target.checked})} className="w-6 h-6 accent-[#00ff41]" /><span className={config.isOpenForWork ? "text-[#00ff41]" : "text-red-500"}>{config.isOpenForWork ? "ENABLED" : "DISABLED"}</span></div>
                            </div>
                        </div>
                    ) : isExpSection ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><ExpEditor lang="en" data={expEn} onUpdate={setExpEn} /><ExpEditor lang="vi" data={expVi} onUpdate={setExpVi} /><ExpEditor lang="jp" data={expJp} onUpdate={setExpJp} /></div>
                    ) : isBoxSection ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><BoxEditor lang="en" data={boxesEn} onUpdate={setBoxesEn} /><BoxEditor lang="vi" data={boxesVi} onUpdate={setBoxesVi} /><BoxEditor lang="jp" data={boxesJp} onUpdate={setBoxesJp} /></div>
                    ) : isFaqSection ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><FaqEditor lang="en" data={faqEn} onUpdate={setFaqEn} /><FaqEditor lang="vi" data={faqVi} onUpdate={setFaqVi} /><FaqEditor lang="jp" data={faqJp} onUpdate={setFaqJp} /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><label className="text-gray-400 mb-1 block">English</label><textarea name="contentEn" value={secEn} onChange={e=>setSecEn(e.target.value)} className="w-full bg-[#111] border border-[#333] p-3 text-white h-60 focus:border-[#00ff41] outline-none" /></div>
                            <div><label className="text-gray-400 mb-1 block">Vietnamese</label><textarea name="contentVi" value={secVi} onChange={e=>setSecVi(e.target.value)} className="w-full bg-[#111] border border-[#333] p-3 text-white h-60 focus:border-[#00ff41] outline-none" /></div>
                            <div><label className="text-gray-400 mb-1 block">Japanese</label><textarea name="contentJp" value={secJp} onChange={e=>setSecJp(e.target.value)} className="w-full bg-[#111] border border-[#333] p-3 text-white h-60 focus:border-[#00ff41] outline-none" /></div>
                        </div>
                    )}

                    <button type="submit" disabled={isSaving} className={`w-full font-bold py-3 text-xl transition-all ${isSaving?'bg-gray-700 text-gray-400':'bg-[#00ff41] text-black hover:bg-white'}`}>{isSaving ? "PROCESSING..." : "SAVE CHANGES"}</button>
                </form>
            </div>
        )}
      </div>
    </div>
  );
}