let express = require('express')
let app = express()
let reloadMagic = require('./reload-magic.js')

let MongoClient = require('mongodb').MongoClient
let ObjectID = require('mongodb').ObjectID
let multer = require('multer')
let sha1 = require('sha1')
let upload = multer({ dest: __dirname + '/uploads/' })
let cookieParser = require('cookie-parser')
app.use(cookieParser());

reloadMagic(app)

app.use('/', express.static('build')); // Needed for the HTML and JS files
app.use('/', express.static('public')); // Needed for local assets
app.use('/uploads', express.static('uploads'));


//Database

let dbo = undefined;
let url =
  'mongodb+srv://Phil:phila@cluster0-krqft.mongodb.net/test?retryWrites=true&w=majority';
MongoClient.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, db) => {
    dbo = db.db('ProjectDB');
  }
);

//Storage (cookies)
let sessions = {}

// Your endpoints go after this line
app.get('/user', async(req, res) => {
  console.log('request to /user');
  let username = sessions[req.cookies.sid]
  
  try {
    if (username) {
      let user = await dbo.collection("users").findOne({username})
      return res.send(JSON.stringify({success: true,  user }))
    }
  } 
  catch(err) {
    console.log(err)
    return res.send(JSON.stringify({ success:false }))
  }
});

app.get('/feed/explore', async (req, res) => {
  console.log('request to /explore');

  try {
    let exploreFeed = await dbo.collection("posts").find({}).toArray()
    res.send(JSON.stringify({success:true, exploreFeed}))
    return
  } catch(err) {
    console.log(err)
    res.send(JSON.stringify({success:false}))
  }
});

app.get('/get/users-chat', async (req, res) => {
  console.log('request to /get/users');
  let username = sessions[req.cookies.sid]

  try {
    let allUsers = await dbo.collection("users").find({}).toArray()
    
    let matchingChats = await dbo.collection('chat').find({users: username}).toArray()

    res.send(JSON.stringify({success:true, allUsers, matchingChats}))
    return
  } catch(err) {
    console.log(err)
    res.send(JSON.stringify({success:false}))
  }
});

app.post('/chat/send-message', upload.none(), async (req, res) => {
  let username = sessions[req.cookies.sid]
  let message = req.body.newMessage
  let chatId = req.body.chatId

  try{
    await dbo.collection('chat').findOneAndUpdate({ _id: ObjectID(chatId) }, { $push: { messages: {username, text: message } }})
    let matchingChats = await dbo.collection('chat').find({users: username}).toArray()

    res.send(JSON.stringify({success:true, matchingChats}))
  } catch (err) {
    console.log(err)
    res.send(JSON.stringify({success:false}))
  }
})

app.post('/feed',upload.none(), async (req, res) => {
  console.log('request to /feed');
  let username = sessions[req.cookies.sid]
  let following = req.body.following.split(',')
  let followFeed = []

  try {
    let feed = await dbo.collection("posts").find({}).toArray()
    if (following) {
      for (var i = 0; i < feed.length; i++) {
        for (var x = 0; x < following.length; x++) {
          if (feed[i].uploader === following[x]) {
            followFeed.push(feed[i])
          }
        }
      }
  } else followFeed = []
    followFeed.reverse()
    res.send(JSON.stringify({success:true, feed:followFeed}))
    return
  } catch(err) {
    console.log(err)
    res.send(JSON.stringify({success:false}))
  }
});

app.post('/post/create', upload.array('images'), async (req, res) => {
  console.log('request to /create/post');

  let description = req.body.description
  let location = req.body.location
  let comments = []
  let likes = []
  let uploader = sessions[req.cookies.sid]
  let tags = req.body.tags
  let profilePicture = req.body.profilePicture
  
  let files = req.files;
  let imgPaths = files.map(file => {
    return '/uploads/' + file.filename;
  });

  let tagArr = tags.split(',')

  try {
    dbo.collection('posts').insertOne({
      description,
      location,
      comments,
      likes,
      img: imgPaths,
      uploader,
      tags: tagArr,
      profilePicture
    })
    res.send(JSON.stringify({success:true}))
    return
  } catch(err) {
    console.log(err)
    res.send(JSON.stringify({success:false}))
  }
});

app.post('/get/profile',upload.none(), async (req, res) => {
  console.log('request to /check-profile');

let username = req.body.user

try {
  let user = await dbo.collection("users").findOne({username})
  let uploadedPosts = await dbo.collection("posts").find({uploader: username}).toArray()
  res.send(JSON.stringify({success:true, user, uploadedPosts}))
  return
} catch(err) {
  console.log(err)
  res.send(JSON.stringify({success:false}))
}
})

