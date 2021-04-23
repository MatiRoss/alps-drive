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
            return listAllFoldersAndFiles(fileName, {recursive: true})
        } else {
            console.log('Error 404')
        }

    })
        .catch((err) => {
            console.log(err)
        })

}

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


module.exports = {
    createRootFolder: createRootFolder,
    listAllFoldersAndFiles: listAllFoldersAndFiles,
    getFolderOrFileByName: getFolderOrFileByName,
    createFolder: createFolder,
    deleteFolderOrFile: deleteFolderOrFile,
    uploadFile: uploadFile
}