import requests from "./httpService";

const CookieConsentServices = {
  // Get all cookie consents with pagination and filters
  getAllCookieConsents: async ({
    page = 1,
    limit = 20,
    consentType = "all",
    device = "all",
    country = "all",
    startDate,
    endDate,
    search,
  }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (consentType && consentType !== "all") {
      params.append("consentType", consentType);
    }
    if (device && device !== "all") {
      params.append("device", device);
    }
    if (country && country !== "all") {
      params.append("country", country);
    }
    if (startDate) {
      params.append("startDate", startDate);
    }
    if (endDate) {
      params.append("endDate", endDate);
    }
    if (search) {
      params.append("search", search);
    }

    return requests.get(`/cookie-consent?${params.toString()}`);
  },

  // Get cookie consent statistics
  getCookieConsentStats: async ({ startDate, endDate }) => {
    const params = new URLSearchParams();

    if (startDate) {
      params.append("startDate", startDate);
    }
    if (endDate) {
      params.append("endDate", endDate);
    }

    return requests.get(`/cookie-consent/statistics?${params.toString()}`);
  },

  // Get single consent by ID
  getCookieConsentById: async (id) => {
    return requests.get(`/cookie-consent/${id}`);
  },

  // Delete consent (GDPR compliance)
  deleteCookieConsent: async (id) => {
    return requests.delete(`/cookie-consent/${id}`);
  },

  // Export consents
  exportCookieConsents: async ({ startDate, endDate, consentType = "all" }) => {
    const params = new URLSearchParams();

    if (startDate) {
      params.append("startDate", startDate);
    }
    if (endDate) {
      params.append("endDate", endDate);
    }
    if (consentType && consentType !== "all") {
      params.append("consentType", consentType);
    }

    return requests.get(`/cookie-consent/export?${params.toString()}`);
  },
};

export default CookieConsentServices;
