import { apiRequest } from "../api/api";
import { API_ENDPOINTS } from "../utils/constants";

const productService = {

  getProducts(page = 1, limit = 10) {
    return apiRequest(`${API_ENDPOINTS.PRODUCTS}?page=${page}&limit=${limit}`);
  },

  getProductDetails(id) {
    return apiRequest(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  }

};

export default productService;