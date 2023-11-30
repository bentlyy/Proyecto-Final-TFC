const loginController = {};
const bcrypt = require('bcrypt');

loginController.showLoginForm = (req, res) => {
    res.render('login');
};

loginController.verifyLogin = (req, res) => {
    const { rutpersona, contraseña } = req.body;

    req.getConnection((err, connection) => {
        if (err) {
            console.error('Error de conexión a la base de datos:', err);
            return res.status(500).send('Error en la conexión a la base de datos');
        }

        const query = 'SELECT * FROM personas WHERE rutpersona = ?';
        connection.query(query, [rutpersona], (err, rows) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return res.status(500).send('Error en la consulta a la base de datos');
            }

            if (rows.length > 0 && rows[0].contraseña === contraseña) {
                req.session.loggedin = true;
                req.session.name = rows[0].nombrepersona;
                res.redirect('menu'); 
            } else {
                res.status(401).send('Credenciales incorrectas');
            }
        });
    });
};

loginController.checkLoginStatus = (req, res, next) => {
    if (req.session.loggedin) {
        
        next();
    } else {
        
        res.redirect('login');
    }
};

module.exports = loginController;
