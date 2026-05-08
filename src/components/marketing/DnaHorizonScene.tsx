'use client';

import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Sparkles, Html, Instances, Instance } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   ULTRA-PREMIUM KINETIC DNA ENGINE (REFINED ZOOM & ROTATION)
   ═══════════════════════════════════════════════════════════════════ */

const METAL_COLOR = "#d0d0d0";
const GLOW_COLOR = "#00ffff";

function DNAStrandSegments({ points, explosionFactor, color }: { points: THREE.Vector3[], explosionFactor: number, color: string }) {
  const segmentsCount = points.length - 1;
  const scatterData = useMemo(() => {
    return Array.from({ length: segmentsCount }).map(() => ({
      direction: new THREE.Vector3((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12),
      rotation: new THREE.Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
    }));
  }, [segmentsCount]);

  return (
    <Instances range={segmentsCount}>
      <cylinderGeometry args={[0.3, 0.3, 1.2, 12]} />
      <meshPhysicalMaterial color={color} metalness={1} roughness={0.1} clearcoat={1} />
      {points.map((p, i) => {
        if (i === points.length - 1) return null;
        const nextP = points[i+1];
        const center = new THREE.Vector3().addVectors(p, nextP).multiplyScalar(0.5);
        const direction = new THREE.Vector3().subVectors(nextP, p);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
        return (
          <KineticSegment 
            key={`seg-${i}`}
            basePosition={center}
            baseQuaternion={quaternion}
            scatterDir={scatterData[i].direction}
            scatterRot={scatterData[i].rotation}
            explosionFactor={explosionFactor}
          />
        );
      })}
    </Instances>
  );
}

function KineticSegment({ basePosition, baseQuaternion, scatterDir, scatterRot, explosionFactor }: any) {
  const ref = useRef<any>();
  useFrame(() => {
    if (!ref.current) return;
    const currentPos = basePosition.clone().add(scatterDir.clone().multiplyScalar(explosionFactor));
    ref.current.position.copy(currentPos);
    const targetQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(scatterRot.x, scatterRot.y, scatterRot.z));
    ref.current.quaternion.copy(baseQuaternion).slerp(targetQuat, explosionFactor);
  });
  return <Instance ref={ref} />;
}

function DNAHelix({ organizers, onSelect, activeOrg }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const count = 60; 
  const length = 55;
  const radius = 6;
  const turns = 3;
  const [explosionFactor, setExplosionFactor] = useState(0);

  const helixData = useMemo(() => {
    const pointsA = [];
    const pointsB = [];
    const rungs = [];
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const angle = t * Math.PI * 2 * turns;
      const x = (t * length) - (length / 2);
      const y1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const y2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      const pA = new THREE.Vector3(x, y1, z1);
      const pB = new THREE.Vector3(x, y2, z2);
      pointsA.push(pA);
      pointsB.push(pB);
      if (i % 4 === 0) rungs.push({ pA, pB, id: i });
    }
    return { pointsA, pointsB, rungs };
  }, [count, length, radius, turns]);

  const nodes = useMemo(() => {
    return organizers.map((org: any, i: number) => {
      const t = (i + 0.5) / organizers.length;
      const idx = Math.floor(t * (count - 1));
      return { ...org, position: helixData.pointsA[idx] };
    });
  }, [organizers, helixData, count]);

  useEffect(() => {
    gsap.to({ val: explosionFactor }, {
      val: activeOrg ? 1 : 0,
      duration: 2.5,
      ease: "power3.inOut",
      onUpdate: function() { setExplosionFactor(this.targets()[0].val); }
    });
  }, [activeOrg]);

  useFrame((state) => {
    if (groupRef.current) {
      // SIGNIFICANTLY SLOWER ROTATION when detached/scattered
      const baseRotationSpeed = 0.15;
      const speedFactor = 1 - explosionFactor * 0.95; // 95% slower when exploded
      groupRef.current.rotation.x = state.clock.elapsedTime * (baseRotationSpeed * speedFactor);
    }
  });

  return (
    <>
      <group ref={groupRef}>
        <DNAStrandSegments points={helixData.pointsA} explosionFactor={explosionFactor} color={METAL_COLOR} />
        <DNAStrandSegments points={helixData.pointsB} explosionFactor={explosionFactor} color={METAL_COLOR} />

        {helixData.rungs.map((rung) => (
          <Rung key={rung.id} pA={rung.pA} pB={rung.pB} explosionFactor={explosionFactor} radius={radius} />
        ))}

        {nodes.map((node: any) => (
          <group key={node.id} position={node.position}>
            <Float speed={activeOrg ? 0 : 2} rotationIntensity={activeOrg ? 0 : 1} floatIntensity={activeOrg ? 0 : 0.5}>
              <mesh 
                onClick={(e) => { e.stopPropagation(); onSelect(node); }}
                onPointerOver={() => (document.body.style.cursor = 'pointer')}
                onPointerOut={() => (document.body.style.cursor = 'auto')}
              >
                <dodecahedronGeometry args={[2, 0]} />
                <meshPhysicalMaterial 
                  color={activeOrg?.id === node.id ? GLOW_COLOR : "#111"} 
                  emissive={activeOrg?.id === node.id ? GLOW_COLOR : "#002222"}
                  emissiveIntensity={activeOrg?.id === node.id ? 20 : 2}
                  metalness={1} roughness={0} transmission={0.6} thickness={2}
                  opacity={activeOrg && activeOrg.id !== node.id ? 0.05 : 1}
                  transparent
                />
              </mesh>
              
              {!activeOrg && (
                <Html distanceFactor={15} position={[0, 4, 0]} center>
                  <motion.div 
                    style={{
                      width: '55px',
                      height: '55px',
                      borderRadius: '50%',
                      border: `3px solid rgba(255,255,255,0.2)`,
                      overflow: 'hidden',
                      background: '#000',
                      pointerEvents: 'none'
                    }}
                  >
                    <img 
                      src={node.imageUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${node.organizerName}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      alt=""
                    />
                  </motion.div>
                </Html>
              )}
            </Float>
          </group>
        ))}
      </group>

      <HolographicCard activeOrg={activeOrg} onDismiss={() => onSelect(null)} />
    </>
  );
}

