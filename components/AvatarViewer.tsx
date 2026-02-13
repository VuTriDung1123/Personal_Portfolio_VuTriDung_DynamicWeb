"use client";

import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";

interface ModelProps {
  url: string;
  isTalking: boolean;
  scale?: number;
  position?: [number, number, number];
}

const Model = ({ url, isTalking, scale = 2, position = [0, -3, 0] }: ModelProps) => {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current) {
      const time = state.clock.getElapsedTime();
      // Robot đứng nhún nhảy nhẹ
      modelRef.current.position.y = position[1] + Math.sin(time * 2) * 0.03;
      
      if (isTalking) {
        modelRef.current.rotation.y = Math.sin(time * 8) * 0.15;
      } else {
        modelRef.current.rotation.y = Math.sin(time * 1) * 0.05;
      }
    }
  });

  return <primitive object={scene} ref={modelRef} scale={scale} position={position} />;
};

// Component Loading nhỏ gọn
const Loader = () => (
  <Html center>
    <div className="text-[#00ff41] font-mono text-[10px] bg-black/80 px-2 py-1 rounded border border-[#00ff41] animate-pulse">
      LOADING...
    </div>
  </Html>
);

interface AvatarViewerProps {
  url: string;
  isTalking: boolean;
  theme: 'hacker' | 'sakura';
}

function AvatarCanvas({ url, isTalking, theme }: AvatarViewerProps) {
  const [hasError, setHasError] = useState(false);

  // Nếu lỗi thì ẩn luôn, không hiện chữ báo lỗi gây xấu giao diện
  if (hasError) return null;

  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas 
        // [QUAN TRỌNG] Camera: [0, 0, 7] -> Số 7 càng lớn thì robot càng nhỏ (zoom out)
        // fov: 25 -> Góc nhìn hẹp giúp robot trông đỡ bị méo (hiệu ứng chibi)
        camera={{ position: [0, 0, 7], fov: 25 }} 
        className="w-full h-full block"
        gl={{ preserveDrawingBuffer: true, alpha: true }} 
      >
        {theme === 'sakura' ? (
          <>
            <ambientLight intensity={0.8} />
            <spotLight position={[5, 5, 5]} intensity={0.6} color="#ffc1e3" />
            <Environment preset="sunset" />
          </>
        ) : (
          <>
            <ambientLight intensity={0.6} />
            <pointLight position={[2, 2, 2]} intensity={2} color="#00ff41" distance={5} />
            <spotLight position={[-2, 5, 2]} intensity={1} color="#008f11" />
          </>
        )}

        <Suspense fallback={<Loader />}>
            <ErrorBoundary setHasError={setHasError}>
                <Model 
                    url={url} 
                    isTalking={isTalking} 
                    scale={theme === 'sakura' ? 2.3 : 2.2} 
                    // [QUAN TRỌNG] position-y: -3.2 -> Hạ thấp xuống để chân chạm đáy khung
                    position={[0, -3.2, 0]} 
                />
            </ErrorBoundary>
        </Suspense>

        <ContactShadows opacity={0.4} scale={5} blur={2} far={4} color="#000000" />
        
        {/* Cho phép xoay trái phải nhẹ */}
        <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            minPolarAngle={Math.PI / 2.2} 
            maxPolarAngle={Math.PI / 1.9}
        />
      </Canvas>
    </div>
  );
}

export default function AvatarViewer(props: AvatarViewerProps) {
  return <AvatarCanvas key={props.url} {...props} />;
}

class ErrorBoundary extends React.Component<{ setHasError: (v: boolean) => void, children: React.ReactNode }> {
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any) { this.props.setHasError(true); }
  render() { return this.props.children; }
}