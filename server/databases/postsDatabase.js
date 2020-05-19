import { ObjectID } from "mongodb"
import { connection } from "../util/connection";


const getAllPosts = async () => {
    return await connection.collection("posts").find({}).toArray();
}

const getExplore = async () => {
    return await connection.collection("posts").find({}).toArray();
}

const getOnePost = async (postId) => {
 return await connection.collection("posts").findOne({ _id: ObjectID(postId) });
}

const getUploadedPosts = async (username) => {
    return await connection
    .collection("posts")
    .find({ uploader: username })
    .toArray();
}

const createPost = async (description, location, comments, likes, imgPaths, uploader, tagArr, profilePicture) => {
    await connection.collection("posts").insertOne({
        description,
        location,
        comments,
        likes,
        img: imgPaths,
        uploader,
        tags: tagArr,
        profilePicture,
    });
}

const editPost = async (postId, location, description, tags) => {
    await connection
          .collection("posts")
          .findOneAndUpdate(
            { _id: ObjectID(postId) },
            { $set: { location, description, tags } }
          );
}

const removePost = async (postId) => {
    await connection
    .collection("posts")
    .remove({ _id: ObjectID(postId) }, { justOne: true });
}

const removeLike = async (postId, username) => {
    connection
    .collection("posts")
    .findOneAndUpdate(
      { _id: ObjectID(postId) },
      { $pull: { likes: username } }
    );
    connection
    .collection("users")
    .findOneAndUpdate({ username }, { $pull: { likes: postId } });
}

const likePost = async (postId, username) => { 
    connection
    .collection("posts")
    .findOneAndUpdate(
      { _id: ObjectID(postId) },
      { $push: { likes: username } }
    );
    connection
    .collection("users")
    .findOneAndUpdate({ username }, { $push: { likes: postId } });
}

const postComment = async (postId, username, time, comment) => {
    await connection
    .collection("posts")
    .findOneAndUpdate(
      { _id: ObjectID(postId) },
      { $push: { comments: { username, time, comment, likes: [] } } }
    );
}

const removeComment = async (postId, username, comment) => {
    await connection
    .collection("posts")
    .updateOne(
      { _id: ObjectID(postId) },
      { $pull: { comments: { username, comment } } }
    );
}

const editPicture = async (username, imgPath) => {
    await connection
    .collection("posts")
    .updateMany(
      { uploader: username },
      { $set: { profilePicture: imgPath } }
    );
  };

const updatePostsUsername = async(username, newUsername) => {
    await connection
      .collection("posts")
      .updateMany(
        { uploader: username },
        { $set: { uploader: newUsername } }
      );
    await connection
      .collection("posts")
      .updateMany(
        { "comments.username": username },
        { $set: { "comments.$[element].username": newUsername } },
        { arrayFilters: [{ "element.username": username }], multi: true }
      );
    await connection
      .collection("posts")
      .updateMany(
        { likes: { $in: [username] } },
        { $set: { "likes.$": newUsername } }
      );
}

export { 
    getAllPosts, getExplore, getOnePost, getUploadedPosts, 
    createPost, editPost, removePost, removeLike, 
    likePost, postComment, removeComment, editPicture, updatePostsUsername 
}