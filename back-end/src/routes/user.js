const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');


router.get("/registered-course", userController.getAllRegisteredCourses);
router.get('/', authMiddleware.authenticate, authMiddleware.isAdmin, userController.getAllUsers);
router.get('/info', authMiddleware.authenticate, userController.getCurrentUser);
router.get('/:id', authMiddleware.authenticate, userController.getUserById);
router.get('/:id/registered-courses', authMiddleware.authenticate, userController.getRegisteredCourses)

router.put('/update-registration/:userId/:courseId', userController.updateRegistration);
router.put('/:id', authMiddleware.authenticate, userController.updateUserById);


router.delete('/:id/unregister-course/:courseId', userController.unregisterCourse);
router.delete('/multiple', authMiddleware.authenticate, authMiddleware.isAdmin, userController.deleteUsersByIds);


router.post('/:id/register-course', authMiddleware.authenticate, userController.addRegistrationCourse);



module.exports = router;
