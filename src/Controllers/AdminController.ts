import { Express, Response, Request } from "express";
import prisma from "../prisma";

const approved = async (
  req: Request<{ userId: string }, {}, {}>,
  res: Response
): Promise<void> => {
  try {
    let userId = req.params.userId;
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        regStatus: "accepted",
      },
    });
    res.status(200).json({ success: "true", message: "User is accepted" });
    console.log("User is accepted");
  } catch (error) {
    res
      .status(400)
      .json({ success: "false", message: "error cause at acceptUser", error });
    console.log("error cause at acceptUser", error);
  }
};
const rejected = async (
  req: Request<{ userId: string }, {}, {}>,
  res: Response
): Promise<void> => {
  try {
    let userId = req.params.userId;
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        regStatus: "reject",
      },
    });
    res.status(200).json({ success: "true", message: "User is reject" });
    console.log("User is reject");
  } catch (error) {
    res
      .status(400)
      .json({ success: "false", message: "error cause at rejectUser", error });
    console.log("error cause at rejectUser");
  }
};

const unApproveList = async (req: Request, res: Response): Promise<void> => {
  try {
    const pendingUser = await prisma.user.findMany({
      where: {
        regStatus: "pending",
      },
    });
    const sanitizedUser = { ...pendingUser, password: undefined };
    res.status(200).json({
      success: "true",
      message: "unChecked userList",
      sanitizedUser,
    });
  } catch (error) {
    res.status(400).json({ message: "Fetching pendingUser error", error });
  }
};
const approvedList = async (req: Request, res: Response): Promise<void> => {
  try {
    const acceptedUserList = await prisma.user.findMany({
      where: {
        regStatus: "accepted",
      },
    });
    const sanitizedUser = { ...acceptedUserList, password: undefined };
    res.status(200).json({
      success: "true",
      message: "unChecked userList",
      sanitizedUser,
    });
  } catch (error) {
    res.status(400).json({ message: "Fetching accepted User error", error });
  }
};
