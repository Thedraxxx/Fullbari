import bcrypt from "bcrypt";
function hashPassword() {
    const hashedPass = bcrypt.hash("admin12345", 12);
    console.log(hashedPass);
}
hashPassword();
