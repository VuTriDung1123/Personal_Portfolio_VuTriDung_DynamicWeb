"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getAllSiteContent() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await (prisma as any).siteContent.findMany();
  } catch (error) {
    console.error("Error fetching content:", error);
    return [];
  }
}

export async function saveSiteContent(formData: FormData) {
  const language = formData.get("language") as string;
  const entries = Array.from(formData.entries());
  
  for (const [key, value] of entries) {
    if (key === "language" || key === "username" || key === "password") continue;
    
    if (typeof value === 'string') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (prisma as any).siteContent.upsert({
            where: {
                key_language: {
                    key: key,
                    language: language
                }
            },
            update: { value: value },
            create: {
                key: key,
                value: value,
                language: language
            }
        });
    }
  }
  revalidatePath("/");
}