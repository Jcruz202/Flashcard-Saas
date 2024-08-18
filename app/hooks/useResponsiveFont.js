'use client';

import { useState, useEffect, useRef } from 'react';

export function useResponsiveFont(initialSize = 16) {
  const [fontSize, setFontSize] = useState(initialSize);
  const textRef = useRef(null);

  useEffect(() => {
    const adjustFontSize = () => {
      if (textRef.current) {
        let size = initialSize;
        textRef.current.style.fontSize = `${size}px`;
        
        while (textRef.current.scrollHeight > textRef.current.clientHeight && size > 8) {
          size--;
          textRef.current.style.fontSize = `${size}px`;
        }
        
        setFontSize(size);
      }
    };

    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);
    return () => window.removeEventListener('resize', adjustFontSize);
  }, [initialSize]);

  return [fontSize, textRef];
}