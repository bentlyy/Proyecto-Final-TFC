const express = require('express');
const router = express.Router();
const personaController = require('../controllers/personaController');

router.get('/', personaController.list);
router.post('/add', personaController.save);
router.get('/delete/:rutpersona', personaController.delete);


router.get('/update/:rutpersona', personaController.edit);
router.post('/update/:rutpersona', personaController.update);

module.exports = router;