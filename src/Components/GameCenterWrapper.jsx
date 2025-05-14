import React, { Suspense, lazy } from 'react';

// Use React.lazy with error boundaries for remote module loading
const GameCenter = lazy(() => {
  return import('game/GameCenter')
    .catch(err => {
      console.error('Error loading Game Center:', err);
      return {
        default: () => (
          <div className="game-center-error">
            <h2>Unable to load Game Center</h2>
            <p>Please make sure the Game Center server is running at http://localhost:3001</p>
            <details>
              <summary>Technical Details</summary>
              <pre>{err.message}</pre>
            </details>
          </div>
        )
      };
    });
});

const GameCenterWrapper = () => {
  return (
    <div className="game-center-wrapper">
      <Suspense fallback={<div className="loading">Loading Game Center...</div>}>
        <GameCenter />
      </Suspense>
    </div>
  );
};

export default GameCenterWrapper;