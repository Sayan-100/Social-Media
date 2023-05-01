let toggleLike = function (toggleButton) {
    $(toggleButton).click(function (e) {
        console.log(toggleButton);
        console.log('inside toggle like ajax');
        console.log('total like is ' + $(toggleButton).attr("data-likes"));
        e.preventDefault();
        console.log('the route is from ' + $(toggleButton).prop("href"))
        $.ajax({
            type: 'POST',
            url: $(toggleButton).prop("href")
        }).done(function (data) {
            let likesCount = parseInt($(toggleButton).attr("data-likes"));
            console.log(likesCount);
            if (data.data.deleted == true) {
                likesCount -= 1;
            }

            else {
                likesCount += 1;
            }

            $(toggleButton).attr('data-likes', likesCount);
            console.log('html  is' , $(toggleButton).html)
            if(likesCount > 0) 
            {
                $(toggleButton).html(`${likesCount} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill mr-2" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                </svg>`)
            }

            else 
            {
                $(toggleButton).html(` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill mr-2" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
          </svg>`)
            }
            
        }).fail(function (errData) {
                console.log('Error in compiling the request');
        })
    })

}
