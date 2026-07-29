import { API_BASE_URL, apiFetch } from "./api";

export async function recordAnalyticsEvent(event) {
  const response = await fetch(`${API_BASE_URL}/api/analytics/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error("No se pudo registrar el evento de analíticas");
  }
}

export function getDashboardAnalytics() {
  return apiFetch("/analytics/dashboard");
}
