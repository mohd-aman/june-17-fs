const { Server } = require("socket.io");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.emit("welcome", "Hello from VYBE");

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = { initSocket };