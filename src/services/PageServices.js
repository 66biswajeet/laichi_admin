import requests from "./httpService";

const PageServices = {
  getAllPages: async ({ page, limit, search }) => {
    const searchParams = new URLSearchParams();
    if (page) searchParams.append("page", page);
    if (limit) searchParams.append("limit", limit);
    if (search) searchParams.append("search", search);

    return requests.get(`/pages?${searchParams.toString()}`);
  },

  getAllPagesWithoutPagination: async () => {
    return requests.get("/pages/all");
  },

  getPageById: async (id) => {
    return requests.get(`/pages/${id}`);
  },

  getPageBySlug: async (slug) => {
    return requests.get(`/pages/slug/${slug}`);
  },

  addPage: async (body) => {
    return requests.post("/pages/add", body);
  },

  updatePage: async (id, body) => {
    return requests.put(`/pages/${id}`, body);
  },

  updateStatus: async (id, body) => {
    return requests.put(`/pages/status/${id}`, body);
  },

  deletePage: async (id) => {
    return requests.delete(`/pages/${id}`);
  },

  updateManyPages: async (body) => {
    return requests.patch("/pages/update/many", body);
  },

  deleteManyPages: async (body) => {
    return requests.patch("/pages/delete/many", body);
  },
};

export default PageServices;
