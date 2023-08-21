const express = require('express');
const router = express.Router();
const conexion = require('./database/db');
const moment = require('moment');
const nodemailer = require('nodemailer');
const axios = require('axios');


const habitacionController = require('./Controllers/habitacionController')
const clienteController= require('./Controllers/clienteController')
const salonController= require('./Controllers/salonController')
const pdfController= require('./Controllers/pdfController')
  


///////////////ruta principal
router.get('/', (req, res) => {
    res.render('login')
})

router.get('/index', (req,res) => {
    res.render('index');
})


router.use(express.json());

//**************************Habitaciones*********************************** */
////////////////////ruta para dashboard habitaciones
router.get('/dashboard', (req, res) => {
    habitacionController.obtenerDashboardHabitaciones(res); 
})
//rutas para listar las habitaciones
router.get('/habitaciones', (req, res) => {
    habitacionController.obtenerHabitaciones(res); 
});
////////////////////ruta para listado de reservas habitaciones
router.get('/listadoreservaHab', (req, res) => {
    habitacionController.obtenerReservaHabitacion(res); 
})
////////////////////////ruta para listar pagos habitaciones
router.get('/listadoPagos', (req, res) => {
    habitacionController.obtenerPagosHabitaciones(res); 
});


//***************************SALONES***************************** */
/////////////////////ruta para dashboard salones
router.get('/dashboards', (req, res) => {
    salonController.obtenerDashboardSalones(res);
})
//rutas para listar los salones
router.get('/salones', (req, res) => {
    salonController.obtenerSalones(res);
})
//rutas para listar los salones
router.get('/listadoreservaSal', (req, res) => {
    salonController.obtenerReservaSalones(res);
})
////////////////////////ruta para listar pagos
router.get('/listadoPagosS', (req, res) => {
    salonController.obtenerPagosSalones(res);
});


/****************************************** Clientes ********************************/
////////////////////ruta para Clientes
router.get('/cliente', (req, res) => {
    clienteController.obtenerCliente(res)
})



//--------------------------------------------------------------------------------
//******************************apis*********************** */
//api para habitaciones
router.get('/api/habitacion',(req, res)=>{
    conexion.query('SELECT d.IdHabitacion, d.NmroHabitacion,d.PrecioH, d.IdEstadoH, d.IdTipoH, e.EstadoH AS EstadoHabitacion, t.TipoH AS TipoHabitacion FROM dhabitacion d LEFT JOIN ehabitacion e ON d.IdEstadoH = e.IdEstadoH LEFT JOIN thabitacion t ON d.IdTipoH = t.IdTipoH',(error, results)=>{
        
        const habitaciones = results.map((habitacion) => ({
            IdHabitacion: habitacion.IdHabitacion,
            NmroHabitacion: habitacion.NmroHabitacion,
            PrecioH: habitacion.PrecioH,
            IdEstadoH: habitacion.IdEstadoH,
            EstadoH: habitacion.EstadoHabitacion,
            TipoH: habitacion.TipoHabitacion,
            
        }));
        if (error) {
            console.error('Error al obtener los habitacion: ', err);
            res.status(500).json({ error: 'Error al obtener los habitacion' });
            return;
        }else{
            res.json(habitaciones);
        }
    })
})
//api para guardar reservas de habitaciones
router.post('/api/guardarReserva', (req, res) => {
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

    const totalAPagar = aver * diferenciaDias;

    // Simulación de inserción en la base de datos
    conexion.query(
        'INSERT INTO reservahab SET ?',
        { IdHabitacion: idhab, IdCliente: idcli, FEntrada: fechaentrada, FSalida: fechasalida, TotalP: totalAPagar },
        (error) => {
            if (error) {
                console.log(error);
                res.status(500).json({ message: 'Error al guardar la reserva' });
            } else {
                res.status(200).json({ message: 'Reserva guardada exitosamente' });
            }
        }
    );
});

