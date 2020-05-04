import { chatDatabase } from "../databases";

const sendMessage = async (chatId, username, message) => {
    await chatDatabase.sendMessage(chatId, username, message)
}

const getChats = async (username) => {
    return await chatDatabase.getChats(username)
}


export { sendMessage, getChats };
