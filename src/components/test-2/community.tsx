"use client";

import { useDialKit } from "dialkit";
import { type PointerEvent, useEffect, useRef, useState } from "react";

interface CommunityProps {
  maskEnabled?: boolean;
  maskInnerPercent?: number;
  maskOuterPercent?: number;
}

interface SceneSettings {
  autoSpeed: number;
  avatarSize: number;
  canvasSize: number;
  drag: number;
  dragBoost: number;
  focusSize: number;
  focusInnerPercent: number;
  gap: number;
  inertia: number;
  maxSpeed: number;
  minOpacity: number;
  minScale: number;
  ringOpacity: number;
  rowOffset: number;
  rowStep: number;
}

interface ViewportState {
  dpr: number;
  height: number;
  width: number;
}

type AvatarSprite = HTMLCanvasElement;
type Point = {
  x: number;
  y: number;
};

const USERS = [
  "https://randomuser.me/api/portraits/lego/1.jpg",
  "https://randomuser.me/api/portraits/lego/2.jpg",
  "https://randomuser.me/api/portraits/lego/3.jpg",
  "https://randomuser.me/api/portraits/lego/4.jpg",
  "https://randomuser.me/api/portraits/lego/5.jpg",
  "https://randomuser.me/api/portraits/lego/6.jpg",
  "https://randomuser.me/api/portraits/lego/7.jpg",
  "https://randomuser.me/api/portraits/lego/8.jpg",
  "https://randomuser.me/api/portraits/lego/9.jpg",
];

const FRAME_TIME = 1000 / 60;
const TAU = Math.PI * 2;
const DEFAULT_AUTO_SPEED = 0.6;
const DIRECTION_EPSILON = 0.001;
const DEFAULT_MASK_INNER_PERCENT = 20;
const DEFAULT_MASK_OUTER_PERCENT = 60;
const WORLD_BLEED = 32;
const MAX_DEVICE_PIXEL_RATIO = 2;
const AVATAR_SPRITE_SIZE = 256;
const MIN_RENDER_SPEED = 0.01;

