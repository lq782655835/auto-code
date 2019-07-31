const doT = require('dot')
const fs = require('fs-extra')
const data = require('./config')
const util = require('./util')
const readFile = require('util').promisify(fs.readFile);
doT.templateSettings.strip = false

let {dist, out} = {
    dist: './dist',
    out: false ? './dist' : `/Users/liaoqiao/netease/deeplearn-fed-platform/src/pages/project`
}

fs.ensureDirSync(dist)
fs.ensureDirSync(out)

// 自解析制定目录下.jst后缀
// http://jinlong.github.io/doT/
doT.process({
    path: util.path('./template'),
    destination: dist
});
['list', 'dialog'].forEach(file => {
    writeFile(file)
})

function writeFile(file) {
    var pageFunc = require(`${dist}/${file}`)
    var result = pageFunc(data)
    fs.writeFile(util.path(`${out}/${file}.vue`), result, function(err) {
        if (err) throw err
        console.log('success write')
    })
}



// let init =  async () => {
//     let file = await readFile(util.path('./template/server.ts'), {encoding:"utf-8"})
//     var template = doT.template(file);
//     var result = template(data);
//     console.log(result)
// }
// init()
