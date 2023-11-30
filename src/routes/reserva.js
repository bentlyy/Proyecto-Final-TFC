const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

router.get(reservaController.loadPersonasSalas);

router.get('/', reservaController.list);
router.post('/add', reservaController.save);
router.get('/delete/:reservasid', reservaController.delete);
router.get('/edit/:reservasid', reservaController.edit);
router.post('/update/:reservasid', reservaController.update);

module.exports = router;