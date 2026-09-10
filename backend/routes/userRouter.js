import express from 'express';
import { bookAppointment, cancelAppoint, getProfile, listAppointment, paystackPayment, registerUser, updateProfile, userLogin, paystackVerifyPayment, forgotPassword, resetPassword, getAppointmentById, getAllCourses, getCourseById, purchaseCourse, verifyCoursePayment, getCourseProgress, updateCourseProgress, resetProgress, addRating, userEnrolledCourses, getStudentQuiz, submitStudentQuiz, getHomeCareTeams, getHomeCareTeamById, bookHomeCareTeam } from '../controllers/userController.js';
import { submitTourismRequest, getUserTourismRequests } from '../controllers/medicalTourismController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';


const userRouter = express.Router();

// Route to add a user 

userRouter.post('/register', registerUser);
userRouter.post('/login', userLogin);
userRouter.get('/get-profile',authUser, getProfile);
userRouter.post('/update-profile',upload.single('image'),authUser, updateProfile);
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/appointments',authUser, listAppointment);
userRouter.post('/cancel-appointment', authUser, cancelAppoint);
userRouter.post('/paystack-payment', authUser, paystackPayment);
userRouter.post('/paystack-verify', authUser, paystackVerifyPayment);
userRouter.post('/forgot-password',  forgotPassword)
userRouter.post("/reset-password/:token", resetPassword);
userRouter.get('/appointment/:appointmentId', authUser, getAppointmentById);
userRouter.get('/all-courses', getAllCourses);
userRouter.get('/course/:courseId', getCourseById);

// Home Healthcare Team User Routes
userRouter.get('/home-care-teams', getHomeCareTeams);
userRouter.get('/home-care-team/:teamId', getHomeCareTeamById);
userRouter.post('/book-home-care-team', authUser, bookHomeCareTeam);

// Student course enrollment & progress routes
userRouter.post('/purchase', authUser, purchaseCourse);
userRouter.post('/verify-payment', authUser, verifyCoursePayment);
userRouter.post('/get-course-progress', authUser, getCourseProgress);
userRouter.post('/update-course-progress', authUser, updateCourseProgress);
userRouter.post('/reset-progress', authUser, resetProgress);
userRouter.post('/add-rating', authUser, addRating);
userRouter.get('/enrolled-course', authUser, userEnrolledCourses);
userRouter.get('/quiz/:courseId', authUser, getStudentQuiz);
userRouter.post('/quiz/:courseId/submit', authUser, submitStudentQuiz);

// Medical Tourism Request Routes
userRouter.post('/submit-tourism-request', authUser, submitTourismRequest);
userRouter.get('/my-tourism-requests', authUser, getUserTourismRequests);

export default userRouter;