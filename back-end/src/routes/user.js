const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');


// // Lấy danh sách khóa học đã đăng ký
// router.get('/:id/registered-courses', userController.getRegisteredCourses);

// Hủy đăng ký khóa học
router.delete('/:id/unregister-course/:courseId', userController.unregisterCourse);

router.get('/', authMiddleware.authenticate, authMiddleware.isAdmin, userController.getAllUsers);
router.get('/info', authMiddleware.authenticate, userController.getCurrentUser);
router.get('/:id', authMiddleware.authenticate, userController.getUserById);
router.put('/:id', authMiddleware.authenticate, userController.updateUserById);
router.delete('/multiple', authMiddleware.authenticate, authMiddleware.isAdmin, userController.deleteUsersByIds);

router.get('/:id/registered-courses', authMiddleware.authenticate, userController.getRegisteredCourses);
router.post('/:id/register-course', authMiddleware.authenticate, userController.addRegistrationCourse);

module.exports = router;
