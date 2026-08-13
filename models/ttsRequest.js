import mongoose from 'mongoose';

// Per-synthesis billing log. One row per successful OpenAI TTS call.
// `chars` is what OpenAI bills on; `model` lets us apply the correct rate.
const ttsRequestSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    chars: { type: Number, required: true, min: 0 },
    model: { type: String, required: true },
  },
  { timestamps: true }
);

ttsRequestSchema.index({ createdAt: -1 });

const TtsRequest = mongoose.model('TtsRequest', ttsRequestSchema);
export default TtsRequest;
