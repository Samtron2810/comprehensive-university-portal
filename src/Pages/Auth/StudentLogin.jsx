import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import heroBg from "../../assets/Images/HomeBg.jpg";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const username = identifier;

    localStorage.setItem("username", username);

    console.log({ username, password });

    setTimeout(() => {
      setLoading(false);
      navigate("/student-portal/dashboard", { replace: true });
    }, 1500);
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
      {/* Heading */}
      <h1 className="text-2xl font-black text-white mb-1 pb-5 z-10">
        Returning Student login
      </h1>
      {/* Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md px-8 py-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email / Matric No */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Email or Matric Number
            </label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="e.g. john@cu.edu or CU/2021/001"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-blue-900 bg-gray-50 focus:bg-white transition-all duration-200 placeholder-gray-300"
                id="username"
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

        {/* Register Redirect */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Fresher?{" "}
            <Link
              to="/student-register"
              className="font-black text-blue-900 hover:underline"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
