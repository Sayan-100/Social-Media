//server side
module.exports.chatSockets = function (socketServer) {
  //receiveing the connection
  let io = require("socket.io")(socketServer, {
    cors: {
      origin: ["http://18.208.115.15:8000", "http://localhost:8000", "http://18.208.115.15"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  //it is called 'connect' on frontend
  io.sockets.on("connection", function (socket) {
    console.log("new connection received", socket.id);
    //sends an acknoledgement to frontend in connectionHandler

    //whenever client disconnets an autometic 'disconnect' event on frontend receiveing that
    socket.on("disconnect", function () {
      console.log("socket disconnected ....");
    });

    socket.on('join_room', function(data) {
        console.log('joining request received .....', data);
        //if chatroom exist the user will join the chatroom else it will create
        //a chatroom and join the user
        socket.join(data.chatroom);
    
        //emit in a specific chatroom io.in all the user 
        io.in(data.chatroom).emit('user_joined', data);
    })


    //receive the send message event and emits that to everyone
    socket.on('send_message', function(data) {
        io.in(data.chatroom).emit('receive_message', data);
    })
  });
};
