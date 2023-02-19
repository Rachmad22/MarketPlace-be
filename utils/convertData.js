const strToBool = (params) => {
  if (params === "true") {
    return true;
  } else {
    return false;
  }
};

module.exports = { strToBool };
