import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { servicesData } from "../data/services";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";
import { Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Services: React.FC = () => {
  const navigate = useNavigate();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const reorderedServices = [
    servicesData[0],
    servicesData[1], // 4. Cloud Solutions Consulting (Cloud)
    servicesData[2], // 5. Cybersecurity Assessment (Cyber)
    servicesData[3], // 6. Custom Software Development (Other offerings)
  ];

  return (
    <>
      <Helmet>
        <title>Our Services - MTMKay Technology, Consulting & Real Estate</title>
        <meta
          name="description"
          content="Explore our range of IT consulting and training services designed to empower your business and career."
        />
        <link rel="canonical" href="https://www.mtmkay.com/services" />
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
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2 text-lg max-w-3xl mx-auto"
          >
            We provide comprehensive IT solutions and training programs to help
            you navigate the complexities of the digital landscape.
          </motion.p>
        </div>
      </header>

      {/* Services List Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {reorderedServices.map((service) => (
              <motion.div key={service.id} variants={itemVariants}>
                <Card
                  className={`p-8 h-full flex flex-col ${service.featured ? "border-2 border-primary shadow-lg" : ""}`}
                >
                  <div className="flex items-start space-x-6 mb-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-16 w-16 bg-primary/10 text-primary rounded-lg">
                        <service.icon size={32} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold">{service.title}</h3>
                        {service.featured && (
                          <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Learn More button for Work Café */}
                  {service.id === "work-cafe" && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button
                        asLink
                        to={service.learnMoreLink || "#"}
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        Learn More
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Work Café Feature Section */}
      <section className="bg-gradient-to-r from-primary/5 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Work Café: Your Professional Workspace Solution
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Our Work Café is designed as the perfect environment for digital
              professionals, remote workers, and online learners. With
              high-speed internet, comfortable workspaces, and all the amenities
              you need, it's more than just a workspace, it's your productivity
              hub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asLink to="/work-cafe" size="lg" variant="primary">
                Explore Work Café
              </Button>
              <Button
                onClick={() =>
                  navigate("/contact", {
                    state: {
                      source: "work-cafe",
                      plan: { name: "General Inquiry" },
                    },
                  })
                }
                size="lg"
                variant="outline"
              >
                Book Your Spot
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Navigation Note */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 mb-4">
              <strong>Navigation Tip:</strong> For new customers, we recommend
              starting with our Work Café service. It serves as the main entry
              point to all our offerings.
            </p>
            <div className="inline-flex flex-wrap justify-center gap-2 mt-4">
              <span className="bg-white px-4 py-2 rounded-lg border border-gray-200 font-medium">
                Work Café (Main Entry Point)
              </span>
              <span className="text-gray-400">→</span>
              <span className="bg-white px-4 py-2 rounded-lg border border-gray-200">
                Learning Facilitation
              </span>
              <span className="text-gray-400">→</span>
              <span className="bg-white px-4 py-2 rounded-lg border border-gray-200">
                IT Support / Digital Access
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss how our expertise can help you achieve your goals.
            Schedule a free consultation with our experts today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asLink to="/contact" size="lg" variant="primary">
              Get in Touch
            </Button>
            <Button asLink to="/work-cafe" size="lg" variant="outline">
              Visit Work Café First
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
