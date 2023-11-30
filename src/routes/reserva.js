const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

router.get(reservaController.loadPersonasSalas);

router.get('/', reservaController.list);
router.post('/add', reservaController.save);
router.get('/delete/:reservaid', reservaController.delete);
router.get('/edit/:reservaid', reservaController.edit);
router.post('/update/:reservaid', reservaController.update);

module.exports = router;