const express = require('express');
const app = express();
const connection = require('./db/connection');
const port = process.env.PORT;
const router = require("./routes/index.js")

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());


//DB connection. Starts listening once connection is established
connection.once('open', () => {

    console.log('connected to mongoDB');

    const server = app.listen(port, () => {
        console.log('listening on port ' + port);
    });

    app.use("/api/v1.0", router)
});



