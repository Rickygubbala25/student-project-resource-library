const API_URL =
  localStorage.getItem("sprl_api_url") ||
  "http://localhost:5000/api";

async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = localStorage.getItem("sprl_token");

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(API_URL + path, {
    ...options,
    headers
  });

  let data = {};

  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

function saveAuth(data) {
  localStorage.setItem("sprl_token", data.token);
  localStorage.setItem("sprl_user", JSON.stringify(data.user));
}

function logout() {
  localStorage.removeItem("sprl_token");
  localStorage.removeItem("sprl_user");
  location.href = "login.html";
}
