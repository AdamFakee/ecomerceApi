require('dotenv').config();

const express = require('express'),
    app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({
    extended : true
}));


// init db
require('./dbs/init.mongodb');

// init routes
app.use('/', require('./routes'));

// handle errors
app.use((req, res, next) => {
    // Nếu không tìm được router thì chạy xuống đây => gán 404
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})


// logger 
app.use((error, req, res, next) => {
    const statusCode = error.status || 500

    return res.status(statusCode).json({
        status: 'error',
        code: statusCode, 
        message: error.message || 'Internal Server Error',
        stack: error.stack,
    })
})


module.exports = app;