////////////////////ruta para listado de reservas habitaciones
router.get('/api/listadoreservaHab', (req, res) => {
    const query = `
        SELECT reservahab.*, cliente.Nombres AS nombre_cliente, dhabitacion.PrecioH AS precio_habitacion, dhabitacion.NmroHabitacion AS NmroHabitacion
        FROM reservahab
        LEFT JOIN cliente ON reservahab.IdCliente = cliente.IdCliente
        LEFT JOIN dhabitacion ON reservahab.IdHabitacion = dhabitacion.IdHabitacion;
    `;

    conexion.query(query, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error al obtener el listado de reservas de habitaciones' });
        } else {
            res.status(200).json(results);
        }
    });
})

// Ruta para obtener el listado de pagos de Salones como JSON
router.get('/api/listadoPagos', (req, res) => {
    conexion.query(`SELECT p.*, s.NmroHabitacion
    FROM pagos p
    LEFT JOIN reservahab r on r.IdReservaH = p.IdReservaH
    LEFT JOIN dhabitacion s on s.IdHabitacion = r.IdHabitacion`, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error al obtener el listado de pagos habitaciones' });
        } else {
            res.status(200).json(results);
        }
    });
});

//api de salones
router.get('/api/salones',(req, res)=>{
    conexion.query(`SELECT d.IdSalon, d.Salon,d.PrecioS, d.IdEstadoS, d.IdServicioS, e.EstadoS, s.DescripcionS 
    FROM dsalon d 
    LEFT JOIN esalon e ON d.IdEstadoS = e.IdEstadoS
    LEFT JOIN ssalon s ON d.IdServicioS = s.IdServicioS;`,(error, results)=>{
        const salones = results.map((salones) => ({
            IdSalon: salones.IdSalon,
            Salon: salones.Salon,
            PrecioS: salones.PrecioS,
            IdEstadoS: salones.IdEstadoS,
            EstadoS: salones.EstadoS,
            IdServicioS: salones.IdServicioS,
            DescripcionS: salones.DescripcionS
            
        }));
        if (error) {
            console.error('Error al obtener los Salones: ', err);
            res.status(500).json({ error: 'Error al obtener los Salones' });
            return;
        }else{
            res.json(salones);
        }
    })
})
//api de la reservas de salones
router.get('/api/reserva/salones',(req, res)=>{
    conexion.query(`SELECT d.IdReserva, d.IdSalon,d.IdCliente, d.FEntrada, d.Pagado, d.TotalP, s.Salon, c.Nombres
    FROM reservasal d 
    LEFT JOIN dsalon s ON d.IdSalon = s.IdSalon
    LEFT JOIN cliente c ON d.IdCliente = c.IdCliente;`,(error, results)=>{
        const salones = results.map((salones) => ({
            IdReserva: salones.IdReserva,
            IdSalon: salones.IdSalon,
            Salon: salones.Salon,
            IdCliente: salones.IdCliente,
            FEntrada: salones.FEntrada,
            TotalP: salones.TotalP,
            Nombres: salones.Nombres,
            Pagado: salones.Pagado
            
        }));
        if (error) {
            console.error('Error al obtener los Salones: ', err);
            res.status(500).json({ error: 'Error al obtener los Salones' });
            return;
        }else{
            res.json(salones);
        }
    })
})

// Ruta para obtener el listado de pagos de Salones como JSON
router.get('/api/listadoPagosS', (req, res) => {
    conexion.query(`SELECT ps.*, s.Salon
    FROM pagoss ps
    LEFT JOIN reservasal r on r.IdReserva = ps.IdReserva
    LEFT JOIN dsalon s on s.IdSalon = r.IdSalon`, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error al obtener el listado de pagos' });
        } else {
            res.status(200).json(results);
        }
    });
});


//=========================================CLIENTES=================================
////////////////////ruta para Clientes
router.get('/api/cliente',(req, res)=>{
    conexion.query('select * from cliente',(error, results)=>{
        if (error) {
            res.status(500).json({ error: 'Error al obtener cliente' });
        } else {
            res.status(200).json(results);
        }
    })
})
// Ruta para guardar un nuevo cliente
router.post('/api/guardarcliente', (req, res) => {
    const name = req.body.name;
    const apel = req.body.apellido;
    const dni = req.body.dni;
    const celu = req.body.celular;

    const clienteData = {
        Nombres: name,
        Apellidos: apel,
        DNI: dni,
        Telefono: celu
    };

    conexion.query('INSERT INTO cliente SET ?', clienteData, (error) => {
        if (error) {
            res.status(500).json({ error: 'Error al guardar el cliente' });
        } else {
            res.status(200).json({ message: 'Cliente guardado exitosamente' });
        }
    });
});




