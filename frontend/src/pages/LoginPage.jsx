import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KENYAN_WARDS } from "@/data";
import { login as loginService } from "@/services/authService";
import { setToken, setUser } from "@/utils/storage";
import { useUser } from "@/context/UserContext";

const ROLE_OPTIONS = [
  { id: "chw", label: "Community Health Worker" },
  { id: "supervisor", label: "Supervisor" },
  { id: "facility", label: "Facility" },
];

const initialChw = {
  phone: "",
  otp: "",
  name: "",
  ward: "",
  idNo: "",
};

const initialSupervisor = {
  name: "",
  email: "",
  password: "",
  ward: "",
};

const initialFacility = {
  phone: "",
  otp: "",
  name: "",
  ward: "",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: contextLogin } = useUser();
  const [activeRole, setActiveRole] = useState("chw");
  const [supervisorMode, setSupervisorMode] = useState("login"); // "login" or "signup"

  const [chwForm, setChwForm] = useState(initialChw);
  const [supervisorForm, setSupervisorForm] = useState(initialSupervisor);
  const [facilityForm, setFacilityForm] = useState(initialFacility);

  const [chwOtpSent, setChwOtpSent] = useState(false);
  const [facilityOtpSent, setFacilityOtpSent] = useState(false);

  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetFeedback = () => {
    setStatusMessage("");
    setErrorMessage("");
  };

  const createMockSession = (user) => {
    const demoToken = `demo-token-${Date.now()}`;
    setToken(demoToken);
    setUser(user);
    contextLogin(user);
  };

  const handleSendOtp = (role) => {
    resetFeedback();

    if (role === "chw") {
      if (!chwForm.phone.trim()) {
        setErrorMessage("Enter a phone number to receive OTP.");
        return;
      }
      setChwOtpSent(true);
      setStatusMessage("OTP sent to CHW phone number.");
      return;
    }

    if (!facilityForm.phone.trim()) {
      setErrorMessage("Enter a phone number to receive OTP.");
      return;
    }

    setFacilityOtpSent(true);
    setStatusMessage("OTP sent to facility phone number.");
  };

  const handleChwLogin = (e) => {
    e.preventDefault();
    resetFeedback();

    if (!chwOtpSent) {
      setErrorMessage("Send OTP first before logging in.");
      return;
    }

    createMockSession({
      name: chwForm.name,
      role: "CHW",
      phone: chwForm.phone,
      ward: chwForm.ward,
      id_no: chwForm.idNo,
    });

    navigate("/chw", { replace: true });
  };

  const handleSupervisorLogin = async (e) => {
    e.preventDefault();
    resetFeedback();

    setIsSubmitting(true);
    try {
      const data = await loginService(
        supervisorForm.email,
        supervisorForm.password,
      );

      const userData = {
        ...data.user,
        role: "Supervisor",
        name: supervisorForm.name.trim() || data.user.name,
        ward: supervisorForm.ward || "All Wards",
      };

      setUser(userData);
      contextLogin(userData);

      navigate("/supervisor", { replace: true });
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Supervisor login failed. Check credentials and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSupervisorSignup = async (e) => {
    e.preventDefault();
    resetFeedback();

    // Validation
    if (!supervisorForm.name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!supervisorForm.email.trim()) {
      setErrorMessage("Please enter your email.");
      return;
    }

    if (!supervisorForm.password.trim() || supervisorForm.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (!supervisorForm.ward.trim()) {
      setErrorMessage("Please select your ward.");
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, this would call a signup API endpoint
      // For now, we'll create a mock account and log them in
      const userData = {
        id: `sup-${Date.now()}`,
        name: supervisorForm.name.trim(),
        email: supervisorForm.email.trim(),
        role: "Supervisor",
        ward: supervisorForm.ward,
        createdAt: new Date().toISOString(),
      };

      createMockSession(userData);
      setStatusMessage("Account created successfully! Logging you in...");

      setTimeout(() => {
        navigate("/supervisor", { replace: true });
      }, 1000);
    } catch (error) {
      setErrorMessage("Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFacilityLogin = (e) => {
    e.preventDefault();
    resetFeedback();

    if (!facilityOtpSent) {
      setErrorMessage("Send OTP first before logging in.");
      return;
    }

    createMockSession({
      name: facilityForm.name,
      role: "Facility",
      phone: facilityForm.phone,
      ward: facilityForm.ward,
    });

    navigate("/facility", { replace: true });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-teal-900/20 to-slate-900 px-4 py-10 flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
        <div className="mb-6 text-center space-y-3">
          <div className="mx-auto relative w-fit">
            <div className="absolute inset-0 animate-pulse">
              <div className="w-14 h-14 rounded-full border-2 border-teal-400/50"></div>
            </div>
            <div className="w-14 h-14 rounded-full bg-linear-to-br from-teal-400/20 to-cyan-400/20 border-2 border-teal-400 flex items-center justify-center relative z-10">
              <Heart
                className="w-7 h-7 text-teal-300 animate-pulse"
                fill="currentColor"
              />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
            Login Portal
          </h1>
          <p className="mt-2 text-sm text-cyan-200/90">
            Choose your role and sign in with the required details.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {ROLE_OPTIONS.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => {
                setActiveRole(role.id);
                setSupervisorMode("login");
                resetFeedback();
              }}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                activeRole === role.id
                  ? "border-teal-400 bg-teal-400/20 text-teal-200"
                  : "border-slate-600/70 bg-slate-900/60 text-slate-300 hover:bg-slate-700/60"
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {errorMessage}
          </div>
        )}

        {statusMessage && (
          <div className="mb-4 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {statusMessage}
          </div>
        )}

        {activeRole === "chw" && (
          <form onSubmit={handleChwLogin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 items-end">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-200">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="07XXXXXXXX"
                  className="bg-slate-900/80 border-slate-600 text-slate-100 placeholder:text-slate-400"
                  value={chwForm.phone}
                  onChange={(e) =>
                    setChwForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  required
                />
              </div>
              <Button
                type="button"
                onClick={() => handleSendOtp("chw")}
                className="bg-teal-500 text-slate-900 hover:bg-teal-400"
              >
                Send OTP
              </Button>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-200">OTP</label>
              <Input
                type="text"
                placeholder="Enter OTP"
                className="bg-slate-900/80 border-slate-600 text-slate-100 placeholder:text-slate-400"
                value={chwForm.otp}
                onChange={(e) =>
                  setChwForm((prev) => ({ ...prev, otp: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-200">Name</label>
              <Input
                type="text"
                placeholder="Full name"
                className="bg-slate-900/80 border-slate-600 text-slate-100 placeholder:text-slate-400"
                value={chwForm.name}
                onChange={(e) =>
                  setChwForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-200">Ward</label>
              <select
                className="w-full bg-slate-900/80 border border-slate-600 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={chwForm.ward}
                onChange={(e) =>
                  setChwForm((prev) => ({ ...prev, ward: e.target.value }))
                }
                required
              >
                <option value="">Select Ward</option>
                {KENYAN_WARDS.map((ward) => (
                  <option key={ward.value} value={ward.value}>
                    {ward.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-200">
                ID Number
              </label>
              <Input
                type="text"
                placeholder="National ID"
                className="bg-slate-900/80 border-slate-600 text-slate-100 placeholder:text-slate-400"
                value={chwForm.idNo}
                onChange={(e) =>
                  setChwForm((prev) => ({ ...prev, idNo: e.target.value }))
                }
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-500 text-slate-900 hover:bg-teal-400"
            >
              Login as Community Health Worker
            </Button>
          </form>
        )}

        {activeRole === "supervisor" && (
          <>
            {/* Toggle between Login and Signup */}
            <div className="mb-6 flex gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
              <button
                type="button"
                onClick={() => setSupervisorMode("login")}
                className={`flex-1 py-2 rounded transition-all font-medium text-sm ${
                  supervisorMode === "login"
                    ? "bg-teal-500 text-slate-900"
                    : "text-slate-300 hover:text-slate-100"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setSupervisorMode("signup")}
                className={`flex-1 py-2 rounded transition-all font-medium text-sm ${
                  supervisorMode === "signup"
                    ? "bg-teal-500 text-slate-900"
                    : "text-slate-300 hover:text-slate-100"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Login Form */}
            {supervisorMode === "login" && (
              <form onSubmit={handleSupervisorLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-200">
                    Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Supervisor name"
                    className="bg-slate-900/80 border-slate-600 text-slate-100 placeholder:text-slate-400"
                    value={supervisorForm.name}
                    onChange={(e) =>
                      setSupervisorForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-200">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    className="bg-slate-900/80 border-slate-600 text-slate-100 placeholder:text-slate-400"
                    value={supervisorForm.email}
                    onChange={(e) =>
                      setSupervisorForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    className="bg-slate-900/80 border-slate-600 text-slate-100 placeholder:text-slate-400"
                    value={supervisorForm.password}
                    onChange={(e) =>
                      setSupervisorForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-200">Ward</label>
                  <select
                    className="w-full bg-slate-900/80 border border-slate-600 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    value={supervisorForm.ward}
                    onChange={(e) =>
                      setSupervisorForm((prev) => ({ ...prev, ward: e.target.value }))
                    }
                    required
                  >
                    <option value="">Select Ward</option>
                    {KENYAN_WARDS.map((ward) => (
                      <option key={ward.value} value={ward.value}>
                        {ward.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-teal-500 text-slate-900 hover:bg-teal-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            )}

            {/* Signup Form */}
            {supervisorMode === "signup" && (
              <form onSubmit={handleSupervisorSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-200">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Your full name"
                    className="bg-slate-900/80 border-slate-600 text-slate-100 placeholder:text-slate-400"
                    value={supervisorForm.name}
                    onChange={(e) =>
                      setSupervisorForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-200">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    className="bg-slate-900/80 border-slate-600 text-slate-100 placeholder:text-slate-400"
                    value={supervisorForm.email}
                    onChange={(e) =>
                      setSupervisorForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-200">
                    Create Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Minimum 6 characters"
                    className="bg-slate-900/80 border-slate-600 text-slate-100 placeholder:text-slate-400"
                    value={supervisorForm.password}
                    onChange={(e) =>
                      setSupervisorForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-200">Ward</label>
                  <select
                    className="w-full bg-slate-900/80 border border-slate-600 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    value={supervisorForm.ward}
                    onChange={(e) =>
                      setSupervisorForm((prev) => ({ ...prev, ward: e.target.value }))
                    }
                    required
                  >
                    <option value="">Select Ward</option>
                    {KENYAN_WARDS.map((ward) => (
                      <option key={ward.value} value={ward.value}>
                        {ward.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-teal-500 text-slate-900 hover:bg-teal-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>

                <p className="text-xs text-slate-400 text-center">
                  By creating an account, you agree to our terms and conditions
                </p>
              </form>
            )}
          </>
        )}

        {activeRole === "facility" && (
          <form onSubmit={handleFacilityLogin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 items-end">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-200">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="07XXXXXXXX"
                  className="bg-slate-900/80 border-slate-600 text-slate-100 placeholder:text-slate-400"
                  value={facilityForm.phone}
                  onChange={(e) =>
                    setFacilityForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <Button
                type="button"
                onClick={() => handleSendOtp("facility")}
                className="bg-teal-500 text-slate-900 hover:bg-teal-400"
              >
                Send OTP
              </Button>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-200">OTP</label>
              <Input
                type="text"
                placeholder="Enter OTP"
                className="bg-slate-900/80 border-slate-600 text-slate-100 placeholder:text-slate-400"
                value={facilityForm.otp}
                onChange={(e) =>
                  setFacilityForm((prev) => ({ ...prev, otp: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-200">Name</label>
              <Input
                type="text"
                placeholder="Facility contact name"
                className="bg-slate-900/80 border-slate-600 text-slate-100 placeholder:text-slate-400"
                value={facilityForm.name}
                onChange={(e) =>
                  setFacilityForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-200">Ward</label>
              <select
                className="w-full bg-slate-900/80 border border-slate-600 rounded-md px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={facilityForm.ward}
                onChange={(e) =>
                  setFacilityForm((prev) => ({ ...prev, ward: e.target.value }))
                }
                required
              >
                <option value="">Select Ward</option>
                {KENYAN_WARDS.map((ward) => (
                  <option key={ward.value} value={ward.value}>
                    {ward.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-500 text-slate-900 hover:bg-teal-400"
            >
              Login as Facility
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
