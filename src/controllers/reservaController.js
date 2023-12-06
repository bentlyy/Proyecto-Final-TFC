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
    const fechahoraFinal = `${data.fechareserva} ${data.horafinal || '00:00:00'}`;

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

        // Verificar si la sala existe
        conn.query('SELECT * FROM salas WHERE salaid = ?', [reservaData.salaid], (err, salaResult) => {
            if (err) {
                console.error('Error al verificar la existencia de la sala:', err);
                return res.status(500).send('Error interno del servidor');
            }

            if (salaResult.length === 0) {
                // La sala no existe, puedes manejar este caso según tus necesidades
                console.error('La sala no existe');
                return res.status(404).send('La sala no existe');
            }

            // Incrementar el contador de veces reservada de la sala
            conn.query('UPDATE salas SET veces_reservada = veces_reservada + 1 WHERE salaid = ?', [reservaData.salaid], (err, result) => {
                if (err) {
                    console.error('Error al actualizar veces reservada:', err);
                    return res.status(500).send('Error interno del servidor');
                }

                // Insertar la reserva después de actualizar la sala
                conn.query('INSERT INTO reservas SET ?', [reservaData], (err, result) => {
                    if (err) {
                        console.error('Error al insertar reserva:', err);
                        return res.status(500).send('Error interno del servidor');
                    }

                    console.log('Reserva insertada correctamente');
                    res.redirect('/reserva');
                });
            });
        });
    });
};


function formatTime(time) {
   
    const parts = time.split(':');
    const formattedTime = `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
    return formattedTime;
}

reservaController.delete = (req, res) => {
    const { reservaid } = req.params; // Asegúrate de usar el nombre correcto de la variable

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).json(err);
        }

        conn.query('DELETE FROM reservas WHERE reservaid = ?', [reservaid], (err, result) => {
            if (err) {
                console.error('Error al eliminar datos:', err);
                return res.status(500).json(err);
            }

            console.log('Datos eliminados correctamente');
            res.redirect('/reserva');
        });
    });
};

reservaController.edit = async (req, res) => {
    try {
        const { reservaid } = req.params;

        const query = `
        SELECT r.reservaid, DATE_FORMAT(r.fechareserva, '%Y-%m-%d') as fechareserva,
               TIME_FORMAT(r.horainicio, '%H:%i') as horainicio,
               TIME_FORMAT(r.horafinal, '%H:%i') as horafinal,
               r.comentario, r.estado, p.rutpersona, p.nombrepersona, s.salaid, s.nombresala
        FROM reservas r
        JOIN personas p ON r.rutpersona = p.rutpersona
        JOIN salas s ON r.salaid = s.salaid
        WHERE r.reservaid = ?
    `;

        req.getConnection((err, conn) => {
            if (err) {
                console.error('Error de conexión:', err);
                return res.status(500).json(err);
            }

            conn.query(query, [reservaid], (err, result) => {
                if (err) {
                    console.error('Error al ejecutar la consulta:', err);
                    return res.status(500).json(err);
                }

                if (result.length > 0) {
                    const reservaData = result[0];

                    // Obtener todas las personas y salas
                    conn.query('SELECT * FROM personas', (err, personas) => {
                        if (err) {
                            return res.status(500).json(err);
                        }

                        conn.query('SELECT * FROM salas', (err, salas) => {
                            if (err) {
                                return res.status(500).json(err);
                            }

                            res.render('reserva_edit', {
                                data: reservaData,
                                personas: personas,
                                salas: salas,
                            });
                        });
                    });
                } else {
                    res.status(404).send('Reserva no encontrada');
                }
            });
        });
    } catch (err) {
        console.error('Error al obtener datos:', err);
        res.status(500).json(err);
    }
};




reservaController.update = (req, res) => {
    const { reservaid } = req.params;
    const newReserva = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).json(err);
        }

        const updateQuery = `
            UPDATE reservas
            SET fechareserva = ?,
                horainicio = ?,
                horafinal = ?,
                comentario = ?,
                estado = ?,
                salaid = ?,
                rutpersona = ?
            WHERE reservaid = ?
        `;

        const fechahoraInicio = newReserva.horainicio ? `${newReserva.fechareserva} ${newReserva.horainicio}:00` : null;
        const fechahoraFinal = newReserva.horafinal ? `${newReserva.fechareserva} ${newReserva.horafinal}:00` : null;

        const updateData = [
            newReserva.fechareserva,
            fechahoraInicio,
            fechahoraFinal,
            newReserva.comentario,
            newReserva.estado,
            newReserva.salaid,
            newReserva.rutpersona,
            reservaid
        ];

        conn.query(updateQuery, updateData, (err, result) => {
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
