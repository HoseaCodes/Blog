import React, { lazy, Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const UbuntuEasterEgg = lazy(() => import('./UbuntuEasterEgg'));

const UbuntuEasterEggMount = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const open = () => setActive(true);
    window.addEventListener('hoseacodes:ubuntu-open', open);
    return () => window.removeEventListener('hoseacodes:ubuntu-open', open);
  }, []);

  if (!active) return null;

  return ReactDOM.createPortal(
    <Suspense fallback={null}>
      <UbuntuEasterEgg onShutDown={() => setActive(false)} />
    </Suspense>,
    document.body
  );
};

export default UbuntuEasterEggMount;
