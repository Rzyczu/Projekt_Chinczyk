const newUser = require('./newUserComp')
const poczekalniaStatus = require('./poczekalniaSync')
const graSynch = require('./graSync')

module.exports = function routing(app, path, dirname, bazaDanych) {
    app.get("/TEST", (req, res) => {
        req.session.SIEMA = "HELo"
    })
    // GET
    app.get("/", (req, res) => {
        if (req.session.dbKey)
            res.redirect("/poczekalnia")
        else
            res.sendFile(path.join(dirname, "/static/pages/register.html"))
    })

    app.get("/poczekalnia", (req, res) => {
        if (req.session.dbKey)
            res.sendFile(path.join(dirname, "/static/pages/poczekalnia.html"))
        else
            res.redirect("/")
    })
    app.get("/gra", (req, res) => {
        if (req.session.dbKey)
            res.sendFile(path.join(dirname, "/static/pages/gra.html"))
        else
            res.redirect("/")
    })

    app.get("/uzytkownicy", (req, res) => {
        if (req.session.dbKey)
            bazaDanych.findOne({
                _id: req.session.dbKey
            }, function (err, doc) {
                let poczatekGry = poczekalniaStatus.sprawdzRozpoczecieGry(doc)
                console.log("poczatekGry");
                console.log(poczatekGry);
                if (poczatekGry)
                    bazaDanych.update({
                        _id: req.session.dbKey
                    }, {
                        $set: {
                            doGry: 4
                        }
                    }, {},
                        function (err, upd) {
                            bazaDanych.persistence.compactDatafile()
                            res.json({
                                status: poczatekGry,
                                ...doc,
                                kimJestem: {
                                    ...req.session.kimJestem
                                }
                            })
                        })
                else
                    res.json({
                        status: poczatekGry,
                        ...doc,
                        kimJestem: {
                            ...req.session.kimJestem
                        }
                    })
            });
        else
            res.redirect("/")
    })

    app.get("/graSynchronizacjaServer", (req, res) => {

        if (req.session.dbKey)
            bazaDanych.findOne({
                _id: req.session.dbKey
            }, function (err, doc) {
                if (doc.remainingTime == null) {
                    var data = null;
                    var int;
                    graSynch.start(req, res, bazaDanych)
                    int = setInterval(() => {
                        graSynch.kolejka(req, bazaDanych)
                    }, 1000)
                }
            });
        else
            res.redirect("/")
    })

    app.get("/graSynchronizacjaClient", (req, res) => {
        if (req.session.dbKey)
            bazaDanych.findOne({
                _id: req.session.dbKey
            }, function (err, doc) {
                var data = null;
                graSynch.czytanieBazy(req, res, bazaDanych)

            });
        else
            res.redirect("/")
    })

    //wysyła wszystkich użtkownikow bazy danychn 

    //---------------POST ---------------

    app.post("/newUser", (req, res) => {
        //nasz nick jest unikalny 
        newUser(req, res, bazaDanych)
        //do jakiegoś pokoju / tworzy nowy pokój 
    })

    app.post('/taKtoraWysylaZapytania', function (req, res) {
        if (req.session.dbKey)
            poczekalniaStatus.chceGrac(req, res, bazaDanych)
        else
            res.redirect("/")

    })

    // kto jest gotowy 
}
