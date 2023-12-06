const personaController = {};
const bcrypt = require('bcrypt');

personaController.list = (req, res ) =>{
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM personas',(err, personas)=>{
            if(err) {
                res.json(err);
            }
          
            res.render('persona', { data: personas });
        });
    });
};



personaController.save = (req, res) => {
    console.log('Controlador save llamado');
    const data = req.body;
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al guardar persona:', err);
            return res.status(500).send('Error interno del servidor');
        }

        conn.query('INSERT INTO personas SET ?', [data], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.error('Error al insertar en la base de datos: Entrada duplicada');
                    return res.status(400).send('Error: Ya existe una persona con este rut.');
                }

                console.error('Error al insertar en la base de datos:', err);
                return res.status(500).send('Error interno del servidor');
            }

            
            conn.query('SELECT * FROM personas', (err, data) => {
                if (err) {
                    console.error('Error al obtener datos de la base de datos:', err);
                    return res.status(500).send('Error interno del servidor');
                }

                console.log('Persona insertada correctamente:', result);
                res.render('persona', { data: data });
            });
        });
    });
};


personaController.delete = (req, res) => {
    const { rutpersona } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).json(err);
        }

        // Verificar si existen reservas asociadas a la persona
        conn.query('SELECT COUNT(*) as count FROM reservas WHERE rutpersona = ?', [rutpersona], (err, result) => {
            if (err) {
                console.error('Error al verificar reservas:', err);
                return res.status(500).json(err);
            }

            const reservationCount = result[0].count;

            if (reservationCount > 0) {
                // Si hay reservas asociadas, mostrar un mensaje
                const errorMessage = 'No se puede eliminar la persona porque tiene reservas asociadas.';
                return res.status(400).send(errorMessage);
            }

            // Si no hay reservas asociadas, proceder con la eliminación de la persona
            conn.query('DELETE FROM personas WHERE rutpersona = ?', [rutpersona], (err, result) => {
                if (err) {
                    console.error('Error al eliminar persona:', err);
                    return res.status(500).json(err);
                }

                console.log('Datos eliminados correctamente');
                res.redirect('persona');
            });
        });
    });
};


personaController.edit = (req, res) => {
    const { rutpersona } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM personas WHERE rutpersona = ?', [rutpersona], (err, rows) => {
            if (err) {
                console.log(err);
                
                return res.status(500).send('Error interno del servidor');
            }

            
            if (rows.length > 0) {
                
                res.render('personas_edit', { data: rows[0] });
            } else {
                
                return res.status(404).send('Persona no encontrada');
            }
        });
    });
};

personaController.update = (req, res) => {
    const { rutpersona } = req.params;
    const newPersona = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE personas SET ? WHERE rutpersona = ?', [newPersona, rutpersona], (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/persona');
        });
    });
};

module.exports = personaController;