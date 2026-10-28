import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { TERROIR_REGIONS } from '../../data/coffeeData';
import { TerroirRegion } from '../../types';
import { MapPin, Sparkles, Compass } from 'lucide-react';

interface AromaTerroir3DProps {
  onSelectCoffee?: (originName: string) => void;
}

export const AromaTerroir3D: React.FC<AromaTerroir3DProps> = ({ onSelectCoffee }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<TerroirRegion>(TERROIR_REGIONS[0]);

  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.2, y: 0 });
  const globeGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 1.2, 4.2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;

    // Ambient and point lighting
    const ambLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xd4af37, 2.5);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x733a22, 2.0, 10);
    rimLight.position.set(-3, -2, -2);
    scene.add(rimLight);

    // Globe Group
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // 1. Central Ethereal Aroma Core Sphere
    const coreGeo = new THREE.SphereGeometry(1.4, 32, 24);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x22130b,
      roughness: 0.4,
      metalness: 0.3,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const coreSphere = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreSphere);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(1.2, 24, 20);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x543522,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.6,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerSphere);

    // 2. Latitude & Longitude Orbital Brass Rings
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xc99a55,
      metalness: 0.8,
      roughness: 0.2,
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.012, 8, 48), ringMat);
    ring1.rotation.x = Math.PI / 2;
    globeGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.58, 0.012, 8, 48), ringMat);
    ring2.rotation.y = Math.PI / 4;
    globeGroup.add(ring2);

    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.012, 8, 48), ringMat);
    ring3.rotation.x = Math.PI / 3;
    globeGroup.add(ring3);

    // 3. Ethiopian Terroir Region Markers positioned around the sphere
    const markers: THREE.Mesh[] = [];
    TERROIR_REGIONS.forEach((region, idx) => {
      const angle = (idx / TERROIR_REGIONS.length) * Math.PI * 2;
      const phi = (Math.PI / 4) + (idx % 2 === 0 ? 0.25 : -0.2);
      const r = 1.45;

      const x = r * Math.sin(phi) * Math.cos(angle);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(angle);

      // Marker beacon
      const markerGeo = new THREE.SphereGeometry(0.065, 12, 10);
      const markerMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(region.color),
        emissive: new THREE.Color(region.color),
        emissiveIntensity: 0.6,
        metalness: 0.5,
        roughness: 0.2,
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(x, y, z);
      globeGroup.add(marker);
      markers.push(marker);

      // Connecting luminous beam to center
      const beamGeo = new THREE.CylinderGeometry(0.008, 0.008, r, 6);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0xc99a55,
        transparent: true,
        opacity: 0.35,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(x / 2, y / 2, z / 2);
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(x, y, z).normalize());
      globeGroup.add(beam);
    });

    // 4. Orbiting Flavor Particles (Jasmine, Citrus, Berry sparkles)
    const particleCount = 45;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const rad = 1.7 + Math.random() * 0.45;
      pPos[i * 3 + 0] = rad * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = rad * Math.cos(phi);
      pPos[i * 3 + 2] = rad * Math.sin(phi) * Math.sin(theta);
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0xdfb679,
      transparent: true,
      opacity: 0.75,
    });
    const flavorStars = new THREE.Points(pGeo, pMat);
    globeGroup.add(flavorStars);

    // Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsed = clock.getElapsedTime();
      controls.update();

      // Slow orbital dance
      ring1.rotation.z = elapsed * 0.12;
      ring3.rotation.y = elapsed * 0.08;
      flavorStars.rotation.y = elapsed * 0.05;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };
    tick();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      controls.dispose();
      renderer.dispose();
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  const handleSelectRegion = (region: TerroirRegion) => {
    setSelectedRegion(region);
    if (onSelectCoffee) {
      onSelectCoffee(region.name);
    }
  };

  return (
    <div className="w-full bg-[#20150e] rounded-2xl border border-[#c99a55]/20 overflow-hidden shadow-2xl p-6 md:p-8">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Left: 3D Aroma Globe */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="relative w-full max-w-[420px] aspect-square rounded-2xl overflow-hidden bg-radial from-[#2d1b12] to-[#160c07] border border-white/5 flex items-center justify-center">
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 text-[11px] text-[#dfb679] bg-black/60 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-sm">
              <Compass className="w-3.5 h-3.5 text-[#c99a55]" />
              <span>3D Interactive Terroir Orbit</span>
            </div>
          </div>
          <p className="text-xs text-[#a89a8c] mt-2.5 text-center">
            Drag to rotate the 3D Ethiopian Coffee Terroir Sphere
          </p>
        </div>

        {/* Right: Interactive Region Cards & Flavor Profiles */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#c99a55] uppercase">
            <span>Highland Provenance</span>
            <span aria-hidden="true">·</span>
            <span>Ethiopian Terroir</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-serif text-white tracking-tight mt-1 mb-3">
            Flavor Profiles of the Highlands
          </h3>

          <p className="text-sm text-[#d4c7ba] mb-5 leading-relaxed">
            Every Ethiopian micro-region possesses a distinct microclimate, soil composition, and heritage varietal. Click a region to explore its tasting notes and altitude.
          </p>

          {/* Region Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
            {TERROIR_REGIONS.map((region) => {
              const isSelected = selectedRegion.id === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => handleSelectRegion(region)}
                  className={`flex flex-col text-left p-2.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-[#543522] border-[#c99a55] text-white shadow-md'
                      : 'bg-black/30 border-white/10 text-[#d4c7ba] hover:bg-black/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs">{region.name}</span>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: region.color }}
                    />
                  </div>
                  <span className="text-[10px] text-[#dfb679] mt-0.5">{region.altitude}</span>
                </button>
              );
            })}
          </div>

          {/* Active Region Feature Card */}
          <div className="p-5 rounded-xl bg-black/40 border border-[#c99a55]/30">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-serif text-white font-semibold flex items-center gap-2">
                  <span>{selectedRegion.name}</span>
                  <span className="text-xs font-sans px-2 py-0.5 rounded bg-[#c99a55]/20 text-[#dfb679] border border-[#c99a55]/30">
                    {selectedRegion.altitude}
                  </span>
                </h4>
                <div className="text-xs text-[#a89a8c] mt-0.5">
                  Harvest: <span className="text-neutral-200">{selectedRegion.harvest}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-[#dfb679] bg-black/60 px-2.5 py-1 rounded">
                <Sparkles className="w-3.5 h-3.5 text-[#c99a55]" />
                <span>Heirloom Arabica</span>
              </div>
            </div>

            <p className="text-xs text-[#d4c7ba] mt-3 leading-relaxed">
              {selectedRegion.description}
            </p>

            {/* Tasting Notes Chips */}
            <div className="mt-4">
              <span className="text-[11px] uppercase tracking-wider text-[#dfb679] font-medium block mb-2">
                Aromatics & Tasting Notes
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedRegion.notes.map((note, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-[#281a13] text-[#f8f3eb] border border-white/10 font-medium"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
