(async () => {
  if (!localStorage.getItem("sprl_token")) {
    return (location.href = "login.html");
  }

  const container = document.getElementById("projects");
  const message = document.getElementById("message");

  try {
    const data = await api("/projects/pending");

    const projects = data.projects || [];

    if (!projects.length) {
      container.innerHTML = "<p>No projects found.</p>";
      return;
    }

    container.innerHTML = projects.map(project => `
      <article class="project-card">
        <h3>${project.title}</h3>

        <p>${project.abstract || ""}</p>

        <p>
          <strong>Department:</strong>
          ${project.department || "N/A"}
        </p>

        <p>
          <strong>Status:</strong>
          ${project.status || "approved"}
        </p>

        <button onclick="approveProject(${project.id})">
          Approve
        </button>

        <button onclick="rejectProject(${project.id})">
          Reject
        </button>
      </article>
    `).join("");

  } catch (error) {
    message.textContent = error.message;
  }

  document.getElementById("logout").onclick = logout;
})();

async function approveProject(id) {
  try {
    await api(`/projects/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({
        status: "approved"
      })
    });

    location.reload();
  } catch (error) {
    alert(error.message);
  }
}

async function rejectProject(id) {
  try {
    await api(`/projects/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({
        status: "rejected"
      })
    });

    location.reload();
  } catch (error) {
    alert(error.message);
  }
}
