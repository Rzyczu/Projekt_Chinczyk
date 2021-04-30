module.exports = {
    id: 0,
    lastPlayer: 0,
    users: [],
    remainingTime: null,
    start(req, res, bazaDanych) {
        bazaDanych.findOne({
            _id: req.session.dbKey

        }, function (err, docs) {

            //console.log(docs.users)
            this.player = 0
            this.remainingTime = 10000;
            console.log("XD")

            bazaDanych.update(
                {
                    _id: req.session.dbKey
                },
                {
                    $set: {
                        player: this.player,
                        remainingTime: this.remainingTime,
                    }
                },
                {},
                function (err, numUpdated) {
                    bazaDanych.findOne({
                        _id: req.session.dbKey

                    }, function (err, docs) {
                        bazaDanych.persistence.compactDatafile() //czyści DB 
                        res.json({
                            ...docs
                        })
                    })
                });
        });
        req.session.firstInit = true;
    },
    kolejka(req, bazaDanych) {
        bazaDanych.findOne({
            _id: req.session.dbKey

        }, function (err, docs) {

            //console.log(docs.users)
            if (this.remainingTime <= 0) {
                this.remainingTime = 10000
                this.player = this.player + 1
                if (this.player == docs.nicks.length) {
                    this.player = 0
                }
            } else {
                this.remainingTime = this.remainingTime - 1000
            }
        })
    },
    czytanieBazy(req, res, bazaDanych) {
        bazaDanych.findOne({
            _id: req.session.dbKey

        },
            function (err, docs) {

                //console.log(docs.users)
                bazaDanych.update(
                    {
                        _id: req.session.dbKey
                    },
                    {
                        $set: {
                            player: this.player,
                            remainingTime: this.remainingTime,
                        }
                    },
                    {},
                    function (err, numUpdated) {
                        bazaDanych.findOne({
                            _id: req.session.dbKey

                        }, function (err, docs) {
                            bazaDanych.persistence.compactDatafile() //czyści DB 
                            res.json({
                                ...docs
                            })
                        })
                    });
            })
    }
}