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
    container.innerHTML = `
            <h2>Restaurant Menu</h2>
            <button id="logout-btn" class="btn">Logout</button>
            <div class="menu-list">
                ${items
                  .map(
                    (item) => `
                    <div class="menu-item">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <p>Price: $${item.price}</p>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `;
  }

  static showAuthContainer(): void {
    document.getElementById("auth-container")!.classList.remove("hidden");
    document.getElementById("menu-container")!.classList.add("hidden");
  }

  static showMenuContainer(): void {
    document.getElementById("auth-container")!.classList.add("hidden");
    document.getElementById("menu-container")!.classList.remove("hidden");
  }
}
