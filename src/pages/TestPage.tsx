import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import styles from './TestPage.module.css';

/** The banana body path used across all layers */
const BANANA_BODY =
  'M 65,315 C 28,255 22,135 100,65 C 158,12 252,16 310,65 C 348,93 362,135 345,160 C 326,188 292,184 272,170 C 236,148 202,148 192,173 C 182,198 196,258 212,292 C 196,314 166,323 142,317 C 108,308 88,338 65,315 Z';

/** Number of slices used to build the banana's thickness */
const DEPTH_SLICES = 14;
/** Total depth in CSS px (translateZ range) */
const TOTAL_DEPTH = 36;

/**
 * A single banana SVG slice.
 * @param variant  "front" | "side" | "back" controls colours / details shown
 * @param opacity  layer opacity for side slices
 */
const BananaSlice: React.FC<{
  variant: 'front' | 'side' | 'back';
  fillColor: string;
  strokeColor: string;
  opacity?: number;
  showDetails?: boolean;
}> = ({ variant, fillColor, strokeColor, opacity = 1, showDetails = false }) => (
  <svg
    width="340"
    height="340"
    viewBox="0 0 400 400"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={variant !== 'front'}
    {...(variant === 'front' ? { 'aria-label': '大香蕉', role: 'img' } : {})}
    className={styles.banana}
    style={{ opacity }}
  >
    {/* Shadow — only on the back-most layer */}
    {variant === 'back' && (
      <ellipse cx="210" cy="370" rx="100" ry="14" fill="rgba(0,0,0,0.12)" />
    )}

    {/* Banana main body */}
    <path
      d={BANANA_BODY}
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth="3.5"
      strokeLinejoin="round"
    />

    {/* Extra details only on the front face */}
    {showDetails && (
      <>
        {/* Banana belly shading (inner concave) */}
        <path
          d="M 192,173 C 188,210 196,258 212,292"
          fill="none"
          stroke="#C8960C"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.45"
        />

        {/* Highlight / shine stripe */}
        <path
          d="M 86,286 C 50,228 46,120 118,68 C 168,30 246,30 298,72"
          fill="none"
          stroke="#FFFDE7"
          strokeWidth="11"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* Subtle shading on outer edge */}
        <path
          d="M 65,315 C 42,278 28,210 38,145 C 48,85 80,42 118,28"
          fill="none"
          stroke="#C8960C"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.2"
        />

        {/* Left tip accent */}
        <path
          d="M 65,315 C 55,325 50,340 58,348 C 66,356 78,345 82,332"
          fill="#FFD600"
          stroke="#C8960C"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Stem */}
        <path
          d="M 310,65 C 322,50 328,32 318,22 C 310,14 298,16 294,24"
          fill="none"
          stroke="#6D4C0F"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Stem knob */}
        <circle cx="294" cy="26" r="5" fill="#8B5E10" />
      </>
    )}
  </svg>
);

/**
 * Linearly interpolate between two hex colours.
 */
function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const ca = parse(a);
  const cb = parse(b);
  const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
  const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
  return `#${[r, g, bl].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** Sensitivity: degrees per pixel of mouse movement */
const SENSITIVITY = 0.5;
/** X-axis rotation clamp range */
const X_CLAMP = 45;

const TestPage: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [dragging, setDragging] = useState(false);

  const lastPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };

      setRotateY((prev) => prev + dx * SENSITIVITY);
      setRotateX((prev) => {
        const next = prev - dy * SENSITIVITY;
        return Math.max(-X_CLAMP, Math.min(X_CLAMP, next));
      });
    },
    [dragging],
  );

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const preventScroll = (e: TouchEvent) => e.preventDefault();
    document.addEventListener('touchmove', preventScroll, { passive: false });
    return () => document.removeEventListener('touchmove', preventScroll);
  }, [dragging]);

  /** Pre-compute the array of depth slices (back → front) */
  const slices = useMemo(() => {
    const arr: {
      key: number;
      z: number;
      fillColor: string;
      strokeColor: string;
      opacity: number;
      variant: 'front' | 'side' | 'back';
      showDetails: boolean;
    }[] = [];

    for (let i = 0; i < DEPTH_SLICES; i++) {
      const t = i / (DEPTH_SLICES - 1); // 0 → 1 (back → front)
      const z = -TOTAL_DEPTH / 2 + t * TOTAL_DEPTH;

      const isBack = i === 0;
      const isFront = i === DEPTH_SLICES - 1;

      // Colour gradient: darker at back, brighter at front
      const fillColor = lerpColor('#C8960C', '#FFE135', t);
      const strokeColor = lerpColor('#8B6508', '#C8960C', t);

      arr.push({
        key: i,
        z,
        fillColor,
        strokeColor,
        opacity: isFront || isBack ? 1 : 0.92,
        variant: isFront ? 'front' : isBack ? 'back' : 'side',
        showDetails: isFront,
      });
    }
    return arr;
  }, []);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>🍌 大香蕉测试页</h1>
      <p className={styles.hint}>拖拽旋转 · 3D 香蕉</p>
      <div
        ref={wrapRef}
        className={`${styles.bananaWrap} ${dragging ? styles.dragging : ''}`}
        style={{
          transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: dragging ? 'none' : 'transform 0.05s ease-out',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* 3D banana: stacked layers from back to front */}
        <div className={styles.banana3d}>
          {slices.map((s) => (
            <div
              key={s.key}
              className={styles.bananaLayer}
              style={{ transform: `translateZ(${s.z}px)` }}
            >
              <BananaSlice
                variant={s.variant}
                fillColor={s.fillColor}
                strokeColor={s.strokeColor}
                opacity={s.opacity}
                showDetails={s.showDetails}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default TestPage;
