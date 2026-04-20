"use client";

import { useDialKit } from "dialkit";
import {
  type KeyboardEvent,
  type PointerEvent,
  type WheelEvent,
  useEffect,
  useRef,
  useState,
} from "react";

interface CommunityProps {
  radius?: number;
}

interface SceneSettings {
  avatarSize: number;
  bleed: number;
  drag: number;
  feather: number;
  focusInnerPercent: number;
  gap: number;
  inertia: number;
  jitter: number;
  maxSpeed: number;
  minOpacity: number;
  minScale: number;
  radius: number;
  ringOpacity: number;
  rowOffset: number;
  rowStep: number;
  wheel: number;
}

interface ViewportState {
  dpr: number;
  height: number;
  width: number;
}

const USERS = [
  "https://randomuser.me/api/portraits/men/1.jpg",
  "https://randomuser.me/api/portraits/men/2.jpg",
  "https://randomuser.me/api/portraits/men/3.jpg",
  "https://randomuser.me/api/portraits/men/4.jpg",
  "https://randomuser.me/api/portraits/men/5.jpg",
  "https://randomuser.me/api/portraits/men/6.jpg",
  "https://randomuser.me/api/portraits/men/7.jpg",
  "https://randomuser.me/api/portraits/men/8.jpg",
  "https://randomuser.me/api/portraits/men/9.jpg",
  "https://randomuser.me/api/portraits/women/10.jpg",
  "https://randomuser.me/api/portraits/women/11.jpg",
  "https://randomuser.me/api/portraits/women/12.jpg",
  "https://randomuser.me/api/portraits/women/13.jpg",
  "https://randomuser.me/api/portraits/women/14.jpg",
  "https://randomuser.me/api/portraits/women/15.jpg",
  "https://randomuser.me/api/portraits/women/16.jpg",
  "https://randomuser.me/api/portraits/women/17.jpg",
  "https://randomuser.me/api/portraits/women/18.jpg",
  "https://randomuser.me/api/portraits/women/19.jpg",
  "https://randomuser.me/api/portraits/women/20.jpg",
  "https://randomuser.me/api/portraits/men/21.jpg",
  "https://randomuser.me/api/portraits/men/22.jpg",
  "https://randomuser.me/api/portraits/men/23.jpg",
  "https://randomuser.me/api/portraits/men/24.jpg",
  "https://randomuser.me/api/portraits/men/25.jpg",
  "https://randomuser.me/api/portraits/men/26.jpg",
  "https://randomuser.me/api/portraits/men/27.jpg",
  "https://randomuser.me/api/portraits/men/28.jpg",
  "https://randomuser.me/api/portraits/men/29.jpg",
  "https://randomuser.me/api/portraits/men/30.jpg",
];

const FRAME_TIME = 1000 / 60;
const TAU = Math.PI * 2;

