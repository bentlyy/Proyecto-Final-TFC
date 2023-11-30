const salaController = {};
const bcrypt = require('bcrypt');

salaController.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM salas', (err, salas) => {
            if (err) {
                res.json(err);
            }

            res.render('salas', {
                data: salas
            });
        });
    });
};

salaController.save = (req,res) => {
    const data = req.body;
    req.getConnection((err, conn) => {
    conn.query('INSERT INTO salas set ?',[data],(err,salas) => {
        res.redirect('salas');
    });
    });
};

salaController.delete = (req, res) => {
    const { salaid } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).json(err); // Devuelve un error al cliente
        }

        conn.query('DELETE FROM salas WHERE salaid = ?', [salaid], (err, result) => {
            if (err) {
                console.error('Error al eliminar datos:', err);
                return res.status(500).json(err); // Devuelve un error al cliente
            }

            console.log('Datos eliminados correctamente');
            res.redirect('salas');
        });
    });
};

salaController.edit = (req, res) => {
    const { salaid } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM salas WHERE salaid = ?', [salaid], (err, usuarios) => {
            console.log(salas);
            res.render('salas_edit', {
                data: salas[0]
            });
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
            res.redirect('salas');
        });
    });
};

module.exports = salaController;
