import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Shield,
  Award,
  Briefcase,
  CheckCircle,
  FileText,
  Users,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Lock,
  Target,
  UserCheck,
  Building2,
  Flag,
  Download,
} from "lucide-react";
import Button from "../components/ui/Button";

const Capabilities = () => {
  const handleDownloadPDF = () => {
    // Create a link to the PDF file in the public folder
    const pdfUrl = "/mtmkay-capabilities-statement.pdf";
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "MTMKay-Capabilities-Statement.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const competencies = [
    {
      category: "Cybersecurity & Compliance",
      items: [
        "Cybersecurity assessments & vulnerability scanning",
        "ACAS / Nessus operations and reporting",
        "DoD cybersecurity readiness support",
        "Cybersecurity evaluations and risk identification",
        "Vulnerability remediation guidance",
        "Audit-ready compliance documentation",
      ],
      icon: Shield,
    },
    {
      category: "IT Infrastructure & Support",
      items: [
        "IT support and technical program administration",
        "Network troubleshooting and optimization",
        "Server and systems administration",
        "Hardware/software deployment and maintenance",
        "Help desk and end-user support",
        "Cloud infrastructure management",
      ],
      icon: Shield,
    },
    {
      category: "Program Management & Consulting",
      items: [
        "Technology integration and digital transformation",
        "Program management and technical documentation",
        "Technology consulting and modernization support",
        "Process improvement and workflow optimization",
        "Strategic IT planning and roadmap development",
        "Quality assurance and control",
      ],
      icon: Shield,
    },
  ];

  const differentiators = [
    {
      icon: Award,
      title: "Service-Disabled Veteran-Owned",
      description:
        "SDVOSB certified with proven military discipline and mission-focused approach",
      color: "blue",
    },
    {
      icon: Shield,
      title: "DoD Systems Expertise",
      description:
        "ACAS / Nessus certified with hands-on experience in defense environments",
      color: "green",
    },
    {
      icon: Target,
      title: "Military-Grade Precision",
      description:
        "Aviation maintenance and QAR oversight background ensuring zero-defect execution",
      color: "purple",
    },
    {
      icon: Lock,
      title: "Security-First Approach",
      description:
        "Compliance-focused solutions built on top secret cleared experience",
      color: "red",
    },
  ];

  const certifications = [
    { name: "SAM Registered", icon: FileText },
    { name: "Top Secret Security Clearance", icon: Lock },
    { name: "CompTIA Security+", icon: Shield },
    { name: "CompTIA A+", icon: Shield },
    { name: "CompTIA Network+", icon: Shield },
    { name: "ACAS Certified", icon: Shield },
    { name: "DoD Cybersecurity Certified", icon: UserCheck },
  ];

  const naicsCodes = [
    "541512",
    "541513",
    "541519",
    "541611",
    "541690",
    "561210",
    "611430",
    "611519",
    "721199",
  ];

  const scrollToCoreCompetencies = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("core-competencies");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Capabilities Statement | MTMKay - SDVOSB IT & Cybersecurity Solutions
        </title>
        <meta
          name="description"
          content="MTMKay is a Service-Disabled Veteran-Owned Small Business (SDVOSB) delivering secure, reliable IT and cybersecurity solutions for government and commercial clients."
        />
        <meta
          name="keywords"
          content="SDVOSB, IT consulting, cybersecurity, ACAS, Nessus, DoD, veteran-owned, government contracting"
        />
        <link rel="canonical" href="https://mtmkay.com/capabilities-statement" />
      </Helmet>

      <div className="capabilities-content">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-dark to-gray-900 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>
          <div className="absolute inset-0 bg-black/10" />
          <div className="container mx-auto px-4 py-24 md:py-32 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Capabilities Statement
              </h1>
              <p className="text-lg md:text-xl mb-6 text-gray-200 max-w-3xl mx-auto">
                Delivering secure, reliable IT and cybersecurity solutions
                strengthened by military precision and DoD expertise.
              </p>

              {/* SDVOSB Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Flag size={16} className="text-yellow-400" />
                <span className="text-xs md:text-sm font-medium">
                  Service-Disabled Veteran-Owned Small Business (SDVOSB)
                </span>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asLink
                  to="/contact"
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  Request Capabilities Package
                </Button>
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Download size={20} />
                  Download PDF
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                  Who We Are
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
                  Company Overview
                </h2>
                <div className="prose prose-sm md:prose-lg text-gray-600 space-y-3">
                  <p>
                    <span className="font-bold text-gray-900">MTMKay</span> is a
                    Service-Disabled Veteran-Owned Small Business (SDVOSB)
                    providing reliable IT and cybersecurity support grounded in
                    hands-on U.S. Navy experience. With a foundation in aviation
                    maintenance oversight, enterprise IT environments, and quality
                    assurance, we deliver structured and dependable technology
                    solutions.
                  </p>
                  <p>
                    Based in Florida, MTMKay supports organizations with secure,
                    efficient technology services with a strong focus on accuracy,
                    accountability, and mission alignment. Through innovation and
                    strong industry partnerships, we help organizations modernize,
                    improve performance, and adapt to evolving technology demands.
                  </p>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="border-l-4 border-primary pl-3">
                    <div className="text-2xl font-bold text-primary">10+</div>
                    <div className="text-xs text-gray-600">Years Experience</div>
                  </div>
                  <div className="border-l-4 border-primary pl-3">
                    <div className="text-2xl font-bold text-primary">100%</div>
                    <div className="text-xs text-gray-600">Mission Focused</div>
                  </div>
                  <div className="border-l-4 border-primary pl-3">
                    <div className="text-2xl font-bold text-primary">TS/SCI</div>
                    <div className="text-xs text-gray-600">Clearance Ready</div>
                  </div>
                  <div className="border-l-4 border-primary pl-3">
                    <div className="text-2xl font-bold text-primary">SDVOSB</div>
                    <div className="text-xs text-gray-600">Certified</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Building2 size={18} className="text-primary" />
                    Business Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600 text-sm">UEI</span>
                      <span className="font-mono font-semibold text-sm">
                        N6TVP1A8K7J1
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600 text-sm">CAGE Code</span>
                      <span className="font-mono font-semibold text-sm">9V6S7</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Business Type</span>
                      <span className="font-semibold text-primary text-sm">SDVOSB</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Competencies */}
        <section id="core-competencies" className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-8 md:mb-12"
            >
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                What We Do
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-3">
                Core Competencies
              </h2>
              <p className="text-gray-600">
                Comprehensive IT and cybersecurity capabilities backed by DoD
                expertise
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {competencies.map((competency, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                      <competency.icon size={20} />
                    </div>
                    <h3 className="text-lg font-bold">{competency.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {competency.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Differentiators */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-8 md:mb-12"
            >
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Why Choose Us
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-3">
                Our Differentiators
              </h2>
              <p className="text-gray-600">
                What sets MTMKay apart in the federal and commercial marketplace
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {differentiators.map((item, index) => {
                const colorClasses = {
                  blue: "bg-blue-100 text-blue-600",
                  green: "bg-green-100 text-green-600",
                  purple: "bg-purple-100 text-purple-600",
                  red: "bg-red-100 text-red-600",
                };

                return (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center ${colorClasses[item.color as keyof typeof colorClasses]}`}
                    >
                      <item.icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Certifications & NAICS */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Certifications */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
                  <Award size={24} className="text-primary" />
                  Licenses & Certifications
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
                    >
                      <cert.icon size={18} className="text-primary flex-shrink-0" />
                      <span className="text-gray-700 text-sm font-medium">
                        {cert.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Government Information */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
                  <FileText size={24} className="text-primary" />
                  Government Information
                </h2>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Unique Entity ID (UEI)</p>
                      <p className="font-mono font-bold text-lg">N6TVP1A8K7J1</p>
                      <p className="text-xs text-gray-400 mt-1">SAM Registered • Active</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">CAGE Code</p>
                      <p className="font-mono font-bold text-lg">9V6S7</p>
                      <p className="text-xs text-gray-400 mt-1">DLA Verified</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-700">NAICS Codes</h4>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {naicsCodes.length} Codes
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {naicsCodes.map((code, index) => (
                        <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                          <span className="font-mono text-sm font-bold text-primary">
                            {code}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      Full range of IT consulting, cybersecurity, training, and professional services
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notable Clients */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                <Users size={24} className="text-primary" />
                Notable Clientele
              </h2>
              <p className="text-gray-600 mb-8">
                Proud to serve and support mission-critical operations
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield size={28} className="text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-lg">NETC Pensacola</p>
                      <p className="text-gray-600 text-sm">Naval Education and Training Command</p>
                      <p className="text-gray-500 text-xs mt-1">IT Support & Cybersecurity Readiness</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border-2 border-dashed border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Building2 size={28} className="text-gray-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-600">Additional Clients</p>
                      <p className="text-gray-400 text-sm">References available upon request</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 md:py-16 bg-primary-dark text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  Ready to Partner with MTMKay?
                </h2>
                <p className="text-gray-200">
                  Contact our government POC to discuss your requirements
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <UserCheck size={20} className="text-white flex-shrink-0" />
                    <div>
                      <p className="text-xs text-white/70">Government POC</p>
                      <p className="font-semibold">Michael Mbu</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-white flex-shrink-0" />
                    <div>
                      <p className="text-xs text-white/70">Phone</p>
                      <a href="tel:+16122241176" className="hover:text-white">+1 (612) 224-1176</a>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-white flex-shrink-0" />
                    <div>
                      <p className="text-xs text-white/70">Email</p>
                      <a href="mailto:mbu.michael@mtmkay.com" className="text-sm hover:text-white break-all">
                        mbu.michael@mtmkay.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <Globe size={20} className="text-white flex-shrink-0" />
                    <div>
                      <p className="text-xs text-white/70">Website</p>
                      <a href="https://mtmkay.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                        mtmkay.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <Button
                  asLink
                  to="/contact"
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  Request Full Capabilities Package
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Capabilities;