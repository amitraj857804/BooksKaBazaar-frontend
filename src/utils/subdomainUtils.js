/**
 * Subdomain Detection and Routing Utilities
 * Helps detect subdomains and route accordingly
 */

export const SubdomainUtils = {
  /**
   * Get current subdomain
   */
  getCurrentSubdomain: () => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    if (parts.length > 1 && !hostname.includes('localhost')) {
      return parts[0];
    } else if (hostname === 'superadmin.localhost' || hostname.startsWith('superadmin.')) {
      return 'superadmin';
    }
    return null;
  },

  /**
   * Check if current access is from superadmin subdomain
   */
  isSuperAdminAccess: () => {
    const hostname = window.location.hostname;
    return (
      hostname.startsWith('superadmin.') ||
      hostname === 'superadmin.localhost' ||
      hostname === 'superadmin.localhost:5173'
    );
  },

  /**
   * Get full URL with subdomain
   */
  getURLWithSubdomain: (subdomain, path = '/') => {
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';

    // For localhost development
    if (window.location.hostname === 'localhost') {
      return `${protocol}//superadmin.localhost${port}${path}`;
    }

    // For production domains
    const domain = window.location.hostname.split('.').slice(1).join('.');
    return `${protocol}//${subdomain}.${domain}${port}${path}`;
  },

  /**
   * Get API base URL based on environment
   */
  getApiBaseUrl: (apiUrl = process.env.VITE_API_URL) => {
    if (!apiUrl) {
      return process.env.VITE_API_URL || 'http://localhost:8080/api';
    }
    return apiUrl;
  },

  /**
   * Build full API endpoint
   */
  buildApiEndpoint: (endpoint, apiBase = null) => {
    const baseUrl = apiBase || SubdomainUtils.getApiBaseUrl();
    return `${baseUrl}${endpoint}`;
  },

  /**
   * Redirect to subdomain
   */
  redirectToSubdomain: (subdomain, path = '/') => {
    const url = SubdomainUtils.getURLWithSubdomain(subdomain, path);
    window.location.href = url;
  },

  /**
   * Get environment info for debugging
   */
  getEnvironmentInfo: () => {
    return {
      hostname: window.location.hostname,
      subdomain: SubdomainUtils.getCurrentSubdomain(),
      isSuperAdminAccess: SubdomainUtils.isSuperAdminAccess(),
      protocol: window.location.protocol,
      port: window.location.port,
      apiBase: SubdomainUtils.getApiBaseUrl(),
    };
  },
};

export default SubdomainUtils;
