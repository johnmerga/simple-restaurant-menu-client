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
  private setupEventListeners(): void {
    document.addEventListener("submit", async (e) => {
      e.preventDefault();
      const target = e.target as HTMLFormElement;

      if (target.id === "login-form") {
        await this.handleLogin(target);
      } else if (target.id === "signup-form") {
        await this.handleSignup(target);
      } else if (target.id === "create-menu-item-form") {
        await this.handleCreateMenuItem(target);
      } else if (target.id === "edit-menu-item-form") {
        await this.handleEditMenuItem(target);
      }
    });

    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.id === "logout-btn") {
        this.handleLogout();
      } else if (target.classList.contains("edit-btn")) {
        const id = target.getAttribute("data-id")!;
        this.handleEditMenuItemClick(id);
      } else if (target.classList.contains("delete-btn")) {
        const id = target.getAttribute("data-id")!;
        this.handleDeleteMenuItemClick(id);
      } else if (target.id === "create-menu-item-btn") {
        UI.renderCreateMenuItemForm();
      }
    });
  }

  private async handleCreateMenuItem(form: HTMLFormElement): Promise<void> {
    const name = (form.querySelector("#menu-name") as HTMLInputElement).value;
    const description = (
      form.querySelector("#menu-description") as HTMLTextAreaElement
    ).value;
    const price = parseFloat(
      (form.querySelector("#menu-price") as HTMLInputElement).value,
    );
    const category = (form.querySelector("#menu-category") as HTMLInputElement)
      .value;
    const photo = (form.querySelector("#menu-photo") as HTMLInputElement)
      .files?.[0];

    const token = Auth.getToken()!;

    // Create FormData object
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("category", category);
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const menuItem = await api.createMenuItem(token, formData);
      console.log("Menu item created:", menuItem);

      // Re-render the menu to ensure the .menu-list element exists
      const menuItems = await api.getMenu(token);
      UI.renderMenu(menuItems);

      // Add the new menu item to the UI
      UI.addMenuItemToUI(menuItem);
    } catch (error) {
      console.error("Failed to create menu item:", error);
      alert("Failed to create menu item. Please try again.");
    }
  }

  private async handleEditMenuItem(form: HTMLFormElement): Promise<void> {
    const id = (form.querySelector("#menu-id") as HTMLInputElement).value;
    const name = (form.querySelector("#menu-name") as HTMLInputElement).value;
    const description = (
      form.querySelector("#menu-description") as HTMLTextAreaElement
    ).value;
    const price = parseFloat(
      (form.querySelector("#menu-price") as HTMLInputElement).value,
    );
    const category = (form.querySelector("#menu-category") as HTMLInputElement)
      .value;
    const photo = (form.querySelector("#menu-photo") as HTMLInputElement)
      .files?.[0];

    const token = Auth.getToken()!;

    // Create FormData object
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("category", category);
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const menuItem = await api.updateMenuItem(token, id, formData);
      console.log("Menu item updated:", menuItem);

      // Update the menu item in the UI
      UI.updateMenuItemInUI(menuItem);

      // Optionally, re-render the menu to ensure consistency
      const menuItems = await api.getMenu(token);
      UI.renderMenu(menuItems);
    } catch (error) {
      console.error("Failed to update menu item:", error);
      alert("Failed to update menu item. Please try again.");
    }
  }

  private async handleEditMenuItemClick(id: string): Promise<void> {
    const token = Auth.getToken()!;
    try {
      const menuItems = await api.getMenu(token);
      const item = menuItems.find((item: any) => item.id === id);
      if (item) {
        UI.renderEditMenuItemForm(item);
      }
    } catch (error) {
      console.error("Failed to fetch menu item:", error);
      alert("Failed to fetch menu item. Please try again.");
    }
  }

  private async handleDeleteMenuItemClick(id: string): Promise<void> {
    const token = Auth.getToken()!;
    try {
      await api.deleteMenuItem(token, id);
      UI.removeMenuItemFromUI(id);
    } catch (error) {
      console.error("Failed to delete menu item:", error);
      alert("Failed to delete menu item. Please try again.");
    }
  }
}

new App();
