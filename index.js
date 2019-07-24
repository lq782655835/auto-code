const Handlebars = require('handlebars');
const fs = require('fs-extra')
const data = require('./config.json')
const util = require('./util')
const readFile = require('util').promisify(fs.readFile);

let init =  async () => {
    let file = await readFile(util.path('./template/server.ts'), {encoding:"utf-8"})
    var template = Handlebars.compile(file);
    var result = template(data);
    console.log(result)
}
init()
