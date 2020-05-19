import { ObjectID } from "mongodb"
import { connection } from "../util/connection";


const sendMessage = async (chatId, username, message) => {
    await connection
    .collection("chat")
    .findOneAndUpdate(
      { _id: ObjectID(chatId) },
      { $push: { messages: { username, text: message } } }
    );
}

const getChats = async (username) => {
    return await connection
    .collection("chat")
    .find({ users: username })
    .toArray();
}

const updateChatsUsername = async (username, newUsername) => {
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
}

export { sendMessage, getChats, updateChatsUsername }