import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle, CheckCircle2, Lock, ShieldCheck, ChevronDown, Loader2, MapPin, X,
} from "lucide-react";
import { adminApi } from "../../services/admin/adminApi";

/* ══════════════════════════════════════════════════════
   ALL HELPER COMPONENTS ARE DEFINED OUTSIDE AdminRegister
   so React never recreates them on state change (fixes
   the "only one letter can be typed" bug).
══════════════════════════════════════════════════════ */

/* ── Indian States ── */
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

/* ── Password strength ── */
const calcStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};
const STRENGTH_COLORS = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
const STRENGTH_LABELS = ["Weak", "Fair", "Good", "Strong"];
const STRENGTH_TEXT = ["text-red-500", "text-orange-500", "text-yellow-600", "text-green-600"];

/* ── Section header ── */
const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="w-7 h-7 rounded-full border-2 border-red-200 flex items-center justify-center text-red-600 shrink-0">
      {icon}
    </div>
    <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
    <div className="flex-1 h-px bg-gradient-to-r from-red-100 to-transparent" />
  </div>
);

/* ── Inline field error ── */
const FieldError = ({ msg }) => (
  <AnimatePresence>
    {msg && (
      <motion.p
        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        className="text-xs text-red-500 flex items-center gap-1 mt-1"
      >
        <AlertCircle size={10} /> {msg}
      </motion.p>
    )}
  </AnimatePresence>
);

