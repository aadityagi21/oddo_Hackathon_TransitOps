/**
 * Standardized API response helpers.
 */
export class ApiResponse {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, data, message = 'Created successfully') {
    return this.success(res, data, message, 201);
  }

  static error(res, message = 'Something went wrong', statusCode = 500, errors = []) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}

export default ApiResponse;
