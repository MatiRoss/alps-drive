const drive = require('./drive')
const express = require('express')
const app = express()
const port = 3000
function start() {
    app.use(express.static('frontend'));
    app.listen(port, () => {
    })
    app.get('/api/drive', (req, res) => {
        drive.listAllFolders().then(allFolderPromise => {
            res.send(allFolderPromise)
        })
    })
}
module.exports = {
    start: start,
}