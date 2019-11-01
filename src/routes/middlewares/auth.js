const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['access-token'];

  if (!token) {
    res.status(403);
    res.json({
      message: 'Valid token must be provided'
    });
  }

  try {
    const decrypted = jwt.verify(token, process.env.TOKEN_KEY);

    const expiry = decrypted.exp;
    const now = new Date();
    const expired = now.getTime() > expiry * 1000;

    if (expired) {
      res.status(401);
      return res.json({
        message: 'Token expired',
      });
    }

    req.session.user = decrypted;

    next();

  } catch (err) {
    res.status(401);
    return res.json({
      message: 'Token invalid',
    });
  }
}

module.exports = verifyToken;
