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

export { sendMessage, getChats }