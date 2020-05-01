import { userDatabase, sessionsDatabase, chatDatabase } from "../databases";

const getSession = async (cookieId) => {
  return await sessionsDatabase.getUserBySession(cookieId);
};

const sendMessage = async (chatId, username, message) => {
    await chatDatabase.sendMessage(chatId, username, message)
}

const getChats = async (username) => {
    return await chatDatabase.getChats(username)
}


export { getSession, sendMessage, getChats };
