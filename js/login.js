(() => {

  const loginForm = document.querySelector("#login-form");
  const username = document.querySelector("#username");
  const password = document.querySelector("#password");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = username.value.trim().toLowerCase();
    const pass = password.value;

    if (!user || !pass) {
      alert("Sva polja moraju biti popunjena.");
      return;
    }

    try {
      const response = await fetch("https://www.fulek.com/data/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user,
          password: pass
        }),
      });

      const data = await response.json();
      console.log("LOGIN RESPONSE:", data);


      if (data.isSuccess) {
        
        sessionStorage.setItem("token", data.data.token);
        sessionStorage.setItem("username", data.data.username);  //trebat ce mi za navbar

        alert("Prijava uspjesna.");
        location.replace("index.html");
      } else {
        alert(data.errorMessages?.join("\n") || "Pogresni podaci za prijavu.");
      }
    } catch {
      alert("Greska pri prijavi, pokusajte kasnije.");
    }
  });
})();
