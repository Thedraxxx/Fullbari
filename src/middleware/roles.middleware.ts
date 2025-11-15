import {Request, Response, NextFunction} from "express"
import apiError from "../utils/apiErrors"


const isAdmin = (req: Request,res: Response,next: NextFunction) =>{
    console.log("req user ho hai--", req.user);
    console.log("req user ko role hai ", req.user?.role)
    if(!req.user || req.user?.role !== "admin"){
         throw new apiError(401,"Access Denied. Admin Only")
    }
    next();
}

export default isAdmin;