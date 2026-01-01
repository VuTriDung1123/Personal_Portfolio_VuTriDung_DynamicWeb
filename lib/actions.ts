"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import fs from "fs/promises";

// Khởi tạo Prisma
const prisma = new PrismaClient();

// 1. Kiểm tra Admin Login
export async function checkAdmin(formData: FormData) {
  const password = formData.get("password") as string;
  if (password?.trim() === process.env.ADMIN_PASSWORD || password?.trim() === "Dung2005") {
    return { success: true };
  }
  return { success: false };
}

// 2. Tạo bài viết & Upload ảnh
export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tag = formData.get("tag") as string;
  
  const files = formData.getAll("images") as File[];
  const imageUrls: string[] = [];
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  for (const file of files) {
    if (file.size > 0 && file.type.startsWith("image/")) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.name) || ".jpg"; 
      const filename = `${uniqueSuffix}${extension}`;
      const filepath = path.join(uploadDir, filename);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await fs.writeFile(filepath, buffer);
      imageUrls.push(`/uploads/${filename}`);
    }
  }

  const finalImages = imageUrls.slice(0, 100);

  await prisma.post.create({
    data: {
      title,
      content,
      tag: tag || null,
      images: JSON.stringify(finalImages),
    },
  });

  revalidatePath("/");
  revalidatePath("/blog");
  redirect("/blog");
}

// 3. Lấy bài viết theo Tag (Cho trang chủ)
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

// 4. Lấy chi tiết 1 bài viết
export async function getPostById(id: string) {
  try {
    return await prisma.post.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

// 5. Lấy TẤT CẢ bài viết (QUAN TRỌNG: Hàm này đang thiếu gây lỗi)
export async function getAllPosts() {
  try {
    return await prisma.post.findMany({ 
      orderBy: { createdAt: "desc" } 
    });
  } catch (error) {
    console.error("Error getting all posts:", error);
    return [];
  }
}