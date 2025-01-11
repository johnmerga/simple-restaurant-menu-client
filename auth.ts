export class Auth {
  private static TOKEN_KEY = "auth_token";

  static setToken(token: string): void {
    console.log("Setting token in localStorage:", token);
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    console.log("Retrieved token from localStorage:", token);
    return token;
  }

  static removeToken(): void {
    console.log("Removing token from localStorage");
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    console.log("Checking authentication, token exists:", !!token);

    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expires = payload.exp * 1000;
      const isValid = expires > Date.now();
      console.log("Token validation:", {
        expires: new Date(expires),
        now: new Date(),
        isValid,
      });
      return isValid;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  }
}
