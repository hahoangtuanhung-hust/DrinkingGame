import { ContactShadows, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import type { Group, PointLight } from "three";
import type { GraphicsQuality, Language } from "../../../app/settingsStore";
import type { DicePhase, DieValue } from "../types";

const PIPS: Record<number, [number, number][]> = {
  1: [[0, 0]],
  2: [[-0.22, 0.22], [0.22, -0.22]],
  3: [[-0.24, 0.24], [0, 0], [0.24, -0.24]],
  4: [[-0.23, 0.23], [0.23, 0.23], [-0.23, -0.23], [0.23, -0.23]],
  5: [[-0.24, 0.24], [0.24, 0.24], [0, 0], [-0.24, -0.24], [0.24, -0.24]],
  6: [[-0.23, 0.27], [-0.23, 0], [-0.23, -0.27], [0.23, 0.27], [0.23, 0], [0.23, -0.27]],
};

function PipFace({ value, face, color }: { value: number; face: "top" | "bottom" | "front" | "back" | "left" | "right"; color: string }) {
  return PIPS[value].map(([a, b], index) => {
    const props = {
      top: { position: [a, 0.506, b], rotation: [-Math.PI / 2, 0, 0] },
      bottom: { position: [a, -0.506, b], rotation: [Math.PI / 2, 0, 0] },
      front: { position: [a, b, 0.506], rotation: [0, 0, 0] },
      back: { position: [-a, b, -0.506], rotation: [0, Math.PI, 0] },
      right: { position: [0.506, b, -a], rotation: [0, Math.PI / 2, 0] },
      left: { position: [-0.506, b, a], rotation: [0, -Math.PI / 2, 0] },
    }[face];
    return (
      <mesh key={`${face}-${index}`} position={props.position as [number, number, number]} rotation={props.rotation as [number, number, number]}>
        <circleGeometry args={[0.078, 14]} />
        <meshStandardMaterial color={color} roughness={0.62} />
      </mesh>
    );
  });
}

const TOP_ROTATIONS: Record<DieValue, [number, number, number]> = {
  1: [0, 0, 0],
  2: [-Math.PI / 2, 0, 0],
  3: [0, 0, Math.PI / 2],
  4: [0, 0, -Math.PI / 2],
  5: [Math.PI / 2, 0, 0],
  6: [Math.PI, 0, 0],
};

function Die({ value, position, index, scale }: { value: DieValue; position: [number, number, number]; index: number; scale: number }) {
  const rotation = TOP_ROTATIONS[value];
  const pipColor = index % 2 === 0 ? "#263e9a" : "#bd3045";
  return (
    <group position={position} rotation={[0, index * 0.67, 0]} scale={scale}>
      <group rotation={rotation}>
        <RoundedBox args={[1, 1, 1]} radius={0.15} smoothness={3} castShadow receiveShadow>
          <meshPhysicalMaterial color="#f8f3ea" roughness={0.25} clearcoat={0.5} clearcoatRoughness={0.32} />
        </RoundedBox>
        <PipFace value={1} face="top" color={pipColor} /><PipFace value={6} face="bottom" color={pipColor} />
        <PipFace value={2} face="front" color={pipColor} /><PipFace value={5} face="back" color={pipColor} />
        <PipFace value={3} face="right" color={pipColor} /><PipFace value={4} face="left" color={pipColor} />
      </group>
    </group>
  );
}

function CylindricalCup({ amount, reducedMotion, compact }: { amount: number; reducedMotion: boolean; compact: boolean }) {
  const cup = useRef<Group>(null);
  const current = useRef(amount);
  const invalidate = useThree((state) => state.invalidate);

  useFrame(() => {
    if (!cup.current) return;
    if (reducedMotion) current.current = amount;
    else current.current += (amount - current.current) * 0.115;
    if (Math.abs(amount - current.current) < 0.002 || reducedMotion) current.current = amount;
    else invalidate();

    const value = current.current;
    const lift = Math.sin(value * Math.PI) * 1.25;
    const openScale = compact ? 0.84 : 0.68;
    cup.current.position.set(value * 0.82, lift + value * 0.32, value * -2.7);
    cup.current.rotation.set(value * -1.05, value * 0.04, value * -0.035);
    cup.current.scale.setScalar(1 - value * (1 - openScale));
  });

  const initialScale = 1 - amount * (1 - (compact ? 0.84 : 0.68));
  return (
    <group ref={cup} position={[amount * 0.82, amount * 0.32, amount * -2.7]} rotation={[amount * -1.05, amount * 0.04, amount * -0.035]} scale={initialScale}>
      <mesh position={[0, 2.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.52, 3.08, 3.62, 64]} />
        <meshPhysicalMaterial color="#171a22" emissive="#090d18" emissiveIntensity={0.72} roughness={0.22} metalness={0.12} clearcoat={1} clearcoatRoughness={0.16} />
      </mesh>

      <mesh position={[0, 4.33, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.02, 2.52, 0.84, 64]} />
        <meshPhysicalMaterial color="#1b1e28" emissive="#0a0e19" emissiveIntensity={0.68} roughness={0.2} metalness={0.14} clearcoat={1} clearcoatRoughness={0.14} />
      </mesh>

      <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[3.02, 0.085, 12, 64]} />
        <meshStandardMaterial color="#747985" metalness={0.78} roughness={0.2} />
      </mesh>

      <mesh position={[0, 3.99, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[2.5, 0.075, 12, 64]} />
        <meshStandardMaterial color="#48494e" metalness={0.82} roughness={0.2} />
      </mesh>

      <mesh position={[0, 4.82, 0]} castShadow>
        <cylinderGeometry args={[2.08, 2.08, 0.24, 64]} />
        <meshPhysicalMaterial color="#161923" emissive="#090d18" emissiveIntensity={0.58} roughness={0.18} metalness={0.16} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>

      <mesh position={[0, 5.04, 0]} castShadow>
        <cylinderGeometry args={[1.18, 1.3, 0.25, 48]} />
        <meshPhysicalMaterial color="#1b1e28" emissive="#090d18" emissiveIntensity={0.52} roughness={0.18} metalness={0.22} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>

      <mesh position={[0, 5.27, 0]} castShadow>
        <cylinderGeometry args={[1.55, 1.42, 0.24, 64]} />
        <meshPhysicalMaterial color="#20232e" emissive="#0a0e1b" emissiveIntensity={0.5} roughness={0.16} metalness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>

      <mesh position={[0, 5.405, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 1.34, 64]} />
        <meshPhysicalMaterial color="#1c1e24" roughness={0.11} metalness={0.28} clearcoat={1} />
      </mesh>

      <mesh position={[-1.62, 2.38, 2.25]} rotation={[0.05, -0.08, 0.08]}>
        <planeGeometry args={[0.22, 2.25]} />
        <meshBasicMaterial color="#7e2430" transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <mesh position={[1.08, 2.6, 2.43]} rotation={[0.04, 0.04, -0.06]}>
        <planeGeometry args={[0.12, 1.85]} />
        <meshBasicMaterial color="#f3d8ba" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}

function DiceTray() {
  return (
    <group>
      <mesh position={[0, 0.11, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.08, 3.3, 0.42, 64]} />
        <meshPhysicalMaterial color="#090a0d" roughness={0.2} metalness={0.15} clearcoat={0.95} clearcoatRoughness={0.2} />
      </mesh>
      <mesh position={[0, 0.38, 0]} receiveShadow>
        <cylinderGeometry args={[2.86, 2.98, 0.16, 64]} />
        <meshStandardMaterial color="#18191d" roughness={0.65} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.54, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[3.02, 0.2, 18, 64]} />
        <meshPhysicalMaterial color="#111216" roughness={0.18} metalness={0.18} clearcoat={1} clearcoatRoughness={0.16} />
      </mesh>
      <mesh position={[0, 0.29, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.23, 0.045, 10, 64]} />
        <meshStandardMaterial color="#505158" metalness={0.85} roughness={0.2} />
      </mesh>
    </group>
  );
}

function TableScene({ values, phase, cupAmount, flashEnabled, reducedMotion }: { values: DieValue[]; phase: DicePhase; cupAmount: number; flashEnabled: boolean; reducedMotion: boolean }) {
  const shaker = useRef<Group>(null);
  const flash = useRef<PointLight>(null);
  const shakeElapsed = useRef(0);
  const settleElapsed = useRef(0);
  const compact = useThree((state) => state.size.width < 640);
  const positions = useMemo<[number, number, number][]>(() => [
    [-1.3, 0.94, -0.76], [0, 0.94, -1.02], [1.3, 0.94, -0.62], [-0.74, 0.94, 0.66], [0.74, 0.94, 0.7],
  ], []);
  const shaking = phase === "SHAKING" || phase === "SETTLING";

  useEffect(() => {
    if (phase === "SHAKING") {
      shakeElapsed.current = 0;
      settleElapsed.current = 0;
    } else if (phase === "SETTLING") {
      settleElapsed.current = 0;
    }
  }, [phase]);

  useFrame((_, delta) => {
    if (!shaker.current) return;
    if (shaking) {
      const frameDelta = Math.min(delta, 0.05);
      shakeElapsed.current += frameDelta;
      if (phase === "SETTLING") settleElapsed.current += frameDelta;
      const t = shakeElapsed.current;
      const attack = Math.min(1, t / 0.13);
      const settleProgress = phase === "SETTLING" ? Math.min(1, settleElapsed.current / 0.32) : 0;
      const envelope = attack * (phase === "SETTLING" ? Math.pow(1 - settleProgress, 2) : 1);
      const baseStrength = compact ? 0.78 : 0.66;
      const sideways = Math.sin(t * Math.PI * 13.6) + Math.sin(t * Math.PI * 23) * 0.16;
      const recoil = Math.sin(t * Math.PI * 6.8 + 0.7) * 0.1;
      const strength = baseStrength * envelope;
      shaker.current.position.x = (sideways + recoil) * strength;
      shaker.current.position.y = Math.pow(Math.abs(Math.sin(t * Math.PI * 13.6)), 2) * strength * 0.065;
      shaker.current.position.z = Math.sin(t * Math.PI * 8.2) * strength * 0.11;
      shaker.current.rotation.y = Math.sin(t * Math.PI * 8.2) * strength * 0.035;
      shaker.current.rotation.z = -sideways * strength * 0.085;
      if (flash.current) flash.current.intensity = flashEnabled ? envelope * (4 + Math.max(0, Math.sin(t * Math.PI * 9)) * 8) : 0;
    } else {
      const recovery = 1 - Math.exp(-delta * 14);
      shaker.current.position.x += (0 - shaker.current.position.x) * recovery;
      shaker.current.position.y += (0 - shaker.current.position.y) * recovery;
      shaker.current.position.z += (0 - shaker.current.position.z) * recovery;
      shaker.current.rotation.y += (0 - shaker.current.rotation.y) * recovery;
      shaker.current.rotation.z += (0 - shaker.current.rotation.z) * recovery;
      if (flash.current) flash.current.intensity += (0 - flash.current.intensity) * recovery;
    }
  });

  return (
    <>
      <color attach="background" args={["#0e0d0f"]} />
      <fog attach="fog" args={["#0e0d0f", 14, 27]} />
      <ambientLight intensity={0.42} color="#fff4e6" />
      <hemisphereLight args={["#dce7ff", "#120c0c", 0.85]} />
      <directionalLight position={[-5, 10, 7]} intensity={3.8} color="#fff1d7" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-4.5, 4.2, 2.5]} intensity={12} color="#a62d3f" distance={10} decay={2} />
      <pointLight position={[5, 5.5, -1.5]} intensity={11} color="#718eff" distance={12} decay={2} />
      <pointLight position={[0, 6.5, 5]} intensity={10} color="#dce5ff" distance={18} decay={2} />
      <pointLight position={[0.5, 4.5, -5]} intensity={14} color="#6886e8" distance={12} decay={2} />
      <pointLight ref={flash} position={[0, 6, 3]} intensity={0} color="#ffdcaa" distance={14} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, 0]} receiveShadow>
        <circleGeometry args={[13, 72]} />
        <meshStandardMaterial color="#211517" roughness={0.94} metalness={0.01} />
      </mesh>

      <group position={[compact ? -0.25 : -0.1, 0, 0]} scale={compact ? 1.02 : 1.3}>
        <group ref={shaker}>
          <DiceTray />
          {values.map((value, index) => <Die key={index} value={value} position={positions[index]} index={index} scale={compact ? 0.96 : 0.78} />)}
          <CylindricalCup amount={cupAmount} reducedMotion={reducedMotion} compact={compact} />
        </group>
      </group>

      <ContactShadows position={[0, -0.12, 0]} opacity={0.7} scale={17} blur={2.5} far={9} />
    </>
  );
}

