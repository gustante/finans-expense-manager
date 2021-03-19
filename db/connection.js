
let mongoose = require('mongoose');
let mongoDB = process.env.MONGODBURI;
mongoose.connect(mongoDB.toString(), { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:true });
let connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = connection;