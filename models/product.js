import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    images: {
        type: Object,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    checked: {
        type: Boolean,
        default: false,
    },
    sold: {
        type: Number,
        default: 0,
    },
    quantity: {
      type: Number
    },
    type: {
        type: String,
        enum: ['physical', 'ai-art', 'redeem'],
        default: 'physical',
    },
    tier: {
        type: String,
        enum: ['png', 'png_nft'],
        default: 'png',
    },
    // Pricing currency. 'dollars' is the legacy default; 'points' makes
    // the product redeemable in the gamecorner redeem store (/shop/redeem).
    priceType: {
        type: String,
        enum: ['dollars', 'points'],
        default: 'dollars',
        index: true,
    },
    // Cost in points when priceType === 'points'. Ignored otherwise.
    pointsPrice: {
        type: Number,
        default: 0,
        min: 0,
    },
    aiPrompt: String,
    aiModel: String,
    aiSeed: String,
    creatorUserId: String,
}, {
    timestamps: true
})

const Products = mongoose.model("Products", productSchema);

// Products.createIndexes();

export default Products;
