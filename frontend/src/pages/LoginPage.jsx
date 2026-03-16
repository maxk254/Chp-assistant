import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TABS = [
  { id: "login", label: "Login" },
  { id: "register", label: "Create Account" },
];

//  to be completed later after backend implementation is done.
export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regUserType, setRegUserType] = useState("");

  // Forgot
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: authService.login({ email: loginEmail, password: loginPassword })
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // TODO: authService.register({
    //   name: regName,
    //   email: regEmail,
    //   password: regPassword,
    //   userType: regUserType,
    // })
  };

  const handleForgot = (e) => {
    e.preventDefault();
    setForgotSent(true);
    // TODO: authService.forgotPassword({ email: forgotEmail })
  };

  const titles = {
    login: {
      heading: "Welcome back",
      sub: "Sign in to your account to continue",
    },
    register: {
      heading: "Create an account",
      sub: "Fill in the details below to get started",
    },
    forgot: {
      heading: "Reset your password",
      sub: "Enter your email and we'll send a reset link",
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
        {/* Logo / branding area */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg select-none">
            C
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            {titles[activeTab].heading}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {titles[activeTab].sub}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="mb-6 flex rounded-xl bg-muted p-1 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setForgotSent(false);
              }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Login ── */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                <button
                  type="button"
                  onClick={() => setActiveTab("forgot")}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full mt-2">
              Sign in
            </Button>
            <Separator />
            <p className="text-center text-xs text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setActiveTab("register")}
                className="text-primary hover:underline font-medium"
              >
                Create one
              </button>
            </p>
          </form>
        )}

        {/* ── Register ── */}
        {activeTab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Select the kind of user
              </label>
              <Select value={regUserType} onValueChange={setRegUserType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="chw">CHW</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="facility">Facility</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-2">
              Create Account
            </Button>
            <Separator />
            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </form>
        )}

        {/* ── Forgot Password ── */}
        {activeTab === "forgot" && (
          <div className="space-y-4">
            {forgotSent ? (
              <div className="rounded-xl border border-border bg-muted/50 p-4 text-center space-y-2">
                <p className="text-sm font-medium">Check your inbox</p>
                <p className="text-xs text-muted-foreground">
                  A reset link was sent to{" "}
                  <span className="font-medium text-foreground">
                    {forgotEmail}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForgotSent(false);
                    setForgotEmail("");
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Send again
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgot} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Reset Link
                </Button>
              </form>
            )}
            <Separator />
            <p className="text-center text-xs text-muted-foreground">
              Remembered it?{" "}
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className="text-primary hover:underline font-medium"
              >
                Back to login
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
