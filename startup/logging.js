const winston = require('winston');
require('winston-mongodb');

module.exports = function () {
    winston.configure({transports: [new winston.transports.File({ 
                                    filename: 'logfile.log' 
                                    }), 
                                    new winston.transports.MongoDB({
                                        db: 'mongodb://localhost/Vidly',
                                        level: 'error'}),
                                    new winston.transports.Console({
                                        colorize: true,
                                        prettyPrint: true,
                                    })
                                    ]});

    process.on('uncaughtException', (ex) => {
        winston.error(ex.message, ex);
        process.exit(1);
    });
    process.on('unhandledRejection', (ex) => {
        winston.error(ex.message, ex);
        process.exit(1);
    });
}