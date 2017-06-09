'use strict';

const express = require('express');
const router = express.Router();
const mysql = require('mysql');

function createConnection() {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.db_NAME
  });
  return connection;
}

router.get('/:hash', (req, res) => {
  let hash = req.params.hash;
  const connection = createConnection();
  connection.connect();
  connection.query('CREATE TABLE IF NOT EXISTS users (name VARCHAR(255), hash VARCHAR(255))');
  connection.query('SELECT name AS name FROM users WHERE hash = ?', [hash], (error, results) => {
    if (error) {
      res.sendStatus(500);
      throw error;
    }
    if (results && results[0] && results[0].name) {
      res.send(results[0].name);
    } else {
      res.sendStatus(404);
    }

  });
});

router.post('/', (req, res) => {
  const connection = createConnection();
  connection.connect();
  connection.query('CREATE TABLE IF NOT EXISTS users (name VARCHAR(255), hash VARCHAR(255))');
  let hash = req.body.hash;
  let name = req.body.name;
  let post = { hash: hash, name: name };
  connection.query('REPLACE INTO users SET ?', post, (error) => {
    if (error) {
      res.sendStatus(500);
      throw error;
    }
    res.sendStatus(200);
    res.end();
  });
});

module.exports = router;
