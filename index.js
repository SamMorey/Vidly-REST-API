const express = require('express');
const app = express();
const winston = require('winston');

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/dbconnection')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod'(app));

app.get('/', (req, res) => {
    res.send("Landing page temp");
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;