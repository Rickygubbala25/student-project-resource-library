const form = document.getElementById("resourceForm");
const message = document.getElementById("message");

if (!localStorage.getItem("sprl_token")) {
  location.href = "login.html";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  message.textContent = "Uploading...";

  const formData = new FormData(form);

  try {
    const token = localStorage.getItem("sprl_token");

    const response = await fetch( 

   `${API_URL}/resources/upload`      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Upload failed");
    }

    message.textContent = "Resource uploaded successfully!";

    form.reset();

  } catch (error) {
    message.textContent = error.message;
  }
});
