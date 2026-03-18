import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KENYAN_WARDS } from "@/data";
import { login as loginService } from "@/services/authService";
import { setToken, setUser } from "@/utils/storage";

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
};

const initialFacility = {
  phone: "",
  otp: "",
  name: "",
  ward: "",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState("chw");

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
      user_kind: "chw",
      phone: chwForm.phone,
      ward: chwForm.ward,
      id_no: chwForm.idNo,
    });

    navigate("/home", { replace: true });
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

      if (supervisorForm.name.trim()) {
        setUser({ ...data.user, name: supervisorForm.name.trim() });
      }

      navigate("/home", { replace: true });
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Supervisor login failed. Check credentials and try again.",
      );
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
      user_kind: "facility",
      phone: facilityForm.phone,
      ward: facilityForm.ward,
    });

    navigate("/home", { replace: true });
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
          <form onSubmit={handleSupervisorLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-200">Name</label>
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

            <Button
              type="submit"
              className="w-full bg-teal-500 text-slate-900 hover:bg-teal-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Login as Supervisor"}
            </Button>
          </form>
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
