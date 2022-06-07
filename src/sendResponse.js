const sendResponse = (h, status, message, statusCode) => {
  const response = h.response({
    status: status,
    message: message,
  });
  response.code(statusCode);
  return response;
};

module.exports = sendResponse;
