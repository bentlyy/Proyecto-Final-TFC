const express = require('express');
const router = express.Router();

const salaController = require('../controllers/salaController');

router.get('/', salaController.list);
router.post('/add', salaController.save);
router.get('/delete/:salaid', salaController.delete);

router.get('/update/:salaid', salaController.edit);
router.post('/update/:salaid', salaController.update);

module.exports = router;