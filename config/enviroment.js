
const fs = require('fs');
const rofs = require('rotating-file-stream');
const path = require('path');



const logDirectory = path.join(__dirname, '../production_logs');

//if production log exist or if it not exist it should be created
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);


const accessLogStream = rofs.createStream('access.log', {
  interval : '1d',
  path : logDirectory
});

const development = {
  name: "development",
  asset_path: "/assets",
  session_cookie_key: "blahsomething",
  db: "codeial_development",
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587, //TLS
    secure: false,
    auth: {
      user: "ssayan.student",
      pass: "ebsiieuipsyskdnr",
    },
  },

  google_client_id:
    "349980561601-f1cgr078h3hhvovkl4vkkrfko3d9d2qd.apps.googleusercontent.com",
  google_client_secret: "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",
  google_call_back_url: "http://localhost:8000/users/auth/google/callback",
  morgan : {
    mode : 'dev',
    options : {stream : accessLogStream}
  }
};

const production = {
  name: "production",
  asset_path: process.env.CODEIAL_ASSET_PATH,
  session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
  db: process.env.CODEIAL_DB,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587, //TLS
    secure: false,
    auth: {
      user: process.env.CODEIAL_GMAIL_USERNAME,
      pass: process.env.CODEIAL_GMAIL_PASSWORD,
    },
  },

  google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
  google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,

   
  morgan : {
    mode : 'combined',
    options : {stream : accessLogStream}
  }

};

console.log('enviroment is ' + process.env.CODEIAL_ENVIROMENT);


module.exports = eval(process.env.CODEIAL_ENVIROMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIROMENT)
// module.exports = development;
