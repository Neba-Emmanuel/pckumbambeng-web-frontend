import React, { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./src/layouts/MainLayout";
import AdminLayout from "./src/layouts/AdminLayout";
import ProtectedRoute from "./src/components/context/protectedRoute";
import Preloader from "./src/components/shared/Preloader";
import { AuthContext } from "./src/components/context/authContext";

// Lazy-loaded Public Pages
const Home = lazy(() => import("./src/pages/Home"));
const About = lazy(() => import("./src/pages/About"));
const Services = lazy(() => import("./src/pages/Services"));
const Trainings = lazy(() => import("./src/pages/Trainings"));
const TrainingDetail = lazy(() => import("./src/pages/TrainingDetail"));
const CourseRegistration = lazy(() => import("./src/pages/CourseRegistration"));
const Blog = lazy(() => import("./src/pages/Blog"));
const BlogPostDetail = lazy(() => import("./src/pages/BlogPostDetail"));
const Contact = lazy(() => import("./src/pages/Contact"));
const WorkCafe = lazy(() => import("./src/pages/WorkCafe"));
const NotFound = lazy(() => import("./src/pages/NotFound"));
const PaymentSuccess = lazy(() => import("./src/pages/PaymentSuccess"));
const Capabilities = lazy(() => import("./src/pages/CapabilitiesStatement"));
const Leads = lazy(() => import("./src/pages/Leads"));

// Lazy-loaded Admin Pages
const AdminLogin = lazy(() => import("./src/pages/admin/Login"));
const Dashboard = lazy(() => import("./src/pages/admin/Dashboard"));
const ManageTrainings = lazy(() => import("./src/pages/admin/ManageTrainings"));
const ManageBlog = lazy(() => import("./src/pages/admin/ManageBlog"));
const ManageRegistrations = lazy(() => import("./src/pages/admin/ManageRegistrations"));
const ViewPayments = lazy(() => import("./src/pages/admin/ViewPayments"));
const ManageLeads = lazy(() => import("./src/pages/admin/ManageLeads"));

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      <BrowserRouter>
        <Suspense fallback={<Preloader />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="trainings" element={<Trainings />} />
              <Route path="trainings/:id" element={<TrainingDetail />} />
              <Route path="register" element={<CourseRegistration />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPostDetail />} />
              <Route path="contact" element={<Contact />} />
              <Route path="work-cafe" element={<WorkCafe />} />
              <Route path="capabilities-statement" element={<Capabilities />} />
              <Route path="getting-started" element={<Leads />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="trainings" element={<ManageTrainings />} />
                <Route path="blog" element={<ManageBlog />} />
                <Route path="registrations" element={<ManageRegistrations />} />
                <Route path="payments" element={<ViewPayments />} />
                <Route path="leads" element={<ManageLeads />} />
              </Route>
            </Route>

            <Route path="payment-success" element={<PaymentSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;