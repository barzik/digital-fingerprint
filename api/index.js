'use strict';

const express = require('express');
const router = express.Router();


router.get('/:hash', (req, res) => {
  let hash = req.params.hash;
  let connection = require('./connection').getClient();
  connection.query('SELECT name AS name FROM users WHERE hash = ?', [hash], (error, results) => {
    if (results && results[0] && results[0].name) {
      res.send(results[0].name);
    } else {
      res.sendStatus(404);
    }
  });
});

router.post('/', (req, res) => {
  let connection = require('./connection').getClient();
  let hash = req.body.hash;
  let name = req.body.name;
  let post = { hash: hash, name: name };
  connection.query('INSERT IGNORE INTO users SET ?', post, (error) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
