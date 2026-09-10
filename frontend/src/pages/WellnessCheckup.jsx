import React, { useState } from 'react';
import { 
  Activity, 
  HeartPulse, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Home, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  ArrowRight, 
  ChevronDown, 
  Search, 
  Check, 
  X, 
  Microscope
} from 'lucide-react';
import { toast } from 'react-toastify';

const packagesData = [
  {
    id: 'pkg-1',
    category: 'Executive',
    title: 'Executive Full Body Audit',
    subtitle: 'Comprehensive 360° health audit tailored for working professionals and annual wellness checkups.',
    price: 75000,
    badge: 'Most Popular',
    testsCount: '48 Diagnostic Tests',
    turnaround: '24 Hours',
    sampleType: 'Blood & Urine Sample + ECG',
    included: [
      'Comprehensive Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)',
      'Liver Function Panel (ALT, AST, Bilirubin, Albumin)',
      'Kidney Audit (Urea, Creatinine, Electrolytes, Uric Acid)',
      'Full Blood Count (FBC & ESR)',
      'HbA1c 3-Month Diabetes Screening',
      'Thyroid Profile (TSH)',
      'Full Urine Analysis & Sedimentation',
      'Resting 12-Lead ECG Screening'
    ],
    idealFor: 'Adults aged 30+ seeking complete early detection and annual health status check.'
  },
  {
    id: 'pkg-2',
    category: 'Essential',
    title: 'Essential Health Audit',
    subtitle: 'Routine preventive health panel covering key vital organs and metabolic indicators.',
    price: 28000,
    badge: 'Best Value',
    testsCount: '22 Diagnostic Tests',
    turnaround: '12 Hours',
    sampleType: 'Blood & Urine Sample',
    included: [
      'Fasting Blood Sugar & Glucose Test',
      'Basic Lipid Profile (Total Cholesterol & Triglycerides)',
      'Kidney Vitals (Creatinine & Urea)',
      'Liver Screening (ALT & AST)',
      'Full Blood Count (FBC)',
      'Routine Urinalysis'
    ],
    idealFor: 'Routine 6-month wellness check for adults of all ages.'
  },
  {
    id: 'pkg-3',
    category: 'Cardiac',
    title: 'Cardiovascular Risk Audit',
    subtitle: 'Advanced screening designed for hypertension management and heart disease prevention.',
    price: 55000,
    badge: 'Cardiac Focus',
    testsCount: '18 Specialized Tests',
    turnaround: '24 Hours',
    sampleType: 'Blood Sample + ECG Vitals',
    included: [
      'Extended Lipid Sub-fractions (ApoB, ApoA1, Lipoprotein a)',
      'High-Sensitivity C-Reactive Protein (hs-CRP)',
      'Resting 12-Lead ECG Telemetry',
      'Homocysteine Heart Risk Indicator',
      'Kidney Function & Electrolyte Balance',
      'Fasting Blood Glucose & Insulin Resistance'
    ],
    idealFor: 'Individuals with high BP, cholesterol history, or family cardiac risk.'
  },
  {
    id: 'pkg-4',
    category: 'Women',
    title: 'Comprehensive Women’s Wellness',
    subtitle: 'Specialized health screening covering female hormonal balance, bone density, and vital organ health.',
    price: 62000,
    badge: 'Women’s Choice',
    testsCount: '35 Diagnostic Tests',
    turnaround: '24 Hours',
    sampleType: 'Blood & Urine Sample',
    included: [
      'Full Thyroid Profile (T3, T4, TSH)',
      'Iron & Serum Ferritin Anemia Audit',
      'Calcium, Phosphorus & Vitamin D3',
      'Comprehensive Lipid & Liver Panel',
      'Kidney Audit & Uric Acid',
      'Full Blood Count (FBC)',
      'Hormonal Panel (Estrogen & Progesterone Guidance)'
    ],
    idealFor: 'Women seeking proactive health monitoring, reproductive wellness, or fatigue management.'
  },
  {
    id: 'pkg-5',
    category: 'Senior',
    title: 'Senior Citizen Care Package',
    subtitle: 'Tailored health assessment for elderly family members, prioritizing mobility, heart, and kidney vitality.',
    price: 68000,
    badge: 'Elderly Care',
    testsCount: '40 Diagnostic Tests',
    turnaround: '24 Hours',
    sampleType: 'Home Sample Pickup Included',
    included: [
      'Arthritis & Rheumatoid Factor Screening',
      'Prostate Specific Antigen (PSA) / Mammogram Vitals',
      'Cardiac & Hypertension Telemetry Audit',
      'Kidney & Liver Function Panel',
      'Blood Sugar & HbA1c Audit',
      'Bone Health & Mineral Audit (Calcium, Vitamin D)',
      'Full Urine & Stool Micro-analysis'
    ],
    idealFor: 'Seniors aged 60+ requiring comfortable home-based sample collection.'
  },
  {
    id: 'pkg-6',
    category: 'Diabetes',
    title: 'Diabetes & Metabolic Audit',
    subtitle: 'Targeted screening to assess glucose control, organ health, and metabolic risk indicators.',
    price: 35000,
    badge: 'Metabolic Focus',
    testsCount: '16 Targeted Tests',
    turnaround: '12 Hours',
    sampleType: 'Blood & Urine Sample',
    included: [
      'HbA1c (3-Month Glycated Hemoglobin Audit)',
      'Fasting Blood Glucose Test',
      'Microalbuminuria Urine Kidney Test',
      'Comprehensive Lipid Profile',
      'Estimated Glomerular Filtration Rate (eGFR)',
      'Serum Electrolytes & Creatinine'
    ],
    idealFor: 'Diabetic and pre-diabetic patients monitoring blood sugar control and kidney protection.'
  }
];

