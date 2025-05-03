import sanitizeHtml from "sanitize-html";

/**
 * Middleware for Input Sanitization
 * sanitize all incoming requests before it hit our controller
 */

const sanitizeInputMiddleware = (req, res, next) => {
  // Helper -> sanitize object
  const sanitizeObjectHelper = (obj) => {
    if (obj) {
      for (const key in obj) {
        if (typeof obj[key] === "string") {
          obj[key] = sanitizeHtml(obj[key], {
            allowedTags: [], // NO HTML tags allowed
            allowedAttributes: [], // No attributes allowed
          });
        }
      }
    }
  };

  // Sanitize req.body, req.params, req.query
  sanitizeObjectHelper(req.body);
  sanitizeObjectHelper(req.params);
  sanitizeObjectHelper(req.query);

  next();
};

export default sanitizeInputMiddleware;
