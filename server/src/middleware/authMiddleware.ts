import jwt from "jsonwebtoken";
import User from "../model/user";
import e from "express";
import { ICustomRequest } from "./interfaces";



export default async function authenticate(req:e.Request, res:e.Response, next:e.NextFunction) {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, No Token" });
    }

    const decoded:any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    
    const customReq = req as unknown as ICustomRequest; 
   
     customReq.user = await User.findById(decoded?.id).select("-password");

     if (!customReq.user) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    next();
  } catch (error) {
    console.error("Error in authenticate middleware:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
}
