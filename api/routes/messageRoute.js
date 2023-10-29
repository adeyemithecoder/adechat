const express = require("express");
const messageRoute = express.Router();
const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");

messageRoute.post(
  "/sendMessage",
  expressAsyncHandler(async (req, res) => {
    // const test = await Message.deleteMany();
    // res.status(200).json(test);
    const { from, to, message, messageCount } = req.body;
    try {
      const data = await Message.create({
        message: message,
        users: [from, to],
        sender: from,
        messageCount: messageCount,
      });
      if (data) {
        const value = {
          myOwn: true,
          messages: message,
        };
        res.status(200).json(value);
      } else {
        res
          .status(500)
          .json({ message: "falled to Add message to the database" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  })
);
messageRoute.delete(
  "/",
  expressAsyncHandler(async (req, res) => {
    const test = await Message.deleteMany();
    res.status(200).json(test);
  })
);
messageRoute.put(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await Message.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      const result = await Message.findById(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  })
);
messageRoute.post(
  "/getMessage",
  expressAsyncHandler(async (req, res) => {
    const { from, to } = req.body;
    try {
      const data = await Message.find({ users: { $all: [from, to] } }).sort({
        updatedAt: 1,
      });
      const message = data.map((msg) => {
        return {
          myOwn: msg.sender.toString() === from,
          messages: msg.message,
          messageCount: msg.messageCount,
          updatedAt: msg.updatedAt,
        };
      });
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json(err);
    }
  })
);
module.exports = messageRoute;
