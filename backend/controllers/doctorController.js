import doctorModel from "../models/doctorsModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary'
import nodemailer from 'nodemailer'; 

const changeAvailability = async (req, res) => {
   try {

      const { docId } = req.body
      const docData = await doctorModel.findById(docId)
      await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
      res.json({ success: true, message: 'Availability Change' })

   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
   }
}



const doctorList = async (req, res) => {

   try {
      const doctors = await doctorModel.find({}).select(['-password', '-email'])
      res.json({success:true,doctors})
      
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
   }
}

// API  for Doctor login

const doctoLogin = async (req,res) => {
   
   try {
      const {password, email} = req.body

      const doctor = await doctorModel.findOne({email})
      if (!doctor) {
      return  res.json({success:false, message:"Invalid email or Password!"})
      }

      const isMatch = await bcrypt.compare(password, doctor.password)

      if (isMatch) {
         const token = jwt.sign({id:doctor._id}, process.env.JWT_SECRET)
         res.json({success:true, token})
      }else{
         res.json({success:false, message:"Invalid email or Password!"})
      }
   
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
   }
}



const doctorAppointment = async (req, res) => {
  try {
    const { startDate, endDate, filterType, docId } = req.query;
    let query = {};

    if (docId) {
      query.docId = docId;  // 🔥 this line filters for only the current doctor
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    if (filterType === "completed") {
      query.isCompleted = true;
    } else if (filterType === "uncompleted") {
      query.isCompleted = false;
    }

    console.log("Query:", JSON.stringify(query, null, 2)); 

    const appointments = await appointmentModel.find(query);

    console.log("Filtered Appointments:", appointments); 

    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.json({ success: false, message: error.message });
  }
};






// Approve Appointment
const approveAppointment = async (req, res) => {
   try {
     const { appointmentId } = req.body;
     await appointmentModel.findByIdAndUpdate(appointmentId, { 
       approve: true });
 
     res.json({ success: true, message: "Appointment Approved!" });
   } catch (error) {
     console.error(error);
     res.status(500).json({ success: false, message: "Internal Server Error" });
   }
 };


 // API to Cancel Appoint 
const appointmentCancel = async (req, res) => {
  
   try {
     const { appointmentId} = req.body
     const appointmentData = await appointmentModel.findById(appointmentId)
     await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})
 
     // Relearsing slot booked
     const {docId, slotDate, slotTime} = appointmentData
     const doctorData = await doctorModel.findById(docId)
     let slots_booked = doctorData.slots_booked
     slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
     await doctorModel.findByIdAndUpdate(docId, {slots_booked})
 
     res.json({success:true, message:"Appointment Cancelled!"})
 
 
 
   } catch (error) {
     console.log(error);
     res.json({ success: false, message: error.message });
   }
 }

 // API to Cancel Appoint 
const completeAppointment = async (req, res) => {
  
   try {
     const {docId,appointmentId} = req.body
     const appointmentData = await appointmentModel.findById(appointmentId)
   if (appointmentData && appointmentData.docId === docId ) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
         isCompleted:true})
        res.json({success:true, message:"Appointment Completed!"})
    
   }else{
      res.json({success:true, message:"Appointment Not Completed!"})
   }
     
 
 
   } catch (error) {
     console.log(error);
     res.json({ success: false, message: error.message });
   }
 }


 // get Doctor Dashboard Data

const doctorDashboard = async (req,res) => {
  
   try {
     
   const { docId } = req.body
     
     const appointments = await appointmentModel.find({docId})


     let earning = 0;

     appointments.map((item) => {
         if (item.isCompleted || item.payment) {
            earning += item.docData.doctorFee
         }
      })

      let patients =[];
      appointments.map((item) => {
         if (!patients.includes(item.userId)) {
            patients.push(item.userId)
         }
     })
     let completed = appointments.filter(item => item.isCompleted).length;
     let cancel = appointments.filter(item => item.cancelled).length;
     let pending = appointments.filter(item => item.cancelled).length;

     const dashboardData = {
      earning,
      completed ,
      cancel,
      pending,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointment: appointments.reverse().slice(0,5)
     }

     console.log("API Response",dashboardData.completed )
     res.json({success:true,dashboardData})
 
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
   }
 }

// Api to get doctor profile
const doctorProfile = async (req,res) => {
   
   try {
      const {docId} = req.body

      const docData = await doctorModel.findById(docId).select('-password')
      res.json({success:true, docData})

   } catch (error) {
      console.log(error);
     res.json({ success: false, message: error.message });
   }
}

// API to update Doctor Profile

