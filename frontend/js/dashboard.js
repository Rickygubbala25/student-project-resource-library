(async () => {
  if (!localStorage.getItem("sprl_token")) {
    return (location.href = "login.html");
  }

  try {
    const data = await api("/auth/me");

    const user = data.user;

    document.getElementById("profile").textContent =
      `${user.full_name || "Student"} | ${user.department || "Student"} | ${user.college || "College"}`;

    document.getElementById("logout").onclick = logout;
  } catch (error) {
    logout();
  }
})();
