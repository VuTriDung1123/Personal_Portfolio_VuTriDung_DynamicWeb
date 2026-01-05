"use client";

import { useEffect, useState } from "react";

// Logic Random đơn giản
const PETALS = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: `${Math.random() * 5 + 5}s`,
    delay: `${Math.random() * 5}s`,
}));

export default function SakuraBg() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-pink-50">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
      {PETALS.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-fall opacity-70"
          style={{
            left: petal.left,
            animationDuration: petal.duration,
            animationDelay: petal.delay,
            top: '-10%',
          }}
        >
          🌸
        </div>
      ))}
      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          font-size: 20px;
        }
      `}</style>
    </div>
  );
}