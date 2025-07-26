import dotenv from "dotenv";
dotenv.config();
import express, { Response, Request } from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("server is alive");
});

app.listen(port, () => {
  console.log(`server is listing to port number ${port}`);
});
