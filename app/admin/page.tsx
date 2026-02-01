"use client";

import { useState, useEffect } from "react";
import { checkAdmin, createPost, deletePost, getAllPosts, updatePost, getSectionContent, saveSectionContent } from "@/lib/actions";
import MatrixRain from "@/components/MatrixRain";

// --- TYPES (Định nghĩa chặt chẽ để fix lỗi Build) ---
interface Post { id: string; title: string; tag: string; language: string; content: string; images: string; }
interface BoxItem { label: string; value: string; }
interface SectionBox { id: string; title: string; items: BoxItem[]; }
interface SectionData { contentEn: string; contentVi: string; contentJp: string; }

interface HeroData { fullName: string; nickName1: string; nickName2: string; avatarUrl: string; greeting: string; description: string; typewriter: string; }
interface ConfigData { resumeUrl: string; isOpenForWork: boolean; }
interface ExpItem { id: string; time: string; role: string; details: string[]; }
interface ExpGroup { id: string; title: string; items: ExpItem[]; }
interface FaqItem { q: string; a: string; }

// AI Config Type (Dual Profile + Override)
interface AiProfile {
    roleName: string;
    tone: string;
    customStory: string;
    systemPromptOverride: string;
}

interface AiConfigData {
    hacker: AiProfile;
    sakura: AiProfile;
}

// --- CONSTANTS ---
const DEFAULT_HERO: HeroData = { fullName: "Vũ Trí Dũng", nickName1: "David Miller", nickName2: "Akina Aoi", avatarUrl: "", greeting: "Hi, I am", description: "", typewriter: '["Developer", "Student"]' };

const DEFAULT_AI_CONFIG: AiConfigData = { 
    hacker: { roleName: "System Administrator", tone: "Logical, Cool, Concise", customStory: "", systemPromptOverride: "" },
    sakura: { roleName: "Sakura Assistant", tone: "Friendly, Cute, Helpful", customStory: "", systemPromptOverride: "" }
};

// --- STYLES HELPER (HACKER STYLE) ---
const s = { 
    label: {color:'#00ff41', fontSize:'0.75rem', fontWeight:'bold', display:'block', marginBottom:'4px', fontFamily: "'VT323', monospace", letterSpacing: '1px'}, 
    input: {width:'100%', background:'black', border:'1px solid #333', color:'white', padding:'8px', outline:'none', fontFamily:'monospace', transition: 'border 0.3s'},
    card: {background: 'rgba(5, 5, 5, 0.95)', border: '1px solid #00ff41', padding: '20px', marginBottom: '20px', boxShadow: '0 0 10px rgba(0, 255, 65, 0.1)'}
};

// --- SUB-COMPONENTS EDITORS (FIXED TYPES) ---

const BoxEditor = ({ lang, data, onUpdate }: { lang: string, data: SectionBox[], onUpdate: (d: SectionBox[]) => void }) => {
    const addBox = () => onUpdate([...data, { id: Date.now().toString(), title: "New Group", items: [] }]);
    const updateTitle = (idx: number, v: string) => { const n = [...data]; n[idx].title = v; onUpdate(n); };
    const addItem = (idx: number) => { const n = [...data]; n[idx].items.push({ label: "", value: "" }); onUpdate(n); };
    const updateItem = (bIdx: number, iIdx: number, f: 'label'|'value', v: string) => { const n = [...data]; n[bIdx].items[iIdx][f] = v; onUpdate(n); };
    const remove = (idx: number) => { const n = [...data]; n.splice(idx, 1); onUpdate(n); };
    const removeItem = (bIdx: number, iIdx: number) => { const n = [...data]; n[bIdx].items.splice(iIdx, 1); onUpdate(n); };

    return (
        <div style={s.card}>
            <h3 className="text-[#00ff41] font-bold mb-2 uppercase border-b border-[#333]">PROFILE ({lang})</h3>
            {data.map((box, bIdx) => (
                <div key={box.id} className="mb-4 pl-4 border-l-2 border-[#00ff41]/50 hover:border-[#00ff41]">
                    <div className="flex gap-2 mb-2"><input value={box.title} onChange={(e) => updateTitle(bIdx, e.target.value)} style={{...s.input, color:'#00ff41'}} placeholder="Group Title" /><button type="button" onClick={() => remove(bIdx)} className="text-red-500 text-xs">[DEL]</button></div>
                    <div className="pl-4 space-y-1">{box.items.map((it, iIdx) => (<div key={iIdx} className="flex gap-2"><input value={it.label} onChange={(e) => updateItem(bIdx, iIdx, 'label', e.target.value)} style={{...s.input, flex:1, color:'#aaa'}} placeholder="Label" /><input value={it.value} onChange={(e) => updateItem(bIdx, iIdx, 'value', e.target.value)} style={{...s.input, flex:2}} placeholder="Value" /><button type="button" onClick={() => removeItem(bIdx, iIdx)} className="text-red-500 text-xs">x</button></div>))}<button type="button" onClick={() => addItem(bIdx)} className="text-[#00ff41] text-xs px-2 mt-1 hover:bg-[#00ff41] hover:text-black">+ Item</button></div>
                </div>
            ))}<button type="button" onClick={addBox} className="w-full bg-[#111] text-[#00ff41] py-1 hover:bg-[#00ff41] hover:text-black border border-dashed border-[#333]">+ GROUP</button>
        </div>
    );
};

