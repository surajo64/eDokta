import validator from 'validator'
import userModel from '../models/userModel.js';
import bcrypt, { hash } from "bcryptjs";
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorsModel.js';
import appointmentModel from '../models/appointmentModel.js';
import cors from 'cors'
import 'dotenv/config'
import axios from 'axios'
import nodemailer from 'nodemailer';
import Course from '../models/courseModel.js';
import CourseProgress from '../models/courseProgressModel.js';
import Purchase from '../models/purchaseModel.js';
import Quiz, { questionSchema } from "../models/quizMode.js";
import crypto from "crypto";
import streamifier from "streamifier";
import { v4 as uuidv4 } from "uuid";
import PDFDocument from "pdfkit";
import { buildCertificateContent, uploadCertificateToCloudinary } from "../utils/certificateHelper.js";
import homeCareTeamModel from '../models/homeCareTeamModel.js';
import { sendEnrollmentConfirmationEmail, sendEnrollmentNotificationEmail, sendEmail, sendVerificationEmail } from '../config/emailUtils.js';





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
// API to Book Appointment
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

    // ✅ Generate Jitsi Meeting Link if type = telemedicine
    let meetingUrl = "";
    if (type === "telemedicine") {
      const roomName = `telehealth-${docId}-${userId}-${Date.now()}`;
      meetingUrl = `https://meet.jit.si/${roomName}`;
    }

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
      meetingUrl, // save meeting link
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Save updated slots in doctor data
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    // ✅ Sending Email Notification with meeting link
    const sendEmailNotification = async () => {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const subject = `Appointment Booking Notification - ${slotDate} ${slotTime}`;

      const patientMessage = `
        <h2>Your Appointment is Successfully Booked</h2>
        <p>Dear ${userData.name},</p>
        <p>Your appointment with Dr. ${docData.name} is booked for ${slotDate} at ${slotTime}.</p>
        <p>Type of Appointment: ${type}</p>
        <p>Amount: ₦ ${docData.fees}</p>
        ${
          meetingUrl
            ? `<p><strong>Join Telehealth Meeting:</strong> <a href="${meetingUrl}" target="_blank">${meetingUrl}</a></p>`
            : ""
        }
        <p>Thank you for using our services!</p>
      `;

      const doctorMessage = `
        <h2>New Appointment Booking</h2>
        <p>Dear ${docData.name},</p>
        <p>You have a new appointment booked with ${userData.name} for ${slotDate} at ${slotTime}.</p>
        <p>Type of Appointment: ${type}</p>
        <p>Patient Contact: ${userData.phone}</p>
        <p>Amount: ₦ ${docData.fees}</p>
        ${
          meetingUrl
            ? `<p><strong>Join Telehealth Meeting:</strong> <a href="${meetingUrl}" target="_blank">${meetingUrl}</a></p>`
            : ""
        }
        <p>Please login to your Account to Approve the Appointment!</p>
      `;

      try {
        await transporter.sendMail({
          from: 'info@edocta.com',
          to: userData.email,
          subject,
          html: patientMessage,
        });

        await transporter.sendMail({
          from: 'info@edocta.com',
          to: docData.email,
          subject,
          html: doctorMessage,
        });

        console.log('Emails sent successfully');
      } catch (error) {
        console.error('Error sending email:', error);
      }
    };

    await sendEmailNotification();

    res.json({ success: true, message: "Appointment Booked!", meetingUrl });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// API to get user Appointment

