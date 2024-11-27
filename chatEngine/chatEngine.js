const User = require("../models/users");
const PrivateMessage = require("../models/privateMessage");
const GroupMessage = require("../models/groupMessage");

const users = {}; // This will map usernames to socket IDs

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    // Register the user and associate with a socket ID
    socket.on("registerUser", async (username) => {
      const user = await User.findOne({ username });

      if (user) {
        users[user._id] = socket.id;
        console.log(`${username} registered with socket ID: ${socket.id}`);
      } else {
        console.log(`User not found: ${username}`);
      }
    });

    // Handle private messaging
    socket.on('privateMessage', async ({ from, message, to }) => {
      console.log('Private message received:', { from, message, to });
    
      try {
        const sender = await User.findOne({ _id: from });
        const recipient = await User.findOne({ _id: to });
    
        if (sender && recipient) {
          // Ensure that sender and recipient are valid MongoDB ObjectIds
          const newMessage = await PrivateMessage.create({
            from: sender._id,
            message: message,
            to: recipient._id,
          });
    
          console.log('Message saved:', newMessage);  // Log saved message
    
          // Send the message to the recipient's socket
          const recipientSocketId = users[to];
          console.log("recipientSocketId",recipientSocketId);
          console.log("users",users);
          if (recipientSocketId) {
            io.to(recipientSocketId).emit('privateMessage', {
              message: newMessage.message,
              from: sender.name,
              timestamp: newMessage.timestamp,
            });
          }
        } else {
          console.log('Sender or recipient not found');
        }
      } catch (error) {
        console.log('Error saving private message:', error); // Log any error that occurs during save
      }
    });
    
  
    

    // Handle group messaging
    socket.on("groupMessage", async (data) => {
      const sender = await User.findOne({ username: data.username });

      if (sender) {
        const newMessage = await GroupMessage.create({
          from: sender._id,
          message: data.message,
        });

        // Emit the group message to all connected users
        io.emit("groupMessage", {
          message: newMessage.message,
          from: sender.username,
          timestamp: newMessage.timestamp,
        });
      }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      // Remove the disconnected user from the users mapping
      for (const username in users) {
        if (users[username] === socket.id) {
          delete users[username];
          break;
        }
      }
    });
  });
};
