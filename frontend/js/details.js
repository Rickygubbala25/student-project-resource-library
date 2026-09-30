const params = new URLSearchParams(location.search);
const id = params.get("id");

const details = document.getElementById("details");

async function loadProject() {
  if (!id) {
    details.innerHTML = "<p>Project ID is missing.</p>";
    return;
  }

  try {
    const data = await api(`/projects/${id}`);
    const project = data.project;

    const resourcesData = await api(`/resources?projectId=${id}`);
    const resources = resourcesData.resources || resourcesData.data || [];

    details.innerHTML = `
      <h1>${project.title || ""}</h1>

      <p><strong>Department:</strong> ${project.department || "Not specified"}</p>
      <p><strong>Difficulty:</strong> ${project.difficulty || "Not specified"}</p>
      <p><strong>Project Type:</strong> ${project.project_type || "Not specified"}</p>

      <h2>Abstract</h2>
      <p>${project.abstract || "No abstract available."}</p>

      <h2>Problem Statement</h2>
      <p>${project.problem_statement || "Not provided."}</p>

      <h2>Objectives</h2>
      <p>${project.objectives || "Not provided."}</p>

      <h2>Description</h2>
      <p>${project.description || "No description available."}</p>

      <h2>Technologies</h2>
      <p>${project.technologies || "Not specified."}</p>

      <h2>Resources</h2>

      ${
        resources.length
          ? resources.map(resource => `
              <div class="resource-card">
                <h3>${resource.title}</h3>
                <p>${resource.description || ""}</p>
                <a
                  class="btn primary"
                  href="http://localhost:5000${resource.file_url}"
                  target="_blank"
                  rel="noopener"
                >
                  Download
                </a>
              </div>
            `).join("")
          : "<p>No resources available for this project.</p>"
      }
    `;

  } catch (error) {
    details.innerHTML = `<p>${error.message}</p>`;
  }
}

loadProject();
