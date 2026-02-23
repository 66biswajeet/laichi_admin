import requests from "./httpService";

const ProductReviewServices = {
  getAllProductsWithReviews: async () => {
    return requests.get("/product-reviews/all");
  },

  getProductReviews: async (productId) => {
    return requests.get(`/product-reviews/${productId}`);
  },

  addProductReview: async (body) => {
    return requests.post("/product-reviews/add", body);
  },

  updateProductReview: async (id, body) => {
    return requests.put(`/product-reviews/${id}`, body);
  },

  deleteProductReview: async (id) => {
    return requests.delete(`/product-reviews/${id}`);
  },

  deleteAllProductReviews: async (productId) => {
    return requests.delete(`/product-reviews/product/${productId}`);
  },
};

export default ProductReviewServices;
