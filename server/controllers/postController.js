import { Router } from "express";
import { sessionsService, postsService, userService } from "../services";
let multer = require("multer");
let upload = multer({ dest: __dirname + "../../../uploads/" });

const createPost = async (req, res) => {
  console.log("request to /post/create");
  try {
    if (req.body) {
      let {description, location, tags, profilePicture} = req.body
      if (!description || !location || !tags || profilePicture) {
        throw new TypeError("Missing params")
      }

      let comments = [];
      let likes = [];
      let session = await sessionsService.getSession(req.cookies.sid)
      if (!session) {
        return res.send(JSON.stringify({ success: false }));
      }
      let uploader = session.username
    
      let files = req.files;
      let imgPaths = files.map((file) => {
        return "/uploads/" + file.filename;
      });
    
      let tagArr = tags.split(",");
      
      await postsService.createPost(description, location, comments, likes, imgPaths, uploader, tagArr, profilePicture)

      res.send(JSON.stringify({ success: true }));
      return;
  }
  throw new TypeError("missing request body")
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
};

const editPost = async (req, res) => {
  console.log('request to /post/edit')
  try {
    if (req.body) {
      let postId = req.body.postId;
      let location = req.body.location;
      let description = req.body.description;
      let tags = req.body.tags.split(",");
      if (!postId || location || description || tags) {
        throw new TypeError("Missing Params")
      }
      let session = await sessionsService.getSession(req.cookies.sid)
      if (!session) {
        return res.send(JSON.stringify({ success: false }));
      }
      
      let post = await postsService.editPost(postId, location, description, tags)
      return res.send(JSON.stringify({ success: true, post }));
  }
  throw new TypeError("Missing request body!")
 } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
}

const deletePost = async (req, res) => {
  console.log('request to /post/delete')
  try {
    if (req.body) {
      let postId = req.body.postId;
      if (!postId) {
        throw new TypeError("missing params")
      }

      let session = await sessionsService.getSession(req.cookies.sid)
      if (!session) {
        return res.send(JSON.stringify({ success: false }));
      }
      
      await postsService.removePost(postId)
      return res.send(JSON.stringify({ success: true }));
    }
    throw new TypeError("missing request body!")
    } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
}

const likePost = async (req, res) => {
    console.log("request to /post/like ", req.body.post);
    try {
      if (req.body) {
        let postId = req.body.post;
        let following = req.body.following.split(",");
        if (!postId || !following) {
          throw new TypeError("missing params")
        }
      let session = await sessionsService.getSession(req.cookies.sid)
      if (!session) {
        return res.send(JSON.stringify({ success: false }));
      }
      let username = session.username    
      
      let post = await postsService.getOnePost(postId)

      let found = post.likes.find(user => user === username)
      if (found) {
        postsService.removeLike(postId, username)
      } else {
        postsService.likePost(postId, username)
      }

      let feed = await postsService.getAllPosts()
      let user = await userService.getUser(username)
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
    } throw new TypeError("missing request body")
  } catch (err) {
      console.log(err);
      return res.send(JSON.stringify({ success: false }));
    }
}

const newComment = async (req, res) => {
  console.log('request to /post/comment/new')
  try {
    if (req.body) {
      let {comment, time, postId } = req.body
      if (!comment || !time || !postId) {
        throw new TypeError("missing params")
      }
    let session = await sessionsService.getSession(req.cookies.sid)
    if (!session) {
      return res.send(JSON.stringify({ success: false }));
    }

    let username = session.username

    await postsService.postComment(postId, username, time, comment)
    let feed = await postsService.getAllPosts()
    feed.reverse();
    return res.send(JSON.stringify({ success: true, feed }));
  } 
  throw new TypeError("missing request body!")
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
}

const deleteComment = async (req, res) => {
  console.log('request to /post/comment/delete')
  try {
  if (req.body) {
    let {username, comment, postId} = req.body
    if (!username || !comment || !postId) {
      throw new TypeError("Missing params")
    }
  
    await postsService.removeComment(postId, username, comment)
    let feed = await postsService.getAllPosts()
    feed.reverse();
    return res.send(JSON.stringify({ success: true, feed }));
  } 
  throw new TypeError("missing request body")
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
