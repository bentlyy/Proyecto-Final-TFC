const reservaController = {};
const bcrypt = require('bcrypt');



reservaController.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        }

        
        conn.query('SELECT * FROM reservas', (err, reservas) => {
            if (err) {
                res.json(err);
            }

            conn.query('SELECT * FROM personas', (err, personas) => {
                if (err) {
                    res.json(err);
                }

                conn.query('SELECT * FROM salas', (err, salas) => {
                    if (err) {
                        res.json(err);
                    }

                   
                    res.render('reserva', {
                        data: reservas,
                        personas: personas,
                        salas: salas
                    });
                });
            });
        });
    });
};

reservaController.loadPersonasSalas = (req, res, next) => {
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





reservaController.save = (req, res) => {
    const data = req.body;

    
    const fechahoraInicio = `${data.fechareserva} ${data.horainicio}`;
    const fechahoraFinal = `${data.fechareserva} ${data.horafinal}`;

    const reservaData = {
        fechareserva: fechahoraInicio,
        horainicio: fechahoraInicio,
        horafinal: fechahoraFinal,
        comentario: data.comentario,
        estado: data.estado,
        salaid: data.salaid,
        rutpersona: data.rutpersona,
    };

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).send('Error interno del servidor');
        }

        
        conn.query('INSERT INTO reservas SET ?', [reservaData], (err, result) => {
            if (err) {
                console.error('Error al insertar reserva:', err);
                return res.status(500).send('Error interno del servidor');
            }

            console.log('Reserva insertada correctamente');
            res.redirect('/reserva');
        });
    });
};

function formatTime(time) {
   
    const parts = time.split(':');
    const formattedTime = `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
    return formattedTime;
}

reservaController.delete = (req, res) => {
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

reservaController.edit = (req, res) => {
    const { reservaid } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).json(err);
        }

        conn.query('SELECT * FROM reservas WHERE reservaid = ?', [reservaid], (err, reservas) => {
            if (err) {
                console.error('Error al obtener datos:', err);
                return res.status(500).json(err);
            }

            res.render('reserva_edit', {
                data: reservas[0],
                personas: req.personas,
                salas: req.salas,
            });
        });
    });
};

reservaController.update = (req, res) => {
    const { reservaid } = req.params;
    const newReserva = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).json(err);
        }

        conn.query('UPDATE reservas SET ? WHERE reservaid = ?', [newReserva, reservaid], (err, result) => {
            if (err) {
                console.error('Error al actualizar datos:', err);
                return res.status(500).json(err);
            }

            console.log('Datos actualizados correctamente');
            res.redirect('/reserva');
        });
    });
};

module.exports = reservaController;
