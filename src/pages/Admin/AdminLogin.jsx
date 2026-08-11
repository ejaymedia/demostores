import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";
import { supabase } from "../../supabase";
import { useSite } from "../../context/SiteContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { siteSettings } = useSite();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!supabase) {
      setError("Backend not configured yet. Check back soon.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;
      navigate("/admin-dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  // Logo — responsive, no text beside it
  const LoginLogo = () => {
    if (!siteSettings.logo_url) {
      return (
        <span
          className="font-black text-2xl"
          style={{ color: "var(--brand-1)" }}
        >
          {siteSettings.business_name}
        </span>
      );
    }
    return (
      <img
        src={siteSettings.logo_url}
        alt={siteSettings.business_name}
        className="h-14 w-auto object-contain mx-auto"
        style={{ maxWidth: "180px", maxHeight: "56px" }}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: "var(--brand-1)" }}
        />
      </div>

      <div className="relative w-full max-w-sm">

        {/* Logo + Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <LoginLogo />
          </div>
          <p className="text-gray-400 text-sm">
            Admin Portal — Restricted Access
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">

          {/* Lock icon */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-8"
            style={{ background: "var(--brand-1)" }}
          >
            <Lock size={20} className="text-white" />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="text-gray-500 text-xs font-bold uppercase tracking-widest block mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="admin@example.com"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 px-4 py-3.5 rounded-xl outline-none focus:border-gray-400 transition-colors duration-200"
            />
          </div>

          {/* Password */}
          <div className="mb-8">
            <label className="text-gray-500 text-xs font-bold uppercase tracking-widest block mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 px-4 py-3.5 rounded-xl outline-none focus:border-gray-400 transition-colors duration-200 pr-12"
              />
              <button
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors duration-200"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full text-white font-bold py-4 rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 text-sm tracking-wide"
            style={{ background: "var(--brand-1)" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-400 text-xs mt-6">
          Built with ❤️ by{" "}
          <a
            href="https://elijah.is-a.dev"
            target="_blank"
            rel="noreferrer"
            className="font-semibold hover:text-gray-700 transition-colors duration-200"
            style={{ color: "var(--brand-1)" }}
          >
            Ejay
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;