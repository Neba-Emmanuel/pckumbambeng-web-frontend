import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
  Phone,
  Mail,
  MapPin,
  Loader2,
  CheckCircle,
  AlertCircle,
  Coffee,
  Calendar,
  Clock,
  Award,
  Sun,
  ArrowLeft,
  Send,
  MessageSquare,
  Clock3,
  Wifi,
  Zap,
} from "lucide-react";
import sweetAlert from "../utils/alerts";
import { useApiRequest } from "../hooks/useApiRequest";

const Contact: React.FC = () => {
  const location = useLocation();
  const navigationState = location.state as {
    source?: string;
    plan?: {
      name: string;
      price?: string;
      period?: string;
      features?: string[];
    };
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [selectedPlan, setSelectedPlan] = useState(
    navigationState?.plan || null,
  );
  const [showPlanSummary, setShowPlanSummary] = useState(
    !!navigationState?.plan,
  );

  const { request } = useApiRequest();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill form based on selected plan
  useEffect(() => {
    if (navigationState?.source === "work-cafe" && navigationState?.plan) {
      const plan = navigationState.plan;

      let subject = "";
      let message = "";

      if (plan.name === "General Inquiry") {
        subject = "Work Café Booking Inquiry";
        message = `Hi, I'm interested in booking a spot at the Work Café. Please provide more information about availability and how to book.`;
      } else {
        subject = `Work Café - ${plan.name} Booking`;

        message = `Hi, I'm interested in the ${plan.name} for Work Café.\n\n`;
        message += `Plan Details:\n`;
        message += `- Plan: ${plan.name}\n`;
        if (plan.price && plan.period) {
          message += `- Price: ${plan.price} FCFA/${plan.period}\n`;
        }
        if (plan.features && plan.features.length > 0) {
          message += `- Features:\n`;
          plan.features.slice(0, 3).forEach((feature) => {
            message += `  • ${feature}\n`;
          });
        }
        message += `\nPlease contact me with more information about booking this plan.`;
      }

      setFormData((prev) => ({
        ...prev,
        subject: subject,
        message: message,
      }));
    }
  }, [navigationState]);

  const getPlanIcon = (planName: string) => {
    if (planName.includes("Hourly")) return Clock;
    if (planName.includes("Day")) return Sun;
    if (planName.includes("Weekly")) return Calendar;
    if (planName.includes("Monthly")) return Award;
    return Coffee;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (error) setError(null);
  };

  const clearPlanSelection = () => {
    setSelectedPlan(null);
    setShowPlanSummary(false);
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submissionData = {
        ...formData,
        source: navigationState?.source || "direct",
        plan: selectedPlan || navigationState?.plan || null,
      };

      const response = await request({
        method: "POST",
        url: "/contact/form",
        data: submissionData,
      });

      if (response && typeof response === "object" && response.data) {
        const data = response.data;

        if (response.success === false) {
          throw new Error(data.message || "Failed to send message");
        }

        let successMessage = data.message || "Message sent successfully!";
        if (selectedPlan) {
          successMessage = `Your ${selectedPlan.name} inquiry has been sent! We'll contact you shortly.`;
        }

        sweetAlert({
          icon: "success",
          title: successMessage,
        });

        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setSelectedPlan(null);
        setShowPlanSummary(false);
        setTimeout(() => setSuccess(false), 5000);
        return;
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - MTMKay Technology, Consulting & Real Estate</title>
        <meta
          name="description"
          content="Get in touch with MTMKay for inquiries about our courses, services, or any other questions."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://www.mtmkay.com/contact" />
      </Helmet>

      {/* Page Header - Responsive */}
      <header className="bg-gradient-to-br from-primary to-primary-dark text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            {selectedPlan && (
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft size={18} />
                Back
              </button>
            )}
            <h1 className="text-3xl md:text-4xl font-bold">
              {selectedPlan
                ? `Complete Your ${selectedPlan.name} Inquiry`
                : "Contact Us"}
            </h1>
            <p className="mt-2 text-base md:text-lg text-white/90 px-4">
              {selectedPlan
                ? `Fill out the form below and we'll get back to you within 24 hours`
                : "We'd love to hear from you. Let's talk about your future in tech."}
            </p>
          </motion.div>
        </div>
      </header>

      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 max-w-7xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 md:p-8">
                  {/* Plan Summary Banner - Mobile Optimized */}
                  {showPlanSummary && selectedPlan && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-l-4 border-primary rounded-lg">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              {React.createElement(getPlanIcon(selectedPlan.name), {
                                size: 20,
                                className: "text-primary",
                              })}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-base md:text-lg">
                              {selectedPlan.name} - Work Café
                            </h3>
                            {selectedPlan.price && selectedPlan.period && (
                              <p className="text-primary font-bold text-sm md:text-base">
                                {selectedPlan.price} FCFA/{selectedPlan.period}
                              </p>
                            )}
                            {selectedPlan.features &&
                              selectedPlan.features.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-600 mb-1">
                                    Includes:
                                  </p>
                                  <ul className="text-xs text-gray-600 space-y-0.5">
                                    {selectedPlan.features
                                      .slice(0, 2)
                                      .map((feature, idx) => (
                                        <li
                                          key={idx}
                                          className="flex items-center gap-1"
                                        >
                                          <CheckCircle
                                            size={10}
                                            className="text-green-500 flex-shrink-0"
                                          />
                                          <span className="truncate">
                                            {feature}
                                          </span>
                                        </li>
                                      ))}
                                    {selectedPlan.features.length > 2 && (
                                      <li className="text-xs text-gray-400">
                                        +{selectedPlan.features.length - 2} more
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              )}
                          </div>
                        </div>
                        <button
                          onClick={clearPlanSelection}
                          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                          aria-label="Clear selection"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}

                  <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
                    {selectedPlan
                      ? `Book Your ${selectedPlan.name}`
                      : "Send Us a Message"}
                  </h2>

                  {/* Success Message */}
                  {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                      <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="text-green-800 font-medium text-sm md:text-base">
                          {selectedPlan
                            ? `${selectedPlan.name} inquiry sent!`
                            : "Message sent successfully!"}
                        </p>
                        <p className="text-green-600 text-xs md:text-sm">
                          We'll get back to you within 24-48 hours.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                      <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="text-red-800 font-medium text-sm md:text-base">
                          Error sending message
                        </p>
                        <p className="text-red-600 text-xs md:text-sm">{error}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <Input
                      id="name"
                      label="Full Name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      id="email"
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      id="subject"
                      label="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        required
                      ></textarea>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : selectedPlan ? (
                        <>
                          <Send size={18} className="mr-2" />
                          Submit {selectedPlan.name} Inquiry
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* Contact Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-6 md:space-y-8">
                {/* Contact Info Cards */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="text-primary" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Our Office</h3>
                        <p className="text-gray-600 text-sm md:text-base">
                          Kumba, Southwest Region, Cameroon
                        </p>
                        <p className="text-gray-500 text-sm">
                          Lido Street, First story building by the right
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Mail className="text-primary" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Email Us</h3>
                        <a
                          href="mailto:support@mtmkay.com"
                          className="text-gray-600 hover:text-primary text-sm md:text-base break-all"
                        >
                          support@mtmkay.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Phone className="text-primary" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Call Us</h3>
                        <a
                          href="tel:+237671128616"
                          className="text-gray-600 hover:text-primary text-sm md:text-base"
                        >
                          (+237) 671 128 616
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63629.15348671702!2d9.413887056918838!3d4.625808813506493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xac5b1fb90c38193b%3A0xbbb472ad3cca5cde!2sMTMKay%20IT%20%26%20Training%20Center!5e0!3m2!1sen!2scm!4v1772698248633!5m2!1sen!2scm"
                      className="absolute top-0 left-0 w-full h-full"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="MTMKay Location"
                    ></iframe>
                  </div>
                </div>

                {/* Work Café Quick Links */}
                {!selectedPlan && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Coffee size={24} className="text-amber-600" />
                      <h3 className="font-bold text-amber-800 text-lg">Quick Book Work Café</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-white rounded-lg p-2 text-center">
                        <Clock3 size={16} className="inline text-amber-600" />
                        <span className="text-xs ml-1">500 FCFA/hr</span>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center">
                        <Sun size={16} className="inline text-amber-600" />
                        <span className="text-xs ml-1">2,000 FCFA/day</span>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center">
                        <Wifi size={16} className="inline text-amber-600" />
                        <span className="text-xs ml-1">100Mbps</span>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center">
                        <Zap size={16} className="inline text-amber-600" />
                        <span className="text-xs ml-1">Power backup</span>
                      </div>
                    </div>
                    <Button
                      asLink
                      to="/work-cafe"
                      variant="outline"
                      className="w-full"
                    >
                      <Coffee size={16} className="mr-2" />
                      View All Work Café Plans
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Quick Answers */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-2">Quick answers to common questions</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              {
                q: "How quickly will I get a response?",
                a: "We respond within 24-48 hours during business days."
              },
              {
                q: "Can I book a Work Café spot in advance?",
                a: "Yes, contact us to reserve your preferred time slot."
              },
              {
                q: "Do you offer corporate training?",
                a: "Yes, we provide customized training for businesses."
              }
            ].map((faq, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-1">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;