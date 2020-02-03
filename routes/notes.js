var express = require('express');
var router = express.Router();
var pg = require('pg');

var config = {
    user: 'blpuevll',
    database: 'blpuevll',
    password: 'qzwMbbOoaRN625R3oLVU1NgcSH2E3k7a',
    host: 'rogue.db.elephantsql.com',
    port: 5432,
    max: 3,
    idleTimeoutMillis: 30000,
};

var funkcija = {
    getPrioritet: function(req, res, next) {
        pool.connect(function(err,client, done) {
            if (err) {
                console.info(err);
                res.sendStatus(500);
            }
            client.query("SELECT notes.id, prioritet, notes, date_posted FROM notes_extra INNER JOIN notes ON notes_extra.id_notes = notes.id;",
                function(err, result) {
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        req.extra_info = result.rows;
                        next();
                    }
                })
        })
    }
}

var pool = new pg.Pool(config);
router.get('/', function(req, res, next) {
    pool.connect(function(err, client, done) {
        if (err) {
            console.info(err);
            res.sendStatus(500);
        }

        client.query("SELECT * FROM notes;", function(err, result) {
            done();
            if (err) {
                console.info(err);
                res.sendStatus(404);
            } else {
                res.render('notes', {
                    naslov: "Notes for Keeping",
                    notes: result.rows
                })
            }
        })
    })
});

router.get('/:id', funkcija.getPrioritet, function(req,res,next) {
    res.render('notes_extra', {
        note_id: req.extra_info.id,
        notes: req.extra_info
    })
})

router.post('/', function(req, res, next) {
    var ulaz = req.body.info;
    var info = [req.body.noteField, req.body.prioritet];
    console.log(info)
    console.info(ulaz);
    if (ulaz != undefined) {
        if (ulaz == 1) {
            res.redirect('/notes/' + ulaz);
        } else {
            pool.connect(function(err, client, done) {
                if (err) {
                    console.info(err);
                    res.sendStatus(500);
                }
                client.query("SELECT * FROM notes;", function(err, result) {
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        res.render('delete', {
                            notes: result.rows
                        })
                    }
                })
            })
        }
    }
    else {
        pool.connect(function(err, client, done) {
            if (err) {
                console.info(err);
                res.sendStatus(500);
            }
            client.query("INSERT INTO notes(notes) VALUES($1);", [info[0]], function(err, result) {
                if (err) {
                    console.info(err);
                    res.sendStatus(400);
                }
                console.log("OVO JE RESULT.ROWS = " + result.rows);
            })
            client.query("INSERT INTO notes_extra(prioritet, id_notes) VALUES($1, (SELECT id FROM notes WHERE notes=$2));", [info[1], info[0]],
                function(err, ressult) {
                done();
                if (err) {
                    console.info(err);
                    res.sendStatus(400);
                } else {
                    res.redirect('/notes');
                }
                })
        })
    }
})

module.exports = router;