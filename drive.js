const fs = require('fs/promises')
const os = require('os')
const path = require('path')

const ALPS_DRIVE_ROOT = path.join(os.tmpdir(), 'root');

function logFolderExist() {
    console.log('Le dossier ' + ALPS_DRIVE_ROOT + ' existe bien');
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

function createFolderInSpecificFolder(name, name2) {
    const folder = path.join(ALPS_DRIVE_ROOT, name, name2)
    return fs.access(folder).then(() => {
        console.log('Le dossier existe déjà')
    })
        .catch(() => {
            return fs.mkdir(folder)
        })
}

function deleteFolderOrFile(name) {
    const folder = path.join(ALPS_DRIVE_ROOT, name)
    return fs.access(folder).then(() => {

        return fs.rm(folder, {recursive: true})
    })
        .catch((err) => {
            console.log(err)
        })

}

function deleteFolderOrFileInSpecificFolder(name, name2) {
    const folder = path.join(ALPS_DRIVE_ROOT, name, name2)
    return fs.access(folder).then(() => {

        return fs.rm(folder, {recursive: true})
    })
        .catch((err) => {
            console.log(err)
        })
}


function uploadFile(file, name) {
    const dest = path.join(ALPS_DRIVE_ROOT, name)

    return fs.copyFile(file, dest).then(() => {
        console.log('The file was successfully uploaded!')
    })

        .catch((err) => {
            console.log(err)
        })

}

function uploadFileInSpecificFolder(file, name, name2) {
    const dest = path.join(ALPS_DRIVE_ROOT, name, name2)

    return fs.copyFile(file, dest).then(() => {
        console.log('The file was successfully uploaded in the specific folder!')
    })

        .catch((err) => {
            console.log(err)
        })
}

module.exports = {
    createRootFolder: createRootFolder,
    listAllFoldersAndFiles: listAllFoldersAndFiles,
    getFolderOrFileByName: getFolderOrFileByName,
    createFolder: createFolder,
    createFolderInSpecificFolder: createFolderInSpecificFolder,
    deleteFolderOrFile: deleteFolderOrFile,
    deleteFolderOrFileInSpecificFolder: deleteFolderOrFileInSpecificFolder,
    uploadFile: uploadFile,
    uploadFileInSpecificFolder: uploadFileInSpecificFolder
};