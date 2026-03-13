import React, { useEffect, useRef } from 'react';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const elements = [
      titleRef.current,
      subtitleRef.current,
      ctaRef.current,
    ];

    // Trigger animations after mount
    const timers: ReturnType<typeof setTimeout>[] = [];

    elements.forEach((el, index) => {
      if (!el) return;
      const delays = [0, 150, 300];
      const timer = setTimeout(() => {
        el.classList.add(styles.visible);
      }, delays[index]);
      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Navigate to target route — update href as needed
    window.location.href = '/explore';
  };

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1
          ref={titleRef}
          className={`${styles.title} ${styles.animateItem}`}
        >
          Hello World.
        </h1>
        <p
          ref={subtitleRef}
          className={`${styles.subtitle} ${styles.animateItem}`}
        >
          简单。优雅。从这里开始。
        </p>
        <a
          ref={ctaRef}
          href="/explore"
          className={`${styles.cta} ${styles.animateItem}`}
          onClick={handleCtaClick}
          role="button"
          aria-label="开始探索"
        >
          开始探索
        </a>
      </div>
    </main>
  );
};

export default Home;
