import { useState } from "react";
import Button from "../component/ui/Button";
import Input from "../component/ui/Input";
import Alert from "../component/ui/Alert";

export default function Login({
  onLogin,
  onRegister,
  loading = false,
  error: serverError = "",
}) {
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isLogin = mode === "login";

  function updateField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!isLogin && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      if (isLogin) {
        if (typeof onLogin !== "function") {
          throw new Error("Login handler is not connected in App.jsx.");
        }

        // Backend login API call App.jsx se hoga.
        await onLogin({
          email: form.email.trim(),
          password: form.password,
        });

        // Successful login par App.jsx dashboard par navigate karega.
      } else {
        if (typeof onRegister !== "function") {
          throw new Error("Registration handler is not connected in App.jsx.");
        }

        await onRegister({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });

        setMessage("Registration successful. Please sign in.");

        setMode("login");

        setForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  }

  function changeMode() {
    if (loading) return;

    setMode(isLogin ? "register" : "login");
    setError("");
    setMessage("");

    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        {/* Left branding panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-slate-900 p-10 text-white lg:flex xl:p-14">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-violet-400/20 blur-2xl" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl font-black text-indigo-700 shadow-lg">
              P
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                People<span className="text-violet-300">Hub</span>
              </h1>
              <p className="text-xs text-indigo-200">
                EMPLOYEE MANAGEMENT
              </p>
            </div>
          </div>

          <div className="relative my-12">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-widest text-indigo-100">
              YOUR WORKSPACE, SIMPLIFIED
            </span>

            <h2 className="mt-7 max-w-lg text-4xl font-bold leading-tight xl:text-5xl">
              Great teams start with great people.
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-indigo-100">
              Manage employee records, organize departments and keep your
              team connected in one place.
            </p>

            <div className="mt-9 space-y-4">
              {[
                "Centralized employee directory",
                "Role-based workspace access",
                "Simple employee and profile management",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/20 text-sm text-emerald-300">
                    ✓
                  </span>
                  <span className="text-sm text-indigo-50">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-xs tracking-widest text-indigo-200">
            PEOPLE FIRST. ALWAYS.
          </p>
        </section>

        {/* Authentication panel */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-lg font-black text-white">
                P
              </div>

              <h1 className="text-2xl font-bold text-slate-900">
                People<span className="text-indigo-600">Hub</span>
              </h1>
            </div>

            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
                Welcome to PeopleHub
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {isLogin ? "Welcome back" : "Create your account"}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {isLogin
                  ? "Sign in to access your employee workspace."
                  : "Enter your details to register as an employee."}
              </p>
            </div>

            {(error || serverError) && (
              <div className="mb-5">
                <Alert variant="error">
                  {error || serverError}
                </Alert>
              </div>
            )}

            {message && (
              <div className="mb-5">
                <Alert variant="success">{message}</Alert>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <Input
                  label="Full name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={updateField}
                  required
                />
              )}

              <Input
                label="Email address"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={updateField}
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={updateField}
                required
              />

              {!isLogin && (
                <Input
                  label="Confirm password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={updateField}
                  required
                />
              )}

              {isLogin && (
                <div className="flex items-center justify-between gap-3 text-sm">
                  <label className="flex items-center gap-2 text-slate-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
                    />
                    Remember me
                  </label>

                  <span className="font-medium text-slate-400">
                    Secure sign-in
                  </span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                    ? "Sign in to workspace →"
                    : "Create account →"}
              </Button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">PEOPLEHUB</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <p className="text-center text-sm text-slate-600">
              {isLogin ? "New employee?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={changeMode}
                disabled={loading}
                className="font-semibold text-indigo-600 transition hover:text-indigo-800 disabled:opacity-50"
              >
                {isLogin ? "Create account" : "Sign in"}
              </button>
            </p>

            {!isLogin && (
              <p className="mt-5 text-center text-xs leading-5 text-slate-400">
                New registrations receive employee access. Admin and HR roles
                must be assigned by an authorized administrator.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

