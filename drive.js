const fs = require('fs/promises')
const os = require('os')
const path = require('path')

const ALPS_DRIVE_ROOT = path.join(os.tmpdir(), 'root');

function logFolderExist() {
    console.log('Le dossier existe');
}

function createRootFolderNoVerify() {
    return fs.mkdir(ALPS_DRIVE_ROOT);
}

function rootFolderExists() {
    return fs.access(ALPS_DRIVE_ROOT);
}

function createRootFolder() {
    return rootFolderExists()
        .then(logFolderExist)
        .catch(createRootFolderNoVerify);
}

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

function getFolderOrFileByName(name) {
    const fileName = path.join(ALPS_DRIVE_ROOT, name)
    const content = fs.stat(fileName)

    return content.then((result) => {

        if (result.isFile()) {

            return fs.readFile(fileName)

        } else if (result.isDirectory()) {
            return listAllFoldersAndFiles(fileName)
        } else {
            console.log('Error 404')
        }

    })
        .catch((err) => {
            console.log(err)
        })

}

function createFolder(name) {
    const folder = path.join(ALPS_DRIVE_ROOT, name)
    return fs.access(folder).then(() => {
        console.log('Le dossier existe déjà')
    })
        .catch(() => {
            return fs.mkdir(folder)
        })

}


module.exports = {
    createRootFolder: createRootFolder,
    listAllFoldersAndFiles: listAllFoldersAndFiles,
    getFolderOrFileByName: getFolderOrFileByName,
    createFolder: createFolder,
};