const personaController = {};
const bcrypt = require('bcrypt');

personaController.list = (req, res ) =>{
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM personas',(err, personas)=>{
            if(err) {
                res.json(err);
            }
          
            res.render('personas', {
                data: personas
            });
        });
    });
};



personaController.save = (req,res) => {
    const data = req.body;
    req.getConnection((err, conn) => {
    conn.query('INSERT INTO personas set ?',[data],(err,personas) => {
        res.redirect('personas');
    });
    });
};


personaController.delete = (req, res) => {
    const { rutpersona } = req.params;

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error de conexión:', err);
            return res.status(500).json(err); // Devuelve un error al cliente
        }

        conn.query('DELETE FROM personas WHERE rutpersona = ?', [rutpersona], (err, result) => {
            if (err) {
                console.error('Error al eliminar datos:', err);
                return res.status(500).json(err); // Devuelve un error al cliente
            }

            console.log('Datos eliminados correctamente');
            res.redirect('persona');
        });
    });
};

personaController.edit = (req, res) => {
    const { rutpersona } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM personas WHERE rutpersona=?', [rutpersona], (err, persona) =>{
    res.render('personas_edit', {
    data: persona[0]
            });
        });
    });
};

personaController.update = (req, res) => {
    const { rutpersona } = req.params;
    const newPersona = req.body;
    req.getConnection((err, conn) => {
        conn.query('UPDATE personas SET ? WHERE rutpersona = ?', [newPersona, rutpersona], (err, rows) => {
            res.redirect('persona');
        });
    });
};

module.exports = personaController;