const ExpEditor = ({ lang, data, onUpdate }: { lang: string, data: ExpGroup[], onUpdate: (d: ExpGroup[]) => void }) => {
    const addGroup = () => onUpdate([...data, { id: Date.now().toString(), title: "New Category", items: [] }]);
    const updateTitle = (idx: number, v: string) => { const n = [...data]; n[idx].title = v; onUpdate(n); };
    const addItem = (gIdx: number) => { const n = [...data]; n[gIdx].items.push({ id: Date.now().toString(), time: "", role: "", details: [] }); onUpdate(n); };
    const updateItem = (gIdx: number, iIdx: number, f: keyof ExpItem, v: string) => { const n = [...data]; (n[gIdx].items[iIdx] as any)[f] = v; onUpdate(n); };
    const updateDetails = (gIdx: number, iIdx: number, txt: string) => { const n = [...data]; n[gIdx].items[iIdx].details = txt.split('\n'); onUpdate(n); };
    const remove = (idx: number) => { const n = [...data]; n.splice(idx, 1); onUpdate(n); };
    const removeItem = (gIdx: number, iIdx: number) => { const n = [...data]; n[gIdx].items.splice(iIdx, 1); onUpdate(n); };

    return (
        <div style={s.card}>
            <h3 className="text-[#00ff41] font-bold mb-2 uppercase border-b border-[#333]">EXP ({lang})</h3>
            {data.map((group, gIdx) => (
                <div key={group.id} className="mb-6 pl-2 border-l-4 border-blue-900/50 bg-blue-900/10 p-2">
                    <div className="flex gap-2 mb-3"><input value={group.title} onChange={e => updateTitle(gIdx, e.target.value)} style={{...s.input, color:'#4fc3f7', fontWeight:'bold'}} placeholder="Category" /><button type="button" onClick={() => remove(gIdx)} className="text-red-500 text-xs border border-red-500 px-1">DEL</button></div>
                    <div className="space-y-4">{group.items.map((item, iIdx) => (<div key={item.id} className="bg-[#050505] border border-[#333] p-3 relative group"><button type="button" onClick={() => removeItem(gIdx, iIdx)} className="absolute top-2 right-2 text-red-500 text-xs">X</button><div className="grid grid-cols-1 gap-2 mb-2"><input value={item.time} onChange={e => updateItem(gIdx, iIdx, 'time', e.target.value)} style={{...s.input, color:'#00ff41', fontSize:'0.8rem'}} placeholder="Time" /><input value={item.role} onChange={e => updateItem(gIdx, iIdx, 'role', e.target.value)} style={{...s.input, fontWeight:'bold'}} placeholder="Role" /></div><textarea value={item.details.join('\n')} onChange={e => updateDetails(gIdx, iIdx, e.target.value)} style={{...s.input, height:'60px', color:'#aaa'}} placeholder="- Detail..." /></div>))}<button type="button" onClick={() => addItem(gIdx)} className="text-xs text-blue-400 border border-blue-400 px-2 py-1 hover:bg-blue-400 hover:text-black">+ Job</button></div>
                </div>
            ))}<button type="button" onClick={addGroup} className="w-full mt-4 bg-[#111] text-white py-2 border border-dashed border-[#555] hover:border-[#00ff41] hover:text-black">+ CATEGORY</button>
        </div>
    );
};

