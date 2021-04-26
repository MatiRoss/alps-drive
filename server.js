// Import du fichier drive.js
const drive = require('./drive')
// Import du module express qui permet la création du serveur
const express = require('express')
// Instanciation du serveur
const app = express()
// Déclaration du port sur lequel le serveur écoutera (ici, le port 3000. Exemple : localhost:3000)
const port = 3000

// Import du module busboy de Express qui va permettre l'upload de fichiers sur le drive
const bb = require('express-busboy')

// Configuration du module busboy
bb.extend(app, {
    upload: true,
    path: 'C:/Users/mati0/AppData/Local/Temp'

})

// La fonction express.static permet de servir des fichiers statiques comme des images, fichiers CSS, HTML et des fichiers JavaScript.
// Ici, elle permet de servir des fichiers stockés dans le dossier appelé 'frontend'
app.use(express.static('frontend'));

// Fonction qui lance le serveur. La méthode listen permet de relier la connexion entre l'host et le port spécifié, ici le port 3000.
function start() {
    app.listen(port, () => {
    })
}

// Traitement lors d'une requête de type 'GET' à l'url '/api/drive'. Dans ce cas là, appel de la fonction qui liste les dossiers et fichiers à l'emplacement indiqué
app.get('/api/drive', (req, res) => {

    drive.listAllFoldersAndFiles().then(result => {
        res.send(result)
    })
        .catch((err) => {
            console.log(err)
        })
})

//Traitement lors d'une requête de type 'GET' à n'importe quel emplacement sur le drive
app.get('/api/drive/*/:name?', (req, res) => {

    drive.getFolderOrFileByName(`${req.params[0]}${req.params.name ? "/" + req.params.name : ""}`).then(result => {
        res.send(result)
    })
        .catch((err) => {
            console.log(err)
            res.sendStatus(404)
            console.log('Erreur 404 : Ressource introuvable')
        })

})

//Traitement lors d'une requête de type 'POST' à l'emplacement où l'on se trouve et qui appelle la fonction qui crée un dossier
app.post('/api/drive/*/:name?', (req, res) => {
    const folder = req.params[0]
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
        console.log('Le nom du dossier ne doit contenir que des caractères alphanumériques')
    }
})

//Traitement lors d'une requête de type 'DELETE' à la racine du drive et qui appelle la fonction qui supprime un dossier ou un fichier
app.delete('/api/drive/:name?', (req, res) => {
    const name = req.params.name

    drive.deleteFolderOrFile(name).then(result => {
        res.send(result)

    })
        .catch((err) => {
            console.log(err)
        })
})

//Traitement lors d'une requête de type 'DELETE' à l'emplacement où l'on se trouve et qui appelle la fonction qui supprime un dossier ou un fichier
app.delete('/api/drive/*/:name', (req, res) => {
    const name = req.params.name;
    const folder = req.params[0];

    drive.deleteFolderOrFile(name, folder).then(result => {
        res.send(result)
    })
        .catch((err) => {
            console.log(err)
        })
})

//Traitement lors d'une requête de type 'PUT' à la racine du drive et qui appelle la fonction qui permet d'uploader un fichier
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

//Traitement lors d'une requête de type 'PUT' à l'emplacement où l'on se trouve et qui appelle la fonction qui permet d'uploader un fichier
app.put('/api/drive/*', (req, res) => {
    const file = req.files.file.file
    const folder = req.params[0]
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