'use strict';

const express = require('express');
const router = express.Router();
const connection = require('./connection');


router.get('/:hash', (req, res) => {
  let hash = req.params.hash;
  //connection.getClient();
  let connectionInstance = connection.getClient();
  connectionInstance.query('SELECT name AS name FROM users WHERE hash = ?', [hash], (error, results) => {
    if (results && results[0] && results[0].name) {
      res.send(results[0].name);
    } else {
      res.sendStatus(404);
    }
  });
});

router.post('/', (req, res) => {
  let connectionInstance = connection.getClient();
  let hash = req.body.hash;
  let name = req.body.name;
  let post = { hash: hash, name: name };
  connectionInstance.query('INSERT IGNORE INTO users SET ?', post, (error) => {
    if (error) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
