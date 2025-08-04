import dotenv from "dotenv";
dotenv.config(); 
import Razorpay from "razorpay";
import crypto from "crypto"; 
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createPayment = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: options.amount,
      currency: options.currency,
    });
  } catch (error) {
    console.error("Razorpay Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error in createPayment controller" });
  }
};

export const confirmDeposit = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { amount, orderId, paymentId, signature } = req.body;
    const userId = req.user._id;

    if (!amount || !orderId || !paymentId || !signature) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid payment details" });
    }

    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    await User.findByIdAndUpdate(
      userId,
      { $inc: { balance: amount } },
      { session }
    );
    await Payment.create(
      [{ userId, type: "deposit", amount, status: "completed" }],
      { session }
    );

    await session.commitTransaction();
    res.json({ message: "Deposit successful" });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error in confirmDeposit controller", error.message);
    res
      .status(500)
      .json({ message: "Internal server error in confirmDeposit controller" });
  } finally {
    session.endSession();
  }
};
