/**
 * Global API Configuration for MarinZen
 * All requests are routed through the API Gateway on port 8000.
 */
export const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || "http://127.0.0.1:8000";
