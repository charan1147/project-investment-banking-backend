import jwt from "jsonwebtoken"
import User from "../models/User.js"


export const protect=async(req,res,next)=>{
    let token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({message:"no token"})

        try {
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=await User.findById(decoded.id).select("-password")
            next()
        } catch (error) {
            res.status(401).json({ message: "Token failed" });
        }
}

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin only" });
  }
};
