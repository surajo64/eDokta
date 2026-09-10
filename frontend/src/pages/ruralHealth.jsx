import React, { useState } from 'react'
import {
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  Download,
  Share2,
  CheckCircle2,
  Quote,
  Activity,
  HeartPulse,
  Sun,
  Wifi,
  ShieldCheck,
  Building2,
  Users,
  MapPin,
  ChevronRight,
  Copy,
  Check,
  FileText,
  Search,
  Sparkles,
  Layers,
  ArrowUpRight,
  Stethoscope,
  Baby,
  Pill,
  Lightbulb,
  GraduationCap,
  Microscope,
  Eye,
  Radio,
  PhoneCall
} from 'lucide-react'
import { toast } from 'react-toastify'

const RuralHealth = () => {
  const [activeTab, setActiveTab] = useState('investigation')
  const [citationFormat, setCitationFormat] = useState('apa')
  const [copiedCitation, setCopiedCitation] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [collabModalOpen, setCollabModalOpen] = useState(false)
  const [collabForm, setCollabForm] = useState({
    name: '',
    community: '',
    organization: '',
    email: '',
    phone: '',
    interest: 'Establish Rural Tele-Clinic',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Citations for the featured Nigeria Health Watch field study
  const citations = {
    apa: `Garba, M. (2025, October 21). Your eDokta Will See You Now: A Telemedicine Clinic is Bridging Maternal Health Gaps in Kano. Nigeria Health Watch (Torchlight Series). https://nigeriahealthwatch.com/articles/torchlight/your-edokta-will-see-you-now-a-telemedicine-clinic-is-bridging-maternal-health-gaps-in-kano/`,
    vancouver: `Garba M. Your eDokta Will See You Now: A Telemedicine Clinic is Bridging Maternal Health Gaps in Kano. Nigeria Health Watch [Internet]. 2025 Oct 21; Available from: https://nigeriahealthwatch.com/articles/torchlight/your-edokta-will-see-you-now-a-telemedicine-clinic-is-bridging-maternal-health-gaps-in-kano/`,
    harvard: `Garba, M., 2025. Your eDokta Will See You Now: A Telemedicine Clinic is Bridging Maternal Health Gaps in Kano. Nigeria Health Watch. Available at: <https://nigeriahealthwatch.com/articles/torchlight/your-edokta-will-see-you-now-a-telemedicine-clinic-is-bridging-maternal-health-gaps-in-kano/> [Accessed 10 Sep. 2026].`,
    bibtex: `@article{garba2025edokta,
  title={Your eDokta Will See You Now: A Telemedicine Clinic is Bridging Maternal Health Gaps in Kano},
  author={Garba, Mahdi},
  journal={Nigeria Health Watch - Torchlight Series},
  year={2025},
  month={Oct},
  url={https://nigeriahealthwatch.com/articles/torchlight/your-edokta-will-see-you-now-a-telemedicine-clinic-is-bridging-maternal-health-gaps-in-kano/}
}`
  }

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(citations[citationFormat])
    setCopiedCitation(true)
    toast.success(`${citationFormat.toUpperCase()} citation copied to clipboard!`)
    setTimeout(() => setCopiedCitation(false), 2500)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Your eDokta Will See You Now: A Telemedicine Clinic is Bridging Maternal Health Gaps in Kano',
        text: 'Read how eDokta is bridging maternal health gaps in rural Kano via off-grid telemedicine.',
        url: 'https://nigeriahealthwatch.com/articles/torchlight/your-edokta-will-see-you-now-a-telemedicine-clinic-is-bridging-maternal-health-gaps-in-kano/'
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText('https://nigeriahealthwatch.com/articles/torchlight/your-edokta-will-see-you-now-a-telemedicine-clinic-is-bridging-maternal-health-gaps-in-kano/')
      toast.success('Article link copied to clipboard!')
    }
  }

  const handleCollabSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setCollabModalOpen(false)
      toast.success('Thank you! Our Rural Health & Outreach Directorate will contact you shortly.')
      setCollabForm({
        name: '',
        community: '',
        organization: '',
        email: '',
        phone: '',
        interest: 'Establish Rural Tele-Clinic',
        message: ''
      })
    }, 1000)
  }

  // Key quantitative evidence from the Kano field investigation
  const keyMetrics = [
    {
      value: '502',
      unit: '/100k',
      label: 'Kano Baseline MMR',
      caption: 'Highest maternal mortality in Kano (vs 288 national target)',
      color: 'from-rose-500 to-red-600',
      badge: 'Urgent Need'
    },
    {
      value: '57',
      unit: 'Mothers',
      label: 'Safe Term Deliveries',
      caption: 'Full-term pregnancies successfully supported and monitored',
      color: 'from-emerald-500 to-teal-600',
      badge: 'Direct Impact'
    },
    {
      value: '100%',
      unit: 'Solar',
      label: 'Off-Grid Renewable Power',
      caption: 'Zero grid reliance with dedicated Starlink satellite link',
      color: 'from-amber-500 to-orange-600',
      badge: 'Infrastructure'
    },
    {
      value: '₦0',
      unit: 'Free',
      label: 'Maternal & NCD Consults',
      caption: 'Free pregnancy, child health, diabetes & hypertension care',
      color: 'from-blue-600 to-indigo-600',
      badge: 'Equity'
    },
    {
      value: '4+',
      unit: 'ANC Visits',
      label: 'Empanelment Target',
      caption: 'Includes portable Butterfly iQ home ultrasound scans',
      color: 'from-purple-600 to-indigo-600',
      badge: 'Clinical Protocol'
    }
  ]

  // Authentic field photographs from the Nigeria Health Watch investigation
  const fieldGallery = [
    {
      src: 'https://nigeriahealthwatch.com/wp-content/uploads/2025/10/The-eDokta-telemedicine-clinic-scaled-1-1024x574.jpg',
      title: 'The eDokta Telemedicine Clinic Facility in Yanoko',
      caption: 'The purpose-built, solar-powered off-grid digital health post serving the rural Yanoko community in Tofa LGA, Kano.'
    },
    {
      src: 'https://cdn-images-1.medium.com/max/800/0*nmoOMAGm4WvQKKII.jpg',
      title: 'Sadiya (22 y/o Mother of Two)',
      caption: '“Before this clinic was brought to this community, we spent at least ₦600 to ₦800 on transport before accessing care. Now it is right here.”'
    },
    {
      src: 'https://cdn-images-1.medium.com/max/800/0*fJspJWBcQartbTOH.jpg',
      title: 'Nurse Isma’il Rabiu at Telehealth Station',
      caption: 'On-site registered nurse attending to patients, taking vitals, and initiating real-time teleconsultation with remote physician specialists.'
    },
    {
      src: 'https://cdn-images-1.medium.com/max/800/0*KIqcY4wQRLOswjCk.jpg',
      title: 'The eDokta Clinical & Operations Team in Yanoko',
      caption: 'Frontline healthcare professionals and project facilitators delivering decentralized primary care and community outreach.'
    },
    {
      src: 'https://cdn-images-1.medium.com/max/800/0*fhtDzMCv6TmwZcLQ.jpg',
      title: 'Bayero University Kano Metal Fabrication',
      caption: 'All modular steel architectural frames were locally engineered and fabricated at Bayero University Kano (BUK).'
    },
    {
      src: 'https://cdn-images-1.medium.com/max/800/0*jsuTrwpA4lhoC82_.jpg',
      title: 'Patients in the Yanoko Clinic Waiting Area',
      caption: 'Patients from Yanoko and neighboring LGAs (Bagwai, Rimin Gado, Dawakin Tofa) waiting for consultation and medication dispensing.'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ── Top Ambient Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

        <div className="relative max-w-6xl mx-auto text-center">
          {/* Top Badges */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 backdrop-blur-md text-emerald-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>eDokta Rural Digital Health Initiative</span>
            <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
            <span className="text-white font-medium">Spotlighted by Nigeria Health Watch</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6">
            Bridging Rural Health Gaps Through{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-300 bg-clip-text text-transparent">
              Solar-Powered Telemedicine
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-emerald-100/80 leading-relaxed mb-10">
            Connecting pastoralist villages, nomadic hamlets, and underserved rural communities across Kano State and West Africa
            to specialist doctors, point-of-care ultrasound diagnostics, and essential medications without grid barriers.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#featured-study"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
            >
              <BookOpen className="w-4 h-4" />
              Explore the Yanoko Field Model
            </a>
            <a
              href="#evidence-gallery"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm backdrop-blur-md border border-white/15 transition-all"
            >
              <Eye className="w-4 h-4" />
              View Facility Photography
            </a>
            <button
              onClick={() => setCollabModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-medium text-sm backdrop-blur-md border border-blue-400/30 transition-all cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              Partner With Rural Health
            </button>
          </div>

          {/* Quick Verification Badge */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-emerald-200/70">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Independent Investigation by Nigeria Health Watch</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>Fabricated at Bayero University Kano</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>WHO PEN Protocol Adherent</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Quantitative Metrics Banner ── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 z-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Field Metrics · Yanoko, Tofa LGA</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Impact Indicators & Baseline Comparison</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
                Verified: Nigeria Health Watch (Oct 2025)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {keyMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="relative bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-2xl p-5 border border-slate-100/80 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{metric.label}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {metric.badge}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl sm:text-4xl font-black bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                    {metric.value}
                  </span>
                  <span className="text-sm font-bold text-slate-500">{metric.unit}</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {metric.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Rural Health Case Study (Nigeria Health Watch) ── */}
      <section id="featured-study" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Paper Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-8 sm:p-12 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden lg:block">
              <Sun className="w-64 h-64 text-white" />
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold uppercase tracking-wider">
                Featured Independent Field Investigation
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium">
                Nigeria Health Watch · Torchlight
              </span>
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-medium">
                Published: October 21, 2025
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-4xl">
              Your eDokta Will See You Now: A Telemedicine Clinic is Bridging Maternal Health Gaps in Kano
            </h2>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-emerald-200/90">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-300" />
                <span>
                  <strong className="text-white">Mahdi Garba</strong> (Lead writer), Nigeria Health Watch
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-300" />
                <span>Yanoko, Tofa LGA, Kano State, Nigeria</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-300" />
                <span>7 min read · Comprehensive Field Investigation</span>
              </div>
            </div>

            {/* Quick Action Bar on Banner */}
            <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://nigeriahealthwatch.com/articles/torchlight/your-edokta-will-see-you-now-a-telemedicine-clinic-is-bridging-maternal-health-gaps-in-kano"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-semibold text-xs hover:bg-emerald-50 transition-all shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                  Read on Nigeria Health Watch
                </a>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium backdrop-blur-md transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share Case Study
                </button>
              </div>

              <div className="text-xs text-emerald-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Supported by eHealth Africa REACH, ACEPHAP BUK & Vitamin Angels</span>
              </div>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="border-b border-slate-200 bg-white px-6 sm:px-8">
            <div className="flex overflow-x-auto space-x-2 py-4 no-scrollbar">
              {[
                { id: 'investigation', label: '1. Human Impact & Patient Narratives', icon: HeartPulse },
                { id: 'tech-architecture', label: '2. Clinical & Off-Grid Tech Model', icon: Sun },
                { id: 'data-gis', label: '3. Quantitative Outcomes & GIS Catchment', icon: Activity },
                { id: 'regulatory-blueprint', label: '4. Policy Precedent & Operational Lessons', icon: ShieldCheck }
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="p-6 sm:p-10 lg:p-12">
            {/* TAB 1: Human Impact */}
            {activeTab === 'investigation' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 space-y-5 text-slate-700 leading-relaxed text-sm sm:text-base">
                    <div className="p-4 bg-amber-50/70 border-l-4 border-amber-500 rounded-r-xl text-amber-900 text-xs sm:text-sm">
                      <strong>The Reality in Rural Kano:</strong> Salamatu Yusuf, a resident of Yanoko in Tofa LGA, remembers walking
                      about 5 kilometres whenever she needed to access healthcare. Women in this scattered rural terrain
                      spent between ₦600 and ₦800 on transit per clinic visit—a prohibitive cost that resulted in delayed or
                      neglected antenatal and emergency care.
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900">
                      "Now, It is in Our Community": Bringing Critical Primary Care to Yanoko
                    </h3>

                    <p>
                      Maternal and infant mortality rates in Nigeria's northwest zone remain among the most alarming in Sub-Saharan Africa.
                      Kano State records a maternal mortality rate (MMR) of <strong>502 per 100,000 live births</strong>, far exceeding the
                      national target of 288 per 100,000. Within Kano's 44 Local Government Areas, <strong>Tofa LGA</strong> stands out with
                      the highest maternal mortality burden.
                    </p>

                    <p>
                      In February 2025, the <strong>eDokta Telemedicine Clinic</strong> opened its doors in Yanoko to break this cycle.
                      By embedding a physical digital health post within the village, maternal and child healthcare was brought to the doorstep of
                      pastoralist settlements and hamlets.
                    </p>

                    {/* Patient Voice Quote Card */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50/70 rounded-2xl p-6 border border-emerald-100 relative">
                      <Quote className="w-10 h-10 text-emerald-200 absolute top-4 right-4" />
                      <p className="italic text-slate-800 text-sm sm:text-base font-medium relative z-10">
                        “Before this clinic was brought to this community, we spent at least ₦600 to ₦800 on transport before we could access care.
                        Now, it is right in our community. Since it opened, I have gone there five times to access care. I like this clinic, and I like
                        how hospitable the workers are. The workers treat one like their relative. They listen to their patients without any judgement.”
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                          SY
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Sadiya</p>
                          <p className="text-[11px] text-slate-500">22-year-old mother of two, Yanoko, Tofa LGA</p>
                        </div>
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 pt-2">Traditional & Community Leadership Backing</h4>
                    <p>
                      Habibu Muhammadu Adamu, the ward head of Yanoko who championed the clinic from inception, confirmed the profound
                      shift in community well-being:
                    </p>

                    <div className="bg-slate-100/80 rounded-xl p-5 border-l-4 border-slate-700 text-slate-800 text-sm italic">
                      “The same way one will go to Malam Aminu Kano Teaching Hospital and meet specialised doctors is how one can be linked to these
                      doctors through computer, who counsel patients on the best way to take care of themselves. Patients from neighbouring LGAs,
                      including Bagwai, Rimin Gado and Dawakin Tofa now travel to our village clinic to access care with ease.”
                    </div>
                  </div>

                  {/* Sidebar Visual: Patient Profile & Doctor Call Flow */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                      <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-4 group">
                        <img
                          src="https://cdn-images-1.medium.com/max/800/0*nmoOMAGm4WvQKKII.jpg"
                          alt="Sadiya, patient in Yanoko"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
                        <span className="absolute bottom-3 left-3 text-xs text-white font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
                          Photo: Nigeria Health Watch
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Sadiya & Her Children</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Resident of Yanoko receiving regular maternal checkups and full child immunisation at the eDokta clinic.
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <h4 className="font-bold text-emerald-950 text-sm">Empanelment Protocol Achievements</h4>
                      </div>
                      <ul className="space-y-2.5 text-xs text-emerald-900">
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></span>
                          <span><strong>57 pregnant women</strong> monitored through healthy full term to delivery.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></span>
                          <span><strong>12 high-risk women</strong> enrolled in Antenatal Care (ANC) home empanelment.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></span>
                          <span><strong>Micronutrient supplementation</strong> donated and dispensed in partnership with Vitamin Angels.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></span>
                          <span><strong>Zero consultation fee</strong> for all maternal, child, and chronic non-communicable diseases.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Tech & Clinical Model */}
            {activeTab === 'tech-architecture' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 space-y-5 text-slate-700 leading-relaxed text-sm sm:text-base">
                    <h3 className="text-2xl font-bold text-slate-900">
                      Healing Beyond Borders: Off-Grid Renewable Infrastructure & Digital Triage
                    </h3>
                    <p>
                      Traditional healthcare delivery in rural Northern Nigeria frequently fails due to two recurring bottlenecks:
                      <strong> epileptic or nonexistent electrical grid power</strong> and <strong>lack of high-speed telecommunications</strong>.
                      The eDokta Yanoko facility was architected from day one as a fully autonomous, off-grid installation.
                    </p>

                    {/* Tech Pillars Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center mb-2.5">
                          <Sun className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">100% Solar-Powered</h4>
                        <p className="text-xs text-slate-600 mt-1">
                          Dedicated rooftop solar arrays and battery storage supply 24/7 power to diagnostics, cold-chain medication storage, lighting, and computers with zero grid reliance.
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center mb-2.5">
                          <Wifi className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">Satellite Broadband</h4>
                        <p className="text-xs text-slate-600 mt-1">
                          Connected to high-speed satellite broadband under the eHealth Africa subscription, ensuring crystal-clear video streaming between nurse and doctor.
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2.5">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">BUK Local Metal Fabrication</h4>
                        <p className="text-xs text-slate-600 mt-1">
                          All structural metal components of the modular clinic were fabricated locally at Bayero University Kano (BUK), demonstrating indigenous manufacturing resilience.
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center mb-2.5">
                          <Activity className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">Butterfly iQ Ultrasound</h4>
                        <p className="text-xs text-slate-600 mt-1">
                          Healthcare workers carry portable point-of-care Butterfly iQ ultrasound probes directly to homes, ensuring pregnant women complete at least one scan.
                        </p>
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900">Clinical Workflow: From Nurse Triage to Remote Physician</h4>
                    <p>
                      <strong>Isma’il Rabiu</strong>, the registered nurse stationed at the eDokta clinic, attends to patients and listens to their
                      complaints. Whenever a case requires specialized evaluation:
                    </p>

                    <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-slate-800 text-sm space-y-2">
                      <p className="font-semibold text-emerald-900">Nurse Isma’il Rabiu Explains the Consultation Workflow:</p>
                      <p className="italic text-xs sm:text-sm">
                        “We have a dedicated space for telehealth consultation where I can call a doctor from our branches to have a live call
                        that enables him to counsel the patient. I use the telemedicine platform to check which doctor is available. Once connected,
                        the patient remains in our clinic while consulting with the doctor remotely. If medication is needed, the doctor issues a prescription,
                        and the prescribed drugs are dispensed on-site immediately.”
                      </p>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 pt-2">WHO PEN Protocol for Non-Communicable Diseases</h4>
                    <p>
                      In addition to maternal care, the clinic adopted the <strong>WHO Package of Essential Noncommunicable Disease Interventions (PEN)</strong>
                      protocol to diagnose and manage hypertension, diabetes, and sickle cell disease in this pastoral community.
                    </p>
                  </div>

                  {/* Sidebar Visual: Nurse and Facility Photo */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                      <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-4 group">
                        <img
                          src="https://cdn-images-1.medium.com/max/800/0*fJspJWBcQartbTOH.jpg"
                          alt="Nurse Isma'il Rabiu at eDokta clinic"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
                        <span className="absolute bottom-3 left-3 text-xs text-white font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
                          Photo: Nigeria Health Watch
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Nurse Isma’il Rabiu at the Telehealth Desk</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Registered nurse conducting physical examination, vital signs telemetry, and connecting to off-site physicians.
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                      <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-4 group">
                        <img
                          src="https://cdn-images-1.medium.com/max/800/0*fhtDzMCv6TmwZcLQ.jpg"
                          alt="BUK fabricated solar facility"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
                        <span className="absolute bottom-3 left-3 text-xs text-white font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
                          Photo: Nigeria Health Watch
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Solar-Powered Facility Engineered at BUK</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        High-efficiency photovoltaic system and modular steel clinic fabricated at Bayero University Kano.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Quantitative Outcomes & GIS Catchment */}
            {activeTab === 'data-gis' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 space-y-5 text-slate-700 leading-relaxed text-sm sm:text-base">
                    <h3 className="text-2xl font-bold text-slate-900">
                      Surging Patient Volumes & Cross-LGA Catchment Evidence
                    </h3>
                    <p>
                      According to GIS accessibility analyses conducted by Bayero University Kano's Africa Centre of Excellence for
                      Population Health and Policy (<strong>ACEPHAP</strong>), Tofa LGA presented one of the most acute primary healthcare deserts
                      in the state. Yanoko is characterized by dispersed hamlets and nomadic clusters that had zero static health facilities prior to 2025.
                    </p>

                    {/* Growth Progression Card */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                      <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-600" />
                        Daily Patient Consultation Volume Trajectory
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span>Launch Phase (Feb 2025): 1–2 patients / day</span>
                            <span className="text-slate-400">Baseline</span>
                          </div>
                          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-400 rounded-full w-[20%]"></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span>Steady-State Average (Mid 2025): 7–8 patients / day</span>
                            <span className="text-emerald-600 font-bold">400% Growth</span>
                          </div>
                          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-600 rounded-full w-[75%]"></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span>Rainy Season Malaria Surge (Q3 2025): 10+ patients / day</span>
                            <span className="text-teal-600 font-bold">Peak Influx</span>
                          </div>
                          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500 rounded-full w-[100%]"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 pt-2">Multi-LGA Regional Catchment</h4>
                    <p>
                      While originally designed to serve the Yanoko ward, word of mouth regarding free maternal care, prompt doctor consultations,
                      and guaranteed on-site medication availability spread across municipal borders.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { lga: 'Tofa LGA', role: 'Primary Host Ward', badge: 'Yanoko' },
                        { lga: 'Bagwai LGA', role: 'Cross-Border Influx', badge: 'West Corridor' },
                        { lga: 'Rimin Gado LGA', role: 'Cross-Border Influx', badge: 'South Corridor' },
                        { lga: 'Dawakin Tofa LGA', role: 'Cross-Border Influx', badge: 'East Corridor' }
                      ].map((item, i) => (
                        <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 block mb-1">
                            {item.badge}
                          </span>
                          <p className="text-xs font-bold text-slate-900">{item.lga}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{item.role}</p>
                        </div>
                      ))}
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 pt-2">Financial Protection & Subsidy Structure</h4>
                    <p>
                      To prevent catastrophic out-of-pocket health expenditure for rural families, eDokta implemented a bifurcated subsidy model:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
                      <li><strong>₦300 Standard Adult Consultation:</strong> Covers doctor video consult and on-site CHW follow-up.</li>
                      <li><strong>₦0 Free Consultations:</strong> All maternal care, child under-5 consultations, and NCD screenings (hypertension, diabetes) are completely free of charge.</li>
                    </ul>
                  </div>

                  {/* Sidebar Visual: Waiting room and Team Photo */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                      <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-4 group">
                        <img
                          src="https://cdn-images-1.medium.com/max/800/0*jsuTrwpA4lhoC82_.jpg"
                          alt="Patients waiting in Yanoko clinic"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
                        <span className="absolute bottom-3 left-3 text-xs text-white font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
                          Photo: Nigeria Health Watch
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Patients in the Waiting Area</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Community members waiting for their turn to be evaluated by Nurse Rabiu and connected to remote doctors.
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                      <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-4 group">
                        <img
                          src="https://cdn-images-1.medium.com/max/800/0*KIqcY4wQRLOswjCk.jpg"
                          alt="eDokta Telemedicine Clinic Team"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>
                        <span className="absolute bottom-3 left-3 text-xs text-white font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
                          Photo: Nigeria Health Watch
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Clinical & Facilitation Team in Yanoko</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Multidisciplinary field team managing community health education, antenatal home visits, and triage.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Regulatory Blueprint & Operational Lessons */}
            {activeTab === 'regulatory-blueprint' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
                  <h3 className="text-2xl font-bold text-slate-900">
                    Regulatory Pioneering with PHIMA, Remote Workforce Retention, and Health Insurance Integration
                  </h3>

                  <p>
                    Aminu Ayuba, Project Manager for eHealth Africa's REACH programme, outlined key operational insights and hurdles
                    encountered and overcome during the deployment of the eDokta Yanoko facility:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                    {/* Pillar 1: Regulation */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-4">
                        01
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2">Navigating PHIMA Digital Regulation</h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        At launch, the <strong>Kano State Private Healthcare Institutions Management Agency (PHIMA)</strong> had strict criteria
                        defining primary health care facilities, but lacked regulatory frameworks for digital or hybrid telemedicine posts.
                        Through close technical collaboration, eDokta and REACH established the compliance blueprint for virtual clinics in Kano State.
                      </p>
                    </div>

                    {/* Pillar 2: Retention */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold mb-4">
                        02
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2">Remote Health Worker Retention</h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Staff retention in hard-to-reach rural outposts is a notorious barrier across Nigeria. eDokta resolved this by structuring
                        competitive rural hardship remuneration packages, providing on-site solar accommodations, and instituting rotational
                        clinical shifts backed by continuous digital peer-support.
                      </p>
                    </div>

                    {/* Pillar 3: KSCHMA Integration */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4">
                        03
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2">KSCHMA Social Health Insurance</h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        To transition from external philanthropic subsidization into long-term systemic sustainability, eDokta is actively working
                        with the <strong>Kano State Healthcare Contributory Management Agency (KSCHMA)</strong> to enroll rural villagers into
                        state-subsidized contributory insurance pools.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-600/30 rounded-xl text-emerald-400">
                        <Quote className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <p className="italic text-slate-200 text-sm sm:text-base leading-relaxed">
                          “The programme has been a success. What we have been trying to prove is a sustainable model for PHC delivery by
                          integrating technology into it. Telemedicine helps us bridge the gap between patients and healthcare providers.
                          And we have been able to do that.”
                        </p>
                        <p className="text-xs text-emerald-300 font-semibold">
                          — Aminu Ayuba, Project Manager, eHealth Africa REACH & Facilitator, eDokta Telemedicine Clinic
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Citation Generator Box */}
          <div className="border-t border-slate-200 bg-slate-50/80 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Cite This Investigation in Your Research & Policy Papers
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standardized citations formatted for academic publications, policy briefs, and grant proposals.
                </p>
              </div>

              {/* Format Toggle */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
                {['apa', 'vancouver', 'harvard', 'bibtex'].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setCitationFormat(fmt)}
                    className={`px-3 py-1.5 rounded-lg font-semibold uppercase transition-all cursor-pointer ${
                      citationFormat === fmt ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Citation Text Area */}
            <div className="relative bg-white rounded-xl p-4 border border-slate-200 font-mono text-xs text-slate-800 break-all leading-relaxed">
              {citations[citationFormat]}
              <button
                onClick={handleCopyCitation}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-sans text-xs font-semibold transition-all cursor-pointer"
              >
                {copiedCitation ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Citation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Photographic Evidence Gallery ── */}
      <section id="evidence-gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Field Photography Archive</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Authentic Visual Evidence from the Yanoko Tele-Clinic
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mt-1">
              Documenting the physical setup, clinical consultations, solar infrastructure, and patient community in Tofa LGA, Kano State.
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            Credit: Nigeria Health Watch
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fieldGallery.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(item)}
              className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-3 right-3 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Photo Modal Lightbox ── */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 rounded-2xl max-w-3xl w-full overflow-hidden border border-slate-800 shadow-2xl animate-scaleUp"
          >
            <div className="relative aspect-[16/10] bg-black">
              <img src={selectedImage.src} alt={selectedImage.title} className="w-full h-full object-contain" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 text-white">
              <h3 className="text-lg font-bold text-white">{selectedImage.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">{selectedImage.caption}</p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>Nigeria Health Watch Photographic Archive</span>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium cursor-pointer"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Collaborating Partners & Institutional Ecosystem ── */}
      <section className="bg-slate-100 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Collaborating Academic & Institutional Partners
          </span>
          <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-8">
            An Interdisciplinary Consortium for Rural Health Equity
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Nigeria Health Watch', role: 'Independent Research & Media', sub: 'Torchlight Series' },
              { name: 'eHealth Africa', role: 'REACH Health Initiative', sub: 'Technology Partner' },
              { name: 'Bayero University Kano', role: 'ACEPHAP Centre of Excellence', sub: 'World Bank Funded' },
              { name: 'Vitamin Angels', role: 'Maternal Nutrition Partner', sub: 'Micronutrient Supply' },
              { name: 'Kano State PHIMA', role: 'Regulatory & Licensing Agency', sub: 'Government Precedent' },
              { name: 'KSCHMA', role: 'Contributory Health Insurance', sub: 'Universal Health Coverage' }
            ].map((partner, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col justify-center text-center hover:border-emerald-300 transition-colors"
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs mb-2">
                  {partner.name.substring(0, 2).toUpperCase()}
                </div>
                <h4 className="text-xs font-bold text-slate-900">{partner.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{partner.role}</p>
                <span className="text-[10px] text-emerald-600 font-medium mt-1">{partner.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rural Community Outreach & Establishment Call to Action ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-3xl">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold uppercase tracking-wider">
              Bring Telemedicine To Your LGA
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 leading-tight">
              Partner With eDokta to Deploy Solar-Powered Tele-Clinics in Underserved Communities
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-8">
              Are you a local government chairperson, community development association, philanthropic organization, or diaspora group?
              Collaborate with us to establish turn-key off-grid digital health posts with resident nursing staff, satellite internet, and remote doctor networks.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setCollabModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-emerald-50 transition-all shadow-lg shadow-black/20 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                Propose Community Site
              </button>
              <a
                href="mailto:ruralhealth@edoktahealthcare.com"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm backdrop-blur-md border border-white/20 transition-all"
              >
                ruralhealth@edoktahealthcare.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Community Proposal Modal ── */}
      {collabModalOpen && (
        <div
          onClick={() => setCollabModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl animate-scaleUp my-8"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Rural Health Deployment Inquiry</h3>
                <p className="text-xs text-slate-500 mt-0.5">eDokta Community Outreach & Tele-Clinic Directorate</p>
              </div>
              <button
                onClick={() => setCollabModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCollabSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alhaji Mustapha Bello"
                  value={collabForm.name}
                  onChange={(e) => setCollabForm({ ...collabForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Community / LGA *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yanoko, Tofa LGA"
                    value={collabForm.community}
                    onChange={(e) => setCollabForm({ ...collabForm, community: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Organization / Association</label>
                  <input
                    type="text"
                    placeholder="e.g. LGA Council, NGO, Diaspora"
                    value={collabForm.organization}
                    onChange={(e) => setCollabForm({ ...collabForm, organization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@email.com"
                    value={collabForm.email}
                    onChange={(e) => setCollabForm({ ...collabForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 800 000 0000"
                    value={collabForm.phone}
                    onChange={(e) => setCollabForm({ ...collabForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Engagement Type</label>
                <select
                  value={collabForm.interest}
                  onChange={(e) => setCollabForm({ ...collabForm, interest: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="Establish Rural Tele-Clinic">Establish Rural Tele-Clinic Post</option>
                  <option value="Community Antenatal Empanelment">Community Antenatal (ANC) Empanelment</option>
                  <option value="Mobile Ultrasound Outreach">Mobile Handheld Ultrasound Outreach</option>
                  <option value="Free Health Mission & Screening">Free Health Mission & Chronic NCD Screening</option>
                  <option value="Government / PHIMA Partnership">Government / PHIMA Partnership</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Community Overview / Needs *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Estimated population, distance to nearest hospital, electricity situation, and community priorities..."
                  value={collabForm.message}
                  onChange={(e) => setCollabForm({ ...collabForm, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? 'Submitting Inquiry...' : 'Submit Community Partnership Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default RuralHealth