/* ── Floating Label Input ──
   • Label sits inside as placeholder at rest
   • On focus OR when the field has a value, it floats up to
     sit ON the top border (like the design in the screenshot)
   • Pure CSS transition — no framer-motion needed here so
     it doesn't interfere with focus / re-render
*/
const FloatingInput = ({
  label, name, value, onChange, type = "text",
  required, error, className = "", ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <input
        id={`fi-${name}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete="off"
        className={[
          "w-full px-4 pt-5 pb-2 border rounded-lg bg-white text-sm text-gray-800",
          "focus:outline-none transition-all duration-200 peer",
          focused
            ? "border-red-500 ring-1 ring-red-400/25 shadow-sm"
            : error
              ? "border-red-400"
              : "border-gray-200 hover:border-gray-300",
          className,
        ].join(" ")}
        {...rest}
      />
      {/* Floating label */}
      <label
        htmlFor={`fi-${name}`}
        className={[
          "absolute left-3.5 pointer-events-none select-none transition-all duration-200 origin-left",
          active
            ? "-top-2 text-[10px] font-bold tracking-widest uppercase px-1 bg-white"
            : "top-3.5 text-sm",
          active
            ? focused ? "text-red-600" : error ? "text-red-500" : "text-gray-500"
            : "text-gray-400",
        ].join(" ")}
      >
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
    </div>
  );
};

/* ── Floating Label Select ── */
const FloatingSelect = ({
  label, name, value, onChange, required, error, children,
}) => {
  const active = value.length > 0;
  return (
    <div className="relative">
      <select
        id={`fs-${name}`}
        name={name}
        value={value}
        onChange={onChange}
        className={[
          "w-full px-4 pt-5 pb-2 border rounded-lg bg-white text-sm appearance-none cursor-pointer",
          "focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-400/25 transition-all duration-200",
          error ? "border-red-400" : "border-gray-200 hover:border-gray-300",
          active ? "text-gray-800" : "",
        ].join(" ")}
      >
        <option value="" disabled />
        {children}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      {/* Floating label */}
      <label
        htmlFor={`fs-${name}`}
        className={[
          "absolute left-3.5 pointer-events-none select-none transition-all duration-200 origin-left",
          active
            ? "-top-2 text-[10px] font-bold tracking-widest uppercase px-1 bg-white text-gray-500"
            : "top-3.5 text-sm text-gray-400",
        ].join(" ")}
      >
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
    </div>
  );
};

/* ── Password field with floating label + eye toggle ── */
const FloatingPassword = ({
  label, name, value, onChange, required, error, show, onToggleShow,
  children,
}) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <input
        id={`fp-${name}`}
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete="new-password"
        className={[
          "w-full px-4 pt-5 pb-2 pr-10 border rounded-lg bg-white text-sm text-gray-800",
          "focus:outline-none transition-all duration-200",
          focused
            ? "border-red-500 ring-1 ring-red-400/25 shadow-sm"
            : error ? "border-red-400" : "border-gray-200 hover:border-gray-300",
        ].join(" ")}
      />
      <label
        htmlFor={`fp-${name}`}
        className={[
          "absolute left-3.5 pointer-events-none select-none transition-all duration-200 origin-left",
          active
            ? "-top-2 text-[10px] font-bold tracking-widest uppercase px-1 bg-white"
            : "top-3.5 text-sm",
          active
            ? focused ? "text-red-600" : error ? "text-red-500" : "text-gray-500"
            : "text-gray-400",
        ].join(" ")}
      >
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <button
        type="button"
        onClick={onToggleShow}
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
      >

      </button>
      {children}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
const AdminRegister = ({ isInModal = false }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    sellerName: "", storeName: "", emailId: "", phoneNumber: "",
    companyName: "", gstNo: "",
    pinCode: "", state: "", city: "", district: "",
    password: "", confirmPassword: "",
    agreedToTerms: false, agreedToSellerPolicy: false,
  });
  const [errs, setErrs] = useState({});
  const [globalErr, setGlobalErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  /* ── Pincode auto-fetch state ── */
  const [pinFetching, setPinFetching] = useState(false);
  const [pinFetched, setPinFetched] = useState(false);   // true → fields were auto-filled
  const [pinApiError, setPinApiError] = useState("");    // error from pincode API

  /* ── generic change handler ── */
  const ch = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    setErrs(p => ({ ...p, [name]: undefined }));
    setGlobalErr("");
  };

  /* ── Pincode handler: digits only, max 6, auto-fetch on complete ── */
  const handlePinCode = async (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 6);
    setForm(p => ({ ...p, pinCode: raw }));
    setErrs(p => ({ ...p, pinCode: undefined }));
    setPinApiError("");
    setGlobalErr("");

    // Reset auto-filled fields when user edits the pincode
    if (pinFetched) {
      setPinFetched(false);
      setForm(p => ({ ...p, pinCode: raw, state: "", city: "", district: "" }));
      return;
    }

    if (raw.length === 6) {
      setPinFetching(true);
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${raw}`);
        const data = await response.json();

        if (!Array.isArray(data) || data[0]?.Status !== "Success" || !data[0]?.PostOffice?.length) {
          setPinApiError("Invalid PIN code or area not found. Please enter details manually.");
          setPinFetching(false);
          return;
        }

        const postOffice = data[0].PostOffice[0];
        const fetchedState = postOffice.State || "";
        const fetchedDistrict = postOffice.District || "";
        const fetchedCity = postOffice.Division || postOffice.Block || postOffice.District || "";

        setForm(p => ({
          ...p,
          pinCode: raw,
          state: fetchedState,
          city: fetchedCity,
          district: fetchedDistrict,
        }));
        // Clear any previous errors for these fields
        setErrs(p => ({ ...p, pinCode: undefined, state: undefined, city: undefined, district: undefined }));
        setPinFetched(true);
      } catch {
        setPinApiError("Could not reach PIN code service. Please enter details manually.");
      } finally {
        setPinFetching(false);
      }
    }
  };

  /* ── Clear auto-filled address fields so user can edit manually ── */
  const clearPinFetch = () => {
    setPinFetched(false);
    setPinApiError("");
    setForm(p => ({ ...p, state: "", city: "", district: "" }));
  };

  /* ── Phone: only digits, max 10, block alpha/special ── */
  const handlePhone = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10); // strip non-digits, cap 10
    setForm(p => ({ ...p, phoneNumber: raw }));
    // live validation
    if (raw.length > 0 && !/^[6-9]/.test(raw)) {
      setErrs(p => ({ ...p, phoneNumber: "Indian numbers must start with 6, 7, 8 or 9" }));
    } else if (raw.length > 0 && raw.length < 10) {
      setErrs(p => ({ ...p, phoneNumber: `${10 - raw.length} more digit${10 - raw.length === 1 ? "" : "s"} needed` }));
    } else {
      setErrs(p => ({ ...p, phoneNumber: undefined }));
    }
    setGlobalErr("");
  };

  /* ── GST: filter to permitted characters only, auto-uppercase, cap 15 ── */
  /*
    GST format: 2 digits | 5 uppercase letters | 4 digits | 1 uppercase | 1 alphanumeric (not 0) | Z | 1 alphanumeric
    Allowed character set per position:
      pos 0-1  → digit
      pos 2-6  → uppercase letter
      pos 7-10 → digit
      pos 11   → uppercase letter
      pos 12   → uppercase letter or digit 1-9
      pos 13   → must be 'Z'
      pos 14   → uppercase letter or digit
    We apply a permissive filter: allow only [0-9A-Z] and auto-uppercase.
  */
  const handleGst = (e) => {
    // allow only alphanumeric, auto-uppercase, cap 15
    const raw = e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, "").slice(0, 15);
    setForm(p => ({ ...p, gstNo: raw }));
    // live hints
    if (raw.length > 0 && raw.length < 15) {
      setErrs(p => ({ ...p, gstNo: `${15 - raw.length} more character${15 - raw.length === 1 ? "" : "s"} needed` }));
    } else if (raw.length === 15) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(raw)) {
        setErrs(p => ({ ...p, gstNo: "Invalid GST format (e.g. 09AABCT1332L1ZS)" }));
      } else {
        setErrs(p => ({ ...p, gstNo: undefined }));
      }
    } else {
      setErrs(p => ({ ...p, gstNo: undefined }));
    }
    setGlobalErr("");
  };

  const validate = () => {
    const e = {};
    if (!form.sellerName.trim()) e.sellerName = "Seller name is required";
    if (!form.storeName.trim()) e.storeName = "Store name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailId))
      e.emailId = "Enter a valid email address";
    // Phone: 10 digits, starts with 6-9
    if (!form.phoneNumber) {
      e.phoneNumber = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.phoneNumber)) {
      e.phoneNumber = form.phoneNumber.length < 10
        ? "Phone number must be 10 digits"
        : "Must be a valid Indian mobile number (starts with 6–9)";
    }
    // GST: strict 15-char Indian GST format
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!form.gstNo) {
      e.gstNo = "GST number is required";
    } else if (form.gstNo.length !== 15) {
      e.gstNo = `GST number must be exactly 15 characters (${form.gstNo.length}/15 entered)`;
    } else if (!gstRegex.test(form.gstNo.toUpperCase())) {
      e.gstNo = "Invalid GST format — expected: 09AABCT1332L1ZS";
    }
    if (!/^\d{6}$/.test(form.pinCode)) e.pinCode = "PIN code must be 6 digits";
    if (!form.state) e.state = "Please select a state";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.district.trim()) e.district = "District is required";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    else if (!/(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(form.password))
      e.password = "Must include uppercase letter, number & special character";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!form.agreedToTerms) e.agreedToTerms = "Please agree to the Terms & Conditions";
    if (!form.agreedToSellerPolicy) e.agreedToSellerPolicy = "Please agree to the Seller Policy";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await adminApi.register(form);
      navigate("/seller/verify-email", {
        state: { email: form.emailId, adminId: res.adminId },
      });
    } catch (err) {
      setGlobalErr(err.response?.data?.message || err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //onclick of login text naviagete to login page 
  const navigateToLogin = () => {
    navigate("/seller-login");
  }


  const strength = calcStrength(form.password);

  /* ─────────── FORM ─────────── */
  const formBody = (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">

      {/* 1. Personal Information */}
      <div>
        <SectionHeader
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
          title="Personal Information"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-5">
          <div>
            <FloatingInput label="Seller Name" name="sellerName" value={form.sellerName}
              onChange={ch} required error={errs.sellerName} />
            <FieldError msg={errs.sellerName} />
          </div>

          <div>
            <FloatingInput label="Email Address" name="emailId" value={form.emailId}
              onChange={ch} type="email" required error={errs.emailId} />
            <FieldError msg={errs.emailId} />
          </div>
          <div>
            <FloatingInput label="Phone Number" name="phoneNumber" value={form.phoneNumber}
              onChange={handlePhone} type="tel" required error={errs.phoneNumber}
              inputMode="numeric" maxLength={10} />
            {/* Live char counter */}
            <div className="flex items-center justify-between mt-1">
              {errs.phoneNumber
                ? <FieldError msg={errs.phoneNumber} />
                : form.phoneNumber.length > 0
                  ? <p className="text-xs text-gray-400">{form.phoneNumber.length}/10 digits</p>
                  : <p className="text-xs text-gray-400">10-digit Indian mobile number</p>
              }
              {form.phoneNumber.length === 10 && /^[6-9]\d{9}$/.test(form.phoneNumber) && (
                <span className="text-xs text-green-600 flex items-center gap-0.5"><CheckCircle2 size={11} /> Valid</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Business Details */}
      <div>
        <SectionHeader
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>}
          title="Business Details"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-5">
          <div>
            <FloatingInput label="Store Name" name="storeName" value={form.storeName}
              onChange={ch} required error={errs.storeName} />
            <FieldError msg={errs.storeName} />
          </div>
          <div>
            <FloatingInput label="GST Number" name="gstNo" value={form.gstNo}
              onChange={handleGst} required error={errs.gstNo} maxLength={15} className="uppercase tracking-widest" />
            {/* Live progress + format hint */}
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-400">Format: 09AABCT1332L1ZS</p>
              <p className={`text-xs font-medium ${form.gstNo.length === 15 && !errs.gstNo ? "text-green-600" : "text-gray-400"
                }`}>
                {form.gstNo.length}/15
              </p>
            </div>
            {/* Visual position guide */}
            {form.gstNo.length > 0 && form.gstNo.length < 15 && (
              <p className="text-[10px] text-gray-400 mt-0.5 font-mono tracking-wide">
                {["DD", "LLLLL", "DDDD", "L", "L/D", "Z", "L/D"].map((seg, i) => (
                  <span key={i} className="mr-1">{seg}</span>
                ))}
                <span className="ml-1 text-gray-300">(D=digit, L=letter)</span>
              </p>
            )}
            {errs.gstNo && <FieldError msg={errs.gstNo} />}
          </div>
        </div>
      </div>

      {/* 3. Business Address */}
      <div>
        <SectionHeader
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>}
          title="Business Address"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-5">

          {/* PIN Code with live fetch indicator */}
          <div>
            <div className="relative">
              <FloatingInput label="PIN Code" name="pinCode" value={form.pinCode}
                onChange={handlePinCode} required error={errs.pinCode}
                inputMode="numeric" maxLength={6} />
              {/* Spinner / check icon inside field */}
              {pinFetching && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 size={16} className="animate-spin text-red-500" />
                </span>
              )}
              {pinFetched && !pinFetching && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle2 size={16} className="text-green-500" />
                </span>
              )}
            </div>
            <AnimatePresence mode="wait">
              {pinFetching ? (
                <motion.p key="fetching"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <Loader2 size={10} className="animate-spin" /> Fetching location details…
                </motion.p>
              ) : pinFetched ? (
                <motion.p key="fetched"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <CheckCircle2 size={10} /> Location auto-filled successfully
                </motion.p>
              ) : pinApiError ? (
                <motion.p key="apierr"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-xs text-orange-500 flex items-center gap-1 mt-1">
                  <AlertCircle size={10} /> {pinApiError}
                </motion.p>
              ) : (
                <motion.p key="hint"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-xs text-gray-400 mt-1">
                  Enter 6-digit PIN to auto-fill city, district &amp; state
                </motion.p>
              )}
            </AnimatePresence>
            <FieldError msg={errs.pinCode} />
          </div>

          {/* State — read-only when auto-filled, else dropdown */}
          <div>
            {pinFetched ? (
              <div className="relative">
                <FloatingInput label="State" name="state" value={form.state}
                  onChange={ch} required error={errs.state} readOnly
                  className="bg-green-50 border-green-300 cursor-default" />
                <button type="button" onClick={clearPinFetch}
                  title="Clear auto-filled fields"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <FloatingSelect label="State" name="state" value={form.state}
                onChange={ch} required error={errs.state}>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </FloatingSelect>
            )}

            <FieldError msg={errs.state} />
          </div>

          {/* City */}
          <div>
            <div className="relative">
              <FloatingInput label="City" name="city" value={form.city}
                onChange={ch} required error={errs.city}
                readOnly={pinFetched}
                className={pinFetched ? "bg-green-50 border-green-300 cursor-default" : ""} />
              {pinFetched && (
                <button type="button"
                  onClick={() => {
                    setForm(p => ({ ...p, city: "" }));
                    setErrs(p => ({ ...p, city: undefined }));
                    setPinFetched(false);
                  }}
                  title="Clear city"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                  <X size={14} />
                </button>
              )}
            </div>
            <FieldError msg={errs.city} />
          </div>

          {/* District */}
          <div>
            <div className="relative">
              <FloatingInput label="District" name="district" value={form.district}
                onChange={ch} required error={errs.district}
                readOnly={pinFetched}
                className={pinFetched ? "bg-green-50 border-green-300 cursor-default" : ""} />
              {pinFetched && (
                <button type="button"
                  onClick={() => {
                    setForm(p => ({ ...p, district: "" }));
                    setErrs(p => ({ ...p, district: undefined }));
                    setPinFetched(false);
                  }}
                  title="Clear district"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                  <X size={14} />
                </button>
              )}
            </div>
            <FieldError msg={errs.district} />
          </div>

        </div>
      </div>

      {/* 4. Account Security */}
      <div>
        <SectionHeader icon={<Lock size={14} />} title="Account Security" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-5">
          <div>
            <FloatingPassword
              label="Password" name="password" value={form.password}
              onChange={ch} required error={errs.password}

            >
              {form.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1 h-1">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${i < strength ? STRENGTH_COLORS[strength - 1] : "bg-gray-200"}`} />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${STRENGTH_TEXT[strength - 1] || "text-gray-400"}`}>
                    {STRENGTH_LABELS[strength - 1] || "Too short"}
                  </p>
                </div>
              )}
            </FloatingPassword>
            <FieldError msg={errs.password} />
          </div>
          <div>
            <FloatingPassword
              label="Confirm Password" name="confirmPassword" value={form.confirmPassword}
              onChange={ch} required error={errs.confirmPassword}
              show={showCpw} onToggleShow={() => setShowCpw(p => !p)}
            >
              {form.confirmPassword && form.password === form.confirmPassword && (
                <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                  <CheckCircle2 size={11} /> Passwords match
                </p>
              )}
            </FloatingPassword>
            <FieldError msg={errs.confirmPassword} />
          </div>
        </div>
      </div>


      {/* 5. Agreements */}
      <div className="space-y-3 pt-1">

        {/* Terms & Conditions */}
        <div>
          <label htmlFor="chk-agreedToTerms" className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 shrink-0">
              <input type="checkbox" id="chk-agreedToTerms" name="agreedToTerms"
                checked={form.agreedToTerms} onChange={ch} className="sr-only" />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200
          ${form.agreedToTerms ? "bg-red-600 border-red-600" : "border-gray-300 group-hover:border-red-400"}`}>
                {form.agreedToTerms && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                    <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-600">
              I have read, understood, and agree to the all{" "}
              <a href="/terms-conditions" target="_blank" rel="noreferrer"
                className="text-red-600 font-semibold hover:underline" onClick={e => e.stopPropagation()}>
                Terms &amp; Conditions
              </a>
              {" "}of Books Ka Bazaar.
            </span>
          </label>
          <FieldError msg={errs.agreedToTerms} />
        </div>

        {/* Seller Content Declaration */}
        <div>
          <label htmlFor="chk-agreedToSellerPolicy" className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 shrink-0">
              <input type="checkbox" id="chk-agreedToSellerPolicy" name="agreedToSellerPolicy"
                checked={form.agreedToSellerPolicy} onChange={ch} className="sr-only" />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200
                ${form.agreedToSellerPolicy ? "bg-red-600 border-red-600" : "border-gray-300 group-hover:border-red-400"}`}>
                {form.agreedToSellerPolicy && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                    <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-600">
              I confirm that all information provided by me is true and accurate, and that I have the legal
              right to list and sell the books uploaded by me. I understand that listing pirated, counterfeit,
              unauthorized, or prohibited books may result in immediate suspension or permanent termination of
              my seller account.
            </span>
          </label>
          <FieldError msg={errs.agreedToSellerPolicy} />
        </div>

      </div>

      {/* Global error */}
      <AnimatePresence>
        {globalErr && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 font-medium">{globalErr}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <motion.button type="submit" disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.99 }}
        className="w-full py-3.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-sm
          shadow-lg shadow-red-200 hover:from-red-700 hover:to-red-800 transition-all duration-200
          disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer">
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Creating your account...
          </>
        ) : (
          <><span>🔑</span> Complete Registration →</>
        )}
      </motion.button>

      {/* ── Footer links ── */}
      <div className="flex flex-col items-center gap-1.5 -mt-3 mb-4">
        <p className="text-sm text-gray-500">
          Already Registered?{" "}
          <button
            type="button"
            className="font-semibold text-red-600 hover:text-red-700 transition cursor-pointer"
            onClick={navigateToLogin}
          >
            Login
          </button>
        </p>

      </div>

      {/* Security note */}
      <p className="text-center text-xs text-gray-400 flex sm:items-center justify-center gap-1.5">
        <ShieldCheck size={13} className="text-green-500" />
        Your business details are encrypted and never shared without consent
      </p>
    </form>
  );

  if (isInModal) {
    return (
      <>
        <style>{`.reg-scroll::-webkit-scrollbar{display:none}.reg-scroll{scrollbar-width:none;-ms-overflow-style:none}`}</style>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.28 }}
          className="max-h-[62vh] overflow-y-auto reg-scroll pr-1">
          {formBody}
        </motion.div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {formBody}
    </div>
  );
};

export default AdminRegister;