function CameraRig() {
  const camera = useThree((state) => state.camera);
  const compact = useThree((state) => state.size.width < 640);

  useLayoutEffect(() => {
    camera.position.set(compact ? 0.2 : 0.35, compact ? 16.2 : 15.8, compact ? 3.8 : 4.2);
    camera.lookAt(0, 0.65, -1.4);
    camera.updateProjectionMatrix();
  }, [camera, compact]);

  return null;
}

const getDpr = (quality: GraphicsQuality) => quality === "low" ? 1 : quality === "medium" ? 1.35 : quality === "high" ? 2 : Math.min(window.devicePixelRatio, 1.6);

export function DiceScene({ values, phase, peekAmount, quality, flashEnabled, reducedMotion, language }: { values: DieValue[]; phase: DicePhase; peekAmount: number; quality: GraphicsQuality; flashEnabled: boolean; reducedMotion: boolean; language: Language }) {
  const openAmount = phase === "OPEN" ? 1 : phase === "PEEKING" ? peekAmount : 0;
  const animated = (phase === "SHAKING" || phase === "SETTLING") && !reducedMotion;
  return (
    <Canvas
      shadows={quality !== "low"}
      dpr={getDpr(quality)}
      camera={{ position: [0.35, 15.8, 4.2], fov: 43, near: 0.1, far: 42 }}
      gl={{ antialias: quality !== "low", powerPreference: "high-performance" }}
      frameloop={animated ? "always" : "demand"}
      role="img"
      aria-label={language === "vi" ? "Ống lắc xúc xắc hình trụ bóng, kèm khay tròn chứa năm viên xúc xắc ba chiều" : "A glossy cylindrical dice cup with a round tray containing five three-dimensional dice"}
    >
      <CameraRig />
      <TableScene values={values} phase={phase} cupAmount={openAmount} flashEnabled={flashEnabled && !reducedMotion} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
