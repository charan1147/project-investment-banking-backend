import express from "express"
import {
  createPayment,
  confirmDeposit,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/create-intent", protect, createPayment);
router.post("/confirm-deposit", protect, confirmDeposit);

export default router;
