

module.exports = (req, res, next) => {
  const allowedParams = ['keyword', 'tag', 'sort', 'page', 'limit'];
  const invalidParams = Object.keys(req.query).filter(
    (param) => !allowedParams.includes(param)
  );
  if (invalidParams.length > 0) {
    return res.status(400).json({ message: `Invalid query parameters: ${invalidParams.join(', ')}` });
  }
  next();
};
