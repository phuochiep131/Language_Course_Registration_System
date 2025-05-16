const express = require('express');
const router = express.Router();
const languageController = require('../controllers/languageLevelController');

router.get('/', languageController.getAllLanguageslevel);
router.post('/add', languageController.addLanguagelevel);
router.delete('/multiple', languageController.deleteMultipleLanguagelevel);
router.get('/:id', languageController.getLanguageLevelById);
router.put('/:id', languageController.updateLanguageLevel);

module.exports = router;
