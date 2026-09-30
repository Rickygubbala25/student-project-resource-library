const form = document.getElementById("projectForm");
const message = document.getElementById("message");

if (!localStorage.getItem("sprl_token")) {
  location.href = "login.html";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.textContent = "Submitting project...";

  const data = Object.fromEntries(
    new FormData(form).entries()
  );

  try {
    await api("/projects", {
      method: "POST",
      body: JSON.stringify(data)
    });

    message.textContent =
      "Project submitted successfully. Waiting for admin approval.";

    form.reset();
  } catch (error) {
    message.textContent = error.message;
  }
});
