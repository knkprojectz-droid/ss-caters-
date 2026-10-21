import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Floating glowing sphere
function GlowSphere({ position, size, speed, color }) {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * speed * 0.4;
    meshRef.current.rotation.y = t * speed * 0.6;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

// Torus ring
function TorusRing({ position, rotation, color }) {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = rotation[0] + t * 0.3;
    meshRef.current.rotation.y = rotation[1] + t * 0.5;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[1.5, 0.05, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={1}
        roughness={0}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

// Floating octahedron crystals
function Crystal({ position }) {
  const meshRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.7;
    meshRef.current.rotation.z = t * 0.5;
    meshRef.current.position.y = position[1] + Math.sin(t * 0.8 + position[0]) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial
        color="#FF8C00"
        emissive="#FF6B00"
        emissiveIntensity={0.8}
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

// Animated particle field
function ParticleField() {
  const count = 120;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  const pointsRef = useRef();
  useFrame((state) => {
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FF6B00"
        size={0.06}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#FF6B00" />
      <pointLight position={[-5, -5, 3]} intensity={0.8} color="#FFD700" />
      <pointLight position={[0, 0, -5]} intensity={0.5} color="#FF4500" />

      {/* Stars */}
      <Stars radius={60} depth={30} count={1500} factor={3} saturation={0} fade speed={0.5} />

      {/* Main glowing spheres */}
      <GlowSphere position={[4, 1, -2]} size={1.2} speed={0.3} color="#FF6B00" />
      <GlowSphere position={[-4.5, -1, -3]} size={0.8} speed={0.5} color="#FFD700" />
      <GlowSphere position={[3, -2.5, -1]} size={0.5} speed={0.7} color="#FF8C00" />

      {/* Torus rings */}
      <TorusRing position={[3.5, 1, -3]} rotation={[0.5, 0, 0]} color="#FF6B00" />
      <TorusRing position={[-3.5, 0, -2]} rotation={[1, 0.5, 0]} color="#FFD700" />

      {/* Crystals */}
      {[
        [-2, 2, 0], [2.5, 2.5, -1], [-3, -1.5, 1],
        [1, -3, 0.5], [-1.5, 1.5, 1], [3, 0, -0.5],
        [-4, 2, -1], [0.5, 3, -2], [4.5, -2, -1],
      ].map((pos, i) => (
        <Crystal key={i} position={pos} />
      ))}

      {/* Particle field */}
      <ParticleField />
    </Canvas>
  );
}
