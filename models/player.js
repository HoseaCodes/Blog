import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({

    user_id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },
    paymentID: {
        type: String,
        required: true
    },
    rank: {
        type: Number,
        required: true
    },
    badges: [{
        name: { type: String, default: "New Badge" },
        points: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now() },
    }],
    status: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true
    })

const Player = mongoose.model("Payment", playerSchema);

Player.createIndexes();

export default Player;