app.post('/profile/edit',upload.single('image'), async (req, res) => {
  console.log('request to /edit-profile');

let username = sessions[req.cookies.sid]
let file = req.file
let fullName = req.body.fullName
let newUsername = req.body.username
let profileDescription = req.body.bio
let oldPFP = req.body.oldPFP

let imgPath
file ? imgPath = '/uploads/' + file.filename : imgPath = oldPFP;

try {
  let userCheck = await dbo.collection('users').findOne({ username: newUsername })
  if (username !== newUsername) { //did user change name?
    if (userCheck) {
      return res.send(JSON.stringify({success:false, text:'User already exists!'}))
    }
  }


  let user = await dbo.collection('users').findOneAndUpdate({username}, { $set: {
    username: newUsername,
    fullName,
    profileDescription,
    profilePicture: imgPath
  }})

  if (file && file.filename !== oldPFP) {
    await dbo.collection('posts').updateMany({ uploader: username }, {$set: { profilePicture: imgPath }});
  }

  if (username !== newUsername) { //did user change name?
    await dbo.collection('users').updateMany({ 'social.followers': {$in: [username]} }, {$set: { 'social.followers.$': newUsername }});
    await dbo.collection('users').updateMany({ 'social.following': {$in: [username]} }, {$set: { 'social.following.$': newUsername }});

    await dbo.collection('posts').updateMany({ uploader: username }, {$set: { uploader: newUsername }});
    await dbo.collection('posts').updateMany({ 'comments.username': username }, { $set: {'comments.$[element].username': newUsername} }, {arrayFilters: [ { "element.username": username } ],multi: true});
    await dbo.collection('posts').updateMany({ likes: { $in: [username] } }, { $set: {'likes.$' : newUsername}  });

    await dbo.collection('chat').updateMany({ users: { $in: [username] } }, { $set: {'users.$' : newUsername}  });
    await dbo.collection('chat').updateMany({ 'messages.username': username }, { $set: {'messages.$[element].username': newUsername} }, {arrayFilters: [ { "element.username": username } ],multi: true})

    sessions[req.cookies.sid] = newUsername
  }

return res.send(JSON.stringify({success:true, user}))
} catch(err) {
  console.log(err)
  res.send(JSON.stringify({success:false}))
}
})

app.post('/profile/password', upload.none(), async (req, res) => {
  let username = sessions[req.cookies.sid]
  let newPassword = req.body.newPassword

  try {
    let user = await dbo.collection('users').findOneAndUpdate({username}, {$set: {password: sha1(newPassword)}})
    res.send(JSON.stringify({success: true, user}))
  } catch(err) {
    console.log(err)
    res.send(JSON.stringify({success:false}))
  }
})

app.post('/get/edit-post', upload.none(), async (req, res) => {
  let username = sessions[req.cookies.sid]
  let postId = req.body.postId

  try{
    let post = await dbo.collection('posts').findOne({_id: ObjectID(postId)})
    if (post.uploader === username) {
      return res.send(JSON.stringify({success: true, post}))
    }
    else res.send(JSON.stringify({success: false}))
  }
  catch (err) {
    console.log(err)
    res.send(JSON.stringify({success:false}))
  }
})

app.post('/get/post', upload.none(), async (req, res) => {
  let username = sessions[req.cookies.sid]
  let postId = req.body.postId

  try{
    let post = await dbo.collection('posts').findOne({_id: ObjectID(postId)})

    return res.send(JSON.stringify({success: true, post}))
  }
  catch (err) {
    console.log(err)
    res.send(JSON.stringify({success:false}))
  }
})

app.post('/post/edit', upload.none(), async (req, res) => {
  let username = sessions[req.cookies.sid]
  let postId = req.body.postId
  let location = req.body.location
  let description = req.body.description
  let tags = req.body.tags.split(',')
  
  try{
    let post = await dbo.collection('posts').findOneAndUpdate({_id: ObjectID(postId)}, {$set: {location, description, tags}})
    res.send(JSON.stringify({success: true, post}))
  }
  catch (err) {
    console.log(err)
    res.send(JSON.stringify({success:false}))
  }
})

app.post('/post/delete', upload.none(), async (req, res) => {
  let username = sessions[req.cookies.sid]
  let postId = req.body.postId
  
  if (!username) return

  try{
    await dbo.collection('posts').remove({_id: ObjectID(postId)},{justOne: true})
    res.send(JSON.stringify({success: true}))
  }
  catch (err) {
    console.log(err)
    res.send(JSON.stringify({success:false}))
  }
})


app.post('/profile/follow', upload.none(), async (req,res) => {
  let username = sessions[req.cookies.sid]
  let profile = req.body.profile
  let action = req.body.action

  try {
    let user = await dbo.collection('users').findOne({ username })
    let newProfile
    if (action === 'unfollow') {
    user = await dbo.collection('users').findOneAndUpdate({ username }, { $pull: { "social.following": profile }}, {returnOriginal:false});
    newProfile = await dbo.collection('users').findOneAndUpdate({ username: profile }, { $pull: { "social.followers": username }},{returnOriginal:false})
    }
    if (action === 'follow') {
      user = await dbo.collection('users').findOneAndUpdate({ username }, { $push: { 'social.following': profile }},{returnOriginal:false});
      newProfile = await dbo.collection('users').findOneAndUpdate({ username: profile }, { $push: { 'social.followers': username }},{returnOriginal:false})  
    }
    res.send(JSON.stringify({success:true, user, newProfile}))
  }
  catch (err) {
    console.log(err)
    res.send(JSON.stringify({success:false}))
  }
})

