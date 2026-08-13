import React, { lazy, Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const MacEasterEgg = lazy(() => import('./MacEasterEgg'));

const MacEasterEggMount = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const open = () => setActive(true);
    window.addEventListener('hoseacodes:mac-open', open);
    return () => window.removeEventListener('hoseacodes:mac-open', open);
  }, []);

  if (!active) return null;

  return ReactDOM.createPortal(
    <Suspense fallback={null}>
      <MacEasterEgg onShutDown={() => setActive(false)} />
    </Suspense>,
    document.body
  );
};

export default MacEasterEggMount;
