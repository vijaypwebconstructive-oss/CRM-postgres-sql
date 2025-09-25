import { apiRequest } from "./queryClient";

export const api = {
  // Products
  getProducts: () => fetch("/api/products").then(res => res.json()),
  createProduct: (data: any) => apiRequest("POST", "/api/products", data),
  updateProduct: (id: number, data: any) => apiRequest("PUT", `/api/products/${id}`, data),
  deleteProduct: (id: number) => apiRequest("DELETE", `/api/products/${id}`),

  // Parties
  getParties: () => fetch("/api/parties").then(res => res.json()),
  createParty: (data: any) => apiRequest("POST", "/api/parties", data),

  // Production
  getProduction: () => fetch("/api/production").then(res => res.json()),
  createProduction: (data: any) => apiRequest("POST", "/api/production", data),

  // Sales
  getSalesOrders: () => fetch("/api/sales").then(res => res.json()),
  getSalesOrder: (id: number) => fetch(`/api/sales/${id}`).then(res => res.json()),
  createSalesOrder: (data: any) => apiRequest("POST", "/api/sales", data),
  fulfillOrder: (id: number, data: any) => apiRequest("POST", `/api/sales/${id}/fulfill`, data),

  // Stock Adjustments
  getStockAdjustments: () => fetch("/api/stock-adjustments").then(res => res.json()),
  createStockAdjustment: (data: any) => apiRequest("POST", "/api/stock-adjustments", data),

  // Inventory
  getInventory: () => fetch("/api/inventory").then(res => res.json()),

  // Dashboard
  getDashboardMetrics: () => fetch("/api/dashboard/metrics").then(res => res.json()),
};
