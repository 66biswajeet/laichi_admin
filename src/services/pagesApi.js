import requests from "./httpService";

const pagesApi = {
  // ── Read ──────────────────────────────────────────────────────────────────
  getAllPages: ({ page = 1, limit = 8, search = "" } = {}) => {
    const p = new URLSearchParams({ page, limit });
    if (search) p.append("search", search);
    return requests.get(`/pages?${p.toString()}`);
  },
  getAllPagesPublic: () => requests.get("/pages/all"),
  getPageById: (id) => requests.get(`/pages/${id}`),
  getPageBySlug: (slug) => requests.get(`/pages/slug/${slug}`),

  // ── Write ─────────────────────────────────────────────────────────────────
  createPage: (data) => requests.post("/pages/add", data),
  updatePage: (id, data) => requests.put(`/pages/${id}`, data),
  updateStatus: (id, data) => requests.put(`/pages/status/${id}`, data),
  publishPage: (id) => requests.put(`/pages/${id}/publish`, {}),
  unpublishPage: (id) => requests.put(`/pages/${id}/unpublish`, {}),
  deletePage: (id) => requests.delete(`/pages/${id}`),
  updateManyPages: (data) => requests.patch("/pages/update/many", data),
  deleteManyPages: (data) => requests.patch("/pages/delete/many", data),

  // ── Preview ───────────────────────────────────────────────────────────────
  createPreviewToken: (id) => requests.post(`/pages/${id}/preview-token`, {}),

  // ── Version history ───────────────────────────────────────────────────────
  getVersionHistory: (id) => requests.get(`/pages/versions/${id}`),
  restoreVersion: (id, versionNumber) =>
    requests.post(`/pages/restore/${id}/${versionNumber}`, {}),
};

export default pagesApi;
