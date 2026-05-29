import { apiLocal } from '../lib/stormGate';

const aiArtAPI = {
  generatePreview: async ({ prompt, provider }) => {
    const res = await apiLocal.post('/api/ai-art/preview', { prompt, provider });
    return res.data.product;
  },
  createOrder: async (productId) => {
    const res = await apiLocal.post('/api/ai-art/orders', { productId });
    return res.data.orderId;
  },
  captureOrder: async (orderId) => {
    const res = await apiLocal.post('/api/ai-art/orders/capture', { orderId });
    return res.data;
  },
  getDownloadUrl: async (productId) => {
    const res = await apiLocal.get(`/api/ai-art/download/${productId}`);
    return res.data;
  },
  listMyPurchases: async () => {
    const res = await apiLocal.get('/api/ai-art/my-purchases');
    return res.data;
  },
  getPaypalConfig: async () => {
    const res = await apiLocal.get('/api/ai-art/paypal-config');
    return res.data;
  },
  purchaseWithPoints: async (productId) => {
    const res = await apiLocal.post('/api/ai-art/purchase-with-points', { productId });
    return res.data;
  },
};

export default aiArtAPI;
