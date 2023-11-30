const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');

router.get('/', usuarioController.list);
router.post('/add', usuarioController.save);
router.get('/delete/:usuarioid', usuarioController.delete);
router.get('/update/:usuarioid', usuarioController.edit);
router.post('/update/:usuarioid', usuarioController.update);

module.exports = router;