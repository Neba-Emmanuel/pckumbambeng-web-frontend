import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { teamData } from "../data/team";
import Card from "../components/ui/Card";
import {
  Target,
  Eye,
  Award,
  Users,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Globe,
  Lightbulb,
  Handshake,
} from "lucide-react";

const About: React.FC = () => {
  const partners = [
    { id: 1, name: "Cisco", logo: "/cisco.png", alt: "Cisco Partner" },
    {
      id: 2,
      name: "CompTIA",
      logo: "/comptia.png",
      alt: "CompTIA Partner",
    },
    {
      id: 3,
      name: "Microsoft",
      logo: "/microsoft.png",
      alt: "Microsoft Partner",
    },
    {
      id: 4,
      name: "Palo Alto",
      logo: "/paloalto.jpg",
      alt: "Palo Alto Networks Partner",
    },
    {
      id: 5,
      name: "LIMPS LTD",
      logo: "/limps-ltd.jpeg",
      alt: "LIMPS LTD Social Innovation Partner",
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - MTMKay Technology, Consulting & Real Estate</title>
        <meta
          name="description"
          content="Learn about MTMKay's mission, vision, and the expert team dedicated to your success in the IT industry."
        />
        <link rel="canonical" href="https://www.mtmkay.com/about" />
      </Helmet>

      {/* Page Header */}
      <header className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2 text-lg"
          >
            Your Trusted IT Consulting & Tech Training Hub in Kumba
          </motion.p>
        </div>
      </header>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <div className="flex items-center mb-4">
              <Target className="text-primary mr-4" size={40} />
              <h3 className="text-2xl font-bold">Our Mission</h3>
            </div>
            <p className="text-gray-600">
              To provide accessible, high-quality IT education and consultancy
              that equips our clients with practical skills and strategic
              advantages, fostering innovation and driving career and business
              growth.
            </p>
          </Card>
          <Card className="p-8">
            <div className="flex items-center mb-4">
              <Eye className="text-primary mr-4" size={40} />
              <h3 className="text-2xl font-bold">Our Vision</h3>
            </div>
            <p className="text-gray-600">
              To be a leading global IT hub recognized for creating a new
              generation of tech leaders and for transforming businesses through
              technology.
            </p>
          </Card>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
            >
              <img
                src="/who_we_are.jpg"
                alt="Team working"
                className="rounded-lg shadow-xl"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                MTMKay Technology Solutions is a premier IT consulting and tech 
                training hub dedicated to bridging the digital divide in the Southwest Region. 
                By combining deep technical expertise with strategic partnerships, we deliver 
                tailored strategies from advanced cybersecurity to full-stack web development. 
                Our mission is to empower local businesses and individuals to meet global tech 
                standards, driving genuine digital transformation and fostering sustainable 
                growth throughout our community.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We collaborate with forward-thinking partners like LIMPS LTD to
                bring sustainable, socially impactful technology solutions to
                our community, combining technical excellence with social
                responsibility.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: What We Do */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
              className="order-2 md:order-1"
            >
              <h2 className="text-3xl font-bold mb-4">What We Do: Building the Digital Future of Cameroon</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We believe that technology should solve real, local problems. 
                As a leading provider of <strong>IT consulting in Kumba</strong>, we deliver tailored 
                enterprise solutions. Whether we are designing backend data schemas 
                for SMS-based agribusiness marketplaces to connect farmers with buyers, 
                or structuring SEO-friendly digital outreach portals for non-profit organizations, 
                we build systems that scale. Our expertise spans <strong>web development</strong>, UI/UX design, 
                cloud computing, and robust <strong>cybersecurity</strong>.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
              className="order-1 md:order-2"
            >
              <img
                src="/what_we_do.jpg" 
                alt="MTMKay IT Consulting team working on web development in Kumba"
                className="rounded-lg shadow-xl"
                loading="lazy"
                decoding="async"
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 3: The Work Cafe */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
            >
              <img
                src="/work-cafe-kumba.jpg"
                alt="Freelancers and students using The Work Cafe coworking space on Lido Street"
                className="rounded-lg shadow-xl"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl font-bold mb-4">The Work Café: Kumba’s Premium 
                Coworking Space</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We understand the challenges of remote work and digital 
                learning in Cameroon. That is why we built 
                <strong>The Work Café</strong>. Situated right in our 
                Lido Street facility, it is the most reliable 
                <strong>coworking space in Kumba</strong>. 
                Equipped with high-speed Starlink internet 
                and guaranteed backup power, we provide freelancers, 
                remote workers, and students with a distraction-free 
                environment to code, create, and collaborate.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Education & Real Estate */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
              className="order-2"
            >
              <h2 className="text-3xl font-bold mb-4">Education & Real Estate Solutions</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Beyond corporate consultancy, MTMKay is committed to building the next generation of tech leaders. We offer hands-on, certification-track <strong>tech training and bootcamps</strong> in partnership with industry giants like Cisco and Microsoft, focusing on high-demand skills like full-stack development and algorithmic logic.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Additionally, our <strong>real estate services</strong> bring that same level of modern, trusted, and efficient problem-solving to the local property market, ensuring our clients have the physical and digital infrastructure they need to thrive.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
              className="order-1 md:order-2"
            >
              <img
                src="/mtmkay-education-real-estate.jpg" 
                alt="MTMKay Real Estate and Education Team"
                className="rounded-lg shadow-xl"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Call To Action (Centered Block) */}
      <section className="py-24 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h3 className="text-4xl font-bold mb-6">Let’s Build Something Together</h3>
            <p className="text-slate-300 mb-8 text-lg">
              Whether you need enterprise IT solutions, a quiet desk to work, or a 
              new property investment, our team is ready to help you succeed.
            </p>
            <a 
              href="/contact"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-colors duration-300"
            >
              Get in Touch Today
            </a>
          </motion.div>
        </div>
      </section>

      {/* Strategic Partner Spotlight */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-4">
              <Handshake className="text-primary mr-3" size={40} />
              <h2 className="text-3xl font-bold">
                Strategic Partner Spotlight
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're proud to collaborate with innovative organizations that
              share our commitment to excellence and social impact.
            </p>
          </div>

          {/* LIMPS LTD Feature */}
          <Card className="max-w-4xl mx-auto overflow-hidden border-2 border-primary/20">
            <div className="md:flex">
              <div className="md:w-1/3 bg-primary/5 p-8 flex flex-col items-center justify-center">
                <div className="mb-6">
                  <div className="w-48 h-24 flex items-center justify-center mb-4">
                    <img
                      src="/limps-ltd.jpeg"
                      alt="LIMPS LTD Logo"
                      className="max-w-full max-h-full object-contain rounded-full"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-2">
                    LIMPS LTD
                  </h3>
                  <p className="text-gray-600 text-center text-sm">
                    Social Innovation Company
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Social Innovation
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    Sustainability
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    Community Impact
                  </span>
                </div>
              </div>

              {/* Partner Representative Info */}
              <div className="md:w-2/3 p-8">
                <div className="flex items-start mb-6">
                  <div className="mr-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                      <img
                        src="/team/lucien-fonyuy.png"
                        alt="Yilareng Lucien Fonyuy"
                        className="w-full h-full object-cover border-2 border-green-500 rounded-full"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">
                      Yilareng Lucien Fonyuy
                    </h3>
                    <p className="text-primary font-semibold mb-2">
                      Social Entrepreneur | Sustainability Strategist
                    </p>
                    <p className="text-gray-600 mb-4">
                      A visionary leader dedicated to creating sustainable
                      solutions and driving positive social change through
                      innovative technology and strategic partnerships.
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Globe size={16} className="mr-2" />
                      <span>Driving sustainable innovation in tech</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-lg font-bold mb-3 flex items-center">
                    <Lightbulb size={20} className="mr-2 text-primary" />
                    Partnership Focus
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <div className="bg-blue-50 p-2 rounded mr-3">
                        <Target size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <h5 className="font-medium">
                          Sustainable Tech Solutions
                        </h5>
                        <p className="text-sm text-gray-600">
                          Developing environmentally conscious technology
                          implementations
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-50 p-2 rounded mr-3">
                        <Users size={16} className="text-green-600" />
                      </div>
                      <div>
                        <h5 className="font-medium">Community Empowerment</h5>
                        <p className="text-sm text-gray-600">
                          Technology training and access for underserved
                          communities
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Partners Carousel Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Trusted Partners</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We collaborate with industry leaders and innovative organizations
              to bring you certified training and cutting-edge solutions
            </p>
          </div>

          {/* Partners Grid - Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8">
            {partners.map((partner) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className={`bg-gray-50 rounded-xl p-6 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-300 ${
                  partner.name === "LIMPS LTD"
                    ? "border-2 border-green-500 bg-green-50"
                    : ""
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-32 h-24 flex items-center justify-center mb-3">
                    <img
                      src={partner.logo}
                      alt={partner.alt}
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        if (partner.name === "LIMPS LTD") {
                          (e.target as HTMLImageElement).style.display = "none";
                          const fallback = document.createElement("div");
                          fallback.className =
                            "w-full h-full bg-gradient-to-r from-green-500 to-green-700 rounded-lg flex items-center justify-center";
                          fallback.innerHTML = `<span class="text-white font-bold">${partner.name}</span>`;
                          (
                            e.target as HTMLImageElement
                          ).parentNode?.appendChild(fallback);
                        }
                      }}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      partner.name === "LIMPS LTD"
                        ? "text-green-700 font-bold"
                        : "text-gray-700"
                    }`}
                  >
                    {partner.name}
                  </span>
                  {partner.name === "LIMPS LTD" && (
                    <span className="text-xs text-green-600 mt-1">
                      Social Innovation Partner
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Partner Benefits */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-6">
              Benefits of Our Partnerships
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-primary" size={24} />
                </div>
                <h4 className="text-lg font-semibold mb-2">
                  Official Certification
                </h4>
                <p className="text-gray-600 text-sm">
                  Provide official certification paths for all major technology
                  vendors
                </p>
              </div>
              <div className="p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="text-primary" size={24} />
                </div>
                <h4 className="text-lg font-semibold mb-2">
                  Latest Curriculum
                </h4>
                <p className="text-gray-600 text-sm">
                  Access to the most up-to-date training materials and exam
                  objectives
                </p>
              </div>
              <div className="p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="text-primary" size={24} />
                </div>
                <h4 className="text-lg font-semibold mb-2">
                  Industry Recognition
                </h4>
                <p className="text-gray-600 text-sm">
                  Certifications recognized globally by employers and
                  organizations
                </p>
              </div>
              <div className="p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="text-green-600" size={24} />
                </div>
                <h4 className="text-lg font-semibold mb-2">Social Impact</h4>
                <p className="text-gray-600 text-sm">
                  Sustainable and socially responsible technology initiatives
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Train at MTMKay */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Why Train With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6">
              <Award size={48} className="mx-auto text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">Industry-Recognized</h3>
              <p className="text-gray-600">
                Our certifications are valued by employers worldwide.
              </p>
            </div>
            <div className="p-6">
              <Users size={48} className="mx-auto text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">Small Class Sizes</h3>
              <p className="text-gray-600">
                Personalized attention to ensure you grasp every concept.
              </p>
            </div>
            <div className="p-6">
              <Briefcase size={48} className="mx-auto text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">Career Focused</h3>
              <p className="text-gray-600">
                We don't just teach, we prepare you for your next career move.
              </p>
            </div>
            <div className="p-6">
              <Globe size={48} className="mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Social Responsibility</h3>
              <p className="text-gray-600">
                Learn in an environment committed to sustainable tech practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Meet Our Expert Team</h2>
            <p className="text-lg text-gray-600">
              The driving force behind our success.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamData.map((member) => (
                <Card key={member.id} className="text-center py-6">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary font-semibold mb-2">{member.role}</p>
                </Card>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
