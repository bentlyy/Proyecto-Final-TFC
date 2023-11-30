const controller = {};
const bcrypt = require('bcrypt');

// Middleware para cargar personas y salas antes de cada solicitud
controller.loadPersonasSalas = (req, res, next) => {
    req.getConnection((err, conn) => {
        if (err) {
            return next(err);
        }

        conn.query('SELECT * FROM personas', (err, personas) => {
            if (err) {
                return next(err);
            }

            conn.query('SELECT * FROM salas', (err, salas) => {
                if (err) {
                    return next(err);
                }
                req.personas = personas;
                req.salas = salas;
                next();
            });
        });
    });
};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM reservas', (err, reservas) => {
            if (err) {
                res.json(err);
            }

            res.render('reservas', {
                data: reservas,
                personas: personas,
                salas: salas

            });
        });
    });
};

controller.save = (req, res) => {
    const data = req.body;

   
    const salaid = data.salaid;
    const rutpersona = data.rutpersona;

    
    const reservaData = {
        fechareserva: data.fechareserva,
        horainicio: data.horainicio,
        horafinal: data.horafinal,
        comentario: data.comentario,
        estado: data.estado,
       
    };

    req.getConnection((err, conn) => {
       
        conn.query('INSERT INTO reservas SET ?', [reservaData], (err, result) => {
            if (err) {
                console.error('Error de consulta en reservas:', err);
                return res.status(500).send('Error al insertar en la base de datos');
            }

            
            const reservasId = result.insertId;

            
            const usuariosData = {
                reservasid: reservasId,
                salaid: salaid,
                rutpersona: rutpersona,
                
            };

            conn.query('INSERT INTO usuarios SET ?', [usuariosData], (err, resultUsuarios) => {
                if (err) {
                    console.error('Error de consulta en usuarios:', err);
                    return res.status(500).send('Error al insertar en la base de datos');
                }

                
                conn.release();

                
                res.redirect('/');
            });
        });
    });
};

controller.delete = (req, res) => {
    const { reservasid } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).json(err); 
        }

        conn.query('DELETE FROM reservas WHERE reservasid = ?', [reservasid], (err, result) => {
            if (err) {
                console.error('Error al eliminar datos:', err);
                return res.status(500).json(err); 
            }

            console.log('Datos eliminados correctamente');
            res.redirect('/');
        });
    });
};

controller.edit = (req, res) => {
    const { reservasid } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM reservas WHERE reservasid = ?', [reservasid], (err, reservas) => {
            console.log(reservas);
            res.render('reservas_edit', {
                data: reservas[0],
                personas: req.personas, 
                salas: req.salas 
            });
        });
    });
};

controller.update = (req, res) => {
    const { reservasid } = req.params;
    const newReserva = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE reservas SET ? WHERE reservasid = ?', [newReserva, reservasid], (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/');
        });
    });
};

module.exports = controller;
