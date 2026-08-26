import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Loader2, CheckCircle2 } from "lucide-react";

/**
 * PincodeModal
 * Props:
 *   - isOpen: boolean
 *   - onClose: () => void
 *   - pincode: string
 *   - location: { division, district, state } | null
 *   - loading: boolean
 *   - error: string | null
 *   - setError: (e) => void
 *   - onSubmit: (pin: string) => Promise<boolean>
 */
export default function PincodeModal({
  isOpen,
  onClose,
  pincode,
  location,
  loading,
  error,
  setError,
  onSubmit,
}) {
  const [input, setInput] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setInput("");
      setSuccess(false);
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen, setError]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSuccess(false);
    const ok = await onSubmit(input);
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 800);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="pincode-backdrop"
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[99998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="pincode-modal"
            className="fixed z-[99999] inset-0 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          >
            <div
              className="pointer-events-auto w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-[#E31E2E] to-[#b0151f] px-6 pt-6 pb-5">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-full p-2 shrink-0">
                    <MapPin size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg leading-tight">
                      Deliver to your location
                    </h2>
                    <p className="text-white/75 text-xs mt-0.5">
                      Enter your pincode for accurate delivery info
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                {/* Current location display */}
                {location && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2.5">
                    <MapPin size={14} className="text-[#E31E2E] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-400 font-medium">Current delivery location</p>
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {location.division}
                        {location.district && location.district !== location.division
                          ? `, ${location.district}`
                          : ""}
                        {" — "}
                        <span className="text-[#E31E2E]">{pincode}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Pincode form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                      Enter Pincode
                    </label>
                    <div className="relative">
                      <input
                        ref={inputRef}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={input}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setInput(val);
                          if (error) setError(null);
                          setSuccess(false);
                        }}
                        placeholder={pincode || "e.g. 110001"}
                        className={`w-full px-4 py-3 text-base font-semibold rounded-xl border-2 transition-all focus:outline-none tracking-widest placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-300 ${
                          error
                            ? "border-red-400 focus:border-red-400 bg-red-50/40"
                            : success
                            ? "border-green-400 focus:border-green-400 bg-green-50/40"
                            : "border-gray-200 focus:border-[#E31E2E] bg-white"
                        }`}
                      />
                      {/* Status icon inside input */}
                      {loading && (
                        <Loader2
                          size={16}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#E31E2E] animate-spin"
                        />
                      )}
                      {success && !loading && (
                        <CheckCircle2
                          size={16}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500"
                        />
                      )}
                    </div>

                    {/* Error message */}
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-1.5 text-xs text-red-500 font-medium"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || input.length !== 6}
                    className="w-full py-3 rounded-xl bg-[#E31E2E] hover:bg-[#c41a27] active:bg-[#a8151f] text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Checking pincode...
                      </>
                    ) : success ? (
                      <>
                        <CheckCircle2 size={15} />
                        Location updated!
                      </>
                    ) : (
                      "Apply"
                    )}
                  </button>
                </form>

                <p className="mt-3 text-center text-[11px] text-gray-400">
                  Powered by India Post Office API
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
