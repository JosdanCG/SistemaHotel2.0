const mysql = require('mysql');
const conexion = mysql.createConnection({
    host: 'localhost',
    database: 'bdhotel',
    user: 'root',
    password:''
})

conexion.connect((error) => {
    if (error) {
        console.log('Error en la conexion: ' + error);
    } else {
        console.log('Conexion realisada con exito');
    }
});

module.exports = conexion;