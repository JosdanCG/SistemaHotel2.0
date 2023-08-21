const json = require('express');
const express = require('express');
const app = express();
const morgan = require('morgan');


const rutas= require('./router');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express(json));

app.use(express.static('css'));

//middlewares
app.use(morgan('dev'))

app.use(express.static('img'));
app.use('/', rutas);



app.listen(5000, () => {
    console.log('servidor activo mi king; http://localhost:5000');
})
