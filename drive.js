// Inclusion des modules var "exemple" = require('....')
const fs = require('fs/promises')
const os = require('os')
const path = require('path')

// Déclaration du path du dossier temporaire nommé 'root'
const ALPS_DRIVE_ROOT = path.join(os.tmpdir(), 'root');

function logFolderExist() {
    console.log('Le dossier ' + ALPS_DRIVE_ROOT + ' existe bien');
}

// Fonction qui crée le dossier temporaire 'root' dont le path est stocké dans la variable "ALPS_DRIVE_ROOT"
function createRootFolderNoVerify() {
    return fs.mkdir(ALPS_DRIVE_ROOT);
}

// Fonction qui vérifie l'existence du dossier temporaire via la méthode access du module fs
function rootFolderExists() {
    return fs.access(ALPS_DRIVE_ROOT);
}

// Fonction qui vérifie l'existence du dossier temporaire et le crée s'il n'existe pas déjà
function createRootFolder() {
    return rootFolderExists()
        .then(logFolderExist)
        .catch(createRootFolderNoVerify);
}

// Fonction qui liste tous les dossiers et fichiers à la racine du drive et qui stocke dans un tableau le nom de chaque fichier/dossier ainsi que le champ isFolder (true or false)
function listAllFoldersAndFiles(path = ALPS_DRIVE_ROOT) {
    const allFoldersAndFilesPromise = fs.readdir(path, {withFileTypes: true});
    return allFoldersAndFilesPromise.then((folderAndFilesList) => {
        let folderAndFilesTab = []
        folderAndFilesList.forEach(result => {
            folderAndFilesTab.push({
                name: result.name,
                isFolder: result.isDirectory(),
            })
        })
        return folderAndFilesTab
    })
        .catch((err) => {
            console.log(err)
        })
}

// Fonction qui retourne le contenu du dossier ou du fichier (via téléchargement dans le cas d'un fichier)
function getFolderOrFileByName(name) {
    const fileName = path.join(ALPS_DRIVE_ROOT, name)
    const content = fs.stat(fileName)

    return content.then((result) => {

        if (result.isFile()) {

            return fs.readFile(fileName)

        } else if (result.isDirectory()) {
            return listAllFoldersAndFiles(fileName, {recursive: true})
        } else {
            console.log('Error 404')
        }

    })
        .catch((err) => {
            console.log(err)
        })

}

// Fonction qui crée un dossier. Si la destination n'inclut pas un dossier, il est créé à la racine, sinon, il est créé dans le dossier en question (voir côté server.js)
function createFolder(name, folder = false) {
    function hasFolder(folder) {
        if (folder) {
            return path.join(ALPS_DRIVE_ROOT, folder, name)

        } else {
            return path.join(ALPS_DRIVE_ROOT, name)
        }
    }

    const file = hasFolder(folder)

    return fs.access(file).then(() => {
        console.log('Le dossier existe déjà')
    })
        .catch(() => {
            return fs.mkdir(file, {recursive: true})
        })
}

// Fonction qui supprime un dossier. Si la destination n'inclut pas un dossier, ce sera le dossier à la racine qui sera supprimé, sinon il s'agit d'un sous dossier qui sera supprimé
function deleteFolderOrFile(name, folder = false) {
    function hasFolder(folder) {
        if (folder) {
            return path.join(ALPS_DRIVE_ROOT, folder, name)

        } else {
            return path.join(ALPS_DRIVE_ROOT, name)
        }
    }

    const file = hasFolder(folder)

    return fs.access(file).then(() => {

        return fs.rm(file, {recursive: true})
    })
        .catch((err) => {
            console.log(err)
        })

}

// Fonction qui permet d'uploader un fichier à n'importe quel endroit sur le drive (même logique que la création et suppression de dossier)
function uploadFile(file, name, folder = false) {
    function hasFolder(folder) {
        if (folder) {
            return path.join(ALPS_DRIVE_ROOT, folder, name)

        } else {
            return path.join(ALPS_DRIVE_ROOT, name)
        }
    }

    const dest = hasFolder(folder)

    return fs.copyFile(file, dest).then(() => {
        console.log('The file was successfully uploaded!')
    })

        .catch((err) => {
            console.log(err)
        })
}

// Exports des différentes fonctions créées afin qu'elles puissent être réutilisées ailleurs dans le code
module.exports = {
    createRootFolder: createRootFolder,
    listAllFoldersAndFiles: listAllFoldersAndFiles,
    getFolderOrFileByName: getFolderOrFileByName,
    createFolder: createFolder,
    deleteFolderOrFile: deleteFolderOrFile,
    uploadFile: uploadFile
}