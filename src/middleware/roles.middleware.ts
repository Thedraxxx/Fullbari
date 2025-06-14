import {Request, Response, NextFunction} from "express"
import apiError from "../utils/apiErrors"


const isAdmin = (req: Request,res: Response,next: NextFunction) =>{
    if(!req.user || req.user.role !== "admin"){
         throw new apiError(401,"Access Denied. Admin Only")
    }
    next();
}

export default isAdmin;