function HolographicCard({ activeOrg, onDismiss }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (!groupRef.current || !activeOrg) return;
    // Position card slightly further back or higher to avoid camera clipping
    groupRef.current.position.set(activeOrg.position.x, 3, 5); 
    groupRef.current.lookAt(camera.position);
  });

  return (
    <group ref={groupRef}>
      <Html center transform={false} distanceFactor={25}>
         <AnimatePresence>
           {activeOrg && (
             <motion.div
               initial={{ opacity: 0, scale: 0.8, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.8, y: 30 }}
               transition={{ duration: 0.5, ease: "circOut" }}
               style={{
                 width: '300px',
                 background: 'rgba(0,10,10,0.92)',
                 backdropFilter: 'blur(30px)',
                 border: `2px solid ${GLOW_COLOR}`,
                 padding: '25px',
                 color: '#fff',
                 borderRadius: '24px',
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 gap: '15px',
                 boxShadow: `0 0 60px ${GLOW_COLOR}44`,
                 pointerEvents: 'auto',
               }}
             >
               {/* Refined Mini Photo */}
               <div style={{
                 width: '110px',
                 height: '110px',
                 borderRadius: '50%',
                 border: `2px solid ${GLOW_COLOR}`,
                 overflow: 'hidden',
                 background: '#000',
                 position: 'relative'
               }}>
                  <img 
                    src={activeOrg.imageUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${activeOrg.organizerName}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    alt=""
                  />
                  <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 20px #000' }} />
                  <motion.div 
                    animate={{ y: [0, 110, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: GLOW_COLOR, opacity: 0.4 }}
                  />
               </div>

               <div style={{ textAlign: 'center' }}>
                 <h3 style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#fff', textTransform: 'uppercase' }}>{activeOrg.organizerName}</h3>
                 <p style={{ fontSize: '10px', color: GLOW_COLOR, letterSpacing: '0.4em', margin: '5px 0 20px 0', textTransform: 'uppercase', fontWeight: 800 }}>{activeOrg.role || 'CORE ARCHITECT'}</p>
                 
                 <button 
                   onClick={(e) => { e.stopPropagation(); onDismiss(); }}
                   style={{
                     background: 'transparent',
                     color: GLOW_COLOR,
                     border: `1px solid ${GLOW_COLOR}`,
                     padding: '10px 24px',
                     fontSize: '10px',
                     fontWeight: 900,
                     letterSpacing: '0.3em',
                     cursor: 'pointer',
                     borderRadius: '6px',
                     transition: 'all 0.3s'
                   }}
                 >
                   RE-ATTACH DNA
                 </button>
               </div>
             </motion.div>
           )}
         </AnimatePresence>
      </Html>
    </group>
  );
}

function Rung({ pA, pB, explosionFactor, radius }: any) {
  const ref = useRef<THREE.Mesh>(null);
  const scatterDir = useMemo(() => new THREE.Vector3((Math.random()-0.5)*20, (Math.random()-0.5)*20, (Math.random()-0.5)*20), []);
  const scatterRot = useMemo(() => new THREE.Vector3(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI), []);

  useFrame(() => {
    if (!ref.current) return;
    const center = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
    const targetPos = center.clone().add(scatterDir.clone().multiplyScalar(explosionFactor));
    ref.current.position.copy(targetPos);
    ref.current.rotation.set(scatterRot.x * explosionFactor, scatterRot.y * explosionFactor, Math.PI/2 + scatterRot.z * explosionFactor);
    ref.current.scale.set(1, 1, 1 - explosionFactor * 0.85);
  });

  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[0.08, 0.08, radius * 2, 8]} />
      <meshStandardMaterial color="#333" metalness={1} roughness={0.1} transparent opacity={1 - explosionFactor * 0.9} />
    </mesh>
  );
}

