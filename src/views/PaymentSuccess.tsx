// src/pages/PaymentSuccess.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  Phone,
  Calendar,
  Clock,
  AlertCircle,
  ExternalLink,
  Download,
  Share2,
  Copy,
  Check,
  Shield,
} from "lucide-react";
import { useApiRequest } from "../hooks/useApiRequest";
import sweetAlert from "../utils/alerts";

interface PaymentVerificationResponse {
  success: boolean;
  status: string;
  transaction: {
    id: string;
    externalId: string;
    financialTransId: string;
    amount: number;
    revenue: number;
    currency: string;
    medium: string;
    serviceName: string;
    payerName: string;
    payerEmail: string;
    dateInitiated: string;
    dateConfirmed: string;
  };
  registration?: {
    id: number;
    fullname: string;
    email: string;
    phone: string;
    trainingId: number;
    training: {
      title: string;
      startDate: string;
      endDate?: string;
      duration?: string;
      instructor?: string;
    };
    schedule: string;
    amount: number;
    paymentStatus: string;
    paymentRef?: string;
    fapshiTransId?: string;
    paymentDate: string;
    paymentMethod: string;
    createdAt: string;
  };
  metadata?: {
    verifiedAt: string;
    server: string;
    version: string;
  };
  // Additional fields for direct API response
  transId?: string;
  externalId?: string;
  financialTransId?: string;
  amount?: number;
  revenue?: number;
  medium?: string;
  serviceName?: string;
  payerName?: string;
  email?: string;
  dateInitiated?: string;
  dateConfirmed?: string;
}

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { request } = useApiRequest();

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "SUCCESSFUL" | "FAILED" | "PENDING" | "UNKNOWN"
  >("PENDING");
  const [paymentData, setPaymentData] =
    useState<PaymentVerificationResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const transactionId = searchParams.get("transId");
  const status = searchParams.get("status");
  const externalId = searchParams.get("externalId");
  const ref = searchParams.get("ref");

  const paymentReference = externalId || ref || transactionId;

  // Helper functions to safely access transaction data
  const getTransaction = () => {
    if (!paymentData) return null;
    // If transaction exists as a property, use it
    if (paymentData.transaction) return paymentData.transaction;
    // Otherwise, check if we have transaction data at the root level
    if (
      paymentData.amount !== undefined &&
      (paymentData.transId || paymentData.externalId)
    ) {
      return {
        id: paymentData.transId || paymentData.externalId || "",
        externalId: paymentData.externalId || paymentData.transId || "",
        financialTransId: paymentData.financialTransId || "",
        amount: paymentData.amount || 0,
        revenue: paymentData.revenue || 0,
        currency: "XAF",
        medium: paymentData.medium || "mobile money",
        serviceName: paymentData.serviceName || "MTMKay",
        payerName: paymentData.payerName || "",
        payerEmail: paymentData.email || "",
        dateInitiated: paymentData.dateInitiated || "",
        dateConfirmed: paymentData.dateConfirmed || "",
      };
    }
    return null;
  };

  const getAmount = () => {
    const transaction = getTransaction();
    if (transaction) return transaction.amount;
    if (paymentData?.registration?.amount)
      return paymentData.registration.amount;
    return 0;
  };

  const getCurrency = () => {
    const transaction = getTransaction();
    if (transaction) return transaction.currency;
    return "XAF";
  };

  const verifyPayment = useCallback(
    async (reference: string) => {
      try {
        setLoading(true);
        setErrorMessage("");

        // Call API
        const response = await request({
          method: "GET",
          url: `/payments/verify/${reference}`,
        });

        console.log("Payment API response:", response);

        // Create transaction object from response data
        const transactionData = {
          id: response.transId || response.id || reference,
          externalId: response.externalId || reference,
          financialTransId: response.financialTransId || response.transId || "",
          amount: response.amount || 0,
          revenue: response.revenue || 0,
          currency: "XAF",
          medium: response.medium || "mobile money",
          serviceName: response.serviceName || "MTMKay",
          payerName: response.payerName || "",
          payerEmail: response.email || "",
          dateInitiated: response.dateInitiated || new Date().toISOString(),
          dateConfirmed: response.dateConfirmed || new Date().toISOString(),
        };

        // Determine if payment is successful
        const isSuccessful =
          response.success !== undefined
            ? response.success
            : response.status === "SUCCESSFUL";

        // Create the full payment data object
        const paymentResponse: PaymentVerificationResponse = {
          success: isSuccessful,
          status: response.status || "UNKNOWN",
          transaction: transactionData,
          registration: response.registration,
          metadata: {
            verifiedAt: new Date().toISOString(),
            server: "production",
            version: "1.0",
          },
          // Also store the raw response fields for backward compatibility
          ...response,
        };

        // Handle successful payment
        if (isSuccessful) {
          setPaymentStatus("SUCCESSFUL");
          setPaymentData(paymentResponse);

          sweetAlert({
            icon: "success",
            title: "Payment Successful!",
            timer: 3000,
          });

          // Cache in localStorage
          localStorage.setItem(
            `payment_${reference}`,
            JSON.stringify(paymentResponse),
          );
        }
        // Handle pending payment
        else if (
          response.status === "PENDING" ||
          response.status === "PROCESSING"
        ) {
          setPaymentStatus("PENDING");
          setPaymentData(paymentResponse);
          setErrorMessage(
            response.message || "Payment is still processing. Please wait...",
          );
        }
        // Handle failed payment
        else {
          setPaymentStatus("FAILED");
          setPaymentData(paymentResponse);
          setErrorMessage(response.error || "Payment verification failed");
        }
      } catch (err: any) {
        console.error("Payment verification error:", err);

        // Attempt to use cached payment if API fails
        const cached = localStorage.getItem(`payment_${reference}`);
        if (cached) {
          const cachedData = JSON.parse(cached);
          setPaymentData(cachedData);
          setPaymentStatus("SUCCESSFUL");

          sweetAlert({
            icon: "info",
            title: "Using Cached Payment Data",
            timer: 2000,
          });
        } else {
          setPaymentStatus("FAILED");
          setErrorMessage(
            err.response?.data?.error ||
              "Failed to verify payment. Please check your internet connection.",
          );
        }
      } finally {
        setLoading(false);
        setVerifying(false);
      }
    },
    [request],
  );

  useEffect(() => {
    if (paymentReference) {
      verifyPayment(paymentReference);
    } else {
      setPaymentStatus("UNKNOWN");
      setErrorMessage("No payment reference found");
      setLoading(false);
    }
  }, [paymentReference, verifyPayment]);

  const handleRetryVerification = async () => {
    if (!paymentReference) return;

    try {
      setVerifying(true);
      await verifyPayment(paymentReference);
    } finally {
      setVerifying(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "To be announced";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const formatAmount = (amount: number, currency: string = "XAF") => {
    if (currency === "XAF") {
      return new Intl.NumberFormat("en-CM", {
        style: "currency",
        currency: "XAF",
        minimumFractionDigits: 0,
      }).format(amount);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadReceipt = () => {
    if (!paymentData) return;

    const transaction = getTransaction();
    const amount = getAmount();
    const currency = getCurrency();

    const receipt = `
      MTMKay Payment Receipt
      ======================
      
      Transaction Details:
      --------------------
      Receipt No: ${transaction?.id || paymentData.transId || paymentReference}
      External Ref: ${transaction?.externalId || paymentData.externalId}
      Date: ${formatDate(transaction?.dateConfirmed || paymentData.dateConfirmed)}
      Status: ${paymentData.status}
      Amount: ${formatAmount(amount, currency)}
      Payment Method: ${transaction?.medium || paymentData.medium}
      
      ${
        paymentData.registration
          ? `
      Registration Details:
      --------------------
      Name: ${paymentData.registration.fullname}
      Email: ${paymentData.registration.email}
      Phone: ${paymentData.registration.phone}
      Training: ${paymentData.registration.training?.title || paymentData.registration.trainingTitle}
      Schedule: ${paymentData.registration.schedule}
      Registration Date: ${formatDate(paymentData.registration.createdAt)}
      `
          : ""
      }
      
      Thank you for your payment!
      
      Generated: ${new Date().toLocaleString()}
      Verification: https://mtmkay.com/payment/verify/${paymentReference}
    `;

    const blob = new Blob([receipt], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mtmkay-receipt-${paymentReference}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const shareReceipt = async () => {
    if (!paymentData) return;

    const amount = getAmount();
    const currency = getCurrency();

    const shareData = {
      title: `MTMKay Payment Receipt - ${paymentReference}`,
      text: `I've successfully paid ${formatAmount(amount, currency)} for MTMKay training.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Sharing cancelled");
      }
    } else {
      copyToClipboard(window.location.href);
      sweetAlert({
        icon: "success",
        title: "Link Copied!",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-4">
        <Helmet>
          <title>Verifying Payment - MTMKay</title>
        </Helmet>

        <Card className="max-w-md w-full p-8 text-center shadow-lg">
          <div className="relative">
            <Loader2 className="animate-spin h-16 w-16 text-primary mx-auto mb-6" />
            <Shield className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary/50 h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Verifying Payment
          </h2>
          <p className="text-gray-600 mb-6">
            Securely confirming your transaction details...
          </p>

          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            {paymentReference && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Reference:</span>
                <code className="font-mono text-sm bg-white px-2 py-1 rounded">
                  {paymentReference}
                </code>
              </div>
            )}
            {transactionId && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Transaction ID:</span>
                <code className="font-mono text-sm bg-white px-2 py-1 rounded">
                  {transactionId}
                </code>
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-pulse w-3/4"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This may take a few seconds
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const transaction = getTransaction();
  const amount = getAmount();
  const currency = getCurrency();

  return (
    <>
      <Helmet>
        <title>
          {paymentStatus === "SUCCESSFUL"
            ? "Payment Successful - MTMKay"
            : paymentStatus === "FAILED"
              ? "Payment Failed - MTMKay"
              : paymentStatus === "PENDING"
                ? "Payment Processing - MTMKay"
                : "Payment Status - MTMKay"}
        </title>
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Status Card */}
          <Card className="mb-8 shadow-lg border-0">
            <div className="p-8">
              <div className="flex flex-col items-center text-center mb-8">
                {paymentStatus === "SUCCESSFUL" ? (
                  <div className="relative mb-4">
                    <CheckCircle className="text-green-500 w-24 h-24" />
                    <div className="absolute -top-2 -right-2 bg-green-100 rounded-full p-2">
                      <Shield className="text-green-600 w-6 h-6" />
                    </div>
                  </div>
                ) : paymentStatus === "FAILED" ? (
                  <XCircle className="text-red-500 w-24 h-24 mb-4" />
                ) : (
                  <Loader2 className="text-yellow-500 w-24 h-24 mb-4 animate-spin" />
                )}

                <h1 className="text-3xl font-bold mb-2">
                  {paymentStatus === "SUCCESSFUL"
                    ? "Payment Confirmed!"
                    : paymentStatus === "FAILED"
                      ? "Payment Not Completed"
                      : "Payment Processing"}
                </h1>

                {paymentStatus === "SUCCESSFUL" && paymentData && (
                  <p className="text-lg text-gray-600 mb-4">
                    {formatAmount(amount, currency)} •{" "}
                    {transaction?.medium || paymentData.medium}
                  </p>
                )}
              </div>

              {/* Transaction Details */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-lg mb-4 flex items-center">
                  <Shield className="mr-2" size={20} />
                  Transaction Security Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentReference && (
                    <div className="bg-white p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Payment Reference
                        </span>
                        <button
                          onClick={() => copyToClipboard(paymentReference)}
                          className="text-primary hover:text-primary-dark"
                        >
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                      <code className="font-mono text-sm break-all bg-gray-50 p-2 rounded block">
                        {paymentReference}
                      </code>
                    </div>
                  )}

                  {paymentData?.financialTransId && (
                    <div className="bg-white p-4 rounded-lg">
                      <span className="text-sm text-gray-600 mb-2 block">
                        Financial Transaction ID
                      </span>
                      <code className="font-mono text-sm break-all bg-gray-50 p-2 rounded block">
                        {paymentData.financialTransId}
                      </code>
                    </div>
                  )}

                  {(transaction?.dateConfirmed ||
                    paymentData?.dateConfirmed) && (
                    <div className="bg-white p-4 rounded-lg">
                      <span className="text-sm text-gray-600 mb-2 block">
                        Confirmation Time
                      </span>
                      <p className="font-medium">
                        {formatDate(
                          transaction?.dateConfirmed ||
                            paymentData.dateConfirmed,
                        )}
                      </p>
                    </div>
                  )}

                  <div className="bg-white p-4 rounded-lg">
                    <span className="text-sm text-gray-600 mb-2 block">
                      Security Level
                    </span>
                    <div className="flex items-center">
                      <Shield className="text-green-500 mr-2" size={16} />
                      <span className="font-medium">Verified & Secure</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 justify-center">
                {paymentStatus === "SUCCESSFUL" && (
                  <>
                    <Button
                      onClick={downloadReceipt}
                      className="flex items-center"
                    >
                      <Download className="mr-2" size={18} />
                      Download Receipt
                    </Button>
                    <Button
                      onClick={shareReceipt}
                      variant="outline"
                      className="flex items-center"
                    >
                      <Share2 className="mr-2" size={18} />
                      Share Receipt
                    </Button>
                    <Button
                      asLink
                      to="/trainings"
                      className="flex items-center"
                    >
                      View More Trainings
                    </Button>
                  </>
                )}

                {paymentStatus === "PENDING" && (
                  <Button
                    onClick={handleRetryVerification}
                    disabled={verifying}
                    className="flex items-center"
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={18} />
                        Checking...
                      </>
                    ) : (
                      "Check Payment Status Again"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Registration Details */}
          {paymentStatus === "SUCCESSFUL" && paymentData?.registration && (
            <Card className="mb-8 shadow-lg border-0">
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6">
                  Registration Complete
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Training Details */}
                  <div className="lg:col-span-2">
                    <h3 className="font-bold text-lg mb-4">
                      Training Information
                    </h3>
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-xl">
                        <h4 className="text-xl font-bold mb-2">
                          {paymentData.registration.training?.title ||
                            paymentData.registration.trainingTitle}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <Calendar
                              className="text-gray-400 mr-3"
                              size={20}
                            />
                            <div>
                              <p className="text-sm text-gray-600">
                                Start Date
                              </p>
                              <p className="font-medium">
                                {formatDate(
                                  paymentData.registration.training?.startDate,
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Clock className="text-gray-400 mr-3" size={20} />
                            <div>
                              <p className="text-sm text-gray-600">Schedule</p>
                              <p className="font-medium">
                                {paymentData.registration.schedule}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Registration Summary */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4">
                      Registration Summary
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Registration ID</p>
                        <p className="font-mono font-bold text-lg">
                          MTM-{paymentData.registration.id}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Student</p>
                        <p className="font-medium">
                          {paymentData.registration.fullname}
                        </p>
                        <p className="text-sm text-gray-500">
                          {paymentData.registration.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          {paymentData.registration.phone}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Payment Details</p>
                        <div className="flex justify-between items-center mt-1">
                          <span>Amount Paid:</span>
                          <span className="font-bold text-lg">
                            {formatAmount(
                              paymentData.registration.amount,
                              "XAF",
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Method:</span>
                          <span className="font-medium">
                            {paymentData.registration.paymentMethod}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Status:</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="mr-1" size={12} />
                            {paymentData.registration.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600">
                          Registration Date
                        </p>
                        <p className="font-medium">
                          {formatDate(paymentData.registration.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </>
  );
};

export default PaymentSuccess;
