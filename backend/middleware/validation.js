function requiredString(value, field, maxLength = 255) {
  if (typeof value !== "string" || !value.trim()) {
    const error = new Error(`${field} is required.`);
    error.status = 400;
    error.expose = true;
    throw error;
  }

  if (value.trim().length > maxLength) {
    const error = new Error(`${field} is too long.`);
    error.status = 400;
    error.expose = true;
    throw error;
  }

  return value.trim();
}

function validEmail(value) {
  const email = requiredString(value, "Email", 255).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const error = new Error("Please enter a valid email address.");
    error.status = 400;
    error.expose = true;
    throw error;
  }
  return email;
}

module.exports = { requiredString, validEmail };
