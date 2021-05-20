const socket = require('socket.io');

let corresponding = {};

let io;
exports.initSocketServer = (server, { path }) => {
  io = socket(server, { 
        path,
        cors: {
            methods: ["GET", "POST"],
        },
    });
  
  io.on('connect', sock => {
    console.log("new connexion", sock.id);
    sock.on("disconnect", () => {
      console.log("disconnection", sock.id);
    })
    sock.on('send_id', (data) => {
      corresponding[data] = sock.id;
    })
  })
};

exports.getIo = () => {
  return io;
}

exports.getCorresponding = () => {
  return corresponding
}

exports.getClients = async () => {
  const resp = await io.allSockets();
  return [...resp];
}

exports.ioEmit = (arg, msg = "") => {
  io.emit(arg);
};