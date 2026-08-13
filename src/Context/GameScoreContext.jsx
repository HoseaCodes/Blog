import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { GlobalState } from '../GlobalState';
import pointsAPI from '../API/PointsAPI';

const GameScoreContext = createContext();

export const useGameScore = () => {
  const context = useContext(GameScoreContext);
  if (!context) {
    throw new Error('useGameScore must be used within a GameScoreProvider');
  }
  return context;
};

const LS_POINTS_KEY = 'gameCornerPoints';

const emptyOfflinePoints = () => ({
  balance: 0,
  earned: 0,
  spent: 0,
  transactions: [],
});

const readOfflinePoints = () => {
  try {
    const saved = localStorage.getItem(LS_POINTS_KEY);
    return saved ? JSON.parse(saved) : emptyOfflinePoints();
  } catch {
    return emptyOfflinePoints();
  }
};

export const GameScoreProvider = ({ children }) => {
  // --- Score / leaderboard state (unchanged — localStorage only) ---
  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem('gameScores');
    return saved ? JSON.parse(saved) : {};
  });
  const [totalScore, setTotalScore] = useState(() => {
    const saved = localStorage.getItem('totalScore');
    return saved ? JSON.parse(saved) : 0;
  });
  const [highScores, setHighScores] = useState(() => {
    const saved = localStorage.getItem('highScores');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Offline (anonymous) points — source of truth while logged out ---
  const [offlinePoints, setOfflinePoints] = useState(readOfflinePoints);

  // --- Server-side points state, populated on login ---
  // null = not yet fetched (or logged out)
  const [serverPoints, setServerPoints] = useState(null);
  const [pointsLoading, setPointsLoading] = useState(false);
  const [pointsError, setPointsError] = useState(null);

  // --- Buy-points modal open/close (lifted so any component can trigger it) ---
  const [buyPointsModalOpen, setBuyPointsModalOpen] = useState(false);
  const openBuyPoints = useCallback(() => setBuyPointsModalOpen(true), []);
  const closeBuyPoints = useCallback(() => setBuyPointsModalOpen(false), []);

  // Auth state — drives which source is canonical.
  const globalState = useContext(GlobalState);
  const isLoggedIn = !!globalState?.userAPI?.isLoggedIn?.[0];

  // Persist localStorage caches
  useEffect(() => {
    localStorage.setItem('gameScores', JSON.stringify(scores));
  }, [scores]);
  useEffect(() => {
    localStorage.setItem('highScores', JSON.stringify(highScores));
  }, [highScores]);
  useEffect(() => {
    localStorage.setItem('totalScore', JSON.stringify(totalScore));
  }, [totalScore]);
  useEffect(() => {
    localStorage.setItem(LS_POINTS_KEY, JSON.stringify(offlinePoints));
  }, [offlinePoints]);

  // Fetch server balance whenever the user logs in. Clear on logout.
  useEffect(() => {
    let cancelled = false;
    if (!isLoggedIn) {
      setServerPoints(null);
      setPointsError(null);
      return undefined;
    }
    setPointsLoading(true);
    setPointsError(null);
    pointsAPI
      .getBalance()
      .then((data) => {
        if (cancelled) return;
        setServerPoints({
          balance: data.balance,
          lifetimeEarned: data.lifetimeEarned,
          lifetimeSpent: data.lifetimeSpent,
          lifetimePurchased: data.lifetimePurchased,
          claimedOffline: data.claimedOffline,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setPointsError(err.response?.data?.msg || err.message || 'Failed to load balance');
      })
      .finally(() => {
        if (!cancelled) setPointsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  // ----- Mutations -----

  const pushOfflineTx = (entry, prev) => {
    const next = [
      { ...entry, at: new Date().toISOString() },
      ...(prev.transactions || []),
    ].slice(0, 50);
    return next;
  };

  // Award points (fire-and-forget). Routes to server when logged in,
  // localStorage otherwise. Errors are swallowed — the UI will see a
  // temporary mismatch until next balance fetch, but won't break.
  const creditPoints = useCallback(
    (amount, meta = {}) => {
      if (!amount || amount <= 0) return;
      const safe = Math.floor(amount);
      if (isLoggedIn) {
        pointsAPI
          .earn({ amount: safe, gameId: meta.gameId, gameName: meta.gameName })
          .then((data) => {
            setServerPoints((prev) => ({
              ...(prev || {}),
              balance: data.balance,
              lifetimeEarned: (prev?.lifetimeEarned || 0) + safe,
            }));
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.warn('Points earn failed (will reconcile on next fetch):', err.message);
          });
        return;
      }
      setOfflinePoints((prev) => ({
        balance: prev.balance + safe,
        earned: prev.earned + safe,
        spent: prev.spent,
        transactions: pushOfflineTx({ type: 'earn', amount: safe, ...meta }, prev),
      }));
    },
    [isLoggedIn]
  );

  // Spend points. Returns Promise<{ ok: boolean, balance: number, msg?: string }>.
  // Server-side mode performs an atomic spend; insufficient-balance returns ok:false.
  const debitPoints = useCallback(
    async (amount, meta = {}) => {
      const safe = Math.floor(amount);
      if (!Number.isFinite(safe) || safe <= 0) {
        return { ok: false, balance: 0, msg: 'Invalid amount' };
      }
      const reason = meta.reason || 'spend';

      if (isLoggedIn) {
        try {
          const data = await pointsAPI.spend({ amount: safe, reason, meta });
          setServerPoints((prev) => ({
            ...(prev || {}),
            balance: data.balance,
            lifetimeSpent: (prev?.lifetimeSpent || 0) + safe,
          }));
          return { ok: true, balance: data.balance };
        } catch (err) {
          const status = err.response?.status;
          const msg = err.response?.data?.msg || err.message;
          if (status === 402 && err.response?.data?.balance != null) {
            setServerPoints((prev) => ({ ...(prev || {}), balance: err.response.data.balance }));
          }
          return { ok: false, balance: err.response?.data?.balance || 0, msg };
        }
      }

      // Anonymous mode — localStorage spend.
      if (offlinePoints.balance < safe) {
        return { ok: false, balance: offlinePoints.balance, msg: 'Insufficient points' };
      }
      let nextBalance = offlinePoints.balance;
      setOfflinePoints((prev) => {
        if (prev.balance < safe) return prev;
        nextBalance = prev.balance - safe;
        return {
          balance: nextBalance,
          earned: prev.earned,
          spent: prev.spent + safe,
          transactions: pushOfflineTx({ type: 'spend', amount: safe, reason, ...meta }, prev),
        };
      });
      return { ok: true, balance: nextBalance };
    },
    [isLoggedIn, offlinePoints]
  );

  // One-shot claim of localStorage points after first login.
  const claimOfflinePoints = useCallback(async () => {
    if (!isLoggedIn) return { ok: false, msg: 'Not logged in' };
    const amount = offlinePoints.balance;
    if (amount <= 0) return { ok: false, msg: 'Nothing to claim' };
    try {
      const data = await pointsAPI.syncOfflinePoints(amount);
      setServerPoints((prev) => ({
        ...(prev || {}),
        balance: data.balance,
        claimedOffline: true,
      }));
      const fresh = emptyOfflinePoints();
      setOfflinePoints(fresh);
      localStorage.setItem(LS_POINTS_KEY, JSON.stringify(fresh));
      return { ok: true, credited: data.credited, balance: data.balance };
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.msg || err.message;
      if (status === 409) {
        // Server says already claimed — wipe local stash so we don't keep nagging.
        const fresh = emptyOfflinePoints();
        setOfflinePoints(fresh);
        localStorage.setItem(LS_POINTS_KEY, JSON.stringify(fresh));
        setServerPoints((prev) => ({ ...(prev || {}), claimedOffline: true }));
      }
      return { ok: false, msg };
    }
  }, [isLoggedIn, offlinePoints.balance]);

  const refreshBalance = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const data = await pointsAPI.getBalance();
      setServerPoints({
        balance: data.balance,
        lifetimeEarned: data.lifetimeEarned,
        lifetimeSpent: data.lifetimeSpent,
        lifetimePurchased: data.lifetimePurchased,
        claimedOffline: data.claimedOffline,
      });
    } catch (err) {
      setPointsError(err.response?.data?.msg || err.message);
    }
  }, [isLoggedIn]);

  // ----- Score tracking (unchanged) -----

  const updateGameScore = (gameId, gameName, newScore, gameTime) => {
    if (newScore > 0) {
      creditPoints(newScore, { gameId, gameName, gameTime });
    }
    setScores((prevScores) => {
      const currentGameScores = prevScores[gameId] || {
        gameName,
        highScore: 0,
        totalPlays: 0,
        averageScore: 0,
        bestTime: null,
        lastPlayed: null,
      };
      const updatedGameScores = {
        gameName,
        highScore: Math.max(currentGameScores.highScore, newScore),
        totalPlays: currentGameScores.totalPlays + 1,
        averageScore:
          (currentGameScores.averageScore * currentGameScores.totalPlays + newScore) /
          (currentGameScores.totalPlays + 1),
        bestTime:
          currentGameScores.bestTime === null
            ? gameTime
            : Math.min(currentGameScores.bestTime, gameTime),
        lastPlayed: new Date().toISOString(),
      };
      const updatedScores = { ...prevScores, [gameId]: updatedGameScores };
      const newTotal = Object.values(updatedScores).reduce(
        (sum, game) => sum + (game.highScore || 0),
        0
      );
      setTotalScore(newTotal);
      return updatedScores;
    });
    updateHighScores(gameId, gameName, newScore, gameTime);
  };

  const updateHighScores = (gameId, gameName, score, time) => {
    const newEntry = { gameId, gameName, score, time, date: new Date().toISOString() };
    setHighScores((prev) => [...prev, newEntry].sort((a, b) => b.score - a.score).slice(0, 20));
  };

  const getGameStats = (gameId) => scores[gameId] || null;
  const getGameLeaderboard = (gameId) =>
    highScores.filter((entry) => entry.gameId === gameId).slice(0, 10);
  const getAllTimeHighScores = () => highScores.slice(0, 10);

  const resetAllScores = () => {
    setScores({});
    setTotalScore(0);
    setHighScores([]);
    localStorage.removeItem('gameScores');
    localStorage.removeItem('highScores');
    localStorage.removeItem('totalScore');
  };

  const resetGameScores = (gameId) => {
    setScores((prevScores) => {
      const updatedScores = { ...prevScores };
      delete updatedScores[gameId];
      const newTotal = Object.values(updatedScores).reduce(
        (sum, game) => sum + (game.highScore || 0),
        0
      );
      setTotalScore(newTotal);
      return updatedScores;
    });
    setHighScores((prev) => prev.filter((entry) => entry.gameId !== gameId));
  };

  // ----- Derived ----

  const pointsBalance = isLoggedIn && serverPoints ? serverPoints.balance : offlinePoints.balance;
  const showClaimCTA =
    isLoggedIn &&
    !!serverPoints &&
    serverPoints.claimedOffline === false &&
    offlinePoints.balance > 0;

  const value = {
    // Score / leaderboard
    scores,
    totalScore,
    highScores,
    updateGameScore,
    getGameStats,
    getGameLeaderboard,
    getAllTimeHighScores,
    resetAllScores,
    resetGameScores,

    // Points (hybrid: server when logged in, localStorage otherwise)
    pointsBalance,
    isLoggedIn,
    serverPoints,
    offlinePoints,
    pointsLoading,
    pointsError,
    creditPoints,
    debitPoints,
    refreshBalance,

    // Offline claim flow
    showClaimCTA,
    offlineClaimableAmount: offlinePoints.balance,
    claimOfflinePoints,

    // Buy-points modal
    buyPointsModalOpen,
    openBuyPoints,
    closeBuyPoints,
  };

  return <GameScoreContext.Provider value={value}>{children}</GameScoreContext.Provider>;
};
