import { useState, useEffect } from "react";
import { userApi } from "../../services/user/userApi";
import { 
  Plus, Trash2, Edit3, Check, Loader2, AlertCircle, X, 
  MapPin, Home, Briefcase, Compass
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Form states
  const [addressType, setAddressType] = useState("HOME");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("India");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const res = await userApi.getAddresses();
      
      let list = [];
      if (res && Array.isArray(res)) {
        list = res;
      } else if (res && res.success && Array.isArray(res.data)) {
        list = res.data;
      } else if (res && Array.isArray(res.data)) {
        list = res.data;
      } else if (res && res.addresses && Array.isArray(res.addresses)) {
        list = res.addresses;
      }
      
      setAddresses(list);
    } catch (err) {
      console.warn("⚠️ Failed to load addresses:", err.message);
      toast.error("Failed to fetch shipping addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddForm = () => {
    setEditingAddress(null);
    setAddressType("HOME");
    setFullName("");
    setPhoneNumber("");
    setAddressLine1("");
    setCity("");
    setState("");
    setPincode("");
    setCountry("India");
    setIsDefault(addresses.length === 0); // Default to true if it is the first address
    setShowForm(true);
  };

  const handleOpenEditForm = (addr) => {
    setEditingAddress(addr);
    setAddressType(addr.addressType || "HOME");
    setFullName(addr.fullName || "");
    setPhoneNumber(addr.phoneNumber || "");
    setAddressLine1(addr.addressLine1 || "");
    setCity(addr.city || "");
    setState(addr.state || "");
    setPincode(addr.pincode || "");
    setCountry(addr.country || "India");
    setIsDefault(addr.isDefault === true || addr.isDefault === "true");
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      toast.error("Phone number should be at least 10 digits");
      return;
    }
    if (pincode.length < 6) {
      toast.error("Pincode should be 6 digits");
      return;
    }

    setIsSaving(true);
    const addressData = {
      addressType,
      fullName,
      phoneNumber,
      addressLine1,
      city,
      state,
      pincode,
      isDefault: isDefault.toString(), // API handles string "true" / "false"
    };

    try {
      if (editingAddress) {
        // Update Address
        await userApi.updateAddress(editingAddress.addressId || editingAddress.id, addressData);
        toast.success("Shipping address updated successfully!");
      } else {
        // Create Address
        await userApi.createAddress(addressData);
        toast.success("Shipping address added successfully!");
      }
      handleCloseForm();
      fetchAddresses();
    } catch (err) {
      console.error("❌ Failed to save address:", err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to save address";
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (addrId) => {
    if (!window.confirm("Are you sure you want to delete this shipping address?")) return;

    try {
      await userApi.deleteAddress(addrId);
      toast.success("Shipping address deleted!");
      fetchAddresses();
    } catch (err) {
      console.error("❌ Failed to delete address:", err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to delete address";
      toast.error(errMsg);
    }
  };

  const handleSetDefault = async (addr) => {
    const addrId = addr.addressId || addr.id;
    try {
      // Attempt using the /default endpoint
      try {
        await userApi.setDefaultAddress(addrId);
      } catch (endpointErr) {
        console.warn("⚠️ Dedicated setDefault endpoint failed or missing. Falling back to PUT update:", endpointErr.message);
        // Fallback: PUT update setting isDefault: "true"
        await userApi.updateAddress(addrId, {
          ...addr,
          isDefault: "true"
        });
      }
      toast.success("Default address updated!");
      fetchAddresses();
    } catch (err) {
      console.error("❌ Failed to set default address:", err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to set default address";
      toast.error(errMsg);
    }
  };

  // Helper to get address icon
  const getAddressIcon = (type) => {
    switch (type?.toUpperCase()) {
      case "HOME":
        return <Home size={16} className="text-blue-500" />;
      case "WORK":
        return <Briefcase size={16} className="text-amber-500" />;
      default:
        return <Compass size={16} className="text-purple-500" />;
    }
  };

  return (
    <div className="font-sans">
      <div className="flex justify-between items-center pb-5 border-b border-gray-100 mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Delivery Addresses</h3>
          <p className="text-xs text-gray-500 mt-1">Manage multiple shipping addresses for faster checkouts.</p>
        </div>
        {!showForm && (
          <button
            onClick={handleOpenAddForm}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#E31E2E] text-white hover:bg-red-700 rounded-xl font-bold text-xs shadow-sm transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Address</span>
          </button>
        )}
      </div>

      {/* Address Form inline */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-6 bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                {editingAddress ? "Edit Shipping Address" : "Add New Shipping Address"}
              </h4>
              <button
                type="button"
                onClick={handleCloseForm}
                className="text-slate-400 hover:text-slate-600 transition p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Type Select */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Address Type</label>
                <div className="flex gap-3">
                  {["HOME", "WORK", "OTHER"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAddressType(type)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        addressType === type
                          ? "bg-white border-[#E31E2E] text-[#E31E2E] shadow-xs"
                          : "bg-transparent border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {getAddressIcon(type)}
                      <span className="capitalize">{type.toLowerCase()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Recipient Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tribhuvan nath sagar"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E2E]/20 focus:border-[#E31E2E] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    maxLength={10}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E2E]/20 focus:border-[#E31E2E] transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Street Address / Address Line 1</label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="House / Flat No., Building, Street, Area"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E2E]/20 focus:border-[#E31E2E] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E2E]/20 focus:border-[#E31E2E] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E2E]/20 focus:border-[#E31E2E] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit pincode"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#E31E2E]/20 focus:border-[#E31E2E] transition-all"
                  />
                </div>
              </div>

              {/* Set Default */}
              <div className="flex items-center gap-2 pt-2 select-none">
                <input
                  type="checkbox"
                  id="defaultAddressCheckbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  disabled={addresses.length === 0}
                  className="rounded border-slate-300 text-[#E31E2E] focus:ring-[#E31E2E] w-4.5 h-4.5 cursor-pointer disabled:opacity-50"
                />
                <label 
                  htmlFor="defaultAddressCheckbox" 
                  className={`text-xs font-bold text-slate-600 cursor-pointer ${addresses.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Set as Default Shipping Address
                </label>
              </div>

              {/* Actions row */}
              <div className="flex gap-3 pt-3 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#E31E2E] hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:bg-slate-200"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>Save Shipping Address</span>
                </button>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-350 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading state */}
      {isLoading ? (
        <div className="py-12 flex justify-center items-center gap-2 text-gray-500 font-medium">
          <Loader2 size={20} className="animate-spin text-[#E31E2E]" />
          <span>Loading shipping addresses...</span>
        </div>
      ) : addresses.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 flex flex-col items-center">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
            <MapPin size={22} />
          </div>
          <h4 className="text-sm font-bold text-slate-700">No Shipping Address Found</h4>
          <p className="text-xs text-slate-400 mt-1 mb-5">Please add a shipping location for ordering books.</p>
          <button
            onClick={handleOpenAddForm}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#E31E2E] text-white hover:bg-red-700 rounded-xl font-bold text-xs shadow-sm transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Shipping Address</span>
          </button>
        </div>
      ) : (
        /* Address Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => {
            const isAddrDefault = addr.isDefault === true || addr.isDefault === "true";
            return (
              <div
                key={addr.addressId || addr.id}
                className={`bg-white border rounded-2xl p-5 shadow-xs relative flex flex-col justify-between hover:shadow-md transition duration-200 ${
                  isAddrDefault ? "border-green-500/80 bg-green-50/[0.02]" : "border-slate-100"
                }`}
              >
                <div>
                  {/* Card Header with badges */}
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center">
                        {getAddressIcon(addr.addressType)}
                      </div>
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                        {addr.addressType || "HOME"}
                      </span>
                    </div>
                    {isAddrDefault && (
                      <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-[9px] font-black uppercase tracking-wider shadow-xs">
                        <Check size={9} className="stroke-[3]" />
                        <span>Default</span>
                      </span>
                    )}
                  </div>

                  {/* Recipient details */}
                  <h4 className="font-extrabold text-sm text-slate-900">{addr.fullName}</h4>
                  <p className="text-xs text-slate-600 mt-1.5 font-medium leading-relaxed font-sans select-all">
                    {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 font-sans">
                    Country: <span className="font-bold text-slate-700">India</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-2 font-medium font-sans">
                    Phone: <span className="text-slate-850 font-bold select-all">{addr.phoneNumber}</span>
                  </p>
                </div>

                {/* Card footer actions */}
                <div className="flex items-center justify-between border-t border-slate-50 pt-3.5 mt-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenEditForm(addr)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-850 cursor-pointer flex items-center gap-1 transition"
                      title="Edit Address"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.addressId || addr.id)}
                      className="text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer flex items-center gap-1 transition"
                      title="Delete Address"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>

                  {!isAddrDefault && (
                    <button
                      onClick={() => handleSetDefault(addr)}
                      className="text-[10px] font-black text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100/70 border border-green-100 rounded-lg px-2.5 py-1 uppercase tracking-wider cursor-pointer transition"
                    >
                      Set Default
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AddressManager;
