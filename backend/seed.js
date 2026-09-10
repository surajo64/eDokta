import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import User from "./models/userModel.js";
import Admin from "./models/adminModel.js";
import Doctor from "./models/doctorsModel.js";
import Course from "./models/courseModel.js";

import HomeCareTeam from "./models/homeCareTeamModel.js";

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
    await HomeCareTeam.deleteMany({ teamName: { $in: ["General Home Care Team Alpha", "Cardiology Home Care Unit 1", "Maternal & Child Home Care Team"] } });

    console.log("Seeding Home Healthcare Teams...");
    await HomeCareTeam.create([
      {
        teamName: "General Home Care Team Alpha",
        speciality: "General Service",
        doctorName: "Dr. Abubakar Shehu",
        doctorTitle: "Consultant Physician (Lead)",
        nurseName: "Nurse Grace Danjuma",
        nurseTitle: "Senior Registered Nurse",
        assistantName: "Usman Bello",
        assistantTitle: "Clinical Assistant & Phlebotomist",
        fees: 45000,
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop",
        about: "Complete general medical home evaluation, vitals screening, IV fluid administration, and basic lab sample collection at your doorstep.",
        location: "Abuja Metropolitan & Environs",
        servicesIncluded: ["Full Physical Examination", "Blood Pressure & Vitals Audit", "Blood Sample Collection", "IV Therapy & Medication"],
        available: true
      },
      {
        teamName: "Cardiology Home Care Unit 1",
        speciality: "Cardiology Service",
        doctorName: "Dr. Farida Aliyu",
        doctorTitle: "Consultant Cardiologist (Lead)",
        nurseName: "Nurse Samuel Kalu",
        nurseTitle: "ICU / Cardiac Care Nurse",
        assistantName: "Fatima Umar",
        assistantTitle: "ECG Technician & Caregiver",
        fees: 65000,
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop",
        about: "Specialized cardiac home monitoring team equipped with portable ECG/EKG machines, blood pressure telemetry, and heart failure care management.",
        location: "Abuja, Ikeja & Environs",
        servicesIncluded: ["Portable 12-Lead ECG/EKG", "Cardiovascular Vitals Monitoring", "Cardiac Medication Audit", "Doctor & Nurse Joint Assessment"],
        available: true
      },
      {
        teamName: "Maternal & Child Home Care Team",
        speciality: "Pediatric & Maternal Care",
        doctorName: "Dr. Zainab Ahmed",
        doctorTitle: "Consultant Obstetrician & Pediatrician",
        nurseName: "Nurse Maryam Mustapha",
        nurseTitle: "Certified Midwife & Newborn Specialist",
        assistantName: "Aminu Sani",
        assistantTitle: "Pediatric Assistant",
        fees: 55000,
        image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop",
        about: "Comprehensive post-natal mother and newborn care visits, infant immunization guidance, growth tracking, and maternal recovery assessments.",
        location: "Abuja & Surrounding Districts",
        servicesIncluded: ["Newborn Vital Screening", "Post-Natal Maternal Checkup", "Infant Jaundice & Growth Check", "Lactation & Nutrition Guidance"],
        available: true
      }
    ]);
    console.log("Home Healthcare Teams seeded successfully.");

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
