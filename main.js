const drive = require('./drive')
const server = require('./server')

drive.createRootFolder().then(() => {
    server.start();
})