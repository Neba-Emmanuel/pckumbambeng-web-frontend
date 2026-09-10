import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Coffee,
  BookOpen,
  Code,
  Shield,
  Cloud,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Info,
  Users,
  Award,
  Clock,
  Calendar,
  Wifi,
  Zap,
  Monitor,
  Headphones,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import sweetAlert from "../utils/alerts";
import { useApiRequest } from "../hooks/useApiRequest";

interface FormData {
  fullname: string;
  email: string;
  phone: string;
  interest: string[];
  source: string;
  notes: string;
  preferredContact?: string;
  preferredTime?: string;
}

interface PlanDetails {
  name: string;
  price?: string;
  period?: string;
  type: "work-cafe" | "training" | "consulting" | "general";
}

const Leads = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { request, loading } = useApiRequest();

  // Get plan details from navigation state
  const navigationState = location.state as {
    source?: string;
    plan?: PlanDetails;
  };

  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    email: "",
    phone: "",
    interest: [],
    source: navigationState?.source || "website",
    notes: "",
    preferredContact: "",
  });

  const [selectedPlan, setSelectedPlan] = useState<PlanDetails | null>(
    navigationState?.plan || null,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Service interests options
  const interestOptions = [
    { id: "work-cafe", label: "Work Café", icon: Coffee, color: "amber" },
    { id: "training", label: "IT Training", icon: BookOpen, color: "blue" },
    {
      id: "consulting",
      label: "IT Consulting",
      icon: Briefcase,
      color: "purple",
    },
    { id: "cybersecurity", label: "Cybersecurity", icon: Shield, color: "red" },
    { id: "cloud", label: "Cloud Solutions", icon: Cloud, color: "sky" },
    {
      id: "development",
      label: "Software Development",
      icon: Code,
      color: "green",
    },
  ];

  // Pre-fill interests based on selected plan
  useEffect(() => {
    if (selectedPlan?.type === "work-cafe") {
      setFormData((prev) => ({
        ...prev,
        interest: ["work-cafe"],
        notes: `Interested in Work Café ${selectedPlan.name} plan${selectedPlan.price ? ` (${selectedPlan.price} FCFA/${selectedPlan.period})` : ""}`,
      }));
    } else if (selectedPlan?.type === "training") {
      setFormData((prev) => ({
        ...prev,
        interest: ["training"],
        notes: `Interested in ${selectedPlan.name} training program`,
      }));
    } else if (selectedPlan?.type === "consulting") {
      setFormData((prev) => ({
        ...prev,
        interest: ["consulting"],
        notes: `Interested in ${selectedPlan.name} consulting services`,
      }));
    }
  }, [selectedPlan]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^[0-9+\-\s()]{8,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (formData.interest.length === 0) {
      newErrors.interest = "Please select at least one service interest";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      sweetAlert({
        icon: "error",
        title: "Please fill in all required fields correctly.",
      });
      return;
    }

    try {
      const response = await request({
        method: "POST",
        url: "/leads",
        data: formData,
      });

      if (response.success) {
        setIsSubmitted(true);
        sweetAlert({
          icon: "success",
          title: selectedPlan
            ? `Your ${selectedPlan.name} inquiry has been received. We'll contact you within 24 hours.`
            : "Your information has been received. We'll be in touch soon!",
        });

        setTimeout(() => {
          if (selectedPlan) {
            setFormData({
              fullname: "",
              email: "",
              phone: "",
              interest: [],
              source: "website",
              notes: "",
              preferredContact: "",
            });
            setIsSubmitted(false);
          } else {
            navigate("/");
          }
        }, 3000);
      } else {
        throw new Error(response.error || "Failed to submit");
      }
    } catch (err) {
      console.error("Error submitting lead:", err);
      sweetAlert({
        icon: "error",
        title:
          "There was an error submitting your information. Please try again.",
      });
    }
  };

  const handleInterestToggle = (interestId: string) => {
    setFormData((prev) => ({
      ...prev,
      interest: prev.interest.includes(interestId)
        ? prev.interest.filter((i) => i !== interestId)
        : [...prev.interest, interestId],
    }));
    // Clear error for interest if any
    if (errors.interest) {
      setErrors((prev) => ({ ...prev, interest: undefined }));
    }
  };

  // Success View
  if (isSubmitted) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-primary/5 to-blue-50 flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            <Card className="p-12">
              <div className="flex justify-center mb-6">
                <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={48} className="text-green-500" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
              <p className="text-gray-600 mb-6">
                {selectedPlan
                  ? `Your ${selectedPlan.name} inquiry has been received. One of our representatives will contact you within 24 hours to discuss your needs.`
                  : "Your information has been received. We'll be in touch soon!"}
              </p>
              <div className="space-y-4">
                <Button asLink to="/" variant="outline" className="w-full">
                  Return to Home
                </Button>
                {selectedPlan?.type === "work-cafe" && (
                  <Button
                    asLink
                    to="/work-cafe"
                    variant="outline"
                    className="w-full"
                  >
                    Back to Work Café
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {selectedPlan
            ? `Book ${selectedPlan.name} | MTMKay`
            : "Get Started with MTMKay"}
        </title>
        <meta
          name="description"
          content="Get started with MTMKay's IT training, Work Café, or consulting services. Fill out this form and we'll contact you within 24 hours."
        />
      </Helmet>

      {/* Header */}
      <header className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <h1 className="text-3xl md:text-4xl font-bold">
              {selectedPlan
                ? `Book Your ${selectedPlan.name}`
                : "Get Started with MTMKay"}
            </h1>
            <p className="text-lg text-white/90 mt-2">
              {selectedPlan
                ? "Fill out the form below and we'll contact you within 24 hours"
                : "Tell us about your needs and we'll help you find the right solution"}
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form Column */}
              <div className="lg:col-span-2">
                <Card className="p-8">
                  {/* Selected Plan Summary */}
                  {selectedPlan && (
                    <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            {selectedPlan.type === "work-cafe" && (
                              <Coffee size={24} className="text-primary" />
                            )}
                            {selectedPlan.type === "training" && (
                              <BookOpen size={24} className="text-primary" />
                            )}
                            {selectedPlan.type === "consulting" && (
                              <Briefcase size={24} className="text-primary" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">
                            {selectedPlan.name}
                          </h3>
                          {selectedPlan.price && selectedPlan.period && (
                            <p className="text-primary font-bold">
                              {selectedPlan.price} FCFA/{selectedPlan.period}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Personal Information
                      </h3>
                      <div className="space-y-4">
                        <Input
                          id="fullname"
                          label="Full Name *"
                          placeholder="John Doe"
                          value={formData.fullname}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              fullname: e.target.value,
                            }));
                            if (errors.fullname) {
                              setErrors((prev) => ({
                                ...prev,
                                fullname: undefined,
                              }));
                            }
                          }}
                          error={errors.fullname}
                          required
                        />

                        <Input
                          id="email"
                          label="Email Address *"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }));
                            if (errors.email) {
                              setErrors((prev) => ({
                                ...prev,
                                email: undefined,
                              }));
                            }
                          }}
                          error={errors.email}
                          required
                        />

                        <Input
                          id="phone"
                          label="Phone Number"
                          placeholder="+237 671 128 616"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }));
                            if (errors.phone) {
                              setErrors((prev) => ({
                                ...prev,
                                phone: undefined,
                              }));
                            }
                          }}
                          error={errors.phone}
                        />
                      </div>
                    </div>

                    {/* Preferred Contact Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Contact Method
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {["email", "phone", "whatsapp"].map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                preferredContact: method as any,
                              }))
                            }
                            className={`p-3 rounded-lg border text-sm font-medium capitalize transition-all ${
                              formData.preferredContact === method
                                ? "bg-primary text-white border-primary"
                                : "bg-white text-gray-600 border-gray-200 hover:border-primary/50"
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interests */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        I'm interested in * (select at least one)
                      </label>
                      {errors.interest && (
                        <p className="text-red-500 text-sm mb-2">
                          {errors.interest}
                        </p>
                      )}
                      <div className="grid sm:grid-cols-2 gap-3">
                        {interestOptions.map((option) => {
                          const isSelected = formData.interest.includes(
                            option.id,
                          );
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => handleInterestToggle(option.id)}
                              className={`p-4 rounded-xl border-2 transition-all text-left ${
                                isSelected
                                  ? `border-${option.color}-500 bg-${option.color}-50`
                                  : "border-gray-200 hover:border-gray-300 bg-white"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-lg ${isSelected ? `bg-${option.color}-100` : "bg-gray-100"}`}
                                >
                                  <option.icon
                                    size={18}
                                    className={
                                      isSelected
                                        ? `text-${option.color}-600`
                                        : "text-gray-600"
                                    }
                                  />
                                </div>
                                <span
                                  className={`font-medium ${isSelected ? `text-${option.color}-700` : "text-gray-700"}`}
                                >
                                  {option.label}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        rows={4}
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        placeholder="Tell us more about your needs, preferred start date, or any questions..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : selectedPlan ? (
                        `Complete ${selectedPlan.name} Booking`
                      ) : (
                        "Submit Inquiry"
                      )}
                    </Button>

                    <p className="text-xs text-gray-400 text-center mt-4">
                      By submitting this form, you agree to our privacy policy
                      and consent to being contacted.
                    </p>
                  </form>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Why Choose Us */}
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">Why Choose MTMKay?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle
                        size={16}
                        className="text-green-500 flex-shrink-0 mt-1"
                      />
                      <span className="text-sm text-gray-600">
                        24-hour response time
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle
                        size={16}
                        className="text-green-500 flex-shrink-0 mt-1"
                      />
                      <span className="text-sm text-gray-600">
                        Expert consultation
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle
                        size={16}
                        className="text-green-500 flex-shrink-0 mt-1"
                      />
                      <span className="text-sm text-gray-600">
                        Customized solutions
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle
                        size={16}
                        className="text-green-500 flex-shrink-0 mt-1"
                      />
                      <span className="text-sm text-gray-600">
                        No obligation quote
                      </span>
                    </li>
                  </ul>
                </Card>

                {/* Work Café Quick Info */}
                {formData.interest.includes("work-cafe") && (
                  <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Coffee size={20} className="text-amber-600" />
                      <h3 className="font-bold text-amber-800">
                        Work Café Plans
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Hourly</span>
                        <span className="font-bold">500 FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily</span>
                        <span className="font-bold">2,000 FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Weekly</span>
                        <span className="font-bold">10,000 FCFA</span>
                      </div>
                      <div className="flex justify-between text-amber-700">
                        <span>Monthly</span>
                        <span className="font-bold">30,000 FCFA</span>
                      </div>
                    </div>
                    <Button
                      asLink
                      to="/work-cafe"
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                    >
                      View Details
                    </Button>
                  </Card>
                )}

                {/* Training Quick Info */}
                {formData.interest.includes("training") && (
                  <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <BookOpen size={20} className="text-blue-600" />
                      <h3 className="font-bold text-blue-800">
                        Training Benefits
                      </h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Award size={14} className="text-blue-600" />
                        <span>Certification prep included</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Users size={14} className="text-blue-600" />
                        <span>Hands-on projects</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock size={14} className="text-blue-600" />
                        <span>Flexible scheduling</span>
                      </li>
                    </ul>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Leads;
