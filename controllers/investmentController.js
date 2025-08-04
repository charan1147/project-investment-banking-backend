import Investment from "../models/Investment.js";

export const getInvestments=async(req,res,next)=>{
try {
    const investment=await Investment.find();
    res.json(investment)
} catch (error) {
    res.status(500).json({message:"internal server error or error in  getInvestement controller"})
    console.log("error in getInvestment controller");
    
}
}

export const addInvestment=async(req,res)=>{
    try {
        const {name,type,minAmount,returnRate}=req.body
        const investment=await Investment.create({name,type,minAmount,returnRate})
        res.json(investment)
    } catch (error) {
            res.status(500).json({message:"internal server error or error in  addInvestement controller"})
    console.log("error in addInvestment controller");
    
    }
}