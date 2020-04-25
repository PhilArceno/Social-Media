import { connection } from "../util/connection";

const getUserByUsername = async (username) => {
  return await connection.collection("users").findOne({ username });
};

export { getUserByUsername };