/***************************************Inicio de Sesion */
router.post('/session', (req, res) => {
    const userd = req.body.user;
    const passd = req.body.passw;

    conexion.query('select * from usuario', (error, results) => {
        if (error) {
            console.error('Error en la consulta:', error);
            throw error;
        } else {
            let userFound = false;
            for (const result of results) {
                const user = result.Usuario;
                const pass = result.Contrasena;
                if (userd === user && passd === pass) {
                    userFound = true;
                    break;
                }
            }

            if (userFound) {
                res.render('index');
                console.log("digitado: " + userd);
                console.log("digitado: " + passd);
            } else {
                res.render('login')
            }
        }
    });
});

/****************************************** Clientes ********************************/

////////////////////////ruta para buscar un cliente por su id
router.get('/buscarCliente', (req, res) => {
    const DNI = req.query.dni; // El ID se pasa como parámetro en la URL, por ejemplo: /buscarCliente?id=3

    // Realizar consulta para buscar al cliente por su ID (Supongamos que está en la tabla "cliente")
    conexion.query('SELECT * FROM cliente WHERE DNI = ?', [DNI], (err, results) => {
        if (err) throw err;

        // Obtener información del cliente
        const clienteInfo = results[0];

        const IdHabitacion = req.query.idhabi;
        conexion.query('select * from dhabitacion inner join ehabitacion on dhabitacion.IdEstadoH=ehabitacion.IdEstadoH inner join thabitacion on dhabitacion.IdTipoH=thabitacion.IdTipoH where IdHabitacion=?', [IdHabitacion], (error, results) => {
            if (error) {
                throw error;
            } else {
                
                const habitacionInfo = results[0];
                // Renderizar la vista "reservaHab.ejs" y pasar la información del cliente y la habitación en el contexto
                res.render('reservaHab', { habitacion: habitacionInfo, cliente: clienteInfo });
            }
        });
    });
});

/////////////////////ruta para el modal editar clientes
router.get('/editarclientes/:IdCliente',(req, res)=>{
    const IdCliente=req.params.IdCliente;
    conexion.query('select * from cliente  where IdCliente=?',[IdCliente],(error, results)=>{
        if(error){
            throw error;
        }else{
            res.render('editarcliente',{cliente:results[0]});
        }
    })
})

////////////////////ruta para cambiar el estado del Clientes
router.get('/cambiarEstadoCliente/:IdCliente',(req, res) => {
    const IdCliente = req.params.IdCliente;

    conexion.query('select * from cliente  where IdCliente=?',[IdCliente],(error, results)=>{
        if(error){
            throw error;
        } else {
            const estadoActual = results[0].EstadoC

            if (estadoActual === "activo") {  
                const inactivo = "inactivo";
                conexion.query('update cliente set? where IdCliente=?', [{EstadoC:inactivo},IdCliente],(error)=>{
                    if(error){
                        throw error;
                    }else{
                        res.redirect('/cliente');
                    }
                })
                
            }
            else if(estadoActual === "inactivo"){
                const activo = "activo";
                conexion.query('update cliente set? where IdCliente=?', [{EstadoC:activo},IdCliente],(error)=>{
                    if(error){
                        throw error;
                    }else{
                        res.redirect('/cliente');
                    }
                })
            }
        }
    })
})
//-----------------------------------------------------------------------------------








/****************************************** HABITACION ********************************/
////////////////////////ruta para Reservar habitaciones
router.get('/reservaHab/:IdHabitacion', (req, res) => {
    const IdHabitacion=req.params.IdHabitacion
    conexion.query('select * from dhabitacion inner join ehabitacion on dhabitacion.IdEstadoH=ehabitacion.IdEstadoH inner join thabitacion on dhabitacion.IdTipoH=thabitacion.IdTipoH where IdHabitacion=?',[IdHabitacion],(error, results) => {
        const habitacionInfo = results[0];
        if (error) {
            throw error;
        } else {
            res.render('reservaHab', { habitacion: habitacionInfo,  cliente: null });
        }
    })
});


