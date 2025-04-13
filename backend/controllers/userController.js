import validator from 'validator'
import userModel from '../models/userModel.js';
import bcrypt, { hash } from "bcrypt";
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorsModel.js';
import appointmentModel from '../models/appointmentModel.js';
import cors from 'cors'
import 'dotenv/config'
import axios from 'axios'
import nodemailer from 'nodemailer';





const nigerianPhoneRegex = /^(?:\+234|0)(70|80|81|90|91)\d{8}$/;
// API to Register User/Patient

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, nin, password, isAccepted } = req.body;

    if (!name || !phone || !password || !nin) {
      return res.json({ success: false, message: 'Name, Phone, Password, and NIN are required!' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.json({ success: false, message: 'Password must be 6 or more characters!' });
    }

    // Ensure user accepts terms before proceeding
    if (isAccepted !== true) {
      return res.json({ success: false, message: 'You must accept the Terms and Conditions!' });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!phone.match(nigerianPhoneRegex)) {
      return res.status(400).json({ success: false, message: "Please enter a valid Nigerian phone number" });
    }

    const userExists = await userModel.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ message: "Phone number already in use" });
    }

    const newUser = new userModel({
      name,
      email,
      phone,
      nin,
      password: hashedPassword,
      isAccepted  // Store in the database
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });

  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};


// API for admin Login

const userLogin = async (req, res) => {

  try {
    const { phone, password } = req.body
    const user = await userModel.findOne({ phone })

    if (!user) {
      return res.json({ success: false, message: "User Does not Exist" })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Paswsword!" });
    }



  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }

}

