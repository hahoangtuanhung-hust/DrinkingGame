import { ContactShadows, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, PointLight } from "three";
import type { GraphicsQuality } from "../../../app/settingsStore";
import type { DicePhase, DieValue } from "../types";

const PIPS: Record<number, [number, number][]> = {
  1: [[0, 0]],
  2: [[-0.22, 0.22], [0.22, -0.22]],
  3: [[-0.24, 0.24], [0, 0], [0.24, -0.24]],
  4: [[-0.23, 0.23], [0.23, 0.23], [-0.23, -0.23], [0.23, -0.23]],
  5: [[-0.24, 0.24], [0.24, 0.24], [0, 0], [-0.24, -0.24], [0.24, -0.24]],
  6: [[-0.23, 0.27], [-0.23, 0], [-0.23, -0.27], [0.23, 0.27], [0.23, 0], [0.23, -0.27]],
};

function PipFace({ value, face }: { value: number; face: "top" | "bottom" | "front" | "back" | "left" | "right" }) {
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
        <circleGeometry args={[0.07, 12]} />
        <meshStandardMaterial color="#171310" roughness={0.82} />
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

function Die({ value, position, index }: { value: DieValue; position: [number, number, number]; index: number }) {
  const rotation = TOP_ROTATIONS[value];
  return (
    <group position={position} rotation={[rotation[0], rotation[1] + index * 0.67, rotation[2]]} scale={0.72}>
      <RoundedBox args={[1, 1, 1]} radius={0.14} smoothness={3} castShadow receiveShadow>
        <meshPhysicalMaterial color={index === 4 ? "#d9a35e" : "#eee6d9"} roughness={0.3} clearcoat={0.42} clearcoatRoughness={0.4} />
      </RoundedBox>
      <PipFace value={1} face="top" /><PipFace value={6} face="bottom" />
      <PipFace value={2} face="front" /><PipFace value={5} face="back" />
      <PipFace value={3} face="right" /><PipFace value={4} face="left" />
    </group>
  );
}

function CupLid({ amount }: { amount: number }) {
  const lid = useRef<Group>(null);
  const current = useRef(amount);
  const invalidate = useThree((state) => state.invalidate);
  useFrame(() => {
    if (!lid.current) return;
    current.current += (amount - current.current) * 0.12;
    if (Math.abs(amount - current.current) < 0.002) current.current = amount;
    else invalidate();
    const value = current.current;
    lid.current.position.set(value * 4.9, 1.36 + value * 2.6, value * -0.45);
    lid.current.rotation.z = value * -0.38;
  });
  return (
    <group ref={lid} position={[amount * 4.9, 1.36 + amount * 2.6, amount * -0.45]} rotation={[0, 0, amount * -0.38]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[3.48, 3.58, 0.52, 64]} />
        <meshPhysicalMaterial color="#4d281e" roughness={0.28} clearcoat={0.45} clearcoatRoughness={0.35} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <torusGeometry args={[2.5, 0.045, 10, 64]} />
        <meshStandardMaterial color="#c38a4e" metalness={0.72} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.57, 32]} />
        <meshStandardMaterial color="#d6a55f" metalness={0.76} roughness={0.22} />
      </mesh>
    </group>
  );
}

function TableScene({ values, phase, lidAmount, flashEnabled }: { values: DieValue[]; phase: DicePhase; lidAmount: number; flashEnabled: boolean }) {
  const shaker = useRef<Group>(null);
  const flash = useRef<PointLight>(null);
  const positions = useMemo<[number, number, number][]>(() => [
    [-1.25, 0.55, -0.9], [0.1, 0.55, -1.2], [1.25, 0.55, -0.42], [-0.72, 0.55, 0.72], [0.78, 0.55, 0.78],
  ], []);
  const shaking = phase === "SHAKING" || phase === "SETTLING";

  useFrame(({ clock }) => {
    if (!shaker.current) return;
    if (shaking) {
      const t = clock.elapsedTime;
      const strength = phase === "SETTLING" ? 0.09 : 0.24;
      shaker.current.position.x = Math.sin(t * 27) * strength;
      shaker.current.position.z = Math.cos(t * 21) * strength * 0.55;
      shaker.current.rotation.y = Math.sin(t * 19) * strength * 0.3;
      if (flash.current) flash.current.intensity = flashEnabled ? 5 + Math.max(0, Math.sin(t * 16)) * 11 : 0;
    } else {
      shaker.current.position.x *= 0.82;
      shaker.current.position.z *= 0.82;
      shaker.current.rotation.y *= 0.82;
      if (flash.current) flash.current.intensity *= 0.78;
    }
  });

  return (
    <>
      <color attach="background" args={["#120f0d"]} />
      <fog attach="fog" args={["#120f0d", 12, 24]} />
      <ambientLight intensity={0.75} color="#ffe5c2" />
      <directionalLight position={[-4, 9, 5]} intensity={3.4} color="#ffd49d" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight ref={flash} position={[1, 6, 2]} intensity={0} color="#ffcb7f" distance={14} />
      <hemisphereLight args={["#f5d5ad", "#160f0c", 1.1]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, 0]} receiveShadow>
        <circleGeometry args={[12, 72]} />
        <meshStandardMaterial color="#251914" roughness={0.92} metalness={0.02} />
      </mesh>
      <group ref={shaker}>
        <mesh position={[0, 0.16, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[3.23, 3.42, 0.58, 64]} />
          <meshPhysicalMaterial color="#301c18" roughness={0.38} clearcoat={0.32} />
        </mesh>
        <mesh position={[0, 0.55, 0]} receiveShadow>
          <cylinderGeometry args={[2.92, 3.04, 0.22, 64]} />
          <meshStandardMaterial color="#16110f" roughness={0.82} />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <torusGeometry args={[3.12, 0.24, 18, 64]} />
          <meshPhysicalMaterial color="#5b3125" roughness={0.38} clearcoat={0.26} />
        </mesh>
        {values.map((value, index) => <Die key={index} value={value} position={positions[index]} index={index} />)}
        <CupLid amount={lidAmount} />
      </group>
      <ContactShadows position={[0, -0.12, 0]} opacity={0.58} scale={15} blur={2.8} far={8} />
    </>
  );
}

const getDpr = (quality: GraphicsQuality) => quality === "low" ? 1 : quality === "medium" ? 1.35 : quality === "high" ? 2 : Math.min(window.devicePixelRatio, 1.6);

export function DiceScene({ values, phase, peekAmount, quality, flashEnabled, reducedMotion }: { values: DieValue[]; phase: DicePhase; peekAmount: number; quality: GraphicsQuality; flashEnabled: boolean; reducedMotion: boolean }) {
  const openAmount = phase === "OPEN" ? 1 : phase === "PEEKING" ? peekAmount : 0;
  const animated = (phase === "SHAKING" || phase === "SETTLING") && !reducedMotion;
  return (
    <Canvas
      shadows={quality !== "low"}
      dpr={getDpr(quality)}
      camera={{ position: [0, 8.8, 9.4], fov: 40, near: 0.1, far: 40 }}
      gl={{ antialias: quality !== "low", powerPreference: "high-performance" }}
      frameloop={animated ? "always" : "demand"}
      aria-label="A three-dimensional dice cup containing five dice"
    >
      <TableScene values={values} phase={phase} lidAmount={openAmount} flashEnabled={flashEnabled && !reducedMotion} />
    </Canvas>
  );
}
