const ok = (res, message = "Success", data = null, status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

const fail = (res, message = "Error", status = 400, errors = null) => {
  return res.status(status).json({
    success: false,
    message,
    errors
  });
};

module.exports = { ok, fail };
