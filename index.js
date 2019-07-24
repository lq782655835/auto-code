const doT = require('dot')
const fs = require('fs-extra')
const data = require('./config.json')
const util = require('./util')
const readFile = require('util').promisify(fs.readFile);
doT.templateSettings.strip = false

// 自解析制定目录下.jst后缀
// http://jinlong.github.io/doT/
doT.process({path: util.path('./template')});
var pageFunc = require('./template/server')
var result = pageFunc(data)
console.log(result)

// let init =  async () => {
//     let file = await readFile(util.path('./template/server.ts'), {encoding:"utf-8"})
//     var template = doT.template(file);
//     var result = template(data);
//     console.log(result)
// }
// init()
