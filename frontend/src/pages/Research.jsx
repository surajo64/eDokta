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
  Eye
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const Research = () => {
  const [citationFormat, setCitationFormat] = useState('apa')
  const [copiedCitation, setCopiedCitation] = useState(false)
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [collabModalOpen, setCollabModalOpen] = useState(false)
  const [collabForm, setCollabForm] = useState({
    name: '',
    institution: '',
    email: '',
    role: '',
    interest: 'Maternal & Child Health Telemedicine',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Standardized citations for eDokta's featured research
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

  const handleCollabSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setCollabModalOpen(false)
      toast.success('Thank you! Our Research Directorate will contact you shortly.')
      setCollabForm({
        name: '',
        institution: '',
        email: '',
        role: '',
        interest: 'Maternal & Child Health Telemedicine',
        message: ''
      })
    }, 1000)
  }

  // Research initiatives, papers and protocols
  const researchPapers = [
    {
      id: 'kano-maternal-telemed-2025',
      category: 'Maternal & Child Health',
      type: 'Field Investigation & Case Study',
      title: 'Your eDokta Will See You Now: A Telemedicine Clinic is Bridging Maternal Health Gaps in Kano',
      authors: 'Mahdi Garba (Lead Writer), Nigeria Health Watch & eDokta Research Group',
      date: 'October 21, 2025',
      readTime: '7 min read',
      institution: 'Nigeria Health Watch (Torchlight Series) in collaboration with eHealth Africa & ACEPHAP BUK',
      doi: 'NHW-TORCHLIGHT-2025-EDOKTA-KAN01',
      summary:
        'An independent field study of the off-grid solar-powered eDokta telemedicine clinic in Yanoko, Tofa LGA, Kano, demonstrating how integrating satellite connectivity, remote doctors, point-of-care ultrasound, and community CHWs eliminates financial and geographic barriers in Nigerias highest maternal mortality corridor.',
      featured: true,
      linkToRural: true,
      tags: ['Telemedicine', 'Maternal Mortality', 'Point-of-Care Ultrasound', 'Kano State', 'Off-Grid Health', 'WHO PEN']
    },
    {
      id: 'pocus-rural-antenatal-2026',
      category: 'Diagnostic Technology',
      type: 'Whitepaper & Technical Brief',
      title: 'Decentralizing Antenatal Diagnostics: Field Evaluation of Handheld Butterfly iQ Ultrasound Probes in Rural Kano',
      authors: 'Aminu Ayuba, Isma’il Rabiu, Dr. S. U. Danja et al.',
      date: 'January 2026',
      readTime: '11 min read',
      institution: 'eDokta Research Labs & Bayero University Kano (ACEPHAP)',
      doi: 'EDK-WP-2026-POCUS-04',
      summary:
        'Clinical trial evaluating diagnostic concordance and patient compliance with home-visit point-of-care ultrasound (POCUS) administered by trained community midwives and nurses across nomadic hamlets in Tofa and Bagwai LGAs.',
      featured: false,
      tags: ['POCUS', 'Butterfly iQ', 'Antenatal Empanelment', 'Community Health', 'Ultrasound']
    },
    {
      id: 'offgrid-solar-sat-telemed-2025',
      category: 'Health Systems & Infrastructure',
      type: 'Engineering & Operational Study',
      title: 'Off-Grid Renewable Power and Satellite Broadband Architecture for Primary Health Teleconsultation: A 12-Month Resilience Audit',
      authors: 'eHealth Africa Engineering Team & eDokta Technical Group',
      date: 'December 2025',
      readTime: '9 min read',
      institution: 'eHealth Africa REACH & eDokta Infrastructure Directorate',
      doi: 'EDK-TR-2025-ENERGY-09',
      summary:
        'Technical blueprint and resilience analysis of completely grid-independent solar microgrids paired with low-earth-orbit satellite internet in rural Northern Nigeria, maintaining 99.4% uptime across intense Harmattan and rainy seasons.',
      featured: false,
      tags: ['Solar Energy', 'Satellite Connectivity', 'Digital PHC', 'Harmattan Resilience', 'Off-Grid']
    },
    {
      id: 'who-pen-telehealth-ncd-2026',
      category: 'Chronic Disease & NCDs',
      type: 'Clinical Protocol Evaluation',
      title: 'Digital Implementation of the WHO PEN Protocol for Hypertension, Diabetes and Sickle Cell Disease at Rural Tele-Clinics',
      authors: 'Clinical Directorate, eDokta Healthcare in partnership with Vitamin Angels',
      date: 'February 2026',
      readTime: '8 min read',
      institution: 'eDokta Clinical Advisory Board',
      doi: 'EDK-CR-2026-WHOPEN-02',
      summary:
        'Assessment of community-level screening, remote clinician therapy titration, and on-site dispensing adherence for non-communicable diseases and sickle cell anemia across rural pastoralist demographics.',
      featured: false,
      tags: ['WHO PEN', 'Hypertension', 'Diabetes', 'Sickle Cell', 'Chronic Care', 'Free Healthcare']
    }
  ]

  const filteredPapers = researchPapers.filter(paper => {
    const matchesCategory = filterCategory === 'all' || paper.category.toLowerCase().includes(filterCategory.toLowerCase())
    const matchesSearch =
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ── Top Ambient Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-md text-blue-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>eDokta Evidence & Research Directorate</span>
            <span className="w-1 h-1 rounded-full bg-blue-400"></span>
            <span className="text-emerald-400 font-medium">Peer-Reviewed & Field-Investigated</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6">
            Digital Health Research &{' '}
            <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
              Clinical Evidence Portal
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-blue-100/80 leading-relaxed mb-10">
            Translating cutting-edge telemedicine, point-of-care diagnostics, and off-grid renewable infrastructure
            into validated scientific evidence for health equity across Sub-Saharan Africa.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/ruralhealth"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              <BookOpen className="w-4 h-4" />
              View Flagship Kano Field Study
            </Link>
            <a
              href="#publications"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm backdrop-blur-md border border-white/15 transition-all"
            >
              <FileText className="w-4 h-4" />
              Browse Publications Library
            </a>
            <button
              onClick={() => setCollabModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white font-medium text-sm backdrop-blur-md border border-emerald-400/30 transition-all cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              Research Collaboration
            </button>
          </div>
        </div>
      </section>

      {/* ── Featured Study Highlight Card (Spotlight) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 shadow-md">
              <img
                src="https://nigeriahealthwatch.com/wp-content/uploads/2025/10/The-eDokta-telemedicine-clinic-scaled-1-1024x574.jpg"
                alt="eDokta clinic in Yanoko"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-xs text-white">
                <span className="bg-emerald-600/90 px-2.5 py-1 rounded-md font-semibold">
                  Nigeria Health Watch Torchlight
                </span>
                <span className="bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-[11px]">
                  Tofa LGA, Kano State
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Featured Case Study
                </span>
                <span className="text-xs text-slate-400">October 21, 2025</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">Lead Writer: Mahdi Garba</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Your eDokta Will See You Now: A Telemedicine Clinic is Bridging Maternal Health Gaps in Kano
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                An independent investigation exploring how eDokta's solar-powered, satellite-connected tele-clinic in Yanoko,
                Tofa LGA addresses Northern Nigeria's highest maternal mortality baseline (502/100k live births) through remote
                specialist consultations, point-of-care Butterfly iQ ultrasound home scans, and 100% free maternal care.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/ruralhealth"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Read Full Rural Health Model & Data
                </Link>
                <a
                  href="https://nigeriahealthwatch.com/articles/torchlight/your-edokta-will-see-you-now-a-telemedicine-clinic-is-bridging-maternal-health-gaps-in-kano"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Original Nigeria Health Watch Article
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Research Citation Box ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Cite eDokta Research in Your Publications
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Copy formatted academic references directly into your papers, grant proposals, and policy briefings.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              {['apa', 'vancouver', 'harvard', 'bibtex'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setCitationFormat(fmt)}
                  className={`px-3 py-1.5 rounded-lg font-semibold uppercase transition-all cursor-pointer ${
                    citationFormat === fmt ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="relative bg-slate-50 rounded-xl p-4 border border-slate-200 font-mono text-xs text-slate-800 break-all leading-relaxed">
            {citations[citationFormat]}
            <button
              onClick={handleCopyCitation}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-blue-700 hover:bg-blue-50 font-sans text-xs font-semibold border border-slate-200 shadow-sm transition-all cursor-pointer"
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
      </section>

      {/* ── Research Pillars ── */}
      <section className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              Strategic Research Agenda
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
              Core Scientific Pillars of Investigation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Baby,
                color: 'text-rose-600 bg-rose-50 border-rose-100',
                title: 'Maternal & Newborn Care (MNCH)',
                desc: 'Overcoming obstetric referral deserts, achieving 4+ ANC compliance, and using tele-ultrasound to detect high-risk pregnancies early in rural communities.'
              },
              {
                icon: Sun,
                color: 'text-amber-600 bg-amber-50 border-amber-100',
                title: 'Off-Grid Health Infrastructure',
                desc: 'Engineering resilient solar microgrids, local structural metal fabrication, and low-earth-orbit satellite communications resilient to extreme climates.'
              },
              {
                icon: Stethoscope,
                color: 'text-blue-600 bg-blue-50 border-blue-100',
                title: 'Point-of-Care Handheld Diagnostics',
                desc: 'Deploying portable ultrasound probes (Butterfly iQ), digitized stethoscopes, and rapid telemetry devices for home-visit community triage.'
              },
              {
                icon: ShieldCheck,
                color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
                title: 'Digital Health Policy & UHC',
                desc: 'Collaborating with state regulators (PHIMA) and health insurance agencies (KSCHMA) to establish sustainable digital primary healthcare legal standards.'
              }
            ].map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${pillar.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{pillar.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Working Papers & Publications Library ── */}
      <section id="publications" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Publications & Repository</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Field Studies, Whitepapers & Clinical Protocols
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mt-1">
              Access working papers, technical reports, and clinical evaluation protocols authored by eDokta researchers and collaborating institutions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search publications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-60"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="maternal">Maternal & Child Health</option>
              <option value="diagnostic">Diagnostic Technology</option>
              <option value="infrastructure">Infrastructure & Systems</option>
              <option value="chronic">Chronic Disease (WHO PEN)</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold">
                    {paper.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                    {paper.type}
                  </span>
                  {paper.featured && (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                      ★ Landmark Study
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {paper.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {paper.readTime}
                  </span>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {paper.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {paper.summary}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  <span>Author(s): <strong>{paper.authors}</strong></span>
                  <span className="mx-2">·</span>
                  <span className="text-slate-400">DOI: {paper.doi}</span>
                </div>

                <div className="flex items-center gap-2">
                  {paper.linkToRural ? (
                    <Link
                      to="/ruralhealth"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      View Rural Health Case Study
                    </Link>
                  ) : (
                    <button
                      onClick={() => toast.info('This working paper is available for accredited researchers. Please submit a collaboration request.')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Request Working Draft
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Research Collaboration Modal ── */}
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
                <h3 className="text-xl font-bold text-slate-900">Research Collaboration Proposal</h3>
                <p className="text-xs text-slate-500 mt-0.5">eDokta Evidence & Field Studies Directorate</p>
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
                <label className="block font-semibold text-slate-700 mb-1">Principal Investigator / Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Fatima Aliyu"
                  value={collabForm.name}
                  onChange={(e) => setCollabForm({ ...collabForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Institution / University *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bayero University Kano"
                    value={collabForm.institution}
                    onChange={(e) => setCollabForm({ ...collabForm, institution: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@university.edu"
                    value={collabForm.email}
                    onChange={(e) => setCollabForm({ ...collabForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Research Area of Interest</label>
                <select
                  value={collabForm.interest}
                  onChange={(e) => setCollabForm({ ...collabForm, interest: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Maternal & Child Health Telemedicine">Maternal & Child Health Telemedicine</option>
                  <option value="Handheld Ultrasound (POCUS) Evaluation">Handheld Ultrasound (POCUS) Evaluation</option>
                  <option value="Off-Grid Solar & Satellite Health Posts">Off-Grid Solar & Satellite Health Posts</option>
                  <option value="WHO PEN Chronic Disease Management">WHO PEN Chronic Disease Management</option>
                  <option value="Health Financing & UHC Insurance (KSCHMA)">Health Financing & UHC Insurance (KSCHMA)</option>
                  <option value="Digital Health Regulation (PHIMA)">Digital Health Regulation (PHIMA)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Proposal Overview / Objective *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Brief summary of your research inquiry or desired dataset access..."
                  value={collabForm.message}
                  onChange={(e) => setCollabForm({ ...collabForm, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? 'Submitting Proposal...' : 'Submit Collaboration Inquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Research
