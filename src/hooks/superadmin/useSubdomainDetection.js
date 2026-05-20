import { useEffect, useState } from 'react';

/**
 * Custom hook to detect and handle subdomain routing
 * Automatically routes to superadmin if accessed via superadmin subdomain
 */
export const useSubdomainDetection = () => {
  const [subdomain, setSubdomain] = useState(null);
  const [isSuperAdminSubdomain, setIsSuperAdminSubdomain] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    // Extract subdomain (first part if it exists and is not localhost)
    if (parts.length > 1 && !hostname.includes('localhost')) {
      setSubdomain(parts[0]);
    } else if (hostname === 'superadmin.localhost' || hostname === 'superadmin.localhost:5173') {
      setSubdomain('superadmin');
    }

    // Check if accessing superadmin subdomain
    setIsSuperAdminSubdomain(
      hostname.startsWith('superadmin.') ||
      hostname === 'superadmin.localhost' ||
      hostname === 'superadmin.localhost:5173'
    );
  }, []);

  return {
    subdomain,
    isSuperAdminSubdomain,
    hostname: window.location.hostname,
    protocol: window.location.protocol,
  };
};

export default useSubdomainDetection;
