import React, { useEffect, useState } from 'react';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed',
        right: '1rem',
        bottom: '1rem',
        background: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1rem',
        borderRadius: '999px',
        boxShadow: 'var(--shadow)',
        cursor: 'pointer',
        zIndex: 1000
      }}
    >
      ↑ Top
    </button>
  );
};

export default BackToTop;