export default function Community({
  maskEnabled: maskEnabledProp = true,
  maskInnerPercent: maskInnerPercentProp = DEFAULT_MASK_INNER_PERCENT,
  maskOuterPercent: maskOuterPercentProp = DEFAULT_MASK_OUTER_PERCENT,
}: CommunityProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  const documentVisibleRef = useRef(true);
  const inViewportRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const spritesReadyRef = useRef(false);
  const cameraRef = useRef({ x: 86, y: -64 });
  const velocityRef = useRef({ x: -DEFAULT_AUTO_SPEED, y: 0 });
  const driftDirectionRef = useRef({ x: -1, y: 0 });
  const avatarSpritesRef = useRef<(AvatarSprite | null)[]>([]);
  const dragRef = useRef({
    active: false,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
    pointerId: -1,
  });
  const viewportRef = useRef<ViewportState>({
    dpr: 1,
    height: 1,
    width: 1,
  });
  const dials = useDialKit("Test 2 / Community", {
    viewport: {
      size: [520, 180, 960, 1],
      focusSize: [120, 24, 420, 1],
      showRing: true,
      ringOpacity: [0.13, 0, 0.4, 0.01],
    },
    grid: {
      avatarSize: [40, 24, 96, 1],
      gap: [4, 4, 36, 1],
      rowStep: [20, 0, 120, 1],
      rowOffset: [20, 0, 96, 1],
    },
    falloff: {
      focusInnerPercent: [30, 10, 95, 1],
      minScale: [0.4, 0.1, 1, 0.01],
      minOpacity: [0, 0, 1, 0.01],
    },
    mask: {
      enabled: maskEnabledProp,
      innerPercent: [maskInnerPercentProp, 0, 100, 1],
      outerPercent: [maskOuterPercentProp, 0, 100, 1],
    },
    motion: {
      autoSpeed: [DEFAULT_AUTO_SPEED, 0.05, 4, 0.05],
      drag: [1, 0.4, 1.6, 0.01],
      dragBoost: [1.18, 0.5, 2.5, 0.01],
      inertia: [0.91, 0.75, 0.98, 0.001],
      maxSpeed: [48, 4, 120, 1],
    },
  });
  const scene = {
    autoSpeed: dials.motion.autoSpeed,
    avatarSize: dials.grid.avatarSize,
    canvasSize: dials.viewport.size,
    drag: dials.motion.drag,
    dragBoost: dials.motion.dragBoost,
    focusSize: dials.viewport.focusSize,
    focusInnerPercent: dials.falloff.focusInnerPercent,
    gap: dials.grid.gap,
    inertia: dials.motion.inertia,
    maxSpeed: dials.motion.maxSpeed,
    minOpacity: dials.falloff.minOpacity,
    minScale: dials.falloff.minScale,
    ringOpacity: dials.viewport.showRing ? dials.viewport.ringOpacity : 0,
    rowOffset: dials.grid.rowOffset,
    rowStep: dials.grid.rowStep,
  };
  const maskInnerPercent = clamp(dials.mask.innerPercent, 0, 100);
  const maskOuterPercent = clamp(
    dials.mask.outerPercent,
    maskInnerPercent,
    100,
  );
  const canvasMask = dials.mask.enabled
    ? createCanvasMask(maskInnerPercent, maskOuterPercent)
    : "none";
  const sceneRef = useRef<SceneSettings>(scene);
  const [isDragging, setIsDragging] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);

  function stopRenderLoop() {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    lastFrameRef.current = null;
  }

  function syncRenderVisibility() {
    const canRender = documentVisibleRef.current && inViewportRef.current;

    if (canRender) {
      visibleRef.current = true;
      requestRender();
      return;
    }

    visibleRef.current = false;
    stopRenderLoop();
  }

  function getCanvasContext() {
    if (contextRef.current) {
      return contextRef.current;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return null;
    }

    contextRef.current = canvas.getContext("2d");
    return contextRef.current;
  }

  function getCruiseVelocity(): Point {
    return {
      x: driftDirectionRef.current.x * sceneRef.current.autoSpeed,
      y: driftDirectionRef.current.y * sceneRef.current.autoSpeed,
    };
  }

  function setDriftDirection(x: number, y: number) {
    const magnitude = Math.hypot(x, y);

    if (magnitude < DIRECTION_EPSILON) {
      return;
    }

    driftDirectionRef.current = {
      x: x / magnitude,
      y: y / magnitude,
    };
  }

  function setVelocity({ x, y }: Point) {
    velocityRef.current.x = x;
    velocityRef.current.y = y;
  }

  function requestRender() {
    if (
      !visibleRef.current ||
      !spritesReadyRef.current ||
      animationFrameRef.current !== null
    ) {
      return;
    }

    animationFrameRef.current = window.requestAnimationFrame(renderFrame);
  }

  function drawScene() {
    const canvas = canvasRef.current;
    const ctx = getCanvasContext();

    if (!canvas || !ctx) {
      return;
    }

    const { dpr, height, width } = viewportRef.current;

    if (width <= 0 || height <= 0) {
      return;
    }

    const settings = sceneRef.current;
    const centerX = width / 2;
    const centerY = height / 2;
    const focusRadius = clamp(
      settings.focusSize,
      0,
      Math.min(width, height) / 2,
    );
    const feather = settings.canvasSize;
    const featherRadius = focusRadius + feather;
    const focusInnerRadius = focusRadius * (settings.focusInnerPercent / 100);
    const stepX = Math.max(settings.avatarSize + settings.gap, 1);
    const stepY = Math.max(settings.rowStep, 1);
    const camera = cameraRef.current;
    const avatarSprites = avatarSpritesRef.current;
    const avatarCount = USERS.length;
    const outerCullRadius = featherRadius + settings.avatarSize;
    const outerCullRadiusSquared = outerCullRadius * outerCullRadius;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const worldLeft = camera.x - centerX - WORLD_BLEED - stepX;
    const worldRight = camera.x + centerX + WORLD_BLEED + stepX;
    const worldTop = camera.y - centerY - WORLD_BLEED - stepY;
    const worldBottom = camera.y + centerY + WORLD_BLEED + stepY;
    const rowStart = Math.floor(worldTop / stepY) - 1;
    const rowEnd = Math.ceil(worldBottom / stepY) + 1;

    for (let row = rowStart; row <= rowEnd; row += 1) {
      const rowOffset = row % 2 === 0 ? 0 : settings.rowOffset;
      const colStart = Math.floor((worldLeft - rowOffset) / stepX) - 1;
      const colEnd = Math.ceil((worldRight - rowOffset) / stepX) + 1;

      for (let column = colStart; column <= colEnd; column += 1) {
        const seed = hashCell(column, row);
        const worldX = column * stepX + rowOffset;
        const worldY = row * stepY;
        const x = centerX + worldX - camera.x;
        const y = centerY + worldY - camera.y;

        if (
          x < -settings.avatarSize ||
          x > width + settings.avatarSize ||
          y < -settings.avatarSize ||
          y > height + settings.avatarSize
        ) {
          continue;
        }

        const offsetX = x - centerX;
        const offsetY = y - centerY;
        const distanceSquared = offsetX * offsetX + offsetY * offsetY;

        if (distanceSquared > outerCullRadiusSquared) {
          continue;
        }

        const distance = Math.sqrt(distanceSquared);
        const edgeStrength =
          1 - clamp((distance - focusRadius) / Math.max(feather, 1), 0, 1);

        if (edgeStrength <= 0) {
          continue;
        }

        const focusStrength =
          1 -
          clamp(
            (distance - focusInnerRadius) /
              Math.max(focusRadius - focusInnerRadius, 1),
            0,
            1,
          );
        const scale = mix(settings.minScale, 1, focusStrength);
        const alpha = clamp(
          mix(settings.minOpacity, 1, focusStrength) * edgeStrength,
          0,
          1,
        );
        const size =
          settings.avatarSize * scale * mix(0.92, 1.08, seedUnit(seed, 20));

        drawAvatar(
          ctx,
          avatarSprites[seed % avatarCount] ?? null,
          alpha,
          size,
          x,
          y,
          seed,
        );
      }
    }

    if (settings.ringOpacity > 0) {
      ctx.strokeStyle = `rgba(0, 0, 0, ${settings.ringOpacity})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, focusRadius, 0, TAU);
      ctx.stroke();
    }
  }

  function renderFrame(timestamp: number) {
    animationFrameRef.current = null;

    if (!visibleRef.current) {
      lastFrameRef.current = null;
      return;
    }

    const deltaFrames =
      lastFrameRef.current === null
        ? 1
        : clamp((timestamp - lastFrameRef.current) / FRAME_TIME, 0.5, 3);

    lastFrameRef.current = timestamp;
    const cruiseX = reducedMotionRef.current
      ? 0
      : driftDirectionRef.current.x * sceneRef.current.autoSpeed;
    const cruiseY = reducedMotionRef.current
      ? 0
      : driftDirectionRef.current.y * sceneRef.current.autoSpeed;

    if (!dragRef.current.active) {
      if (reducedMotionRef.current) {
        velocityRef.current.x = 0;
        velocityRef.current.y = 0;
      } else {
        cameraRef.current.x += velocityRef.current.x * deltaFrames;
        cameraRef.current.y += velocityRef.current.y * deltaFrames;

        const damping = Math.pow(sceneRef.current.inertia, deltaFrames);
        velocityRef.current.x =
          cruiseX + (velocityRef.current.x - cruiseX) * damping;
        velocityRef.current.y =
          cruiseY + (velocityRef.current.y - cruiseY) * damping;

        if (Math.abs(velocityRef.current.x - cruiseX) < MIN_RENDER_SPEED) {
          velocityRef.current.x = cruiseX;
        }

        if (Math.abs(velocityRef.current.y - cruiseY) < MIN_RENDER_SPEED) {
          velocityRef.current.y = cruiseY;
        }
      }
    }

    drawScene();

    if (
      dragRef.current.active ||
      Math.abs(velocityRef.current.x) > MIN_RENDER_SPEED ||
      Math.abs(velocityRef.current.y) > MIN_RENDER_SPEED ||
      Math.abs(cruiseX) > MIN_RENDER_SPEED ||
      Math.abs(cruiseY) > MIN_RENDER_SPEED
    ) {
      requestRender();
      return;
    }

    lastFrameRef.current = null;
  }

  function resizeCanvas() {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) {
      return;
    }

    const bounds = container.getBoundingClientRect();
    const width = Math.max(bounds.width, 1);
    const height = Math.max(bounds.height, 1);
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
    const pixelWidth = Math.round(width * dpr);
    const pixelHeight = Math.round(height * dpr);
    const currentViewport = viewportRef.current;

    if (
      currentViewport.width === width &&
      currentViewport.height === height &&
      currentViewport.dpr === dpr &&
      canvas.width === pixelWidth &&
      canvas.height === pixelHeight
    ) {
      return;
    }

    viewportRef.current = {
      dpr,
      height,
      width,
    };

    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    if (spritesReadyRef.current) {
      drawScene();
    }
  }

  function endDrag(pointerId?: number) {
    if (
      pointerId !== undefined &&
      dragRef.current.pointerId !== -1 &&
      dragRef.current.pointerId !== pointerId
    ) {
      return;
    }

    dragRef.current.active = false;
    dragRef.current.pointerId = -1;
    setIsDragging(false);

    if (reducedMotionRef.current) {
      setVelocity({ x: 0, y: 0 });
    }

    requestRender();
  }

  useEffect(() => {
    sceneRef.current = scene;
    requestRender();
  }, [
    scene.autoSpeed,
    scene.avatarSize,
    scene.canvasSize,
    scene.drag,
    scene.dragBoost,
    scene.focusSize,
    scene.focusInnerPercent,
    scene.gap,
    scene.inertia,
    scene.maxSpeed,
    scene.minOpacity,
    scene.minScale,
    scene.ringOpacity,
    scene.rowOffset,
    scene.rowStep,
  ]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncReducedMotion = () => {
      reducedMotionRef.current = media.matches;

      if (media.matches) {
        setVelocity({ x: 0, y: 0 });
      } else {
        setVelocity(getCruiseVelocity());
      }

      requestRender();
    };

    const syncDocumentVisibility = () => {
      documentVisibleRef.current = !document.hidden;
      syncRenderVisibility();
    };

    syncReducedMotion();
    syncDocumentVisibility();
    media.addEventListener("change", syncReducedMotion);
    document.addEventListener("visibilitychange", syncDocumentVisibility);

    return () => {
      media.removeEventListener("change", syncReducedMotion);
      document.removeEventListener("visibilitychange", syncDocumentVisibility);
    };
  }, []);

  useEffect(() => {
    let isDisposed = false;

    spritesReadyRef.current = false;
    avatarSpritesRef.current = Array(USERS.length).fill(null);

    void Promise.all(USERS.map(loadAvatarSprite)).then((sprites) => {
      if (isDisposed) {
        return;
      }

      avatarSpritesRef.current = sprites;
      spritesReadyRef.current = true;
      drawScene();
      setIsSceneReady(true);
      requestRender();
    });

    return () => {
      isDisposed = true;
      spritesReadyRef.current = false;
      avatarSpritesRef.current = [];
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    resizeCanvas();

    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });
    const visibilityObserver =
      "IntersectionObserver" in window
        ? new IntersectionObserver(([entry]) => {
            if (!entry) {
              return;
            }

            inViewportRef.current = entry.isIntersecting;
            syncRenderVisibility();
          })
        : null;

    observer.observe(container);
    visibilityObserver?.observe(container);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      observer.disconnect();
      visibilityObserver?.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      stopRenderLoop();
    };
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current.active = true;
    dragRef.current.pointerId = event.pointerId;
    dragRef.current.lastX = event.clientX;
    dragRef.current.lastY = event.clientY;
    dragRef.current.lastTime = event.timeStamp;
    setIsDragging(true);
    requestRender();
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (
      !dragRef.current.active ||
      dragRef.current.pointerId !== event.pointerId
    ) {
      return;
    }

    const elapsed = Math.max(event.timeStamp - dragRef.current.lastTime, 1);
    const deltaFrames = Math.max(elapsed / FRAME_TIME, 1);
    const dx = event.clientX - dragRef.current.lastX;
    const dy = event.clientY - dragRef.current.lastY;
    const dragMultiplier = sceneRef.current.drag;

    cameraRef.current.x -= dx * dragMultiplier;
    cameraRef.current.y -= dy * dragMultiplier;

    if (
      !reducedMotionRef.current &&
      (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01)
    ) {
      const boostedVelocity = clampMagnitude(
        ((-dx * dragMultiplier) / deltaFrames) * sceneRef.current.dragBoost,
        ((-dy * dragMultiplier) / deltaFrames) * sceneRef.current.dragBoost,
        sceneRef.current.maxSpeed,
      );

      setDriftDirection(boostedVelocity.x, boostedVelocity.y);
      setVelocity(boostedVelocity);
    }

    dragRef.current.lastX = event.clientX;
    dragRef.current.lastY = event.clientY;
    dragRef.current.lastTime = event.timeStamp;
    requestRender();
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    endDrag(event.pointerId);
  };

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    endDrag(event.pointerId);
  };

  const handleLostPointerCapture = (event: PointerEvent<HTMLDivElement>) => {
    endDrag(event.pointerId);
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-4 md:p-6">
      <div
        aria-busy={!isSceneReady}
        className="relative shrink-0"
        style={{
          height: scene.canvasSize,
          maxHeight: "100%",
          maxWidth: "100%",
          width: scene.canvasSize,
        }}
      >
        <div
          ref={containerRef}
          aria-describedby="community-canvas-instructions"
          aria-label="Infinite community avatar canvas"
          aria-roledescription="infinite canvas"
          className={`absolute inset-0 overflow-hidden transition-opacity duration-200 ease-out motion-reduce:transition-none ${
            isSceneReady ? "opacity-100" : "pointer-events-none opacity-0"
          } ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          } touch-none select-none focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black/20`}
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          onLostPointerCapture={handleLostPointerCapture}
          onPointerCancel={handlePointerCancel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <p id="community-canvas-instructions" className="sr-only">
            Drag to explore the infinite avatar field.
          </p>
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            style={{
              WebkitMaskImage: canvasMask,
              WebkitMaskRepeat: "no-repeat",
              maskImage: canvasMask,
              maskRepeat: "no-repeat",
            }}
            draggable={false}
          />
        </div>
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-150 ease-out motion-reduce:transition-none ${
            isSceneReady ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="h-7 w-7 animate-spin rounded-lg border border-black/10 border-t-black/20 motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  );
}

function loadAvatarSprite(src: string): Promise<AvatarSprite | null> {
  return new Promise((resolve) => {
    const image = new Image();
    let settled = false;

    const settle = (sprite: AvatarSprite | null) => {
      if (settled) {
        return;
      }

      settled = true;
      image.onload = null;
      image.onerror = null;
      resolve(sprite);
    };

    image.decoding = "async";
    image.loading = "eager";
    image.onload = () => {
      void image
        .decode()
        .catch(() => undefined)
        .then(() => settle(createAvatarSprite(image)));
    };
    image.onerror = () => settle(null);
    image.src = src;
  });
}

function drawAvatar(
  ctx: CanvasRenderingContext2D,
  sprite: AvatarSprite | null,
  alpha: number,
  size: number,
  x: number,
  y: number,
  seed: number,
) {
  const radius = size / 2;

  ctx.save();
  ctx.globalAlpha = Math.min(0.22, 0.08 + alpha * 0.16);
  ctx.fillStyle = "#111111";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();
  ctx.restore();

  if (sprite) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.drawImage(sprite, x - radius, y - radius, size, size);
    ctx.restore();
    return;
  }

  const hue = 18 + Math.round(seedUnit(seed, 6) * 24);
  const saturation = 10 + Math.round(seedUnit(seed, 14) * 18);
  const light = 72 - Math.round(seedUnit(seed, 22) * 14);
  const fill = ctx.createRadialGradient(
    x - size * 0.24,
    y - size * 0.24,
    size * 0.12,
    x,
    y,
    size * 0.7,
  );

  fill.addColorStop(0, `hsla(${hue}, ${saturation}%, ${light + 6}%, ${alpha})`);
  fill.addColorStop(
    1,
    `hsla(${hue}, ${saturation}%, ${light - 10}%, ${alpha * 0.7})`,
  );
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();
}

function createAvatarSprite(image: HTMLImageElement) {
  if (image.naturalWidth <= 0 || image.naturalHeight <= 0) {
    return null;
  }

  const canvas = document.createElement("canvas");

  canvas.width = AVATAR_SPRITE_SIZE;
  canvas.height = AVATAR_SPRITE_SIZE;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
  const sourceX = (image.naturalWidth - sourceSize) / 2;
  const sourceY = (image.naturalHeight - sourceSize) / 2;
  const radius = AVATAR_SPRITE_SIZE / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(radius, radius, radius, 0, TAU);
  ctx.clip();
  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    AVATAR_SPRITE_SIZE,
    AVATAR_SPRITE_SIZE,
  );
  ctx.restore();

  return canvas;
}

function hashCell(x: number, y: number) {
  let seed = Math.imul(x ^ 0x1f123bb5, 0x45d9f3b);

  seed ^= Math.imul(y ^ 0x5f356495, 0x119de1f3);
  seed ^= seed >>> 16;
  seed = Math.imul(seed, 0x7feb352d);
  seed ^= seed >>> 15;
  seed = Math.imul(seed, 0x846ca68b);
  seed ^= seed >>> 16;

  return seed >>> 0;
}

function seedUnit(seed: number, shift: number) {
  return ((seed >>> shift) & 1023) / 1023;
}

function mix(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function createCanvasMask(innerPercent: number, outerPercent: number) {
  return `radial-gradient(circle at center, rgba(0, 0, 0, 1) ${innerPercent}%, rgba(0, 0, 0, 0) ${outerPercent}%)`;
}

function clampMagnitude(x: number, y: number, max: number) {
  const magnitude = Math.hypot(x, y);

  if (magnitude <= max || magnitude === 0) {
    return { x, y };
  }

  const scale = max / magnitude;

  return {
    x: x * scale,
    y: y * scale,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
