const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const env = require('./enviroment');


//send mail
let transporter = nodemailer.createTransport(env.smtp);

//renders html email there
let renderTemplate = (data, relativePath) => {
    let mailHtml;//all 
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template) {
            if(err)
            {
                console.log('error in rendering template');
            }

            mailHtml = template;
        }
    )

    return mailHtml;
}

module.exports = {
    transporter : transporter,
    renderTemplate : renderTemplate
}