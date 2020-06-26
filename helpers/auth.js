module.exports = (req, res, next) => {
  console.log("ok auth");
  return next();
};
