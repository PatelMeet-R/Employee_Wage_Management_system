import { Response, Request } from "express";
import { cookieToken, clearCookieToken } from "../Utils/cookieToken";
import { verifyPassword, genHashPass } from "../Utils/bcryptHash";
import prisma from "../prisma";

interface RegBody {
  fullName: string;
  email: string;
  userName: string;
  password: string;
  selfNumber: string;
}
interface loggedBody {
  userName: string;
  password: string;
}
interface userID {
  id: string;
}
const RegisterReqController = async (
  req: Request<{}, {}, RegBody>,
  res: Response
): Promise<void> => {
  let { fullName, email, userName, password, selfNumber } = req.body;
  if (!fullName || !email || !userName || !password || !selfNumber) {
    res
      .status(300)
      .json({ message: "user must fill all details for Register" });
    return;
  }
  try {
    const isExistUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            userName,
          },
          { email },
        ],
      },
    });
    if (isExistUser) {
      switch (isExistUser.regStatus) {
        case "reject":
          res.status(403).send("You have been rejected");
          break;
        case "accepted":
          res.status(200).send("You are approved. Please log in.");
          break;
        default:
          res
            .status(200)
            .send("You have already signed up. Please wait for approval.");
      }
      return;
    }
    if (!isExistUser) {
      const { isValid, hashPass } = await genHashPass(password);
      if (!isValid || !hashPass) {
        res.status(500).send("Password hashing failed,signup again");
        return;
      }
      const newUser = await prisma.user.create({
        data: {
          fullName,
          email,
          userName,
          password: hashPass,
          selfNumber,
        },
      });
      const sanitizedUser = { ...newUser, password: undefined };
      res.status(200).json({
        message: "your signup process is complete now wait for admin approval",
        user: sanitizedUser,
      });
      return;
    }
  } catch (error) {
    console.log("this error cause at RegisterReqController", error);
    res
      .status(500)
      .json({ message: "error cause at RegisterReqController", error });
    return;
  }
};

const loginController = async (
  req: Request<{}, {}, loggedBody>,
  res: Response
): Promise<void> => {
  let { userName, password: inputPassword } = req.body;
  try {
    if (!userName || !inputPassword) {
      res
        .status(400)
        .json({ message: "user must filled the all details for login" });
      return;
    }
    const existUser = await prisma.user.findFirst({
      where: {
        userName,
      },
    });
    if (!existUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { password: dbPassword } = existUser;
    const isMatch = await verifyPassword(inputPassword, dbPassword);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    if (existUser?.regStatus === "pending") {
      res.status(200).send("Please wait for Your Approval");
      return;
    } else if (existUser?.regStatus === "reject") {
      res
        .status(400)
        .send("You are not applicable , admin rejected your approval");
      return;
    } else {
      // accepted
      cookieToken(existUser as userID, res);
      console.log("login successful", existUser);
      // res.status(200).json({ message: "login successful", existUser });
      // return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went Wrong during login" });
  }
};
const logoutController = async (req: Request, res: Response): Promise<void> => {
  try {
    clearCookieToken(res);
  } catch (error) {
    res.status(400).json({ message: "error while logout", error });
    console.log("error while logout", error);
  }
};

export { loginController, RegisterReqController, logoutController };
