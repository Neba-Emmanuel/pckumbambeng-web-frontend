import React, { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./src/layouts/MainLayout";
import AdminLayout from "./src/layouts/AdminLayout";
import ProtectedRoute from "./src/components/context/protectedRoute";
import Preloader from "./src/components/shared/Preloader";
import { AuthContext } from "./src/components/context/authContext";

// Lazy-loaded Public Pages
const Home = lazy(() => import("./src/views/Home"));
const About = lazy(() => import("./src/views/About"));
const Services = lazy(() => import("./src/views/Services"));
const Trainings = lazy(() => import("./src/views/Trainings"));
const TrainingDetail = lazy(() => import("./src/views/TrainingDetail"));
const CourseRegistration = lazy(() => import("./src/views/CourseRegistration"));
const Blog = lazy(() => import("./src/views/Blog"));
const BlogPostDetail = lazy(() => import("./src/views/BlogPostDetail"));
const Contact = lazy(() => import("./src/views/Contact"));
const WorkCafe = lazy(() => import("./src/views/WorkCafe"));
const NotFound = lazy(() => import("./src/views/NotFound"));
const PaymentSuccess = lazy(() => import("./src/views/PaymentSuccess"));
const Capabilities = lazy(() => import("./src/views/CapabilitiesStatement"));
const Leads = lazy(() => import("./src/views/Leads"));

// Lazy-loaded Admin Pages
const AdminLogin = lazy(() => import("./src/views/admin/Login"));
const Dashboard = lazy(() => import("./src/views/admin/Dashboard"));
const ManageTrainings = lazy(() => import("./src/views/admin/ManageTrainings"));
const ManageBlog = lazy(() => import("./src/views/admin/ManageBlog"));
const ManageRegistrations = lazy(() => import("./src/views/admin/ManageRegistrations"));
const ViewPayments = lazy(() => import("./src/views/admin/ViewPayments"));
const ManageLeads = lazy(() => import("./src/views/admin/ManageLeads"));

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