const diagnosticPillars = [
  {
    icon: HeartPulse,
    title: 'Cardiovascular & Heart Health',
    desc: 'Evaluate cholesterol sub-fractions, CRP markers, ECG telemetry, and arterial stiffness to prevent cardiovascular disease.',
    color: 'bg-red-50 text-red-600 border-red-100'
  },
  {
    icon: Activity,
    title: 'Metabolic & Organ Function',
    desc: 'Audit liver enzymes, kidney filtration rates, uric acid, and blood sugar control to keep your metabolism functioning optimally.',
    color: 'bg-blue-50 text-blue-600 border-blue-100'
  },
  {
    icon: Microscope,
    title: 'Hematology & Immunity',
    desc: 'Analyze red and white blood cell indices, hemoglobin levels, and immune indicators for anemia and infections.',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100'
  },
  {
    icon: Sparkles,
    title: 'Hormones & Essential Nutrients',
    desc: 'Screen thyroid hormones, Vitamin D, Iron reserves, and calcium balance to combat chronic fatigue and weakness.',
    color: 'bg-purple-50 text-purple-600 border-purple-100'
  }
];

const labPartners = [
  { name: 'PathCare Laboratories', cert: 'ISO 15189 Certified', location: 'Lagos & Abuja' },
  { name: 'Synlab Diagnostics', cert: 'MLSCN Accredited', location: 'Nationwide' },
  { name: 'Clina-Lancet Laboratories', cert: 'CAP Compliant', location: 'Major Cities' },
  { name: 'eDokta Central Automated Lab', cert: 'NAFDAC Certified', location: 'Abuja Regional' }
];

