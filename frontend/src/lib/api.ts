export async function fetchWithAuth(url: string, navigate: any) {
  const token = localStorage.getItem("apiKey");
  if (!token) {
    navigate("/login");
    throw new Error("No token");
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("apiKey");
    navigate("/login");
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    throw new Error("API Error: " + res.statusText);
  }

  return res.json();
}
