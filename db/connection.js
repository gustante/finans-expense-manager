require('dotenv').config();

let mongoose = require('mongoose');

let mongoDB = process.env.MONGODBURI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:true, useFindAndModify: false });
let connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = connection;