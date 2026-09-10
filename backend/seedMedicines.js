import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import medicineModel from "./models/medicineModel.js";

dotenv.config();

const sampleMedicines = [
  {
    name: "Amoxicillin Trihydrate Caps 500mg",
    genericName: "Amoxicillin",
    brandName: "Amoxil",
    category: "Antibiotics",
    dosageForm: "Capsule",
    strength: "500mg",
    packSize: "Pack of 20 Capsules",
    price: 2400,
    costPrice: 1600,
    stock: 45,
    reorderLevel: 15,
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    requiresPrescription: true,
    nafdacRegNumber: "04-1234",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop",
    description: "Broad-spectrum penicillin antibiotic used to treat bacterial infections of the ear, nose, throat, urinary tract, and chest.",
    indications: "Respiratory tract infections, UTI, otitis media, skin infections.",
    dosageInstructions: "Take 1 capsule every 8 hours with water. Complete full course prescribed.",
    sideEffects: "Nausea, diarrhea, mild rash. Discontinue if severe allergic reaction occurs.",
    storageInstructions: "Store below 25°C away from heat and moisture.",
    manufacturer: "GSK / eDokta Certified Distributor"
  },
  {
    name: "Coartem (Artemether / Lumefantrine 20/120mg)",
    genericName: "Artemether + Lumefantrine",
    brandName: "Coartem",
    category: "Antimalarials",
    dosageForm: "Tablet",
    strength: "20mg / 120mg",
    packSize: "Blister of 24 Tablets",
    price: 3200,
    costPrice: 2200,
    stock: 8, // LOW STOCK (<= 10)
    reorderLevel: 12,
    expiryDate: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000),
    requiresPrescription: false, // OTC in Nigeria
    nafdacRegNumber: "04-5678",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=400&auto=format&fit=crop",
    description: "Gold standard Artemisinin-based Combination Therapy (ACT) for acute uncomplicated P. falciparum malaria.",
    indications: "Treatment of uncomplicated malaria in adults and children above 5kg.",
    dosageInstructions: "4 tablets initially, then 4 tablets after 8 hours, followed by 4 tablets twice daily for 2 days. Take with fatty food or milk.",
    sideEffects: "Mild headache, dizziness, loss of appetite.",
    storageInstructions: "Keep in a cool dry place below 30°C.",
    manufacturer: "Novartis Pharma"
  },
  {
    name: "Emzor Paracetamol 500mg Tablets",
    genericName: "Paracetamol",
    brandName: "Emzor Paracetamol",
    category: "Pain Relief & Analgesics",
    dosageForm: "Tablet",
    strength: "500mg",
    packSize: "Pack of 96 Tablets (Blister)",
    price: 950,
    costPrice: 650,
    stock: 120,
    reorderLevel: 25,
    expiryDate: new Date(Date.now() + 500 * 24 * 60 * 60 * 1000),
    requiresPrescription: false,
    nafdacRegNumber: "04-0012",
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?q=80&w=400&auto=format&fit=crop",
    description: "Fast-acting analgesic and antipyretic for relief of mild to moderate pain, headaches, muscle aches, and fever.",
    indications: "Fever, headaches, toothaches, general body pains.",
    dosageInstructions: "Adults: 2 tablets every 6 hours as needed. Do not exceed 8 tablets in 24 hours.",
    sideEffects: "Safe at recommended dosage. Overdose may cause severe liver damage.",
    storageInstructions: "Store at room temperature below 25°C.",
    manufacturer: "Emzor Pharmaceuticals"
  },
  {
    name: "Ibuprofen Softgels 400mg",
    genericName: "Ibuprofen",
    brandName: "Brufen",
    category: "Pain Relief & Analgesics",
    dosageForm: "Capsule",
    strength: "400mg",
    packSize: "Pack of 30 Softgels",
    price: 1800,
    costPrice: 1200,
    stock: 5, // LOW STOCK
    reorderLevel: 10,
    expiryDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000), // EXPIRING SOON (< 90 days)
    requiresPrescription: false,
    nafdacRegNumber: "04-2244",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop",
    description: "Non-steroidal anti-inflammatory drug (NSAID) for inflammatory pain, arthritis, dental pain, and dysmenorrhea.",
    indications: "Pain, swelling, fever, inflammatory aches.",
    dosageInstructions: "Take 1 softgel every 6 to 8 hours after meals. Do not take on empty stomach.",
    sideEffects: "Gastric upset, heartburn. Avoid if you have active peptic ulcer.",
    storageInstructions: "Store below 25°C protected from moisture.",
    manufacturer: "Abbott Laboratories"
  },
  {
    name: "Metformin Hydrochloride 500mg",
    genericName: "Metformin HCl",
    brandName: "Glucophage",
    category: "Diabetes & Endocrine",
    dosageForm: "Tablet",
    strength: "500mg",
    packSize: "Pack of 100 Tablets",
    price: 4500,
    costPrice: 3100,
    stock: 60,
    reorderLevel: 20,
    expiryDate: new Date(Date.now() + 400 * 24 * 60 * 60 * 1000),
    requiresPrescription: true,
    nafdacRegNumber: "04-9981",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=400&auto=format&fit=crop",
    description: "First-line oral anti-diabetic medication for management of Type 2 Diabetes Mellitus.",
    indications: "Type 2 diabetes, insulin resistance, polycystic ovary syndrome (PCOS).",
    dosageInstructions: "Take 1 tablet with or after food twice daily, as directed by physician.",
    sideEffects: "Gastrointestinal disturbances, nausea, metallic taste.",
    storageInstructions: "Store in a cool, dry place below 30°C.",
    manufacturer: "Merck Sante"
  },
  {
    name: "Amlodipine Besylate 5mg",
    genericName: "Amlodipine",
    brandName: "Norvasc",
    category: "Cardiovascular",
    dosageForm: "Tablet",
    strength: "5mg",
    packSize: "Pack of 30 Tablets",
    price: 3800,
    costPrice: 2600,
    stock: 35,
    reorderLevel: 10,
    expiryDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
    requiresPrescription: true,
    nafdacRegNumber: "04-7123",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400&auto=format&fit=crop",
    description: "Calcium channel blocker prescribed for hypertension (high blood pressure) and prevention of angina.",
    indications: "Essential hypertension, chronic stable angina.",
    dosageInstructions: "1 tablet once daily, preferably at the same time each morning.",
    sideEffects: "Peripheral ankle edema, flushing, headache.",
    storageInstructions: "Store below 25°C away from direct sunlight.",
    manufacturer: "Pfizer Nigeria"
  },
  {
    name: "Cough & Congestion Syrup 100ml",
    genericName: "Dextromethorphan + Guaifenesin",
    brandName: "Benylin 4-Flu",
    category: "Cough, Cold & Respiratory",
    dosageForm: "Syrup",
    strength: "100ml",
    packSize: "100ml Glass Bottle with Measure Cup",
    price: 2200,
    costPrice: 1500,
    stock: 4, // LOW STOCK (< 10)
    reorderLevel: 12,
    expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // EXPIRING CRITICAL (< 30 days)
    requiresPrescription: false,
    nafdacRegNumber: "04-3319",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop",
    description: "Effective multi-action cough relief formula for productive chesty cough, nasal congestion, and sore throat.",
    indications: "Chesty cough, cold symptoms, blocked sinuses.",
    dosageInstructions: "Adults: 10ml three times daily. Children 6-12 yrs: 5ml three times daily.",
    sideEffects: "Mild drowsiness, nausea.",
    storageInstructions: "Store below 25°C. Do not freeze.",
    manufacturer: "Johnson & Johnson"
  },
  {
    name: "Vitamin C 1000mg + Zinc Effervescent",
    genericName: "Ascorbic Acid + Zinc",
    brandName: "Redoxon Immune Boost",
    category: "Vitamins & Supplements",
    dosageForm: "Tablet",
    strength: "1000mg + 10mg",
    packSize: "Tube of 15 Effervescent Tablets",
    price: 2900,
    costPrice: 1900,
    stock: 80,
    reorderLevel: 20,
    expiryDate: new Date(Date.now() + 450 * 24 * 60 * 60 * 1000),
    requiresPrescription: false,
    nafdacRegNumber: "04-8842",
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?q=80&w=400&auto=format&fit=crop",
    description: "High potency Vitamin C fortified with Zinc to strengthen immune system response against colds and infections.",
    indications: "Daily immune booster, antioxidant support, wound healing support.",
    dosageInstructions: "Dissolve 1 tablet in 200ml of clean drinking water once daily.",
    sideEffects: "Well tolerated. High doses may cause mild stomach rumbling.",
    storageInstructions: "Keep tube tightly capped in a dry place.",
    manufacturer: "Bayer Healthcare"
  },
  {
    name: "Omeprazole Delayed-Release 20mg",
    genericName: "Omeprazole",
    brandName: "Losec",
    category: "Gastrointestinal",
    dosageForm: "Capsule",
    strength: "20mg",
    packSize: "Pack of 28 Capsules",
    price: 2700,
    costPrice: 1800,
    stock: 52,
    reorderLevel: 15,
    expiryDate: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000),
    requiresPrescription: false,
    nafdacRegNumber: "04-6632",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop",
    description: "Proton Pump Inhibitor (PPI) that reduces stomach acid production to treat acid reflux, heartburn, and peptic ulcers.",
    indications: "Gastroesophageal reflux disease (GERD), heartburn, gastric ulcers.",
    dosageInstructions: "Take 1 capsule daily in the morning 30 minutes before breakfast.",
    sideEffects: "Headache, constipation, abdominal pain.",
    storageInstructions: "Store in original moisture-proof blister below 25°C.",
    manufacturer: "AstraZeneca"
  },
  {
    name: "Ciprofloxacin 500mg Tablets",
    genericName: "Ciprofloxacin",
    brandName: "Ciprotab",
    category: "Antibiotics",
    dosageForm: "Tablet",
    strength: "500mg",
    packSize: "Pack of 14 Tablets",
    price: 3100,
    costPrice: 2000,
    stock: 22,
    reorderLevel: 12,
    expiryDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
    requiresPrescription: true,
    nafdacRegNumber: "04-1901",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=400&auto=format&fit=crop",
    description: "Fluoroquinolone antibiotic used to treat typhoid fever, severe urinary tract infections, and gastrointestinal infections.",
    indications: "Typhoid fever, complicated UTI, bone and joint infections.",
    dosageInstructions: "Take 1 tablet every 12 hours with plenty of fluids for 5 to 7 days.",
    sideEffects: "Nausea, dizziness. Avoid prolonged direct sun exposure.",
    storageInstructions: "Store below 30°C.",
    manufacturer: "Fidson Healthcare Plc"
  },
  {
    name: "Dettol Antiseptic Disinfectant Liquid",
    genericName: "Chloroxylenol (PCMX)",
    brandName: "Dettol",
    category: "First Aid & Antiseptics",
    dosageForm: "Liquid / Solution",
    strength: "250ml",
    packSize: "250ml Bottle",
    price: 2100,
    costPrice: 1400,
    stock: 65,
    reorderLevel: 15,
    expiryDate: new Date(Date.now() + 600 * 24 * 60 * 60 * 1000),
    requiresPrescription: false,
    nafdacRegNumber: "04-0004",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400&auto=format&fit=crop",
    description: "Trusted medical disinfectant and antiseptic for first aid wound cleansing, cuts, insect bites, and personal hygiene.",
    indications: "Antiseptic wound cleansing, surface disinfection, bathing dilution.",
    dosageInstructions: "Dilute 1 part Dettol with 20 parts clean water for wound cleansing. Do not swallow.",
    sideEffects: "Mild skin stinging if applied undiluted to broken skin.",
    storageInstructions: "Store away from heat and out of reach of young children.",
    manufacturer: "Reckitt Benckiser"
  },
  {
    name: "Hydrocortisone Cream 1%",
    genericName: "Hydrocortisone",
    brandName: "Cortizone",
    category: "Dermatology & Skin Care",
    dosageForm: "Ointment / Cream",
    strength: "1% w/w",
    packSize: "15g Tube",
    price: 1600,
    costPrice: 1000,
    stock: 30,
    reorderLevel: 10,
    expiryDate: new Date(Date.now() + 380 * 24 * 60 * 60 * 1000),
    requiresPrescription: false,
    nafdacRegNumber: "04-4112",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop",
    description: "Topical mild corticosteroid for rapid soothing of inflammatory skin redness, eczema, itching, and rashes.",
    indications: "Eczema, insect bite irritation, mild dermatitis, itching.",
    dosageInstructions: "Apply a thin film to the affected area 1 to 2 times daily. Gently rub in.",
    sideEffects: "Local burning or dryness if overused.",
    storageInstructions: "Store below 25°C. Keep cap sealed.",
    manufacturer: "Perrigo / eDokta Dispensary"
  }
];

const seedMedicines = async () => {
  try {
    console.log("Connecting to MongoDB for Medicine Seeding...");
    await connectDB();
    console.log("Database connected successfully.");

    console.log("Checking existing medicines count...");
    const existingCount = await medicineModel.countDocuments();
    console.log(`Found ${existingCount} medicines in database.`);

    if (existingCount === 0) {
      console.log("Inserting sample medicines catalog...");
      await medicineModel.insertMany(sampleMedicines);
      console.log(`Successfully seeded ${sampleMedicines.length} medicines!`);
    } else {
      console.log("Medicines already present. Upserting missing medicines...");
      for (const med of sampleMedicines) {
        await medicineModel.findOneAndUpdate(
          { name: med.name },
          { $setOnInsert: med },
          { upsert: true, new: true }
        );
      }
      console.log("Upsert completed successfully.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding medicines:", error);
    process.exit(1);
  }
};

seedMedicines();
