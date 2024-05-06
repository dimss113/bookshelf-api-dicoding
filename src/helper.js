const responseData = (status, message, data, error) => {
  if (error != null && error instanceof Error) {
    return {
      status: 'fail',
      message: message,
    }
  }

  return {
    status: status,
    message: message,
    data: data,
  }
}

module.exports = { responseData };