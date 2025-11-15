export const getHttpStatusCode = (errorType) => {
  const statusMap = {
    'USER_EXISTS': 409,
    'INVALID_ROLE': 400,
    'INVALID_CREDENTIALS': 401,
    'USER_NOT_FOUND': 404
  };
  return statusMap[errorType] || 500;
};