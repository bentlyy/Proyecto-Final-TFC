const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuarios', (err, usuarios) => {
            if (err) {
                res.json(err);
            }

            res.render('usuarios', {
                data: usuarios
            });
        });
    });
};

controller.save = (req,res) => {
    const data = req.body;
    req.getConnection((err, conn) => {
    conn.query('INSERT INTO usuarios set ?',[data],(err,usuarios) => {
        res.redirect('/');
    });
    });
};

controller.delete = (req, res) => {
    const { usuarioid } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).json(err); // Devuelve un error al cliente
        }

        conn.query('DELETE FROM usuarios WHERE usuarioid = ?', [usuarioid], (err, result) => {
            if (err) {
                console.error('Error al eliminar datos:', err);
                return res.status(500).json(err); // Devuelve un error al cliente
            }

            console.log('Datos eliminados correctamente');
            res.redirect('/');
        });
    });
};

controller.edit = (req, res) => {
    const { usuarioid } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuarios WHERE usuarioid = ?', [usuarioid], (err, usuarios) => {
            console.log(usuarios);
            res.render('usuarios_edit', {
                data: usuarios[0]
            });
        });
    });
};

controller.update = (req, res) => {
    const { usuarioid } = req.params;
    const newUsuario = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE usuarios SET ? WHERE usuarioid = ?', [newUsuario, usuarioid], (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/');
        });
    });
};

module.exports = controller;