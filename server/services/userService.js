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

const editUser = async (username, newUsername, fullName, profileDescription, imgPath) => {
  return await userDatabase.editUser(username, newUsername, fullName, profileDescription, imgPath)
}

const updateSocialsUsername = async (username, newUsername) => {
  await userDatabase.updateSocialsUsername(username, newUsername)
}

const editPassword = async (username, newPassword) => {
  await userDatabase.editPassword(username, newPassword)
}

const unFollowFollowing = async (username, profile) => {
  return await userDatabase.unFollowFollowing(username,profile)
}

const unFollowFollowers = async (username, profile) => {
  return await userDatabase.unFollowFollowers(username,profile)
}

const followFollowing = async (username, profile) => {
  return await userDatabase.followFollowing(username,profile)
}

const followFollowers = async (username, profile) => {
  return await userDatabase.followFollowers(username,profile)
}

export { getUser, createUser, getAllUsers, setupUser, editUser, updateSocialsUsername, editPassword, unFollowFollowing, unFollowFollowers,
  followFollowing, followFollowers
};
