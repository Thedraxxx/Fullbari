import mongoose from "mongoose";

import { envConfig } from "../config/config";

const connectDB = async ()=>{
try {  console.log(`${envConfig.mongodb_uri}/${envConfig.database_name}`)
        const connectionDB= await mongoose.connect(`${envConfig.mongodb_uri}/${envConfig.database_name}`);

        console.log(`The database is successfully connected at the ${connectionDB.connection.host}`);
        return connectionDB;
    
} catch (error) {
    console.log("Error while connecting to db.",error);
}}
export default connectDB;