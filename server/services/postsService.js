import { postsDatabase } from "../databases";

const getOnePost = async (postId) => {
  return await postsDatabase.getOnePost(postId);
};

const getUploadedPosts = async (username) => {
  return await postsDatabase.getUploadedPosts(username);
};

const getAllPosts = async () => {
  return await postsDatabase.getAllPosts();
};

const getExplore = async () => {
    return await postsDatabase.getExplore()
}

const createPost = async (description, location, comments, likes, imgPaths, uploader, tagArr, profilePicture) => {
  await postsDatabase.createPost(description, location, comments, likes, imgPaths, uploader, tagArr, profilePicture)
}

const editPost = async (postId, location, description, tags) => {
  await postsDatabase.editPost(postId, location, description, tags)
}

const removePost = async (postId) => {
  await postsDatabase.removePost(postId)
}

const removeLike = async (postId, username) => {
  postsDatabase.removeLike(postId, username)
}

const likePost = async (postId, username) => {
  postsDatabase.likePost(postId, username)
}

const postComment = async (postId, username, time, comment) => {
  await postsDatabase.postComment(postId, username, time, comment)
}

const removeComment = async (postId, username, comment) => {
  await postsDatabase.removeComment(postId, username, comment)
}

const editPicture = async (username, imgPath) => {
  await postsDatabase.editPicture(username, imgPath)
}

const updatePostsUsername = async (username, newUsername) => {
  await postsDatabase.updatePostsUsername(username, newUsername)
}

export { 
  getAllPosts, getExplore, getOnePost, getUploadedPosts, 
  createPost, editPost, removePost, removeLike, likePost, 
  postComment, removeComment, editPicture, updatePostsUsername 
};
