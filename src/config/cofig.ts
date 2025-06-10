import {config} from "dotenv"

config();

export const envConfig = {
     port_number : process.env.PORT
}
