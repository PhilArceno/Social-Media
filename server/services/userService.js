import { userDatabase } from "../databases";

const getUser = async (username) => {
  return await userDatabase.getUserByUsername(username);
};

export { getUser };
