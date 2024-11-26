const User = require("../models/users");
const PrivateMessage = require("../models/privateMessage");
const GroupMessage = require("../models/groupMessage");

const users = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("registerUser", async (username) => {
      const user = await User.findOne({ username });

      if (user) {
        users[username] = socket.id;
        console.log(`${username} registered with socket ID: ${socket.id}`);
      }
    });

    // private chat
    socket.on("privateMessage", async ({ from, message, to }) => {
      const sender = await User.findOne({ username: from });
      const recipient = await User.findOne({ username: to });

      if (sender && recipient) {
        const newMessage = await PrivateMessage.create({
          from: sender._id,
          message: message,
          to: recipient._id,
        });

        const recipientSocketId = users[to];

        if (recipientSocketId) {
          io.to(recipientSocketId).emit("privateMessage", {
            message: newMessage.message,
            from: sender.username,
            timestamp: newMessage.timestamp,
          });
        }
      }
    });

    // Groupchat
    socket.on("groupMessage", async (data) => {
      const sender = User.findOne({ username: data.username });
      const newMessage = await GroupMessage.create({
        from: sender._id,
        message: data.message,
      });

      io.emit("groupMessage", {
        message: newMessage.message,
        from: sender._id,
        timestamp: newMessage.timestamp,
      });
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      for (const username in users) {
        if (users[username] === socket.id) {
          delete users[username];
          break;
        }
      }
    });
  });
};
