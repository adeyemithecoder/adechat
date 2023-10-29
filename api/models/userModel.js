const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    gender: { type: String },
    birthday: { type: String },
    phone: { type: String },
    school: { type: String },
    resetToken: { type: String },
    profilePicture: { type: String, default: "" },
    coverPicture: { type: String, default: "" },
    followers: { type: Array, default: [] },
    followings: { type: Array, default: [] },
    isAdmin: { type: Boolean, default: false },
    online: { type: Boolean, default: false },
    messageCount: { type: String, default: "" },
    onlineTime: { type: String, default: "" },
    desc: { type: String, max: 50, default: "" },
    city: { type: String, max: 50, default: "" },
    from: { type: String, max: 50 },
    relationship: { type: String, default: "" },
    resetToken: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
