import React, { useEffect, useState } from 'react';

const ScreenProtector = ({ children }) => {
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => setIsBlurred(false);
    const handleVisibilityChange = () => {
      if (document.hidden) setIsBlurred(true);
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div style={{
      filter: isBlurred ? 'blur(20px)' : 'none',
      transition: 'filter 0.2s ease',
      pointerEvents: isBlurred ? 'none' : 'auto'
    }}>
      {children} {/* এর ভেতরেই আপনার মূল পেজের কোডগুলো অটোমেটিক চলে আসবে */}
    </div>
  );
};

export default ScreenProtector;
