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
  UserPlus,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
  Copy,
  Check,
  Users,
  Coffee,
  BookOpen,
  Briefcase,
  MessageSquare,
  Send,
  Star,
  TrendingUp,
  AlertCircle,
  PieChart,
  FileText,
  Tag,
  UserCheck,
  UserX,
  Smartphone,
  Globe,
  MapPin,
  Award,
  Shield,
  Cloud,
  Code,
} from "lucide-react";
import { useApiRequest } from "@/src/hooks/useApiRequest";
import sweetAlert from "../../utils/alerts";

interface Lead {
  id: number;
  fullname: string;
  email: string;
  phone: string | null;
  interest: string | string[]; // Can be string or array
  source: string;
  preferredContact: "email" | "phone" | "whatsapp";
  status: "NEW" | "CONTACTED" | "CONVERTED" | "LOST";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProcessedLead extends Omit<Lead, "interest"> {
  interest: string[]; // Always array after processing
}

interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  converted: number;
  lost: number;
  conversionRate: number;
  topSources: Array<{ source: string; count: number }>;
  topInterests: Array<{ interest: string; count: number }>;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface EmailModalData {
  subject: string;
  message: string;
  leadIds?: number[];
}

const ManageLeads: React.FC = () => {
  const { request } = useApiRequest();
  const [leads, setLeads] = useState<ProcessedLead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  // Modal states
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ProcessedLead | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [emailData, setEmailData] = useState<EmailModalData>({
    subject: "",
    message: "",
  });
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchLeads();
    fetchLeadStats();
  }, [pagination.page, statusFilter, sourceFilter, dateRange]);

  // Helper function to parse interests
  const parseInterests = (interest: string | string[]): string[] => {
    if (Array.isArray(interest)) {
      return interest;
    }
    if (typeof interest === "string") {
      try {
        // Try to parse JSON string
        const parsed = JSON.parse(interest);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        // If not valid JSON, split by comma or return as single item array
        return interest.includes(",")
          ? interest.split(",").map((i) => i.trim())
          : [interest];
      }
    }
    return [];
  };

  // Process leads to ensure interest is always an array
  const processLeads = (rawLeads: Lead[]): ProcessedLead[] => {
    return rawLeads.map((lead) => ({
      ...lead,
      interest: parseInterests(lead.interest),
    }));
  };

  const fetchLeads = async () => {
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

      if (sourceFilter !== "all") {
        params.append("source", sourceFilter);
      }

      if (dateRange.start) {
        params.append("startDate", dateRange.start);
      }

      if (dateRange.end) {
        params.append("endDate", dateRange.end);
      }

      const response = await request({
        method: "GET",
        url: `/leads?${params.toString()}`,
      });

      const processedLeads = processLeads(response.data || []);
      setLeads(processedLeads);
      setPagination(response.pagination || pagination);
    } catch (err) {
      console.error("Error fetching leads:", err);
      sweetAlert({
        icon: "error",
        title: "Failed to load leads",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadStats = async () => {
    try {
      setStatsLoading(true);
      const response = await request({
        method: "GET",
        url: "/leads/stats",
      });

      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Error fetching lead stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: number, newStatus: string) => {
    try {
      await request({
        method: "PUT",
        url: `/leads/${leadId}/status`,
        data: { status: newStatus },
      });

      sweetAlert({
        icon: "success",
        title: `Lead marked as ${newStatus}`,
      });

      fetchLeads();
      fetchLeadStats();

      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead((prev) =>
          prev ? { ...prev, status: newStatus as any } : null,
        );
      }
    } catch (err) {
      sweetAlert({
        icon: "error",
        title: "Could not update lead status",
      });
    }
  };

  const sendEmail = async () => {
    if (!emailData.subject || !emailData.message) {
      sweetAlert({
        icon: "error",
        title: "Please provide both subject and message",
      });
      return;
    }

    try {
      setSendingEmail(true);

      const payload = {
        ...emailData,
        leadIds: emailData.leadIds || (selectedLead ? [selectedLead.id] : []),
      };

      const response = await request({
        method: "POST",
        url: "/leads/send-email",
        data: payload,
      });

      if (response.success) {
        sweetAlert({
          icon: "success",
          title: response.message || "Email sent successfully",
        });

        setIsEmailModalOpen(false);
        setIsBulkEmailModalOpen(false);
        setEmailData({ subject: "", message: "" });
        setSelectedLeads([]);
      }
    } catch (err) {
      console.error("Error sending email:", err);
      sweetAlert({
        icon: "error",
        title: "Could not send email",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleBulkEmail = () => {
    if (selectedLeads.length === 0) {
      sweetAlert({
        icon: "warning",
        title: "Please select at least one lead to send emails",
      });
      return;
    }

    setEmailData({ ...emailData, leadIds: selectedLeads });
    setIsBulkEmailModalOpen(true);
  };

  const toggleSelectLead = (leadId: number) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map((lead) => lead.id));
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const handleExport = () => {
    const csvContent = [
      [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Interests",
        "Source",
        "Preferred Contact",
        "Status",
        "Notes",
        "Created Date",
      ],
      ...leads.map((lead) => [
        lead.id,
        lead.fullname,
        lead.email,
        lead.phone || "",
        (lead.interest || []).join("; "),
        lead.source || "",
        lead.preferredContact || "",
        lead.status,
        lead.notes || "",
        new Date(lead.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800";
      case "CONTACTED":
        return "bg-yellow-100 text-yellow-800";
      case "CONVERTED":
        return "bg-green-100 text-green-800";
      case "LOST":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "NEW":
        return <UserPlus size={14} className="mr-1" />;
      case "CONTACTED":
        return <MessageSquare size={14} className="mr-1" />;
      case "CONVERTED":
        return <CheckCircle size={14} className="mr-1" />;
      case "LOST":
        return <XCircle size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  const getInterestIcon = (interest: string) => {
    switch (interest) {
      case "work-cafe":
        return <Coffee size={14} />;
      case "training":
        return <BookOpen size={14} />;
      case "consulting":
        return <Briefcase size={14} />;
      case "cybersecurity":
        return <Shield size={14} />;
      case "cloud":
        return <Cloud size={14} />;
      case "development":
        return <Code size={14} />;
      default:
        return <Tag size={14} />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Helmet>
        <title>Manage Leads - MTMKay Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Lead Management
            </h1>
            <p className="text-gray-600 mt-1">
              Track and manage all incoming leads from Work Café, training, and
              consulting services
            </p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleExport} variant="outline">
              <Download size={18} className="mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={handleBulkEmail}
              variant="outline"
              disabled={selectedLeads.length === 0}
            >
              <Send size={18} className="mr-2" />
              Email{" "}
              {selectedLeads.length > 0 ? `(${selectedLeads.length})` : ""}
            </Button>
            <Button
              onClick={() => {
                fetchLeads();
                fetchLeadStats();
              }}
              variant="outline"
            >
              <RefreshCw size={18} className="mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {!statsLoading && stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Leads</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <UserPlus className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">New</p>
                    <p className="text-2xl font-bold">{stats.new}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="rounded-lg bg-yellow-100 p-3">
                    <MessageSquare className="text-yellow-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Contacted</p>
                    <p className="text-2xl font-bold">{stats.contacted}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="rounded-lg bg-green-100 p-3">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Converted</p>
                    <p className="text-2xl font-bold">{stats.converted}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <TrendingUp className="text-purple-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold">
                      {stats.conversionRate}%
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Source & Interest Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                  <Globe size={18} className="mr-2" />
                  Top Sources
                </h3>
                <div className="space-y-3">
                  {stats.topSources.map((source, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-sm text-gray-600 flex-1 capitalize">
                        {source.source}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${(source.count / stats.total) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold">
                          {source.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                  <Star size={18} className="mr-2" />
                  Top Interests
                </h3>
                <div className="space-y-3">
                  {stats.topInterests.map((interest, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-sm text-gray-600 flex-1 capitalize">
                        {interest.interest}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${(interest.count / stats.total) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold">
                          {interest.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Filters */}
        <Card>
          <div className="p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPagination((prev) => ({ ...prev, page: 1 }));
                fetchLeads();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <div className="relative">
                    <Input
                      id="search"
                      placeholder="Search by name, email, phone..."
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
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="CONVERTED">Converted</option>
                    <option value="LOST">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Sources</option>
                    <option value="website">Website</option>
                    <option value="work-cafe">Work Café</option>
                    <option value="training">Training</option>
                    <option value="consulting">Consulting</option>
                    <option value="referral">Referral</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From
                    </label>
                    <Input
                      id="date"
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
                      To
                    </label>
                    <Input
                      id="date"
                      type="date"
                      value={dateRange.end}
                      onChange={(e) =>
                        setDateRange((prev) => ({
                          ...prev,
                          end: e.target.value,
                        }))
                      }
                    />
                  </div>
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
                    setSourceFilter("all");
                    setDateRange({ start: "", end: "" });
                    setPagination((prev) => ({ ...prev, page: 1 }));
                    fetchLeads();
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* Leads Table */}
        <Card>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="animate-spin h-8 w-8 text-primary mx-auto mb-4" />
                <p className="text-gray-600">Loading leads...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No leads found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedLeads.length === leads.length}
                            onChange={toggleSelectAll}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Lead Info
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Interests
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Source
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leads.map((lead) => (
                        <tr
                          key={lead.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedLeads.includes(lead.id)}
                              onChange={() => toggleSelectLead(lead.id)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-semibold">
                                {lead.fullname.charAt(0)}
                                {lead.fullname.split(" ")[1]?.charAt(0) || ""}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {lead.fullname}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: #{lead.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {lead.email}
                            </div>
                            {lead.phone && (
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <Phone size={12} className="mr-1" />
                                {lead.phone}
                              </div>
                            )}
                            {lead.preferredContact && (
                              <div className="text-xs text-gray-400 flex items-center mt-1">
                                <Smartphone size={12} className="mr-1" />
                                Prefers: {lead.preferredContact}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {lead.interest && lead.interest.length > 0 ? (
                                lead.interest.map((item, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                                  >
                                    {getInterestIcon(item)}
                                    <span className="ml-1 capitalize">
                                      {item.replace("-", " ")}
                                    </span>
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-gray-400">
                                  Not specified
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                              {lead.source || "website"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${getStatusBadge(
                                lead.status,
                              )}`}
                            >
                              {getStatusIcon(lead.status)}
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {formatDate(lead.createdAt)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setIsDetailsModalOpen(true);
                                }}
                                className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <MoreVertical size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setEmailData({ subject: "", message: "" });
                                  setIsEmailModalOpen(true);
                                }}
                                className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                title="Send Email"
                              >
                                <Mail size={16} />
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

      {/* Lead Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedLead(null);
        }}
        title="Lead Details"
        size="lg"
      >
        {selectedLead && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <div className="flex items-center">
                <div className="h-16 w-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedLead.fullname.charAt(0)}
                  {selectedLead.fullname.split(" ")[1]?.charAt(0) || ""}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedLead.fullname}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Lead #{selectedLead.id}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusBadge(
                  selectedLead.status,
                )}`}
              >
                {getStatusIcon(selectedLead.status)}
                {selectedLead.status}
              </span>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 flex items-center">
                <Mail size={18} className="mr-2" />
                Contact Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Email Address
                  </label>
                  <div className="flex items-center mt-1">
                    <p className="text-sm text-gray-900 flex-1">
                      {selectedLead.email}
                    </p>
                    <button
                      onClick={() =>
                        copyToClipboard(selectedLead.email, "email")
                      }
                      className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                    >
                      {copiedField === "email" ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>

                {selectedLead.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Phone Number
                    </label>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-900 flex-1">
                        {selectedLead.phone}
                      </p>
                      <button
                        onClick={() =>
                          copyToClipboard(selectedLead.phone!, "phone")
                        }
                        className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                      >
                        {copiedField === "phone" ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Preferred Contact
                  </label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {selectedLead.preferredContact || "Not specified"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Source
                  </label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {selectedLead.source || "Website"}
                  </p>
                </div>
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 flex items-center">
                <Star size={18} className="mr-2" />
                Interests
              </h4>

              <div className="flex flex-wrap gap-2">
                {selectedLead.interest && selectedLead.interest.length > 0 ? (
                  selectedLead.interest.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-2 rounded-lg bg-primary/10 text-primary"
                    >
                      {getInterestIcon(item)}
                      <span className="ml-2 capitalize">
                        {item.replace("-", " ")}
                      </span>
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No interests specified
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            {selectedLead.notes && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700 flex items-center">
                  <FileText size={18} className="mr-2" />
                  Notes
                </h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {selectedLead.notes}
                </p>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {formatDate(selectedLead.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>{" "}
                  {formatDate(selectedLead.updatedAt)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    copyToClipboard(
                      JSON.stringify(selectedLead, null, 2),
                      "all",
                    );
                    sweetAlert({
                      icon: "success",
                      title: "Lead details copied to clipboard!",
                    });
                  }}
                >
                  <Copy size={16} className="mr-2" />
                  Copy Details
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setEmailData({ subject: "", message: "" });
                    setIsEmailModalOpen(true);
                  }}
                >
                  <Mail size={16} className="mr-2" />
                  Send Email
                </Button>

                {selectedLead.status === "NEW" && (
                  <Button
                    onClick={() =>
                      updateLeadStatus(selectedLead.id, "CONTACTED")
                    }
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Mark as Contacted
                  </Button>
                )}

                {selectedLead.status === "CONTACTED" && (
                  <Button
                    onClick={() =>
                      updateLeadStatus(selectedLead.id, "CONVERTED")
                    }
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Mark as Converted
                  </Button>
                )}

                {(selectedLead.status === "NEW" ||
                  selectedLead.status === "CONTACTED") && (
                  <Button
                    onClick={() => updateLeadStatus(selectedLead.id, "LOST")}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <XCircle size={16} className="mr-2" />
                    Mark as Lost
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Single Email Modal */}
      <Modal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setEmailData({ subject: "", message: "" });
        }}
        title={`Send Email to ${selectedLead?.fullname || "Lead"}`}
        size="md"
      >
        <div className="space-y-4">
          <Input
            id="subject"
            label="Subject"
            value={emailData.subject}
            onChange={(e) =>
              setEmailData({ ...emailData, subject: e.target.value })
            }
            placeholder="Enter email subject"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={emailData.message}
              onChange={(e) =>
                setEmailData({ ...emailData, message: e.target.value })
              }
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Type your message here..."
              required
            />
          </div>

          {selectedLead && (
            <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
              <Mail size={16} className="inline mr-2" />
              Email will be sent to: {selectedLead.email}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsEmailModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={sendEmail} disabled={sendingEmail}>
              {sendingEmail ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Email Modal */}
      <Modal
        isOpen={isBulkEmailModalOpen}
        onClose={() => {
          setIsBulkEmailModalOpen(false);
          setEmailData({ subject: "", message: "" });
        }}
        title={`Send Bulk Email (${selectedLeads.length} leads)`}
        size="md"
      >
        <div className="space-y-4">
          <Input
            id="subject"
            label="Subject"
            value={emailData.subject}
            onChange={(e) =>
              setEmailData({ ...emailData, subject: e.target.value })
            }
            placeholder="Enter email subject"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={emailData.message}
              onChange={(e) =>
                setEmailData({ ...emailData, message: e.target.value })
              }
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Type your message here..."
              required
            />
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <Users size={16} className="inline mr-2" />
              This email will be sent to {selectedLeads.length} selected lead(s)
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsBulkEmailModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={sendEmail} disabled={sendingEmail}>
              {sendingEmail ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Send to {selectedLeads.length} Lead(s)
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ManageLeads;