const FaqEditor = ({ lang, data, onUpdate }: { lang: string, data: FaqItem[], onUpdate: (d: FaqItem[]) => void }) => {
    const addItem = () => onUpdate([...data, { q: "", a: "" }]);
    const updateItem = (idx: number, f: keyof FaqItem, v: string) => { const n = [...data]; n[idx][f] = v; onUpdate(n); };
    const removeItem = (idx: number) => { const n = [...data]; n.splice(idx, 1); onUpdate(n); };

    return (
        <div style={s.card}>
            <h3 className="text-[#00ff41] font-bold mb-4 uppercase border-b border-[#333]">FAQ DATA ({lang})</h3>
            <div className="space-y-4">{data.map((item, idx) => (<div key={idx} className="bg-black border border-[#333] p-3 relative group"><button type="button" onClick={() => removeItem(idx)} className="absolute top-2 right-2 text-red-500 text-xs">X</button><div className="mb-2"><label style={s.label}>&gt; QUERY:</label><input value={item.q} onChange={(e) => updateItem(idx, 'q', e.target.value)} style={{...s.input, color:'#00ff41'}} /></div><div><label style={{...s.label, color:'#888'}}>:: OUTPUT:</label><textarea value={item.a} onChange={(e) => updateItem(idx, 'a', e.target.value)} style={{...s.input, height:'60px', color:'#ccc'}} /></div></div>))}</div>
            <button type="button" onClick={addItem} className="w-full mt-4 bg-[#111] text-[#00ff41] py-2 border border-dashed border-[#555] hover:border-[#00ff41] hover:text-black transition">+ QUERY</button>
        </div>
    );
};

// [TYPE FIXED] HeroEditor với định nghĩa kiểu cho onUpdate
const HeroEditor = ({ lang, data, onUpdate }: { 
    lang: string; 
    data: HeroData; 
    onUpdate: (field: keyof HeroData, val: string) => void 
}) => (
    <div style={s.card}>
        <h3 className="text-[#00ff41] font-bold mb-4 uppercase border-b border-[#333]">HERO ({lang})</h3>
        <div className="space-y-3">
            <div><label style={s.label}>Greeting</label><input value={data.greeting} onChange={e=>onUpdate('greeting', e.target.value)} style={s.input} /></div>
            <div><label style={s.label}>Full Name</label><input value={data.fullName} onChange={e=>onUpdate('fullName', e.target.value)} style={s.input} /></div>
            <div className="flex gap-2"><div className="flex-1"><label style={s.label}>Nick 1</label><input value={data.nickName1} onChange={e=>onUpdate('nickName1', e.target.value)} style={s.input} /></div><div className="flex-1"><label style={s.label}>Nick 2</label><input value={data.nickName2} onChange={e=>onUpdate('nickName2', e.target.value)} style={s.input} /></div></div>
            <div><label style={s.label}>Typewriter</label><input value={data.typewriter} onChange={e=>onUpdate('typewriter', e.target.value)} style={s.input} /></div>
            <div><label style={s.label}>Description</label><textarea value={data.description} onChange={e=>onUpdate('description', e.target.value)} style={{...s.input, height:'80px'}} /></div>
            <div><label style={s.label}>Avatar URL</label><input value={data.avatarUrl} onChange={e=>onUpdate('avatarUrl', e.target.value)} style={s.input} /></div>
        </div>
    </div>
);

