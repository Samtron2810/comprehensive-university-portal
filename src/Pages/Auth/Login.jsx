import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";
import heroBg from "../../assets/Images/HomeBg.jpg";
import api from "../../api/axiosInstance";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  //  If already logged in, redirect away from login page
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "STUDENT")
        navigate("/user-portal/student-dashboard", { replace: true });
      else if (role === "ADMIN")
        navigate("/user-portal/admin-dashboard", { replace: true });
      else if (role === "LECTURER")
        navigate("/user-portal/lecturer-dashboard", { replace: true });
    }
  }, [navigate]);

  //  Handle Login Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      const { accessToken, role, id } = response.data.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", id);

      if (role === "STUDENT") {
        navigate("/user-portal/student-dashboard", { replace: true });
      } else if (role === "ADMIN") {
        navigate("/user-portal/admin-dashboard", { replace: true });
      } else if (role === "LECTURER") {
        navigate("/user-portal/lecturer-dashboard", { replace: true });
      } else {
        setError("Unknown role. Please contact support.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 relative flex-col box-border"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-blue-950 opacity-80" />

      {/* Back to Home */}
      <Link
        to="/"
        className="fixed h-12 w-12 top-10 left-10 z-20 flex items-center gap-2 text-xl font-extrabold px-4 py-2 rounded-full border-2 border-white text-white bg-none hover:bg-white hover:text-blue-900 hover:border-blue-900 hover:shadow-md transition-all duration-200"
      >
        ←
      </Link>

      {/* Heading */}
      <h1 className="text-2xl font-black text-white mb-1 pb-5 z-10">
        Portal Login
      </h1>

      {/* Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs font-semibold text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="email"
                placeholder="e.g. john@cu.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-blue-900 bg-gray-50 focus:bg-white transition-all duration-200 placeholder-gray-300"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-lg pl-10 pr-11 py-3 text-sm text-gray-800 focus:outline-none focus:border-blue-900 bg-gray-50 focus:bg-white transition-all duration-200 placeholder-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-900 transition-colors"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-sm" />
                ) : (
                  <FaEye className="text-sm" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-blue-900 cursor-pointer"
              />
              <span className="text-xs font-medium text-gray-600">
                Remember me
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-bold text-blue-900 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-black uppercase tracking-widest py-3 rounded-lg transition-colors duration-200 mt-1"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Activate Account */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            New user?{" "}
            <Link
              to="/register"
              className="font-black text-blue-900 hover:underline"
            >
              Activate your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
