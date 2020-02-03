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
  min: 0,
  idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);

/* GET home page. */
router.get('/', function(req, res, next) {
  pool.connect(function(err, client, done) {
    if (err) {
      console.info(err);
      res.end('{"error" : "Error", ' + '"status" : 500}');
    }
    client.query("SELECT * FROM putovanje ORDER BY prioritet DESC, spakovat DESC;",
        function (err, result) {
      done();
      if (err) {
        console.info(err);
        res.sendStatus(400);
      } else {
        res.render('index', {
          title: "Putovanje",
          putovanjeTabela: result.rows
        })
      }
  })});
});


router.get('/posalji', function(req, res, next) {
  let users = [['test@example.com', 'Fred'], ['test2@example.com', 'Lynda']];
  let query1 = format('INSERT INTO users (email, name) VALUES %L returning id', users);
  console.log(query1)

  pool.connect(function(err,client,done) {
    if (err) {
      res.sendStatus(500);
    }
    var values = [['test1','test1opis', 5, false, 'current_timestamp'],['test2','test2opis', 5, false, 'current_timestamp'],['test3','test3opis', 5, false, 'current_timestamp']]
    client.query("INSERT INTO putovanje(naziv, opis, prioritet, spakovat, created_on) VALUES $1", values
        , function(err, result) {
      done();

      if (err) {
        console.info(err);
        res.sendStatus(400);
      } else {
        res.send('POSLANO')
      }
    })
  })
});

router.post('/', function (req, res, next) {
  console.log(req.body.dugme1 + " " + req.body.dugme2)
  if (req.body.dugme1 == undefined && req.body.dugme2 == undefined) {
    let naziv = req.body.naziv,
        opis = req.body.opis,
        prioritet = req.body.prioritet,
        spakovat;

    if (req.body.spakovat == 'Da') spakovat = true;
    else spakovat = false;

    pool.connect(function (err, client, done) {
      if (err) {
        res.sendStatus(500);
      }

      client.query("INSERT INTO putovanje(naziv, opis, prioritet, spakovat, created_on) VALUES($1, $2, $3, $4, current_timestamp);", [naziv, opis, prioritet, spakovat], function (err, result) {
        done();
        if (err) {
          console.info(err);
          res.sendStatus(400);
        } else {
          res.redirect('/');
        }
      })
    })
  }
  else{
    let akcija;
    if (req.body.dugme1) akcija = true;
    else if (req.body.dugme2) akcija = false;

    pool.connect(function (err, client, done) {
      if (err) {
        res.sendStatus(500);
      }
      if (akcija) {
        client.query("DELETE FROM putovanje WHERE id=$1", [req.body.dugme1], function (err, result) {
          done();
          if (err) {
            console.info(err);
            res.sendStatus(400);
          } else {
            res.redirect('/');
          }
        })
      }
      else if (!akcija) {
        let vrijednost;
        if (req.body.dugme2[1] == true) vrijednost = false;
        else if (req.body.dugme2[1] == false) vrijednost = true;
        console.info(vrijednost + " " + req.body.dugme2[1]);
        client.query("UPDATE putovanje SET spakovat=$2 WHERE id = $1", [req.body.dugme2[0], vrijednost], function (err, result) {
          done();
          if (err) {
            console.info(err);
            res.sendStatus(400);
          } else {
            res.redirect('/');
          }
        })
      }
    })
  }
})

var functions = {
  vratiInfo: function(req, res, next) {
    var ime = req.params.name;
    pool.connect(function(err,client,done) {
      if (err) {
        res.sendStatus(500);
      }
      client.query("SELECT * FROM putovanje WHERE id = $1", [ime], function(err, result) {
        done();

        if (err) {
          console.info(err);
          res.sendStatus(400);
        } else {
          res.render('objekt', {
              naziv: result.rows.naziv,
              ime: result.rows
          })
        }
      })
    })
  }
}


module.exports = router;
