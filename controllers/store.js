import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import Products from '../models/product.js';
import ArtPurchases from '../models/artPurchase.js';
import PointsAccounts from '../models/pointsAccount.js';
import PointsTransactions from '../models/pointsTransaction.js';
import Logger from '../utils/logger.js';

dotenv.config();
const logger = new Logger('store');

cloudinary.v2.config({
  cloud_name: process.env.CLOUND_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Build a downloadable URL for an item the user has redeemed. Tries signed
// private Cloudinary URL first (works for private uploads); falls back to
// the public secure_url for items uploaded via the standard product flow.
// Handles both shapes: AI art uses { public_id }, standard uploads use { id }.
function buildDownloadUrlFor(images) {
  if (!images) return null;
  const publicId = images.public_id || images.id;
  if (publicId) {
    try {
      return cloudinary.v2.utils.private_download_url(publicId, 'png', {
        type: 'private',
        expires_at: Math.floor(Date.now() / 1000) + 15 * 60,
        attachment: true,
      });
    } catch (err) {
      logger.warn('Falling back to public URL for download', { message: err.message });
    }
  }
  return images.url || images.secure_url || null;
}

// Public: browse the redeem catalog. No auth required so unauthenticated
// users can window-shop before logging in.
export async function listStoreItems(req, res) {
  try {
    const items = await Products.find({
      priceType: 'points',
      pointsPrice: { $gt: 0 },
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      status: 'success',
      items: items.map((p) => ({
        _id: p._id,
        product_id: p.product_id,
        title: p.title,
        description: p.description,
        pointsPrice: p.pointsPrice,
        coverUrl: p.images?.url || p.images?.secure_url || null,
        category: p.category,
        type: p.type,
        createdAt: p.createdAt,
      })),
      count: items.length,
    });
  } catch (err) {
    logger.error('listStoreItems failed', { message: err.message });
    res.status(500).json({ msg: err.message });
  }
}

// Auth required. Atomic redeem: debit points + create completed purchase.
// Reuses ArtPurchases collection with paymentProvider: 'points'.
export async function redeemItem(req, res) {
  try {
    const { productId } = req.body || {};
    if (!productId) return res.status(400).json({ msg: 'productId required' });

    const product = await Products.findById(productId);
    if (!product) return res.status(404).json({ msg: 'Item not found' });
    if (product.priceType !== 'points' || product.pointsPrice <= 0) {
      return res.status(400).json({ msg: 'Item is not redeemable with points' });
    }

    const existing = await ArtPurchases.findOne({
      userId: req.user.id,
      productId: product._id,
      paymentStatus: 'completed',
    });
    if (existing) {
      return res
        .status(409)
        .json({ msg: 'You already own this item', purchaseId: existing._id });
    }

    const cost = product.pointsPrice;

    const account = await PointsAccounts.findOne({ userId: req.user.id });
    if (!account || account.balance < cost) {
      return res.status(402).json({
        msg: 'Insufficient points',
        balance: account?.balance || 0,
        required: cost,
      });
    }

    const debited = await PointsAccounts.findOneAndUpdate(
      { userId: req.user.id, balance: { $gte: cost } },
      { $inc: { balance: -cost, lifetimeSpent: cost } },
      { new: true }
    );
    if (!debited) {
      return res.status(402).json({ msg: 'Insufficient points', required: cost });
    }

    try {
      const purchase = await ArtPurchases.findOneAndUpdate(
        { userId: req.user.id, productId: product._id },
        {
          userId: req.user.id,
          productId: product._id,
          amountPaid: 0,
          currency: 'USD',
          paymentProvider: 'points',
          paymentId: `points:${req.user.id}:${product._id}:${Date.now()}`,
          paymentStatus: 'completed',
          downloadExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        { upsert: true, new: true }
      );

      await PointsTransactions.create({
        userId: req.user.id,
        type: 'spend',
        amount: cost,
        balanceAfter: debited.balance,
        meta: {
          reason: 'store-redeem',
          productId: String(product._id),
          purchaseId: String(purchase._id),
        },
      });

      return res.json({
        status: 'success',
        purchaseId: purchase._id,
        productId: product._id,
        balance: debited.balance,
        downloadsRemaining: purchase.downloadsRemaining,
      });
    } catch (purchaseErr) {
      await PointsAccounts.findOneAndUpdate(
        { userId: req.user.id },
        { $inc: { balance: cost, lifetimeSpent: -cost } }
      );
      logger.error('Redeem rollback', { message: purchaseErr.message });
      return res.status(500).json({ msg: 'Redeem failed — points refunded' });
    }
  } catch (err) {
    logger.error('redeemItem failed', { message: err.message });
    res.status(500).json({ msg: err.message });
  }
}

// Auth required. Items the current user has redeemed (or paid for).
// Filters to redeem-store items (paymentProvider: 'points') for clarity.
export async function listMyRedemptions(req, res) {
  try {
    const purchases = await ArtPurchases.find({
      userId: req.user.id,
      paymentStatus: 'completed',
      paymentProvider: 'points',
    })
      .sort({ createdAt: -1 })
      .populate({
        path: 'productId',
        select: 'title description images type pointsPrice createdAt',
      })
      .lean();

    const items = purchases
      .filter((p) => p.productId) // skip orphans
      .map((p) => ({
        purchaseId: p._id,
        productId: p.productId._id,
        title: p.productId.title,
        description: p.productId.description,
        type: p.productId.type,
        pointsSpent: p.productId.pointsPrice,
        coverUrl: p.productId.images?.url || null,
        downloadsRemaining: p.downloadsRemaining,
        redeemedAt: p.createdAt,
      }));

    res.json({ status: 'success', items, count: items.length });
  } catch (err) {
    logger.error('listMyRedemptions failed', { message: err.message });
    res.status(500).json({ msg: err.message });
  }
}

// Auth required. Generates a short-lived signed download URL for an
// already-redeemed item. Mirrors the AI art download flow.
export async function getRedemptionDownload(req, res) {
  try {
    const { productId } = req.params;
    if (!productId) return res.status(400).json({ msg: 'productId required' });

    const product = await Products.findById(productId);
    if (!product) return res.status(404).json({ msg: 'Item not found' });

    const purchase = await ArtPurchases.findOne({
      userId: req.user.id,
      productId: product._id,
      paymentStatus: 'completed',
    });
    if (!purchase) return res.status(403).json({ msg: 'No completed redemption on record' });
    if (purchase.downloadsRemaining <= 0) {
      return res.status(403).json({ msg: 'Download limit reached' });
    }
    if (purchase.downloadExpiresAt && purchase.downloadExpiresAt < new Date()) {
      return res.status(403).json({ msg: 'Download window has expired' });
    }

    purchase.downloadsRemaining -= 1;
    await purchase.save();

    const downloadUrl = buildDownloadUrlFor(product.images);
    if (!downloadUrl) return res.status(500).json({ msg: 'No asset URL available' });

    res.json({
      status: 'success',
      downloadUrl,
      expiresInSeconds: 15 * 60,
      downloadsRemaining: purchase.downloadsRemaining,
    });
  } catch (err) {
    logger.error('getRedemptionDownload failed', { message: err.message });
    res.status(500).json({ msg: err.message });
  }
}
