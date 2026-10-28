import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ClayFinish, CeremonyRound, CameraPreset } from '../../types';
import { ceremonyAudio } from '../../utils/audioSynthesis';
import { Volume2, VolumeX, Eye, Flame, Coffee, Sparkles, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

interface EthiopianJebenaSceneProps {
  className?: string;
  isHeroPreview?: boolean;
  onExploreMenu?: () => void;
  onBookCeremony?: () => void;
}

// Reusable math helpers outside animation loop to prevent GC pauses
const _vec3 = new THREE.Vector3();
const _targetCam = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();

export const EthiopianJebenaScene: React.FC<EthiopianJebenaSceneProps> = ({
  className = '',
  isHeroPreview = false,
  onExploreMenu,
  onBookCeremony,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Scene interactive parts refs
  const jebenaGroupRef = useRef<THREE.Group | null>(null);
  const neckPartRef = useRef<THREE.Mesh | null>(null);
  const stopperPartRef = useRef<THREE.Mesh | null>(null);
  const spoutPartRef = useRef<THREE.Mesh | null>(null);
  const sini1Ref = useRef<THREE.Group | null>(null);
  const sini2Ref = useRef<THREE.Group | null>(null);
  const steamParticlesRef = useRef<THREE.Points | null>(null);
  const pourStreamRef = useRef<THREE.Mesh | null>(null);
  const brazierGlowRef = useRef<THREE.PointLight | null>(null);
  const beansMeshRef = useRef<THREE.InstancedMesh | null>(null);

  // Interactive UI state
  const [activeRound, setActiveRound] = useState<CeremonyRound>('abol');
  const [clayFinish, setClayFinish] = useState<ClayFinish>('obsidian');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('cinematic');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [isRoastingActive, setIsRoastingActive] = useState<boolean>(false);
  const [isPouringActive, setIsPouringActive] = useState<boolean>(false);
  const [explodedSlider, setExplodedSlider] = useState<number>(0);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [activeViewMode, setActiveViewMode] = useState<'ceremony' | 'inspect' | 'roast'>('ceremony');

  // Animation values stored in refs for tick loop
  const animStateRef = useRef({
    pourTime: 0,
    isPouring: false,
    isRoasting: false,
    explodedVal: 0,
    targetCamPos: new THREE.Vector3(0, 1.8, 3.8),
    targetLookPos: new THREE.Vector3(0, 0.4, 0),
    clayFinish: 'obsidian' as ClayFinish,
    activeRound: 'abol' as CeremonyRound,
  });

  // Sync state to anim ref
  useEffect(() => {
    animStateRef.current.isPouring = isPouringActive;
    if (isPouringActive) {
      ceremonyAudio.startPourSound();
    } else {
      ceremonyAudio.stopPourSound();
    }
  }, [isPouringActive]);

  useEffect(() => {
    animStateRef.current.isRoasting = isRoastingActive;
    if (isRoastingActive) {
      ceremonyAudio.startRoastCrackle();
    } else {
      ceremonyAudio.stopRoastCrackle();
    }
  }, [isRoastingActive]);

  useEffect(() => {
    animStateRef.current.explodedVal = explodedSlider;
  }, [explodedSlider]);

  useEffect(() => {
    animStateRef.current.clayFinish = clayFinish;
    updateClayMaterials(clayFinish);
  }, [clayFinish]);

  useEffect(() => {
    animStateRef.current.activeRound = activeRound;
    ceremonyAudio.playChime(activeRound === 'abol' ? 523.25 : activeRound === 'tona' ? 587.33 : 659.25);
  }, [activeRound]);

  // Set camera target positions when preset changes
  useEffect(() => {
    if (cameraPreset === 'cinematic') {
      animStateRef.current.targetCamPos.set(0.2, 1.6, 3.6);
      animStateRef.current.targetLookPos.set(0, 0.4, 0);
    } else if (cameraPreset === 'sini') {
      animStateRef.current.targetCamPos.set(0.9, 0.9, 1.6);
      animStateRef.current.targetLookPos.set(0.7, 0.35, 0.1);
    } else if (cameraPreset === 'spout') {
      animStateRef.current.targetCamPos.set(-1.2, 1.4, 1.8);
      animStateRef.current.targetLookPos.set(-0.2, 0.7, 0);
    } else if (cameraPreset === 'rekebot') {
      animStateRef.current.targetCamPos.set(0, 3.2, 1.8);
      animStateRef.current.targetLookPos.set(0, 0.1, 0);
    }
  }, [cameraPreset]);

  // Procedural pottery pattern texture
  const createPotteryPatternTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base background dark clay tint
    ctx.fillStyle = '#1e140e';
    ctx.fillRect(0, 0, 512, 512);

    // Traditional etched geometric diamond & zig-zag bands
    ctx.strokeStyle = '#c99a55';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#c99a55';

    // Horizontal guidelines
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(512, 200);
    ctx.moveTo(0, 240);
    ctx.lineTo(512, 240);
    ctx.moveTo(0, 280);
    ctx.lineTo(512, 280);
    ctx.stroke();

    // Etched chevron/diamond chain
    for (let x = 0; x < 512; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 240);
      ctx.lineTo(x + 16, 210);
      ctx.lineTo(x + 32, 240);
      ctx.lineTo(x + 16, 270);
      ctx.closePath();
      ctx.stroke();

      // Center dot
      ctx.beginPath();
      ctx.arc(x + 16, 240, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 1);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  const updateClayMaterials = (finish: ClayFinish) => {
    if (!jebenaGroupRef.current) return;

    jebenaGroupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.name === 'jebena_clay') {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (finish === 'obsidian') {
            mat.color.setHex(0x1a110c);
            mat.roughness = 0.55;
            mat.metalness = 0.12;
          } else if (finish === 'terracotta') {
            mat.color.setHex(0x733a22);
            mat.roughness = 0.75;
            mat.metalness = 0.05;
          } else if (finish === 'gold_accent') {
            mat.color.setHex(0x2d1c14);
            mat.roughness = 0.35;
            mat.metalness = 0.45;
          }
        }
      }
    });
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL to balance performance & quality
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Scene & Environment Map (Mandatory RoomEnvironment)
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Subtle atmospheric fog matched to dark espresso tones
    scene.fog = new THREE.FogExp2(0x1a100b, 0.075);

    // 3. Camera Setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0.2, 1.6, 3.6);
    cameraRef.current = camera;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.4;
    controls.maxDistance = 6.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // do not go below table
    controls.target.set(0, 0.45, 0);
    controlsRef.current = controls;

    // 5. Studio 3-Point Lighting Rig
    // Warm Key Light (Directional, casts soft shadow)
    const keyLight = new THREE.DirectionalLight(0xffecd0, 2.8);
    keyLight.position.set(2.5, 3.8, 2.2);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 10;
      keyLight.shadow.camera.left = -2;
      keyLight.shadow.camera.right = 2;
      keyLight.shadow.camera.top = 2;
      keyLight.shadow.camera.bottom = -2;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // Cool/Warm Hemisphere Fill Light
    const hemiLight = new THREE.HemisphereLight(0xfff3df, 0x24160f, 1.2);
    hemiLight.position.set(0, 5, 0);
    scene.add(hemiLight);

    // Warm Golden Rim Light
    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.0);
    rimLight.position.set(-3, 2.5, -2);
    scene.add(rimLight);

    // Brazier embers point light underneath
    const embersLight = new THREE.PointLight(0xff5511, 0.8, 3.0);
    embersLight.position.set(0, 0.1, 0);
    scene.add(embersLight);
    brazierGlowRef.current = embersLight;

    // 6. Base Rekebot (Traditional Ethiopian Coffee Ceremony Table / Tray)
    const rekebotGroup = new THREE.Group();
    // Octagonal table top
    const tableTopGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.08, 12);
    const tableTopMat = new THREE.MeshStandardMaterial({
      color: 0x22150e,
      roughness: 0.4,
      metalness: 0.15,
    });
    const tableTopMesh = new THREE.Mesh(tableTopGeo, tableTopMat);
    tableTopMesh.position.y = 0.04;
    tableTopMesh.receiveShadow = !isSoftwareGl;
    rekebotGroup.add(tableTopMesh);

    // Ornate brass inlay rim
    const brassRimGeo = new THREE.TorusGeometry(1.62, 0.02, 8, 32);
    const brassRimMat = new THREE.MeshStandardMaterial({
      color: 0xc99a55,
      roughness: 0.25,
      metalness: 0.85,
    });
    const brassRim = new THREE.Mesh(brassRimGeo, brassRimMat);
    brassRim.rotation.x = Math.PI / 2;
    brassRim.position.y = 0.08;
    rekebotGroup.add(brassRim);

    // Table legs / carved base
    const legGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.35, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x160d09, roughness: 0.6 });
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(Math.cos(angle) * 1.3, -0.14, Math.sin(angle) * 1.3);
      rekebotGroup.add(leg);
    }

    // Contact shadow grounding plane
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x070403,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.001;
    scene.add(shadowPlane);
    scene.add(rekebotGroup);

    // 7. Procedural Multi-Part Ethiopian Jebena (ጀበና)
    const jebenaGroup = new THREE.Group();
    jebenaGroup.position.set(0, 0.08, 0); // flush on table top
    jebenaGroupRef.current = jebenaGroup;
    scene.add(jebenaGroup);

    // Pottery texture
    const potteryPatternTex = createPotteryPatternTexture();

    // Mat 1: Earthenware Clay Material
    const clayMat = new THREE.MeshStandardMaterial({
      color: 0x1a110c,
      roughness: 0.55,
      metalness: 0.12,
      map: potteryPatternTex,
    });

    // Part 1: Spherical Clay Belly Body (Lathed profile with flat bottom seat)
    const bellyPoints: THREE.Vector2[] = [];
    bellyPoints.push(new THREE.Vector2(0, 0.02));
    bellyPoints.push(new THREE.Vector2(0.25, 0.05));
    bellyPoints.push(new THREE.Vector2(0.48, 0.22));
    bellyPoints.push(new THREE.Vector2(0.55, 0.42));
    bellyPoints.push(new THREE.Vector2(0.46, 0.65));
    bellyPoints.push(new THREE.Vector2(0.24, 0.78));
    bellyPoints.push(new THREE.Vector2(0.14, 0.88));
    const bellyGeo = new THREE.LatheGeometry(bellyPoints, 36);
    const bellyMesh = new THREE.Mesh(bellyGeo, clayMat);
    bellyMesh.name = 'jebena_clay';
    bellyMesh.castShadow = !isSoftwareGl;
    bellyMesh.receiveShadow = !isSoftwareGl;
    jebenaGroup.add(bellyMesh);

    // Part 2: Woven Straw Ring Mat (`Wurcho` / `Matat`) supporting the round bottom
    const strawMatGeo = new THREE.TorusGeometry(0.28, 0.065, 12, 32);
    const strawMatMat = new THREE.MeshStandardMaterial({
      color: 0xc19d65,
      roughness: 0.85,
      metalness: 0.05,
    });
    const strawMatMesh = new THREE.Mesh(strawMatGeo, strawMatMat);
    strawMatMesh.rotation.x = Math.PI / 2;
    strawMatMesh.position.y = 0.06;
    strawMatMesh.castShadow = !isSoftwareGl;
    jebenaGroup.add(strawMatMesh);

    // Part 3: Elongated Slender Neck with Fluted Rim (Separable in Exploded view)
    const neckPoints: THREE.Vector2[] = [];
    neckPoints.push(new THREE.Vector2(0.13, 0.86));
    neckPoints.push(new THREE.Vector2(0.12, 1.05));
    neckPoints.push(new THREE.Vector2(0.11, 1.25));
    neckPoints.push(new THREE.Vector2(0.14, 1.40));
    neckPoints.push(new THREE.Vector2(0.19, 1.48)); // trumpet flare lip
    neckPoints.push(new THREE.Vector2(0.16, 1.50));
    neckPoints.push(new THREE.Vector2(0.10, 1.48));
    neckPoints.push(new THREE.Vector2(0.08, 1.35));
    const neckGeo = new THREE.LatheGeometry(neckPoints, 32);
    const neckMesh = new THREE.Mesh(neckGeo, clayMat);
    neckMesh.name = 'jebena_clay';
    neckMesh.castShadow = !isSoftwareGl;
    jebenaGroup.add(neckMesh);
    neckPartRef.current = neckMesh;

    // Part 4: Traditional Woven Straw Stopper (`Kifto`)
    const stopperGeo = new THREE.ConeGeometry(0.09, 0.22, 16);
    const stopperMat = new THREE.MeshStandardMaterial({
      color: 0xa87e43,
      roughness: 0.9,
      metalness: 0.05,
    });
    const stopperMesh = new THREE.Mesh(stopperGeo, stopperMat);
    stopperMesh.position.set(0, 1.54, 0);
    stopperMesh.rotation.x = Math.PI;
    stopperMesh.castShadow = !isSoftwareGl;
    jebenaGroup.add(stopperMesh);
    stopperPartRef.current = stopperMesh;

    // Stopper decorative horsehair / straw tuft on top
    const tuftGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.12, 8);
    const tuftMesh = new THREE.Mesh(tuftGeo, stopperMat);
    tuftMesh.position.set(0, 1.62, 0);
    stopperMesh.add(tuftMesh);

    // Part 5: Traditional Curved Spout
    const spoutCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.35, 0.48, 0),
      new THREE.Vector3(0.58, 0.62, 0),
      new THREE.Vector3(0.72, 0.85, 0),
      new THREE.Vector3(0.68, 1.05, 0),
    ]);
    const spoutGeo = new THREE.TubeGeometry(spoutCurve, 24, 0.045, 12, false);
    const spoutMesh = new THREE.Mesh(spoutGeo, clayMat);
    spoutMesh.name = 'jebena_clay';
    spoutMesh.castShadow = !isSoftwareGl;
    jebenaGroup.add(spoutMesh);
    spoutPartRef.current = spoutMesh;

    // Part 6: Clay Handle (Looped from neck to mid belly)
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.13, 1.15, 0),
      new THREE.Vector3(-0.46, 0.95, 0),
      new THREE.Vector3(-0.52, 0.65, 0),
      new THREE.Vector3(-0.35, 0.42, 0),
    ]);
    const handleGeo = new THREE.TubeGeometry(handleCurve, 24, 0.04, 12, false);
    const handleMesh = new THREE.Mesh(handleGeo, clayMat);
    handleMesh.name = 'jebena_clay';
    handleMesh.castShadow = !isSoftwareGl;
    jebenaGroup.add(handleMesh);

    // 8. Porcelain Sini (ሲኒ) Cups with Gold & Crimson Trims
    const createSiniCup = (offsetX: number, offsetZ: number) => {
      const siniGroup = new THREE.Group();
      siniGroup.position.set(offsetX, 0.08, offsetZ);

      // Porcelain body
      const cupPoints: THREE.Vector2[] = [];
      cupPoints.push(new THREE.Vector2(0.01, 0.02));
      cupPoints.push(new THREE.Vector2(0.08, 0.02));
      cupPoints.push(new THREE.Vector2(0.12, 0.08));
      cupPoints.push(new THREE.Vector2(0.16, 0.18));
      cupPoints.push(new THREE.Vector2(0.18, 0.24));
      cupPoints.push(new THREE.Vector2(0.17, 0.24));
      cupPoints.push(new THREE.Vector2(0.14, 0.16));
      cupPoints.push(new THREE.Vector2(0.08, 0.06));
      cupPoints.push(new THREE.Vector2(0.02, 0.04));
      const cupGeo = new THREE.LatheGeometry(cupPoints, 24);
      const cupMat = new THREE.MeshStandardMaterial({
        color: 0xfaf8f5,
        roughness: 0.15,
        metalness: 0.1,
      });
      const cupMesh = new THREE.Mesh(cupGeo, cupMat);
      cupMesh.castShadow = !isSoftwareGl;
      siniGroup.add(cupMesh);

      // Gold rim line on top
      const rimGoldGeo = new THREE.TorusGeometry(0.175, 0.007, 8, 24);
      const rimGoldMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.2,
        metalness: 0.9,
      });
      const rimGold = new THREE.Mesh(rimGoldGeo, rimGoldMat);
      rimGold.rotation.x = Math.PI / 2;
      rimGold.position.y = 0.24;
      siniGroup.add(rimGold);

      // Brewed Buna Liquid Surface inside
      const coffeeDiscGeo = new THREE.CircleGeometry(0.155, 20);
      const coffeeDiscMat = new THREE.MeshStandardMaterial({
        color: 0x140a05,
        roughness: 0.1,
        metalness: 0.3,
      });
      const coffeeDisc = new THREE.Mesh(coffeeDiscGeo, coffeeDiscMat);
      coffeeDisc.rotation.x = -Math.PI / 2;
      coffeeDisc.position.y = 0.21;
      siniGroup.add(coffeeDisc);

      // Tena'adam (green rue herb sprig floating)
      const herbGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.07, 6);
      const herbMat = new THREE.MeshStandardMaterial({ color: 0x3d7032, roughness: 0.6 });
      const herb = new THREE.Mesh(herbGeo, herbMat);
      herb.rotation.z = Math.PI / 4;
      herb.position.set(0.03, 0.218, 0.02);
      siniGroup.add(herb);

      return siniGroup;
    };

    const sini1 = createSiniCup(0.85, 0.1);
    const sini2 = createSiniCup(0.65, 0.55);
    sini1Ref.current = sini1;
    sini2Ref.current = sini2;
    scene.add(sini1);
    scene.add(sini2);

    // 9. Scattered 3D Roasted Coffee Beans on Rekebot Tray (InstancedMesh for peak performance)
    const beanCount = 42;
    const beanGeo = new THREE.SphereGeometry(0.035, 12, 10);
    beanGeo.scale(1.0, 0.65, 1.45); // bean oval shape
    const beanMat = new THREE.MeshStandardMaterial({
      color: 0x2b170e,
      roughness: 0.38,
      metalness: 0.15,
    });
    const beansMesh = new THREE.InstancedMesh(beanGeo, beanMat, beanCount);
    beansMesh.receiveShadow = !isSoftwareGl;
    beansMesh.castShadow = !isSoftwareGl;

    const dummyMatrix = new THREE.Matrix4();
    const dummyPos = new THREE.Vector3();
    const dummyQuat = new THREE.Quaternion();
    const dummyScale = new THREE.Vector3();

    for (let i = 0; i < beanCount; i++) {
      // Scatter in a natural crescent around the Rekebot
      const radius = 0.65 + Math.random() * 0.75;
      const angle = (i / beanCount) * Math.PI * 1.8 - 0.2;
      dummyPos.set(Math.cos(angle) * radius, 0.09, Math.sin(angle) * radius);
      dummyQuat.setFromEuler(
        new THREE.Euler(
          Math.random() * 0.3,
          Math.random() * Math.PI * 2,
          Math.random() * 0.3
        )
      );
      const s = 0.85 + Math.random() * 0.35;
      dummyScale.set(s, s, s);
      dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
      beansMesh.setMatrixAt(i, dummyMatrix);
    }
    beansMesh.instanceMatrix.needsUpdate = true;
    beansMesh.computeBoundingSphere();
    scene.add(beansMesh);
    beansMeshRef.current = beansMesh;

    // 10. Procedural Volumetric Steam / Frankincense Smoke Particles
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleLife = new Float32Array(particleCount);
    const particleSpeed = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 0.15;
      particlePositions[i * 3 + 1] = 1.45 + Math.random() * 0.8;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
      particleLife[i] = Math.random();
      particleSpeed[i] = 0.008 + Math.random() * 0.009;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle sprite using procedural soft radial canvas texture
    const smokeCanvas = document.createElement('canvas');
    smokeCanvas.width = 64;
    smokeCanvas.height = 64;
    const sCtx = smokeCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    grad.addColorStop(0.4, 'rgba(235, 225, 210, 0.45)');
    grad.addColorStop(1, 'rgba(200, 190, 180, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 64, 64);
    const smokeTexture = new THREE.CanvasTexture(smokeCanvas);
    smokeTexture.colorSpace = THREE.SRGBColorSpace;

    const particleMat = new THREE.PointsMaterial({
      size: 0.22,
      map: smokeTexture,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const steamPoints = new THREE.Points(particleGeo, particleMat);
    scene.add(steamPoints);
    steamParticlesRef.current = steamPoints;

    // 11. Ceremonial Pour Stream Curve & Mesh
    // CatmullRomCurve flowing from spout (approx 0.68, 1.13, 0) downward into sini cup (0.85, 0.22, 0.1)
    const pourCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.68, 1.05, 0),
      new THREE.Vector3(0.76, 0.82, 0.04),
      new THREE.Vector3(0.82, 0.52, 0.08),
      new THREE.Vector3(0.85, 0.22, 0.1),
    ]);
    const pourGeo = new THREE.TubeGeometry(pourCurve, 20, 0.016, 8, false);
    const pourMat = new THREE.MeshStandardMaterial({
      color: 0x180b06,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0,
    });
    const pourMesh = new THREE.Mesh(pourGeo, pourMat);
    scene.add(pourMesh);
    pourStreamRef.current = pourMesh;

    // 12. Animation Loop with Pacing for Software WebGL
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      const dt = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Camera lerp towards target
      if (cameraRef.current && controlsRef.current) {
        _targetCam.copy(animStateRef.current.targetCamPos);
        _targetLookAt.copy(animStateRef.current.targetLookPos);

        cameraRef.current.position.lerp(_targetCam, 0.04);
        controlsRef.current.target.lerp(_targetLookAt, 0.05);
        controlsRef.current.update();
      }

      // Jebena gentle breathing rotation in cinematic mode
      if (jebenaGroupRef.current && !animStateRef.current.isPouring && cameraPreset === 'cinematic') {
        jebenaGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.2) * 0.08;
      }

      // Exploded View kinematics (neck slides upward, stopper lifts, spout separates)
      const exp = animStateRef.current.explodedVal;
      if (neckPartRef.current) {
        neckPartRef.current.position.y = exp * 0.45;
      }
      if (stopperPartRef.current) {
        stopperPartRef.current.position.y = 1.54 + exp * 0.85;
      }
      if (spoutPartRef.current) {
        spoutPartRef.current.position.x = exp * 0.35;
      }

      // Roasting flicker and bean color shift
      if (brazierGlowRef.current) {
        if (animStateRef.current.isRoasting) {
          brazierGlowRef.current.intensity = 1.8 + Math.sin(elapsedTime * 14) * 0.8;
          if (beansMeshRef.current) {
            // Roasting turns beans from green/tan to dark rich chocolate
            const roastCycle = (Math.sin(elapsedTime * 0.8) + 1) / 2;
            const rColor = new THREE.Color().lerpColors(
              new THREE.Color(0x7a6b42), // green unroasted
              new THREE.Color(0x1a0f0a), // dark roasted
              roastCycle
            );
            (beansMeshRef.current.material as THREE.MeshStandardMaterial).color.copy(rColor);
          }
        } else {
          brazierGlowRef.current.intensity = 0.6 + Math.sin(elapsedTime * 2) * 0.2;
        }
      }

      // Pouring simulation: Jebena tilts forward, stream appears, cup foam expands
      if (pourStreamRef.current && jebenaGroupRef.current) {
        const mat = pourStreamRef.current.material as THREE.MeshStandardMaterial;
        if (animStateRef.current.isPouring) {
          // Tilt jebena
          jebenaGroupRef.current.rotation.z = THREE.MathUtils.damp(
            jebenaGroupRef.current.rotation.z,
            -0.42,
            4,
            dt
          );
          mat.opacity = THREE.MathUtils.damp(mat.opacity, 0.95, 8, dt);
        } else {
          jebenaGroupRef.current.rotation.z = THREE.MathUtils.damp(
            jebenaGroupRef.current.rotation.z,
            0,
            4,
            dt
          );
          mat.opacity = THREE.MathUtils.damp(mat.opacity, 0, 10, dt);
        }
      }

      // Steam & Smoke Particle physics
      if (steamParticlesRef.current) {
        const posAttr = steamParticlesRef.current.geometry.attributes.position;
        const arr = posAttr.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          arr[i * 3 + 1] += particleSpeed[i] * (animStateRef.current.isRoasting ? 1.8 : 1.0);
          arr[i * 3 + 0] += Math.sin(elapsedTime * 2 + i) * 0.0015;
          arr[i * 3 + 2] += Math.cos(elapsedTime * 1.5 + i) * 0.0015;

          // Reset particle if too high
          if (arr[i * 3 + 1] > 2.8) {
            arr[i * 3 + 0] = (Math.random() - 0.5) * 0.12;
            arr[i * 3 + 1] = 1.45;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
          }
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    // Pre-warm shaders
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    tick();

    // Window resize handler
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
      clearTimeout(frameId);
      controls.dispose();
      renderer.dispose();
      ceremonyAudio.stopPourSound();
      ceremonyAudio.stopRoastCrackle();
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  const toggleAudio = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    ceremonyAudio.setMuted(nextMuted);
  };

  const handlePourToggle = () => {
    setIsPouringActive((prev) => !prev);
    if (!isPouringActive && isAudioMuted) {
      setIsAudioMuted(false);
      ceremonyAudio.setMuted(false);
    }
  };

  const handleRoastToggle = () => {
    setIsRoastingActive((prev) => !prev);
    if (!isRoastingActive && isAudioMuted) {
      setIsAudioMuted(false);
      ceremonyAudio.setMuted(false);
    }
  };

  return (
    <div className={`relative w-full overflow-hidden bg-gradient-to-b from-[#1b110b] via-[#241710] to-[#160d08] text-white select-none ${className}`}>
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-full min-h-[540px] md:min-h-[640px] cursor-grab active:cursor-grabbing"
        title="Click and drag to rotate the Jebena. Scroll to zoom."
      />

      {/* Top Left Spec Badge & Context */}
      <div className="absolute top-6 left-6 z-10 pointer-events-auto max-w-xs md:max-w-sm">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#dfb679] uppercase">
          <span>Ethiopian Coffee Ceremony 3D</span>
          <span aria-hidden="true">·</span>
          <span>ጀበና</span>
        </div>
        <h3 className="text-xl md:text-2xl font-serif text-white tracking-tight mt-1">
          The Craft of the Jebena
        </h3>
        <p className="text-xs text-[#d4c7ba] mt-1.5 leading-relaxed hidden sm:block">
          Handcrafted spherical earthenware pot with etched geometric motifs, long slender pouring neck, and straw woven mat base. Pours the ancient heirloom Buna.
        </p>

        {/* 3 Ceremonial Rounds Selector */}
        <div className="mt-3 flex items-center gap-1.5 p-1 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 w-fit">
          <button
            onClick={() => setActiveRound('abol')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              activeRound === 'abol' ? 'bg-[#c99a55] text-[#1a100b] font-bold shadow' : 'text-[#e5dcd3] hover:text-white'
            }`}
          >
            1. Abol (አቦል)
          </button>
          <button
            onClick={() => setActiveRound('tona')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              activeRound === 'tona' ? 'bg-[#c99a55] text-[#1a100b] font-bold shadow' : 'text-[#e5dcd3] hover:text-white'
            }`}
          >
            2. Tona (ቶና)
          </button>
          <button
            onClick={() => setActiveRound('bereka')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              activeRound === 'bereka' ? 'bg-[#c99a55] text-[#1a100b] font-bold shadow' : 'text-[#e5dcd3] hover:text-white'
            }`}
          >
            3. Bereka (በረካ)
          </button>
        </div>
      </div>

      {/* Top Right Quick Actions (Audio Mute & Reset) */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
        <button
          onClick={toggleAudio}
          className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-white hover:bg-black/80 transition-colors shadow-lg"
          title={isAudioMuted ? 'Unmute procedural audio' : 'Mute audio'}
          aria-label={isAudioMuted ? 'Unmute procedural audio' : 'Mute audio'}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-[#dfb679]" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        <button
          onClick={() => {
            setExplodedSlider(0);
            setIsPouringActive(false);
            setIsRoastingActive(false);
            setCameraPreset('cinematic');
            if (controlsRef.current) {
              controlsRef.current.reset();
            }
          }}
          className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-white hover:bg-black/80 transition-colors shadow-lg"
          title="Reset 3D camera and view"
          aria-label="Reset 3D view"
        >
          <RotateCcw className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Collapsible Unified Bottom Control Dock (Strict Three.js Skill layout) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-3xl pointer-events-auto">
        {/* Toggle Bar */}
        <div className="flex justify-center -mb-2 relative z-30">
          <button
            onClick={() => setIsDockCollapsed((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-t-lg text-[11px] font-medium text-[#dfb679] hover:text-white transition-colors"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Show 3D Studio Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Zen Mode / Hide Controls</span>
              </>
            )}
          </button>
        </div>

        {/* Dock Card */}
        <div
          className={`transition-all duration-300 ease-out bg-[#1e130c]/90 backdrop-blur-xl border border-[#c99a55]/25 rounded-xl shadow-2xl p-3 md:p-4 ${
            isDockCollapsed ? 'opacity-0 translate-y-16 pointer-events-none' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center text-xs">
            {/* 1. Camera View Presets */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-semibold text-[#c99a55] tracking-wider">
                Perspective
              </span>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => setCameraPreset('cinematic')}
                  className={`px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${
                    cameraPreset === 'cinematic' ? 'bg-[#c99a55] text-black font-semibold' : 'bg-black/40 text-neutral-300 hover:text-white'
                  }`}
                >
                  Cinematic
                </button>
                <button
                  onClick={() => setCameraPreset('sini')}
                  className={`px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${
                    cameraPreset === 'sini' ? 'bg-[#c99a55] text-black font-semibold' : 'bg-black/40 text-neutral-300 hover:text-white'
                  }`}
                >
                  Sini Cup
                </button>
                <button
                  onClick={() => setCameraPreset('spout')}
                  className={`px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${
                    cameraPreset === 'spout' ? 'bg-[#c99a55] text-black font-semibold' : 'bg-black/40 text-neutral-300 hover:text-white'
                  }`}
                >
                  High Spout
                </button>
                <button
                  onClick={() => setCameraPreset('rekebot')}
                  className={`px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${
                    cameraPreset === 'rekebot' ? 'bg-[#c99a55] text-black font-semibold' : 'bg-black/40 text-neutral-300 hover:text-white'
                  }`}
                >
                  Tray Top
                </button>
              </div>
            </div>

            {/* 2. Interactive Ceremony Actions */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-semibold text-[#c99a55] tracking-wider">
                Ceremony Actions
              </span>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={handlePourToggle}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded font-medium transition-colors ${
                    isPouringActive ? 'bg-amber-600 text-white' : 'bg-black/40 text-white hover:bg-black/60 border border-white/10'
                  }`}
                >
                  <Coffee className="w-3.5 h-3.5 text-[#dfb679]" />
                  <span>{isPouringActive ? 'Stop Pouring' : 'Ceremonial Pour'}</span>
                </button>

                <button
                  onClick={handleRoastToggle}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded font-medium transition-colors ${
                    isRoastingActive ? 'bg-orange-600 text-white' : 'bg-black/40 text-white hover:bg-black/60 border border-white/10'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>{isRoastingActive ? 'Roasting in Progress' : 'Simulate Roasting'}</span>
                </button>
              </div>
            </div>

            {/* 3. Clay Finish Swatches */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-semibold text-[#c99a55] tracking-wider">
                Clay Artisan Finish
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setClayFinish('obsidian')}
                  className={`flex-1 py-1 px-2 rounded border text-[11px] transition-colors ${
                    clayFinish === 'obsidian' ? 'border-[#c99a55] bg-black/70 text-white font-semibold' : 'border-white/10 bg-black/30 text-neutral-400'
                  }`}
                >
                  Obsidian
                </button>
                <button
                  onClick={() => setClayFinish('terracotta')}
                  className={`flex-1 py-1 px-2 rounded border text-[11px] transition-colors ${
                    clayFinish === 'terracotta' ? 'border-[#c99a55] bg-black/70 text-white font-semibold' : 'border-white/10 bg-black/30 text-neutral-400'
                  }`}
                >
                  Red Clay
                </button>
                <button
                  onClick={() => setClayFinish('gold_accent')}
                  className={`flex-1 py-1 px-2 rounded border text-[11px] transition-colors ${
                    clayFinish === 'gold_accent' ? 'border-[#c99a55] bg-black/70 text-white font-semibold' : 'border-white/10 bg-black/30 text-neutral-400'
                  }`}
                >
                  Gilded
                </button>
              </div>
              <span className="text-[10px] text-[#b3a598]">
                {clayFinish === 'obsidian' ? 'Traditional blackened wood-fired clay' : clayFinish === 'terracotta' ? 'Natural red volcanic earth' : 'Imperial palace etched gold'}
              </span>
            </div>

            {/* 4. Exploded Anatomy Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold text-[#c99a55] tracking-wider">
                  Anatomy Deconstruction
                </span>
                <span className="text-[10px] text-[#dfb679] tabular-nums font-mono">
                  {Math.round(explodedSlider * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodedSlider}
                onChange={(e) => setExplodedSlider(parseFloat(e.target.value))}
                className="w-full accent-[#c99a55] bg-black/50 h-1.5 rounded cursor-pointer"
              />
              <span className="text-[10px] text-[#b3a598]">
                Inspect stopper, fluted lip, and clay body
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
