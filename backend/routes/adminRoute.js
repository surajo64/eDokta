import express from 'express';
import { AddDoctor, adminAppointment, adminDashboard, allDoctors, appointmentCancel, approveAppointment, adminStatus, fetchDoctor, forgotPassword, getAllAdmin, getAllPatients, getAllSpeciality, getAppointmentById, getDoctorById, loginAdmin, registerAdmin, registerSpeciality, resetPassword, updateAdmin, updateProfile, updateSpeciality } from '../controllers/adminController.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailability } from '../controllers/doctorController.js';

const adminRouter = express.Router();

// Route to add a doctor with image upload
adminRouter.post('/add-doctor',authAdmin, upload.single('image'), AddDoctor);
adminRouter.post('/login',loginAdmin );
adminRouter.post('/all-doctors', authAdmin, allDoctors );
adminRouter.post('/change-availability', authAdmin, changeAvailability );
adminRouter.get('/appointments', authAdmin,adminAppointment );
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel);
adminRouter.post('/approve-appointment', authAdmin, approveAppointment);
adminRouter.get('/patients-list', authAdmin, getAllPatients );
adminRouter.get('/dashboard', authAdmin, adminDashboard );
adminRouter.post('/add-admin',authAdmin, registerAdmin );
adminRouter.get('/admin-list', authAdmin, getAllAdmin);
adminRouter.post('/admin-status', authAdmin, adminStatus);
adminRouter.post('/forgot-password',  forgotPassword)
adminRouter.post("/reset-password/:token", resetPassword)
adminRouter.get('/getDoctor/:docId', authAdmin, getDoctorById);
adminRouter.post('/update-profile',authAdmin,updateProfile);
adminRouter.get('/doctor-stats/:docId', authAdmin, fetchDoctor);
adminRouter.get('/appointment/:appointmentId', authAdmin, getAppointmentById);
adminRouter.post('/add-speciality', authAdmin, registerSpeciality);
adminRouter.get('/speciality-list', authAdmin, getAllSpeciality);
adminRouter.post('/update-speciality',authAdmin,updateSpeciality);
adminRouter.get('/doctors', authAdmin, allDoctors );
adminRouter.post('/update-admin',authAdmin,updateAdmin);



export default adminRouter;
