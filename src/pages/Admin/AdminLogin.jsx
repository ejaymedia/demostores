import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";
import { supabase } from "../../supabase";

const AdminLogin = () => {
  const navigate = useNavigate();
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

  return (
    <div className="bg-[#0F0F1A] min-h-screen flex items-center justify-center px-6">

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-purple-700/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <img
            src={`${import.meta.env.BASE_URL}logo/logo.png`}
            alt="Bovic Collections"
            className="h-14 w-auto object-contain mx-auto mb-4"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <h1 className="text-white text-2xl font-black mb-1">
            Admin Portal
          </h1>
          <p className="text-gray-500 text-sm">
            Bovic Collections — restricted access
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#1A1A2E] border border-purple-900/20 rounded-3xl p-8">

          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-purple-900/30 border border-purple-700/30 flex items-center justify-center mx-auto mb-8">
            <Lock size={20} className="text-purple-400" />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="admin@boviccollections.com"
              className="w-full bg-[#0F0F1A] border border-purple-900/30 text-white text-sm placeholder-gray-600 px-4 py-3.5 rounded-xl outline-none focus:border-purple-500/60 transition-colors duration-200"
            />
          </div>

          {/* Password */}
          <div className="mb-8">
            <label className="text-gray-400 text-xs uppercase tracking-widest block mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                className="w-full bg-[#0F0F1A] border border-purple-900/30 text-white text-sm placeholder-gray-600 px-4 py-3.5 rounded-xl outline-none focus:border-purple-500/60 transition-colors duration-200 pr-12"
              />
              <button
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors duration-200"
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
            className="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 text-sm tracking-wide"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Built with ❤️ by{" "}
          <a
            href="https://elijah.is-a.dev"
            target="_blank"
            rel="noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
          >
            Ejay
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;