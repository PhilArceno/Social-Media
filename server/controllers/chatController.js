import { Router } from "express";
import { chatService } from "../services";
let multer = require("multer");
let upload = multer({ dest: __dirname + "../../../uploads/" });


const sendMessage = async (req, res) => {
  console.log('request to /chat/send-message')
  try {
    if (req.body) {
      let message = req.body.newMessage;
      let chatId = req.body.chatId;
      if (!chatId || !message) {
           throw new TypeError('Missing params');
      }

      let session = await chatService.getSession(req.cookies.sid)
      if (!session) {
        return res.send(JSON.stringify({ success: false }));
      }
      let username = session.username


      await chatService.sendMessage(chatId, username, message)

      let matchingChats = await chatService.getChats(username)
      console.log(matchingChats)
  
      res.send(JSON.stringify({ success: true, matchingChats }));
      return
    } 
    throw new TypeError('Missing request body!')
    }
  catch (err) {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
  }
}

// Define a new router and bind functions to routes;
const chatController = new Router();

chatController.post("/send-message",upload.none(), sendMessage);



export { chatController };
