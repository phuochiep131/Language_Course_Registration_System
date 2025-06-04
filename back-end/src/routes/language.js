const express = require('express');
const router = express.Router();
const languageController = require('../controllers/languageController');

router.get('/', languageController.getLanguages);
router.post('/add', languageController.addLanguage);
router.delete('/multiple', languageController.deleteMultipleLanguages);
router.get('/:id', languageController.getLanguageById);
router.put('/:id', languageController.updateLanguage);

module.exports = router;
