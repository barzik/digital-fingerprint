let mysql = require('mysql');

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.db_NAME
});

/**
 * Setup a connection to automatically replace itself if it is disconnected.
 *
 * @param {Connection} connection
 *   A MySQL connection instance.
 */
function replaceClientOnDisconnect(connection) {
  connection.on('error', (err) => {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    // connection.config is actually a ConnectionConfig instance, not the original
    // configuration. For most situations this is fine, but if you are doing
    // something more advanced with your connection configuration, then
    // you should check carefully as to whether this is actually going to do
    // what you think it should do.
    connection = mysql.createConnection(connection.config);
    replaceClientOnDisconnect(connection);
    connection.connect((error) => {
      if (error) {
        // Well, we tried. The database has probably fallen over.
        // That's fairly fatal for most applications, so we might as
        // call it a day and go home.
        //
        // For a real application something more sophisticated is
        // probably required here.
        process.exit(1);
      }
    });
  });
}

// And run this on every connection as soon as it is created.
replaceClientOnDisconnect(connection);

/**
 * Every operation requiring a connection should call this function, and not
 * hold on to the resulting connection reference.
 *
 * @return {Connection}
 */
exports.getClient = () => {
  connection.query('CREATE TABLE IF NOT EXISTS users (name VARCHAR(255), hash VARCHAR(255) PRIMARY KEY UNIQUE)');
  return connection;
};
