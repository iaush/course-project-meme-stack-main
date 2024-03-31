const jwt = require('jsonwebtoken');

// Middleware made available to the server to protect
// paths behind this middleware with jwt token
// verification
function verifyToken(req, res, next) {
  let token = req.headers['authorization'] || req.headers['Authorization'];
  if (!token) {
    return res
      .status(403)
      .send({ status: 'error', message: 'No token provided!' });
  }

  jwt.verify(token.split(' ')[1], process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ status: 'error', message: 'Unauthorized!' });
    }
    res.locals.username = decoded.username;
    next();
  });
}

module.exports = {
  verifyToken,
};
