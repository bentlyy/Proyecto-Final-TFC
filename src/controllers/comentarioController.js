const comentarioController = {};

comentarioController.list = (req, res) => {
    req.getConnection((err, conn) => {
        if (err) {
            res.json(err);
        }

        conn.query('SELECT * FROM reservas', (err, reservas) => {
            if (err) {
                res.json(err);
            }

            res.render('comentario', {
                data: reservas,
            });
        });
    });
};

module.exports = comentarioController;