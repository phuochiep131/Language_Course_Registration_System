const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Quản lý người dùng và đăng ký khóa học
 */

/**
 * @swagger
 * /user/registered-course:
 *   get:
 *     summary: Lấy tất cả đăng ký khóa học (không cần auth)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/registered-course", userController.getAllRegisteredCourses);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', authMiddleware.authenticate, authMiddleware.isAdmin, userController.getAllUsers);

/**
 * @swagger
 * /user/info:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại (token)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/info', authMiddleware.authenticate, userController.getCurrentUser);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/:id', authMiddleware.authenticate, userController.getUserById);

/**
 * @swagger
 * /user/{id}/registered-courses:
 *   get:
 *     summary: Lấy danh sách khóa học đã đăng ký của người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/:id/registered-courses', authMiddleware.authenticate, userController.getRegisteredCourses);

/**
 * @swagger
 * /user/update-registration/{userId}/{courseId}:
 *   put:
 *     summary: Cập nhật thông tin đăng ký khóa học
 *     tags: [Users]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: courseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               study_time_id:
 *                 type: string
 *               study_location_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/update-registration/:userId/:courseId', userController.updateRegistration);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng theo ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', authMiddleware.authenticate, userController.updateUserById);

/**
 * @swagger
 * /user/{id}/unregister-course/{courseId}:
 *   delete:
 *     summary: Hủy đăng ký khóa học
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: courseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hủy thành công
 */
router.delete('/:id/unregister-course/:courseId', userController.unregisterCourse);

/**
 * @swagger
 * /user/multiple:
 *   delete:
 *     summary: Xóa nhiều người dùng (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/multiple', authMiddleware.authenticate, authMiddleware.isAdmin, userController.deleteUsersByIds);

/**
 * @swagger
 * /user/{id}/register-course:
 *   post:
 *     summary: Đăng ký khóa học cho người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course_id
 *               - study_time_id
 *               - study_location_id
 *             properties:
 *               course_id:
 *                 type: string
 *               study_time_id:
 *                 type: string
 *               study_location_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 */
router.post('/:id/register-course', authMiddleware.authenticate, userController.addRegistrationCourse);

module.exports = router;
