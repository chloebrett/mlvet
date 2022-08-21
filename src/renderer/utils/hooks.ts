import { useDebounce } from '@react-hook/debounce';
import { useEffect } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useWindowResizer = (
  handler: (newWindowSize: { width: number; height: number }) => void
) => {
  const [windowSize, setWindowSize] = useDebounce(
    { width: window.innerWidth, height: window.innerHeight },
    0.1
  );

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [setWindowSize]);

  useEffect(() => handler(windowSize), [windowSize, handler]);
};