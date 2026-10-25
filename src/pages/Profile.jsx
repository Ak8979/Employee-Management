import { useState } from "react";
import Button from "../component/ui/Button";
import Input from "../component/ui/Input";
import Alert from "../component/ui/Alert";
import Avatar from "../component/ui/Avatar";

const defaultUser = {
  name: "Aarav Sharma",
  email: "aarav@peoplehub.com",
  role: "ADMIN",
  department: "Engineering",
  joiningDate: "2025-01-15",
  address: "New Delhi, India",
};

function Profile({
  user = defaultUser,
  onBack = () => {},
  onSaveProfile,
  onChangePassword,
}) {
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
    joiningDate: user?.joiningDate || "",
    address: user?.address || "",
    role: user?.role || "EMPLOYEE",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [visiblePasswords, setVisiblePasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const updateProfileField = (event) => {
    const { name, value } = event.target;
    setProfile((previous) => ({ ...previous, [name]: value }));
    setError("");
    setSuccess("");
  };

  const updatePasswordField = (event) => {
    const { name, value } = event.target;
    setPasswords((previous) => ({ ...previous, [name]: value }));
    setError("");
    setSuccess("");
  };

  const togglePasswordVisibility = (field) => {
    setVisiblePasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (profile.name.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      if (onSaveProfile) {
        await onSaveProfile({
          ...profile,
          name: profile.name.trim(),
          email: profile.email.trim(),
          address: profile.address.trim(),
        });
      }

      setEditing(false);
      setSuccess(
        onSaveProfile
          ? "Profile updated successfully."
          : "Profile form validated. Connect the save handler to persist changes.",
      );
    } catch (err) {
      setError(err?.message || "Unable to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!passwords.currentPassword || !passwords.newPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (passwords.newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (passwords.newPassword === passwords.currentPassword) {
      setError("New password must be different from the current password.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      setLoading(true);

      if (onChangePassword) {
        await onChangePassword({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        });
        setSuccess("Password changed successfully.");
      } else {
        setSuccess(
          "Password form validated. Connect the password handler to save changes.",
        );
      }

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err?.message || "Unable to change password.");
    } finally {
      setLoading(false);
    }
  };

  const fullName = profile.name || "Employee";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const roleLabel = (profile.role || "EMPLOYEE")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());

  const memberSince = profile.joiningDate
    ? new Date(`${profile.joiningDate}T00:00:00`).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })
    : "Not specified";

  const passwordFields = [
    {
      name: "currentPassword",
      label: "Current password",
      placeholder: "Enter current password",
    },
    {
      name: "newPassword",
      label: "New password",
      placeholder: "Enter new password",
    },
    {
      name: "confirmPassword",
      label: "Confirm new password",
      placeholder: "Re-enter new password",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top navigation */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-black text-white shadow-lg shadow-indigo-200">
              P
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
                PeopleHub
              </h1>
              <p className="text-xs text-slate-500">Employee workspace</p>
            </div>
          </div>

          <Button variant="secondary" onClick={onBack}>
            <span className="mr-2" aria-hidden="true">
              ←
            </span>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
            Account settings
          </p>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            My Profile
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Manage your personal information, review your employee details, and
            keep your account secure.
          </p>
        </div>

        {(error || success) && (
          <div className="mb-6">
            <Alert variant={error ? "error" : "success"}>
              {error || success}
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* Left profile card */}
          <aside className="lg:col-span-4">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="relative h-32 overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700">
                <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full border-[24px] border-white/10" />
                <div className="absolute -bottom-16 left-12 h-32 w-32 rounded-full bg-white/10" />
              </div>

              <div className="px-6 pb-6">
                <div className="-mt-12 mb-4 flex items-end justify-between">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-gradient-to-br from-indigo-100 to-violet-100 text-2xl font-black text-indigo-700 shadow-md">
                    {initials || <Avatar name={fullName} size="lg" />}
                  </div>

                  <span className="mb-1 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Active account
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  {fullName}
                </h3>
                <p className="mt-1 break-all text-sm text-slate-500">
                  {profile.email}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                    {roleLabel}
                  </span>
                  {profile.department && (
                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {profile.department}
                    </span>
                  )}
                </div>

                <div className="my-6 border-t border-slate-100" />

                <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                  Account overview
                </h4>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true">
                        <rect x="3" y="5" width="18" height="16" rx="2" />
                        <path d="M16 3v4M8 3v4M3 10h18" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Member since</p>
                      <p className="text-sm font-bold text-slate-800">
                        {memberSince}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true">
                        <path d="M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4Z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Account role</p>
                      <p className="text-sm font-bold text-slate-800">
                        {roleLabel}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security note */}
            <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true">
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Keep your account secure
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Use a strong, unique password and never share it with
                    anyone.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("security");
                      setError("");
                      setSuccess("");
                    }}
                    className="mt-3 text-xs font-bold text-indigo-700 hover:text-indigo-900">
                    Update password →
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Right settings panel */}
          <section className="lg:col-span-8">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {/* Tabs */}
              <div className="flex gap-6 border-b border-slate-100 px-5 sm:px-8">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("profile");
                    setError("");
                    setSuccess("");
                  }}
                  className={`relative py-5 text-sm font-bold transition ${
                    activeTab === "profile"
                      ? "text-indigo-700"
                      : "text-slate-500 hover:text-slate-800"
                  }`}>
                  Personal information
                  {activeTab === "profile" && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-indigo-600" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("security");
                    setError("");
                    setSuccess("");
                  }}
                  className={`relative py-5 text-sm font-bold transition ${
                    activeTab === "security"
                      ? "text-indigo-700"
                      : "text-slate-500 hover:text-slate-800"
                  }`}>
                  Security & password
                  {activeTab === "security" && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-indigo-600" />
                  )}
                </button>
              </div>

              <div className="p-5 sm:p-8">
                {activeTab === "profile" ? (
                  <>
                    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900">
                          Personal information
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Your personal and employment information.
                        </p>
                      </div>

                      {!editing && (
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setEditing(true);
                            setError("");
                            setSuccess("");
                          }}>
                          <span className="mr-2" aria-hidden="true">
                            ✎
                          </span>
                          Edit profile
                        </Button>
                      )}
                    </div>

                    <form onSubmit={handleProfileSave}>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Input
                          label="Full name"
                          name="name"
                          value={profile.name}
                          onChange={updateProfileField}
                          placeholder="Enter your full name"
                          required
                          disabled={!editing || loading}
                        />

                        <Input
                          label="Email address"
                          name="email"
                          type="email"
                          value={profile.email}
                          onChange={updateProfileField}
                          placeholder="Enter your email"
                          required
                          disabled={!editing || loading}
                        />

                        <Input
                          label="Department"
                          name="department"
                          value={profile.department}
                          onChange={updateProfileField}
                          placeholder="Enter department"
                          disabled={!editing || loading}
                        />

                        <div>
                          <label
                            htmlFor="profile-role"
                            className="mb-2 block text-sm font-semibold text-slate-700">
                            System role
                          </label>
                          <input
                            id="profile-role"
                            value={roleLabel}
                            disabled
                            className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
                          />
                          <p className="mt-1 text-xs text-slate-400">
                            Role changes require authorized access.
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="profile-joining-date"
                            className="mb-2 block text-sm font-semibold text-slate-700">
                            Joining date
                          </label>
                          <input
                            id="profile-joining-date"
                            type="date"
                            name="joiningDate"
                            value={profile.joiningDate}
                            onChange={updateProfileField}
                            disabled={!editing || loading}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-100 disabled:text-slate-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor="profile-address"
                            className="mb-2 block text-sm font-semibold text-slate-700">
                            Address
                          </label>
                          <textarea
                            id="profile-address"
                            name="address"
                            rows={3}
                            value={profile.address}
                            onChange={updateProfileField}
                            disabled={!editing || loading}
                            placeholder="Enter your address"
                            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:bg-slate-100 disabled:text-slate-500"
                          />
                        </div>
                      </div>

                      {editing && (
                        <div className="mt-7 flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-6 sm:flex-row">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                              setProfile({
                                name: user?.name || "",
                                email: user?.email || "",
                                department: user?.department || "",
                                joiningDate: user?.joiningDate || "",
                                address: user?.address || "",
                                role: user?.role || "EMPLOYEE",
                              });
                              setEditing(false);
                              setError("");
                              setSuccess("");
                            }}
                            disabled={loading}>
                            Cancel
                          </Button>

                          <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}>
                            {loading ? "Saving..." : "Save changes"}
                          </Button>
                        </div>
                      )}
                    </form>
                  </>
                ) : (
                  <>
                    <div className="mb-7">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                        <svg
                          className="h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          aria-hidden="true">
                          <rect x="4" y="10" width="16" height="11" rx="2" />
                          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        Change password
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Choose a strong password to protect your account.
                      </p>
                    </div>

                    <form onSubmit={handlePasswordSave} className="space-y-5">
                      {passwordFields.map((field) => (
                        <div key={field.name}>
                          <label
                            htmlFor={field.name}
                            className="mb-2 block text-sm font-semibold text-slate-700">
                            {field.label}
                          </label>

                          <div className="relative">
                            <input
                              id={field.name}
                              name={field.name}
                              type={
                                visiblePasswords[field.name]
                                  ? "text"
                                  : "password"
                              }
                              value={passwords[field.name]}
                              onChange={updatePasswordField}
                              placeholder={field.placeholder}
                              required
                              autoComplete={
                                field.name === "currentPassword"
                                  ? "current-password"
                                  : "new-password"
                              }
                              disabled={loading}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-16 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                togglePasswordVisibility(field.name)
                              }
                              className="absolute inset-y-0 right-3 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                              aria-label={
                                visiblePasswords[field.name]
                                  ? "Hide password"
                                  : "Show password"
                              }>
                              {visiblePasswords[field.name] ? "Hide" : "Show"}
                            </button>
                          </div>

                          {field.name === "newPassword" && (
                            <p className="mt-2 text-xs text-slate-500">
                              Use at least 8 characters. A mix of letters,
                              numbers, and symbols is recommended.
                            </p>
                          )}
                        </div>
                      ))}

                      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-lg" aria-hidden="true">
                            ⓘ
                          </span>
                          <p className="text-xs leading-5 text-amber-800">
                            After connecting the backend, your current password
                            will be verified securely by the server. Never store
                            plain-text passwords in the browser.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end border-t border-slate-100 pt-6">
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={loading}>
                          {loading ? "Updating..." : "Update password"}
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>

        <footer className="py-8 text-center text-xs text-slate-400">
          PeopleHub Employee Workspace · Account Settings
        </footer>
      </main>
    </div>
  );
}

export default Profile;
