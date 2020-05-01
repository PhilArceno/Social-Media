import { userDatabase, sessionsDatabase } from "../databases";


const getUser = async (username) => {
  return await userDatabase.getUserByUsername(username);
};

const createUser = async (username, password, fullName) => {
  await userDatabase.createThisUser(username, password, fullName);
};

const getAllUsers = async () => {
  return await userDatabase.getAllUsers();
};

const setupUser = async (allUsers, username) => {
  await userDatabase.setupThisUser(allUsers, username);
}

const getSession = async (cookieId) => {
  return await sessionsDatabase.getUserBySession(cookieId);
};

const makeSession = async (username) => {
  return await sessionsDatabase.makeSessionForUser(username);
};

const deleteSession = async (cookieId) => {
  return await sessionsDatabase.deleteThisSession(cookieId);
};




export { getUser, getSession, makeSession, deleteSession, createUser, getAllUsers, setupUser };
