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
        .catch((err) => {
            console.log(err)
        })
})

app.get('/api/drive/:pathUrl/:name?', (req, res) => {
    drive.getFolderOrFileByName(`${req.params.pathUrl}${req.params.name ? "/" + req.params.name : ""}`).then(result => {
        res.send(result)
    })
        .catch((err) => {
            console.log(err)
        })

})

app.post('/api/drive', (req, res) => {
    const name = req.query.name
    const regex = /^[a-zA-Z0-9]*$/
    const test = regex.test(name)

    if (test === true) {
        console.log(test + ' if')
        drive.createFolder(name).then(result => {
            res.send(result)
        })
            .catch((err) => {
                console.log(err)
            })

    } else {
        console.log(test + ' else')
        res.sendStatus(400)
    }
})


module.exports = {
    start: start,
}