"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { TextureLoader } from "three";

// ─── Atmosphere rim shader ─────────────────────────────────────────────────────
const atmoVert = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmoFrag = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.75 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.5);
    gl_FragColor = vec4(0.3, 0.6, 1.0, 0.8) * intensity;
  }
`;

// Start angle so India / Middle East faces the camera on load (~70 °E longitude)
const INIT_ROT_Y = -(Math.PI * 8) / 9; // −160 °

// ─── Earth sphere ──────────────────────────────────────────────────────────────
function Earth({ radius }: { radius: number }) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const rotAngle = useRef(INIT_ROT_Y);

  const [dayMap, normalMap, specularMap, cloudsMap] = useLoader(TextureLoader, [
    "/textures/earth_daymap.jpg",
    "/textures/earth_normal.jpg",
    "/textures/earth_specular.jpg",
    "/textures/earth_clouds.png",
  ]) as THREE.Texture[];

  dayMap.colorSpace = THREE.SRGBColorSpace;
  [dayMap, normalMap, specularMap].forEach((t) => {
    t.anisotropy = 16;
    t.minFilter  = THREE.LinearMipmapLinearFilter;
    t.magFilter  = THREE.LinearFilter;
  });
  cloudsMap.anisotropy = 8;

  useFrame((_, delta) => {
    rotAngle.current += delta * 0.08;
    if (meshRef.current)  meshRef.current.rotation.y  = rotAngle.current;
    if (cloudRef.current) cloudRef.current.rotation.y = rotAngle.current * 1.1;
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 128, 128]} />
        <meshPhongMaterial
          map={dayMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(4, 4)}
          specularMap={specularMap}
          specular={new THREE.Color(0x334455)}
          shininess={12}
        />
      </mesh>

      <mesh ref={cloudRef} scale={1.012}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshPhongMaterial
          alphaMap={cloudsMap}
          transparent
          color={new THREE.Color(1, 1, 1)}
          opacity={0.9}
          depthWrite={false}
        />
      </mesh>

      <mesh scale={1.015}>
        <sphereGeometry args={[radius, 64, 64]} />
        <shaderMaterial
          vertexShader={atmoVert}
          fragmentShader={atmoFrag}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── Orbit rings ──────────────────────────────────────────────────────────────
const ORBIT_DATA = [
  { radius: 1.32, color: "#00D4FF", rotX: 0.30,  rotZ: 0.00,  opacity: 0.50, tube: 0.002 },
  { radius: 1.50, color: "#0099EE", rotX: -0.38, rotZ: 0.12,  opacity: 0.40, tube: 0.002 },
  { radius: 1.72, color: "#0077CC", rotX: 0.52,  rotZ: -0.10, opacity: 0.38, tube: 0.002 },
  { radius: 2.10, color: "#3366BB", rotX: 0.18,  rotZ: 1.20,  opacity: 0.28, tube: 0.002 },
  { radius: 2.80, color: "#FFB800", rotX: 0.05,  rotZ: 0.02,  opacity: 0.32, tube: 0.002 },
];

function OrbitLine({ radius, color, rotX, rotZ, opacity, tube }: typeof ORBIT_DATA[0]) {
  return (
    <mesh rotation={[rotX, 0, rotZ]}>
      <torusGeometry args={[radius, tube, 2, 256]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

// ─── Satellites ───────────────────────────────────────────────────────────────
const SAT_DATA = [
  { radius: 1.32, speed: 0.60, startAngle: 0.00, rotX: 0.30,  rotZ: 0.00,  color: "#00FFFF" },
  { radius: 1.50, speed: 0.45, startAngle: 2.10, rotX: -0.38, rotZ: 0.12,  color: "#00D4FF" },
  { radius: 1.72, speed: 1.20, startAngle: 4.20, rotX: 0.52,  rotZ: -0.10, color: "#AADDFF" },
  { radius: 2.10, speed: 0.20, startAngle: 1.05, rotX: 0.18,  rotZ: 1.20,  color: "#4488FF" },
  { radius: 2.80, speed: 0.06, startAngle: 3.14, rotX: 0.05,  rotZ: 0.02,  color: "#FFD700" },
];

function SatDot({ radius, speed, startAngle, rotX, rotZ, color }: typeof SAT_DATA[0]) {
  const dotRef = useRef<THREE.Group>(null);
  const angle  = useRef(startAngle);

  useFrame((_, delta) => {
    angle.current += delta * speed;
    if (!dotRef.current) return;
    dotRef.current.position.set(
      Math.cos(angle.current) * radius,
      0,
      Math.sin(angle.current) * radius,
    );
  });

  return (
    <group rotation={[rotX, 0, rotZ]}>
      <group ref={dotRef}>
        <mesh>
          <sphereGeometry args={[0.010, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <pointLight color={color} intensity={0.3} distance={0.3} />
      </group>
    </group>
  );
}

// ─── Fallback while textures load ─────────────────────────────────────────────
function EarthFallback({ radius }: { radius: number }) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color="#1a3a6e" roughness={0.9} />
    </mesh>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
interface EarthGlobeProps {
  mini?: boolean;
  onSatelliteSelect?: (name: string) => void;
  selectedSatellite?: string | null;
}

export default function EarthGlobe({ mini = false }: EarthGlobeProps) {
  const radius  = 1.0;
  const cameraZ = mini ? 4.5 : 3.4;
  const fov     = mini ? 48 : 45;

  return (
    <Canvas
      camera={{ position: [0, 0, cameraZ], fov }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      style={{ background: "transparent" }}
    >
      <Stars radius={120} depth={60} count={12000} factor={4} saturation={0.1} fade speed={0.5} />

      <ambientLight intensity={1.4} />
      <directionalLight position={[0, 0, 5]} intensity={0.6} color="#FFFFFF" />
      <directionalLight position={[5, 3, 2]} intensity={0.3} color="#FFF5E0" />

      {/* Shift the whole scene up so the globe sits centered between navbar and search bar */}
      <group position={[0, mini ? 0 : 1.20, 0]}>
        <Suspense fallback={<EarthFallback radius={radius} />}>
          <Earth radius={radius} />
        </Suspense>

        {!mini && ORBIT_DATA.map((o, i) => <OrbitLine key={i} {...o} />)}
        {!mini && SAT_DATA.map((d, i)   => <SatDot    key={i} {...d} />)}
      </group>

      <OrbitControls
        target={mini ? [0, 0, 0] : [0, 1.20, 0]}
        enablePan={false}
        enableZoom={!mini}
        zoomSpeed={0.4}
        rotateSpeed={1.20}
        minDistance={mini ? 3.0 : 2.2}
        maxDistance={mini ? 6.0 : 6.0}
        enableDamping
        dampingFactor={0.05}
        autoRotate={mini}
        autoRotateSpeed={0.3}
      />
    </Canvas>
  );
}
