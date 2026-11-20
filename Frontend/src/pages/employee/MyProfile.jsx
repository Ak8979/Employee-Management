import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import { User, Lock, CheckCircle2, ShieldAlert, Save, KeyRound } from "lucide-react";

export default function MyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [contactForm, setContactForm] = useState({
    phone: "",
    emergencyContact: "",
    address: "",
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactMsg, setContactMsg] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await axiosClient.get("/profile");
      setProfile(data);
      setContactForm({
        phone: data.phone || "",
        emergencyContact: data.emergencyContact || "",
        address: data.address || "",
      });
    } catch (ignored) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateContact = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactMsg("");
    try {
      const updated = await axiosClient.put("/profile", contactForm);
      setProfile(updated);
      setContactMsg("Contact details updated successfully.");
    } catch (err) {
      alert(err.message || "Failed to update profile.");
    } finally {
      setContactLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordErr("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordErr("New passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordErr("Password must be at least 6 characters.");
      return;
    }

    setPasswordLoading(true);
    try {
      await axiosClient.put("/profile/change-password", {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMsg("Password changed successfully.");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordErr(err.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Personal Profile & Security
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          View official employment records and manage personal contact details and login credentials.
        </p>
      </div>

      {/* Official Employment Information Card (Read-only) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" />
          <span>Official Employment Record</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-xs">Employee Code</span>
            <span className="font-mono font-bold text-indigo-700 text-sm">
              {profile?.employeeCode || user?.employeeCode}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-xs">Full Name</span>
            <span className="font-semibold text-slate-900">
              {profile?.fullName || user?.name}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-xs">Corporate Email</span>
            <span className="font-medium text-slate-800 truncate block">
              {profile?.email || user?.email}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-xs">Department</span>
            <span className="font-semibold text-slate-900">
              {profile?.departmentName || user?.department || "General"}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-xs">Designation</span>
            <span className="font-semibold text-slate-900">
              {profile?.designation || user?.designation}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block text-xs">Joining Date</span>
            <span className="font-medium text-slate-800">
              {profile?.joiningDate || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Update Contact + Change Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Contact & Address</h3>

          {contactMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{contactMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdateContact} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Personal Phone Number
              </label>
              <input
                type="text"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Emergency Contact Number
              </label>
              <input
                type="text"
                value={contactForm.emergencyContact}
                onChange={(e) => setContactForm({ ...contactForm, emergencyContact: e.target.value })}
                placeholder="+91 9876543211"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Residential Address
              </label>
              <textarea
                rows="3"
                value={contactForm.address}
                onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                placeholder="House no, Street, City, State, Pincode"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={contactLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{contactLoading ? "Saving..." : "Save Contact Info"}</span>
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-600" />
            <span>Change Account Password</span>
          </h3>

          {passwordMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{passwordMsg}</span>
            </div>
          )}

          {passwordErr && (
            <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{passwordErr}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Current Password *
              </label>
              <input
                type="password"
                required
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                New Password *
              </label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{passwordLoading ? "Updating..." : "Update Password"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
