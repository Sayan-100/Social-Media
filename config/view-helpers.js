
const env = require('./enviroment');
const fs = require('fs');
const path = require('path');

module.exports = (app) => {
    //sending function to the locals of the app
    app.locals.assetPath = function(filePath) 
    {
        if(env.name == 'development')
        {
            return filePath;
        }

        return '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filePath];
    }
}