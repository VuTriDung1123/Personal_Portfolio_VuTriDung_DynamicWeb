// lib/prisma.ts

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Kiểm tra xem đã có kết nối chưa, nếu chưa thì tạo mới
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

// Nếu không phải là môi trường thật (production), lưu kết nối vào biến toàn cục
// để tái sử dụng, tránh tạo mới liên tục làm sập database
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;