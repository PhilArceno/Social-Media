import { sessionsDatabase } from "../databases";

const getSession = async (cookieId) => {
    return await sessionsDatabase.getUserBySession(cookieId);
  };
  
  const makeSession = async (username) => {
    return await sessionsDatabase.makeSessionForUser(username);
  };
  
  const deleteSession = async (cookieId) => {
    return await sessionsDatabase.deleteThisSession(cookieId);
  };

  export {getSession, makeSession, deleteSession }