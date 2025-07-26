import bcrypt from "bcryptjs";

import { hashValidation } from "../Interfaces/utilInterface";
const verifyPassword = async (
  inputPassword: string,
  dbPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(inputPassword, dbPassword);
};
const genHashPass = async (inputPassword: string): Promise<hashValidation> => {
  try {
    let hash = await bcrypt.hash(inputPassword, 123);
    return { isValid: true, hashPass: hash };
  } catch (error) {
    console.log("Error hashing password:", error);
    return { isValid: false };
  }
};

export { verifyPassword, genHashPass };
