const express = require('express');
const router = express.Router();
const courseController = require('../controllers/CourseController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Quản lý khóa học
 */

/**
 * @swagger
 * /course:
 *   get:
 *     summary: Lấy tất cả khóa học
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', courseController.getAllCourses);

/**
 * @swagger
 * /course/{id}:
 *   get:
 *     summary: Lấy thông tin khóa học theo ID
 *     tags: [Courses]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khóa học
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy khóa học
 */
router.get('/:id', courseController.getCourseById);

/**
 * @swagger
 * /course:
 *   post:
 *     summary: Tạo mới một khóa học
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name_course
 *               - categories_id
 *               - language_id
 *               - teacher_id
 *             properties:
 *               name_course:
 *                 type: string
 *               categories_id:
 *                 type: string
 *               language_id:
 *                 type: string
 *               teacher_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo khóa học thành công
 */
router.post('/', authMiddleware.authenticate, authMiddleware.isAdmin, courseController.createCourse);

/**
 * @swagger
 * /course/{id}:
 *   put:
 *     summary: Cập nhật khóa học theo ID
 *     tags: [Courses]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID khóa học cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_course:
 *                 type: string
 *               categories_id:
 *                 type: string
 *               language_id:
 *                 type: string
 *               teacher_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy khóa học
 */
router.put('/:id', authMiddleware.authenticate, authMiddleware.isAdmin, courseController.updateCourse);

/**
 * @swagger
 * /course/{id}:
 *   delete:
 *     summary: Xóa khóa học theo ID
 *     tags: [Courses]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID khóa học cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy khóa học
 */
router.delete('/:id', authMiddleware.authenticate, authMiddleware.isAdmin, courseController.deleteMultipleCourses);

module.exports = router;
