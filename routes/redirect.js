var express = require('express');
var router = express.Router();
var pg = require('pg');

router.post('/', function(req, res, next) {
    res.redirect('notes');
})


var config = {
    user: 'blpuevll',
    database: 'blpuevll',
    password: 'qzwMbbOoaRN625R3oLVU1NgcSH2E3k7a',
    host: 'rogue.db.elephantsql.com',
    port: 5432,
    max: 3,
    min: 0,
    idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);
router.post('/brisat', function(req, res, next) {
    console.log(req.body.zaBrisat);
    pool.connect(function(err, client, done) {
        if (err) {
            console.info(err);
            res.sendStatus(500);
        }

        client.query("DELETE FROM notes_extra WHERE id_notes = $1;", [req.body.zaBrisat], function(err, result) {
            if (err) {
                console.info(err);
                res.sendStatus(400);
            } else {
                client.query("DELETE FROM notes WHERE id = $1", [req.body.zaBrisat], function(err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(400);
                    } else {
                        console.log("salje dalje");
                        res.redirect('/notes');
                    }
                })
            }

        })

    })

})

module.exports = router;