import { Router } from "express";
import { connection } from "../util/connection";
let multer = require("multer");
let upload = multer({ dest: __dirname + "../../../uploads/" });

const getFeed = async (req, res) => {
  console.log("request to /feed");
  let following = req.body.following.split(",");
  let followFeed = [];

  try {
    let feed = await connection.collection("posts").find({}).toArray();
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
    res.send(JSON.stringify({ success: true, feed: followFeed }));
    return;
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
};

const getExplore = async (req, res) => {
  console.log("request to /explore");

  try {
    let exploreFeed = await connection.collection("posts").find({}).toArray();
    res.send(JSON.stringify({ success: true, exploreFeed }));
    return;
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
};

// Define a new router and bind functions to routes;
const feedController = new Router();

feedController.post("/", upload.none(), getFeed);
feedController.get("/explore", upload.none(), getExplore);

export { feedController };