const updateProfile = async (req, res) => {
  try {

    const { docId, name, address, state,speciality,email,experience,degree, about,available } = req.body;
    const imageFile = req.file

    if (!name || !email || !address || !state || !degree || !speciality || !experience || !about || !available) {
      res.json({ success: false, message: 'Data is Missing' })
    }

    await doctorModel.findByIdAndUpdate(docId,
      { name, address, state,speciality,email,experience,about,available,degree });

    if (imageFile) {
      //upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
      const imageUrl = imageUpload.secure_url
      await doctorModel.findByIdAndUpdate(docId, { image: imageUrl })
    }

    res.json({ success: true, message: "Profile Updated Successfully", });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



// API to change Password

const changePassword = async (req, res) => {
   try {
     const { docId, oldPassword, newPassword, confirmPassword } = req.body;
 
     // Validate input fields
     if (!docId || !oldPassword || !newPassword || !confirmPassword) {
       return res.status(400).json({ success: false, message: "All fields are required" });
     }
 
     // Ensure new password matches confirm password
     if (newPassword !== confirmPassword) {
       return res.status(400).json({ success: false, message: "New password and confirm password do not match" });
     }
 
     // Find doctor in database
     const doctor = await doctorModel.findById(docId);
     if (!doctor || !doctor.password) {
       return res.status(404).json({ success: false, message: "Doctor not found or password missing" });
     }
 
     console.log("Stored Hashed Password:", doctor.password);
     console.log("Entered Old Password:", oldPassword);
 
     // Compare old password with stored hashed password
     const isMatch = await bcrypt.compare(oldPassword, doctor.password);
 
     if (isMatch) {

     // Hash the new password AFTER verifying the old one
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(newPassword, salt);
 
     // Update password in database
     doctor.password = hashedPassword;
     await doctor.save();
 
     return res.json({ success: true, message: "Password changed successfully" });

     }else{
      
      console.log("Password does NOT match"); 
      return res.json({ success: false, message: "Incorrect old password" });
     }
 
     
 
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
   }
 };

 
 // Forgot Reset
 const forgotPassword = async (req, res) => {
   try {
     const { email } = req.body;
     const doctor = await doctorModel.findOne({ email });
 
     if (!doctor) {
       return res.status(404).json({ message: 'Doctor not found' });
     }
 
     // Generate reset token (valid for 1 hour)
     const dToken = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
     doctor.resetPasswordToken = dToken;
     doctor.resetPasswordExpires = Date.now() + 3600000; // 1 hour
     await doctor.save();
 
     // Set up email transporter
     const transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASS, 
       },
     });
 
     const resetLink = `${process.env.CLIENT_URL1}/doctor-reset-password/${dToken}`;
     const mailOptions = {
       to: doctor.email,
       from: process.env.EMAIL_USER,
       subject: 'Password Reset Request',
       text: `Hello,\n\nYou requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n`,
     };
 
     await transporter.sendMail(mailOptions);
 
     res.status(200).json({ success: true, message: 'Password reset email sent', dToken });
   } catch (error) {
     console.error('Error resetting password:', error);
     res.status(500).json({ message: 'Server error' });
   }
 };
 
  // reset passowrd
  const resetPassword = async (req, res) => {
   try {
     const { token } = req.params;
     const { password } = req.body;
 
     
 
     // Verify and decode token
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     const doctor = await doctorModel.findById(decoded.id);
 
     if (!doctor) {
       return res.status(400).json({ message: 'Invalid or expired token' });
     }
  
     // Hash new password
     const hashedPassword = await bcrypt.hash(password, 10);
     doctor.password = hashedPassword;
     doctor.resetPasswordToken = undefined;
     doctor.resetPasswordExpires = undefined;
 
     await doctor.save();
     res.status(200).json({ message: 'Password updated successfully' });
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 };

 // API to record Clinical note

 const clinicalNote = async (req, res) => {
  try {
    const { appointmentId, docId, clinicalNote, diagnosis, prescription,investigation } = req.body;

    if (!appointmentId || !docId || !clinicalNote || !diagnosis || !prescription || !investigation) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // ✅ Save clinical note, diagnosis, and prescription
    appointment.clinicalNote = clinicalNote;
    appointment.diagnosis = diagnosis;
    appointment.prescription = prescription;
    appointment.investigation = investigation
    appointment.isCompleted = true; // Mark as completed

    await appointment.save(); // 🛠 Save changes to DB

    res.json({ success: true, message: "Clinical note recorded successfully!", appointment });
  } catch (error) {
    console.error("Error saving clinical note:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

 
 

export { changeAvailability, doctorList, doctoLogin, doctorAppointment,doctorDashboard,approveAppointment,appointmentCancel,completeAppointment, doctorProfile, updateProfile,changePassword,forgotPassword,resetPassword,clinicalNote,getAppointmentById }