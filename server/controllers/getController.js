import { Router } from "express";
import { userService, chatService, postsService, sessionsService } from '../services'
let multer = require("multer");
let upload = multer({ dest: __dirname + "../../../uploads/" });

const getUsersChat = async (req, res) => {
  console.log("request to /get/users");
  try {
  let session = await sessionsService.getSession(req.cookies.sid)

  if (!session) {
    return res.send(JSON.stringify({ success: false }));
  }

    let username = session.username
    let allUsers = await userService.getAllUsers()

    let matchingChats = await chatService.getChats(username)

    res.send(JSON.stringify({ success: true, allUsers, matchingChats }));
    return;
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
};

const getEditPost = async (req, res) => {
  console.log("request to /get/edit-post");
  try {
    if (req.body) {
      let postId = req.body.postId;
      if (!postId) {
        throw new TypeError('Missing postId!')
      }
       let session = await sessionsService.getSession(req.cookies.sid)
        if (!session) {
          return res.send(JSON.stringify({ success: false }));
        }
        let username = session.username
        
          let post = await postsService.getOnePost(postId)
          if (post.uploader === username) {
            res.send(JSON.stringify({ success: true, post }));
          } else res.send(JSON.stringify({ success: false }));
          return
    }
    throw new TypeError('Missing request body!');
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
}

const getPost = async (req, res) => {
  console.log("request to /get/post");
  try {
    if (req.body) {
      let postId = req.body.postId;
      if (!postId) {
        throw new TypeError('Missing postId!')
      }
    let post = await postsService.getOnePost(postId)
    return res.send(JSON.stringify({ success: true, post }));
  }
  throw new TypeError('Missing request body!')
 } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
}

const getProfile = async (req, res) => {
  console.log("request to /get/profile");
  try {
    if (req.body) {
      let username = req.body.user;
      if (!username) {
        throw new TypeError('Missing username!')
      }
    let user = await userService.getUser(username)
    let uploadedPosts = await postsService.getUploadedPosts(username)
    res.send(JSON.stringify({ success: true, user, uploadedPosts }));
    return;
  }
  throw new TypeError('Missing request body!')
} catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
}
// Define a new router and bind functions to routes;
const getController = new Router();

getController.get("/users-chat", getUsersChat);
getController.post("/edit-post", upload.none(), getEditPost);
getController.post("/post", upload.none(), getPost);
getController.post("/profile", upload.none(), getProfile);


export { getController };
