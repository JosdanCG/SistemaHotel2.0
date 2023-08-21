const conexion = require('../database/db');
const axios = require('axios');


exports.obtenerCliente = async (res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/cliente');
        const cliente = response.data;
        // Renderizar la vista con las habitaciones
        res.render('cliente', { results: cliente });
    } catch (error) {
        console.error('Error al obtener las cliente desde la API: ', error);
        // Manejo de errores
        res.status(500).json({ error: 'Error al obtener las cliente desde la API' });
    }
};

exports.guardarCliente = (req, res) => {
    const name = req.body.name;
    const apellido = req.body.apellido;
    const dni = req.body.dni;
    const celular = req.body.celular;

    // Datos para enviar a la API
    const requestData = {
        name,
        apellido,
        dni,
        celular
    };

    // Hacer la solicitud a la API
    axios.post('http://localhost:5000/api/guardarcliente', requestData)
        .then(response => {
            console.log(response.data); // Mensaje de la API
            res.redirect('/cliente'); // Redirigir a /habitaciones
        })
        .catch(error => {
            console.error(error);
            res.redirect('/error'); // Manejar el error de acuerdo a tus necesidades
        });
};

exports.updatecliente = (req, res) => {
    const cod = req.body.idcliente;
    const name = req.body.name;
    const apel = req.body.apellido;
    const dni = req.body.dni;
    const celu = req.body.celular;
    conexion.query('update cliente set? where IdCliente=?',
        [{IdCliente: cod, Nombres: name, Apellidos: apel, DNI: dni, Telefono: celu}, cod], (error) => {
            if (error) {
                console.log(error);
            } else {
                res.redirect('/cliente')
            }
        })

}