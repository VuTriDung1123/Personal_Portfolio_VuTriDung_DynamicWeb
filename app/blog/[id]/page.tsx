import { getPostById } from "@/lib/actions";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function BlogDetail({ params }: { params: any }) {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) return <div className="text-center pt-20 font-mono text-2xl text-red-500">ERROR 404: DATA NOT FOUND</div>;

    let images: string[] = [];
    try { images = JSON.parse(post.images); } catch { images = []; }

    return (
        <main className="min-h-screen relative font-mono text-gray-800 dark:text-white flex flex-col items-center">
            
            <div className="fixed top-20 left-5 z-40 md:top-24">
                <Link href="/blog" className="bg-white/80 dark:bg-black border border-pink-500 dark:border-[#00ff41] text-pink-600 dark:text-[#00ff41] px-4 py-2 hover:bg-pink-500 dark:hover:bg-[#00ff41] hover:text-white dark:hover:text-black transition-colors font-bold uppercase text-sm backdrop-blur-sm shadow-sm">
                    &lt; Back
                </Link>
            </div>

            <article className="relative z-10 w-full max-w-5xl pt-32 pb-20 px-6">
                <div className="border-l-4 border-pink-500 dark:border-[#00ff41] pl-6 mb-10 bg-white/60 dark:bg-[rgba(20,20,20,0.8)] p-6 shadow-lg backdrop-blur-md">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-pink-600 dark:text-[#00ff41] text-xs md:text-sm font-mono uppercase tracking-widest">
                        <span className="bg-pink-50 dark:bg-[#003300] px-2 py-1 border border-pink-300 dark:border-[#00ff41]">DATE: {post.createdAt.toLocaleDateString()}</span>
                        <span className="bg-pink-50 dark:bg-[#003300] px-2 py-1 border border-pink-300 dark:border-[#00ff41]">TAG: {post.tag || "GENERAL"}</span>
                    </div>
                </div>

                {/* Nội dung Markdown */}
                <div className="bg-white/90 dark:bg-[rgba(10,10,10,0.9)] p-8 border border-pink-200 dark:border-[#333] mb-12 shadow-xl backdrop-blur-sm">
                    <div className="prose prose-lg max-w-none dark:prose-invert
                        prose-headings:text-pink-600 dark:prose-headings:text-[#00ff41] 
                        prose-a:text-pink-600 dark:prose-a:text-[#00ff41]
                        prose-strong:text-black dark:prose-strong:text-white
                        prose-code:text-pink-700 dark:prose-code:text-[#00ff41] prose-code:bg-pink-50 dark:prose-code:bg-[#111] prose-code:px-1 prose-code:border prose-code:border-pink-200 dark:prose-code:border-[#333]
                        prose-pre:bg-gray-900 dark:prose-pre:bg-[#050505] prose-pre:border prose-pre:border-[#333]
                        prose-blockquote:border-pink-500 dark:prose-blockquote:border-[#00ff41] prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-[#111]">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </div>

                {images.length > 0 && (
                    <div className="space-y-8">
                        <h3 className="text-2xl text-pink-600 dark:text-[#00ff41] border-b border-pink-300 dark:border-[#008f11] pb-2 mb-6 inline-block font-mono">
                            {`// EVIDENCE_FILES (${images.length})`}
                        </h3>
                        <div className="grid grid-cols-1 gap-8">
                            {images.map((img, idx) => (
                                <div key={idx} className="group border border-pink-200 dark:border-[#333] p-2 bg-white dark:bg-black hover:border-pink-500 dark:hover:border-[#00ff41] transition-all shadow-lg">
                                    <img src={img} alt={`Evidence ${idx}`} className="w-full h-auto object-cover opacity-95 group-hover:opacity-100" />
                                    <div className="text-right text-pink-500 dark:text-[#00ff41] text-[10px] mt-2 font-mono">FIG_0{idx + 1}.JPG</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </main>
    );
}