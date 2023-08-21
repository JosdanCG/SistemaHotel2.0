const conexion = require('../database/db');
const moment = require('moment');
const axios = require('axios');

exports.obtenerDashboardHabitaciones = async (res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/habitacion');
        const habitaciones = response.data;
        // Renderizar la vista con las habitaciones
        res.render('dashboard', { resultdash: habitaciones });
    } catch (error) {
        console.error('Error al obtener las habitaciones desde la API: ', error);
        // Manejo de errores
        res.status(500).json({ error: 'Error al obtener las habitaciones desde la API' });
    }
};

exports.obtenerHabitaciones = async (res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/habitacion');
        const habitaciones = response.data;
        // Renderizar la vista con las habitaciones
        res.render('habitaciones', { result: habitaciones });
    } catch (error) {
        console.error('Error al obtener las habitaciones desde la API: ', error);
        // Manejo de errores
        res.status(500).json({ error: 'Error al obtener las habitaciones desde la API' });
    }
};

exports.obtenerReservaHabitacion = async (res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/listadoreservaHab');
        const habitacion = response.data;
        // Renderizar la vista con las habitaciones
        res.render('listadoreservaHab', { results: habitacion });
    } catch (error) {
        console.error('Error al obtener las habitacion desde la API: ', error);
        // Manejo de errores
        res.status(500).json({ error: 'Error al obtener las habitacion desde la API' });
    }
};

exports.updateEstadoHab = (req, res) => {
    const cod = req.body.idhabitacion;
    const estado= req.body.estado;
    

    conexion.query('update dhabitacion set? where IdHabitacion=?',
        [{IdHabitacion: cod, IdEstadoH: estado}, cod], (error) => {
            if (error) {
                console.log(error);
            } else {
                res.redirect('/habitaciones')
            }
        })

}

exports.guardarReservaH = (req, res) => {
    const fechaentrada = req.body.fechaentrada;
    const fechasalida = req.body.fechasalida;
    const fent = moment(req.body.fechaentrada);
    const fsal = moment(req.body.fechasalida);
    const totalp = req.body.preciohabita;
    const idhab = req.body.idhabita;
    const idcli = req.body.idclient;

    // Calcular la diferencia en días
    const diferenciaDias = fsal.diff(fent, 'days');

    const aver = parseFloat(req.body.preciohabita.replace(',', '.'));

    // Calcular el total a pagar
    const totalAPagar = aver * diferenciaDias;

    // Datos para enviar a la API
    const requestData = {
        fechaentrada,
        fechasalida,
        fechaentrada,
        fechasalida,
        preciohabita: totalp,
        idhabita: idhab,
        idclient: idcli
    };

    // Hacer la solicitud a la API
    axios.post('http://localhost:5000/api/guardarReserva', requestData)
        .then(response => {
            console.log(response.data); // Mensaje de la API
            res.redirect('/habitaciones'); // Redirigir a /habitaciones
        })
        .catch(error => {
            console.error(error);
            res.redirect('/error'); // Manejar el error de acuerdo a tus necesidades
        });
};



exports.updateReservaHab = (req, res) => {
    const cod = req.body.idreservahab;
    const fechaentrada= req.body.fechaentrada;
    const fechasalida = req.body.fechasalida;
    const pagado = req.body.pagado;
    
    const aver = parseFloat(req.body.precio_habitacion.replace((',', '.')));
    // Calcular la diferencia en días
    const fent = moment(req.body.fechaentrada);
    const fsal = moment(req.body.fechasalida);
    const diferenciaDias = fsal.diff(fent, 'days');
    
    // Calcular el total a pagar
    const totalAPagar = aver * diferenciaDias;

    conexion.query('update reservahab set? where IdReservaH=?',
        [{IdReservaH: cod, FEntrada: fechaentrada, FSalida: fechasalida, TotalP: totalAPagar, Pagado: pagado}, cod], (error) => {
            if (error) {
                console.log(error);
            } else {
                res.redirect('/listadoreservaHab')
            }
        })
}

exports.obtenerPagosHabitaciones = async (res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/listadoPagos');
        const habitacion = response.data;
        // Renderizar la vista con las habitaciones
        res.render('listadoPagos', { results: habitacion });
    } catch (error) {
        console.error('Error al obtener las habitacion desde la API: ', error);
        // Manejo de errores
        res.status(500).json({ error: 'Error al obtener las habitacion desde la API' });
    }
};

exports.guardarPagos=(req, res)=>{
    const tipopago= req.body.tipopago;
    const fechaemitida = req.body.fechaemitida;
    const comprobante = req.body.comprobante;
    const idreservahab = req.body.idreservahab;
    const  totalp = req.body.totalp;

    conexion.query('insert into pagos set?',
    {IdReservaH:idreservahab, TipoPago: tipopago, FEmision:fechaemitida ,TotalP: totalp, Comprobante: comprobante, },(error)=>{
        if(error){
            console.log(error);
        } else {
                res.redirect('/listadoPagos');
        }
    })
}


