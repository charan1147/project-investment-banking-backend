import express from "express"
import { getInvestments,addInvestment } from "../controllers/investmentController.js";
import {protect,admin} from "../middleware/authMiddleware.js"
const router = express.Router();

router.get("/", protect, getInvestments);
router.post("/", protect, admin, addInvestment);

export default router;
