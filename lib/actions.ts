"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import fs from "fs/promises";

const prisma = new PrismaClient();

// 1. Kiểm tra Admin (Tài khoản + Mật khẩu)
export async function checkAdmin(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  
  // Cấu hình cứng tài khoản admin
  const VALID_USER = "admin"; 
  const VALID_PASS = "Dung2005";

  if (username?.trim() === VALID_USER && password?.trim() === VALID_PASS) {
    return { success: true };
  }
  return { success: false };
}

// 2. Tạo bài viết & Upload ảnh từ Local
export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tag = formData.get("tag") as string;
  
  // Lấy tất cả file ảnh được upload
  const files = formData.getAll("images") as File[];
  const imageUrls: string[] = [];

  // Đường dẫn lưu ảnh: public/uploads
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  // Tạo thư mục nếu chưa có
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  // Duyệt qua từng file (Tối đa 100 ảnh)
  const maxImages = files.slice(0, 100); 

  for (const file of maxImages) {
    // Chỉ xử lý nếu là file ảnh và có kích thước > 0
    if (file.size > 0 && file.type.startsWith("image/")) {
      // Tạo tên file ngẫu nhiên
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.name) || ".jpg"; 
      const filename = `${uniqueSuffix}${extension}`;
      const filepath = path.join(uploadDir, filename);

      // Chuyển file thành Buffer và lưu vào ổ cứng
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await fs.writeFile(filepath, buffer);

      // Lưu đường dẫn web vào mảng (/uploads/...)
      imageUrls.push(`/uploads/${filename}`);
    }
  }

  // Lưu vào Database
  await prisma.post.create({
    data: {
      title,
      content,
      tag: tag || "my_confessions",
      images: JSON.stringify(imageUrls),
    },
  });

  // Cập nhật lại dữ liệu các trang
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin");
}

// 3. Xóa bài viết (HÀM BẠN ĐANG THIẾU NÈ)
export async function deletePost(id: string) {
    try {
        await prisma.post.delete({ where: { id } });
        // Cập nhật lại ngay lập tức để danh sách biến mất
        revalidatePath("/admin");
        revalidatePath("/blog");
        revalidatePath("/");
    } catch (error) {
        console.error("Failed to delete post:", error);
    }
}

// 4. Lấy tất cả bài viết (Cho trang Admin quản lý)
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

// 5. Lấy bài viết theo Tag (Giữ nguyên cho trang chủ)
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

// 6. Lấy chi tiết 1 bài viết
export async function getPostById(id: string) {
  try {
    return await prisma.post.findUnique({ where: { id } });
  } catch {
    return null;
  }
}