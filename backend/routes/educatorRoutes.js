import express from 'express';
import {
    adminRegister,
    adminLogin,
    getAdminData,
    updateAdminProfile,
    changePassword,
    addCourse,
    educatorCourses,
    updateCourse,
    togglePublish,
    educatorDashboardData,
    enrolledStudentsData,
    allCourses,
    getCourseById,
    adminDashboardData,
    saveQuiz,
    getQuiz,
    getQuizList,
    deleteQuiz,
    getAllUsers,
    getAllEducators,
    updateUser,
    deleteUser,
    toggleUserStatus,
    deleteCourse,
    getFilteredEnrolledStudents,
    updateStudentProgress,
    resetStudentQuiz,
    generateStudentCertificate
} from '../controllers/educatorController.js';
import authAdmin from '../middlewares/authAdmin.js';
import upload from '../middlewares/multer.js';

const educatorRouter = express.Router();

// Auth routes
educatorRouter.post('/register', authAdmin, adminRegister);
educatorRouter.post('/login', adminLogin);
educatorRouter.get('/profile', authAdmin, getAdminData);
educatorRouter.put('/update-profile', upload.single('image'), authAdmin, updateAdminProfile);
educatorRouter.post('/change-password', authAdmin, changePassword);

// Course routes
educatorRouter.post('/add-course', upload.single('image'), authAdmin, addCourse);
educatorRouter.get('/my-courses', authAdmin, educatorCourses);
educatorRouter.post('/update-course', upload.single('image'), authAdmin, updateCourse);
educatorRouter.post('/toggle-publish/:courseId', authAdmin, togglePublish);
educatorRouter.get('/all-courses', authAdmin, allCourses);
educatorRouter.get('/course/:courseId', authAdmin, getCourseById);
educatorRouter.delete('/delete-course/:courseId', authAdmin, deleteCourse);

// Student/Enrollment routes
educatorRouter.get('/enrolled-students', authAdmin, enrolledStudentsData);
educatorRouter.get('/enrolled-students-filtered', authAdmin, getFilteredEnrolledStudents);
educatorRouter.post('/update-student-progress', authAdmin, updateStudentProgress);
educatorRouter.post('/reset-student-progress', authAdmin, resetStudentQuiz);
educatorRouter.post('/student-certificate', authAdmin, generateStudentCertificate);

// Dashboard
educatorRouter.get('/dashboard', authAdmin, educatorDashboardData);
educatorRouter.get('/admin-dashboard', authAdmin, adminDashboardData);

// Quiz routes
educatorRouter.post('/add-quiz', authAdmin, saveQuiz);
educatorRouter.get('/get-quiz/:courseId', authAdmin, getQuiz);
educatorRouter.get('/quiz-list', authAdmin, getQuizList);
educatorRouter.delete('/delete-quiz/:quizId', authAdmin, deleteQuiz);

// User management routes
educatorRouter.get('/all-users', authAdmin, getAllUsers);
educatorRouter.get('/all-educators', authAdmin, getAllEducators);
educatorRouter.put('/update-user/:userId', authAdmin, updateUser);
educatorRouter.delete('/delete-user/:userId', authAdmin, deleteUser);
educatorRouter.patch('/toggle-user-status/:userId', authAdmin, toggleUserStatus);

export default educatorRouter;