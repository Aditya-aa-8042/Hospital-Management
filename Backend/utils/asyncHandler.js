// Wraps an async controller function so any thrown error/rejected promise
// automatically goes to next(error) -> errorHandler middleware.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;