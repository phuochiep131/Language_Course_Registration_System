const express = require('express');
const router = express.Router();
const languageController = require('../controllers/languageLevelController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: LanguageLevels
 *   description: Quản lý trình độ ngôn ngữ
 */

/**
 * @swagger
 * /languagelevel:
 *   get:
 *     summary: Lấy tất cả trình độ ngôn ngữ
 *     tags: [LanguageLevels]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', languageController.getAllLanguageslevel);

/**
 * @swagger
 * /languagelevel/add:
 *   post:
 *     summary: Thêm trình độ ngôn ngữ mới
 *     tags: [LanguageLevels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - language_id
 *             properties:
 *               name:
 *                 type: string
 *               language_id:
 *                 type: string
 *                 description: ID của ngôn ngữ liên kết
 *     responses:
 *       201:
 *         description: Thêm thành công
 */
router.post('/add', authMiddleware.authenticate, authMiddleware.isAdmin, languageController.addLanguagelevel);

/**
 * @swagger
 * /languagelevel/multiple:
 *   delete:
 *     summary: Xóa nhiều trình độ ngôn ngữ
 *     tags: [LanguageLevels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách ID cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/multiple', authMiddleware.authenticate, authMiddleware.isAdmin, languageController.deleteMultipleLanguagelevel);

/**
 * @swagger
 * /languagelevel/{id}:
 *   get:
 *     summary: Lấy trình độ ngôn ngữ theo ID
 *     tags: [LanguageLevels]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy trình độ ngôn ngữ
 */
router.get('/:id', languageController.getLanguageLevelById);

/**
 * @swagger
 * /languagelevel/{id}:
 *   put:
 *     summary: Cập nhật trình độ ngôn ngữ
 *     tags: [LanguageLevels]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID trình độ cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               language_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy trình độ
 */
router.put('/:id', authMiddleware.authenticate, authMiddleware.isAdmin, languageController.updateLanguageLevel);

module.exports = router;
