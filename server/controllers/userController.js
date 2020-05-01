import { Router } from "express";
import { userService } from "../services";
let sha1 = require("sha1");
let multer = require("multer");
let upload = multer({ dest: __dirname + "../../../uploads/" });


const getUser = async (req, res) => {
  console.log("request to /user");
  try {
    let user = await userService.getSession(req.cookies.sid)
    if (!user) {
      return res.send(JSON.stringify({ success: false }));
    }

    let username = user.username

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

const login = async (req, res) => {
  console.log('request to /login')
  let username = req.body.username;
  let password = req.body.password;

  try {
    let user = await userService.getUser(username);
    if (!user) {
      return res.send(JSON.stringify({ success: false }));
    }
    if (user.password === sha1(password)) {
      let doc = await userService.makeSession(username)
      let sessionId = doc.insertedId
      res.cookie("sid", sessionId);
      res.send(JSON.stringify({ success: true, user }));
      return;
    }
    return res.send(JSON.stringify({ success: false }));
  } catch (err) {
    console.log("/login error", err);
    return res.send(JSON.stringify({ success: false }));
  }
}

const logout = async (req, res) => {
  console.log('request to /user/logout')
  if (req.cookies.sid) {
    await userService.deleteSession(req.cookies.sid)
    res.send(JSON.stringify({ success: true }));
  } else {
    res.send(JSON.stringify({ success: false }));
  }
}

const register = async (req, res) => {
  console.log('request to /user/register')
  let username = req.body.username;
  let password = req.body.password;
  let fullName = req.body.fullName;

  try {
    let user = await userService.getUser(username)
      if (!user) {
        await userService.createUser(username, password, fullName)
      } else res.send(JSON.stringify({ success: false }));
    let allUsers = await userService.getAllUsers()

    await userService.setupUser(allUsers, username)

    res.send(JSON.stringify({ success: true }));
    return;
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
}

// Define a new router and bind functions to routes;
const userController = new Router();

userController.get("/", getUser);
userController.post("/login",upload.none(), login);
userController.post("/register", upload.none(), register);
userController.post("/logout", upload.none(), logout);


export { userController };
