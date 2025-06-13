import {config} from "dotenv"

config();

export const envConfig = {
     port_number : process.env.PORT,
     database_name: process.env.DATABASE_NAME,
     mongodb_uri: process.env.MONGO_URL,
     node_env: process.env.NODE_ENV,
     access_token_secret: process.env.ACCESS_TOKEN_SECRET,
     access_token_expire: process.env.ACCESS_TOKEN_EXPIRY,
     refresh_token_secret:process.env.REFRESH_TOKEN_SECRET,
     refresh_token_expire: process.env.REFRESH_TOKEN_EXPIRY,

}
