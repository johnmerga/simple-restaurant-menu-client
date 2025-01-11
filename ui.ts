import { Auth } from "./auth";

export class UI {
  static renderAuthForm(): void {
    const container = document.getElementById("auth-container")!;
    container.innerHTML = `
            <div class="auth-forms">
                <div class="form-group">
                    <h2>Login</h2>
                    <form id="login-form">
                        <div class="form-group">
                            <label for="login-email">Email:</label>
                            <input type="email" id="login-email" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">Password:</label>
                            <input type="password" id="login-password" required>
                        </div>
                        <button type="submit" class="btn">Login</button>
                    </form>
                </div>
                
                <div class="form-group">
                    <h2>Signup</h2>
                    <form id="signup-form">
                        <div class="form-group">
                            <label for="signup-name">Name:</label>
                            <input type="text" id="signup-name" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-email">Email:</label>
                            <input type="email" id="signup-email" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-password">Password:</label>
                            <input type="password" id="signup-password" required>
                        </div>
                        <button type="submit" class="btn">Signup</button>
                    </form>
                </div>
            </div>
        `;
  }

  static renderMenu(items: any[]): void {
    const container = document.getElementById("menu-container")!;
    const isAdmin = Auth.isAdmin();

    container.innerHTML = `
    <h2>Restaurant Menu</h2>
    <button id="logout-btn" class="btn">Logout</button>
    ${isAdmin ? '<button id="create-menu-item-btn" class="btn">Create Menu Item</button>' : ""}
    <div class="menu-list">
      ${items
        .map(
          (item) => `
            <div class="menu-item" data-id="${item.id}">
              ${item.photo ? `<img src="http://localhost:3000/uploads/menu-photos/${item.photo}" alt="${item.name}" class="menu-item-photo">` : ""}
              <h3>${item.name}</h3>
              <p>${item.description}</p>
              <p>Price: $${item.price}</p>
              ${
                isAdmin
                  ? `
                <button class="btn edit-btn" data-id="${item.id}">Edit</button>
                <button class="btn delete-btn" data-id="${item.id}">Delete</button>
              `
                  : ""
              }
            </div>
          `,
        )
        .join("")}
    </div>
  `;
    console.log(
      "Menu list element created:",
      document.querySelector(".menu-list"),
    ); // Debugging
  }

  static showAuthContainer(): void {
    document.getElementById("auth-container")!.classList.remove("hidden");
    document.getElementById("menu-container")!.classList.add("hidden");
  }

  static showMenuContainer(): void {
    document.getElementById("auth-container")!.classList.add("hidden");
    document.getElementById("menu-container")!.classList.remove("hidden");
  }

  static renderCreateMenuItemForm(): void {
    const container = document.getElementById("menu-container")!;
    container.innerHTML = `
    <h2>Create Menu Item</h2>
    <form id="create-menu-item-form" enctype="multipart/form-data">
      <div class="form-group">
        <label for="menu-name">Name:</label>
        <input type="text" id="menu-name" required>
      </div>
      <div class="form-group">
        <label for="menu-description">Description:</label>
        <textarea id="menu-description" required></textarea>
      </div>
      <div class="form-group">
        <label for="menu-price">Price:</label>
        <input type="number" id="menu-price" required>
      </div>
      <div class="form-group">
        <label for="menu-category">Category:</label>
        <input type="text" id="menu-category" required>
      </div>
      <div class="form-group">
        <label for="menu-photo">Photo:</label>
        <input type="file" id="menu-photo" accept="image/*">
      </div>
      <button type="submit" class="btn">Create</button>
    </form>
  `;
  }

  static renderEditMenuItemForm(item: any): void {
    const container = document.getElementById("menu-container")!;
    container.innerHTML = `
      <h2>Edit Menu Item</h2>
      <form id="edit-menu-item-form">
        <input type="hidden" id="menu-id" value="${item.id}">
        <div class="form-group">
          <label for="menu-name">Name:</label>
          <input type="text" id="menu-name" value="${item.name}" required>
        </div>
        <div class="form-group">
          <label for="menu-description">Description:</label>
          <textarea id="menu-description" required>${item.description}</textarea>
        </div>
        <div class="form-group">
          <label for="menu-price">Price:</label>
          <input type="number" id="menu-price" value="${item.price}" required>
        </div>
        <div class="form-group">
          <label for="menu-category">Category:</label>
          <input type="text" id="menu-category" value="${item.category}" required>
        </div>
        <div class="form-group">
          <label for="menu-photo">Photo:</label>
          <input type="file" id="menu-photo" accept="image/*">
        </div>
        <button type="submit" class="btn">Update</button>
      </form>
    `;
  }

  static addMenuItemToUI(item: any): void {
    const menuList = document.querySelector(".menu-list");
    console.log("Menu list element:", menuList); // Debugging

    if (!menuList) {
      console.error("Menu list element not found!");
      return; // Exit if the element is not found
    }

    const menuItem = document.createElement("div");
    menuItem.className = "menu-item";
    menuItem.setAttribute("data-id", item.id);
    menuItem.innerHTML = `
    ${item.photo ? `<img src="http://localhost:3000/uploads/menu-photos/${item.photo}" alt="${item.name}" class="menu-item-photo">` : ""}
    <h3>${item.name}</h3>
    <p>${item.description}</p>
    <p>Price: $${item.price}</p>
    ${
      Auth.isAdmin()
        ? `
      <button class="btn edit-btn" data-id="${item.id}">Edit</button>
      <button class="btn delete-btn" data-id="${item.id}">Delete</button>
    `
        : ""
    }
  `;
    menuList.appendChild(menuItem);
  }

  static updateMenuItemInUI(item: any): void {
    const menuItem = document.querySelector(`.menu-item[data-id="${item.id}"]`);
    console.log("Menu item element to update:", menuItem); // Debugging

    if (!menuItem) {
      console.error("Menu item element not found!");
      return;
    }

    menuItem.innerHTML = `
    <h3>${item.name}</h3>
    <p>${item.description}</p>
    <p>Price: $${item.price}</p>
    ${
      Auth.isAdmin()
        ? `
      <button class="btn edit-btn" data-id="${item.id}">Edit</button>
      <button class="btn delete-btn" data-id="${item.id}">Delete</button>
    `
        : ""
    }
  `;
  }

  static removeMenuItemFromUI(id: string): void {
    const menuItem = document.querySelector(`.menu-item[data-id="${id}"]`)!;
    menuItem.remove();
  }
}
