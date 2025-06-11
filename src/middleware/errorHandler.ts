import apiError from "../utils/apiErrors";
import { envConfig } from "../config/cofig";
import {ErrorRequestHandler} from "express"
const errorHandler: ErrorRequestHandler = (err,req,res,next)=>{
    console.log("The error is caught by middleware: ", err)
     if(err instanceof apiError){
        res.status(err.statusCode).json({
            statuscode: err.statusCode,
            message: err.message,
            data: err.data,
            success: err.success,
            error: err.error,
            stack: envConfig.node_env === "development"? err.stack: undefined
        })
          return;
     }
     
     res.status(500).json({
        statusCode: 500,
        data: null,
        message: "Enternal Server Error",
        error: [],
        success: false,
        stack: envConfig.node_env === "development"? err.stack : undefined
     })
     return;
}


export default errorHandler;