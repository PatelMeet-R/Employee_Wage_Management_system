import { cookieOption, bodyResponse } from "../Interfaces/utilInterface";
import { Response } from "express";
interface empId {
  id: string;
}
import { getJwtToken } from "./getJwtToken";
const cookieToken = (user: empId, res: bodyResponse) => {
  const token = getJwtToken(user.id);
  const options: cookieOption = {
    expires: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  const sanitizedUser = { ...user, password: undefined };
  res
    .status(200)
    .cookie("token", token as string, options)
    .json({
      success: true,
      token: token,
      user: sanitizedUser,
    });
};
const clearCookieToken = (res: Response) => {
  res
    .status(200)
    .clearCookie("token", {
      httpOnly: true,
    })
    .json({ success: true, message: "Logout successful" });
};
export { cookieToken, clearCookieToken };
