import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import {
  Globe, Plane, ArrowRight, CheckCircle2, ShieldCheck, FileText,
  User, Phone, Mail, ChevronDown, ChevronRight, ChevronLeft,
  Stethoscope, Heart, Clock, Star, MapPin, AlertCircle, Check,
  Building2, HelpCircle, Sparkles, Activity, Award
} from 'lucide-react';

const destinationCountries = [
  {
    flag: '🇹🇷',
    country: 'Turkey',
    city: 'Istanbul & Ankara',
    specialty: 'Oncology, Cardiac Surgery, Hair Transplant, Eye Surgery',
    hospitals: 'Acibadem, Memorial, Medical Park',
    avgSaving: 'Up to 70% cheaper than Western rates',
    color: 'from-red-800 to-red-900'
  },
  {
    flag: '🇦🇪',
    country: 'UAE',
    city: 'Dubai & Abu Dhabi',
    specialty: 'Orthopedics, Neurology, IVF, Cardiology',
    hospitals: 'Cleveland Clinic Abu Dhabi, American Hospital Dubai',
    avgSaving: 'JCI-accredited world-class facilities',
    color: 'from-amber-700 to-amber-900'
  },
  {
    flag: '🇮🇳',
    country: 'India',
    city: 'Mumbai, Chennai & Delhi',
    specialty: 'Bone Marrow Transplant, Kidney, Liver Transplant, Cardiac',
    hospitals: 'Apollo, Fortis, Narayana Health',
    avgSaving: 'Up to 80% cheaper than USA/UK rates',
    color: 'from-orange-700 to-orange-900'
  },
  {
    flag: '🇬🇧',
    country: 'United Kingdom',
    city: 'London & Manchester',
    specialty: 'Neurosurgery, Oncology, Complex Cardiac, Pediatric',
    hospitals: 'NHS Partners, HCA Healthcare London',
    avgSaving: 'Gold standard specialist expertise',
    color: 'from-blue-800 to-blue-900'
  },
  {
    flag: '🇪🇬',
    country: 'Egypt',
    city: 'Cairo & Alexandria',
    specialty: 'Ophthalmology, Orthopedics, Dental, General Surgery',
    hospitals: 'Dar Al Fouad, As-Salam International',
    avgSaving: 'Close proximity + affordable rates',
    color: 'from-yellow-700 to-yellow-900'
  },
  {
    flag: '🇿🇦',
    country: 'South Africa',
    city: 'Cape Town & Johannesburg',
    specialty: 'Orthopedics, Cosmetic, Bariatric, Dental Implants',
    hospitals: 'Netcare, Life Healthcare, Medi-Clinic',
    avgSaving: 'World-class African specialist care',
    color: 'from-green-800 to-green-900'
  }
];

const steps = [
  { num: '01', title: 'Submit Medical Tourism Request', desc: 'Fill out the consultation form with your condition, treatment needed, and preferred destination.', icon: FileText },
  { num: '02', title: 'eDokta Reviews Your Case', desc: 'Our international medical concierge team reviews your case and connects with partner hospitals.', icon: Activity },
  { num: '03', title: 'Receive Treatment Plan & Quote', desc: 'Get a detailed treatment plan, cost estimate, and hospital options from top international centers.', icon: Building2 },
  { num: '04', title: 'Visa & Travel Concierge', desc: 'eDokta arranges medical visa invitation letters, flight guidance, and accommodation support.', icon: Plane },
  { num: '05', title: 'Travel, Treatment & Follow-Up', desc: 'Receive your medical care abroad with an eDokta coordinator present, plus home follow-up on return.', icon: Heart }
];

