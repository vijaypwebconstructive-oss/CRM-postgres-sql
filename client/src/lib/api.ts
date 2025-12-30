import { apiRequest } from "./queryClient";

const safeArray = (data: any) => (Array.isArray(data) ? data : []);

export const api = {
  // Products
  getProducts: () => fetch("/api/products").then((res) => res.json()),
  createProduct: (data: any) => apiRequest("POST", "/api/products", data),
  updateProduct: (id: number, data: any) =>
    apiRequest("PUT", `/api/products/${id}`, data),
  deleteProduct: (id: number) => apiRequest("DELETE", `/api/products/${id}`),

  // Parties
  getParties: () => fetch("/api/parties").then((res) => res.json()),
  createParty: (data: any) => apiRequest("POST", "/api/parties", data),
  updateParty: (id: number, data: any) =>
    apiRequest("PUT", `/api/parties/${id}`, data),
  deleteParty: (id: number) => apiRequest("DELETE", `/api/parties/${id}`),

  // Production
  getProduction: () => fetch("/api/production").then((res) => res.json()),
  createProduction: (data: any) => apiRequest("POST", "/api/production", data),
  updateProduction: (id: number, data: any) =>
    apiRequest("PUT", `/api/production/${id}`, data),
  deleteProduction: (id: number) =>
    apiRequest("DELETE", `/api/production/${id}`),

  // Sales
  getSalesOrders: () => fetch("/api/sales").then((res) => res.json()),
  getSalesOrder: (id: number) =>
    fetch(`/api/sales/${id}`).then((res) => res.json()),
  createSalesOrder: (data: any) => apiRequest("POST", "/api/sales", data),
  fulfillOrder: (id: number, data: any) =>
    apiRequest("POST", `/api/sales/${id}/fulfill`, data),
  deleteSalesOrder: (id: number) => apiRequest("DELETE", `/api/sales/${id}`),
  cancelInvoice: (id: number) => apiRequest("PUT", `/api/sales/${id}/cancel`),

  // Stock Adjustments
  getStockAdjustments: () =>
    fetch("/api/stock-adjustments").then((res) => res.json()),
  createStockAdjustment: (data: any) =>
    apiRequest("POST", "/api/stock-adjustments", data),

  // Inventory
  getInventory: () => fetch("/api/inventory").then((res) => res.json()),

  // Dashboard
  getDashboardMetrics: () =>
    fetch("/api/dashboard/metrics").then((res) => res.json()),
};
