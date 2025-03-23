import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

function useScreenSize() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const checkScreenSize = () => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []); 
  return isMobile;
}

export default useScreenSize;
