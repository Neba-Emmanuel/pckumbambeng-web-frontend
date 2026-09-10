import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "@/src/components/context/authContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Briefcase } from "lucide-react";
import { useApiRequest } from "../../hooks/useApiRequest";
import sweetAlert from "@/src/utils/alerts";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const { request, loading, error } = useApiRequest();

  // 🔐 Prevent logged-in admin from seeing login page
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await request({
        method: "POST",
        url: "/auth/login",
        data: { email, password },
      });

      login(response.token);

      await sweetAlert({
        icon: "success",
        title: "Login successful, welcome back 👋",
      });

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      sweetAlert({
        icon: "error",
        title: "Login unsuccessful!",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - MTMKay</title>
      </Helmet>

      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            {/* <Briefcase className="mx-auto h-12 w-auto text-primary" /> */}
            <img src="/mtmkay_logo.png" width="90" height="90" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Admin Portal Login
            </h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              id="email"
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
