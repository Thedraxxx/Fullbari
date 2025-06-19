import bcrypt from "bcrypt";
import { envConfig } from "config/cofig";
function hashPassword() {
    const hashedPass = bcrypt.hash(`${envConfig.admin_password}`, 12);
    console.log(hashedPass);
}
hashPassword();
