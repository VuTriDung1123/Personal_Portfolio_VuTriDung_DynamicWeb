"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

// 1. Kiểm tra Admin (Có log để debug)
export async function checkAdmin(formData: FormData) {
  const password = formData.get("password") as string;
  
  // SỬA ĐOẠN NÀY: So sánh trực tiếp, không dùng process.env nữa
  if (password.trim() === "Dung2005") {
    return { success: true };
  }
  
  return { success: false };
}

// 2. Tạo bài viết (Giữ nguyên)
export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tag = formData.get("tag") as string;
  const imagesStr = formData.get("images") as string; 

  const imageArray = imagesStr ? imagesStr.split(',').map(url => url.trim()).filter(url => url.length > 0) : [];

  await prisma.post.create({
    data: {
      title,
      content,
      tag: tag || null,
      images: JSON.stringify(imageArray),
    },
  });

  revalidatePath("/");
  redirect("/");
}

// 3. Lấy bài viết theo Tag (Giữ nguyên)
export async function getPostsByTag(tag: string) {
  try {
    const posts = await prisma.post.findMany({ 
      where: { tag },
      orderBy: { createdAt: "desc" } 
    });
    return posts;
  } catch {
    return [];
  }
}

// 4. Lấy chi tiết (Giữ nguyên)
export async function getPostById(id: string) {
  try {
    return await prisma.post.findUnique({ where: { id } });
  } catch {
    return null;
  }
}