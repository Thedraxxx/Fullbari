import {config} from "dotenv"

config();

export const envConfig = {
     port_number : process.env.PORT,
     database_name: process.env.DATABASE_NAME,
     mongodb_uri: process.env.MONGO_URL,
     node_env: process.env.NODE_ENV
}
