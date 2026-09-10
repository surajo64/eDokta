import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { 
  Video, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  Clock, 
  UserCheck, 
  Search, 
  ArrowRight, 
  PhoneCall, 
  Sparkles, 
  ChevronDown, 
  CheckCircle2, 
  Stethoscope, 
  Globe, 
  HeartPulse, 
  Activity,
  Award,
  Zap,
  Lock,
  Home
} from 'lucide-react';

const servicesData = {
  'teleconsultation': {
    title: 'Virtual Doctor Teleconsultation',
    highlightTitle: 'Anytime, Anywhere',
    tagline: '24/7 Virtual Healthcare Access',
    subtitle: 'Connect face-to-face with top certified doctors and medical specialists across Nigeria and West Africa. Get expert medical advice, diagnosis, and official e-prescriptions from the comfort of your home.',
    stats: [
      { value: '100+', label: 'Verified Doctors' },
      { value: '15k+', label: 'Virtual Consultations' },
      { value: '4.9/5', label: 'Patient Rating' },
      { value: '< 15 mins', label: 'Avg. Wait Time' }
    ],
    benefits: [
      { icon: Video, title: 'HD Video & Audio Consultations', desc: 'Seamless virtual visits right in your web browser with zero app installation required.' },
      { icon: UserCheck, title: 'Verified Medical Specialists', desc: 'Connect with top licensed medical doctors across Nigeria and West Africa.' },
      { icon: FileText, title: 'Instant Electronic Prescriptions', desc: 'Receive official e-prescriptions sent directly to your portal after your visit.' },
      { icon: Lock, title: 'Confidential & Encrypted', desc: 'End-to-end encrypted rooms ensuring total confidentiality for your health records.' }
    ],
    steps: [
      { step: '01', title: 'Browse & Choose Doctor', desc: 'Explore our list of verified doctors by speciality, experience, or rating.', icon: Search },
      { step: '02', title: 'Select Date & Time', desc: 'Pick an available time slot that fits your schedule and confirm.', icon: Calendar },
      { step: '03', title: 'Join HD Virtual Room', desc: 'Access your private secure video call directly from your appointments dashboard.', icon: Video },
      { step: '04', title: 'Get Care & E-Prescription', desc: 'Discuss your health concerns, receive medical advice, and download your prescription.', icon: FileText }
    ],
    faqs: [
      {
        q: 'How do I join my video teleconsultation session?',
        a: 'Once you book an appointment, a secure virtual room link is generated. Log in to your account, go to "My Appointments", and click "Join Telehealth Room" when your time arrives.'
      },
      {
        q: 'What equipment or app do I need for the call?',
        a: 'No special software or app installation is required! You only need a smartphone, tablet, or computer with a working camera, microphone, and internet connection.'
      },
      {
        q: 'Will I receive an official prescription after the visit?',
        a: 'Yes! If your consulting doctor determines medication is necessary, an electronic prescription (e-prescription) will be uploaded to your patient account immediately.'
      },
      {
        q: 'Is my medical information kept confidential?',
        a: '100% yes. eDokta complies with international medical privacy standards. All video calls and medical records are end-to-end encrypted.'
      }
    ]
  },

  'home-healthcare': {
    title: 'Professional Home Healthcare',
    highlightTitle: '& Doctor Doorstep Visits',
    tagline: 'Quality Medical Care At Your Doorstep',
    subtitle: 'Get certified medical doctors, nurses, and lab technicians delivered directly to your home for personalized medical attention, elderly care, and recovery support.',
    stats: [
      { value: '500+', label: 'Home Visits Done' },
      { value: '50+', label: 'Home Care Nurses' },
      { value: '100%', label: 'Qualified Caregivers' },
      { value: '< 2 hrs', label: 'Response Time' }
    ],
    benefits: [
      { icon: Home, title: 'In-Home Doctor & Nurse Visits', desc: 'Receive professional clinical examinations and nursing care in the comfort of your home.' },
      { icon: HeartPulse, title: 'Elderly & Palliative Care', desc: 'Dedicated compassionate care plans for elderly family members needing daily medical assistance.' },
      { icon: FileText, title: 'Home Lab Sample Collection', desc: 'Certified technicians collect blood/urine samples at home with digital results delivered online.' },
      { icon: ShieldCheck, title: 'Post-Surgery Rehabilitation', desc: 'Professional wound dressing, medication administration, and recovery monitoring at home.' }
    ],
    steps: [
      { step: '01', title: 'Select Home Healthcare', desc: 'Choose the type of home medical visit or nursing care required.', icon: Search },
      { step: '02', title: 'Pick Doctor or Caregiver', desc: 'Select a qualified healthcare professional near your location.', icon: Calendar },
      { step: '03', title: 'Confirm Home Address', desc: 'Provide your location details and schedule a convenient visit time.', icon: Home },
      { step: '04', title: 'Receive Care at Home', desc: 'Our medical professional arrives fully equipped to care for you.', icon: CheckCircle2 }
    ],
    faqs: [
      {
        q: 'How quickly can a doctor or nurse visit my home?',
        a: 'Emergency home health visits can be arranged within 2 hours depending on your city location. Scheduled visits can be booked for any date and time.'
      },
      {
        q: 'Are the healthcare workers verified and licensed?',
        a: 'Yes, all doctors, nurses, and caregivers sent by eDokta are fully licensed, background-checked, and registered with official medical boards.'
      },
      {
        q: 'Can lab test samples be collected at my house?',
        a: 'Yes! Our certified lab phlebotomists come directly to your home for blood, urine, and swab collections.'
      }
    ]
  },

  'wellness-checkup': {
    title: 'Comprehensive Wellness',
    highlightTitle: '& Medical Checkups',
    tagline: 'Preventive Healthcare & Diagnostics',
    subtitle: 'Proactive medical screenings, full-body health audits, and personalized wellness plans to keep you and your family in peak health.',
    stats: [
      { value: '25+', label: 'Checkup Packages' },
      { value: '10k+', label: 'Screenings Done' },
      { value: '100%', label: 'Certified Labs' },
      { value: '24 hrs', label: 'Report Delivery' }
    ],
    benefits: [
      { icon: Activity, title: 'Full Body Health Audits', desc: 'Comprehensive panel testing including liver, kidney, lipid profile, and blood sugar.' },
      { icon: HeartPulse, title: 'Cardiovascular Risk Assessment', desc: 'Screenings for blood pressure, ECG, and heart health indicators to prevent chronic diseases.' },
      { icon: Sparkles, title: 'Customized Wellness Plans', desc: 'Tailored nutrition, fitness, and medical guidance from experienced lifestyle doctors.' },
      { icon: Award, title: 'Executive Health Screening', desc: 'Fast-track premium health screening packages designed for busy professionals.' }
    ],
    steps: [
      { step: '01', title: 'Choose Screening Package', desc: 'Select from basic, comprehensive, or executive health checkup options.', icon: Search },
      { step: '02', title: 'Book Doctor Consultation', desc: 'Schedule an appointment with a wellness physician for review.', icon: Calendar },
      { step: '03', title: 'Undergo Screening', desc: 'Complete sample collection and medical vitals assessment.', icon: Activity },
      { step: '04', title: 'Receive Expert Audit', desc: 'Get a detailed medical report with doctor recommendations.', icon: FileText }
    ],
    faqs: [
      {
        q: 'Why are regular medical checkups important?',
        a: 'Routine health checkups help detect underlying health conditions early before symptoms appear, allowing for early treatment and prevention.'
      },
      {
        q: 'How long does a full body wellness checkup take?',
        a: 'Sample collection and vitals take approximately 20-30 minutes. Your complete health audit report is delivered within 24 hours.'
      }
    ]
  },

  'medical-tourism': {
    title: 'International & Regional',
    highlightTitle: 'Medical Tourism & Booking',
    tagline: 'World-Class Specialist Healthcare',
    subtitle: 'Access world-class medical facilities, second opinions from global experts, and full concierge travel booking for advanced medical procedures.',
    stats: [
      { value: '30+', label: 'Global Hospital Partners' },
      { value: '200+', label: 'Travelers Assisted' },
      { value: '15+', label: 'Countries Covered' },
      { value: '100%', label: 'Concierge Support' }
    ],
    benefits: [
      { icon: Globe, title: 'Premier International Hospitals', desc: 'Direct partnerships with accredited hospitals in Turkey, UAE, India, UK, and Egypt.' },
      { icon: UserCheck, title: 'Specialist Second Opinions', desc: 'Have your medical records reviewed by international surgical and medical experts.' },
      { icon: FileText, title: 'Medical Visa & Travel Assistance', desc: 'Hassle-free medical visa invitation letters, flights, and accommodation booking.' },
      { icon: ShieldCheck, title: 'End-to-End Patient Concierge', desc: 'Dedicated personal medical coordinator accompanying your entire treatment journey.' }
    ],
    steps: [
      { step: '01', title: 'Submit Medical Records', desc: 'Upload your diagnosis, scans, and doctor reports to our portal.', icon: FileText },
      { step: '02', title: 'Receive Treatment Plan', desc: 'Get cost estimates and treatment options from top international hospitals.', icon: Globe },
      { step: '03', title: 'Travel & Accommodation', desc: 'Our concierge manages visa invitations, flights, and hotel bookings.', icon: Calendar },
      { step: '04', title: 'Treatment & Recovery', desc: 'Undergo procedure with full post-op follow-ups after returning home.', icon: CheckCircle2 }
    ],
    faqs: [
      {
        q: 'Which countries do you assist medical travel to?',
        a: 'We partner with top accredited medical centers in Turkey, UAE, India, Egypt, UK, and South Africa for specialized surgeries and treatments.'
      },
      {
        q: 'Do you assist with visa application letters?',
        a: 'Yes, we provide official medical invitation letters from destination hospitals to facilitate fast-track medical visa processing.'
      }
    ]
  },

  'travel-health': {
    title: 'Travel Health Advisory',
    highlightTitle: '& International Vaccinations',
    tagline: 'Safe & Protected International Travel',
    subtitle: 'Comprehensive travel health consultations, mandatory international vaccinations, Yellow Fever cards, and fit-to-fly certificates.',
    stats: [
      { value: '100%', label: 'WHO Approved Vaccine' },
      { value: '5k+', label: 'Travelers Certified' },
      { value: '24/7', label: 'Emergency Support' },
      { value: 'Same Day', label: 'Card Issuance' }
    ],
    benefits: [
      { icon: ShieldCheck, title: 'International Travel Vaccines', desc: 'Yellow fever, Typhoid, Hepatitis, Meningitis, and Cholera immunizations.' },
      { icon: FileText, title: 'Yellow Card & Certificates', desc: 'Official international certificate of vaccination issued directly post-vaccination.' },
      { icon: Stethoscope, title: 'Pre-Travel Medical Checkup', desc: 'Fit-to-fly health evaluations and personalized prescription travel kits.' },
      { icon: PhoneCall, title: 'Destination Health Advice', desc: 'Up-to-date disease outbreak advisories and malaria prevention medication.' }
    ],
    steps: [
      { step: '01', title: 'Enter Destination', desc: 'Specify your travel destination to view required vaccines and health risks.', icon: Globe },
      { step: '02', title: 'Book Doctor Consult', desc: 'Schedule a travel health appointment with a certified physician.', icon: Calendar },
      { step: '03', title: 'Get Vaccinated', desc: 'Receive WHO-approved vaccines at an eDokta clinic or home visit.', icon: ShieldCheck },
      { step: '04', title: 'Receive Yellow Card', desc: 'Get your official Yellow Fever Card and travel medical certificate.', icon: FileText }
    ],
    faqs: [
      {
        q: 'Is the Yellow Fever Card issued recognized by airlines and embassies?',
        a: 'Yes, all Yellow Cards issued through eDokta are official WHO-standard certificates recognized globally.'
      }
    ]
  },

  'e-pharmacy': {
    title: 'Digital e-Pharmacy',
    highlightTitle: '& Prescription Delivery',
    tagline: '100% Genuine Medications Delivered Fast',
    subtitle: 'Upload doctor prescriptions, order authentic NAFDAC-approved medications, and enjoy fast doorstep delivery anywhere in Nigeria.',
    stats: [
      { value: '10k+', label: 'Prescriptions Filled' },
      { value: '100%', label: 'NAFDAC Approved' },
      { value: '24 hrs', label: 'Home Delivery' },
      { value: '500+', label: 'Medicines Stocked' }
    ],
    benefits: [
      { icon: ShieldCheck, title: '100% Authentic Medications', desc: 'Direct sourcing from verified pharmaceutical manufacturers guaranteeing zero counterfeit drugs.' },
      { icon: FileText, title: 'Pharmacist Prescription Review', desc: 'Every prescription is verified by licensed clinical pharmacists before dispensing.' },
      { icon: Clock, title: 'Fast Doorstep Delivery', desc: 'Express delivery to your home or office with temperature-controlled packaging.' },
      { icon: Sparkles, title: 'Automatic Refill Reminders', desc: 'Never run out of essential chronic medications with automated monthly delivery.' }
    ],
    steps: [
      { step: '01', title: 'Upload Prescription', desc: 'Attach your doctor prescription or consult a doctor online to get one.', icon: FileText },
      { step: '02', title: 'Pharmacist Verification', desc: 'Our clinical team reviews dosage and drug compatibility.', icon: UserCheck },
      { step: '03', title: 'Confirm & Pay', desc: 'Review pricing and pay securely online or via bank transfer.', icon: ShieldCheck },
      { step: '04', title: 'Fast Delivery', desc: 'Receive your sealed medication package at your address.', icon: CheckCircle2 }
    ],
    faqs: [
      {
        q: 'Can I purchase prescription drugs without a doctor prescription?',
        a: 'For prescription-only medications, a valid prescription is required. You can consult any doctor on eDokta to get an instant digital prescription.'
      }
    ]
  }
};

