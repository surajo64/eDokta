import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import User from "./models/userModel.js";
import Admin from "./models/adminModel.js";
import Doctor from "./models/doctorsModel.js";
import Course from "./models/courseModel.js";

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    console.log("Connecting to Database...");
    await connectDB();
    console.log("Database Connected successfully.");

    // Hashing standard password for all seeded users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    console.log("Cleaning existing seeded data...");
    
    // Clear previously seeded entries by email/phone to ensure re-runnability
    await Admin.deleteMany({ email: { $in: ["admin@edokta.com", "educator@edokta.com"] } });
    await Doctor.deleteMany({ email: "doctor@edokta.com" });
    await User.deleteMany({ email: { $in: ["patient@edokta.com", "student@edokta.com"] } });
    await Course.deleteMany({ courseTitle: "Introduction to Clinical Anatomy" });

    console.log("Seeding Admin...");
    const admin = await Admin.create({
      name: "System Admin",
      email: "admin@edokta.com",
      phone: "08012345678",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });
    console.log(`Admin created: ${admin.email}`);

    console.log("Seeding Educator...");
    const educator = await Admin.create({
      name: "Dr. Jane Smith",
      email: "educator@edokta.com",
      phone: "08087654321",
      password: hashedPassword,
      role: "educator",
      about: "Experienced medical educator and clinical training coordinator.",
      isActive: true,
    });
    console.log(`Educator created: ${educator.email}`);

    console.log("Seeding Doctor...");
    const doctor = await Doctor.create({
      name: "Dr. John Doe",
      email: "doctor@edokta.com",
      password: hashedPassword,
      phone: "08022223333",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=250&auto=format&fit=crop",
      speciality: "General Physician",
      degree: "MBBS, MD",
      experience: "10 Years",
      about: "Dedicated general physician with a decade of clinical experience.",
      available: true,
      fees: 5000,
      doctorFee: 1000,
      address: "123 Medical Center Way",
      state: "Lagos",
      gender: "Male",
      date: new Date(),
      slots_booked: {},
    });
    console.log(`Doctor created: ${doctor.email}`);

    console.log("Seeding Patient...");
    const patient = await User.create({
      name: "Alice Patient",
      email: "patient@edokta.com",
      phone: "08033334444",
      nin: "12345678901",
      password: hashedPassword,
      isAccepted: true,
      dob: new Date("1995-05-15"),
      gender: "Female",
      address: { line1: "45 Patient St", city: "Ikeja" },
    });
    console.log(`Patient created: ${patient.phone}`);

    console.log("Seeding Student...");
    const student = await User.create({
      name: "Bob Student",
      email: "student@edokta.com",
      phone: "08055556666",
      nin: "98765432101",
      password: hashedPassword,
      isAccepted: true,
      dob: new Date("2000-10-10"),
      gender: "Male",
      address: { line1: "12 Student Ave", city: "Surulere" },
    });
    console.log(`Student created: ${student.phone}`);

    console.log("Seeding Course...");
    const course = await Course.create({
      courseTitle: "Introduction to Clinical Anatomy",
      courseDescription: "This course covers the fundamentals of human anatomy, designed for medical students and training professionals.",
      courseThumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop",
      coursePrice: 15000,
      courseMode: "Both",
      coursePricePhysical: 20000,
      coursePriceVirtual: 12000,
      discount: 2000,
      educator: educator._id,
      enrolledStudents: [student._id], // enroll our seeded student in the course
    });
    console.log(`Course created: "${course.courseTitle}" (Educator: ${educator.name})`);

    console.log("Database seeded successfully!");
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
