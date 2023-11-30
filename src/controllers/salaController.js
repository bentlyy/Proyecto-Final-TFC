const salaController = {};
const bcrypt = require('bcrypt');

salaController.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM salas', (err, salas) => {
            if (err) {
                res.json(err);
            }

            res.render('sala', {
                data: salas
            });
        });
    });
};

salaController.save = (req, res) => {
    const data = req.body;
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).send('Error interno del servidor');
        }

        conn.query('INSERT INTO salas SET ?', [data], (err, result) => {
            if (err) {
                console.error('Error al insertar en la base de datos:', err);
                return res.status(500).send('Error interno del servidor');
            }

            // Consultar los datos actualizados
            conn.query('SELECT * FROM salas', (err, data) => {
                if (err) {
                    console.error('Error al obtener datos de la base de datos:', err);
                    return res.status(500).send('Error interno del servidor');
                }

                console.log('Sala insertada correctamente:', result);
                res.render('sala', { data: data });
            });
        });
    });
};

salaController.delete = (req, res) => {
    const { salaid } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).json(err);
        }

        conn.query('DELETE FROM salas WHERE salaid = ?', [salaid], (err, result) => {
            if (err) {
                console.error('Error al eliminar datos:', err);
                return res.status(500).json(err);
            }

            console.log('Datos eliminados correctamente');
            res.redirect('sala');
        });
    });
};

salaController.edit = (req, res) => {
    const { salaid } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM salas WHERE salaid= ?',[salaid],(err, rows) => {
            if(err){
                console.log(err)
            }
            if (rows.length > 0){
                res.render('salas_edit', {data: rows[0]});
            } else {
                return res.status(404).send ('Persona no encontrada');
            }
        });
});
};

salaController.update = (req, res) => {
    const { salaid } = req.params;
    const newSala = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE salas SET ? WHERE salaid = ?', [newSala, salaid], (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/sala');
        });
    });
};

module.exports = salaController;
