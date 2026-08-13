import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import Products from '../models/product.js';
import ArtPurchases from '../models/artPurchase.js';
import PointsAccounts from '../models/pointsAccount.js';
import PointsTransactions from '../models/pointsTransaction.js';
import Logger from '../utils/logger.js';
import { generateImage, VALID_PROVIDERS, DALLE } from '../utils/imageProviders.js';
import { createOrder as paypalCreateOrder, captureOrder as paypalCaptureOrder, getPublicClientId } from '../utils/paypalClient.js';

// Points/USD rate: $1 = 100 points (matches pack pricing).
const POINTS_PER_USD = Number(process.env.POINTS_PER_USD || 100);

export function priceInPoints(usdPrice) {
  return Math.ceil(Number(usdPrice) * POINTS_PER_USD);
}

dotenv.config();

const logger = new Logger('aiArt');

cloudinary.v2.config({
  cloud_name: process.env.CLOUND_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const AI_ART_FOLDER = 'HoseaCodes/ai-art';
const PNG_PRICE_USD = Number(process.env.AI_ART_PNG_PRICE_USD || 5);
const PREVIEW_WATERMARK_TEXT = 'PREVIEW';

function uploadBufferToCloudinary(buffer, publicIdHint) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder: AI_ART_FOLDER,
        public_id: publicIdHint,
        type: 'private',
        resource_type: 'image',
        format: 'png',
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    uploadStream.end(buffer);
  });
}

function buildPreviewUrl(publicId) {
  return cloudinary.v2.url(publicId, {
    type: 'private',
    sign_url: true,
    secure: true,
    format: 'png',
    transformation: [
      {
        overlay: {
          font_family: 'Arial',
          font_size: 120,
          font_weight: 'bold',
          text: PREVIEW_WATERMARK_TEXT,
        },
        color: 'white',
        opacity: 55,
      },
      { flags: 'layer_apply', gravity: 'center' },
    ],
  });
}

function buildDownloadUrl(publicId) {
  return cloudinary.v2.utils.private_download_url(publicId, 'png', {
    type: 'private',
    expires_at: Math.floor(Date.now() / 1000) + 15 * 60,
    attachment: true,
  });
}

function makePublicIdHint(userId) {
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `aiart_${userId?.slice(-6) || 'anon'}_${stamp}_${rand}`;
}

function truncateTitle(prompt) {
  const cleaned = prompt.trim().replace(/\s+/g, ' ');
  return cleaned.length > 80 ? `${cleaned.slice(0, 77)}...` : cleaned;
}

export async function generatePreview(req, res) {
  try {
    const { prompt, provider = DALLE } = req.body || {};
    if (!VALID_PROVIDERS.includes(provider)) {
      return res.status(400).json({ msg: `Invalid provider. Use one of: ${VALID_PROVIDERS.join(', ')}` });
    }

    logger.info('Generating preview', { provider, userId: req.user?.id });

    const generated = await generateImage({ prompt, provider });

    const publicIdHint = makePublicIdHint(req.user?.id);
    const uploadResult = await uploadBufferToCloudinary(generated.buffer, publicIdHint);

    const productId = `aiart-${uploadResult.public_id.split('/').pop()}`;
    const product = new Products({
      product_id: productId,
      title: truncateTitle(prompt),
      price: PNG_PRICE_USD,
      description: prompt,
      content: generated.revisedPrompt || prompt,
      images: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },
      category: 'ai-art',
      quantity: 1,
      type: 'ai-art',
      tier: 'png',
      aiPrompt: prompt,
      aiModel: generated.model,
      aiSeed: generated.seed,
      creatorUserId: req.user?.id,
    });
    await product.save();

    const previewUrl = buildPreviewUrl(uploadResult.public_id);

    res.json({
      status: 'success',
      product: {
        _id: product._id,
        product_id: product.product_id,
        title: product.title,
        price: product.price,
        prompt,
        model: generated.model,
        previewUrl,
      },
    });
  } catch (err) {
    logger.error('Preview generation failed', { message: err.message, stack: err.stack });
    return res.status(500).json({ msg: err.message || 'AI art generation failed' });
  }
}

export async function getDownloadUrl(req, res) {
  try {
    const { productId } = req.params;
    if (!productId) return res.status(400).json({ msg: 'productId required' });

    const product = await Products.findById(productId);
    if (!product || product.type !== 'ai-art') {
      return res.status(404).json({ msg: 'AI-art product not found' });
    }

    const purchase = await ArtPurchases.findOne({
      userId: req.user.id,
      productId: product._id,
      paymentStatus: 'completed',
    });
    if (!purchase) {
      return res.status(403).json({ msg: 'No completed purchase on record for this artwork' });
    }
    if (purchase.downloadsRemaining <= 0) {
      return res.status(403).json({ msg: 'Download limit reached for this purchase' });
    }
    if (purchase.downloadExpiresAt && purchase.downloadExpiresAt < new Date()) {
      return res.status(403).json({ msg: 'Download window has expired' });
    }

    purchase.downloadsRemaining -= 1;
    await purchase.save();

    const downloadUrl = buildDownloadUrl(product.images.public_id);

    res.json({
      status: 'success',
      downloadUrl,
      expiresInSeconds: 15 * 60,
      downloadsRemaining: purchase.downloadsRemaining,
    });
  } catch (err) {
    logger.error('Download URL generation failed', { message: err.message });
    return res.status(500).json({ msg: err.message });
  }
}

