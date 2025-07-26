import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
const getJwtToken = (userId: string) => {
  const secret: string | undefined = process.env.JWT_SECRET;
  if (!secret) {
    return console.log("jwt secret token not fetching from env");
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};
export { getJwtToken };
