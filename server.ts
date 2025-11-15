import app from "./app";
import { envConfig } from "./src/config/config";
import connectDB from "./src/database/connect";

connectDB()
.then(()=>{
    app.listen(envConfig.port_number, ()=>{
    console.log(`The server is running in the ${envConfig.port_number} port.`);
});
})
.catch((error)=>{
      console.log("Faild to load the server.",error);
})