const WellnessCheckup = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [collectionType, setCollectionType] = useState('home'); // 'home' | 'lab'
  const [openFaq, setOpenFaq] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    date: '',
    timeSlot: '07:00 AM - 09:00 AM (Fasting)',
    address: '',
    city: 'Abuja'
  });

  const categories = ['All', 'Executive', 'Essential', 'Cardiac', 'Women', 'Senior', 'Diabetes'];

  const filteredPackages = selectedCategory === 'All'
    ? packagesData
    : packagesData.filter(pkg => pkg.category === selectedCategory);

  const handleOpenBooking = (pkg) => {
    setSelectedPackage(pkg);
    setBookingModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const msg = `Checkup Request Confirmed!\nPackage: ${selectedPackage?.title}\nType: ${collectionType === 'home' ? 'Home Sample Pickup' : 'Lab Walk-in Visit'}\nDate: ${formData.date}`;
    toast.success(msg);
    setBookingModalOpen(false);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      date: '',
      timeSlot: '07:00 AM - 09:00 AM (Fasting)',
      address: '',
      city: 'Abuja'
    });
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Do I need to fast before my wellness checkup sample collection?',
      a: 'Yes. For accurate lipid profile and fasting blood glucose results, we recommend fasting for 10-12 hours prior to sample collection (water is permitted).'
    },
    {
      q: 'How does Home Sample Collection work?',
      a: 'A certified, licensed eDokta phlebotomist will arrive at your home or office at your selected time slot equipped with sterile, single-use equipment to collect blood and urine samples.'
    },
    {
      q: 'When and how will I receive my checkup results?',
      a: 'Your digital Health Audit Report is delivered within 12 to 24 hours via SMS, email, and available directly inside your eDokta portal account.'
    },
    {
      q: 'Can I discuss my checkup report with a medical doctor after?',
      a: 'Absolutely! Every wellness checkup package includes a free doctor report interpretation overview and personalized lifestyle guidance.'
    }
  ];

  return (
    <div className="min-h-screen text-gray-800 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950 text-white rounded-3xl p-6 sm:p-12 mb-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col items-start gap-5">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Preventive Healthcare & Diagnostics</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Comprehensive <span className="text-emerald-300">Wellness & Medical Checkups</span>
            </h1>

            <p className="text-base sm:text-lg text-teal-100/90 max-w-2xl leading-relaxed">
              Proactive health audits, full-body blood panels, and personalized diagnostic screenings to detect underlying health conditions early — delivered at home or accredited lab centers.
            </p>

            {/* Quick Benefits Pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-emerald-200">
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Accredited Labs
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <Clock className="w-4 h-4 text-emerald-400" /> 12-24 hr Fast Report Delivery
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <Home className="w-4 h-4 text-emerald-400" /> Home Sample Pickup Available
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a
                href="#packages-section"
                className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold px-8 py-4 rounded-full flex items-center gap-3 shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore Checkup Packages</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="#how-it-works"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium px-6 py-4 rounded-full flex items-center gap-2 transition-all backdrop-blur-sm"
              >
                <Activity className="w-4 h-4 text-emerald-300" />
                <span>How It Works</span>
              </a>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-6 mt-2 border-t border-white/10">
              <div>
                <p className="text-2xl font-extrabold text-white">25+</p>
                <p className="text-xs text-teal-200 font-medium">Checkup Packages</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">10k+</p>
                <p className="text-xs text-teal-200 font-medium">Screenings Completed</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">99.9%</p>
                <p className="text-xs text-teal-200 font-medium">Diagnostic Precision</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">24 hrs</p>
                <p className="text-xs text-teal-200 font-medium">Digital Audit Delivery</p>
              </div>
            </div>
          </div>

          {/* Hero Right Preview Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-200 font-medium">Digital Health Audit</p>
                    <p className="text-sm font-bold text-white">Sample Audit Report</p>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-400/30">
                  Verified Lab
                </span>
              </div>

              {/* Sample Indicator Gauges */}
              <div className="space-y-3">
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-teal-100 font-medium">Lipid Profile & Heart Health</span>
                    <span className="text-emerald-300 font-semibold">Optimal</span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[85%] rounded-full"></div>
                  </div>
                </div>

                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-teal-100 font-medium">Liver & Kidney Function</span>
                    <span className="text-emerald-300 font-semibold">Normal</span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[92%] rounded-full"></div>
                  </div>
                </div>

                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-teal-100 font-medium">HbA1c Diabetes Risk</span>
                    <span className="text-yellow-300 font-semibold">Pre-diabetes Warning</span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full w-[65%] rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-teal-200">
                <span>Doctor Summary Included</span>
                <span className="text-emerald-300 font-semibold flex items-center gap-1">
                  View Demo <ChevronDown className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIAGNOSTIC PILLARS SECTION */}
      <section className="mb-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest text-emerald-600 font-bold mb-2">Comprehensive Screening</p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            What We Screen For
          </h2>
          <p className="text-gray-600 mt-2 text-base">
            Our accredited diagnostic packages evaluate all critical body systems for total peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {diagnosticPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${p.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* PACKAGES FILTER & GRID SECTION */}
      <section id="packages-section" className="mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-600 font-bold mb-2">Tailored Screening Packages</p>
            <h2 className="text-3xl font-bold text-gray-900">
              Select Your Wellness Package
            </h2>
            <p className="text-gray-600 mt-1 text-sm">
              Choose a health package that matches your age, medical history, and wellness goals.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mt-4 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat} {cat === 'All' ? '' : 'Packages'}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between group relative"
            >
              {/* Header Card */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-emerald-50/50 to-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {pkg.badge}
                  </span>
                  <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" /> {pkg.turnaround}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {pkg.title}
                </h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  {pkg.subtitle}
                </p>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-gray-900">
                    ₦{pkg.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">/ complete audit</span>
                </div>
              </div>

              {/* Body Included Tests */}
              <div className="p-6 flex-grow flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">
                    <span>What's Included</span>
                    <span className="text-emerald-600">{pkg.testsCount}</span>
                  </div>

                  <ul className="space-y-2.5">
                    {pkg.included.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">Sample Type: </span>
                  {pkg.sampleType}
                </div>

                {/* CTA Action Button */}
                <button
                  onClick={() => handleOpenBooking(pkg)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all transform group-hover:scale-[1.02]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Health Screening</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ACCREDITED LAB PARTNERS */}
      <section className="mb-20 bg-gray-900 text-white p-8 sm:p-12 rounded-3xl border border-gray-800 shadow-xl">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2">Quality Assurance</p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Accredited Partner Diagnostic Laboratories
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            All samples are processed in state-of-the-art ISO certified and MLSCN accredited clinical diagnostic facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {labPartners.map((lab, idx) => (
            <div key={idx} className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700 text-center flex flex-col items-center justify-between">
              <Building2 className="w-10 h-10 text-emerald-400 mb-3" />
              <div>
                <h3 className="text-base font-bold text-white mb-1">{lab.name}</h3>
                <p className="text-xs text-emerald-400 font-semibold">{lab.cert}</p>
                <p className="text-xs text-gray-400 mt-1">{lab.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS PROCESS */}
      <section id="how-it-works" className="mb-20 bg-emerald-50/50 p-8 sm:p-12 rounded-3xl border border-emerald-100">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest text-emerald-600 font-bold mb-2">Simple 4-Step Journey</p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            How Your Wellness Checkup Works
          </h2>
          <p className="text-gray-600 mt-3 text-base">
            From booking to receiving your doctor-reviewed report, the entire diagnostic process is seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Select Package',
              desc: 'Choose your preferred checkup package based on your age and health goals.',
              icon: Search
            },
            {
              step: '02',
              title: 'Schedule Visit',
              desc: 'Select Home Sample Collection by our phlebotomist or walk-in to a partner lab.',
              icon: Calendar
            },
            {
              step: '03',
              title: 'Sample Collection',
              desc: 'Quick, painless blood & urine sample collection using sterile, barcoded kits.',
              icon: Microscope
            },
            {
              step: '04',
              title: 'Receive Health Audit',
              desc: 'Download your comprehensive digital report in 24 hours with doctor notes.',
              icon: FileText
            }
          ].map((s, idx) => {
            const StepIcon = s.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-extrabold text-emerald-600/30">{s.step}</span>
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <StepIcon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQS SECTION */}
      <section className="mb-20 bg-white p-8 sm:p-12 rounded-3xl border border-gray-200">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest text-emerald-600 font-bold mb-2">Got Questions?</p>
          <h2 className="text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-gray-200">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between text-left focus:outline-none py-2"
              >
                <span className="text-base font-semibold text-gray-900">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    openFaq === idx ? 'transform rotate-180 text-emerald-600' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed pr-6">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl">
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Take Control of Your Health Today
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base mb-8">
            Schedule your comprehensive wellness checkup now. Enjoy convenient home sample pickup or visit an accredited lab near you.
          </p>
          <a
            href="#packages-section"
            className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-10 py-4 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            <span>Book Your Checkup Package</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* INTERACTIVE BOOKING MODAL */}
      {bookingModalOpen && selectedPackage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-6 text-white flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-emerald-200 font-semibold">Schedule Health Audit</p>
                <h3 className="text-xl font-bold">{selectedPackage.title}</h3>
                <p className="text-xs text-emerald-100 mt-1">₦{selectedPackage.price.toLocaleString()} • {selectedPackage.testsCount}</p>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Collection Type Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Collection Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCollectionType('home')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                      collectionType === 'home'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Home className="w-5 h-5" />
                    <span>Home Sample Pickup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCollectionType('lab')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                      collectionType === 'lab'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span>Lab Center Walk-in</span>
                  </button>
                </div>
              </div>

              {/* Patient Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Enter patient full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="08012345678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="patient@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Preferred Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Time Slot</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    <option>07:00 AM - 09:00 AM (Fasting)</option>
                    <option>09:00 AM - 11:00 AM (Fasting)</option>
                    <option>11:00 AM - 01:00 PM</option>
                    <option>02:00 PM - 04:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Address / Location */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {collectionType === 'home' ? 'Home Address for Sample Collection' : 'Preferred City / Diagnostic Center'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder={collectionType === 'home' ? "Street address, Estate, City" : "City or preferred lab center"}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm Checkup Booking</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WellnessCheckup;
