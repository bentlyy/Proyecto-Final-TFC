const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

// Middleware para cargar personas y salas antes de renderizar la vista
router.get(reservaController.loadPersonasSalas);

// Rutas
router.get('/', reservaController.list);
router.post('/add', reservaController.save);
router.get('/delete/:reservaid', reservaController.delete);
router.get('/update/:reservaid', reservaController.edit);  // Cambiado el nombre del método
router.post('/update/:reservaid', reservaController.update);

module.exports = router;