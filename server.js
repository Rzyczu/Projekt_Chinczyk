const express = require('express')
const bodyParser = require('body-parser')
const db = require('nedb')
const path = require('path')
const session = require('express-session')


const app = express()
var PORT = process.env.PORT || 3000

// ---- MID ------

const bazaDanych = new db({
    filename: 'static/database/game.db',
    autoload: true
});

app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json()) // Dodaje  możlwiość czytanai JSON 

app.use(express.static(path.join(__dirname, 'static')))
app.use(session({
    secret: 'cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 365

    }
}))
//import routingu 
require('./modules/routing')(app, path, __dirname, bazaDanych) // ==> (app,path...) == wszystko co przekazujemy do routingu z serwera 



app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
