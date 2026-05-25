import { apiLocal } from '../lib/stormGate';

const storeAPI = {
  // Public. Returns redeem-store catalog (priceType: 'points').
  listItems: async () => {
    const res = await apiLocal.get('/api/store/items');
    return res.data.items;
  },

  // Auth. Atomic spend + create purchase. Returns { balance, purchaseId, downloadsRemaining }.
  redeem: async (productId) => {
    const res = await apiLocal.post('/api/store/redeem', { productId });
    return res.data;
  },

  // Auth. Items the current user has redeemed.
  listMyRedemptions: async () => {
    const res = await apiLocal.get('/api/store/my-redemptions');
    return res.data.items;
  },

  // Auth. Short-lived signed download URL.
  getDownloadUrl: async (productId) => {
    const res = await apiLocal.get(`/api/store/download/${productId}`);
    return res.data;
  },
};

export default storeAPI;
