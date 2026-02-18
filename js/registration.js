(() => {

  const registerForm = document.querySelector("#register-form");
  const username = document.querySelector("#username");
  const password = document.querySelector("#password");

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!username.value || !password.value) {
      alert("Sva polja moraju biti popunjena.");
      return;
    }

    register({
      username: username.value,
      password: password.value,
    });
  });

    const register = async (loginCreds) => {
    try {
        const response = await fetch("https://www.fulek.com/data/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginCreds),
        });

        const data = await response.json();

        if (data.isSuccess) {
        alert("Racun kreiran, prijavite se");
        location.replace("login.html");
        } else {
        alert(data.errorMessages.join("\n"));
        }
    } catch (err) {
        alert("Greska u registraciji, pokusajte ponovno.");
    }
    };

})();
