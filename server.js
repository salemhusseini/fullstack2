//===============================
//Setup up Enviromental variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//===============================
//Main Variables
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

//Setup Main Routes
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');

//===============================
//SETUP EXPRESS
app.set('view engine', 'ejs');
app.set('views', './views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

//Use routes previously created
app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);

//Start Express with all routes and option configured
const expressPort = 3000;
app.listen(expressPort, () => console.log(`- Express Server Started - Listening on port ${expressPort}`));

//===============================
//SETUP DATABASE
const mongoose = require('mongoose');
const DATABASE_NAME = "mybatikha";
const URI = process.env.DATABASE_URI + DATABASE_NAME;
mongoose.connect(URI, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection

db.on('error', (error) => console.error(error));

// Open Database - called once
db.once('open', () => console.log('- Database Connection Started Successfuly'));
//===============================