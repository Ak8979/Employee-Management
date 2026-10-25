export const AUTH_URL = "http://localhost:8080/api/auth";
export const EMPLOYEE_URL = "http://localhost:8080/api/employees";
export const PROFILE_URL = "http://localhost:8080/api/profile";

export async function apiRequest(url, options = {}, token = "") {
  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }

    throw new Error(
      "Backend se connection nahi ho pa raha. Check karo ki Spring Boot running hai."
    );
  }

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    if (
      response.status === 401 &&
      !url.endsWith("/login") &&
      !url.endsWith("/register")
    ) {
      window.dispatchEvent(new Event("employee-session-expired"));
    }

    const message =
      data && typeof data === "object"
        ? data.message || data.error || data.detail
        : data;

    throw new Error(
      typeof message === "string" && message
        ? message
        : `Request failed (${response.status})`
    );
  }

  return data;
}

