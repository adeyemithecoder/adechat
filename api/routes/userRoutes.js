const {
  isAuth,
  isAdmin,
  generateToken,
  baseUrl,
  sendMail,
} = require("../utils");

const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res
        .status(404)
        .send({ message: `user with Email: ${req.body.email} does not exist` });
    } else {
      const correctPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (correctPassword) {
        res.send({
          user,
          token: generateToken(user),
        });
      } else {
        res.status(401).send({ message: "Invalid email or password" });
      }
    }
  })
);
userRouter.post("/delete", async (req, res) => {
  const test = await User.deleteMany();
  res.status(200).json(test);
});

userRouter.get("/onlinuser", async (req, res) => {
  const test = await User.find({
    online: [true],
  });
  res.status(200).json(test);
});
userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const { username, email, gender, birthday, password } = req.body;
    const found = await User.findOne({ email });
    if (found) {
      res.status(401).send({ message: `User with ${email} already exist` });
    } else {
      const newUser = new User({
        username,
        email,
        password: await bcrypt.hash(password, 10),
        gender,
        birthday,
      });
      const user = await newUser.save();
      res.send({
        _id: user._id,
        username: user.username,
        email: user.email,
        gender: gender,
        birthday: birthday,
        isAdmin: user.isAdmin,
      });
    }
  })
);

userRouter.put(
  "/:id/update",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      const result = await User.findById(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  })
);
userRouter.put(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
          return res.status(500).json(err);
        }
      }
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        res.status(200).json("Account has been updated");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can update only your account!");
    }
  })
);
//delete user
userRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been deleted");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("You can delete only your account!");
    }
  })
);

//get friends
userRouter.get(
  "/friends/:userId",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const friends = await Promise.all(
        user.followings.map((friendId) => {
          return User.findById(friendId);
        })
      );
      let friendList = [];
      friends.map((friend) => {
        const { _id, username, profilePicture } = friend;
        friendList.push({ _id, username, profilePicture });
      });
      res.status(200).json(friendList);
    } catch (err) {
      res.status(500).json(err);
    }
  })
);
userRouter.get(
  "/alluser/:userId",
  expressAsyncHandler(async (req, res) => {
    try {
      const alluser = await User.find({
        _id: { $ne: req.params.userId },
      }).select([
        "email",
        "username",
        "online",
        "updatedAt",
        "messageCount",
        "onlineTime",
        "profilePicture",
        "_id",
      ]);
      res.status(200).json(alluser);
    } catch (err) {
      res.status(500).json(err);
    }
  })
);
//follow a user

userRouter.put(
  "/:id/follow",
  expressAsyncHandler(async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId } });
          await currentUser.updateOne({ $push: { followings: req.params.id } });
          res.status(200).json("user has been followed");
        } else {
          res.status(403).json("you allready follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant follow yourself");
    }
  })
);
//unfollow a user
userRouter.put(
  "/:id/unfollow",
  expressAsyncHandler(async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you dont follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  })
);

//get a user
userRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
      const user = userId
        ? await User.findById(userId)
        : await User.findOne({ username: username });
      const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
      console.log(userId);
    } catch (err) {
      res.status(500).json(err);
    }
  })
);
//get a user

userRouter.post(
  "/forget-password",
  expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });
      user.resetToken = token;
      await user.save();
      try {
        const reply_to = email;
        const subject = "Reset Password";
        const sent_from = process.env.EMAIL_USER;
        const sent_to = `${user.username} <${user.email}>`;
        const message = `
        <a href="${baseUrl()}/reset-password/${token}"}>Reset Password</a>
         <p>Please Click the following link to reset your password:</p>
         `;
        await sendMail(subject, message, sent_to, sent_from, reply_to);
        (error, body) => {
          console.log("error", error);
        };
        res.send({
          message: `We sent reset password link to ${email}.`,
          resetLink: `${baseUrl()}/reset-password/${token}`,
        });
      } catch (err) {
        res.status(500).json("err from outlook", err.message);
      }
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

userRouter.post(
  "/reset-password",
  expressAsyncHandler(async (req, res) => {
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        const user = await User.findOne({ resetToken: req.body.token });
        console.log("user", user);
        if (user) {
          if (req.body.password) {
            user.password = bcrypt.hashSync(req.body.password, 8);
            await user.save();
            res.status(201).json({
              message: "Password reseted successfully",
            });
            res.end("ok");
          }
        } else {
          res.status(404).json({ message: "User not found" });
        }
      }
    });
  })
);
module.exports = userRouter;
