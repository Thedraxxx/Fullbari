import bcrypt from "bcrypt";

const hash = "$2b$12$ZCkK6E7K7w1wYkzqH4A02uqbQwK2T8i0b5RiytR5zvMe4o9d8xF8O"; // your DB hash

(async () => {
  const isMatch = await bcrypt.compare("admin12345", hash);
  console.log("Does admin@123 match the DB hash?", isMatch);
})();
