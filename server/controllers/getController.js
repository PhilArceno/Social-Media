import { Router } from "express";
import { connection } from "../util/connection";
import { ObjectID } from "mongodb";
let multer = require("multer");
let upload = multer({ dest: __dirname + "../../../uploads/" });

const getUsersChat = async (req, res) => {
  console.log("request to /get/users");
  let session = await connection.collection('sessions').findOne({_id: ObjectID(req.cookies.sid)})
  if (!session) {
    return res.send(JSON.stringify({ success: false }));
  }

  let username = session.username
  try {
    let allUsers = await connection.collection("users").find({}).toArray();

    let matchingChats = await connection
      .collection("chat")
      .find({ users: username })
      .toArray();

    res.send(JSON.stringify({ success: true, allUsers, matchingChats }));
    return;
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
};

const getEditPost = async (req, res) => {
  console.log("request to /get/edit-post");
  let session = await connection.collection('sessions').findOne({_id: ObjectID(req.cookies.sid)})
  if (!session) {
    return res.send(JSON.stringify({ success: false }));
  }
  let username = session.username
  let postId = req.body.postId;

  try {
    let post = await connection.collection("posts").findOne({ _id: ObjectID(postId) });
    if (post.uploader === username) {
      return res.send(JSON.stringify({ success: true, post }));
    } else res.send(JSON.stringify({ success: false }));
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
}

const getPost = async (req, res) => {
  console.log("request to /get/post");
  let postId = req.body.postId;

  try {
    let post = await connection.collection("posts").findOne({ _id: ObjectID(postId) });

    return res.send(JSON.stringify({ success: true, post }));
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
}

const getProfile = async (req, res) => {
  console.log("request to /get/profile");

  let username = req.body.user;

  try {
    let user = await connection.collection("users").findOne({ username });
    let uploadedPosts = await connection
      .collection("posts")
      .find({ uploader: username })
      .toArray();
    res.send(JSON.stringify({ success: true, user, uploadedPosts }));
    return;
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