app.post('/post/comment/new', upload.none(), async (req, res) => {
  let username = sessions[req.cookies.sid]
  let comment = req.body.comment
  let time = req.body.time
  let post = req.body.post

  try {
    await dbo.collection('posts').findOneAndUpdate({ _id: ObjectID(post) }, { $push: { comments: {username, time, comment, likes: []} }});
    let feed = await dbo.collection("posts").find({}).toArray()
    feed.reverse()
    res.send(JSON.stringify({success:true, feed}))
  } catch (err) {
    console.log(err)
    res.send(JSON.stringify({success:false}))
  }
})

app.post('/post/comment/delete', upload.none(), async (req,res) => {
  let username = req.body.username
  let comment = req.body.comment
  let post = req.body.post

  try {
    await dbo.collection('posts').updateOne({ _id: ObjectID(post) }, { $pull: { comments: {username, comment} }});
    let feed = await dbo.collection("posts").find({}).toArray()
    feed.reverse()
    res.send(JSON.stringify({success:true, feed}))
  }
  catch (err) {
    console.log(err)
    res.send(JSON.stringify({success:false}))
  }
})

app.post('/post/like', upload.none(), async (req, res) => {
  console.log('request to /like-post ', req.body.post)
  let username = sessions[req.cookies.sid]
  let onePost = req.body.post
  let following = req.body.following.split(',')
  console.log(following)

  try {
    let updated = false
    let post = await dbo.collection("posts").findOne({_id: ObjectID(onePost)})
    post.likes.forEach(async user => {
      if (user === username) {
        dbo.collection('posts').findOneAndUpdate({ _id: ObjectID(onePost) }, { $pull: { likes: username } });
        dbo.collection('users').findOneAndUpdate({username}, {$pull: {likes: onePost}})
        updated = true
      }
    })
    if (updated === false) { // for if the array is empty
      dbo.collection('posts').findOneAndUpdate({ _id: ObjectID(onePost) }, { $push: { likes: username }});
      dbo.collection('users').findOneAndUpdate({username}, {$push: {likes: onePost}})
    } 
    let feed = await dbo.collection("posts").find({}).toArray()
    let user = await dbo.collection("users").findOne({username})
    let followFeed = []
    
    if (following) {
      for (var i = 0; i < feed.length; i++) {
        for (var x = 0; x < following.length; x++) {
          if (feed[i].uploader === following[x]) {
            followFeed.push(feed[i])
          }
        }
      }
  } else followFeed = []
    followFeed.reverse()

    return res.send(JSON.stringify({success: true, feed: followFeed, user}))
  } catch (err) {
    console.log(err)
    res.send(JSON.stringify({success: false}))
  }
})

app.post('/user/register', upload.none(), async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let fullName = req.body.fullName

  try {
    await dbo.collection("users").findOne({username}, (_ ,user) => {
      if (!user) {
        dbo.collection("users").insertOne({
          fullName,
          username,
          password: sha1(password),
          social: {following: [], followers: []},
          chat: {},
          profilePicture: "/uploads/no-image-found.png",
          profileDescription: '',
          likes: [],
          chatIds: []
        })
      } else res.send(JSON.stringify({ success: false }));
    })
    let allUsers = await dbo.collection('users').find({}).toArray()

      allUsers.forEach(async (user2) => {
        if (user2.username !== username) {
          let x = await dbo.collection('chat').insertOne({messages: [], users: [username, user2.username]})
          x = x.ops
          let id = x[0]._id.toString()
          await dbo.collection("users").updateOne({username}, {$push: {chatIds: id}})
          await dbo.collection("users").updateOne({username: user2.username}, {$push: {chatIds: id}})
        }
      })

      res.send(JSON.stringify({ success: true }));
      return
  } catch (err) {
    console.log(err)
    res.send(JSON.stringify({ success: false }));
  }
})

app.post('/user/login', upload.none(), async (req, res) => {
  let username = req.body.username
  let password = req.body.password

  try {
    let user = await dbo.collection('users').findOne({username})
      if (!user) {
        return res.send(JSON.stringify({success: false}))
      }
      if (user.password === sha1(password)) {
        let sessionId = Math.floor(Math.random() * 10000000000)
        sessions[sessionId] = username
        res.cookie('sid', sessionId);
        res.send(JSON.stringify({success: true, user}))
        return
      }
      return res.send(JSON.stringify({success: false}))
  } catch (err) {
    console.log("/login error", err)
    return res.send(JSON.stringify({success: false}))
  }
})

app.post('/user/logout', upload.none(), (req, res) => {
  if (req.cookies.sid) {
    delete sessions[req.cookies.sid];
    res.send(JSON.stringify({ success: true }));
  } else {
    res.send(JSON.stringify({ success: false }));
  }
});

// Your endpoints go before this line

app.all('/*', (req, res, next) => { // needed for react router
    res.sendFile(__dirname + '/build/index.html');
})

const { PORT = 4000, LOCAL_ADDRESS = '0.0.0.0' } = process.env; // for hiroku
app.listen(PORT, LOCAL_ADDRESS, () => {
   console.log("Server running on port " + PORT) 
  })
