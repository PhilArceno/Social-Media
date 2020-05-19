import { chatDatabase } from "../databases";

const sendMessage = async (chatId, username, message) => {
    await chatDatabase.sendMessage(chatId, username, message)
}

const getChats = async (username) => {
    return await chatDatabase.getChats(username)
}

const updateChatsUsername = async (username,newUsername) => {
    await chatDatabase.updateChatsUsername(username,newUsername)
}


export { sendMessage, getChats, updateChatsUsername };
