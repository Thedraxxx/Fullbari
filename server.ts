import app from "./app";
import { envConfig } from "./src/config/cofig";

function serverStart(){
    app.listen(envConfig.port_number, ()=>{
    console.log(`The server is running in the ${envConfig.port_number} port.`);
});
}

serverStart();
