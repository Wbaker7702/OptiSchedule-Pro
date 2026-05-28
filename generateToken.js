require("dotenv").config();
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  {
    userId: 1,
    role: "manager"
  },
  process.env.JWT_SECRET,
  { expiresIn: "8h" }
);

console.log("Generated Token:\n");
console.log(token);
