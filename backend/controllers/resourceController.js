const resourceModel = require("../models/resourceModel");

async function list(req, res, next) {
  try {
    const resources = await resourceModel.listResources({
      projectId: req.query.projectId
    });

    res.json({
      success: true,
      resources
    });
  } catch (error) {
    next(error);
  }
}

async function details(req, res, next) {
  try {
    const resource = await resourceModel.findResourceById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found."
      });
    }

    res.json({
      success: true,
      resource
    });
  } catch (error) {
    next(error);
  }
}
async function upload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required."
      });
    }

    const {
      title,
      description,
      resourceType,
      projectId
    } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({
        success: false,
        message: "Title and project ID are required."
      });
    }

    const resource = await resourceModel.createResource({
      title,
      description,
      fileUrl: `/uploads/${req.file.filename}`,
      fileKey: req.file.filename,
      resourceType: resourceType || "document",
      projectId,
      uploadedBy: req.auth.sub
    });

    res.status(201).json({
      success: true,
      message: "Resource uploaded successfully.",
      resource
    });
  } catch (error) {
    next(error);
  }
}
module.exports = {
  list,
  details,
  upload
};
