{
  let createFriend = function () {
    console.log("inside add friend ajax ...........");
    let addFriendButton = $("#add-friend-button");
    let text = $(addFriendButton).text();
    console.log('button text ----> ', text);

    $(addFriendButton).click(function (e) {
      e.preventDefault();
        $.ajax({
          type: "GET",
          url: $(addFriendButton).prop("href"),
        }).done(function (data) {
          if (data.data.done) {

            let fromUser = $(addFriendButton).attr("data-fromUser");
            let toPeople = $(addFriendButton).attr("data-toUser");
            console.log('to People ' + toPeople);

            let otherProfileFrom = document.getElementById('other-profile-form');
            console.log('form ---------------------> ', otherProfileFrom);
            $(addFriendButton).remove();

            let removeButtonLink = document.createElement("a");
            removeButtonLink.setAttribute("id", "remove-friend-button");
            removeButtonLink.setAttribute("href", `/users/removeFriend?fromID=${fromUser}&toID=${toPeople}`);
            let removeButton = document.createElement("INPUT");
            removeButton.setAttribute("type", "submit");
            removeButton.setAttribute("value", "Remove Friend");
            removeButtonLink.setAttribute("data-toUserFriend", toPeople);
            removeButtonLink.setAttribute("data-fromUserFriend", fromUser);
            removeButton.classList.add('btn', 'btn-info', 'form-control');
            removeButtonLink.appendChild(removeButton);
            otherProfileFrom.appendChild(removeButtonLink);
            removeFriend(removeButtonLink);
          }
        });
    }); 
  };

  let removeFriend = function(removeButtonLink) {
   
    $(removeButtonLink).click(function(e) {
      e.preventDefault();
      $.ajax({
        type : "GET",
        url : $(removeButtonLink).prop("href"),
      }).done(function(data) {
        if(data.message == "Friend Removed") {

          console.log('remove button ' + $(removeButtonLink).prop("href"));

          let toUser = $(removeButtonLink).attr("data-toUserFriend");
          let fromUser = $(removeButtonLink).attr("data-fromUserFriend");

          console.log('****************************** ', toUser);

          $(removeButtonLink).remove();
          let otherProfileFrom = document.getElementById('other-profile-form');
          let createButtonLink = document.createElement("a");
          createButtonLink.setAttribute("id", "add-friend-button");
          createButtonLink.setAttribute("href", `/users/addFriend/${toUser}`);
          let createButton = document.createElement("INPUT");
          createButton.setAttribute("type", "submit");
          createButton.setAttribute("value", "Add Friend");
          createButtonLink.setAttribute("data-fromUser", fromUser);
          createButtonLink.setAttribute("dat-toUser", toUser);
          createButton.classList.add('btn', 'btn-info', 'form-control');
          createButtonLink.appendChild(createButton);
          otherProfileFrom.appendChild(createButtonLink);

        }

        
      }).fail(function(err) {
        console.log(err);
      })
    })
  }

  createFriend();  
}
