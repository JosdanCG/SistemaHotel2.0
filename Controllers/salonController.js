const conexion = require('../database/db');
const axios = require('axios');

exports.obtenerDashboardSalones = async (res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/salones');
        const salones = response.data;
        // Renderizar la vista con las habitaciones
        res.render('dashboards', { result: salones });
    } catch (error) {
        console.error('Error al obtener las salones desde la API: ', error);
        // Manejo de errores
        res.status(500).json({ error: 'Error al obtener las salones desde la API' });
    }
};
exports.obtenerSalones = async (res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/salones');
        const salones = response.data;
        // Renderizar la vista con las habitaciones
        res.render('salones', { result: salones });
    } catch (error) {
        console.error('Error al obtener las salones desde la API: ', error);
        // Manejo de errores
        res.status(500).json({ error: 'Error al obtener las salones desde la API' });
    }
};

exports.obtenerReservaSalones = async (res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/reserva/salones');
        const salones = response.data;
        // Renderizar la vista con las habitaciones
        res.render('listadoreservaSal', { results: salones });
    } catch (error) {
        console.error('Error al obtener las salones desde la API: ', error);
        // Manejo de errores
        res.status(500).json({ error: 'Error al obtener las salones desde la API' });
    }
};
exports.obtenerPagosSalones = async (res) => {
    try {
        const response = await axios.get('http://localhost:5000/api/listadoPagosS');
        const salones = response.data;
        // Renderizar la vista con las habitaciones
        res.render('listadoPagosS', { results: salones });
    } catch (error) {
        console.error('Error al obtener las salones desde la API: ', error);
        // Manejo de errores
        res.status(500).json({ error: 'Error al obtener las salones desde la API' });
    }
};


exports.updateEstadoSal = (req, res) => {
    const cod = req.body.idsalon;
    const estado= req.body.estado;
    conexion.query('update dsalon set? where IdSalon=?',
        [{IdSalon: cod, IdEstadoS: estado}, cod], (error) => {
            if (error) {
                console.log(error);
            } else {
                res.redirect('/salones')
            }
        })

}

exports.guardarReservaS = (req, res) => {
    const fechaentrada= req.body.fechaalquiler;
    const idsalon = req.body.idsalon;
    const idcliente = req.body.idclient;
    const precios = req.body.precios;
    conexion.query('insert into reservasal set?',
        { IdSalon: idsalon, IdCliente: idcliente, FEntrada: fechaentrada, TotalP:precios}, (error) => {
            if (error) {
                console.log(error);
            } else {
                res.redirect('/salones')
            }
        })

}
exports.updateReservaSal = (req, res) => {
    const idreservasal= req.body.idreservasal;
    const fechaentrada= req.body.fechaentrada;
    const pagado = req.body.pagado;
    conexion.query('update reservasal set? where IdReserva=?',
        [{IdReserva: idreservasal, FEntrada: fechaentrada, Pagado: pagado}, idreservasal], (error) => {
            if (error) {
                console.log(error);
            } else {
                res.redirect('/listadoreservaSal')
            }
        })

}

exports.guardarPagosS=(req, res)=>{
    const tipopago= req.body.tipopago;
    const fechaemitida = req.body.fechaemitida;
    const comprobante = req.body.comprobante;
    const idreserva = req.body.idreserva;
    const  totalp = req.body.totalp;

    conexion.query('insert into pagoss set?',
    {IdReserva:idreserva, TipoPago: tipopago, FEmision:fechaemitida ,TotalP: totalp, Comprobante: comprobante, },(error)=>{
        if(error){
            console.log(error);
        } else {
                res.redirect('/listadoPagosS');
        }
    })
}

