"use server";

import prisma from "./prisma"; // Đảm bảo bạn đã có file lib/prisma.ts, nếu chưa thì báo tôi
import { revalidatePath } from "next/cache";

// 1. Kiểm tra Admin (Giữ nguyên)
export async function checkAdmin(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  
  const VALID_USER = "admin"; 
  const VALID_PASS = "Dung2005";
  
  if (username?.trim() === VALID_USER && password?.trim() === VALID_PASS) {
    return { success: true };
  }
  return { success: false };
}

// 2. Tạo bài viết (SỬA LẠI: Dùng Link ảnh thay vì Upload file)
export async function createPost(formData: FormData) {
  // Lấy dữ liệu từ form
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tag = formData.get("tag") as string;
  const language = formData.get("language") as string;
  
  // SỬA QUAN TRỌNG: Lấy chuỗi JSON các link ảnh từ form
  // Nếu không có ảnh thì mặc định là mảng rỗng "[]"
  const images = (formData.get("images") as string) || "[]";

  try {
    // Lưu vào Database
    await prisma.post.create({
      data: {
        title,
        content,
        tag: tag || "my_confessions",
        language: language || "vi",
        images, // Lưu thẳng chuỗi JSON link ảnh vào đây
      },
    });

    // Làm mới lại các trang
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin");
  } catch (error) {
    console.error("Lỗi khi tạo bài viết:", error);
  }
}


// --- HÀM MỚI: CẬP NHẬT BÀI VIẾT ---
export async function updatePost(formData: FormData) {
  const id = formData.get("id") as string; // Lấy ID bài cần sửa
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const tag = formData.get("tag") as string;
  const language = formData.get("language") as string;
  
  // Lấy chuỗi JSON link ảnh
  const images = (formData.get("images") as string) || "[]";

  try {
    // Lệnh Update của Prisma
    await prisma.post.update({
      where: { id: id }, // Tìm bài theo ID
      data: {
        title,
        content,
        tag,
        language,
        images,
        // Không cập nhật createdAt
      },
    });

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Lỗi khi sửa bài viết:", error);
    return { success: false, error };
  }
}


// 3. Xóa bài viết (Giữ nguyên)
export async function deletePost(id: string) {
    try {
        await prisma.post.delete({ where: { id } });
        revalidatePath("/admin");
        revalidatePath("/blog");
        revalidatePath("/");
    } catch (error) {
        console.error("Failed to delete post:", error);
    }
}

// 4. Các hàm lấy dữ liệu Blog (Giữ nguyên)
export async function getAllPosts() {
  try { 
      return await prisma.post.findMany({ orderBy: { createdAt: "desc" } }); 
  } catch { return []; }
}

export async function getPostsByTag(tag: string) {
  try { 
      return await prisma.post.findMany({ where: { tag }, orderBy: { createdAt: "desc" } }); 
  } catch { return []; }
}

export async function getPostById(id: string) {
  try { 
      return await prisma.post.findUnique({ where: { id } }); 
  } catch { return null; }
}