// --- [MỚI] AI CONFIG EDITOR (HACKER STYLE + DUAL CORE + DEFENSIVE) ---
const AiConfigEditor = ({ data, onUpdate }: { data: AiConfigData, onUpdate: (theme: 'hacker'|'sakura', f: keyof AiProfile, v: string) => void }) => (
    <div style={{...s.card, border: '1px solid #00ff41', boxShadow: '0 0 20px rgba(0,255,65,0.2)'}}>
        <div className="flex items-center gap-3 mb-6 border-b border-[#00ff41] pb-2">
            <span className="text-3xl text-[#00ff41]">🧠</span>
            <h3 className="text-2xl text-[#00ff41] font-bold tracking-widest font-mono">NEURAL_NET_CONFIG [DUAL_CORE]</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* CỘT HACKER */}
            <div className="border-r border-[#333] pr-5">
                <h4 className="text-[#00ff41] text-xl font-bold mb-4 border-b border-[#00ff41] inline-block font-mono">[ HACKER_PROTOCOL ]</h4>
                <div className="space-y-4">
                    <div>
                        <label style={s.label}>&gt; ROLE_NAME</label>
                        <input value={data?.hacker?.roleName || ''} onChange={e => onUpdate('hacker', 'roleName', e.target.value)} style={s.input} placeholder="e.g. Cyber Security AI" />
                    </div>
                    <div>
                        <label style={s.label}>&gt; TONE_MODULATION</label>
                        <input value={data?.hacker?.tone || ''} onChange={e => onUpdate('hacker', 'tone', e.target.value)} style={s.input} placeholder="e.g. Cold, Logical" />
                    </div>
                    <div>
                        <label style={s.label}>&gt; ENCRYPTED_DATA (Secret)</label>
                        <textarea value={data?.hacker?.customStory || ''} onChange={e => onUpdate('hacker', 'customStory', e.target.value)} style={{...s.input, height:'80px', color:'#00ff41'}} placeholder="Secret info..." />
                    </div>
                    
                    {/* Override Hacker */}
                    <div className="pt-2 border-t border-[#333] mt-2">
                        <label style={{...s.label, color:'yellow'}}>&gt; SYSTEM_OVERRIDE ⚠</label>
                        <textarea value={data?.hacker?.systemPromptOverride || ''} onChange={e => onUpdate('hacker', 'systemPromptOverride', e.target.value)} style={{...s.input, height:'60px', color:'yellow', border:'1px dashed yellow'}} placeholder="FORCE_COMMAND..." />
                    </div>
                </div>
            </div>

            {/* CỘT SAKURA */}
            <div className="pl-2">
                <h4 className="text-[#ff69b4] text-xl font-bold mb-4 border-b border-[#ff69b4] inline-block font-mono">✿ SAKURA_MODE ✿</h4>
                <div className="space-y-4">
                    <div>
                        <label style={{...s.label, color:'#ff69b4'}}>&gt; ROLE_NAME</label>
                        <input value={data?.sakura?.roleName || ''} onChange={e => onUpdate('sakura', 'roleName', e.target.value)} style={{...s.input, border:'1px solid #ff69b4', color:'#ffc1e3'}} placeholder="e.g. Sakura Assistant" />
                    </div>
                    <div>
                        <label style={{...s.label, color:'#ff69b4'}}>&gt; TONE_MODULATION</label>
                        <input value={data?.sakura?.tone || ''} onChange={e => onUpdate('sakura', 'tone', e.target.value)} style={{...s.input, border:'1px solid #ff69b4', color:'#ffc1e3'}} placeholder="e.g. Cute, Friendly" />
                    </div>
                    <div>
                        <label style={{...s.label, color:'#ff69b4'}}>&gt; ENCRYPTED_DATA (Secret)</label>
                        <textarea value={data?.sakura?.customStory || ''} onChange={e => onUpdate('sakura', 'customStory', e.target.value)} style={{...s.input, height:'80px', border:'1px solid #ff69b4', color:'#ffc1e3'}} placeholder="Secret info..." />
                    </div>
                    
                    {/* Override Sakura */}
                    <div className="pt-2 border-t border-[#ff69b4] mt-2">
                        <label style={{...s.label, color:'#ff69b4'}}>&gt; SYSTEM_OVERRIDE ⚠</label>
                        <textarea value={data?.sakura?.systemPromptOverride || ''} onChange={e => onUpdate('sakura', 'systemPromptOverride', e.target.value)} style={{...s.input, height:'60px', color:'#ff69b4', border:'1px dashed #ff69b4'}} placeholder="FORCE_COMMAND..." />
                    </div>
                </div>
            </div>
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
  
  // AI Config State (Khởi tạo default để tránh lỗi undefined)
  const [aiConfig, setAiConfig] = useState<AiConfigData>(DEFAULT_AI_CONFIG);

  const isBoxSection = ['profile', 'contact'].includes(sectionKey);
  const isExpSection = sectionKey === 'experience';
  const isHeroSection = sectionKey === 'hero';
  const isConfigSection = sectionKey === 'global_config';
  const isFaqSection = sectionKey === 'faq_data';
  const isAiConfigSection = sectionKey === 'ai_config';

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
                    else if (isAiConfigSection) { 
                        // Logic an toàn để load AI Config cũ
                        try { 
                            const parsed = JSON.parse(typedData.contentEn);
                            setAiConfig({
                                hacker: parsed.hacker || DEFAULT_AI_CONFIG.hacker,
                                sakura: parsed.sakura || DEFAULT_AI_CONFIG.sakura
                            }); 
                        } catch { setAiConfig(DEFAULT_AI_CONFIG); } 
                    }
                    else { setSecEn(typedData.contentEn || ""); setSecVi(typedData.contentVi || ""); setSecJp(typedData.contentJp || ""); }
                } else {
                    setSecEn(""); setSecVi(""); setSecJp(""); setBoxesEn([]); setBoxesVi([]); setBoxesJp([]); setExpEn([]); setExpVi([]); setExpJp([]); setFaqEn([]); setFaqVi([]); setFaqJp([]); setHeroEn(DEFAULT_HERO); setHeroVi(DEFAULT_HERO); setHeroJp(DEFAULT_HERO); setConfig({ resumeUrl: "", isOpenForWork: true }); setAiConfig(DEFAULT_AI_CONFIG);
                }
                setMsg("");
            } catch (error) { console.error(error); setMsg("!! SYSTEM_ERROR"); }
        };
        fetchSection();
    }
  }, [sectionKey, activeTab, isBoxSection, isHeroSection, isConfigSection, isExpSection, isFaqSection, isAiConfigSection]);

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

  // [UPDATED] Typed updateHero
  const updateHero = (lang: 'en'|'vi'|'jp', field: keyof HeroData, val: string) => { 
      const setter = lang === 'en' ? setHeroEn : (lang === 'vi' ? setHeroVi : setHeroJp);
      setter(prev => ({ ...prev, [field]: val }));
  };

  const updateAiConfig = (theme: 'hacker'|'sakura', field: keyof AiProfile, val: string) => { 
      setAiConfig(prev => ({ ...prev, [theme]: { ...prev[theme], [field]: val } })); 
  };

  async function handleSectionSubmit(formData: FormData) {
    if (isSaving) return; setIsSaving(true); setMsg(">> UPLOADING...");
    if (isExpSection) { formData.set("contentEn", JSON.stringify(expEn)); formData.set("contentVi", JSON.stringify(expVi)); formData.set("contentJp", JSON.stringify(expJp)); } 
    else if (isBoxSection) { formData.set("contentEn", JSON.stringify(boxesEn)); formData.set("contentVi", JSON.stringify(boxesVi)); formData.set("contentJp", JSON.stringify(boxesJp)); } 
    else if (isHeroSection) { formData.set("contentEn", JSON.stringify(heroEn)); formData.set("contentVi", JSON.stringify(heroVi)); formData.set("contentJp", JSON.stringify(heroJp)); } 
    else if (isConfigSection) { formData.set("contentEn", JSON.stringify(config)); formData.set("contentVi", ""); formData.set("contentJp", ""); } 
    else if (isFaqSection) { formData.set("contentEn", JSON.stringify(faqEn)); formData.set("contentVi", JSON.stringify(faqVi)); formData.set("contentJp", JSON.stringify(faqJp)); } 
    else if (isAiConfigSection) { formData.set("contentEn", JSON.stringify(aiConfig)); formData.set("contentVi", ""); formData.set("contentJp", ""); }
    else { formData.set("contentEn", secEn); formData.set("contentVi", secVi); formData.set("contentJp", secJp); }
    const res = await saveSectionContent(formData); setIsSaving(false); if (res.success) { setMsg("✅ UPLOAD_COMPLETE"); setTimeout(() => setMsg(""), 3000); } else setMsg("❌ UPLOAD_FAIL");
  }

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
                            <option value="ai_config">★ AI BRAIN CONFIG (DUAL CORE)</option>
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
                    ) : isAiConfigSection ? (
                        <AiConfigEditor data={aiConfig} onUpdate={updateAiConfig} />
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