import React from 'react';
import styles from './TestPage.module.css';

const BananaSVG: React.FC = () => (
  <svg
    width="340"
    height="340"
    viewBox="0 0 400 400"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="大香蕉"
    role="img"
    className={styles.banana}
  >
    {/* Shadow */}
    <ellipse cx="210" cy="370" rx="100" ry="14" fill="rgba(0,0,0,0.12)" />

    {/* Banana main body */}
    <path
      d="
        M 65,315
        C 28,255 22,135 100,65
        C 158,12 252,16 310,65
        C 348,93 362,135 345,160
        C 326,188 292,184 272,170
        C 236,148 202,148 192,173
        C 182,198 196,258 212,292
        C 196,314 166,323 142,317
        C 108,308 88,338 65,315
        Z
      "
      fill="#FFE135"
      stroke="#C8960C"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />

    {/* Banana belly shading (inner concave) */}
    <path
      d="
        M 192,173
        C 188,210 196,258 212,292
      "
      fill="none"
      stroke="#C8960C"
      strokeWidth="6"
      strokeLinecap="round"
      opacity="0.45"
    />

    {/* Banana highlight / shine stripe */}
    <path
      d="
        M 86,286
        C 50,228 46,120 118,68
        C 168,30 246,30 298,72
      "
      fill="none"
      stroke="#FFFDE7"
      strokeWidth="11"
      strokeLinecap="round"
      opacity="0.65"
    />

    {/* Subtle shading on outer edge */}
    <path
      d="
        M 65,315
        C 42,278 28,210 38,145
        C 48,85 80,42 118,28
      "
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
  </svg>
);

const TestPage: React.FC = () => {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>🍌 大香蕉测试页</h1>
      <div className={styles.bananaWrap}>
        <BananaSVG />
      </div>
    </main>
  );
};

export default TestPage;
