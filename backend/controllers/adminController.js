// API for adding doctor

import validator from 'validator'
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';
import { parse } from 'dotenv';
import doctorModel from '../models/doctorsModel.js';
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';
import adminModel from '../models/adminModel.js';
import nodemailer from 'nodemailer'; 
import specialityModel from '../models/feeModel.js';
import mongoose from "mongoose";



const AddDoctor = async (req, res) => {

   try {

  const { name, email, password, speciality, degree, experience, about, fees, address,state,doctorFee,gender,phone } = req.body
  const imageFile = req.file

  // Validate required fields
  if (!name || !email || !password || !speciality || !degree || !experience || !about || !address || !fees || !state || !doctorFee || !gender || !phone) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validating email
  if (!validator.isEmail(email)) {
    return res.json({ success: false, message: "Please Enter a Valid Email Address" });
  }

  // Validating password strenght
  if (password.length < 8) {
    return res.json({ success: false, message: "The Password has to be 8 or more Characters!" });
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Handle image upload (if provided)
  const imageUpload = await cloudinary.uploader.upload(imageFile.path)
  const imageUrl = imageUpload.secure_url

  // Check if the doctor already exists (by email)
  const existingDoctor = await doctorModel.findOne({ email });
  if (existingDoctor) {
    return res.json({ success: false, message: "Doctor with this email already exists" });
  } 

  // Create new doctor instance
  const doctorData = {
    name,
    email,
    password: hashedPassword,
    speciality,
    degree,
    experience,
    about,
    fees,
    doctorFee,
    state,
    address,
    gender,
    phone,
    image: imageUrl,
    date: Date.now()
  };

  // Save to database
  const newDoctor = new doctorModel(doctorData)
  await newDoctor.save();

  // Send success response
  res.json({ success: true, message: "Doctor added successfully", doctor: newDoctor });

   } catch (error) {
      console.log(error);
      res.json({success:false, message: error.message });
    }

}

// API for admin Login

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.json({ success: false, message: "Admin does not exist" });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.json({ success: false, message: "This Account is Deactivated. Please Contact Admin to Activate." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);

    if (isMatch) {
      // Generate token
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    }

    return res.json({ success: false, message: "Invalid email or password!" });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};



//API to get all doctors

const allDoctors = async (req, res) => {

  try {
    const doctors = await doctorModel.find({}).select('-password');
    res.json({success:true, doctors})

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }

}
 
// admin appointment
const adminAppointment = async (req, res) => {
  try {
    const { startDate, endDate, filterType, doctorId } = req.query;
    let query = {};

    console.log("doctorId received:", doctorId); // Debugging line

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

    if (doctorId && doctorId !== "all") {
      query.docId = doctorId; 
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
// Approve Appointment
const approveAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    await appointmentModel.findByIdAndUpdate(appointmentId, { 
      approve: true });

    res.json({ success: true, message: "Appointment Approved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// get  all Patient List

const getAllPatients = async (req,res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
      
    }
    const users = await userModel.find(query)

    console.log("respont:" , users)
  
    res.json({success:true,users})
    

 } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// get Dashboard Data

const adminDashboard = async (req, res) => {
  try {

    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    let totalEarning = 0;
    let monthlyEarnings = {};
    let completedAppointments = {};

    const currentMonth = new Date().getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const currentYear = new Date().getFullYear();

    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        totalEarning += item.amount;

        const appointmentDate = new Date(item.date);
        const month = appointmentDate.getMonth();
        const year = appointmentDate.getFullYear();

        const key = `${year}-${month}`;

        // Track earnings per month
        if (!monthlyEarnings[key]) {
          monthlyEarnings[key] = 0;
        }
        monthlyEarnings[key] += item.amount;

        // Track completed appointments per month
        if (!completedAppointments[key]) {
          completedAppointments[key] = 0;
        }
        if (item.isCompleted) {
          completedAppointments[key] += 1;
        }
      }
    });

    const dashboardData = {
      doctors: doctors.length,
      users: users.length,
      appointments: appointments.length,
      completedAppointments:completedAppointments.length,
      latestAppointment: appointments.slice(0, 5),
      earning: totalEarning,
      monthlyEarnings: {
        currentMonth: monthlyEarnings[`${currentYear}-${currentMonth}`] || 0,
        previousMonth: monthlyEarnings[`${currentYear}-${previousMonth}`] || 0,
      },
      completedAppointments: {
        currentMonth: completedAppointments[`${currentYear}-${currentMonth}`] || 0,
        previousMonth: completedAppointments[`${currentYear}-${previousMonth}`] || 0,
      },
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// API to add Admin
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Name, Email, Password is required!' })
    }

    // Validatin password strength
    if (password.length < 6) {
      return res.json({ success: false, message: 'Password must be 6 or more Character!' })

    }
    //harshing User Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

  // Validating email
  if (!validator.isEmail(email)) {
    return res.json({ success: false, message: "Please Enter a Valid Email Address" });
  }


    const admin = await adminModel.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: "Amdin with this email already exists!" });
    }

  
  // Create new doctor instance
  const adminData = {
    name,
    email,
    password: hashedPassword,
    date: Date.now()
  };
  
// Save to database
    const newAdmin = new adminModel(adminData);
    await newAdmin.save();

    // Send success response
  res.json({ success: true, message: "Admin added successfully", admin: newAdmin });


  } catch (error) {
    console.error("Register Admin Error:", error);
res.status(500).json({ message: "Error registering admin", error: error.message });
  }
};

