import { MongoClient } from "mongodb";

// Reuseable connection object that gets assinged on init
// on initMongo is called (preferably at application start)
// theh connection will be available whereever it's imported
let connection = null;

const initMongo = async (url) => {
  // if connection is null, assign it to a new mongo connection
  // else do nothing
  if (!connection) {
    const mongo = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Assinging connection");
    connection = mongo.db("ProjectDB");
    console.log("Connection Assigned!");
  }

  return;
};

export { connection, initMongo };
