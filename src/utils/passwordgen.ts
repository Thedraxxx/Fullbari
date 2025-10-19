import bcrypt from "bcrypt";
import { envConfig } from "../config/cofig";
 async function hashPassword() {
    const hashedPass = await bcrypt.hash(`${envConfig.admin_password}`, 12);
    console.log(hashedPass);
}
hashPassword();
