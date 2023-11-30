const menuController = {};
const bcrypt = require('bcrypt');

menuController.showMenu = (req, res) => {
    res.render('menu');
};

module.exports = menuController;