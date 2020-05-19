import { Router } from "express";
import { sessionsService, postsService, userService, chatService } from "../services";
let multer = require("multer");
let upload = multer({ dest: __dirname + "../../../uploads/" });

const editProfile = async (req, res) => {
  try {
    console.log("request to /profile/edit");
    if (req.body) {
      let file = req.file;
      let fullName = req.body.fullName;
      let newUsername = req.body.username;
      let profileDescription = req.body.bio;
      let oldPFP = req.body.oldPFP;
      let imgPath;
      file && file.filename ? (imgPath = "/uploads/" + file.filename) : (imgPath = oldPFP);

      if (!imgPath || !fullName || !newUsername || !profileDescription || !oldPFP) {
        throw new TypeError("missing params!")
      }

      let session = await sessionsService.getSession(req.cookies.sid)
      if (!session) {
        return res.send(JSON.stringify({ success: false }));
      }
      let username = session.username

      if (username !== newUsername) {
        //did user change name?
        let userCheck = await userService.getUser(newUsername)
        if (userCheck) {
          return res.send(
            JSON.stringify({ success: false, text: "User already exists!" })
          );
        }
      }
      
      let user = await userService.editUser(username, newUsername, fullName, profileDescription, imgPath)

      if (file && file.filename !== oldPFP) { // user changed photo? edit photo on all of users posts.
        await postsService.editPicture(username, imgPath)
      }
      if (username !== newUsername) {
        //did user change name? change username matches across each database
        await userService.updateSocialsUsername(username, newUsername)
        await postsService.updatePostsUsername(username, newUsername)
        await chatService.updateChatsUsername(username,newUsername)
        await sessionsService.updateUsername(req.cookies.sid, newUsername)
      }
      return res.send(JSON.stringify({ success: true, user }));
    }
    throw new TypeError("missing request body")
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
};

const editPassword = async (req, res) => {
  try {
    console.log('request to /profile/password')
    if (req.body) {
      let newPassword = req.body.newPassword;
      if (!newPassword) throw new TypeError("Missing params")

      let session = await sessionsService.getSession(req.cookies.sid)
      if (!session) {
        return res.send(JSON.stringify({ success: false }));
      }
      let username = session.username
      let user = userService.editPassword(username, newPassword)
      
      return res.send(JSON.stringify({ success: true, user }));
    }
    throw new TypeError("missing request body!")
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify({ success: false }));
  }
}

const followUser = async (req, res) => {
  try {
    console.log('request to /profile/follow')
    if (req.body) {
      let {profile, action} = req.body
      if (!profile || !action) throw new TypeError("missing params!")

      let session = await sessionsService.getSession(req.cookies.sid)
      if (!session) {
        return res.send(JSON.stringify({ success: false }));
      }
      let username = session.username

      let user = await userService.getUser(username)
      let newProfile;

      if (action === "unfollow") {
        user = await userService.unFollowFollowing(username, profile)
        newProfile = await userService.unFollowFollowers(username, profile)
      }
      if (action === "follow") {
        user = await userService.followFollowing(username, profile)
        newProfile = await userService.followFollowers(username, profile)
      }
      return res.send(JSON.stringify({ success: true, user, newProfile }));
    }
    throw new TypeError("missing request body!")
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
