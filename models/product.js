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
        enum: ['physical', 'ai-art'],
        default: 'physical',
    },
    tier: {
        type: String,
        enum: ['png', 'png_nft'],
        default: 'png',
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