const listAppointment = async (req, res) => {

  try {

    const { userId } = req.body
    const appointments = await appointmentModel.find({ userId }).sort({ createdAt: -1, date: -1 })

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
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    // Releasing slot booked safely
    try {
      const { docId, slotDate, slotTime } = appointmentData
      if (docId && slotDate && slotTime) {
        let targetDoc = await doctorModel.findById(docId);
        let targetModel = doctorModel;

        if (!targetDoc) {
          targetDoc = await homeCareTeamModel.findById(docId);
          targetModel = homeCareTeamModel;
        }
        if (!targetDoc && appointmentData.docData?._id) {
          targetDoc = await homeCareTeamModel.findById(appointmentData.docData._id);
          targetModel = homeCareTeamModel;
        }

        if (targetDoc && targetDoc.slots_booked && typeof targetDoc.slots_booked === 'object') {
          let slots_booked = targetDoc.slots_booked;
          if (slots_booked && slots_booked[slotDate] && Array.isArray(slots_booked[slotDate])) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
            await targetModel.findByIdAndUpdate(targetDoc._id, { slots_booked });
          }
        }
      }
    } catch (slotErr) {
      console.log("Slot release warning:", slotErr.message);
    }

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

  // Get origin from request headers to dynamically handle localhost vs 127.0.0.1 origin mismatch
  const origin = req.get('origin') || 'http://localhost:5173';
  const callback_url = req.body.callbackUrl || `${origin}/My-Appointment`;

  // Define payment data for Paystack API
  const paymentData = {
    email: appointmentData.userData.email,
    amount: appointmentData.amount * 100, // ✅ Convert amount to kobo
    currency: process.env.CURRENCY,
    reference: `paystack_${appointmentId}_${Date.now()}`, // ✅ Unique reference
    publicKey: 'pk_test_f645ba01086466837dfd44382514e240781667da',
    callback_url: callback_url,
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

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).select("-courseContent").populate("educator", "name email");
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const courseData = await Course.findById(courseId).populate("educator", "name email");
    if (!courseData) {
      return res.json({ success: false, message: "Course not found" });
    }
    res.json({ success: true, courseData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// user enrolled Courses with lecture link
const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.body.userId;
    const userData = await userModel.findById(userId)
      .populate({
        path: 'enrolledCourses',
        select: 'courseTitle courseThumbnail courseContent courseRatings educator enrolledStudents createdAt updatedAt courseAddress meetingUrl classSchedule courseMode',
      });

    // Fetch purchases to get attendanceType
    const purchases = await Purchase.find({ userId, status: 'Completed' });

    // Merge attendanceType into enrolledCourses
    const enrolledCoursesWithDetails = userData.enrolledCourses.map(course => {
      const purchase = purchases.find(p => p.courseId.toString() === course._id.toString());
      return {
        ...course.toObject(),
        attendanceType: purchase ? purchase.attendanceType : (course.courseMode === 'Virtual' ? 'Virtual' : 'Physical')
      };
    });

    res.json({ success: true, enrolledCourses: enrolledCoursesWithDetails });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to Purchase Course
const purchaseCourse = async (req, res) => {
  try {
    const { courseId, attendanceType } = req.body;
    const userId = req.body.userId;

    const user = await userModel.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.json({ success: false, message: "User or Course not found" });
    }

    if (!course.isActive) {
      return res.json({ success: false, message: "Course registration is completed. New enrollments are not allowed." });
    }

    let price = 0;
    if (attendanceType === 'Physical') {
      price = course.purchasePricePhysical > 0 ? course.purchasePricePhysical : course.purchasePrice;
    } else if (attendanceType === 'Virtual') {
      price = course.purchasePriceVirtual > 0 ? course.purchasePriceVirtual : course.purchasePrice;
    } else {
      price = course.purchasePrice;
    }

    const amount = price * 100;
    const reference = `KIRCT_${crypto.randomBytes(8).toString("hex")}`;

    // Get origin from request headers to dynamically handle localhost vs 127.0.0.1 origin mismatch
    const origin = req.get('origin') || process.env.FRONTEND_URL || 'http://localhost:5173';
    const callback_url = req.body.callbackUrl || `${origin}/payment-callback`;

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: user.email,
        amount,
        reference,
        callback_url: callback_url,
        metadata: {
          courseId,
          userId,
          attendanceType
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status !== true) {
      return res.json({ success: false, message: "Paystack init failed" });
    }

    return res.json({
      success: true,
      reference,
      email: user.email,
      amount,
      authorization_url: response.data.data.authorization_url,
    });

  } catch (error) {
    console.error("Purchase Error:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Payment link not generated" });
  }
};

const verifyPayment = async (req, res) => {
  const { reference, userId, courseId } = req.body;

  if (!reference || !userId || !courseId) {
    return res.status(400).json({ success: false, message: "Missing required fields: reference, userId, courseId" });
  }

  let paystackResponse;
  try {
    paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
  } catch (paystackError) {
    const paystackMsg = paystackError.response?.data?.message || "Paystack verification failed";
    console.error("Paystack verify error:", paystackMsg);
    return res.status(400).json({ success: false, message: paystackMsg });
  }

  try {
    const paymentData = paystackResponse.data;
    const txStatus = paymentData.data?.status;
    const status = txStatus === "success" ? "Completed" : "Failed";
    const amount = (paymentData.data?.amount || 0) / 100;
    const { attendanceType } = paymentData.data?.metadata || {};

    const existing = await Purchase.findOne({ courseId, userId });
    if (!existing) {
      await Purchase.create({
        courseId,
        userId,
        amount,
        attendanceType: attendanceType || "Physical",
        status,
      });
    } else if (existing.status !== "Completed" && status === "Completed") {
      existing.status = "Completed";
      await existing.save();
    }

    if (status === "Completed") {
      const [updatedUser, updatedCourse] = await Promise.all([
        userModel.findByIdAndUpdate(userId, { $addToSet: { enrolledCourses: courseId } }, { new: true }),
        Course.findByIdAndUpdate(courseId, { $addToSet: { enrolledStudents: userId } }, { new: true }).populate('educator', 'name email'),
      ]);

      const finalAttendanceType = attendanceType || "Physical";
      const emailPromises = [];

      if (updatedUser?.email) {
        emailPromises.push(
          sendEnrollmentConfirmationEmail({
            studentName: updatedUser.name,
            studentEmail: updatedUser.email,
            courseTitle: updatedCourse?.courseTitle || "Course",
            courseMode: updatedCourse?.courseMode || "",
            attendanceType: finalAttendanceType,
            courseAddress: updatedCourse?.courseAddress || "",
            meetingUrl: updatedCourse?.meetingUrl || "",
            classSchedule: updatedCourse?.classSchedule || "",
            amount,
          }).catch(err => console.error("Student email error:", err.message))
        );
      }

      if (updatedCourse?.educator?.email) {
        emailPromises.push(
          sendEnrollmentNotificationEmail({
            educatorName: updatedCourse.educator.name,
            educatorEmail: updatedCourse.educator.email,
            studentName: updatedUser?.name || "A student",
            studentEmail: updatedUser?.email || "N/A",
            courseTitle: updatedCourse.courseTitle,
            attendanceType: finalAttendanceType,
            amount,
          }).catch(err => console.error("Educator email error:", err.message))
        );
      }

      Promise.all(emailPromises);

      return res.json({ success: true, message: "Enrollment successful" });
    } else {
      return res.status(400).json({ success: false, message: `Payment status: ${txStatus}` });
    }
  } catch (error) {
    console.error("verifyPayment DB error:", error.message);
    return res.status(500).json({ success: false, message: "Error saving enrollment: " + error.message });
  }
};

const updateCourseProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.body;
    const userId = req.body.userId;

    if (!courseId || !lectureId) {
      return res.json({ success: false, message: "courseId and lectureId are required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.json({ success: false, message: "Course not found" });
    }

    const totalLectures = course.courseContent.reduce(
      (sum, chapter) => sum + chapter.chapterContent.length,
      0
    );

    let progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      progress = new CourseProgress({ userId, courseId, lectureCompleted: [] });
    }

    if (!progress.lectureCompleted.includes(lectureId)) {
      progress.lectureCompleted.push(lectureId);
    }

    if (progress.lectureCompleted.length >= totalLectures) {
      progress.completed = true;
    }

    await progress.save();

    res.json({
      success: true,
      message: progress.completed
        ? "Congratulations! You completed this course 🎉"
        : "Lecture marked as completed",
      progress,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getUserCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.body.userId;
    const progressData = await CourseProgress.findOne({ userId, courseId });
    res.json({ success: true, progressData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const addUserRating = async (req, res) => {
  const { courseId, rating } = req.body;
  const userId = req.body.userId;

  if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
    return res.json({ success: false, message: "Invalid Details" });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.json({ success: false, message: "Course Not Found" });
    }

    const user = await userModel.findById(userId);
    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({ success: false, message: "User did not enroll in this course" });
    }

    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingRatingIndex >= 0) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }

    await course.save();
    return res.json({ success: true, message: "Rating added successfully!" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const fetchQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const quiz = await Quiz.findOne({ courseId }).populate("courseId", "courseTitle");

    if (!quiz) {
      return res.status(404).json({ message: "No quiz found for this course" });
    }

    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sumbitQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId, answers } = req.body;

    const quiz = await Quiz.findOne({ courseId }).populate("courseId", "name");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let correctCount = 0;
    const evaluatedAnswers = answers.map((ans) => {
      const question = quiz.questions.id(ans.questionId);
      if (!question) return null;

      const isCorrect = question.correctAnswer === ans.selectedOption;
      if (isCorrect) correctCount++;

      return {
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        isCorrect,
      };
    }).filter(Boolean);

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passMark = 50;

    const progress = await CourseProgress.findOneAndUpdate(
      { userId, courseId },
      {
        quizTaken: true,
        quizScore: score,
        quizPassed: score >= passMark,
        quizAnswers: evaluatedAnswers,
      },
      { new: true, upsert: true }
    );

    res.json({
      message: "Quiz submitted",
      score,
      passed: score >= passMark,
      totalQuestions: quiz.questions.length,
      correctCount,
      progress,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const retakeCourse = async (req, res) => {
  try {
    const { courseId, userId } = req.body;

    await CourseProgress.findOneAndUpdate(
      { userId, courseId },
      {
        completed: false,
        lectureCompleted: [],
        quizTaken: false,
        quizScore: 0,
        quizPassed: false,
        quizAnswers: []
      }
    );

    res.json({ success: true, message: "Progress reset successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const progress = await CourseProgress.findOne({ userId, courseId })
      .populate({
        path: "courseId",
        populate: { path: "educator", select: "name email" },
      });

    if (!progress) {
      return res.status(404).json({ success: false, message: "Course progress not found" });
    }

    const quiz = await Quiz.findOne({ courseId });
    const hasQuiz = !!quiz;

    if (hasQuiz) {
      if (!progress.quizPassed) {
        return res.status(403).json({ success: false, message: "You must pass the quiz to generate a certificate" });
      }
    } else {
      if (!progress.completed) {
        return res.status(403).json({ success: false, message: "You must complete the course to generate a certificate" });
      }
    }

    if (progress.certificateUrl) {
      return res.json({ success: true, certificateUrl: progress.certificateUrl });
    }

    const course = progress.courseId;
    const certificateId = uuidv4().slice(0, 8).toUpperCase();
    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    let isResSent = false;
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margins: { top: 0, left: 0, right: 0, bottom: 0 },
    });

    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      try {
        const pdfBuffer = Buffer.concat(buffers);
        await uploadCertificateToCloudinary(pdfBuffer, progress, certificateId);
        if (!isResSent) {
          isResSent = true;
          res.json({ success: true, certificateUrl: progress.certificateUrl });
        }
      } catch (err) {
        if (!isResSent) {
          isResSent = true;
          res.status(500).json({
            success: false,
            message: "Certificate upload failed",
            error: err.message,
          });
        }
      }
    });

    try {
      await buildCertificateContent(doc, user, course, certificateId, today);
      doc.end();
    } catch (err) {
      if (!isResSent) {
        isResSent = true;
        res.status(500).json({ success: false, message: "Certificate generation failed", error: err.message });
      }
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await userModel.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification token." });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    const loginToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      success: true,
      message: "Email verified successfully!",
      token: loginToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      }
    });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Aliases for userRouter.js
const verifyCoursePayment = verifyPayment;
const getCourseProgress = getUserCourseProgress;
const resetProgress = retakeCourse;
const addRating = addUserRating;
const getStudentQuiz = fetchQuiz;
const submitStudentQuiz = sumbitQuiz;

const getHomeCareTeams = async (req, res) => {
  try {
    const teams = await homeCareTeamModel.find({ available: true });
    res.json({ success: true, teams });
  } catch (error) {
    console.error("Error fetching public home care teams:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getHomeCareTeamById = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await homeCareTeamModel.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: "Home Care Team not found" });
    }
    res.json({ success: true, team });
  } catch (error) {
    console.error("Error fetching team by ID:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const bookHomeCareTeam = async (req, res) => {
  try {
    const { userId, teamId, slotDate, slotTime, address, phone, notes } = req.body;

    const userData = await userModel.findById(userId).select('-password');
    const teamData = await homeCareTeamModel.findById(teamId);

    if (!userData || !teamData) {
      return res.json({ success: false, message: "User or Home Care Team not found" });
    }

    if (!teamData.available) {
      return res.json({ success: false, message: "Home Care Team is currently unavailable" });
    }

    let slots_booked = teamData.slots_booked || {};
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "This slot is already booked for this Team" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    delete teamData.slots_booked;

    const appointmentData = {
      userId,
      docId: teamData.doctorId || teamId,
      slotDate,
      slotTime,
      userData: {
        ...userData._doc,
        address: address || userData.address,
        phone: phone || userData.phone,
        notes: notes || ""
      },
      docData: {
        _id: teamData._id,
        doctorId: teamData.doctorId || teamId,
        name: teamData.teamName,
        speciality: teamData.speciality,
        image: teamData.image,
        doctorName: teamData.doctorName,
        nurseName: teamData.nurseName,
        assistantName: teamData.assistantName,
        fees: teamData.fees,
        address: { line1: teamData.location, line2: "Home Healthcare Visit" },
        isHomeCareTeam: true
      },
      amount: teamData.fees,
      type: "HomeCareTeam",
      date: Date.now()
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    await homeCareTeamModel.findByIdAndUpdate(teamId, { slots_booked });

    res.json({ success: true, message: "Home Healthcare Team booked successfully!", appointmentId: newAppointment._id });
  } catch (error) {
    console.error("Book Home Care Team error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  userLogin,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppoint,
  paystackPayment,
  paystackVerifyPayment,
  forgotPassword,
  resetPassword,
  getAppointmentById,
  getAllCourses,
  getCourseById,
  purchaseCourse,
  verifyCoursePayment,
  getCourseProgress,
  updateCourseProgress,
  resetProgress,
  addRating,
  userEnrolledCourses,
  getStudentQuiz,
  submitStudentQuiz,
  getCertificate,
  verifyEmail,
  getHomeCareTeams,
  getHomeCareTeamById,
  bookHomeCareTeam
};

