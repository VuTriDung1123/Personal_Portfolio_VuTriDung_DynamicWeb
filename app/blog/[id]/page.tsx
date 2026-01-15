import { getPostById } from "@/lib/actions";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MatrixRain from "@/components/MatrixRain"; // [MỚI] Import Matrix Rain

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function BlogDetail({ params }: { params: any }) {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <MatrixRain />
            <div className="z-10 font-mono text-2xl text-red-500 border border-red-500 p-4 bg-black/80">
                ERROR 404: DATA NOT FOUND
            </div>
        </div>
    );

    let images: string[] = [];
    try { images = JSON.parse(post.images); } catch { images = []; }

    return (
        <main className="min-h-screen relative font-mono text-gray-800 dark:text-white flex flex-col items-center">
            
            {/* [MỚI] 1. Hiệu ứng nền Matrix Rain */}
            <div className="fixed inset-0 z-0">
                <MatrixRain />
            </div>

            {/* [MỚI] 2. Cụm nút điều hướng (Home & Back) */}
            <div className="fixed top-20 left-5 z-40 hidden md:flex flex-col gap-3">
                {/* Nút về Trang Chủ */}
                <Link href="/" className="bg-black/80 border border-[#00ff41] text-[#00ff41] px-4 py-2 hover:bg-[#00ff41] hover:text-black transition-all font-bold uppercase text-sm backdrop-blur-sm shadow-[0_0_10px_rgba(0,255,65,0.3)] text-center">
                    &lt;&lt; HOME
                </Link>
                {/* Nút quay lại Blog */}
                <Link href="/blog" className="bg-black/80 border border-[#00ff41] text-[#00ff41] px-4 py-2 hover:bg-[#00ff41] hover:text-black transition-all font-bold uppercase text-sm backdrop-blur-sm shadow-[0_0_10px_rgba(0,255,65,0.3)] text-center">
                    &lt; BLOG LIST
                </Link>
            </div>

            {/* Menu Mobile (Hiển thị ngang ở trên cùng nếu là điện thoại) */}
            <div className="fixed top-0 left-0 w-full z-40 md:hidden flex justify-between p-2 bg-black/90 border-b border-[#00ff41]">
                 <Link href="/" className="text-[#00ff41] font-bold text-xs border border-[#00ff41] px-2 py-1">
                    &lt;&lt; HOME
                </Link>
                <Link href="/blog" className="text-[#00ff41] font-bold text-xs border border-[#00ff41] px-2 py-1">
                    &lt; BACK
                </Link>
            </div>

            <article className="relative z-10 w-full max-w-5xl pt-32 pb-20 px-6">
                {/* Header Bài viết */}
                <div className="border-l-4 border-pink-500 dark:border-[#00ff41] pl-6 mb-10 bg-white/80 dark:bg-[rgba(5,5,5,0.85)] p-6 shadow-[0_0_15px_rgba(0,255,65,0.2)] backdrop-blur-md">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-pink-600 dark:text-[#00ff41] text-xs md:text-sm font-mono uppercase tracking-widest">
                        <span className="bg-pink-50 dark:bg-[#003300] px-2 py-1 border border-pink-300 dark:border-[#00ff41]">DATE: {new Date(post.createdAt).toLocaleDateString()}</span>
                        <span className="bg-pink-50 dark:bg-[#003300] px-2 py-1 border border-pink-300 dark:border-[#00ff41]">TAG: {post.tag || "GENERAL"}</span>
                        {/* Hiển thị ngôn ngữ nếu có */}
                        {post.language && (
                            <span className="bg-pink-50 dark:bg-[#003300] px-2 py-1 border border-pink-300 dark:border-[#00ff41]">LANG: {post.language}</span>
                        )}
                    </div>
                </div>

                {/* Nội dung Markdown */}
                <div className="bg-white/90 dark:bg-[rgba(10,10,10,0.9)] p-8 border border-pink-200 dark:border-[#00ff41]/50 mb-12 shadow-xl backdrop-blur-sm">
                    <div className="prose prose-lg max-w-none dark:prose-invert
                        prose-headings:text-pink-600 dark:prose-headings:text-[#00ff41] 
                        prose-a:text-pink-600 dark:prose-a:text-[#00ff41]
                        prose-strong:text-black dark:prose-strong:text-white
                        prose-code:text-pink-700 dark:prose-code:text-[#00ff41] prose-code:bg-pink-50 dark:prose-code:bg-[#111] prose-code:px-1 prose-code:border prose-code:border-pink-200 dark:prose-code:border-[#333]
                        prose-pre:bg-gray-900 dark:prose-pre:bg-[#050505] prose-pre:border prose-pre:border-[#333]
                        prose-blockquote:border-pink-500 dark:prose-blockquote:border-[#00ff41] prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-[#111] dark:prose-blockquote:text-gray-300">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Evidence Images */}
                {images.length > 0 && (
                    <div className="space-y-8">
                        <h3 className="text-2xl text-pink-600 dark:text-[#00ff41] border-b border-pink-300 dark:border-[#008f11] pb-2 mb-6 inline-block font-mono">
                            {`// EVIDENCE_FILES (${images.length})`}
                        </h3>
                        <div className="grid grid-cols-1 gap-8">
                            {images.map((img, idx) => (
                                <div key={idx} className="group border border-pink-200 dark:border-[#00ff41] p-1 bg-white dark:bg-black hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] transition-all">
                                    <img src={img} alt={`Evidence ${idx}`} className="w-full h-auto object-cover opacity-95 group-hover:opacity-100" />
                                    <div className="text-right text-pink-500 dark:text-[#00ff41] text-[10px] mt-2 font-mono p-2">FIG_0{idx + 1}.JPG</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </main>
    );
}