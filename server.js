const drive = require('./drive')
const express = require('express')
const app = express()
const port = 3000

const bb = require('express-busboy')

bb.extend(app, {
    upload: true,
    path: 'C:/Users/mati0/AppData/Local/Temp'

})

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

app.get('/api/drive/:folder/:name?', (req, res) => {
    drive.getFolderOrFileByName(`${req.params.folder}${req.params.name ? "/" + req.params.name : ""}`).then(result => {
        res.send(result)
    })
        .catch((err) => {
            console.log(err)
            res.sendStatus(404)
            console.log('Erreur 404 : Ressource introuvable')
        })

})

app.post('/api/drive', (req, res) => {
    const name = req.query.name

    const regex = /^[a-zA-Z0-9]*$/
    const test = regex.test(name)

    if (test) {
        drive.createFolder(name).then(result => {
            res.send(result)
        })
            .catch((err) => {
                console.log(err)
            })

    } else {
        res.sendStatus(400)
        console.log('Le nom du dossier ne doit contenir que des caractères alphanumériques')
    }
})

app.post('/api/drive/:folder/:name?', (req, res) => {
    const folder = req.params.folder
    const name = req.query.name

    const regex = /^[a-zA-Z0-9]*$/
    const test = regex.test(name)
    if (test) {
        drive.createFolder(name, folder).then(result => {
            res.send(result)
        })
            .catch((err) => {
                console.log(err)
            })
    } else {
        res.sendStatus(400)
    }
})

app.delete('/api/drive/:name?', (req, res) => {
    const name = req.params.name

    drive.deleteFolderOrFile(name).then(result => {
        res.send(result)

    })
        .catch((err) => {
            console.log(err)
        })
})

app.delete('/api/drive/:folder/:name?', (req, res) => {
    const name = req.params.name;
    const folder = req.params.folder;

    drive.deleteFolderOrFile(name, folder).then(result => {
        res.send(result)
    })
        .catch((err) => {
            console.log(err)
        })
})


app.put('/api/drive', (req, res) => {
    const file = req.files.file.file
    const name = req.files.file.filename

    drive.uploadFile(file, name).then(result => {
        res.send(result)
    })
        .catch((err) => {
            console.log(err)
        })

})

app.put('/api/drive/:folder', (req, res) => {
    const file = req.files.file.file
    const folder = req.params.folder
    const name = req.files.file.filename

    drive.uploadFile(file, name, folder).then(result => {
        res.send(result)
    })
        .catch((err) => {
            console.log(err)
        })
})


module.exports = {
    start: start,
}