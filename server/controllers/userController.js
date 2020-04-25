import { Router } from "express";
import { userService } from "../services";

const sessions = [];

const getUser = async (req, res) => {
  console.log("request to /user");
  try {
    let username = sessions[req.cookies.sid] || req.query.username;

    if (username) {
      const user = await userService.getUser(username);
      return res.send(JSON.stringify({ success: true, user }));
    }

    throw new TypeError("Missing username!");
  } catch (err) {
    console.log(err);
    return res.send(JSON.stringify({ success: false }));
  }
};

// Define a new router and bind functions to routes;
const userController = new Router();

userController.get("/", getUser);

export { userController };
