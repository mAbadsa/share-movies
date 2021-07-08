const http = require('http');
// const cors = require('cors');
const socket = require('socket.io');
require('dotenv').config();

const {
  env: { PORT },
} = process;

const app = require('./app');

const server = http.createServer(app);

// app.use(cors());

const io = socket(server);

// io.on('connection', (req) => {
//   req.on('disconnecting', () => {
//     const roomId = [...req.rooms].find((item) => item !== req.id);
//     req.leave(roomId);
//     const connectedUsers = io.sockets.adapter.rooms?.get(roomId)?.size || 1;
//     io.to(roomId).emit('roomId', { roomId, connectedUsers });
//   });

//   req.on('join-room', ({ roomId, loadedData, nickname }) => {
//     console.log(roomId);
//     req.join(roomId);
//     const connectedUsers = io.sockets.adapter.rooms?.get(roomId)?.size || 1;
//     req.loadedData = loadedData;
//     req.nickname = nickname;
//     const loadDataUsers = [...io.sockets.sockets].filter(
//       (item) =>
//         io.sockets.adapter.rooms.get(roomId).has(item[0]) && item[1].loadedData,
//     ).length;
//     io.to(roomId).emit('roomId', {
//       roomId,
//       connectedUsers,
//       loadedData,
//       id: req.id,
//       loadDataUsers,
//     });
//   });

//   req.on('create-room', ({ loadedData, nickname }) => {
//     const roomId = `${req.id}+${Math.random().toFixed(3)}`;
//     req.join(roomId);
//     const connectedUsers = io.sockets.adapter.rooms?.get(roomId)?.size || 1;
//     req.loadedData = loadedData;
//     req.nickname = nickname;
//     const loadDataUsers = [...io.sockets.sockets].filter(
//       (item) =>
//         io.sockets.adapter.rooms.get(roomId).has(item[0]) && item[1].loadedData,
//     ).length;
//     io.to(roomId).emit('roomId', {
//       roomId,
//       connectedUsers,
//       loadedData,
//       id: req.id,
//       loadDataUsers,
//     });
//   });

//   req.on('loadeddata', ({ roomId, loadedData }) => {
//     req.loadedData = loadedData;
//     const loadDataUsers = [...io.sockets.sockets].filter(
//       (item) =>
//         io.sockets.adapter.rooms.get(roomId).has(item[0]) && item[1].loadedData,
//     ).length;

//     io.to(roomId).emit('loadeddata', {
//       id: req.id,
//       loadedData,
//       loadDataUsers,
//     });
//   });

//   req.on('timeUpdated', ({ roomId, currentTime }) => {
//     req.currentTime = currentTime;
//     console.log(req.nickname, req.currentTime);
//     const usersNickNames = [...io.sockets.sockets]
//       .filter((item) => io.sockets.adapter.rooms.get(roomId).has(item[0]))
//       .map((item) => ({
//         nickname: item[1].nickname,
//         currentTime: item[1].currentTime,
//       }));
//     io.to(roomId).emit('timeUpdated', {
//       id: req.id,
//       currentTime,
//       usersNickNames,
//     });
//   });

//   req.on('movieUrl', (data) => {
//     io.sockets.sockets.forEach((socketItem) => {
//       socketItem.loadedData = false;
//     });
//     req.to(data.roomId).emit('movieUrl', data.url);
//   });

//   //
//   req.on('seeked', ({ time, roomId }) => {
//     req.to(roomId).emit('seeked', { time });
//   });

//   // Handle typing event
//   req.on('play', (data) => {
//     req.to(data.roomId).emit('play', {
//       time: data.currentTime,
//       nickname: req.nickname,
//     });
//   });

//   // Handle typing event
//   req.on('pause', (roomId) => {
//     req.to(roomId).emit('pause', { nickname: req.nickname });
//   });

//   // Handle chat event
//   req.on('chat', (data) => {
//     req.to(data.roomId).emit('chat', data.message);
//   });

//   // Handle typing event
//   req.on('typing', (data) => {
//     req.to(data.roomId).emit('typing', data.message);
//   });
// });

console.log("back");

io.on("connection", (socket) => {
  // console.log(socket.id);
  // console.log(socket.rooms);

  socket.on("create-room", ({ newRoomId, username }) => {
    socket.owner = socket.id;
    socket.join(newRoomId);
    console.log({newRoomId});
    const connectedUsers = io.sockets.adapter.rooms?.get(newRoomId)?.size || 1;
    io.to(newRoomId).emit("create-room", { newRoomId, id: socket.id, username, connectedUsers });
    // [...io.sockets.sockets].filter(i => console.log(i))[0];
  });

  socket.on('join-room', ({ roomId, username }) => {
    socket.join(roomId);
    console.log({roomId});
    const connectedUsers = io.sockets.adapter.rooms?.get(roomId)?.size || 1;
    io.to(roomId).emit("join-room-data", { roomId, id: socket.id, username, connectedUsers });
    console.log(connectedUsers);
  });

  socket.on('number-user-connected', ({ roomId }) => {
    console.log("number-user-connected", roomId)
    const connectedUsers = io.sockets.adapter.rooms?.get(roomId)?.size || 1;
    console.log("user count::", { connectedUsers });
    // socket.emit("get-number-user-connect", { connectedUsers });
    io.to(roomId).emit("number-user-connected", { connectedUsers });
  });

  socket.on('leave-room', ({roomId: _roomId}) => {
    const roomId = [...socket.rooms].find((item) => item !== socket.id);
    console.log(_roomId);
    socket.leave(_roomId);
    const connectedUsers = io.sockets.adapter.rooms?.get(roomId)?.size || 1;
    io.to(roomId).emit('leave-room', { roomId, connectedUsers });
  })

  socket.on("disconnect", () => {
    console.log("disconnect")
  });
});

server.listen(PORT || 8080, () =>
  console.log(`server is connected @ http://localhost:${PORT}`)
);
