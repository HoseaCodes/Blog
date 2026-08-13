import express from "express";
import auth from "../utils/auth.js";
import authAdmin from "../utils/authAdmin.js";
import {
  signup,
  verify,
  unsubscribe,
  broadcast,
  list,
} from "../controllers/subscriber.js";

const router = express.Router();

// Public endpoints
router.post("/", signup);
router.get("/verify/:token", verify);
router.get("/unsubscribe/:token", unsubscribe);

// Admin endpoints — must be authenticated AND have role=1/"admin"
router.get("/", auth, authAdmin, list);
router.post("/broadcast/:articleId", auth, authAdmin, broadcast);

export default router;
