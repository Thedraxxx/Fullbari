import bcrypt from "bcrypt";
import { envConfig } from "../config/cofig";
 async function hashPassword() {
    const hashedPass = await bcrypt.hash(`admin12345`,12);
    console.log(hashedPass);
}
hashPassword();
