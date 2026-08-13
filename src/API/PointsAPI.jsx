import { apiLocal } from '../lib/stormGate';

const pointsAPI = {
  // Auth: required. Returns current server-side balance + lifetime totals.
  getBalance: async () => {
    const res = await apiLocal.get('/api/points/balance');
    return res.data;
  },

  // Auth: required. One-shot claim of accumulated localStorage points.
  // Server flags the account so this can only succeed once per user.
  syncOfflinePoints: async (amount) => {
    const res = await apiLocal.post('/api/points/sync', { amount });
    return res.data;
  },

  // Auth: required. Atomic spend; returns 402 if balance insufficient.
  spend: async ({ amount, reason, meta }) => {
    const res = await apiLocal.post('/api/points/spend', { amount, reason, meta });
    return res.data;
  },

  // Auth: required. Credit points from a completed game session.
  earn: async ({ amount, gameId, gameName }) => {
    const res = await apiLocal.post('/api/points/earn', { amount, gameId, gameName });
    return res.data;
  },

  // Public — pack catalog visible before login.
  getPacks: async () => {
    const res = await apiLocal.get('/api/points/packs');
    return res.data.packs;
  },

  // Auth: required. Create a PayPal order for a points pack.
  createPackOrder: async (packId) => {
    const res = await apiLocal.post('/api/points/packs/orders', { packId });
    return res.data;
  },

  // Auth: required. Capture a PayPal order and credit points. Idempotent.
  capturePackOrder: async ({ orderId, packId }) => {
    const res = await apiLocal.post('/api/points/packs/orders/capture', { orderId, packId });
    return res.data;
  },

  // Auth: required. Latest 50 (or up to ?limit=200) transactions.
  getTransactions: async (limit) => {
    const res = await apiLocal.get(`/api/points/transactions${limit ? `?limit=${limit}` : ''}`);
    return res.data;
  },
};

export default pointsAPI;
