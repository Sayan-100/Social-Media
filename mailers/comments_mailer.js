const nodemailer = require('../config/nodemailer');


exports.newComment = (comment) => {
    console.log('inside comment ----------->');

    let htmlString = nodemailer.renderTemplate({comment : comment}, '/comments/new_comment.ejs')

    nodemailer.transporter.sendMail({
        from : 'ssayan.student@gmail.com',
        to : comment.user.email,
        subject : 'New Comment Publised',
        html : htmlString
    }, function(err, info) {
        if(err) {
            console.log('Error in Sending mail', err);
            return;
        }

        console.log('Message sent', info);
        return;
    })
}