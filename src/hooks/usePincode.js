import { useState, useEffect, useCallback, useRef } from "react";

const DEFAULT_PINCODE = "804453";
const STORAGE_KEY = "bkb_pincode";
const LOCATION_KEY = "bkb_location";

/**
 * Fetches area/division info from the India Post Office API for a given pincode.
 * Returns { division, district, state } or null on failure.
 */
export async function fetchLocationByPincode(pincode) {
  if (!pincode || pincode.length !== 6) return null;
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data[0]?.Status !== "Success") return null;
    const po = data[0]?.PostOffice?.[0];
    if (!po) return null;
    return {
      division: po.Division || po.District || po.Region || "",
      district: po.District || "",
      state: po.State || "",
      name: po.Name || "",
    };
  } catch {
    return null;
  }
}

/**
 * usePincode — manages user's delivery pincode.
 *
 * ⚡ Performance notes:
 *  - localStorage is read via lazy initializers (once on mount, not every render)
 *  - API fetch is guarded by a ref to prevent double-fire in React StrictMode
 */
export function usePincode() {
  // ✅ Lazy initializers: run ONCE on mount, not on every re-render
  const [pincode, setPincodeState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || DEFAULT_PINCODE
  );
  const [location, setLocation] = useState(() => {
    const stored = localStorage.getItem(LOCATION_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [showPincodeModal, setShowPincodeModal] = useState(
    () => !localStorage.getItem(STORAGE_KEY)
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Guard against double-fetch in React StrictMode dev double-invocation
  const hasFetched = useRef(false);

  // On mount — if no cached location, silently fetch area for the current pincode
  useEffect(() => {
    if (!location && pincode && !hasFetched.current) {
      hasFetched.current = true;
      fetchLocationByPincode(pincode).then((loc) => {
        if (loc) {
          setLocation(loc);
          localStorage.setItem(LOCATION_KEY, JSON.stringify(loc));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPincode = useCallback(async (pin) => {
    const trimmed = pin.trim();
    if (!/^\d{6}$/.test(trimmed)) {
      setError("Please enter a valid 6-digit pincode.");
      return false;
    }
    setLoading(true);
    setError(null);
    const loc = await fetchLocationByPincode(trimmed);
    setLoading(false);
    if (!loc) {
      setError("No area found for this pincode. Please try another.");
      return false;
    }
    setPincodeState(trimmed);
    setLocation(loc);
    localStorage.setItem(STORAGE_KEY, trimmed);
    localStorage.setItem(LOCATION_KEY, JSON.stringify(loc));
    return true;
  }, []);

  return {
    pincode,
    location,
    loading,
    error,
    setError,
    setPincode,
    showPincodeModal,
    setShowPincodeModal,
  };
}
