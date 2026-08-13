import mongoose from "mongoose";

// Newsletter subscribers. Double-opt-in: the row is created with verified=false
// and a short-lived verifyToken. It only flips to verified=true when the user
// clicks the link in the verification email. Broadcasts only go to verified
// rows. Unsubscribe is a separate permanent token so the link in every email
// is stable and doesn't require login.
const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      index: true,
    },
    verifyTokenExpiresAt: {
      type: Date,
    },
    unsubscribeToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    source: {
      // Where they signed up — useful for tracking which CTA converts.
      // e.g. "article-inline", "sidebar", "footer".
      type: String,
      default: "article-inline",
    },
    verifiedAt: {
      type: Date,
    },
    unsubscribedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Subscribers", subscriberSchema);
