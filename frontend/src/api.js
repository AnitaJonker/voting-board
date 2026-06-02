export function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Token ${token}`;
  }
  console.log("TOKEN:", localStorage.getItem("token"));

  return fetch(url, {
    ...options,
    headers,
  });
}
