import { client } from "./client/client.gen";

client.interceptors.request.use((req) => {
  const apiKey = localStorage.getItem("apiKey");
  if (apiKey) {
    // We add the type expected by fastapi dependency parsing
    // Actually FastAPI uses OAuth2PasswordBearer or custom scheme. The UI used "Bearer ${key}".
    req.headers.set("Authorization", `Bearer ${apiKey}`);
  }
  return req;
});

client.interceptors.response.use((res) => {
  if (res.status === 401) {
    localStorage.removeItem("apiKey");
    window.location.href = "/login";
  }
  return res;
});
