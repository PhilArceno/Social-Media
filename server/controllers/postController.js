import { Router } from "express";
import { connection } from "../util/connection";
import { ObjectID } from "mongodb";
let multer = require("multer");
let upload = multer({ dest: __dirname + "../../../uploads/" });

const createPost = async (req, res) => {
  console.log("request to /post/create");

  let description = req.body.description;
  let location = req.body.location;
  let comments = [];
  let likes = [];
  let tags = req.body.tags;
  let profilePicture = req.body.profilePicture;
  let session = await connection.collection('sessions').findOne({_id: ObjectID(req.cookies.sid)})
  if (!session) {
    return res.send(JSON.stringify({ success: false }));
  }
  let uploader = session.username

  let files = req.files;
  let imgPaths = files.map((file) => {
    return "/uploads/" + file.filename;
  });

  let tagArr = tags.split(",");

  try {
    connection.collection("posts").insertOne({
      description,
      location,
      comments,
      likes,
      img: imgPaths,
      uploader,
      tags: tagArr,
      profilePicture,
    });
    res.send(JSON.stringify({ success: true }));
    return;
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
};

const editPost = async (req, res) => {
  console.log('request to /post/edit')
  let session = await connection.collection('sessions').findOne({_id: ObjectID(req.cookies.sid)})
  if (!session) {
    return res.send(JSON.stringify({ success: false }));
  }
  let postId = req.body.postId;
  let location = req.body.location;
  let description = req.body.description;
  let tags = req.body.tags.split(",");

  try {
    let post = await connection
      .collection("posts")
      .findOneAndUpdate(
        { _id: ObjectID(postId) },
        { $set: { location, description, tags } }
      );
    res.send(JSON.stringify({ success: true, post }));
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
}

const deletePost = async (req, res) => {
  console.log('request to /post/delete')
  let session = await connection.collection('sessions').findOne({_id: ObjectID(req.cookies.sid)})
  if (!session) {
    return res.send(JSON.stringify({ success: false }));
  }
  let username = session.username
  let postId = req.body.postId;

  try {
    await connection
      .collection("posts")
      .remove({ _id: ObjectID(postId) }, { justOne: true });
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
}

const likePost = async (req, res) => {
    console.log("request to /post/like ", req.body.post);
    let session = await connection.collection('sessions').findOne({_id: ObjectID(req.cookies.sid)})
    if (!session) {
      return res.send(JSON.stringify({ success: false }));
    }
    let username = session.username
    let onePost = req.body.post;
    let following = req.body.following.split(",");
    console.log(following);
  
    try {
      let updated = false;
      let post = await connection
        .collection("posts")
        .findOne({ _id: ObjectID(onePost) });
      post.likes.forEach(async (user) => {
        if (user === username) {
          connection
            .collection("posts")
            .findOneAndUpdate(
              { _id: ObjectID(onePost) },
              { $pull: { likes: username } }
            );
          connection
            .collection("users")
            .findOneAndUpdate({ username }, { $pull: { likes: onePost } });
          updated = true;
        }
      });
      if (updated === false) {
        // for if the array is empty
        connection
          .collection("posts")
          .findOneAndUpdate(
            { _id: ObjectID(onePost) },
            { $push: { likes: username } }
          );
        connection
          .collection("users")
          .findOneAndUpdate({ username }, { $push: { likes: onePost } });
      }
      let feed = await connection.collection("posts").find({}).toArray();
      let user = await connection.collection("users").findOne({ username });
      let followFeed = [];
  
      if (following) {
        for (var i = 0; i < feed.length; i++) {
          for (var x = 0; x < following.length; x++) {
            if (feed[i].uploader === following[x]) {
              followFeed.push(feed[i]);
            }
          }
        }
      } else followFeed = [];
      followFeed.reverse();
  
      return res.send(JSON.stringify({ success: true, feed: followFeed, user }));
    } catch (err) {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    }
}

const newComment = async (req, res) => {
  console.log('request to /post/comment/new')
  let session = await connection.collection('sessions').findOne({_id: ObjectID(req.cookies.sid)})
  if (!session) {
    return res.send(JSON.stringify({ success: false }));
  }
  let username = session.username
  let comment = req.body.comment;
  let time = req.body.time;
  let post = req.body.post;

  try {
    await connection
      .collection("posts")
      .findOneAndUpdate(
        { _id: ObjectID(post) },
        { $push: { comments: { username, time, comment, likes: [] } } }
      );
    let feed = await connection.collection("posts").find({}).toArray();
    feed.reverse();
    res.send(JSON.stringify({ success: true, feed }));
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
}

const deleteComment = async (req, res) => {
  console.log('request to /post/comment/delete')
  let username = req.body.username;
  let comment = req.body.comment;
  let post = req.body.post;

  try {
    await connection
      .collection("posts")
      .updateOne(
        { _id: ObjectID(post) },
        { $pull: { comments: { username, comment } } }
      );
    let feed = await connection.collection("posts").find({}).toArray();
    feed.reverse();
    res.send(JSON.stringify({ success: true, feed }));
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
}

// Define a new router and bind functions to routes;
const postController = new Router();

postController.post("/delete",upload.none(), deletePost);
postController.post("/create", upload.array("images"), createPost);
postController.post("/edit", upload.none(), editPost);
postController.post("/like", upload.none(), likePost);
postController.post("/comment/new", upload.none(), newComment);
postController.post("/comment/delete", upload.none(), deleteComment);



export { postController };
