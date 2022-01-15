const express = require('express');
const router = express.Router();

//! IMPORTING CONTROLLERS
const studentsController = require('../controllers/students_controller')

router.get('/', (req, res) => {
    res.send('Welcome to students endpoint.')
})

router.get('/all', studentsController.getStudents)
router.get('/all/:id', studentsController.getStudentById)
router.post('/add', studentsController.addStudent)
router.post('/delete/:id', studentsController.deleteById)
router.post('/update/:id', studentsController.updateStudentById)
router.post('/add-courses/:id', studentsController.addCoursesInStudent)
router.post('/update-courses/:id', studentsController.updateIndexsOfCourses)
router.post('/append-courses/:id', studentsController.appedInCourse)
router.post('/remove-courses/:id', studentsController.removeCourse)

module.exports = router;