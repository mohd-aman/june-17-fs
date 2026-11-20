const { Server } = require("socket.io");
const mongoose = require("mongoose");

let io;

const roomFor = (showId) => `show:${showId}`;

// How many sockets are in a room right now
const viewersIn = (room) => io.sockets.adapter.rooms.get(room)?.size || 0;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-show", (showId) => {
      // Never trust the client: only real show ids may name a room
      if (!mongoose.isObjectIdOrHexString(showId)) return;
      const room = roomFor(showId);
      socket.join(room);
      io.to(room).emit("viewers", viewersIn(room));
    });

    socket.on("leave-show", (showId) => {
      if (!mongoose.isObjectIdOrHexString(showId)) return;
      const room = roomFor(showId);
      socket.leave(room);
      io.to(room).emit("viewers", viewersIn(room));
    });

    // "disconnecting" fires while the socket is still inside its rooms
    socket.on("disconnecting", () => {
      for (const room of socket.rooms) {
        if (room.startsWith("show:")) {
          socket.to(room).emit("viewers", viewersIn(room) - 1);
        }
      }
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
