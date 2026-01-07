"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ThemeToggle from "@/components/ThemeToggle";
import MatrixRain from "@/components/MatrixRain";

// Lazy load SakuraBg
const SakuraBg = dynamic(() => import("@/components/SakuraBg"), { ssr: false });

export default function ClientWrapper() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* 1. LỚP NỀN (BACKGROUND) */}
      {/* QUAN TRỌNG: Đã đổi z-index từ -1 thành 0 để không bị body che mất */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {resolvedTheme === "dark" && <MatrixRain />}
        {resolvedTheme === "light" && <SakuraBg />}
      </div>

      {/* 2. NÚT ĐỔI THEME */}
      {/* Nằm đè lên trên tất cả (z-50) */}
      <div 
        className="fixed top-24 right-6 z-50 flex flex-col items-end animate-in fade-in slide-in-from-right-5 duration-500"
      >
         <ThemeToggle />
      </div>
    </>
  );
}