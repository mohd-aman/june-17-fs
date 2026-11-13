const { Server } = require("socket.io");
const mongoose = require("mongoose");

let io;

const roomFor = (showId) => `show:${showId}`;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-show", (showId) => {
      // Never trust the client: only real show ids may name a room
      if (!mongoose.isObjectIdOrHexString(showId)) return;
      socket.join(roomFor(showId));
    });

    socket.on("leave-show", (showId) => {
      if (!mongoose.isObjectIdOrHexString(showId)) return;
      socket.leave(roomFor(showId));
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

// Called by the booking controller whenever seats change
const emitSeatUpdate = (show) => {
  if (!io || !show) return;
  io.to(roomFor(show._id)).emit("seat-update", {
    showId: show._id,
    availableSeats: show.availableSeats,
  });
};

module.exports = { initSocket, emitSeatUpdate };