import jwt from "jsonwebtoken";
import Veterinary from "../models/Veterinary.js";
export default async function checkAuth(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.vet = await Veterinary.findById(decoded.id).select(
        "-password -token -confirm"
      );
      
      return next();
    } catch (error) {
      const e = new Error("Invalid token!");
      res.status(403).json({ message: e.message });
    }
  }
  if (!token) {
    const error = new Error("Invalid token!");
    res.status(403).json({ message: error.message });
  }
  next();
}