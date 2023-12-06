const usuarioController = {};

usuarioController.list = (req, res) => {
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

usuarioController.save = (req, res) => {
    const data = req.body;
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).send('Error interno del servidor');
        }

        conn.query('INSERT INTO usuarios SET ?', [data], (err, result) => {
            if (err) {
                console.error('Error al insertar en la base de datos:', err);
                return res.status(500).send('Error interno del servidor');
            }

            conn.query('SELECT * FROM usuarios', (err, data) => {
                if (err) {
                    console.error('Error al obtener datos de la base de datos:', err);
                    return res.status(500).send('Error interno del servidor');
                }

                console.log('Usuario insertado correctamente:', result);
                res.render('usuarios', { data: data });
            });
        });
    });
};

usuarioController.delete = (req, res) => {
    const { usuarioid } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).json(err);
        }

        conn.query('DELETE FROM usuarios WHERE usuarioid = ?', [usuarioid], (err, result) => {
            if (err) {
                console.error('Error al eliminar datos:', err);
                return res.status(500).json(err);
            }

            console.log('Datos eliminados correctamente');
            res.redirect('/usuario');
        });
    });
};

usuarioController.edit = (req, res) => {
    const { usuarioid } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM usuarios WHERE usuarioid = ?', [usuarioid], (err, usuarios) => {
            if (err) {
                console.log(err);
            }
            if (usuarios.length > 0) {
                res.render('usuarios_edit', { data: usuarios[0] });
            } else {
                return res.status(404).send('Usuario no encontrado');
            }
        });
    });
};

usuarioController.update = (req, res) => {
    const { usuarioid } = req.params;
    const newUsuario = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE usuarios SET ? WHERE usuarioid = ?', [newUsuario, usuarioid], (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/usuario');
        });
    });
};

module.exports = usuarioController;
