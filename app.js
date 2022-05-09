const express = require('express');
const app = express();
const connection = require('./db/connection');
const port = process.env.PORT;
const router = require("./routes/index.js")
const session = require('express-session');

app.use(express.urlencoded({ extended: true }));
const path = require('path')
app.use( express.static(path.join(__dirname, 'public')))

app.use(express.json());

app.use(
    session({
        secret: 'key',
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        isAuth: false,
        cookie: { sameSite: 'strict' },
    })

)


app.use(function(req,res,next){
    console.log(req.session);
    next();
})


//DB connection. Starts listening once connection is established
connection.once('open', () => {

    console.log('connected to mongoDB');

    const server = app.listen(port, () => {
        console.log('listening on port ' + port);
    });

    app.use("/api/v1.0", router)
});



