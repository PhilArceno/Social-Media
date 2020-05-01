import { Router } from "express";
import { connection } from "../util/connection";
import { ObjectID } from "mongodb";
let multer = require("multer");
let upload = multer({ dest: __dirname + "../../../uploads/" });

const editProfile = async (req, res) => {
  console.log("request to /profile/edit");
  let session = await connection.collection('sessions').findOne({_id: ObjectID(req.cookies.sid)})
  if (!session) {
    return res.send(JSON.stringify({ success: false }));
  }

  let username = session.username
  let file = req.file;
  let fullName = req.body.fullName;
  let newUsername = req.body.username;
  let profileDescription = req.body.bio;
  let oldPFP = req.body.oldPFP;

  let imgPath;
  file ? (imgPath = "/uploads/" + file.filename) : (imgPath = oldPFP);

  try {
    let userCheck = await connection
      .collection("users")
      .findOne({ username: newUsername });
    if (username !== newUsername) {
      //did user change name?
      if (userCheck) {
        return res.send(
          JSON.stringify({ success: false, text: "User already exists!" })
        );
      }
    }

    let user = await connection.collection("users").findOneAndUpdate(
      { username },
      {
        $set: {
          username: newUsername,
          fullName,
          profileDescription,
          profilePicture: imgPath,
        },
      }
    );

    if (file && file.filename !== oldPFP) {
      await connection
        .collection("posts")
        .updateMany(
          { uploader: username },
          { $set: { profilePicture: imgPath } }
        );
    }

    if (username !== newUsername) {
      //did user change name?
      await connection
        .collection("users")
        .updateMany(
          { "social.followers": { $in: [username] } },
          { $set: { "social.followers.$": newUsername } }
        );
      await connection
        .collection("users")
        .updateMany(
          { "social.following": { $in: [username] } },
          { $set: { "social.following.$": newUsername } }
        );

      await connection
        .collection("posts")
        .updateMany(
          { uploader: username },
          { $set: { uploader: newUsername } }
        );
      await connection
        .collection("posts")
        .updateMany(
          { "comments.username": username },
          { $set: { "comments.$[element].username": newUsername } },
          { arrayFilters: [{ "element.username": username }], multi: true }
        );
      await connection
        .collection("posts")
        .updateMany(
          { likes: { $in: [username] } },
          { $set: { "likes.$": newUsername } }
        );

      await connection
        .collection("chat")
        .updateMany(
          { users: { $in: [username] } },
          { $set: { "users.$": newUsername } }
        );
      await connection
        .collection("chat")
        .updateMany(
          { "messages.username": username },
          { $set: { "messages.$[element].username": newUsername } },
          { arrayFilters: [{ "element.username": username }], multi: true }
        );

      await connection.collection('sessions').findOneAndUpdate({_id: ObjectID(req.cookies.sid)}, {username: newUsername})
    }

    return res.send(JSON.stringify({ success: true, user }));
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
};

const editPassword = async (req, res) => {
  console.log('request to /profile/password')
  let session = await connection.collection('sessions').findOne({_id: ObjectID(req.cookies.sid)})
  if (!session) {
    return res.send(JSON.stringify({ success: false }));
  }
  let username = session.username
  let newPassword = req.body.newPassword;

  try {
    let user = await connection
      .collection("users")
      .findOneAndUpdate(
        { username },
        { $set: { password: sha1(newPassword) } }
      );
    res.send(JSON.stringify({ success: true, user }));
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
}

const followUser = async (req, res) => {
  console.log('request to /profile/follow')
  let session = await connection.collection('sessions').findOne({_id: ObjectID(req.cookies.sid)})
  if (!session) {
    return res.send(JSON.stringify({ success: false }));
  }
  let username = session.username
  let profile = req.body.profile;
  let action = req.body.action;

  try {
    let user = await connection.collection("users").findOne({ username });
    let newProfile;
    if (action === "unfollow") {
      user = await connection
        .collection("users")
        .findOneAndUpdate(
          { username },
          { $pull: { "social.following": profile } },
          { returnOriginal: false }
        );
      newProfile = await connection
        .collection("users")
        .findOneAndUpdate(
          { username: profile },
          { $pull: { "social.followers": username } },
          { returnOriginal: false }
        );
    }
    if (action === "follow") {
      user = await connection
        .collection("users")
        .findOneAndUpdate(
          { username },
          { $push: { "social.following": profile } },
          { returnOriginal: false }
        );
      newProfile = await connection
        .collection("users")
        .findOneAndUpdate(
          { username: profile },
          { $push: { "social.followers": username } },
          { returnOriginal: false }
        );
    }
    res.send(JSON.stringify({ success: true, user, newProfile }));
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }

}
// Define a new router and bind functions to routes;
const profileController = new Router();

profileController.post("/edit", upload.single("image"), editProfile);
profileController.post("/password", upload.none(), editPassword);
profileController.post("/follow", upload.none(), followUser);


export { profileController };
