import React, { lazy, Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const PlanetsEasterEgg = lazy(() => import('./PlanetsEasterEgg'));

const PlanetsEasterEggMount = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const open = () => setActive(true);
    window.addEventListener('hoseacodes:planets-open', open);
    return () => window.removeEventListener('hoseacodes:planets-open', open);
  }, []);

  if (!active) return null;

  return ReactDOM.createPortal(
    <Suspense fallback={null}>
      <PlanetsEasterEgg onShutDown={() => setActive(false)} />
    </Suspense>,
    document.body
  );
};

export default PlanetsEasterEggMount;
