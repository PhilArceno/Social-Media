// TEMPORARY FILE WHILE WE MIGRATE
let express = require("express");
let app = express();
let reloadMagic = require("./reload-magic.js");
let cookieParser = require("cookie-parser");

import { 
  userController, 
  feedController, 
  getController, 
  postController,
  profileController,
  chatController
} from "./server/controllers";

import { initMongo } from "./server/util/connection";
import path from "path";

app.use(cookieParser());

reloadMagic(app);

app.use("/", express.static("./build")); // Needed for the HTML and JS files
app.use("/", express.static("./public")); // Needed for local assets
app.use("/uploads", express.static("./uploads"));

//Database
let dbo = null;

// Your endpoints go after this line

// Assign the user controller to a /user prefix, meaning that anything inside userController will have `/user` before it's route
// i.e for getUser, which is `app.get('/')`, it will actually resolve at `/user`
app.use("/user", userController);
app.use("/feed", feedController);
app.use("/get", getController);
app.use("/post", postController);
app.use("/profile", profileController);
app.use("/chat", chatController)

// Your endpoints go before this line

// resolve path here, as express considers `../` at runtime a directory traversal attack, and will not compile
const template = path.resolve(__dirname + "/build/index.html");
app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(template);
});

// Make sure the mongo instance is bound before we start the app
initMongo(
  // TODO: this should come from config
  "mongodb+srv://Phil:phila@cluster0-krqft.mongodb.net/test?retryWrites=true&w=majority"
).then((mongo) => {
  // assing dbo to mongo instance
  dbo = mongo;

  const { PORT = 4000, LOCAL_ADDRESS = "0.0.0.0" } = process.env; // for heroku
  app.listen(4000, LOCAL_ADDRESS, () => {
    console.log("Server running on port " + PORT);
  });
});
