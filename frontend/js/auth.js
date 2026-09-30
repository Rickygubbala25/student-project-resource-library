const login = document.getElementById("loginForm");
const reg = document.getElementById("registerForm");
const msg = document.getElementById("message");

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

if (login) {
  login.onsubmit = async (e) => {
    e.preventDefault();
    msg.textContent = "Signing in...";

    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData(login))
      });

      saveAuth(data);
      location.href = "dashboard.html";
    } catch (error) {
      msg.textContent = error.message;
    }
  };
}

if (reg) {
  reg.onsubmit = async (e) => {
    e.preventDefault();
    msg.textContent = "Creating account...";

    try {
      const data = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(formData(reg))
      });

      saveAuth(data);
      location.href = "dashboard.html";
    } catch (error) {
      msg.textContent = error.message;
    }
  };
}
