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

export { getUserByUsername, createThisUser, getAllUsers, setupThisUser };
