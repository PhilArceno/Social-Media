import { connection } from "../util/connection";
import { ObjectID } from "mongodb";


const getUserBySession = async (cookieId) => {
  return await connection.collection('sessions').findOne({_id: ObjectID(cookieId)})
};

const makeSessionForUser = async (username) => {
    return await connection.collection('sessions').insertOne({username})
  };

const deleteThisSession = async (cookieId) => {
    await connection.collection('sessions').deleteOne({_id: ObjectID(cookieId)})
}

export { getUserBySession, makeSessionForUser, deleteThisSession };
