
import { json } from 'express'
import Course from '../models/courseModel.js'
import { v2 as cloudinary } from 'cloudinary'
import Purchase from '../models/purchaseModel.js'
import User from '../models/userModel.js'
import Admin from '../models/adminModel.js'
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import CourseProgress from '../models/courseProgressModel.js'
import Quiz from '../models/quizMode.js'
import axios from 'axios'
import streamifier from "streamifier";
import { v4 as uuidv4 } from "uuid";
import PDFDocument from "pdfkit"
import { buildCertificateContent, uploadCertificateToCloudinary } from '../utils/certificateHelper.js'

// Admin Register
export const adminRegister = async (req, res) => {
  try {
    const { name, email, phone, password, role, about } = req.body;

    const existing = await Admin.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email or Phone already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminData = {
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "admin",
    };

    if (role === "educator") {
      adminData.about = about;
    }

    const admin = await Admin.create(adminData);

    res.status(201).json({
      success: true,
      message: `${admin.role === "educator" ? "Educator" : "Admin"} registered successfully`,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        ...(admin.role === "educator" && { courses: admin.courses }),
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// API to Login as admin or educator
export const adminLogin = async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    if (!phone && !email) {
      return res.status(400).json({ success: false, message: "Phone or Email is required!" });
    }

    const admin = await Admin.findOne({ $or: [{ phone }, { email }] });

    if (!admin) {
      return res.status(400).json({ success: false, message: "User does not exist!" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password!" });
    }

    const atoken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      success: true,
      atoken: atoken,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role || "",
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getAdminData = async (req, res) => {
  try {
    const { adminId } = req.body
    const adminData = await Admin.findById(adminId).select('-password')
    res.status(200).json({ success: true, adminData })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

export const updateAdminProfile = async (req, res) => {
  try {
    const { adminId, name, phone, email, gender, about, role, address, dob, nin } = req.body
    const imageFile = req.file

    await Admin.findByIdAndUpdate(adminId, { name, phone, role, about, nin, email, address, gender, dob })

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
      const imageUrl = imageUpload.secure_url
      await Admin.findByIdAndUpdate(adminId, { image: imageUrl })
    }

    res.json({ success: true, message: 'Profile Updated Successfully' })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword, adminId } = req.body;

    if (newPassword !== confirmPassword) {
      return res.json({ success: false, message: "New password and confirm password do not match" });
    }

    const admin = await Admin.findById(adminId);
    if (!admin || !admin.password) {
      return res.json({ success: false, message: "User not found or password missing" });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Admin.updateOne({ _id: adminId }, { $set: { password: hashedPassword } });

    return res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const userEnrolledCourses = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await User.findById(userId).populate('enrolledCourses');
    res.json({ success: true, enrolledCourses: userData.enrolledCourses })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export const addCourse = async (req, res) => {
  try {
    const { courseData, adminId } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.json({ success: false, message: " Course Thumbnail is Missing!" })
    }

    const parsedCourseData = JSON.parse(courseData);
    console.log("Adding Course - Parsed Data:", parsedCourseData);
    parsedCourseData.educator = adminId;

    delete parsedCourseData.purchasePrice;
    delete parsedCourseData.purchasePricePhysical;
    delete parsedCourseData.purchasePriceVirtual;

    const newCourse = await Course.create(parsedCourseData);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path)
    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();
    res.json({ success: true, message: "Course Added Successfully!" })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export const updateCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;

    if (!courseData) {
      return res.json({ success: false, message: "Course data is required" });
    }

    const parsedCourseData = JSON.parse(courseData);
    console.log("Updating Course - Parsed Data:", parsedCourseData);

    if (!parsedCourseData._id) {
      return res.json({ success: false, message: "Course ID is missing" });
    }

    const existingCourse = await Course.findById(parsedCourseData._id);
    if (!existingCourse) {
      return res.json({ success: false, message: "Course not found" });
    }

    existingCourse.courseTitle = parsedCourseData.courseTitle || existingCourse.courseTitle;
    existingCourse.courseDescription = parsedCourseData.courseDescription || existingCourse.courseDescription;
    existingCourse.courseMode = parsedCourseData.courseMode ?? existingCourse.courseMode;
    existingCourse.coursePrice = parsedCourseData.coursePrice ?? existingCourse.coursePrice;
    existingCourse.coursePricePhysical = parsedCourseData.coursePricePhysical ?? existingCourse.coursePricePhysical;
    existingCourse.coursePriceVirtual = parsedCourseData.coursePriceVirtual ?? existingCourse.coursePriceVirtual;
    existingCourse.courseAddress = parsedCourseData.courseAddress ?? existingCourse.courseAddress;
    existingCourse.meetingUrl = parsedCourseData.meetingUrl ?? existingCourse.meetingUrl;
    existingCourse.classSchedule = parsedCourseData.classSchedule ?? existingCourse.classSchedule;
    existingCourse.discount = parsedCourseData.discount ?? existingCourse.discount;
    existingCourse.courseContent = parsedCourseData.courseContent || existingCourse.courseContent;
    existingCourse.applicationDeadline = parsedCourseData.applicationDeadline || null;
    existingCourse.courseStartDate = parsedCourseData.courseStartDate || null;
    existingCourse.courseEndDate = parsedCourseData.courseEndDate || null;
    existingCourse.isActive = parsedCourseData.isActive ?? existingCourse.isActive;

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path);
      existingCourse.courseThumbnail = imageUpload.secure_url;
    }

    await existingCourse.save();
    res.json({ success: true, message: "Course updated successfully!" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const educatorCourses = async (req, res) => {
  try {
    const adminId = req.body.adminId;
    const courses = await Course.find({ educator: adminId });
    const courseIds = courses.map(c => c._id);
    const purchases = await Purchase.find({ courseId: { $in: courseIds } });

    const courseStats = {};
    purchases.forEach(purchase => {
      const price = purchase.amount || 0;
      const courseId = purchase.courseId.toString();
      if (!courseStats[courseId]) {
        courseStats[courseId] = { earnings: 0, price: price };
      }
      courseStats[courseId].earnings += price;
    });

    res.json({ success: true, educatorCourses: courses, stats: courseStats });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { isPublished } = req.body;

    const course = await Course.findByIdAndUpdate(courseId, { isPublished }, { new: true });

    if (!course) {
      return res.json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleActive = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { isActive } = req.body;

    const course = await Course.findByIdAndUpdate(courseId, { isActive }, { new: true });

    if (!course) {
      return res.json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const educatorDashboardData = async (req, res) => {
  try {
    const adminId = req.body.adminId;
    const courses = await Course.find({ educator: adminId });
    const totalCourses = courses.length;
    const courseIds = courses.map(course => course._id);

    const purchases = await Purchase.find({ courseId: { $in: courseIds }, status: 'Completed' });
    const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    const enrolledStudentsData = [];
    let totalStudents = 0;
    for (const course of courses) {
      const students = await User.find({ _id: { $in: course.enrolledStudents } }, 'name image');
      totalStudents += students.length;
      students.forEach(student => {
        enrolledStudentsData.push({ courseTitle: course.courseTitle, student });
      });
    }

    res.json({
      success: true,
      dashboardData: { totalCourses, totalEarnings, totalStudents, enrolledStudentsData },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const enrolledStudentsData = async (req, res) => {
  try {
    const adminId = req.body.adminId;
    const courses = await Course.find({ educator: adminId })
    const courseIds = courses.map(course => course._id)

    const purchases = await Purchase.find({ courseId: { $in: courseIds }, status: 'Completed' })
      .populate('userId', 'name image')
      .populate('courseId', 'courseTitle courseContent');

    const enrolledStudents = await Promise.all(
      purchases.map(async (purchase) => {
        const progressDoc = await CourseProgress.findOne({
          userId: purchase.userId._id,
          courseId: purchase.courseId._id,
        });

        const allLectureIds = purchase.courseId?.courseContent?.flatMap(ch => ch.chapterContent?.map(l => l.lectureId) || []) || [];
        const totalCount = allLectureIds.length || 1;
        const validCompleted = progressDoc?.lectureCompleted?.filter(id => allLectureIds.includes(id)) || [];
        const completedCount = validCompleted.length;
        const progressPercentage = progressDoc?.completed ? 100 : Math.min(100, Math.round((completedCount / totalCount) * 100));

        return {
          student: purchase.userId,
          progress: progressDoc?.completed ? "Completed" : "On Going",
          courseTitle: purchase.courseId.courseTitle,
          courseId: purchase.courseId._id,
          purchaseDate: purchase.createdAt,
          quizTaken: progressDoc?.quizTaken || false,
          certificateUrl: progressDoc?.certificateUrl || null,
          progressPercentage,
          completedCount,
          totalLectures: allLectureIds.length
        };
      })
    );

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export const saveQuiz = async (req, res) => {
  try {
    const { courseId, questions } = req.body;
    let quiz = await Quiz.findOne({ courseId });

    if (quiz) {
      quiz.questions = questions;
      await quiz.save();
    } else {
      quiz = new Quiz({ courseId, questions });
      await quiz.save();
    }

    res.json({ success: true, message: "Quiz saved successfully", quiz });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Fetch quiz questions for a course (for Educator)
export const getQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const quiz = await Quiz.findOne({ courseId });
    if (!quiz) {
      return res.json({ success: true, message: "No quiz found.", questions: [] });
    }
    res.json({ success: true, questions: quiz.questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch all quizzes created by the logged-in educator
export const getQuizList = async (req, res) => {
  try {
    const adminId = req.body.adminId; // set by authAdmin middleware
    const courses = await Course.find({ educator: adminId });
    const courseIds = courses.map(c => c._id);
    const quizzes = await Quiz.find({ courseId: { $in: courseIds } }).populate('courseId', 'courseTitle');
    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a quiz
export const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    await Quiz.findByIdAndDelete(quizId);
    res.json({ success: true, message: "Quiz deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const allCourses = async (req, res) => {
  try {
    const course = await Course.find();
    res.json({ success: true, course });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const adminDashboardData = async (req, res) => {
  try {
    const courses = await Course.find()
    const totalCourses = courses.length;
    const totalStudents = await User.countDocuments({});

    const courseIds = courses.map(course => course._id)
    const purchases = await Purchase.find({ courseId: { $in: courseIds }, status: 'Completed' });
    const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find({ _id: { $in: course.enrolledStudents } }, 'name image');
      students.forEach(student => {
        enrolledStudentsData.push({ courseTitle: course.courseTitle, student });
      });
    }
    res.json({ success: true, dashboardData: { totalCourses, totalEarnings, enrolledStudentsData, totalStudents } })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const students = await User.find().select('-password').lean();
    const admins = await Admin.find().select('-password').lean();
    const allUsers = [
      ...students.map(user => ({ ...user, userType: 'student' })),
      ...admins.map(user => ({ ...user, userType: user.role }))
    ];
    allUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      users: allUsers,
      totalCount: allUsers.length,
      studentCount: students.length,
      educatorCount: admins.filter(a => a.role === 'educator').length,
      adminCount: admins.filter(a => a.role === 'admin').length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllEducators = async (req, res) => {
  try {
    const educators = await Admin.find({ role: 'educator' }).select('-password');
    const educatorsWithStats = await Promise.all(
      educators.map(async (educator) => {
        const courses = await Course.find({ educator: educator._id });
        const enrolledStudents = new Set();
        courses.forEach(course => {
          course.enrolledStudents.forEach(studentId => { enrolledStudents.add(studentId.toString()); });
        });
        return { ...educator.toObject(), courseCount: courses.length, studentCount: enrolledStudents.size };
      })
    );
    res.json({ success: true, educators: educatorsWithStats, totalCount: educatorsWithStats.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { userType, ...updateData } = req.body;
    delete updateData.password;
    delete updateData._id;
    delete updateData.userType;

    let updatedUser;
    if (userType === 'student') {
      delete updateData.role;
      updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    } else {
      updatedUser = await Admin.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    }

    if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { userType } = req.body;
    let deletedUser;

    if (userType === 'student') {
      const student = await User.findById(userId);
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
      if (student.enrolledCourses?.length > 0) return res.status(400).json({ success: false, message: 'Cannot delete student with active enrollments' });
      deletedUser = await User.findByIdAndDelete(userId);
    } else {
      const educator = await Admin.findById(userId);
      if (!educator) return res.status(404).json({ success: false, message: 'Educator/Admin not found' });
      const courses = await Course.find({ educator: userId });
      if (courses.length > 0) return res.status(400).json({ success: false, message: 'Cannot delete educator with active courses' });
      deletedUser = await Admin.findByIdAndDelete(userId);
    }

    if (!deletedUser) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { userType, isActive } = req.body;
    let updatedUser;
    if (userType === 'student') {
      updatedUser = await User.findByIdAndUpdate(userId, { isActive }, { new: true }).select('-password');
    } else {
      updatedUser = await Admin.findByIdAndUpdate(userId, { isActive }, { new: true }).select('-password');
    }

    if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: `User ${isActive ? 'activated' : 'deactivated'} successfully`, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.enrolledStudents?.length > 0) return res.status(400).json({ success: false, message: 'Cannot delete course with enrolled students' });

    await Quiz.findOneAndDelete({ courseId });
    await CourseProgress.deleteMany({ courseId });
    await Course.findByIdAndDelete(courseId);

    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFilteredEnrolledStudents = async (req, res) => {
  try {
    const { adminId } = req.body;
    const { courseId, startDate, endDate, searchTerm } = req.query;

    let courseQuery = {};
    const admin = await Admin.findById(adminId);
    if (admin && admin.role === 'educator') courseQuery.educator = adminId;
    if (courseId) courseQuery._id = courseId;

    const courses = await Course.find(courseQuery);
    const courseIds = courses.map(course => course._id);

    let purchaseQuery = { courseId: { $in: courseIds }, status: 'Completed' };
    if (startDate || endDate) {
      purchaseQuery.createdAt = {};
      if (startDate) purchaseQuery.createdAt.$gte = new Date(startDate);
      if (endDate) purchaseQuery.createdAt.$lte = new Date(endDate);
    }

    const purchases = await Purchase.find(purchaseQuery)
      .populate('userId', 'name image email')
      .populate('courseId', 'courseTitle courseContent');

    // Fetch all quizzes for the courses in the purchases
    const purchaseCourseIds = purchases.map(p => p.courseId?._id?.toString()).filter(id => id);
    const quizzes = await Quiz.find({ courseId: { $in: purchaseCourseIds } });
    const quizCourseIds = quizzes.map(q => q.courseId.toString());

    console.log("Purchase Course IDs:", purchaseCourseIds);
    console.log("Quizzes found:", quizzes.length);
    console.log("Quiz Course IDs:", quizCourseIds);

    let enrolledStudents = await Promise.all(
      purchases.map(async (purchase) => {
        const progressDoc = await CourseProgress.findOne({
          userId: purchase.userId._id,
          courseId: purchase.courseId._id,
        });

        const allLectureIds = purchase.courseId?.courseContent?.flatMap(ch => ch.chapterContent?.map(l => l.lectureId) || []) || [];
        const totalCount = allLectureIds.length || 1;
        const validCompleted = progressDoc?.lectureCompleted?.filter(id => allLectureIds.includes(id)) || [];
        const completedCount = validCompleted.length;
        const progressPercentage = progressDoc?.completed ? 100 : Math.min(100, Math.round((completedCount / totalCount) * 100));
        const progress = progressDoc?.completed ? "Completed" : "On Going";

        const hasQuiz = purchase.courseId && quizCourseIds.includes(purchase.courseId._id.toString());
        // console.log(`Course ${purchase.courseId.courseTitle} (${purchase.courseId._id}) has quiz: ${hasQuiz}`);

        return {
          student: purchase.userId,
          progress,
          progressPercentage,
          completedCount,
          totalLectures: allLectureIds.length,
          courseTitle: purchase.courseId.courseTitle,
          courseId: purchase.courseId._id,
          purchaseDate: purchase.createdAt,
          amount: purchase.amount,
          completedLectures: validCompleted,
          quizPassed: progressDoc?.quizPassed || false,
          quizTaken: progressDoc?.quizTaken || false,
          quizScore: progressDoc?.quizScore || 0,
          certificateUrl: progressDoc?.certificateUrl || null,
          hasQuiz
        };
      })
    );

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      enrolledStudents = enrolledStudents.filter(enrollment =>
        enrollment.student.name.toLowerCase().includes(searchLower) ||
        enrollment.courseTitle.toLowerCase().includes(searchLower) ||
        enrollment.student.email.toLowerCase().includes(searchLower)
      );
    }

    res.json({ success: true, enrolledStudents, totalCount: enrolledStudents.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Progress & Certification Logic ---


const createCertificateLogic = async (userId, courseId) => {
  // 1. Validate User
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // 2. Validate Course Progress
  const progress = await CourseProgress.findOne({ userId, courseId }).populate("courseId");
  if (!progress) throw new Error("Course progress not found");
  if (!progress.completed) {
    throw new Error("Course has not been marked as completed for this student");
  }

  // 3. Return existing certificate if available
  if (progress.certificateUrl) {
    return { certificateUrl: progress.certificateUrl };
  }

  // 4. Prepare Certificate Data
  const course = progress.courseId;
  const certificateId = uuidv4().slice(0, 8).toUpperCase();
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // 5. Initialize PDF Document
  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margins: { top: 0, left: 0, right: 0, bottom: 0 },
  });

  const buffers = [];
  let isPromiseDone = false;

  // 6. Return Promise for PDF Generation and Upload
  return new Promise(async (resolve, reject) => {
    // --- PDF Event Handlers ---
    doc.on("data", (data) => buffers.push(data));
    doc.on("end", async () => {
      try {
        const pdfBuffer = Buffer.concat(buffers);
        await uploadCertificateToCloudinary(pdfBuffer, progress, certificateId);
        resolve({ certificateUrl: progress.certificateUrl });
      } catch (err) {
        if (!isPromiseDone) {
          isPromiseDone = true;
          reject(err);
        }
      }
    });


    // --- Build PDF Content ---
    try {
      await buildCertificateContent(doc, user, course, certificateId, today);
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};




export const updateStudentProgress = async (req, res) => {
  try {
    const { userId, courseId, lectureId, chapterId, markAsCompleted, isCourseCompleted } = req.body;

    let progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      progress = new CourseProgress({ userId, courseId, lectureCompleted: [] });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (chapterId) {
      const chapter = course.courseContent.find(c => c.chapterId === chapterId);
      if (chapter) {
        chapter.chapterContent.forEach(lecture => {
          if (markAsCompleted) {
            if (!progress.lectureCompleted.includes(lecture.lectureId)) progress.lectureCompleted.push(lecture.lectureId);
          } else {
            progress.lectureCompleted = progress.lectureCompleted.filter(id => id !== lecture.lectureId);
          }
        });
      }
    }

    if (lectureId) {
      if (markAsCompleted) {
        if (!progress.lectureCompleted.includes(lectureId)) progress.lectureCompleted.push(lectureId);
      } else {
        progress.lectureCompleted = progress.lectureCompleted.filter(id => id !== lectureId);
      }
    }

    if (isCourseCompleted) {
      const allLectureIds = course.courseContent.flatMap(chapter => chapter.chapterContent.map(l => l.lectureId));
      progress.lectureCompleted = [...new Set([...progress.lectureCompleted, ...allLectureIds])];
      progress.completed = true;
      progress.quizPassed = true;
      progress.quizTaken = true;
      progress.quizScore = 100;
    } else if (isCourseCompleted === false) {
      progress.completed = false;
      progress.quizPassed = false;
      const totalLectures = course.courseContent.reduce((sum, ch) => sum + (ch.chapterContent?.length || 0), 0) || 1;
      // Removed: progress.completed = progress.lectureCompleted.length >= totalLectures;
      // We only allow manual completion or quiz-triggered completion now.
      console.log(`[DEBUG] User: ${userId}, Course: ${courseId}, Completed: ${progress.lectureCompleted.length}/${totalLectures}, Status: ${progress.completed}`);
    }

    await progress.save();

    let certificateUrl = progress.certificateUrl || null;
    if (progress.completed && !certificateUrl) {
      try {
        const result = await createCertificateLogic(userId, courseId);
        certificateUrl = result.certificateUrl;
      } catch (certError) {
        console.error("Auto-certificate generation failed:", certError);
      }
    }

    const allLectureIds = course.courseContent?.flatMap(ch => ch.chapterContent?.map(l => l.lectureId) || []) || [];
    const totalLectures = allLectureIds.length || 1;
    const completedCount = progress.lectureCompleted.filter(id => allLectureIds.includes(id)).length;
    const progressPercentage = progress.completed ? 100 : Math.min(100, Math.round((completedCount / totalLectures) * 100));

    res.json({
      success: true,
      message: "Progress updated successfully",
      progress,
      certificateUrl,
      progressPercentage,
      completedCount,
      totalLectures: allLectureIds.length
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const resetStudentQuiz = async (req, res) => {
  try {
    const { courseId, userId } = req.body;
    await CourseProgress.findOneAndUpdate(
      { userId, courseId },
      { completed: false, lectureCompleted: [], quizTaken: false, quizScore: 0, quizPassed: false, quizAnswers: [], certificateUrl: null }
    );
    res.json({ success: true, message: "Student progress reset successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const generateStudentCertificate = async (req, res) => {
  try {
    const { courseId, userId } = req.body;
    const result = await createCertificateLogic(userId, courseId);
    return res.json({ success: true, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};