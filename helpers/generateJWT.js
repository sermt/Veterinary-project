import jwt from "jsonwebtoken";
export default function jwtGenerator(userID) {
  return jwt.sign({ id: userID }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}