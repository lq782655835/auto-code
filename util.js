const path = require('path')

exports.path = (filepath) => {
    if (path.isAbsolute(filepath)) {
        return filepath
    }
    return path.join(__dirname, filepath)
}