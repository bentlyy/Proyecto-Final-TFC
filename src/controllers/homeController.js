const homeController = {};
const bcrypt = require('bcrypt');

homeController.showHome = (req, res) => {
    
    const { nombrepersona } = req.session;

    
    const loggedin = nombrepersona !== undefined;

    res.render('home', { loggedin, nombrepersona });
};

module.exports = homeController;