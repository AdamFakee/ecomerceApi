'use strict';

const mongoose = require('mongoose');
const { db: { host, name, port } } = require('../configs/mongodb.config');

const connectString =  `mongodb://${host}:${port}/${name}`;
console.log(connectString)
class Database {
    constructor () {
        this.connect();
    }

    async connect() {
        try {
            await mongoose.connect(connectString);
            console.log('connect to db')
        } catch (error) {
            console.log(error.message);
        }
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;