import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { motion, AnimatePresence } from 'motion/react';
import { MoveHorizontal } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

interface Logo3DIntroGateProps {
  onUnlock: () => void;
}

const UNLOCK_THRESHOLD_RAD = Math.PI * 0.62; // ~112° de rotation gauche ou droite

function createAlphaMaskedEmblemTexture(
  img: HTMLImageElement,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(img, 0, 0, size, size);
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;

    // Supprimer proprement le fond noir (#000) tout en gardant un contour doux
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luminance = Math.max(r, g, b);
      if (luminance < 16) {
        data[i + 3] = 0;
      } else if (luminance < 44) {
        data[i + 3] = Math.round(((luminance - 16) / 28) * 255);
      } else {
        data[i + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

export function Logo3DIntroGate({ onUnlock }: Logo3DIntroGateProps) {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const onUnlockRef = useRef(onUnlock);
  onUnlockRef.current = onUnlock;

  const [turnProgress, setTurnProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [textureError, setTextureError] = useState(false);

  const controlsStateRef = useRef({
    targetRotY: 0,
    currentRotY: 0,
    velocityY: 0,
    targetRotX: 0,
    currentRotX: 0,
    totalTurned: 0,
    isDragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
    unlocked: false,
    unlockAnimStart: 0,
  });

  const triggerUnlock = () => {
    const state = controlsStateRef.current;
    if (state.unlocked) return;
    state.unlocked = true;
    state.unlockAnimStart = performance.now();
    // Effectue un tour complet fluide vers l'avant lors du déverrouillage
    const direction = state.targetRotY >= 0 ? 1 : -1;
    state.targetRotY = state.currentRotY + direction * Math.PI * 1.4;
    setTurnProgress(100);
    setUnlocking(true);
    window.setTimeout(() => {
      onUnlockRef.current();
    }, 620);
  };

  useEffect(() => {
    const container = canvasMountRef.current;
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

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setTextureError(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    // Éclairage studio chaud/froid
    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x040d24, 1.1);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3.5, 4.5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00cfff, 2.4);
    rimLight.position.set(-4, -2, -3.5);
    scene.add(rimLight);

    // Groupe racine du logo 3D (démarre en haut hors écran pour tomber fluidement vers le centre)
    const emblemGroup = new THREE.Group();
    emblemGroup.position.set(0, 4.8, 0);
    scene.add(emblemGroup);

    const disposables: Array<{ dispose: () => void }> = [];
    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    // Anneau lumineux subtil autour du logo 3D
    const ringGeo = new THREE.TorusGeometry(1.62, 0.014, 16, 80);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x00cfff,
      emissive: 0x006bff,
      emissiveIntensity: 1.3,
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.55,
    });
    const haloRing = new THREE.Mesh(ringGeo, ringMat);
    haloRing.rotation.x = Math.PI * 0.08;
    emblemGroup.add(haloRing);
    disposables.push(ringGeo, ringMat);

    // Chargement de l'image exacte envoyée par l'utilisateur pour construire le volume 3D
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const emblemTex = createAlphaMaskedEmblemTexture(img, maxAniso);
      disposables.push(emblemTex);

      const planeGeo = new THREE.PlaneGeometry(2.35, 2.35);
      disposables.push(planeGeo);

      const thickness = 0.24;
      const sliceCount = 16;

      // Tranches internes métalliques pour créer l'épaisseur 3D réelle lors de la rotation
      const edgeMat = new THREE.MeshStandardMaterial({
        map: emblemTex,
        color: 0x0a49b5,
        emissive: 0x0055ff,
        emissiveIntensity: 0.45,
        metalness: 0.85,
        roughness: 0.25,
        alphaTest: 0.24,
        side: THREE.DoubleSide,
      });
      disposables.push(edgeMat);

      for (let i = 1; i < sliceCount - 1; i++) {
        const z = -thickness / 2 + (i / (sliceCount - 1)) * thickness;
        const slice = new THREE.Mesh(planeGeo, edgeMat);
        slice.position.z = z;
        emblemGroup.add(slice);
      }

      // Face avant et face arrière haute définition
      const faceMat = new THREE.MeshPhysicalMaterial({
        map: emblemTex,
        emissiveMap: emblemTex,
        emissive: new THREE.Color(0x0099ff),
        emissiveIntensity: 0.42,
        metalness: 0.35,
        roughness: 0.18,
        clearcoat: 0.95,
        clearcoatRoughness: 0.12,
        alphaTest: 0.18,
        transparent: true,
        side: THREE.FrontSide,
      });
      disposables.push(faceMat);

      const frontFace = new THREE.Mesh(planeGeo, faceMat);
      frontFace.position.z = thickness / 2;
      emblemGroup.add(frontFace);

      const backFace = new THREE.Mesh(planeGeo, faceMat);
      backFace.position.z = -thickness / 2;
      backFace.rotation.y = Math.PI;
      emblemGroup.add(backFace);
    };
    img.onerror = () => {
      setTextureError(true);
    };
    img.src = siteConfig.assets.emblem3d;

    // Gestion du resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.position.z = w < 640 ? 7.2 : 6.2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Interaction glisser gauche/droite (souris + tactile)
    const onPointerDown = (e: PointerEvent) => {
      const state = controlsStateRef.current;
      if (state.unlocked) return;
      state.isDragging = true;
      state.lastPointerX = e.clientX;
      state.lastPointerY = e.clientY;
      state.velocityY = 0;
      setIsDragging(true);
      try {
        renderer.domElement.setPointerCapture(e.pointerId);
      } catch {
        // Ignore if not supported
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const state = controlsStateRef.current;
      if (!state.isDragging || state.unlocked) return;
      const dx = e.clientX - state.lastPointerX;
      const dy = e.clientY - state.lastPointerY;
      state.lastPointerX = e.clientX;
      state.lastPointerY = e.clientY;

      const rotDeltaY = dx * 0.0135;
      state.targetRotY += rotDeltaY;
      state.velocityY = rotDeltaY;
      state.targetRotX = THREE.MathUtils.clamp(
        state.targetRotX + dy * 0.0045,
        -0.38,
        0.38
      );

      state.totalTurned += Math.abs(rotDeltaY);
      const pct = Math.min(100, Math.round((state.totalTurned / UNLOCK_THRESHOLD_RAD) * 100));
      setTurnProgress(pct);

      if (state.totalTurned >= UNLOCK_THRESHOLD_RAD) {
        state.isDragging = false;
        setIsDragging(false);
        triggerUnlock();
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const state = controlsStateRef.current;
      state.isDragging = false;
      setIsDragging(false);
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    };

    const canvasEl = renderer.domElement;
    canvasEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // Boucle d'animation (chute fluide depuis le haut -> jiggle gauche/droite -> rotation manuelle)
    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();
    const startTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const syncState = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (syncState === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = (performance.now() - startTime) / 1000;
      const state = controlsStateRef.current;

      // 1. Chute fluide depuis le haut du téléphone/écran vers le centre (y: 4.8 -> 0)
      const dropProgress = Math.min(1, elapsed / 0.95);
      const easedDrop = 1 - Math.pow(1 - dropProgress, 3);
      const basePosY = THREE.MathUtils.lerp(4.8, 0, easedDrop);
      const floatY = dropProgress >= 1 ? Math.sin(elapsed * 2.2) * 0.07 : 0;
      emblemGroup.position.y = basePosY + floatY;

      // 2. Petit "jiggle" gauche/droite quand l'utilisateur n'a pas encore tourné le logo
      let wiggleOffset = 0;
      if (!state.isDragging && !state.unlocked && state.totalTurned < 0.08 && dropProgress > 0.7) {
        wiggleOffset = Math.sin(elapsed * 2.8) * 0.24;
      }

      // Inertie légère après relâchement
      if (!state.isDragging && !state.unlocked && Math.abs(state.velocityY) > 0.0005) {
        state.targetRotY += state.velocityY;
        state.velocityY *= 0.92;
      }

      if (!state.isDragging && !state.unlocked) {
        state.targetRotX = THREE.MathUtils.damp(state.targetRotX, 0, 4, delta);
      }

      state.currentRotY = THREE.MathUtils.damp(
        state.currentRotY,
        state.targetRotY + wiggleOffset,
        10,
        delta
      );
      state.currentRotX = THREE.MathUtils.damp(state.currentRotX, state.targetRotX, 10, delta);

      emblemGroup.rotation.y = state.currentRotY;
      emblemGroup.rotation.x = state.currentRotX;

      haloRing.rotation.z = elapsed * 0.45;
      haloRing.rotation.y = -state.currentRotY * 0.35;

      // Mise à l'échelle fluide lors du déverrouillage
      if (state.unlocked) {
        const unlockElapsed = (performance.now() - state.unlockAnimStart) / 1000;
        const targetScale = 1 + unlockElapsed * 0.45;
        emblemGroup.scale.setScalar(targetScale);
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      canvasEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      disposables.forEach((d) => d.dispose());
      envTex.dispose();
      renderer.dispose();
      if (canvasEl.parentNode === container) {
        container.removeChild(canvasEl);
      }
    };
  }, []);

  // Support clavier (flèches gauche / droite) pour accessibilité
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const delta = e.key === 'ArrowLeft' ? -0.45 : 0.45;
        const state = controlsStateRef.current;
        if (state.unlocked) return;
        state.targetRotY += delta;
        state.totalTurned += Math.abs(delta);
        const pct = Math.min(100, Math.round((state.totalTurned / UNLOCK_THRESHOLD_RAD) * 100));
        setTurnProgress(pct);
        if (state.totalTurned >= UNLOCK_THRESHOLD_RAD) {
          triggerUnlock();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: unlocking ? 0 : 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-between overflow-hidden bg-[#020817]/78 select-none"
        role="dialog"
        aria-modal="true"
        aria-label="Accueil interactif 3D Zenin Digital"
      >
        {/* Canvas 3D WebGL plein écran centré */}
        <div
          ref={canvasMountRef}
          className={`absolute inset-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        />

        {/* Fallback si WebGL indisponible */}
        {textureError && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              src={siteConfig.assets.emblem3d}
              alt="Logo Zenin Digital"
              className="w-44 h-44 object-contain rounded-3xl"
            />
          </div>
        )}

        {/* Texte animé qui tombe du haut du téléphone juste au-dessus du logo */}
        <div className="relative z-10 w-full flex flex-col items-center pt-[13vh] sm:pt-[14vh] px-4 pointer-events-none">
          <motion.div
            initial={{ y: -140, opacity: 0, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 18,
              delay: 0.25,
            }}
            className="text-center max-w-md"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#06132D]/90 border border-[#00CFFF]/50 shadow-[0_0_28px_rgba(0,107,255,0.45)]"
            >
              <MoveHorizontal className="w-4 h-4 text-[#00CFFF] shrink-0" aria-hidden="true" />
              <span className="text-sm sm:text-base font-bold tracking-tight text-white">
                Tourne le logo à gauche ou à droite
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Barre d'avancement discrète + bouton d'accès rapide en bas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="relative z-10 pb-10 sm:pb-12 px-4 flex flex-col items-center gap-4"
        >
          <div className="w-52 sm:w-64">
            <div className="h-1.5 w-full rounded-full bg-[#06132D] border border-[#006BFF]/35 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#006BFF] to-[#00CFFF] transition-all duration-150"
                style={{ width: `${turnProgress}%` }}
              />
            </div>
            <div className="mt-2 text-center text-xs text-[#B9C7DC] tabular-nums">
              {unlocking ? 'Accès au site...' : `Glissez le logo pour entrer (${turnProgress}%)`}
            </div>
          </div>

          <button
            type="button"
            onClick={triggerUnlock}
            className="px-4 py-2 rounded-full text-xs font-medium text-[#B9C7DC] hover:text-white border border-[#006BFF]/30 bg-[#06132D]/80 hover:border-[#00CFFF]/60 transition-colors min-h-[38px]"
          >
            Passer l&apos;intro
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
