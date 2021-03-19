
let mongoose = require('mongoose');

mongoose.connect(process.env.MONGODBURI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:true });
let connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = connection;