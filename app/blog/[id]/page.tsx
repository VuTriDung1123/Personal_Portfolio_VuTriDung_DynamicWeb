import { getPostById } from "@/lib/actions";
import MatrixRain from "@/components/MatrixRain";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function BlogDetail({ params }: { params: any }) {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) return <div className="text-white text-center pt-20 font-mono text-2xl">ERROR 404: DATA NOT FOUND</div>;

    let images: string[] = [];
    try {
        images = JSON.parse(post.images);
    } catch {
        images = [];
    }

    return (
        // SỬA: Thêm 'flex flex-col items-center' để căn giữa toàn bộ nội dung
        <main className="min-h-screen relative font-mono bg-black text-white selection:bg-[#00ff41] selection:text-black flex flex-col items-center">
            <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none">
                <MatrixRain />
            </div>
            
            <div className="fixed top-5 left-5 z-50">
                <Link href="/blog" className="bg-black border border-[#00ff41] text-[#00ff41] px-4 py-2 hover:bg-[#00ff41] hover:text-black transition-colors font-bold uppercase text-sm">
                    &lt; Back to Archives
                </Link>
            </div>

            {/* SỬA: Tăng max-w-5xl và w-full để bài viết rộng hơn và nằm giữa */}
            <article className="relative z-10 w-full max-w-5xl pt-28 pb-20 px-6">
                
                {/* Header bài viết */}
                <div className="border-l-4 border-[#00ff41] pl-6 mb-10 bg-[rgba(20,20,20,0.8)] p-6 border-y border-r border-[#333]">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wide leading-tight shadow-[#00ff41] drop-shadow-sm">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-[#00ff41] text-xs md:text-sm font-mono uppercase tracking-widest">
                        <span className="bg-[#003300] px-2 py-1 border border-[#00ff41]">DATE: {post.createdAt.toLocaleDateString()}</span>
                        <span className="bg-[#003300] px-2 py-1 border border-[#00ff41]">TAG: {post.tag || "GENERAL"}</span>
                        <span className="bg-[#003300] px-2 py-1 border border-[#00ff41]">LANG: {post.language || "VI"}</span>
                    </div>
                </div>

                {/* Nội dung bài viết (Sửa lỗi className bằng cách bọc div ngoài) */}
                <div className="bg-[rgba(10,10,10,0.9)] p-8 border border-[#333] mb-12 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <div className="prose prose-invert prose-lg max-w-none 
                        prose-headings:text-[#00ff41] prose-headings:font-bold prose-headings:uppercase prose-headings:border-b prose-headings:border-[#333] prose-headings:pb-2 prose-headings:mt-8
                        prose-p:text-[#e0e0e0] prose-p:leading-relaxed prose-p:mb-4
                        prose-a:text-[#00ff41] prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-white prose-strong:font-extrabold
                        prose-code:text-[#00ff41] prose-code:bg-[#111] prose-code:px-1 prose-code:border prose-code:border-[#333] prose-code:font-mono
                        prose-pre:bg-[#050505] prose-pre:border prose-pre:border-[#333] prose-pre:p-4
                        prose-li:text-[#e0e0e0] prose-li:marker:text-[#00ff41]
                        prose-blockquote:border-l-4 prose-blockquote:border-[#00ff41] prose-blockquote:text-gray-400 prose-blockquote:bg-[#111] prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic">
                        
                        {/* ReactMarkdown nằm trơn tru trong div */}
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Ảnh đính kèm */}
                {images.length > 0 && (
                    <div className="space-y-8">
                        <h3 className="text-2xl text-[#00ff41] border-b border-[#008f11] pb-2 mb-6 inline-block font-mono">
                            {`// EVIDENCE_FILES (${images.length})`}
                        </h3>
                        <div className="grid grid-cols-1 gap-8">
                            {images.map((img, idx) => (
                                <div key={idx} className="group border border-[#333] p-2 bg-black hover:border-[#00ff41] transition-all duration-500 shadow-lg">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img} alt={`Evidence ${idx}`} className="w-full h-auto object-cover opacity-90 group-hover:opacity-100" />
                                    <div className="text-right text-[#00ff41] text-[10px] mt-2 font-mono">FIG_0{idx + 1}.JPG</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </main>
    );
}