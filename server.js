const express = require('express')
const app = express()

app.use(express.static('frontend'))
app.use((req, res) => {
    res.json('Votre requête a bien été reçue !' );

});

module.exports = app;