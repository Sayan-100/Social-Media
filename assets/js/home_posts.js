{
  console.log("hi -----------------------> ");
  // method to submit the form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (e) {
      e.preventDefault();

      // $.ajax({
      //     type: 'post',
      //     url: '/posts/create',
      //     data: newPostForm.serialize(),
      let formData = new FormData();
      // console.log($('#posts').val());
      formData.append("content", $("#post-text").val());
      formData.append(
        "avatar",
        document.getElementById("post-avatar").files[0]
      );
      // console.log('------------------------------> form data ' + formData.content);
      for (var i in formData) {
        console.log(i, formData[i]);
      }
      $.ajax({
        type: "post",
        url: "/posts/create",
        processData: false,
        contentType: false,
        cache: false,
        data: formData,
        success: function (data) {
          let newPost = newPostDom(data.data.post);
          $("#posts-list-container>ul").prepend(newPost);
          deletePost($(" .delete-post-button", newPost));
          createComment(data.data.post._id);
          toggleLike($(" .toggle-like-button", newPost));
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  // method to create a post in DOM
  let newPostDom = function (post) {
    console.log("*****************" + post.user.name);
    console.log("****************** " + post.avatar);

    let postImg = "";
    if (post.avatar) {
      postImg = `<img class="card-img-top mb-0" src="${post.avatar}" alt=" post pic" width="200"><br>`;
    }

    let likesPost = "";

    if(post.likes.length > 0)
    {
      likesPost = post.likes.length;
    }

    return $(`<li id="post-${post._id}" class="posts mb-4">
      <div class="card" style="width: 32rem">
        ${postImg}
        <ul class="list-group list-group-flush">
          <li class="list-group-item card-title">${post.content}</li>
          <li class="list-group-item">
            <a class="toggle-like-button text-decoration-none" data-likes="${ post.likes.length }" href="/likes/toggle/?id=${post._id}&type=Post">
            ${ likesPost} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill mr-2" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
        </svg>
    </a>
            Created By  ${post.user.name}
          </li>
          <li class="list-group-item">
            <div class="post-comments">
              <form
                id="post-${post._id}-comments-form"
                action="/comments/create"
                method="POST"
              >
                <div class="mb-2">
                  <input
                    class="form-control"
                    type="text"
                    name="content"
                    placeholder="Type Here to add comment..."
                    required
                  />
                </div>
                <div class="mb-2">
                  <input
                    class="form-control"
                    type="hidden"
                    name="post"
                    value="${post._id}"
                  />
                </div>
                <div class="mb-2">
                  <input
                    class="btn btn-success form-control"
                    type="submit"
                    value="Add Comment"
                  />
                </div>
              </form>
              <div class="post-comments-list">
                <ul
                  id="post-comments-${post._id}"
                  class="list-group list-group-flush"
                >
                </ul>
              </div>
            </div>
          </li>
        </ul>
    
        <div class="card-body">
          <a
            class="delete-post-button card-link btn btn-warning"
            href="/posts/destroy/${post._id}"
            >Delete Post</a
          >
        </div>
      </div>
  </li>
  `);
  };

  // method to delete a post from DOM
  let deletePost = function (deleteLink) {
    //behaves as an event listener
    $(deleteLink).click(function (e) {
      e.preventDefault();
      console.log("****************** DeletePost", deleteLink);
      $.ajax({
        type: "get",
        url: $(deleteLink).prop("href"),
        success: function (data) {
          console.log('Post is ' + data.data.post_id);
          console.log('In Success------------------->');
          $(`#post-${data.data.post_id}`).remove();
          new Noty({
            theme: 'relax',
            text: "Post Deleted",
            type: 'success',
            layout: 'topRight',
            timeout: 1500
            
        }).show();
        },
        error: function (error) {
          console.log('Executing In Error Block')
          console.log('Error' + error.responseText);
        },
      });
    });
  };


  let convertPostsTOAjax = function () {
    // console.log('initializing all posts and comments');
    $("#posts-list-container>ul>li").each(function () {
      let self = $(this); // li - 
      // console.log('-----------------------> self ', self)
      let deleteButton = $(" .delete-post-button", self); // post - X -> ajax
      deletePost(deleteButton); // ajax

      // get the post's id by splitting the id attribute
      let postId = self.prop("id").split("-")[1];
      createComment(postId);
    });

    convertAllCommentsToAjax();
  };

  let convertAllCommentsToAjax = function () {
    
    $('#posts-comment-list-container>ul>li').each(function() {
      console.log('all comments ' + this);
      let self = $(this);
      let deleteButton = $(" .delete-comment-button", self);
      deleteComment(deleteButton);
    })
  }

  createPost();
  convertPostsTOAjax();
}
