import express from 'express';
import { appointmentCancel, approveAppointment, changePassword, clinicalNote, completeAppointment, doctoLogin, doctorAppointment, doctorDashboard, doctorList, doctorProfile, forgotPassword, getAppointmentById, resetPassword, updateProfile } from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';
import upload from '../middlewares/multer.js';

const doctorRouter = express.Router();
 
// Route to add a doctor with image upload

doctorRouter.post('/list', doctorList );
doctorRouter.post('/login', doctoLogin );
doctorRouter.get('/appointments', authDoctor, doctorAppointment );
doctorRouter.get('/dashboard', authDoctor, doctorDashboard );
doctorRouter.post('/cancel-appointment',authDoctor, appointmentCancel );
doctorRouter.post('/approve-appointment',authDoctor, approveAppointment );
doctorRouter.post('/complete-appointment',authDoctor, completeAppointment);
doctorRouter.get('/profile',authDoctor, doctorProfile);
doctorRouter.post('/update-profile',authDoctor, upload.single('image'),updateProfile);
doctorRouter.post('/change-password',authDoctor, changePassword);
doctorRouter.post('/doctor-forgot-password',  forgotPassword)
doctorRouter.post("/doctor-reset-password/:token", resetPassword)
doctorRouter.post('/clinical-note',authDoctor,clinicalNote);
doctorRouter.get('/appointment/:appointmentId', authDoctor, getAppointmentById);



export default doctorRouter; 