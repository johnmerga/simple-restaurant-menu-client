const BASE_URL = "http://localhost:3000";

export const api = {
  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    console.log("Attempting login with:", { email });

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      console.error(
        "Login response not OK:",
        response.status,
        response.statusText,
      );
      throw new Error("Login failed");
    }

    const data = await response.json();
    console.log("Login successful, received token:", data);
    return data;
  },

  async signup(
    name: string,
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    console.log("Attempting signup with:", { name, email });

    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      console.error(
        "Signup response not OK:",
        response.status,
        response.statusText,
      );
      throw new Error("Signup failed");
    }

    const data = await response.json();
    console.log("Signup successful, received token:", data);
    return data;
  },

  async getMenu(token: string): Promise<any[]> {
    console.log("Fetching menu with token:", token);

    const response = await fetch(`${BASE_URL}/menu`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Menu fetch failed:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      throw new Error(errorText || "Failed to fetch menu");
    }

    const res = await response.json();
    console.log("Menu data received:", res);
    return res.data;
  },
};
