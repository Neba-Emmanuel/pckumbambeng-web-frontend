import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  MoreVertical,
  Calendar,
  User,
  Mail,
  Phone,
  BookOpen,
  Receipt,
  CreditCard,
  Copy,
  Check,
} from "lucide-react";
import { useApiRequest } from "../../hooks/useApiRequest";
import sweetAlert from "../../utils/alerts";

interface Payment {
  id: string;
  registrationId: string;
  amount: number;
  currency: string;
  method: string;
  transactionRef: string;
  paymentDate: string;
  status: "PAID" | "PENDING" | "FAILED" | "REFUNDED";
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
  training?: {
    title: string;
    slug: string;
  };
}

interface PaymentStats {
  total: number;
  successful: number;
  pending: number;
  failed: number;
  revenue: number;
  recent: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface PaymentDetails {
  id: string;
  amount: number;
  currency: string;
  method: string;
  transactionRef: string;
  fapshiTransId?: string;
  paymentDate: string;
  status: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    schedule?: string;
  };
  training?: {
    id: string;
    title: string;
    slug: string;
    price: number;
    summary: string;
  };
  metadata?: {
    createdAt: string;
    updatedAt: string;
  };
}

const ViewPayments: React.FC = () => {
  const { request } = useApiRequest();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(
    null,
  );
  const [paymentDetailsLoading, setPaymentDetailsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
    fetchPaymentStats();
  }, [pagination.page, statusFilter, dateRange]);

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (dateRange.start) {
        params.append("startDate", dateRange.start);
      }

      if (dateRange.end) {
        params.append("endDate", dateRange.end);
      }

      const response = await request({
        method: "GET",
        url: `/payments?${params.toString()}`,
      });

      setPayments(response.data || []);
      setPagination(response.pagination || pagination);
    } catch (err) {
      console.error("Error fetching payments:", err);
      sweetAlert({
        icon: "error",
        title: "Failed to load payments",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStats = async () => {
    try {
      setStatsLoading(true);
      const response = await request({
        method: "GET",
        url: "/payments/stats",
      });
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching payment stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchPaymentDetails = async (paymentId: string) => {
    try {
      setPaymentDetailsLoading(true);
      const response = await request({
        method: "GET",
        url: `/payments/${paymentId}`,
      });

      if (response.success && response.data) {
        setSelectedPayment(response.data);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Error fetching payment details:", err);
      sweetAlert({
        icon: "error",
        title: "Failed to load payment details",
      });
    } finally {
      setPaymentDetailsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchPayments();
  };

  const handleRefresh = () => {
    fetchPayments();
    fetchPaymentStats();
  };

  const handleStatusUpdate = async (paymentId: string, newStatus: string) => {
    try {
      await request({
        method: "PUT",
        url: `/payments/${paymentId}/status`,
        data: { status: newStatus },
      });

      sweetAlert({
        icon: "success",
        title: "Status Updated",
      });

      fetchPayments();
      fetchPaymentStats();

      // Close modal if open
      if (selectedPayment && selectedPayment.id === paymentId) {
        setIsModalOpen(false);
      }
    } catch (err) {
      sweetAlert({
        icon: "error",
        title: "Update Failed",
      });
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "REFUNDED":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-CM", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleExport = () => {
    const csvContent = [
      [
        "Transaction Ref",
        "Amount",
        "Method",
        "Date",
        "Status",
        "Customer",
        "Email",
        "Phone",
        "Training",
      ],
      ...payments.map((p) => [
        p.transactionRef,
        formatAmount(p.amount),
        p.method,
        formatDate(p.paymentDate),
        p.status,
        p.customer?.name || "N/A",
        p.customer?.email || "N/A",
        p.customer?.phone || "N/A",
        p.training?.title || "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Helmet>
        <title>View Payments - MTMKay Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Payment Management
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage all payment transactions
            </p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleExport} variant="outline">
              <Download size={18} className="mr-2" />
              Export CSV
            </Button>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw size={18} className="mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-blue-100 p-3">
                  <DollarSign className="text-blue-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    {formatAmount(stats.revenue)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-green-100 p-3">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Successful Payments</p>
                  <p className="text-2xl font-bold">{stats.successful}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-yellow-100 p-3">
                  <Clock className="text-yellow-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-red-100 p-3">
                  <XCircle className="text-red-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Failed Payments</p>
                  <p className="text-2xl font-bold">{stats.failed}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <div className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <div className="relative">
                    <Input
                      id="search"
                      placeholder="Search by reference, name, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Status</option>
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="submit">
                  <Filter size={18} className="mr-2" />
                  Apply Filters
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setDateRange({ start: "", end: "" });
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* Payments Table */}
        <Card>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="animate-spin h-8 w-8 text-primary mx-auto mb-4" />
                <p className="text-gray-600">Loading payments...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No payments found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Transaction Ref
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Training
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-mono text-gray-900">
                              {payment.transactionRef}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900">
                              {formatAmount(payment.amount)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {payment.method}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {payment.customer?.name || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {payment.customer?.email || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {payment.customer?.phone || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {payment.training?.title || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(payment.paymentDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                                payment.status,
                              )}`}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="relative">
                              <button
                                onClick={() => fetchPaymentDetails(payment.id)}
                                className="inline-flex items-center p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                              >
                                <MoreVertical size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-4 py-3 border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            page: prev.page - 1,
                          }))
                        }
                        disabled={pagination.page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            page: prev.page + 1,
                          }))
                        }
                        disabled={pagination.page === pagination.pages}
                      >
                        Next
                      </Button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing{" "}
                          <span className="font-medium">
                            {(pagination.page - 1) * pagination.limit + 1}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium">
                            {Math.min(
                              pagination.page * pagination.limit,
                              pagination.total,
                            )}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium">
                            {pagination.total}
                          </span>{" "}
                          results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          {Array.from(
                            { length: Math.min(5, pagination.pages) },
                            (_, i) => {
                              let pageNum;
                              if (pagination.pages <= 5) {
                                pageNum = i + 1;
                              } else if (pagination.page <= 3) {
                                pageNum = i + 1;
                              } else if (
                                pagination.page >=
                                pagination.pages - 2
                              ) {
                                pageNum = pagination.pages - 4 + i;
                              } else {
                                pageNum = pagination.page - 2 + i;
                              }

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() =>
                                    setPagination((prev) => ({
                                      ...prev,
                                      page: pageNum,
                                    }))
                                  }
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    pagination.page === pageNum
                                      ? "z-10 bg-primary border-primary text-white"
                                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            },
                          )}
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Payment Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPayment(null);
        }}
        title="Payment Details"
        size="lg"
      >
        {paymentDetailsLoading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : selectedPayment ? (
          <div className="space-y-6">
            {/* Payment Status Header */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Payment #{selectedPayment.id}
                </h3>
                <span
                  className={`mt-1 px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusBadge(
                    selectedPayment.status as any,
                  )}`}
                >
                  {selectedPayment.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {formatAmount(selectedPayment.amount)}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedPayment.currency}
                </p>
              </div>
            </div>

            {/* Transaction Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 flex items-center">
                <CreditCard size={18} className="mr-2" />
                Transaction Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Transaction Reference
                  </label>
                  <div className="flex items-center mt-1">
                    <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono flex-1">
                      {selectedPayment.transactionRef}
                    </code>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          selectedPayment.transactionRef,
                          "transactionRef",
                        )
                      }
                      className="ml-2 p-2 text-gray-500 hover:text-gray-700"
                      title="Copy to clipboard"
                    >
                      {copiedField === "transactionRef" ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {selectedPayment.fapshiTransId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Fapshi Transaction ID
                    </label>
                    <div className="flex items-center mt-1">
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm font-mono flex-1">
                        {selectedPayment.fapshiTransId}
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            selectedPayment.fapshiTransId!,
                            "fapshiTransId",
                          )
                        }
                        className="ml-2 p-2 text-gray-500 hover:text-gray-700"
                        title="Copy to clipboard"
                      >
                        {copiedField === "fapshiTransId" ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Payment Method
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPayment.method}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Payment Date
                  </label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {formatDate(selectedPayment.paymentDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 flex items-center">
                <User size={18} className="mr-2" />
                Customer Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Full Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPayment.customer.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <div className="flex items-center mt-1">
                    <p className="text-sm text-gray-900 flex-1">
                      {selectedPayment.customer.email}
                    </p>
                    <button
                      onClick={() =>
                        copyToClipboard(selectedPayment.customer.email, "email")
                      }
                      className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                      title="Copy email"
                    >
                      {copiedField === "email" ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Phone Number
                  </label>
                  <div className="flex items-center mt-1">
                    <p className="text-sm text-gray-900 flex-1">
                      {selectedPayment.customer.phone}
                    </p>
                    <button
                      onClick={() =>
                        copyToClipboard(selectedPayment.customer.phone, "phone")
                      }
                      className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                      title="Copy phone"
                    >
                      {copiedField === "phone" ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>

                {selectedPayment.customer.schedule && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Schedule
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedPayment.customer.schedule}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Training Information */}
            {selectedPayment.training && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700 flex items-center">
                  <BookOpen size={18} className="mr-2" />
                  Training Information
                </h4>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-gray-800">
                    {selectedPayment.training.title}
                  </h5>
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedPayment.training.summary}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Training Price:{" "}
                        {formatAmount(selectedPayment.training.price)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      asLink
                      to={`/trainings/${selectedPayment.training.slug}`}
                    >
                      View Training
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata */}
            {selectedPayment.metadata && (
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Created:</span>{" "}
                    {formatDate(selectedPayment.metadata.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>{" "}
                    {formatDate(selectedPayment.metadata.updatedAt)}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedPayment) {
                      copyToClipboard(
                        JSON.stringify(selectedPayment, null, 2),
                        "all",
                      );
                      sweetAlert({
                        icon: "success",
                        title: "Payment details copied to clipboard!",
                      });
                    }
                  }}
                >
                  <Copy size={16} className="mr-2" />
                  Copy Details
                </Button>

                {selectedPayment.status === "PENDING" && (
                  <>
                    <Button
                      onClick={() =>
                        handleStatusUpdate(selectedPayment.id, "PAID")
                      }
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Mark as Paid
                    </Button>
                    <Button
                      onClick={() =>
                        handleStatusUpdate(selectedPayment.id, "FAILED")
                      }
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <XCircle size={16} className="mr-2" />
                      Mark as Failed
                    </Button>
                  </>
                )}

                {selectedPayment.status === "PAID" && (
                  <Button
                    onClick={() =>
                      handleStatusUpdate(selectedPayment.id, "REFUNDED")
                    }
                    variant="outline"
                    className="text-purple-600 border-purple-300 hover:bg-purple-50"
                  >
                    Issue Refund
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No payment details available</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ViewPayments;