const faqs = [
  { q: 'How long does it take to get a treatment plan after submission?', a: 'Typically 24–48 working hours. Our concierge team contacts partner hospitals and responds with a detailed plan.' },
  { q: 'Do you assist with medical visa applications?', a: 'Yes. eDokta issues official medical invitation and introduction letters from partner hospitals which are used to support medical visa applications at embassies.' },
  { q: 'Will I be accompanied by an eDokta representative abroad?', a: 'For selected packages, a dedicated eDokta medical coordinator accompanies patients or remains remotely accessible throughout the treatment journey.' },
  { q: 'What documents do I need to send for evaluation?', a: 'Recent diagnosis reports, scan results (CT/MRI/PET), previous doctor summaries, and any relevant lab test results. The more detail you provide, the faster we can act.' },
  { q: 'Is this service available to patients from anywhere in West Africa?', a: 'Yes. eDokta Medical Tourism serves patients across Nigeria and all West African nations. We specialize in Nigerian passport holders and have embassy experience.' }
];

const initialForm = {
  patientName: '',
  patientEmail: '',
  patientPhone: '',
  medicalCondition: '',
  treatmentSought: '',
  urgency: 'Flexible',
  additionalNotes: '',
  preferredCountry: '',
  budgetRange: 'Not specified',
  travelTimeline: ''
};

