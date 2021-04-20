const drive = require('./drive')
const express = require('express')
const app = express()
const port = 3000

app.use(express.static('frontend'));

function start() {
    app.listen(port, () => {
    })
}

app.get('/api/drive', (req, res) => {
    drive.listAllFoldersAndFiles().then(result => {
        res.send(result)
    })
})

app.get('/api/drive/:name', (req, res) => {
    drive.getFolderOrFileByName(req.params.name).then(result => {
        res.send(result)
    })
})


module.exports = {
    start: start,
}