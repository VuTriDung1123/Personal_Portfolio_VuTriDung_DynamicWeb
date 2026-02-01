"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MatrixRain from "@/components/MatrixRain";
import { getSectionContent } from "@/lib/actions";
import { Lang } from "@/lib/data";

// Định nghĩa kiểu dữ liệu
type FaqItem = { q: string; a: string; };
type SectionData = { contentEn: string; contentVi: string; contentJp: string; };

export default function FaqPage() {
    // State lưu ngôn ngữ đang chọn để hiển thị
    const [viewLang, setViewLang] = useState<Lang>("en");
    
    // State lưu toàn bộ dữ liệu (để chuyển đổi qua lại không cần fetch lại)
    const [allFaq, setAllFaq] = useState<{ en: FaqItem[], vi: FaqItem[], jp: FaqItem[] }>({
        en: [], vi: [], jp: []
    });

    const [isLoading, setIsLoading] = useState(true);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    // 1. Load dữ liệu từ Admin
    useEffect(() => {
        // Lấy ngôn ngữ mặc định của người dùng
        const savedLang = localStorage.getItem("sakura_lang") as Lang;
        if (savedLang && ['en', 'vi', 'jp'].includes(savedLang)) setViewLang(savedLang);

        getSectionContent("faq_data").then((data) => {
            if (data) {
                const sec = data as unknown as SectionData;
                try {
                    // Parse cả 3 ngôn ngữ và lưu vào state
                    setAllFaq({
                        en: JSON.parse(sec.contentEn || "[]"),
                        vi: JSON.parse(sec.contentVi || "[]"),
                        jp: JSON.parse(sec.contentJp || "[]")
                    });
                } catch (e) {
                    console.error("JSON Error:", e);
                }
            }
            setTimeout(() => setIsLoading(false), 800);
        });
    }, []);

    const toggleFaq = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    // Lấy danh sách FAQ theo ngôn ngữ đang chọn
    const currentList = allFaq[viewLang];

    return (
        <main style={{
            minHeight: '100vh',
            fontFamily: "'VT323', monospace",
            color: '#00ff41',
            position: 'relative',
            fontSize: '1.3rem'
        }}>
            {/* 1. NỀN MATRIX RAIN */}
            <div style={{position: 'fixed', inset: 0, zIndex: -1}}>
                <MatrixRain />
            </div>

            {/* Nút Back về Home */}
            <div style={{position: 'fixed', top: '20px', left: '20px', zIndex: 50}}>
                <Link href="/" style={{
                    background: 'rgba(0,0,0,0.8)', border: '1px solid #00ff41', color: '#00ff41',
                    padding: '8px 16px', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none',
                    boxShadow: '0 0 10px rgba(0,255,65,0.3)', display: 'block'
                }}>
                    &lt;&lt; BACK_TO_ROOT
                </Link>
            </div>

            <div style={{maxWidth: '1000px', margin: '0 auto', padding: '100px 20px 50px'}}>
                
                {/* Header Terminal */}
                <div style={{
                    borderBottom: '2px dashed #00ff41', paddingBottom: '20px', marginBottom: '30px',
                    textShadow: '0 0 10px #00ff41'
                }}>
                    <h1 style={{fontSize: '3.5rem', margin: 0, lineHeight: 1}}>
                        SYSTEM_HELP // KNOWLEDGE_BASE
                    </h1>
                    <p style={{fontSize: '1.2rem', opacity: 0.8, marginTop: '10px'}}>
                        &gt; Accessing frequently asked queries protocol...
                    </p>
                </div>

                {/* [MỚI] THANH CHỌN NGÔN NGỮ STYLE HACKER */}
                <div style={{display: 'flex', gap: '15px', marginBottom: '40px', alignItems: 'center'}}>
                    <span style={{color: '#008f11', fontWeight: 'bold'}}>&gt; SELECT_LANGUAGE_MODULE:</span>
                    
                    {[
                        { code: 'vi', label: '[ VI_VN ]' },
                        { code: 'en', label: '[ EN_US ]' },
                        { code: 'jp', label: '[ JA_JP ]' }
                    ].map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => { setViewLang(lang.code as Lang); setExpandedIndex(null); }}
                            style={{
                                background: viewLang === lang.code ? '#00ff41' : 'transparent',
                                color: viewLang === lang.code ? 'black' : '#00ff41',
                                border: '1px solid #00ff41',
                                padding: '5px 15px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                boxShadow: viewLang === lang.code ? '0 0 15px #00ff41' : 'none',
                                fontFamily: 'inherit'
                            }}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>

                {/* Nội dung FAQ */}
                {isLoading ? (
                    <div style={{textAlign: 'center', fontSize: '2rem', marginTop: '100px'}}>
                        DECRYPTING_DATA... <span className="animate-ping">_</span>
                    </div>
                ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                        {currentList && currentList.length > 0 ? (
                            currentList.map((item, index) => (
                                <div key={index} style={{
                                    background: 'rgba(0, 10, 0, 0.9)', 
                                    border: '1px solid #008f11',
                                    transition: 'all 0.3s'
                                }}>
                                    {/* Câu hỏi */}
                                    <button 
                                        onClick={() => toggleFaq(index)}
                                        style={{
                                            width: '100%', textAlign: 'left', padding: '20px',
                                            background: expandedIndex === index ? 'rgba(0, 255, 65, 0.15)' : 'transparent',
                                            border: 'none', color: '#00ff41', fontSize: '1.4rem',
                                            cursor: 'pointer', fontFamily: 'inherit',
                                            display: 'flex', alignItems: 'center', gap: '15px'
                                        }}
                                    >
                                        <span style={{color: '#008f11'}}>&gt;</span> 
                                        <span style={{fontWeight: 'bold'}}>
                                            ./run_query --q="{item.q}"
                                        </span>
                                        <span style={{marginLeft: 'auto', fontSize: '1.2rem'}}>
                                            {expandedIndex === index ? '[-]' : '[+]'}
                                        </span>
                                    </button>

                                    {/* Câu trả lời */}
                                    {expandedIndex === index && (
                                        <div style={{
                                            padding: '25px', borderTop: '1px dashed #008f11',
                                            color: '#e0e0e0', lineHeight: '1.6', fontSize: '1.3rem'
                                        }}>
                                            <div style={{marginBottom: '10px', color: '#008f11', fontSize: '1rem'}}>
                                                [SYSTEM_OUTPUT]: Processing... Done.
                                            </div>
                                            <div style={{animation: 'fadeIn 0.5s'}}>
                                                &gt;&gt; {item.a}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div style={{textAlign: 'center', padding: '40px', border: '1px dashed #333', color: '#666'}}>
                                [ERROR]: NO_DATA_FOUND_FOR_THIS_LANGUAGE
                            </div>
                        )}
                    </div>
                )}

                {/* Footer Terminal */}
                <div style={{marginTop: '50px', borderTop: '1px solid #008f11', paddingTop: '20px', textAlign: 'center', color: '#008f11', fontSize: '1rem'}}>
                    root@system:~# exit_
                </div>
            </div>
        </main>
    );
}