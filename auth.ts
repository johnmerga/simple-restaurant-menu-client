export class Auth {
  private static TOKEN_KEY = "auth_token";
  private static USER_ROLES_KEY = "user_roles"; // New key for storing roles

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
    localStorage.removeItem(this.USER_ROLES_KEY); // Clear roles when logging out
  }

  static setUserRoles(roles: string[]): void {
    console.log("Setting user roles in localStorage:", roles);
    localStorage.setItem(this.USER_ROLES_KEY, JSON.stringify(roles));
  }

  static getUserRoles(): string[] {
    const roles = localStorage.getItem(this.USER_ROLES_KEY);
    return roles ? JSON.parse(roles) : [];
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

  static isAdmin(): boolean {
    const roles = this.getUserRoles();
    return roles.includes("admin"); // Check if the user has the "admin" role
  }
}
