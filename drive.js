const fs = require('fs').promises
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
function listAllFolders() {
    const allFoldersPromise = fs.readdir(ALPS_DRIVE_ROOT, {withFileTypes : true});
    allFoldersPromise.then((folderList) => {
        console.log(folderList)
        return folderList
    })
    return allFoldersPromise
}
module.exports = {
    createRootFolder: createRootFolder,
    listAllFolders: listAllFolders,
};