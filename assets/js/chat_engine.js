//frontend

class ChatEngine {
  constructor(chatBoxId, userEmail, userName, hi) {
    this.chatbox = $(`#${chatBoxId}`);
    this.userEmail = userEmail;
    this.userName = userName;

    //io from cdn file
    //socket connection ask for a connection and event -> connection
    this.socket = io.connect("http://localhost:5000");

    if (this.userEmail) {
      this.connectionHandler();
    }
  }

  connectionHandler() {
    //ask to join the room
    let self = this;

    //receives the acknowledgement from backend
    this.socket.on("connect", function () {
      console.log("connection established using sockets...");

      //join the chat room
      self.socket.emit("join_room", {
        user_email: self.userEmail,
        chatroom: "codeial",
      });

      //get the event a inform all
      self.socket.on("user_joined", function (data) {
        console.log("a user joined", data);
      });
    });

    $("#send-message").click(function () {
      let message = $("#chat-message-input").val();
      if (message != "") {
        //emit the send message event
        self.socket.emit("send_message", {
          message: message,
          user_email: self.userEmail,
          user_name: self.userName,
          chatroom: "codeial",
        });
      }
    });

    self.socket.on("receive_message", function (data) {
      console.log("message received", data);

      let newMessage = $("<li>");
      let messageType = "other-message";
      if (data.user_email == self.userEmail) {
        messageType = "self-message";
      }

      newMessage.append(
        $("<div>", {})
          .addClass("card")
          .append(
            $("<span>", {
              html: data.message,
            }).addClass("card-header"),
            $("<ul>", {})
              .addClass("list-group list-group-flush")
              .append(
                $("<li>", {
                  html: data.user_name,
                }).addClass("list-group-item")
              )
          )
      );
      
      newMessage.addClass(messageType);
      $("#chat-messages-list").append(newMessage);
    });
  }
}