const MedicalTourism = () => {
  const navigate = useNavigate();
  const { backendUrl, token, userData, setShowLogin } = useContext(AppContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Pre-fill personal info from logged-in user profile
  React.useEffect(() => {
    if (userData) {
      setForm(prev => ({
        ...prev,
        patientName: userData.name || prev.patientName,
        patientEmail: userData.email || prev.patientEmail,
        patientPhone: userData.phone || prev.patientPhone,
      }));
    }
  }, [userData]);

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const { data } = await axios.post(`${backendUrl}/api/user/submit-tourism-request`, form, {
        headers: { token }
      });
      if (data.success) {
        setSubmitted(true);
        setForm(initialForm);
        setCurrentStep(1);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    if (!token) return false; // must be logged in
    if (currentStep === 1) return form.patientName && form.patientEmail && form.patientPhone;
    if (currentStep === 2) return form.medicalCondition && form.treatmentSought;
    if (currentStep === 3) return form.preferredCountry;
    return true;
  };

  const stepLabels = ['Personal Info', 'Medical Details', 'Preferences', 'Review & Submit'];

  return (
    <div className="min-h-screen text-gray-800 pb-16">

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-12 mb-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Floating country flags */}
        <div className="absolute top-8 right-8 hidden lg:flex gap-3 text-3xl opacity-60">
          {['🇹🇷','🇦🇪','🇮🇳','🇬🇧','🇪🇬','🇿🇦'].map((f, i) => (
            <span key={i} className="drop-shadow-md">{f}</span>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col items-start gap-5">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>World-Class Specialist Healthcare Abroad</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              International <span className="text-blue-300">Medical Tourism</span><br />& Booking
            </h1>

            <p className="text-base sm:text-lg text-blue-100/85 max-w-2xl leading-relaxed">
              eDokta connects Nigerian and West African patients with <strong>top-tier international hospitals</strong> in Turkey, UAE, India, UK, Egypt and South Africa. We handle everything — from medical evaluation, visa letters, travel, accommodation, to full concierge care abroad.
            </p>

            <div className="flex flex-wrap gap-3 text-xs font-medium text-blue-200">
              {['30+ Global Hospital Partners','Visa Invitation Letters','Personal Medical Coordinator','Post-Treatment Follow-Up'].map((t,i) => (
                <span key={i} className="flex items-center gap-1.5 bg-white/10 px-3 py-2 rounded-lg border border-white/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" /> {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#request-form"
                className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-full flex items-center gap-3 shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
                <span>Submit Medical Request</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#destinations"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium px-6 py-4 rounded-full flex items-center gap-2 transition-all">
                <Globe className="w-4 h-4 text-blue-300" />
                <span>View Destinations</span>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-6 mt-2 border-t border-white/10">
              {[
                { v: '30+', l: 'Global Hospital Partners' },
                { v: '200+', l: 'Patients Assisted' },
                { v: '15+', l: 'Countries Covered' },
                { v: '100%', l: 'Concierge Support' }
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-2xl font-extrabold text-white">{s.v}</p>
                  <p className="text-xs text-blue-200 font-medium">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl w-full max-w-md">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-blue-400/20 text-blue-300 flex items-center justify-center">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-blue-200 font-medium">Patient Journey Overview</p>
                  <p className="text-sm font-bold text-white">Typical Medical Tourism Timeline</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { phase: 'Case Review & Hospital Match', days: '1–3 days', color: 'bg-blue-400' },
                  { phase: 'Treatment Plan & Cost Estimate', days: '2–5 days', color: 'bg-indigo-400' },
                  { phase: 'Visa Letter & Travel Preparation', days: '1–2 weeks', color: 'bg-purple-400' },
                  { phase: 'Treatment Abroad', days: '1–6 weeks', color: 'bg-green-400' },
                  { phase: 'Home Recovery & Follow-Up', days: 'Ongoing', color: 'bg-emerald-400' }
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                      <span className="text-xs text-blue-100">{item.phase}</span>
                    </div>
                    <span className="text-xs font-semibold text-blue-300">{item.days}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESTINATION COUNTRIES ── */}
      <section id="destinations" className="mb-20">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest text-blue-600 font-bold mb-2">Global Partner Destinations</p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Medical Tourism Destinations</h2>
          <p className="text-gray-600 mt-2 text-base">
            eDokta partners with accredited hospitals across 6 premier medical destinations worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinationCountries.map((dest, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${dest.color} text-white rounded-3xl p-6 hover:scale-[1.02] transition-transform duration-300 shadow-lg group`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{dest.flag}</span>
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-semibold">{dest.city}</span>
              </div>
              <h3 className="text-2xl font-extrabold mb-2">{dest.country}</h3>
              <p className="text-xs text-white/80 mb-3 leading-relaxed">
                <span className="font-semibold text-white/90">Specialties: </span>{dest.specialty}
              </p>
              <div className="border-t border-white/20 pt-3">
                <p className="text-xs text-white/70">
                  <span className="font-semibold text-white/90">Partner Hospitals: </span>{dest.hospitals}
                </p>
                <p className="mt-2 text-xs font-semibold text-yellow-300 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" /> {dest.avgSaving}
                </p>
              </div>
              <button
                onClick={() => { updateForm('preferredCountry', dest.country); document.getElementById('request-form')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="mt-5 w-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                Request Treatment in {dest.country} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="mb-20 bg-gray-50 p-8 sm:p-12 rounded-3xl border border-gray-100">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest text-blue-600 font-bold mb-2">Full Concierge Process</p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Your Medical Tourism Journey</h2>
          <p className="text-gray-600 mt-3 text-base">From your first inquiry to returning home after treatment, eDokta is with you every step.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-extrabold text-blue-600/25">{s.num}</span>
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── MULTI-STEP REQUEST FORM ── */}
      <section id="request-form" className="mb-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-blue-600 font-bold mb-2">Free Medical Consultation</p>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Submit Your Medical Tourism Request</h2>
            <p className="text-gray-600 mt-2 text-base">
              Our team will review your case and respond with a tailored treatment plan within 24-48 hours. No commitment required.
            </p>
          </div>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-3xl p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Request Submitted Successfully!</h3>
              <p className="text-gray-600 text-base mb-8">
                Our international medical concierge team will review your case and contact you within <strong>24–48 hours</strong> with a personalized treatment plan and hospital recommendations.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button onClick={() => navigate('/my-tourism-requests')}
                  className="bg-blue-600 text-white font-bold px-8 py-3 rounded-full transition-all hover:bg-blue-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Track My Requests
                </button>
                <button onClick={() => setSubmitted(false)}
                  className="bg-white border border-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-full transition-all hover:bg-gray-50">
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : !token ? (
            /* ── LOGIN GATE ── */
            <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-8 text-center text-white">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-blue-200" />
                </div>
                <h3 className="text-2xl font-extrabold mb-2">Login Required</h3>
                <p className="text-blue-100 text-sm max-w-md mx-auto">
                  Please log in to your eDokta account to submit a Medical Tourism request. This allows us to track your case and keep you updated on your progress.
                </p>
              </div>
              <div className="p-8 text-center">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
                  {[
                    { icon: FileText, label: 'Track Your Request',   desc: 'Monitor status in real-time from your account' },
                    { icon: Globe,    label: 'Personalized Matching', desc: 'We match your profile to the right hospital' },
                    { icon: ShieldCheck, label: 'Secure & Confidential', desc: 'Your medical data is fully encrypted & private' }
                  ].map((b, i) => {
                    const Icon = b.icon;
                    return (
                      <div key={i} className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                        <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-xs font-bold text-gray-800 mb-1">{b.label}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => setShowLogin(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-full shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5">
                    <User className="w-4 h-4" /> Login to Continue
                  </button>
                  <button
                    onClick={() => { setShowLogin(true); }}
                    className="bg-white border border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-full flex items-center gap-2 hover:bg-gray-50 transition-all">
                    Create Account
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Don't have an account? Click "Create Account" to register in under 2 minutes.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">

              {/* Step Progress Bar */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6">
                <div className="flex items-center justify-between mb-4">
                  {stepLabels.map((label, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        i + 1 === currentStep ? 'bg-blue-400 text-white shadow-lg scale-110' :
                        i + 1 < currentStep ? 'bg-green-400 text-white' : 'bg-white/20 text-white/60'
                      }`}>
                        {i + 1 < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className={`text-xs hidden sm:block text-center font-medium ${
                        i + 1 === currentStep ? 'text-blue-200' : i + 1 < currentStep ? 'text-green-300' : 'text-white/40'
                      }`}>{label}</span>
                    </div>
                  ))}
                </div>
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / 3) * 100}%` }}></div>
                </div>
              </div>

              <div className="p-8">
                {/* Step 1 — Personal Info */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                      <input type="text" value={form.patientName} onChange={e => updateForm('patientName', e.target.value)}
                        placeholder="e.g. Alhaji Musa Abdullahi"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                        <input type="email" value={form.patientEmail} onChange={e => updateForm('patientEmail', e.target.value)}
                          placeholder="patient@example.com"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Phone / WhatsApp *</label>
                        <input type="tel" value={form.patientPhone} onChange={e => updateForm('patientPhone', e.target.value)}
                          placeholder="08012345678"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500" />
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Your personal and medical information is <strong>100% confidential</strong> and used solely for coordinating your medical care abroad.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2 — Medical Details */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Stethoscope className="w-5 h-5 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">Medical Details</h3>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Primary Medical Condition / Diagnosis *</label>
                      <input type="text" value={form.medicalCondition} onChange={e => updateForm('medicalCondition', e.target.value)}
                        placeholder="e.g. Stage 2 Breast Cancer, Chronic Kidney Disease, Hip Replacement..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Treatment / Procedure Sought *</label>
                      <input type="text" value={form.treatmentSought} onChange={e => updateForm('treatmentSought', e.target.value)}
                        placeholder="e.g. Chemotherapy, Kidney Transplant, Total Hip Replacement, Cardiac Bypass..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Urgency Level</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Urgent (< 1 month)', 'Within 3 months', 'Flexible'].map(opt => (
                          <button key={opt} type="button" onClick={() => updateForm('urgency', opt)}
                            className={`p-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                              form.urgency === opt ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Additional Medical Notes (optional)</label>
                      <textarea value={form.additionalNotes} onChange={e => updateForm('additionalNotes', e.target.value)}
                        rows={3} placeholder="Describe your condition in more detail, list previous treatments tried, any doctor's referral notes..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 resize-none" />
                    </div>
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 leading-relaxed">
                        After submission you can send us your <strong>scan results, lab reports, or doctor letters</strong> via WhatsApp or email. Our team will follow up within 24 hours.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3 — Preferences */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">Treatment Preferences</h3>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Preferred Destination Country *</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {destinationCountries.map(dest => (
                          <button key={dest.country} type="button"
                            onClick={() => updateForm('preferredCountry', dest.country)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              form.preferredCountry === dest.country
                                ? 'border-blue-600 bg-blue-50 text-blue-800'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}>
                            <span className="text-2xl mb-1 block">{dest.flag}</span>
                            <span className="text-xs font-bold">{dest.country}</span>
                          </button>
                        ))}
                        <button type="button"
                          onClick={() => updateForm('preferredCountry', 'Best Recommendation')}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            form.preferredCountry === 'Best Recommendation'
                              ? 'border-blue-600 bg-blue-50 text-blue-800'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}>
                          <Sparkles className="w-6 h-6 text-blue-500 mb-1" />
                          <span className="text-xs font-bold">eDokta Recommends</span>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Estimated Budget Range (USD)</label>
                        <select value={form.budgetRange} onChange={e => updateForm('budgetRange', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white">
                          <option>Not specified</option>
                          <option>Under $5,000</option>
                          <option>$5,000 – $15,000</option>
                          <option>$15,000 – $30,000</option>
                          <option>$30,000 – $60,000</option>
                          <option>Above $60,000</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Travel Timeline</label>
                        <input type="text" value={form.travelTimeline} onChange={e => updateForm('travelTimeline', e.target.value)}
                          placeholder="e.g. November 2026, ASAP, Q1 2027..."
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4 — Review & Submit */}
                {currentStep === 4 && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">Review & Submit Request</h3>
                    </div>
                    <div className="bg-gray-50 rounded-2xl border border-gray-200 divide-y divide-gray-200">
                      {[
                        { label: 'Patient Name', value: form.patientName },
                        { label: 'Email', value: form.patientEmail },
                        { label: 'Phone', value: form.patientPhone },
                        { label: 'Medical Condition', value: form.medicalCondition },
                        { label: 'Treatment Sought', value: form.treatmentSought },
                        { label: 'Urgency', value: form.urgency },
                        { label: 'Preferred Country', value: form.preferredCountry },
                        { label: 'Budget Range', value: form.budgetRange },
                        { label: 'Travel Timeline', value: form.travelTimeline || 'Not specified' },
                      ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-3">
                          <span className="text-xs font-semibold text-gray-500">{row.label}</span>
                          <span className="text-xs font-medium text-gray-800 text-right max-w-[60%] truncate">{row.value || '—'}</span>
                        </div>
                      ))}
                    </div>
                    {form.additionalNotes && (
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Additional Notes</p>
                        <p className="text-xs text-gray-700 leading-relaxed">{form.additionalNotes}</p>
                      </div>
                    )}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 leading-relaxed">
                        By submitting, you agree that eDokta may contact you at the provided email and phone number regarding your medical tourism inquiry. No payment is required at this stage.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  {currentStep < 4 ? (
                    <button
                      onClick={() => canProceed() && setCurrentStep(prev => prev + 1)}
                      disabled={!canProceed()}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                      Next Step <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-3 rounded-full shadow-lg shadow-green-600/20 transition-all disabled:opacity-50">
                      {submitting ? 'Submitting...' : 'Submit Medical Tourism Request'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="mb-20 bg-white p-8 sm:p-12 rounded-3xl border border-gray-200">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest text-blue-600 font-bold mb-2">Got Questions?</p>
          <h2 className="text-3xl font-bold text-gray-900">Medical Tourism FAQs</h2>
        </div>
        <div className="max-w-3xl mx-auto divide-y divide-gray-200">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left py-2 focus:outline-none">
                <span className="text-base font-semibold text-gray-900">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === idx ? 'rotate-180 text-blue-600' : ''}`} />
              </button>
              {openFaq === idx && <p className="mt-2 text-sm text-gray-600 leading-relaxed pr-6">{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl">
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to Explore Treatment Abroad?</h2>
          <p className="text-blue-100 text-sm sm:text-base mb-8">
            Fill out our free consultation form and our medical concierge team will match you with the right hospital and treatment plan within 24–48 hours.
          </p>
          <a href="#request-form"
            className="bg-white text-blue-900 hover:bg-blue-50 font-bold px-10 py-4 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2">
            <span>Submit Your Request — Free</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default MedicalTourism;
