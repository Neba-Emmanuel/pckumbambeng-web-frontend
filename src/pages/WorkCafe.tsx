import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Wifi,
  Zap,
  Coffee,
  Clock,
  Calendar,
  Users,
  Shield,
  Printer,
  Headphones,
  Monitor,
  Plug,
  Sun,
  Wind,
  CreditCard,
  Smartphone,
  MapPin,
  Award,
  Star,
  ChevronRight,
  CheckCircle,
  Gift,
  Clock3,
  Briefcase,
  BookOpen,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const WorkCafe: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle hash links for smooth scrolling
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  const handlePlanBooking = (plan: (typeof pricingPlans)[0]) => {
    navigate("/contact", {
      state: {
        source: "work-cafe",
        plan: {
          name: plan.name,
          price: plan.price,
          period: plan.period,
          features: plan.features,
        },
      },
    });
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

  // Function to handle smooth scroll to pricing
  const scrollToPricing = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("pricing");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Pricing plans
  const pricingPlans = [
    {
      id: "hourly",
      name: "Hourly Pass",
      price: "500",
      unit: "FCFA",
      period: "hour",
      description: "Perfect for quick tasks, meetings, or between appointments",
      features: [
        "High-speed WiFi",
        "Power outlets",
        "Comfortable workspace",
        "Complimentary water",
        "Access to lounge area",
      ],
      icon: Clock,
      popular: false,
      buttonText: "Start Now",
      buttonVariant: "outline" as const,
    },
    {
      id: "daily",
      name: "Day Pass",
      price: "2,000",
      unit: "FCFA",
      period: "day",
      description: "Ideal for focused work sessions and online learning",
      features: [
        "All Hourly benefits",
        "One complimentary coffee",
        "8 AM - 8 PM access",
      ],
      icon: Sun,
      popular: false,
      buttonText: "Book Day Pass",
      buttonVariant: "outline" as const,
    },
    {
      id: "weekly",
      name: "Weekly Pass",
      price: "10,000",
      unit: "FCFA",
      period: "week",
      description: "Great for project-based work or short-term needs",
      features: [
        "All Daily benefits",
        "5 complimentary coffees",
        "7 consecutive days",
      ],
      icon: Calendar,
      popular: false,
      buttonText: "Book Weekly Pass",
      buttonVariant: "outline" as const,
    },
    {
      id: "monthly",
      name: "Monthly Subscription",
      price: "30,000",
      unit: "FCFA",
      period: "month",
      description: "Our best value for regular users and remote professionals",
      features: [
        "All Weekly benefits",
        "Unlimited coffee",
        "Dedicated desk option",
        "Guest passes (2/month)",
      ],
      icon: Award,
      popular: true,
      buttonText: "Subscribe Now",
      buttonVariant: "primary" as const,
    },
  ];

  // Features and amenities
  const amenities = [
    {
      icon: Wifi,
      name: "High-Speed Internet",
      description: "100Mbps dedicated Starlink connection",
    },
    {
      icon: Zap,
      name: "Reliable Power",
      description: "Backup generator & UPS for each desk",
    },
    {
      icon: Coffee,
      name: "Coffee & Beverages",
      description: "Complimentary coffee, tea, and water",
    },
    {
      icon: Printer,
      name: "Print & Scan",
      description: "Professional printing services available",
    },
    {
      icon: Monitor,
      name: "Tech-Ready Desks",
      description: "Pre-installed software",
    },
    {
      icon: Plug,
      name: "Universal Power",
      description: "Multiple outlets at every desk",
    },
    {
      icon: Users,
      name: "Meeting Rooms",
      description: "Bookable private meeting spaces",
    },
    {
      icon: Wind,
      name: "Air Conditioning",
      description: "Climate-controlled environment",
    },
    {
      icon: Headphones,
      name: "Quiet Zones",
      description: "Dedicated silent work areas",
    },
    {
      icon: Smartphone,
      name: "Mobile Charging",
      description: "Mobile charging outlets",
    },
    { icon: Clock3, name: "Flexible Hours", description: "Open 7 days a week" },
  ];

  // Benefits for businesses
  const businessBenefits = [
    "Cost-effective alternative to office leases",
    "No long-term commitments required",
    "Scalable workspace solutions",
    "Professional environment for client meetings",
    "Networking opportunities with other professionals",
    "Access to training and upskilling programs",
  ];

  return (
    <>
      <Helmet>
        <title>
          Work Café - Professional Workspace | MTMKay Technology, Consulting & Real Estate
        </title>
        <meta
          name="description"
          content="Book our Work Café: a quiet, professional workspace with reliable internet and power. Hourly (500 FCFA), Daily (2,000 FCFA), Weekly (10,000 FCFA), or Monthly (30,000 FCFA). Ideal for focused work, online learning, and remote jobs."
        />
        <link rel="canonical" href="https://www.mtmkay.com/work-cafe" />
      </Helmet>

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
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Coffee size={18} />
              <span className="text-sm font-medium">
                Your Professional Workspace Solution
              </span>
            </div> */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Work Café
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              A quiet, professional workspace with reliable internet and power.
              Ideal for focused work, online learning, and remote jobs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100"
              >
                Book Your Spot Now
              </Button>
              <a
                href="#pricing"
                onClick={scrollToPricing}
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                View Pricing
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">500 FCFA</div>
                <div className="text-sm text-white/80">Starting price/hour</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">100Mbps</div>
                <div className="text-sm text-white/80">Dedicated Starlink</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">24/7</div>
                <div className="text-sm text-white/80">Monthly access</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">100%</div>
                <div className="text-sm text-white/80">Power backup</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              More Than Just a Workspace
            </h2>
            <p className="text-lg text-gray-600">
              The Work Café is designed as your productivity hub combining
              professional amenities with a comfortable environment that helps
              you do your best work.
            </p>
          </motion.div>

          {/* Amenities Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {amenities.map((amenity, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-12 w-12 bg-primary/10 text-primary rounded-lg mb-4">
                    <amenity.icon size={24} />
                  </div>
                  <h3 className="font-semibold mb-2">{amenity.name}</h3>
                  <p className="text-sm text-gray-500">{amenity.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Transparent Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-lg text-gray-600">
              Flexible options that scale with your needs. No hidden fees, no
              long-term commitments.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {pricingPlans.map((plan) => (
              <motion.div key={plan.id} variants={fadeInUp}>
                <Card
                  className={`h-full relative ${plan.popular ? "border-2 border-primary shadow-xl" : ""}`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-10 w-10 bg-primary/10 text-primary rounded-lg">
                          <plan.icon size={20} />
                        </div>
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-gray-600 ml-1">{plan.unit}</span>
                      <span className="text-gray-500 text-sm ml-1">
                        /{plan.period}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-6">
                      {plan.description}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle
                            size={16}
                            className="text-green-500 flex-shrink-0 mt-0.5"
                          />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handlePlanBooking(plan)}
                      variant={plan.buttonVariant}
                      className="w-full"
                    >
                      {plan.buttonText}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Enterprise note */}
          <div className="text-center mt-12">
            <p className="text-gray-600">
              Need a custom solution for your team?{" "}
              <Link
                to="/contact"
                className="text-primary font-semibold hover:underline"
              >
                Contact us for corporate rates
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* For Businesses Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                For Businesses
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                The Smart Alternative to Office Leases
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Why commit to expensive long-term office leases when you can
                have flexible, professional workspace on your terms?
              </p>

              <div className="space-y-4">
                {businessBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle size={14} className="text-green-600" />
                      </div>
                    </div>
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button asLink to="/contact" variant="primary">
                  Talk to Our Team
                </Button>
                <Button asLink to="/services" variant="outline">
                  Explore All Services
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/5 to-blue-50 p-8 rounded-2xl"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Briefcase size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Corporate Partnership</h3>
                    <p className="text-gray-600">
                      Special rates for teams of 5+
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Dedicated desks</span>
                    <span className="font-semibold">From 25,000 FCFA/mo</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Private offices</span>
                    <span className="font-semibold">Custom quote</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Meeting room credits</span>
                    <span className="font-semibold">Included</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Training discounts</span>
                    <span className="font-semibold">10-20% off</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-3">
                    <Gift size={14} className="inline mr-1" />
                    First month free for annual commitments
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Learning Hub Integration */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <BookOpen size={16} className="text-primary" />
                <span className="text-primary font-semibold text-sm">
                  Work + Learn
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                The Perfect Environment for Online Learning
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Work Café subscribers get exclusive discounts on all MTMKay IT
                training programs. Transform your workspace into a classroom.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asLink to="/trainings" variant="primary" size="lg">
                  View Training Programs
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-15 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">
                Everything you need to know about Work Café
              </p>
            </motion.div>

            <div className="space-y-4">
              {[
                {
                  q: "Can I book a desk in advance?",
                  a: "Yes, we recommend booking in advance, especially during peak hours. Monthly subscribers get priority booking.",
                },
                {
                  q: "Is there food available?",
                  a: "We have a café serving light snacks and beverages. You're also welcome to bring your own food.",
                },
                {
                  q: "Do you offer day passes for weekends?",
                  a: "Yes, our day passes are available 7 days a week, 8 AM to 8 PM.",
                },
                {
                  q: "Can I bring a guest?",
                  a: "Monthly subscribers receive 2 guest passes per month. Day pass holders can add guests for 500 FCFA each.",
                },
                {
                  q: "What's the cancellation policy?",
                  a: "Hourly and day passes are non-refundable. Weekly and monthly subscriptions can be cancelled with 7 days notice.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience the Work Café?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join hundreds of professionals who've made Work Café their
              workspace of choice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asLink
                to="/contact"
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100"
              >
                Book Your First Visit
              </Button>
              {/* <Button
                asLink
                to="/contact"
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Contact Us
              </Button> */}
            </div>
            {/* <p className="text-sm text-white/80 mt-6">
              First time? Use code{" "}
              <span className="font-mono bg-white/20 px-3 py-1 rounded-lg">
                WORKCAFE24
              </span>{" "}
              for 10% off your first booking
            </p> */}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default WorkCafe;
