import express from 'express';
import { bookAppointment, cancelAppoint, getProfile, listAppointment, paystackPayment, registerUser, updateProfile, userLogin, paystackVerifyPayment, forgotPassword, resetPassword, getAppointmentById,  } from '../controllers/userController.js';
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



export default userRouter;