// get all Admin
const getAllAdmin = async (req,res) => {
  try {
    const admins = await (await adminModel.find({}))
    console.log("respont:" , admins)
    res.json({success:true,admins})
    

 } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//update admin status

const adminStatus = async (req, res) => {
  try {

    console.log("Incoming request body:", req.body); // 👈 FULL body
    const {adminID} = req.body;
    console.log("Extracted adminId:", adminID);

    const AdminData = await adminModel.findById(adminID)
      await adminModel.findByIdAndUpdate(adminID, { isActive: !AdminData.isActive })


    res.json({ success: true, message: "Admin Status Updated!" });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};






// Forgot Reset
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Generate reset token (valid for 1 hour)
    const aToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    admin.resetPasswordToken = aToken;
    admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await admin.save();

    // Set up email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    const resetLink = `${process.env.CLIENT_URL1}/reset-password/${aToken}`;
    const mailOptions = {
      to: admin.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      text: `Hello,\n\nYou requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Password reset email sent', aToken });
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
    const admin = await adminModel.findById(decoded.id);

    if (!admin) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    admin.password = hashedPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;

    await admin.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorById = async (req,res) => {
   
  try {
     const {docId} = req.body

     const docData = await doctorModel.findById(docId).select('-password')
     res.json({success:true, docData})

  } catch (error) {
     console.log(error);
    res.json({ success: false, message: error.message });
  }
}


const updateProfile = async (req, res) => {


  const { docId, name, address, phone,degree,experience, state } = req.body;

  if (!docId) {
    return res.status(400).json({ success: false, message: "Doctor ID is required!" });
  }

  try {
    const updatedDoctor = await doctorModel.findByIdAndUpdate(docId, { name, address, phone,degree,experience, state }, { new: true });

    if (!updatedDoctor) {
      return res.status(404).json({ success: false, message: "Doctor not found!" });
    }

    res.json({ success: true, message: "Profile Updated Successfully", updatedDoctor });

  } catch (error) {
    console.error(" Backend error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const fetchDoctor = async (req, res) => {
  try {
    const docId = req.params.docId;

    // Get the start and end of the current month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    // Find all completed appointments for this doctor
    const allCompletedAppointments = await appointmentModel.find({ 
      docId, 
      isCompleted: true
    });

    const monthlyCompletedAppointments = await appointmentModel.find({ 
      docId, 
      isCompleted: true,
      date: { $gte: startOfMonth, $lte: endOfMonth } // Fetch only this month's appointments
    });

    // Calculate total earnings (20% of the total paid amount)
    const totalEarnings = allCompletedAppointments.reduce((sum, appt) => sum + (appt.docData.doctorFee), 0);

    // Calculate monthly earnings (20% of this month's earnings)
    const monthlyEarnings = monthlyCompletedAppointments.reduce((sum, appt) => sum + (appt.docData.doctorFee), 0);

    res.json({
      success: true,
      totalEarnings,
      completedAppointments: allCompletedAppointments.length,
      monthlyEarnings,
      monthlyCompletedAppointments: monthlyCompletedAppointments.length
    });

  } catch (error) {
    console.error("Error fetching doctor stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
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

// API to add Speciality
const registerSpeciality = async (req, res) => {
  try {
    const { speciality, fee, feePercentage } = req.body;

    if (!speciality || !fee || !feePercentage) {
      return res.status(400).json({ success: false, message: 'speciality, fee, and feePercentage are required!' });
    }

    const existingSpeciality = await specialityModel.findOne({ speciality });

    if (existingSpeciality) {
      return res.status(400).json({ message: "This Speciality already exists!" });
    }

    // Calculate doctorFee
    const doctorFee = (fee * feePercentage) / 100;

    const specialityData = { speciality, fee, feePercentage, doctorFee, createdAt: Date.now() };

    const newSpeciality = new specialityModel(specialityData);
    await newSpeciality.save();

    res.json({ success: true, message: "Speciality added successfully", speciality: newSpeciality });
  } catch (error) {
    console.error("Register Speciality Error:", error);
    res.status(500).json({ message: "Error registering Speciality", error: error.message });
  }
};

const getAllSpeciality = async (req, res) => {
  try {
    const specialityData = await specialityModel.find({});
    console.log("response:", specialityData);
    return res.json({ success: true, specialityData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateSpeciality = async (req, res) => {
  console.log("🛠 Received data in backend:", req.body); 

  const { specialityId, speciality, fee, feePercentage, doctorFee } = req.body;

  if (!specialityId) {
    console.error("Error: Speciality ID is missing in request");
    return res.status(400).json({ success: false, message: "Speciality ID is required!" });
  }

  try {

    const existingSpeciality = await specialityModel.findOne({ speciality, _id: { $ne: specialityId } });
    if (existingSpeciality) {
      return res.status(400).json({ success: false, message: "Speciality name must be unique!" });
    }

    const updatedSpeciality = await specialityModel.findByIdAndUpdate(specialityId, { speciality, fee, feePercentage, doctorFee },);

    if (!updatedSpeciality) {
      return res.status(404).json({ success: false, message: "Speciality not found!" });
    }

    res.json({ success: true, message: "Profile Updated Successfully", updatedSpeciality });

  } catch (error) {
    console.error(" Backend error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateAdmin = async (req, res) => {

  const { adminId, name, email } = req.body;

  if (!adminId) {
    console.error("Error: Admin ID is missing in request");
    return res.status(400).json({ success: false, message: "Admin ID is required!" });
  }

  try {

    const existingAdmin = await adminModel.findOne({ email, _id: { $ne: adminId } });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin Email already exist!" });
    }
    

    const updatedAdmin = await adminModel.findByIdAndUpdate(
      adminId, 
      { name, email }, 
      { new: true } // ✅ Returns the updated document
    );
    

    if (!updatedAdmin) {
      return res.status(404).json({ success: false, message: "Admin not found!" });
    }

    res.json({ success: true, message: "Admin Updated Successfully", updatedAdmin });

  } catch (error) {
    console.error(" Backend error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};





export { AddDoctor, allDoctors, loginAdmin, adminAppointment, appointmentCancel,approveAppointment,getAllPatients,adminDashboard,registerAdmin,getAllAdmin,adminStatus,forgotPassword,resetPassword,getDoctorById,updateProfile,fetchDoctor,getAppointmentById,registerSpeciality,getAllSpeciality, updateSpeciality,updateAdmin } 