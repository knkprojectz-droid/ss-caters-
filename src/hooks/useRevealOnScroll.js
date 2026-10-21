import { useEffect, useRef, useState } from 'react';

export default function useRevealOnScroll() {
  const observerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );

    // Observe all .reveal elements
    document.querySelectorAll('.reveal').forEach((el) => {
      observerRef.current.observe(el);
    });

    setIsReady(true);

    return () => observerRef.current?.disconnect();
  }, [isReady]);

  const refresh = () => setIsReady((p) => !p);
  return refresh;
}