// get user Profile
const getProfile = async (req, res) => {
  try {

    const { userId } = req.body
    const userData = await userModel.findById(userId).select('-password')
    res.json({ success: true, userData })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//  user update Profile

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, email, gender, address, dob, nin } = req.body
    const imageFile = req.file

    if (!name || !email || !phone || !nin || !gender || !address || !dob) {
      res.json({ success: false, message: 'Data is Missing' })
    }

    await userModel.findByIdAndUpdate(userId, { name, phone, nin, email, address, gender, dob })

    if (imageFile) {
      //upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
      const imageUrl = imageUpload.secure_url
      await userModel.findByIdAndUpdate(userId, { image: imageUrl })
    }

    res.json({ success: true, message: 'Profile Updated Successifull' })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
//API to Book Appointment

const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime, type } = req.body;
    const docData = await doctorModel.findById(docId).select('-password');

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not Available" });
    }

    if (!type) {
      return res.json({ success: false, message: "Please Select type Booking!" });
    }

    let slots_booked = docData.slots_booked;

    // Checking for slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not Available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select('-password');
    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      docData,
      userData,
      amount: docData.fees,
      slotTime,
      slotDate,
      type,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Save new slots data in docdata
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    // Sending Email Notification to Doctor and Patient
    const sendEmailNotification = async () => {
      const transporter = nodemailer.createTransport({
        service: 'gmail', // You can replace this with another email service
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Email content
      const subject = `Appointment Booking Notification - ${slotDate} ${slotTime}`;
      const patientMessage = `
        <h2>Your Appointment is Successfully Booked</h2>
        <p>Dear ${userData.name},</p>
        <p>Your appointment with Dr. ${docData.name} has been successfully booked for ${slotDate} at ${slotTime}.</p>
        <p>Type of Appointment: ${type}</p>
        <p>Amount: ₦ ${docData.fees}</p>
        <p>Thank you for using our services!</p>
      `;

      const doctorMessage = `
        <h2>New Appointment Booking</h2>
        <p>Dear ${docData.name},</p>
        <p>You have a new appointment booked with ${userData.name} for ${slotDate} at ${slotTime}.</p>
        <p>Type of Appointment: ${type}</p>
        <p>Patient Contact: ${userData.phone}</p>
        <p>Amount: ₦ ${docData.doctorFee}</p>
        <p>Please login to your Account to Approve the Appointment!</p>
        <p>Please make sure to prepare for the appointment!</p>
      `;

      // Patient email
      const patientMailOptions = {
        from: 'info@edocta.com',
        to: userData.email,
        subject: subject,
        html: patientMessage,
      };

      // Doctor email
      const doctorMailOptions = {
        from: 'info@edocta.com',
        to: docData.email, // Ensure the doctor's email is stored in the docData
        subject: subject,
        html: doctorMessage,
      };

      try {
        // Send both emails
        await transporter.sendMail(patientMailOptions);
        await transporter.sendMail(doctorMailOptions);
        console.log('Emails sent successfully');
      } catch (error) {
        console.error('Error sending email:', error);
      }
    };

    // Call the email sending function
    await sendEmailNotification();

    res.json({ success: true, message: "Appointment Booked!" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user Appointment

const listAppointment = async (req, res) => {

  try {

    const { userId } = req.body
    const appointments = await appointmentModel.find({ userId })

    res.json({ success: true, appointments })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// API to Cancel Appoint 
const cancelAppoint = async (req, res) => {

  try {
    const { userId, appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    // Relearsing slot booked
    const { docId, slotDate, slotTime } = appointmentData
    const doctorData = await doctorModel.findById(docId)
    let slots_booked = doctorData.slots_booked
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    res.json({ success: true, message: "Appointment Cancelled!" })



  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


const paystackPayment = async (req, res) => {
  /*  try {*/
  const { appointmentId } = req.body;

  // Fetch appointment details
  const appointmentData = await appointmentModel.findById(appointmentId);
  if (!appointmentData || appointmentData.cancelled) {
    return res.json({ success: false, message: "Appointment Cancelled or Not Found!" });
  }

  // Define payment data for Paystack API
  const paymentData = {
    email: appointmentData.userData.email,
    amount: appointmentData.amount * 100, // ✅ Convert amount to kobo
    currency: process.env.CURRENCY,
    reference: `paystack_${appointmentId}_${Date.now()}`, // ✅ Unique reference
    publicKey: 'pk_test_f645ba01086466837dfd44382514e240781667da',
    callback_url: "http://localhost:5173/My-Appointment",
  };

  // Call Paystack API
  const { data } = await axios.post("https://api.paystack.co/transaction/initialize",
    paymentData,
    {

      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_KEY_SECRET}`, // ✅ Ensure environment variable is correctly loaded
        "Content-Type": "application/json",
      },
    }
  );

  console.log("Paystack API Response:", data);

  res.json({ success: true, paymentUrl: data.data.authorization_url });

  /*} catch (error) {
     console.error("Paystack Error:", error.data?.data || error.message);
     res.status(500).json({ success: false, message: "Payment failed", error: error.message });
   }*/
};

const paystackVerifyPayment = async (req, res) => {
  const { reference } = req.body; // Reference from Paystack

  if (!reference) {
    return res.status(400).json({ success: false, message: "Payment reference is required" });
  }

  try {
    // Verify the payment with Paystack
    const { data } = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_KEY_SECRET}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Paystack Verification Response:", data);

    if (data.status && data.data.status === "success") {
      // Extract appointmentId from reference
      const referenceParts = reference.split("_");
      const appointmentId = referenceParts[1];

      // Update the appointment as paid
      const updatedAppointment = await appointmentModel.findById(appointmentId);
      await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })


      if (!updatedAppointment) {
        return res.status(404).json({ success: false, message: "Appointment not found" });
      }

      return res.json({
        success: true,
        message: "Payment verified and appointment updated",
        appointment: updatedAppointment,
      });
    } else {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// password Reset

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token (valid for 1 hour)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    // Send reset email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      text: `Hello,\n\nYou requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Password reset email sent', token });
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
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

export { registerUser, userLogin, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppoint, paystackPayment, paystackVerifyPayment, forgotPassword, resetPassword, getAppointmentById, }