////////////////////////ruta para Realizar pagos con la IdReservaH
router.get('/pagos/:IdReservaH', (req, res) => {
    const IdReservaH=req.params.IdReservaH
    conexion.query(`SELECT reservahab.*, cliente.Nombres AS nombre_cliente, dhabitacion.PrecioH AS precio_habitacion
    FROM reservahab
    LEFT JOIN cliente ON reservahab.IdCliente = cliente.IdCliente
    LEFT JOIN dhabitacion ON reservahab.IdHabitacion = dhabitacion.IdHabitacion
    where IdReservaH=?`, [IdReservaH], (error, results) => {
        const reservaHabInfo = results[0];
        if (error) {
            throw error;
        } else {
            res.render('pagos', { reservaHab: reservaHabInfo });
        }
    })
});

//**********************************************************************************
//--------------------------------------------------------------------------------







/*********************************************** SALONES ********************************/

////////////////////////ruta para buscar un cliente por su id
router.get('/buscarClienteS', (req, res) => {
    const DNI = req.query.dni; // El ID se pasa como parámetro en la URL, por ejemplo: /buscarCliente?id=3

    // Realizar consulta para buscar al cliente por su ID (Supongamos que está en la tabla "cliente")
    conexion.query('SELECT * FROM cliente WHERE DNI = ?', [DNI], (err, results) => {
        if (err) throw err;

        // Obtener información del cliente
        const clienteInfo = results[0];

        const IdSalon = req.query.idsalo;
        conexion.query('select * from dsalon inner join esalon on dsalon.IdEstadoS=esalon.IdEstadoS where IdSalon=?', [IdSalon], (error, results) => {
            if (error) {
                throw error;
            } else {
                
                const salonInfo = results[0];
                // Renderizar la vista "reservaHab.ejs" y pasar la información del cliente y la habitación en el contexto
                res.render('reservaSal', { salon: salonInfo, cliente: clienteInfo });
            }
        });
    });
});


////////////////////////ruta para Realizar pagos con la IdReservaH
router.get('/pagoss/:IdReserva', (req, res) => {
    const IdReserva=req.params.IdReserva
    conexion.query(`SELECT reservasal.*, cliente.Nombres AS nombre_cliente, dsalon.PrecioS AS precio_salon
    FROM reservasal
    LEFT JOIN cliente ON reservasal.IdCliente = cliente.IdCliente
    LEFT JOIN dsalon ON reservasal.IdSalon = dsalon.IdSalon
    where IdReserva=?`, [IdReserva], (error, results) => {
        const reservaSalInfo = results[0];
        if (error) {
            throw error;
        } else {
            res.render('pagosSal', { reservaHab: reservaSalInfo });
        }
    })
});

/////////////////////ruta para Reservar salones
router.get('/reservaSal/:IdSalon', (req, res) => {
    const IdSalon=req.params.IdSalon
    conexion.query('select * from dsalon inner join esalon on dsalon.IdEstadoS=esalon.IdEstadoS inner join ssalon on dsalon.IdServicioS=ssalon.IdServicioS where IdSalon=?',[IdSalon],(error, results) => {
        
        if (error) {
            throw error;
        } else {
            res.render('reservaSal', { salon: results[0] , cliente: null});
        }
    })
});




router.post('/guardareservaH', habitacionController.guardarReservaH);
router.post('/updateReservaHab', habitacionController.updateReservaHab);
router.post('/updateEstadoHab', habitacionController.updateEstadoHab);
router.post('/guardarPago', habitacionController.guardarPagos);

router.post('/guardarcliente', clienteController.guardarCliente)
router.post('/updatecliente', clienteController.updatecliente)

router.post('/guardareservaS',salonController.guardarReservaS )
router.post('/updateEstadoSal',salonController.updateEstadoSal )
router.post('/updateReservaSal',salonController.updateReservaSal )
router.post('/guardarPagoS', salonController.guardarPagosS);

router.get('/pdf/:IdPago', pdfController.generatePDF);
router.get('/pdfsal/:IdPagoS', pdfController.generatePDFSal);

module.exports = router;