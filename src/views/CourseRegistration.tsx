import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Tabs from "../components/ui/Tabs";
import { CheckCircle, Loader2 } from "lucide-react";
import { useApiRequest } from "../hooks/useApiRequest";
import sweetAlert from "../utils/alerts";

interface Training {
  id: number;
  title: string;
  slug: string;
  summary: string;
  price: number;
  slots: TrainingSlot[];
}

interface TrainingSlot {
  id: number;
  startDate: string;
  endDate: string;
  schedule: string;
  seats: number;
  availableSeats: number;
}

interface RegistrationResponse {
  registration: {
    id: number;
    trainingId: number;
    fullname: string;
    email: string;
    phone: string;
    schedule: string;
    amount: number;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

const CourseRegistration: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const preselectedTrainingSlug = location.state?.trainingSlug;
  const preselectedSlotId = location.state?.slotId;

  const { request } = useApiRequest();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingTrainings, setFetchingTrainings] = useState(true);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedTrainingId, setSelectedTrainingId] = useState<string>("");
  const [slotId, setSlotId] = useState(preselectedSlotId || "");
  const [step, setStep] = useState(1);
  const [registrationId, setRegistrationId] = useState<number | null>(null);
  const [registrationData, setRegistrationData] = useState<
    RegistrationResponse["registration"] | null
  >(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  const selectedTraining = trainings.find(
    (t) => t.id.toString() === selectedTrainingId,
  );
  const selectedSlot = selectedTraining?.slots.find(
    (s) => s.id.toString() === slotId,
  );

  useEffect(() => {
    fetchTrainings();
  }, []);

  useEffect(() => {
    if (preselectedTrainingSlug && trainings.length > 0) {
      const training = trainings.find(
        (t) => t.slug === preselectedTrainingSlug,
      );
      if (training) {
        setSelectedTrainingId(training.id.toString());

        // Auto-select first available slot if preselectedSlotId is not provided
        if (!preselectedSlotId && training.slots.length > 0) {
          const availableSlot = training.slots.find(
            (s) => s.availableSeats > 0,
          );
          if (availableSlot) {
            setSlotId(availableSlot.id.toString());
          }
        }
      }
    }
  }, [preselectedTrainingSlug, trainings, preselectedSlotId]);

  const fetchTrainings = async () => {
    try {
      setFetchingTrainings(true);
      const response = await request({
        method: "GET",
        url: "/trainings",
      });
      setTrainings(response);
    } catch (error) {
      sweetAlert({
        icon: "error",
        title: "Failed to load trainings",
      });
    } finally {
      setFetchingTrainings(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!fullname || !email || !phone || !selectedTrainingId || !slotId) {
      sweetAlert({
        icon: "warning",
        title: "Missing Information",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      sweetAlert({
        icon: "warning",
        title: "Invalid Email",
      });
      return;
    }

    // Validate phone format (basic validation)
    if (phone.length < 8) {
      sweetAlert({
        icon: "warning",
        title: "Invalid Phone Number",
      });
      return;
    }

    try {
      setLoading(true);

      // Get selected slot details
      const slot = selectedTraining?.slots.find(
        (s) => s.id.toString() === slotId,
      );
      if (!slot) {
        throw new Error("Selected slot not found");
      }

      // Create registration data matching your backend
      const registrationData = {
        trainingId: parseInt(selectedTrainingId),
        fullname,
        email,
        phone,
        schedule: slot.schedule,
        amount: selectedTraining?.price || 0,
      };

      const response: RegistrationResponse = await request({
        method: "POST",
        url: "/registrations",
        data: registrationData,
      });

      setRegistrationId(response.registration.id);
      setRegistrationData(response.registration);
      setStep(2);

      sweetAlert({
        icon: "success",
        title: response.message || "Registration Created",
      });
    } catch (err: any) {
      console.error("Registration error:", err);
      sweetAlert({
        icon: "error",
        title:
          err.response?.data?.error || err.message || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirm = async () => {
    if (!registrationId || !selectedTraining || !registrationData) return;

    try {
      setLoading(true);

      // Check if training is free
      if (selectedTraining.price === 0) {
        // For free trainings, mark as paid automatically
        await request({
          method: "POST",
          url: "/registrations/free",
          data: { registrationId },
        });

        sweetAlert({
          icon: "success",
          title: "Registration Complete!",
        });
        setStep(3);
        return;
      }

      // For paid trainings, initiate payment
      const response = await request({
        method: "POST",
        url: "/payments/initiate",
        data: {
          email,
          registrationId,
          amount: selectedTraining.price,
          fullname,
          phone,
          trainingTitle: selectedTraining.title,
        },
      });

      // If payment link is returned, redirect to payment page
      if (response.link) {
        setPaymentLink(response.link);
        window.location.href = response.link;
      } else if (response.paymentUrl) {
        // Handle different response structure
        setPaymentLink(response.paymentUrl);
        window.location.href = response.paymentUrl;
      } else {
        // If no redirect, show payment instructions
        sweetAlert({
          icon: "info",
          title: "Payment Initiated",
        });
        setStep(3);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      sweetAlert({
        icon: "error",
        title: "Payment initiation failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const PaymentUI = () => (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Complete Your Payment</h3>

      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <div className="mb-4">
          <p className="text-gray-600 text-sm">Registration ID:</p>
          <p className="font-bold text-lg">MTM-{registrationId}</p>
        </div>

        <p className="text-gray-600">Training:</p>
        <p className="font-bold text-lg">{selectedTraining?.title}</p>

        {registrationData?.schedule && (
          <div className="mt-3">
            <p className="text-gray-600">Schedule:</p>
            <p className="font-medium">{registrationData.schedule}</p>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <span className="text-gray-600">Amount to pay:</span>
          <span className="text-3xl font-bold text-primary">
            {selectedTraining?.price?.toLocaleString()} XAF
          </span>
        </div>

        {selectedTraining?.price === 0 && (
          <p className="text-green-600 font-medium mt-3 p-2 bg-green-50 rounded">
            This training is free! No payment required.
          </p>
        )}
      </div>

      {selectedTraining?.price > 0 ? (
        <>
          <Tabs
            tabs={[
              {
                label: "MTN Mobile Money",
                content: (
                  <div>
                    <Input
                      id="momo-phone"
                      label="MTN MoMo Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="6XXXXXXXX"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      You will receive a payment prompt on your phone.
                    </p>
                  </div>
                ),
              },
              {
                label: "Orange Money",
                content: (
                  <div>
                    <Input
                      id="orange-phone"
                      label="Orange Money Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="6XXXXXXXX"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Follow the USSD instructions to complete payment.
                    </p>
                  </div>
                ),
              },
            ]}
          />

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Important:</strong> After payment, your registration will
              be confirmed once we verify the payment. You will receive a
              confirmation email.
            </p>
          </div>

          <Button
            onClick={handlePaymentConfirm}
            disabled={loading}
            className="w-full mt-6"
            size="lg"
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </Button>

          {paymentLink && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 mb-2">
                If you are not redirected automatically, click the button below:
              </p>
              <a
                href={paymentLink}
                className="inline-block w-full"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full">
                  Go to Payment Page
                </Button>
              </a>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-4">
          <Button
            onClick={handlePaymentConfirm}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? "Processing..." : "Complete Free Registration"}
          </Button>
        </div>
      )}
    </div>
  );

  if (fetchingTrainings) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
        <p className="ml-3 text-gray-600">Loading available trainings...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Course Registration - MTMKay</title>
      </Helmet>

      {/* Page Header */}
      <header className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">Course Registration</h1>
          <p className="mt-2 text-lg">
            Secure your spot in one of our expert-led trainings.
          </p>
        </div>
      </header>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              <div
                className={`flex items-center ${step >= 1 ? "text-primary" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-white" : "bg-gray-200"}`}
                >
                  1
                </div>
                <span className="ml-2 font-medium">Registration</span>
              </div>
              <div
                className={`w-16 h-1 mx-2 ${step >= 2 ? "bg-primary" : "bg-gray-300"}`}
              ></div>
              <div
                className={`flex items-center ${step >= 2 ? "text-primary" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-white" : "bg-gray-200"}`}
                >
                  2
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
              <div
                className={`w-16 h-1 mx-2 ${step >= 3 ? "bg-primary" : "bg-gray-300"}`}
              ></div>
              <div
                className={`flex items-center ${step >= 3 ? "text-primary" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-white" : "bg-gray-200"}`}
                >
                  3
                </div>
                <span className="ml-2 font-medium">Confirmation</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            {step === 1 && (
              <form onSubmit={handleFormSubmit}>
                <h2 className="text-2xl font-bold mb-6">
                  Registration Details
                </h2>
                <div className="space-y-6">
                  <Input
                    id="fullname"
                    label="Full Name *"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                  <Input
                    id="email"
                    label="Email Address *"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                  />
                  <Input
                    id="phone"
                    label="Phone Number *"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="Enter your phone number (e.g., 6XXXXXXXX)"
                  />

                  <div>
                    <label
                      htmlFor="training"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Select Training *
                    </label>
                    <select
                      id="training"
                      value={selectedTrainingId}
                      onChange={(e) => {
                        setSelectedTrainingId(e.target.value);
                        setSlotId("");
                      }}
                      className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="">-- Choose a training --</option>
                      {trainings.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title} - {t.price?.toLocaleString()} XAF
                        </option>
                      ))}
                    </select>
                    {selectedTraining && (
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedTraining.summary}
                      </p>
                    )}
                  </div>

                  {selectedTraining && selectedTraining.slots.length > 0 && (
                    <div>
                      <label
                        htmlFor="slot"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Select Schedule *
                      </label>
                      <select
                        id="slot"
                        value={slotId}
                        onChange={(e) => setSlotId(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">-- Choose a schedule --</option>
                        {selectedTraining.slots.map((s) => {
                          const startDate = new Date(s.startDate);
                          const endDate = new Date(s.endDate);
                          const seatsAvailable = s.availableSeats > 0;
                          const isFull = s.availableSeats === 0;

                          return (
                            <option
                              key={s.id}
                              value={s.id}
                              disabled={isFull}
                              className={isFull ? "text-gray-400" : ""}
                            >
                              {s.schedule}
                              {` (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`}
                              {isFull
                                ? " - FULL"
                                : ` - ${s.availableSeats} seats left`}
                            </option>
                          );
                        })}
                      </select>
                      {selectedTraining.slots.filter(
                        (s) => s.availableSeats === 0,
                      ).length === selectedTraining.slots.length && (
                        <p className="text-red-500 text-sm mt-1">
                          All slots for this training are currently full. Please
                          check back later.
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={loading || !selectedTrainingId || !slotId}
                  className="w-full mt-8"
                  size="lg"
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </Button>
              </form>
            )}

            {step === 2 && <PaymentUI />}

            {step === 3 && (
              <div className="text-center py-10">
                <CheckCircle className="text-green-500 w-24 h-24 mx-auto mb-4" />
                <h2 className="text-3xl font-bold">Registration Complete!</h2>
                <p className="text-gray-600 mt-4">
                  Thank you for registering for{" "}
                  <strong>{selectedTraining?.title}</strong>.
                </p>

                <div className="mt-6 bg-gray-50 p-6 rounded-lg max-w-md mx-auto text-left">
                  <h3 className="font-bold text-lg mb-3">
                    Registration Summary
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span> {fullname}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {phone}
                    </p>
                    <p>
                      <span className="font-medium">Training:</span>{" "}
                      {selectedTraining?.title}
                    </p>
                    <p>
                      <span className="font-medium">Schedule:</span>{" "}
                      {registrationData?.schedule}
                    </p>
                    <p>
                      <span className="font-medium">Amount:</span>{" "}
                      {selectedTraining?.price?.toLocaleString()} XAF
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {selectedTraining?.price === 0
                        ? "Confirmed"
                        : "Pending Payment Verification"}
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-3 max-w-sm mx-auto">
                  <Button
                    asLink
                    to="/trainings"
                    variant="outline"
                    className="w-full"
                  >
                    Explore More Trainings
                  </Button>
                  <Button asLink to="/" className="w-full">
                    Return to Homepage
                  </Button>
                  {selectedTraining?.price > 0 && (
                    <p className="text-sm text-gray-500 mt-4">
                      You will receive a confirmation email once your payment is
                      verified.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default CourseRegistration;
