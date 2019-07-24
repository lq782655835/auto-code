const Handlebars = require('handlebars');
// const fs = require('fs-extra')
const data = require('./config.json')
const fs = require('fs');
// const util = require('util');
// const readFile = util.promisify(fs.readFile);

fs.readFile('./template/server.ts', {encoding:"utf-8"}, function(err, file) {
    if (err) {
        console.error(err)
        return
    }

    var template = Handlebars.compile(file);
    var result = template(data);
    console.log(result)
})