export default function Community({ radius = 380 }: CommunityProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const cameraRef = useRef({ x: 86, y: -64 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const imagesRef = useRef<HTMLImageElement[]>([]);
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
      radius: [radius, 220, 680, 1],
      feather: [144, 24, 260, 1],
      showRing: true,
      ringOpacity: [0.18, 0, 0.4, 0.01],
    },
    grid: {
      avatarSize: [58, 28, 96, 1],
      gap: [18, 4, 36, 1],
      rowStep: [70, 32, 120, 1],
      rowOffset: [38, 0, 96, 1],
      jitter: [10, 0, 28, 1],
      bleed: [120, 32, 240, 1],
    },
    falloff: {
      focusInnerPercent: [58, 10, 95, 1],
      minScale: [0.34, 0.1, 1, 0.01],
      minOpacity: [0.08, 0, 1, 0.01],
    },
    motion: {
      drag: [1, 0.4, 1.6, 0.01],
      wheel: [1, 0.2, 1.5, 0.01],
      inertia: [0.91, 0.75, 0.98, 0.001],
      maxSpeed: [48, 4, 120, 1],
    },
  });
  const scene = {
    avatarSize: dials.grid.avatarSize,
    bleed: dials.grid.bleed,
    drag: dials.motion.drag,
    feather: dials.viewport.feather,
    focusInnerPercent: dials.falloff.focusInnerPercent,
    gap: dials.grid.gap,
    inertia: dials.motion.inertia,
    jitter: dials.grid.jitter,
    maxSpeed: dials.motion.maxSpeed,
    minOpacity: dials.falloff.minOpacity,
    minScale: dials.falloff.minScale,
    radius: dials.viewport.radius,
    ringOpacity: dials.viewport.showRing ? dials.viewport.ringOpacity : 0,
    rowOffset: dials.grid.rowOffset,
    rowStep: dials.grid.rowStep,
    wheel: dials.motion.wheel,
  };
  const sceneRef = useRef<SceneSettings>(scene);
  const [isDragging, setIsDragging] = useState(false);

  function stopRenderLoop() {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    lastFrameRef.current = null;
  }

  function requestRender() {
    if (!visibleRef.current || animationFrameRef.current !== null) {
      return;
    }

    animationFrameRef.current = window.requestAnimationFrame(renderFrame);
  }

  function drawScene() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

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
    const spotlightRadius = Math.min(
      settings.radius,
      Math.min(width, height) * 0.47,
    );
    const featherRadius = spotlightRadius + settings.feather;
    const focusInnerRadius =
      spotlightRadius * (settings.focusInnerPercent / 100);
    const stepX = Math.max(settings.avatarSize + settings.gap, 1);
    const stepY = Math.max(settings.rowStep, 1);
    const camera = cameraRef.current;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const glow = ctx.createRadialGradient(
      centerX,
      centerY,
      spotlightRadius * 0.18,
      centerX,
      centerY,
      featherRadius * 1.05,
    );
    glow.addColorStop(0, "rgba(255, 255, 255, 0.62)");
    glow.addColorStop(0.55, "rgba(255, 255, 255, 0.08)");
    glow.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    const worldLeft = camera.x - centerX - settings.bleed - stepX;
    const worldRight = camera.x + centerX + settings.bleed + stepX;
    const worldTop = camera.y - centerY - settings.bleed - stepY;
    const worldBottom = camera.y + centerY + settings.bleed + stepY;
    const rowStart = Math.floor(worldTop / stepY) - 1;
    const rowEnd = Math.ceil(worldBottom / stepY) + 1;

    for (let row = rowStart; row <= rowEnd; row += 1) {
      const rowOffset = row % 2 === 0 ? 0 : settings.rowOffset;
      const colStart = Math.floor((worldLeft - rowOffset) / stepX) - 1;
      const colEnd = Math.ceil((worldRight - rowOffset) / stepX) + 1;

      for (let column = colStart; column <= colEnd; column += 1) {
        const seed = hashCell(column, row);
        const jitterX = (seedUnit(seed, 0) * 2 - 1) * settings.jitter;
        const jitterY = (seedUnit(seed, 10) * 2 - 1) * settings.jitter;
        const worldX = column * stepX + rowOffset + jitterX;
        const worldY = row * stepY + jitterY;
        const x = centerX + worldX - camera.x;
        const y = centerY + worldY - camera.y;
        const distance = Math.hypot(x - centerX, y - centerY);

        if (
          x < -settings.avatarSize ||
          x > width + settings.avatarSize ||
          y < -settings.avatarSize ||
          y > height + settings.avatarSize
        ) {
          continue;
        }

        if (distance > featherRadius + settings.avatarSize) {
          continue;
        }

        const edgeStrength =
          1 -
          clamp(
            (distance - spotlightRadius) / Math.max(settings.feather, 1),
            0,
            1,
          );

        if (edgeStrength <= 0) {
          continue;
        }

        const focusStrength =
          1 -
          clamp(
            (distance - focusInnerRadius) /
              Math.max(spotlightRadius - focusInnerRadius, 1),
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

        drawAvatar(ctx, {
          alpha,
          image: imagesRef.current[seed % USERS.length],
          seed,
          size,
          x,
          y,
        });
      }
    }

    if (settings.ringOpacity > 0) {
      ctx.strokeStyle = `rgba(0, 0, 0, ${settings.ringOpacity})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, spotlightRadius, 0, TAU);
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

    if (!dragRef.current.active) {
      if (reducedMotionRef.current) {
        velocityRef.current.x = 0;
        velocityRef.current.y = 0;
      } else {
        cameraRef.current.x += velocityRef.current.x * deltaFrames;
        cameraRef.current.y += velocityRef.current.y * deltaFrames;

        const damping = Math.pow(sceneRef.current.inertia, deltaFrames);
        velocityRef.current.x *= damping;
        velocityRef.current.y *= damping;

        if (Math.abs(velocityRef.current.x) < 0.01) {
          velocityRef.current.x = 0;
        }

        if (Math.abs(velocityRef.current.y) < 0.01) {
          velocityRef.current.y = 0;
        }
      }
    }

    drawScene();

    if (
      dragRef.current.active ||
      Math.abs(velocityRef.current.x) > 0.01 ||
      Math.abs(velocityRef.current.y) > 0.01
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    viewportRef.current = {
      dpr,
      height,
      width,
    };

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    drawScene();
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
      velocityRef.current.x = 0;
      velocityRef.current.y = 0;
    }

    requestRender();
  }

  function nudgeCamera(dx: number, dy: number) {
    cameraRef.current.x += dx;
    cameraRef.current.y += dy;
    velocityRef.current.x = 0;
    velocityRef.current.y = 0;
    requestRender();
  }

  useEffect(() => {
    sceneRef.current = scene;
    requestRender();
  }, [
    scene.avatarSize,
    scene.bleed,
    scene.drag,
    scene.feather,
    scene.focusInnerPercent,
    scene.gap,
    scene.inertia,
    scene.jitter,
    scene.maxSpeed,
    scene.minOpacity,
    scene.minScale,
    scene.radius,
    scene.ringOpacity,
    scene.rowOffset,
    scene.rowStep,
    scene.wheel,
  ]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncReducedMotion = () => {
      reducedMotionRef.current = media.matches;

      if (media.matches) {
        velocityRef.current.x = 0;
        velocityRef.current.y = 0;
      }

      requestRender();
    };

    const syncVisibility = () => {
      visibleRef.current = !document.hidden;

      if (visibleRef.current) {
        requestRender();
      } else {
        stopRenderLoop();
      }
    };

    syncReducedMotion();
    syncVisibility();
    media.addEventListener("change", syncReducedMotion);
    document.addEventListener("visibilitychange", syncVisibility);

    return () => {
      media.removeEventListener("change", syncReducedMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  useEffect(() => {
    const images = USERS.map((src) => {
      const image = new Image();

      image.decoding = "async";
      image.loading = "eager";
      image.src = src;
      image.onload = () => {
        requestRender();
      };
      image.onerror = () => {
        requestRender();
      };

      return image;
    });

    imagesRef.current = images;
    requestRender();

    return () => {
      images.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
      imagesRef.current = [];
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

    observer.observe(container);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      stopRenderLoop();
    };
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current.active = true;
    dragRef.current.pointerId = event.pointerId;
    dragRef.current.lastX = event.clientX;
    dragRef.current.lastY = event.clientY;
    dragRef.current.lastTime = event.timeStamp;
    velocityRef.current.x = 0;
    velocityRef.current.y = 0;
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

    if (!reducedMotionRef.current) {
      velocityRef.current.x = clamp(
        (-dx * dragMultiplier) / deltaFrames,
        -sceneRef.current.maxSpeed,
        sceneRef.current.maxSpeed,
      );
      velocityRef.current.y = clamp(
        (-dy * dragMultiplier) / deltaFrames,
        -sceneRef.current.maxSpeed,
        sceneRef.current.maxSpeed,
      );
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

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();

    cameraRef.current.x += event.deltaX * sceneRef.current.wheel;
    cameraRef.current.y += event.deltaY * sceneRef.current.wheel;
    velocityRef.current.x = 0;
    velocityRef.current.y = 0;
    requestRender();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 160 : 72;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        nudgeCamera(-step, 0);
        break;
      case "ArrowRight":
        event.preventDefault();
        nudgeCamera(step, 0);
        break;
      case "ArrowUp":
        event.preventDefault();
        nudgeCamera(0, -step);
        break;
      case "ArrowDown":
        event.preventDefault();
        nudgeCamera(0, step);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      aria-describedby="community-canvas-instructions"
      aria-label="Infinite community avatar canvas"
      aria-roledescription="infinite canvas"
      className={`relative h-full min-h-[100svh] w-full overflow-hidden ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      } touch-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black/10`}
      onKeyDown={handleKeyDown}
      onLostPointerCapture={handleLostPointerCapture}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      tabIndex={0}
    >
      <p id="community-canvas-instructions" className="sr-only">
        Drag, scroll, or use the arrow keys to explore the infinite avatar
        field.
      </p>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0.18)_20%,rgba(255,255,255,0)_55%)]" />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_18%,rgba(0,0,0,0.06)_100%)]" />
    </div>
  );
}

function drawAvatar(
  ctx: CanvasRenderingContext2D,
  options: {
    alpha: number;
    image?: HTMLImageElement;
    seed: number;
    size: number;
    x: number;
    y: number;
  },
) {
  const radius = options.size / 2;

  ctx.save();
  ctx.globalAlpha = Math.min(0.22, 0.08 + options.alpha * 0.16);
  ctx.fillStyle = "#111111";
  ctx.beginPath();
  ctx.arc(options.x, options.y, radius + 1.2, 0, TAU);
  ctx.fill();
  ctx.restore();

  if (options.image && options.image.complete && options.image.naturalWidth > 0) {
    ctx.save();
    ctx.globalAlpha = options.alpha;
    ctx.beginPath();
    ctx.arc(options.x, options.y, radius, 0, TAU);
    ctx.clip();
    ctx.drawImage(
      options.image,
      options.x - radius,
      options.y - radius,
      options.size,
      options.size,
    );
    ctx.restore();
    return;
  }

  const hue = 18 + Math.round(seedUnit(options.seed, 6) * 24);
  const saturation = 8 + Math.round(seedUnit(options.seed, 14) * 18);
  const light = 72 - Math.round(seedUnit(options.seed, 22) * 14);
  const fill = ctx.createRadialGradient(
    options.x - options.size * 0.24,
    options.y - options.size * 0.24,
    options.size * 0.12,
    options.x,
    options.y,
    options.size * 0.7,
  );

  fill.addColorStop(
    0,
    `hsla(${hue}, ${saturation}%, ${light + 6}%, ${0.95 * options.alpha})`,
  );
  fill.addColorStop(
    1,
    `hsla(${hue}, ${saturation}%, ${light - 10}%, ${0.58 * options.alpha})`,
  );

  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(options.x, options.y, radius, 0, TAU);
  ctx.fill();
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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
