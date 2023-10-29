const express = require("express");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");
const postRouter = express.Router();

postRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const newPost = new Post(req.body);
    try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      res.status(500).json(err);
    }
  })
);
postRouter.post("/delete", async (req, res) => {
  const test = await Post.deleteMany();
  res.status(200).json(test);
});

postRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      const allPost = await Post.find({});
      res.status(200).json(allPost);
    } catch (err) {
      res.status(500).json(err);
    }
  })
);
//update a post

postRouter.put(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
        await post.updateOne({ $set: req.body });
        res.status(200).json("the post has been updated");
      } else {
        res.status(403).json("you can update only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  })
);
//delete a post

postRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
        await post.deleteOne();
        res.status(200).json("the post has been deleted");
      } else {
        res.status(403).json("you can delete only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  })
);
//like / dislike a post

postRouter.put(
  "/:id/comments",
  expressAsyncHandler(async (req, res) => {
    try {
      const whoComment = await User.findById(req.body.userId);
      const result = {
        img: whoComment.profilePicture,
        username: whoComment.username,
        date: new Date(),
        msg: req.body.msg,
      };
      const post = await Post.findById(req.params.id);
      post.comments = result;
      await post.updateOne({ $push: { comments: result } });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  })
);
// postRouter.get(
//   "/allcomments",
//   expressAsyncHandler(async (req, res) => {
//     try {
//       const post = await Post.findById(req.params.id);
//       const allcomments = post.comments;
//       res.status(200).json(allcomments);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   })
// );
// userRouter.put(
//   "/profile",
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const user = await User.findById(req.user._id);
//     if (user) {
//       user.name = req.body.name || user.name;
//       user.email = req.body.email || user.email;
//       if (req.body.password) {
//         user.password = bcrypt.hashSync(req.body.password, 8);
//       }
//       const updatedUser = await user.save();
//       res.send({
//         _id: updatedUser._id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         isAdmin: updatedUser.isAdmin,
//         token: generateToken(updatedUser),
//       });
//     } else {
//       res.status(404).send({ message: "User not found" });
//     }
//   })
// );
postRouter.put(
  "/:id/like",
  expressAsyncHandler(async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(req.body.userId)) {
        await post.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json("The post has been liked");
      } else {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json("The post has been disliked");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  })
);
//get a post

postRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  })
);

//get timeline posts
postRouter.get(
  "/timeline/:userId",
  expressAsyncHandler(async (req, res) => {
    try {
      const currentUser = await User.findById(req.params.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
      res.status(500).json(err);
    }
  })
);

//get user's all posts

postRouter.get(
  "/profile/:username",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      const posts = await Post.find({ userId: user._id });
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  })
);
module.exports = postRouter;
