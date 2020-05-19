import { connection } from "../util/connection";
let sha1 = require("sha1");

const getUserByUsername = async (username) => {
  return await connection.collection("users").findOne({ username });
};

const createThisUser = async (username, password, fullName) => {
  await connection.collection("users").insertOne({
    fullName,
    username,
    password: sha1(password),
    social: { following: [], followers: [] },
    chat: {},
    profilePicture: "/uploads/no-image-found.png",
    profileDescription: "",
    likes: [],
    chatIds: [],
  });
};

const getAllUsers = async () => {
  return await connection.collection("users").find({}).toArray();
}

const setupThisUser = async (allUsers, username) => {
  allUsers.forEach(async (user2) => {
    if (user2.username !== username) {
      let x = await connection
        .collection("chat")
        .insertOne({ messages: [], users: [username, user2.username] });
      x = x.ops;
      let id = x[0]._id.toString();
      await connection
        .collection("users")
        .updateOne({ username }, { $push: { chatIds: id } });
      await connection
        .collection("users")
        .updateOne({ username: user2.username }, { $push: { chatIds: id } });
    }
  });
}

const editUser = async (username, newUsername, fullName, profileDescription, imgPath) => {
  return await connection.collection("users").findOneAndUpdate(
        { username },
        {
          $set: {
            username: newUsername,
            fullName,
            profileDescription,
            profilePicture: imgPath,
          }
        }, {returnOriginal:false})
};

const updateSocialsUsername = async (username,newUsername) => {
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
}

const editPassword = async (username, newPassword) => {
  await connection
    .collection("users")
    .findOneAndUpdate(
      { username },
      { $set: { password: sha1(newPassword) } }
    );
}

const unFollowFollowing = async (username, profile) => {
  return await connection
  .collection("users")
  .findOneAndUpdate(
    { username },
    { $pull: { "social.following": profile } },
    { returnOriginal: false }
  );
}

const unFollowFollowers = async (username, profile) => {
  return await connection
  .collection("users")
  .findOneAndUpdate(
    { username: profile },
    { $pull: { "social.followers": username } },
    { returnOriginal: false }
  );
}

const followFollowing = async (username, profile) => {
  return await connection
  .collection("users")
  .findOneAndUpdate(
    { username },
    { $push: { "social.following": profile } },
    { returnOriginal: false }
  );
}

const followFollowers = async (username, profile) => {
  return await connection
  .collection("users")
  .findOneAndUpdate(
    { username: profile },
    { $push: { "social.followers": username } },
    { returnOriginal: false }
  );
}

export { getUserByUsername, createThisUser, getAllUsers, setupThisUser, editUser, updateSocialsUsername, editPassword, 
  unFollowFollowing, unFollowFollowers, followFollowing, followFollowers };
