import { getPostById } from "@/lib/actions";
import MatrixRain from "@/components/MatrixRain";
import Link from "next/link";

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
        <main className="min-h-screen relative font-mono">
            <MatrixRain />
            
            <div className="fixed top-5 left-5 z-50">
                <Link href="/" className="bg-black border border-[#00ff41] text-[#00ff41] px-4 py-2 hover:bg-[#00ff41] hover:text-black transition-colors font-bold">
                    &lt; BACK TO SYSTEM
                </Link>
            </div>

            <article className="relative z-10 max-w-4xl mx-auto pt-28 pb-20 px-6">
                <div className="border-l-4 border-[#00ff41] pl-6 mb-10 bg-[rgba(0,0,0,0.6)] p-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 uppercase tracking-wide">{post.title}</h1>
                    <div className="flex gap-4 text-[#008f11] text-sm md:text-base">
                        <span>DATE: {post.createdAt.toLocaleDateString()}</span>
                        <span>|</span>
                        <span>SECTION: {post.tag || "GENERAL"}</span>
                    </div>
                </div>

                <div className="prose prose-invert prose-lg max-w-none text-[#e0e0e0] mb-12 whitespace-pre-wrap bg-[rgba(0,0,0,0.5)] p-6 border border-[#333]">
                    {post.content}
                </div>

                {images.length > 0 && (
                    <div className="space-y-8">
                        {/* Đã sửa lỗi comment tại đây */}
                        <h3 className="text-2xl text-[#00ff41] border-b border-[#008f11] pb-2 mb-6 inline-block">
                            {`// ATTACHMENTS_`}
                        </h3>
                        {images.map((img, idx) => (
                            <div key={idx} className="border-2 border-[#008f11] p-1 bg-black shadow-[0_0_15px_rgba(0,143,17,0.3)]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img} alt={`Evidence ${idx}`} className="w-full h-auto object-cover" />
                            </div>
                        ))}
                    </div>
                )}
            </article>
        </main>
    );
}