export async function getPaypalConfig(req, res) {
  res.json({
    clientId: getPublicClientId(),
    currency: 'USD',
    env: process.env.PAYPAL_ENV === 'live' ? 'live' : 'sandbox',
  });
}

export async function createOrderForArt(req, res) {
  try {
    const { productId } = req.body || {};
    if (!productId) return res.status(400).json({ msg: 'productId required' });

    const product = await Products.findById(productId);
    if (!product || product.type !== 'ai-art') {
      return res.status(404).json({ msg: 'AI-art product not found' });
    }

    const existing = await ArtPurchases.findOne({
      userId: req.user.id,
      productId: product._id,
      paymentStatus: 'completed',
    });
    if (existing) {
      return res.status(409).json({ msg: 'You already own this artwork', purchaseId: existing._id });
    }

    const order = await paypalCreateOrder({
      amount: product.price,
      currency: 'USD',
      referenceId: String(product._id),
      description: `AI art: ${product.title}`,
    });

    await ArtPurchases.findOneAndUpdate(
      { userId: req.user.id, productId: product._id },
      {
        userId: req.user.id,
        productId: product._id,
        amountPaid: product.price,
        currency: 'USD',
        paymentProvider: 'paypal',
        paymentId: order.id,
        paymentStatus: 'pending',
      },
      { upsert: true, new: true }
    );

    res.json({ status: 'success', orderId: order.id });
  } catch (err) {
    logger.error('PayPal create order failed', { message: err.message, response: err.response?.data });
    return res.status(500).json({ msg: err.response?.data?.message || err.message });
  }
}

export async function captureOrderForArt(req, res) {
  try {
    const { orderId } = req.body || {};
    if (!orderId) return res.status(400).json({ msg: 'orderId required' });

    const purchase = await ArtPurchases.findOne({ paymentId: orderId, userId: req.user.id });
    if (!purchase) {
      return res.status(404).json({ msg: 'No matching pending purchase for this order' });
    }
    if (purchase.paymentStatus === 'completed') {
      return res.json({ status: 'success', purchaseId: purchase._id, alreadyCaptured: true });
    }

    const capture = await paypalCaptureOrder(orderId);
    const captureStatus = capture.status;

    if (captureStatus !== 'COMPLETED') {
      purchase.paymentStatus = 'failed';
      await purchase.save();
      return res.status(402).json({ msg: `PayPal capture status: ${captureStatus}` });
    }

    purchase.paymentStatus = 'completed';
    purchase.downloadExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days to download
    await purchase.save();

    res.json({
      status: 'success',
      purchaseId: purchase._id,
      productId: purchase.productId,
      downloadsRemaining: purchase.downloadsRemaining,
    });
  } catch (err) {
    logger.error('PayPal capture failed', { message: err.message, response: err.response?.data });
    return res.status(500).json({ msg: err.response?.data?.message || err.message });
  }
}

// Atomic "pay with points" path: debits points + creates a completed
// ArtPurchase in one operation. Points spend is the source of truth — if
// the spend succeeds the purchase is guaranteed. If the purchase write
// fails after the spend, the points are refunded.
export async function purchaseWithPoints(req, res) {
  try {
    const { productId } = req.body || {};
    if (!productId) return res.status(400).json({ msg: 'productId required' });

    const product = await Products.findById(productId);
    if (!product || product.type !== 'ai-art') {
      return res.status(404).json({ msg: 'AI-art product not found' });
    }

    const existing = await ArtPurchases.findOne({
      userId: req.user.id,
      productId: product._id,
      paymentStatus: 'completed',
    });
    if (existing) {
      return res.status(409).json({ msg: 'You already own this artwork', purchaseId: existing._id });
    }

    const cost = priceInPoints(product.price);

    // Atomic spend: only succeeds if balance >= cost.
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
          reason: 'ai-art-purchase',
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
      // Roll back the spend so the user isn't charged for nothing.
      await PointsAccounts.findOneAndUpdate(
        { userId: req.user.id },
        { $inc: { balance: cost, lifetimeSpent: -cost } }
      );
      logger.error('Points purchase rollback', { message: purchaseErr.message });
      return res.status(500).json({ msg: 'Purchase failed — points refunded' });
    }
  } catch (err) {
    logger.error('purchaseWithPoints failed', { message: err.message });
    return res.status(500).json({ msg: err.message });
  }
}

export async function listMyPurchases(req, res) {
  try {
    const purchases = await ArtPurchases.find({
      userId: req.user.id,
      paymentStatus: 'completed',
    })
      .sort({ createdAt: -1 })
      .populate({
        path: 'productId',
        select: 'title price images aiPrompt aiModel createdAt',
      })
      .lean();

    const items = purchases.map((p) => ({
      purchaseId: p._id,
      productId: p.productId?._id,
      title: p.productId?.title,
      thumbUrl: p.productId?.images?.public_id ? buildPreviewUrl(p.productId.images.public_id) : null,
      aiPrompt: p.productId?.aiPrompt,
      aiModel: p.productId?.aiModel,
      amountPaid: p.amountPaid,
      currency: p.currency,
      downloadsRemaining: p.downloadsRemaining,
      purchasedAt: p.createdAt,
    }));

    res.json({ status: 'success', items, count: items.length });
  } catch (err) {
    logger.error('List purchases failed', { message: err.message });
    return res.status(500).json({ msg: err.message });
  }
}
