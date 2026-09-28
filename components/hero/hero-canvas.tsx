"use client";

import { PointMaterial, Points } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Points as PointsType } from "three";

function random(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function buildField(count: number) {
  const coordinates = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const radius = 1.6 + random(index + 1) * 2.2;
    const theta = random(index + 19) * Math.PI * 2;
    const phi = Math.acos(2 * random(index + 47) - 1);
    coordinates[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    coordinates[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.72;
    coordinates[index * 3 + 2] = radius * Math.cos(phi);
  }
  return coordinates;
}

function Field() {
  const ref = useRef<PointsType>(null);
  const positions = useMemo(() => buildField(700), []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.045 + state.pointer.x * 0.28;
    ref.current.rotation.x = state.pointer.y * 0.18;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#c4b5fd" size={0.018} sizeAttenuation depthWrite={false} opacity={0.85} />
    </Points>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.4], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      className="!absolute inset-0"
    >
      <Field />
    </Canvas>
  );
}
