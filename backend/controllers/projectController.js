const projectModel = require("../models/projectModel");

async function list(req, res, next) {
  try {
    const data = await projectModel.listProjects(req.query);
    res.json({
      success: true,
      projects: data.projects,
      pagination: {
        total: data.total,
        limit: data.limit,
        offset: data.offset,
        hasMore: data.offset + data.projects.length < data.total
      }
    });
  } catch (error) {
    next(error);
  }
}

async function details(req, res, next) {
  try {
    const project = await projectModel.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }
    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
}

async function stats(req, res, next) {
  try {
    const data = await projectModel.getStats();
    res.json({
      success: true,
      projects: data.projects,
      resources: data.resources,
      students: data.students,
      downloads: data.downloads
    });
  } catch (error) {
    next(error);
  }
}
async function create(req, res, next) {
  try {
    const {
      title,
      abstract,
      problemStatement,
      objectives,
      description,
      technologies,
      department,
      difficulty,
      projectType
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Project title is required."
      });
    }

    const project = await projectModel.createProject({
      title,
      abstract,
      problemStatement,
      objectives,
      description,
      technologies,
      department,
      difficulty,
      projectType,
      submittedBy: req.auth.sub
    });

    res.status(201).json({
      success: true,
      message: "Project submitted successfully.",
      project
    });
  } catch (error) {
    next(error);
  }
}
async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be approved or rejected."
      });
    }

    const project = await projectModel.updateProjectStatus(
      req.params.id,
      status
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found."
      });
    }

    res.json({
      success: true,
      message: `Project ${status} successfully.`,
      project
    });
  } catch (error) {
    next(error);
  }
}
async function pending(req, res, next) {
  try {
    const projects = await projectModel.listPendingProjects();

    res.json({
      success: true,
      projects
    });
  } catch (error) {
    next(error);
  }
}
module.exports = { list, details, stats, create, updateStatus, pending };
