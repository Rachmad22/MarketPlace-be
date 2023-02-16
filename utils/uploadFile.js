const { v4: uuidv4 } = require("uuid");

// limit = bytes
const limitSize = 1 * 1024 * 1024;
const checkSizeUpload = (file, limit = limitSize) => {
  // check file exist
  if (!file) {
    return false;
  }

  // check size > limit
  if (file.size > limit) {
    return false;
  }

  return true;
};

const checkExtensionFile = (file) => {
  // extension file upload allowed
  const extFile = ["jpeg", "JPEG", "jpg", "JPG", "PNG", "png", "webp", "WEBP"];

  const mimeType = file.mimetype.split("/")[1];
  return extFile.includes(mimeType);
};

module.exports = { checkSizeUpload, checkExtensionFile };