const Teleconsultation = () => {
  const navigate = useNavigate();
  const { service } = useParams();
  const { doctors } = useContext(AppContext);
  const [openFaq, setOpenFaq] = useState(null);

  // Fallback to teleconsultation if service key not matching
  const currentKey = service && servicesData[service] ? service : 'teleconsultation';
  const data = servicesData[currentKey];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const specialities = [
    { name: 'General physician', icon: Stethoscope, desc: 'Everyday health checkups, fever, flu, & general wellness' },
    { name: 'Gynecologist', icon: HeartPulse, desc: 'Women’s reproductive health, prenatal care & consultations' },
    { name: 'Dermatologist', icon: Sparkles, desc: 'Skin, hair, nail conditions & cosmetic dermatology advice' },
    { name: 'Pediatricians', icon: Activity, desc: 'Specialized healthcare and growth tracking for infants & kids' },
    { name: 'Neurologist', icon: Zap, desc: 'Brain, spinal cord, nerve disorders & chronic headache management' },
    { name: 'Gastroenterologist', icon: Globe, desc: 'Digestive system, stomach issues, & liver health care' },
  ];

  return (
    <div className="min-h-screen text-gray-800 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white rounded-3xl p-6 sm:p-12 mb-16 border border-blue-100 shadow-sm">
        {/* Background glow circle */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col items-start gap-5">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              <Sparkles className="w-4 h-4 text-primary" />
              <span>{data.tagline}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              {data.title} <span className="text-primary">{data.highlightTitle}</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
              {data.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  navigate('/doctors');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-primary hover:bg-indigo-700 text-white font-medium px-8 py-4 rounded-full flex items-center gap-3 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>Browse All Doctors to Book</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#how-it-works"
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-medium px-6 py-4 rounded-full flex items-center gap-2 transition-all shadow-sm"
              >
                <Video className="w-4 h-4 text-primary" />
                <span>How It Works</span>
              </a>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-8 mt-4 border-t border-gray-200/80">
              {data.stats.map((st, idx) => (
                <div key={idx}>
                  <p className="text-2xl font-bold text-gray-900">{st.value}</p>
                  <p className="text-xs text-gray-500 font-medium">{st.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Banner Graphic Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <img
                  src={assets.header_img}
                  alt={data.title}
                  className="w-full h-auto rounded-xl object-cover"
                />

                {/* Floating Card Overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-blue-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Live Status</p>
                      <p className="text-sm font-semibold text-gray-800">Doctors Online Now</p>
                    </div>
                  </div>
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE (BENEFITS) */}
      <section className="mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest text-primary font-bold mb-2">Why Choose eDokta</p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Healthcare Designed Around Your Life
          </h2>
          <p className="text-gray-600 mt-3 text-base">
            Skip long clinic wait times and traffic. Get comprehensive medical care directly on your phone or computer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS (STEP-BY-STEP) */}
      <section id="how-it-works" className="mb-20 bg-gray-50/70 p-8 sm:p-12 rounded-3xl border border-gray-100">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest text-primary font-bold mb-2">Simple Process</p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="text-gray-600 mt-3 text-base">
            Getting quality healthcare from certified doctors is quick, effortless, and secure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {data.steps.map((s, idx) => {
            const StepIcon = s.icon;
            return (
              <div key={idx} className="relative flex flex-col items-start bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between w-full mb-6">
                  <span className="text-3xl font-extrabold text-primary/20">{s.step}</span>
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center">
                    <StepIcon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => {
              navigate('/doctors');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 bg-primary hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-full shadow-md transition-all"
          >
            <span>Book Appointment on All Doctors Page</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* SPECIALITIES SECTION */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-bold mb-2">Medical Specialties</p>
            <h2 className="text-3xl font-bold text-gray-900">
              Consult Top Specialists
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              Find dedicated experts tailored to your health requirements.
            </p>
          </div>
          <button
            onClick={() => {
              navigate('/doctors');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-4 md:mt-0 text-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialities.map((spec, idx) => {
            const SpecIcon = spec.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  navigate(`/doctors/${spec.name}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <SpecIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                    {spec.name}
                  </h3>
                  <p className="text-xs text-gray-600">{spec.desc}</p>
                </div>
                <div className="mt-6 flex items-center text-xs font-semibold text-primary gap-1 group-hover:gap-2 transition-all">
                  <span>Browse Doctors</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED DOCTORS LIVE GRID */}
      <section className="mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest text-primary font-bold mb-2">Available Now</p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Doctors Available for Booking & Teleconsultation
          </h2>
          <p className="text-gray-600 mt-3 text-base">
            Select a verified doctor below to book your appointment directly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {doctors && doctors.length > 0 ? (
            doctors.slice(0, 8).map((doc, index) => (
              <div
                key={index}
                className="bg-white border border-blue-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative bg-blue-50 overflow-hidden flex items-center justify-center h-52">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm text-xs font-medium">
                    <span className={`w-2 h-2 rounded-full ${doc.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className={doc.available ? 'text-green-700' : 'text-red-600'}>
                      {doc.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-primary font-medium">{doc.speciality}</p>
                    <p className="text-xs text-gray-500 mt-1">{doc.degree || 'MBBS'} • {doc.experience || '5+ Years Exp'}</p>
                  </div>

                  <button
                    onClick={() => {
                      if (doc.available) {
                        navigate(`/appointment/${doc._id}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    disabled={!doc.available}
                    className={`w-full py-2.5 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all ${
                      doc.available
                        ? 'bg-primary text-white hover:bg-indigo-700 shadow-md shadow-primary/20'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{doc.available ? 'Book Appointment' : 'Currently Unavailable'}</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              Loading doctors...
            </div>
          )}
        </div>

        {/* View All Doctors Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => {
              navigate('/doctors');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
          >
            <span>Navigate to All Doctors Page</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      {data.faqs && data.faqs.length > 0 && (
        <section className="mb-20 bg-white p-8 sm:p-12 rounded-3xl border border-gray-200">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-bold mb-2">Got Questions?</p>
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-gray-200">
            {data.faqs.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left focus:outline-none py-2"
                >
                  <span className="text-base font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openFaq === idx ? 'transform rotate-180 text-primary' : ''
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
      )}

      {/* BOTTOM CTA BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-indigo-700 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl">
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready for your digital health consultation?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base mb-8">
            Book an appointment with licensed medical doctors today and receive care from anywhere.
          </p>
          <button
            onClick={() => {
              navigate('/doctors');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-white text-primary hover:bg-blue-50 font-bold px-10 py-4 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            <span>Browse All Doctors to Book Appointment</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Teleconsultation;
