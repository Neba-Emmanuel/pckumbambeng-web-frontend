import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  BookOpen,
  PenSquare,
  Users,
  CreditCard,
  TrendingUp,
  Clock,
  Eye,
  PlusCircle,
  RefreshCw,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useApiRequest } from "../../hooks/useApiRequest";
import { Link } from "react-router-dom";

interface DashboardStats {
  trainings: {
    total: number;
    recent: number;
  };
  blogPosts: {
    total: number;
    recent: number;
  };
  registrations: {
    total: number;
    pending: number;
    confirmed: number;
    recent: number;
  };
  payments: {
    total: number;
    revenue: number;
    pending: number;
    recent: number;
  };
}

interface RecentRegistration {
  id: number;
  fullname: string;
  email: string;
  trainingTitle: string;
  amount: number;
  paymentStatus: string;
  createdAt: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
}

const Dashboard: React.FC = () => {
  const { request } = useApiRequest();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRegistrations, setRecentRegistrations] = useState<
    RecentRegistration[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [registrationsLoading, setRegistrationsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchRecentRegistrations();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [trainingsRes, registrationsRes, paymentsRes, blogPostsRes] =
        await Promise.all([
          request({ method: "GET", url: "/trainings" }),
          request({ method: "GET", url: "/registrations" }),
          request({ method: "GET", url: "/payments" }),
          request({ method: "GET", url: "/blogs" }),
        ]);

      const trainings = trainingsRes || [];
      const registrations = registrationsRes?.data || registrationsRes || [];
      const payments = paymentsRes?.data || paymentsRes || [];

      // Calculate statistics
      const dashboardStats: DashboardStats = {
        trainings: {
          total: trainings.length,
          recent: calculateRecentCount(trainings, "createdAt"),
        },
        blogPosts: {
          total: blogPostsRes?.length || 0,
          recent: calculateRecentCount(blogPostsRes || [], "createdAt"),
        },
        registrations: {
          total: registrations.length,
          pending: registrations.filter(
            (r: any) => r.paymentStatus === "PENDING",
          ).length,
          confirmed: registrations.filter(
            (r: any) => r.paymentStatus === "PAID",
          ).length,
          recent: calculateRecentCount(registrations, "createdAt"),
        },
        payments: {
          total: payments.length,
          revenue: payments.reduce(
            (sum: number, p: any) => sum + (p.amount || 0),
            0,
          ),
          pending: payments.filter((p: any) => p.status === "PENDING").length,
          recent: calculateRecentCount(payments, "paymentDate"),
        },
      };

      setStats(dashboardStats);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentRegistrations = async () => {
    try {
      setRegistrationsLoading(true);
      const response = await request({
        method: "GET",
        url: "/registrations?limit=5&sort=createdAt:desc",
      });

      const registrations = response?.data || response || [];

      // Get training titles for each registration
      const registrationsWithTitles = await Promise.all(
        registrations.slice(0, 5).map(async (reg: any) => {
          let trainingTitle = "Unknown Training";
          // try {
          //   const trainingRes = await request({
          //     method: "GET",
          //     url: `/trainings/${reg.trainingId}`,
          //   });
          //   trainingTitle = trainingRes?.title || "Unknown Training";
          // } catch (err) {
          //   console.error(`Error fetching training ${reg.trainingId}:`, err);
          // }

          return {
            id: reg.id,
            fullname: reg.fullname,
            email: reg.email,
            trainingTitle: trainingTitle,
            amount: reg.amount,
            paymentStatus: reg.paymentStatus,
            createdAt: reg.createdAt,
          };
        }),
      );

      setRecentRegistrations(registrationsWithTitles);
    } catch (err) {
      console.error("Error fetching recent registrations:", err);
    } finally {
      setRegistrationsLoading(false);
    }
  };

  const calculateRecentCount = (items: any[], dateField: string) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return items.filter((item) => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= sevenDaysAgo;
    }).length;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const quickActions: QuickAction[] = [
    {
      title: "Add New Training",
      description: "Create a new training program",
      icon: <PlusCircle size={20} />,
      link: "/admin/trainings",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "View Registrations",
      description: "Manage course registrations",
      icon: <Users size={20} />,
      link: "/admin/registrations",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Manage Payments",
      description: "View and process payments",
      icon: <CreditCard size={20} />,
      link: "/admin/payments",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Blog Management",
      description: "View and manage blog posts",
      icon: <TrendingUp size={20} />,
      link: "/admin/blog",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      title: "Leads & Inquiries",
      description: "View and manage leads",
      icon: <Eye size={20} />,
      link: "/admin/leads",
      color: "bg-teal-500 hover:bg-teal-600",
    },
  ];

  const handleRefresh = () => {
    fetchDashboardData();
    fetchRecentRegistrations();
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - MTMKay Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome to your admin dashboard
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw size={18} className="mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="p-6">
                <div className="animate-pulse">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-200 rounded-lg mr-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : stats ? (
            <>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <BookOpen className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Trainings</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.trainings.total}
                    </p>
                    {stats.trainings.recent > 0 && (
                      <p className="text-xs text-blue-600 mt-1">
                        +{stats.trainings.recent} this week
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="rounded-lg bg-green-100 p-3">
                    <PenSquare className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Blog Posts</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.blogPosts.total}
                    </p>
                    {stats.blogPosts.recent > 0 && (
                      <p className="text-xs text-green-600 mt-1">
                        +{stats.blogPosts.recent} this week
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="rounded-lg bg-yellow-100 p-3">
                    <Users className="text-yellow-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Registrations</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.registrations.total}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-green-600">
                        {stats.registrations.confirmed} paid
                      </span>
                      <span className="text-xs text-yellow-600 mx-2">•</span>
                      <span className="text-xs text-gray-600">
                        {stats.registrations.pending} pending
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <CreditCard className="text-purple-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatAmount(stats.payments.revenue)}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-green-600">
                        {stats.payments.total} transactions
                      </span>
                      {stats.payments.pending > 0 && (
                        <>
                          <span className="text-xs text-yellow-600 mx-2">
                            •
                          </span>
                          <span className="text-xs text-yellow-600">
                            {stats.payments.pending} pending
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <p className="text-gray-500 col-span-4 text-center py-8">
              Failed to load dashboard statistics
            </p>
          )}
        </div>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Registrations */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Recent Registrations
              </h2>
              <Button
                asLink
                to="/admin/registrations"
                size="sm"
                variant="outline"
              >
                View All
              </Button>
            </div>

            {registrationsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : recentRegistrations.length > 0 ? (
              <div className="space-y-4">
                {recentRegistrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                          <Users size={18} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {registration.fullname}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {registration.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(registration.paymentStatus)}`}
                        >
                          {registration.paymentStatus}
                        </span>
                        <span className="font-bold text-gray-800">
                          {formatAmount(registration.amount)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(registration.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No recent registrations</p>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link key={action.title} to={action.link} className="group">
                  <div className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all group-hover:scale-[1.02]">
                    <div
                      className={`inline-flex p-3 rounded-lg ${action.color} text-white mb-3`}
                    >
                      {action.icon}
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* System Status */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-700 mb-3">System Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Status</span>
                  <span className="flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Operational</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600">Connected</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-blue-50 p-3">
                  <TrendingUp className="text-blue-500" size={20} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">
                    Avg. Registration Value
                  </p>
                  <p className="text-xl font-bold text-gray-800">
                    {formatAmount(
                      stats.registrations.total > 0
                        ? stats.payments.revenue / stats.registrations.total
                        : 0,
                    )}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-green-50 p-3">
                  <Clock className="text-green-500" size={20} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Pending Actions</p>
                  <p className="text-xl font-bold text-gray-800">
                    {stats.registrations.pending + stats.payments.pending}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.registrations.pending} registrations •{" "}
                    {stats.payments.pending} payments
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="rounded-lg bg-purple-50 p-3">
                  <Eye className="text-purple-500" size={20} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Active This Week</p>
                  <p className="text-xl font-bold text-gray-800">
                    {stats.registrations.recent + stats.trainings.recent}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.registrations.recent} registrations •{" "}
                    {stats.trainings.recent} trainings
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