function CameraRig({ activeOrg }: any) {
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (activeOrg) {
      const targetPos = new THREE.Vector3().copy(activeOrg.position);
      // REFINED ZOOM: Back off the camera to ensure the hover doesn't disappear
      const camTarget = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z + 32); 
      gsap.to(camera.position, { x: camTarget.x, y: camTarget.y, z: camTarget.z, duration: 2.5, ease: "expo.out" });
      gsap.to(lookAtTarget.current, { x: targetPos.x, y: targetPos.y, z: targetPos.z, duration: 2.5, ease: "expo.out" });
    } else {
      gsap.to(camera.position, { x: 0, y: 0, z: 50, duration: 3, ease: "power3.inOut" });
      gsap.to(lookAtTarget.current, { x: 0, y: 0, z: 0, duration: 3 });
    }
  }, [activeOrg, camera]);

  useFrame(() => {
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}

export default function PostCreditsCinematic({ organizers }: { organizers: any[] }) {
  const [activeOrg, setActiveOrg] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayOrganizers = useMemo(() => {
    const list = organizers?.length ? [...organizers].slice(0, 8) : [];
    while (list.length < 8) {
      list.push({ id: `dummy-${list.length}`, organizerName: `Lead ${list.length + 1}`, role: "Core Architect" });
    }
    return list;
  }, [organizers]);

  if (!mounted) return <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 10000 }} />;

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 9999 }}>
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault fov={35} position={[0, 0, 50]} />
          <color attach="background" args={['#000000']} />
          
          <ambientLight intensity={0.5} />
          <pointLight position={[20, 20, 20]} intensity={1.5} />
          <pointLight position={[-20, -20, -20]} color={GLOW_COLOR} intensity={2.5} />
          
          <DNAHelix organizers={displayOrganizers} onSelect={setActiveOrg} activeOrg={activeOrg} />
          <CameraRig activeOrg={activeOrg} />
          
          <Sparkles count={activeOrg ? 500 : 200} scale={70} size={1} speed={0.2} color={GLOW_COLOR} />
          <Environment preset="night" />
          
          <EffectComposer multisampling={0}>
            <Bloom luminanceThreshold={1} intensity={2} mipmapBlur />
            <Vignette darkness={1.3} />
            <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      <div style={{ position: 'absolute', top: '60px', left: '60px', pointerEvents: 'none' }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <h2 style={{ color: '#fff', fontSize: '72px', fontWeight: 900, margin: 0, letterSpacing: '-0.04em', lineHeight: 0.85 }}>
            KRATOS <span style={{ color: GLOW_COLOR }}>2027</span>
          </h2>
          <div style={{ color: GLOW_COLOR, fontSize: '10px', letterSpacing: '1em', textTransform: 'uppercase', marginTop: '15px', fontWeight: 900 }}>KINETIC_OVERRIDE_ENABLED</div>
        </motion.div>
      </div>
    </div>
  );
}
