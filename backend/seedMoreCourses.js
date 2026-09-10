import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import Admin from "./models/adminModel.js";
import Course from "./models/courseModel.js";

dotenv.config();

const coursesData = [
  {
    courseTitle: "Emergency Medicine & Advanced Cardiac Life Support (ACLS)",
    courseDescription: "Comprehensive protocol training on emergency airway management, cardiac arrest protocols, ECG rhythm interpretation, and acute trauma resuscitation.",
    courseThumbnail: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600&auto=format&fit=crop",
    coursePrice: 28000,
    courseMode: "Both",
    coursePricePhysical: 35000,
    coursePriceVirtual: 22000,
    discount: 3000,
    classSchedule: "Saturdays 9:00 AM - 1:00 PM",
    courseAddress: "KIRCT Clinical Simulation Lab, Kano",
    courseRatings: [{ rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 5 }],
  },
  {
    courseTitle: "Clinical Pharmacology, Pharmacokinetics & Safe Prescribing",
    courseDescription: "Master drug mechanisms, therapeutic index monitoring, antimicrobial stewardship, adverse reaction mitigation, and clinical calculations.",
    courseThumbnail: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=600&auto=format&fit=crop",
    coursePrice: 18000,
    courseMode: "Virtual",
    coursePricePhysical: 0,
    coursePriceVirtual: 18000,
    discount: 2500,
    classSchedule: "Tuesdays & Thursdays 6:00 PM (Online)",
    meetingUrl: "https://meet.google.com/edokta-pharm",
    courseRatings: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
  },
  {
    courseTitle: "Maternal & Neonatal Healthcare in Clinical Practice",
    courseDescription: "Advanced obstetric skills, labor monitoring, prenatal risk screening, emergency neonatal resuscitation, and postpartum complications management.",
    courseThumbnail: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop",
    coursePrice: 24000,
    courseMode: "Both",
    coursePricePhysical: 30000,
    coursePriceVirtual: 19000,
    discount: 4000,
    classSchedule: "Fridays & Saturdays 10:00 AM",
    courseAddress: "Maternal Health Training Center, Kano",
    courseRatings: [{ rating: 5 }, { rating: 5 }, { rating: 5 }, { rating: 4 }],
  },
  {
    courseTitle: "Diagnostic Ultrasound & Medical Imaging Interpretation",
    courseDescription: "Hands-on ultrasound probe manipulation, abdominal scan protocols, Doppler assessment, and rapid identification of emergency pathology.",
    courseThumbnail: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop",
    coursePrice: 32000,
    courseMode: "Physical",
    coursePricePhysical: 32000,
    coursePriceVirtual: 0,
    discount: 5000,
    classSchedule: "Intensive 3-Day Weekend Workshop",
    courseAddress: "Advanced Radiology Suite, Kano",
    courseRatings: [{ rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 5 }, { rating: 5 }],
  },
  {
    courseTitle: "Digital Health, Telemedicine & AI in Clinical Workflow",
    courseDescription: "Practical guide to electronic medical records (EMR/EHR), remote patient monitoring, telemedicine legal compliance, and AI diagnostic aids.",
    courseThumbnail: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=600&auto=format&fit=crop",
    coursePrice: 15000,
    courseMode: "Virtual",
    coursePricePhysical: 0,
    coursePriceVirtual: 15000,
    discount: 2000,
    classSchedule: "Self-Paced with Weekly Live Q&A",
    meetingUrl: "https://meet.google.com/edokta-telehealth",
    courseRatings: [{ rating: 5 }, { rating: 4 }, { rating: 4 }, { rating: 5 }],
  },
];

const seedMoreCourses = async () => {
  try {
    console.log("Connecting to Database...");
    await connectDB();

    let educator = await Admin.findOne({ role: "educator" });
    if (!educator) {
      educator = await Admin.findOne();
    }

    if (!educator) {
      console.log("No admin or educator found in DB. Please run seedd.js first.");
      process.exit(1);
    }

    console.log(`Using Educator: ${educator.name} (${educator._id})`);

    for (const c of coursesData) {
      const existing = await Course.findOne({ courseTitle: c.courseTitle });
      if (!existing) {
        await Course.create({
          ...c,
          educator: educator._id,
          isPublished: true,
          isActive: true,
        });
        console.log(`+ Created course: "${c.courseTitle}"`);
      } else {
        console.log(`= Course already exists: "${c.courseTitle}"`);
      }
    }

    console.log("All additional courses processed successfully!");
    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding more courses:", err);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedMoreCourses();
