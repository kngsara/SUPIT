export const navitems = () => {
  
  const authArea = document.querySelector("#auth-area");
  if (!authArea) return;

  authArea.innerHTML = "";

  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username");

  const nastavniPlan = document.querySelector("#nastavni-plan");
  nastavniPlan.innerHTML = `<i class="fa-solid fa-book"></i>Nastavni plan `;
  
  if (nastavniPlan) {
    nastavniPlan.style.display = token ? "flex" : "none";
  }

  if (token && username) {
    const userText = document.createElement("span");
    userText.textContent = `${username}`;
    userText.className = "link";
    userText.style.cursor = "default";
    
    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Odjava";
    logoutBtn.className = "link";
    logoutBtn.type = "button";
    logoutBtn.style.background = "none";
    logoutBtn.style.border = "none";
    logoutBtn.style.cursor = "pointer";
    logoutBtn.innerHTML = `<i class="fa-solid fa-circle-arrow-left"></i>Odjava `;

    logoutBtn.addEventListener("click", () => {
      sessionStorage.clear();
      location.reload();
    });

    authArea.appendChild(userText);
    authArea.appendChild(logoutBtn);
  } else {
    const loginLink = document.createElement("a");
    loginLink.href = "login.html";
    loginLink.className = "link";
    loginLink.innerHTML = `Prijava <i class="fa-solid fa-circle-arrow-right"></i>`;
    authArea.appendChild(loginLink);
  }
};
