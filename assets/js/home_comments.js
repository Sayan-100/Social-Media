
let createComment = function (postId) {
    let commentForm = $(`#post-${postId}-comments-form`);
    commentForm.submit(function (e) {
        console.log("******************this is");
        e.preventDefault();

        $.ajax({
            type: "post",
            url: "/comments/create",
            data: commentForm.serialize(),
            success: function (data) {
                console.log("******************************* " + data.data.comment._id);
                let newComment = newCommentDom(data.data.comment);
                $(`#post-comments-${postId}`).prepend(newComment);
                toggleLike($(" .toggle-like-button", newComment));
                deleteComment($(' .delete-comment-button', newComment));
            },
            error: function (err) {
                console.log("******************** error ", err);
            },
        });
    });
};

let newCommentDom = function (comment) {

    let likesHtml = ""
    if(comment.likes.length > 0)
    {
        likesHtml = comment.likes.length; 
    }

    console.log('******************* comment created by ajax');
    return $(`
    <li id="comment-${comment._id}" class="list-group-item">
        <div class="card" style="width: 14rem;">
            <ul class="list-group list-group-flush">
                <li class="list-group-item">
                     ${comment.content}
                </li>
                <li class="list-group-item">
                    
                        <a class="toggle-like-button text-decoration-none" data-likes="${ comment.likes.length}" href="/likes/toggle/?id=${comment._id}&type=Comment">
                            ${ likesHtml } <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill mr-2" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                        </svg>
                        </a>

                        <li class="list-group-item">
                    ${ comment.user.name }
                    </li>
                        <a class="delete-comment-button card-link btn btn-warning" href="/comments/destroy/${ comment._id }">Delete Comment</a>    
                </li>
            </ul>
        </div>
    </li>`)
};

let deleteComment = function (deleteLink) {
    // console.log('*********************** delete ajax');
    // console.log('************************************* ', deleteLink);
    $(deleteLink).click(function (e) {
        e.preventDefault();
        console.log('******************** delete post', deleteLink);
        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: function (data) {
                $(`#comment-${data.data.comment_id}`).remove();
            }, error: function (err) {
                console.log('******************' + err);
            }
        })
    })
}
