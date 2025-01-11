import { api } from "./api";
import { Auth } from "./auth";
import { UI } from "./ui";

class App {
  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (Auth.isAuthenticated()) {
      this.loadMenu();
    } else {
      this.loadAuth();
    }
    this.setupEventListeners();
  }

  private async loadMenu(): void {
    try {
      const token = Auth.getToken()!;
      const menuItems = await api.getMenu(token);
      UI.renderMenu(menuItems);
      UI.showMenuContainer();
    } catch (error) {
      console.error("Failed to load menu:", error);
      Auth.removeToken();
      this.loadAuth();
    }
  }

  private loadAuth(): void {
    UI.renderAuthForm();
    UI.showAuthContainer();
  }

  private setupEventListeners(): void {
    document.addEventListener("submit", async (e) => {
      e.preventDefault();
      const target = e.target as HTMLFormElement;

      if (target.id === "login-form") {
        await this.handleLogin(target);
      } else if (target.id === "signup-form") {
        await this.handleSignup(target);
      }
    });

    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.id === "logout-btn") {
        this.handleLogout();
      }
    });
  }

  private async handleLogin(form: HTMLFormElement): Promise<void> {
    const email = (form.querySelector("#login-email") as HTMLInputElement)
      .value;
    const password = (form.querySelector("#login-password") as HTMLInputElement)
      .value;

    try {
      const { access_token } = await api.login(email, password);
      Auth.setToken(access_token);
      this.loadMenu();
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  }

  private async handleSignup(form: HTMLFormElement): Promise<void> {
    const name = (form.querySelector("#signup-name") as HTMLInputElement).value;
    const email = (form.querySelector("#signup-email") as HTMLInputElement)
      .value;
    const password = (
      form.querySelector("#signup-password") as HTMLInputElement
    ).value;

    try {
      const { access_token } = await api.signup(name, email, password);
      Auth.setToken(access_token);
      this.loadMenu();
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again.");
    }
  }

  private handleLogout(): void {
    Auth.removeToken();
    this.loadAuth();
  }
}

new App();
