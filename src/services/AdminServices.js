import requests from "./httpService";

const AdminServices = {
  registerAdmin: async (body) => {
    return requests.post("/admin/register", body);
  },

  loginAdmin: async (body) => {
    return requests.post(`/admin/login`, body);
  },

  forgetPassword: async (body) => {
    return requests.put("/admin/forget-password", body);
  },

  resetPassword: async (body) => {
    return requests.put("/admin/reset-password", body);
  },

  signUpWithProvider: async (body) => {
    return requests.post("/admin/signup", body);
  },

  addStaff: async (body) => {
    return requests.post("/admin/add", body);
  },
  getAllStaff: async (body) => {
    return requests.get("/admin", body);
  },
  getStaffById: async (id, body) => {
    return requests.post(`/admin/${id}`, body);
  },

  updateStaff: async (id, body) => {
    return requests.put(`/admin/${id}`, body);
  },

  updateStaffStatus: async (id, body) => {
    return requests.put(`/admin/update-status/${id}`, body);
  },

  deleteStaff: async (id) => {
    return requests.delete(`/admin/${id}`);
  },

  // Custom Product Services
  getCustomProductSettings: async () => {
    return requests.get("/custom-products/settings");
  },

  updateCustomProductSettings: async (body) => {
    return requests.put("/custom-products/settings", body);
  },

  addShape: async (body) => {
    return requests.post("/custom-products/shapes", body);
  },

  updateShape: async (shapeId, body) => {
    return requests.put(`/custom-products/shapes/${shapeId}`, body);
  },

  deleteShape: async (shapeId) => {
    return requests.delete(`/custom-products/shapes/${shapeId}`);
  },

  addSizeRange: async (body) => {
    return requests.post("/custom-products/size-ranges", body);
  },

  updateSizeRange: async (sizeId, body) => {
    return requests.put(`/custom-products/size-ranges/${sizeId}`, body);
  },

  deleteSizeRange: async (sizeId) => {
    return requests.delete(`/custom-products/size-ranges/${sizeId}`);
  },
};

export default AdminServices;
