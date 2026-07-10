import { useEffect } from 'react';

export function useKeyboard(handlers) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const handler = handlers[e.code];
      if (handler) {
        e.preventDefault();
        handler();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlers]);
}
