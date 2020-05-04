import { userDatabase } from "../databases";


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

export { getUser, createUser, getAllUsers, setupUser };
