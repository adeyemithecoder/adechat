const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./connection");
const userRouter = require("./routes/userRoutes");
const multer = require("multer");
const path = require("path");
const postRouter = require("./routes/postRouter");
const messageRoute = require("./routes/messageRoute");
const socket = require("socket.io");
dotenv.config();
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
connectDB();
const port = process.env.PORT || 4000;
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/message", messageRoute);
app.use("/images", express.static(path.join(__dirname, "public/images")));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});
app.get("/", (req, res) => res.send("welcome to chatapp"));

app.use((err, req, res, next) => {
  res.status(500).send({ message: `From Test ${err.message}` });
});
app.use(express.static(path.join(__dirname, "/client/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/client/build/index.html"))
);
const server = app.listen(port, () =>
  console.log(`app is currently running on port http://localhost:${port}`)
);

const io = socket(server, {
  cors: {
    origin: process.env.REACT_APP_API_URL,
    credentials: true,
  },
});
global.onlineUsers = new Map();

let users = [];
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
io.on("connection", (socket) => {
  console.log("a user connected");
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    addUser(userId, socket.id);
    onlineUsers.set(userId, socket.id);
    io.emit("alluser", users);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    const result = {
      isRead: false,
      date: new Date(),
      senderId: data.from,
    };
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-received", data.messages);
      socket.to(sendUserSocket).emit("notification", result);
    }
  });

  socket.on("typing", (data) => {
    const sendUser = onlineUsers.get(data);
    if (sendUser) {
      socket.to(sendUser).emit("typingFromSocket", "typing...");
    }
  });
  socket.on("disconnect", () => {
    console.log("a user Disconnected");
    const find = users.find((user) => user.socketId === socket.id);
    io.emit("offline", find);
    removeUser(socket.id);
  });
});
